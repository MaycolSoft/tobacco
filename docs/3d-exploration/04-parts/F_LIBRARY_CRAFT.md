# F — Dirección de arte 3D: Biblioteca de hojas + Crea tu cigarro

> **Referencia histórica de exploración (19/10/2026).** H1/O2/L1/ART-C1 se implementaron después; tecnología, cifras y tareas de este documento describen aquella fase. Consultar [estado vigente](../PROGRESS.md) y [pendientes del proyecto](../../STATUS.md). Los encargos y restricciones de sesiones anteriores no son instrucciones actuales.

> Agente F (3D Art Director) · 2026-10-19 · Solo exploración, nada implementado.
> Objetos **artísticos** (flotantes, decorativos, interactivos) para Biblioteca, Craft, Guía y, opcionalmente, Acceso. **C1 «Anatomía de tu cigarro» se mantiene tal cual** y no se rehace aquí.

## Progreso

- [x] Lectura de docs previos (Recomendaciones §3-§11 y §14, 01 §7-9 y §13-17, 02 completo)
- [x] Verificación de código (LeafLibrary, LeafGrid, BlendSummary, CigarResult, CraftYourCigar, TobaccoGuidePage, Login, leaves.js, useBlendStore, tokens.css)
- [x] Revisión de capturas (biblioteca-hojas, hoja-detalle, hoja-inmersiva, crea-tu-cigarro-mezcla, -capote, -capa, tu-cigarro-vista, guia-mezcla, acceso)
- [x] Propuestas AR-L1, AR-L2, AR-C1, AR-C2, AR-C3 + AR-A1 (opcional)
- [x] Ideas rechazadas
- [x] Top 2

---

## 0. Restricciones heredadas y hechos verificados en código

**Reglas que respeto**
- **Sin WebGL dentro de `#video-root`.** En `CraftYourCigar.jsx` el overlay se monta con `showVideo` y todo el contenido principal (`LeafGrid`, `BlendSummary`, `CigarResult`) está bajo `{!showVideo && …}`, así que se desmonta solo. El canvas compartido de Craft debe vivir **dentro** de ese bloque (no en `MainLayout`), con `forceContextLoss()` en el cleanup.
- **La guía (`TobaccoGuidePage`) se monta encima de la mesa sin desmontarla** (`{showGuide && <TobaccoGuidePage/>}`). Si hay 3D en el panel «Tu mezcla», hay que **pausarlo** (`frameloop="never"`) mientras la guía está abierta, y el 3D de la guía debe usar el **mismo** canvas.
- El overlay de hoja de la biblioteca es un `createPortal(…, document.body)` modal (`.ls-experience`). Mientras está abierto, la página de debajo no debe renderizar.
- Sin humo, brasa, ceniza ni gestos de consumo. Ningún objeto es un cigarro encendido; de hecho, **ningún objeto artístico es un cigarro literal** (eso ya lo hace C1).
- Un solo contexto WebGL por vista, `frameloop="demand"`, DPR ≤1,5, `aria-hidden`, lazy + póster, reduced motion = póster estático.

**Datos que pueden mover forma y color** (`src/data/leaves.js`, `src/store/useBlendStore.js`)
- 21 hojas: **CAPA 2** (Habana · Ecuador/Cuba; Pensilvania · USA), **CAPOTE 5**, **TRIPA 14**.
- Orígenes reales: Ecuador / Cuba, USA, Dominican Republic, Nicaragua, Indonesia, Ecuador, Cuba, Various, Hybrid.
- Store: `selections = { TRIPA: [2–5 ids], CAPOTE: [1], CAPA: [1] }`, `stepIndex` (0-2 pasos, 3 = resultado), `loadedBlend` (mezcla maestra cargada). Acciones: `toggleLeaf`, `addLeaf` (desde la biblioteca), `setStep`, `loadBlend`, `reset`.
- Cada hoja tiene `thumbImg` WebP con alfa (~400×825): se puede extraer el **color medio real** de la hoja en runtime (canvas 2D 8×8) para teñir materiales sin inventar marrones.

---

## 1. Paleta de acentos (más allá del marrón)

Principio: el marrón y el bronce siguen siendo la base; los acentos aparecen **solo en el objeto 3D** (tinte de translucidez, iridiscencia de canto, luz de borde), nunca en UI, texto ni botones. Dosis máxima ≈5-8 % del área del objeto. Cada acento tiene una razón material, no decorativa.

