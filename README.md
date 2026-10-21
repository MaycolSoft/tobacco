# Tabacalera Tamboril

Experiencia editorial e interactiva sobre hojas, composición y oficio. SPA en React 19 + Vite 7, con Zustand, GSAP, Framer Motion y Three.js. Disponible en español, inglés, francés y chino simplificado.

## Desarrollo y comprobaciones

```sh
npm ci
npm run dev
npm run check:i18n
npm test
npm run build
npm run check:i18n:build
npm run lint
npm run test:e2e
```

Playwright requiere Chromium instalado al preparar el entorno. La suite e2e construye y sirve el proyecto en `127.0.0.1:4173`. El lint global tiene deuda heredada documentada; consultar los resultados del trabajo que se revise.

## Documentación

- [Estado y pendientes del proyecto](docs/STATUS.md): punto de entrada para continuar.
- [Estado del set artístico](docs/3d-exploration/PROGRESS.md): H1/O2/L1/C1 implementados, límites y evidencias.
- [Internacionalización](docs/I18N.md), [SEO y publicación](docs/SEO.md), [paleta](docs/PALETTE.md).
- [Motor de fotogramas](docs/scroll-video-optimization.md) y [mediciones históricas](docs/scroll-video-performance-audit.md).
- [Capturas de diseño](design-review/README.md), [herramientas de conversión](scripts/README.md).

La autenticación es local y los formularios no tienen envío a servidor. La secuencia de elaboración usa un CDN externo. Los planes y prompts históricos son contexto documental; sus encargos a agentes no constituyen instrucciones vigentes.
