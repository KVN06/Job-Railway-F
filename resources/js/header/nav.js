import { getCurrentUser } from '../api/authUser.js';
import { apiFetch } from '../api/http.js';
import { countUnreadNotifications } from '../api/notifications.js';
import { resolveRole, isAdmin, isCompany as hasCompanyRole, isUnemployed as hasUnemployedRole } from '../auth/permissions.js';

function getStoredRoleHints(){
    try {
        const hints = [];
        const storedRole = localStorage.getItem('display_role') || localStorage.getItem('pending_role');
        if (storedRole) hints.push(String(storedRole).trim().toLowerCase());
        return hints.filter(Boolean);
    } catch {
        return [];
    }
}

function initHeader() {
    // Elementos (pueden no existir si el header se carga dinámicamente)
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const userDropdown = document.getElementById('userDropdown');
    const notificationsDropdown = document.getElementById('notificationsDropdown');

    // No hacer return temprano: hay elementos que pueden inyectarse luego.
    // Usamos flags granulares por elemento/listener para evitar duplicados.
    if (!document.body.dataset.navGlobalBound) {
        document.body.dataset.navGlobalBound = '1';
        // Click fuera y ESC son listeners globales, se atan una sola vez.
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#mobileMenu') && !e.target.closest('#mobileMenuButton') && !e.target.closest('#userDropdown') && !e.target.closest('#notificationsDropdown')) {
                closeAllDropdowns();
                closeMobileMenu();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { closeAllDropdowns(); closeMobileMenu(); }
        });
        // Dark mode global restore
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle && !darkModeToggle.dataset.bound) {
            darkModeToggle.dataset.bound = '1';
            darkModeToggle.addEventListener('change', () => {
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            }
        } else if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    function closeAllDropdowns(exceptId = null) {
        const dropdowns = [userDropdown, notificationsDropdown];
        dropdowns.forEach(dropdown => {
            if (dropdown && dropdown.id !== exceptId) {
                const menu = dropdown.querySelector('div[class*="absolute"]');
                if (menu) menu.classList.add('hidden');
            }
        });
    }
    function closeMobileMenu() {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
    }
    // Toggle móvil
    if (mobileMenuButton && mobileMenu && !mobileMenuButton.dataset.bound) {
        mobileMenuButton.dataset.bound = '1';
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            closeAllDropdowns();
        });
    }
    // Dropdowns
    [userDropdown, notificationsDropdown].forEach(dropdown => {
        if (dropdown && !dropdown.dataset.bound) {
            dropdown.dataset.bound = '1';
            const button = dropdown.querySelector('button');
            const menu = dropdown.querySelector('#userDropdownMenu') || dropdown.querySelector('div[class*="absolute"]');
            if (button && menu) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isHidden = menu.classList.contains('hidden');
                    closeAllDropdowns(dropdown.id);
                    closeMobileMenu();
                    menu.classList.toggle('hidden', !isHidden);
                });
            }
        }
    });
    // Logout
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
        if (!btn.dataset.bound) {
            btn.dataset.bound = '1';
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                try { await apiFetch('/logout', { method: 'POST' }); } catch {}
                try {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('display_role');
                    localStorage.removeItem('display_name');
                    localStorage.removeItem('pending_role');
                    localStorage.removeItem('pending_name');
                    localStorage.removeItem('profile_completed');
                } catch {}
                window.location.href = '/html/auth/login.html';
            });
        }
    });

    // Poblar info usuario y notificaciones
    fillUserInfo();
    ensureNotificationPolling();
}

function applyRoleVisibility(user){
    const roles = new Set(['guest']);
    if (user) {
        roles.add('authenticated');
        roles.add(resolveRole(user));
        if (hasCompanyRole(user)) roles.add('company');
        if (hasUnemployedRole(user)) roles.add('unemployed');
        if (isAdmin(user)) roles.add('admin');
    } else {
        getStoredRoleHints().forEach((hint) => roles.add(hint));
    }
    document.querySelectorAll('[data-visible-for]').forEach(el => {
        const targets = (el.getAttribute('data-visible-for') || '')
            .split(/[\|,]/)
            .map(token => token.trim().toLowerCase())
            .filter(Boolean);
        const shouldShow = targets.length ? targets.some(token => roles.has(token)) : roles.has('authenticated');
        el.classList.toggle('hidden', !shouldShow);
        if (shouldShow) el.removeAttribute('aria-hidden');
        else el.setAttribute('aria-hidden', 'true');
    });
}

async function fillUserInfo() {
    let user = null;
    try {
        const fetched = await getCurrentUser();
        if (fetched && typeof fetched === 'object' && !Array.isArray(fetched)) {
            user = fetched;
        }
    } catch {}

    const nameEl = document.querySelector('[data-user-name]');
    const roleEl = document.querySelector('[data-user-role]');

    if (user) {
        const company = hasCompanyRole(user);
        const unemployed = hasUnemployedRole(user);
        const admin = isAdmin(user);

        let displayName = user?.name || '';
        if (company) {
            displayName = user?.company?.company_name || user?.company?.name || displayName;
        }
        if (!displayName) {
            try {
                displayName = localStorage.getItem('display_name') || localStorage.getItem('pending_name') || '';
            } catch {}
        }
        if (!displayName) displayName = company ? 'Empresa' : 'Usuario';

        let roleLabel = admin ? 'Administrador' : (company ? 'Empresa' : (unemployed ? 'Cesante' : 'Usuario'));
        if (!roleLabel) roleLabel = 'Usuario';

        if (nameEl) nameEl.textContent = displayName;
        if (roleEl) roleEl.textContent = roleLabel;

        try {
            if (displayName) localStorage.setItem('display_name', displayName);
            const storedRole = admin ? 'admin' : (company ? 'company' : (unemployed ? 'unemployed' : 'user'));
            localStorage.setItem('display_role', storedRole);
        } catch {}

        applyRoleVisibility(user);
        return;
    }

    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.remove('hidden');

    let pendingName = null, pendingRole = null, displayName = null, displayRole = null;
    try {
        pendingName = localStorage.getItem('pending_name') || null;
        pendingRole = localStorage.getItem('pending_role') || null;
        displayName = localStorage.getItem('display_name') || null;
        displayRole = localStorage.getItem('display_role') || null;
    } catch {}
    const fallbackName = pendingName || displayName || 'Usuario';
    const fallbackRole = (pendingRole || displayRole || 'user').toLowerCase();
    if (nameEl) nameEl.textContent = fallbackName;
    if (roleEl) {
        const label = fallbackRole === 'company'
            ? 'Empresa'
            : fallbackRole === 'unemployed'
                ? 'Cesante'
                : fallbackRole === 'admin'
                    ? 'Administrador'
                    : 'Usuario';
        roleEl.textContent = label;
    }

    applyRoleVisibility(null);
}

function ensureNotificationPolling(){
    if (window.__notifPollingBound) return;
    window.__notifPollingBound = true;
    const badge = document.getElementById('notification-badge');
    async function updateNotificationCount(){
        try {
            if (!document.getElementById('notification-badge')) return;
            const el = document.getElementById('notification-badge');
            const count = await fetchUnreadNotificationsCount();
            if (count > 0) {
                el.textContent = String(count);
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        } catch {}
    }
    updateNotificationCount();
    setInterval(updateNotificationCount, 30000);
}

async function fetchUnreadNotificationsCount(){
    return countUnreadNotifications();
}

// Inicializar al cargar el DOM y cuando los includes estén listos
document.addEventListener('DOMContentLoaded', initHeader);
document.addEventListener('includes:ready', initHeader);
