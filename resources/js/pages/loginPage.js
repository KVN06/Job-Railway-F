import { login } from '../api/auth.js';
import { getCurrentUser } from '../api/authUser.js';
import { resolveRole } from '../auth/permissions.js';
import { configureAuth, setAuthToken, getAuthMode } from '../api/http.js';
import { openGoogleOAuth } from '../api/authProviders.js';
import { countJobOffers } from '../api/jobOffers.js';
import { countCompanies } from '../api/companies.js';

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

export async function mountLogin(root){
  if (!root) return;
  const form = findForm(root);
  const email = qs('input[name="email"]', form);
  const password = qs('input[name="password"]', form);
  const errorBox = root.querySelector('[data-auth-error]') || null;
  const jobsEl = root.querySelector('[data-stat-jobs]');
  const companiesEl = root.querySelector('[data-stat-companies]');

  // Reescribir enlace de Google: resolvemos endpoint de backend y pasamos redirect
  try {
    const link = root.querySelector('a[href^="/auth/google"]');
    if (link) {
      link.addEventListener('click', (ev) => {
        ev.preventDefault();
        const u = new URL(link.getAttribute('href'), window.location.origin);
        const params = new URLSearchParams(u.search);
        const currentRedirect = new URLSearchParams(window.location.search).get('redirect');
        const target = currentRedirect && currentRedirect.startsWith('/') ? currentRedirect : '/html/pages/home.html';
        openGoogleOAuth({ redirect: target, params: Object.fromEntries(params.entries()) });
      });
    }
  } catch {}

  // Toggle password
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

  // Si hay token guardado en modo bearer, lo restauramos
  if (getAuthMode() === 'bearer') {
    try { const saved = localStorage.getItem('auth_token'); if (saved) setAuthToken(saved); } catch {}
  }

  // Si venimos de OAuth con sesión cookie lista, detecta y pasa directo al home
  try {
    const me = await getCurrentUser();
    if (me && (me.id || me.email)) {
      window.location.href = getRedirectTarget();
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
    setFieldError(email, '');
    setFieldError(password, '');
    const payload = { email: email?.value?.trim() || '', password: password?.value || '' };
    try {
      const authResult = await login(payload);
      let user = authResult?.user || null;
      // Obtener usuario y decidir destino por rol
      try {
        if (!user) {
          user = await getCurrentUser();
        }
      } catch {}

      if (!user && authResult?.response && typeof authResult.response === 'object') {
        // Intento de último recurso: extraer usuario del payload original
        const fallbackUser = authResult.response?.data?.user
          || authResult.response?.user
          || null;
        if (fallbackUser && typeof fallbackUser === 'object') user = fallbackUser;
      }

      if (user) {
        const role = resolveRole(user);
        // Persistir datos para la UI (header/home) tras login
        try {
          const companyName = user?.company?.company_name || user?.company?.name || user?.company_name || '';
          const displayName = role === 'company' ? (companyName || user?.name || '') : (user?.name || '');
          if (role && role !== 'guest') localStorage.setItem('display_role', role);
          if (displayName) localStorage.setItem('display_name', displayName);
        } catch {}
        if (role === 'admin') {
          window.location.href = '/html/admin/dashboard.html';
          return;
        }
      }
      // Redirección al home logueado (o a ?redirect=... si viene)
      window.location.href = getRedirectTarget();
    } catch (err) {
      const data = err?.data;
      if (data?.errors) {
        if (data.errors.email?.[0]) setFieldError(email, data.errors.email[0]);
        if (data.errors.password?.[0]) setFieldError(password, data.errors.password[0]);
        if (!data.message) setError(errorBox, 'Corrige los campos marcados.');
      } else {
        setError(errorBox, pickLaravelError(err));
      }
      console.error('login error', err);
    }
  });
}

export function autoMount(){
  const el = document.querySelector('[data-page="auth-login"]');
  if (el) mountLogin(el);
}
