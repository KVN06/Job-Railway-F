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

function headerWithFilters({q,status, counts}){
  const filters=h('form',{class:'home-hero-actions flex items-center gap-2 bg-white rounded-lg shadow-sm px-3 py-2', role:'search'});
  const input=h('input',{type:'search',name:'q',placeholder:'Buscar candidato u oferta', value:q||'', class:'text-sm rounded border-gray-200 px-3 py-2'});
  const select=h('select',{name:'status',class:'text-sm rounded border-gray-200 px-2 py-2'},
    h('option',{value:''},'Todos'),
    h('option',{value:'pending', selected: status==='pending'? '': null}, 'Pendiente'),
    h('option',{value:'accepted', selected: status==='accepted'? '': null}, 'Aceptada'),
    h('option',{value:'rejected', selected: status==='rejected'? '': null}, 'Rechazada'),
  );
  const btn=h('button',{type:'submit',class:'bg-blue-600 text-white px-4 py-2 rounded text-sm'},'Buscar');
  filters.append(input,select,btn);
  filters.addEventListener('submit',(e)=>{
    e.preventDefault();
    const ps=new URLSearchParams(location.search);
    ps.set('q', input.value||''); ps.set('status', select.value||''); ps.delete('page');
    history.replaceState(null,'',`${location.pathname}?${ps.toString()}`);
    const root=document.querySelector('[data-page="job-applications-company"]'); if(root) mountJobApplicationsCompany(root);
  });
  const hero=h('section',{class:'home-hero'},
    h('div',{class:'home-hero-pattern'}),
    h('div',{class:'home-hero-content container mx-auto px-4'},
      h('div',{class:'home-hero-main'},
        h('span',{class:'home-hero-badge'},'Postulaciones'),
        h('h1',{class:'home-hero-title'},'Postulaciones a mis ofertas'),
        h('p',{class:'home-hero-subtitle'},'Revisa, filtra y responde a las postulaciones en un solo lugar.'),
        filters
      ),
      h('aside',{class:'home-hero-summary'},
        h('div',{class:'home-hero-metric'}, h('div',null,'Total'), h('div',{'data-kpi':'total'}, String(counts?.total||0))),
        h('div',{class:'home-hero-metric'}, h('div',null,'Pendientes'), h('div',{'data-kpi':'pending'}, String(counts?.pending||0))),
        h('div',{class:'home-hero-metric'}, h('div',null,'Aceptadas'), h('div',{'data-kpi':'accepted'}, String(counts?.accepted||0))),
        h('div',{class:'home-hero-metric'}, h('div',null,'Rechazadas'), h('div',{'data-kpi':'rejected'}, String(counts?.rejected||0))),
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

export async function mountJobApplicationsCompany(root){
  if(!root) return;
  const { allowed } = await requireRole('company').catch(()=>({ allowed:false }));
  if(!allowed) return;
  root.innerHTML='';
  const params=Object.fromEntries(new URLSearchParams(location.search).entries());
  const wrap=h('div');
  root.appendChild(wrap);
  const content=h('div',{class:'container mx-auto px-4 mt-6'});
  wrap.appendChild(content);
  // alerts
  if (params.success && window.UI?.createAlert) content.appendChild(window.UI.createAlert({ type:'success', content: params.success }));
  if (params.error && window.UI?.createAlert) content.appendChild(window.UI.createAlert({ type:'error', content: params.error }));

  const loading=h('p',{class:'text-slate-500'},'Cargando postulaciones...'); content.appendChild(loading);
  await ensureTemplateLoaded();
  try{
    const page=parseInt(params.page||'1',10)||1; const per_page=10;
    const data=await listJobApplications({ q: params.q||undefined, status: params.status||undefined, page, per_page });
  const items=Array.isArray(data)?data:(Array.isArray(data?.data)?data.data:[]);
  const counts=computeCounts(items);
  wrap.insertBefore(headerWithFilters({ q: params.q, status: params.status, counts }), content);
    loading.remove();
    if(!items.length){ content.appendChild(h('div',{class:'bg-white rounded-lg p-6 text-center text-gray-500'},'No hay postulaciones para mostrar.')); return; }
    const list=h('div',{class:'grid grid-cols-1 md:grid-cols-2 gap-6'});
    for(const it of items){ const card=renderCardFromTemplate(it); list.appendChild(card||h('div',{class:'rounded-lg border p-3 bg-white'}, `Postulación #${it.id||''}`)); }
    content.appendChild(list);
    const meta=data?.meta||{}; const last=meta.last_page||meta.lastPage||undefined;
    if(last && last>1){
      const pager=h('div',{class:'mt-6 flex items-center gap-2'},
        h('button',{class:'px-3 py-1 border rounded '+(page<=1?'opacity-50 cursor-not-allowed':''), disabled: page<=1?'':null},'Anterior'),
        h('span',{class:'text-sm text-gray-600'},`Página ${page} de ${last}`),
        h('button',{class:'px-3 py-1 border rounded '+(page>=last?'opacity-50 cursor-not-allowed':''), disabled: page>=last?'':null},'Siguiente')
      );
      const [prevBtn,,nextBtn]=pager.children;
      prevBtn.addEventListener('click',()=>{ if(page>1){ const sp=new URLSearchParams(location.search); sp.set('page', String(page-1)); history.replaceState(null,'',`${location.pathname}?${sp}`); mountJobApplicationsCompany(root);} });
      nextBtn.addEventListener('click',()=>{ if(page<last){ const sp=new URLSearchParams(location.search); sp.set('page', String(page+1)); history.replaceState(null,'',`${location.pathname}?${sp}`); mountJobApplicationsCompany(root);} });
      content.appendChild(pager);
    }
  }catch(e){ loading.textContent=`Error: ${e?.data?.message||e.message}`; }
}

export function autoMount(){ const el=document.querySelector('[data-page="job-applications-company"]'); if(el) mountJobApplicationsCompany(el); }
