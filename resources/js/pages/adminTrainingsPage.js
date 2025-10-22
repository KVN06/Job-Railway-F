import { listTrainings } from '../api/trainings.js';
import { requireRole } from '../auth/permissions.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

const DATE_OPTS = { day:'2-digit', month:'2-digit', year:'numeric' };
const TIME_OPTS = { hour:'2-digit', minute:'2-digit' };

function parseDate(s){ if(!s) return null; const d=new Date(s); return isNaN(d.getTime())?null:d; }

function statusBadge(item){
  const now = new Date();
  const start = parseDate(item.start_date);
  const end = parseDate(item.end_date);
  let text='Sin fecha', icon='fa-question-circle', bg='bg-gray-100', color='text-gray-700';
  if (start && end){
    if (now >= start && now <= end){ text='En curso'; icon='fa-circle-play'; bg='bg-gradient-to-r from-green-100 to-green-200'; color='text-green-700'; }
    else if (now < start){ text='Próxima'; icon='fa-clock'; bg='bg-gradient-to-r from-blue-100 to-blue-200'; color='text-blue-700'; }
    else { text='Finalizada'; icon='fa-circle-check'; bg='bg-gray-100'; color='text-gray-600'; }
  } else if (start && now < start){ text='Próxima'; icon='fa-clock'; bg='bg-gradient-to-r from-blue-100 to-blue-200'; color='text-blue-700'; }
  else if (end && now > end){ text='Finalizada'; icon='fa-circle-check'; bg='bg-gray-100'; color='text-gray-600'; }
  return h('span',{class:`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg ${bg} ${color} shadow-sm`}, h('i',{class:`fas ${icon} mr-1.5`}), text);
}

function row(item){
  const title = item.title || item.name || '—';
  const provider = item.provider || '';
  const createdAt = parseDate(item.created_at);
  const start = parseDate(item.start_date);
  const end = parseDate(item.end_date);
  const link = item.link || item.url || '';

  return h('tr',{class:'hover:bg-gray-50 transition-colors duration-200'},
    h('td',{class:'px-6 py-4'},
      h('div',{class:'flex items-center space-x-3'},
        h('div',{class:'w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0'}, h('i',{class:'fas fa-graduation-cap text-purple-600'})),
        h('div',{class:'max-w-xs'}, h('div',{class:'text-sm font-semibold text-gray-900'}, title), h('div',{class:'text-xs text-gray-500 mt-1 truncate'}, (item.description||'').slice(0,60)))
      )
    ),
    h('td',{class:'px-6 py-4 whitespace-nowrap'}, provider
      ? h('div',{class:'flex items-center text-sm text-gray-700'}, h('i',{class:'fas fa-university text-gray-400 mr-2'}), provider)
      : h('span',{class:'text-xs text-gray-400 italic'}, 'No especificado')
    ),
    h('td',{class:'px-6 py-4 whitespace-nowrap'},
      h('div',{class:'text-sm space-y-1'},
        start ? h('div',{class:'flex items-center text-green-600'}, h('i',{class:'fas fa-play-circle mr-1 text-xs'}), h('span',{class:'font-medium'}, start.toLocaleDateString('es-ES', DATE_OPTS))) : null,
        end ? h('div',{class:'flex items-center text-red-600'}, h('i',{class:'fas fa-stop-circle mr-1 text-xs'}), h('span',{class:'font-medium'}, end.toLocaleDateString('es-ES', DATE_OPTS))) : null,
        (!start && !end) ? h('span',{class:'text-xs text-gray-400 italic'}, 'Sin fechas') : null
      )
    ),
    h('td',{class:'px-6 py-4 whitespace-nowrap'}, link
      ? h('a',{href:link,target:'_blank',class:'inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-all'}, h('i',{class:'fas fa-external-link-alt mr-1.5'}),'Ver enlace')
      : h('span',{class:'inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs'}, h('i',{class:'fas fa-minus-circle mr-1.5'}),'Sin enlace')
    ),
    h('td',{class:'px-6 py-4 whitespace-nowrap'}, statusBadge(item)),
    h('td',{class:'px-6 py-4 whitespace-nowrap'},
      createdAt ? h('div',null,
        h('div',{class:'text-sm text-gray-700 font-medium'}, h('i',{class:'far fa-calendar-alt text-gray-400 mr-1'}), createdAt.toLocaleDateString('es-ES', DATE_OPTS)),
        h('div',{class:'text-xs text-gray-500 mt-0.5'}, h('i',{class:'far fa-clock text-gray-400 mr-1'}), createdAt.toLocaleTimeString('es-ES', TIME_OPTS))
      ) : h('span',{class:'text-sm text-gray-500'}, '—')
    ),
    h('td',{class:'px-6 py-4 whitespace-nowrap'},
      h('div',{class:'flex items-center space-x-2'},
        h('a',{href:`/html/training/index.html?id=${encodeURIComponent(item.id)}`,class:'w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all',title:'Ver detalles'}, h('i',{class:'fas fa-eye text-sm'})),
  h('a',{href:`/html/admin/trainings/edit.html?id=${encodeURIComponent(item.id)}`,class:'w-8 h-8 flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-all',title:'Editar'}, h('i',{class:'fas fa-edit text-sm'})),
        h('button',{type:'button',class:'w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all',title:'Eliminar',onclick:()=>alert('Eliminar no está habilitado en la versión estática.')}, h('i',{class:'fas fa-trash-alt text-sm'}))
      )
    )
  );
}

