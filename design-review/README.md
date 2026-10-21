# Capturas para revisión de línea gráfica

> Estas capturas preceden a la integración artística. Para aprobar H1/O2/L1/C1 usar las evidencias enlazadas en el [estado artístico](../docs/3d-exploration/PROGRESS.md); actualizar esta colección si se necesita una revisión global del sitio actual.

Actualizadas el **19 de octubre de 2026** desde la aplicación local (exploración 3D, `docs/3d-exploration/01_VISUAL_ANALYSIS.md`). Se re-capturaron las páginas ligadas al recorrido y se añadieron vistas por sección. Contacto, Experiencia sensorial, Presentación guiada, Submenú Experiencias y 404 conservan la captura del 25 de septiembre de 2026.

- Solo escritorio: viewport de **1440 × 1000 px**, escala 1.
- Perfil visual: **Black**, sin personalizaciones adicionales (aplicado con `localStorage['ls-design-tokens'] = {version: 3, profileId: 'black'}` antes de cargar cada página). Idioma: español.
- Configuración de layout predeterminada por ruta.
- Capturas de página completa, salvo las marcadas como «vista», que muestran solo la pantalla visible.
- El configurador, la ficha de hoja y la guía se capturaron con sesión iniciada (Enter en «Entrar a la mesa»). Las demás rutas, sin sesión.
- Fotografías y fuentes cargadas antes de capturar.

## Sitio

| Página | Ruta | Captura |
|---|---|---|
| Inicio | `/` | [inicio.png](desktop/inicio.png) |
| Inicio · hero, intro, tres momentos, el arte de combinar, CTA (vistas) | `/` | [hero](desktop/inicio-hero.png), [recorrido](desktop/inicio-recorrido.png), [tres momentos](desktop/inicio-tres-momentos.png), [arte de mezclar](desktop/inicio-arte-de-mezclar.png), [CTA](desktop/inicio-cta.png) |
| Las hojas | `/leaf-library` | [biblioteca-hojas.png](desktop/biblioteca-hojas.png) |
| Ficha de hoja (vista) | `/leaf-library` | [hoja-detalle.png](desktop/hoja-detalle.png) |
| Recorrido inmersivo de la hoja (vistas) | `/leaf-library` | [hoja-inmersiva.png](desktop/hoja-inmersiva.png), [tras 5 s](desktop/hoja-inmersiva-avance.png) |
| El oficio | `/about` | [oficio.png](desktop/oficio.png) |
| El proceso, dentro de El oficio (vista) | `/about#proceso` | [proceso.png](desktop/proceso.png) |
| Perfiles de mezcla | `/menu` | [perfiles-mezcla.png](desktop/perfiles-mezcla.png) |
| Submenú Experiencias (vista) | `/menu` | [menu-experiencias.png](desktop/menu-experiencias.png) |
| Experiencia sensorial | `/testimonial` | [experiencia-sensorial.png](desktop/experiencia-sensorial.png) |
| Presentación guiada | `/reservation` | [presentacion-guiada.png](desktop/presentacion-guiada.png) |
| Contacto | `/contact` | [contacto.png](desktop/contacto.png) |
| Acceso | `/login` | [acceso.png](desktop/acceso.png) |
| Página no encontrada | `/pagina-no-encontrada` | [error-404.png](desktop/error-404.png) |

## Crear mi cigarro

| Estado | Ruta | Captura |
|---|---|---|
| 01 Tripa, sin selección | `/craft-your-cigar` | [crea-tu-cigarro.png](desktop/crea-tu-cigarro.png) |
| 01 Tripa con 2 hojas y resumen «Tu mezcla» | `/craft-your-cigar` | [crea-tu-cigarro-mezcla.png](desktop/crea-tu-cigarro-mezcla.png) |
| 02 Capote (vista) | `/craft-your-cigar` | [crea-tu-cigarro-capote.png](desktop/crea-tu-cigarro-capote.png) |
| 03 Capa (vista) | `/craft-your-cigar` | [crea-tu-cigarro-capa.png](desktop/crea-tu-cigarro-capa.png) |
| 04 Tu cigarro | `/craft-your-cigar` | [tu-cigarro.png](desktop/tu-cigarro.png), [vista](desktop/tu-cigarro-vista.png) |
| Selector «Ver recorridos» abierto (vista) | `/craft-your-cigar` | [recorridos-selector.png](desktop/recorridos-selector.png) |
| Guía de la mezcla (vistas, scroll 0/25/50/75/100 %) | `/craft-your-cigar?guia=abierta` | [Vista 1](desktop/guia-mezcla.png), [2](desktop/guia-mezcla-2.png), [3](desktop/guia-mezcla-3.png), [4](desktop/guia-mezcla-4.png), [5](desktop/guia-mezcla-5.png) |
| Elaboración frame a frame: loader, canvas y avance (vistas) | `/craft-your-cigar` | [cargando](desktop/frames-cargando.png), [canvas](desktop/frames-canvas.png), [avance](desktop/frames-canvas-avance.png) |

La elaboración frame a frame («Ver cómo cobra forma») se capturó el 19 de octubre de 2026 con el CDN `cdn.mbsoft.freeddns.org` disponible (39/39 respuestas 200): loader a los 0,4 s del clic; canvas unos 5 s después (el loader se cerró a los ~2,6 s y el primer frame visible aún era un mosaico de baja resolución); avance tras desplazar el scroll interno al 35 % y esperar 5 s (paso 2). La secuencia mostrada es siempre la predeterminada, no la mezcla elegida. El resultado depende de la red y de la caché del navegador.

Datos de captura: [capture-manifest.json](desktop/capture-manifest.json).

Las tablas indican las rutas actuales. El manifiesto conserva las rutas utilizadas al tomar las capturas; sus alias antiguos ya no están disponibles.
