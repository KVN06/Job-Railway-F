import { listJobOffers } from '../api/jobOffers.js';
import { requireRole } from '../auth/permissions.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}
const fmt = new Intl.NumberFormat('es-CO');

export async function mountAdminJobOffers(root){
  if(!root) return; root.innerHTML='';
  const { allowed } = await requireRole('admin');
  if (!allowed) return;
  const usp = new URLSearchParams(location.search);
  let page = parseInt(usp.get('page')||'1',10); if(page<1) page=1;
  const perPage = parseInt(usp.get('per_page')||'10',10);

  const header = h('div',{class:'mb-8'},
    h('div',{class:'flex flex-col md:flex-row md:items-center md:justify-between mb-6'},
      h('div',null,
        h('h1',{class:'text-3xl font-bold text-gray-800 mb-2'},'Ofertas Laborales'),
        h('p',{class:'text-gray-600'},'Gestiona todas las oportunidades de empleo')
      ),
      h('div',{class:'mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-soft'},
        h('i',{class:'fas fa-briefcase text-xl'}),
        h('div',null,
          h('p',{class:'text-xs text-green-100'},'Total de Ofertas'),
          h('p',{class:'text-2xl font-bold', id:'total'},'0')
        )
      )
    ),
    h('div',{class:'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'},
      stat('Total Ofertas','0','fa-briefcase','from-blue-400 to-blue-600'),
      stat('Empresas','0','fa-building','from-green-400 to-green-600'),
      stat('Con Salario','0','fa-money-bill-wave','from-purple-400 to-purple-600'),
      stat('Este Mes','0','fa-calendar-check','from-yellow-400 to-orange-500')
    )
  );
  root.appendChild(header);

  const tableWrap = h('div',{class:'card-enhanced overflow-hidden'});
  const table = h('table',{class:'min-w-full divide-y divide-gray-200'});
  table.innerHTML = `
    <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
      <tr>
        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><i class="fas fa-heading mr-2 text-green-500"></i>Título</th>
        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><i class="fas fa-building mr-2 text-green-500"></i>Empresa</th>
        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><i class="fas fa-map-marker-alt mr-2 text-green-500"></i>Ubicación</th>
        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><i class="fas fa-dollar-sign mr-2 text-green-500"></i>Salario</th>
        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><i class="fas fa-folder mr-2 text-green-500"></i>Categorías</th>
        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><i class="fas fa-calendar mr-2 text-green-500"></i>Fecha</th>
        <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"><i class="fas fa-cog mr-2 text-green-500"></i>Acciones</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200" id="tbody"></tbody>
  `;
  const tableOuter = h('div',{class:'overflow-x-auto'}, table);
  tableWrap.appendChild(tableOuter);
  const pager = h('div',{class:'bg-gray-50 px-6 py-4 border-t border-gray-200', id:'pager'});
  tableWrap.appendChild(pager);
  root.appendChild(tableWrap);

  await load();

  async function load(){
    const q = { per_page: perPage, page };
    const res = await listJobOffers(q);
    const arr = Array.isArray(res)?res:(Array.isArray(res?.data)?res.data:[]);
    const total = res?.meta?.total ?? res?.total ?? arr.length;
    const companySet = new Set(arr.map(x=>x.company_id || x.company?.id).filter(Boolean));
    const withSalary = arr.filter(x=> Number(x.salary)>0).length;
    const thisMonth = arr.filter(x=> inLastMonth(x.created_at)).length;
    header.querySelector('#total').textContent = fmt.format(total);
    const cards = header.querySelectorAll('.card-enhanced p.text-2xl');
    if (cards.length>=4){
      cards[0].textContent = fmt.format(total);
      cards[1].textContent = fmt.format(companySet.size);
      cards[2].textContent = fmt.format(withSalary);
      cards[3].textContent = fmt.format(thisMonth);
    }
    const tb = table.querySelector('#tbody'); tb.innerHTML='';
    if (!arr.length) {
      const tr = h('tr',null, h('td',{colspan:'7', class:'px-6 py-12 text-center'}, emptyState()));
      tb.appendChild(tr);
    } else {
      for (const it of arr) tb.appendChild(row(it));
    }
    renderPager(res?.meta, total);
  }

  function row(it){
    const created = it.created_at ? new Date(it.created_at) : null;
    const cats = Array.isArray(it.categories)?it.categories:[];
    const tr = h('tr',{class:'hover:bg-gray-50 transition-colors duration-200'});
    tr.appendChild(td(
      h('div',{class:'flex items-center space-x-3'},
        h('div',{class:'w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0'}, h('i',{class:'fas fa-briefcase text-green-600'})),
        h('div',null,
          h('div',{class:'text-sm font-semibold text-gray-900'}, it.title || '—'),
          h('div',{class:'text-xs text-gray-500 mt-1 truncate max-w-xs'}, truncate(stripHtml(it.description||''),60))
        )
      )
    ));
    tr.appendChild(td(
      h('div',{class:'flex items-start space-x-2'},
        h('div',{class:'w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'}, h('i',{class:'fas fa-building text-blue-600 text-xs'})),
        h('div',null,
          h('div',{class:'text-sm font-medium text-gray-900'}, it.company?.user?.name || it.company?.name || 'N/A'),
          h('div',{class:'text-xs text-gray-500'}, it.company?.user?.email || '')
        )
      )
    ));
    tr.appendChild(td( cellIcon('fa-location-dot', it.location || '—') ));
    tr.appendChild(td( Number(it.salary)>0 ? h('div',{class:'flex items-center text-sm font-semibold text-green-600'}, h('i',{class:'fas fa-money-bill-wave mr-2'}), `$${fmt.format(it.salary)}`) : h('span',{class:'inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg'}, h('i',{class:'fas fa-minus-circle mr-1'}), 'No especificado') ));
    tr.appendChild(td( cats.length? h('div',{class:'flex flex-wrap gap-1 max-w-xs'}, ...cats.map(c=>h('span',{class:'inline-block bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg px-2.5 py-1 text-xs font-medium text-blue-700 shadow-sm'}, h('i',{class:'fas fa-tag text-blue-500 mr-1'}), c.name || c))) : h('span',{class:'text-xs text-gray-400 italic'},'Sin categorías') ));
    tr.appendChild(td(
      h('div',{class:'text-sm text-gray-700 font-medium'}, h('i',{class:'far fa-calendar-alt text-gray-400 mr-1'}), created?fmtDate(created):'—'),
      h('div',{class:'text-xs text-gray-500 mt-0.5'}, h('i',{class:'far fa-clock text-gray-400 mr-1'}), created?fmtTime(created):'—')
    ));
    tr.appendChild(td(
      h('div',{class:'flex items-center space-x-2'},
        actionBtn('fa-eye','Ver oferta', `/html/job-offers/show.html?id=${encodeURIComponent(it.id)}`, true),
        deleteBtn(it.id)
      )
    ));
    return tr;
  }

  function renderPager(meta,total){
    pager.innerHTML='';
    const last = (meta?.last_page ?? Math.ceil((total||0)/perPage)) || 1;
    const nav = h('div',{class:'flex items-center justify-between'});
    const showing = h('div',{class:'text-sm text-gray-700'}, `Mostrando ${((page-1)*perPage)+1} a ${Math.min(page*perPage,total)} de ${total} resultados`);
    const prev = h('a',{class:`px-3 py-2 rounded border ${page>1?'text-gray-700 hover:bg-gray-100':'text-gray-400 cursor-not-allowed'}`, href: page>1? setQuery({page:page-1}):'#'}, 'Anterior');
    const next = h('a',{class:`px-3 py-2 rounded border ${page<last?'text-gray-700 hover:bg-gray-100':'text-gray-400 cursor-not-allowed'}`, href: page<last? setQuery({page:page+1}):'#'}, 'Siguiente');
    nav.appendChild(showing); nav.appendChild(h('div',null, `Página ${page} de ${last}`)); nav.appendChild(h('div',null, prev)); nav.appendChild(h('div',null, next));
    pager.appendChild(nav);
  }
}

