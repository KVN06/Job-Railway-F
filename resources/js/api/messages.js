import { apiFetch } from './http.js';

export function listMessages(params = {}) {
  return apiFetch('/message', { query: params });
}

export function getMessage(id) {
  return apiFetch(`/message/${id}`);
}

export async function sendMessage({ receiver_id, content }) {
  if (!receiver_id || !content) {
    const err = new Error('receiver_id y content son requeridos');
    err.status = 422; throw err;
  }
  // Intenta rutas comunes
  const payload = { receiver_id, content };
  const candidates = [
    { path: '/message', method: 'POST' },
    { path: '/messages', method: 'POST' },
    { path: '/send-message', method: 'POST' },
  ];
  let lastErr = null;
  for (const c of candidates) {
    try {
      return await apiFetch(c.path, { method: c.method, body: payload });
    } catch (e) { lastErr = e; }
  }
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    // Simula envío
    return { id: Date.now(), receiver_id, content, status: 'sent', created_at: new Date().toISOString() };
  }
  throw lastErr || new Error('No se pudo enviar el mensaje');
}
