import { listFavorites, toggleFavorite } from '../api/favorites.js';
import { requireRole } from '../auth/permissions.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

const fmtNumber = new Intl.NumberFormat('es-CO');

export async function mountFavorites(root){
  if(!root) return;

  const { allowed } = await requireRole('unemployed', {
    alertMessage: 'Debes ingresar como cesante para ver tus favoritos.',
    redirectTo: '/html/pages/home.html',
  }).catch(() => ({ allowed: false }));
  if (!allowed) return;

  root.innerHTML='';
  const loading=h('div',{class:'text-slate-600'},'Cargando favoritos...');
  root.appendChild(loading);
  try{
    const data=await listFavorites({ per_page: 200, page: 1 });
    const raw=Array.isArray(data)?data:(Array.isArray(data?.data)?data.data:[]);
    const { jobOffers, classifieds, latestAt } = splitFavorites(raw);
    loading.remove();
    root.appendChild(renderPage(jobOffers, classifieds, latestAt));
  }catch(e){
    loading.textContent=`Error cargando favoritos: ${e?.data?.message||e.message}`;
  }
}

function splitFavorites(arr){
  const jobOffers=[]; const classifieds=[]; let latestAt=null;
  for(const it of arr){
    const norm = normalizeFavorite(it);
    if(!norm) continue;
    if (norm.createdAt) {
      const d = new Date(norm.createdAt);
      if (!latestAt || d>latestAt) latestAt = d;
    }
    if (norm.type==='joboffer') jobOffers.push(norm.entity);
    else if (norm.type==='classified') classifieds.push(norm.entity);
  }
  return { jobOffers, classifieds, latestAt };
}

function normalizeFavorite(it){
  // Diversas formas: { type, job_offer|jobOffer }, { type, classified }, o el propio modelo con pivot
  const pivotAt = it?.pivot?.created_at || it?.created_at || it?.createdAt;
  // job offer
  const jo = it?.jobOffer || it?.job_offer || (it?.type?.includes('job') ? (it.item||it.entity) : null);
  if (jo) return { type:'joboffer', createdAt: pivotAt, entity: normalizeJobOffer(jo, pivotAt) };
  if (it?.type==='joboffer' || it?.type==='job_offer') return { type:'joboffer', createdAt: pivotAt, entity: normalizeJobOffer(it, pivotAt) };
  // classified
  const cl = it?.classified || (it?.type==='classified' ? (it.item||it.entity) : null);
  if (cl) return { type:'classified', createdAt: pivotAt, entity: normalizeClassified(cl, pivotAt) };
  // heurística: si tiene company + title => job offer; si no, clasificado
  if (it?.title && it?.company) return { type:'joboffer', createdAt: pivotAt, entity: normalizeJobOffer(it, pivotAt) };
  if (it?.title) return { type:'classified', createdAt: pivotAt, entity: normalizeClassified(it, pivotAt) };
  return null;
}

function normalizeJobOffer(x, createdAt){
  return {
    id: x.id,
    title: x.title,
    description: x.description || x.summary || '',
    location: x.location || x.city || x.municipality || null,
    categories: Array.isArray(x.categories)?x.categories:[],
    company: x.company || null,
    salary_formatted: x.salary_formatted || x.salaryFormatted || null,
    _favorite_at: createdAt
  };
}
function normalizeClassified(x, createdAt){
  return {
    id: x.id,
    title: x.title,
    description: x.description || '',
    location: x.location || null,
    categories: Array.isArray(x.categories)?x.categories:[],
    company: x.company || x.unemployed || null,
    salary: x.salary || null,
    contact_email: x.contact_email || null,
    contact_phone: x.contact_phone || null,
    _favorite_at: createdAt
  };
}

function renderPage(jobOffers, classifieds, latestAt){
  const total = jobOffers.length + classifieds.length;
  const host = h('div',{class:'space-y-12'});
  host.appendChild(renderHero(total, jobOffers.length, classifieds.length, latestAt));
  host.appendChild(renderJobOffers(jobOffers));
  host.appendChild(renderClassifieds(classifieds));
  return host;
}

