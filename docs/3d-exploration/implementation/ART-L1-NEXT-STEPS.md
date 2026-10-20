# ART-L1 — Anillo de espécimen

Estado: implementación autorizada el 20 de octubre de 2026.

## Integración

Transformar únicamente los círculos decorativos de la ficha y del recorrido inmersivo. Conservar fotografías, textos, controles, medidas y navegación de hojas. Se adopta la alternativa SVG prevista en la propuesta original: segmentos posteriores y anteriores independientes rodean la fotografía real. Degradados ámbar/bronce y un canto verdín discreto; sin reutilizar el concept art como textura.

La representación SVG aproxima la resina con reflejos y transparencia; no reproduce refracción física. No se necesita Three, R3F ni dependencias nuevas. Se descarta el giroscopio y la iluminación de cursor en esta primera versión.

## Movimiento y accesibilidad

GSAP local, sin ScrollTrigger: el overlay ya controla su propio recorrido por capítulos. Pose determinista para los cuatro capítulos, reversible con sus controles actuales. Entrada breve al cambiar la hoja. Ningún bucle idle ni eventos de rueda nuevos. Limpieza con context/revert y matchMedia. Móvil <=800 px, reduced motion y save-data: un anillo estático. Decoración aria-hidden y pointer-events:none.

CAPA: un anillo; CAPOTE: dos; TRIPA: tres. La fotografía mantiene su protagonismo y la decoración no añade semántica nueva a los controles.

## Archivos y comprobación

- Nuevo `src/components/leaf-library/SpecimenRing.jsx` y `src/styles/specimen-ring.css`.
- Montajes mínimos en `TechnicalSheet.jsx` e `ImmersiveView.jsx`.
- Pruebas Playwright: ficha, cambio de hoja/categoría, recorrido 0→3→0, móvil, reduced motion, cierre/reapertura y consola.
- Build y lint de archivos tocados. Documentar resultados en ART-L1-PROGRESS.md. No tocar ART-H1, reproductor de frames, estilos globales ni dependencias.

## Decisión de sincronización

La propuesta histórica prefería framer-motion en el overlay. El componente concreto actual no usa motion values: sus capítulos son estado React y la imagen ya tiene su transición CSS. Se utiliza GSAP únicamente dentro del nuevo SVG, sin modificar esos nodos ni mezclar librerías sobre la misma transformación. Las poses derivan directamente del capítulo, no de un scroll global. El canto pátina usa #6F907F del consolidado, que prevalece sobre el valor histórico de F.
