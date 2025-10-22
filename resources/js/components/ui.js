function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

const ALERT_STYLES = {
  success: { box:'from-green-50 to-emerald-50 border-green-200 text-green-700', icon:'fas fa-check-circle text-green-600' },
  error:   { box:'from-red-50 to-pink-50 border-red-200 text-red-700', icon:'fas fa-exclamation-circle text-red-600' },
  warning: { box:'from-yellow-50 to-amber-50 border-yellow-200 text-yellow-700', icon:'fas fa-exclamation-triangle text-yellow-600' },
  info:    { box:'from-blue-50 to-indigo-50 border-blue-200 text-blue-700', icon:'fas fa-info-circle text-blue-600' },
};

export function createAlert({ type='info', dismissible=true, icon, content, className='' }={}){
  const cfg = ALERT_STYLES[type] || ALERT_STYLES.info;
  const wrap = h('div',{class:`mb-6 bg-gradient-to-r ${cfg.box} border rounded-xl p-5 shadow-sm ${className}`});
  const iconEl = h('div',{class:'w-10 h-10 bg-white/70 rounded-full flex items-center justify-center mr-3 flex-shrink-0'}, h('i',{class:(icon||cfg.icon)+' text-xl'}));
  const body = h('div',{class:'flex items-start'}, iconEl, h('div',{class:'flex-1'}, content || ''));
  if (dismissible){
    const btn = h('button',{type:'button',class:'ml-4 text-current opacity-70 hover:opacity-100 transition-opacity', title:'Cerrar'}, h('i',{class:'fas fa-times'}));
    btn.addEventListener('click',()=>{ wrap.remove(); });
    body.appendChild(btn);
  }
  wrap.appendChild(body);
  return wrap;
}

const BADGE_VARIANTS = {
  default:'bg-gray-100 text-gray-800', primary:'bg-blue-100 text-blue-800', success:'bg-green-100 text-green-800', warning:'bg-yellow-100 text-yellow-800', danger:'bg-red-100 text-red-800',
  pending:'bg-yellow-100 text-yellow-800', under_review:'bg-indigo-100 text-indigo-800', accepted:'bg-green-100 text-green-800', rejected:'bg-red-100 text-red-800'
};
const BADGE_SIZES = { sm:'px-2 py-1 text-xs', md:'px-3 py-1 text-sm', lg:'px-4 py-2 text-base' };

export function createBadge({ variant='default', size='md', icon, text='', className='' }={}){
  const cls = `inline-flex items-center font-semibold rounded-full ${BADGE_VARIANTS[variant]||BADGE_VARIANTS.default} ${BADGE_SIZES[size]||BADGE_SIZES.md} ${className}`;
  const el = h('span',{class:cls});
  if (icon) el.appendChild(h('i',{class:icon+' mr-1.5'}));
  el.appendChild(document.createTextNode(text));
  return el;
}

const CARD_VARIANTS = {
  default:'bg-white rounded-2xl border border-blue-900/20 p-6 shadow-sm',
  enhanced:'bg-white rounded-2xl p-6 shadow-lg transition-shadow',
  glassmorphism:'backdrop-blur bg-white/60 rounded-2xl border border-white/30 p-6 shadow-sm',
  gradient:'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-md',
};

export function createCard({ variant='default', hover=true, paddingClass='', className='', children=[] }={}){
  const base = CARD_VARIANTS[variant]||CARD_VARIANTS.default;
  const hoverCls = hover ? 'transition-transform duration-300 hover:-translate-y-1' : '';
  const pad = paddingClass || '';
  const el = h('div',{class:`${base} ${hoverCls} ${pad} ${className}`.trim()});
  const nodes = Array.isArray(children)?children:[children];
  for (const n of nodes) el.appendChild(n instanceof Node ? n : h('div',null,String(n)));
  return el;
}

// Exponer helpers para demos
function createInput({ label, name='', type='text', error, icon, hint, required=false, value='', className='', inputProps={} }={}){
  const wrap = h('div',{class:className});
  if (label){
    const lab = h('label',{for:name,class:'block text-sm font-semibold text-gray-700 mb-2'});
    if (icon) lab.appendChild(h('i',{class:icon+' text-blue-600 mr-1'}));
    lab.appendChild(document.createTextNode(label));
    if (required) lab.appendChild(h('span',{class:'text-red-500'},'*'));
    wrap.appendChild(lab);
  }
  const input = h('input',{
    type, name, id:name,
    class:'form-input-enhanced w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300'+(error?' border-red-500':''),
    value
  });
  Object.entries(inputProps||{}).forEach(([k,v])=> input.setAttribute(k,String(v)));
  wrap.appendChild(input);
  if (hint) wrap.appendChild(h('p',{class:'text-sm text-gray-500 mt-1'}, hint));
  if (error) wrap.appendChild(h('p',{class:'text-sm text-red-600 mt-1'}, h('i',{class:'fas fa-exclamation-circle mr-1'}), String(error)));
  return { host: wrap, input };
}

const SPINNER_SIZES = { sm:'w-4 h-4 border-2', md:'w-8 h-8 border-4', lg:'w-12 h-12 border-4', xl:'w-16 h-16 border-4' };
function createSpinner({ size='md', text, className='' }={}){
  const wrap = h('div',{class:`flex flex-col items-center justify-center ${className}`.trim()});
  const circle = h('div',{class:`loading-spinner ${SPINNER_SIZES[size]||SPINNER_SIZES.md}`});
  wrap.appendChild(circle);
  if (text) wrap.appendChild(h('p',{class:'mt-3 text-gray-600 font-medium'}, text));
  return wrap;
}

