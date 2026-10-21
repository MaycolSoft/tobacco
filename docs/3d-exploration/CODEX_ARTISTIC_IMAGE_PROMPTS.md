# CODEX_ARTISTIC_IMAGE_PROMPTS — Concept art de los objetos artísticos 3D (Agente H · Artistic Asset & Prompt Designer)

> Catálogo histórico de prompts y alternativas, conservado como referencia. La generación prioritaria y el set seleccionado ya se completaron: [estado vigente](PROGRESS.md), [galería](refs/art/README.md). El texto de los prompts no es una solicitud de generación o implementación actual.

> Fecha: 2026-10-19 · Repositorio `tobacco` (`main`). Solo especificación: no se generaron imágenes, no se tocó código ni se instaló nada.
> Fuentes: `04-parts/E_HOME_ABOUT.md` (AR-H1…H3, AR-O1…O2), `04-parts/F_LIBRARY_CRAFT.md` (AR-L1, AR-L2, AR-C1…C3, AR-A1), `04-parts/G_COLOR_TECH.md` §1 (sistema de acentos) y `CODEX_IMAGE_PROMPTS.md` (formato y bloque negativo, cuyos IDs no se duplican). También se revisaron las capturas de `design-review/desktop/`: inicio-recorrido, inicio-arte-de-mezclar, inicio-tres-momentos, oficio, proceso, hoja-detalle, hoja-inmersiva, biblioteca-hojas, crea-tu-cigarro-mezcla, crea-tu-cigarro-capa, guia-mezcla y acceso.
> Estructura y explicaciones en español; **los prompts van en inglés**.

## Progreso

- [x] Esqueleto del documento
- [x] Lectura de E, F, G §1 y CODEX_IMAGE_PROMPTS
- [x] Revisión de capturas
- [x] Índice, paleta unificada, bloque común de estilo y bloque negativo
- [x] Home: ART-H1, ART-H2, ART-H3
- [x] El oficio: ART-O1, ART-O2
- [x] Biblioteca: ART-L1, ART-L2
- [x] Crea tu cigarro / Guía: ART-C1, ART-C2, ART-C3
- [x] Acceso (opcional): ART-A1
- [x] Assets de producción derivados (render 3D, no generación de imagen)

---

## 0. Reglas de la serie

**Qué son estas imágenes.** Son **concept art de referencia** para validar forma, material y color antes de modelar en R3F o SVG. **No son assets finales** ni se publican en `public/`. Cada concepto tiene dos prompts:
- **(a) Object study**: el objeto aislado sobre fondo oscuro cálido, con aspecto de render de estudio, para juzgar forma y material.
- **(b) In-context mockup**: el objeto colocado en la sección real de la página, aproximada a partir de la captura. Es una maqueta de referencia, **no la UI final**: la tipografía se representa con bloques de texto ilegible (*greeked*), nunca con palabras legibles.

**Distinción importante.** `ART-C1-REF` es AR-C1 «Haz suspendido» (panel «Tu mezcla»). **No** es la anatomía C1 «Anatomía de tu cigarro», que tiene su referencia propia (`REF-C1-01` en `CODEX_IMAGE_PROMPTS.md`). Ninguna pieza de esta serie muestra un cigarro cerrado ni literal.

**Paleta unificada (decisión consolidada)**

| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| UI | Fondo base | `#0F0E0C` | Fondo de página |
| UI | Card | `#171512` | Secciones *surface*, cajas de figura, paneles |
| UI | Surface | `#211E19` | Reversos y caras oscuras de los objetos |
| UI / material | Bronce | `#C7A479` | Único color de interfaz; también material (bronce cepillado) |
| UI / material | Marfil | `#F1ECE3` | Texto; cera o papel claro |
| Acento 3D | Pátina / verdín | `#6F907F` | Metal patinado, `sheenColor`, iridiscencia de canto, relleno frío |
| Acento 3D | Clarete (maduro, lacre) | `#7B2F2B` | Volumen interior, `attenuationColor` oscuro, destello de «sello» |
| Acento 3D | Celadón | `#BCC8A4` | Luz de borde (rim) y hilo de vena; solo líneas |
| Acento 3D | Ámbar resina | `#D4913F` | **Solo** emisión o contraluz que atraviesa la resina; nunca superficie opaca |
| Acento 3D (reserva) | Tinta índigo | `#3F4C6E` | Luz de relleno fría; nunca superficie |

Los acentos viven **solo en materiales y luz 3D**, nunca en la UI. En las maquetas (b), botones, enlaces y bordes se mantienen en marfil, gris o bronce.

**Mapeo de los hex anteriores de E y F a la paleta unificada**: `#7E9A8C` y `#6F8F86` → pátina `#6F907F`; `#C98A3E` y `#C98A3A` → ámbar `#D4913F`; `#6B2B24` y `#8E3B2F` → clarete `#7B2F2B`; `#26303D` y `#2E3A4F` → tinta `#3F4C6E`; oliva `#7C8A5A` → celadón `#BCC8A4`.

**Bloque común de estilo (se añade al final de todos los prompts; abreviado como `[ART STYLE]`)**

```text
Series style: quiet luxury editorial still life, Tabacalera Tamboril craft identity. Matte, tactile, restrained materials; warm low side light around 3200 K from the left, soft falloff into deep warm black; restrained iridescence only as a faint thin-film edge, never rainbow; accents appear only as light and material (patina green-grey #6F907F, claret #7B2F2B, pale celadon rim light #BCC8A4, resin amber glow #D4913F, ink blue fill #3F4C6E) and never cover more than about 5 percent of the frame; base world of warm near-black #0F0E0C, card #171512, surface #211E19, brushed bronze #C7A479 and ivory #F1ECE3. Physically plausible render, subtle contact or floating shadow, gentle filmic contrast, natural grain, no visible light sources in frame. Calm, sculptural, museum-specimen mood. No chrome, no neon, no glossy plastic, no sci-fi, no crypto or tech aesthetic.
```

**Bloque negativo común (abreviado como `[ART NEGATIVES]`)**

Parte de `[COMMON NEGATIVES]` de `CODEX_IMAGE_PROMPTS.md`, con dos cambios: se quita «no green fresh leaves», porque aquí el verde entra como pátina o celadón de luz, y se añaden las exclusiones propias de los objetos artísticos.

```text
No smoke, no vapor, no haze, no mist, no fire, no embers, no glowing tip, no ash, no ashtray, no lighter, no matches, no lit or partially smoked cigar, no closed or literal cigar shape, no cigar head or foot, no cylinder that reads as a cigar, no person, no hands, no mouth, no lips, no faces, no cigar band, no ring label, no logo, no monogram, no seal emblem, no brand, no text, no lettering, no numbers, no watermark, no signature, no alcohol, no glasses, no coffee cups, no luxury clichés (no gold foil, no leather armchair, no whisky), no jewelry look, no diamond sparkle, no chrome reflections, no neon glow, no glossy plastic, no soap bubbles, no rainbow iridescence, no floating particles, no dust motes, no sparks, no bokeh orbs, no saturated green foliage, no HDR, no oversaturation, no lens flare.
```

> En las maquetas (b), «no text» se refiere al objeto y a la imagen. La UI de la página se pide como **bloques de tipografía ilegible**, sin palabras reales.

**Convenciones comunes**
- Ruta de salida: `docs/3d-exploration/refs/art/` (carpeta propuesta, ya existe tras la generación conceptual). Sufijos `_object.png` y `_context.png`.
- Las referencias se entregan en PNG 8-bit sRGB, sin alfa. No van a `public/`.
- Las maquetas (b) usan proporción **16:10** (equivale a un viewport de 1440×900; las capturas miden 1440×1000) o un recorte de la sección indicada.