| Token propuesto | Hex | Nombre | Por qué encaja |
|---|---|---|---|
| `--ls-accent-patina` | `#6F8F86` | Verdín / pátina de bronce | Es el envejecimiento natural del bronce `#C7A479` ya presente: un acento frío que «sale» de la marca, no de fuera. Ideal para iridiscencia de canto y luz de rim. |
| `--ls-accent-ambar` | `#C98A3A` | Ámbar de resina | Luz que atraviesa una hoja curada a contraluz. Tinte de `attenuationColor` en materiales con `transmission`. Cálido pero más luminoso y transparente que los marrones de UI. |
| `--ls-accent-lacre` | `#8E3B2F` | Rojo lacre / sello de cera | Gesto artesanal de cierre y sello. Reservado a **un** momento: «la composición se cierra» (capa elegida). |
| `--ls-accent-tinta` | `#2E3A4F` | Azul tinta de lámina botánica | Sombra fría de las láminas técnicas; da profundidad al negro `#0F0E0C` sin aclararlo. Se usa en la luz de relleno y en el `sheenColor`. |
| `--ls-accent-oliva` | `#7C8A5A` | Oliva apagado («memoria de planta») | Recuerdo de la hoja antes del curado. **Muy desaturado** a propósito: el verde `#5FA14A` de `MixingAnimation.jsx` ya se descartó por chillón. Solo en vetas finas. |

**Mapeo de datos → acento (opcional, sutil):** origen → tono de iridiscencia o de la luz de canto.
- Caribe (Cuba, Dominican Republic) → lacre
- Centroamérica / Andes (Nicaragua, Ecuador, Ecuador / Cuba) → pátina
- USA → tinta
- Indonesia → ámbar
- Various / Hybrid → marfil `#F1ECE3` neutro

Los acentos deben ir como tokens `--ls-accent-*` en `tokens.css` y leerse con `getComputedStyle` para respetar los 7 perfiles visuales.

---

## 2. Propuestas

Arquitectura común a todas: **un único `<Canvas>` por página** (fijo, `pointer-events:none`, `eventSource` = raíz de la página) con `drei/<View>` por cada hueco DOM (técnica de scissor). Así las piezas de una misma página comparten contexto, luces y entorno. Se carga en un chunk lazy `vendor-3d` (three/R3F/drei **no están instalados**: es un prerequisito).

---

### AR-L1 — «Anillo de espécimen» (overlay de hoja)

