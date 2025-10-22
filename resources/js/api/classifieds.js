import { apiFetch } from './http.js';

export function listClassifieds(params = {}) {
  return apiFetch('/classified', { query: params });
}

export function getClassified(id) {
  return apiFetch(`/classified/${id}`);
}

export async function deleteClassified(id) {
  return apiFetch(`/classified/${id}` , { method: 'DELETE' });
}

export async function countClassifieds(params = {}) {
  // Estrategia múltiple: endpoint dedicado, meta.total, agregación por páginas, fallback
  const candidates = [
    async () => await apiFetch('/classified/count', { query: params }),
    async () => {
      const r = await apiFetch('/classified', { query: { ...params, per_page: 1 } });
      const meta = r?.meta || r?.pagination || {};
      if (meta.total != null) return meta.total;
      if (typeof r?.total === 'number') return r.total;
      return null;
    },
    async () => {
      // Agregación limitada
      let page = 1;
      const per_page = 50;
      let total = 0;
      for (let i = 0; i < 5; i++) { // máximo 5 páginas
        const r = await apiFetch('/classified', { query: { ...params, page, per_page } });
        const items = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
        total += items.length;
        const meta = r?.meta || r?.pagination;
        if (!meta || meta.current_page >= meta.last_page || items.length < per_page) break;
        page++;
      }
      return total || null;
    },
  ];
  for (const fn of candidates) {
    try { const v = await fn(); if (typeof v === 'number') return v; } catch {}
  }
  // Fallback mínimo
  try {
    const r = await apiFetch('/classified', { query: { ...params, per_page: 50 } });
    const items = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
    return items.length;
  } catch { return 0; }
}

export async function countClassifiedsToday() {
  // Intento de endpoints comunes
  const candidates = [
    async () => await apiFetch('/classified/today/count'),
    async () => await apiFetch('/classified/count', { query: { today: 1 } }),
  ];
  for (const fn of candidates) {
    try { const v = await fn(); if (typeof v === 'number') return v; } catch {}
  }
  // Fallback: contar en primeras 100 entradas
  try {
    const r = await apiFetch('/classified', { query: { per_page: 100, sort: 'created_at:desc' } });
    const items = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
    const today = new Date().toDateString();
    return items.filter(x => new Date(x.created_at || x.date).toDateString() === today).length;
  } catch { return 0; }
}
