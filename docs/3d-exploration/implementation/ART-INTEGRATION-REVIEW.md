# Revisión conjunta ART-O2 / ART-L1 / ART-C1

2026-10-20. Revisión independiente, sin cambios de producto ni dependencias. Chromium headless sobre Vite `127.0.0.1:5176`, escritorio 1440×1000. Complementa las suites individuales y el pase de producción del coordinador; no los sustituye.

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

## Estado para continuar

La integración funcional conjunta no presenta bloqueos detectados. Quedan como límites conocidos la fidelidad material de L1/C1 y los eventos aislados de rendimiento indicados arriba. Cualquier revisión estética posterior debe partir de estos resultados y de las capturas, sin declarar conseguido el concept art exacto. ART-H1 y el reproductor de frames no se modificaron en esta revisión. No se hicieron commits.