| Campo | Detalle |
|---|---|
| **Captura** | [`hoja-detalle.png`](../../../design-review/desktop/hoja-detalle.png) y [`hoja-inmersiva.png`](../../../design-review/desktop/hoja-inmersiva.png). En la ficha, la hoja Habana está inscrita en un **círculo de línea fina** (≈ x 135-620, y 350-840) con mucho negro alrededor. En el inmersivo hay **dos círculos concéntricos** y un marcador «01» sobre la hoja. El círculo ya funciona como «marco de espécimen». Ese trazo 2D es lo que se convierte en objeto. |
| **Ubicación** | `src/components/leaf-library/TechnicalSheet.jsx` → `figure.ts-image-side`, centrado sobre el círculo existente, por detrás de la `<img>` en el eje Z (una mitad del anillo pasa por detrás de la hoja y la otra por delante: efecto de «órbita»). En el inmersivo (`ImmersiveView.jsx`, `.th-leaf-frame`) se reutiliza el mismo anillo, que cambia de inclinación por capítulo. |
| **Aspecto** | Un **toro muy fino** (sección ≈1,5 % del radio) que sustituye visualmente el círculo de 1 px. Está inclinado ~68° con respecto a la cámara, de modo que se lee como una elipse que «abraza» la hoja. Lleva un segundo anillo, aún más fino y abierto (arco de 300°), en otro plano. La forma la decide la categoría: **Capa = 1 anillo**, **Capote = 2**, **Tripa = 3 arcos** (de fuera hacia dentro, como en la guía). |
| **Materiales** | Anillo principal: `MeshPhysicalMaterial` con `transmission 1`, `thickness 0.4`, `roughness 0.18`, `ior 1.45`, `iridescence 0.35` (`iridescenceThicknessRange [200, 420]`) y `attenuationColor` ámbar. Parece resina o vidrio soplado, no cristal de joyería. Arcos secundarios: **bronce cepillado** (`metalness 1`, `roughness 0.45`, anisotropía 0.6) en `#C7A479`. |
| **Color** | Base: bronce `#C7A479` + resina incolora. Acento: iridiscencia de canto **pátina `#6F8F86` → marfil** según el origen (ver mapeo §1). Encaja porque es el mismo bronce de la UI, pero con vida. |
| **Movimiento** | Idle: rotación sobre el eje propio a 0,02 rad/s (una vuelta cada ~5 min, casi imperceptible) y balanceo de ±1,5° a 0,1 Hz. Se detiene tras 6 s sin interacción (`frameloop="demand"` + `invalidate` manual) para no dejar un bucle infinito. |
| **Interacción** | El cursor sobre la figura **mueve la luz**, no el objeto (el reflejo del anillo recorre la hoja). «Hoja anterior/siguiente» (`changeLeaf`): el anillo gira 180° sobre el eje Y en 600 ms y cambia el nº de arcos. En el inmersivo, cada capítulo da una pose: 01 Identidad (frontal), 02 Forma (inclinado, como luz rasante), 03 Carácter (el anillo se cierra y se acerca), 04 En el cigarro (los arcos se apilan como capa/capote/tripa). |
| **Sincronización** | framer-motion (ya gobierna el overlay): `useMotionValue` → props del `<group>`. Nada de GSAP aquí. |
| **Técnica** | R3F, `TorusGeometry` y `RingGeometry` procedurales, sin assets. Entorno: `drei/<Environment>` con un HDR mínimo (o `Lightformer`s) para que la iridiscencia tenga algo que reflejar. Alternativa sin WebGL: **SVG** con 2 elipses + `linearGradient` animado que imita el brillo, más `mix-blend-mode: screen`. |
| **Rendimiento** | `transmission` obliga a three a hacer una **pasada extra** (renderiza la escena opaca a un render target y luego el material transmisivo). Con un solo objeto transmisivo y DPR 1,5 es asumible. Si hay más de uno, pasar los arcos a bronce opaco. ≈2k triángulos. |
| **Móvil** | Sin `transmission` (resina falsa: `opacity 0.35` + `clearcoat`). Solo 1 anillo. Sin hover: la luz sigue al giroscopio solo si hay permiso (si no, queda estática). |
| **Reduced motion** | Póster SVG estático de la pose 01 sobre el círculo actual. Sin rotación. |
| **Narrativa** | El círculo deja de ser un adorno y pasa a decir «esta hoja es una pieza de colección». El número de arcos enseña, sin texto, su función (capa = 1 piel, tripa = el centro). |
| **Riesgo identidad** | Medio-bajo. Riesgo: que la iridiscencia lea «joya» o «tech». Mitigación: iridiscencia ≤0,35, rugosidad alta y nunca en movimiento rápido. |
| **Imagen de concepto** | **ART-L1-REF** — Hoja de capa curada sobre negro, atravesada por un anillo fino de resina translúcida inclinado que pasa por detrás y por delante. Luz cálida lateral y un destello verdín muy leve en el canto. |

---

### AR-L2 — «Sellos de función» (cabeceras de grupo de la biblioteca)

