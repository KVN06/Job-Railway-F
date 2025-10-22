# Job Opportunity - Frontend estático

Este proyecto genera páginas HTML estáticas y un pequeño bundle JS para montar listados/detalles de ofertas cuando se requieran.

## API

- Base por defecto: `https://job-railway-production.up.railway.app/api`
- Puedes sobreescribirla con Vite: crea `.env` (o `.env.local`) y define:

```bash
VITE_API_BASE_URL=https://job-railway-production.up.railway.app/api
VITE_API_AUTH_MODE=bearer   # o 'cookie' si tu backend usa sesión/cookies
```

## Scripts útiles

- `npm run dev`: servidor de desarrollo con Vite.
- `npm run build`: compila el bundle.
- `npm run export:html:clean`: exporta y limpia HTML.
- `npm run html:inject-app`: inyecta `<script type="module" src="/resources/js/app.js">` solo en archivos HTML que contengan contenedores con `data-page` (ver abajo).

## Auto-montaje

El bundle solo se inyecta en páginas con contenedores:

- Lista de ofertas: `<div data-page="job-offers"></div>`
- Detalle de oferta: `<div data-page="job-offer-detail"></div>`

Esto evita cargar JS en páginas estáticas puras.

## Notas de autenticación

El cliente HTTP (`resources/js/api/http.js`) soporta dos modos:

- `bearer` (por defecto): usa `Authorization: Bearer <token>` si llamas a `configureAuth({ token })`.
- `cookie`: si la API usa sesión/cookies (CORS debe permitir `credentials`), llama `configureAuth({ mode: 'cookie' })`.

También puedes fijar el modo por entorno con `VITE_API_AUTH_MODE=bearer|cookie`.

Cuando la API responde 401, se lanza un error con `code = 'AUTH_REQUIRED'`. El bundle registra un aviso en consola; no redirige.

## Job Railway – Frontend independiente

Proyecto reducido a una sola capa de presentación. Se han eliminado todos los artefactos de Laravel (PHP, rutas, modelos, migraciones y pruebas) para que puedas trabajar únicamente el frontend y consumir APIs externas.

## 🚀 Stack actual

- [Vite 6](https://vitejs.dev/) para el bundling.
- [Tailwind CSS 4](https://tailwindcss.com/) mediante el plugin oficial para Vite.
- Estructura de estilos y vistas bajo `resources/`.

## 🛠️ Scripts disponibles

```bash
npm install      # Instala dependencias
npm run dev      # Entorno de desarrollo con recarga en caliente
npm run build    # Compila a producción en dist/
npm run preview  # Sirve la build resultante para revisión local
```

## 📂 Estructura relevante

- `index.html`: punto de entrada del SPA/MPA generado por Vite.
- `resources/css`: estilos base y utilidades de Tailwind.
- `resources/js`: punto de entrada (`app.js`) y futuros módulos/componentes.
- `public/`: activos estáticos que se copian tal cual en la build.

## ✅ Siguientes pasos sugeridos

1. Migrar las vistas Blade a componentes o plantillas compatibles con tu framework JS preferido.
2. Conectar con el backend que elijas vía `fetch`, `axios` u otra librería HTTP.
3. Añadir un enrutador (React Router, Vue Router, etc.) si necesitas navegación multipágina.

## 🤝 Contribución

Se aceptan PRs orientados a mejoras del frontend, limpieza de estilos o integración con APIs. Para grandes cambios, abre primero un issue y conversemos.

## 📄 Licencia

Código distribuido bajo la licencia MIT incluida en este repositorio.
