import { countClassifieds } from '../api/classifieds.js';
import { countJobOffers } from '../api/jobOffers.js';
import { listTrainings } from '../api/trainings.js';
import { countUsers } from '../api/users.js';
import { requireRole } from '../auth/permissions.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}
const fmt = new Intl.NumberFormat('es-CO');

export async function mountAdminDashboard(root){
  if(!root) return; root.innerHTML='';
  const { allowed } = await requireRole('admin');
  if (!allowed) return;
  const header = h('div',{class:'mb-8'},
    h('h1',{class:'text-3xl font-bold text-gray-800 mb-2'},'Dashboard Administrativo'),
    h('p',{class:'text-gray-600'},'Bienvenido al panel de administración')
  );
  root.appendChild(header);

  const stats = h('div',{class:'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'});
  const c1 = statCard('Clasificados','fa-file-alt','from-blue-400 to-blue-600'); stats.appendChild(c1.host);
  const c2 = statCard('Ofertas Laborales','fa-briefcase','from-green-400 to-green-600'); stats.appendChild(c2.host);
  const c3 = statCard('Capacitaciones','fa-graduation-cap','from-purple-400 to-purple-600'); stats.appendChild(c3.host);
  const c4 = statCard('Usuarios','fa-users','from-yellow-400 to-orange-500'); stats.appendChild(c4.host);
  root.appendChild(stats);

  const actions = h('div',{class:'card-enhanced p-8 mb-8 hover-lift'},
    h('div',{class:'flex items-center mb-6'}, h('div',{class:'w-10 h-10 gradient-primary rounded-lg flex items-center justify-center mr-3'}, h('i',{class:'fas fa-bolt text-white'})), h('h3',{class:'text-xl font-bold text-gray-800'},'Acciones Rápidas')),
    h('div',{class:'grid grid-cols-1 md:grid-cols-2 gap-4'},
  quickLink('/html/admin/trainings/create.html','Nueva Capacitación','Crear curso de formación','fa-graduation-cap','from-purple-500 to-purple-600'),
      quickLink('/html/admin/layout.html','Nuevo Usuario','Registrar nuevo usuario','fa-user-plus','from-orange-500 to-orange-600')
    )
  );
  root.appendChild(actions);

  const modulesTitle = h('div',{class:'mb-6'}, h('h3',{class:'text-xl font-bold text-gray-800 mb-4 flex items-center'}, h('i',{class:'fas fa-th-large mr-2 text-blue-500'}),'Gestión de Módulos'));
  root.appendChild(modulesTitle);
  root.appendChild(modulesGrid());

  // Cargar contadores reales
  try { c1.set(fmt.format(await countClassifieds())); } catch {}
  try { c2.set(fmt.format(await countJobOffers())); } catch {}
  try {
    // No tenemos countTraining; aproximar con per_page=1 meta.total o fallback tamaño página
    const r = await listTrainings({ per_page: 1, page: 1 });
    const total = r?.meta?.total ?? r?.total ?? (Array.isArray(r)?r.length : (Array.isArray(r?.data)?r.data.length:0));
    c3.set(fmt.format(total));
  } catch {}
  try { c4.set(fmt.format(await countUsers())); } catch {}
}

function statCard(label, icon, gradient){
  const value = h('p',{class:'text-3xl font-bold text-gray-800'}, '');
  const host = h('div',{class:'card-enhanced p-6 hover-lift'},
    h('div',{class:'flex items-center justify-between'},
      h('div',{class:'flex items-center space-x-4'},
        h('div',{class:`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-soft`}, h('i',{class:`fas ${icon} text-2xl text-white`})),
        h('div',null, h('h3',{class:'text-sm font-medium text-gray-500 mb-1'}, label), value)
      )
    ),
    h('div',{class:'mt-4 pt-4 border-t border-gray-100'}, h('span',{class:'text-xs text-gray-600 font-medium'}, label))
  );
  return { host, set: (v)=>{ value.textContent = String(v); } };
}

function quickLink(href, title, subtitle, icon, gradient){
  return h('a',{href, class:`group relative overflow-hidden bg-gradient-to-br ${gradient} hover:from-80% text-white px-6 py-4 rounded-xl shadow-soft transition-all duration-300 hover-lift`},
    h('div',{class:'flex items-center justify-between'},
      h('div',{class:'flex items-center space-x-3'},
        h('div',{class:'w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'}, h('i',{class:`fas ${icon} text-xl`})),
        h('div',null, h('p',{class:'font-semibold text-lg'}, title), h('p',{class:'text-sm opacity-80'}, subtitle))
      ),
      h('i',{class:'fas fa-arrow-right text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all'})
    )
  );
}

function modulesGrid(){
  return h('div',{class:'grid grid-cols-1 md:grid-cols-2 gap-6'},
    moduleCard('/html/admin/classifieds/index.html','Clasificados','Ver, editar y eliminar publicaciones de clasificados','fa-file-alt','from-blue-100 to-blue-200','text-blue-600','Solo edición','bg-blue-100 text-blue-700'),
    moduleCard('/html/admin/job-offers/index.html','Ofertas Laborales','Ver, editar y eliminar ofertas de empleo publicadas','fa-briefcase','from-green-100 to-green-200','text-green-600','Solo edición','bg-green-100 text-green-700'),
    moduleCard('/html/admin/trainings/index.html','Capacitaciones','Gestionar cursos, crear, editar y eliminar capacitaciones','fa-graduation-cap','from-purple-100 to-purple-200','text-purple-600','Control total','bg-purple-100 text-purple-700'),
    moduleCard('/html/admin/layout.html','Usuarios','Administrar usuarios, crear, editar y eliminar cuentas','fa-users','from-orange-100 to-orange-200','text-orange-600','Control total','bg-orange-100 text-orange-700'),
  );
}

function moduleCard(href, title, desc, icon, bgGradient, iconColor, badgeText, badgeClass){
  return h('a',{href, class:'card-enhanced p-6 hover-lift group transition-all duration-300'},
    h('div',{class:'flex items-start justify-between mb-4'},
      h('div',{class:`w-12 h-12 bg-gradient-to-br ${bgGradient} rounded-xl flex items-center justify-center`}, h('i',{class:`fas ${icon} text-2xl ${iconColor}`})),
      h('span',{class:`px-3 py-1 ${badgeClass} text-xs font-medium rounded-full`}, badgeText)
    ),
    h('h3',{class:`text-lg font-bold text-gray-800 mb-2 group-hover:${iconColor} transition-colors`}, title),
    h('p',{class:'text-gray-600 text-sm mb-3'}, desc),
    h('div',{class:`flex items-center ${iconColor} text-sm font-medium`}, h('span',null,'Administrar ', title.toLowerCase()), h('i',{class:'fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform'}))
  );
}

export function autoMount(){ const host=document.querySelector('[data-page="admin-dashboard"]'); if(host) mountAdminDashboard(host); }
