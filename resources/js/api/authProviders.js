import { ROOT_BASE_URL } from './http.js';

// Intenta localizar el endpoint correcto de OAuth de Google en el backend.
// Permite configurar explícitamente por env: VITE_GOOGLE_OAUTH_URL o VITE_GOOGLE_OAUTH_PATH
export async function openGoogleOAuth({ redirect = '/html/pages/home.html', params = {} } = {}) {
  const envUrl = (import.meta?.env?.VITE_GOOGLE_OAUTH_URL || '').trim();
  const envPath = (import.meta?.env?.VITE_GOOGLE_OAUTH_PATH || '').trim();
  const search = new URLSearchParams(params);
  if (redirect && typeof redirect === 'string') search.set('redirect', redirect);

  // Si usuario configuró URL absoluta, usarla directo
  if (envUrl.startsWith('http')) {
    const href = appendQuery(envUrl, search);
    window.location.href = href;
    return;
  }

  const candidates = [];
  // 1) Ruta especificada como path por env
  if (envPath) candidates.push(envPath);
  // 2) Variantes comunes en backends Laravel/Socialite
  candidates.push(
    '/auth/google/redirect',
    '/auth/google',
    '/login/google',
    '/oauth/google/redirect',
    '/oauth/google',
    '/social/google/redirect',
    '/social/google',
    '/api/auth/google/redirect',
    '/api/auth/google',
    '/api/login/google'
  );

  // Probar en orden con una sonda HEAD/GET; en el primer 200/3xx/401/405 navegamos
  const tried = [];
  for (const path of uniqueStrings(candidates)) {
    try {
      const probeUrl = toAbs(path);
      tried.push(probeUrl);
      const res = await fetch(probeUrl, { method: 'GET', credentials: 'include', mode: 'cors' });
      // Si no es 404, asumimos que es ruta válida (algunos devuelven 302, 401, 405, 200)
      if (res.status !== 404) {
        const href = appendQuery(probeUrl, search);
        window.location.href = href;
        return;
      }
    } catch (_) { /* ignorar y continuar */ }
  }
  const msg = 'No se encontró el endpoint de Google en el backend. Probé:\n' + tried.join('\n');
  alert(msg);
}

function toAbs(path){
  if (/^https?:\/\//i.test(path)) return path;
  return ROOT_BASE_URL + (path.startsWith('/') ? path : `/${path}`);
}

function uniqueStrings(arr){
  const out=[]; const seen=new Set();
  for(const s of arr){ const k=String(s).trim(); if(!k || seen.has(k)) continue; seen.add(k); out.push(k); }
  return out;
}

function appendQuery(url, search){
  if (!search || (search instanceof URLSearchParams && !Array.from(search.keys()).length)) return url;
  const u = new URL(url);
  for (const [k,v] of (search instanceof URLSearchParams ? search : new URLSearchParams(search))) {
    if (v != null && v !== '') u.searchParams.set(k, String(v));
  }
  return u.toString();
}
