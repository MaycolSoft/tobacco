# ART-O2 — implementación y QA consolidados

Estado: implementado y validado el 20/10/2026; consolidación documental 21/10. Sustituye NEXT-STEPS y QA ejecutados. [Cierre conjunto](ART-INTEGRATION-PROGRESS.md).

## Decisiones finales

About `#proceso`, bajo el lead: ancla absoluta independiente; títulos, párrafo directo, pills y divisoria conservan DOM y cajas. Scrub local reversible de tres fases, sin pin ni cursor lighting. La prueba CSS 3D se descartó porque producía discos inclinados sin cruces volumétricos: [captura histórica](validation/art-o2/desktop-mid.png).

Solución final: `src/components/about/LayerKnotRenderer.js`, Three existente lazy, tres toros reales, 6912 triángulos y tres mallas opacas satinadas/mates. Sin sombras dinámicas ni texturas; DPR1.5, dibujo solo ante cambios hasta ~30fps, sin idle. Observers, eventos, timers, GSAP y recursos GPU se liberan al desmontar. Fallo de carga/contexto vuelve a SVG. Hover/foco enfatiza el aro sin interceptar navegación.

>=1081px: WebGL si cabe y no hay reduced motion/Save-Data; 861–1080: SVG si cabe; <=860: oculto sin reservar altura. Se mide el hueco y también el desplazamiento por carga de fuentes. Paleta local fija y cálida, sin recoloración específica Black/Editorial Noir. Inclinaciones interiores58° para lectura de cruces a ese tamaño.

## Validación y corrección

Diez casos de producción aprobados en `tests/layer-knot.spec.js`: lazy, layout ±2px/sin solapes, scroll 0/.5/1/.5/0, foco sobre hover, anclas, responsive, reduced motion/Save-Data, resize/contexto, SPA/idiomas y rendimiento/regresión de visibilidad.

El observer podía entregar salida antigua y entrada actual del mismo nodo en un lote. Tomar solo `entries[0]` dejaba SVG visible sin iniciar Three. Se corrigió con `entries.at(-1)`, sin polling. [Reproducción](validation/art-o2/observer-batch-reproduction.json).

Producción: cero tareas largas y cero shifts atribuibles al objeto; CLS global0.0003994 de texto/pills ajenos. Las mediciones dev anteriores con tareas51–79ms y CLS0.000677 no son el cierre. La revisión adicional conjunta conservó una tarea aislada53ms sin atribución; no se promete ausencia absoluta de tirones.

[Smoke](validation/art-o2/smoke.json), poses [0](validation/art-o2/pose-0.png), [.5](validation/art-o2/pose-0.5.png), [1](validation/art-o2/pose-1.png), [capturas QA](validation/art-o2/test-results/). ESLint específico y build aprobados en el cierre; deuda global separada.

## Límites y contrato de mantenimiento

Toros lisos sin microtextura vegetal/papel, SSS ni materiales físicos del concepto. La referencia tiene una banda intermedia más plana/ancha. Revisar visualmente la paleta fija en cada perfil antes de proponer ajustes.

Selectores: `.layer-knot`, `data-mode=hidden|static|webgl`, `data-progress`, `data-start`, `data-end`, `data-emphasis`; canvas `.layer-knot__canvas`, trigger `art-o2-alignment`. No quedan QA/build pendientes de esta implementación según el cierre documentado.
