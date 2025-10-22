import { webFetch } from '../api/http.js';
import { getCurrentUser } from '../api/authUser.js';

function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function showMessage(container, msg, type='ok'){
  if(!container) return;
  container.innerHTML = '';
  const box = document.createElement('div');
  box.className = type === 'ok'
    ? 'mb-4 rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 flex items-center gap-3'
    : 'mb-4 rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3';
  box.textContent = typeof msg === 'string' ? msg : (msg?.message || 'Algo salió mal');
  container.appendChild(box);
}

function maskEmail(email){
  if(!email || typeof email !== 'string') return '';
  const [local, domain] = email.split('@');
  const [dname='', tld=''] = (domain||'').split('.');
  const ml = local ? (local[0] + '*'.repeat(Math.max(local.length-1,1))) : '';
  const md = dname ? (dname[0] + '*'.repeat(Math.max(dname.length-1,1))) : '';
  return `${ml}@${md}${tld?'.'+tld:''}`;
}

async function submitJson(url, { method='POST', body }={}){
  return await webFetch(url, { method, body });
}

function serializeForm(form){
  const data = {};
  const fd = new FormData(form);
  for(const [k,v] of fd.entries()){
    if (data[k] !== undefined) {
      if (!Array.isArray(data[k])) data[k] = [data[k]];
      data[k].push(v);
    } else {
      data[k] = v;
    }
  }
  // Normaliza checkboxes 0/1 si hay un hidden con 0
  $all('input[type="checkbox"][name]', form).forEach(chk => {
    const name = chk.name;
    data[name] = chk.checked ? 1 : (data[name] ?? 0);
  });
  return data;
}

function setupSmoothNav(root){
  const nav = $('#settingsNav', root);
  if(!nav) return;
  nav.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href');
      const target = id ? $(id) : null;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  const sections = ['#cuenta','#notificaciones','#apariencia','#seguridad','#zona-peligro']
    .map(id => $(id)).filter(Boolean);
  const links = Array.from(nav.querySelectorAll('a'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        links.forEach(link => {
          link.classList.remove('bg-blue-50','text-blue-800');
          if(link.getAttribute('href') === id){
            link.classList.add('bg-blue-50','text-blue-800');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.1 });
  sections.forEach(sec => observer.observe(sec));
}

function setupDeleteEnable(root){
  const form = $('#deleteAccountForm', root);
  const btn = $('#deleteAccountBtn', root);
  if(!form || !btn) return;
  const update = () => {
    const pwd = form.querySelector('input[name="current_password"]').value.trim();
    const email = form.querySelector('input[name="email_confirm"]').value.trim();
    const confirmTxt = form.querySelector('input[name="confirm"]').value.trim().toUpperCase();
    const ack = form.querySelector('input[name="acknowledge"]').checked;
    const enabled = pwd.length>0 && email.length>0 && confirmTxt==='ELIMINAR' && ack;
    btn.disabled = !enabled;
    btn.classList.toggle('opacity-60', !enabled);
    btn.classList.toggle('cursor-not-allowed', !enabled);
  };
  form.querySelectorAll('input').forEach(inp => inp.addEventListener('input', update));
  update();
}

function sectionContainers(root){
  return {
    cuenta: $('#cuenta [data-messages]') || $('#cuenta'),
    notificaciones: $('#notificaciones [data-messages]') || $('#notificaciones'),
    apariencia: $('#apariencia [data-messages]') || $('#apariencia'),
    seguridad: $('#seguridad [data-messages]') || $('#seguridad'),
    peligro: $('#zona-peligro [data-messages]') || $('#zona-peligro'),
  };
}

export async function mountSettings(root){
  if (!root) return;

  setupSmoothNav(document);
  setupDeleteEnable(document);
  const msg = sectionContainers(document);

  // Poblar datos de usuario (nombre/email)
  try {
    const user = await getCurrentUser();
    if (user) {
      const nameInput = $('#profileForm input[name="name"]');
      const emailInput = $('#profileForm input[name="email"]');
      if (nameInput && !nameInput.value) nameInput.value = user.name || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
      const nameLbl = $('[data-user-name]');
      const emailLbl = $('[data-user-email-masked]');
      if (nameLbl) nameLbl.textContent = user.name || '';
      if (emailLbl) emailLbl.textContent = maskEmail(user.email||'');
    }
  } catch {}

  // Handlers de formularios
  const profileForm = $('#profileForm');
  profileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = serializeForm(profileForm);
    try {
      await submitJson('/settings/profile', { method: 'PATCH', body });
      showMessage(msg.cuenta, 'Perfil actualizado correctamente', 'ok');
    } catch(err){
      showMessage(msg.cuenta, err?.data?.message || 'No se pudo actualizar el perfil', 'error');
    }
  });

  const notificationsForm = $('#notificationsForm');
  notificationsForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = serializeForm(notificationsForm);
    try {
      await submitJson('/settings', { method: 'PATCH', body });
      showMessage(msg.notificaciones, 'Preferencias guardadas', 'ok');
    } catch(err){
      showMessage(msg.notificaciones, err?.data?.message || 'No se pudo guardar', 'error');
    }
  });

  const appearanceForm = $('#appearanceForm');
  appearanceForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = serializeForm(appearanceForm);
    try {
      await submitJson('/settings', { method: 'PATCH', body });
      showMessage(msg.apariencia, 'Tema guardado', 'ok');
    } catch(err){
      showMessage(msg.apariencia, err?.data?.message || 'No se pudo guardar el tema', 'error');
    }
  });

  const passwordForm = $('#passwordForm');
  passwordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = serializeForm(passwordForm);
    try {
      await submitJson('/settings/password', { method: 'PATCH', body });
      showMessage(msg.seguridad, 'Contraseña actualizada', 'ok');
      passwordForm.reset();
    } catch(err){
      showMessage(msg.seguridad, err?.data?.message || 'No se pudo actualizar la contraseña', 'error');
    }
  });

  const logoutAllForm = $('#logoutAllForm');
  logoutAllForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = serializeForm(logoutAllForm);
    try {
      await submitJson('/settings/logout-all', { method: 'POST', body });
      showMessage(msg.peligro, 'Sesiones cerradas en todos los dispositivos', 'ok');
      logoutAllForm.reset();
    } catch(err){
      showMessage(msg.peligro, err?.data?.message || 'No se pudo cerrar sesión global', 'error');
    }
  });

  const deleteAccountForm = $('#deleteAccountForm');
  deleteAccountForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = serializeForm(deleteAccountForm);
    try {
      await submitJson('/settings', { method: 'DELETE', body });
      // Redirigimos tras eliminar cuenta
      window.location.href = '/html/pages/landing.html';
    } catch(err){
      showMessage(msg.peligro, err?.data?.message || 'No se pudo eliminar la cuenta', 'error');
    }
  });
}

export function autoMount(){
  const el = document.querySelector('[data-page="settings"]');
  if (el) mountSettings(el);
}
