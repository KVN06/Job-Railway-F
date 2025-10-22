import { listJobApplications } from '../api/jobApplications.js';
import { requireRole } from '../auth/permissions.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}
function formatWhen(iso){ try{ const d=new Date(iso); return d.toLocaleString(); }catch{ return iso||''; } }
function badgeClass(status){ const map={pending:'bg-yellow-100 text-yellow-800',accepted:'bg-green-100 text-green-800',rejected:'bg-red-100 text-red-800',scheduled:'bg-blue-100 text-blue-800'}; return map[status]||'bg-gray-100 text-gray-700'; }

async function ensureTemplateLoaded(){
  if(document.getElementById('job-application-card-template')) return;
  try{
    const res=await fetch('/html/includes/job-application-card.html', { credentials: 'same-origin' });
    if(res.ok){ const html=await res.text(); const wrap=document.createElement('div'); wrap.style.display='none'; wrap.innerHTML=html; document.body.appendChild(wrap);}
  }catch{}
}

function renderCardFromTemplate(app){
  const tpl=document.getElementById('job-application-card-template');
  if(!tpl) return null;
  const node=tpl.content.firstElementChild.cloneNode(true);
  const initials=(app?.unemployed?.user?.name||app?.applicant_name||'??').slice(0,2).toUpperCase();
  node.querySelector('[data-initials]').textContent=initials;
  const title=app?.jobOffer?.title||app?.title||`Oferta #${app?.job_offer_id||app?.jobOfferId||''}`;
  const company=app?.jobOffer?.company?.name||app?.company?.name||'Empresa';
  const link=node.querySelector('[data-job-link]'); if(link){ link.href=`/html/job-offers/show.html?id=${app?.jobOffer?.id||app?.job_offer_id||''}`; }
  node.querySelector('[data-job-title]').textContent=title;
  node.querySelector('[data-company-name]').textContent=company;
  const badge=node.querySelector('[data-status-badge]'); if(badge){ badge.textContent=app?.status_label||app?.status||'Estado'; badge.className=`ml-2 inline-block px-2 py-0.5 rounded text-xs font-semibold ${badgeClass(app?.status)}`; }
  const created=node.querySelector('[data-created-at]'); if(created) created.textContent=app?.created_at||'';
  const msg=node.querySelector('[data-message]'); if(msg) msg.textContent=(app?.message||'Sin mensaje');
  if(app?.cv_url){ const a=node.querySelector('[data-cv-link]'); if(a){ a.href=app.cv_url; a.classList.remove('hidden'); } }
  const li=node.querySelector('[data-latest-interview]');
  const latest=Array.isArray(app?.interviews)?[...app.interviews].sort((a,b)=>new Date(b.scheduled_at)-new Date(a.scheduled_at))[0]:null;
  if(latest && li){ li.classList.remove('hidden'); li.querySelector('[data-interview-when]').textContent=formatWhen(latest.scheduled_at); li.querySelector('[data-interview-mode]').textContent=latest.mode||'N/A'; li.querySelector('[data-interview-duration]').textContent=latest.duration_minutes||30; }
  const modal=node.querySelector('[data-modal="message"]');
  const btnMsg=node.querySelector('[data-action="view-message"]');
  if(btnMsg && app?.message){ btnMsg.classList.remove('hidden'); btnMsg.addEventListener('click',()=>{ modal?.classList.remove('hidden'); node.querySelector('[data-message-content]').textContent=app.message; }); node.querySelector('[data-action="close-message"]').addEventListener('click',()=>modal?.classList.add('hidden')); }
  return node;
}

function buildHeader({q,status}){
  const form=h('form',{class:'home-hero-actions flex items-center gap-3', role:'search'});
  const input=h('input',{type:'search',name:'q',value:q||'',placeholder:'Buscar por título o empresa',class:'border rounded px-3 py-2 text-sm w-56'});
  const select=h('select',{name:'status',class:'border rounded px-3 py-2 text-sm'},
    h('option',{value:''},'Todos los estados'),
    h('option',{value:'pending', selected: status==='pending'? '': null}, 'Pendiente'),
    h('option',{value:'accepted', selected: status==='accepted'? '': null}, 'Aceptada'),
    h('option',{value:'rejected', selected: status==='rejected'? '': null}, 'Rechazada'),
  );
  const btn=h('button',{type:'submit',class:'bg-blue-600 text-white px-4 py-2 rounded text-sm'},'Filtrar');
  form.append(input,select,btn);
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const params=new URLSearchParams(location.search);
    params.set('q', input.value||'');
    params.set('status', select.value||'');
    params.delete('page');
    history.replaceState(null,'',`${location.pathname}?${params.toString()}`);
    const root=document.querySelector('[data-page="job-applications-unemployed"]');
    if(root) mountJobApplicationsUnemployed(root);
  });
  const hero=h('section',{class:'home-hero'},
    h('div',{class:'home-hero-pattern'}),
    h('div',{class:'home-hero-content container mx-auto px-4'},
      h('div',{class:'home-hero-main'},
        h('span',{class:'home-hero-badge'},'Postulaciones'),
        h('h1',{class:'home-hero-title'},'Mis postulaciones a ofertas'),
        h('p',{class:'home-hero-subtitle'},'Revisa el estado de tus postulaciones, descarga tu CV y gestiona entrevistas.'),
        form
      ),
      h('aside',{class:'home-hero-summary'},
        h('div',{class:'home-hero-metric'}, h('div',null,'Total'), h('div',{'data-kpi':'total'},'0')),
        h('div',{class:'home-hero-metric'}, h('div',null,'Pendientes'), h('div',{'data-kpi':'pending'},'0')),
        h('div',{class:'home-hero-metric'}, h('div',null,'Aceptadas'), h('div',{'data-kpi':'accepted'},'0')),
        h('div',{class:'home-hero-metric'}, h('div',null,'Rechazadas'), h('div',{'data-kpi':'rejected'},'0')),
      )
    )
  );
  return hero;
}

