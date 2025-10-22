import { listJobOffers, deleteJobOffer, countJobOffers } from '../api/jobOffers.js';
import { toggleFavorite, listFavorites } from '../api/favorites.js';
import { getCurrentUser } from '../api/authUser.js';
import { listJobApplications, countJobApplications } from '../api/jobApplications.js';
import { listCategories } from '../api/categories.js';
import { isCompany as hasCompanyRole, isUnemployed as hasUnemployedRole, isAdmin as hasAdminRole } from '../auth/permissions.js';

const LANDING_FALLBACK_URL = '/html/pages/landing.html';

function resolveLandingUrl() {
  try {
    if (typeof document !== 'undefined') {
      const custom = document.body?.dataset?.landingUrl || document.querySelector('[data-landing-url]')?.getAttribute('data-landing-url');
      if (custom) return custom;
    }
  } catch (error) {
    console.warn('No se pudo resolver URL personalizada de regreso', error);
  }
  return LANDING_FALLBACK_URL;
}

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (key === 'class') {
      el.className = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  }
  for (const child of children.flat()) {
    if (child == null) continue;
    el.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

// Fecha relativa: "hace 1 minuto", "hace 2 días", "hace 3 meses"
function timeAgoLong(date) {
  try {
    const d = new Date(date);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (!Number.isFinite(diff) || diff < 0) return String(date ?? '');
    if (diff < 60) return `hace ${diff} ${diff===1?'segundo':'segundos'}`;
    const m = Math.floor(diff / 60);
    if (m < 60) return `hace ${m} ${m===1?'minuto':'minutos'}`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h} ${h===1?'hora':'horas'}`;
    const dd = Math.floor(h / 24);
    if (dd < 7) return `hace ${dd} ${dd===1?'día':'días'}`;
    const wk = Math.floor(dd / 7);
    if (dd < 30) return `hace ${wk} ${wk===1?'semana':'semanas'}`;
    const mon = Math.floor(dd / 30);
    if (mon < 12) return `hace ${mon} ${mon===1?'mes':'meses'}`;
    const yr = Math.floor(mon / 12);
    return `hace ${yr} ${yr===1?'año':'años'}`;
  } catch {
    return String(date ?? '');
  }
}

// Utilidades simples para descripción
function stripHtml(html){ const tmp=document.createElement('div'); tmp.innerHTML=html||''; return tmp.textContent||tmp.innerText||''; }
function truncate(str, n){ if(!str) return ''; return String(str).length>n? String(str).slice(0,n-1)+'…' : String(str); }

function navigateBackToLanding(event) {
  if (event) event.preventDefault();
  try {
    if (typeof window !== 'undefined' && typeof history !== 'undefined') {
      const ref = document.referrer;
      if (ref && ref !== window.location.href && history.length > 1) {
        history.back();
        return;
      }
    }
  } catch (error) {
    console.warn('No se pudo navegar atrás automáticamente', error);
  }
  if (typeof window !== 'undefined') {
    window.location.href = resolveLandingUrl();
  }
}

function renderCard(offer, currentUser, {
  isFavorite = false,
  hasApplied = false,
  isCompanyUser = false,
  isUnemployedUser = false,
  isAdminUser = false,
  userCompanyId = null,
} = {}) {
  const id = offer?.id ?? offer?.uuid ?? offer?._id;
  const offerCompanyId = offer?.company_id ?? offer?.companyId ?? offer?.company?.id ?? offer?.company?.company_id ?? null;
  const normalizedOfferCompanyId = offerCompanyId != null ? String(offerCompanyId) : null;
  const normalizedUserCompanyId = userCompanyId != null ? String(userCompanyId) : null;
  const canManage = isAdminUser || (isCompanyUser && normalizedOfferCompanyId && normalizedUserCompanyId && normalizedOfferCompanyId === normalizedUserCompanyId);

  const badge = h(
    'span',
    { class: 'inline-flex items-center rounded-lg text-sm px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200' },
    offer?.offer_type === 'contract'
      ? 'Contrato'
      : offer?.offer_type === 'classified'
        ? 'Clasificado'
        : offer?.offer_type || 'Oferta'
  );

  const viewBtn = id
    ? h(
        'a',
        {
          class: 'mt-3 btn-primary text-white px-6 py-2 rounded-xl hover-lift transition-all duration-300 text-sm font-medium shadow-soft w-full flex items-center justify-center',
          href: `/html/job-offers/show.html?id=${encodeURIComponent(id)}`,
        },
        'Ver Detalles'
      )
    : null;

  const favoriteBtn =
    isUnemployedUser && id
      ? h(
          'button',
          {
            class: [
              'favorite-btn mb-4 w-full h-12 rounded-xl flex items-center justify-center transition-all duration-300',
              isFavorite
                ? 'bg-red-100 text-red-600 border-2 border-red-300'
                : 'bg-white text-gray-400 border-2 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200',
            ].join(' '),
          },
          h('i', { class: 'fas fa-heart text-xl mr-2' }),
          h('span', {}, isFavorite ? 'Guardado' : 'Guardar')
        )
      : null;

  if (favoriteBtn) {
    favoriteBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      favoriteBtn.style.opacity = '0.6';
      favoriteBtn.style.pointerEvents = 'none';
      try {
        const response = await toggleFavorite({ type: 'joboffer', id });
        const favState = !!response?.isFavorite;
        favoriteBtn.classList.toggle('bg-red-100', favState);
        favoriteBtn.classList.toggle('text-red-600', favState);
        favoriteBtn.classList.toggle('border-red-300', favState);
        favoriteBtn.classList.toggle('bg-white', !favState);
        favoriteBtn.classList.toggle('text-gray-400', !favState);
        favoriteBtn.classList.toggle('border-gray-200', !favState);
        favoriteBtn.classList.toggle('hover:bg-red-50', !favState);
        favoriteBtn.classList.toggle('hover:text-red-500', !favState);
        favoriteBtn.classList.toggle('hover:border-red-200', !favState);
        const label = favoriteBtn.querySelector('span');
        if (label) label.textContent = favState ? 'Guardado' : 'Guardar';
      } catch (error) {
        alert(error?.data?.message || 'No se pudo cambiar favorito');
      } finally {
        favoriteBtn.style.opacity = '1';
        favoriteBtn.style.pointerEvents = 'auto';
      }
    });
  }

  let card;
  card = h(
    'article',
  { class: 'card-surface rounded-3xl overflow-hidden p-0' },
    h(
      'div',
      { class: 'flex flex-col md:flex-row' },
      h(
        'div',
        { class: 'flex-1 p-6' },
        h(
          'div',
          { class: 'flex items-start justify-between mb-4' },
          h(
            'div',
            { class: 'flex-1' },
            h(
              'h3',
              { class: 'text-2xl font-bold text-gray-900 mb-3' },
              id
                ? h(
                    'a',
                    {
                      class: 'hover:text-blue-700 transition-colors group inline-flex items-center',
                      href: `/html/job-offers/show.html?id=${encodeURIComponent(id)}`,
                    },
                    offer?.title ?? 'Oferta sin título',
                    h('i', {
                      class: 'fas fa-arrow-right ml-2 text-blue-700 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1',
                    })
                  )
                : offer?.title ?? 'Oferta sin título'
            ),
            h(
              'div',
              { class: 'flex items-center mb-4' },
              h(
                'div',
                { class: 'w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mr-3' },
                h('i', { class: 'fas fa-building text-white text-xl' })
              ),
              h(
                'div',
                {},
                h('p', { class: 'text-gray-800 font-semibold text-lg' }, offer?.company?.name ?? offer?.company_name ?? 'Empresa'),
                h('p', { class: 'text-sm text-gray-500 flex items-center' }, h('i', { class: 'fas fa-check-circle text-green-600 mr-1' }), 'Empresa verificada')
              )
            )
          ),
          h('div', { class: 'ml-4' }, badge)
        ),
        h(
          'div',
          { class: 'flex flex-wrap items-center gap-4 mb-4' },
          offer?.location
            ? h(
                'div',
                { class: 'flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg' },
                h('i', { class: 'fas fa-map-marker-alt text-blue-600 mr-2' }),
                h('span', { class: 'font-medium' }, offer.location)
              )
            : null,
          offer?.geolocation
            ? h(
                'div',
                { class: 'flex items-center text-gray-600 bg-blue-50 px-3 py-2 rounded-lg' },
                h('i', { class: 'fas fa-globe text-blue-600 mr-2' }),
                h('span', { class: 'text-sm' }, 'Ver en mapa')
              )
            : null,
          offer?.created_at
            ? h(
                'div',
                { class: 'flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg' },
                h('i', { class: 'fas fa-clock text-gray-500 mr-2' }),
                h('span', { class: 'text-sm', title: String(offer.created_at) }, timeAgoLong(offer.created_at))
              )
            : null
        ),
        h(
          'div',
          { class: 'mb-4' },
          Array.isArray(offer?.categories)
            ? offer.categories.map((category) =>
                h(
                  'span',
                  { class: 'inline-block mr-2 mb-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 rounded px-2 py-1 text-xs' },
                  h('i', { class: 'fas fa-tag mr-1' }),
                  category?.name || String(category)
                )
              )
            : null
        ),
        // Descripción resumida
        (function(){
          const raw = offer?.description || offer?.details || offer?.summary || '';
          const txt = truncate(stripHtml(raw), 240);
          return txt ? h('p', { class: 'text-gray-600 leading-relaxed' }, txt) : null;
        })()
      ),
      h(
        'div',
        { class: 'md:w-64 bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex flex-col justify-between border-l border-gray-100' },
        h(
          'div',
          {},
          favoriteBtn,
          h(
            'div',
            { class: 'bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200' },
            h('p', { class: 'text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold' }, 'Salario Ofrecido'),
            h('p', { class: 'text-2xl font-bold text-gray-900 mb-2' }, offer?.salary_formatted || offer?.salary || 'A convenir'),
            h('div', { class: 'flex items-center text-xs text-gray-500' }, h('i', { class: 'fas fa-info-circle mr-1' }), 'Según experiencia')
          ),
          hasApplied
            ? h(
                'div',
                { class: 'rounded-lg border border-green-200 bg-green-50 text-green-700 px-3 py-2 text-sm' },
                h('i', { class: 'fas fa-check mr-2' }),
                'Ya aplicaste a esta oferta'
              )
            : null
        ),
        h(
          'div',
          {},
          canManage
            ? h(
                'div',
                { class: 'space-y-2' },
                h(
                  'a',
                  {
                    class: 'w-full inline-flex items-center justify-center px-4 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50',
                    href: `/html/job-offers/edit.html?id=${encodeURIComponent(id)}`,
                  },
                  h('i', { class: 'fas fa-edit mr-2' }),
                  'Editar'
                ),
                h(
                  'button',
                  {
                    class: 'w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm bg-red-600 text-white hover:bg-red-700',
                    onclick: async () => {
                      if (!confirm('¿Estás seguro que deseas eliminar esta oferta laboral?')) return;
                      try {
                        await deleteJobOffer(id);
                        if (card?.remove) card.remove();
                      } catch (error) {
                        alert(error?.data?.message || 'No se pudo eliminar la oferta');
                      }
                    },
                  },
                  h('i', { class: 'fas fa-trash mr-2' }),
                  'Eliminar'
                )
              )
            : (hasApplied ? null : viewBtn)
        )
      )
    )
  );

  return card;
}

function metricSummaryRow({ icon, label, metricKey }) {
  return h(
    'div',
    { class: 'metric-summary-row' },
    h('span', { class: 'metric-summary-label' }, label),
    h(
      'div',
      { class: 'flex items-center gap-3' },
      h('span', { class: 'metric-summary-value', 'data-metric': metricKey }, '--'),
      h('span', { class: 'metric-summary-icon' }, h('i', { class: icon }))
    )
  );
}

function configureMetricSummary(container, { isCompanyUser, isUnemployedUser }) {
  container.innerHTML = '';
  container.appendChild(h('p', { class: 'metric-summary-title' }, 'Resumen rápido'));

  const map = {};
  const addRow = ({ icon, label, metricKey, mapKey }) => {
    const row = metricSummaryRow({ icon, label, metricKey });
    container.appendChild(row);
    const metricEl = row.querySelector(`[data-metric="${metricKey}"]`);
    if (metricEl) map[mapKey] = metricEl;
  };

  if (isCompanyUser && !isUnemployedUser) {
    addRow({ icon: 'fas fa-briefcase', label: 'Ofertas publicadas', metricKey: 'company-total', mapKey: 'companyOffers' });
    addRow({ icon: 'fas fa-bullhorn', label: 'Ofertas activas', metricKey: 'company-active', mapKey: 'companyActive' });
    addRow({ icon: 'fas fa-users', label: 'Postulaciones recibidas', metricKey: 'company-applications', mapKey: 'companyApplications' });
  } else {
    addRow({ icon: 'fas fa-briefcase', label: 'Ofertas activas', metricKey: 'offers-total', mapKey: 'offers' });
    addRow({ icon: 'fas fa-heart', label: 'Favoritos guardados', metricKey: 'favorites-total', mapKey: 'favorites' });
    addRow({ icon: 'fas fa-paper-plane', label: 'Postulaciones', metricKey: 'applications-total', mapKey: 'applications' });
  }

  return map;
}

function normalizeJobOfferFilters(input = {}) {
  const out = {};
  const assign = (key, value) => {
    if (value == null) return;
    const str = String(value).trim();
    if (!str) return;
    out[key] = str;
  };
  assign('location', input.location);
  assign('category_id', input.category_id);
  assign('search', input.search);
  return out;
}

function readJobOfferFiltersFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    return normalizeJobOfferFilters({
      location: params.get('location'),
      category_id: params.get('category_id'),
      search: params.get('search'),
    });
  } catch {
    return {};
  }
}

function updateJobOfferFiltersInURL(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.category_id) params.set('category_id', filters.category_id);
    if (filters.search) params.set('search', filters.search);
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  } catch (error) {
    console.warn('No se pudieron sincronizar los filtros en la URL', error);
  }
}

function jobOfferCategoryName(list, id) {
  if (!id) return 'Todas';
  try {
    const arr = Array.isArray(list) ? list : [];
    const match = arr.find((item) => String(item?.id ?? item?.value ?? item?.category_id) === String(id));
    return match?.name || match?.title || match?.label || `ID ${id}`;
  } catch {
    return String(id);
  }
}

function renderJobOfferFilters(container, state, categories, onSubmit) {
  if (!container) return;
  container.innerHTML = '';

  const form = h(
    'form',
    { class: 'space-y-6' },
    h(
      'div',
      { class: 'flex flex-wrap items-center gap-3' },
      h('span', { class: 'px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm inline-flex items-center gap-2' }, h('i', { class: 'fas fa-filter' }), 'Filtrado inteligente'),
      state.location ? h('span', { class: 'px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm' }, `Ubicación: ${state.location}`) : null,
      state.category_id ? h('span', { class: 'px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm' }, `Categoría: ${jobOfferCategoryName(categories, state.category_id)}`) : null,
      state.search ? h('span', { class: 'px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm' }, `Buscar: ${state.search}`) : null,
      state.location || state.category_id || state.search
        ? h(
            'button',
            {
              type: 'button',
              class: 'text-sm text-gray-500 hover:text-gray-700 underline',
              onclick: (event) => {
                event.preventDefault();
                onSubmit(normalizeJobOfferFilters({}));
              },
            },
            'Limpiar filtros'
          )
        : null
    ),
    h(
      'div',
      { class: 'grid grid-cols-1 md:grid-cols-4 gap-4' },
      h(
        'div',
        { class: 'col-span-1' },
        h('label', { for: 'job-offers-filter-location', class: 'block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2' }, h('i', { class: 'fas fa-location-dot text-blue-600' }), 'Ubicación'),
        h('input', {
          type: 'text',
          id: 'job-offers-filter-location',
          name: 'location',
          value: state.location || '',
          placeholder: 'Ciudad, país o remoto',
          class: 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
        })
      ),
      h(
        'div',
        { class: 'col-span-1' },
        h('label', { for: 'job-offers-filter-category', class: 'block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2' }, h('i', { class: 'fas fa-tags text-purple-500' }), 'Categoría'),
        h(
          'select',
          {
            id: 'job-offers-filter-category',
            name: 'category_id',
            class: 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
          },
          h('option', { value: '' }, 'Todas las categorías'),
          ...((Array.isArray(categories) ? categories : []).map((category) =>
            h(
              'option',
              {
                value: String(category?.id ?? category?.value ?? ''),
                selected: state.category_id && String(state.category_id) === String(category?.id ?? category?.value ?? '') ? 'selected' : undefined,
              },
              category?.name || category?.title || category?.label || 'Categoría'
            )
          ))
        )
      ),
      h(
        'div',
        { class: 'col-span-1' },
        h('label', { for: 'job-offers-filter-search', class: 'block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2' }, h('i', { class: 'fas fa-magnifying-glass text-blue-500' }), 'Palabras clave'),
        h('input', {
          type: 'text',
          id: 'job-offers-filter-search',
          name: 'search',
          value: state.search || '',
          placeholder: 'Título, empresa o palabras clave',
          class: 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
        })
      ),
      h(
        'div',
        { class: 'col-span-1 flex items-end' },
        h(
          'button',
          { type: 'submit', class: 'w-full btn-primary inline-flex items-center justify-center gap-2 text-white px-5 py-3 rounded-xl font-semibold transition' },
          h('i', { class: 'fas fa-search' }),
          'Buscar ofertas'
        )
      )
    )
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fd = new FormData(form);
    const next = normalizeJobOfferFilters({
      location: fd.get('location'),
      category_id: fd.get('category_id'),
      search: fd.get('search'),
    });
    onSubmit(next);
  });

  container.appendChild(form);
}

export async function mountJobOffersList(root) {
  if (!root) return;

  root.innerHTML = '';
  root.className = 'page-shell';

  const metricSummaryContainer = h(
    'div',
    { class: 'metric-summary', id: 'jobOffersMetricSummary' },
    h('p', { class: 'metric-summary-title' }, 'Resumen rápido')
  );

  const header = h(
    'section',
    { class: 'page-hero gradient-primary text-white shadow-card' },
    h(
      'div',
      { class: 'page-hero-content' },
      h(
        'div',
        { class: 'space-y-6' },
        h(
          'div',
          { class: 'flex items-center' },
          h(
            'button',
            {
              type: 'button',
              class: 'inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition',
              onclick: navigateBackToLanding,
            },
            h('i', { class: 'fas fa-arrow-left text-xs' }),
            'Volver'
          )
        ),
        h(
          'div',
          { class: 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/30 text-white/80 text-xs uppercase tracking-[0.25em]' },
          h('i', { class: 'fas fa-rocket-launch' }),
          'Encuentra tu próximo reto'
        ),
        h(
          'div',
          { class: 'space-y-3' },
          h(
            'h1',
            { class: 'text-3xl md:text-5xl font-bold leading-tight text-white' },
            'Ofertas laborales curadas para ti'
          ),
          h(
            'p',
            { class: 'text-white/85 text-base md:text-lg max-w-2xl' },
            'Filtra, guarda y postula con una experiencia diseñada para concentrarte en lo importante: conectar con oportunidades reales.'
          )
        ),
        h('div', { class: 'flex flex-wrap items-center gap-3', id: 'jobOffersHeaderActions' })
      ),
      h('div', { class: 'w-full max-w-sm' }, metricSummaryContainer)
    )
  );

  root.appendChild(header);

  let metricElements = {};
  const setMetric = (key, value) => {
    const el = metricElements[key];
    if (!el) return;
    if (value == null || value === '') {
      el.textContent = '--';
      return;
    }
    const number = Number(value);
    el.textContent = Number.isFinite(number) ? number.toLocaleString() : String(value);
  };

  metricElements = configureMetricSummary(metricSummaryContainer, { isCompanyUser: false, isUnemployedUser: true });

  async function computeCompanyMetrics(companyId) {
    if (!companyId) return;

    let totalOffers = null;
    let activeOffers = null;
    let applications = null;
    let companyOffers = [];

    try {
      const total = await countJobOffers({ company_id: companyId });
      if (Number.isFinite(total)) totalOffers = total;
    } catch (error) {
      console.warn('No se pudo obtener el total de ofertas de la empresa', error);
    }

    try {
      const active = await countJobOffers({ company_id: companyId, status: 'active' });
      if (Number.isFinite(active)) activeOffers = active;
    } catch (error) {
      console.warn('No se pudo obtener el total de ofertas activas de la empresa', error);
    }

    try {
      const response = await listJobOffers({ company_id: companyId, per_page: 100, page: 1 });
      companyOffers = asArray(response);
      if (!Number.isFinite(totalOffers)) totalOffers = companyOffers.length;
      if (!Number.isFinite(activeOffers)) {
        const activeStatuses = ['active', 'activo', 'publicado', 'published', 'vigente', 'open'];
        activeOffers = companyOffers.filter((offer) => {
          const status = (offer?.status || offer?.state || '').toString().toLowerCase();
          if (!status) return true;
          return activeStatuses.includes(status);
        }).length;
      }
    } catch (error) {
      console.warn('No se pudieron listar las ofertas de la empresa', error);
    }

    if (!Number.isFinite(applications)) {
      try {
        const direct = await countJobApplications({ company_id: companyId });
        if (Number.isFinite(direct)) applications = direct;
      } catch (error) {
        console.warn('No se pudieron contar postulaciones por empresa', error);
      }
    }

    if (!Number.isFinite(applications) && companyOffers.length) {
      const ids = companyOffers.map((offer) => offer?.id ?? offer?.uuid ?? offer?._id).filter(Boolean);
      if (ids.length) {
        try {
          const aggregated = await countJobApplications({ job_offer_ids: ids.join(',') });
          if (Number.isFinite(aggregated)) applications = aggregated;
        } catch (error) {
          console.warn('No se pudieron contar postulaciones agrupadas por oferta', error);
        }

        if (!Number.isFinite(applications)) {
          let sum = 0;
          const sampleIds = ids.slice(0, 10);
          for (const id of sampleIds) {
            try {
              const perOffer = await countJobApplications({ job_offer_id: id });
              if (Number.isFinite(perOffer)) {
                sum += perOffer;
              } else {
                const perOfferList = await listJobApplications({ job_offer_id: id, per_page: 100, page: 1 });
                sum += asArray(perOfferList).length;
              }
            } catch (error) {
              console.warn(`No se pudieron contar postulaciones para la oferta ${id}`, error);
            }
          }
          applications = sum;
        }
      }
    }

    if (!Number.isFinite(applications) && Number.isFinite(totalOffers) && totalOffers === 0) {
      applications = 0;
    }

    if (Number.isFinite(totalOffers)) setMetric('companyOffers', totalOffers);
    if (Number.isFinite(activeOffers)) setMetric('companyActive', activeOffers);
    if (Number.isFinite(applications)) setMetric('companyApplications', applications);
  }

  const listSection = h('section', { class: 'page-section space-y-8' });
  const filtersCard = h('div', { class: 'card-surface rounded-3xl p-6 shadow-soft' });
  listSection.appendChild(filtersCard);
  const container = h('div', { class: 'grid grid-cols-1 gap-6' });
  listSection.appendChild(container);
  const loading = h('p', { class: 'text-slate-500' }, 'Cargando ofertas...');
  loading.style.display = 'block';
  listSection.appendChild(loading);
  const moreWrap = h('div', { class: 'mt-8 flex justify-center', style: 'display:none;' });
  const moreButton = h('button', { class: 'px-6 py-3 rounded-xl bg-white border shadow-sm hover:bg-gray-50 text-sm font-medium' }, 'Cargar más');
  moreWrap.appendChild(moreButton);
  listSection.appendChild(moreWrap);
  root.appendChild(listSection);

  const EMPTY_ATTR = 'data-empty-state';

  try {
    let currentUser = null;
    try {
      currentUser = await getCurrentUser();
    } catch (error) {
      console.warn('No se pudo obtener el usuario actual', error);
    }

  const isCompanyUser = hasCompanyRole(currentUser);
  // Detectar cesante de forma tolerante: rol resuelto O relación O pista almacenada
  const storedRole = (localStorage.getItem('display_role')||localStorage.getItem('selected_role')||localStorage.getItem('pending_role')||'').toLowerCase();
  const hintUnemployed = ['unemployed','cesante','desempleado','postulante','candidate','jobseeker'].includes(storedRole);
  const relationUnemployed = !!(currentUser?.unemployed?.id || currentUser?.unemployed_id || currentUser?.profile?.unemployed?.id);
  const isUnemployedUser = hasUnemployedRole(currentUser) || relationUnemployed || hintUnemployed;
    const isAdminUser = hasAdminRole(currentUser);
    const userCompanyId = currentUser?.company?.id ?? currentUser?.company_id ?? currentUser?.companyId ?? null;

    metricElements = configureMetricSummary(metricSummaryContainer, { isCompanyUser, isUnemployedUser });
    Object.values(metricElements).forEach((el) => {
      if (el) el.textContent = '--';
    });

    let companyMetricsPromise = null;
    if (isCompanyUser && userCompanyId != null) {
      companyMetricsPromise = computeCompanyMetrics(userCompanyId);
    }

    const actions = document.getElementById('jobOffersHeaderActions');
    if (actions) {
      actions.innerHTML = '';
      if (isUnemployedUser) {
        actions.appendChild(
          h(
            'a',
            { href: '/html/favorites/index.html', class: 'btn-secondary text-white px-4 py-2 rounded-xl inline-flex items-center' },
            h('i', { class: 'fas fa-heart mr-2' }),
            'Mis Favoritos'
          )
        );
      }
      if (isCompanyUser) {
        actions.appendChild(
          h(
            'a',
            { href: '/html/job-offers/create.html', class: 'btn-primary text-white px-4 py-2 rounded-xl inline-flex items-center' },
            h('i', { class: 'fas fa-plus mr-2' }),
            'Crear Nueva Oferta'
          )
        );
      }
    }

    const favoriteSet = new Set();
    if (isUnemployedUser) {
      try {
        const favoritesResponse = await listFavorites({ type: 'joboffer', per_page: 100, page: 1 });
        const favoriteItems = Array.isArray(favoritesResponse)
          ? favoritesResponse
          : Array.isArray(favoritesResponse?.data)
          ? favoritesResponse.data
          : [];
        for (const favorite of favoriteItems) {
          const favoriteId = favorite?.favoritable_id ?? favorite?.job_offer_id ?? favorite?.id ?? favorite?.favoritable?.id;
          if (favoriteId != null) favoriteSet.add(String(favoriteId));
        }
        setMetric('favorites', favoriteSet.size);
      } catch (error) {
        console.warn('No se pudieron cargar favoritos del usuario', error);
      }
    }

    const appliedSet = new Set();
    if (isUnemployedUser) {
      try {
        const query = { per_page: 100, page: 1 };
        if (currentUser?.unemployed?.id) query.unemployed_id = currentUser.unemployed.id;
        const applicationsResponse = await listJobApplications(query);
        const applications = Array.isArray(applicationsResponse)
          ? applicationsResponse
          : Array.isArray(applicationsResponse?.data)
          ? applicationsResponse.data
          : [];
        for (const application of applications) {
          const offerId = application?.job_offer_id ?? application?.jobOfferId ?? application?.job_offer?.id;
          if (offerId != null) appliedSet.add(String(offerId));
        }
        setMetric('applications', appliedSet.size);
      } catch (error) {
        console.warn('No se pudieron cargar postulaciones del usuario', error);
      }
    }

    if (companyMetricsPromise) {
      companyMetricsPromise.catch(() => {});
    }

    let categories = [];
    try {
      const categoryResponse = await listCategories({ per_page: 100, page: 1 });
      categories = Array.isArray(categoryResponse)
        ? categoryResponse
        : Array.isArray(categoryResponse?.data)
        ? categoryResponse.data
        : [];
    } catch (error) {
      console.warn('No se pudieron cargar categorías', error);
    }

    let filterState = normalizeJobOfferFilters(readJobOfferFiltersFromURL());
    updateJobOfferFiltersInURL(filterState);

    const pageSize = 10;
    let currentPage = 1;
    let lastPage = 1;

    function buildParams(page = 1) {
      const params = { page, per_page: pageSize, limit: pageSize };
      if (filterState.location) {
        const value = filterState.location;
        params.location = value;
        params.city = value;
        params['filter[location]'] = value;
      }
      if (filterState.category_id) {
        const value = filterState.category_id;
        params.category_id = value;
        params.category = value;
        params['filter[category]'] = value;
        params['filter[category_id]'] = value;
      }
      if (filterState.search) {
        const value = filterState.search;
        params.search = value;
        params.q = value;
        params.keyword = value;
        params.keywords = value;
      }
      return params;
    }

    function clearEmptyState() {
      const existing = listSection.querySelector(`[${EMPTY_ATTR}="job-offers"]`);
      if (existing) existing.remove();
    }

    function showEmptyState() {
      const empty = h(
        'div',
        { class: 'card-surface rounded-3xl p-12 text-center space-y-4', [EMPTY_ATTR]: 'job-offers' },
        h('div', { class: 'w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto' }, h('i', { class: 'fas fa-briefcase text-3xl text-blue-600' })),
        h('h3', { class: 'text-xl font-semibold text-slate-900' }, 'No se encontraron ofertas'),
        h('p', { class: 'text-slate-600' }, 'Actualmente no hay ofertas de trabajo disponibles que coincidan con tus criterios. Guarda esta vista y vuelve a intentarlo más tarde.'),
        isCompanyUser
          ? h(
              'a',
              { href: '/html/job-offers/create.html', class: 'btn-primary text-white px-6 py-3 rounded-xl hover-lift inline-flex items-center justify-center' },
              h('i', { class: 'fas fa-plus mr-2' }),
              'Publicar Primera Oferta'
            )
          : h(
              'button',
              { class: 'btn-secondary text-white px-6 py-3 rounded-xl hover-lift inline-flex items-center justify-center', onclick: () => location.reload() },
              h('i', { class: 'fas fa-refresh mr-2' }),
              'Actualizar lista'
            )
      );
      listSection.insertBefore(empty, moreWrap);
      moreWrap.style.display = 'none';
      setMetric('offers', 0);
    }

    function renderOffers(items) {
      for (const offer of items) {
        const offerId = offer?.id ?? offer?.uuid ?? offer?._id;
        const card = renderCard(offer, currentUser, {
          isFavorite: favoriteSet.has(String(offerId)),
          hasApplied: appliedSet.has(String(offerId)),
          isCompanyUser,
          isUnemployedUser,
          isAdminUser,
          userCompanyId,
        });
        container.appendChild(card);
      }
    }

    async function loadPage(page = 1) {
      const params = buildParams(page);
      const response = await listJobOffers(params);
      const items = asArray(response);
      currentPage = Number(response?.meta?.current_page ?? response?.current_page ?? page);
      const fallbackLastPage = items.length < pageSize ? page : page + 1;
      lastPage = Number(response?.meta?.last_page ?? response?.last_page ?? fallbackLastPage);
      const totalOffers = response?.meta?.total ?? response?.total ?? null;
      const inferredTotal = ((currentPage - 1) * pageSize) + items.length;
      const metricValue = totalOffers != null ? totalOffers : (items.length === 0 && currentPage === 1 ? 0 : inferredTotal || '--');
      setMetric('offers', metricValue);
      return items;
    }

    function updateMoreVisibility() {
      const hasMore = currentPage < lastPage;
      moreWrap.style.display = hasMore && container.childElementCount ? 'flex' : 'none';
    }

    async function reloadFirstPage() {
      clearEmptyState();
      container.innerHTML = '';
      loading.textContent = 'Buscando ofertas...';
      loading.style.display = 'block';
      moreWrap.style.display = 'none';
      try {
        const items = await loadPage(1);
        if (!items.length) {
          loading.style.display = 'none';
          showEmptyState();
          updateMoreVisibility();
          return;
        }
        loading.style.display = 'none';
        renderOffers(items);
        updateMoreVisibility();
      } catch (error) {
        console.error('Error recargando ofertas', error);
        loading.textContent = `Error cargando ofertas: ${error?.data?.message || error.message}`;
        loading.style.display = 'block';
      }
    }

    function handleFiltersChange(next) {
      const normalized = normalizeJobOfferFilters(next);
      const same =
        (filterState.location || '') === (normalized.location || '') &&
        (filterState.category_id || '') === (normalized.category_id || '') &&
        (filterState.search || '') === (normalized.search || '');
      if (same) return;
      filterState = normalized;
      updateJobOfferFiltersInURL(filterState);
      renderJobOfferFilters(filtersCard, filterState, categories, handleFiltersChange);
      setMetric('offers', '--');
      reloadFirstPage().catch((error) => console.warn('No se pudo recargar ofertas', error));
    }

    renderJobOfferFilters(filtersCard, filterState, categories, handleFiltersChange);

    await reloadFirstPage();

    moreButton.addEventListener('click', async () => {
      moreButton.disabled = true;
      moreButton.textContent = 'Cargando...';
      try {
        const items = await loadPage(currentPage + 1);
        if (items.length) {
          renderOffers(items);
        }
      } catch (error) {
        alert(error?.data?.message || 'No se pudo cargar más ofertas');
      } finally {
        moreButton.disabled = false;
        moreButton.textContent = 'Cargar más';
        updateMoreVisibility();
      }
    });
  } catch (error) {
    console.error('Error cargando ofertas', error);
    loading.textContent = `Error cargando ofertas: ${error?.data?.message || error.message}`;
    loading.style.display = 'block';
  }
}

export function autoMount() {
  const el = document.querySelector('[data-page="job-offers"]');
  if (el) mountJobOffersList(el);
}
