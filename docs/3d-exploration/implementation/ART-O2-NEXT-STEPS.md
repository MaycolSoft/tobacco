# ART-O2 — Nudo de tres capas · Plan de implementación

> **Actualización 2026-10-20:** este documento conserva el plan previo. El usuario ya solicitó implementar el set. La implementación y la revisión de CSS a Three están registradas en [ART-O2-PROGRESS.md](ART-O2-PROGRESS.md); consultar también [el cierre conjunto](ART-INTEGRATION-PROGRESS.md). Las restricciones temporales de la sesión de planificación de abajo son históricas.

> 2026-10-19 · **Plan preparado; ART-O2 no implementado.** Próxima sesión: implementar solo cuando el usuario lo solicite. Esta sesión autoriza documentación, no código, assets nuevos, dependencias ni commits. ART-H1 queda intacto.

## 1. Fuentes y estado comprobado

- [Progreso general](../PROGRESS.md), [exploración consolidada](../04_ARTISTIC_3D_EXPLORATION.md), [ficha AR-O2 de E](../04-parts/E_HOME_ABOUT.md), [sistema de color/tecnología de G](../04-parts/G_COLOR_TECH.md) y contexto de [F](../04-parts/F_LIBRARY_CRAFT.md).
- [Prompts ART-O2](../CODEX_ARTISTIC_IMAGE_PROMPTS.md), [índice de referencias](../refs/art/README.md), [historial de generación](../CODEX_GENERATION_PROGRESS.md).
- Imágenes revisadas visualmente: [objeto ART-O2](../refs/art/ART-O2-object.png) (1254×1254) y [maqueta ART-O2](../refs/art/ART-O2-page-mockup.png) (1505×1045). Captura original: [proceso.png](../../../design-review/desktop/proceso.png).
- [ART-H1 implementado y validado](ART-H1-PROGRESS.md): Three vanilla lazy, GSAP existente, fallbacks, cleanup y validación desktop/móvil. Sus resultados son históricos, no pruebas nuevas de O2.
- Código inspeccionado: `src/pages/About.jsx`, `src/styles/site-editorial.css`, `src/components/layout/MainLayout.jsx`, `src/components/home/LeafRibbon.jsx`, `src/config/visualProfiles.js`, `package.json` y configuración/pruebas Playwright existentes.
- `three` ^0.186.1 ya está instalado por H1. No están autorizadas nuevas dependencias para este trabajo; no hace falta instalar ninguna para la vía recomendada. Las propuestas antiguas de R3F/drei no describen el stack real actual.

## 2. Intención visual y límites de las referencias

Tres anillos concéntricos, cada vez más gruesos hacia dentro: capa exterior satinada en bronce; capote medio mate tipo papel con filo verdín; tripa interior de cera clarete con calidez ámbar muy contenida. Luz cálida izquierda, relleno frío mínimo. Nada de humo, metal espejo, brillo de joya, neón ni cigarro literal.

El estudio valida materiales, espesores e inclinaciones diferentes (aprox. 25–40° en los dos interiores); la maqueta valida una pieza secundaria bajo el lead derecho, junto a las pills 01–03, sobre la divisoria. No se debe copiar el tamaño grande del estudio a la página. Caja objetivo máxima **300×200 px**, incluyendo deriva y perspectiva; objeto con margen interior.

Las referencias son raster con iluminación y fondo horneados, no un modelo, mapa de normales ni un póster transparente. No recortarlas automáticamente para producción ni usarlas como textura de los anillos. Tampoco son autoridad sobre medidas del DOM ni sobre tipografía: manda la página real. En reposo final habrá tres huecos/anillos distinguibles; evitar aspecto de diana o logotipo mediante espesores y sombreado material sobrio.

## 3. Decisión técnica recomendada y revisión visual obligatoria

**Primera vía: React + CSS 3D + GSAP/ScrollTrigger ya existentes**, conforme a la v1 recomendada en el documento 04. Tres planos anulares con `transform-style: preserve-3d`, perspectiva local y pintura de material mediante gradientes/pseudoelementos. Sin canvas, shader, textura fotográfica ni descarga de Three en About para esta vía.

