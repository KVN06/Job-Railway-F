import { getCurrentUser } from './api/authUser.js';
import { setAuthToken } from './api/http.js';

function setActiveLink(){
  try {
    const map = [
      { key: 'dashboard', url: '/html/admin/dashboard.html' },
      { key: 'classifieds', url: '/html/admin/classifieds/index.html' },
      { key: 'job-offers', url: '/html/admin/job-offers/index.html' },
      { key: 'trainings', url: '/html/admin/trainings/index.html' },
    ];
    const here = location.pathname;
    for (const { key, url } of map){
      const a = document.querySelector(`[data-admin-link="${key}"]`);
      if (!a) continue;
      if (here.endsWith(url)) a.classList.add('active'); else a.classList.remove('active');
    }
  } catch {}
}

function setDate(){
  try { const el = document.querySelector('[data-admin-date]'); if (el) el.textContent = new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' }); } catch {}
}

async function fillUser(){
  try {
    const user = await getCurrentUser().catch(()=>null);
    const nameEl = document.querySelector('[data-admin-name]');
    const emailEls = document.querySelectorAll('[data-admin-email], [data-admin-email-header]');
    if (user){
      if (nameEl) nameEl.textContent = user.name || user.username || 'Usuario';
      emailEls.forEach(e=> e.textContent = user.email || '—');
    } else {
      if (nameEl) nameEl.textContent = 'Invitado';
      emailEls.forEach(e=> e.textContent = '—');
    }
  } catch {}
}

function wireLogout(){
  const handlers = document.querySelectorAll('.js-admin-logout');
  handlers.forEach(btn => btn.addEventListener('click', () => {
    try { localStorage.removeItem('auth_token'); setAuthToken(null); } catch {}
    // Redirige a login
    window.location.href = '/html/auth/login.html';
  }));
}

export function initAdminLayout(title){
  // Título dinámico; si no viene, intentar deducirlo desde document.title
  try {
    const t = document.querySelector('[data-admin-title]');
    if (t) {
      const pageTitle = title || (document.title || '').replace(/^Admin\s*[·\-|–]\s*/i, '').trim() || 'Dashboard';
      t.textContent = pageTitle;
    }
  } catch {}
  setActiveLink();
  setDate();
  fillUser();
  wireLogout();
}

// Ejecutar tras includes:ready si existe el layout en la página
try {
  document.addEventListener('includes:ready', () => {
    if (document.querySelector('[data-admin-layout]')) initAdminLayout();
  });
  // Si el layout ya está presente (evento ya disparado), inicializar igualmente
  if (document.querySelector('[data-admin-layout]')) {
    // Ejecutar al siguiente tick para dar tiempo a que el DOM asiente
    setTimeout(() => initAdminLayout(), 0);
  }
} catch {}