| Campo | Detalle |
|---|---|
| **Captura** | [`biblioteca-hojas.png`](../../../design-review/desktop/biblioteca-hojas.png). Cada `.ls-group-heading` (Capa / Capote / Tripa) tiene el título a la izquierda y un párrafo de 2 líneas a la derecha, con **una franja central vacía** de ≈350 px (en la escala original, x ≈ 300-900). Además, el grupo Capa deja **2 columnas vacías** junto a sus 2 tarjetas. |
| **Ubicación** | `src/pages/LeafLibrary.jsx` → `header.ls-group-heading`, nuevo hueco `aria-hidden` centrado entre el `<div>` del título y el `<p>`, de ~140×110 px. Solo cuando `filter === 'ALL'` (que es cuando se muestra la cabecera). **No entra en la rejilla `.ls-grid`**: las tarjetas no se tocan. |
| **Aspecto** | Tres pequeñas esculturas, una por función, como «sellos» o pesos de papel: **Capa** → una sola cinta ancha con una torsión de media vuelta (banda casi de Möbius): «envuelve». **Capote** → dos cintas más estrechas entrelazadas: «abraza». **Tripa** → un haz de 5 láminas plegadas en acordeón, ligeramente abiertas en abanico: «el corazón». |
| **Materiales** | **Cera de abeja / jabón mate**: `MeshPhysicalMaterial` con `roughness 0.65`, `sheen 0.6`, `sheenColor` tinta `#2E3A4F` y `transmission 0` (sin pasada extra), con subsurface falso mediante `thicknessMap` o un shader de rim. Las láminas de tripa llevan una textura de **fibra de hoja** (derivada de una `thumb` existente, desaturada y en escala de grises) como `roughnessMap`. |
| **Color** | Base: superficie `#211E19` → bronce `#C7A479` en degradado. Acento por grupo: Capa = ámbar `#C98A3A`, Capote = pátina `#6F8F86`, Tripa = lacre `#8E3B2F` (solo en el canto interior de los pliegues). Así los tres grupos se distinguen sin cambiar la UI. |
| **Movimiento** | Entrada con scroll: la escultura «se posa» (cae 12 px y rota 20° hasta su reposo) en 900 ms al entrar en el viewport. Después, quieta. |
| **Interacción** | Hover sobre la cabecera: la escultura gira 25° para mostrar su torsión y vuelve. Clic en el filtro de categoría (`setFilter`): la escultura de esa categoría hace un pequeño «asentimiento» antes de que desaparezca la cabecera. Si el usuario ya tiene hojas en `useBlendStore.selections`, la escultura correspondiente muestra un **punto bronce** (sin texto). |
| **Sincronización** | GSAP `ScrollTrigger.batch` sobre los headers (con scroller `window`, refs locales y `gsap.context`), que ya estaba propuesto para la rejilla. Mueve un `progress` que lee `useFrame`. |
| **Técnica** | R3F, un `Canvas` fijo por página + `drei/<View>` × 3. Geometrías procedurales: cinta = `TubeGeometry` aplanada a lo largo de una curva con torsión (o `ParametricGeometry`); acordeón = `PlaneGeometry` con desplazamiento en el vértice (onda triangular). Alternativa: **sprites prerenderizados** (3 WebP de 280 px con 24 frames de giro), con 0 KB de three. |
| **Rendimiento** | Bajo: sin transmission, ≈6k triángulos en total, render solo en la entrada y en el hover. Cuando se abre el overlay de hoja (`selected`), las vistas se pausan. |
| **Móvil** | La cabecera se apila: la escultura pasa a 72 px junto al eyebrow. Sprite estático. |
| **Reduced motion** | Pose final estática (sprite o póster PNG). |
| **Narrativa** | Antes de ver 14 tarjetas de tripa, el visitante ve *cómo trabaja* esa hoja. Forma = función. |
| **Riesgo identidad** | Bajo, si la escala es pequeña. Riesgo de «iconos 3D de SaaS»: se evita con materiales mates y fibra real, nada de colores planos. |
| **Imagen de concepto** | **ART-L2-REF** — Tres esculturas pequeñas de cera mate sobre negro (cinta torsionada, dos cintas entrelazadas, abanico de láminas plegadas), cada una con un canto de color distinto (ámbar, verdín, lacre). Luz rasante de estudio. |

---

### AR-C1 — «Haz suspendido» (panel «Tu mezcla», pasos 01-03)

> **Evolución artística de E1 «Cigarro en construcción»** (lo digo explícitamente): E1 era una silueta literal del cigarro. AR-C1 es una **composición abstracta** que se forma con los mismos datos, sin dibujar un cigarro.

