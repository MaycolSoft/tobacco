# 02 — Conceptos 3D (Agente B · 3D Creative Researcher / Art Director)

> **Referencia histórica de exploración (19/10/2026).** H1/O2/L1/ART-C1 se implementaron después; tecnología, cifras y tareas de este documento describen aquella fase. Consultar [estado vigente](PROGRESS.md) y [pendientes del proyecto](../STATUS.md). Los encargos y restricciones de sesiones anteriores no son instrucciones actuales.

> Fecha: 2026-10-19 · Repositorio `tobacco` (`main`, commit `0451152`). Documento solo de exploración: no se modificó código ni se instaló nada.
> Base: `docs/TOBACCO_PROJECT_AUDIT.md` (§6, §7.11, §12 Nivel 3, §13, §14), código verificado y capturas de `design-review/desktop/` (perfil visual **Black**, 1440 px). La carpeta `docs/3d-exploration/screenshots/` no existía al redactar este documento: todas las observaciones visuales salen de `design-review`.

## Progreso

- [x] Lectura de contexto (auditoría, capturas, código)
- [x] Skills disponibles
- [x] Conceptos (10: 8 propuestos + 1 a reservar + 1 no recomendado)
- [x] Ideas descartadas
- [x] Lista de assets
- [x] Ranking preliminar

---

## 0. Punto de partida (lo que se ve y lo que hay en el código)

**Lo que se ve en las capturas**
- **Home** (`inicio.png`): el hero es una foto de una plantación con un cigarro anillado ("TAMBORILERO") en primer plano. Le sigue un texto partido en dos columnas, las tres tarjetas "Tres momentos" con borde fino, la sección "El arte de combinar", que muestra **una sola hoja curada recortada sobre negro** (`/img/about.png`, pie "Materia · Proporción · Oficio"), y el CTA final sobre una foto oscura de manos con hojas.
- **Ficha de hoja** (`hoja-detalle.png`): la hoja recortada (con canal alfa) está inscrita en un **círculo de línea fina**, con mucho aire negro alrededor y la información técnica a la derecha.
- **Mesa de composición** (`crea-tu-cigarro-mezcla.png`): una cuadrícula de tarjetas de hoja en 4 columnas, el stepper 01–04 y el panel lateral "Tu mezcla". Las hojas seleccionadas se ven atenuadas y llevan el sello "En tu mezcla".
- **Tu cigarro** (`tu-cigarro.png`): la composición se muestra solo como texto (Capa/Capote/Tripa en una `<dl>`) junto al perfil de 3 ejes, cuyos puntos aparecen vacíos ("Perfil en preparación"). Es el **único momento del recorrido sin ninguna imagen**, justo antes del clímax.
- **Guía** (`guia-mezcla.png`): el "corte transversal · esquema ilustrativo" se dibuja con 3 círculos concéntricos planos (Capa/Capote/Tripa) que funcionan como botones.

**Lo que hay en el código**
- `src/components/TobaccoGuidePage.jsx`: los anillos `.tg-ring-*` son `<button aria-pressed>` y se estilizan en `src/styles/tobacco-guide-page.css:32-40`.
- `src/components/CigarResult.jsx`: lee `selections` de `useBlendStore`; tiene acceso a las hojas elegidas (con `thumbImg` y `fullImg`).
- `src/data/leaves.js`: hay 21 hojas. Las `thumbs` son WebP **con alfa** (~400×825, **828 KB en total**) y las `full` son PNG con alfa de 1939×4000.
- `src/components/leaf-library/ImmersiveView.jsx`: tiene 4 capítulos. El capítulo 02 "Forma" habla de "silueta, nervadura, textura" y lleva un punto en `x:48 y:44`. Ya respeta `prefers-reduced-motion`.
- `src/components/MixingAnimation.jsx` (huérfano): son 4 hojas SVG **verdes (`#5FA14A`)** que giran sobre los 3 ejes sin parar, sobre un fondo `rgba(10,10,10,.92)`. Choca con la paleta y con la identidad (ver Descartadas).
- Dependencias: `gsap ^3.13` y `framer-motion ^12` están instaladas. **No** están instalados three, R3F, Zdog ni vanilla-tilt.

**Reglas de dirección de arte para todo el documento**
1. Paleta cerrada: bg `#0F0E0C`, card `#171512`, surface `#211E19`, bronce `#C7A479`, marfil `#F1ECE3`, beige del video `#D6C8B9`. El color de las hojas sale **de las fotos reales**, nunca de colores inventados.
2. Materiales naturales: hoja curada, papel, madera mate y luz rasante. **No** se usa humo, brasa, ceniza ni gestos de consumo.
3. No se toca nada dentro de `#video-root`, salvo DOM o SVG ligeros (§7.11). Todo canvas WebGL se desmonta antes de abrir el overlay y se carga con `import()` dinámico.
4. El 3D lee los tokens con `getComputedStyle` para respetar los 7 perfiles visuales (§14).

---

## 1. Skills disponibles

