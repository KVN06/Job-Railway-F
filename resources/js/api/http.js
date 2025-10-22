// Cliente de bajo nivel para la API
const DEFAULT_BASE = 'https://job-railway-production.up.railway.app/api';

export const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || DEFAULT_BASE).replace(/\/$/, '');
export const ROOT_BASE_URL = API_BASE_URL.replace(/\/?api$/, '');

// Estado de autenticación del cliente
const DEFAULT_AUTH_MODE = (import.meta?.env?.VITE_API_AUTH_MODE || 'bearer');
let AUTH_MODE = (DEFAULT_AUTH_MODE === 'cookie' ? 'cookie' : 'bearer'); // 'bearer' | 'cookie'
let AUTH_TOKEN = undefined; // Token JWT u otro

export function configureAuth({ mode, token } = {}) {
  if (mode === 'bearer' || mode === 'cookie') AUTH_MODE = mode;
  if (typeof token === 'string') AUTH_TOKEN = token;
}
export function setAuthToken(token) { AUTH_TOKEN = token; }
export function clearAuthToken() { AUTH_TOKEN = undefined; }
export function getAuthToken() { return AUTH_TOKEN; }
export function getAuthMode() { return AUTH_MODE; }

let CSRF_READY = false; // Para evitar llamadas redundantes a /sanctum/csrf-cookie

function getCookie(name) {
  try {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  } catch { return null; }
}

async function ensureCsrfCookie() {
  if (CSRF_READY) return;
  try {
    const url = API_BASE_URL.replace(/\/?api\/?$/, '') + '/sanctum/csrf-cookie';
    await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    CSRF_READY = true;
  } catch (_) {
    // Ignorar; si falla, la petición subsiguiente puede devolver 419 y el caller manejará el error
  }
}

function buildHeaders(baseHeaders = {}, hasBody, isFormData = false) {
  const hdrs = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(hasBody && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...baseHeaders,
  };
  if (AUTH_MODE === 'bearer' && AUTH_TOKEN) {
    hdrs.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return hdrs;
}

export async function apiFetch(path, { method = 'GET', headers = {}, body, query, auth } = {}) {
  const url = new URL(API_BASE_URL + (path.startsWith('/') ? path : `/${path}`));
  if (query && typeof query === 'object') {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }

  // Permite forzar el modo de auth por petición
  const mode = auth || AUTH_MODE;
  // Si estamos en modo cookie y es una mutación, intenta preparar CSRF
  const isMutation = /^(POST|PUT|PATCH|DELETE)$/i.test(method || 'GET');
  if (mode === 'cookie' && isMutation && !path.includes('/sanctum/csrf-cookie')) {
    await ensureCsrfCookie();
    const xsrf = getCookie('XSRF-TOKEN');
    if (xsrf && !('X-XSRF-TOKEN' in headers)) headers['X-XSRF-TOKEN'] = xsrf;
  }
  const isFormData = (typeof FormData !== 'undefined') && (body instanceof FormData);
  const res = await fetch(url, {
    method,
    headers: buildHeaders(headers, !!body, isFormData),
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    credentials: mode === 'cookie' ? 'include' : 'omit',
    mode: 'cors',
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const err = new Error(data?.message || `API ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.data = data;
    if (res.status === 401) err.code = 'AUTH_REQUIRED';
    throw err;
  }
  return data;
}

export async function webFetch(path, { method = 'GET', headers = {}, body, query, auth } = {}) {
  // Llama al dominio raíz (sin /api). Útil para rutas web de Laravel como /login, /register
  const url = new URL(ROOT_BASE_URL + (path.startsWith('/') ? path : `/${path}`));
  if (query && typeof query === 'object') {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
  }
  const mode = auth || AUTH_MODE;
  const isMutation = /^(POST|PUT|PATCH|DELETE)$/i.test(method || 'GET');
  if (mode === 'cookie' && isMutation && !path.includes('/sanctum/csrf-cookie')) {
    await ensureCsrfCookie();
    const xsrf = getCookie('XSRF-TOKEN');
    if (xsrf && !('X-XSRF-TOKEN' in headers)) headers['X-XSRF-TOKEN'] = xsrf;
  }
  const isFormData = (typeof FormData !== 'undefined') && (body instanceof FormData);
  const res = await fetch(url, {
    method,
    headers: buildHeaders(headers, !!body, isFormData),
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    credentials: mode === 'cookie' ? 'include' : 'omit',
    mode: 'cors',
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const err = new Error(data?.message || `WEB ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.data = data;
    if (res.status === 401) err.code = 'AUTH_REQUIRED';
    throw err;
  }
  return data;
}