| Vía | Ventaja | Límite / decisión |
|---|---|---|
| CSS 3D (recomendada primero) | Geometría simple, tematización con variables, menor complejidad y coste; sin nuevas dependencias | Simula aros biselados, no toros volumétricos. La oclusión de planos cruzados, canto grueso y cera no equivalen al render. Validar en poses 0/.5/1 antes de completar la animación. |
| Three vanilla ya instalado | Toros reales, normales, profundidad y oclusión geométrica | Import lazy independiente, materiales, GPU, fallbacks y cleanup adicionales. Solo considerar si CSS falla la evaluación visual y el usuario acepta esta revisión del plan. No refactorizar H1 ni añadir R3F/drei. |
| Vídeo / secuencia raster | Material horneado de gran calidad | No recomendado: animación reversible, tema y hover/foco se complican; añade assets y memoria sin necesidad inicial. |

**Punto de revisión:** construir primero un estudio local de las tres poses, dentro del componente futuro, y comparar con la maqueta. Si se ven círculos planos, cortes incorrectos, cruces que parpadean o un interior tipo donut plástico, registrar capturas y el problema en `ART-O2-PROGRESS.md` antes de cambiar de técnica. No presentar CSS como equivalente físico de Three ni sustituirlo silenciosamente. El plan no promete reproducir cada efecto óptico del concept art.

## 4. Integración DOM sin rediseño

Hecho importante: en `About.jsx`, `.site-section-heading--wide` contiene **un div de título y un p.site-lead directo**. El CSS aplica máximos de anchura con selectores `> div` y `> p`, y usa flex. Las pills son un `nav.site-chapter-nav` separado; la divisoria pertenece a `.site-process-chapters`. No hay ya una columna contenedora derecha lista para reutilizar.

Propuesta de montaje futuro:
1. Añadir un componente decorativo como hijo absoluto de `section#proceso`, fuera del flex de cabecera y del nav. Pasarle refs de sección, lead, nav y límite inferior; añadir refs a nodos existentes no modifica su semántica.
2. Añadir `position: relative` únicamente a `#proceso` mediante CSS específico de O2. No envolver ni mover el p, no cambiar sus selectores, anchos, márgenes, tipografía o flex-basis. No añadir items a `.site-section-heading`.
3. Calcular la caja disponible desde DOM real: a la derecha del conjunto de pills y bajo el lead, antes de la divisoria. El ancla absoluta usa coordenadas relativas a #proceso, no valores de la captura.
4. Límites orientativos: izquierda ≥ max(lead.left, extremo derecho de pills + 24 px); derecha ≤ borde derecho del contenido; arriba ≥ lead.bottom + 12 px; abajo ≤ divisoria superior de chapters − 12 px. No incluir padding exterior como ancho utilizable. Medir cada enlace si las pills hacen wrap.
5. Ajustar uniformemente una caja 3:2 a ese rectángulo, con máximo 300×200. Si no hay al menos unos 140×94 px útiles, ocultar el decorativo; no tapar contenido ni crear espacio nuevo. Recalcular con ResizeObserver, fuentes y cambios de idioma/tema.
6. `aria-hidden="true"`, sin tabIndex, `pointer-events:none`; textos/enlaces conservan su orden y foco. Mantener transformaciones dentro de la caja segura (incluyendo hover e idle), sin z-index global ni canvas fijo.

**Criterio de layout:** alturas de sección/cabecera y coordenadas de título, párrafo, pills y primera figura iguales con/sin componente (±2 px). Ningún nuevo padding para hacerle sitio. Validar perfiles con fuentes distintas, nav oculto y cambios de idioma; si falta espacio se reduce/oculta el objeto.

## 5. Geometría CSS, materiales y tema

Usar radios mayores normalizados **1 / 0.8 / 0.55**, semiespesores **0.03 / 0.06 / 0.14**. Para aproximación CSS, diámetro exterior = `2*(radio + semiespesor)*escala`; ancho de banda = `2*semiespesor*escala`. Así los tres espesores no se igualan accidentalmente. Elegir escala a partir de la altura disponible; el plano exterior frontal debe caber con margen dentro de 200 px.

