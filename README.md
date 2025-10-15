# Job Railway – Frontend independiente

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
