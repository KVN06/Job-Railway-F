import { apiFetch } from '../api/http.js';
import { listCategories } from '../api/categories.js';

export function autoMount() {
  const root = document.querySelector('[data-page="classifieds-create"]');
  if (!root) return;
  init(root).catch(err => console.error('Classified create init error:', err));
}

async function init(section) {
  const form = section.querySelector('form');
  const catBox = section.querySelector('[data-categories]');
  const globalErr = section.querySelector('[data-error-global]');

  // Cargar categorías
  try {
    const cats = await listCategories({ type: 'classified' });
    renderCategories(catBox, cats);
  } catch (e) {
    catBox.innerHTML = `<p class="text-red-600">No se pudieron cargar categorías</p>`;
  }

  // Submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(form, globalErr);
    const fd = new FormData(form);
    const payload = collectPayload(fd);
    try {
      await createClassified(payload);
      location.href = '/html/classifieds/index.html?success=Clasificado%20creado';
    } catch (err) {
      handleErrors(err, form, globalErr);
    }
  });
}

function collectPayload(fd) {
  const arr = [];
  fd.getAll('categories[]').forEach(v => { if (v) arr.push(Number(v)); });
  return {
    title: (fd.get('title')||'').toString().trim(),
    description: (fd.get('description')||'').toString().trim(),
    location: (fd.get('location')||'').toString().trim(),
    geolocation: (fd.get('geolocation')||'').toString().trim() || undefined,
    salary: fd.get('salary') ? Number(fd.get('salary')) : undefined,
    categories: arr,
  };
}

async function createClassified(payload) {
  // Intenta endpoints comunes
  const candidates = [
    { path: '/classified', method: 'POST' },
    { path: '/classifieds', method: 'POST' },
  ];
  let lastErr = null;
  for (const c of candidates) {
    try {
      return await apiFetch(c.path, { method: c.method, body: payload });
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('No se pudo crear el clasificado');
}

function renderCategories(container, cats) {
  if (!container) return;
  const items = Array.isArray(cats) ? cats : [];
  if (!items.length) {
    container.innerHTML = '<p class="text-slate-500">Sin categorías</p>';
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3';
  for (const c of items) {
    const id = `cat_${c.id}`;
    const row = document.createElement('label');
    row.className = 'flex items-center gap-2';
    row.innerHTML = `
      <input type="checkbox" name="categories[]" value="${c.id}" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
      <span class="text-sm text-gray-700">${c.name || c.title || ''}</span>
    `;
    grid.appendChild(row);
  }
  container.innerHTML = '';
  container.appendChild(grid);
}

function handleErrors(err, form, globalEl) {
  const msg = err?.data?.message || err.message;
  const errors = err?.data?.errors || {};
  if (globalEl && msg) {
    globalEl.classList.remove('hidden');
    globalEl.className = 'mb-6 mx-8 mt-6 px-4 py-3 rounded-xl text-sm bg-red-100 text-red-800 border border-red-200';
    globalEl.textContent = msg;
  }
  for (const [field, list] of Object.entries(errors)) {
    const el = form.querySelector(`#${CSS.escape(field)}`) || form.querySelector(`[name="${CSS.escape(field)}"]`);
    if (!el) continue;
    const p = el.closest('div')?.querySelector('p.text-red-600') || document.createElement('p');
    p.className = 'mt-1 text-sm text-red-600';
    p.textContent = Array.isArray(list) ? list[0] : String(list);
    if (!p.parentElement) el.closest('div')?.appendChild(p);
  }
}

function clearErrors(form, globalEl) {
  form.querySelectorAll('p.text-red-600').forEach(p=>p.remove());
  if (globalEl) { globalEl.textContent=''; globalEl.classList.add('hidden'); }
}