---

## 1. Índice

| ID | Concepto | Página / sección | Prioridad |
|---|---|---|---|
| `ART-H1-REF` | AR-H1 «Cinta del cultivo» | Inicio · `#recorrido` | **P1** |
| `ART-H2-REF` | AR-H2 «Lente de resina» | Inicio · «El arte de combinar» (`.site-feature`) | P2 |
| `ART-H3-REF` | AR-H3 «Tres anillos, una materia» | Inicio · «Tres momentos» (`#recorrido-pasos`) | P2 |
| `ART-O1-REF` | AR-O1 «Velo de cera» | El oficio · cita final (`.site-quote`) | P3 |
| `ART-O2-REF` | AR-O2 «Nudo de tres capas» | El oficio · `#proceso` | **P1** |
| `ART-L1-REF` | AR-L1 «Anillo de espécimen» | Biblioteca · overlay de hoja (ficha / inmersivo) | **P1** |
| `ART-L2-REF` | AR-L2 «Sellos de función» | Biblioteca · cabeceras de grupo | P3 |
| `ART-C1-REF` | AR-C1 «Haz suspendido» (no es la anatomía C1) | Crea tu cigarro · panel «Tu mezcla» (pasos 01-03) | **P1** |
| `ART-C2-REF` | AR-C2 «Cinta de capa» | Crea tu cigarro · paso 03 Capa (hueco de la rejilla) | P2 |
| `ART-C3-REF` | AR-C3 «Pliegue de dentro hacia fuera» | Guía de la mezcla · intro | P3 |
| `ART-A1-REF` | AR-A1 «Umbral» (opcional) | Acceso · costura visual/formulario | P3 |

Cada ID produce dos archivos: `…_object.png` (a) y `…_context.png` (b).

---

## 2. Inicio

### ART-H1-REF — «Cinta del cultivo»

| Campo | Detalle |
|---|---|
| ID | `ART-H1-REF` |
| Concepto | AR-H1 «Cinta del cultivo» · Inicio › `section#recorrido` (columna derecha, bajo «VER EL RECORRIDO») |
| Objetivo | Comprobar que una cinta fina pasa de lámina plana con nervio (cultivo, pátina) a hélice cerrada (curado, bronce → clarete) **sin** leerse como cigarro, y que llena los ≈250 px de negro de la columna derecha sin competir con el H2. |
| Estilo visual | Escultura mínima de estudio, satén mate, editorial y silencioso. |
| Materiales | Satén con *sheen* suave (sheenRoughness ≈0,6, roughness ≈0,55), con nervio central y venas finas en bajo relieve. El reverso es más mate y oscuro (material de dos caras). |
| Paleta | Degradado a lo largo de la cinta: pátina `#6F907F` (extremo plano) → bronce `#C7A479` → clarete `#7B2F2B` (interior de la hélice). Reverso `#211E19`. Rim celadón `#BCC8A4` solo en el canto del extremo plano. Fondo `#0F0E0C`. |
| Composición | (a) Cinta horizontal de izquierda a derecha: el tercio izquierdo es plano y ondula; el centro se tuerce; el tercio derecho forma una hélice cerrada de 5-6 vueltas. Proporción ≈ 30:1 (larga y estrecha), con un 15 % de margen. (b) La cinta ocupa ≈420×240 px bajo el enlace de la columna derecha, alineada a la izquierda de esa columna. |
| Iluminación | Luz clave cálida lateral desde la izquierda a ~30° de altura, contra suave de tinta `#3F4C6E` por detrás y a la derecha, y rim celadón tenue en el borde plano. |
| Fondo | (a) Negro cálido liso `#0F0E0C` con viñeteo apenas perceptible. (b) Fondo de la página. |
| Relación de aspecto | (a) 21:9 · (b) 16:10 |
| Resolución sugerida | (a) 2688×1152 · (b) 2304×1440 |
| Transparencia | No (referencia). |
| Evitar | `[ART NEGATIVES]` + hélice tan compacta que parezca un cigarro, extremos cerrados o redondeados como «cabeza», verde saturado de planta, cinta gruesa tipo tubo, brillo especular de seda sintética. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-h1-cinta-cultivo_object.png` · `…/art-h1-cinta-cultivo_context.png` |
| Dónde se usaría | Validación de forma y gradiente para `Home.jsx` › `#recorrido` (ancla `aria-hidden` en la 2.ª columna). También como base del póster estático para móvil y reduced motion, si la versión final es SVG. |

**Prompt (a) — Object study**

```text
Object study, isolated sculpture. A single long, very narrow ribbon of satin-finished material floating in mid-air, seen from a slightly elevated three-quarter view. On the left third the ribbon lies almost flat and gently undulates like a strip of leaf, with a fine raised central vein and faint diagonal secondary veins in low relief; its color there is a muted patina green-grey #6F907F, with a hairline pale celadon #BCC8A4 rim light catching the edge. Through the middle it twists softly and warms to brushed bronze #C7A479. On the right third it coils into a tight closed helix of five to six turns, darkening to deep claret #7B2F2B in the inner turns. The back face of the ribbon is a darker matte surface #211E19, visible where it twists. The ribbon is thin like paper, about 30 times longer than wide, with crisp soft edges; both ends are open and unfinished, never rounded or capped. Soft floating shadow below, no floor. Warm key light from the left, faint ink-blue #3F4C6E fill from behind right. Background: plain warm black #0F0E0C. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a desktop web page section 1440 px wide on a warm near-black background #0F0E0C, dark editorial layout. Left column (about 45 percent width, starting at 9 percent from the left): a tiny uppercase eyebrow line in grey, then a very large heavy high-contrast serif headline in ivory #F1ECE3 set on three lines, rendered as illegible greeked letterforms. Right column (starting at about 57 percent from the left): a three-line light grey sans-serif paragraph, also greeked, and below it a small uppercase link with a thin downward arrow. Directly under that link, in the previously empty black area of the right column, floats a slim satin ribbon sculpture about 420 by 240 px: flat and gently waving with a fine central vein in muted patina #6F907F on its left end, twisting through brushed bronze #C7A479, and closing into a small tight helix in deep claret #7B2F2B on its right end, with a faint soft shadow. The ribbon sits behind the text plane, never overlapping the headline. A thin hairline divider crosses the full width near the bottom, and the next section begins below it on a slightly lighter dark surface #171512, showing only the top of another large greeked serif headline. A tiny rounded-square settings icon button sits at the far top right edge. Calm, spacious, lots of negative space, typographic page. No legible words anywhere. [ART STYLE] [ART NEGATIVES]
```

---

### ART-H2-REF — «Lente de resina»