| Skill | ¿Instalada / invocable? | Qué cubre | Relevancia para TOBACCO | Conceptos que la usarían |
|---|---|---|---|---|
| `gsap-scrolltrigger` | **Sí**, instalada (`~/.claude/plugins/cache/.../gsap-scrolltrigger/1.0.0`) e invocable | Tweens, timelines, ScrollTrigger (scrub, pin), `useGSAP`, limpieza con `kill()`, integración con Three.js y secuencias de imágenes | **Alta**: GSAP ya es una dependencia y mueve el motor de frames. Es la opción natural para coreografías por scroll fuera del overlay. Ojo con el `scroller: "#video-root"` frente a `window` | A2, C1 (fase de scroll), C3, D2 |
| `lightweight-3d-effects` | **Sí**, instalada e invocable | Zdog (pseudo-3D vectorial), Vanta.js (fondos 3D animados), Vanilla-Tilt (tilt parallax) | **Media**: el tilt y Zdog son útiles y baratos. Vanta, en cambio, da fondos genéricos ("fog", "waves") ajenos a la identidad | B1 (patrón tilt), C3 (alternativa con Zdog) |
| `react-three-fiber` | **No** instalada (está en el marketplace `.factory/skills/`). No se puede invocar sin instalarla | Escenas Three.js declarativas en React: `Canvas`, `frameloop="demand"`, `useFrame`, drei (`Html`, `Center`, `useGLTF`) | **Alta para 1–2 piezas**: encaja con el modelo de componentes de React 19 (R3F v9) | C1, A1 |
| `threejs-webgl` | No instalada (marketplace) | Three.js imperativo: materiales, luces, raycasting, `dispose`, optimización de texturas | Media: es la referencia de fondo para R3F (dispose, texturas, DPR) | C1, A1, D1 (variante WebGL) |
| `web3d-integration-patterns` | No instalada (marketplace) | Arquitectura de varias librerías (R3F + GSAP + Zustand), evitar conflictos de animación y fugas de memoria | **Alta como guía de arquitectura**: el proyecto ya mezcla GSAP y framer y usa Zustand (`useBlendStore`) | C1 (sincronizar la mezcla con el 3D), A1 |
| `spline-interactive` | No instalada (marketplace) | Editor visual 3D sin código, runtime `@splinetool/react-spline` | **Baja**: runtime >500 KB, difícil de tematizar con `--ls-*` y la escena queda fuera del control del código (auditoría §14) | Solo D3 (no recomendado) |
| `substance-3d-texturing` | No instalada (marketplace) | Flujo PBR en Substance Painter y exportación de texturas para glTF | Baja-media: solo si se modela un GLB propio. Para hojas basta con derivar normal/height de las fotos existentes | C1 (variante con GLB), A1 (texturas opcionales) |
| `blender-web-pipeline` (extra, marketplace) | No instalada | Exportación glTF desde Blender, compresión y baking | Baja: solo si C1 evoluciona a un modelo esculpido | C1 (variante GLB) |
| `motion-framer` (extra, marketplace; framer-motion ya está en deps) | No instalada como skill, pero la librería sí | `layoutId`, `AnimatePresence`, transforms 3D de CSS | **Alta** para microinteracciones dentro de la mesa | B2, D2 |

Repositorio de referencia: `freshtechbro/claudedesignskills` (el directorio del marketplace parece ser su clon; no se consultó en línea).

---

## 2. Conceptos

Leyenda de categorías: **A** objetos orgánicos · **B** interactivos · **C** relacionados con el proyecto · **D** otros (pseudo-3D, shaders, profundidad).

### C1 — "Anatomía de tu cigarro" (corte explotado en el paso 04)
**Categoría:** C · **Clasificación:** 3D educativo (+ Mejora UX)

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | Anatomía de tu cigarro |
| 2 | Descripción visual | Un cilindro de proporciones de cigarro, sin anilla ni marca, con la punta en corte limpio y visto en 3/4 sobre negro. Al entrar, sus tres capas se **separan axialmente** como un despiece técnico: la **capa** es una envoltura fina en espiral, el **capote** una envoltura interior y la **tripa** son 2–5 "haces" de hoja plegada, uno por cada hoja que eligió el usuario. Cada capa toma su color de la miniatura real de la hoja elegida. Una línea de cota en bronce de 1 px une cada capa con su etiqueta. Luz cálida lateral (rasante) y sombra de contacto suave. |
| 3 | Página y ubicación | `/craft-your-cigar`, paso 04 → `src/components/CigarResult.jsx`, nueva columna visual dentro de `.craft-result__grid` (o franja encima de ella, entre `.craft-result__intro` y la grid). La `<dl>` y el perfil **se mantienen**. |
| 4 | Objeto | Cigarro sin encender, en despiece (3 capas + haces de tripa). |
| 5 | Colores y materiales | Fondo transparente sobre card `#171512`. Capas con `MeshStandardMaterial` mate (roughness 0.85) y `map` = thumb de la hoja elegida, o color medio muestreado de esa thumb. Cotas y etiquetas en bronce `#C7A479`; texto en marfil `#F1ECE3`. Luz cálida (≈3200 K) con un rim tenue en bronce. Sin brillo especular plástico. |
| 6 | Movimiento | Entrada: despiece de unos 1,2 s (ease `power3.out`) y después quietud. Rotación lenta solo mientras el usuario interactúa. Sin bucle infinito. |
| 7 | Hover / cursor / clic / scroll | Hover sobre una fila de la `<dl>` (Capa/Capote/Tripa): esa capa se adelanta y las demás bajan al 40 % de opacidad. Arrastre: rotación limitada (±35°) en el eje longitudinal. Clic en una capa: se enfoca su fila de la `<dl>`. Scroll: ninguno, para no competir con el scroll del overlay que llega después. |
| 8 | Relación con el contenido | Representa **exactamente** lo que el usuario acaba de componer: el número de haces de tripa = número de hojas de tripa, y el color = la hoja real. Es la versión visual de la frase "4 hojas reunidas de fuera hacia dentro". |
| 9 | Aporte UX / storytelling | Llena el único paso sin imagen (ver §0) y *anuncia* la secuencia de frames: "esto es lo que vas a ver cobrar forma". Refuerza la personalización aunque la secuencia todavía no dependa de la mezcla (hallazgo §5 de la auditoría). |
| 10 | Tecnología | R3F + drei (`Html` para etiquetas accesibles opcionales), `frameloop="demand"`, DPR `[1, 1.5]`, `import()` dinámico al llegar al paso 04, geometría procedural (`CylinderGeometry`, `TubeGeometry` para la espiral). Desmontaje garantizado al abrir el overlay (ya ocurre con `!showVideo`). |
| 11 | Dificultad | Media-alta. |
| 12 | Impacto en rendimiento | Medio: ~+190 KB gz (three + R3F + parte de drei) solo en esa ruta. GPU baja con render a demanda. Las texturas son las thumbs, que ya están en caché. |
| 13 | Móvil | Debajo de la `<dl>`, con altura de 240–280 px y sin arrastre (solo tap en una capa). Con `hover: none`, la `<dl>` controla la capa activa. Si `navigator.hardwareConcurrency <= 4` o falla WebGL: fallback C2/SVG. |
| 14 | Alternativa sin movimiento | Imagen estática del despiece ya abierto (render del mismo canvas o SVG de C2) con las tres etiquetas. Las filas de la `<dl>` siguen resaltando la capa sin animación. |
| 15 | Skill | `react-three-fiber` + `web3d-integration-patterns` (sincronizar con Zustand) + `gsap-scrolltrigger` (timeline de despiece). |
| 16 | Recursos | **Procedural** (geometría paramétrica) + reutiliza `public/assets/thumbs/*.webp` como textura. Opcional: `TEX-WRAP-01`, una textura tileable de hoja de capa (venas finas) para que la espiral no estire la thumb. **No requiere GLB**. Variante premium opcional `GLB-CIGAR-01` (ver Assets). |

