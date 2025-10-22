import { apiFetch } from './http.js';

export async function listInterviews(params = {}) {
  // Soporta filtros: job_application_id, status, per_page, page
  // Intenta /interview y /interviews
  const candidates = ['/interview', '/interviews'];
  let lastErr = null;
  for (const p of candidates) {
    try { return await apiFetch(p, { query: params }); } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('No se pudo obtener entrevistas');
}

export async function getInterview(id) {
  const candidates = [`/interview/${id}`, `/interviews/${id}`];
  let lastErr = null;
  for (const p of candidates) {
    try { return await apiFetch(p); } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('No se pudo obtener entrevista');
}

export async function countInterviews(params = {}) {
  const candidates = ['/interview/count', '/interviews/count'];
  for (const p of candidates) {
    try { const r = await apiFetch(p, { query: params }); if (typeof r === 'number') return r; if (Number.isFinite(r?.total)) return r.total; } catch {}
  }
  try {
    const r = await listInterviews({ ...params, per_page: 1, page: 1 });
    const meta = r?.meta || r?.pagination; const n = meta?.total ?? r?.total; if (Number.isFinite(n)) return n;
  } catch {}
  // Fallback mínimo
  try { const r = await listInterviews({ ...params, per_page: 50, page: 1 }); const arr = Array.isArray(r)?r:(Array.isArray(r?.data)?r.data:[]); return arr.length; } catch { return 0; }
}
