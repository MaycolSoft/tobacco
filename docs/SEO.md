# Identidad y SEO

Dominio confirmado: `https://tabacaleratamboril.com.do`.

La identidad y los textos por ruta se editan en `src/config/seoConfig.js`. Si cambia el dominio, actualiza `siteIdentity.url` o configura `VITE_SITE_URL` con el origen público antes de generar la versión de producción. No añadas rutas ni parámetros a esa variable.

## Qué está preparado

- Favicon SVG de una hoja en bronce y negro, y manifiesto web. El SVG es escalable; no se han generado iconos PNG específicos para Apple ni un favicon ICO.
- Título, descripción, idioma, canonical, Open Graph y Twitter Card por ruta. La imagen social utiliza la fotografía existente `public/img/carousel-1.jpg`; se puede sustituir desde `siteIdentity.image`.
- Datos estructurados JSON-LD de organización, sitio, página y migas de navegación. La biblioteca incorpora un listado de las hojas existentes. No se publican direcciones, teléfonos, reseñas, precios ni métricas ficticias como datos estructurados.
- Metadatos actualizados durante la navegación de React.
- HTML inicial con metadatos propios de cada ruta, generado mediante `build/seoPlugin.js` cuando se compile el proyecto. Esto permite a los lectores de vistas previas acceder a los metadatos sin ejecutar React. El contenido interactivo sigue necesitando JavaScript; no se ha implementado SSR ni prerenderizado del contenido.
- `sitemap.xml`, `robots.txt` y `404.html` generados durante esa misma compilación. No están generados todavía en esta sesión.
- Vercel configurado con `cleanUrls` para servir esos HTML sin extensión y devolver la página 404 en rutas desconocidas. Las rutas nuevas deben añadirse tanto en `App.jsx` como en `seoRoutes`.

## Indexación editorial

Inicio y biblioteca están habilitados para indexación y aparecen en el sitemap. Las páginas de plantilla con contenido de muestra (historia, cigarros, mezclas, contacto, reservas y testimonios), el acceso y el configurador quedan con `noindex, follow`. Continúan funcionando para visitantes. Cuando se complete el contenido de una ruta, se puede activar `index: true` en su configuración.

`robots.txt` permite el rastreo: bloquear las rutas impediría que los buscadores leyeran su directiva `noindex`. No se añadieron etiquetas de traducciones alternativas porque no existen versiones traducidas equivalentes por URL.

## Publicación

No se ejecutaron compilaciones, servidores, validadores ni pruebas por indicación del usuario. La salida HTML por ruta, las vistas previas sociales y las rutas en Vercel quedan pendientes de revisión en una futura publicación. La indexación depende del buscador; estos metadatos no garantizan posiciones ni resultados enriquecidos.

Referencias utilizadas: [SEO para JavaScript — Google](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Plugin API — Vite](https://vite.dev/guide/api-plugin), [Configuración — Vercel](https://vercel.com/docs/project-configuration/vercel-json), [404 estático — Vercel](https://vercel.com/kb/guide/custom-404-page).