| Campo | Detalle |
|---|---|
| **Captura** | [`crea-tu-cigarro-mezcla.png`](../../../design-review/desktop/crea-tu-cigarro-mezcla.png) y [`crea-tu-cigarro-capote.png`](../../../design-review/desktop/crea-tu-cigarro-capote.png). El panel «Tu mezcla» es **texto puro** (lista con checks). Su cabecera («Composición en curso / Tu mezcla») deja libre el lado derecho, y **debajo del panel** hay ≈100 px vacíos hasta el botón «Ver recorridos». |
| **Ubicación** | `src/components/BlendSummary.jsx` → `header.craft-summary__header`: un hueco `aria-hidden` de 300×150 px como franja superior del `aside.craft-summary` (por encima del kicker, a todo el ancho del panel de 300 px; `craft-your-cigar.css:379` fija esa columna). El panel crece 150 px, lo que cabe en el vacío inferior visto en la captura. |
| **Aspecto** | Una composición flotante horizontal. **Tripa**: 2-5 láminas finas y curvas (como hojas enrolladas a medias), suspendidas en paralelo, **una por cada hoja elegida**. **Capote**: cuando se elige, una cinta translúcida aparece y las rodea en una espiral abierta (una sola vuelta). **Capa**: una segunda cinta, más ancha y opaca, se enrolla por fuera en una hélice cerrada. Con la mezcla completa, el conjunto queda como un «capullo» abstracto y suspendido, nunca como un cigarro cerrado. |
| **Materiales** | Láminas de tripa: «papel de hoja» (`MeshStandardMaterial`, `map` = recorte de la `thumbImg` real de cada hoja elegida, `roughness 0.8`, `side: DoubleSide`) → cada lámina tiene **la textura de la hoja que eligió el usuario**. Capote: resina con fibra (`MeshPhysicalMaterial` `transmission 0.9`, `thickness 0.3`, `attenuationColor` = color medio de la hoja de capote). Capa: `sheen 1`, `sheenRoughness 0.4`, `color` = color medio de la thumb de capa. |
| **Color** | Base: los marrones reales de las thumbs. Acento: **ámbar `#C98A3A`** en la luz que atraviesa el capote y **lacre `#8E3B2F`**, solo como un destello en el instante en que se cierra la capa («sello»). Habana → hélice más clara (colorado); Pensilvania → más oscura (maduro). |
| **Movimiento** | Idle: flotación ±3 px a 0,15 Hz durante 4 s tras cada cambio, y luego quieto. Transiciones: una lámina nueva entra girando sobre su nervio (500 ms, spring). La cinta del capote se «dibuja» de 0 a 1 en 700 ms (`drawRange`). Quitar una hoja (`toggleLeaf`): la lámina se pliega y se desvanece en 300 ms. |
| **Interacción** | Hover sobre un `<li>` del panel → su lámina se adelanta en Z y las demás bajan al 40 %. `loadBlend` (mezcla maestra) → las láminas entran en cascada (stagger 80 ms). `stepIndex` cambia → la cámara gira 15° para mostrar la capa en la que se trabaja (de dentro hacia fuera, coherente con D2). |
| **Sincronización** | framer-motion (`useBlendStore` → `motion` values). B2 (la hoja viaja a tu mezcla), si existe, termina exactamente donde entra la lámina. |
| **Técnica** | R3F. Láminas = `PlaneGeometry(8×32)` curvadas en el vertex shader (`uCurl` uniform). Cintas = `TubeGeometry` aplanada sobre `CatmullRomCurve3` helicoidal con `drawRange` animado. Texturas = thumbs ya cargadas por la rejilla (caché del navegador), reducidas a 256 px en un canvas 2D. Canvas compartido con AR-C2 y AR-C3. Alternativa sin WebGL: **SVG** con `<image>` recortadas por `clipPath` en láminas y `stroke-dashoffset` para las cintas. |
| **Rendimiento** | 1 objeto transmisivo (el capote) → 1 pasada extra, solo mientras se anima. ≈8k triángulos. ≤6 texturas de 256 px (<2 MB de GPU). **Pausa obligatoria** cuando `showGuide` es true (la guía tapa la mesa sin desmontarla). Se desmonta solo en el paso 04 (BlendSummary no se renderiza con `isResult`) y con `showVideo`. |
| **Móvil** | El panel pasa debajo de la rejilla: franja de 100 px, sin transmission (capote = `opacity 0.5`) y sin hover. |
| **Reduced motion** | Estado final estático según la selección (se puede generar como SVG en vivo, sin animación). |
| **Narrativa** | Hace visible la regla «de dentro hacia fuera» y que **tu** mezcla es distinta a otra: 2 láminas no son 5. Prepara a C1 sin anticiparlo, porque es abstracto. |
| **Riesgo identidad** | Bajo-medio: si queda demasiado literal, compite con C1; si queda demasiado abstracto, no se entiende. La regla es: nunca cerrar los extremos (sin «cabeza» ni «pie»). |
| **Imagen de concepto** | **ART-C1-REF** — Tres láminas de hoja curada suspendidas en horizontal, rodeadas por una cinta de resina ámbar translúcida en espiral abierta y una cinta exterior marrón satinada. Fondo `#171512`, sin cigarro reconocible. |

---

### AR-C2 — «Cinta de capa» (paso 03, hueco de la rejilla)