### C2 — "Corte transversal en relieve" (evolución del esquema de la guía)
**Categoría:** C / D (pseudo-3D CSS) · **Clasificación:** 3D educativo (barato)

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | Corte transversal en relieve |
| 2 | Descripción visual | Los 3 anillos actuales de `.tg-cross-section` se convierten en **3 discos apilados** vistos primero de frente (idénticos a hoy) que, al entrar en el viewport, se inclinan a una vista isométrica (rotateX ≈ 58°). Cada disco gana un canto visible (2–4 px de "grosor" con `box-shadow` en capas) y se separa en Z. Al pulsar una capa, esa capa sube y las otras bajan. Es un diagrama técnico y no una ilustración realista. |
| 3 | Página y ubicación | `TobaccoGuidePage` → `src/components/TobaccoGuidePage.jsx`, `.tg-anatomy > .tg-cross-section`. Estilos en `src/styles/tobacco-guide-page.css:32-40`. Mismo sitio y mismos botones. |
| 4 | Objeto | Sección del cigarro (anillos concéntricos). |
| 5 | Colores y materiales | Capa `#171512`, capote `#211E19`, tripa `#0F0E0C` (como hoy), borde `--ls-gold-border`. La capa activa usa el bronce `#C7A479` al 14 % (estilo actual `.is-active`). Cantos con sombra cálida `color-mix(#C7A479 10%, #0F0E0C)`. Opcional: textura de fibra en la cara de la tripa (`TEX-FILLER-01`). |
| 6 | Movimiento | Una sola vez al entrar (600 ms). En la selección, traslación Z de 12–24 px en 300 ms. |
| 7 | Hover / cursor / clic / scroll | Hover: la capa se eleva 6 px. Clic o teclado: se mantiene `aria-pressed` y la capa activa queda elevada. Scroll: dispara la inclinación una vez (IntersectionObserver o ScrollTrigger con `scroller` = `.tg-scroll`). |
| 8 | Relación con el contenido | El título de la sección es "De dentro hacia fuera". El relieve hace visible el *orden físico* de las capas que el texto describe. |
| 9 | Aporte UX / storytelling | Convierte un esquema plano en uno que se lee como un objeto. Mantiene los botones accesibles existentes. Sirve también de **fallback de C1**. |
| 10 | Tecnología | CSS `perspective` + `transform-style: preserve-3d` + transiciones. JS solo para el disparo de entrada. Sin dependencias nuevas. |
| 11 | Dificultad | Baja. |
| 12 | Impacto en rendimiento | Muy bajo (transform y opacity en la GPU del compositor). |
| 13 | Móvil | Funciona igual (250 px, regla existente en la línea 100). La inclinación se reduce a 45° para que la etiqueta "Capa" no se corte. |
| 14 | Alternativa sin movimiento | Con `prefers-reduced-motion`, el esquema actual de frente, sin cambios. |
| 15 | Skill | `gsap-scrolltrigger` (opcional, para el disparo). Basta con CSS. |
| 16 | Recursos | **Procedural (CSS)**. Opcional: `TEX-FILLER-01`, imagen 2D de la sección de la tripa (fibras plegadas). |

