import { apiFetch, webFetch, setAuthToken, getAuthMode, configureAuth } from './http.js';

function pickToken(candidate) {
  if (!candidate) return null;
  if (typeof candidate === 'string') return candidate;
  if (typeof candidate !== 'object') return null;
  const tokenLike = [
    candidate.token,
    candidate.access_token,
    candidate.accessToken,
    candidate.bearer_token,
    candidate.bearerToken,
    candidate.plainTextToken,
    candidate.plain_text_token,
    candidate.value,
  ];
  return tokenLike.find((value) => typeof value === 'string') || null;
}

function extractToken(response) {
  // Intenta extraer token desde varias formas comunes
  const candidates = [
    response?.token,
    response?.access_token,
    response?.accessToken,
    response?.auth_token,
    response?.bearer_token,
    response?.data?.token,
    response?.data?.access_token,
    response?.data?.accessToken,
    response?.data?.auth_token,
    response?.data?.bearer_token,
    response?.meta?.token,
    response?.meta?.access_token,
    response?.data?.token?.plainTextToken,
    response?.data?.token?.token,
    response?.data?.token?.access_token,
    response?.data?.token?.value,
    response?.token?.plainTextToken,
    response?.token?.token,
    response?.token?.access_token,
  ];
  for (const candidate of candidates) {
    const picked = pickToken(candidate);
    if (picked) return picked;
  }
  return null;
}

function normalizeUserCandidate(candidate, seen = new Set()) {
  if (!candidate || typeof candidate !== 'object') return null;
  if (seen.has(candidate)) return null;
  seen.add(candidate);
  if (Array.isArray(candidate)) {
    for (const item of candidate) {
      const normalized = normalizeUserCandidate(item, seen);
      if (normalized) return normalized;
    }
    return null;
  }
  const nestedKeys = ['data', 'user', 'attributes', 'payload'];
  for (const key of nestedKeys) {
    if (candidate[key] && typeof candidate[key] === 'object') {
      const nested = normalizeUserCandidate(candidate[key], seen);
      if (nested) return nested;
    }
  }
  const indicativeKeys = ['id', 'uuid', 'name', 'email', 'role', 'roles', 'type', 'company', 'unemployed'];
  const hasSignals = indicativeKeys.some((key) => key in candidate);
  return hasSignals ? candidate : null;
}

function extractUser(response) {
  const candidates = [
    response?.user,
    response?.data?.user,
    response?.data?.data?.user,
    response?.data?.user?.data,
    response?.user?.data,
    response?.data?.data,
    response?.data,
    response?.payload?.user,
    response?.payload,
  ];
  for (const candidate of candidates) {
    const normalized = normalizeUserCandidate(candidate);
    if (normalized) return normalized;
  }
  return null;
}

function storeBearerToken(token) {
  if (!token) return;
  try { localStorage.setItem('auth_token', token); } catch {}
  try { localStorage.setItem('auth_mode', 'bearer'); } catch {}
  configureAuth({ mode: 'bearer', token });
  setAuthToken(token);
}

function switchToCookieMode() {
  try {
    localStorage.setItem('auth_mode', 'cookie');
    localStorage.removeItem('auth_token');
  } catch {}
  configureAuth({ mode: 'cookie' });
  setAuthToken(undefined);
}

