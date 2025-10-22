#!/usr/bin/env node
// Este script recorre los HTML y agrega el bundle de la app sólo si detecta contenedores de auto-montaje.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const HTML_DIR = path.join(ROOT, 'html');

const NEEDLE_PATTERNS = [
  'data-page="job-offers"',
  'data-page="job-offer-detail"',
  'data-page="classifieds"',
  'data-page="classified-detail"',
  'data-page="trainings"',
  'data-page="favorites"',
  'data-page="messages"',
  'data-page="notifications"',
  'data-page="portfolios"',
  'data-page="job-applications"',
  'data-page="auth-login"',
  'data-page="auth-register"',
  'data-page="auth-forgot-password"',
  'data-page="auth-reset-password"',
  'data-page="company-form"',
  'data-page="settings"',
  'data-page="home"',
];

async function shouldInject(html) {
  return NEEDLE_PATTERNS.some((needle) => html.includes(needle));
}

function injectScript(html) {
  const scriptTag = '<script type="module" src="/resources/js/app.js"></script>';
  if (html.includes(scriptTag)) return html; // ya inyectado

  // Insertar antes de </body>
  return html.replace(/<\/body>/i, `${scriptTag}\n</body>`);
}

async function processFile(filePath) {
  const html = await fs.readFile(filePath, 'utf8');
  if (await shouldInject(html)) {
    const updated = injectScript(html);
    if (updated !== html) {
      await fs.writeFile(filePath, updated, 'utf8');
      console.log('Injected app.js into', path.relative(ROOT, filePath));
    }
  } else {
    // Si el archivo tiene un script inyectado previo, lo quitamos
    const cleaned = html.replace(/\n?\s*<script type="module" src="\/resources\/js\/app.js"><\/script>\s*/g, '\n');
    if (cleaned !== html) {
      await fs.writeFile(filePath, cleaned, 'utf8');
      console.log('Removed app.js from', path.relative(ROOT, filePath));
    }
  }
}

async function main() {
  /** @type {string[]} */
  const entries = await fs.readdir(HTML_DIR, { withFileTypes: true });
  async function walk(dir) {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of list) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) await walk(full);
      else if (ent.isFile() && ent.name.endsWith('.html')) await processFile(full);
    }
  }
  await walk(HTML_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