| Campo | Detalle |
|---|---|
| ID | `ART-H2-REF` |
| Concepto | AR-H2 «Lente de resina» · Inicio › `section.site-feature` › `figure.site-feature__image` («El arte de combinar») |
| Objetivo | Validar que una lente de resina con un nervio de hoja suspendido se lee como «mirar de cerca» (artesanía) y **no** como vidrio tecnológico o joya, y que la refracción de la hoja de la foto es legible a ≈220 px. |
| Estilo visual | Still life de museo de historia natural, especimen en resina; macro editorial sobria. |
| Materiales | Resina colada clara, pulida a satén (rugosidad baja pero no nula), con un borde apenas iridiscente hacia la pátina. En su interior, suspendidos, un fragmento de nervio de hoja curada y 30-40 fibras finas mates (clarete y bronce), con alguna microburbuja de colada. |
| Paleta | Cuerpo transparente con profundidad que brilla en ámbar `#D4913F` (solo luz transmitida). Filo pátina `#6F907F`. Fibras clarete `#7B2F2B` y bronce `#C7A479`. Hoja de fondo en marrones reales (~`#5E3F28`–`#9C6A48`). Caja `#171512`. |
| Composición | (a) La lente (un canto rodado aplanado, elipsoide 1 : 0,62 : 0,9) ocupa ~45 % del encuadre, ligeramente arriba a la derecha. Detrás y parcialmente a través de ella, una hoja curada oscura en diagonal, visiblemente refractada y aumentada. (b) La lente está en el cuadrante superior derecho de la caja de la figura (`top` 12 %, `right` 10 %, ≈220 px), a medio camino de bajar sobre la hoja. |
| Iluminación | Contraluz cálido detrás de la lente, que enciende su volumen en ámbar. Clave lateral izquierda suave. Sin reflejos de ventana blancos: el entorno es cálido y oscuro. |
| Fondo | (a) Card `#171512` → `#0F0E0C`. (b) Página. |
| Relación de aspecto | (a) 1:1 · (b) 16:10 |
| Resolución sugerida | (a) 2048×2048 · (b) 2304×1440 |
| Transparencia | No. |
| Evitar | `[ART NEGATIVES]` + aspecto de lupa con aro o mango, esfera perfecta de cristal, cáusticas de colores, insecto o flor en resina (souvenir), burbujas grandes, reflejos de estudio rectangulares. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-h2-lente-resina_object.png` · `…/art-h2-lente-resina_context.png` |
| Dónde se usaría | Decisión entre A2 y AR-H2 en `Home.jsx` › `.site-feature`. Referencia de material para `MeshPhysicalMaterial` (transmission, attenuation, iridescence baja) y del póster móvil. |

**Prompt (a) — Object study**

```text
Object study, natural-history specimen still life. A smooth flattened pebble of clear cast resin, softly rounded like a river stone (an ellipsoid flattened to roughly 1 by 0.62 by 0.9), floating slightly above center right. Suspended inside the resin: a small fragment of a cured tobacco leaf midrib with a few branching veins, plus thirty to forty very fine matte fibers in deep claret #7B2F2B and brushed bronze #C7A479, and a few tiny casting micro-bubbles. The resin surface is satin-polished, low but not zero roughness, with only a whisper-thin patina #6F907F thin-film tint along the silhouette edge. Warm backlight passes through the volume so its depth glows resin amber #D4913F, deeper where thicker. Behind the pebble a dark cured brown tobacco leaf lies diagonally, matte and crinkled, in real tobacco browns #5E3F28 to #9C6A48; where the pebble overlaps it, the leaf is clearly refracted and magnified, revealing its veins. Background: warm dark card #171512 fading to #0F0E0C. Soft key light from the left, no white window reflections, warm dark environment only. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a desktop web page section 1440 px wide on warm near-black #0F0E0C. On the left half, a square-ish dark card #171512 (about 560 by 600 px) holds a photograph of a single long curved cured brown tobacco leaf running diagonally from top center to bottom left, matte and crinkled, with a soft drop shadow; at the bottom of the card a thin dark caption bar with tiny greeked uppercase text. In the upper right quadrant of that card floats a smooth flattened resin pebble about 220 px wide, clear resin glowing warm amber #D4913F from within, holding a suspended fragment of leaf midrib and fine claret and bronze fibers; where it overlaps the edge of the leaf photo it refracts and magnifies it. A faint patina #6F907F edge sheen on its rim. On the right half of the page: a tiny uppercase eyebrow, then a very large heavy serif headline in ivory #F1ECE3 on four lines, a three-line grey sans-serif paragraph, and a pill-shaped outlined button with a small arrow, all rendered as illegible greeked text. Above the section a thin horizontal hairline separates it from a darker band. Lots of black negative space, quiet editorial luxury. No legible words. [ART STYLE] [ART NEGATIVES]
```

---

### ART-H3-REF — «Tres anillos, una materia»

| Campo | Detalle |
|---|---|
| ID | `ART-H3-REF` |
| Concepto | AR-H3 «Tres anillos, una materia» · Inicio › `section#recorrido-pasos` › `.site-section-heading` (columna derecha, sobre el párrafo «21 hojas…») |
| Objetivo | Comprobar que tres anillos muy finos de materiales distintos, entrelazados, se leen como «astrolabio mínimo» de taller y no como logotipo genérico. Validar el grosor (relación 1:40) a ≈200×150 px. |
| Estilo visual | Instrumento científico antiguo reducido a líneas; escultura de alambre de estudio. |
| Materiales | Anillo 1: bronce cepillado, con anisotropía visible y microrrayado circular. Anillo 2: metal patinado mate (verdín pulverulento). Anillo 3: cera o porcelana marfil, sedosa. |
| Paleta | Bronce `#C7A479`, pátina `#6F907F` y marfil `#F1ECE3` al ~85 % de luminancia. Fondo `#171512`. |
| Composición | (a) Tres toros del mismo diámetro, de sección muy delgada (1:40), entrelazados en tres ejes distintos alrededor de un centro vacío y centrados con mucho aire alrededor (el objeto ocupa ~40 %). (b) Objeto de ≈200×150 px a la derecha, por encima del párrafo y alineado a su borde derecho. Las tarjetas de debajo no se tocan. |
| Iluminación | Clave cálida lateral izquierda que dibuja una línea de brillo en cada anillo, contra muy tenue y sombra apenas visible. |
| Fondo | (a) `#171512` liso. (b) Sección *surface* `#171512` (algo más clara que el negro de las secciones vecinas). |
| Relación de aspecto | (a) 4:3 · (b) 16:10 |
| Resolución sugerida | (a) 2048×1536 · (b) 2304×1440 |
| Transparencia | No. |
| Evitar | `[ART NEGATIVES]` + anillos gruesos tipo alianza, aros olímpicos, giroscopio con soporte o base, símbolo de átomo, brillo de joya, oro amarillo saturado. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-h3-tres-anillos_object.png` · `…/art-h3-tres-anillos_context.png` |
| Dónde se usaría | `Home.jsx` › `#recorrido-pasos` (ancla sobre el `p` de la cabecera). Referencia también para la alternativa SVG/CSS 3D. |

**Prompt (a) — Object study**

```text
Object study, minimal sculpture. Three very thin rings of identical diameter, each with a tube thickness about one fortieth of its diameter, interlocked at three different angles around a shared empty center like a minimal astrolabe reduced to lines, floating in space. Ring one: brushed bronze #C7A479 with visible circular anisotropic brushing. Ring two: matte patinated metal in verdigris #6F907F with a powdery oxidized surface. Ring three: ivory #F1ECE3 wax-like porcelain with a soft silky sheen. No stand, no base, no axis rods, no joints. The sculpture occupies about 40 percent of the frame, centered, with generous negative space. Warm side key light from the left draws a fine specular line along each ring; very faint shadow below. Background: flat warm dark surface #171512. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a desktop web page section 1440 px wide on a slightly lifted dark surface #171512, framed above and below by thin hairlines and deeper black bands #0F0E0C. Top left: a tiny uppercase grey eyebrow, then a very large heavy serif headline in ivory on two lines, greeked. Top right: a three-line grey sans-serif paragraph aligned to the bottom of the headline, greeked. Floating just above that paragraph, right-aligned, a small sculpture about 200 by 150 px: three hair-thin interlocked rings in brushed bronze #C7A479, matte patina #6F907F and ivory wax #F1ECE3, lit by warm side light with a faint shadow. Below the heading, a row of three equal bordered cards with thin 1 px grey outlines on black, each containing a small line icon at top left, a tiny number at top right, a medium serif title, two lines of small grey text and a small uppercase link with an arrow, all greeked; nothing 3D inside the cards. Restrained, spacious, editorial. No legible words. [ART STYLE] [ART NEGATIVES]
```