| Campo | Detalle |
|---|---|
| **Captura** | [`crea-tu-cigarro-capa.png`](../../../design-review/desktop/crea-tu-cigarro-capa.png). En el paso Capa solo hay **2 tarjetas** (Habana, Pensilvania); a su derecha quedan ≈520 px de negro vacío (x ≈ 545-1060, y ≈ 497-962), en el mismo nivel que las tarjetas. Es el vacío más evidente de toda la mesa. |
| **Ubicación** | `src/components/LeafGrid.jsx` → dentro de `motion.div.ls-grid-container`, como último hijo `aria-hidden` (no es un botón), solo cuando `currentStep.key === 'CAPA'`, en `grid-column: 3 / span 2` con la misma altura que las tarjetas. No desplaza ninguna tarjeta. |
| **Aspecto** | Una **gran cinta escultórica** (la «piel» de la capa, abstracta): una banda ancha y fina que flota en vertical describiendo una hélice suelta de 1,5 vueltas, con bordes ligeramente irregulares y ondulados (como el borde de una hoja), y nervaduras en relieve suave. Debajo, una sombra de contacto difusa. |
| **Materiales** | Lámina de hoja «laqueada en cera»: `MeshPhysicalMaterial` con `map` y `normalMap` derivados de la **thumb real de la capa en hover/elegida**, `sheen 0.8`, `sheenColor` ámbar, `clearcoat 0.15`, `clearcoatRoughness 0.6` y `transmission 0.25` + `thickness 1.2` solo en el borde (máscara), para que el canto deje pasar luz como una hoja a contraluz. |
| **Color** | Base: el color medio de la capa (Habana claro-colorado / Pensilvania oscuro-maduro). Acento: contraluz **ámbar `#C98A3A`** en los bordes y luz de relleno **tinta `#2E3A4F`** desde atrás, para separar la cinta del negro. Al seleccionar, un único destello **lacre `#8E3B2F`** recorre la cinta («sello»). |
| **Movimiento** | Idle: la hélice «respira» (amplitud de la torsión ±4 %, 0,08 Hz) durante 5 s y luego se queda quieta. Hover sobre una tarjeta de capa: la cinta **toma esa hoja** (crossfade de textura y color, 400 ms). Selección: la hélice se cierra de 1,5 a 2,5 vueltas y se compacta (800 ms, ease `power3.inOut`). Es la metáfora de «envolver» sin mostrar un cigarro. |
| **Interacción** | `onPointerEnter` en `.ls-grid-item` (evento DOM → store local) para la vista previa. `toggleLeaf('CAPA', id)` para cerrar. Si se deselecciona, la cinta se relaja. Cursor sobre la cinta: la luz sigue al cursor (rasante), el objeto no. |
| **Sincronización** | GSAP timeline (sin scroll) para el cierre de la hélice, ya que es una secuencia con varias fases. framer gestiona la tarjeta: **una librería por nodo**, porque la cinta es WebGL y no DOM. |
| **Técnica** | R3F. Cinta = `PlaneGeometry(4×128)` deformada por un vertex shader (hélice paramétrica con `uTwist`, `uTurns`, `uWave`). Normal map derivado de la thumb en runtime (filtro Sobel en un canvas 2D, 256×512) o asset `TEX-LEAF-NRM-xx` ya listado en 02 §4 (solo 2 capas). Canvas compartido con AR-C1. Alternativa: **vídeo/sprite** prerenderizado por capa (2 × 40 frames WebP) controlado por la selección. |
| **Rendimiento** | Transmission parcial = 1 pasada extra, solo en el paso 03. ≈1k triángulos. 2 texturas de 512 px. Se desmonta al pasar al paso 04 (`isResult`) y con `showVideo`. |
| **Móvil** | En 1-2 columnas no hay hueco: **no se monta**. Como mucho, una miniatura estática de la cinta en la cabecera del paso. |
| **Reduced motion** | Imagen estática de la cinta cerrada con el color de la capa elegida (2 pósters). |
| **Narrativa** | El último paso es el más importante visualmente (la capa es «la primera impresión», según la biblioteca) y hoy es el más vacío. La cinta convierte ese vacío en un «probador» de capas. |
| **Riesgo identidad** | Medio: ocupa espacio en una rejilla aprobada. Mitigación: solo con ≥2 columnas libres, sin bordes ni tarjeta, en la misma línea de base que las tarjetas. |
| **Imagen de concepto** | **ART-C2-REF** — Una cinta ancha de hoja de capa curada, laqueada en cera, flotando en hélice suelta sobre negro, con los bordes ondulados encendidos en ámbar a contraluz. Sin cigarro y sin humo. |

