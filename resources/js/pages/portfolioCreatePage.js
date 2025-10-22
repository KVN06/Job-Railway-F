import { createPortfolio } from '../api/portfolios.js';
import { requireRole } from '../auth/permissions.js';

function qs(sel, root=document){ return root.querySelector(sel); }

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

function parseLaravelErrors(err){
  const out = {};
  const data = err?.data;
  if (data?.errors && typeof data.errors === 'object') {
    for (const [k,v] of Object.entries(data.errors)) {
      if (Array.isArray(v) && v.length) out[k] = v[0];
    }
  }
  return out;
}

export async function mountPortfolioCreate(root){
  if (!root) return;
  const { allowed } = await requireRole('unemployed');
  if (!allowed) return;
  const form = root.querySelector('form') || root;
  const title = qs('#title', form);
  const description = qs('#description', form);
  const urlProyect = qs('#url_proyect', form);
  const urlPdf = qs('#url_pdf', form);
  const errorBox = root.querySelector('[data-error]') || null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // limpiar errores
    [title, description, urlProyect, urlPdf].forEach(i => setFieldError(i, ''));
    if (errorBox) errorBox.textContent = '';

    const payload = {
      title: title?.value?.trim() || '',
      description: description?.value?.trim() || '',
      url_proyect: urlProyect?.value?.trim() || '',
      url_pdf: urlPdf?.files?.[0],
    };
    try {
      await createPortfolio(payload);
      // Éxito: redirigir a lista de portafolios
      window.location.href = '/html/portfolio/list.html';
    } catch (err) {
      const fieldErrors = parseLaravelErrors(err);
      if (fieldErrors.title) setFieldError(title, fieldErrors.title);
      if (fieldErrors.description) setFieldError(description, fieldErrors.description);
      if (fieldErrors.url_proyect || fieldErrors.url_project) setFieldError(urlProyect, fieldErrors.url_proyect || fieldErrors.url_project);
      if (fieldErrors.url_pdf) setFieldError(urlPdf, fieldErrors.url_pdf);
      if (errorBox && !Object.keys(fieldErrors).length) errorBox.textContent = err?.data?.message || err.message || 'Error al crear el portafolio';
      console.error('create portfolio error', err);
    }
  });
}

export function autoMount(){
  const el = document.querySelector('[data-page="portfolio-create"]');
  if (el) mountPortfolioCreate(el);
}