---

## 3. El oficio

### ART-O1-REF — «Velo de cera»

| Campo | Detalle |
|---|---|
| ID | `ART-O1-REF` |
| Concepto | AR-O1 «Velo de cera» · El oficio › `section.site-quote` (cita final, detrás del `blockquote`) |
| Objetivo | Validar que una silueta de hoja casi inmaterial, retroiluminada, enriquece la cita sin restar legibilidad (opacidad ≤0,22, desplazada un 8 % a la derecha). |
| Estilo visual | Luz a través de papel vegetal encerado; casi una marca de agua luminosa. |
| Materiales | Lámina finísima de papel vegetal o cera translúcida. Los nervios (central y 6-8 secundarios) son algo más opacos; el borde es suavemente irregular. |
| Paleta | Cuerpo marfil `#F1ECE3` muy transparente. Contraluz ámbar `#D4913F` que tiñe los nervios. Filo tinta `#3F4C6E` en el contorno opuesto. Fondo `#0F0E0C`. Las comillas en bronce `#C7A479` (solo en b). |
| Composición | (a) Hoja lanceolada centrada, ligeramente curvada y girada de canto 20-30°; ocupa ~60 % de la altura. (b) La hoja (≈520×360 px) va **detrás** de una cita centrada de dos líneas, desplazada a la derecha, y los nervios no cruzan los trazos principales del texto. |
| Iluminación | Contraluz cálido detrás de la hoja (es la fuente principal) y rim frío tenue del lado opuesto. Nada de luz frontal. |
| Fondo | Negro cálido `#0F0E0C`. |
| Relación de aspecto | (a) 3:2 · (b) 16:10 |
| Resolución sugerida | (a) 2400×1600 · (b) 2304×1440 |
| Transparencia | No. |
| Evitar | `[ART NEGATIVES]` + hoja de vidrio brillante, efecto holograma, rayos de luz, halo difuso que lea como humo, hoja verde viva, opacidad alta. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-o1-velo-cera_object.png` · `…/art-o1-velo-cera_context.png` |
| Dónde se usaría | `About.jsx` › `.site-quote`. Referencia del shader de fresnel y retroiluminación, y de la versión SVG (`feSpecularLighting`). |

**Prompt (a) — Object study**

```text
Object study, ethereal still life. The silhouette of a single tobacco leaf, lanceolate with a clear central midrib and six to eight curving secondary veins, made from an extremely thin translucent sheet like waxed vellum or tracing paper, floating slightly curved and turned edge-on at about 25 degrees. It is almost immaterial: perceived mainly through the light passing through it. The sheet is very transparent ivory #F1ECE3; the veins are slightly more opaque and are tinted by a warm resin amber #D4913F backlight glowing through them; the opposite contour carries a faint cool ink-blue #3F4C6E rim. Soft, slightly irregular natural leaf edge, delicate flex toward the tip. No front light, the backlight is the main source, but no visible light source or rays. Background: deep warm black #0F0E0C. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a wide closing section of a desktop web page, 1440 px wide, on deep warm black #0F0E0C with ample empty space. Centered: a small bronze #C7A479 opening quotation mark, below it a two-line large italic serif quotation in ivory #F1ECE3, centered, rendered as illegible greeked letterforms, and below that a tiny uppercase link with a small arrow. Behind the quotation, offset about 8 percent to the right, floats a very faint translucent leaf silhouette about 520 by 360 px, like backlit waxed vellum, opacity around 20 percent, its fine veins glowing softly in resin amber #D4913F and a faint ink-blue edge; it stays behind the text and never reduces its legibility. At the very top edge, the bottom of the previous section, a dark warm photo band, is cropped. At the bottom, a thin hairline and the start of a footer with a large greeked serif headline on the left and small link columns on the right. Calm, reverent, editorial. No legible words. [ART STYLE] [ART NEGATIVES]
```

---

### ART-O2-REF — «Nudo de tres capas»

| Campo | Detalle |
|---|---|
| ID | `ART-O2-REF` |
| Concepto | AR-O2 «Nudo de tres capas» · El oficio › `section#proceso` › `.site-section-heading--wide` (columna derecha bajo el lead, junto a las pills 01-03) |
| Objetivo | Validar el estado intermedio («a medio alinear») de tres toros concéntricos de grosor creciente hacia dentro: debe leerse como secuencia de decisiones que se ordenan, y el corte alineado debe sugerir capa/capote/tripa **sin** dibujar un cigarro. |
| Estilo visual | Escultura geométrica sobria; diagrama de oficio hecho objeto. |
| Materiales | Exterior (capa): satén con *sheen*, como piel de hoja. Medio (capote): papel de algodón mate (roughness ≈0,85) con filo patinado. Interior (tripa): cera densa con falso SSS (wrap light). |
| Paleta | Exterior bronce `#C7A479`. Medio `#3A332B` (surface aclarada) con filo pátina `#6F907F`. Interior clarete `#7B2F2B` con dispersión cálida hacia el ámbar `#D4913F` solo en el núcleo. Fondo `#0F0E0C`. |
| Composición | (a) Tres anillos concéntricos (radios 1 / 0,8 / 0,55; tubos 0,03 / 0,06 / 0,14), inclinados en ejes distintos: el exterior casi alineado de frente y los dos interiores aún rotados 25-40°. Variante opcional: el estado final, totalmente alineado y frontal, como segundo encuadre. (b) Objeto de ≈300×200 px a la derecha, bajo el lead de dos líneas, a la altura de las pills. |
| Iluminación | Clave lateral cálida izquierda, contra tinta `#3F4C6E` muy tenue y brillo interno cálido de la cera. |
| Fondo | Negro cálido `#0F0E0C`. |
| Relación de aspecto | (a) 3:2 · (b) 16:10 |
| Resolución sugerida | (a) 2400×1600 · (b) 2304×1440 |
| Transparencia | No. |
| Evitar | `[ART NEGATIVES]` + corte transversal con relleno de tabaco realista, diana o target, donut, logo circular, anillos del mismo grosor, metal brillante. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-o2-nudo-tres-capas_object.png` · `…/art-o2-nudo-tres-capas_context.png` |
| Dónde se usaría | `About.jsx` › `#proceso`. Referencia compartida con la estética de C2 (corte) y la alternativa CSS 3D. |

**Prompt (a) — Object study**

```text
Object study, sober geometric sculpture. Three concentric rings floating in space, getting thicker toward the center: an outer ring with a very thin tube in satin brushed-bronze-colored material #C7A479 with a soft leaf-skin sheen; a middle ring of medium thickness in matte cotton-paper-like material, dark warm grey-brown #3A332B, with a fine patina #6F907F edge; and an inner ring with a thick, dense tube made of deep claret #7B2F2B wax with soft subsurface glow, warmest at its core with a hint of resin amber #D4913F. The rings are caught halfway through aligning: the outer ring nearly faces the camera, the middle and inner rings are still tilted 25 to 40 degrees on different axes, as if three separate decisions are about to fall into order. Centered, about 50 percent of the frame. Warm side key light from the left, very faint ink-blue fill from behind. Background: warm black #0F0E0C. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a desktop web page section 1440 px wide on warm near-black #0F0E0C. Left: a tiny uppercase grey eyebrow line, a very large heavy serif headline in ivory #F1ECE3 on two lines, and under it a row of three small pill-shaped tabs with thin grey outlines, each with a tiny number and a short label, all greeked. Right column: a two-line grey sans-serif lead paragraph, greeked; below it, in the empty black area at the height of the pills, a sculpture about 300 by 200 px of three concentric floating rings thickening toward the center (thin satin bronze outer ring, medium matte paper ring with a patina #6F907F edge, thick claret #7B2F2B wax inner ring), caught halfway through aligning. A thin full-width hairline below the heading. Underneath, the start of a chapter: on the left a tiny eyebrow, a small line icon, a medium serif headline and grey paragraph lines; on the right a large dark card #171512 holding a photo of a single cured reddish-brown tobacco leaf. Spacious, editorial, restrained. No legible words. [ART STYLE] [ART NEGATIVES]
```

