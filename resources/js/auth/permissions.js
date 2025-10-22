import { getCurrentUser } from '../api/authUser.js';

const ADMIN_KEYWORDS = ['admin', 'administrator', 'administrador', 'administradora', 'superadmin', 'root'];
const COMPANY_KEYWORDS = ['empresa', 'company', 'employer', 'recruiter', 'business', 'companyuser'];
const UNEMPLOYED_KEYWORDS = ['unemployed', 'cesante', 'desempleado', 'desocupado', 'jobseeker', 'postulante', 'candidate'];

const ROLE_ALIAS = {
  admin: 'admin',
  administrator: 'admin',
  administradora: 'admin',
  administrador: 'admin',
  administracion: 'admin',
  superadmin: 'admin',
  root: 'admin',
  empresa: 'company',
  company: 'company',
  employer: 'company',
  recruiter: 'company',
  business: 'company',
  companyuser: 'company',
  compania: 'company',
  corporate: 'company',
  cesante: 'unemployed',
  unemployed: 'unemployed',
  desempleado: 'unemployed',
  desocupado: 'unemployed',
  jobseeker: 'unemployed',
  postulante: 'unemployed',
  candidate: 'unemployed',
};

function normalizeToken(token){
  if (!token) return '';
  const lower = String(token).trim().toLowerCase();
  try {
    return lower
      .normalize('NFD')
      .replace(/[^a-z0-9]/g, '')
      .replace(/[\u0300-\u036f]/g, '');
  } catch {
    return lower.replace(/[^a-z0-9]/g, '');
  }
}

function collectTokens(user){
  const tokens = [];
  const seen = new Set();

  const push = (value) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach(push);
      return;
    }
    if (typeof value === 'object') {
      push(value?.type);
      push(value?.role);
      push(value?.role_name);
      push(value?.role_slug);
      push(value?.slug);
      push(value?.name);
      push(value?.user_type);
      push(value?.profile_type);
      if (Array.isArray(value?.roles)) value.roles.forEach(push);
      else if (value?.roles && typeof value.roles === 'object') Object.values(value.roles).forEach(push);
      return;
    }
    const raw = String(value).trim().toLowerCase();
    if (!raw) return;
    if (seen.has(raw)) return;
    seen.add(raw);
    tokens.push(raw);
  };

  push(user?.type);
  push(user?.role);
  push(user?.user_type);
  push(user?.profile_type);
  push(user?.role_name);
  push(user?.role_slug);
  push(user?.role?.name);
  push(user?.role?.slug);
  push(user?.role?.type);

  if (Array.isArray(user?.roles)) {
    user.roles.forEach(push);
  } else if (user?.roles && typeof user.roles === 'object') {
    Object.values(user.roles).forEach(push);
  }

  if (Array.isArray(user?.role_names)) push(user.role_names);
  if (Array.isArray(user?.permissions)) push(user.permissions);

  const nestedSources = [
    user?.profile,
    user?.profile?.data,
    user?.meta,
    user?.metadata,
    user?.details,
    user?.account,
    user?.user,
    user?.primary_role,
  ];
  nestedSources.forEach(push);

  return tokens;
}

function includesKeyword(tokens, keywords){
  return tokens.some((token) => keywords.some((kw) => token.includes(kw)));
}

function mapTokenToRole(token){
  if (!token) return null;
  const normalized = token.toLowerCase();
  if (ROLE_ALIAS[normalized]) return ROLE_ALIAS[normalized];
  const cleaned = normalizeToken(token);
  return ROLE_ALIAS[cleaned] || null;
}

function getStoredRoleHints(){
  try {
    const candidates = [
      localStorage.getItem('display_role'),
      localStorage.getItem('pending_role'),
      localStorage.getItem('selected_role'),
    ].filter(Boolean);
    const hints = new Set();
    candidates.forEach((candidate) => {
      const raw = String(candidate).trim();
      if (!raw) return;
      const lower = raw.toLowerCase();
      hints.add(lower);
      const alias = mapTokenToRole(lower) || mapTokenToRole(raw);
      if (alias) hints.add(alias);
      const normalized = normalizeToken(raw);
      if (normalized && normalized !== lower) {
        hints.add(normalized);
        const normalizedAlias = mapTokenToRole(normalized);
        if (normalizedAlias) hints.add(normalizedAlias);
      }
    });
    return Array.from(hints);
  } catch {
    return [];
  }
}

function isValidId(value){
  if (value === null || value === undefined) return false;
  const str = String(value).trim();
  if (!str) return false;
  if (str === '0' || str === 'false') return false;
  return true;
}

function hasData(entity, seen = new WeakSet()){
  if (!entity || typeof entity !== 'object') return false;
  if (seen.has(entity)) return false;
  seen.add(entity);
  if (Array.isArray(entity)) return entity.length > 0;
  const idCandidates = [entity.id, entity.uuid, entity.company_id, entity.unemployed_id, entity.profile_id];
  if (idCandidates.some(isValidId)) return true;
  return Object.values(entity).some((val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === 'object') return hasData(val, seen);
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') return val.trim().length > 0;
    return Boolean(val);
  });
}

