import { apiFetch } from './http.js';

export async function listCategories(params = {}) {
  // Intenta endpoints comunes
  const candidates = ['/category', '/categories'];
  let lastErr = null;
  for (const p of candidates) {
    try {
      const r = await apiFetch(p, { query: params });
      // Normaliza a array
      if (Array.isArray(r)) return r;
      if (Array.isArray(r?.data)) return r.data;
      if (r && typeof r === 'object') {
        // intenta mapear objetos a array
        const values = Object.values(r);
        if (Array.isArray(values) && values.length && typeof values[0] === 'object') return values;
      }
    } catch (e) { lastErr = e; }
  }
  if (lastErr) throw lastErr;
  return [];
}