- Tres envoltorios de alineación, cada uno con un hijo de énfasis y pintura anular. Separar propiedades de alineación, hover y deriva para que dos tweens no escriban el mismo transform.
- Exterior: bronce `#C7A479`, bisel y brillo ancho tenue; no metal cromado.
- Medio: base `#3A332B`, rugosidad visual mediante grano procedural estático muy leve; filo pátina **#6F907F** (paleta consolidada, prevalece sobre hex antiguos de E).
- Interior: clarete **#7B2F2B**, sombra cálida de volumen y gradiente interno ámbar **#D4913F** muy tenue. Falso SSS, sin emisión pulsante.
- UI conserva `--ls-gold` y neutros. Variables del objeto locales `.layer-knot`, derivadas de tokens existentes; no añadir acentos globales a `tokens.css` por esta pieza.
- Perfiles cálidos: paleta consolidada; Black/Editorial Noir: matices reducidos y bronce derivado del acento real, como propone G. Variables CSS responden al tema sin remount ni texturas por perfil.
- No aplicar opacity, filter o máscaras al ancestro que debe conservar el espacio 3D; pintar/atenuar hijos planos individuales. Revisar aplanamiento y cruces entre planos en navegador. No añadir blur grande ni sombras animadas costosas para disimular geometría insuficiente.

## 6. Scroll, animación reversible y navegación por anclas

### 6.1 Resolver el rango visible antes de animar

La ficha E propone progreso desde #proceso hasta el final de #composicion. **Sin pin**, el objeto de la cabecera sale del viewport mucho antes de terminar ese rango. Mantener literalmente esa combinación haría invisible gran parte de la secuencia. Además, `end:'#composicion bottom 60%'` es una descripción de intención, no una configuración a copiar como string de otro elemento; un recorrido entre nodos necesita `endTrigger` y un `end` válido.

**Recomendación v1:** sin pin ni sticky, usar un **scrub local de alineación** mientras la caja decorativa sea visible. Tres fases simbólicas de Selección/Composición/Elaboración, no una falsa indicación del capítulo actualmente leído. Documentar esta adaptación respecto de E. No modificar enlaces, contenido, selección de capítulo ni añadir scroll hijacking.

Para la futura implementación: tomar Y/H de la caja absoluta en coordenadas de documento y V = altura del viewport. Objetivos iniciales de scroll: `start = Y − 0.75*V`, `end = Y + H − 0.25*V`, recalculados al refrescar. Con H≈200, V≈900, el objeto continúa visible en ambos extremos. Si la geometría concreta no cumple eso, ajustar estos umbrales a partir de capturas, sin pin. Usar funciones de start/end en ScrollTrigger (coordenadas de scroll), no números derivados una sola vez. El trigger y su id pertenecen únicamente a O2.

### 6.2 Estado y fases

Una única fuente de estado `progress` 0..1, independiente del número/dirección de eventos. Para anillo i (0..2), progreso local `clamp(3*progress − i, 0, 1)`; interpolar desde pose inicial a frontal alineada. Con CSS usar ángulos pequeños de Euler, sin giros de 360°; si se decide Three, usar quaternions/slerp.

| Progreso | Resultado esperado |
|---|---|
| 0 | Exterior ligeramente inclinado (~12°); medio/interior a 25–40° en ejes diferentes, desplazamientos pequeños. |
| 1/3 | Exterior alineado, los otros mantienen la pose inicial. |
| 2/3 | Exterior y medio alineados, interior aún inclinado. |
| 1 | Tres anillos frontales/concentricos, huecos y espesores claros. |

`gsap.to` sobre estado numérico, `ease:'none'`, `scrub:0.6`, `invalidateOnRefresh:true`; aplicar transforms a refs desde onUpdate sin React setState por frame. **Scrub numérico sobre una animación**, no confiar en que `ScrollTrigger.create({scrub:0.6,onUpdate})` suavice por sí solo un callback. Exponer `data-progress`, `data-mode` y opcionalmente un estado de fase para QA.

En refresh/saltos de ancla, sincronizar estado con `self.progress` y dibujar la pose correspondiente, evitando animar desde cero durante una recarga/restauración. Deshacer únicamente los tweens/triggers propios mediante contexto, nunca `killAll()`.

