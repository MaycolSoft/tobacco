# Identidad y SEO

Dominio confirmado: `https://tabacaleratamboril.com.do`.

La identidad y la indexación por ruta se editan en `src/config/seoConfig.js`; los textos se editan en `src/i18n/locales/*/seo.json`. Si cambia el dominio, actualiza `siteIdentity.url` o configura `VITE_SITE_URL` con el origen público antes de generar la versión de producción. No añadas rutas ni parámetros a esa variable.

## Qué está preparado

- Favicon SVG de una hoja en bronce y negro, y manifiesto web. El SVG es escalable; no se han generado iconos PNG específicos para Apple ni un favicon ICO.
- Título, descripción, idioma, canonical, Open Graph y Twitter Card por ruta. La imagen social utiliza la fotografía existente `public/img/carousel-1.jpg`; se puede sustituir desde `siteIdentity.image`.
- Datos estructurados JSON-LD de organización, sitio, página y migas de navegación. La biblioteca incorpora un listado de las hojas existentes. No se publican direcciones, teléfonos, reseñas, precios ni métricas ficticias como datos estructurados.
- Metadatos actualizados durante la navegación de React.
- HTML inicial con metadatos propios de cada ruta, generado mediante `plugins/seoPlugin.js` cuando se compile el proyecto. Esto permite a los lectores de vistas previas acceder a los metadatos sin ejecutar React. El contenido interactivo sigue necesitando JavaScript; no se ha implementado SSR ni prerenderizado del contenido.
- `sitemap.xml`, `robots.txt` y `404.html` generados durante esa misma compilación. La compilación local genera 36 shells HTML, cuatro manifests, cuatro archivos 404 y un sitemap con 24 URLs localizadas.
- Vercel configurado con `cleanUrls` para servir esos HTML sin extensión y devolver la página 404 en rutas desconocidas. Las rutas nuevas deben añadirse tanto en `App.jsx` como en `seoRoutes`.

## Indexación editorial

Inicio, biblioteca, historia, menú, contacto y experiencia sensorial están habilitados para indexación según los flags vigentes del código, en sus cuatro idiomas. Reserva, acceso y configurador conservan `noindex, follow`. La internacionalización no cambia esos flags.

`robots.txt` permite el rastreo para que los buscadores lean `noindex`. Cada página conocida incorpora alternates `es`, `en`, `fr`, `zh-CN` y `x-default` español, canonical en su idioma y datos estructurados localizados. Query y hash quedan fuera del canonical y del sitemap. Véase [I18N.md](./I18N.md).

## Publicación

El proyecto todavía no se ha publicado. La compilación y los metadatos de las rutas en cuatro idiomas se comprobaron localmente el 7 de octubre de 2026. Las vistas previas sociales y las respuestas HTTP en Vercel quedan pendientes de comprobación tras el primer despliegue. La indexación depende del buscador; estos metadatos no garantizan posiciones ni resultados enriquecidos.

### Rutas vigentes

- El proceso forma parte de `/about` y puede abrirse directamente con `/about#proceso`.
- La guía vive dentro de `/craft-your-cigar` y puede abrirse con `/craft-your-cigar?guia=abierta`. Sin sesión, el login conserva ese destino para abrirla después del acceso.
- Se eliminaron `/service` y `/blend-guide`, sin redirecciones en React ni Vercel: el proyecto es nuevo y no necesita compatibilidad con enlaces publicados. Se tratan como rutas desconocidas y muestran la página 404.

Después del primer despliegue, comprobar la entrada directa y la recarga de las rutas vigentes, el ancla del proceso, la apertura de la guía después del login y la respuesta HTTP 404 para rutas desconocidas. `vite dev` y `vite preview` no validan las reglas de `vercel.json`.

Referencias utilizadas: [SEO para JavaScript — Google](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Plugin API — Vite](https://vite.dev/guide/api-plugin), [Configuración — Vercel](https://vercel.com/docs/project-configuration/vercel-json), [404 estático — Vercel](https://vercel.com/kb/guide/custom-404-page).
