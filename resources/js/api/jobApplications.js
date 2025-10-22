import { apiFetch } from './http.js';

export function listJobApplications(params = {}) {
  return apiFetch('/job-application', { query: params });
}

export function getJobApplication(id) {
  return apiFetch(`/job-application/${id}`);
}

export async function createJobApplication(payload) {
  // payload: { unemployed_id?, job_offer_id, message?, cv? }
  // 1) Validación ligera de archivo
  const fd = new FormData();
  for (const [k, v] of Object.entries(payload || {})) {
    if (v === undefined || v === null) continue;
    if (k === 'cv' && v instanceof File) {
      const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (v.size > 5 * 1024 * 1024) {
        const err = new Error('El archivo supera 5MB'); err.code = 'FILE_TOO_LARGE'; throw err;
      }
      if (!allowed.includes(v.type) && !/\.pdf$|\.doc$|\.docx$/i.test(v.name || '')) {
        const err = new Error('Formato no permitido (solo PDF/DOC/DOCX)'); err.code = 'FILE_INVALID_TYPE'; throw err;
      }
      fd.append('cv', v);
      // Backends alternativos
      fd.append('resume', v);
      fd.append('curriculum', v);
    } else {
      fd.append(k, v);
    }
  }
  // 2) Intentar múltiples endpoints comunes
  const offerId = payload?.job_offer_id || payload?.jobOfferId || payload?.offer_id;
  const endpoints = [
    '/job-application',
    '/job-applications',
    '/applications',
    offerId ? `/job-offer/${offerId}/apply` : null,
    offerId ? `/joboffers/${offerId}/apply` : null,
    offerId ? `/job-offers/${offerId}/apply` : null,
  ].filter(Boolean);
  let lastErr = null;
  for (const ep of endpoints) {
    try {
      return await apiFetch(ep, { method: 'POST', body: fd });
    } catch (e) {
      lastErr = e;
      // Si es validación 422 con estructura Laravel, propaga pronto
      if (e?.status === 422) throw e;
      // Si es 401, deja que el caller maneje redirección
      if (e?.status === 401) throw e;
      // Intenta siguiente endpoint
    }
  }
  if (lastErr) throw lastErr;
  throw new Error('No se pudo crear la postulación');
}

export async function hasAppliedToOffer(job_offer_id) {
  // Revisa múltiples opciones para detectar postulación del usuario actual a una oferta
  const candidates = [
    { path: '/job-application', query: { job_offer_id, me: 1, per_page: 1 } },
    { path: '/job-applications', query: { job_offer_id, me: 1, per_page: 1 } },
    { path: '/applications', query: { job_offer_id, me: 1, per_page: 1 } },
    { path: '/job-application/check', query: { job_offer_id } },
  ];
  for (const c of candidates) {
    try {
      const r = await apiFetch(c.path, { query: c.query });
      if (typeof r === 'boolean') return r;
      const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
      if (arr.length > 0) return true;
      // Algunos backends devuelven meta.total
      const total = r?.meta?.total ?? r?.total;
      if (Number.isFinite(total)) return total > 0;
    } catch (_) { /* try next */ }
  }
  // Fallback: lista general y filtra en cliente (puede requerir permisos)
  try {
    const r = await listJobApplications({ per_page: 50, page: 1 });
    const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
    return arr.some(a => String(a?.job_offer_id) === String(job_offer_id));
  } catch (_) { return false; }
}

export async function countJobApplications(params = {}) {
  const candidates = ['/job-application/count', '/job-applications/count', '/applications/count'];
  let lastErr = null;
  for (const p of candidates) {
    try {
      const r = await apiFetch(p, { query: params });
      const n = (typeof r === 'number') ? r : (r?.total ?? r?.count ?? r?.data?.total);
      if (Number.isFinite(n)) return n;
    } catch (e) { lastErr = e; }
  }
  // meta.total with minimal payload
  try {
    const r = await listJobApplications({ ...params, per_page: 1, page: 1 });
    const total = r?.meta?.total ?? r?.total;
    if (Number.isFinite(total)) return total;
  } catch (e) { lastErr = e; }
  // Try large-page
  try {
    const pageHints = [
      { per_page: 1000, page: 1 },
      { limit: 1000, page: 1 },
      { per_page: 5000, page: 1 },
    ];
    for (const q of pageHints) {
      const r = await listJobApplications({ ...params, ...q });
      const total = r?.meta?.total ?? r?.total;
      if (Number.isFinite(total)) return total;
      const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
      if (arr.length > 0) return arr.length;
    }
  } catch (e) { lastErr = e; }
  // Capped pagination aggregator (best-effort)
  try {
    let page = 1; let sum = 0; const pageSize = 100; const maxPages = 20;
    for (; page <= maxPages; page++) {
      const r = await listJobApplications({ ...params, per_page: pageSize, page });
      const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
      if (!arr.length) break;
      sum += arr.length;
      const lastPage = r?.meta?.last_page ?? r?.last_page;
      if (Number.isFinite(lastPage) && page >= lastPage) break;
    }
    if (sum > 0) return sum;
  } catch (e) { lastErr = e; }
  if (lastErr) throw lastErr;
  return 0;
}
