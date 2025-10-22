import { webFetch, getAuthMode } from '../api/http.js';

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

export function mountForgotPassword(root){
  if (!root) return;
  const form = root.querySelector('form');
  const email = qs('input[name="email"]', form);
  const okBox = root.querySelector('[data-ok]');
  const errBox = root.querySelector('[data-error]');

  on(form, 'submit', async (e) => {
    e.preventDefault();
    setText(okBox, '');
    setText(errBox, '');
    try {
      await webFetch('/forgot-password', { method: 'POST', body: { email: email?.value?.trim() || '' } });
      setText(okBox, 'Si el correo existe, enviamos el enlace de recuperación.');
    } catch (err) {
      setText(errBox, pickLaravelError(err));
      console.error('forgot-password error', err);
    }
  });
}

export function autoMount(){ const el=document.querySelector('[data-page="auth-forgot-password"]'); if(el) mountForgotPassword(el); }
