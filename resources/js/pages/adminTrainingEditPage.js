import { getTraining, updateTraining } from '../api/trainings.js';
import { requireRole } from '../auth/permissions.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

function getId(){ try { const u=new URL(location.href); return u.searchParams.get('id'); } catch { return null; } }

function field(label, id, type='text', attrs={}){
  const input = type==='textarea'? h('textarea',{id,name:id,rows:'4',class:'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'}): h('input',{id,name:id,type, class:'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'});
  Object.entries(attrs||{}).forEach(([k,v])=> input.setAttribute(k,String(v)));
  return { host: h('div',null, h('label',{for:id,class:'block text-sm font-medium text-gray-700'}, label), input), input };
}

function parseDateValue(v){ if(!v) return ''; try { const d=new Date(v); if(isNaN(d.getTime())) return v; return d.toISOString().slice(0,10); } catch { return v||''; } }

export async function mountAdminTrainingEdit(root){
  const container = root || document.querySelector('[data-page="admin-training-edit"]');
  if (!container) return;
  const { allowed } = await requireRole('admin');
  if (!allowed) return;
  const id = getId();
  container.innerHTML = '';
  if(!id){ container.appendChild(h('div',{class:'text-red-600'},'Falta el parámetro id')); return; }

  const title = h('h1',{class:'text-2xl font-bold text-gray-800 mb-6'},'Editar Capacitación');
  container.appendChild(title);

  const fTitle = field('Título *','title','text',{ required:true });
  const fProvider = field('Proveedor','provider');
  const fLink = field('Enlace','link','url');
  const fStart = field('Fecha de Inicio','start_date','date');
  const fEnd = field('Fecha de Fin','end_date','date');
  const fDesc = field('Descripción','description','textarea');

  const btnSubmit = h('button',{type:'submit',class:'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'},'Actualizar Capacitación');
  const btnCancel = h('a',{href:'/html/admin/trainings/index.html',class:'bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded'},'Cancelar');

  const form = h('form',{class:'bg-white rounded-lg shadow p-6 max-w-4xl'},
    h('div',{class:'grid grid-cols-1 md:grid-cols-2 gap-6'},
      h('div',{class:'md:col-span-2'}, fTitle.host),
      h('div',null, fProvider.host),
      h('div',null, fLink.host),
      h('div',null, fStart.host),
      h('div',null, fEnd.host),
      h('div',{class:'md:col-span-2'}, fDesc.host)
    ),
    h('div',{class:'flex gap-4 mt-6'}, btnSubmit, btnCancel)
  );
  container.appendChild(form);

  // Cargar datos actuales
  try {
    const data = await getTraining(id);
    const t = data?.data || data; // normalizar
    fTitle.input.value = t?.title || '';
    fProvider.input.value = t?.provider || '';
    fLink.input.value = t?.link || t?.url || '';
    fStart.input.value = parseDateValue(t?.start_date);
    fEnd.input.value = parseDateValue(t?.end_date);
    fDesc.input.value = t?.description || '';
  } catch(e){
    container.appendChild(h('div',{class:'text-red-600 mt-4'},'No se pudo cargar la capacitación.'));
  }

  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    btnSubmit.disabled = true;
    try {
      const payload = {
        title: fTitle.input.value?.trim(),
        provider: fProvider.input.value?.trim() || null,
        link: fLink.input.value?.trim() || null,
        start_date: fStart.input.value || null,
        end_date: fEnd.input.value || null,
        description: fDesc.input.value?.trim() || null,
      };
      if(!payload.title){ fTitle.input.focus(); btnSubmit.disabled=false; return; }
      await updateTraining(id, payload);
      // Redirige a index con banner de éxito
      const u = new URL('/html/admin/trainings/index.html', location.origin);
      u.searchParams.set('success','Capacitación actualizada correctamente');
      location.href = u.toString();
    } catch(err){
      alert('No se pudo actualizar: ' + (err?.data?.message || err?.message || 'Error'));
    } finally { btnSubmit.disabled = false; }
  });
}

export function autoMount(){ const host=document.querySelector('[data-page="admin-training-edit"]'); if(host) mountAdminTrainingEdit(host); }