---

### AR-C3 — «Pliegue de dentro hacia fuera» (intro de la Guía de la mezcla)

| Campo | Detalle |
|---|---|
| **Captura** | [`guia-mezcla.png`](../../../design-review/desktop/guia-mezcla.png). La intro «El arte de *combinar*.» ocupa la mitad izquierda (x ≈ 150-745) y deja **toda la mitad derecha vacía** (x ≈ 760-1268, y ≈ 180-440). La sección 01 se titula «De dentro hacia fuera» y tiene el corte 2D (que mejora C2, aquí no se toca). |
| **Ubicación** | `src/components/TobaccoGuidePage.jsx` → `header.tg-intro`, columna derecha `aria-hidden` (~420×260 px), alineada con el H1. Desaparece con el scroll de `.tg-scroll` antes de llegar al corte de C2, para no duplicarlo. |
| **Aspecto** | **Una sola hoja abstracta de papel-resina** que se pliega sobre sí misma: con el scroll pasa de 1 lámina plana → 2 pliegues → 3 capas concéntricas (enrollado parcial, abierto por un lado). No es un anillo ni un cilindro cerrado, sino un origami lento que anticipa la palabra «combinar». |
| **Materiales** | Papel de algodón translúcido: `MeshPhysicalMaterial` con `transmission 0.6`, `thickness 0.15`, `roughness 0.9`, `sheen 0.4` y un `alphaMap` de fibra (verjurado + vetas). La luz atraviesa las capas y se suma en las zonas de solape, con lo que se ve el «dentro». |
| **Color** | Base: marfil `#F1ECE3` al 85 % (único objeto claro del set, contrasta con la intro tipográfica). Acento: **pátina `#6F8F86`** en la luz que se transmite en los solapes (frío sobre cálido) y **oliva `#7C8A5A`** en una sola vena fina («la planta»). Si el usuario ya tiene mezcla, las 3 capas toman los colores medios de sus hojas (tripa → capote → capa). |
| **Movimiento** | Scrub con el scroll interno (0 → 35 % de la primera pantalla): plegado continuo. Sin scroll: quieto. Entrada: se despliega en 1,2 s al abrir la guía. |
| **Interacción** | Tabs `tg-nav` (01-03): cada tab fija una pose (01 enrollado, 02 abierto en abanico de 4 = las familias Kentucky/Burley/Virginia/Oriental, 03 plano «a la colección»). Cursor: luz. |
| **Sincronización** | GSAP ScrollTrigger con `scroller: scrollRef.current` (`.tg-scroll`), **no** `window` ni `#video-root`, dentro de `gsap.context` y revertido al cerrar la guía. |
| **Técnica** | R3F en el **mismo canvas** que AR-C1 (la mesa queda debajo y pausada). Plegado = vertex shader con 2 bisagras (`uFold1`, `uFold2`) sobre `PlaneGeometry(32×32)`. Alternativa: CSS 3D con 3 `div` con `transform-style: preserve-3d` y `rotateY` en bisagras (más plano, pero con 0 KB). |
| **Rendimiento** | 1 transmisivo (pasada extra) solo mientras la intro es visible (IntersectionObserver dentro de `.tg-scroll`). ≈2k triángulos. |
| **Móvil** | Pasa debajo del H1 a 200 px de alto, opaco (sin transmission), solo con poses por tab (sin scrub). |
| **Reduced motion** | Póster de la pose «enrollado». |
| **Narrativa** | Abre la guía con la idea que la estructura entera («de dentro hacia fuera») en un gesto, sin competir con el corte didáctico C2. |
| **Riesgo identidad** | Bajo-medio: un objeto claro sobre negro llama mucho. Por eso va al 85 % y con roughness alta. |
| **Imagen de concepto** | **ART-C3-REF** — Una lámina de papel de algodón marfil translúcido, plegada en tres capas que se enrollan parcialmente, flotando sobre negro. Luz trasera que revela un verdín suave en los solapes y una única vena oliva. |

---

### AR-A1 (opcional) — «Umbral» (página de Acceso)

