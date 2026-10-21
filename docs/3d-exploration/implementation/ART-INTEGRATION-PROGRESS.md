# Integración artística — cierre y revisión conjunta

Validación del 20/10/2026; consolidada el 21/10. Incluye el cierre del coordinador y la revisión independiente. Esta última se ejecutó en Chromium headless sobre Vite local, escritorio 1440×1000; complementa el pase de producción y las matrices responsive individuales. Los resultados son históricos: no se han repetido pruebas de aplicación en la limpieza documental.

## Cierre de implementación

ART-O2, ART-L1 y ART-C1 están integrados. O2 usa Three existente en un renderer lazy independiente; L1 y C1 usan las alternativas SVG descritas en sus propuestas. Se revisaron manualmente las capturas y se documentaron sus diferencias materiales frente al concept art. Las propuestas de reserva (L2, C2, C3, etc.) no se implementaron dentro del set seleccionado.

La suite de producción posterior al fix O2 dio **40/41**: pasaron los diez casos O2 (incluida regresión del observer), cinco L1, cinco C1, doce H1 y ocho i18n. Falló un caso i18n al seleccionar idioma inmediatamente después de cambiar la URL, antes del commit de la vista About: el control todavía retenía la ruta anterior. Se añadió una espera por `#proceso` al test existente, sin modificar navegación ni código i18n. La repetición focalizada dio **5/5 aprobadas en 13.6s**, registrada en `validation/art-integration/route-readiness-final.log`. El resto de los cuarenta casos no cambió después de ese pase. No afirmar que hubo una única ejecución completa 41/41.

Rendimiento: el benchmark de producción O2 registró cero tareas largas y cero desplazamientos atribuibles al objeto; hubo CLS global 0.0003994 con fuentes de texto/pills ajenas a `.layer-knot`. H1 en el pase final: CLS0, cero tareas largas, máximo RAF18ms. Las nueve ventanas adicionales de revisión conjunta tuvieron CLS0; dos tareas aisladas de 53/64ms se conservan sin atribución ni promesas de ausencia absoluta de tirones. Consultar [mediciones de la revisión independiente](#rendimiento-observado) y los JSON de `validation/art-integration/`.

Build: main302.47kB gzip (base298.26), CSS22.95kB gzip, renderer O2 1.04kB gzip y Three compartido lazy130.95kB gzip. Sigue el aviso existente de chunks >500kB; no se cambió la configuración de bundling. La extracción del chunk compartido es automática por los dos imports dinámicos, sin editar H1.

## Limpieza entre páginas

Se ejecutaron **10 ciclos SPA reales**: El oficio → Biblioteca (abrir ficha, entrar al recorrido inmersivo, cambiar capítulo y cerrar) → Craft (seleccionar tripa). Cada vuelta cargó la escena O2 hasta `data-mode=webgl` antes de salir.

Resultado: **10 contextos creados y 10 liberaciones explícitas mediante `WEBGL_lose_context`**, ningún canvas O2 residual en Craft, ningún modal residual, `body.style.overflow` vacío y una sola escultura Craft. Cero errores de consola o excepciones de página. Evidencia: [spa-cycles.json](validation/art-integration/spa-cycles.json).

El contador comprueba liberación explícita y nodos residuales; no equivale a medir memoria GPU del proceso. La prueba también cubre desmontar L1 durante su transición GSAP.

## Rendimiento observado

Tres repeticiones independientes por pieza, sin tracing ni screenshots durante la medición. Se esperaron 800 ms tras preparar la escena y se observaron interacciones reales: scrub O2 0→0,5→1→0,5→0, capítulos L1 0→3→0 y tres selecciones Craft.

| Pieza | CLS en las tres ventanas | RAF p95 | Tareas >50 ms |
| --- | --- | --- | --- |
| O2 | 0 | 16,7–16,8 ms | Una de 53 ms en repetición 1 |
| L1 | 0 | 16,7–16,8 ms | Ninguna |
| C1 | 0 | 16,8 ms | Una de 64 ms en repetición 3 |

El intervalo máximo RAF fue 49,9 ms para O2, 16,8 ms para L1 y 83,3 ms para C1. No corresponde afirmar ausencia absoluta de tirones: aparecen dos eventos aislados en nueve ventanas y no se determinó su atribución. Tampoco hay evidencia de regresión sostenida; p95 se mantiene cerca de 60 Hz. Las cifras incluyen el resto de cada página y entorno headless. Evidencia completa: [performance-three-runs.json](validation/art-integration/performance-three-runs.json).

## Código, accesibilidad y visual

- O2 mantiene import dinámico, render sucio limitado a ~30 fps, observador de intersección, visibilidad del documento, resize y liberación de geometrías/materiales/contexto. Reduced motion, Save-Data y ancho ≤1080 usan vector estático; falta de espacio y móvil ocultan el adorno. Los listeners y GSAP context se revierten. No se detectó fallo funcional en esta revisión.
- L1 usa dos SVG con IDs React únicos y `aria-hidden`, sin canvas ni animación perpetua. La transición se revierte al cambiar capítulo/espécimen y desmontar. Los cambios Save-Data detienen el tween; los modos estáticos ya fueron comprobados por QA individual.
- C1 usa las selecciones reales y fotografía existente; los SVG son decorativos. Controla reducción de movimiento, Save-Data, visibilidad, intersección, ancho y guía abierta. El movimiento flotante es finito y se detiene al desmontar. No introduce controles competidores ni WebGL.

Se compararon visualmente los conceptos `ART-O2-object.png`, `ART-L1-object.png`, `ART-C1-object.png` con las capturas individuales de escritorio. O2 conserva tres volúmenes y cruces, pero sus toros tienen material liso y menos detalle que el concepto. L1 conserva la oclusión alrededor de la fotografía; sus líneas parecen bronce, sin refracción de resina. C1 conserva láminas y cintas con fotografía cálida, pero se lee como recortes planos y no reproduce translucidez ni separación física del render conceptual. Estas son limitaciones explícitas de fidelidad, no bugs de integración ni equivalencia fotorealista.

Las capturas muestran los adornos dentro de sus zonas sin invadir controles. Las suites individuales documentan comprobaciones de tamaño y móvil; aquí no se repitió toda su matriz.

## Continuidad

Consultar los registros [H1](ART-H1-PROGRESS.md), [O2](ART-O2-PROGRESS.md), [L1](ART-L1-PROGRESS.md) y [C1](ART-C1-PROGRESS.md). La corrección del observer O2 está incorporada; el fallo i18n fue sincronización del test y su espera por `#proceso` se añadió sin cambiar navegación. Los logs previos y el reporte automático Playwright conservados en `validation/` son evidencia histórica, no instrucciones ni incidencias abiertas.
