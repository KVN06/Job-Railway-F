import { getClassified, deleteClassified } from '../api/classifieds.js';
import { listFavorites, toggleFavorite } from '../api/favorites.js';
import { getCurrentUser } from '../api/authUser.js';

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') el.className = v; else el.setAttribute(k, v);
  }
  for (const ch of children.flat()) {
    if (ch == null) continue;
    el.appendChild(ch instanceof Node ? ch : document.createTextNode(String(ch)));
  }
  return el;
}

function getIdFromQuery(root) {
  const q = new URL(window.location.href).searchParams;
  return root?.getAttribute('data-id') || q.get('id');
}

export async function mountClassifiedDetail(root, id) {
  if (!root) return;
  root.innerHTML = '';
  const loading = h('p', { class: 'text-slate-500' }, 'Cargando clasificado...');
  root.appendChild(loading);
  try {
    const cid = id || getIdFromQuery(root);
    if (!cid) { loading.textContent = 'Falta id (?id=123)'; return; }
    const [res, me, favs] = await Promise.all([
      getClassified(cid),
      (async()=>{ try { return await getCurrentUser(); } catch { return null; } })(),
      (async()=>{ try { const r = await listFavorites({ type:'classified', per_page: 200 }); return Array.isArray(r)?r:(Array.isArray(r?.data)?r.data:[]); } catch { return []; } })(),
    ]);
    loading.remove();
    const item = res?.data ?? res;

    const favSet = new Set(favs.map(f => `classified:${f.classified_id || f.item_id || f.id}`));
    const isOwner = !!(me && ((me.unemployed?.id && me.unemployed.id === item.unemployed_id) || (me.company?.id && me.company.id === item.company_id)));
    const isFav = favSet.has(`classified:${item.id}`);
    const companyIcon = (item.company || item.company_id) ? 'fas fa-building' : 'fas fa-user';
    const entityName = item.company?.business_name || item.company?.name || item.unemployed?.name || 'Clasificado';
    const categories = Array.isArray(item.categories) ? item.categories : [];
    const createdAt = item.created_at ? timeAgo(item.created_at) : '';

    // Header con info
    const header = h('div', { class:'flex justify-between items-start mb-6' },
      h('div', { class:'flex-1' },
        h('h1', { class:'text-3xl font-bold text-gray-900 mb-4' },
          h('i', { class:'fas fa-bullhorn text-blue-700 mr-3' }), item.title || `Clasificado #${cid}`
        ),
        h('div', { class:'flex items-center mb-4' },
          h('div', { class:'w-12 h-12 gradient-primary rounded-full flex items-center justify-center mr-3', style:'background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);' }, h('i', { class: companyIcon + ' text-white' })),
          h('div', null,
            h('p', { class:'text-lg font-semibold text-gray-800' }, entityName),
            h('span', { class:'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium' }, (item.company ? 'Empresa verificada' : 'Usuario individual'))
          )
        ),
        h('div', { class:'flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4' },
          h('div', { class:'flex items-center' }, h('i', { class:'fas fa-map-marker-alt text-blue-700 mr-2' }), h('span', null, item.location || '—')),
          h('div', { class:'flex items-center' }, h('i', { class:'fas fa-clock text-gray-600 mr-2' }), h('span', null, createdAt ? `Publicado ${createdAt}` : ''))
        )
      ),
      h('div', { class:'flex flex-col items-end space-y-2' },
        (!isOwner && me?.unemployed) ? favButton(isFav, async (btn)=>{
          const { isFavorite } = await toggleFavorite({ type:'classified', id: item.id });
          btn.classList.toggle('bg-red-100', isFavorite);
          btn.classList.toggle('text-red-600', isFavorite);
          btn.classList.toggle('border-red-200', isFavorite);
          btn.classList.toggle('bg-gray-100', !isFavorite);
          btn.classList.toggle('text-gray-400', !isFavorite);
          btn.classList.toggle('border-gray-200', !isFavorite);
        }) : null,
        (isOwner) ? h('div', { class:'flex space-x-2' },
          h('a', { href:`/html/classifieds/edit.html?id=${encodeURIComponent(item.id)}`, class:'bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors' }, 'Editar'),
          h('button', { class:'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors', onclick: async ()=>{ if(confirm('¿Eliminar este clasificado?')) { try { await deleteClassified(item.id); location.href = '/html/classifieds/index.html?success=Clasificado%20eliminado'; } catch(e){ alert(e?.data?.message||e.message||'No se pudo eliminar'); } } } }, 'Eliminar')
        ) : null
      )
    );

    // Categorías
    const catsWrap = categories.length ? h('div', { class:'mb-6' },
      h('h3', { class:'text-lg font-semibold text-gray-800 mb-2' }, 'Categorías'),
      h('div', { class:'flex flex-wrap gap-2' }, ...categories.map(c => h('span', { class:'inline-block bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold' }, c.name || c.title || '')))
    ) : null;

    // Descripción
    const desc = h('div', { class:'mb-6' },
      h('h3', { class:'text-lg font-semibold text-gray-800 mb-3' }, 'Descripción'),
      h('div', { class:'prose max-w-none text-gray-700 whitespace-pre-wrap' }, (item.description || ''))
    );

    // Render principal
    const article = h('article', { class:'card-enhanced p-8 mb-6' }, header, catsWrap, desc);
    root.appendChild(article);

    // Sidebar dinámico (detalles + contactar)
    renderSidebar(document.getElementById('classified-sidebar'), item, me, isOwner);

    // Mapa Leaflet si existe asset
    initMapFor(item);
  } catch (e) {
    loading.textContent = `Error: ${e?.data?.message || e.message}`;
  }
}