function stat(label,value,icon,gradient){
  return h('div',{class:'card-enhanced p-5 hover-lift'},
    h('div',{class:'flex items-center justify-between'},
      h('div',null, h('p',{class:'text-sm text-gray-500 mb-1'}, label), h('p',{class:'text-2xl font-bold text-gray-800'}, value)),
      h('div',{class:`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}, h('i',{class:`fas ${icon} text-white text-xl`}))
    )
  );
}
function td(...children){ return h('td',{class:'px-6 py-4'}, ...children); }
function cellIcon(icon, txt){ return h('div',{class:'flex items-center text-sm text-gray-700'}, h('i',{class:`fas ${icon} text-gray-400 mr-2`}), txt); }
function actionBtn(icon,title,href,blank=false){ const a=h('a',{href, title, class:'w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all hover-lift'}); a.appendChild(h('i',{class:`fas ${icon} text-sm`})); if(blank) a.target='_blank'; return a; }
function deleteBtn(id){ const btn=h('button',{class:'w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all hover-lift', title:'Eliminar oferta'}, h('i',{class:'fas fa-trash-alt text-sm'})); btn.addEventListener('click',()=>{ if(confirm('¿Eliminar esta oferta laboral?')) alert('Esta versión estática no puede eliminar. Implementa DELETE si el backend lo permite.'); }); return btn; }
function stripHtml(s){ const el=document.createElement('div'); el.innerHTML=s||''; return el.textContent||el.innerText||''; }
function truncate(s,n){ if(!s) return ''; return s.length>n? s.slice(0,n-1)+'…' : s; }
function fmtDate(d){ return d.toLocaleDateString(); }
function fmtTime(d){ return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }); }
function inLastMonth(v){ if(!v) return false; const d=new Date(v).getTime(); const now=Date.now(); const monthAgo= now - 30*24*3600*1000; return d>=monthAgo; }
function setQuery(p){ const url=new URL(location.href); for(const[k,v]of Object.entries(p)) url.searchParams.set(k,v); return url.toString(); }

export function autoMount(){ const host=document.querySelector('[data-page="admin-job-offers-index"]'); if(host) mountAdminJobOffers(host); }