---

## 4. Biblioteca de hojas

### ART-L1-REF — «Anillo de espécimen»

| Campo | Detalle |
|---|---|
| ID | `ART-L1-REF` |
| Concepto | AR-L1 «Anillo de espécimen» · Biblioteca › overlay de hoja (`TechnicalSheet.jsx` › `figure.ts-image-side`; reutilizado en `ImmersiveView.jsx` › `.th-leaf-frame`) |
| Objetivo | Validar la conversión del círculo de 1 px que enmarca la hoja en un toro fino de resina inclinado ~68°, que pasa por detrás de la hoja en su mitad superior y por delante en la inferior (efecto órbita). Debe leerse como «pieza de colección», no como joya. |
| Estilo visual | Fotografía de espécimen de museo con un instrumento óptico mínimo; luz de gabinete. |
| Materiales | Anillo principal de resina o vidrio soplado translúcido (rugosidad ≈0,18, no cristal tallado), con iridiscencia de canto muy baja. Arco secundario (abierto, de 300°) en bronce cepillado con anisotropía. Hoja: capa curada real, arrugada y mate. |
| Paleta | Resina casi incolora con profundidad ámbar `#D4913F` (solo contraluz), canto pátina `#6F907F` → marfil `#F1ECE3`, arco bronce `#C7A479`. Hoja de capa: marrón rojizo `#8A5A3B`–`#9C6A48`. Fondo `#0F0E0C` con halo radial a `#171512`. |
| Composición | (a) Hoja de capa vertical y lanceolada, centrada (~70 % de la altura). El anillo, inclinado, se lee como una elipse ancha que la abraza; un arco de bronce más fino va en otro plano. Variantes opcionales: Capote (2 anillos) y Tripa (3 arcos). (b) Ficha «La hoja»: el anillo sustituye al círculo fino que inscribe la hoja en la mitad izquierda. |
| Iluminación | Clave cálida lateral izquierda (rasante sobre la hoja) con un destello pátina muy leve en el canto del anillo y relleno tinta `#3F4C6E` mínimo. |
| Fondo | Negro cálido con halo radial muy suave detrás de la hoja (como en la captura). |
| Relación de aspecto | (a) 4:5 · (b) 16:10 |
| Resolución sugerida | (a) 1638×2048 · (b) 2304×1440 |
| Transparencia | No. |
| Evitar | `[ART NEGATIVES]` + anillo de compromiso, halo de santo, aro de neón, iridiscencia arcoíris, anillo grueso, órbita planetaria con planetas, hoja verde. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-l1-anillo-especimen_object.png` · `…/art-l1-anillo-especimen_context.png` |
| Dónde se usaría | `src/components/leaf-library/TechnicalSheet.jsx` e `ImmersiveView.jsx`. Referencia de material para el único transmisivo de la vista y de la alternativa SVG con dos elipses. |

**Prompt (a) — Object study**

```text
Object study, museum specimen photograph. A single cured tobacco wrapper leaf, lanceolate, crinkled and matte in reddish browns #8A5A3B to #9C6A48, with a dark central midrib and herringbone secondary veins, standing vertically and centered, occupying about 70 percent of the frame height. Around it, a very thin ring of translucent hand-blown resin, its tube only about 1.5 percent of its radius thick, tilted about 68 degrees to the camera so it reads as a wide ellipse embracing the leaf: the upper half of the ring passes behind the leaf and the lower half passes in front of it. The resin is almost colorless, with depth that glows faintly resin amber #D4913F from backlight and a very subtle patina #6F907F to ivory thin-film tint on its edge. A second, even finer open arc of brushed bronze #C7A479, about 300 degrees, sits on another plane. Warm low raking key light from the left reveals the leaf relief; a tiny patina glint on the ring edge. Background: warm black #0F0E0C with a very soft radial halo of #171512 behind the leaf. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a full-screen dark leaf detail overlay, 1440 px wide, warm black #0F0E0C. Top bar: a small language selector at far left, a small outlined back button in the center left, a close cross icon, and at top right a tiny uppercase label over a small bold serif name, all greeked; a thin hairline below the bar, then a centered row of two small tabs, the first underlined. Left half: a tiny uppercase eyebrow, then a large vertical cured reddish-brown tobacco wrapper leaf centered inside the figure, surrounded by a very thin translucent resin ring tilted about 68 degrees so it reads as a wide ellipse, passing behind the top of the leaf and in front of the bottom, with a faint amber depth and a whisper of patina #6F907F on its edge, plus a finer brushed bronze open arc on another plane; it replaces a former flat 1 px circle. Below the figure a thin hairline with a small serif name and a tiny origin label. Right half: tiny uppercase eyebrow, a very large serif title, a one-line subtitle, a two-column data row between hairlines, a small section heading, a short paragraph, a row of three tiny radio options, a small link with an arrow, a wide light ivory pill button and an outlined card below it. Bottom bar: previous and next links at the edges and a tiny counter in the center. All text greeked and illegible. [ART STYLE] [ART NEGATIVES]
```

---

### ART-L2-REF — «Sellos de función»

| Campo | Detalle |
|---|---|
| ID | `ART-L2-REF` |
| Concepto | AR-L2 «Sellos de función» · Biblioteca › `header.ls-group-heading` (Capa / Capote / Tripa; franja central vacía) |
| Objetivo | Validar tres pequeñas esculturas mates como pesos de papel que expresan la función de cada grupo sin texto: Capa envuelve, Capote abraza, Tripa es el corazón. Deben distinguirse a ≈140×110 px y no parecer iconos 3D de SaaS. |
| Estilo visual | Pesos de papel o esculturas de mesa de taller; cera de abeja y jabón mate. |
| Materiales | Cera de abeja o jabón mate (rugosidad ≈0,65, *sheen* suave con tinte tinta), con falso subsurface en los cantos. Las láminas de tripa llevan una fibra de hoja en grises como textura de rugosidad. |
| Paleta | Degradado de surface `#211E19` → bronce `#C7A479`. Acento de canto por grupo: Capa = contraluz ámbar `#D4913F`; Capote = pátina `#6F907F`; Tripa = clarete `#7B2F2B` en el canto interior de los pliegues. *Sheen* tinta `#3F4C6E`. |
| Composición | (a) Tríptico en fila sobre un plano oscuro: cinta ancha con media torsión (casi Möbius) · dos cintas estrechas entrelazadas · abanico de cinco láminas plegadas en acordeón. Mismo tamaño y separación, centradas. (b) Cabecera del grupo Tripa (la del abanico), con la escultura en la franja central entre el título y el párrafo. |
| Iluminación | Luz rasante de estudio desde la izquierda, sombras de contacto suaves y cantos encendidos por el acento de cada pieza. |
| Fondo | (a) `#0F0E0C` con un plano de apoyo `#171512` apenas visible. (b) Página. |
| Relación de aspecto | (a) 3:1 · (b) 16:10 |
| Resolución sugerida | (a) 3072×1024 · (b) 2304×1440 |
| Transparencia | No (el sprite de producción con alfa sale del render 3D; ver §7). |
| Evitar | `[ART NEGATIVES]` + iconos *clay* de colores planos, plástico brillante, aspecto de juguete, cinta de regalo, origami de papel blanco, forma de cigarro en el haz de tripa. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-l2-sellos-funcion_object.png` · `…/art-l2-sellos-funcion_context.png` |
| Dónde se usaría | `src/pages/LeafLibrary.jsx` › `header.ls-group-heading` (solo con `filter === 'ALL'`). Base de los sprites prerenderizados. |

**Prompt (a) — Object study**

```text
Object study, triptych of three small desk sculptures in a row, equal size and spacing, on a barely visible dark surface. All are made of matte beeswax-like material with a soft dusty sheen, gradient from dark surface brown #211E19 to brushed bronze #C7A479, with gentle subsurface glow at thin edges. Left: one wide ribbon with a single half twist, almost a Moebius band, its thin edge lit from behind with a soft resin amber #D4913F glow. Center: two narrower ribbons interwoven around each other, their edges catching a patina #6F907F tint. Right: a bundle of five thin sheets folded in accordion pleats and slightly fanned open, with a faint cured-leaf fiber texture in the wax, the inner edges of the folds touched with deep claret #7B2F2B. Low raking studio light from the left, soft contact shadows. Background: warm black #0F0E0C. Quiet, tactile, craft paperweights. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a desktop catalog page 1440 px wide on warm black #0F0E0C. Upper part: the bottom of a grid of dark rounded cards with thin grey outlines, each showing a cured brown tobacco leaf photo on top and greeked small uppercase origin, a bold serif name, two lines of grey text and a small uppercase link with an arrow underneath. Then a thin full-width hairline and a group header: on the left a tiny uppercase eyebrow, a bold serif group title and a short grey subline; on the right a two-line grey sans-serif paragraph. In the empty central gap between them floats a small matte wax sculpture about 140 by 110 px: five thin accordion-pleated sheets fanned open, warm bronze-brown wax with deep claret #7B2F2B on the inner fold edges and a soft contact shadow. Below the header, the top of a four-column grid of dark rounded cards, each with a tiny light label chip at top left and a large crinkled cured tobacco leaf photo. All text greeked and illegible. Calm, collection-catalog mood. [ART STYLE] [ART NEGATIVES]
```

---

## 5. Crea tu cigarro y Guía de la mezcla

### ART-C1-REF — «Haz suspendido» (AR-C1, **no** la anatomía C1)

| Campo | Detalle |
|---|---|
| ID | `ART-C1-REF` |
| Concepto | AR-C1 «Haz suspendido» · Crea tu cigarro › `BlendSummary.jsx` › `header.craft-summary__header` (franja superior de 300×150 px del panel «Tu mezcla», pasos 01-03) |
| Objetivo | Validar el estado «mezcla completa» de la composición abstracta: tres láminas de tripa en paralelo, la cinta de capote en espiral abierta y la de capa en hélice por fuera. Debe leerse como capullo suspendido y abierto, **nunca** como cigarro (extremos siempre abiertos). |
| Estilo visual | Escultura suspendida de taller; ensamblaje de materias. |
| Materiales | Láminas de tripa: hoja curada real, mate y fibrosa, curvadas a medio enrollar. Capote: cinta de resina translúcida con fibra embebida. Capa: cinta más ancha, opaca, de piel de hoja satinada. |
| Paleta | Tripa en marrones reales `#5E3F28`–`#7A5236`. Capote: resina con contraluz ámbar `#D4913F`. Capa: colorado `#8A5A3B` satinado. Un solo destello clarete `#7B2F2B` en el punto donde la capa se cierra. Fondo card `#171512`. |
| Composición | (a) Composición horizontal y alargada (2:1). Las tres láminas van paralelas al eje horizontal, ligeramente separadas. La cinta ámbar las rodea con una sola vuelta abierta y la cinta de capa las envuelve por fuera en hélice suelta, dejando ver el interior; los extremos quedan desflecados y abiertos. (b) Ocupa la franja superior del panel derecho, a todo su ancho (300×150 px), por encima del kicker. |
| Iluminación | Clave cálida lateral, contraluz que enciende la resina del capote y relleno tinta mínimo. |
| Fondo | `#171512`. |
| Relación de aspecto | (a) 2:1 · (b) 16:10 |
| Resolución sugerida | (a) 2400×1200 · (b) 2304×1440 |
| Transparencia | No. |
| Evitar | `[ART NEGATIVES]` + cilindro compacto, perilla o cabeza redondeada, pie cortado plano, anilla, forma de puro reconocible, láminas verdes. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-c1-haz-suspendido_object.png` · `…/art-c1-haz-suspendido_context.png` |
| Dónde se usaría | `src/components/BlendSummary.jsx` (canvas compartido de Craft con AR-C2 y AR-C3). Referencia para el SVG de reduced motion generado en vivo. |

**Prompt (a) — Object study**

```text
Object study, suspended abstract assemblage, horizontal composition. Three thin, gently curled sheets of real cured tobacco leaf, matte and fibrous in browns #5E3F28 to #7A5236, each half rolled along its length, floating parallel to each other along a horizontal axis with small gaps between them. Around them, a single narrow ribbon of translucent resin with embedded fibers makes one loose open spiral turn, its depth glowing resin amber #D4913F where backlight passes through. Outside that, a wider opaque ribbon of satin cured wrapper leaf in colorado brown #8A5A3B winds around the bundle in a loose helix, leaving clear gaps so the inner sheets remain visible. A single tiny claret #7B2F2B glint where the outer ribbon closes on itself. Both ends of the assemblage stay open, ragged and airy, like an abstract cocoon; it must never read as a cigar. Warm side key light, soft backlight through the resin, faint shadow. Background: warm dark card #171512. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a desktop composition-table page 1440 px wide on warm black #0F0E0C. Top: a slim navigation bar with a small monochrome illustrated emblem and greeked brand text at left, small uppercase menu items, and a light rectangular button at right. Below: a tiny uppercase eyebrow, a large heavy serif page title, a grey subtitle, and a thin hairline. Then a horizontal four-step progress line of small circles with labels, two of them checked. Main area left: a grid of tall dark cards with thin grey outlines, each showing a cured tobacco leaf photo, a tiny label chip, a serif name, small uppercase origin and grey text. Right: a narrow bordered side panel about 300 px wide on #171512. At the very top of that panel, a new 300 by 150 px strip holds a floating abstract assemblage: three half-curled cured leaf sheets in parallel, wrapped by one open spiral of glowing amber #D4913F translucent resin ribbon and a loose outer helix of satin brown wrapper ribbon, ends open and airy. Under it: a tiny uppercase kicker, a bold serif panel title, then list sections separated by hairlines, each with a small uppercase label, a small count, rows with check marks and small remove crosses, and a small add link; at the bottom, a short grey status line and an outlined pill button. Further down at right, an outlined pill button with a film icon. All text greeked and illegible. [ART STYLE] [ART NEGATIVES]
```

---

### ART-C2-REF — «Cinta de capa»

| Campo | Detalle |
|---|---|
| ID | `ART-C2-REF` |
| Concepto | AR-C2 «Cinta de capa» · Crea tu cigarro, paso 03 Capa › `LeafGrid.jsx` › `.ls-grid-container` (columnas 3-4, junto a las 2 tarjetas de capa) |
| Objetivo | Validar una gran cinta escultórica de hoja laqueada en cera que llena los ≈520 px vacíos del paso Capa y funciona como «probador» de capas. Hay que comprobar el borde encendido a contraluz y la lectura de «envolver» sin cigarro. |
| Estilo visual | Escultura de hoja a gran escala; fotografía de producto editorial. |
| Materiales | Lámina de hoja de capa curada, laqueada en cera (*sheen* ≈0,8 con tinte ámbar, clearcoat bajo y mate), con nervaduras en relieve suave. Los bordes ondulados e irregulares son translúcidos y dejan pasar la luz. |
| Paleta | Variante Habana: colorado claro `#9C6A48`. Variante Pensilvania: maduro oscuro `#5A3A26`. Bordes encendidos en ámbar `#D4913F`, relleno trasero tinta `#3F4C6E` y un trazo clarete `#7B2F2B` opcional (el «sello» al seleccionar). Fondo `#0F0E0C`. |
| Composición | (a) Cinta ancha y fina, de pie en vertical, describiendo una hélice suelta de ~1,5 vueltas; ocupa ~75 % de la altura, con sombra de contacto difusa debajo. Generar las dos variantes de color lado a lado o en dos archivos. (b) La cinta va en el hueco a la derecha de las dos tarjetas de capa, con la misma altura y línea de base que ellas. |
| Iluminación | Contraluz cálido que enciende los bordes, clave lateral suave y relleno frío tinta desde atrás para separar la cinta del negro. |
| Fondo | Negro cálido `#0F0E0C`. |
| Relación de aspecto | (a) 4:5 · (b) 16:10 |
| Resolución sugerida | (a) 1638×2048 · (b) 2304×1440 |
| Transparencia | No. |
| Evitar | `[ART NEGATIVES]` + hélice cerrada como tubo, cinta de seda o regalo, bordes rectos de papel, superficie plástica, peana o pedestal. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-c2-cinta-capa_object.png` (+ `_object-maduro.png` opcional) · `…/art-c2-cinta-capa_context.png` |
| Dónde se usaría | `src/components/LeafGrid.jsx` (paso CAPA). Base de los pósters de reduced motion y del sprite alternativo (§7). |

**Prompt (a) — Object study**

```text
Object study, large leaf sculpture. A wide, thin band of cured tobacco wrapper leaf, lacquered in a soft matte wax finish, standing upright and describing a loose open helix of about one and a half turns, occupying about 75 percent of the frame height. The surface shows gentle raised veins and the fine crinkle of real cured leaf in colorado brown #9C6A48; its long edges are slightly irregular and wavy like a natural leaf margin, and thin enough to be translucent, glowing resin amber #D4913F where warm backlight passes through them. A faint cool ink-blue #3F4C6E fill from behind separates the band from the darkness. Optional single hairline of claret #7B2F2B light tracing along one edge. Diffuse soft contact shadow beneath, no pedestal. Background: warm black #0F0E0C. Make a second variant with the band in dark maduro brown #5A3A26 under identical lighting. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a desktop composition-table page 1440 px wide on warm black #0F0E0C. Top: slim navigation bar with greeked menu items and a light button at right; below, a tiny eyebrow, a large heavy serif title, a grey subtitle, an outlined pill button at right, and a thin hairline. A four-step progress line of small circles, the first two checked, the third active. Under it, a small step heading with greeked text, a back link and a forward link on the right. Left area: only two tall dark cards with thin grey outlines, each with a tiny label chip, a single cured wrapper leaf photo (one lighter reddish-brown, one darker), a serif name, small uppercase origin and two lines of grey text. To the right of these two cards, in the large empty black space of the same row, stands a big sculptural ribbon of wax-lacquered cured wrapper leaf in a loose upright helix of one and a half turns, same height and baseline as the cards, its wavy edges glowing amber #D4913F from backlight, a soft contact shadow, no frame or card around it. Far right: a narrow bordered side panel #171512 with greeked list sections, check marks and an outlined pill button, and below it another outlined pill button. All text greeked and illegible. [ART STYLE] [ART NEGATIVES]
```

---

### ART-C3-REF — «Pliegue de dentro hacia fuera»

| Campo | Detalle |
|---|---|
| ID | `ART-C3-REF` |
| Concepto | AR-C3 «Pliegue de dentro hacia fuera» · Guía de la mezcla › `TobaccoGuidePage.jsx` › `header.tg-intro` (mitad derecha vacía junto a «El arte de *combinar*.») |
| Objetivo | Validar el único objeto claro del set: una lámina de papel de algodón marfil translúcido plegada en tres capas, parcialmente enrollada y abierta por un lado. La luz que se suma en los solapes debe revelar el «dentro» sin duplicar el corte C2 de debajo. |
| Estilo visual | Origami lento; papel de algodón a contraluz; editorial y luminoso pero contenido. |
| Materiales | Papel de algodón verjurado translúcido (rugosidad alta) con fibras visibles y vetas finas, *sheen* suave y bordes con barba de papel hecho a mano. |
| Paleta | Marfil `#F1ECE3` al ~85 %. Luz transmitida en los solapes con tinte pátina `#6F907F`. Una única vena fina celadón `#BCC8A4`. Fondo `#0F0E0C`. |
| Composición | (a) Una sola lámina plegada en tres capas concéntricas, enrollada en parte y abierta por un lado (no es un cilindro cerrado), flotando ligeramente girada a tres cuartos; ocupa ~55 % del encuadre. (b) Ocupa ≈420×260 px en la mitad derecha de la intro, alineada con el H1. |
| Iluminación | Contraluz principal que atraviesa el papel y suma luz en los solapes, clave lateral cálida muy suave y sombras interiores profundas. |
| Fondo | Negro cálido `#0F0E0C`. |
| Relación de aspecto | (a) 3:2 · (b) 16:10 |
| Resolución sugerida | (a) 2400×1600 · (b) 2304×1440 |
| Transparencia | No. |
| Evitar | `[ART NEGATIVES]` + papel blanco puro brillante, pergamino envejecido o manchado, origami de grulla o figurativo, tubo cerrado, rollo de papel de fumar, lámina sobreexpuesta que deslumbre. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-c3-pliegue_object.png` · `…/art-c3-pliegue_context.png` |
| Dónde se usaría | `src/components/TobaccoGuidePage.jsx` (intro, scrub con `.tg-scroll`). Referencia para la versión CSS 3D de bisagras. |

**Prompt (a) — Object study**

```text
Object study, slow origami of light. A single sheet of translucent handmade cotton laid paper in ivory #F1ECE3 at about 85 percent brightness, with visible fibers, faint laid lines and soft deckled edges, folded over itself into three concentric layers and partially rolled, clearly open on one side so it is never a closed tube. It floats turned at a three-quarter angle, occupying about 55 percent of the frame. Strong soft backlight passes through the paper; where layers overlap the transmitted light accumulates and takes on a cool patina #6F907F tint, revealing the inside structure. A single fine vein line of pale celadon #BCC8A4 runs across one layer, like the memory of a plant. Very soft warm side key light, deep gentle shadows between the folds. High roughness, no gloss. Background: warm black #0F0E0C. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a full-screen guide overlay 1440 px wide on warm black #0F0E0C. Top bar: a small language selector at left, a small outlined back button, a centered small bold serif title with a tiny grey breadcrumb, and a close cross at right; a thin hairline, then a centered row of three small tabs with tiny line icons and numbers, the first underlined. Left half: a tiny uppercase eyebrow, a very large serif headline on one line whose last word is in grey italic, and a two-line grey paragraph, all greeked. In the empty right half, aligned with the headline, floats a sheet of translucent ivory cotton paper about 420 by 260 px, folded into three layers and partly rolled, open on one side, backlit so the overlaps glow with a soft patina #6F907F tint and one fine celadon vein. Below: a full-width hairline, then a large numeral in serif with a small eyebrow and a bold serif section heading; underneath, at bottom left, the top of a flat diagram of three thin concentric outline circles with tiny labels, and at right three small pill tabs, a small eyebrow, a serif heading and grey paragraph lines. Bottom bar: a small grey note at left and a light ivory pill button at right. All text greeked and illegible. [ART STYLE] [ART NEGATIVES]
```

---

## 6. Acceso (opcional)

### ART-A1-REF — «Umbral»

| Campo | Detalle |
|---|---|
| ID | `ART-A1-REF` |
| Concepto | AR-A1 «Umbral» (opcional) · Acceso › `Login.jsx` › `.site-login__visual` (franja negra vertical de ≈270 px entre la hoja de fondo y el formulario) |
| Objetivo | Decidir si merece la pena: una cuchilla vertical de resina con fibra de hoja atrapada, de canto, en la costura entre visual y formulario. Debe leerse como «la hoja se convierte en objeto» sin distraer del formulario. |
| Estilo visual | Especimen en resina, estrecho y vertical; escultura de umbral. |
| Materiales | Resina colada gruesa, con transmisión y bordes biselados suaves, que contiene una lámina de hoja curada oscura con fibra visible. |
| Paleta | Volumen ámbar `#D4913F` muy oscurecido por la profundidad (contraluz). Hoja interior `#3E2A1C`–`#5E3F28`. Canto pátina `#6F907F`. Fondo `#0F0E0C`. |
| Composición | (a) Forma lanceolada estrecha (≈1:6, ~60×360 px a escala de página) en vertical y de canto a ~30°, centrada, con mucho negro alrededor. (b) A media altura, en la franja negra entre el borde derecho de la gran hoja de fondo y el formulario. |
| Iluminación | Contraluz cálido que hace brillar el volumen, filo pátina en un canto y clave lateral mínima. |
| Fondo | Negro cálido `#0F0E0C`. |
| Relación de aspecto | (a) 9:16 · (b) 16:10 |
| Resolución sugerida | (a) 1152×2048 · (b) 2304×1440 |
| Transparencia | No (la pieza de producción con alfa es vídeo prerenderizado; ver §7). |
| Evitar | `[ART NEGATIVES]` + cuchillo o arma, espada, cristal de cuarzo, obelisco brillante, candado o símbolos de seguridad, rojo de error. |
| Nombre de archivo sugerido | `docs/3d-exploration/refs/art/art-a1-umbral_object.png` · `…/art-a1-umbral_context.png` |
| Dónde se usaría | `src/pages/Login.jsx` (solo escritorio). Base del vídeo con alfa (§7). |