### A1 — "Hoja en vilo" (hoja con curvatura real en la ficha)
**Categoría:** A · **Clasificación:** 3D decorativo con valor educativo

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | Hoja en vilo |
| 2 | Descripción visual | La hoja recortada que hoy está plana dentro del círculo fino de la ficha se convierte en una **malla flexible** (plano subdividido con la thumb/full y su alfa) que tiene una curvatura natural: el nervio central como eje, los bordes levemente ondulados y una caída hacia la punta. La luz cálida lateral revela el relieve. El círculo de línea sigue siendo el "marco de espécimen". |
| 3 | Página y ubicación | `/leaf-library`, overlay de ficha, pestaña "La hoja" → `src/components/leaf-library/TechnicalSheet.jsx`, `figure.ts-image-side`. |
| 4 | Objeto | Hoja de tabaco curada (una por ficha, 21 posibles). |
| 5 | Colores y materiales | Fondo `#0F0E0C`/transparente. Material mate con `map` = foto real, `alphaMap` = su alfa y `normalMap` derivado (`TEX-LEAF-NRM-xx`) o procedural (venas por shader). Luz cálida + rim bronce `#C7A479` muy tenue. Círculo existente en `--ls-gold-border`. |
| 6 | Movimiento | "Respiración" muy lenta de la curvatura (±2°, período de 8 s) **solo** mientras la ficha está visible. Se detiene al pasar de hoja. |
| 7 | Hover / cursor / clic / scroll | El cursor desplaza la luz (no la hoja), así que se ve la textura sin mareo. Arrastre: giro limitado a ±25° para ver el reverso. Clic: nada (lo ocupan "Añadir a mi mezcla" y "Explorar la hoja"). |
| 8 | Relación con el contenido | La ficha habla de origen, textura y función. La curvatura y la luz muestran la *materialidad* que el texto describe. |
| 9 | Aporte UX / storytelling | Tactilidad de la materia prima, la promesa del hero ("El carácter comienza en la hoja"). Es secundaria frente a C1. |
| 10 | Tecnología | R3F (`planeGeometry` 32×64 + deformación en el vertex shader o `onBeforeCompile`), `frameloop="demand"` con invalidación al mover el cursor. Mismo chunk dinámico que C1. |
| 11 | Dificultad | Media. |
| 12 | Impacto en rendimiento | Medio: hay 21 texturas posibles, pero solo 1 activa. Usar la thumb (400 px) por defecto y la full (1939×4000, hasta 8 MB) **nunca** como textura WebGL. |
| 13 | Móvil | Sin arrastre. Con `DeviceOrientation`, solo si el usuario lo permite. En la mayoría de casos, imagen estática: el beneficio no compensa el coste de batería. |
| 14 | Alternativa sin movimiento | La `<img>` actual tal cual. |
| 15 | Skill | `react-three-fiber`, `threejs-webgl` (texturas y dispose). |
| 16 | Recursos | Texturas: thumbs existentes + `TEX-LEAF-NRM-xx` (normal/height map 2D por hoja, derivable de la foto). **No requiere GLB**: la geometría es un plano deformado de forma procedural. |

### A2 — "Tres hojas en profundidad" (el despiece editorial de la Home)
**Categoría:** A / D (pseudo-3D) · **Clasificación:** Animación GSAP

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | Tres hojas en profundidad |
| 2 | Descripción visual | Dentro del **mismo marco** de la imagen de "El arte de combinar" (fondo negro, hoja recortada y pie "Materia · Proporción · Oficio"), la hoja única se desdobla al hacer scroll en **tres hojas recortadas superpuestas en Z**: tripa al fondo, capote en el medio y capa al frente. Están ligeramente desplazadas como en una mesa de selección y cada una lleva un micro-rótulo en bronce. La composición final es una imagen fija y no queda en bucle. |
| 3 | Página y ubicación | `/` → `src/pages/Home.jsx`, `.site-feature__image` (sección "El arte de combinar"). Se mantiene el layout y el copy. |
| 4 | Objeto | Tres hojas curadas (capa, capote y tripa) de la colección real. |
| 5 | Colores y materiales | Las fotos recortadas reales (thumbs o versiones de 800 px). Sombras proyectadas `rgba(0,0,0,.6)` sobre `#0F0E0C`. Rótulos de 10 px en `#C7A479` con tracking `.19em` (kicker existente). |
| 6 | Movimiento | ScrollTrigger con `scrub` en un tramo corto (unos 40 vh). Las hojas se separan en Z y en X/Y con ligera rotación (±4°). |
| 7 | Hover / cursor / clic / scroll | Scroll: despliega o pliega. Hover: parallax mínimo (6 px) por capa. Clic: ninguno; el CTA "Ver cómo se compone" sigue siendo la acción. |
| 8 | Relación con el contenido | El texto vecino dice literalmente "La capa presenta, el capote sostiene y la tripa construye el corazón de la mezcla". La imagen lo ilustra. |
| 9 | Aporte UX / storytelling | Introduce el vocabulario de la mesa (tripa, capote y capa) antes de que el usuario llegue a ella. Da ritmo a una Home hoy estática (auditoría 2.3). |
| 10 | Tecnología | CSS 3D (`perspective`, `translateZ`) + GSAP ScrollTrigger (`scroller: window`) con `useGSAP` y limpieza al desmontar. |
| 11 | Dificultad | Baja-media. |
| 12 | Impacto en rendimiento | Bajo: 3 imágenes ligeras más, solo transforms. |
| 13 | Móvil | Desplegado en estático (sin scrub) y apilado con un leve offset. Las 3 imágenes en `loading="lazy"`. |
| 14 | Alternativa sin movimiento | La composición final de tres hojas en un estado fijo, o la imagen actual `about.png`. |
| 15 | Skill | `gsap-scrolltrigger`. |
| 16 | Recursos | Imágenes 2D: se pueden reutilizar las thumbs (con alfa). Para nitidez a 2× se pide `IMG-LEAF-TRIO-01`, 3 recortes de 800 px con alfa (capa/capote/tripa) en el mismo encuadre y luz. **No requiere GLB**. |

