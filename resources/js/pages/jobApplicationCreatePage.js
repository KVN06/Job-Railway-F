import { createJobApplication } from '../api/jobApplications.js';
import { requireAuth, resolveRole } from '../auth/permissions.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

export function mountJobApplicationCreate(root){
  if(!root) return;
  requireAuth(true).then(user=>{
    const role = resolveRole(user);
    // Permitimos crear postulaciones a desempleados; si hay otro flujo, aquí se ajusta
    if(role !== 'unemployed'){
      const url = new URL('/html/pages/home.html', location.origin);
      url.searchParams.set('error','No tienes permisos para postular a ofertas con este rol.');
      location.assign(url.toString());
      return;
    }
  }).catch(()=>{});
  const params=Object.fromEntries(new URLSearchParams(location.search).entries());
  const backHref=document.referrer || '/html/job-offers/index.html';
  const wrap=h('div',{class:'max-w-3xl mx-auto py-10 px-4'},
    h('div',{class:'mb-6'}, h('a',{href:backHref,class:'text-sm text-gray-600 hover:text-gray-800 inline-flex items-center gap-2'},'← Volver')),
    h('div',{class:'bg-white rounded-lg shadow p-6'},
      h('h2',{class:'text-2xl font-extrabold text-gray-800 mb-3'},'Postularse a una oferta'),
      h('div',{id:'alert-area'}),
      h('form',{class:'space-y-4'},
        h('input',{type:'hidden', name:'unemployed_id', value: params.unemployed_id||''}),
        h('input',{type:'hidden', name:'job_offer_id', value: params.job_offer_id||params.id||''}),
        h('div',null,
          h('label',{for:'message',class:'block text-sm font-medium text-gray-700'},'Mensaje (opcional)'),
          h('textarea',{name:'message',id:'message',rows:'4',maxlength:'2000',class:'mt-1 block w-full border border-gray-200 rounded-md px-3 py-2'})
        ),
        h('div',null,
          h('label',{for:'cv',class:'block text-sm font-medium text-gray-700'},'Adjuntar CV (opcional, PDF/DOC/DOCX, máx 5MB)'),
          h('input',{type:'file',name:'cv',id:'cv',accept:'.pdf,.doc,.docx',class:'mt-1 block w-full border border-gray-200 rounded px-2 py-1'})
        ),
        h('div',{class:'pt-2'}, h('button',{type:'submit',class:'w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 font-semibold'},'Enviar postulación'))
      )
    )
  );
  root.innerHTML=''; root.appendChild(wrap);

  const form=wrap.querySelector('form');
  const alertArea=wrap.querySelector('#alert-area');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    alertArea.innerHTML='';
    const fd=new FormData(form);
    const payload={
      unemployed_id: fd.get('unemployed_id')||undefined,
      job_offer_id: fd.get('job_offer_id')||undefined,
      message: fd.get('message')||'',
    };
    const file=form.querySelector('#cv')?.files?.[0];
    if(file) payload.cv=file;
    try{
      await createJobApplication(payload);
      const target='/html/job-applications/index-unemployed.html?success='+encodeURIComponent('Postulación enviada correctamente');
      location.assign(target);
    }catch(err){
      const msg=err?.data?.message||err?.message||'Error al enviar la postulación';
      if(window.UI?.createAlert){ alertArea.appendChild(window.UI.createAlert({ type:'error', content: msg })); }
      else { alertArea.textContent=msg; alertArea.className='bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded mb-4'; }
    }
  });
}

export function autoMount(){ const el=document.querySelector('[data-page="job-application-create"]'); if(el) mountJobApplicationCreate(el); }
