import { webFetch, apiFetch, getAuthMode, getAuthToken, configureAuth, setAuthToken } from './http.js';

export async function getCurrentUser() {
  // Intenta ruta API común si existe, si no, Laravel web /user
  try {
    return await apiFetch('/user');
  } catch (e) {
    const mode = getAuthMode();
    const hasToken = !!getAuthToken();
    // Si estamos en modo bearer sin token, intenta automáticamente modo cookie
    if (mode === 'bearer' && !hasToken) {
      try {
        configureAuth({ mode: 'cookie' });
        setAuthToken(undefined);
        try { localStorage.setItem('auth_mode', 'cookie'); } catch {}
        try { localStorage.removeItem('auth_token'); } catch {}
        const fallback = await apiFetch('/user', { auth: 'cookie' });
        return fallback;
      } catch (cookieErr) {
        // Restablecer modo bearer para no afectar futuras peticiones si falla
        configureAuth({ mode: 'bearer' });
        setAuthToken(undefined);
        try { localStorage.setItem('auth_mode', 'bearer'); } catch {}
        throw Object.assign(new Error('AUTH_REQUIRED'), { status: 401, code: 'AUTH_REQUIRED' });
      }
    }
    // En modo cookie, o si hay token pero /api/user no está, intenta /user
    try {
      const fallback = await webFetch('/user', { auth: mode === 'cookie' ? undefined : 'cookie' });
      if (mode !== 'cookie') {
        configureAuth({ mode: 'cookie' });
        setAuthToken(undefined);
        try { localStorage.setItem('auth_mode', 'cookie'); } catch {}
        try { localStorage.removeItem('auth_token'); } catch {}
      }
      return fallback;
    } catch (e2) {
      // Propaga 401 como auth requerida; otros errores como 404/CORS los convertimos en auth requerida
      if (e2?.status === 401) {
        const err = new Error('AUTH_REQUIRED'); err.status = 401; err.code = 'AUTH_REQUIRED'; throw err;
      }
      const err = new Error('AUTH_REQUIRED'); err.status = 401; err.code = 'AUTH_REQUIRED'; throw err;
    }
  }
}