### B1 — "Tilt de materia" (tarjetas de hoja con profundidad)
**Categoría:** B / D (pseudo-3D CSS) · **Clasificación:** Microinteracción

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | Tilt de materia |
| 2 | Descripción visual | Al pasar el cursor por una tarjeta de hoja, la tarjeta se inclina ≤4° hacia el puntero. La **hoja recortada flota unos px por delante** del fondo de la tarjeta (`translateZ`) y un brillo cálido muy difuso (gradiente radial bronce al 6 %) sigue al cursor, como una lámpara de mesa sobre la hoja. El borde fino se mantiene. |
| 3 | Página y ubicación | `/craft-your-cigar` → `src/components/LeafGrid.jsx` (tarjetas de la cuadrícula) y `/leaf-library` (tarjetas de la biblioteca). |
| 4 | Objeto | Tarjeta + hoja recortada. |
| 5 | Colores y materiales | Tarjeta `#171512`, brillo `color-mix(#C7A479 6%, transparent)`, sombra de la hoja `rgba(0,0,0,.55)`. |
| 6 | Movimiento | Interpolación suave (lerp en `requestAnimationFrame` o `transition: transform .25s`). Vuelve a 0° al salir. |
| 7 | Hover / cursor / clic / scroll | Hover y cursor: tilt + luz. Clic: un "press" de −2 px en Z que confirma la selección (convive con el `whileTap` de framer: aplicar el tilt a un wrapper interior para no pisar transforms). Scroll: ninguno. |
| 8 | Relación con el contenido | La hoja es la protagonista: el gesto de "inclinar para mirar" imita examinar una hoja a contraluz. |
| 9 | Aporte UX / storytelling | Feedback táctil premium en la zona más usada de la mesa, sin cambiar el layout aprobado. |
| 10 | Tecnología | CSS 3D + ~30 líneas de JS (o Vanilla-Tilt 3 KB gz). Sin WebGL. |
| 11 | Dificultad | Baja. |
| 12 | Impacto en rendimiento | Muy bajo. Usar un solo listener por cuadrícula (delegación) y `will-change` solo en hover. |
| 13 | Móvil | Desactivado con `(hover: none)`. Sin giroscopio. |
| 14 | Alternativa sin movimiento | Hover actual (borde y estado) sin tilt. |
| 15 | Skill | `lightweight-3d-effects` (patrón Vanilla-Tilt / "Tilt Card Gallery"). |
| 16 | Recursos | **Procedural (CSS)**, reutiliza las thumbs. |

### B2 — "La hoja viaja a tu mezcla"
**Categoría:** B · **Clasificación:** Microinteracción (+ Mejora UX)

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | La hoja viaja a tu mezcla |
| 2 | Descripción visual | Al seleccionar una hoja, una copia de su recorte **se despega de la tarjeta, gira sobre su nervio** (rotateY 0→160°, mostrando un dorso más oscuro) y describe un arco hasta su fila en el panel "Tu mezcla" (Tripa/Capote/Capa), donde se "posa" y se vuelve el check actual. |
| 3 | Página y ubicación | `/craft-your-cigar` → de `src/components/LeafGrid.jsx` a `src/components/BlendSummary.jsx`. |
| 4 | Objeto | Hoja recortada (el sprite de la thumb). |
| 5 | Colores y materiales | La foto real. Dorso = misma imagen con `filter: brightness(.55) sepia(.2)`. La estela no existe: es un objeto físico, no partículas. |
| 6 | Movimiento | 550–700 ms, curva física (spring de framer). Un solo vuelo por selección. |
| 7 | Hover / cursor / clic / scroll | Clic: dispara el vuelo. Quitar una hoja (✕ en el resumen) hace el vuelo inverso. |
| 8 | Relación con el contenido | Materializa la acción "Añadir a mi mezcla": la mezcla se *construye* con hojas, no con checks. |
| 9 | Aporte UX / storytelling | Relaciona causa y efecto entre la cuadrícula y el resumen (en desktop, el panel está a la derecha y fuera del foco visual). Es la idea 2.5 de la auditoría, ahora con profundidad. |
| 10 | Tecnología | framer-motion (`layoutId` o un portal con `animate` sobre coordenadas medidas) + CSS `perspective`. Sin dependencias nuevas. |
| 11 | Dificultad | Media (medir rectángulos y gestionar el scroll). |
| 12 | Impacto en rendimiento | Bajo. |
| 13 | Móvil | En móvil el resumen no está al lado. Vuelo corto hacia el contador o la barra inferior, o un simple "pulso" en el contador. |
| 14 | Alternativa sin movimiento | Cambio de estado inmediato + anuncio `aria-live` (que ya existe). |
| 15 | Skill | `motion-framer` (marketplace; la librería ya está instalada). Sin skill instalada específica. |
| 16 | Recursos | **Procedural**: reutiliza las thumbs. |

### C3 — "Espiral de capa · dibujo técnico" (puente hacia la secuencia)
**Categoría:** C / D (SVG pseudo-3D) · **Clasificación:** Animación GSAP (+ Mejora UX)

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | Espiral de capa |
| 2 | Descripción visual | Al pulsar "Ver cómo cobra forma", el botón se expande a pantalla completa en beige `#D6C8B9` (auditoría 2.4). Sobre ese beige, un **dibujo lineal** en tinta tierra traza en 1–1,5 s la hélice de la capa envolviendo un cilindro, con las líneas traseras al 30 % de opacidad para dar volumen, como un plano de taller. Cuando llega el primer frame, el dibujo se funde con él. |
| 3 | Página y ubicación | `/craft-your-cigar` → transición entre `CigarResult` (`onStart`) y el montaje de `ScrollVideo` en `src/pages/CraftYourCigar.jsx`, y/o como contenido del loader. **Solo DOM/SVG** dentro o encima de `#video-root` (permitido por §7.11), sin canvas extra. |
| 4 | Objeto | Representación de líneas del cigarro y la espiral de su capa. |
| 5 | Colores y materiales | Fondo `#D6C8B9`, trazo `color-mix(#0F0E0C 75%, #C7A479)` de 1,25 px, acentos en bronce `#C7A479`. Aspecto de papel o lámina técnica. |
| 6 | Movimiento | `stroke-dashoffset` con GSAP timeline. Luego, fundido cruzado. Si la carga tarda, el dibujo queda quieto (no hay bucle ansioso). |
| 7 | Hover / cursor / clic / scroll | Clic de origen. Ninguna otra interacción. Saltable de inmediato en cuanto el frame 1 está listo. |
| 8 | Relación con el contenido | Explica en un gesto lo que va a ocurrir: la capa envuelve el conjunto. Da continuidad visual mesa → secuencia (ambas en papel o beige). |
| 9 | Aporte UX / storytelling | Convierte la espera de decodificación (~143 ms por bitmap más el primer lote) en narrativa en lugar de un spinner. Suaviza el corte brusco documentado. |
| 10 | Tecnología | SVG inline (hélice precalculada como `path`, proyección isométrica hecha en JS una vez) + GSAP. Alternativa: Zdog (dibujo 3D vectorial), descartada en el overlay por usar canvas. |
| 11 | Dificultad | Baja-media. |
| 12 | Impacto en rendimiento | Muy bajo: un único SVG de pocos KB y sin GPU dedicada. No compite con la decodificación porque la animación de trazo se ejecuta en el compositor o con mínimo JS. Verificarlo con un perfil. |
| 13 | Móvil | Idéntico, escalado con `viewBox`. |
| 14 | Alternativa sin movimiento | El dibujo completo estático, que se funde al primer frame. |
| 15 | Skill | `gsap-scrolltrigger` (timeline, no scroll). |
| 16 | Recursos | **Procedural (SVG)**. Opcional: `IMG-PAPER-01`, una textura de papel de 512 px en beige, muy sutil, como fondo. |