**Prompt (a) — Object study**

```text
Object study, vertical specimen. A narrow lanceolate blade-like slab of thick cast resin, about six times taller than wide, with softly beveled rounded edges, standing upright and turned edge-on at about 30 degrees, floating in the center of a tall frame with generous dark space around it. Trapped inside the resin is a thin sheet of dark cured tobacco leaf, #3E2A1C to #5E3F28, with visible fibers and veins following the length of the slab. Warm backlight passes through, so the resin depth glows a deep dark resin amber #D4913F, deepening toward the thick center; one long edge carries a fine patina #6F907F reflection. Minimal soft side key light, faint floating shadow. It must read as a natural-history object, never as a weapon or a crystal. Background: warm black #0F0E0C. [ART STYLE] [ART NEGATIVES]
```

**Prompt (b) — In-context mockup**

```text
In-context UI mockup reference, not final design: a desktop private access page 1440 px wide on warm black #0F0E0C. Top: a slim navigation bar with a small monochrome illustrated emblem and greeked brand text at left, small uppercase menu items, a language selector and a light rectangular button at right. Left half: a huge, very dim cured dark brown tobacco leaf photograph fading into black, over which sit a tiny uppercase eyebrow, a three-line very large serif headline whose last line is in grey italic, a two-line grey paragraph and a numbered list of four short items, all greeked. Right half: a small back link, a circular outlined lock icon, a tiny uppercase eyebrow, a two-line large serif headline, a two-line grey paragraph, two labeled rectangular dark input fields, a wide light ivory pill button and a small grey line of text under it, all greeked. In the empty vertical black strip between the right edge of the leaf photo and the form, at mid height, floats a slim vertical resin slab about 60 by 360 px, edge-on, glowing dark amber with a trapped leaf sheet inside and a fine patina edge. It never overlaps the form. All text greeked and illegible. [ART STYLE] [ART NEGATIVES]
```

