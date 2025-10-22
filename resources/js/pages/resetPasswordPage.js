import { webFetch } from '../api/http.js';

function qs(sel, root=document){ return root.querySelector(sel); }
function on(el, ev, fn){ el && el.addEventListener(ev, fn); }
function setText(el, msg){ if (el) el.textContent = msg || ''; }
function pickLaravelError(err){
  const data = err?.data;
  if (data && data.errors && typeof data.errors === 'object'){
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first.length) return first[0];
  }
  return data?.message || err?.message || 'Error inesperado';
}

export function mountResetPassword(root){
  if (!root) return;
  const form = root.querySelector('form');
  // El token puede venir del input hidden o de la URL (?token=)
  const tokenInput = qs('input[name="token"]', form);
  const emailInput = qs('input[name="email"]', form);
  const pass = qs('input[name="password"]', form);
  const pass2 = qs('input[name="password_confirmation"]', form);
  const errBox = root.querySelector('[data-error]');
  const okBox = root.querySelector('[data-ok]');

  // Rellenar token/email desde URL si están presentes
  const params = new URLSearchParams(window.location.search);
  if (!tokenInput?.value && params.get('token')) tokenInput.value = params.get('token');
  if (!emailInput?.value && params.get('email')) emailInput.value = params.get('email');

  on(form, 'submit', async (e) => {
    e.preventDefault();
    setText(errBox, '');
    setText(okBox, '');
    const payload = {
      token: tokenInput?.value || '',
      email: emailInput?.value?.trim() || '',
      password: pass?.value || '',
      password_confirmation: pass2?.value || '',
    };
    try {
      await webFetch('/reset-password', { method: 'POST', body: payload });
      setText(okBox, 'Contraseña actualizada. Redirigiendo al inicio de sesión...');
      setTimeout(()=>{ window.location.href = '/html/auth/login.html'; }, 1200);
    } catch (err) {
      setText(errBox, pickLaravelError(err));
      console.error('reset-password error', err);
    }
  });
}

export function autoMount(){ const el=document.querySelector('[data-page="auth-reset-password"]'); if(el) mountResetPassword(el); }