### D1 — "Luz rasante sobre la nervadura"
**Categoría:** D (relighting 2.5D, SVG/shader) · **Clasificación:** Microinteracción / 3D educativo

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | Luz rasante |
| 2 | Descripción visual | En el capítulo 02 "Forma" (silueta, nervadura, textura), la foto de la hoja se oscurece al 60 % y una **luz rasante virtual** recorre la hoja de un borde al otro, revelando venas y arrugas como en una mesa de inspección. El cursor (o el punto del capítulo) controla la dirección de la luz. No se mueve la geometría: solo la luz. |
| 3 | Página y ubicación | `/leaf-library` → `src/components/leaf-library/ImmersiveView.jsx`, `.th-leaf-frame`, solo en el capítulo `step === 1`. |
| 4 | Objeto | Superficie de la hoja (iluminación). |
| 5 | Colores y materiales | Luz de color `#F1ECE3` cálido, sombras hacia `#0F0E0C`. Ningún color nuevo. |
| 6 | Movimiento | Barrido automático de unos 4 s al entrar en el capítulo (dentro de los 9 s del autoplay). Luego queda bajo control del cursor. |
| 7 | Hover / cursor / clic / scroll | Cursor = posición de la luz. Scroll o rueda: se mantiene la navegación de capítulos existente. Táctil: arrastre de un dedo mueve la luz, sin conflicto con el swipe horizontal (que exige `dx > 55` dominante): usar arrastre vertical o un toque. |
| 8 | Relación con el contenido | El texto del capítulo pide "observa su silueta, la nervadura central y las variaciones". La luz *dirige la mirada* a eso. |
| 9 | Aporte UX / storytelling | Da sentido al capítulo "Forma", que hoy es solo un punto sobre la imagen. Es educativo: enseña a mirar una hoja. |
| 10 | Tecnología | Opción barata: SVG `feDiffuseLighting` + `feSpinLight`/`feDistantLight` sobre un height map (`TEX-LEAF-HGT-xx`) a tamaño thumb. Opción rica: shader de fragmento (WebGL) con normal map. Recomendado empezar por **máscara CSS** (gradiente radial `mix-blend-mode: soft-light` sobre la foto) como prototipo. |
| 11 | Dificultad | Media (por los height maps). Baja en la versión con máscara CSS. |
| 12 | Impacto en rendimiento | SVG filter sobre una imagen grande: **CPU alto**. Limitarlo a ≤800 px y solo durante el capítulo. CSS mask: muy bajo. WebGL: medio. |
| 13 | Móvil | Barrido automático único, sin control táctil. |
| 14 | Alternativa sin movimiento | Una imagen fija con la luz rasante ya aplicada (estado final), y el resto del capítulo igual. |
| 15 | Skill | `threejs-webgl` (solo si se hace con shader). Ninguna para la versión CSS/SVG. |
| 16 | Recursos | Texturas 2D: `TEX-LEAF-HGT-xx` (height/normal map por hoja con inmersivo; hoy solo 2 tienen `hasInmersive: true`: capa Habana y capa Pensilvania). Se pueden derivar de las PNG full por proceso (no se necesita generación con IA). **No requiere GLB**. |

### D2 — "Profundidad de pasos" (de dentro hacia fuera)
**Categoría:** D (transición de profundidad) · **Clasificación:** Mejora UX / Animación

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | Profundidad de pasos |
| 2 | Descripción visual | Al avanzar Tripa → Capote → Capa, la cuadrícula de hojas del paso anterior **retrocede en Z** (scale .96, blur 2 px, opacidad 0) y la siguiente entra desde "fuera" (scale 1.03 → 1). Es la metáfora física de ir envolviendo de dentro hacia fuera. Sin objetos nuevos. |
| 3 | Página y ubicación | `/craft-your-cigar` → `src/components/LeafGrid.jsx` (cambio de `step`), sin tocar el stepper ni el layout. |
| 4 | Objeto | La cuadrícula de tarjetas (capa de interfaz). |
| 5 | Colores y materiales | Los existentes. Sin color añadido. |
| 6 | Movimiento | 350–450 ms, ease-out. Una vez por cambio de paso. |
| 7 | Hover / cursor / clic / scroll | Clic en "Continuar a capote" o en el stepper. Al volver atrás, la dirección se invierte. |
| 8 | Relación con el contenido | Las capas del cigarro se construyen de dentro hacia fuera; la UI repite el mismo orden espacial. |
| 9 | Aporte UX / storytelling | Orientación: hace perceptible el cambio de paso, que hoy es un re-render seco. Coherente con la guía ("De dentro hacia fuera"). |
| 10 | Tecnología | framer-motion `AnimatePresence` (ya usado con `layout` y stagger en LeafGrid) + `MotionConfig reducedMotion="user"` (deuda 1.7). |
| 11 | Dificultad | Baja. |
| 12 | Impacto en rendimiento | Muy bajo. Evitar `blur` en móviles de gama baja. |
| 13 | Móvil | Solo opacidad + scale, sin blur. |
| 14 | Alternativa sin movimiento | Corte directo (comportamiento actual) + foco en el título del paso. |
| 15 | Skill | `motion-framer` (marketplace) o ninguna. |
| 16 | Recursos | **Procedural**. |

