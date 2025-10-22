#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const root = path.resolve(process.cwd());
const htmlDir = path.join(root, 'html');

// Mapa de rutas de Laravel -> archivos estáticos
const routesMap = new Map([
  // Públicas
  ['landing', '/'],
  ['home', '/html/pages/home.html'],
  ['login', '/html/auth/login.html'],
  ['register', '/html/auth/register.html'],
  ['favorites.index', '/html/favorites/index.html'],
  ['messages', '/html/messages/index.html'],
  ['notifications.index', '/html/notifications/index.html'],
  ['notifications.unread-count', '/html/notifications/index.html'],
  ['settings.edit', '/html/settings/index.html'],
  ['settings.update', '/html/settings/index.html'],
  ['settings.destroy', '/html/settings/index.html'],
  ['settings.logout-all', '/html/settings/index.html'],
  ['settings.password.update', '/html/settings/index.html'],
  ['settings.profile.update', '/html/settings/index.html'],
  ['company-form', '/html/company-form.html'],
  ['unemployed-form', '/html/forms/unemployed-form.html'],
  ['message-form', '/html/forms/message-form.html'],

  // Job offers
  ['job-offers.index', '/html/job-offers/index.html'],
  ['job-offers.create', '/html/job-offers/create.html'],
  ['job-offers.edit', '/html/job-offers/edit.html'],
  ['job-offers.show', '/html/job-offers/show.html'],
  ['job-offers.store', '/html/job-offers/create.html'],

  // Classifieds
  ['classifieds.index', '/html/classifieds/index.html'],
  ['classifieds.create', '/html/classifieds/create.html'],
  ['classifieds.edit', '/html/classifieds/edit.html'],
  ['classifieds.show', '/html/classifieds/show.html'],
  ['classifieds.store', '/html/classifieds/create.html'],

  // Training
  ['training.index', '/html/training/index.html'],
  ['training.public.index', '/html/training/index.html'],
  ['training.create', '/html/admin/trainings/create.html'],
  ['training.edit', '/html/admin/trainings/edit.html'],
  ['training.store', '/html/admin/trainings/create.html'],

  // Job applications
  ['job-applications.index-company', '/html/job-applications/index-company.html'],
  ['job-applications.index-unemployed', '/html/job-applications/index-unemployed.html'],
  ['job-applications.create', '/html/job-applications/create.html'],
  ['job-applications.store', '/html/job-applications/create.html'],

  // Portfolio
  ['portfolio-form', '/html/portfolio/create.html'],
  ['portfolios.index', '/html/portfolio/list.html'],
  ['edit-portfolio', '/html/portfolio/edit.html'],
  ['delete-portfolio', '/html/portfolio/list.html'],
  ['update-portfolio', '/html/portfolio/edit.html'],

  // Admin
  ['admin.dashboard', '/html/admin/dashboard.html'],
  ['admin.job-offers.index', '/html/admin/job-offers/index.html'],
  ['admin.classifieds.index', '/html/admin/classifieds/index.html'],
  ['admin.trainings.index', '/html/admin/trainings/index.html'],
  ['admin.trainings.create', '/html/admin/trainings/create.html'],
  ['admin.trainings.edit', '/html/admin/trainings/edit.html'],
  ['admin.trainings.store', '/html/admin/trainings/create.html'],
  ['admin.users.index', '/html/admin/layout.html'], // aproximación si no hay lista de usuarios
  ['admin.users.create', '/html/admin/layout.html'],

  // Auth
  ['login', '/html/auth/login.html'],
  ['register', '/html/auth/register.html'],
  ['password.request', '/html/auth/forgot-password.html'],
  ['password.email', '/html/auth/forgot-password.html'],
  ['password.reset', '/html/auth/reset-password.html'],
  ['password.update', '/html/auth/reset-password.html'],
  ['logout', '/'],
  ['google.login', '/html/auth/login.html'],
  ['inicia-sesion', '/html/auth/login.html'],

  // Aggregates / forms
  ['agg-company', '/html/forms/company-form.html'],
  ['agg-portfolio', '/html/portfolio/create.html'],
  ['agg-unemployed', '/html/forms/unemployed-form.html'],
  ['create-user', '/html/layouts/new-user.html'],

  // Misc
  ['send-message', '/html/forms/message-form.html'],
]);

const ATTRS = ['href', 'action'];

function replaceRouteExpressions(content, stats) {
  // Reemplazar cualquier {{ route('name') }} en el documento, no solo dentro de atributos
  const reAny = /\{\{\s*route\((['"])([^'"\)]+)\1\)\s*\}\}/g;
  return content.replace(reAny, (m, q, name) => {
    const mapped = routesMap.get(name.trim());
    if (!mapped) {
      stats.unmapped.add(name.trim());
      return m;
    }
    stats.replaced += 1;
    return mapped;
  });
}

function replaceRouteAttributes(content) {
  let out = content;
  for (const attr of ATTRS) {
    // attr="{{ route('name') }}" o attr='{{ route("name") }}'
    const re = new RegExp(
      `${attr}\\s*=\\s*(["'])\\s*\\{\\{\\s*route\\\\((['"])\\s*([^'"]+?)\\s*\\2\\\\)\\s*\\}\\}\\s*\\1`,
      'g'
    );
    out = out.replace(re, (m, quote1, quote2, routeName) => {
      const mapped = routesMap.get(routeName.trim());
      if (!mapped) return m; // desconocido: conservar
      return `${attr}=${quote1}${mapped}${quote1}`;
    });
  }
  return out;
}

async function processFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const stats = { replaced: 0, unmapped: new Set() };
  let rewritten = replaceRouteAttributes(content);
  rewritten = replaceRouteExpressions(rewritten, stats);
  if (rewritten !== content) {
    await fs.writeFile(filePath, rewritten, 'utf8');
    return { changed: true, stats };
  }
  return { changed: false, stats };
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let changed = 0;
  const allStats = { replaced: 0, unmapped: new Set() };
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await walk(p);
      changed += sub.changed;
      // merge stats
      allStats.replaced += sub.stats.replaced;
      sub.stats.unmapped.forEach((x) => allStats.unmapped.add(x));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const res = await processFile(p);
      if (res.changed) changed += 1;
      allStats.replaced += res.stats.replaced;
      res.stats.unmapped.forEach((x) => allStats.unmapped.add(x));
    }
  }
  return { changed, stats: allStats };
}

(async () => {
  try {
    const { changed, stats } = await walk(htmlDir);
    console.log(`Reescritura completa. Archivos modificados: ${changed}. Reemplazos: ${stats.replaced}.`);
    if (stats.unmapped.size) {
      console.warn('Rutas sin mapa (no reemplazadas):', Array.from(stats.unmapped).sort());
    }
  } catch (err) {
    console.error('Error reescribiendo enlaces:', err);
    process.exit(1);
  }
})();
