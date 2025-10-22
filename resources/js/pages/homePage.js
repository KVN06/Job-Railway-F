import { getCurrentUser } from '../api/authUser.js';
import { isCompany as hasCompanyRole, isUnemployed as hasUnemployedRole, isAdmin as hasAdminRole } from '../auth/permissions.js';
import { listJobOffers, countJobOffers } from '../api/jobOffers.js';
import { listCompanies, countCompanies } from '../api/companies.js';
import { listTrainings } from '../api/trainings.js';
import { listJobApplications, countJobApplications } from '../api/jobApplications.js';

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const ch of children.flat()) {
    if (ch == null) continue;
    el.appendChild(ch instanceof Node ? ch : document.createTextNode(String(ch)));
  }
  return el;
}

function getArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

function formatPct(n) {
  if (!isFinite(n)) return '0%';
  return `${Math.round(n)}%`;
}

function sectionTitle(title, subtitle, badge) {
  return h('div', { class: 'flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6' },
    h('div', {},
      h('h2', { class: 'text-3xl font-bold text-gray-900' }, title),
      subtitle ? h('p', { class: 'text-gray-600 mt-2 max-w-3xl' }, subtitle) : null,
    ),
    badge ? h('span', { class: 'inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700' }, badge) : null
  );
}

function card(classes, ...children) {
  const extra = classes || '';
  const base = ['rounded-3xl', 'shadow-card', 'p-6', 'transition-all', 'duration-300'];
  if (!/bg-/.test(extra)) base.push('bg-white');
  if (!/border/.test(extra)) base.push('border', 'border-slate-100/70');
  if (!/backdrop-/.test(extra)) base.push('backdrop-blur-sm');
  const className = `${base.join(' ')} ${extra}`.trim();
  return h('div', { class: className }, children);
}

function appendAnimated(parent, element, index = 0) {
  if (!element) return;
  if (element.classList) {
    element.classList.add('animate-fade-in-up');
    element.style.animationDelay = `${Math.min(index * 0.08, 0.4)}s`;
  }
  parent.appendChild(element);
}

function progressBar(value = 0, colorClass = 'bg-blue-500') {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return h('div', { class: 'w-full bg-slate-100 rounded-full h-2 overflow-hidden' },
    h('div', { class: `h-2 rounded-full transition-all duration-500 ${colorClass}`, style: `width:${pct}%` })
  );
}

