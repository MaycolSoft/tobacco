# Exploración 3D — estado vigente

Actualizado: **21 de octubre de 2026**. Exploración y generación completadas; el set seleccionado está implementado. Los planes ejecutados y QA se consolidaron en los registros siguientes. El resto del proyecto se sigue en [STATUS](../STATUS.md).

| Pieza | Implementación final | Estado y evidencia |
| --- | --- | --- |
| ART-H1 · Home, `#recorrido` | Three.js lazy, geometría texturizada y póster estático | [Registro H1](implementation/ART-H1-PROGRESS.md): funcional validado; aceptación visual del refinamiento pendiente. |
| ART-O2 · El oficio, `#proceso` | Three.js lazy, tres toros; SVG estático de respaldo | [Registro O2](implementation/ART-O2-PROGRESS.md): diez casos de producción aprobados. |
| ART-L1 · Biblioteca | SVG delante/detrás de fotografía; GSAP por capítulo | [Registro L1](implementation/ART-L1-PROGRESS.md): cinco casos aprobados; sin refracción física. |
| ART-C1 · Tu mezcla | SVG derivado de selección; Framer Motion | [Registro C1](implementation/ART-C1-PROGRESS.md): cinco casos aprobados; volumen limitado. |

[Cierre conjunto y rendimiento](implementation/ART-INTEGRATION-PROGRESS.md): pase completo 40/41 y repetición focalizada 5/5 tras corregir sincronización del test i18n. No hubo una única ejecución completa 41/41 documentada.

## Qué falta en este set

Revisión y aceptación visual de las piezas, especialmente H1 refinado y los materiales SVG L1/C1. O2 conserva material liso y paleta fija. La mezcla maestra de C1 no pudo probarse por UI porque no hay datos. No quedan implementaciones funcionales abiertas del set seleccionado según su cierre del 20/10; cualquier refinamiento nuevo requiere definir alcance.

Los conceptos de reserva, incluido C1 «Anatomía» (distinto de ART-C1 «Haz suspendido»), no forman parte del trabajo comprometido.

## Referencias conservadas

- [Galería, procedencia e inventario de las diez imágenes](refs/art/README.md). Las maquetas son concept art, no capturas de producción.
- [Análisis visual inicial](01_VISUAL_ANALYSIS.md), [conceptos](02_3D_CONCEPTS.md), [viabilidad histórica](03_TECHNICAL_FEASIBILITY.md).
- [Propuesta artística consolidada](04_ARTISTIC_3D_EXPLORATION.md) y `04-parts/`: decisiones y alternativas de exploración.
- [Prompts de assets](CODEX_IMAGE_PROMPTS.md) y [prompts artísticos](CODEX_ARTISTIC_IMAGE_PROMPTS.md).

Para continuar, revisar código y `git status`, el registro de la pieza y sus capturas. Los roles, encargos y restricciones de sesiones anteriores son antecedentes, no instrucciones actuales. Los scripts vigentes están en `package.json`.
