import { listClassifieds, countClassifieds, countClassifiedsToday, deleteClassified } from '../api/classifieds.js';
import { listFavorites, toggleFavorite } from '../api/favorites.js';
import { listContacts } from '../api/contacts.js';
import { getCurrentUser } from '../api/authUser.js';
import { isUnemployed as hasUnemployedRole } from '../auth/permissions.js';
import { listCategories } from '../api/categories.js';

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v === null || v === undefined) continue; // no escribir atributos booleanos falsos
    if (k === 'class') el.className = v; else el.setAttribute(k, v);
  }
  for (const ch of children.flat()) {
    if (ch == null) continue;
    el.appendChild(ch instanceof Node ? ch : document.createTextNode(String(ch)));
  }
  return el;
}

function card(it, ctx) {
  const { me, onDelete, favSet, onToggleFavorite, isCesante } = ctx;
  const isOwner = !!(me && ((me.unemployed?.id && me.unemployed.id === it.unemployed_id) || (me.company?.id && me.company.id === it.company_id)));
  const salaryText = it.salary
    ? `$${Number(it.salary).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2})}`
    : 'A convenir';
  const cats = Array.isArray(it.categories) ? it.categories : [];
  const catsWrap = h('div', { class: 'flex flex-wrap gap-2' }, ...cats.map(c => h('span', { class: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold' }, h('i', { class:'fas fa-tag' }), c.name||c.title||'')));
  const companyIcon = (it.company || it.company_id) ? 'fas fa-building' : 'fas fa-user';
  const entityName = it.company?.business_name || it.company?.name || it.unemployed?.name || 'Clasificado';
  const createdAt = it.created_at ? timeAgoLong(it.created_at) : '';

  // Acción primaria (ver detalles) y acciones de propietario opcionales
  const primaryCTA = h('a', { href: `/html/classifieds/show.html?id=${encodeURIComponent(it.id)}`, class: 'w-full btn-primary inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white hover:opacity-95 transition' }, h('i', {class:'fas fa-eye'}), 'Ver detalles');
  const ownerActions = isOwner ? h('div', { class:'mt-3 grid grid-cols-2 gap-2' },
    h('a', { href: `/html/classifieds/edit.html?id=${encodeURIComponent(it.id)}`, class: 'inline-flex items-center justify-center px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700 text-sm' }, h('i', { class:'fas fa-edit mr-2' }), 'Editar'),
    h('button', { class:'inline-flex items-center justify-center px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm', onclick: (e)=>{ e.preventDefault(); onDelete?.(it); } }, h('i', {class:'fas fa-trash mr-2'}), 'Eliminar')
  ) : null;

  // Botón de favorito (solo cesante, no propietario)
  let favoriteBtn = null;
  if (isCesante && !isOwner) {
    const key = `classified:${it.id}`;
    const isFav = !!favSet?.has?.(key);
    favoriteBtn = h('button', { class: [
        'favorite-btn w-full h-12 rounded-xl flex items-center justify-center transition-all duration-300',
        isFav ? 'bg-red-100 text-red-600 border-2 border-red-200'
             : 'bg-white text-gray-500 border-2 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
      ].join(' ')
    }, h('i', { class:'fas fa-heart text-lg mr-2' }), h('span', null, isFav ? 'Guardado' : 'Guardar'));
    favoriteBtn.addEventListener('click', (e)=>{ e.preventDefault(); onToggleFavorite?.(it, favoriteBtn); });
  }

  return h('article', { class: 'card-surface rounded-3xl overflow-hidden p-0' },
    h('div', { class:'flex flex-col md:flex-row' },
      // Columna izquierda
      h('div', { class:'flex-1 p-6 space-y-5' },
        h('div', { class:'flex items-start justify-between gap-4' },
          h('div', { class:'space-y-3' },
            h('a', { href: `/html/classifieds/show.html?id=${encodeURIComponent(it.id)}`, class:'group inline-flex items-center gap-2' },
              h('span', { class:'text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition' }, it.title || 'Clasificado'),
              h('i', { class:'fas fa-arrow-right text-blue-600 opacity-0 group-hover:opacity-100 transition' })
            ),
            h('div', { class:'flex items-center gap-3' },
              h('span', { class:'inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white' }, h('i', { class: companyIcon })),
              h('div', null,
                h('p', { class:'text-gray-800 font-semibold' }, entityName),
                h('p', { class:'text-sm text-gray-500 flex items-center gap-1' }, h('i', { class:'fas fa-shield-check text-emerald-500' }), (it.company ? 'Empresa verificada' : 'Publicado por la comunidad'))
              )
            )
          ),
          h('span', { class:'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold' }, h('i', { class:'fas fa-bullhorn' }), 'Clasificado')
        ),
        h('div', { class:'flex flex-wrap items-center gap-3 text-sm text-gray-600' },
          h('span', { class:'inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100' }, h('i', { class:'fas fa-location-dot text-blue-600' }), it.location || 'Ubicación no especificada'),
          h('span', { class:'inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100' }, h('i', { class:'fas fa-clock text-gray-500' }), createdAt),
          (!it.salary ? h('span', { class: 'inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-slate-600' }, h('i', { class: 'fas fa-comments' }), 'A convenir') : null)
        ),
        catsWrap,
        h('p', { class:'text-gray-600 leading-relaxed' }, truncate(stripHtml(it.description||''), 220))
      ),
      // Columna derecha: tarjeta de precio (solo si hay salario) + CTA
      h('div', { class:'md:w-72 p-6 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between gap-4' },
        favoriteBtn,
        (it.salary ? h('div', { class:'bg-white rounded-2xl border border-gray-200 p-4 shadow-sm' },
          h('p', { class:'text-xs text-gray-500 uppercase font-semibold mb-2' }, 'Oferta económica'),
          h('p', { class:'text-2xl font-bold text-gray-900' }, salaryText),
          h('p', { class:'text-xs text-gray-500 mt-1' }, 'Referencial, puede variar según experiencia')
        ) : null),
        primaryCTA,
        ownerActions
      )
    )
  );
}

export async function mountClassifieds(root) {
  if (!root) return;
  // Elementos externos a la lista
  const hero = document.getElementById('classifieds-hero');
  const filtersEl = document.getElementById('classifieds-filters');
  const loadMoreWrap = document.getElementById('classifieds-load-more');

  // Estado
  let me = null;
  let favSet = new Set(); // keys: `classified:<id>`
  let page = 1;
  const per_page = 8;
  let reachedEnd = false;
  let currentFilters = readFiltersFromURL();
  let categories = [];

  // Pre-carga usuario y favoritos
  try { me = await getCurrentUser(); } catch {}
  // Detección tolerante de cesante (rol + relación + hints locales)
  const storedRole = (localStorage.getItem('display_role')||localStorage.getItem('selected_role')||localStorage.getItem('pending_role')||'').toLowerCase();
  const hintUnemployed = ['unemployed','cesante','desempleado','postulante','candidate','jobseeker'].includes(storedRole);
  const relationUnemployed = !!(me?.unemployed?.id || me?.unemployed_id || me?.profile?.unemployed?.id);
  const isCesante = hasUnemployedRole(me) || relationUnemployed || hintUnemployed;
  try {
    const favs = await listFavorites({ type: 'classified', per_page: 200 });
    const favItems = Array.isArray(favs) ? favs : (Array.isArray(favs?.data) ? favs.data : []);
    for (const f of favItems) {
      const id = f.classified_id || f.item_id || f.id;
      if (id != null) favSet.add(`classified:${id}`);
    }
  } catch {}

  // Hero dinámico con estadísticas
  try {
    const [total, today] = await Promise.all([
      countClassifieds(apiParamsFrom(currentFilters)),
      countClassifiedsToday(),
    ]);
    renderHero(hero, { me, total, today, favCount: Array.from(favSet).length });
  } catch {
    renderHero(hero, { me, total: null, today: null, favCount: Array.from(favSet).length });
  }

  // Filtros
  try { categories = await listCategories({ type: 'classified' }); } catch { categories = []; }

  const onFiltersSubmit = async (newFilters) => {
    currentFilters = newFilters || {};
    // Reiniciar listado con nuevos filtros
    page = 1; reachedEnd = false; root.innerHTML = '';
    await fetchAndAppend();
    // actualizar querystring
    updateURLWithFilters(currentFilters);
    // refrescar UI de filtros (chips y valores) y, si es posible, estadísticas del hero
    updateFiltersUI();
    try {
      const total = await countClassifieds(apiParamsFrom(currentFilters));
      renderHero(hero, { me, total, today: null, favCount: Array.from(favSet).length });
    } catch {}
  };

  function updateFiltersUI(){
    renderFilters(filtersEl, currentFilters, categories, onFiltersSubmit);
  }

  updateFiltersUI();

  // Listado inicial
  root.innerHTML = '';
  fetchAndAppend();

  // Load more button
  renderLoadMore(loadMoreWrap, async () => {
    if (reachedEnd) return; page += 1; await fetchAndAppend();
  });

  async function fetchAndAppend() {
    const loading = h('p', { class:'text-slate-500' }, 'Cargando clasificados...');
    if (!root.childElementCount) root.appendChild(loading);
    try {
    const apiParams = apiParamsFrom({ ...currentFilters, page, per_page, sort: 'created_at:desc' });
      const res = await listClassifieds(apiParams);
      let items = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);

      // Filtro cliente como respaldo si el backend no procesa todos los parámetros
      items = applyClientFilters(items, currentFilters);
      // Si hay búsqueda por texto, ordenar por una noción simple de relevancia
      if (currentFilters?.search) items = sortByRelevance(items, currentFilters.search);
      loading.remove();
      if (!items.length && !root.childElementCount) {
        return root.appendChild(h('p', { class:'text-slate-500' }, 'No se encontraron clasificados.'));
      }
  const grid = root.querySelector('.classifieds-grid') || h('div', { class:'classifieds-grid grid gap-6 animate-slide-in' });
      if (!grid.parentElement) root.appendChild(grid);
  const ctx = { me, isCesante, favSet, onToggleFavorite: handleToggleFavorite, onDelete: handleDelete, onView:()=>{} };
      for (const it of items) grid.appendChild(card(it, ctx));
      // Alcance de fin según paginado
      const meta = res?.meta || res?.pagination;
      if (meta?.current_page >= meta?.last_page || items.length < per_page) reachedEnd = true;
      updateLoadMore(loadMoreWrap, reachedEnd);
    } catch (e) {
      loading.textContent = `Error: ${e?.data?.message || e.message}`;
    }
  }

  async function handleToggleFavorite(it, btn) {
    btn.disabled = true;
    try {
      const { isFavorite } = await toggleFavorite({ type: 'classified', id: it.id });
      const key = `classified:${it.id}`;
      if (isFavorite) favSet.add(key); else favSet.delete(key);
      // actualizar botón
      btn.classList.toggle('bg-red-100', isFavorite);
      btn.classList.toggle('text-red-600', isFavorite);
      btn.classList.toggle('border-red-200', isFavorite);
      btn.classList.toggle('bg-white', !isFavorite);
      btn.classList.toggle('text-gray-500', !isFavorite);
      btn.classList.toggle('border-gray-200', !isFavorite);
      const label = btn.querySelector('span'); if (label) label.textContent = isFavorite ? 'Guardado' : 'Guardar';
    } catch (e) {
      alert(e?.data?.message || e.message || 'No se pudo cambiar favorito');
    } finally { btn.disabled = false; }
  }

  async function handleDelete(it) {
    if (!confirm('¿Eliminar este clasificado?')) return;
    try { await deleteClassified(it.id); location.reload(); } catch (e) { alert(e?.data?.message || e.message || 'No se pudo eliminar'); }
  }
}

export function autoMount() {
  const el = document.querySelector('[data-page="classifieds"]');
  if (el) mountClassifieds(el);
}

// Helpers UI
function renderHero(container, { me, total, today, favCount }) {
  if (!container) return;
  container.innerHTML = '';
  container.appendChild(h('div', { class:'gradient-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-soft' },
    h('div', { class:'absolute -top-20 -right-12 w-72 h-72 bg-white/10 blur-3xl rounded-full' }),
    h('div', { class:'absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-3xl rounded-full' }),
    h('div', { class:'relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-10' },
      h('div', { class:'flex-1 text-center lg:text-left space-y-6' },
        h('div', { class:'inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/30 text-white/90 text-sm uppercase tracking-wide' }, h('i', { class:'fas fa-bullhorn mr-2' }), 'Mercado de clasificados'),
        h('div', { class:'space-y-4' },
          h('h1', { class:'text-4xl md:text-5xl font-bold leading-tight' }, 'Descubre anuncios relevantes y oportunidades únicas'),
          h('p', { class:'text-white/80 text-lg max-w-3xl' }, 'Filtra por ubicación, categoría y palabras clave para encontrar rápidamente el clasificado que estás buscando. Guarda tus favoritos para hacer seguimiento cuando quieras.')
        ),
        h('div', { class:'flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-start justify-center' },
          me && (me.company || me.unemployed) ? h('a', { href:'/html/classifieds/create.html', class:'btn-primary text-white inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition' }, h('i', { class:'fas fa-plus-circle' }), 'Publicar clasificado') : null,
          me?.unemployed ? h('a', { href:'/html/favorites/index.html', class:'inline-flex items-center justify-center gap-2 bg-white/10 border border-white/40 text-white hover:bg-white/20 px-5 py-3 rounded-xl font-semibold' }, h('i', { class:'fas fa-heart' }), `Mis favoritos (${favCount||0})`) : null
        )
      ),
      h('div', { class:'w-full max-w-sm' },
        h('div', { class:'bg-white/10 rounded-3xl p-7 backdrop-blur space-y-5 text-white ring-1 ring-white/15' },
          h('p', { class:'text-white/70 text-sm uppercase tracking-widest' }, 'Resumen rápido'),
          h('div', { class:'flex items-center justify-between' }, h('div', null, h('p', { class:'text-sm text-white/70' }, 'Clasificados activos'), h('p', { class:'text-3xl font-bold' }, fmtNumber(total))), h('span', { class:'inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15' }, h('i', { class:'fas fa-layer-group' }))),
          h('div', { class:'flex items-center justify-between' }, h('div', null, h('p', { class:'text-sm text-white/70' }, 'Publicaciones de hoy'), h('p', { class:'text-3xl font-bold' }, fmtNumber(today))), h('span', { class:'inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15' }, h('i', { class:'fas fa-calendar-day' }))),
          h('div', { class:'flex items-center justify-between' }, h('div', null, h('p', { class:'text-sm text-white/70' }, 'Favoritos guardados'), h('p', { class:'text-3xl font-bold' }, fmtNumber(favCount))), h('span', { class:'inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15' }, h('i', { class:'fas fa-heart' })))
        )
      )
    )
  ));
}

function renderFilters(container, state, categories, onSubmit) {
  if (!container) return;
  container.innerHTML = '';
  const form = h('form', { class:'space-y-6' },
    h('div', { class:'flex flex-wrap items-center gap-3' },
      h('span', { class:'px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm inline-flex items-center gap-2' }, h('i', { class:'fas fa-filter' }), 'Filtrado inteligente'),
      state.location ? h('span', { class:'px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm' }, `Ubicación: ${state.location}`) : null,
      state.category_id ? h('span', { class:'px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm' }, `Categoría: ${categoryName(categories, state.category_id)}`) : null,
      state.search ? h('span', { class:'px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm' }, `Buscar: ${state.search}`) : null,
  (state.location||state.category_id||state.search) ? h('button', { type:'button', class:'text-sm text-gray-500 hover:text-gray-700 underline', onclick:(e)=>{ e.preventDefault(); const sel=form.querySelector('#category_id'); if(sel) sel.value=''; onSubmit({}); } }, 'Limpiar filtros') : null
    ),
  h('div', { class:'grid grid-cols-1 md:grid-cols-4 gap-4' },
      h('div', { class:'col-span-1' },
        h('label', { for:'location', class:'block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2' }, h('i', { class:'fas fa-location-dot text-blue-600' }), 'Ubicación'),
        h('input', { type:'text', id:'location', name:'location', value: state.location||'', placeholder:'Ciudad, país o remoto', class:'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all' })
      ),
      h('div', { class:'col-span-1' },
        h('label', { for:'category_id', class:'block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2' }, h('i', { class:'fas fa-tags text-purple-500' }), 'Categoría'),
        h('select', { id:'category_id', name:'category_id', class:'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all' },
          h('option', { value:'' }, 'Todas las categorías'),
          ...categories.map(c => h('option', { value:String(c.id), selected: String(state.category_id||'')===String(c.id) || undefined }, c.name || c.title || ''))
        )
      ),
      h('div', { class:'col-span-1' },
        h('label', { for:'search', class:'block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2' }, h('i', { class:'fas fa-magnifying-glass text-blue-500' }), 'Palabras clave'),
        h('input', { type:'text', id:'search', name:'search', value: state.search||'', placeholder:'Título, descripción o empresa', class:'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all' })
      ),
      h('div', { class:'col-span-1 flex items-end' },
        h('button', { type:'submit', class:'w-full btn-primary inline-flex items-center justify-center gap-2 text-white px-5 py-3 rounded-xl font-semibold transition' }, h('i', { class:'fas fa-search' }), 'Buscar clasificados')
      )
    )
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const rawLoc = (fd.get('location')||'').toString().trim();
    const rawCat = (fd.get('category_id')||'').toString().trim();
    const rawSearch = (fd.get('search')||'').toString().trim();
    const next = {
      location: rawLoc || undefined,
      category_id: rawCat || undefined,
      search: rawSearch || undefined,
    };
    onSubmit(next);
  });
  container.appendChild(form);
}

function renderLoadMore(container, onClick) {
  if (!container) return;
  container.innerHTML = '';
  const btn = h('button', { class:'px-5 py-2 rounded-xl btn-primary text-white hover:opacity-95 transition', onclick: onClick }, 'Cargar más');
  container.appendChild(btn);
}

function updateLoadMore(container, end) {
  if (!container) return;
  const btn = container.querySelector('button');
  if (!btn) return;
  btn.disabled = !!end;
  btn.textContent = end ? 'No hay más resultados' : 'Cargar más';
}

// Utils
function applyClientFilters(list, filters={}){
  try{
    let out = Array.isArray(list) ? [...list] : [];
    const { location, category_id, search } = filters || {};
    if (location) {
      const q = String(location).toLowerCase();
      out = out.filter(x => String(x.location||'').toLowerCase().includes(q));
    }
    if (category_id) {
      const idStr = String(category_id);
      out = out.filter(x => {
        const cats = Array.isArray(x.categories) ? x.categories : [];
        return cats.some(c => String(c.id)===idStr || String(c?.category_id)===idStr);
      });
    }
    if (search) {
      const q = String(search).toLowerCase();
      out = out.filter(x => {
        const title = String(x.title||'').toLowerCase();
        const desc = stripHtml(String(x.description||'').toLowerCase());
        const company = String(x.company?.name||x.company?.business_name||'').toLowerCase();
        return title.includes(q) || desc.includes(q) || company.includes(q);
      });
    }
    return out;
  } catch { return Array.isArray(list)?list:[]; }
}

function sortByRelevance(list, search){
  try{
    const q = String(search).toLowerCase();
    const score = (x)=>{
      const title = String(x.title||'').toLowerCase();
      const desc = stripHtml(String(x.description||'').toLowerCase());
      let s = 0;
      if (title === q) s += 100;
      if (title.includes(q)) s += 50;
      if (desc.includes(q)) s += 10;
      return s;
    };
    return [...list].sort((a,b)=> score(b)-score(a));
  } catch { return list; }
}

function apiParamsFrom(filters={}){
  const out = {};
  const f = filters || {};
  // Texto de búsqueda
  if (f.search) { out.search = f.search; out.q = f.search; }
  // Ubicación
  if (f.location) { out.location = f.location; out.city = f.location; }
  // Categoría
  if (f.category_id) { out.category_id = f.category_id; out.category = f.category_id; }
  // Paginación
  if (f.page) out.page = f.page;
  if (f.per_page) { out.per_page = f.per_page; out.perPage = f.per_page; }
  // Orden
  if (f.sort) out.sort = f.sort;
  // Includes por defecto (ayuda a scopes included())
  if (f.include) out.include = f.include; else out.include = 'company,unemployed,categories';
  return out;
}

function categoryName(list, id) {
  try {
    if (!id) return 'Todas';
    const arr = Array.isArray(list) ? list : [];
    const found = arr.find(c => String(c.id) === String(id));
    return found?.name || found?.title || 'Categoría';
  } catch { return 'Categoría'; }
}
function stripHtml(html) { const tmp = document.createElement('div'); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ''; }
function truncate(str, n) { if (!str) return ''; return str.length > n ? str.slice(0, n-1)+'…' : str; }
function timeAgoLong(date){
  try{
    const d = new Date(date); const diff = Math.floor((Date.now()-d.getTime())/1000);
    if (diff < 60) return `hace ${diff} segundos`;
    const m = Math.floor(diff/60); if (m < 60) return `hace ${m} ${m===1?'minuto':'minutos'}`;
    const h = Math.floor(m/60); if (h < 24) return `hace ${h} ${h===1?'hora':'horas'}`;
    const dd = Math.floor(h/24);
    if (dd < 7) return `hace ${dd} ${dd===1?'día':'días'}`;
    const wk = Math.floor(dd/7); if (dd < 30) return `hace ${wk} ${wk===1?'semana':'semanas'}`;
    const mon = Math.floor(dd/30); if (mon < 12) return `hace ${mon} ${mon===1?'mes':'meses'}`;
    const yr = Math.floor(mon/12); return `hace ${yr} ${yr===1?'año':'años'}`;
  } catch { return ''; }
}
function fmtNumber(n) { if (n==null) return '—'; try { return Number(n).toLocaleString(); } catch { return String(n); } }
function readFiltersFromURL() {
  const usp = new URLSearchParams(location.search);
  const val = (k)=>{ const v=usp.get(k); return (v==null||v==='')?undefined:v; };
  return { location: val('location'), category_id: val('category_id'), search: val('search') };
}
function updateURLWithFilters(f) {
  const usp = new URLSearchParams();
  if (f?.location) usp.set('location', f.location);
  if (f?.category_id) usp.set('category_id', f.category_id);
  if (f?.search) usp.set('search', f.search);
  const qs = usp.toString();
  const url = location.pathname + (qs?`?${qs}`:'');
  history.replaceState(null, '', url);
}