function metricChip({ icon, label, value, trendLabel, trendClass = 'bg-emerald-100 text-emerald-700', trendIcon = 'fas fa-arrow-trend-up' }) {
  return card('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/90',
    h('div', { class: 'flex items-center gap-3' },
      h('span', { class: 'inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-slate-900/90 text-white text-xl shadow-lg' }, h('i', { class: icon })),
      h('div', {},
        h('p', { class: 'text-sm uppercase tracking-wide text-slate-500 font-semibold' }, label),
        h('p', { class: 'text-3xl font-extrabold text-slate-900' }, value)
      )
    ),
    trendLabel ? h('span', { class: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${trendClass}` }, h('i', { class: trendIcon }), trendLabel) : null
  );
}

function homeHeroMetric({ icon, label, value, hint }) {
  return h('div', { class: 'home-hero-metric' },
    h('span', { class: 'home-hero-metric-icon' }, h('i', { class: icon })),
    h('div', { class: 'home-hero-metric-content' },
      h('p', { class: 'home-hero-metric-label' }, label),
      h('p', { class: 'home-hero-metric-value' }, value),
      hint ? h('span', { class: 'home-hero-metric-hint' }, hint) : null
    )
  );
}

async function computeCompanyStats(user) {
  const companyId = user?.company?.id;
  let offers = [];
  // 0) Si el backend expone conteo directo por company_id, úsalo para totales/activas
  let totalOffersViaCount = null;
  let activeOffersViaCount = null;
  if (companyId) {
    try { totalOffersViaCount = await countJobOffers({ company_id: companyId }); } catch {}
    try { activeOffersViaCount = await countJobOffers({ company_id: companyId, status: 'active' }); } catch {}
  }
  try {
    offers = getArray(await listJobOffers(companyId ? { company_id: companyId } : {}));
    if (companyId && !offers.length) {
      // Fallback: sin filtro por query, filtramos en cliente si fuera necesario
      const all = getArray(await listJobOffers());
      offers = all.filter(o => String(o.company_id) === String(companyId));
    }
  } catch (_) { /* noop */ }

  const totalOffers = Number.isFinite(totalOffersViaCount) ? totalOffersViaCount : offers.length;
  const activeOffers = Number.isFinite(activeOffersViaCount) ? activeOffersViaCount : offers.filter(o => (o.status || o.state || '').toLowerCase() === 'active').length;

  // Intentar contar postulaciones asociadas a ofertas de la empresa
  let applicationsCount = 0;
  if (totalOffers) {
    try {
      const ids = offers.map(o => o.id).filter(Boolean);
      // Preferir un conteo directo si el backend soporta job_offer_ids
      const tryUnified = await (async () => {
        try { return await countJobApplications({ job_offer_ids: ids.join(',') }); } catch { return null; }
      })();
      if (Number.isFinite(tryUnified)) {
        applicationsCount = tryUnified;
      } else {
        // Fallback por oferta (capado)
        const sample = ids.slice(0, 10);
        let partial = 0;
        for (const id of sample) {
          try {
            const localCount = await (async () => {
              try { return await countJobApplications({ job_offer_id: id }); } catch { return null; }
            })();
            if (Number.isFinite(localCount)) partial += localCount;
            else partial += getArray(await listJobApplications({ job_offer_id: id })).length;
          } catch {}
        }
        applicationsCount = partial;
      }
    } catch (_) { /* noop */ }
  }

  const activityRate = totalOffers > 0 ? (activeOffers / totalOffers) * 100 : 0;
  const hasStatsData = totalOffers > 0 || applicationsCount > 0;
  return { offers, totalOffers, activeOffers, applicationsCount, activityRate, hasStatsData };
}

async function computeUnemployedStats(user) {
  let totalActiveOffers = 0;
  let totalCompanies = 0;
  let myApplications = 0;
  const applicationStats = { pending: 0, reviewed: 0, accepted: 0, rejected: 0 };

  try { totalActiveOffers = await countJobOffers({ status: 'active' }); } catch {}
  try { totalCompanies = await countCompanies(); } catch {}
  try {
    const myApps = getArray(await listJobApplications({ me: 1 }));
    myApplications = myApps.length;
    for (const a of myApps) {
      const s = (a.status || '').toLowerCase();
      if (s === 'pending') applicationStats.pending++;
      else if (s === 'reviewed') applicationStats.reviewed++;
      else if (s === 'accepted') applicationStats.accepted++;
      else if (s === 'rejected') applicationStats.rejected++;
    }
  } catch {}

  // Featured jobs
  let featuredJobs = [];
  try { featuredJobs = getArray(await listJobOffers({ status: 'active', limit: 3 })); } catch {}

  // Recommended trainings
  let recommendedTrainings = [];
  try { recommendedTrainings = getArray(await listTrainings({ limit: 3 })); } catch {}

  // Categories: derivar de featuredJobs si existen
  const categories = new Set();
  for (const j of featuredJobs) {
    if (Array.isArray(j.categories)) for (const c of j.categories) categories.add(c?.name || String(c));
  }
  const recommendedCategories = Array.from(categories).slice(0, 6);

  return { totalActiveOffers, totalCompanies, myApplications, applicationStats, featuredJobs, recommendedTrainings, recommendedCategories };
}

function companyHero(user, stats) {
  let companyName = user?.company?.company_name || user?.company?.name || user?.company_name || user?.name || '';
  if (!companyName) {
    try { companyName = localStorage.getItem('display_name') || localStorage.getItem('pending_name') || ''; } catch {}
  }
  if (!companyName) companyName = 'Tu empresa';

  const totalOffers = Number.isFinite(stats.totalOffers) ? stats.totalOffers : Number(stats.totalOffers) || 0;
  const metrics = [
    {
      icon: 'fas fa-briefcase',
      label: 'Ofertas activas',
      value: String(stats.activeOffers || 0),
      hint: null,
    },
    {
      icon: 'fas fa-users',
      label: 'Postulaciones',
      value: String(stats.applicationsCount || 0),
      hint: null,
    },
    {
      icon: 'fas fa-chart-line',
      label: 'Tasa de actividad',
      value: formatPct(stats.activityRate),
      hint: null,
    },
  ];

  return h('section', { class: 'home-hero-section' },
    h('div', { class: 'home-hero-card shadow-soft text-white' },
      h('span', { class: 'home-hero-pattern' }),
      h('div', { class: 'home-hero-content' },
        h('div', { class: 'home-hero-main' },
          h('span', { class: 'home-hero-badge' }, h('i', { class: 'fas fa-rocket' }), 'Panel de empresa'),
          h('div', { class: 'home-hero-greeting' }, h('i', { class: 'fas fa-hand-holding-heart' }), 'Hola, ', h('strong', {}, companyName.toUpperCase())),
          h('h1', { class: 'home-hero-title' }, 'Impulsa el crecimiento de ', h('span', { class: 'home-hero-title-highlight' }, companyName)),
          h('p', { class: 'home-hero-subtitle' }, 'Centraliza tus vacantes, sigue el progreso de los candidatos y toma decisiones con datos en tiempo real.'),
          h('div', { class: 'home-hero-actions' },
            h('a', { href: '/html/job-offers/create.html', class: 'btn-primary' }, h('i', { class: 'fas fa-plus-circle' }), 'Publicar nueva oferta'),
            h('a', { href: '/html/job-offers/index.html', class: 'btn-secondary' }, h('i', { class: 'fas fa-list-check' }), 'Administrar vacantes')
          )
        ),
        h('div', { class: 'home-hero-summary' },
          h('p', { class: 'home-hero-summary-title' }, h('i', { class: 'fas fa-sparkles' }), 'Resumen rápido'),
          ...metrics.map(homeHeroMetric)
        )
      )
    )
  );
}

function companyActionsSection() {
  return h('section', { class: 'space-y-8' },
    sectionTitle('Acciones recomendadas', 'Mantén tu pipeline activo con estos atajos para publicar, gestionar y seguir a tus candidatos.', 'Optimiza tu tiempo'),
    h('div', { class: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' },
      card('relative overflow-hidden border border-blue-900/30',
        h('div', { class: 'space-y-5 relative z-10' },
          h('div', { class: 'inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary text-white' }, h('i', { class: 'fas fa-file-circle-plus' })),
          h('div', {}, h('h3', { class: 'text-xl font-bold text-blue-900' }, 'Publicar oferta'), h('p', { class: 'text-blue-900/80 mt-2' }, 'Define requisitos, beneficios y recibe candidatos en minutos.')),
          h('ul', { class: 'space-y-2 text-sm text-blue-900/70' },
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Plantillas prearmadas'),
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Visibilidad inmediata'),
          ),
          h('a', { href: '/html/job-offers/create.html', class: 'btn-primary inline-flex items-center gap-2' }, h('i', { class: 'fas fa-arrow-right' }), 'Crear oferta')
        )
      ),
      card('relative overflow-hidden border border-blue-900/30',
        h('div', { class: 'space-y-5 relative z-10' },
          h('div', { class: 'inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary text-white' }, h('i', { class: 'fas fa-users-gear' })),
          h('div', {}, h('h3', { class: 'text-xl font-bold text-indigo-900' }, 'Revisar postulaciones'), h('p', { class: 'text-indigo-900/80 mt-2' }, 'Clasifica candidatos, deja notas internas y coordina entrevistas.')),
          h('ul', { class: 'space-y-2 text-sm text-blue-900/70' },
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Filtros avanzados'),
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Trazabilidad de estados'),
          ),
          h('a', { href: '/html/job-applications/index-company.html', class: 'btn-primary inline-flex items-center gap-2' }, h('i', { class: 'fas fa-arrow-right' }), 'Gestionar postulaciones')
        )
      ),
      card('relative overflow-hidden border border-blue-900/30',
        h('div', { class: 'space-y-5 relative z-10' },
          h('div', { class: 'inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary text-white' }, h('i', { class: 'fas fa-building' })),
          h('div', {}, h('h3', { class: 'text-xl font-bold text-purple-900' }, 'Perfil de empresa'), h('p', { class: 'text-purple-900/80 mt-2' }, 'Refuerza tu marca empleadora con una presentación atractiva.')),
          h('ul', { class: 'space-y-2 text-sm text-blue-900/70' },
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Información centralizada'),
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Imagen destacada'),
          ),
          h('a', { href: '/html/company-form.html', class: 'inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg' }, h('i', { class: 'fas fa-arrow-right' }), 'Actualizar perfil')
        )
      ),
    )
  );
}

function companyInsightsSection(stats) {
  const total = stats.totalOffers || 0;
  const active = stats.activeOffers || 0;
  const applications = stats.applicationsCount || 0;
  const activityRate = stats.activityRate || 0;
  const newOffersLabel = total > 0 ? `${active} de ${total} vacantes activas` : 'Publica tu primera vacante';
  const averageApplicants = active > 0 ? Math.round(applications / active) : applications;

  return h('section', { class: 'space-y-8' },
    sectionTitle('Indicadores clave', 'Visualiza la salud de tu proceso de selección y detecta oportunidades de mejora.', `Última actualización · ${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}`),
    h('div', { class: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      card('bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden',
        h('div', { class: 'absolute inset-0 decorative-pattern animate-pulse-slow' }),
        h('div', { class: 'relative space-y-5' },
          h('div', { class: 'flex items-center justify-between' },
            h('p', { class: 'text-sm uppercase tracking-widest text-white/70 font-semibold' }, 'Participación'),
            h('span', { class: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs' }, h('i', { class: 'fas fa-bolt' }), 'Visibilidad')
          ),
          h('div', { class: 'space-y-2' },
            h('h3', { class: 'text-2xl font-bold text-white' }, newOffersLabel),
            progressBar(activityRate, 'bg-blue-500'),
            h('p', { class: 'text-xs text-white/70' }, 'Mantén el porcentaje por encima del 60% para asegurar un flujo constante de candidatos.')
          ),
          h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
            metricChip({ icon: 'fas fa-users', label: 'Aplicaciones totales', value: applications, trendLabel: averageApplicants ? `${averageApplicants} por oferta` : null, trendClass: 'bg-emerald-100 text-emerald-700', trendIcon: 'fas fa-user-check' }),
            metricChip({ icon: 'fas fa-clock-rotate-left', label: 'Tiempo recomendado de respuesta', value: '48h', trendLabel: 'Experiencia óptima', trendClass: 'bg-blue-100 text-blue-700', trendIcon: 'fas fa-stopwatch' })
          )
        )
      ),
      card('bg-slate-50 border border-slate-200 space-y-5',
        h('div', { class: 'flex items-start gap-3' },
          h('span', { class: 'w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center' }, h('i', { class: 'fas fa-route' })),
          h('div', {},
            h('h3', { class: 'text-lg font-semibold text-slate-900' }, 'Próximos pasos sugeridos'),
            h('p', { class: 'text-sm text-slate-500' }, 'Incorpora estas acciones para mantener tu marca empleadora siempre activa.')
          )
        ),
        h('ul', { class: 'space-y-4 text-sm text-slate-600' },
          ['Actualiza tu descripción de empresa con logros recientes.', 'Programa entrevistas virtuales en bloques de 30 minutos.', 'Comparte testimonios de colaboradores en tus ofertas más vistas.'].map((tip, idx) =>
            h('li', { class: 'flex items-start gap-3' },
              h('span', { class: 'mt-1 text-blue-600 font-semibold' }, idx + 1),
              h('span', {}, tip)
            )
          )
        ),
        h('a', { href: '/html/job-applications/index-company.html', class: 'inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 w-fit' }, h('i', { class: 'fas fa-gauge-high' }), 'Ver panel de seguimiento')
      )
    )
  );
}

function companyRoadmapSection() {
  const steps = [
  { title: 'Define tu oferta ideal', text: 'Resume funciones clave y beneficios diferenciales para atraer al talento correcto.', icon: 'fas fa-lightbulb', color: 'bg-amber-100 text-amber-600' },
  { title: 'Clasifica candidatos', text: 'Organiza entrevistas con etiquetas y notas para tu equipo de reclutamiento.', icon: 'fas fa-filter', color: 'bg-blue-100 text-blue-600' },
    { title: 'Mide el impacto', text: 'Exporta reportes y analiza qué vacantes tienen mayor conversión.', icon: 'fas fa-chart-simple', color: 'bg-emerald-100 text-emerald-600' }
  ];
  return h('section', { class: 'space-y-6' },
    sectionTitle('Hoja de ruta sugerida', 'Un flujo sencillo para mantener tu estrategia de atracción con ritmo.'),
    h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
      ...steps.map((step, idx) =>
        card('relative overflow-hidden group bg-white',
          h('div', { class: `inline-flex items-center justify-center w-14 h-14 rounded-2xl ${step.color} shadow-inner` }, h('i', { class: step.icon })),
          h('div', { class: 'mt-5 space-y-3' },
            h('div', { class: 'flex items-center justify-between' },
              h('h3', { class: 'text-lg font-bold text-slate-900' }, step.title),
              h('span', { class: 'text-sm font-semibold text-slate-400' }, `Paso ${idx + 1}`)
            ),
            h('p', { class: 'text-slate-600' }, step.text)
          )
        )
      )
    )
  );
}

function companyIdeasSection(){
  return h('section', { class: 'space-y-8' },
    h('h2', { class: 'text-2xl md:text-3xl font-extrabold text-gray-900' }, 'Ideas para fortalecer tu atracción de talento'),
    h('p', { class: 'text-gray-600 max-w-3xl' }, 'Incorpora estas mejores prácticas y recursos recomendados para atraer candidatos más calificados y cerrar vacantes con rapidez.'),
    h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
      card('relative overflow-hidden border',
        h('div', { class: 'space-y-4' },
          h('div', { class: 'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600' }, h('i', { class: 'fas fa-leaf' })),
          h('h3', { class: 'text-lg font-bold text-gray-900' }, 'Historias de impacto'),
          h('p', { class: 'text-gray-600' }, 'Incluye testimonios de tu equipo y describe desafíos reales para captar perfiles alineados con tu cultura.'),
          h('ul', { class: 'text-sm text-emerald-700 space-y-1' },
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Humaniza tu propuesta de valor'),
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Muestra oportunidades de desarrollo')
          )
        )
      ),
      card('relative overflow-hidden border',
        h('div', { class: 'space-y-4' },
          h('div', { class: 'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600' }, h('i', { class: 'fas fa-hourglass-half' })),
          h('h3', { class: 'text-lg font-bold text-gray-900' }, 'Tiempo de respuesta'),
          h('p', { class: 'text-gray-600' }, 'Configura recordatorios internos para contactar candidatos en menos de 48 horas y mejorar la experiencia.'),
          h('ul', { class: 'text-sm text-amber-700 space-y-1' },
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Automatiza correos de seguimiento'),
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Etiqueta perfiles prioritarios')
          )
        )
      ),
      card('relative overflow-hidden border',
        h('div', { class: 'space-y-4' },
          h('div', { class: 'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-100 text-sky-600' }, h('i', { class: 'fas fa-graduation-cap' })),
          h('h3', { class: 'text-lg font-bold text-gray-900' }, 'Recursos de capacitación'),
          h('p', { class: 'text-gray-600' }, 'Fortalece a tu equipo con talleres y cursos en habilidades digitales, liderazgo y metodología ágil.'),
          h('ul', { class: 'text-sm text-sky-700 space-y-1' },
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Metodologías ágiles'),
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Entrevistas efectivas'),
            h('li', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-check' }), 'Onboarding')
          )
        )
      )
    )
  );
}

function unemployedHero(user, stats = {}) {
  // Fallback de nombre si el backend aún no lo trae
  let name = user?.name || '';
  if (!name) {
    try { name = localStorage.getItem('display_name') || localStorage.getItem('pending_name') || ''; } catch {}
  }

  const totalOffers = Number(stats.totalActiveOffers) || 0;
  const applications = Number(stats.myApplications) || 0;
  const followed = (stats.applicationStats?.pending || 0) + (stats.applicationStats?.accepted || 0) + (stats.applicationStats?.reviewed || 0) + (stats.applicationStats?.rejected || 0);
  const momentumPct = followed ? Math.round(((stats.applicationStats?.pending || 0) + (stats.applicationStats?.accepted || 0)) / followed * 100) : 0;

  const metrics = [
    { icon: 'fas fa-briefcase', label: 'Ofertas activas', value: String(totalOffers), hint: totalOffers ? 'Nuevas cada día' : 'Vuelve pronto' },
    { icon: 'fas fa-paper-plane', label: 'Mis postulaciones', value: String(applications), hint: applications ? 'Haz seguimiento' : 'Comienza hoy' },
    { icon: 'fas fa-bolt', label: 'Índice de avance', value: `${momentumPct}%`, hint: momentumPct >= 60 ? 'Buen ritmo' : 'Puedes mejorar' }
  ];

  return h('section', { class: 'home-hero-section' },
    h('div', { class: 'home-hero-card shadow-soft text-white' },
      h('span', { class: 'home-hero-pattern' }),
      h('div', { class: 'home-hero-content' },
        h('div', { class: 'home-hero-main' },
          h('span', { class: 'home-hero-badge' }, h('i', { class: 'fas fa-compass' }), 'Tu carrera'),
          h('div', { class: 'home-hero-greeting' }, h('i', { class: 'fas fa-hand-holding-heart' }), 'Hola, ', h('strong', {}, (name || 'Usuario').toUpperCase())),
          h('h1', { class: 'home-hero-title' }, 'Descubre oportunidades y potencia tu perfil profesional'),
          h('p', { class: 'home-hero-subtitle' }, 'Te conectamos con empleos verificados, capacitaciones prácticas y herramientas para destacar.'),
          h('div', { class: 'home-hero-actions' },
            h('a', { href: '/html/job-offers/index.html', class: 'btn-primary' }, h('i', { class: 'fas fa-search' }), 'Explorar empleos'),
            h('a', { href: '/html/training/index.html', class: 'btn-secondary' }, h('i', { class: 'fas fa-graduation-cap' }), 'Ver capacitaciones')
          )
        ),
        h('div', { class: 'home-hero-summary' },
          h('p', { class: 'home-hero-summary-title' }, h('i', { class: 'fas fa-sparkles' }), 'Resumen rápido'),
          ...metrics.map(homeHeroMetric)
        )
      )
    )
  );
}

function unemployedActionsSection(){
  return h('div', { class: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6' },
    card('relative overflow-hidden border border-blue-100 bg-blue-50',
      h('div', { class: 'space-y-5 relative z-10' },
        h('div', { class: 'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white' }, h('i', { class: 'fas fa-briefcase' })),
        h('div', {},
          h('h3', { class: 'text-xl font-bold text-blue-900' }, 'Explorar empleos'),
          h('p', { class: 'text-blue-900/80 mt-2' }, 'Filtra por ubicación, modalidad y rango salarial para encontrar el rol ideal.')
        ),
        h('a', { href: '/html/job-offers/index.html', class: 'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700' }, 'Ver ofertas')
      )
    ),
    card('relative overflow-hidden border border-emerald-100 bg-emerald-50',
      h('div', { class: 'space-y-5 relative z-10' },
        h('div', { class: 'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white' }, h('i', { class: 'fas fa-id-card-clip' })),
        h('div', {},
          h('h3', { class: 'text-xl font-bold text-emerald-900' }, 'Optimiza tu portafolio'),
          h('p', { class: 'text-emerald-900/80 mt-2' }, 'Presenta proyectos, logros y certificaciones en un solo lugar.')
        ),
        h('a', { href: '/html/portfolio/list.html', class: 'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700' }, 'Gestionar portafolio')
      )
    ),
    card('relative overflow-hidden border border-purple-100 bg-purple-50',
      h('div', { class: 'space-y-5 relative z-10' },
        h('div', { class: 'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 text-white' }, h('i', { class: 'fas fa-graduation-cap' })),
        h('div', {},
          h('h3', { class: 'text-xl font-bold text-purple-900' }, 'Capacítate y crece'),
          h('p', { class: 'text-purple-900/80 mt-2' }, 'Suma nuevas habilidades digitales y blandas para destacar en entrevistas.')
        ),
        h('a', { href: '/html/training/index.html', class: 'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700' }, 'Ver capacitaciones')
      )
    )
  );
}

function unemployedMomentumSection(stats) {
  const total = stats.totalActiveOffers || 0;
  const applications = stats.myApplications || 0;
  const pending = stats.applicationStats?.pending || 0;
  const accepted = stats.applicationStats?.accepted || 0;
  const totalFollowUp = pending + accepted + (stats.applicationStats?.reviewed || 0) + (stats.applicationStats?.rejected || 0);
  const followUpPct = totalFollowUp ? ((pending + accepted) / totalFollowUp) * 100 : 0;

  const focusAreas = [
    { icon: 'fas fa-compass', title: 'Afinar búsqueda', desc: 'Configura alertas según ciudad, modalidad y salario objetivo.', href: '/html/job-offers/index.html', color: 'bg-blue-100 text-blue-600' },
    { icon: 'fas fa-wand-magic-sparkles', title: 'Actualizar CV', desc: 'Destaca logros medibles y proyectos recientes en tu portafolio.', href: '/html/portfolio/list.html', color: 'bg-purple-100 text-purple-600' },
    { icon: 'fas fa-people-group', title: 'Networking', desc: 'Comparte tu perfil con mentores y comunidades alineadas a tu industria.', href: '/html/messages/index.html', color: 'bg-emerald-100 text-emerald-600' }
  ];

  return h('section', { class: 'space-y-8' },
    sectionTitle('Tu progreso a la fecha', 'Sigue estos indicadores para mantener el ritmo de tu búsqueda.'),
    h('div', { class: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      card('bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 text-white relative overflow-hidden',
        h('div', { class: 'absolute inset-0 decorative-pattern animate-pulse-slow' }),
        h('div', { class: 'relative space-y-6' },
          h('div', { class: 'flex items-center justify-between' },
            h('p', { class: 'text-sm uppercase tracking-widest text-white/70 font-semibold' }, 'Visibilidad'),
            h('span', { class: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs' }, h('i', { class: 'fas fa-circle-nodes' }), 'Plan activo')
          ),
          h('div', { class: 'space-y-2' },
            h('h3', { class: 'text-2xl font-bold text-white' }, `${applications} postulaciones enviadas`),
            progressBar(applications ? Math.min(applications * 10, 100) : 0, 'bg-emerald-500'),
            h('p', { class: 'text-xs text-white/70' }, 'Procura enviar al menos 3 postulaciones relevantes por semana.')
          ),
          h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
            metricChip({ icon: 'fas fa-briefcase', label: 'Ofertas activas disponibles', value: total || '—', trendLabel: 'Fuente actualizada', trendClass: 'bg-blue-100 text-blue-700', trendIcon: 'fas fa-bolt' }),
            metricChip({ icon: 'fas fa-bell', label: 'Seguimientos pendientes', value: pending || '0', trendLabel: followUpPct ? `${Math.round(followUpPct)}% en seguimiento` : 'Sin pendientes', trendClass: followUpPct > 60 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700', trendIcon: followUpPct > 60 ? 'fas fa-circle-check' : 'fas fa-circle-info' })
          )
        )
      ),
      card('bg-white space-y-5 border border-slate-200',
        h('div', { class: 'flex items-start gap-3' },
          h('span', { class: 'w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center' }, h('i', { class: 'fas fa-map-location-dot' })),
          h('div', {},
            h('h3', { class: 'text-lg font-semibold text-slate-900' }, 'Áreas para reforzar esta semana'),
            h('p', { class: 'text-sm text-slate-500' }, 'Prioriza estas acciones para incrementar tus oportunidades.')
          )
        ),
        h('div', { class: 'space-y-4' },
          ...focusAreas.map(area =>
            h('div', { class: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-100 rounded-2xl px-4 py-3 hover:border-blue-200 transition' },
              h('div', { class: 'flex items-start gap-3' },
                h('span', { class: `mt-1 inline-flex items-center justify-center w-10 h-10 rounded-xl ${area.color}` }, h('i', { class: area.icon })),
                h('div', {}, h('p', { class: 'font-semibold text-slate-800' }, area.title), h('p', { class: 'text-sm text-slate-500' }, area.desc))
              ),
              h('a', { href: area.href, class: 'inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800' }, 'Ir ahora', h('i', { class: 'fas fa-arrow-up-right-from-square text-xs' }))
            )
          )
        )
      )
    )
  );
}

function unemployedRoadmapSection() {
  const steps = [
    { title: 'Refresca tu perfil profesional', text: 'Agrega proyectos recientes, certificaciones y logros cuantificables.', icon: 'fas fa-user-astronaut', color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Postula con estrategia', text: 'Adapta tu CV a cada oferta e incluye palabras clave del rol.', icon: 'fas fa-target', color: 'bg-blue-100 text-blue-600' },
    { title: 'Prepárate para entrevistas', text: 'Practica historias STAR y preguntas frecuentes en tu industria.', icon: 'fas fa-comments', color: 'bg-emerald-100 text-emerald-600' }
  ];
  return h('section', { class: 'space-y-6' },
    sectionTitle('Ruta sugerida para esta semana', 'Organiza tus esfuerzos y mantén visibilidad constante.'),
    h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
      ...steps.map((step, idx) =>
        card('relative overflow-hidden group bg-white',
          h('div', { class: `inline-flex items-center justify-center w-14 h-14 rounded-2xl ${step.color} shadow-inner` }, h('i', { class: step.icon })),
          h('div', { class: 'mt-5 space-y-3' },
            h('div', { class: 'flex items-center justify-between' },
              h('h3', { class: 'text-lg font-bold text-slate-900' }, step.title),
              h('span', { class: 'text-sm font-semibold text-slate-400' }, `Paso ${idx + 1}`)
            ),
            h('p', { class: 'text-slate-600' }, step.text)
          )
        )
      )
    )
  );
}

function quickStats(stats) {
  const items = [
    { icon: 'fas fa-briefcase', label: 'Ofertas activas', value: stats.totalActiveOffers },
    { icon: 'fas fa-building', label: 'Empresas confiables', value: stats.totalCompanies },
    { icon: 'fas fa-file-import', label: 'Mis postulaciones', value: stats.myApplications },
  ];
  return h('section', {},
    h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
      ...items.map(it => card('text-center space-y-4 py-8',
        h('div', { class: `inline-flex w-16 h-16 items-center justify-center rounded-2xl ${it.icon.includes('building') ? 'bg-indigo-100 text-indigo-600' : (it.icon.includes('briefcase') ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600')} text-2xl` }, h('i', { class: it.icon })),
        h('p', { class: 'text-4xl font-extrabold text-gray-900' }, String(it.value ?? '—')),
        h('p', { class: 'text-gray-600 font-semibold' }, it.label),
        h('span', { class: `inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full ${it.icon.includes('file') ? 'bg-amber-100 text-amber-700' : (it.icon.includes('building') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')}` },
          h('i', { class: it.icon.includes('file') ? 'fas fa-paper-plane' : (it.icon.includes('building') ? 'fas fa-shield-check' : 'fas fa-bullhorn') }),
          it.icon.includes('file') ? 'Seguimiento' : (it.icon.includes('building') ? 'Verificadas' : 'Actualizado')
        )
      ))
    )
  );
}

function featuredJobsSection(jobs) {
  if (!jobs?.length) return null;
  return h('section', { class: 'space-y-6' },
    sectionTitle('Oportunidades que podrían interesarte', 'Explora las últimas vacantes activas publicadas por empresas verificadas.'),
    h('div', { class: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
      ...jobs.map(job => card('',
        h('div', { class: 'space-y-4' },
          h('div', { class: 'flex items-start justify-between gap-4' },
            h('div', {}, h('p', { class: 'text-sm font-semibold text-blue-600 uppercase tracking-wide' }, job.company?.name || 'Empresa confidencial'), h('h3', { class: 'text-xl font-bold text-gray-900' }, job.title || 'Oferta')),
            h('span', { class: 'inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700' }, h('i', { class: 'fas fa-location-dot' }), job.location || 'Remoto')
          ),
          job.description ? h('p', { class: 'text-gray-600 leading-relaxed' }, String(job.description).slice(0, 140)) : null
        ),
        h('div', { class: 'mt-6 flex items-center justify-between text-sm text-gray-500' },
          h('div', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-wallet text-green-500' }), h('span', {}, job.salary_formatted || job.salary || 'A convenir')),
          h('a', { href: `/html/job-offers/show.html?id=${encodeURIComponent(job.id)}`, class: 'btn-primary text-white inline-flex items-center gap-2 px-3 py-2 rounded-md' }, h('i', { class: 'fas fa-arrow-right' }), 'Detalles')
        )
      ))
    )
  );
}

function trainingsSection(items) {
  if (!items?.length) return null;
  return h('section', { class: 'space-y-6' },
    h('h2', { class: 'text-3xl font-bold text-gray-900' }, 'Formaciones recomendadas para ti'),
    h('div', { class: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' },
      ...items.map(tr => card('',
        h('div', { class: 'space-y-4' },
          h('div', { class: 'space-y-1' }, h('p', { class: 'text-sm font-semibold text-indigo-600 uppercase tracking-wide' }, tr.provider || 'Capacitación'), h('h3', { class: 'text-xl font-bold text-gray-900' }, tr.title || 'Formación')),
          tr.description ? h('p', { class: 'text-gray-600 leading-relaxed' }, String(tr.description).slice(0, 140)) : null
        ),
        h('div', { class: 'mt-6 space-y-3 text-sm text-gray-500' },
          h('div', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-calendar' }), h('span', {}, tr.start_date || 'Inicio flexible')),
          h('div', { class: 'flex items-center gap-2' }, h('i', { class: 'fas fa-link' }), h('span', {}, tr.link ? 'Modalidad virtual' : 'Consulta disponibilidad')),
          h('a', { href: tr.link || '/html/training/index.html', class: 'btn-primary text-white inline-flex items-center gap-2 px-3 py-2 rounded-md' }, h('i', { class: 'fas fa-arrow-up-right-from-square' }), 'Conocer más')
        )
      ))
    )
  );
}

function categoriesSection(cats) {
  if (!cats?.length) return null;
  return h('section', { class: 'space-y-4' },
    h('h2', { class: 'text-3xl font-bold text-gray-900' }, 'Explora categorías populares'),
    h('p', { class: 'text-gray-600' }, 'Descubre áreas con alta demanda y filtra las oportunidades que se ajustan a tu perfil.'),
    h('div', { class: 'flex flex-wrap gap-3' }, ...cats.map(name => h('span', { class: 'px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold flex items-center gap-2' }, h('i', { class: 'fas fa-hashtag text-gray-500' }), name)))
  );
}

function applicationsStatusSection(stats) {
  if (!stats) return null;
  const blocks = [
    { color: 'yellow', label: 'Pendientes', value: stats.pending },
    { color: 'blue', label: 'En revisión', value: stats.reviewed },
    { color: 'green', label: 'Aceptadas', value: stats.accepted },
    { color: 'red', label: 'Rechazadas', value: stats.rejected },
  ];
  return h('section', {},
    h('div', { class: 'rounded-2xl bg-white shadow-sm p-6 border-l-4 border-green-600' },
      h('div', { class: 'flex flex-col md:flex-row md:items-center md:justify-between gap-6' },
        h('div', { class: 'space-y-2' },
          h('div', { class: 'inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold' }, h('i', { class: 'fas fa-clipboard-list mr-2' }), 'Seguimiento activo'),
          h('h3', { class: 'text-2xl font-bold text-gray-900' }, 'Estado de tus postulaciones'),
          h('p', { class: 'text-gray-600' }, 'Mantén un panorama claro de cada etapa y prioriza tus seguimientos.'),
        ),
        h('div', { class: 'grid grid-cols-2 md:grid-cols-4 gap-4 flex-1' },
          ...blocks.map(b => h('div', { class: `text-center p-4 bg-${b.color}-50 rounded-xl` },
            h('p', { class: `text-2xl font-extrabold text-${b.color}-700` }, String(b.value ?? '—')),
            h('p', { class: `text-xs uppercase tracking-wide text-${b.color}-700` }, b.label)
          ))
        )
      )
    )
  );
}

function tipsSection() {
  const tips = [
    { icon: 'fas fa-id-badge', title: 'Perfil completo', text: 'Actualiza tu portafolio con proyectos recientes y resultados cuantificables.' },
    { icon: 'fas fa-paper-plane', title: 'Personaliza tus aplicaciones', text: 'Adapta tu CV y carta de presentación resaltando logros relevantes.' },
    { icon: 'fas fa-comments', title: 'Prepárate para entrevistas', text: 'Practica tus respuestas y prepara ejemplos concretos de tus experiencias.' },
  ];
  return h('section', {},
    h('h2', { class: 'text-3xl font-bold text-gray-900 mb-6' }, 'Consejos para destacar en tu búsqueda'),
    h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
      ...tips.map(t => card('',
        h('div', { class: 'space-y-3' },
          h('span', { class: `inline-flex items-center justify-center w-12 h-12 rounded-xl ${t.title.includes('Perfil') ? 'bg-purple-100 text-purple-600' : (t.title.includes('aplicaciones') ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600')}` }, h('i', { class: t.icon })),
          h('h3', { class: 'text-xl font-bold text-gray-900' }, t.title),
          h('p', { class: 'text-gray-600' }, t.text)
        )
      ))
    )
  );
}

export async function mountHome(root) {
  if (!root) return;
  root.innerHTML = '';

  const loading = h('p', { class: 'text-slate-500' }, 'Cargando tu inicio...');
  root.appendChild(loading);

  let user = null;
  try {
    user = await getCurrentUser();
  } catch (e) {
    // No autenticado: redirigir a login con redirect
    const redirect = encodeURIComponent('/html/pages/home.html');
    window.location.href = `/html/auth/login.html?redirect=${redirect}`;
    return;
  }

  loading.remove();
  // Contenedor principal sin fondo blanco por defecto (el before: de Tailwind se elimina)
  const main = h('div', { class: "relative container mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12" });

  // Si venimos con ?error=... (p.ej., redirección desde requireRole), mostrar banner informativo
  try {
    const params = new URLSearchParams(location.search);
    const qErr = params.get('error');
    if (qErr) {
      appendAnimated(main,
        card('border-l-4 border-amber-500 bg-amber-50',
          h('div', { class: 'flex items-start gap-3 text-amber-900' },
            h('div', { class: 'w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0' }, h('i', { class: 'fas fa-triangle-exclamation' })),
            h('div', {}, h('p', { class: 'font-semibold mb-1' }, 'Aviso'), h('p', {}, qErr))
          )
        )
      );
    }
  } catch {}

  // Normaliza tipo de usuario (acepta inglés/español y banderas booleanas)
  let isCompany = hasCompanyRole(user);
  let isUnemployed = hasUnemployedRole(user);
  const isAdmin = hasAdminRole(user);

  try {
    const storedRole = (localStorage.getItem('display_role') || localStorage.getItem('pending_role') || '').toLowerCase();
    if (!isCompany && storedRole === 'company') {
      isCompany = true;
      isUnemployed = false;
    } else if (!isUnemployed && storedRole === 'unemployed') {
      isUnemployed = true;
      if (storedRole === 'unemployed') isCompany = false;
    }
  } catch {}

  if (isCompany) {
    let hasCompany = !!(user?.company && isCompanyProfileComplete(user.company));
    // Si el backend aún no adjunta company en /user justo después de crearla,
    // respetamos la marca local para no mostrar el banner de "Completa información".
    try {
      const localDone = localStorage.getItem('profile_completed') === '1';
      if (!hasCompany && localDone) hasCompany = true;
    } catch {}
  const stats = hasCompany ? await computeCompanyStats(user) : { hasStatsData: false, activeOffers: 0, applicationsCount: 0, totalOffers: 0, activityRate: 0 };
  appendAnimated(main, companyHero(user, stats));
  if (!hasCompany) {
      appendAnimated(main, card('max-w-3xl mx-auto text-blue-900 bg-blue-50 border border-blue-200',
        h('div', { class: 'flex items-start gap-3' },
          h('div', { class: 'w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0' }, h('i', { class: 'fas fa-circle-info' })),
          h('div', {},
            h('p', { class: 'font-semibold mb-2' }, 'Completa la información de tu empresa para visualizar estadísticas y agilizar la publicación de ofertas.'),
            h('a', { href: '/html/company-form.html', class: 'underline font-semibold' }, 'Ir al formulario de empresa')
          )
        )
      ));
    }
    // Estadísticas principales
    if (hasCompany && stats.hasStatsData) {
      const grid = h('section', {},
        h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6' },
          card('group text-center',
            h('span', { class: 'inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-primary text-white group-hover:scale-110 transition' }, h('i', { class: 'fas fa-bullseye' })),
            h('p', { class: 'text-4xl font-extrabold text-gray-900' }, String(stats.activeOffers)),
            h('p', { class: 'text-gray-600 font-semibold' }, 'Ofertas activas')
          ),
          card('group text-center',
            h('span', { class: 'inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 group-hover:scale-110 transition' }, h('i', { class: 'fas fa-user-group' })),
            h('p', { class: 'text-4xl font-extrabold text-gray-900' }, String(stats.applicationsCount)),
            h('p', { class: 'text-gray-600 font-semibold' }, 'Postulaciones totales')
          ),
          card('group text-center',
            h('span', { class: 'inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 group-hover:scale-110 transition' }, h('i', { class: 'fas fa-file-signature' })),
            h('p', { class: 'text-4xl font-extrabold text-gray-900' }, String(stats.totalOffers)),
            h('p', { class: 'text-gray-600 font-semibold' }, 'Vacantes creadas')
          ),
          card('group text-center',
            h('span', { class: 'inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 group-hover:scale-110 transition' }, h('i', { class: 'fas fa-percent' })),
            h('p', { class: 'text-4xl font-extrabold text-gray-900' }, formatPct(stats.activityRate)),
            h('p', { class: 'text-gray-600 font-semibold' }, 'Tasa de actividad')
          ),
        )
      );
      appendAnimated(main, grid, 1);
    } else {
      appendAnimated(main, card('text-center py-14',
        h('div', { class: 'max-w-2xl mx-auto space-y-6' },
          h('span', { class: 'inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl' }, h('i', { class: 'fas fa-paper-plane' })),
          h('h3', { class: 'text-2xl font-bold text-gray-900' }, 'Aún no tienes actividad registrada'),
          h('p', { class: 'text-gray-600' }, 'Publica tu primera oferta para comenzar a recibir postulaciones y desbloquear estadísticas detalladas.'),
          h('div', { class: 'flex flex-col sm:flex-row gap-4 justify-center' }, h('a', { href: '/html/job-offers/create.html', class: 'btn-primary inline-flex items-center gap-2' }, h('i', { class: 'fas fa-plus-circle' }), 'Publicar primera oferta'))
        )
      ), 1);
    }
    appendAnimated(main, companyInsightsSection(stats), 1.5);
    appendAnimated(main, companyActionsSection(), 2);
    appendAnimated(main, companyRoadmapSection(), 2.5);
    appendAnimated(main, companyIdeasSection(), 3);
  } else if (isUnemployed || (!isCompany && !isUnemployed && !isAdmin)) {
    // Cesantes y visitantes sin rol ven contenido orientado a postulantes.
    const stats = await computeUnemployedStats(user);
    appendAnimated(main, unemployedHero(user, stats));
    appendAnimated(main, quickStats(stats), 0.5);
    appendAnimated(main, unemployedMomentumSection(stats), 1);
    if (stats.featuredJobs?.length) appendAnimated(main, featuredJobsSection(stats.featuredJobs), 1.5);
    appendAnimated(main, sectionTitle('Impulsa tu perfil profesional', 'Aprovecha estos recursos para posicionarte mejor frente a los reclutadores.', 'Tu crecimiento'), 1.6);
    appendAnimated(main, unemployedActionsSection(), 1.7);
    if (stats.recommendedTrainings?.length) appendAnimated(main, trainingsSection(stats.recommendedTrainings), 2);
    if (stats.recommendedCategories?.length) appendAnimated(main, categoriesSection(stats.recommendedCategories), 2.3);
    if (stats.myApplications > 0) appendAnimated(main, applicationsStatusSection(stats.applicationStats), 2.6);
    appendAnimated(main, unemployedRoadmapSection(), 2.8);
    appendAnimated(main, tipsSection(), 3);
  } else if (isAdmin) {
    // Admins reciben la vista empleada/desempleado para evitar accesos de publicación directos.
    const stats = await computeUnemployedStats(user);
    appendAnimated(main, unemployedHero(user, stats));
    appendAnimated(main, quickStats(stats), 0.5);
    appendAnimated(main, unemployedMomentumSection(stats), 1);
    if (stats.featuredJobs?.length) appendAnimated(main, featuredJobsSection(stats.featuredJobs), 1.5);
    appendAnimated(main, sectionTitle('Impulsa tu perfil profesional', 'Aprovecha estos recursos para posicionarte mejor frente a los reclutadores.', 'Tu crecimiento'), 1.6);
    appendAnimated(main, unemployedActionsSection(), 1.7);
    if (stats.recommendedTrainings?.length) appendAnimated(main, trainingsSection(stats.recommendedTrainings), 2);
    if (stats.recommendedCategories?.length) appendAnimated(main, categoriesSection(stats.recommendedCategories), 2.3);
    if (stats.myApplications > 0) appendAnimated(main, applicationsStatusSection(stats.applicationStats), 2.6);
    appendAnimated(main, unemployedRoadmapSection(), 2.8);
    appendAnimated(main, tipsSection(), 3);
  }

  root.appendChild(main);
}

export function autoMount() {
  const el = document.querySelector('[data-page="home"]');
  if (el) mountHome(el);
}

function isCompanyProfileComplete(company){
  if (!company || typeof company !== 'object') return false;
  // Reglas más flexibles: nombre (company_name o name), email, nit|tax_id opcionalmente,
  // descripción (description o about). Dirección/ubicación NO es obligatoria.
  const pick = (...keys) => keys.find(k => {
    const v = company[k];
    return v !== null && v !== undefined && String(v).trim().length > 0;
  });
  const hasName = !!pick('company_name', 'name');
  const hasEmail = !!pick('email');
  const hasId = !!pick('nit', 'tax_id', 'ruc', 'identification');
  const hasDesc = !!pick('description', 'about');
  // Website y address son opcionales
  return hasName && hasEmail && hasDesc && (hasId || true);
}
