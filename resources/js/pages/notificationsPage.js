function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

export function mountNotifications(root){
	if (!root) return;
	root.innerHTML = '';
	root.appendChild(
		h('div', { class: 'rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-10 text-center space-y-4 text-blue-900' },
			h('div', { class: 'text-4xl' }, '🔔'),
			h('h2', { class: 'text-2xl font-bold' }, 'Módulo de notificaciones en desarrollo'),
			h('p', { class: 'text-sm max-w-2xl mx-auto text-blue-900/80' }, 'Pronto podrás recibir avisos de postulaciones, entrevistas y mensajes importantes directamente aquí. Estamos trabajando en esta funcionalidad.'),
			h('a', { href: '/html/pages/home.html', class: 'inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition' },
				h('i', { class: 'fas fa-arrow-left' }),
				'Volver al panel principal'
			)
		)
	);
}

export function autoMount(){
	const el = document.querySelector('[data-page="notifications"]');
	if (el) mountNotifications(el);
}