function statsSection(){
  const vTotal = h('p',{class:'text-2xl font-bold text-gray-800'}, '—');
  const vWithLink = h('p',{class:'text-2xl font-bold text-gray-800'}, '—');
  const vActive = h('p',{class:'text-2xl font-bold text-gray-800'}, '—');
  const vProviders = h('p',{class:'text-2xl font-bold text-gray-800'}, '—');
  const host = h('div',{class:'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'},
    statCard('Total Capacitaciones','fa-graduation-cap','from-purple-400 to-purple-600', vTotal),
    statCard('Con Enlace','fa-link','from-blue-400 to-blue-600', vWithLink),
    statCard('Activas','fa-calendar-check','from-green-400 to-green-600', vActive),
    statCard('Proveedores','fa-building','from-orange-400 to-orange-600', vProviders),
  );
  return { host, set(values){
    const { total, withLink, active, providers } = values || {};
    vTotal.textContent = total != null ? String(total) : '—';
    vWithLink.textContent = withLink != null ? String(withLink) : '—';
    vActive.textContent = active != null ? String(active) : '—';
    vProviders.textContent = providers != null ? String(providers) : '—';
  } };
}

function statCard(label, icon, gradient, valueEl){
  return h('div',{class:'card-enhanced p-5 hover-lift'},
    h('div',{class:'flex items-center justify-between'},
      h('div',null, h('p',{class:'text-sm text-gray-500 mb-1'}, label), valueEl),
      h('div',{class:`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}, h('i',{class:`fas ${icon} text-white text-xl`}))
    )
  );
}

function headerBar(){
  return h('div',{class:'flex flex-col md:flex-row md:items-center md:justify-between mb-6'},
    h('div',null, h('h1',{class:'text-3xl font-bold text-gray-800 mb-2'},'Capacitaciones'), h('p',{class:'text-gray-600'},'Administra los cursos y programas de formación')),
    h('div',{class:'mt-4 md:mt-0'}, h('a',{href:'/html/admin/trainings/create.html',class:'inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-soft transition-all duration-300 hover-lift font-medium'}, h('i',{class:'fas fa-plus-circle text-lg'}), h('span',null,'Nueva Capacitación')))
  );
}

function tableHost(){
  const tbody = h('tbody',{class:'bg-white divide-y divide-gray-200'});
  const host = h('div',{class:'card-enhanced overflow-hidden'},
    h('div',{class:'overflow-x-auto'},
      h('table',{class:'min-w-full divide-y divide-gray-200'},
        h('thead',{class:'bg-gradient-to-r from-gray-50 to-gray-100'}, h('tr',null,
          th('Título','fa-heading'), th('Proveedor','fa-building'), th('Fechas','fa-calendar-alt'), th('Enlace','fa-link'), th('Estado','fa-signal'), th('Creación','fa-clock'), th('Acciones','fa-cog')
        )),
        tbody
      )
    )
  );
  return { host, tbody };
}

function th(label, icon){ return h('th',{class:'px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider'}, h('i',{class:`fas ${icon} mr-2 text-purple-500`}), label); }

function pager(){
  const wrap = h('div',{class:'bg-gray-50 px-6 py-4 border-t border-gray-200'});
  const summary = h('div',{class:'text-sm text-gray-700'});
  const prev = h('button',{class:'px-3 py-1.5 rounded border text-sm mr-2 disabled:opacity-50', disabled:true}, 'Anterior');
  const next = h('button',{class:'px-3 py-1.5 rounded border text-sm disabled:opacity-50'}, 'Siguiente');
  const right = h('div', null, prev, next);
  const bar = h('div',{class:'flex flex-col sm:flex-row items-center justify-between gap-4'}, summary, right);
  wrap.appendChild(bar);
  return { host: wrap, summary, prev, next };
}

async function fetchPage(page=1, per_page=10){
  const res = await listTrainings({ page, per_page }).catch(()=>({ data:[], meta:{ current_page:1, last_page:1, per_page, total:0 } }));
  const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.items)?res.items:[]));
  const meta = res?.meta || { current_page: page, last_page: 1, per_page, total: (Array.isArray(res)?res.length:(Array.isArray(res?.data)?res.data.length:0)) };
  return { data, meta };
}

function computeStats(items, totalFromMeta){
  const withLink = items.filter(x => !!(x.link || x.url)).length;
  const now = new Date();
  const active = items.filter(x => { const end = parseDate(x.end_date); return !!(end && end >= now); }).length;
  const providers = new Set(items.map(x => x.provider).filter(Boolean)).size;
  return { total: totalFromMeta ?? items.length, withLink, active, providers };
}

export async function mountAdminTrainingsIndex(root){
  const container = root || document.querySelector('[data-page="admin-trainings-index"]');
  if (!container) return;
  const { allowed } = await requireRole('admin');
  if (!allowed) return;
  container.innerHTML = '';

  const header = headerBar();
  const stats = statsSection();
  const table = tableHost();
  const p = pager();

  const frame = h('div',{class:'animate-fade-in-up'}, header, stats.host, table.host, p.host);
  container.appendChild(frame);

  let page = 1, per_page = 10, last = 1, total = 0;

  async function load(){
    table.tbody.innerHTML = '';
    const { data, meta } = await fetchPage(page, per_page);
    last = meta?.last_page || 1; total = meta?.total ?? data.length;
    // Stats: total global + page-derived metrics
    const s = computeStats(data, total);
    stats.set(s);
    if (!data.length){
      table.tbody.appendChild(h('tr',null, h('td',{colspan:'7', class:'px-6 py-12 text-center'}, h('div',{class:'flex flex-col items-center justify-center'}, h('div',{class:'w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'}, h('i',{class:'fas fa-graduation-cap text-3xl text-gray-400'})), h('p',{class:'text-gray-500 font-medium'},'No hay capacitaciones disponibles'), h('p',{class:'text-sm text-gray-400 mt-1'},'Crea una nueva capacitación para comenzar'), h('a',{href:'/html/admin/trainings/create.html',class:'mt-4 inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-all'}, h('i',{class:'fas fa-plus mr-2'}),'Nueva Capacitación')) )));
    } else {
      for (const it of data) table.tbody.appendChild(row(it));
    }
    // Pager
    p.summary.textContent = `Mostrando ${Math.min(((meta.current_page-1)*meta.per_page)+1, total)} a ${Math.min(meta.current_page*meta.per_page, total)} de ${total} resultados`;
    p.prev.disabled = (meta.current_page<=1);
    p.next.disabled = (meta.current_page>=last);
  }

  p.prev.addEventListener('click', ()=>{ if (page>1){ page--; load(); } });
  p.next.addEventListener('click', ()=>{ if (page<last){ page++; load(); } });

  await load();
}

export function autoMount(){ const host=document.querySelector('[data-page="admin-trainings-index"]'); if(host) mountAdminTrainingsIndex(host); }