### 6.3 Idle y pills

- Idle opcional discreto: ciclo ~10 s, deriva ≤2 px/precesión ≤2°. Wrapper separado; amplitud menor al alinearse para no perder lectura del estado final. Pausar fuera del viewport y con `document.hidden`.
- Hover **y foco de teclado** sobre enlace 01/02/03: adelantar solo su anillo aprox. 10 % de la profundidad elegida, atenuar los demás hacia 0.4. La asociación es por índice de etapa, no debe presentarse como equivalencia semántica Selección=capa/Composición=capote/Elaboración=tripa.
- Hover/foco no cambia progress ni navega; clic/Enter siguen el href original. Foco tiene prioridad si convive con un hover diferente. Pointerleave/focusout devuelven al estado de énfasis correcto; sin movimiento en modo estático/reduced motion.
- Añadir listeners a refs/enlaces existentes sin interceptar eventos ni crear botones nuevos. Quitarlos al desmontar; root decorativo nunca recibe pointer events.

### 6.4 Hash, fuentes y refresh

`About` ya hace `requestAnimationFrame(...scrollIntoView)` al cambiar hash; `MainLayout` hace scrollTo(0,0) al cambiar pathname. Conservar sus funciones. En el futuro, tras el scrollIntoView existente se puede programar un refresh/update de O2 (rAF posterior cancelable), solo una vez por cambio; evitar loops de ResizeObserver/refresh. Los saltos nativos por href también deben quedar cubiertos por hashchange/ubicación y actualización de ScrollTrigger.

Medir después de `document.fonts.ready`; observar cambios reales de tamaño de lead/nav/sección, agruparlos en un rAF y refrescar solo si cambia la caja. No forzar saltos nuevos para corregir diferencias de tipografía. Comprobar entrada directa a /about#proceso, #seleccion, #composicion, #elaboracion, navegación SPA y cambio de idioma conservando hash.

## 7. Responsive, accesibilidad y ciclo de vida

| Condición | Propuesta v1 |
|---|---|
| ≥1081 px y hueco suficiente | CSS 3D animado, caja máxima 300×200. |
| 861–1080 px | SVG estático alineado, ajustado al hueco existente; ocultar si no cabe. Sin trigger/idle. |
| ≤860 px | La cabecera pasa a columna y las pills pueden ocupar todo el ancho: **ocultar el decorativo por defecto** para mantener el diseño. |
| Reduced motion / saveData | SVG alineado estático, solo si cabe; sin scrub, hover transformado o idle. |
| CSS 3D no disponible | SVG estático alineado. |
| Pestaña oculta / fuera del viewport | Pausar tweens propios y deriva; al volver, sincronizar posición actual. |

La propuesta antigua de un SVG visible debajo del lead en móvil exige un bloque adicional que puede aumentar altura o desplazar pills. No asumir que hay un hueco como en H1: **ocultar en móvil es una decisión propuesta en este plan**, pendiente de aceptación al solicitar implementación. Si se exige visibilidad móvil, acordar primero la reserva de espacio; no introducirla silenciosamente. Los umbrales exactos y tamaño mínimo también se validarán, no están aprobados como nuevos requisitos de producto.

React: `useLayoutEffect` + `gsap.context()`/`gsap.matchMedia()`, refs locales. No @gsap/react. IntersectionObserver para habilitar animación cerca de la caja (margen ~200 px), otro control de visibilidad real para idle; no bucle rAF propio perpetuo. GSAP ya gestiona sus ticks. Observer y callbacks tardíos protegidos con flag activo; cleanup de contextos, tweens, listeners, ResizeObserver/IntersectionObserver y rAF pendiente. Probar StrictMode, desmontaje antes de inicialización y resize repetido.

Si se revisa la vía a Three: un canvas lazy local a About, máximo 3 draw calls y unos 9k triángulos, materiales opacos (sin transmission ni sombras dinámicas), DPR ≤1.5, render dirty a ≤30 fps y cleanup completo como H1. No importar el renderer de H1 para «reutilizar Three» ni cambiar chunks/globales de Vite: primero medir el bundle real. Mantener independencia de rutas y desmontar al salir hacia Craft; nunca convivir con #video-root. No construir esta alternativa en paralelo «por si acaso».

