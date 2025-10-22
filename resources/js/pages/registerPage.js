import { register, login } from '../api/auth.js';
import { setAuthToken, getAuthMode } from '../api/http.js';
import { getCurrentUser } from '../api/authUser.js';
import { openGoogleOAuth } from '../api/authProviders.js';
import { countJobOffers } from '../api/jobOffers.js';
import { countCompanies } from '../api/companies.js';
import { resolveRole } from '../auth/permissions.js';

function qs(sel, root=document){ return root.querySelector(sel); }
function on(el, ev, fn){ el && el.addEventListener(ev, fn); }

function findForm(root){
  return root.querySelector('form') || root;
}

function setError(container, msg){
  if (!container) return;
  container.textContent = msg || '';
}
function setFieldError(input, message){
  if (!input) return;
  let hint = input.closest('label, div')?.querySelector('.field-error');
  if (!hint) {
    hint = document.createElement('span');
    hint.className = 'field-error text-xs font-medium text-red-600';
    input.closest('label, div')?.appendChild(hint);
  }
  hint.textContent = message || '';
}
function getRedirectTarget(){
  const p = new URLSearchParams(window.location.search);
  const r = p.get('redirect');
  return r && r.startsWith('/') ? r : '/html/pages/home.html';
}
function pickLaravelError(err){
  const data = err?.data;
  if (data && data.errors && typeof data.errors === 'object'){
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first.length) return first[0];
  }
  return data?.message || err?.message || 'Error inesperado';
}