function renderHero(total, joCount, clCount, latestAt){
  const last = latestAt ? timeAgo(latestAt) : 'Aún no hay actividad';
  return h('section',{class:'relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#102347] via-[#123468] to-[#0b1a31] text-white shadow-2xl'},
    h('div',{class:'absolute inset-0 opacity-20'},
      h('div',{class:'absolute -right-20 -top-16 w-72 h-72 bg-white/30 rounded-full blur-3xl'}),
      h('div',{class:'absolute right-10 bottom-0 w-60 h-60 bg-white/20 rounded-full blur-2xl'})
    ),
    h('div',{class:'relative z-10 px-8 py-12 lg:px-12'},
      h('div',{class:'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8'},
        h('div',{class:'max-w-2xl space-y-4'},
          h('div',{class:'inline-flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide border border-white/20'},
            h('i',{class:'fas fa-star text-yellow-300'}),'Favoritos personales'
          ),
          h('h1',{class:'text-4xl lg:text-5xl font-bold leading-tight'},'Sigue de cerca tus oportunidades favoritas'),
          h('p',{class:'text-white/70 text-lg leading-relaxed'},'Centralizamos en un solo espacio todas tus ofertas laborales y clasificados guardados para que los retomes cuando quieras.'),
          h('div',{class:'flex flex-wrap items-center gap-4 text-white/70 text-sm'},
            h('div',{class:'inline-flex items-center gap-2'},
              h('span',{class:'w-2 h-2 rounded-full bg-lime-300'}),
              'Actividad reciente · ', h('span',{id:'fav-last-updated'}, last)
            ),
            h('span',{class:'hidden lg:inline text-white/60'},'•'),
            h('a',{href:'/html/pages/home.html',class:'inline-flex items-center gap-2 text-white hover:text-[#9fd3ff] transition-colors'},
              h('i',{class:'fas fa-arrow-left'}),'Volver al panel principal'
            )
          )
        ),
        h('div',{class:'grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto'},
          statCard('Total guardados', fmtNumber.format(total)),
          statCard('Ofertas de trabajo', fmtNumber.format(joCount)),
          statCard('Clasificados', fmtNumber.format(clCount))
        )
      ),
      h('div',{class:'mt-10 flex flex-wrap gap-4'},
        h('a',{href:'/html/job-offers/index.html',class:'inline-flex items-center gap-3 bg-white text-[#102347] font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5'},
          h('i',{class:'fas fa-briefcase'}),'Explorar más ofertas'
        ),
        h('a',{href:'/html/classifieds/index.html',class:'inline-flex items-center gap-3 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl border border-white/30 hover:bg-white/20 transition-all'},
          h('i',{class:'fas fa-bullhorn'}),'Ver clasificados disponibles'
        )
      )
    )
  );
}

function statCard(label, value){
  return h('div',{class:'bg-white/10 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10'},
    h('p',{class:'text-white/60 text-sm mb-2'},label),
    h('p',{class:'text-3xl font-semibold text-white'}, value)
  );
}

function renderJobOffers(items){
  const section = h('section',{id:'job-offers', class:'space-y-6'});
  section.appendChild(
    h('header',{class:'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'},
      h('div',null,
        h('h2',{class:'text-2xl font-bold text-gray-900 flex items-center gap-3'},
          h('span',{class:'inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ebf1ff] text-[#204180]'}, h('i',{class:'fas fa-briefcase'})),
          'Tus ofertas laborales favoritas'
        ),
        h('p',{class:'text-gray-500 mt-1'},'Retoma las vacantes que guardaste para aplicarlas en el mejor momento.')
      ),
      h('span',{class:'inline-flex items-center gap-2 bg-[#eaf1ff] border border-[#cadeff] text-[#1f315b] px-4 py-2 rounded-full text-sm font-semibold'}, `${items.length} favorita${items.length===1?'':'s'}`)
    )
  );
  if (!items.length) {
    section.appendChild(emptyCard({ icon:'fa-briefcase', title:'Aún no has guardado ofertas', desc:'Explora las últimas vacantes y guarda las que quieras comparar con calma o revisar más tarde.', ctaHref:'/html/job-offers/index.html', ctaText:'Descubrir ofertas', ctaClass:'btn-primary inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold', ctaStyle:'background:#1f315b' }));
    return section;
  }
  const list = h('div',{class:'space-y-6'});
  for (const jo of items) list.appendChild(jobOfferCard(jo));
  section.appendChild(list);
  return section;
}

