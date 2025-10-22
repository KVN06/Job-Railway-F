import { apiFetch } from './http.js';

export async function countUsers(params = {}) {
  const candidates = ['/user/count', '/users/count', '/users/total'];
  for (const p of candidates) {
    try {
      const r = await apiFetch(p, { query: params });
      const n = (typeof r === 'number') ? r : (r?.total ?? r?.count ?? r?.data?.total);
      if (Number.isFinite(n)) return n;
    } catch {}
  }
  // Fallback mínimo: no sabemos listar usuarios en este front
  return 0;
}
