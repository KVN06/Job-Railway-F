import { listJobApplications } from '../api/jobApplications.js';
function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

function formatWhen(iso){ try{ const d=new Date(iso); return d.toLocaleString(); }catch{ return iso||''; } }

function badgeClass(status){
	const map={pending:'bg-yellow-100 text-yellow-800',accepted:'bg-green-100 text-green-800',rejected:'bg-red-100 text-red-800',scheduled:'bg-blue-100 text-blue-800'};
	return map[status]||'bg-gray-100 text-gray-700';
}

function renderCardFromTemplate(app){
	const tpl=document.getElementById('job-application-card-template');
	if(!tpl) return null;
	const node=tpl.content.firstElementChild.cloneNode(true);
	const initials=(app?.unemployed?.user?.name||app?.applicant_name||'??').slice(0,2).toUpperCase();
	node.querySelector('[data-initials]').textContent=initials;
	const title=app?.jobOffer?.title||app?.title||`Oferta #${app?.job_offer_id||app?.jobOfferId||''}`;
	const company=app?.jobOffer?.company?.name||app?.company?.name||'Empresa';
	const link=node.querySelector('[data-job-link]');
	if(link){ link.href=`/html/job-offers/show.html?id=${app?.jobOffer?.id||app?.job_offer_id||''}`; }
	node.querySelector('[data-job-title]').textContent=title;
	node.querySelector('[data-company-name]').textContent=company;
	const badge=node.querySelector('[data-status-badge]');
	if(badge){ badge.textContent=app?.status_label||app?.status||'Estado'; badge.className=`ml-2 inline-block px-2 py-0.5 rounded text-xs font-semibold ${badgeClass(app?.status)}`; }
	const created=node.querySelector('[data-created-at]'); if(created) created.textContent=app?.created_at||'';
	const msg=node.querySelector('[data-message]'); msg.textContent=(app?.message||'Sin mensaje');
	if(app?.cv_url){ const a=node.querySelector('[data-cv-link]'); a.href=app.cv_url; a.classList.remove('hidden'); }
	// Última entrevista
	const li=node.querySelector('[data-latest-interview]');
	const latest=Array.isArray(app?.interviews)?[...app.interviews].sort((a,b)=>new Date(b.scheduled_at)-new Date(a.scheduled_at))[0]:null;
	if(latest && li){ li.classList.remove('hidden'); li.querySelector('[data-interview-when]').textContent=formatWhen(latest.scheduled_at); li.querySelector('[data-interview-mode]').textContent=latest.mode||'N/A'; li.querySelector('[data-interview-duration]').textContent=latest.duration_minutes||30; }
	// Modales de mensaje
	const modal=node.querySelector('[data-modal="message"]');
	const btnMsg=node.querySelector('[data-action="view-message"]');
	if(btnMsg && app?.message){ btnMsg.classList.remove('hidden'); btnMsg.addEventListener('click',()=>{ modal?.classList.remove('hidden'); node.querySelector('[data-message-content]').textContent=app.message; }); node.querySelector('[data-action="close-message"]').addEventListener('click',()=>modal?.classList.add('hidden')); }
	return node;
}

export async function mountJobApplications(root){
	if(!root) return;
	root.innerHTML='';
	const p=h('p',{class:'text-slate-500'},'Cargando postulaciones...');
	root.appendChild(p);
	try{
		// Asegurar que el template esté disponible en el DOM
		if(!document.getElementById('job-application-card-template')){
			try{
				const res=await fetch('/html/includes/job-application-card.html', { credentials: 'same-origin' });
				if(res.ok){
					const html=await res.text();
					const wrap=document.createElement('div');
					wrap.style.display='none';
					wrap.innerHTML=html;
					document.body.appendChild(wrap);
				}
			}catch{ /* no-op si falla, se usará fallback simple */ }
		}
		const data=await listJobApplications();
		const items=Array.isArray(data)?data:Array.isArray(data?.data)?data.data:[];
		p.remove();
		if(!items.length){ return root.appendChild(h('p',{class:'text-slate-500'},'Sin postulaciones')); }
		const list=h('div',{class:'space-y-4'});
		for(const it of items){
			const card=renderCardFromTemplate(it);
			list.appendChild(card||h('div',{class:'rounded-lg border p-3 bg-white'}, `Postulación #${it.id||''}`));
		}
		root.appendChild(list);
	}catch(e){
		p.textContent=`Error: ${e?.data?.message||e.message}`;
	}
}
export function autoMount(){ const el=document.querySelector('[data-page="job-applications"]'); if(el) mountJobApplications(el); }
