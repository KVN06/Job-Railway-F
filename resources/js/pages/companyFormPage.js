import { createCompany } from '../api/companies.js';

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

export function mountCompanyForm(root){
  if (!root) return;
  const form = root.querySelector('form');
  const okBox = root.querySelector('[data-ok]');
  const errBox = root.querySelector('[data-error]');
  const submitBtn = form?.querySelector('button[type="submit"]');
  function show(el, msg){ if(!el) return; el.classList.remove('hidden'); el.textContent = msg || el.textContent; }
  function hide(el){ if(!el) return; el.classList.add('hidden'); el.textContent=''; }
  function setFieldError(input, message){ if(!input) return; let hint = input.closest('label, div')?.querySelector('.field-error'); if(!hint){ hint = document.createElement('span'); hint.className='field-error text-xs font-medium text-red-600'; input.closest('label, div')?.appendChild(hint);} hint.textContent = message || ''; }

  on(form, 'submit', async (e) => {
    e.preventDefault();
    hide(okBox);
    hide(errBox);
    if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('opacity-60', 'cursor-not-allowed'); }
    const payload = {
      name: qs('#name', form)?.value?.trim() || '',
      email: qs('#email', form)?.value?.trim() || '',
      nit: qs('#nit', form)?.value?.trim() || '',
      website: qs('#website', form)?.value?.trim() || '',
      description: qs('#description', form)?.value?.trim() || '',
    };
    try {
      await createCompany(payload);
      show(okBox, 'Empresa registrada correctamente.');
      try {
        localStorage.removeItem('pending_role');
        const pendingName = localStorage.getItem('pending_name');
        if (pendingName) localStorage.setItem('display_name', pendingName);
        localStorage.removeItem('pending_name');
        localStorage.setItem('display_role', 'company');
        if (payload?.name) localStorage.setItem('display_name', payload.name);
        localStorage.setItem('profile_completed', '1');
      } catch {}
      // Redirección básica a home logueado
      setTimeout(()=>{ window.location.href = '/html/pages/home.html'; }, 1000);
    } catch (err) {
      const data = err?.data;
      if (err?.status === 401 || err?.code === 'AUTH_REQUIRED'){
        show(errBox, 'Debes iniciar sesión para registrar una empresa. Redirigiendo al login...');
        setTimeout(()=>{
          const redirect = encodeURIComponent('/html/forms/company-form.html');
          window.location.href = `/html/auth/login.html?redirect=${redirect}`;
        }, 800);
        return;
      }
      if (data?.errors){
        if (data.errors.name?.[0]) setFieldError(qs('#name', form), data.errors.name[0]);
        if (data.errors.email?.[0]) setFieldError(qs('#email', form), data.errors.email[0]);
        if (data.errors.nit?.[0]) setFieldError(qs('#nit', form), data.errors.nit[0]);
        if (data.errors.website?.[0]) setFieldError(qs('#website', form), data.errors.website[0]);
        if (data.errors.description?.[0]) setFieldError(qs('#description', form), data.errors.description[0]);
      }
      const msg = err?.status === 500 && !err?.data?.message ? 'Error del servidor (500). Inténtalo más tarde o verifica los datos.' : pickLaravelError(err);
      show(errBox, msg);
      console.error('create company error', err);
    }
    finally { if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-60', 'cursor-not-allowed'); } }
  });
}

export function autoMount(){ const el=document.querySelector('[data-page="company-form"]'); if(el) mountCompanyForm(el); }