export async function login({ email, password }) {
  const credentials = { email, password };
  const preferredMode = getAuthMode();
  const basePaths = ['/login', '/inicia-sesion', '/sign-in'];
  const attemptQueue = [];
  const queued = new Set();
  let bearerSuccessWithoutToken = null;

  const enqueue = (transport, authMode) => {
    for (const path of basePaths) {
      const key = `${transport}|${authMode}|${path}`;
      if (queued.has(key)) continue;
      queued.add(key);
      attemptQueue.push({ transport, authMode, path });
    }
  };

  if (preferredMode === 'bearer') {
    enqueue('api', 'bearer');
    enqueue('api', 'cookie');
    enqueue('web', 'cookie');
  } else {
    enqueue('web', 'cookie');
    enqueue('api', 'cookie');
    enqueue('api', 'bearer');
  }

  const runAttempt = async ({ transport, authMode, path }) => {
    const fetcher = transport === 'web' ? webFetch : apiFetch;
    return fetcher(path, { method: 'POST', body: credentials, auth: authMode });
  };

  let lastError = null;
  for (const attempt of attemptQueue) {
    try {
      const response = await runAttempt(attempt);
      const extractedUser = extractUser(response);
      if (attempt.authMode === 'bearer') {
        const token = extractToken(response);
        if (token) {
          storeBearerToken(token);
          return { mode: 'bearer', token, user: extractedUser || null, response };
        }
        // Sin token, guardamos candidato por si ningún intento cookie funciona
        if (!bearerSuccessWithoutToken) {
          bearerSuccessWithoutToken = { response, user: extractedUser || null };
        }
        continue;
      }
      const maybeToken = extractToken(response);
      if (maybeToken) {
        storeBearerToken(maybeToken);
        return { mode: 'bearer', token: maybeToken, user: extractedUser || null, response };
      }
      switchToCookieMode();
      return { mode: 'cookie', token: null, user: extractedUser || null, response };
    } catch (err) {
      lastError = err;
      const status = err?.status;
      if (status === 404 || status === 405) continue;
      if (status === 419 || status === 401) continue;
      if (status === 422 || status === 423 || status === 429) throw err;
      if (status === 400) throw err;
      // Errores 5xx: seguir probando otras rutas
    }
  }

  if (bearerSuccessWithoutToken) {
    switchToCookieMode();
    return {
      mode: 'cookie',
      token: null,
      user: bearerSuccessWithoutToken.user,
      response: bearerSuccessWithoutToken.response,
    };
  }

  throw lastError || new Error('Unable to login');
}

export async function register(payload) {
  const preferredMode = getAuthMode();
  const basePaths = ['/register', '/create-user', '/agg-user'];
  const attemptQueue = [];
  const queued = new Set();
  let bearerSuccessWithoutToken = null;

  const enqueue = (transport, authMode) => {
    for (const path of basePaths) {
      const key = `${transport}|${authMode}|${path}`;
      if (queued.has(key)) continue;
      queued.add(key);
      attemptQueue.push({ transport, authMode, path });
    }
  };

  if (preferredMode === 'bearer') {
    enqueue('api', 'bearer');
    enqueue('api', 'cookie');
    enqueue('web', 'cookie');
  } else {
    enqueue('web', 'cookie');
    enqueue('api', 'cookie');
    enqueue('api', 'bearer');
  }

  const runAttempt = async ({ transport, authMode, path }) => {
    const fetcher = transport === 'web' ? webFetch : apiFetch;
    return fetcher(path, { method: 'POST', body: payload, auth: authMode });
  };

  let lastError = null;
  for (const attempt of attemptQueue) {
    try {
      const response = await runAttempt(attempt);
      const extractedUser = extractUser(response);
      if (attempt.authMode === 'bearer') {
        const token = extractToken(response);
        if (token) {
          storeBearerToken(token);
          return { mode: 'bearer', token, user: extractedUser || null, response };
        }
        if (!bearerSuccessWithoutToken) {
          bearerSuccessWithoutToken = { response, user: extractedUser || null };
        }
        continue;
      }
      const maybeToken = extractToken(response);
      if (maybeToken) {
        storeBearerToken(maybeToken);
        return { mode: 'bearer', token: maybeToken, user: extractedUser || null, response };
      }
      switchToCookieMode();
      return { mode: 'cookie', token: null, user: extractedUser || null, response };
    } catch (err) {
      lastError = err;
      const status = err?.status;
      if (status === 404 || status === 405) continue;
      if (status === 419 || status === 401) continue;
      throw err;
    }
  }

  if (bearerSuccessWithoutToken) {
    switchToCookieMode();
    return {
      mode: 'cookie',
      token: null,
      user: bearerSuccessWithoutToken.user,
      response: bearerSuccessWithoutToken.response,
    };
  }

  throw lastError || new Error('Unable to register');
}

export async function logout() {
  const fetchFn = getAuthMode() === 'cookie' ? webFetch : apiFetch;
  try { await fetchFn('/logout', { method: 'POST' }); } catch {}
  try { localStorage.removeItem('auth_token'); } catch {}
  try { localStorage.removeItem('auth_mode'); } catch {}
  setAuthToken(undefined);
  configureAuth({ mode: 'bearer' });
}
