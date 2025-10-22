import { apiFetch } from './http.js';

// Intenta múltiples rutas conocidas para obtener contactos/usuarios
export async function listContacts(params = {}) {
  const candidates = [
    { path: '/users', query: params },
    { path: '/message/contacts', query: params },
    { path: '/contacts', query: params },
  ];
  let lastErr = null;
  for (const c of candidates) {
    try {
      const r = await apiFetch(c.path, { query: c.query });
      const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
      if (arr && Array.isArray(arr)) return arr;
    } catch (e) { lastErr = e; }
  }
  // Fallback local (dev/demo)
  try {
    const raw = localStorage.getItem('fake_contacts');
    if (raw) return JSON.parse(raw);
  } catch {}
  if (lastErr) throw lastErr;
  return [];
}
