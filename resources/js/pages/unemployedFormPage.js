import { createUnemployedProfile } from '../api/unemployed.js';
import { pickLaravelError } from '../utils/pickLaravelError.js';

function qs(s, r=document){ return r.querySelector(s); }
function setFieldError(input, message){
  if (!input) return;
  let hint = input.closest('label, div')?.querySelector('.field-error');
  if (!hint) { hint = document.createElement('span'); hint.className='field-error text-xs font-medium text-red-600'; input.closest('label, div')?.appendChild(hint); }
  hint.textContent = message || '';
}

export async function mountUnemployedForm(root){
  if (!root) root = document;
  const form = root.querySelector('form[action*="unemployed"]') || root.querySelector('form');
  if (!form) return;
  const profession = qs('input[name="profession"]', form) || qs('#profession', form);
  const experience = qs('textarea[name="experience"]', form) || qs('#experience', form);
  const location = qs('input[name="location"]', form) || qs('#location', form);
  const errorBox = root.querySelector('[data-error]');
  const errorText = root.querySelector('[data-error-text]');
  if (errorBox) errorBox.classList.add('hidden');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFieldError(profession, '');
    setFieldError(experience, '');
    setFieldError(location, '');
  if (errorBox) { errorBox.classList.add('hidden'); if (errorText) errorText.textContent = ''; }

    const payload = {
      profession: profession?.value?.trim() || '',
      experience: experience?.value?.trim() || '',
      location: location?.value?.trim() || '',
    };
    try {
      await createUnemployedProfile(payload);
      // Redirige a home o a tu perfil
      try {
        localStorage.removeItem('pending_role');
        localStorage.removeItem('pending_name');
        localStorage.setItem('profile_completed', '1');
      } catch {}
      window.location.href = '/html/pages/home.html';
    } catch (err) {
      const data = err?.data;
      if (err?.status === 401 || err?.code === 'AUTH_REQUIRED'){
  if (errorBox) { errorBox.classList.remove('hidden'); if (errorText) errorText.textContent = 'Debes iniciar sesión para completar tu perfil. Redirigiendo al login...'; }
        setTimeout(()=>{
          const redirect = encodeURIComponent('/html/forms/unemployed-form.html');
          window.location.href = `/html/auth/login.html?redirect=${redirect}`;
        }, 800);
        return;
      }
      if (data?.errors) {
        if (data.errors.profession?.[0]) setFieldError(profession, data.errors.profession[0]);
        if (data.errors.experience?.[0]) setFieldError(experience, data.errors.experience[0]);
        if (data.errors.location?.[0]) setFieldError(location, data.errors.location[0]);
      }
  if (errorBox) { errorBox.classList.remove('hidden'); if (errorText) errorText.textContent = pickLaravelError(err) || 'No se pudo enviar el formulario. Intenta de nuevo.'; }
      console.error('unemployed form error', err);
    }
  });
}

export function autoMount(){
  const el = document.querySelector('[data-page="unemployed-form"]') || document.querySelector('form[action*="unemployed"], form[action*="agg-unemployed"]');
  if (el) mountUnemployedForm(el.closest('main') || document);
}