## 8. Assets necesarios y archivos futuros

Para CSS/SVG **no hacen falta nuevos renders ni mapas**: anillos y fallback SVG son geometría vectorial/código nativo. Generar el fallback desde los mismos radios/espesores y colores, no mediante imagegen; así conserva la pose final y responde al tema. No reutilizar albedo/alpha/normal de H1: son otra materia y geometría. Una textura de papel opcional debe justificarse solo si el estudio visual la necesita; no instalar herramientas para ella.

| Archivo futuro | Cambio previsto |
|---|---|
| `src/pages/About.jsx` | Import/montaje local del nudo; refs de ancla/lead/nav/límite; coordinación mínima de refresh tras hash si hace falta. Sin cambiar textos ni navegación. |
| `src/components/about/LayerKnot.jsx` (nuevo) | Markup decorativo, refs, SVG estático, capacidades, medición, listeners y ciclo de vida GSAP. |
| `src/components/about/layerKnotMotion.js` (nuevo si separarlo aclara responsabilidades) | Función pura pose(progress,index), constantes de geometría, creación de timeline y cleanup. Sin renderer global. |
| `src/styles/layer-knot.css` (nuevo) | Estilos locales #proceso/.layer-knot, perspectiva, tres materiales, tamaños/modos estáticos. |
| `tests/layer-knot.spec.js` (nuevo) | Pruebas funcionales/visuales de O2 y regresión de navegación H1↔O2. |
| `src/components/about/layerKnotMotion.test.mjs` (opcional) | Unitarias de límites, reversibilidad y poses, solo si función pura se extrae. El glob actual de npm test no incluye esta carpeta: usar `node --test ruta` sin alterar scripts por comodidad. |
| `docs/3d-exploration/implementation/ART-O2-PROGRESS.md` (nuevo al implementar) | Decisiones, progreso, discrepancias, resultados y cómo reanudar. |
| `docs/3d-exploration/implementation/validation/art-o2/` | Capturas nuevas, medidas y logs; sin sobrescribir evidencias H1 ni capturas originales. |

**No afectados:** Home/H1 y sus assets/tests, App.jsx, MainLayout, rutas/i18n, C2/guía, reproductor de frames, package.json/lockfile y recomendaciones de Claude. No extraer todavía un framework 3D común ni asumir reutilización con C2. Este plan y PROGRESS son los únicos archivos a escribir en esta sesión.

## 9. Plan de validación con Playwright (al implementar)

Usar configuración existente (build + preview 127.0.0.1:4173, Chromium). Empezar con baseline de About actual antes de añadir el objeto, mismo viewport, tema, idioma y fuentes cargadas. Las capturas históricas son guía de composición; no son baseline píxel a píxel de la aplicación actual.

