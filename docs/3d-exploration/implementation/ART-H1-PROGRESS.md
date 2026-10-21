# ART-H1 — implementación y validación

Estado consolidado el 21/10/2026: implementado, con refinamiento geométrico presente en código y aceptación visual pendiente. Base histórica: commit `e41aa65`. Este registro sustituye el handoff NEXT-STEPS ejecutado.

## Decisiones finales

- Home `#recorrido`: Three vanilla lazy y GSAP existente. `three` 0.186.1 fue la única dependencia añadida en la implementación inicial.
- Geometría CPU determinista de 240×8 segmentos (~3840 triángulos); progreso puro y reversible, scrub .6. Render hasta 30 fps, DPR máximo 1.5, pausa por visibilidad y liberación de geometría, materiales, renderer/contexto y triggers.
- Póster para ancho <=1080, reduced motion, Save-Data y error. Se conserva la altura de sección. Sin modificar el reproductor de frames.
- Textura plana generada con fotografía real CAPA HABANA y concepto como referencias; alpha y normal derivados para mantener UV. No se usa el concept art como textura ni se afirma escaneo físico. [Assets y reproducción](../../../public/img/art/leaf-ribbon/README.md).

## Refinamiento incorporado

El enrollado avanza desde la punta: frente `1 − p·(1 − FLAT)`, hélice completa delante y hoja plana detrás. `FLAT=.5`, `RADIUS=1.1`, `SLOPE=.34`, `COIL_WIDTH=.62`. Abre huecos entre vueltas, elimina el zigzag intermedio, conserva extremo extendido ancho y centra la malla según su bounding box sin zoom por scroll. Recentrado con quaternion y guard del vector transversal incorporados.

## Validación documentada (19–20/10)

- Implementación inicial: 19 unitarias y 21 e2e aprobadas. Refinamiento: 12/12 en `tests/leaf-ribbon.spec.js`, 19/19 unitarias, build y ESLint de `src/components/home/` correctos. Son rondas distintas.
- Cobertura: reversibilidad, layout ±2 px, lazy, póster 390/860/861/1080, reduced motion, Save-Data, pérdida de contexto/textura fallida, navegación, i18n, anclas/restauración y rendimiento.
- Tres mediciones optimizadas: CLS0, cero tareas >50 ms; RAF máximo 17.9/24.4/20.2 ms. El pase conjunto posterior registró H1 con CLS0, cero tareas largas y RAF máximo18ms.
- Build inicial lazy132.55kB gzip y refinamiento132.74kB; integración posterior comparte Three con O2. No comparar esos chunks como si fueran el mismo build.
- Lint global histórico: 270 errores y 2 avisos preexistentes. Avisos Chromium `GPU stall due to ReadPixels` ligados a screenshots identificados separadamente; producción no silencia consola.

Evidencia: [plano](validation/desktop-0.png), [medio](validation/desktop-0.5.png), [enrollado](validation/desktop-1.png); refinamiento [0%](validation/refine-desktop-0.png), [25%](validation/refine-desktop-0.25.png), [50%](validation/refine-desktop-0.5.png), [75%](validation/refine-desktop-0.75.png), [100%](validation/refine-desktop-1.png). [Métricas finales](validation/performance-final.json), [tres rondas](validation/performance-optimized.json), [ronda con tracing](validation/performance-with-tracing.json), [log inicial e2e](validation/e2e-final.log).

## Límites y trabajo abierto

Aceptación visual del refinamiento pendiente. Los rizos estiran textura ~2.7×; hay ~2.5 vueltas frente a ~3.5 del concepto, falta torsión helicoidal de 180–270° y la regularidad de radio/paso sigue visible. El 0% queda fuera de un viewport normal por el trigger al 70%. El idle ±.01rad no recentra; la hoja plana queda espejada verticalmente respecto a la primera versión, con normales coherentes.

Silueta más lanceolada, tono más rojizo y escala menor que el mockup; cambiar textura/color/posición exige definir el refinamiento deseado. Pósteres generados separadamente pueden diferir de la malla. Las mediciones locales no garantizan rendimiento de otro hardware. ART-O2 ya se implementó: no es un próximo paso de H1.