---

## 7. Assets de producción derivados (render 3D, no generación de imagen)

> Estos assets **no se piden a un modelo de imagen**. Salen de **renderizar la escena 3D real** (R3F con captura offline o Blender) una vez aprobada la referencia ART correspondiente. Así la forma, el color y la iluminación coinciden con lo que se ve en vivo. Solo se listan los conceptos que lo necesitan de verdad.

| Asset | Concepto | Para qué | Especificación de render |
|---|---|---|---|
| `SPR-L2-{capa,capote,tripa}` | AR-L2 | Alternativa sin three.js (0 KB de `vendor-3d`) en las cabeceras de la biblioteca | 3 secuencias de giro (turntable) de **24 frames** cada una, 15° por frame (360°), cámara fija y escultura girando sobre Y. Cuadro de **280×220 px @1x / 560×440 @2x** con **alfa recto**. Entrega: sprite sheet WebP con alfa (6×4 frames, ≤120 KB por grupo) y un PNG por frame como maestro fuera de `public/`. Pose final de reposo = frame 0 (vale para reduced motion y móvil). Ruta propuesta: `public/img/3d/art/spr-l2-{grupo}.webp`. |
| `SPR-C2-{habana,pensilvania}` | AR-C2 | Alternativa sin WebGL y pósters de reduced motion del paso Capa | 2 secuencias de **40 frames** (de relajada, 1,5 vueltas, a cerrada, 2,5 vueltas) por capa, cuadro de **520×460 px @1x / 1040×920 @2x**, alfa. Sprite sheet WebP con alfa + el último frame como póster WebP (`…-poster.webp`). Textura de la hoja = thumb real de cada capa. |
| `VID-A1-{idle,focus,enter}` | AR-A1 | Recomendado por F en lugar de R3F en una página que solo es puerta de entrada | **idle**: 1 vuelta completa sobre Y, 10 s a 24 fps (240 frames), en bucle sin costura. **focus**: giro de 90° y parada de frente, 0,6 s (15 frames). **enter**: la cuchilla se enrolla en anillo, 0,6 s (15 frames). Cuadro de **240×720 px** (2x de 120×360). Dos formatos con alfa: **WebM VP9** (`yuva420p`, `-c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32`) para Chrome y Firefox, y **HEVC con alfa** (`.mov`, `hvc1`, codificado en macOS con `avconvert`/`VideoToolbox`) para Safari, más un póster WebP del frame 0 (reduced motion). Peso objetivo ≤400 KB por clip. |
| `PST-{H1,H2,H3,O1,O2,L1,C3}` | Varios | Pósters de fallback (<1100 px, `saveData`, reduced motion) en el mismo ancla | 1 frame por concepto renderizado desde la escena final en su pose de reposo, al tamaño del ancla @2x, **WebP con alfa** (≤60 KB). AR-H2 y AR-L1 se renderizan con la transmisión activa para conservar la refracción. Si la versión final de H1, H3, O1 u O2 es SVG, el póster es el propio SVG y este asset sobra. |

AR-C1 no necesita asset derivado, porque su fallback es un SVG generado en vivo según la selección.