### D3 — "Cigarro 3D héroe con humo" (NO RECOMENDADO)
**Categoría:** D · **Clasificación:** 3D decorativo — **en contra**

| # | Campo | Detalle |
|---|---|---|
| 1 | Nombre | Cigarro héroe giratorio |
| 2 | Descripción visual | Un modelo realista de cigarro con anilla, girando en el hero de la Home, con humo volumétrico (Vanta "fog" o partículas) y reflejos dorados. Es el tipo de 3D "producto flotante" típico de las landings. |
| 3 | Página y ubicación | `/` → `src/pages/Home.jsx`, `.site-hero`, sobre o en lugar de `/img/carousel-1.jpg`. |
| 4 | Objeto | Cigarro anillado + humo. |
| 5 | Colores y materiales | PBR brillante y anilla metálica dorada. Inevitablemente se sale de la sobriedad mate de la paleta. |
| 6 | Movimiento | Rotación continua + humo en bucle. |
| 7 | Hover / cursor / clic / scroll | Giro con el cursor y zoom con el scroll. |
| 8 | Relación con el contenido | Débil. El hero dice "El carácter comienza **en la hoja**" y la pieza muestra el producto acabado. |
| 9 | Aporte UX / storytelling | Negativo: **el humo evoca consumo** (contrario a la regla del encargo y al aviso "Contenido dirigido a adultos"). Duplica y quita protagonismo al clímax real (la secuencia de frames). Rediseña una sección aprobada. Retrasa el LCP. |
| 10 | Tecnología | Spline o R3F + GLB + partículas. |
| 11 | Dificultad | Media-alta. |
| 12 | Impacto en rendimiento | **Alto**: runtime de Spline >500 KB o three + GLB de 1–3 MB en la primera carga, en el LCP de la ruta más visitada. Fuerte consumo de GPU en móvil. |
| 13 | Móvil | Malo: batería y calor. Exige fallback a la foto actual, con lo que el esfuerzo pierde sentido. |
| 14 | Alternativa sin movimiento | La foto actual, que ya funciona. |
| 15 | Skill | `spline-interactive` / `lightweight-3d-effects` (Vanta). |
| 16 | Recursos | `GLB-CIGAR-HERO` (no se pide). **No se incluye en la lista de assets.** |

---

## 3. Ideas descartadas o no recomendadas

| Idea | Motivo |
|---|---|
| **D3: cigarro héroe con humo** | Evoca consumo, compite con la secuencia de frames, rediseña el hero aprobado y penaliza el LCP (ver ficha). |
| **Cualquier WebGL dentro de `#video-root`** (partículas, 3D superpuesto a los frames, auditoría 3.5) | La decodificación ya supera el presupuesto por frame 4 veces (§7.9 y §7.11). Un segundo contexto GPU empeora los saltos. Solo se admite DOM o SVG (C3). |
| **Humo, brasa, ceniza o partículas de "ambiente fumador"** (auditoría 3.3) | Promueve el consumo. Si se quiere atmósfera, que sea polvo de hoja en luz rasante, y aun así no aporta información: queda aparcado. |
| **Reutilizar `MixingAnimation.jsx` tal cual** (auditoría 2.7) | Hojas SVG verdes `#5FA14A` (paleta ajena), giro caótico en 3 ejes en bucle infinito, texto en `white` hardcodeado, sin reduced motion. La idea de "esperar mezclando" queda mejor resuelta con C3. |
| **Fondos Vanta.js** (fog, waves, birds…) | Son estéticas genéricas reconocibles y de bajo valor narrativo. Además, cargan three.js para un fondo. |
| **Spline para cualquier pieza** | Runtime pesado, escena difícil de tematizar con los 7 perfiles visuales y fuera del control de versión del código (§14). |
| **Hojas 3D flotando en las tarjetas "Tres momentos" de la Home** | Sería 3D para rellenar: las tarjetas ya funcionan con un icono lineal y el contenido no gana nada. |
| **Biblioteca de hojas como galería 3D navegable (carrusel en anillo o "museo")** | Rediseña una sección aprobada, empeora la accesibilidad y el escaneo frente a la cuadrícula con filtros, y obligaría a cargar 21 texturas a la vez. |
| **Usar las PNG `full` (hasta 8 MB, 1939×4000) como texturas WebGL** | Memoria de GPU desproporcionada. Siempre thumbs o derivados ≤1024 px. |

---

## 4. Lista de assets requeridos

Distinción clave: **imagen/textura 2D** (fotografía o mapa plano) ≠ **modelo 3D GLB** (geometría). La mayoría de conceptos son procedurales o reutilizan `public/assets/thumbs/*.webp` (WebP con alfa, ~400×825).