| Prueba | Evidencia / aceptación |
|---|---|
| Presencia | Solo #proceso de About, aria-hidden, sin foco y sin controles nuevos. Home no contiene LayerKnot. |
| Layout | Con/sin objeto: alturas y rectángulos de heading/lead/nav/primera figura ±2 px. Caja segura sin intersecciones con texto, pills o divisoria. Sin scroll horizontal. |
| Reversibilidad | Scroll a 0,1/3,.5,2/3,1 y volver; data-progress tolerancia ~.04 tras scrub. Comparar matrices de anillos al mismo p en ida/vuelta, excluyendo wrapper idle. |
| Visual | Capturas desktop 1440×900 y 1440×1000, poses 0/.5/1, huecos/grosores, tres materiales, estado final; comprobar sombras/cruces y que no compita con enlaces. Capturar pose 0 sin desplazar el scroll para forzar su visibilidad. |
| Hover/foco | Tab/Shift+Tab y pointer: énfasis reversible del anillo correcto, orden de foco intacto, href y Enter funcionan. Hover no sobrescribe scrub; reduced motion no añade transformaciones. |
| Navegación/anclas | Entradas directas y saltos a los cuatro hashes, recarga y restauración, back/forward, header/navbar ocultos. Progreso corresponde a posición real; no modificar MainLayout para forzar restauración. |
| Responsive | 390×844, 860, 861, 1080, 1081, 1280 y 1440 px; títulos largos. SVG si cabe, oculto si no; sin triggers/idle en modos estáticos. |
| Idioma/tema | /about, /en/about, /fr/about, /zh-CN/about; cambio en caliente, hash conservado. Base/Black/Editorial Noir y al menos una tipografía diferente. |
| Reduced motion/saveData | Estáticos desde carga y al cambiar capacidades; mock navigator.connection como EventTarget con saveData, no objeto plano sin addEventListener. |
| Recursos/cleanup | CSS vía elegida no pide chunk Three/H1 ni texturas ni crea canvas en About. Desmontar/entrar diez veces: sin nudos/listeners/tweens duplicados, sin escritura sobre refs desmontadas. H1 sigue cargando/liberando sus propios recursos al navegar Home↔About. |
| Visibilidad | Idle pausado fuera de viewport y al ocultar documento; reanudar sin progreso obsoleto. |
| Consola | Sin errores React/GSAP, ni errores inesperados de carga; no silenciar consola. Investigar avisos antes de filtrarlos. |
| Rendimiento | CLS atribuible al objeto = 0; objetivo sin tareas >50 ms durante scrub tras cargar. Medir por separado de tracing/screenshots, repetir 3 veces y guardar también resultados malos. |

Separar tests funcionales con capturas y benchmark sin tracing automático: H1 detectó stalls `ReadPixels` con capturas. Playwright exige configurar `trace` por archivo/proyecto, no dentro de describe. Si se necesitan dos políticas, un archivo de rendimiento separado es válido. No usar sleeps largos: esperar estado/DOM y una tolerancia de scrub definida.

Checks al finalizar implementación: `npm run build`, `npm test`, `npm run test:e2e`, ESLint de archivos nuevos/modificados y `npm run lint` global. H1 dejó documentados 270 errores/2 warnings previos del lint global; volver a comprobar y diferenciar deuda previa de regresiones, sin arreglar otras secciones dentro de O2. No añadir pruebas que solo repitan constantes; usar la función de pose solo si aporta garantías sobre independencia del historial/dirección.

## 10. Secuencia de trabajo y condiciones de cierre

1. Leer este plan + PROGRESS, confirmar que se ha solicitado implementar y revisar cambios de código desde hoy. Crear ART-O2-PROGRESS antes de editar aplicación.
2. Capturar baseline de About y medir hueco real por tamaños/idiomas; registrar si la caja 300×200 cabe sin cambios de layout.
3. Montar estático SVG/estudio de tres poses CSS; revisar fidelidad de materiales, cruce y cantos. **No continuar acumulando animación sobre una solución visual fallida.**
4. Añadir medición/capacidades y comprobar layout; solo después integrar scrub local reversible.
5. Añadir énfasis hover/foco y, si aporta, idle; verificar pausa, cleanup, anclas y fuentes.
6. Ejecutar matriz Playwright, inspeccionar capturas manualmente, medir rendimiento y bundle. Registrar diferencias con concept art.
7. Actualizar ART-O2-PROGRESS y PROGRESS con lo realmente probado. No marcar O2 completo solo porque existan archivos o pase un test de presencia. No hacer commits sin instrucción nueva explícita.

### Decisiones propuestas, todavía no implementadas

- CSS 3D primero, sujeto a revisión visual; Three instalado es alternativa, no cambio automático.
- Scrub local de tres fases, sin pin/sticky; no sincronización invisible hasta el final de Composición.
- Tablet SVG condicionado al espacio; móvil oculto para no desplazar contenido.
- Hover/foco en pills, sin cursor de iluminación ni nueva navegación.
- Assets vectoriales nativos; no generar nuevas imágenes hasta justificar su necesidad.

No se solicita aprobación en esta sesión: se entrega el plan completo para revisión. Reanudar leyendo estas decisiones y el estado general; cualquier petición futura de implementación debe resolver las discrepancias si el usuario prefiere otra fidelidad, visibilidad móvil o rango de scroll.
