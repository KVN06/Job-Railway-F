import { getJobOffer, updateJobOffer } from '../api/jobOffers.js';
import { listCategories } from '../api/categories.js';
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

function getQueryId(){
  try { return new URL(window.location.href).searchParams.get('id'); } catch { return null; }
}

async function hydrateCategories(container, selectedIds){
  if (!container) return [];
  const set = new Set((selectedIds || []).map(String));
  try {
    const list = await listCategories({ per_page: 100, page: 1 });
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3';
    container.appendChild(grid);
    (list || []).forEach(cat => {
      const id = cat.id ?? cat.value ?? cat.uuid;
      const name = cat.name ?? cat.label ?? String(id);
      const label = document.createElement('label');
      label.className = 'flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 cursor-pointer transition-colors border border-gray-200 hover:border-blue-300';
      const input = document.createElement('input');
      input.type = 'checkbox'; input.name = 'categories[]'; input.value = id;
      input.className = 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2';
      if (set.has(String(id))) input.checked = true;
      const span = document.createElement('span');
      span.className = 'ml-3 text-sm text-gray-700 font-medium';
      span.innerHTML = `<i class=\"fas fa-tag mr-1 text-blue-500 text-xs\"></i>${name}`;
      label.appendChild(input); label.appendChild(span);
      grid.appendChild(label);
    });
    return list;
  } catch (e) {
    container.innerHTML = '<p class="text-sm text-red-600">No se pudieron cargar las categorías.</p>';
    return [];
  }
}

export async function mountJobOfferEdit(root){
  if (!root) return;
  const { allowed } = await requireRole('company');
  if (!allowed) return;
  const form = root.querySelector('form') || root;
  const title = qs('#title', form);
  const description = qs('#description', form);
  const salary = qs('#salary', form);
  const location = qs('#location', form);
  const geolocation = qs('#geolocation', form) || qs('[name="geolocation"]', form);
  const categoriesWrap = root.querySelector('[data-categories]');
  const cancelLink = qs('#cancel-link', root);
  const errorBox = root.querySelector('[data-error-global]');

  const offerId = getQueryId();
  if (!offerId) {
    root.innerHTML = '<p class="text-sm text-red-600">Falta el parámetro id (?id=123)</p>';
    return;
  }

  // Cargar oferta y precargar los campos
  let offer;
  try {
    const data = await getJobOffer(offerId);
    offer = data?.data ?? data;
  } catch (e) {
    root.innerHTML = `<p class="text-sm text-red-600">No se pudo cargar la oferta: ${e?.data?.message || e.message}</p>`;
    return;
  }

  // Precargar campos
  title.value = offer?.title || '';
  description.value = offer?.description || '';
  if (salary) salary.value = offer?.salary ?? '';
  if (location) location.value = offer?.location ?? '';
  if (geolocation) geolocation.value = offer?.geolocation ?? '';
  if (cancelLink && offer?.id) cancelLink.href = `/html/job-offers/show.html?id=${encodeURIComponent(offer.id)}`;

  const selectedCatIds = Array.isArray(offer?.categories) ? offer.categories.map(c => c?.id ?? c) : [];
  await hydrateCategories(categoriesWrap, selectedCatIds);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    [title, description, salary, location].forEach(i => setFieldError(i, ''));
    if (errorBox) errorBox.textContent = '';

    const selectedCats = Array.from(form.querySelectorAll('input[name="categories[]"]:checked')).map(i => i.value);
    const payload = {
      title: title?.value?.trim() || '',
      description: description?.value?.trim() || '',
      salary: salary?.value ? Number(salary.value) : undefined,
      location: location?.value?.trim() || undefined,
      geolocation: geolocation?.value?.trim() || undefined,
      categories: selectedCats,
    };

    try {
      await updateJobOffer(offerId, payload);
      window.location.href = `/html/job-offers/show.html?id=${encodeURIComponent(offerId)}`;
    } catch (err) {
      const fieldErrors = parseLaravelErrors(err);
      if (fieldErrors.title) setFieldError(title, fieldErrors.title);
      if (fieldErrors.description) setFieldError(description, fieldErrors.description);
      if (fieldErrors.salary) setFieldError(salary, fieldErrors.salary);
      if (fieldErrors.location) setFieldError(location, fieldErrors.location);
      if (fieldErrors.geolocation) setFieldError(geolocation, fieldErrors.geolocation);
      if (fieldErrors.categories) {
        const msg = typeof fieldErrors.categories === 'string' ? fieldErrors.categories : 'Selecciona al menos una categoría';
        const hint = document.createElement('p');
        hint.className = 'mt-2 text-sm text-red-600';
        hint.textContent = msg;
        categoriesWrap?.appendChild(hint);
      }
      if (errorBox && !Object.keys(fieldErrors).length) errorBox.textContent = err?.data?.message || err.message || 'No se pudo actualizar la oferta';
      console.error('update job offer error', err);
    }
  });
}

export function autoMount(){
  const el = document.querySelector('[data-page="job-offers-edit"]');
  if (el) mountJobOfferEdit(el);
}