function jobOfferCard(jo){
  const cats = (jo.categories||[]).slice(0,3);
  const created = jo._favorite_at ? timeAgo(jo._favorite_at) : '';
  const card = h('article',{class:'card-enhanced hover-lift p-6 lg:p-8', 'data-favorite-card':'', 'data-type':'joboffer'});
  const removeBtn = h('button',{class:'favorite-btn w-12 h-12 rounded-full border border-[#b8c7e6] flex items-center justify-center transition-all duration-300 hover-lift bg-[#e4ecff] text-[#1f315b] hover:bg-[#d7e4ff]', title:'Quitar de favoritos'}, h('i',{class:'fas fa-heart text-lg'}));
  removeBtn.addEventListener('click', async (ev)=>{
    ev.stopPropagation();
    if(!confirm('¿Quieres quitar este elemento de tus favoritos?')) return;
    await handleToggle('joboffer', jo.id, card);
  });
  card.appendChild(
    h('div',{class:'flex flex-col lg:flex-row gap-6'},
      h('div',{class:'flex-1 space-y-4'},
        h('div',{class:'flex items-start justify-between gap-4'},
          h('div',{class:'space-y-3'},
            h('div',{class:'flex items-center gap-3'},
              h('span',{class:'inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full bg-[#e2ecff] text-[#1f315b]'}, h('i',{class:'fas fa-building'}), jo.company?.name || 'Empresa'),
              created ? h('span',{class:'text-sm text-gray-500 flex items-center gap-2'}, h('i',{class:'fas fa-clock'}), created) : null
            ),
            h('a',{href:`/html/job-offers/show.html?id=${encodeURIComponent(jo.id)}`, class:'group block'}, h('h3',{class:'text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors'}, jo.title || 'Oferta')),
            jo.description ? h('p',{class:'text-gray-600 leading-relaxed'}, truncate(stripHtml(jo.description), 200)) : null,
            h('div',{class:'flex flex-wrap gap-2'},
              h('span',{class:'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f6ff] text-[#1f315b] text-xs font-semibold'}, h('i',{class:'fas fa-map-marker-alt'}), jo.location || 'Ubicación no disponible'),
              ...cats.map(c=>h('span',{class:'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold'}, h('i',{class:'fas fa-tag'}), c.name || c)),
            )
          ),
          removeBtn
        )
      ),
      h('div',{class:'lg:w-72 space-y-4'},
        h('div',{class:'bg-[#f1f5ff] border border-[#d5e1ff] rounded-2xl p-5'},
          h('p',{class:'text-xs uppercase tracking-wide text-[#1f3b6d] mb-1 font-semibold'},'Salario estimado'),
          h('p',{class:'text-2xl font-bold text-[#0d2344]'}, jo.salary_formatted || 'A convenir'),
          h('span',{class:'inline-flex items-center gap-1 text-xs text-[#3964a6] mt-2'}, h('i',{class:'fas fa-info-circle'}),'Puede variar según experiencia')
        ),
        h('a',{href:`/html/job-offers/show.html?id=${encodeURIComponent(jo.id)}`,class:'inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[#c7d6f6] text-[#1f315b] font-semibold hover:bg-[#f2f6ff] transition-all'}, h('i',{class:'fas fa-eye'}),'Ver detalles')
      )
    )
  );
  return card;
}

