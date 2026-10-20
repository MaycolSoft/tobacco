# ART-O2 — QA independiente

2026-10-20. Chromium contra Vite local `127.0.0.1:5176`. No se modificaron componentes, H1 ni dependencias.

Actualización del coordinador: diez casos aprobados en el pase de producción, incluido el benchmark con cero tareas largas y cero shifts atribuibles a O2 y la nueva regresión de observaciones agrupadas. Las mediciones dev de abajo son historial; [resultados finales](ART-INTEGRATION-PROGRESS.md).

## Funcional

`tests/layer-knot.spec.js`: ocho casos funcionales pasaron (última ejecución funcional 29.2s incluyendo prueba de rendimiento fallida):

- Renderer ausente de requests iniciales; carga al entrar la pieza en viewport; un canvas.
- Cajas de heading/lead/nav/chapters iguales al ocultar el decorativo (tolerancia 2px); rectángulo seguro sin superposición.
- Scroll 0/.5/1/.5/0 reversible, pieza visible en extremos.
- Foco de pills tiene prioridad sobre hover; blur/leave restaura; Enter conserva navegación.
- 390/860 oculto, 861/1080 estático sin canvas; sin overflow horizontal.
- Reduced motion, saveData, resize desktop/tablet y pérdida de contexto liberan canvas.
- Diez ciclos SPA About→Home→About sin canvas duplicado ni errores; composiciones en/en/fr/zh-CN.

## Visual

Capturas en `validation/art-o2/test-results/`. Revisada manualmente desktop p0 frente `refs/art/ART-O2-page-mockup.png`: posición secundaria bajo lead y a la derecha de pills, sin alterar composición; tres volúmenes legibles y cruces reales. No es reproducción exacta: referencia usa banda intermedia más plana/ancha y microtextura/pátina, ejecución usa toros lisos y tripa terracota. Limitación de fidelidad documentada, no fallo funcional ni equivalencia prometida.

## Rendimiento: evidencia preliminar, no cierre

Una ejecución produjo CLS global 0.000677; otra CLS0 pero tareas largas [66,61,51,79,74]ms y maxFrame82.4ms. Son mediciones del servidor dev mientras otras validaciones corren en paralelo; no se atribuyen al objeto. La prueba guarda fuentes/nodos y todas las tareas; exige cero shifts atribuibles a LayerKnot, no silencia desplazamientos globales. El coordinador debe repetir en preview de producción, aislado y sin tracing, comparando baseline estático si persisten tareas largas. No se declara cumplido todavía el objetivo de ausencia de tareas >50ms.

Config temporal local `/tmp/o2-config.mjs`, sin webServer; la suite permanente usa la configuración normal del repositorio/preview4173. La última modificación del benchmark (atribución y guardado JSON) queda pendiente de ejecución final por coordinador; ocho casos funcionales ya pasaron.
