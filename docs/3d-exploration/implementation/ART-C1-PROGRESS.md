# ART-C1 — Progreso

Fecha: 2026-10-20. Implementación terminada y revisada. Cinco casos Playwright aprobados también en producción; [cierre conjunto](ART-INTEGRATION-PROGRESS.md), [QA independiente](ART-C1-QA.md). Consultar [plan](ART-C1-NEXT-STEPS.md). Los checks pendientes del historial inferior fueron completados en ese cierre, salvo mezclas maestras: el inventario de maestros está vacío.

## Trabajo realizado

- Revisados propuesta AR-C1 en F_LIBRARY_CRAFT, ambos conceptos ART-C1 y componente/estilos reales. Esta pieza es la composición artística de la mesa, no el antiguo C1 de anatomía.
- `BlendSculpture.jsx` implementa la alternativa SVG documentada. Cada tripa elegida genera una lámina con su fotografía real; capa usa la fotografía de la capa elegida en su cinta. Capote usa una cinta ámbar translúcida estilizada. Los extremos quedan abiertos.
- Integración exclusivamente en cabecera de BlendSummary, como franja superior de 150 px (100 px <=860). No modifica la rejilla ni el inventario ni el store.
- Framer Motion controla todos los nodos animados: entrada/salida, énfasis hover/foco, cintas, inclinación por paso, flotación finita de cuatro segundos después de selección. No hay GSAP duplicado, canvas ni nueva dependencia.
- `artPaused={showGuide}` pausa al abrir guía. Visibilidad de página, IntersectionObserver de Framer, móvil, Save-Data (con listener dinámico) y reduced motion desactivan animación. El montaje existente desaparece en resultado y reproducción; efectos limpian listeners y controles al desmontar.
- Foco de botón de quitar hoja prima sobre hover. La decoración es `aria-hidden`, sin eventos que intercepten acciones.

## Validación realizada

`npx eslint src/components/craft-art/BlendSculpture.jsx src/components/BlendSummary.jsx`: pasa. No se ejecutó build concurrente para evitar interferencia con otros agentes. Intento de Vite local bloqueado por permiso EPERM de Console Ninja sobre loopback; coordinación central ejecutará navegador/build con el entorno autorizado.

## Contrato para QA

- Ruta protegida `/craft-your-cigar`; usar autenticación local de tests/i18n.spec.js.
- `.blend-sculpture[data-art="art-c1"]`, `data-leaf-count` (0–5), `data-motion-eligible` (true únicamente visible/desktop/sin pausa/reducción/Save-Data), `data-running` (flotación activa, termina a cuatro segundos).
- SVG `[data-leaf="ID"]` para láminas; `[data-layer="CAPOTE"]` y `[data-layer="CAPA"]` para cintas frontales.
- Store persistido `sessionStorage` clave `tamboril-blend` con state.selections y state.stepIndex.
- Verificar selección real, maestro, quitar hoja y salida, foco/hover, capote/capa, guía (running false), resultado/desmontaje, móvil y reduced, consola, ausencia de recursos Three nuevos en Craft.
- `data-running` vuelve a false al terminar la flotación, al abrir guía, ocultar pestaña o salir de viewport.

## Límites y decisiones conscientes

La alternativa SVG reproduce capas y cambios de selección, pero no transmisión física, autooclusiones reales ni deformación volumétrica del concept art. No se afirma fidelidad fotográfica equivalente a Three. Capote conserva ámbar común, no color medio calculado por hoja. La capa usa fotografía y no sheen de shader. Estas diferencias están documentadas antes de revisión visual; si no resulta convincente se evaluará mejora específica, sin sustituir tecnología silenciosamente.

La franja prevista en el handoff aumenta solo el panel de resumen. Comprobar en capturas que no invade el dock ni reduce acceso a los controles. Sin commits y sin cambios a ART-H1, ScrollVideo o reproductor de frames.