export async function mountRegister(root){
  if (!root) return;
  const form = findForm(root);
  const name = qs('input[name="name"]', form);
  const email = qs('input[name="email"]', form);
  const password = qs('input[name="password"]', form);
  const passwordConfirmation = qs('input[name="password_confirmation"]', form);
  const type = () => qs('input[name="type"]:checked', form);
  const errorBox = root.querySelector('[data-auth-error]') || null;
  const jobsEl = root.querySelector('[data-stat-jobs]');
  const companiesEl = root.querySelector('[data-stat-companies]');

  // Toggle password eye if present (non-blocking)
  const toggleBtn = qs('#togglePassword');
  const eyeIcon = qs('#eyeIcon');
  if (toggleBtn && password) {
    toggleBtn.addEventListener('click', () => {
      const isPwd = password.getAttribute('type') === 'password';
      password.setAttribute('type', isPwd ? 'text' : 'password');
      eyeIcon?.classList.toggle('fa-eye');
      eyeIcon?.classList.toggle('fa-eye-slash');
    });
  }

  if (getAuthMode() === 'bearer') {
    try { const saved = localStorage.getItem('auth_token'); if (saved) setAuthToken(saved); } catch {}
  }

  // Reescribir enlaces de Google: resolver endpoint y conservar type + redirect
  try {
    const googleLinks = root.querySelectorAll('a[href^="/auth/google"]');
    const pageQS = new URLSearchParams(window.location.search);
    const currentRedirect = pageQS.get('redirect');
    for (const link of googleLinks) {
      link.addEventListener('click', (ev) => {
        ev.preventDefault();
        const u = new URL(link.getAttribute('href'), window.location.origin);
        const params = new URLSearchParams(u.search);
        const target = currentRedirect && currentRedirect.startsWith('/')
          ? currentRedirect
          : '/html/pages/home.html';
        openGoogleOAuth({ redirect: target, params: Object.fromEntries(params.entries()) });
      });
    }
  } catch {}

  // Si retorna de OAuth con sesión activa por cookie, continuar flujo
  try {
    const me = await getCurrentUser();
    if (me && (me.id || me.email)) {
      // si el registro vino con intención (type), respeta flujo hacia formulario
      const rawType = (pageQS.get('type') || '').toLowerCase();
      const normalized = rawType.includes('company') || rawType.includes('empresa') ? 'company'
        : (rawType.includes('unemployed') || rawType.includes('cesante') ? 'unemployed' : '');
      if (normalized === 'company') { window.location.href = '/html/forms/company-form.html'; return; }
      if (normalized === 'unemployed') { window.location.href = '/html/forms/unemployed-form.html'; return; }
      window.location.href = '/html/pages/home.html';
      return;
    }
  } catch {}

  // Pintar estadísticas no bloqueantes
  (async () => {
    try {
      const [offersTotal, companiesTotal] = await Promise.all([
        countJobOffers({ status: 'active' }),
        countCompanies(),
      ]);
      if (jobsEl) jobsEl.textContent = String(offersTotal);
      if (companiesEl) companiesEl.textContent = String(companiesTotal);
    } catch (_) {
      if (jobsEl) jobsEl.textContent = '—';
      if (companiesEl) companiesEl.textContent = '—';
    }
  })();

  on(form, 'submit', async (e) => {
    e.preventDefault();
    setError(errorBox, '');
    setFieldError(name, '');
    setFieldError(email, '');
    setFieldError(password, '');
    setFieldError(passwordConfirmation, '');
    const payload = {
      name: name?.value?.trim() || '',
      email: email?.value?.trim() || '',
      password: password?.value || '',
      password_confirmation: passwordConfirmation?.value || '',
      ...(type()?.value ? { type: type().value } : {}),
    };
    try {
      const registerResult = await register(payload);
      let authResult = registerResult;
      // Intentar login inmediato para obtener token (algunos backends no devuelven token en register)
      try {
        const loginResult = await login({ email: payload.email, password: payload.password });
        if (loginResult) authResult = loginResult;
      } catch (autoLoginErr) {
        console.warn('auto-login after register failed:', autoLoginErr);
      }

      const sessionUser = authResult?.user || registerResult?.user || null;
      const resolvedRole = sessionUser ? resolveRole(sessionUser) : null;

      // Decidir a dónde ir según el rol seleccionado
      const rawType = (type()?.value || '').toLowerCase();
      const normalizedType = rawType.includes('empresa') || rawType.includes('company') ? 'company'
        : (rawType.includes('cesante') || rawType.includes('unemployed')) ? 'unemployed'
        : '';
      const roleToPersist = resolvedRole && resolvedRole !== 'guest' ? resolvedRole : normalizedType;

      try {
        if (roleToPersist) {
          localStorage.setItem('pending_role', roleToPersist);
          localStorage.setItem('display_role', roleToPersist);
        }
        let displayName = sessionUser?.name || '';
        if (roleToPersist === 'company') {
          displayName = sessionUser?.company?.company_name || sessionUser?.company?.name || sessionUser?.company_name || displayName;
        }
        if (!displayName && name?.value) displayName = name.value.trim();
        if (displayName) {
          localStorage.setItem('pending_name', displayName);
          localStorage.setItem('display_name', displayName);
        }
      } catch {}

      if (roleToPersist === 'unemployed') {
        window.location.href = '/html/forms/unemployed-form.html';
      } else if (roleToPersist === 'company') {
        window.location.href = '/html/forms/company-form.html';
      } else {
        window.location.href = getRedirectTarget();
      }
    } catch (err) {
      const data = err?.data;
      if (data?.errors) {
        if (data.errors.name?.[0]) setFieldError(name, data.errors.name[0]);
        if (data.errors.email?.[0]) setFieldError(email, data.errors.email[0]);
        if (data.errors.password?.[0]) setFieldError(password, data.errors.password[0]);
        if (data.errors.password_confirmation?.[0]) setFieldError(passwordConfirmation, data.errors.password_confirmation[0]);
        if (!data.message) setError(errorBox, 'Corrige los campos marcados.');
      } else {
        setError(errorBox, pickLaravelError(err));
      }
      console.error('register error', err);
    }
  });
}

export function autoMount(){
  const el = document.querySelector('[data-page="auth-register"]');
  if (el) mountRegister(el);
}