| ID | Concepto | Tipo | Descripción / necesidad |
|---|---|---|---|
| `TEX-WRAP-01` | C1 | Textura 2D tileable | Superficie de hoja de **capa** curada, sin bordes ni nervio central dominante. Venas finas en diagonal y tono marrón medio (familia colorado). 1024×1024, que se repita sin costuras. Albedo neutro sin sombras horneadas (luz plana). Sirve para la espiral exterior; luego se tiñe con el color medio de la hoja elegida. |
| `TEX-FILLER-01` | C1, C2 | Imagen 2D (cara de corte) | Sección transversal de la **tripa**: hojas plegadas en acordeón vistas de frente en corte limpio, fibras marrones oscuras, sin anillo de capa visible, sobre fondo negro o alfa. Circular, 1024×1024, con alfa. Estilo de fotografía de producto técnica, luz rasante. |
| `TEX-LEAF-NRM-xx` | A1, (D1) | Textura 2D (normal map) | Normal map tangente por hoja (xx = id de hoja), **derivado de la foto existente** (por proceso, sin IA), en la misma resolución que la thumb. Como mínimo para las hojas con `hasInmersive: true`. |
| `TEX-LEAF-HGT-xx` | D1 | Textura 2D (height map, escala de grises) | Mapa de alturas por hoja: el nervio central y las venas en claro y la lámina en gris medio. Derivado por proceso de la foto `full` y reducido a ≤800 px. |
| `IMG-LEAF-TRIO-01` | A2 | 3 imágenes 2D con alfa | Tres hojas curadas recortadas: **capa** (lisa, uniforme, más clara), **capote** (intermedia) y **tripa** (más oscura y gruesa). Las tres con el mismo ángulo cenital, la misma luz cálida lateral y sin sombra proyectada (se añade por CSS). PNG/WebP de 800 px de alto. Coherentes con las fotos de la colección (pueden salir de la colección real en lugar de generarse). |
| `IMG-PAPER-01` | C3 | Textura 2D tileable | Papel de lámina técnica en beige `#D6C8B9`, con grano muy sutil y sin manchas ni texto. 512×512, que se repita sin costuras y con un contraste mínimo (que no se note como patrón). |
| `GLB-CIGAR-01` *(opcional, fase 2 de C1)* | C1 | **Modelo 3D GLB** | Cigarro **sin encender y sin anilla ni marca**, separado en 3 mallas nombradas: `capa` (envoltura helicoidal fina con la "cabeza" cerrada), `capote` (cilindro interior) y `tripa_00..04` (5 haces de hoja plegada, para ocultar los sobrantes según la mezcla). Pie cortado limpio. Escala real (~150 mm × 20 mm). Presupuesto ≤15 k triángulos en total, con UVs desplegadas para `TEX-WRAP-01`, sin texturas horneadas (se aplican en runtime) y con compresión Draco/meshopt ≤300 KB. Solo si la versión procedural se queda corta. |

Procedurales (sin assets): C2, B1, B2, D2, y C1 en su fase 1 (geometría paramétrica + thumbs).

---

## 5. Ranking preliminar

Escala 1–5 (5 = mejor; en *facilidad*, *rendimiento* y *mantenimiento*, 5 = más fácil, más ligero y más mantenible). D3 queda fuera del ranking.

| Concepto | Coherencia | Valor UX | Estética | Integración | Originalidad | Facilidad | Rendimiento | Móvil | Mantenimiento | Compat. animaciones actuales | **Total /50** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **C1** Anatomía de tu cigarro | 5 | 5 | 5 | 4 | 5 | 2 | 3 | 3 | 3 | 4 | **39** |
| **C2** Corte transversal en relieve | 5 | 4 | 4 | 5 | 3 | 5 | 5 | 5 | 5 | 5 | **46** |
| **C3** Espiral de capa (puente a la secuencia) | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 5 | 4 | 4 | **43** |
| **A2** Tres hojas en profundidad | 5 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 4 | **40** |
| **B2** La hoja viaja a tu mezcla | 4 | 4 | 4 | 4 | 3 | 3 | 5 | 3 | 3 | 4 | **37** |
| **B1** Tilt de materia | 4 | 3 | 4 | 5 | 2 | 5 | 5 | 3 | 5 | 4 | **40** |
| **D2** Profundidad de pasos | 4 | 4 | 3 | 5 | 2 | 5 | 5 | 4 | 5 | 4 | **41** |
| **D1** Luz rasante | 5 | 3 | 5 | 4 | 4 | 3 | 3 | 3 | 3 | 4 | **37** |
| **A1** Hoja en vilo | 4 | 3 | 5 | 3 | 4 | 3 | 3 | 2 | 3 | 4 | **34** |

**Lectura del ranking**
- **Top 3 recomendado (por valor y no solo por puntos):**
  1. **C1 Anatomía de tu cigarro**: es la única pieza WebGL que se justifica plenamente (auditoría §13.1). Llena el paso 04, que hoy no tiene imagen, refleja la mezcla real y anuncia la secuencia.
  2. **C2 Corte transversal en relieve**: es el mejor ratio entre coste y beneficio, y actúa a la vez como **fallback de C1**. Hay que construirlo primero.
  3. **C3 Espiral de capa**: resuelve el corte brusco y la espera entre la mesa y los frames, sin tocar el motor y respetando §7.11.
- Paquete de pulido barato para acompañar: **D2 + B1** (CSS y framer, sin dependencias).
- Reservar **A1/D1** hasta validar C1: comparten pipeline (texturas de hoja, R3F) y su valor es secundario.
- Orden de implementación sugerido: C2 → D2/B1 → C3 → C1 (fase 1 procedural) → A2 → B2 → (A1/D1, GLB-CIGAR-01 solo si hace falta).