function hasCompanyRelation(user){
  const companyEntities = [
    user?.company,
    user?.company_profile,
    user?.profile?.company,
    user?.meta?.company,
    user?.employment?.company,
  ];
  if (companyEntities.some(hasData)) return true;

  const companyIds = [
    user?.company_id,
    user?.companyId,
    user?.companyID,
    user?.company_profile_id,
    user?.employment?.company_id,
    user?.company?.id,
    user?.company?.company_id,
    user?.company?.uuid,
  ];
  if (companyIds.some(isValidId)) return true;

  const flags = [user?.isCompany, user?.is_company, user?.has_company_profile, user?.company_user, user?.acts_as_company];
  if (flags.some(Boolean)) return true;

  return false;
}

function hasUnemployedRelation(user){
  const unemployedEntities = [
    user?.unemployed,
    user?.unemployed_profile,
    user?.profile?.unemployed,
    user?.meta?.unemployed,
  ];
  if (unemployedEntities.some(hasData)) return true;

  const unemployedIds = [
    user?.unemployed_id,
    user?.unemployedId,
    user?.unemployedID,
    user?.profile?.unemployed_id,
    user?.unemployed?.id,
    user?.unemployed?.uuid,
  ];
  if (unemployedIds.some(isValidId)) return true;

  const flags = [user?.isUnemployed, user?.is_unemployed, user?.acts_as_unemployed];
  if (flags.some(Boolean)) return true;

  return false;
}

function resolveRoleFromTokens(user, tokens){
  for (const token of tokens) {
    const role = mapTokenToRole(token);
    if (role === 'admin') return 'admin';
  }
  if (user?.is_admin === true || user?.admin === true) return 'admin';

  for (const token of tokens) {
    const role = mapTokenToRole(token);
    if (role === 'company') return 'company';
  }

  for (const token of tokens) {
    const role = mapTokenToRole(token);
    if (role === 'unemployed') return 'unemployed';
  }

  const adminSignal = includesKeyword(tokens, ADMIN_KEYWORDS);
  if (adminSignal) return 'admin';

  const companySignal = hasCompanyRelation(user) || includesKeyword(tokens, COMPANY_KEYWORDS);
  if (companySignal) return 'company';

  const unemployedSignal = hasUnemployedRelation(user) || includesKeyword(tokens, UNEMPLOYED_KEYWORDS);
  if (unemployedSignal) return 'unemployed';

  return 'guest';
}

export function resolveRole(user){
  if (!user || typeof user !== 'object') return 'guest';
  const tokens = collectTokens(user);
  return resolveRoleFromTokens(user, tokens);
}

export function isAdmin(user){ return resolveRole(user) === 'admin'; }
export function isCompany(user){ return resolveRole(user) === 'company'; }
export function isUnemployed(user){ return resolveRole(user) === 'unemployed'; }

export async function requireAuth(redirectToLogin=true){
  try { return await getCurrentUser(); }
  catch {
    if (redirectToLogin){
      const redirect = encodeURIComponent(location.pathname + location.search);
      location.assign(`/html/auth/login.html?redirect=${redirect}`);
    }
    throw new Error('AUTH_REQUIRED');
  }
}

export async function requireRole(role, { onFail = 'redirect', redirectTo = '/html/pages/home.html', alertMessage = 'No tienes permisos para acceder a esta sección.' } = {}){
  const targets = Array.isArray(role)
    ? role
    : String(role || '')
        .split(/[\|,]/)
        .map((r) => r.trim())
        .filter(Boolean);
  const normalizedTargets = targets.length ? targets : [String(role) || ''];

  const user = await requireAuth(true);
  const resolved = resolveRole(user);
  const roleSet = new Set([resolved]);
  if (hasCompanyRelation(user)) roleSet.add('company');
  if (hasUnemployedRelation(user)) roleSet.add('unemployed');
  if (resolved === 'admin') roleSet.add('admin');
  getStoredRoleHints().forEach((hint) => {
    const mapped = mapTokenToRole(hint) || hint;
    if (!mapped) return;
    if (mapped === 'admin') roleSet.add('admin');
    if (mapped === 'company' || mapped === 'empresa') roleSet.add('company');
    if (mapped === 'unemployed' || mapped === 'cesante') roleSet.add('unemployed');
  });

  const ok = normalizedTargets.some((target) => {
    const key = String(target || '').trim().toLowerCase();
    if (!key) return false;
    if (key === 'admin') return roleSet.has('admin');
    if (key === 'company') return roleSet.has('company');
    if (key === 'unemployed') return roleSet.has('unemployed');
    if (key === 'guest') return resolved === 'guest';
    return roleSet.has(key);
  });

  if (!ok){
    if (onFail === 'redirect'){
      const url = new URL(redirectTo, location.origin);
      url.searchParams.set('error', alertMessage);
      location.assign(url.toString());
    }
    if (onFail === 'throw') throw new Error('FORBIDDEN');
    return { user, allowed:false };
  }
  return { user, allowed:true };
}

// Mapa simple de habilidades client-side (solo para UI; el backend manda)
const abilities = {
  company: new Set(['manage_offers','manage_applications','edit_company_profile']),
  unemployed: new Set(['apply','manage_portfolio']),
  admin: new Set(['admin','manage_all']),
};

export function can(user, action){
  const role = resolveRole(user);
  const set = abilities[role] || new Set();
  return set.has(action);
}