export function autoMount() {
  const el = document.querySelector('[data-page="classified-detail"]');
  if (el) mountClassifiedDetail(el);
}

// UI helpers
function favButton(isFav, onToggle) {
  const btn = h('button', { class:`favorite-btn w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover-lift border ${isFav?'bg-red-100 text-red-600 border-red-200':'bg-gray-100 text-gray-400 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'}` }, h('i', { class:'fas fa-heart text-lg' }));
  btn.addEventListener('click', async (e)=>{ e.preventDefault(); btn.disabled = true; try { await onToggle(btn); } finally { btn.disabled=false; } });
  return btn;
}

function renderSidebar(container, item, me, isOwner) {
  if (!container) return;
  container.innerHTML = '';
  const details = h('div', { class:'bg-white rounded-lg shadow-sm p-6 mb-6 border border-blue-900/30' },
    h('h3', { class:'text-lg font-semibold text-gray-800 mb-4' }, 'Detalles'),
    h('div', { class:'space-y-3' },
      item.salary ? h('div', { class:'flex justify-between' }, h('span', { class:'font-medium text-gray-700' }, 'Precio/Salario:'), h('span', { class:'text-green-600 font-semibold' }, formatCurrency(item.salary))) : null,
      h('div', { class:'flex justify-between' }, h('span', { class:'font-medium text-gray-700' }, 'Ubicación:'), h('span', { class:'text-gray-600' }, item.location || '—')),
      h('div', { class:'flex justify-between' }, h('span', { class:'font-medium text-gray-700' }, 'Publicado:'), h('span', { class:'text-gray-600' }, formatDate(item.created_at))) ,
      h('div', { class:'flex justify-between' }, h('span', { class:'font-medium text-gray-700' }, 'Tipo:'), h('span', { class:'text-gray-600' }, (item.company ? 'Empresa' : 'Particular')))
    )
  );
  container.appendChild(details);
  if (me && !isOwner) {
    container.appendChild(
      h('div', { class:'bg-white rounded-lg shadow-sm p-6 border border-blue-900/30' },
        h('a', { href:'/html/forms/message-form.html', class:'w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center block' }, 'Contactar')
      )
    );
  }
}

function initMapFor(item) {
  if (typeof L === 'undefined') return; // Leaflet no cargado
  const mapEl = document.getElementById('classified-map');
  if (!mapEl) return;
  let lat = 2.4448, lng = -76.6147; // Popayán por defecto
  const coords = String(item?.geolocation || '').split(',').map(s=>parseFloat(s.trim()));
  if (coords.length === 2 && !Number.isNaN(coords[0]) && !Number.isNaN(coords[1]) && coords[0]!==0 && coords[1]!==0) {
    lat = coords[0]; lng = coords[1];
  } else {
    const hint = document.getElementById('classified-map-hint'); if (hint) hint.style.display = '';
  }
  const map = L.map('classified-map').setView([lat, lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
  const popup = [`<div class="p-2">`,
    `<h3 class="font-semibold text-gray-800">${escapeHtml(item?.title||'Clasificado')}</h3>`,
    item?.company?.name ? `<p class="text-gray-600">${escapeHtml(item.company.name)}</p>` : (item?.unemployed?.name ? `<p class="text-gray-600">${escapeHtml(item.unemployed.name)}</p>` : ''),
    item?.location ? `<p class="text-sm text-gray-500">${escapeHtml(item.location)}</p>` : '',
    `<p class="text-xs text-blue-500">Coords: ${lat}, ${lng}</p>`,
    `</div>`].join('');
  L.marker([lat, lng]).addTo(map).bindPopup(popup).openPopup();
}

// Utils
function timeAgo(date) { try { const d = new Date(date); const s = Math.floor((Date.now()-d.getTime())/1000); if (s<60) return `hace ${s}s`; const m=Math.floor(s/60); if(m<60) return `hace ${m}m`; const h=Math.floor(m/60); if(h<24) return `hace ${h}h`; const dd=Math.floor(h/24); if(dd<7) return `hace ${dd}d`; return d.toLocaleDateString(); } catch { return ''; } }
function formatCurrency(n) { try { return Number(n).toLocaleString(undefined,{ style:'currency', currency:'USD' }); } catch { return `$${n}`; } }
function formatDate(date) { try { return new Date(date).toLocaleDateString(); } catch { return ''; } }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
