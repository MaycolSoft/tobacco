# ART-C1 — Plan de implementación

Fecha: 2026-10-20. Alcance autorizado: continuar las piezas artísticas; no rehacer el antiguo C1 «Anatomía de tu cigarro» ni el reproductor.

## Concepto y decisión técnica

Se revisaron [la propuesta AR-C1](../04-parts/F_LIBRARY_CRAFT.md), [objeto](../refs/art/ART-C1-object.png), [integración](../refs/art/ART-C1-page-mockup.png) y [aprendizajes H1](ART-H1-PROGRESS.md). El concepto muestra láminas vegetales horizontales rodeadas por dos cintas, nunca un cigarro literal.

Se utilizará la alternativa SVG prevista en el handoff con las fotografías `thumbImg` reales recortadas en láminas y cintas. No se usa el concept art como textura. Framer Motion existente animará exclusivamente esos nodos SVG; no añade dependencias ni carga Three en Craft. Esta variante representa volumen mediante superposición, sombra y luces; no reproduce transmisión física o geometría volumétrica de R3F. La decisión conserva legibilidad y rendimiento en una mesa ya interactiva.

## Archivos y comportamiento

- `src/components/craft-art/BlendSculpture.jsx`: SVG aislado, estado derivado de `selections`, clipPaths únicos por instancia, imágenes seleccionadas, entrada/salida por hoja y cintas condicionales.
- `src/styles/blend-sculpture.css`: franja de 150 px sobre el resumen, 100 px en móvil; estilos locales, sin tocar tokens/globales.
- `BlendSummary.jsx`: montar pieza antes del kicker; asociar hover y foco de cada fila con su lámina. Mantener texto, botones, navegación y store.
- `CraftYourCigar.jsx`: comunicar `showGuide` para detener la pieza; el bloque existente la desmonta al abrir frames o mostrar resultado.

Cada hoja de tripa representa exactamente una selección (0–5). Capote/capa aparecen únicamente al elegirlos; los extremos quedan abiertos. Entrada 500 ms con stagger de 80 ms, salida 300 ms; cintas 700 ms. Cambio de paso inclina hasta 15 grados. Hover/foco destaca la hoja correspondiente. Flotación ±3 px termina tras cuatro segundos, sin bucle permanente. Guía, pestaña oculta y fuera de viewport detienen movimiento. Reduced motion y móviles muestran estado final sin animación. No cursor lighting.

## Verificación

Playwright: 0/2/5 hojas, carga de mezcla maestra, capote/capa, hover/foco, borrado y retroceso; móvil sin desbordamiento; reduced motion; guía pausa; resultado desmonta; selección y enlaces siguen funcionando; errores de consola. Capturas desktop/móvil y revisión visual de la franja. ESLint de archivos nuevos y build compartida. Los cambios de altura se limitan a los 150/100 px expresamente previstos para el resumen; no se desplaza la rejilla.

## Reanudación

Consultar `ART-C1-PROGRESS.md` antes de continuar. No modificar ART-H1, ScrollVideo, store, inventario ni el antiguo C1.
