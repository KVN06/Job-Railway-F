import { listTrainings } from '../api/trainings.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

function parseDate(s){ if(!s) return null; const d=new Date(s); return isNaN(d.getTime())?null:d; }
function formatDMY(d){ if(!d) return ''; const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0'); const yy=d.getFullYear(); return `${dd}/${mm}/${yy}`; }
function relTime(s){
  const d = parseDate(s); if (!d) return s || '';
  const absMs = Math.abs(Date.now() - d.getTime());
  const sec = Math.round(absMs / 1000);
  // Helper: number to Spanish words for 1..10; otherwise digits
  const toWord = (n, gender='m') => {
    const base = {1: gender==='f'?'una':'un',2:'dos',3:'tres',4:'cuatro',5:'cinco',6:'seis',7:'siete',8:'ocho',9:'nueve',10:'diez'};
    return base[n] || String(n);
  };
  if (sec < 60) {
    const n = sec; const w = toWord(n, 'm'); const unit = n===1?'segundo':'segundos';
    return `hace ${w} ${unit}`;
  }
  const min = Math.round(sec/60);
  if (min < 60) {
    const n = min; const w = toWord(n, 'm'); const unit = n===1?'minuto':'minutos';
    return `hace ${w} ${unit}`;
  }
  const hr = Math.round(min/60);
  if (hr < 24) {
    const n = hr; const w = toWord(n, 'f'); const unit = n===1?'hora':'horas';
    return `hace ${w} ${unit}`;
  }
  const day = Math.round(hr/24);
  if (day < 30) {
    const n = day; const w = toWord(n, 'm'); const unit = n===1?'día':'días';
    return `hace ${w} ${unit}`;
  }
  const mon = Math.round(day/30);
  if (mon < 12) {
    const n = mon; const w = toWord(n, 'm'); const unit = n===1?'mes':'meses';
    return `hace ${w} ${unit}`;
  }
  const yr = Math.round(mon/12);
  const w = toWord(yr, 'm'); const unit = yr===1?'año':'años';
  return `hace ${w} ${unit}`;
}

function renderTrainingCard(item){
  const start = parseDate(item.start_date);
  const end = parseDate(item.end_date);
  const isUpcoming = !!(start && start.getTime() > Date.now());
  const isFinished = !!(end && end.getTime() < Date.now());
  const stateLabel = isFinished ? 'Finalizada' : (isUpcoming ? 'Próxima' : 'En curso');

  return h('article', { class: 'card-surface rounded-3xl overflow-hidden p-0' },
    h('div', { class: 'flex flex-col md:flex-row' },
      // Contenido principal
      h('div', { class: 'flex-1 p-6' },
        h('div', { class: 'flex items-start justify-between mb-4' },
          h('div', { class: 'flex-1' },
            h('h3', { class: 'text-2xl font-bold text-gray-900 mb-3 group' },
              h('span', { class: 'inline-flex items-center' },
                item.title || 'Capacitación',
                item.link ? h('i', { class: 'fas fa-external-link-alt ml-2 text-blue-900 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1' }) : null
              )
            ),
            h('div', { class: 'flex items-center mb-4 group cursor-pointer' },
              h('div', { class: 'w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300' },
                h('i', { class: 'fas fa-building text-white text-xl' })
              ),
              h('div', {},
                h('p', { class: 'text-gray-800 font-semibold text-lg' }, item.provider || 'Proveedor no especificado'),
                h('p', { class: 'text-sm text-gray-500 flex items-center' }, h('i', { class: 'fas fa-graduation-cap text-blue-900 mr-1' }), 'Programa de capacitación')
              )
            )
          ),
          h('div', { class: 'ml-4' },
            h('span', { class: 'inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-primary text-white' },
              h('i', { class: 'fas fa-graduation-cap mr-2' }), stateLabel
            )
          )
        ),
        item.description ? h('div', { class: 'mb-4' }, h('p', { class: 'text-gray-700 leading-relaxed' }, String(item.description).slice(0,200))) : null,
        h('div', { class: 'flex flex-wrap items-center gap-4 mb-4' },
          start ? h('div', { class: 'flex items-center text-gray-700 bg-blue-100 px-3 py-2 rounded-lg' }, h('i', { class: 'fas fa-play-circle text-blue-900 mr-2' }), h('span', { class: 'font-medium' }, `Inicio: ${formatDMY(start)}`)) : null,
          end ? h('div', { class: 'flex items-center text-gray-700 bg-blue-100 px-3 py-2 rounded-lg' }, h('i', { class: 'fas fa-stop-circle text-blue-900 mr-2' }), h('span', { class: 'font-medium' }, `Fin: ${formatDMY(end)}`)) : null,
          item.created_at ? h('div', { class: 'flex items-center text-gray-600 bg-blue-100 px-3 py-2 rounded-lg' }, h('i', { class: 'fas fa-clock text-blue-900 mr-2' }), h('span', { class: 'text-sm' }, relTime(item.created_at))) : null
        )
      ),
      // Sidebar
  h('div', { class: 'md:w-72 p-6 bg-white/70 backdrop-blur flex flex-col justify-between border-t border-white/40 md:border-t-0 md:border-l md:border-white/40' },
        h('div', { class: 'space-y-3' },
          h('div', { class: 'rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur' },
            h('p', { class: 'text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold' }, 'Estado del Programa'),
            h('p', { class: 'text-2xl font-bold text-gray-900 mb-2' }, isFinished ? 'Finalizada' : (isUpcoming ? 'Próxima' : 'Activa')),
            h('div', { class: 'flex items-center text-xs text-gray-500' }, h('i', { class: 'fas fa-lightbulb mr-1' }), isUpcoming ? 'Planificar participación' : 'Repasar contenidos')
          ),
          h('div', { class: 'rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur' },
            h('p', { class: 'text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold' }, 'Disponibilidad'),
            h('div', { class: 'flex items-center text-sm text-gray-700 mb-1' }, h('i', { class: 'fas fa-link text-blue-900 mr-2 w-4' }), h('span', {}, item.link ? 'Enlace disponible' : 'Sin enlace')),
            h('div', { class: 'flex items-center text-sm text-gray-700' }, h('i', { class: 'fas fa-calendar text-blue-900 mr-2 w-4' }), h('span', {}, isUpcoming ? 'Inicia pronto' : (isFinished ? 'Completada' : 'En progreso')))
          )
        ),
        h('div', { class: 'text-right flex flex-col items-end space-y-2 mt-3' },
          item.link ? h('a', { href: item.link, target: '_blank', rel: 'noopener noreferrer', class: 'btn-primary text-white px-6 py-3 rounded-xl hover-lift transition-all duration-300 text-sm font-medium shadow-soft w-full flex items-center justify-center group' }, h('i', { class: 'fas fa-external-link-alt mr-2 group-hover:scale-110 transition-transform' }), 'Ver Capacitación')
                   : h('span', { class: 'text-blue-900 text-sm w-full text-center py-3 bg-blue-100 rounded-xl' }, h('i', { class: 'fas fa-ban mr-1' }), 'Sin enlace disponible')
        )
      )
    )
  );
}

function metricSummaryRow({ icon, label, metricKey }){
  return h('div',{ class:'metric-summary-row' },
    h('span',{ class:'metric-summary-label' }, label),
    h('div',{ class:'flex items-center gap-3' },
      h('span',{ class:'metric-summary-value', 'data-metric': metricKey },'--'),
      h('span',{ class:'metric-summary-icon' }, h('i',{ class: icon }))
    )
  );
}

export async function mountTrainings(root){
  if(!root) return;
  root.innerHTML='';
  root.className = 'page-shell';

  const hero = h('section',{ class:'page-hero gradient-primary text-white shadow-card' },
    h('div',{ class:'page-hero-content' },
      h('div',{ class:'space-y-6' },
        h('div',{ class:'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/25 text-white/70 text-xs uppercase tracking-[0.25em]' },
          h('i',{ class:'fas fa-graduation-cap' }), 'Aprende sin límites'
        ),
        h('div',{ class:'space-y-3' },
          h('h1',{ class:'text-3xl md:text-5xl font-bold leading-tight text-white' },'Capacitaciones y recursos actualizados'),
          h('p',{ class:'text-white/85 text-base md:text-lg max-w-2xl' },'Mantén tus habilidades vigentes con talleres cuidadosamente seleccionados y contenidos prácticos listos para aplicar en tus próximas oportunidades.')
        )
      ),
      h('div',{ class:'w-full max-w-sm' },
        h('div',{ class:'metric-summary' },
          h('p',{ class:'metric-summary-title' },'Resumen rápido'),
          metricSummaryRow({ icon:'fas fa-lightbulb', label:'Programas activos', metricKey:'trainings-total' }),
          metricSummaryRow({ icon:'fas fa-calendar-plus', label:'Próximas fechas', metricKey:'trainings-upcoming' }),
          metricSummaryRow({ icon:'fas fa-flag-checkered', label:'Finalizadas', metricKey:'trainings-completed' })
        )
      )
    )
  );
  root.appendChild(hero);

  const metricElements = {
    total: hero.querySelector('[data-metric="trainings-total"]'),
    upcoming: hero.querySelector('[data-metric="trainings-upcoming"]'),
    completed: hero.querySelector('[data-metric="trainings-completed"]'),
  };

  const setMetric = (key, value) => {
    const el = metricElements[key];
    if (!el) return;
    if (value == null || value === '') {
      el.textContent = '--';
      return;
    }
    const num = Number(value);
    el.textContent = Number.isFinite(num) ? num.toLocaleString() : String(value);
  };

  const listSection = h('section',{ class:'page-section' },
    h('header',{},
      h('h2',{},'Agenda y recursos'),
      h('p',{},'Descubre experiencias formativas diseñadas para fortalecer tu perfil profesional y mantenerte al día con las demandas del mercado laboral.')
    )
  );

  const grid = h('div',{ class:'grid grid-cols-1 gap-6' });
  listSection.appendChild(grid);

  const loading=h('p',{class:'text-slate-500'},'Cargando capacitaciones...');
  listSection.appendChild(loading);
  root.appendChild(listSection);
  try{
    const data=await listTrainings();
    loading.remove();
    const items=Array.isArray(data)?data:Array.isArray(data?.data)?data.data:[];
    if(!items.length){
      const empty = h('div',{class:'card-surface rounded-3xl py-12 text-center space-y-4'},
        h('div',{class:'w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto'}, h('i',{class:'fas fa-graduation-cap text-3xl text-blue-600'})),
        h('h3',{class:'text-xl font-semibold text-slate-900'},'No hay capacitaciones disponibles'),
        h('p',{class:'text-slate-600 max-w-xl mx-auto'},'Actualmente no hay capacitaciones publicadas. Vuelve más tarde para descubrir nuevas oportunidades o solicita una nueva capacitación desde el centro de mensajes.')
      );
      listSection.appendChild(empty);
      return;
    }

    const now = Date.now();
    let upcomingCount = 0;
    let completedCount = 0;
    for(const it of items){
      const start = parseDate(it.start_date);
      const end = parseDate(it.end_date);
      if (start && start.getTime() > now) upcomingCount += 1;
      else if (end && end.getTime() < now) completedCount += 1;
      grid.appendChild(renderTrainingCard(it));
    }
    setMetric('total', items.length);
    setMetric('upcoming', upcomingCount);
    setMetric('completed', completedCount);
  }catch(e){
    loading.textContent=`Error: ${e?.data?.message||e.message}`;
  }
}

export function autoMount(){
  const el=document.querySelector('[data-page="trainings"]');
  if(el) mountTrainings(el);
}
