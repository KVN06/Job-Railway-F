#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const root = path.resolve(process.cwd());
const htmlDir = path.join(root, 'html');

function sanitizeBlade(content) {
  let out = content;
  // 1) Eliminar comentarios Blade {{-- ... --}}
  out = out.replace(/\{\-\-[\s\S]*?\-\-\}/g, '');
  out = out.replace(/\{\{\-\-[\s\S]*?\-\-\}\}/g, '');

  // 2) Eliminar directivas de línea (@extends, @section, @endsection, @include, @csrf, etc.)
  out = out.replace(/^\s*@\w+(?:\([^)]*\))?\s*$/gm, '');

  // 2.1) Eliminar directivas inline comunes dejando el contenido HTML
  // @if(...), @elseif(...), @else, @endif
  out = out.replace(/@if\s*\([^)]*\)/g, '');
  out = out.replace(/@elseif\s*\([^)]*\)/g, '');
  out = out.replace(/@else\b/g, '');
  out = out.replace(/@endif\b/g, '');
  // @foreach(...), @endforeach
  out = out.replace(/@foreach\s*\([^)]*\)/g, '');
  out = out.replace(/@endforeach\b/g, '');
  // @error('field') ... @enderror
  out = out.replace(/@error\s*\([^)]*\)/g, '');
  out = out.replace(/@enderror\b/g, '');
  // @csrf, @method('PUT'), @auth, @endauth, @guest, @endguest
  out = out.replace(/@(csrf|method|auth|endauth|guest|endguest)\b(?:\([^)]*\))?/g, '');

  // 3) Eliminar bloques @php ... @endphp
  out = out.replace(/@php[\s\S]*?@endphp/g, '');

  // 4) Reemplazar expresiones Blade sin escapar {!! ... !!} por vacío
  out = out.replace(/\{!![\s\S]*?!!\}/g, '');

  // 5) Reemplazar expresiones Blade {{ ... }} por vacío
  out = out.replace(/\{\{[\s\S]*?\}\}/g, '');

  // 5.1) Limpiar restos comunes de exportación Blade
  // - Patrones de bucle de errores: "as $error)"
  out = out.replace(/\bas\s*\$error\)/g, '');
  // - Paréntesis sueltos antes de un tag: ") <div..." -> "<div..."
  out = out.replace(/\)\s+(?=<)/g, '');
  // - Llaves vacías sueltas antes de un tag: "{} <div..." -> "<div..."
  out = out.replace(/\{\}\s+(?=<)/g, '');
  // - Fragmentos PHP residuales específicos
  out = out.replace(/->user\(\)[\s\S]*?(?=<)/g, '');
  out = out.replace(/auth\(\)->user\(\)[\s\S]*?(?=<)/g, '');
  out = out.replace(/\$badgeClasses[\s\S]*?;/g, '');
  out = out.replace(/\$badgeClass[\s\S]*?;/g, '');
  // - Números sueltos entre tags, p.ej. "> 140<button" -> "><button"
  out = out.replace(/>\s*\d+\s*(?=<)/g, '>');

  // 6) Colapsar espacios en atributos que pudieron quedar dobles
  out = out.replace(/\s{2,}/g, ' ');

  // 7) Quitar líneas vacías repetidas
  out = out.replace(/\n{3,}/g, '\n\n');

  // 8) Eliminar etiquetas de componentes Blade <x-...> y </x-...>
  // - Aperturas auto-cerradas: <x-card .../> -> ''
  out = out.replace(/<\s*x-[^>]*?\/>/gi, '');
  // - Aperturas: <x-card ...> -> ''
  out = out.replace(/<\s*x-[^>]*?>/gi, '');
  // - Cierres: </x-card> -> ''
  out = out.replace(/<\s*\/\s*x-[^>]*?>/gi, '');

  // 9) Eliminar atributos Alpine/Blade prefijados con x-*, :attr, @event (dejan HTML plano)
  //   - x-data="..." x-show="..." x-bind:class="..." :class="..." @click="..."
  out = out.replace(/\s+x-[a-zA-Z0-9:-]+=("[^"]*"|'[^']*')/g, '');
  out = out.replace(/\s+:[a-zA-Z0-9:-]+=("[^"]*"|'[^']*')/g, '');
  out = out.replace(/\s+@[a-zA-Z0-9:-]+=("[^"]*"|'[^']*')/g, '');

  // 10) Eliminar asignaciones PHP sueltas como `$var = ...;` o declaraciones inline fugadas
  out = out.replace(/\$[A-Za-z_][A-Za-z0-9_]*\s*=\s*[^;<>\n]*;?/g, '');
  // 10.1) Eliminar restos de espacios/comas antes de tags tras quitar PHP
  out = out.replace(/[,;:]\s*(?=<)/g, '');

  // 11) Eliminar imports PHP fugados y namespaces (e.g., `use Illuminate\Support\Carbon;`)
  out = out.replace(/\buse\s+[A-Za-z0-9_\\\\]+;?/g, '');
  // 11.1) Eliminar llamadas a clases con namespace tipo \Carbon\Carbon::parse(...) hasta el próximo tag o salto de línea
  out = out.replace(/\\[A-Za-z0-9_\\]+::[A-Za-z0-9_]+\([^)]*\)[^<\n]*/g, '');

  // 12) Eliminar condicionales PHP residuales en texto plano (if/elseif/else) hasta antes del próximo tag o fin de línea
  out = out.replace(/\bif\s*\([^)]*\)[^<\n]*/g, '');
  out = out.replace(/\belseif\s*\([^)]*\)[^<\n]*/g, '');
  out = out.replace(/\belse\b[^<\n]*/g, '');

  // 13) Eliminar fragmentos con flechas de PHP (->) comunes hasta antes del próximo tag o salto de línea
  //    Limitado a palabras típicas encontradas en vistas: start_date, end_date, pivot, created_at
  out = out.replace(/>[^<\n]*(start_date|end_date|pivot|created_at)[^<\n]*/gi, '');
  out = out.replace(/\$[A-Za-z_][A-Za-z0-9_]*\s*->[^<\n]*/g, '');

  return out;
}

async function processFile(file) {
  const orig = await fs.readFile(file, 'utf8');
  const cleaned = sanitizeBlade(orig);
  if (cleaned !== orig) {
    await fs.writeFile(file, cleaned, 'utf8');
    return true;
  }
  return false;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let changed = 0;
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      changed += await walk(p);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (await processFile(p)) changed += 1;
    }
  }
  return changed;
}

(async () => {
  try {
    const changed = await walk(htmlDir);
    console.log(`Sanitización completada. Archivos modificados: ${changed}`);
  } catch (err) {
    console.error('Error sanitizando HTML:', err);
    process.exit(1);
  }
})();