function renderClassifieds(items){
  const section = h('section',{id:'classifieds', class:'space-y-6 pt-4 border-t border-gray-100'});
  section.appendChild(
    h('header',{class:'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'},
      h('div',null,
        h('h2',{class:'text-2xl font-bold text-gray-900 flex items-center gap-3'},
          h('span',{class:'inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#eef3ff] text-[#1f315b]'}, h('i',{class:'fas fa-bullhorn'})),
          'Clasificados guardados'
        ),
        h('p',{class:'text-gray-500 mt-1'},'Mantén cerca los servicios o anuncios que planeas revisar con detalle.')
      ),
      h('span',{class:'inline-flex items-center gap-2 bg-[#eef3ff] border border-[#cfd7ea] text-[#1f315b] px-4 py-2 rounded-full text-sm font-semibold'}, `${items.length} favorito${items.length===1?'':'s'}`)
    )
  );
  if (!items.length) {
    section.appendChild(emptyCard({ icon:'fa-bullhorn', title:'Sin clasificados favoritos por ahora', desc:'Guarda los anuncios que más te llamen la atención para hacer seguimiento o contactarte cuando te quede mejor.', ctaHref:'/html/classifieds/index.html', ctaText:'Explorar clasificados', ctaClass:'inline-flex items-center gap-3 px-6 py-3 rounded-xl border', ctaStyle:'border-color:#c7d6f6; color:#1f315b' }));
    return section;
  }
  const list = h('div',{class:'space-y-6'});
  for (const cl of items) list.appendChild(classifiedCard(cl));
  section.appendChild(list);
  return section;
}

function classifiedCard(cl){
  const cats = (cl.categories||[]).slice(0,3);
  const created = cl._favorite_at ? timeAgo(cl._favorite_at) : '';
  const card = h('article',{class:'card-enhanced hover-lift p-6 lg:p-8', 'data-favorite-card':'', 'data-type':'classified'});
  const removeBtn = h('button',{class:'favorite-btn w-12 h-12 rounded-full border border-[#b8c7e6] flex items-center justify-center transition-all duration-300 hover-lift bg-[#e4ecff] text-[#1f315b] hover:bg-[#d7e4ff]', title:'Quitar de favoritos'}, h('i',{class:'fas fa-heart text-lg'}));
  removeBtn.addEventListener('click', async (ev)=>{
    ev.stopPropagation();
    if(!confirm('¿Quieres quitar este elemento de tus favoritos?')) return;
    await handleToggle('classified', cl.id, card);
  });
  card.appendChild(
    h('div',{class:'flex flex-col lg:flex-row gap-6'},
      h('div',{class:'flex-1 space-y-4'},
        h('div',{class:'flex items-start justify-between gap-4'},
          h('div',{class:'space-y-3'},
            h('div',{class:'flex items-center gap-3 flex-wrap'},
              h('span',{class:'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2ecff] text-[#1f315b] text-sm font-semibold'},
                cl.company?.business_name || cl.company?.name || cl.unemployed?.name || 'Publicación individual'
              ),
              created ? h('span',{class:'text-sm text-gray-500 flex items-center gap-2'}, h('i',{class:'fas fa-clock'}), created) : null
            ),
            h('a',{href:`/html/classifieds/show.html?id=${encodeURIComponent(cl.id)}`, class:'group block'}, h('h3',{class:'text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors'}, cl.title || 'Clasificado')),
            cl.description ? h('p',{class:'text-gray-600 leading-relaxed'}, truncate(stripHtml(cl.description), 220)) : null,
            h('div',{class:'flex flex-wrap gap-2'},
              h('span',{class:'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f6ff] text-[#1f315b] text-xs font-semibold'}, h('i',{class:'fas fa-map-marker-alt'}), cl.location || 'Ubicación no disponible'),
              ...cats.map(c=>h('span',{class:'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold'}, h('i',{class:'fas fa-tag'}), c.name || c)),
              cl.salary ? h('span',{class:'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff4e6] text-[#9a6a2a] text-xs font-semibold'}, h('i',{class:'fas fa-dollar-sign'}), `$${fmtNumber.format(cl.salary)}`) : null
            )
          ),
          removeBtn
        )
      ),
      h('div',{class:'lg:w-72 space-y-4'},
        h('div',{class:'bg-[#f1f5ff] border border-[#d5e1ff] rounded-2xl p-5'},
          h('p',{class:'text-xs uppercase tracking-wide text-[#1f3b6d] mb-1 font-semibold'},'Contacto'),
          h('p',{class:'text-base text-[#0d2344]'}, cl.contact_email || cl.contact_phone || 'Ver detalles para más información')
        ),
        h('a',{href:`/html/classifieds/show.html?id=${encodeURIComponent(cl.id)}`,class:'inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[#c7d6f6] text-[#1f315b] font-semibold hover:bg-[#f2f6ff] transition-all'}, h('i',{class:'fas fa-eye'}),'Ver detalles del clasificado')
      )
    )
  );
  return card;
}

