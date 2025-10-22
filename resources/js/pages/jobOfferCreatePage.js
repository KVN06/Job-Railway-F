import { createJobOffer } from '../api/jobOffers.js';
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

async function hydrateCategories(container){
  if (!container) return [];
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
      input.type = 'checkbox';
      input.name = 'categories[]';
      input.value = id;
      input.className = 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2';
      const span = document.createElement('span');
      span.className = 'ml-3 text-sm text-gray-700 font-medium';
      span.innerHTML = `<i class="fas fa-tag mr-1 text-blue-500 text-xs"></i>${name}`;
      label.appendChild(input); label.appendChild(span);
      grid.appendChild(label);
    });
    return list;
  } catch (e) {
    container.innerHTML = '<p class="text-sm text-red-600">No se pudieron cargar las categorías.</p>';
    return [];
  }
}

function coerceId(value){
  if (value === null || value === undefined) return undefined;
  const str = String(value).trim();
  if (!str) return undefined;
  const num = Number(str);
  return Number.isFinite(num) ? num : str;
}

function extractCompanyContext(user){
  if (!user || typeof user !== 'object') return {};
  const company = user.company || user.company_profile || user.companyProfile || user.profile?.company || user.meta?.company || null;
  const companyIdCandidates = [
    company?.id,
    company?.company_id,
    company?.uuid,
    user.company_id,
    user.companyId,
    user.companyID,
    user.company_profile_id,
    user.profile?.company_id,
    user.meta?.company_id,
  ];
  const companyProfileCandidates = [
    user.company_profile?.id,
    user.company_profile_id,
    user.profile?.company_profile_id,
    company?.profile_id,
  ];
  const ownerCandidates = [
    user.id,
    user.user_id,
    user.owner_id,
    user.creator_id,
    user.account?.id,
  ];
  const company_id = companyIdCandidates.map(coerceId).find((v) => v !== undefined);
  const company_profile_id = companyProfileCandidates.map(coerceId).find((v) => v !== undefined);
  const user_id = ownerCandidates.map(coerceId).find((v) => v !== undefined);
  return { company_id, company_profile_id, user_id };
}

export async function mountJobOfferCreate(root){
  if (!root) return;
  const { allowed, user } = await requireRole('company');
  if (!allowed) return;
  const companyContext = extractCompanyContext(user);
  const form = root.querySelector('form') || root;
  const title = qs('#title', form);
  const description = qs('#description', form);
  const salary = qs('#salary', form);
  const location = qs('#location', form);
  const geolocation = qs('#geolocation', form) || qs('[name="geolocation"]', form);
  const categoriesWrap = root.querySelector('[data-categories]');
  const errorBox = root.querySelector('[data-error-global]');

  // Cargar categorías dinámicamente
  await hydrateCategories(categoriesWrap);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    [title, description, salary, location].forEach(i => setFieldError(i, ''));
    if (errorBox) errorBox.textContent = '';

    const selectedCats = Array.from(form.querySelectorAll('input[name="categories[]"]:checked'))
      .map((input) => coerceId(input.value))
      .filter((value) => value !== undefined && value !== null);
    const payload = {
      title: title?.value?.trim() || '',
      description: description?.value?.trim() || '',
      salary: salary?.value ? Number(salary.value) : undefined,
      location: location?.value?.trim() || undefined,
      geolocation: geolocation?.value?.trim() || undefined,
      categories: selectedCats,
    };

    if (companyContext.company_id !== undefined) payload.company_id = companyContext.company_id;
    if (companyContext.company_profile_id !== undefined) payload.company_profile_id = companyContext.company_profile_id;
    if (companyContext.user_id !== undefined) payload.user_id = companyContext.user_id;

    try {
      await createJobOffer(payload);
      window.location.href = '/html/job-offers/index.html';
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
      if (errorBox && !Object.keys(fieldErrors).length) errorBox.textContent = err?.data?.message || err.message || 'No se pudo crear la oferta';
      console.error('create job offer error', err);
    }
  });
}

export function autoMount(){
  const el = document.querySelector('[data-page="job-offers-create"]');
  if (el) mountJobOfferCreate(el);
}