function createModal({ name='modal', title='', size='md', showClose=true, content, className='' }={}){
  const SIZE = { sm:'max-w-md', md:'max-w-2xl', lg:'max-w-4xl', xl:'max-w-6xl', full:'max-w-full mx-4' };
  const host = h('div',{class:'fixed inset-0 z-50 overflow-y-auto hidden'});
  const backdrop = h('div',{class:'fixed inset-0 bg-black bg-opacity-50'});
  const wrap = h('div',{class:'flex items-center justify-center min-h-screen p-4'});
  const modal = h('div',{class:`bg-white rounded-2xl shadow-2xl w-full ${SIZE[size]||SIZE.md} relative`});
  if (title || showClose){
    const header = h('div',{class:'flex items-center justify-between p-6 border-b border-gray-200'});
    header.appendChild(h('h3',{class:'text-xl font-bold text-gray-900'}, title));
    if (showClose){ const close = h('button',{class:'text-gray-400 hover:text-gray-600', title:'Cerrar'}, h('i',{class:'fas fa-times text-xl'})); close.addEventListener('click',()=>hide()); header.appendChild(close); }
    modal.appendChild(header);
  }
  const body = h('div',{class:'p-6'});
  if (content) body.appendChild(content instanceof Node ? content : h('div',null,String(content)));
  modal.appendChild(body);
  wrap.appendChild(modal);
  host.appendChild(backdrop); host.appendChild(wrap);

  function show(){ host.classList.remove('hidden'); document.body.style.overflow='hidden'; }
  function hide(){ host.classList.add('hidden'); document.body.style.overflow=''; }
  backdrop.addEventListener('click', hide);
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') hide(); });
  return { host, show, hide, setContent:(node)=>{ body.innerHTML=''; body.appendChild(node instanceof Node?node:h('div',null,String(node))); } };
}

try { window.UI = Object.assign(window.UI||{}, { createAlert, createBadge, createCard, createInput, createSpinner, createModal }); } catch {}
// --- Nuevos componentes: Select y Textarea ---
function normalizeOptions(options){
  return (options||[]).map(o=>{
    if (o==null) return { value:'', label:'' };
    if (typeof o==='string' || typeof o==='number') return { value:String(o), label:String(o) };
    const { value, label, disabled, selected } = o;
    return { value: value!=null?String(value):'', label: label!=null?String(label):'', disabled: !!disabled, selected: !!selected };
  });
}

function createSelect({ label, name='', options=[], placeholder, selected, error, icon, hint, required=false, className='', selectProps={} }={}){
  const wrap = h('div',{class:className});
  if (label){
    const lab = h('label',{for:name,class:'block text-sm font-semibold text-gray-700 mb-2'});
    if (icon) lab.appendChild(h('i',{class:icon+' text-blue-600 mr-1'}));
    lab.appendChild(document.createTextNode(label));
    if (required) lab.appendChild(h('span',{class:'text-red-500'},'*'));
    wrap.appendChild(lab);
  }
  const sel = h('select',{
    name, id:name,
    class:'form-input-enhanced w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300'+(error?' border-red-500':''),
  });
  const opts = normalizeOptions(options);
  if (placeholder){
    const ph = h('option',{value:'', disabled:'', selected: (selected==null? '': null)}, placeholder);
    sel.appendChild(ph);
  }
  for (const o of opts){
    const attrs = { value:o.value };
    if (o.disabled) attrs.disabled='';
    const shouldSelect = selected!=null ? String(selected)===o.value : o.selected;
    if (shouldSelect) attrs.selected='';
    sel.appendChild(h('option', attrs, o.label));
  }
  Object.entries(selectProps||{}).forEach(([k,v])=> sel.setAttribute(k,String(v)));
  wrap.appendChild(sel);
  if (hint) wrap.appendChild(h('p',{class:'text-sm text-gray-500 mt-1'}, hint));
  if (error) wrap.appendChild(h('p',{class:'text-sm text-red-600 mt-1'}, h('i',{class:'fas fa-exclamation-circle mr-1'}), String(error)));
  return { host: wrap, select: sel };
}

function createTextarea({ label, name='', rows=4, value='', error, icon, hint, required=false, className='', textareaProps={} }={}){
  const wrap = h('div',{class:className});
  if (label){
    const lab = h('label',{for:name,class:'block text-sm font-semibold text-gray-700 mb-2'});
    if (icon) lab.appendChild(h('i',{class:icon+' text-blue-600 mr-1'}));
    lab.appendChild(document.createTextNode(label));
    if (required) lab.appendChild(h('span',{class:'text-red-500'},'*'));
    wrap.appendChild(lab);
  }
  const ta = h('textarea',{
    name, id:name, rows:String(rows),
    class:'form-input-enhanced w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300'+(error?' border-red-500':''),
  }, value||'');
  Object.entries(textareaProps||{}).forEach(([k,v])=> ta.setAttribute(k,String(v)));
  wrap.appendChild(ta);
  if (hint) wrap.appendChild(h('p',{class:'text-sm text-gray-500 mt-1'}, hint));
  if (error) wrap.appendChild(h('p',{class:'text-sm text-red-600 mt-1'}, h('i',{class:'fas fa-exclamation-circle mr-1'}), String(error)));
  return { host: wrap, textarea: ta };
}

try { window.UI = Object.assign(window.UI||{}, { createSelect, createTextarea }); } catch {}
