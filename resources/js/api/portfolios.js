import { apiFetch } from './http.js';

export function listPortfolios(params = {}) {
  return apiFetch('/portfolio', { query: params });
}

export function getPortfolio(id) {
  return apiFetch(`/portfolio/${id}`);
}

export async function createPortfolio(payload) {
  // payload admite: { title, description, url_proyect, url_pdf?: File }
  // Construir FormData para permitir PDF opcional
  const fd = new FormData();
  if (payload.title) fd.append('title', payload.title);
  if (payload.description) fd.append('description', payload.description);
  // aceptar ambos nombres por compatibilidad
  if (payload.url_proyect) fd.append('url_proyect', payload.url_proyect);
  if (payload.url_project) fd.append('url_project', payload.url_project);
  if (payload.url_pdf instanceof File) fd.append('url_pdf', payload.url_pdf);

  // Intentar endpoints comunes
  const candidates = ['/portfolio', '/portfolios', '/agg-portfolio'];
  let lastErr;
  for (const p of candidates) {
    try {
      return await apiFetch(p, { method: 'POST', body: fd });
    } catch (e) {
      lastErr = e;
      if (e?.status === 401 || e?.status === 403 || e?.status === 422) throw e;
      continue;
    }
  }
  throw lastErr || new Error('No fue posible crear el portafolio');
}

export function updatePortfolio(id, payload) {
  return apiFetch(`/portfolio/${id}`, { method: 'PUT', body: payload });
}

export function deletePortfolio(id) {
  return apiFetch(`/portfolio/${id}`, { method: 'DELETE' });
}
