# ART-L1 — Progreso

Fecha: 20 de octubre de 2026. Estado: implementado y revisado. Cinco casos Playwright aprobados también en producción; [cierre conjunto](ART-INTEGRATION-PROGRESS.md), [QA independiente](ART-L1-QA.md). Los apartados de preparación siguientes conservan el historial.

## Trabajo realizado

- Revisados consolidado, propuesta F y las dos imágenes ART-L1. Concepto conservado como referencia, no usado como textura.
- Plan técnico en [ART-L1-NEXT-STEPS.md](ART-L1-NEXT-STEPS.md).
- SVG procedural con degradados resina ámbar/bronce y discreto canto pátina; dos mitades independientes pasan detrás/delante de la fotografía original.
- CAPA un anillo, CAPOTE dos, TRIPA tres; móvil un anillo estático.
- Sustituye exclusivamente los círculos decorativos existentes de ficha/inmersivo, sin alterar tamaños del layout.
- Cuatro poses ligadas a los capítulos reales; transición GSAP finita de 650 ms. Cambio de espécimen reinicia la entrada. No cursor, giroscopio, bucles idle, WebGL ni recursos externos.
- Listener de save-data cancela una transición activa al activarse el ahorro. MatchMedia/context con revert al desmontar; reduced motion y save-data estáticos. SVG aria-hidden, sin interceptar eventos ni añadir tabulaciones.

## Archivos

`src/components/leaf-library/SpecimenRing.jsx`, `TechnicalSheet.jsx`, `ImmersiveView.jsx`, `src/styles/specimen-ring.css`.

## Verificación realizada

ESLint específico de los tres componentes: correcto. No dependencias instaladas ni commits. No se ha ejecutado aún build o Playwright: están coordinados en el pase general para evitar servidores de preview simultáneos. No se afirma fidelidad validada hasta revisar capturas.

## Contrato QA y límites

- `.specimen-ring--back` / `.specimen-ring--front`, atributos `data-category` y `data-chapter`.
- Cada SVG contiene tres `.specimen-ring__arc`; los no aplicables usan display:none. Móvil oculta `.specimen-ring__arc--secondary`.
- `.specimen-ring__pose` contiene la transformación animada; reduced motion fija rotación -25° con CSS.
- Abrir `.ls-card-visual`; ficha `.ts-image-side--specimen`. Cambiar `.ls-view-switch button` al segundo; `.th-chapters button` permite probar 0→3→0. Cierre `.ls-icon-button`.
- Comprobar 3 categorías, 4 capítulos, foco de controles existentes, consola, móvil 390 px y reduced motion, cierre/reapertura sin callbacks pendientes.
- SVG simula los reflejos con degradados; no hay refracción física ni volumen real. Es la alternativa ligera descrita en la propuesta original, pendiente del juicio visual integrado.
