import { listContacts } from '../api/contacts.js';
import { sendMessage } from '../api/messages.js';

export function autoMount() {
  const root = document.querySelector('[data-page="message-form"]');
  if (!root) return;
  initMessageForm(root).catch(err => console.error('Message form init error:', err));
}

async function initMessageForm(root) {
  // Elementos
  const listEl = root.querySelector('#contactList');
  const searchEl = root.querySelector('#contactSearch');
  const receiverInput = root.querySelector('#receiver_id');
  const selectedRecipient = root.querySelector('#selectedRecipient');
  const avatarEl = root.querySelector('#selectedAvatar');
  const nameEl = root.querySelector('#selectedName');
  const subEl = root.querySelector('#selectedSubtitle');
  const contentEl = root.querySelector('#content');
  const sendBtn = root.querySelector('#sendBtn');
  const formEl = root.querySelector('#messageForm');

  // Poblar contactos
  listEl.innerHTML = '<p class="text-slate-500 p-3">Cargando contactos…</p>';
  let contacts = [];
  try {
    contacts = await listContacts();
  } catch (e) {
    listEl.innerHTML = `<p class="text-red-600 p-3">Error cargando contactos: ${e?.data?.message||e.message}</p>`;
  }
  if (!Array.isArray(contacts)) contacts = [];
  renderContacts(listEl, contacts, onSelect);

  // Búsqueda
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      const q = searchEl.value.trim().toLowerCase();
      Array.from(listEl.querySelectorAll('.contact-row')).forEach(row => {
        const name = (row.getAttribute('data-name') || '').toLowerCase();
        row.style.display = name.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // Selección por defecto
  const first = listEl.querySelector('.contact-row');
  if (first) first.click();

  // Enviar con Enter
  if (contentEl) {
    contentEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!receiverInput.value) return;
        formEl?.requestSubmit();
      }
    });
  }

  // Submit
  formEl?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!receiverInput.value) return alert('Selecciona un destinatario primero');
    const content = contentEl.value.trim();
    if (!content) return alert('Escribe un mensaje');
    sendBtn.disabled = true;
    try {
      await sendMessage({ receiver_id: receiverInput.value, content });
      contentEl.value = '';
      contentEl.focus();
    } catch (err) {
      alert(err?.data?.message || err.message || 'No se pudo enviar el mensaje');
    } finally {
      sendBtn.disabled = false;
    }
  });

  function onSelect(contact, rowEl) {
    receiverInput.value = contact.id;
    selectedRecipient.textContent = contact.name || contact.email || `ID ${contact.id}`;
    avatarEl.textContent = (contact.name || contact.email || '?').charAt(0).toUpperCase();
    nameEl.textContent = contact.name || 'Nuevo mensaje';
    subEl.textContent = 'Envíale un mensaje';
    Array.from(listEl.querySelectorAll('.contact-row')).forEach(r => r.classList.remove('bg-gray-100'));
    if (rowEl) rowEl.classList.add('bg-gray-100');
    sendBtn.disabled = false;
    contentEl.focus();
  }
}

function renderContacts(container, contacts, onSelect) {
  container.innerHTML = '';
  if (!contacts.length) {
    return container.appendChild(el('p', { class: 'text-slate-500 p-3' }, 'Sin contactos'));
  }
  for (const u of contacts) {
    const row = el('button', {
      type: 'button',
      class: 'w-full text-left p-3 hover:bg-gray-50 contact-row flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-100',
      'data-id': u.id,
      'data-name': u.name || u.email || `ID ${u.id}`,
    });
    const avatar = el('div', { class: 'w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full flex items-center justify-center font-semibold text-sm' }, (u.name||u.email||'?').charAt(0).toUpperCase());
    const name = el('div', { class: 'font-medium text-sm truncate' }, u.name || u.email || `ID ${u.id}`);
    const meta = el('div', { class: 'text-xs text-gray-500 truncate' }, u.role || 'Perfil');
    const right = el('div', { class: 'flex-1 min-w-0' },
      el('div', { class: 'flex items-center justify-between' }, name, el('div', { class: 'text-xs text-gray-400' }, '\u00A0')),
      meta,
    );
    row.append(avatar, right);
    row.addEventListener('click', () => onSelect(u, row));
    container.appendChild(row);
  }
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  }
  for (const ch of children.flat()) node.appendChild(ch instanceof Node ? ch : document.createTextNode(String(ch)));
  return node;
}
