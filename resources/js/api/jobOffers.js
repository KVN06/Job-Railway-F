import { apiFetch } from './http.js';

export async function listJobOffers(params = {}) {
  return apiFetch('/job-offer', { query: params });
}

export async function getJobOffer(id) {
  return apiFetch(`/job-offer/${id}`);
}

export async function createJobOffer(payload) {
  return apiFetch('/job-offer', { method: 'POST', body: payload });
}

export async function updateJobOffer(id, payload) {
  return apiFetch(`/job-offer/${id}`, { method: 'PUT', body: payload });
}

export async function deleteJobOffer(id) {
  return apiFetch(`/job-offer/${id}`, { method: 'DELETE' });
}

// Cuenta ofertas con varias estrategias para distintos backends
export async function countJobOffers(params = {}) {
  // 1) Endpoint dedicado si existe
  const countCandidates = ['/job-offer/count', '/job-offers/count', '/jobs/count'];
  let lastErr = null;
  for (const p of countCandidates) {
    try {
      const r = await apiFetch(p, { query: params });
      const n = (typeof r === 'number') ? r : (r?.total ?? r?.count ?? r?.data?.total);
      if (Number.isFinite(n)) return n;
    } catch (e) { lastErr = e; }
  }
  // 2) Paginado: per_page=1 para obtener meta.total
  try {
    const r = await listJobOffers({ ...params, per_page: 1, page: 1 });
    const total = r?.meta?.total ?? r?.total ?? undefined;
    if (Number.isFinite(total)) return total;
  } catch (e) { lastErr = e; }
  // 2.5) Paginado: intentar una página grande por si no hay meta pero sí devuelve todo
  try {
    // Intentos con claves comunes
    const candidates = [
      { per_page: 1000, page: 1 },
      { limit: 1000, page: 1 },
      { per_page: 5000, page: 1 },
    ];
    for (const q of candidates) {
      const r = await listJobOffers({ ...params, ...q });
      const total = r?.meta?.total ?? r?.total;
      if (Number.isFinite(total)) return total;
      const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
      if (arr.length > 0) return arr.length; // mejor que la página por defecto de 4
    }
  } catch (e) { lastErr = e; }
  // 2.8) Agregación paginada acotada (mejor esfuerzo)
  try {
    let page = 1; let sum = 0; const pageSize = 100; const maxPages = 20;
    for (; page <= maxPages; page++) {
      const r = await listJobOffers({ ...params, per_page: pageSize, page });
      const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
      if (!arr.length) break;
      sum += arr.length;
      const lastPage = r?.meta?.last_page ?? r?.last_page;
      if (Number.isFinite(lastPage) && page >= lastPage) break;
    }
    if (sum > 0) return sum;
  } catch (e) { lastErr = e; }
  // 3) Fallback: contar items (puede ser parcial si la API pagina sin meta)
  try {
    const r = await listJobOffers({ ...params });
    const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
    return arr.length;
  } catch (e) { lastErr = e; }
  if (lastErr) throw lastErr;
  return 0;
}
