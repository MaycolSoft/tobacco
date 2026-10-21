# ART-L1 — implementación y QA consolidados

Implementado y validado el 20/10/2026; consolidación 21/10. Sustituye NEXT-STEPS y QA ejecutados. [Cierre conjunto](ART-INTEGRATION-PROGRESS.md).

## Decisiones finales

`SpecimenRing.jsx`, `specimen-ring.css` y montajes en `TechnicalSheet.jsx`/`ImmersiveView.jsx`. Dos mitades SVG rodean la fotografía original delante/detrás, sustituyendo solo los círculos decorativos. CAPA: un anillo; CAPOTE: dos; TRIPA: tres. Móvil <=800: un anillo estático.

Cuatro poses determinadas por los capítulos reales, GSAP local finito650ms y entrada al cambiar espécimen. Se eligió GSAP porque los capítulos son estado React, sin motion values; solo anima el SVG. Sin ScrollTrigger, cursor, giroscopio, idle, WebGL ni recursos externos. Reduced motion y Save-Data estáticos; listener dinámico detiene tween activo. Context/revert al cambiar capítulo/hoja y desmontar. SVG `aria-hidden`, sin tabulación ni eventos.

## Validación documentada

Cinco casos de `tests/specimen-ring.spec.js` aprobados en dev y producción: categorías, cambio de hoja, poses0→3→0 y wheel, layout±2px, cierre durante tween/reapertura/Escape con foco, navegación, móvil390, reduced motion y Save-Data. Sin errores ni WebGL; sin desbordamiento horizontal. Build integrado y ESLint específico correctos. El bloqueo inicial de Chromium por sandbox fue ambiental y se resolvió en la ejecución documentada.

[Capturas de categorías, capítulos y fallbacks](validation/art-l1/). La revisión conjunta comprobó desmontaje durante la transición y tres ventanas con CLS0, RAFp9516.7–16.8ms, sin tareas>50ms.

## Límites y mantenimiento

El SVG produce reflejos bronceados con degradados, no refracción de resina ni volumen físico. Aceptación estética pendiente. El título móvil «Criollo98» se parte en la columna estrecha del encabezado existente: no está causado por el aro y no se corrigió en esta pieza.

Selectores: `.specimen-ring--back`, `.specimen-ring--front`, `data-category`, `data-chapter`, `.specimen-ring__pose`, `.specimen-ring__arc`. Ficha `.ts-image-side--specimen`, capítulos `.th-chapters button`, cierre `.ls-icon-button`. No quedan build/Playwright pendientes del set entregado.
