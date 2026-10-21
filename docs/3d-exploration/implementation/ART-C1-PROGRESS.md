# ART-C1 — implementación y QA consolidados

Implementado y validado el 20/10/2026; consolidación 21/10. Esta pieza es **Haz suspendido**, distinta de C1 «Anatomía». Sustituye NEXT-STEPS y QA ejecutados. [Cierre conjunto](ART-INTEGRATION-PROGRESS.md).

## Decisiones finales

`BlendSculpture.jsx` y `blend-sculpture.css`, integrado en `BlendSummary.jsx`; `CraftYourCigar.jsx` comunica pausa de guía. Franja150px, 100px <=860. SVG derivado de selecciones reales: una lámina con fotografía por tripa(0–5), cinta capote ámbar estilizada y cinta capa con su fotografía únicamente cuando se eligen. Sin alterar inventario/store/rejilla ni usar concept art como textura.

Framer Motion controla los nodos, sin GSAP sobre la misma transformación. Entrada/salida, énfasis con foco prioritario sobre hover y flotación finita4s. Guía, documento oculto y fuera de viewport pausan; móvil, reduced motion y Save-Data muestran composición estática. Listener dinámico de ahorro y limpieza al desmontar. Resultado y reproducción desmontan la pieza. SVG decorativo `aria-hidden`, sin interceptar controles, sin canvas ni carga Three.

## Validación documentada

Cinco casos de `tests/craft-sculpture.spec.js` aprobados en dev y producción: vacío, selección0→5→4, capote/capa condicionales, foco/hover, quitar, guía/resultado, ES/EN/FR/ZH preservando selección, móvil/reduced/Save-Data y ausencia de errores o requests Three. Build integrado y ESLint específico correctos.

[Objeto](validation/art-c1/complete-object.png), [escritorio](validation/art-c1/complete-desktop.png), [móvil](validation/art-c1/complete-mobile.png). La revisión conjunta tuvo CLS0 en tres ventanas; una tarea aislada64ms y máximoRAF83.3ms sin atribución. No afirmar ausencia absoluta de tirones.

## Límites y pendientes

Aceptación estética pendiente: láminas más planas, menor profundidad y separación que el render; ámbar sin transmisión física, capa sin sheen de shader. Capote no calcula color medio de la hoja. Posibles refinamientos opcionales: siluetas/inclinaciones diferentes, sombras locales y reversos de cintas. No están implementados ni se asume cambio a Three.

La carga de mezcla maestra no se probó por UI: `src/data/masterBlends.js` está vacío y oculta ese control. Requiere datos reales; la selección manual sí está validada.

Contrato: `.blend-sculpture[data-art="art-c1"]`, `data-leaf-count`, `data-motion-eligible`, `data-running`; SVG `data-leaf` y `data-layer`. Sesión de mezcla: `tamboril-blend`. La flotación termina a4s o al pausar. No quedan build/QA generales abiertos de la implementación entregada.
