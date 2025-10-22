import { getPortfolio, updatePortfolio } from '../api/portfolios.js';
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

export async function mountPortfolioEdit(root){
  if (!root) return;
  const { allowed } = await requireRole('unemployed');
  if (!allowed) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const errorBox = root.querySelector('[data-error]');

  const form = root.querySelector('form') || root;
  const title = qs('#title', form);
  const description = qs('#description', form);
  const fileUrl = qs('#file_url', form);

  if (!id) {
    if (errorBox) { errorBox.classList.remove('hidden'); errorBox.textContent = 'Falta el parámetro id.'; }
    return;
  }

  // Precargar datos
  try {
    const data = await getPortfolio(id);
    const p = data?.data && !Array.isArray(data.data) ? data.data : data; // soportar envoltorio
    if (title) title.value = p?.title || '';
    if (description) description.value = p?.description || '';
    const urlValue = p?.file_url || p?.url_proyect || p?.url_project || '';
    if (fileUrl) fileUrl.value = urlValue;
  } catch (e) {
    if (errorBox) { errorBox.classList.remove('hidden'); errorBox.textContent = e?.data?.message || e.message || 'No se pudo cargar el portafolio.'; }
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    [title, description, fileUrl].forEach(i => setFieldError(i, ''));
    if (errorBox) { errorBox.textContent = ''; errorBox.classList.add('hidden'); }

    const urlVal = fileUrl?.value?.trim() || '';
    const payload = {
      title: title?.value?.trim() || '',
      description: description?.value?.trim() || '',
      // enviar varias claves por compatibilidad backend
      file_url: urlVal,
      url_proyect: urlVal,
      url_project: urlVal,
    };
    try {
      await updatePortfolio(id, payload);
      window.location.href = '/html/portfolio/list.html';
    } catch (err) {
      const fieldErrors = parseLaravelErrors(err);
      if (fieldErrors.title) setFieldError(title, fieldErrors.title);
      if (fieldErrors.description) setFieldError(description, fieldErrors.description);
      if (fieldErrors.file_url || fieldErrors.url_proyect || fieldErrors.url_project) setFieldError(fileUrl, fieldErrors.file_url || fieldErrors.url_proyect || fieldErrors.url_project);
      if (errorBox && !Object.keys(fieldErrors).length) { errorBox.classList.remove('hidden'); errorBox.textContent = err?.data?.message || err.message || 'Error al actualizar el portafolio'; }
      console.error('update portfolio error', err);
    }
  });
}

export function autoMount(){
  const el = document.querySelector('[data-page="portfolio-edit"]');
  if (el) mountPortfolioEdit(el);
}
