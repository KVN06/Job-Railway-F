import { getJobOffer } from '../api/jobOffers.js';
import { toggleFavorite } from '../api/favorites.js';
import { getCurrentUser } from '../api/authUser.js';
import { isCompany as hasCompanyRole, isUnemployed as hasUnemployedRole, can as canDo } from '../auth/permissions.js';
import { listJobApplications, createJobApplication, hasAppliedToOffer } from '../api/jobApplications.js';

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const ch of children.flat()) {
    if (ch == null) continue;
    el.appendChild(ch instanceof Node ? ch : document.createTextNode(String(ch)));
  }
  return el;
}

function getQueryId() {
  const url = new URL(window.location.href);
  return url.searchParams.get('id');
}

export async function mountJobOfferDetail(root, id) {
  if (!root) return;
  root.innerHTML = '';
  const loading = h('p', { class: 'text-slate-500' }, 'Cargando oferta...');
  root.appendChild(loading);
  try {
    const offerId = id || root.getAttribute('data-id') || getQueryId();
    if (!offerId) {
      loading.textContent = 'Falta el parámetro id (?id=123)';
      return;
    }
    const data = await getJobOffer(offerId);
    loading.remove();
    const offer = data?.data ?? data;

    // Usuario actual (para permisos, favoritos y aplicar)
    let currentUser = null;
    let isUnemployed = false;
    let isCompany = false;
    let canManage = false;
  try { currentUser = await getCurrentUser(); } catch {}
    isCompany = currentUser ? hasCompanyRole(currentUser) : false;
    isUnemployed = currentUser ? hasUnemployedRole(currentUser) || canDo(currentUser, 'apply') : false;
    const companyId = currentUser?.company?.id;
    const offerCompanyId = offer?.company_id;
    if (isCompany && companyId != null && offerCompanyId != null) {
      canManage = String(offerCompanyId) === String(companyId);
    }

    // Estructura de 2 columnas
    const grid = h('div', { class: 'grid grid-cols-1 lg:grid-cols-3 gap-8' });
    const main = h('div', { class: 'lg:col-span-2' });
    const aside = h('div', { class: 'lg:col-span-1' });
    grid.appendChild(main); grid.appendChild(aside);
    root.appendChild(grid);

    // Header principal
    const headerCard = h('div', { class: 'bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-900/30' },
      h('div', { class: 'flex justify-between items-start mb-6' },
        h('div', { class: 'flex-1' },
          h('h1', { class: 'text-3xl font-bold text-gray-900 mb-2' }, offer?.title ?? `Oferta #${offerId}`),
          h('div', { class: 'flex items-center text-gray-600 mb-2' },
            h('i', { class: 'fas fa-building w-5 text-center mr-2' }),
            h('span', { class: 'text-lg font-semibold' }, offer?.company?.name || 'Empresa')
          ),
          offer?.location ? h('div', { class: 'flex items-center text-gray-500' }, h('i', { class: 'fas fa-map-marker-alt w-5 text-center mr-2' }), h('span', {}, offer.location)) : null
        ),
        h('div', { class: 'flex flex-col items-end space-y-2' },
          // Favorito para desempleados
          isUnemployed ? h('button', { class: 'favorite-btn w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover-lift border bg-gray-100 text-gray-400 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200', onclick: async (e) => {
            const btn = e.currentTarget;
            btn.style.opacity = '0.6'; btn.style.pointerEvents = 'none';
            try {
              const res = await toggleFavorite({ type: 'joboffer', id: offerId });
              const isFav = !!res.isFavorite;
              btn.classList.toggle('bg-red-100', isFav);
              btn.classList.toggle('text-red-600', isFav);
              btn.classList.toggle('border-red-200', isFav);
              btn.classList.toggle('bg-gray-100', !isFav);
              btn.classList.toggle('text-gray-400', !isFav);
              btn.classList.toggle('border-gray-200', !isFav);
            } catch (err) { alert(err?.data?.message || 'No se pudo cambiar favorito'); }
            finally { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
          } }, h('i', { class: 'fas fa-heart text-lg' })) : null,
          // Acciones de empresa
          canManage ? h('div', { class: 'flex space-x-2' },
            h('a', { href: `/html/job-offers/edit.html?id=${encodeURIComponent(offerId)}`, class: 'bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors' }, 'Editar'),
            h('a', { href: '/html/job-offers/index.html', class: 'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors' }, 'Eliminar')
          ) : null
        )
      ),
      // Categorías
      Array.isArray(offer?.categories) && offer.categories.length ? h('div', { class: 'mb-6' },
        h('h3', { class: 'text-lg font-semibold text-gray-800 mb-2' }, 'Categorías'),
        h('div', { class: 'flex flex-wrap gap-2' }, offer.categories.map(c => h('span', { class: 'inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold' }, c?.name || String(c?.id || c))))
      ) : null,
      // Descripción
      h('div', { class: 'mb-6' },
        h('h3', { class: 'text-lg font-semibold text-gray-800 mb-3' }, 'Descripción del puesto'),
        h('div', { class: 'prose max-w-none text-gray-700 whitespace-pre-wrap' }, offer?.description || 'Sin descripción')
      ),
      // Mapa
      h('div', { class: 'mb-6' },
        h('div', { class: 'flex items-center justify-between mb-3' },
          h('h3', { class: 'text-lg font-semibold text-gray-800' }, 'Ubicación'),
          h('button', { class: 'flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-sm', onclick: () => openMapModal(offer) }, h('i', { class: 'fas fa-expand-arrows-alt' }), h('span', { class: 'text-sm font-medium' }, 'Ampliar Mapa'))
        ),
        h('div', { id: 'map', class: 'w-full h-64 rounded-lg border-2 border-gray-200 shadow-sm' })
      )
    );
    main.appendChild(headerCard);

    // Sidebar - info empresa y detalles
    const asideWrap = h('div', {},
        h('div', { class: 'bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-900/30' },
          h('h3', { class: 'text-lg font-semibold text-gray-800 mb-4' }, 'Información de la empresa'),
          h('div', { class: 'space-y-3' },
            h('div', {}, h('span', { class: 'font-medium text-gray-700' }, 'Empresa:'), h('p', { class: 'text-gray-600' }, offer?.company?.name || '')),
            offer?.company?.business_name ? h('div', {}, h('span', { class: 'font-medium text-gray-700' }, 'Razón social:'), h('p', { class: 'text-gray-600' }, offer.company.business_name)) : null,
            offer?.company?.description ? h('div', {}, h('span', { class: 'font-medium text-gray-700' }, 'Descripción:'), h('p', { class: 'text-gray-600' }, String(offer.company.description).slice(0, 150))) : null,
            offer?.company?.website ? h('div', {}, h('span', { class: 'font-medium text-gray-700' }, 'Sitio web:'), h('a', { href: offer.company.website, target: '_blank', class: 'text-blue-600 hover:text-blue-800 break-all' }, offer.company.website)) : null
          )
        ),
        h('div', { class: 'bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-900/30' },
          h('h3', { class: 'text-lg font-semibold text-gray-800 mb-4' }, 'Detalles del trabajo'),
          h('div', { class: 'space-y-3' },
            h('div', { class: 'flex justify-between' }, h('span', { class: 'font-medium text-gray-700' }, 'Salario:'), h('span', { class: 'text-green-600 font-semibold' }, offer?.salary_formatted || (offer?.salary ? String(offer.salary) : 'A convenir'))),
            offer?.location ? h('div', { class: 'flex justify-between' }, h('span', { class: 'font-medium text-gray-700' }, 'Ubicación:'), h('span', { class: 'text-gray-600' }, offer.location)) : null,
          )
        )
      );
    aside.appendChild(asideWrap);

    // Tarjeta de postulación para desempleados o CTA para iniciar sesión si no autenticado
    if (!currentUser) {
      const cta = h('div', { class: 'bg-white rounded-lg shadow-sm p-6 border border-blue-900/30' },
        h('h3', { class: 'text-lg font-semibold text-gray-800 mb-3' }, '¿Quieres postular a esta oferta?'),
        h('p', { class: 'text-gray-600 mb-4' }, 'Inicia sesión o crea tu cuenta como cesante para postularte.'),
        h('div', { class: 'flex gap-3' },
          h('a', { href: `/html/auth/login.html?redirect=${encodeURIComponent(location.pathname + location.search)}`, class: 'px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700' }, 'Iniciar sesión'),
          h('a', { href: '/html/auth/register.html', class: 'px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800' }, 'Crear cuenta')
        )
      );
      aside.appendChild(cta);
    } else if (isUnemployed) {
      // Detectar si ya postuló
      let hasApplied = false;
      try { hasApplied = await hasAppliedToOffer(offerId); } catch {}

      const applyCard = h('div', { class: 'bg-white rounded-lg shadow-sm p-6 border border-blue-900/30' },
        h('h3', { class: 'text-lg font-semibold text-gray-800 mb-3' }, 'Aplicar a esta oferta'),
        hasApplied ? h('div', { class: 'rounded-lg p-4 bg-green-50 border border-green-200 text-green-700' },
          h('i', { class: 'fas fa-check mr-2' }), 'Ya has postulado a esta oferta.'
        ) : h('form', { class: 'space-y-3', onsubmit: async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const message = fd.get('message');
          const cv = fd.get('cv');
          try {
            if (cv && cv.size > 5 * 1024 * 1024) throw Object.assign(new Error('El archivo supera 5MB'), { status: 422 });
            await createJobApplication({ job_offer_id: offerId, message, cv });
            e.currentTarget.replaceWith(h('div', { class: 'rounded-lg p-4 bg-green-50 border border-green-200 text-green-700' }, h('i', { class: 'fas fa-check mr-2' }), 'Postulación enviada.'));
          } catch (err) {
            const msg = err?.data?.message || (err?.status === 401 ? 'Debes iniciar sesión para postular.' : err?.message) || 'No se pudo enviar la postulación';
            alert(msg);
          }
        } },
          h('div', {}, h('label', { class: 'block text-sm font-medium text-gray-700', for: 'message' }, 'Mensaje (opcional)'), h('textarea', { name: 'message', id: 'message', rows: 3, maxlength: 2000, class: 'mt-1 block w-full border border-gray-200 rounded-md px-3 py-2' })),
          h('div', {}, h('label', { class: 'block text-sm font-medium text-gray-700', for: 'cv' }, 'CV (opcional, PDF/DOC/DOCX, máx. 5MB)'), h('input', { type: 'file', name: 'cv', id: 'cv', accept: '.pdf,.doc,.docx', class: 'mt-1 block w-full border border-gray-200 rounded px-2 py-1' })),
          h('button', { type: 'submit', class: 'w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold' }, 'Postularme a esta oferta')
        )
      );
      aside.appendChild(applyCard);
  }

    // Iniciar mapa Leaflet si está disponible
    try {
      const hasLeaflet = typeof L !== 'undefined';
      const mapEl = document.getElementById('map');
      if (hasLeaflet && mapEl) {
        let lat = 2.4448, lng = -76.6147;
        if (offer?.geolocation && typeof offer.geolocation === 'string') {
          const parts = offer.geolocation.split(',');
          const a = parseFloat(parts[0]); const b = parseFloat(parts[1]);
          if (!Number.isNaN(a) && !Number.isNaN(b) && a !== 0 && b !== 0) { lat = a; lng = b; }
        }
        const map = L.map(mapEl).setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<div class="p-2"><h3 class="font-semibold text-gray-800">${offer?.title || ''}</h3><p class="text-gray-600">${offer?.company?.name || ''}</p><p class="text-sm text-gray-500">${offer?.location || ''}</p><p class="text-xs text-blue-500">Coords: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p></div>`).openPopup();
      }
    } catch {}
  } catch (err) {
    loading.textContent = `Error cargando oferta: ${err?.data?.message || err.message}`;
  }
}

export function autoMount() {
  const el = document.querySelector('[data-page="job-offer-detail"]');
  if (el) mountJobOfferDetail(el);
}

// Helper modal simple para "Ampliar mapa" (renderiza un modal básico)
function openMapModal(offer){
  const latlng = (() => {
    let lat = 2.4448, lng = -76.6147;
    if (offer?.geolocation && typeof offer.geolocation === 'string') {
      const parts = offer.geolocation.split(',');
      const a = parseFloat(parts[0]); const b = parseFloat(parts[1]);
      if (!Number.isNaN(a) && !Number.isNaN(b) && a !== 0 && b !== 0) { lat = a; lng = b; }
    }
    return { lat, lng };
  })();

  let wrap = document.getElementById('job-offer-map-modal');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'job-offer-map-modal';
    wrap.className = 'fixed inset-0 z-[9999] hidden';
    wrap.innerHTML = `
      <div class="absolute inset-0 bg-black/70"></div>
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl">
          <div class="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold">${offer?.title || 'Ubicación'}</h3>
              <p class="text-sm text-gray-500">${offer?.company?.name || ''}</p>
            </div>
            <button data-close class="text-gray-600 hover:bg-gray-100 rounded-lg p-2"><i class="fas fa-times text-xl"></i></button>
          </div>
          <div class="p-6">
            <div id="job-offer-modal-map" class="w-full h-[600px] rounded-xl border"></div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end">
            <button data-close class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">Cerrar</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener('click', (e) => { if (e.target === wrap || e.target.closest('[data-close]')) { wrap.classList.add('hidden'); document.body.style.overflow='auto'; } });
  }
  wrap.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Inicializar Leaflet en el modal
  try {
    if (typeof L === 'undefined') return;
    const mapEl = document.getElementById('job-offer-modal-map');
    const map = L.map(mapEl).setView([latlng.lat, latlng.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
    const marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
    marker.bindPopup(`<div class=\"p-2\"><h3 class=\"font-semibold\">${offer?.title || ''}</h3><p class=\"text-sm text-gray-500\">${offer?.location || ''}</p></div>`).openPopup();
    setTimeout(() => map.invalidateSize(), 150);
  } catch {}
}
