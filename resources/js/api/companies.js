import { apiFetch, webFetch, getAuthMode } from './http.js';

export function listCompanies(params = {}) {
  return apiFetch('/company', { query: params });
}

export function getCompany(id) {
  return apiFetch(`/company/${id}`);
}

export async function createCompany(payload) {
  // Normaliza y prueba variantes de payload/endpoints para adaptarnos al backend
  const variants = [
    // Variante base (JSON habitual)
    { body: { ...payload } },
    // Algunos backends esperan company_name
    { body: { company_name: payload.name, email: payload.email, nit: payload.nit, website: payload.website, description: payload.description } },
    // Otros usan camelCase y tax_id / website_url
    { body: { companyName: payload.name, email: payload.email, tax_id: payload.nit, website_url: payload.website, description: payload.description } },
    // Algunos usan 'about' en vez de description
    { body: { name: payload.name, email: payload.email, nit: payload.nit, website: payload.website, about: payload.description } },
  ];
  const endpoints = [
    { fn: apiFetch, path: '/company' },
  ];
  // Solo probar variantes con cookie si el modo global es cookie (para evitar CORS con credentials include)
  if (getAuthMode() === 'cookie') {
    endpoints.push(
      { fn: (p, o) => apiFetch(p, { ...o, auth: 'cookie' }), path: '/company' },
    );
  }

  // Probar combinaciones de endpoints y variantes
  let lastErr; let primaryErr;
  for (const ep of endpoints) {
    for (const v of variants) {
      try {
        return await ep.fn(ep.path, { method: 'POST', body: v.body });
      } catch (err) {
        lastErr = err;
        if (!primaryErr && err?.status && err.status !== 404 && err.status !== 405) primaryErr = err;
        // si es validación o auth, no seguimos probando variantes
        if (err?.status === 401 || err?.status === 403 || err?.status === 422) throw err;
        // si 404, probamos siguiente endpoint/estrategia
        if (err?.status === 404) break;
        // si 500, intentaremos siguiente variante o endpoint
      }
    }
  }

  // Fallback: rutas web probables
  try {
    const sameOrigin = (() => {
      try { return new URL(window.location.origin).origin === new URL(ROOT_BASE_URL || window.location.origin).origin; } catch { return false; }
    })();
    if (sameOrigin) {
      const webRoutes = ['/agg-company', '/register-company', '/empresa', '/empresas', '/empresas/crear'];
      for (const w of webRoutes) {
        try {
          return await webFetch(w, { method: 'POST', body: payload });
        } catch (err) {
          lastErr = err;
          if (err?.status === 401 || err?.status === 403 || err?.status === 422) throw err;
          continue;
        }
      }
    }
  } catch (_) {}

  // Modo simulación (solo en localhost o si está activa la flag de entorno)
  try {
    const useFake = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_FAKE_COMPANY_WHEN_FAIL === 'true')
      || ['localhost','127.0.0.1'].includes(window.location.hostname);
    if (useFake) {
      const fake = { id: Date.now(), ...payload, company_name: payload.name, created_at: new Date().toISOString() };
      const key = 'local_companies';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push(fake);
      localStorage.setItem(key, JSON.stringify(list));
      return fake;
    }
  } catch {}

  throw primaryErr || lastErr || new Error('No fue posible registrar la empresa');
}

export async function countCompanies(params = {}) {
  const candidates = ['/company/count', '/companies/count', '/empresas/count'];
  let lastErr = null;
  for (const p of candidates) {
    try {
      const r = await apiFetch(p, { query: params });
      const n = (typeof r === 'number') ? r : (r?.total ?? r?.count ?? r?.data?.total);
      if (Number.isFinite(n)) return n;
    } catch (e) { lastErr = e; }
  }
  try {
    const r = await listCompanies({ ...params, per_page: 1, page: 1 });
    const total = r?.meta?.total ?? r?.total ?? undefined;
    if (Number.isFinite(total)) return total;
  } catch (e) { lastErr = e; }
  // Intentar traer una página grande para evitar que el length sea muy bajo
  try {
    const candidates = [
      { per_page: 1000, page: 1 },
      { limit: 1000, page: 1 },
      { per_page: 5000, page: 1 },
    ];
    for (const q of candidates) {
      const r = await listCompanies({ ...params, ...q });
      const total = r?.meta?.total ?? r?.total;
      if (Number.isFinite(total)) return total;
      const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
      if (arr.length > 0) return arr.length;
    }
  } catch (e) { lastErr = e; }
  try {
    const r = await listCompanies({ ...params });
    const arr = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
    return arr.length;
  } catch (e) { lastErr = e; }
  if (lastErr) throw lastErr;
  return 0;
}
