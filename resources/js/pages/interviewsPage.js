import { listInterviews, countInterviews } from '../api/interviews.js';
import { getJobApplication } from '../api/jobApplications.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

export async function mountInterviews(root){
  if(!root) return;
  root.innerHTML='';
  const usp = new URLSearchParams(location.search);
  const appId = root.getAttribute('data-application-id') || usp.get('application_id') || usp.get('id');

  const header = h('div',{class:'flex items-start justify-between gap-4 mb-4'},
    h('div',null,
      h('a',{href:'/html/job-applications/index-unemployed.html',class:'text-sm text-gray-600 hover:text-gray-800 inline-flex items-center gap-2'},'← Volver'),
      h('h2',{class:'text-2xl font-extrabold text-gray-800 mt-2',id:'title'},'Entrevistas'),
      h('p',{class:'text-sm text-gray-500 mt-1'},'Lista de entrevistas programadas para esta postulación.')
    ),
    h('div',{class:'text-sm text-gray-600',id:'total'},'Total: 0')
  );
  root.appendChild(header);

  const alert = h('div',{class:'hidden mb-4 p-3 rounded',id:'alert'});
  root.appendChild(alert);

  const content = h('div',{class:'grid grid-cols-1 gap-4',id:'list'});
  root.appendChild(content);

  // Carga datos de la postulación (para título)
  if (appId) {
    try {
      const r = await getJobApplication(appId);
      const app = r?.data ?? r; const title = app?.jobOffer?.title || app?.job_offer?.title;
      if (title) header.querySelector('#title').textContent = `Entrevistas para: ${title}`;
    } catch {}
  }

  // Banner de éxito opcional
  const ok = usp.get('success') || usp.get('message');
  if (ok) {
    const msg = (ok === '1' || ok === 'true') ? 'Acción realizada con éxito' : ok;
    showAlert(msg, 'success');
  }

  // Cargar entrevistas
  await load(appId);

  async function load(job_application_id){
    content.innerHTML = '';
    const params = job_application_id ? { job_application_id, per_page: 100 } : { per_page: 100 };
    let list = [];
    try {
      const res = await listInterviews(params);
      list = Array.isArray(res) ? res : (Array.isArray(res?.data)?res.data:[]);
      const total = await countInterviews(params);
      header.querySelector('#total').textContent = `Total: ${total ?? list.length}`;
    } catch (e) {
      showAlert(`Error cargando entrevistas: ${e?.data?.message||e.message}`,'error');
    }
    if (!list.length) {
      content.appendChild(h('div',{class:'p-4 bg-gray-50 border border-gray-200 rounded text-gray-700'},'No hay entrevistas programadas.'));
      return;
    }
    for (const it of list) content.appendChild(card(it));
  }

  function showAlert(msg, type='info'){
    if (!alert) return;
    alert.classList.remove('hidden');
    const base = 'mb-4 p-3 rounded';
    const palette = type==='error' ? 'bg-red-50 text-red-800 border border-red-200' : type==='success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-blue-50 text-blue-800 border border-blue-200';
    alert.className = `${base} ${palette}`;
    alert.textContent = msg;
  }
}

function card(it){
  const modeMap = { 'in-person':'Presencial', 'online':'En línea' };
  const statusClass = {
    pending:'bg-yellow-100 text-yellow-800',
    accepted:'bg-green-100 text-green-800',
    rejected:'bg-red-100 text-red-800',
    scheduled:'bg-blue-100 text-blue-800',
  };
  const when = fmtDateTime(it.scheduled_at || it.date || it.when);
  const dur = it.duration_minutes || it.duration || 0;
  const mode = modeMap[it.mode] || (it.mode?capitalize(it.mode):'—');
  const loc = it.location || '';
  const st = it.status || it.state || 'pending';
  const badge = statusClass[st] || 'bg-gray-100 text-gray-700';
  return h('div',{class:'p-4 bg-white border rounded flex items-center justify-between'},
    h('div',null,
      h('div',{class:'font-semibold'}, `${when}${dur?` (${dur} min)`:''}`),
      h('div',{class:'text-sm text-gray-600'}, `${mode}${loc?` · ${loc}`:''}`)
    ),
    h('div',{class:'flex items-center gap-4'},
      h('span',{class:`px-2 py-1 rounded ${badge} text-xs font-semibold`}, statusLabel(st))
    )
  );
}

function statusLabel(s){
  const map = { pending:'Pendiente', accepted:'Aceptada', rejected:'Rechazada', scheduled:'Programada' };
  return map[s] || capitalize(s);
}
function capitalize(s){ return (s||'').charAt(0).toUpperCase()+ (s||'').slice(1); }
function fmtDateTime(v){ try{ const d=new Date(v); const dd=d.toLocaleDateString(); const tt=d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); return `${dd} ${tt}`; }catch{return String(v||'');} }

export function autoMount(){ const host=document.querySelector('[data-page="interviews-index"]'); if(host) mountInterviews(host); }