function emptyCard({icon,title,desc,ctaHref,ctaText,ctaClass,ctaStyle}){
  return h('div',{class:'card-enhanced p-10 text-center space-y-4'},
    h('div',{class:'flex justify-center'}, h('div',{class:'w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-4xl'}, h('i',{class:`fas ${icon}`}))),
    h('h3',{class:'text-2xl font-semibold text-gray-700'}, title),
    h('p',{class:'text-gray-500 max-w-xl mx-auto'}, desc),
    h('a',{href:ctaHref, class:ctaClass, style:ctaStyle||''}, ctaText)
  );
}

async function handleToggle(type, id, card){
  try{
    const res = await toggleFavorite({ type, id });
    if (!res.isFavorite) {
      card.style.transition='all 0.25s ease-out';
      card.style.transform='translateX(20px)';
      card.style.opacity='0';
      setTimeout(()=>{ card.remove(); updateCounters(); }, 200);
    }
  }catch(err){
    alert(err?.data?.message || err.message || 'No se pudo cambiar el estado de favorito.');
  }
}

function updateCounters(){
  try{
    const jobCards = document.querySelectorAll('[data-favorite-card][data-type="joboffer"]').length;
    const classCards = document.querySelectorAll('[data-favorite-card][data-type="classified"]').length;
    const total = jobCards + classCards;
    // Hero stats
    const hero = document.querySelector('[data-page="favorites"]');
    if (!hero) return;
    const stats = hero.querySelectorAll('section .grid .text-3xl.font-semibold.text-white');
    if (stats?.length>=3){
      stats[0].textContent = fmtNumber.format(total);
      stats[1].textContent = fmtNumber.format(jobCards);
      stats[2].textContent = fmtNumber.format(classCards);
    }
    // Badges
    const joBadge = document.querySelector('#job-offers header span'); if (joBadge) joBadge.textContent = `${jobCards} favorita${jobCards===1?'':'s'}`;
    const clBadge = document.querySelector('#classifieds header span'); if (clBadge) clBadge.textContent = `${classCards} favorito${classCards===1?'':'s'}`;
    // Empty states if needed handled implicitly by list emptiness; keep simple
    const last = document.getElementById('fav-last-updated'); if (last) last.textContent = 'Actualizado hace un momento';
  }catch{}
}

function timeAgo(date){
  const d = (date instanceof Date) ? date : new Date(date);
  const diff = (Date.now() - d.getTime())/1000;
  if (diff < 60) return 'hace unos segundos';
  if (diff < 3600) return `hace ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff/3600)} h`;
  const days = Math.floor(diff/86400);
  if (days < 30) return `hace ${days} día${days===1?'':'s'}`;
  const months = Math.floor(days/30);
  if (months < 12) return `hace ${months} mes${months===1?'':'es'}`;
  const years = Math.floor(months/12);
  return `hace ${years} año${years===1?'':'s'}`;
}

function stripHtml(s){ const el=document.createElement('div'); el.innerHTML=s||''; return el.textContent||el.innerText||''; }
function truncate(s,n){ if(!s) return ''; return s.length>n? s.slice(0,n-1)+'…' : s; }

export function autoMount(){
  const el=document.querySelector('[data-page="favorites"]');
  if(el) mountFavorites(el);
}
