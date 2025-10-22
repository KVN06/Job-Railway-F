import { apiFetch, configureAuth, setAuthToken } from './http.js';

function buildPayload(type, id) {
  const raw = String(type || '').toLowerCase();
  const t = (raw === 'joboffer') ? 'job_offer' : raw; // preferencia por underscore para convenciones comunes
  const idNum = (typeof id === 'string' && /^\d+$/.test(id)) ? Number(id) : id;
  const variants = [t, t.replace(/_/g, '-'), t.replace(/-/g, '_')];
  return {
    // pares principales
    type: t, id: idNum ?? id,
    // aliases comunes
    favoritable_type: t, favoritable_id: idNum ?? id,
    item_type: t, item_id: idNum ?? id,
    entity_type: t, entity_id: idNum ?? id,
    target_type: t, target_id: idNum ?? id,
    // alternativa por si el backend espera nombre/modelo
    kind: t, resource: t, model: t, name: t,
    // variantes de tipo
    type_variants: variants,
  };
}

function buildQueryVariants(type, id) {
  const p = buildPayload(type, id);
  const idVal = p.id;
  const q = [];
  // genéricos
  q.push({ type: p.type, id: idVal });
  q.push({ favoritable_type: p.favoritable_type, favoritable_id: idVal });
  q.push({ item_type: p.item_type, item_id: idVal });
  q.push({ entity_type: p.entity_type, entity_id: idVal });
  q.push({ target_type: p.target_type, target_id: idVal });
  // por tipo conocido
  if (p.type === 'job_offer') q.push({ job_offer_id: idVal });
  if (p.type === 'classified') q.push({ classified_id: idVal });
  // flags de acción
  const withToggle = q.map(o => ({ ...o, toggle: 1 }));
  const withAction = q.map(o => ({ ...o, action: 'toggle' }));
  return [...withToggle, ...withAction, ...q];
}

export function listFavorites(params = {}) {
  // Soportar /favorite y /favorites, con reintento a modo cookie si 401
  const fetch1 = () => apiFetch('/favorite', { query: params });
  return fetchWithAuthRetry(fetch1).catch(async (err) => {
    if (err?.status === 404) {
      const fetch2 = () => apiFetch('/favorites', { query: params });
      return fetchWithAuthRetry(fetch2);
    }
    throw err;
  });
}

export async function toggleFavorite({ type, id }) {
  // Algunos backends exigen PUT/DELETE y rechazan POST con 405.
  // Estrategia:
  // 1) Intentar PUT /favorite/toggle con { type, id }.
  // 2) Si 404, intentar PUT /favorite (alta) como fallback legado.
  // 3) Si 405 en 1), reintentar PUT /favorite (hay backends que no exponen /favorite/toggle).
  // 4) Probar variantes pluralizadas (/favorites) y GET con query cuando el toggle sea un GET.
  // Nota: si el backend requiere DELETE para "des-favorito", debería devolver el estado actualizado en el paso 1).
  const payload = buildPayload(type, id);
  try {
    const res = await fetchWithAuthRetry(() => apiFetch('/favorite/toggle', { method: 'PUT', body: payload }));
    return normalizeToggle(res);
  } catch (err) {
    if (err?.status === 404 || err?.status === 405) {
      try {
        const res = await fetchWithAuthRetry(() => apiFetch('/favorite', { method: 'PUT', body: payload }));
        return normalizeToggle(res);
      } catch (e2) {
        // Intentar /favorites/toggle (plural) con PUT
        if (e2?.status === 404 || e2?.status === 405) {
          try {
            const r3 = await fetchWithAuthRetry(() => apiFetch('/favorites/toggle', { method: 'PUT', body: payload }));
            return normalizeToggle(r3);
          } catch (e3) {
            // Intentar GET con query (algunos backends hacen toggle vía GET)
            if (e3?.status === 404 || e3?.status === 405) {
              const variants = buildQueryVariants(type, id);
              // Intentar GET en /favorite/toggle y /favorites/toggle con múltiples variantes
              for (const q of variants) {
                try { const r4 = await fetchWithAuthRetry(() => apiFetch('/favorite/toggle', { method: 'GET', query: q })); return normalizeToggle(r4); } catch {}
                try { const r5 = await fetchWithAuthRetry(() => apiFetch('/favorites/toggle', { method: 'GET', query: q })); return normalizeToggle(r5); } catch {}
                // Intentar GET directo a /favorite y /favorites con ?toggle=1
                try { const r6 = await fetchWithAuthRetry(() => apiFetch('/favorite', { method: 'GET', query: { ...q } })); return normalizeToggle(r6); } catch {}
                try { const r7 = await fetchWithAuthRetry(() => apiFetch('/favorites', { method: 'GET', query: { ...q } })); return normalizeToggle(r7); } catch {}
              }
              // PUT/POST como último recurso en rutas base singular/plural
              try {
                const r8 = await fetchWithAuthRetry(() => apiFetch('/favorites', { method: 'PUT', body: payload }));
                return normalizeToggle(r8);
              } catch (e8) {
                try {
                  const r9 = await fetchWithAuthRetry(() => apiFetch('/favorite', { method: 'POST', body: payload }));
                  return normalizeToggle(r9);
                } catch (e9) {
                  try {
                    const r10 = await fetchWithAuthRetry(() => apiFetch('/favorites', { method: 'POST', body: payload }));
                    return normalizeToggle(r10);
                  } catch (e10) {
                    throw e10;
                  }
                }
              }
            } else {
              throw e3;
            }
          }
        } else {
          throw e2;
        }
      }
    }
    throw err;
  }
}

// Helper: reintenta con modo cookie automáticamente si recibe 401
async function fetchWithAuthRetry(doFetch) {
  try {
    return await doFetch();
  } catch (err) {
    if (err?.status === 401) {
      try {
        // Cambiar a modo cookie y limpiar token bearer
        try { localStorage.setItem('auth_mode', 'cookie'); localStorage.removeItem('auth_token'); } catch {}
        configureAuth({ mode: 'cookie' });
        setAuthToken(undefined);
        return await doFetch();
      } catch (err2) {
        throw err2;
      }
    }
    throw err;
  }
}

function normalizeToggle(res) {
  // Devuelve { isFavorite: boolean }

  if (typeof res === 'object' && res) {
    if ('isFavorite' in res) return { isFavorite: !!res.isFavorite };
    if ('favorited' in res) return { isFavorite: !!res.favorited };
    if ('favorite' in res) return { isFavorite: !!res.favorite };
    if (typeof res?.data === 'object' && res.data) {
      const d = res.data;
      if ('isFavorite' in d) return { isFavorite: !!d.isFavorite };
      if ('favorited' in d) return { isFavorite: !!d.favorited };
      if ('favorite' in d) return { isFavorite: !!d.favorite };
      if ('status' in d && (d.status === 'added' || d.status === 'removed')) return { isFavorite: d.status === 'added' };
    }
    if ('status' in res && (res.status === 'added' || res.status === 'removed')) return { isFavorite: res.status === 'added' };
  }
  return { isFavorite: false };
}
