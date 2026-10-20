# ART-O2 — Progreso

2026-10-20. Implementación autorizada por la petición de continuar todas las piezas. ART-H1 permanece intacto.

**Cierre actual:** diez casos O2 aprobados en producción, incluyendo regresión del observer que entregaba salida/entrada en el mismo lote. Scroll, responsive, foco, carga y cleanup revisados. Consultar [cierre conjunto](ART-INTEGRATION-PROGRESS.md) para resultados completos, benchmark y límites; el resto del documento conserva la secuencia de trabajo.

## Preparación inicial (historial)

Leídos el plan O2, conceptos y código real de About. Revisadas ambas imágenes conceptuales. La vía elegida es CSS 3D, sin dependencias ni recursos raster: aproximación editorial de anillos biselados, no reproducción física de toros/SSS del render.

Baseline Playwright (1440×900, español): #proceso x124.5/y1752.3125/w1180/h1564.390625; lead x904.5/y1881.90625/w400/h66.0625; pills y2089.9375/h44; divisoria y2169.9375. Hay espacio bajo el lead para un objeto de ~296×197 sin alterar contenido.

Primero se construyó el estudio CSS/materiales, medición del hueco y montaje absoluto. Scrub local reversible; tablet estático condicionado al espacio, móvil oculto. No hay pin, luz por cursor ni cambios de navegación.

## Revisión visual CSS 3D — limitación detectada

Captura `validation/art-o2/desktop-mid.png`, 1440×900, revisada manualmente: el tamaño y la ubicación cumplen la maqueta, pero la pintura sobre planos anulares produce discos inclinados y cortes duros. No reproduce el volumen ni los cruces del nudo de la referencia. **No se declara lograda la fidelidad del concepto.** Antes de sustituir la técnica se comunica la limitación al coordinador. La medición Playwright confirma exactamente iguales las cuatro cajas baseline; no hay errores JS en esta comprobación.

En ese punto se recomendó Three vanilla existente con tres toros reales, import dinámico local y estático vectorial. La revisión se resolvió dentro de la implementación descrita abajo, sin instalar paquetes ni tocar H1.

## Implementación final de esta fase

El coordinador autoriza la revisión a Three existente dentro de la petición de continuar todo. Sustituida la prueba CSS (se conserva su captura, no código muerto) por `LayerKnotRenderer.js`, import dinámico únicamente al entrar el objeto elegible en viewport. Tres toros reales, 6.912 triángulos y tres mallas; materiales opacos satinados/mates, sin sombras dinámicas ni descargas de texturas. DPR máximo 1.5, render solo si hay cambios, limitado a unos 30 fps; sin bucle permanente ni idle. Limpieza de geometría/materiales/renderer/contexto, timer, observers, eventos y trigger al desmontar. Pérdida de contexto o fallo de carga vuelve al SVG.

Ajustes visuales respecto del plan: inclinaciones interiores de 58° (en vez de 25–40°) para hacer legibles los cruces a este tamaño; cera desaturada marrón-clarete para evitar exceso de rojo. La microtextura vegetal/papel y SSS del concepto no se reproducen: es una interpretación geométrica sobria, no una reproducción fotográfica. No se ha añadido textura procedural ni raster que finja provenir de las referencias.

La paleta del objeto/SVG es local y fija, cálida; no implementa recoloración específica Black/Editorial Noir. Permanece legible sobre el fondo actual. Esta diferencia del plan se deja explícita para revisión visual por perfil.

Responsive aplicado: >=1081 WebGL solo si cabe y no hay reduced-motion/saveData; 861–1080 SVG estático si cabe; <=860 decorativo oculto sin reservar espacio. Lead, títulos, pills y divisoria conservan DOM y layout. Hover y foco sobre pills enfatizan su aro, sin cambiar href ni interceptar navegación. Se conserva el scroll de anclas existente.

## Comprobaciones ejecutadas

- Playwright Chromium propio contra Vite en 4182: progresos 0 → .5 → 1 → .5 → 0 exactos al redondeo de cuatro decimales; evidencia `validation/art-o2/smoke.json` y capturas `pose-0.png`, `pose-0.5.png`, `pose-1.png`.
- Foco en segunda pill: `data-emphasis=1`; reduced-motion en caliente: SVG y cero canvas; volver al modo normal recrea un único canvas.
- Anchos 390/860: oculto/cero canvas; 861/1080: estático/cero canvas; 1081/1280: WebGL/un canvas. Sin overflow horizontal ni pageerrors en el recorrido.
- Baseline y montaje: cuatro cajas medidas idénticas a las anotadas arriba (sin desplazamiento atribuible al objeto).
- Detectado y corregido durante smoke: carga de fuentes movía #proceso sin cambiar su altura; ahora se observa también el contenedor de página y la clave de medición incluye top absoluto para refrescar el rango.
- ESLint de componentes nuevos limpio; `git diff --check` limpio al momento de revisión.

Pendiente del coordinador/QA independiente: pruebas persistentes en suite global, navegación SPA/idiomas/temas, rendimiento con tres repeticiones y validación final conjunta. No se afirma que esos checks estén completados. Contrato QA: `.layer-knot`, `data-mode=hidden|static|webgl`, `data-progress`, `data-start`, `data-end`, `data-emphasis`; trigger `art-o2-alignment`; canvas `.layer-knot__canvas`. No se modificó H1, reproductor, paquetes ni lockfile; no se hicieron commits.

## Corrección posterior a QA de producción

La suite conjunta detectó dos casos con progreso .5 pero SVG estático sin error de carga. Reproducido en preview de producción en el intento 22 de una secuencia de cargas: **un único callback de IntersectionObserver contenía dos entradas del mismo nodo**, primero `isIntersecting=false` con y2309 y luego `true` con y351. El código tomaba `entries[0]`, retenía el estado viejo e impedía iniciar el import lazy. Se corrige tomando la última entrada del batch (`entries.at(-1)`), sin añadir polling ni listeners de scroll. El problema era de selección de estado de visibilidad, no de recursos WebGL ni timeout del test.