function computeCounts(items){
  const res={ total: items.length, pending:0, accepted:0, rejected:0 };
  for(const it of items){ const s=(it?.status||'').toLowerCase(); if(s==='pending') res.pending++; else if(s==='accepted') res.accepted++; else if(s==='rejected') res.rejected++; }
  return res;
}

export async function mountJobApplicationsUnemployed(root){
  if(!root) return;
  const { user, allowed } = await requireRole('unemployed').catch(()=>({ allowed:false }));
  if(!allowed) return;
  root.innerHTML='';
  const paramsObj=Object.fromEntries(new URLSearchParams(location.search).entries());
  const hero=buildHeader({ q: paramsObj.q||'', status: paramsObj.status||'' });
  root.appendChild(hero);
  // alerts from ?success / ?error
  if (paramsObj.success && window.UI?.createAlert){ root.appendChild(window.UI.createAlert({ type:'success', content: paramsObj.success })); }
  if (paramsObj.error && window.UI?.createAlert){ root.appendChild(window.UI.createAlert({ type:'error', content: paramsObj.error })); }

  const content=h('div',{class:'min-h-[120px]'});
  root.appendChild(content);
  const loading=h('p',{class:'text-slate-500'},'Cargando postulaciones...'); content.appendChild(loading);
  await ensureTemplateLoaded();
  try{
    const page=parseInt(paramsObj.page||'1',10)||1; const per_page=10;
    const data=await listJobApplications({ q: paramsObj.q||undefined, status: paramsObj.status||undefined, page, per_page });
    const items=Array.isArray(data)?data:(Array.isArray(data?.data)?data.data:[]);
    // update KPIs
    const counts=computeCounts(items);
    for(const [k,v] of Object.entries(counts)){
      const el=hero.querySelector(`[data-kpi="${k}"]`); if(el) el.textContent=String(v);
    }
    loading.remove();
    if(!items.length){
      const empty=h('div',{class:'bg-white rounded-lg shadow p-8 text-center'},
        h('div',{class:'text-4xl'},'🙌'),
        h('h3',{class:'mt-4 text-xl font-semibold text-gray-800'},'Aún no tienes postulaciones'),
        h('p',{class:'mt-2 text-sm text-gray-500'},'Explora ofertas y aplica a las que te interesen. Cuando te postules, aquí verás el estado y los horarios de entrevistas.'),
        h('div',{class:'mt-4'}, h('a',{href:'/html/job-offers/index.html',class:'bg-indigo-600 text-white px-4 py-2 rounded'},'Ver ofertas'))
      );
      content.appendChild(empty);
      return;
    }
    const list=h('div',{class:'grid grid-cols-1 md:grid-cols-2 gap-6'});
    for(const it of items){ const card=renderCardFromTemplate(it); list.appendChild(card||h('div',{class:'rounded-lg border p-3 bg-white'}, `Postulación #${it.id||''}`)); }
    content.appendChild(list);
    // pager
    const meta=data?.meta||{}; const last=meta.last_page||meta.lastPage||undefined;
    if(last && last>1){
      const pager=h('div',{class:'mt-8 flex items-center gap-2'},
        h('button',{class:'px-3 py-1 border rounded '+(page<=1?'opacity-50 cursor-not-allowed':''), disabled: page<=1?'':null},'Anterior'),
        h('span',{class:'text-sm text-gray-600'},`Página ${page} de ${last}`),
        h('button',{class:'px-3 py-1 border rounded '+(page>=last?'opacity-50 cursor-not-allowed':''), disabled: page>=last?'':null},'Siguiente')
      );
      const [prevBtn,,nextBtn]=pager.children;
      prevBtn.addEventListener('click',()=>{ if(page>1){ const sp=new URLSearchParams(location.search); sp.set('page', String(page-1)); history.replaceState(null,'',`${location.pathname}?${sp}`); mountJobApplicationsUnemployed(root);} });
      nextBtn.addEventListener('click',()=>{ if(page<last){ const sp=new URLSearchParams(location.search); sp.set('page', String(page+1)); history.replaceState(null,'',`${location.pathname}?${sp}`); mountJobApplicationsUnemployed(root);} });
      content.appendChild(pager);
    }
  }catch(e){ loading.textContent=`Error: ${e?.data?.message||e.message}`; }
}

export function autoMount(){ const el=document.querySelector('[data-page="job-applications-unemployed"]'); if(el) mountJobApplicationsUnemployed(el); }
