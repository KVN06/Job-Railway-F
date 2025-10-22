import { listMessages, sendMessage } from '../api/messages.js';
import { listContacts } from '../api/contacts.js';
import { getCurrentUser } from '../api/authUser.js';

function h(t,a={},...c){const e=document.createElement(t);for(const[k,v]of Object.entries(a||{}))k==='class'?e.className=v:e.setAttribute(k,v);for(const ch of c.flat())if(ch!=null)e.appendChild(ch instanceof Node?ch:document.createTextNode(String(ch)));return e;}

export async function mountMessages(root){
	if (!root) return;
	// Layout superior (header + alert opcional)
	root.innerHTML = '';
	const header = h('div', { class: 'mb-6' },
		h('div', { class: 'bg-white rounded-2xl shadow-soft p-6 border border-blue-900/30' },
			h('div', { class: 'flex items-center justify-between' },
				h('div', { class: 'flex items-center' },
					h('i', { class: 'fas fa-comments text-blue-700 text-2xl mr-3' }),
					h('div', null,
						h('h1', { class: 'text-2xl font-bold' }, 'Centro de Mensajes'),
						h('p', { class: 'text-sm text-gray-500' }, 'Conversaciones y mensajes en tiempo real (UI simulada)')
					)
				),
				h('div', null,
					h('a', { href: '/html/forms/message-form.html', class: 'text-sm text-blue-600 hover:underline' }, 'Nuevo mensaje')
				)
			)
		)
	);
	root.appendChild(header);

	const usp = new URLSearchParams(location.search);
	const ok = usp.get('success');
	if (ok) {
		root.appendChild(h('div', { class: 'bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl mb-6 shadow-soft' }, ok));
	}

	// Contenedor principal de chat
	const wrapper = h('div', { class: 'bg-white rounded-2xl shadow-soft overflow-hidden border border-blue-900/30', style: 'height:70vh;' },
		h('div', { class: 'flex h-full' },
			// Sidebar contactos
			h('aside', { class: 'w-80 border-r border-gray-100 p-4 flex flex-col' },
				h('div', { class: 'mb-4' },
					h('input', { type: 'text', id: 'searchContacts', placeholder: 'Buscar...', class: 'w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200' })
				),
				h('div', { class: 'flex-1 overflow-auto', id: 'contactsList' },
					h('p', { class: 'text-slate-500 p-3' }, 'Cargando contactos…')
				)
			),
			// Conversación
			h('section', { class: 'flex-1 flex flex-col' },
				// Header conversación
				h('div', { class: 'border-b border-gray-100 p-4 flex items-center gap-3' },
					h('div', { id: 'convAvatar', class: 'w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold' }, '?'),
					h('div', { class: 'min-w-0' },
						h('div', { id: 'convName', class: 'font-semibold truncate' }, 'Selecciona un contacto'),
						h('div', { id: 'convMeta', class: 'text-xs text-gray-500' }, '\u00A0')
					)
				),
				// Lista de mensajes
				h('div', { id: 'messagesList', class: 'flex-1 overflow-auto p-4 space-y-2 bg-gray-50' },
					h('p', { class: 'text-slate-500' }, 'No hay conversación seleccionada')
				),
				// Composer
				h('form', { id: 'composer', class: 'border-t border-gray-100 p-3 flex items-end gap-2' },
					h('textarea', { id: 'composerInput', rows: '1', placeholder: 'Escribe un mensaje…', class: 'flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none' }),
					h('button', { id: 'composerSend', type: 'submit', class: 'inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg' },
						h('i', { class: 'fa-solid fa-paper-plane' }), ' Enviar'
					)
				)
			)
		)
	);
		root.appendChild(wrapper);

	// Estado
		let contacts = [];
	let conversations = new Map(); // key: contactId, value: { messages: [], lastAt }
	let selectedId = null;
		let me = null;

	const elContacts = root.querySelector('#contactsList');
	const elSearch = root.querySelector('#searchContacts');
	const elMsgs = root.querySelector('#messagesList');
	const elName = root.querySelector('#convName');
	const elMeta = root.querySelector('#convMeta');
	const elAvatar = root.querySelector('#convAvatar');
	const form = root.querySelector('#composer');
	const input = root.querySelector('#composerInput');
	const sendBtn = root.querySelector('#composerSend');

		// Carga inicial: usuario, contactos y mensajes
		try { me = await getCurrentUser(); } catch {}
		await loadContacts();
		await loadMessages();
	renderContacts();
	// Selecciona el primero si existe
	if (contacts.length) selectContact(contacts[0].id);

	// Eventos
	elSearch?.addEventListener('input', () => filterContacts());
	form?.addEventListener('submit', async (e) => {
		e.preventDefault();
		const text = input.value.trim();
		if (!selectedId) return;
		if (!text) return;
		sendBtn.disabled = true;
		try {
			const sent = await sendMessage({ receiver_id: selectedId, content: text });
			// Añadir optimistamente
			const conv = conversations.get(selectedId) || { messages: [], lastAt: null };
			conv.messages.push(normalizeMessage(sent));
			conv.lastAt = conv.messages[conv.messages.length - 1]?.created_at || conv.lastAt;
			conversations.set(selectedId, conv);
			input.value = '';
			renderMessages();
			scrollToBottom();
			renderContacts();
		} catch (err) {
			alert(err?.data?.message || err.message || 'No se pudo enviar el mensaje');
		} finally {
			sendBtn.disabled = false;
		}
	});

	function filterContacts() {
		const q = (elSearch?.value || '').toLowerCase();
		for (const btn of elContacts.querySelectorAll('.contact-item')) {
			const name = (btn.getAttribute('data-name') || '').toLowerCase();
			btn.style.display = name.includes(q) ? 'flex' : 'none';
		}
	}

	async function loadContacts() {
		try {
			contacts = await listContacts();
			if (!Array.isArray(contacts)) contacts = [];
		} catch (e) {
			elContacts.innerHTML = '';
			elContacts.appendChild(h('p', { class: 'text-red-600 p-3' }, `Error cargando contactos: ${e?.data?.message || e.message}`));
		}
	}

		async function loadMessages() {
		try {
			const res = await listMessages({ per_page: 100 });
			const items = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
				const normalized = items.map(normalizeMessage).filter(Boolean);
			// Agrupar por contacto (conversaciones bilaterales)
			conversations = new Map();
			for (const m of normalized) {
					let otherId = null;
					if (me?.id != null) {
						if (m.sender_id === me.id) otherId = m.receiver_id;
						else if (m.receiver_id === me.id) otherId = m.sender_id;
					}
					if (otherId == null) otherId = m.other_user_id || m.receiver_id || m.sender_id;
				if (!otherId) continue;
				const conv = conversations.get(otherId) || { messages: [], lastAt: null };
				conv.messages.push(m);
				conv.lastAt = m.created_at || conv.lastAt;
				conversations.set(otherId, conv);
			}
			// Ordenar mensajes dentro de cada conversación
			for (const conv of conversations.values()) conv.messages.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
		} catch (e) {
			console.warn('Error cargando mensajes:', e);
		}
	}

	function normalizeMessage(m) {
		if (!m) return null;
		// Inferir estructura común
		const id = m.id ?? m.message_id ?? undefined;
		const sender_id = m.sender_id ?? m.user_id ?? m.from_id ?? m.sender?.id;
		const receiver_id = m.receiver_id ?? m.to_id ?? m.receiver?.id;
		const content = m.content ?? m.body ?? m.text ?? m.message ?? '';
		const created_at = m.created_at ?? m.sent_at ?? m.date ?? new Date().toISOString();
		// Para agrupar: si yo soy sender, el otro es receiver, y viceversa; sin user actual, aproximamos usando receiver_id/sender_id
		const other_user_id = receiver_id || sender_id;
		return { id, sender_id, receiver_id, content, created_at, other_user_id };
	}

	function renderContacts() {
		elContacts.innerHTML = '';
		if (!contacts.length && conversations.size === 0) {
			elContacts.appendChild(h('p', { class: 'text-slate-500 p-3' }, 'Sin contactos'));
			return;
		}
		// Mezcla: contactos conocidos, ordenados por lastAt si hay conversación
		const rows = contacts.map(u => ({
			id: u.id,
			name: u.name || u.email || `ID ${u.id}`,
			lastMsg: conversations.get(u.id)?.messages?.slice(-1)[0]?.content || '',
			lastAt: conversations.get(u.id)?.lastAt || null,
		}));
		// Agregar usuarios solo por conversación (si no están en contactos)
		for (const [oid, conv] of conversations.entries()) {
			if (!rows.find(r => r.id === oid)) {
				rows.push({ id: oid, name: `Usuario ${oid}`, lastMsg: conv.messages.slice(-1)[0]?.content || '', lastAt: conv.lastAt });
			}
		}
		rows.sort((a,b)=>new Date(b.lastAt||0)-new Date(a.lastAt||0));

		for (const r of rows) {
			const btn = h('button', { type: 'button', class: `contact-item w-full text-left p-3 rounded-xl mb-2 flex items-center hover:bg-gray-50 transition ${selectedId===r.id?'bg-gray-100':''}`, 'data-id': String(r.id), 'data-name': r.name });
			const avatar = h('div', { class: 'w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-3' }, (r.name||'?').charAt(0).toUpperCase());
			const right = h('div', { class: 'flex-1 min-w-0' },
				h('div', { class: 'flex justify-between items-center' },
					h('div', { class: 'text-sm font-semibold truncate' }, r.name),
					h('div', { class: 'text-xs text-gray-400' }, r.lastAt ? timeAgo(r.lastAt) : '\u00A0')
				),
				h('div', { class: 'text-xs text-gray-500 truncate' }, r.lastMsg || '\u00A0')
			);
			btn.append(avatar, right);
			btn.addEventListener('click', () => selectContact(r.id));
			elContacts.appendChild(btn);
		}
		filterContacts();
	}

	function selectContact(id) {
		selectedId = id;
		const row = contacts.find(c=>c.id===id);
		const name = row?.name || row?.email || `Usuario ${id}`;
		elAvatar.textContent = (name||'?').charAt(0).toUpperCase();
		elName.textContent = name;
		const conv = conversations.get(id);
		elMeta.textContent = conv?.lastAt ? `Último mensaje ${timeAgo(conv.lastAt)}` : '\u00A0';
		renderContacts();
		renderMessages();
		scrollToBottom();
	}

	function renderMessages() {
		elMsgs.innerHTML = '';
		if (!selectedId) {
			elMsgs.appendChild(h('p', { class: 'text-slate-500' }, 'No hay conversación seleccionada'));
			return;
		}
		const conv = conversations.get(selectedId);
		if (!conv || !conv.messages.length) {
			elMsgs.appendChild(h('p', { class: 'text-slate-500' }, 'Aún no hay mensajes. ¡Escribe el primero!'));
			return;
		}
			for (const m of conv.messages) {
				const mine = me?.id != null && (m.sender_id === me.id);
			const bubble = h('div', { class: `max-w-[70%] rounded-2xl px-4 py-2 ${mine?'bg-indigo-600 text-white self-end ml-auto':'bg-white border border-gray-200'} shadow-sm` }, m.content || '');
			const line = h('div', { class: `w-full flex ${mine?'justify-end':''}` },
				h('div', { class: 'flex flex-col' }, bubble, h('div', { class: 'text-[10px] text-gray-400 mt-1' }, timeAgo(m.created_at)))
			);
			elMsgs.appendChild(line);
		}
	}

	function scrollToBottom() {
		elMsgs.scrollTop = elMsgs.scrollHeight;
	}

		// Enviar con Enter (sin Shift)
		input?.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				form?.requestSubmit();
			}
		});

		function timeAgo(date) {
			try {
				const d = new Date(date);
				const s = Math.floor((Date.now() - d.getTime())/1000);
				if (s < 60) return `hace ${s}s`;
				const m = Math.floor(s/60); if (m < 60) return `hace ${m}m`;
				const h = Math.floor(m/60); if (h < 24) return `hace ${h}h`;
				const dd = Math.floor(h/24); if (dd < 7) return `hace ${dd}d`;
				return d.toLocaleDateString();
			} catch { return ''; }
		}
}

export function autoMount(){ const el=document.querySelector('[data-page="messages"]'); if(el) mountMessages(el); }