| Campo | Detalle |
|---|---|
| **Captura** | [`acceso.png`](../../../design-review/desktop/acceso.png). Mitad izquierda: hoja oscura enorme muy apagada con «Selecciona. Equilibra. *Observa.*» y la lista 01-04. Mitad derecha: el formulario. Entre el borde derecho de la hoja (x ≈ 610) y el formulario (x ≈ 885) hay una **franja negra vertical** de ≈270 px sin contenido. |
| **Ubicación** | `src/pages/Login.jsx` → `.site-login__visual`, anclado a su borde derecho (en la costura con `.site-login__panel`), `aria-hidden`, a media altura. **Nunca dentro del formulario.** |
| **Aspecto** | Una **cuchilla de hoja vertical** de resina (forma lanceolada estrecha, ~60×360 px) con la fibra de la hoja de fondo «atrapada» dentro, que flota de canto. Es la misma hoja del fondo vista como objeto. |
| **Materiales** | Resina con hoja embebida: `transmission 1`, `thickness 2`, `ior 1.5`, `attenuationColor` ámbar, y en el interior un plano con la textura de la hoja (la misma imagen de fondo, reducida). |
| **Color** | Base: ámbar `#C98A3A` muy oscurecido por la atenuación. Acento: canto **pátina `#6F8F86`**. |
| **Movimiento** | Gira lentamente sobre su eje vertical (1 vuelta/40 s) mientras no hay foco en el formulario; al enfocar un campo se detiene de frente («atención»). |
| **Interacción** | Focus en usuario o contraseña → gira 90° por campo. Submit correcto → la cuchilla se enrolla en un anillo (600 ms) justo antes de navegar a la mesa. Error → un temblor corto de ±2° (sin color rojo). |
| **Sincronización** | framer (eventos del formulario). |
| **Técnica** | R3F con 1 objeto; o, mejor, **vídeo prerenderizado** WebM/WebP en bucle corto + 2 clips de transición (0 KB de three en una página que solo es puerta de entrada). |
| **Rendimiento** | Transmission en una página por lo demás vacía: aceptable. Debe desmontarse antes de navegar a Craft (cambio de ruta). |
| **Móvil** | No se monta (el layout se apila y no hay franja). |
| **Reduced motion** | Imagen estática de la cuchilla de frente. |
| **Narrativa** | La puerta de la experiencia privada: «la hoja se convierte en objeto». |
| **Riesgo identidad** | Medio: el doc 01 dice «Acceso: no necesario». Por eso es opcional y queda fuera del Top. |
| **Imagen de concepto** | **ART-A1-REF** — Una cuchilla vertical de resina ámbar con una hoja de tabaco curada atrapada dentro, de canto sobre negro, con un fino reflejo verdín en el borde. |

---

## 3. Ideas rechazadas

| Idea | Motivo |
|---|---|
| **Campo de hojas/cintas flotando detrás de toda la rejilla de la biblioteca** (canvas fijo de fondo con 20-30 elementos a la deriva) | Compite con las fotos, que son el contenido. Obliga a renderizar en continuo durante todo el scroll (GPU siempre activa, batería en portátiles), es un bucle infinito contra el principio «movimiento con causa» y se parece a un fondo Vanta, ya descartado. |
| **«Cigarro de vidrio» iridiscente flotando alrededor de C1 en el paso 04** | Duplica C1 con un lenguaje de joyería/plástico (vidrio cromado = lujo genérico). Es un objeto de consumo literal y, puesto alrededor del resultado, compite con la tabla, que es la interfaz real. En el resultado manda C1 y nada más. |
| **Globo 3D de orígenes** (las hojas se colocan en un mapa/esfera según `origin`) | Cliché de «data viz», pesado y con datos ambiguos (`Various`, `Hybrid`, `Ecuador / Cuba`) que no se pueden geolocalizar con honestidad. El origen funciona mejor como matiz de color (§1) que como geografía. |

---

## 4. Top 2

1. **AR-C1 «Haz suspendido»**: es el más ligado a los datos (nº de láminas = nº de hojas de tripa, textura real de cada hoja, color de la capa elegida). Convierte el panel de texto en algo vivo y, al ser abstracto, prepara C1 sin duplicarlo. Su coste es acotado (un solo transmisivo y se pausa con la guía).
2. **AR-C2 «Cinta de capa»**: ocupa el vacío más evidente de la mesa (≈520 px en el paso 03) con un objeto escultórico que sirve de «probador» de capas, y el sello lacre marca el cierre de la composición. Comparte canvas y shaders con AR-C1.

Tercera opción, la más barata de la biblioteca: **AR-L1 «Anillo de espécimen»** (convierte el círculo existente en objeto; tiene alternativa en SVG).
