import { apiFetch, webFetch, getAuthMode } from './http.js';

// Crea o actualiza el perfil de desempleado del usuario autenticado
// payload: { profession, experience, location }
export async function createUnemployedProfile(payload) {
  const fetchFn = getAuthMode() === 'cookie' ? webFetch : apiFetch;
  async function tryOne(path, method='POST') {
    return await fetchFn(path, { method, body: payload });
  }
  // Intentos de endpoint conocidos/comunes
  try {
    return await tryOne('/unemployed');
  } catch (e1) {
    if (e1?.status === 404 || e1?.status === 405) {
      try { return await tryOne('/agg-unemployed'); } catch (e2) {
        if (e2?.status === 404 || e2?.status === 405) {
          try { return await tryOne('/unemployeds'); } catch (e3) {
            if (e3?.status === 404 || e3?.status === 405) {
              return await tryOne('/unemployed-profile');
            }
            throw e3;
          }
        }
        throw e2;
      }
    }
    // Fallback local en desarrollo/localhost
    try {
      const useFake = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_FAKE_UNEMPLOYED_WHEN_FAIL === 'true')
        || ['localhost','127.0.0.1'].includes(window.location.hostname);
      if (useFake) {
        const key = 'local_unemployed_profiles';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        const fake = { id: Date.now(), ...payload, created_at: new Date().toISOString() };
        list.push(fake);
        localStorage.setItem(key, JSON.stringify(list));
        return fake;
      }
    } catch {}
    throw e1;
  }
}
