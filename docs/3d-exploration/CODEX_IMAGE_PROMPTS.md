# CODEX_IMAGE_PROMPTS — Prompts de assets para la exploración 3D (Agente D · Asset & Prompt Designer)

> Catálogo histórico de prompts y alternativas, conservado como referencia. La generación prioritaria y el set seleccionado ya se completaron: [estado vigente](PROGRESS.md), [galería](refs/art/README.md). El texto de los prompts no es una solicitud de generación o implementación actual.

> Fecha: 2026-10-19 · Repositorio `tobacco` (`main`, commit `0451152`). Documento solo de especificación: no se generaron imágenes, no se modificó código y no se instaló nada.
> Fuentes: `docs/3d-exploration/02_3D_CONCEPTS.md` (§2 conceptos, §4 lista de assets), `design-review/generated-imagery.md` y `design-review/mezclas-imagen.md` (tono de prompt ya usado en el proyecto), `src/styles/tokens.css`, `src/data/leaves.js` y revisión visual de `public/assets/thumbs/*.webp`, `public/img/about.png`, `design-review/desktop/tu-cigarro.png` y `design-review/desktop/guia-mezcla.png`.
> Estructura y explicaciones en español; **los prompts van en inglés**.

## Progreso

- [x] Lectura de contexto (02_3D_CONCEPTS, prompts previos, tokens, leaves.js)
- [x] Revisión visual de imágenes existentes
- [x] Índice
- [x] Bloques de assets (6 + 2 series por hoja)
- [x] Concept art de referencia (C1, C2, C3)
- [x] Modelos 3D (no imagen): GLB-CIGAR-01
- [x] Conceptos procedurales

---

## 0. Verificaciones en disco y reglas comunes

**Verificado en disco (2026-10-19)**
- `public/img/3d/` **no existe**. Ninguno de los assets de este documento existe todavía; todas las rutas de destino son propuestas.
- Existen: `public/assets/thumbs/*.webp` (21, WebP con alfa, ~400×825) y `public/assets/full/*.png` (21, PNG con alfa, 1939×4000), `public/img/about.png`, `public/img/oficio-manos-editorial-v1.jpg`, `public/img/mezclas-mesa-editorial-v1.jpg`.
- `src/data/leaves.js` **no define colores** por hoja (solo `id`, `category`, `name`, `origin`, `fullImg`, `thumbImg`, `description`, `hasInmersive`). Los tonos de este documento son aproximaciones visuales de las thumbs; en implementación se muestrean en runtime o con script.
- `hasInmersive: true` solo en **2 hojas**: `capa-habana` y `capa-pensilvania`. Matiz: ese flag hoy solo pinta el indicador en `src/components/LeafGrid.jsx:139`; en `src/pages/LeafLibrary.jsx:185` la pestaña inmersiva se ofrece para cualquier hoja.
- `public/img/about.png` lleva un sello circular con monograma "T" (logo de la marca) en la parte inferior y sombra proyectada horneada: no es reutilizable como textura limpia.

**Observaciones visuales de las hojas reales (para que lo generado encaje)**
- Hojas curadas completas, vista cenital, recortadas con alfa, sin sombra. Superficie muy arrugada (crinkled), nervio central oscuro y marcado, venas secundarias en espiga, bordes irregulares y algo rotos, peciolo/tallo visible abajo.
- Tonos: capas en marrón rojizo medio (~`#8A5A3B`–`#9C6A48`), tripas más oscuras y moteadas (~`#5E3F28`–`#7A5236`), con brillos cálidos tenues. Ningún verde.

**Paleta de proyecto (tokens)**: bg `#0F0E0C` · card `#171512` · surface `#211E19` · bronce `#C7A479` · marfil `#F1ECE3` · texto secundario `#B5ADA1` · texto dim `#8F887E` · beige vídeo `#D6C8B9`.

**Bloque negativo común (se anexa a todos los prompts; abreviado como `[COMMON NEGATIVES]`)**

```text
No smoke, no vapor, no haze, no fire, no embers, no glowing tip, no ash, no ashtray, no lighter, no matches, no lit or partially smoked cigar, no person smoking, no mouth, no lips, no faces, no cigar band, no ring, no label, no logo, no monogram, no seal, no brand, no text, no lettering, no numbers, no watermark, no signature, no alcohol, no glasses, no coffee cups, no luxury clichés (no gold foil, no leather armchair, no whisky), no green fresh leaves, no plastic sheen, no HDR, no oversaturation, no excessive bokeh.
```

**Convenciones**
- "Tipo" usa tres valores: **imagen editorial**, **textura para geometría 3D** o **concept art de referencia**.
- Color space: albedo/base color y fondos = **sRGB**; normal, height y roughness = **lineal** (en three.js: `texture.colorSpace = THREE.SRGBColorSpace` solo para albedo; `NoColorSpace` para los datos).
- Formatos de entrega: fuente maestra en PNG 16-bit (o 8-bit si la herramienta no da más), y derivados web en WebP (imágenes) o KTX2/Basis (texturas WebGL).

---

## 1. Índice

| ID | Concepto | Tipo | Prioridad | Archivo sugerido |
|---|---|---|---|---|
| `TEX-FILLER-01` | C2, C1 | Imagen 2D con alfa (cara de corte) + textura opcional de tapa en 3D | **P1** | `public/img/3d/tex-filler-01.webp` |
| `IMG-PAPER-01` | C3 | Textura tileable 2D (fondo CSS) | **P1** | `public/img/3d/img-paper-01.webp` |
| `TEX-WRAP-01` | C1 | Textura para geometría 3D, tileable, albedo (+ normal/roughness derivados) | **P2** | `public/img/3d/tex-wrap-01_albedo.ktx2` (+ `.webp` fallback) |
| `IMG-LEAF-TRIO-01` | A2 | 3 imágenes editoriales con alfa | P3 | `public/img/3d/leaf-trio-01_{tripa,capote,capa}.webp` |
| `TEX-LEAF-HGT-xx` | D1 | Serie por hoja: height map (derivado, no generado) | P4 | `public/img/3d/leaves/{leafId}_height.webp` |
| `TEX-LEAF-NRM-xx` | A1, D1 | Serie por hoja: normal map (derivado, no generado) | P4 | `public/img/3d/leaves/{leafId}_normal.ktx2` |
| `REF-C1-01` | C1 | Concept art de referencia (no final) | Ref. | `docs/3d-exploration/refs/ref-c1-anatomia.png` |
| `REF-C2-01` | C2 | Concept art de referencia (no final) | Ref. | `docs/3d-exploration/refs/ref-c2-corte-relieve.png` |
| `REF-C3-01` | C3 | Concept art de referencia (no final) | Ref. | `docs/3d-exploration/refs/ref-c3-espiral.png` |
| `GLB-CIGAR-01` | C1 (fase 2, opcional) | **Modelo 3D GLB — no se genera con prompts de imagen** | P5 / opcional | `public/models/glb-cigar-01.glb` |

Prioridad alineada con el orden de implementación de `02_3D_CONCEPTS.md` §5 (C2 → D2/B1 → C3 → C1 → A2 → B2 → A1/D1).

---

## 2. Assets de imagen y textura

### TEX-FILLER-01 — Cara de corte de la tripa

| Campo | Detalle |
|---|---|
| ID | `TEX-FILLER-01` |
| Concepto | C2 "Corte transversal en relieve" (cara del disco central "Tripa"); C1 "Anatomía de tu cigarro" (tapa del pie de los haces de tripa) |
| Objetivo | Dar materia real al disco "Tripa" del esquema de la guía, hoy un círculo plano `#211E19`, sin convertir el diagrama en una ilustración. Debe leerse como "hojas plegadas por dentro" a 120–250 px de diámetro. |
| Tipo | **Imagen editorial 2D con alfa** (C2, como `background-image`/`<img>` dentro del disco). En C1: **textura para geometría 3D** aplicada a la tapa circular (`CircleGeometry`) del pie; no tileable, UV planar centrado; canal **albedo**, sRGB. |
| Estilo visual | Fotografía técnica de producto, macro, frontal, sobria. |
| Materiales | Hoja de tabaco curada, plegada en acordeón y apretada; fibras y nervios cortados. |
| Paleta | Fibras `#4A3220`–`#7A5236`, luces `#9C6A48`, sombras hacia `#0F0E0C`; fondo transparente. |
| Composición | Disco perfectamente circular, centrado, ocupando el 92 % del lienzo; corte plano y limpio; los pliegues forman un patrón radial/serpenteante irregular; **sin** anillo exterior de capa ni de capote. |
| Iluminación | Luz rasante cálida (~3200 K) desde arriba-izquierda a ~20°, que revela el relieve de los pliegues; sin brillo especular. |
| Fondo | Transparente (alfa). Si la herramienta no da alfa: negro puro `#000000` para recortar con máscara circular. |
| Relación de aspecto | 1:1 |
| Resolución sugerida | Generar 2048×2048; entregar 1024×1024 (C1) y 512×512 (C2). |
| Transparencia | **Sí.** Alfa fuera del círculo; borde del disco antialiased 1–2 px. Si sale sobre negro, recortar con máscara circular vectorial (no varita). Premultiplicar en exportación WebP. |
| Nombre / ruta | `public/img/3d/tex-filler-01.webp` (1024) y `public/img/3d/tex-filler-01@512.webp`; maestro `tex-filler-01_master.png` fuera de `public/` (p. ej. `design-assets/3d/`). |
| Dónde se usaría | `src/components/TobaccoGuidePage.jsx` (`.tg-ring-*` de la tripa; estilos en `src/styles/tobacco-guide-page.css`); `src/components/CigarResult.jsx` (escena C1). |

**Prompt completo**

```text
Use case: photorealistic technical macro. Asset: a single perfectly circular cross-section of the inner filler of a hand-rolled cigar, seen exactly head-on, used as a texture inside a minimal educational diagram on a near-black editorial website. Subject: several cured brown tobacco leaves folded tightly in an accordion ("book" / "entubado") arrangement, cut cleanly with a sharp blade, revealing irregular radial and serpentine folds, compressed leaf layers, tiny cut veins and fibrous edges. Only the filler bundle is shown: no outer wrapper ring, no binder ring, no band. The disc fills about 92% of the square frame, centered, flat orthographic view, no perspective distortion. Lighting: low warm raking light (about 3200 K) from the upper left at a shallow angle, revealing the relief of the folds with soft natural shadows, no specular highlights, matte organic surface. Palette: deep tobacco browns #4A3220 to #7A5236, warm highlights near #9C6A48, shadows falling toward #0F0E0C. Background: pure transparent, or pure flat black #000000 if transparency is unavailable, with a crisp clean circular edge. Restrained contrast, refined natural product photography, sober and educational, not an advertisement. [COMMON NEGATIVES] Also no wrapper leaf visible, no cigar body, no side view, no table, no hands, no tools, no dust clouds.
```

**Evitar**: `[COMMON NEGATIVES]` + vista lateral del cigarro, anillos concéntricos de capa/capote (los dibuja el CSS), pie quemado o ennegrecido, aspecto de tronco/madera, simetría de mandala artificial, tabaco picado (es de hoja larga plegada).

---

### IMG-PAPER-01 — Papel de lámina técnica beige

| Campo | Detalle |
|---|---|
| ID | `IMG-PAPER-01` |
| Concepto | C3 "Espiral de capa · dibujo técnico" |
| Objetivo | Fondo casi imperceptible bajo el dibujo lineal de la hélice sobre el beige del vídeo, para que la transición mesa → secuencia se lea como "plano de taller" y empate con el fondo de los frames. |
| Tipo | **Textura 2D tileable** para CSS (`background-image` + `background-repeat`), no se aplica a geometría 3D. Canal único: color (sRGB). |
| Estilo visual | Papel de dibujo técnico / cartulina mate escaneada en plano. |
| Materiales | Papel de algodón sin satinar, grano fino de fibra. |
| Paleta | Base exacta `#D6C8B9`; variación de grano ±3 % de luminancia (aprox. `#D1C3B3`–`#DBCDBE`). Nada más. |
| Composición | Superficie uniforme a sangre, sin centro ni bordes, sin viñeteado. |
| Iluminación | Plana y difusa (escaneo), sin gradientes ni sombras. |
| Fondo | Es el fondo. |
| Relación de aspecto | 1:1 |
| Resolución sugerida | Generar 1024×1024, entregar **512×512** (≤25 KB en WebP calidad 80). |
| Transparencia | No. (Opcional: variante en escala de grises al 50 % para `mix-blend-mode: multiply` sobre `#D6C8B9`, más flexible con los 7 perfiles visuales.) |
| Nombre / ruta | `public/img/3d/img-paper-01.webp` (+ opcional `img-paper-01_grain-gray.webp`). |
| Dónde se usaría | Transición/loader entre `src/components/CigarResult.jsx` (`onStart`) y `src/components/ScrollVideo.jsx`, orquestado en `src/pages/CraftYourCigar.jsx`. Solo DOM/SVG sobre `#video-root`. |

**Prompt completo**

```text
Use case: seamless tileable texture. Asset: a flat scan of plain matte technical drawing paper, warm beige, filling the entire frame edge to edge, perfectly seamless and tileable in both directions. Base color exactly #D6C8B9 with an extremely subtle fine cotton fiber grain, luminance variation no more than about 3 percent, uniform distribution with no recognizable features that would reveal repetition when tiled. Completely flat diffuse scanner lighting, no gradients, no vignette, no shadows, no folds, no creases, no stains, no foxing, no coffee rings, no torn edges, no grid lines, no ruled lines, no pencil marks. Calm, quiet, almost invisible texture meant to sit behind thin line drawings. [COMMON NEGATIVES]
```

**Evitar**: `[COMMON NEGATIVES]` + pergamino envejecido, kraft, manchas, cuadrícula milimetrada, viñeteado, motas visibles que delaten el tile. **Post-proceso obligatorio**: comprobar tileado con offset 50 % (Photoshop *Filter › Other › Offset* o GIMP *Layer › Transform › Offset*) y corregir costuras con clonado; normalizar la media a `#D6C8B9`.

---

### TEX-WRAP-01 — Superficie de hoja de capa (tileable)

| Campo | Detalle |
|---|---|
| ID | `TEX-WRAP-01` (canales: `_albedo`, `_normal`, `_roughness`) |
| Concepto | C1 "Anatomía de tu cigarro" (espiral exterior de la capa; opcional también en el capote) |
| Objetivo | Que la envoltura helicoidal tenga venas finas de hoja sin estirar la thumb de la hoja elegida. Se **tiñe en runtime** con el color medio de la capa seleccionada, por eso el albedo debe ser neutro en tono y sin luz horneada. |
| Tipo | **Textura para geometría 3D.** Seamless/tileable en U y V. Se aplica sobre el UV de la `TubeGeometry`/malla `capa` (U a lo largo de la cinta helicoidal, V a lo ancho) con `wrapS = wrapT = RepeatWrapping`, repetición ~4×1 por vuelta. Canal **albedo/base color, sRGB**. Normal (tangent-space, OpenGL +Y) y roughness se **derivan** (lineal). |
| Estilo visual | Escaneo de material PBR, cenital, luz plana. |
| Materiales | Lámina de hoja de capa curada, fina, sedosa, con venas secundarias finas en diagonal; sin nervio central. |
| Paleta | Marrón medio "colorado" `#8A5A3B` como media, rango `#7A4E33`–`#A47252`; sin sombras profundas (nada por debajo de ~`#5A3A26`). |
| Composición | Superficie continua a sangre; venas finas en paralelo a ~30° respecto a la horizontal, densidad uniforme; sin bordes de hoja, sin nervio dominante, sin agujeros. |
| Iluminación | Totalmente plana y difusa (cross-polarized look): sin luz direccional, sin sombras ni brillos horneados. |
| Fondo | Es la superficie completa. |
| Relación de aspecto | 1:1 |
| Resolución sugerida | Generar 2048×2048; entregar **1024×1024** (KTX2/UASTC para normal, ETC1S para albedo/roughness) + fallback WebP 1024. |
| Transparencia | No. |
| Nombre / ruta | `public/img/3d/tex-wrap-01_albedo.ktx2`, `tex-wrap-01_normal.ktx2`, `tex-wrap-01_roughness.ktx2`; fallbacks `*.webp`. |
| Dónde se usaría | Escena C1 cargada dinámicamente desde `src/components/CigarResult.jsx` (p. ej. un futuro `src/components/three/CigarAnatomy.jsx`); también consumida por `GLB-CIGAR-01` si se llega a la fase 2. |

**Prompt completo (fuente del albedo)**

```text
Use case: seamless tileable PBR albedo texture. Asset: a top-down, perfectly flat, evenly lit material scan of the surface of a cured cigar wrapper tobacco leaf, filling the whole square frame edge to edge, seamless and tileable in both directions. The surface is thin, fine and silky with a delicate network of fine secondary veins running roughly parallel at about 30 degrees, subtle micro-wrinkles and natural fiber variation, uniform density across the frame. No central midrib, no leaf edges, no holes, no tears, no spots, no large creases. Albedo only: completely flat shadowless lighting, cross-polarized look, no directional light, no baked shadows, no highlights, no specular reflections, no ambient occlusion. Color: neutral medium reddish brown, average close to #8A5A3B, range #7A4E33 to #A47252, low saturation so it can be tinted later. Orthographic, no perspective, no vignette, no depth of field. [COMMON NEGATIVES]
```

**Evitar**: `[COMMON NEGATIVES]` + nervio central, borde de hoja, arrugas profundas tipo papel estrujado (romperían el tile y la escala del cigarro), cualquier sombra horneada, verde, manchas.

**Derivación de canales (no generar con modelo de imagen)**
1. Corregir el tile (offset 50 % + clonado) y normalizar la media de color.
2. **Normal**: Materialize (gratuito), Substance 3D Sampler (*Image to Material*) o `normalmap`/NVIDIA Texture Tools a partir del albedo → tangent-space, convención **OpenGL (+Y)**, intensidad baja (las venas son finas), filtro de alta frecuencia para quitar gradientes de baja frecuencia.
3. **Roughness**: escala de grises del albedo invertida y comprimida a 0.75–0.92 (hoja mate). Lineal.
4. Exportar con `toktx` (KTX-Software) o `gltf-transform`: albedo/roughness ETC1S, normal UASTC con `--normal_mode`; mipmaps activados.

---

### IMG-LEAF-TRIO-01 — Tres hojas para "El arte de combinar"

| Campo | Detalle |
|---|---|
| ID | `IMG-LEAF-TRIO-01` (3 archivos: `_tripa`, `_capote`, `_capa`) |
| Concepto | A2 "Tres hojas en profundidad" (Home) |
| Objetivo | Tres recortes nítidos a 2× con el mismo encuadre y la misma luz para separarse en Z con scroll dentro del marco de `/img/about.png`. **Primera opción recomendada: derivarlos de la colección real** (`public/assets/full/*.png` reducidas a 800 px de alto), por coherencia y veracidad. Generar solo si se busca una luz unificada que la colección no tiene. |
| Tipo | **Imagen editorial** (3 recortes con alfa para capas CSS 3D). No va sobre geometría. |
| Estilo visual | Fotografía de espécimen botánico, cenital, igual que la colección de thumbs. |
| Materiales | Hoja curada entera con peciolo; arrugas reales, nervio central oscuro. |
| Paleta | Capa `#9C6A48`–`#A47252` (más clara y uniforme); capote `#7E553A`; tripa `#5E3F28`–`#6E4A2E` (más oscura, gruesa, moteada). Fondo transparente sobre `#0F0E0C` en la web. |
| Composición | Cada hoja sola, vertical, punta arriba, peciolo abajo, centrada, ocupando ~85 % del alto; mismo ángulo y escala en las tres para poder superponerlas con un leve offset. |
| Iluminación | Luz cálida lateral desde la izquierda (~3200 K), suave, idéntica en las tres; **sin sombra proyectada** (se añade por CSS). |
| Fondo | Transparente (o blanco/negro neutro uniforme para recortar). |
| Relación de aspecto | ~1:2 (vertical, como las thumbs 400×825). |
| Resolución sugerida | Generar 1024×2048; entregar **800 px de alto** (≈390×800) WebP con alfa, ≤120 KB cada una. |
| Transparencia | **Sí**, recorte limpio del contorno incluyendo bordes rotos; sin halo claro (defringe). |
| Nombre / ruta | `public/img/3d/leaf-trio-01_tripa.webp`, `leaf-trio-01_capote.webp`, `leaf-trio-01_capa.webp`. |
| Dónde se usaría | `src/pages/Home.jsx` → `figure.site-feature__image` (hoy `<img src="/img/about.png">`, línea 51). |

**Prompt completo (plantilla; generar 3 veces cambiando `{ROLE_BLOCK}`)**

```text
Use case: photorealistic botanical specimen photograph, consistent series of three. Asset: one single whole cured tobacco leaf, photographed straight from above, vertical orientation, tip at the top and short stem at the bottom, centered, filling about 85 percent of the frame height, isolated for cut-out. {ROLE_BLOCK} Real crinkled cured texture with dense micro-wrinkles, a dark prominent central midrib, herringbone secondary veins, natural irregular slightly torn edges. Lighting: soft warm side light from the left at about 3200 K, identical across the series, gentle relief, no cast shadow on the background, no specular shine. Background: plain uniform pure white or transparent for clean cut-out. Natural, sober, refined editorial specimen photography matching a collection of real leaf scans; restrained contrast, true-to-life color. [COMMON NEGATIVES] Also no hands, no table, no other leaves, no stems bundles, no pins, no rulers.
```

`{ROLE_BLOCK}`:
- **capa**: `The leaf is a fine wrapper leaf: thin, smooth, even and silky, uniform medium reddish-brown around #9C6A48, few blemishes, elegant broad oval silhouette.`
- **capote**: `The leaf is a binder leaf: medium thickness, slightly less even, medium brown around #7E553A, some natural variation, sturdy oval silhouette.`
- **tripa**: `The leaf is a filler leaf: thicker, darker and more textured, dark brown around #5E3F28 with small natural mottling, narrower and more irregular silhouette, possibly with a partially removed midrib at the base.`

**Evitar**: `[COMMON NEGATIVES]` + hojas verdes o frescas, hoja brillante/encerada, simetría perfecta, sombra horneada, sello o monograma (el de `about.png` no debe reproducirse).

---

### TEX-LEAF-HGT-xx — Serie de height maps por hoja

| Campo | Detalle |
|---|---|
| ID | Patrón `TEX-LEAF-HGT-{leafId}` (p. ej. `TEX-LEAF-HGT-capa-habana`) |
| Concepto | D1 "Luz rasante sobre la nervadura" (`feDiffuseLighting` sobre el height map o shader) |
| Objetivo | Relieve de nervio central, venas y arrugas para iluminar virtualmente la foto real sin mover geometría. |
| Tipo | **Textura para geometría/relighting 2.5D**, **no tileable**, alineada 1:1 píxel a píxel con la thumb/full de la misma hoja (mismo UV que el `<img>` o el plano). Canal **height/displacement**, escala de grises, **lineal**. |
| Estilo visual | Mapa de datos: gris medio = lámina; claro = nervios y crestas; oscuro = valles. |
| Materiales | N/A (dato). |
| Paleta | Escala de grises 0–255; lámina ~128; fuera de la hoja = 0 o alfa. |
| Composición | Idéntica a la foto origen (mismo recorte, mismo tamaño, mismo encuadre). |
| Iluminación | N/A. |
| Fondo | Alfa heredado de la foto (o negro). |
| Relación de aspecto | La de la hoja (~1:2,06). |
| Resolución sugerida | ≤800 px de alto (≈388×800) para SVG filter; 1024 de alto como máximo para WebGL. Nunca a 1939×4000. |
| Transparencia | Opcional: conservar el alfa de la foto en un canal aparte o premultiplicar a 0 fuera de la hoja. |
| Nombre / ruta | `public/img/3d/leaves/{leafId}_height.webp` (WebP lossless, 8-bit gris). |
| Dónde se usaría | `src/components/leaf-library/ImmersiveView.jsx` (`.th-leaf-frame`, capítulo `step === 1` "Forma"). |

**No se recomienda generarlos con un modelo de imagen**: un height map generado no coincidiría píxel a píxel con la foto real. Se **derivan** de `public/assets/full/{FILE}.png`:
1. Reducir la PNG full a 800 px de alto (Lanczos) — misma operación que produce la imagen mostrada.
2. Luminancia → escala de grises; filtro paso alto (radio ~20–40 px) para eliminar variaciones de color de baja frecuencia (manchas, tonos) y quedarse con relieve.
3. Ajustar niveles para centrar la lámina en ~128; suavizar 0,5–1 px.
4. Herramientas: Materialize (*Height from Diffuse*), Substance 3D Sampler, o script con ImageMagick (`-colorspace Gray -level`, `-blur` + resta para high-pass). Guardar en **lineal**.

**Prompt de apoyo (solo si no hubiera foto real de la hoja; no es el caso hoy)**: ver plantilla de albedo en `TEX-LEAF-NRM-xx`.

---

### TEX-LEAF-NRM-xx — Serie de normal maps por hoja

| Campo | Detalle |
|---|---|
| ID | Patrón `TEX-LEAF-NRM-{leafId}` (p. ej. `TEX-LEAF-NRM-capa-pensilvania`) |
| Concepto | A1 "Hoja en vilo" (plano deformado en R3F), D1 (variante WebGL) |
| Objetivo | Que la luz cálida y el cursor revelen venas y arrugas sobre la malla con la foto real como `map` y su alfa como `alphaMap`. |
| Tipo | **Textura para geometría 3D**, **no tileable**, UV 0–1 del `planeGeometry` (32×64) alineado con la thumb. Canal **normal tangent-space, OpenGL (+Y)**, **lineal** (`NoColorSpace`). |
| Estilo visual | Mapa de datos (lila/azul neutro `#8080FF` en superficie plana). |
| Materiales | N/A (dato). |
| Paleta | Normal map estándar; fuera de la hoja `#8080FF`. |
| Composición | Idéntica a la thumb (400×825) o a la variante de 1024 px. |
| Iluminación | N/A. |
| Fondo | `#8080FF` (normal plana) fuera de la hoja; el recorte lo hace `alphaMap`. |
| Relación de aspecto | ~1:2,06. |
| Resolución sugerida | Igual a la textura de color usada (por defecto thumb ~400×825; máx. 512×1024 en potencia de 2 para KTX2). |
| Transparencia | No (el alfa va en `alphaMap` = alfa de la thumb). |
| Nombre / ruta | `public/img/3d/leaves/{leafId}_normal.ktx2` (UASTC, `--normal_mode`) + fallback `{leafId}_normal.png`. |
| Dónde se usaría | `src/components/leaf-library/TechnicalSheet.jsx` (`figure.ts-image-side`) para A1; `src/components/leaf-library/ImmersiveView.jsx` para D1 (WebGL). |

**Derivación (recomendada)**: partir del height map de la misma hoja (`TEX-LEAF-HGT-{leafId}`) → normal con Materialize / Substance Sampler / `normalmap` CLI / NVIDIA Texture Tools; intensidad moderada; convención OpenGL; exportar KTX2 con `toktx --t2 --uastc --normal_mode`. Un modelo de imagen **no** debe generar el normal map: no respetaría la alineación con la foto.

**Plantilla de prompt de albedo (solo como respaldo si una hoja carece de foto adecuada o se necesita reescanear con luz plana)**

```text
Use case: flat-lit botanical scan for texture derivation. Asset: one single whole cured tobacco leaf, {CATEGORY_DESCRIPTOR}, named "{LEAF_NAME}" from {ORIGIN}, photographed perfectly top-down, vertical orientation, tip at top and stem at bottom, centered, filling 90 percent of the frame height. Completely even, shadowless, cross-polarized flat lighting so that only true surface color is recorded: no directional light, no cast shadows, no highlights, no specular reflections. Real cured texture with dense micro-wrinkles, prominent central midrib, herringbone secondary veins, natural irregular edges. Dominant color around {TONE_HEX}, true to life, low saturation. Plain pure white background for clean cut-out, orthographic, no vignette, no depth of field. [COMMON NEGATIVES]
```

Variables por categoría (`{CATEGORY_DESCRIPTOR}` / `{TONE_HEX}` orientativo, muestrear la thumb real):
- `CAPA` → `a fine thin smooth wrapper leaf` / `#9C6A48`
- `CAPOTE` → `a medium-thickness sturdy binder leaf` / `#7E553A`
- `TRIPA` → `a thicker, darker, more textured filler leaf` / `#5E3F28`

**Lista de hojas (de `src/data/leaves.js`, 21)** — orden de producción: primero las 2 con `hasInmersive: true` (★).

| leafId | Categoría | Nombre | Origen | Fuente para derivar |
|---|---|---|---|---|
| `capa-habana` ★ | CAPA | Habana | Ecuador / Cuba | `public/assets/full/CAPA HABANA.png` |
| `capa-pensilvania` ★ | CAPA | Pensilvania | USA | `public/assets/full/CAPA PENSILVANIA.png` |
| `capote-criollo-98` | CAPOTE | Criollo 98 | Dominican Republic | `CAPOTE CRIOLLO 98.png` |
| `capote-habano` | CAPOTE | Habano | Nicaragua | `CAPOTE HABANO.png` |
| `capote-indonesia` | CAPOTE | Indonesia | Indonesia | `CAPOTE INDONESIA.png` |
| `capote-pensilvania` | CAPOTE | Pensilvania | USA | `CAPOTE PENSILVANIA_.png` |
| `capote-sumatra-ecuador` | CAPOTE | Sumatra Ecuador | Ecuador | `CAPOTE SUMATRA ECUADOR_.png` |
| `tripa-broad-leaf` | TRIPA | Broad Leaf | USA | `TRIPA BROAD LEAF.png` |
| `tripa-corojo-ligero` | TRIPA | Corojo Ligero | Nicaragua | `TRIPA COROJO LIGERO.png` |
| `tripa-hba-abano` | TRIPA | HBA Abano | Various | `TRIPA HBA ABANO.png` |
| `tripa-kentuky` | TRIPA | Kentucky Fire Cured | USA | `TRIPA KENTUKY.png` |
| `tripa-ligero-criollo-98` | TRIPA | Ligero Criollo 98 | Dominican Republic | `TRIPA LIGERO CRIOLLO 98.png` |
| `tripa-ligero-cubano` | TRIPA | Ligero Cubano | Cuba | `TRIPA LIGERO CUBANO.png` |
| `tripa-ligero-nicaragua` | TRIPA | Ligero Nicaragua | Nicaragua | `TRIPA LIGERO NICARAGUA.png` |
| `tripa-olor-ligero` | TRIPA | Olor Ligero | Dominican Republic | `TRIPA OLOR LIGERO_.png` |
| `tripa-olor-seco` | TRIPA | Olor Seco | Dominican Republic | `TRIPA OLOR SECO.png` |
| `tripa-pensilvania` | TRIPA | Pensilvania Filler | USA | `TRIPA PENSILVANIA.png` |
| `tripa-seco-criollo-98` | TRIPA | Seco Criollo 98 | Dominican Republic | `TRIPA SECO CRIOLLO 98.png` |
| `tripa-seco-cubano` | TRIPA | Seco Cubano | Cuba | `TRIPA SECO CUBANO.png` |
| `tripa-seco-nicaragua` | TRIPA | Seco Nicaragua | Nicaragua | `TRIPA SECO NICARAGUA.png` |
| `tripa-t-13-ligero` | TRIPA | T 13 Ligero | Hybrid | `TRIPA T 13 LIGERO.png` |

Nota: los nombres de archivo usan el `id` (kebab-case, sin espacios), no el nombre del PNG, para evitar los espacios y guiones bajos finales de los archivos actuales.

---

## 3. Concept art de referencia (NO son assets finales)

> Sirven para que el cliente visualice cada idea **dentro de la página real** (layout oscuro editorial). No se publican ni se usan en la web. Todo texto de UI que aparezca en la imagen se tratará como marcador: el modelo de imagen no garantiza tipografía correcta, por eso se pide UI "suggested" y legible solo en bloques. Guardar en `docs/3d-exploration/refs/` (carpeta propuesta, hoy no existe).

### REF-C1-01 — "Anatomía de tu cigarro" en el paso 04

| Campo | Detalle |
|---|---|
| ID | `REF-C1-01` |
| Concepto | C1 |
| Objetivo | Mostrar cómo convive el despiece 3D con la `<dl>` y el perfil en `tu-cigarro.png`, que hoy no tiene imagen. |
| Tipo | **Concept art de referencia** (mockup de página). |
| Estilo visual | Mockup UI de escritorio, editorial oscuro, render 3D mate integrado. |
| Materiales | Hoja curada mate, líneas de cota bronce de 1 px. |
| Paleta | `#0F0E0C`, `#171512`, `#211E19`, `#C7A479`, `#F1ECE3`, `#B5ADA1`; hojas `#5E3F28`–`#9C6A48`. |
| Composición | 1440 px de ancho: arriba stepper de 4 pasos; titular serif grande centrado; debajo, una franja ancha con el cigarro en despiece en 3/4 (izquierda → derecha), y bajo ella la tabla de 3 filas + panel de perfil. |
| Iluminación | Luz cálida lateral rasante sobre el objeto + rim bronce tenue; UI plana. |
| Fondo | `#0F0E0C` / tarjeta `#171512`. |
| Relación de aspecto | 16:10 |
| Resolución sugerida | 2560×1600 |
| Transparencia | No. |
| Evitar | `[COMMON NEGATIVES]` + logos en cabecera, fotos de personas, brillos plásticos. |
| Nombre / ruta | `docs/3d-exploration/refs/ref-c1-anatomia.png` |
| Dónde se usaría | Presentación al cliente; referencia para `src/components/CigarResult.jsx`. |

```text
Use case: UI concept mockup for client presentation, reference only. A desktop web page (1440 px wide layout) of a sober dark editorial site about cigar leaf craftsmanship, near-black background #0F0E0C, thin hairline borders, generous negative space, an elegant high-contrast serif for headings and a clean sans-serif for body, ivory text #F1ECE3 and muted secondary text #B5ADA1, bronze accents #C7A479. Top: a minimal four-step progress indicator with three completed circles and a fourth active one. Below, a large centered serif headline block. Hero of the mockup: a wide card #171512 containing a photorealistic matte 3D render of an unlit, unbranded cigar shown in an exploded axial view at three-quarter angle, floating on the dark card: an outer thin spiral wrapper ribbon of fine reddish-brown leaf peeled forward, an inner binder layer in medium brown, and four bundles of folded darker filler leaf slightly separated along the axis; the foot is a clean flat cut showing folded leaf layers. Thin 1 px bronze dimension lines connect each layer to small uppercase bronze labels (suggested, blocks only). Warm raking side light around 3200 K with a faint bronze rim light and a soft contact shadow; completely matte, no plastic shine. Below the render: a three-row table on the left and a profile panel on the right with three rows of small empty dots. Calm, precise, museum-like technical illustration feel. [COMMON NEGATIVES] Also no cigar band, no head cap cut, no glowing foot, no people, no photographs of plantations.
```

### REF-C2-01 — Corte transversal en relieve (guía de la mezcla)

| Campo | Detalle |
|---|---|
| ID | `REF-C2-01` |
| Concepto | C2 |
| Objetivo | Enseñar el paso del esquema plano de 3 círculos (`guia-mezcla.png`) a discos apilados en isométrico, con la tripa texturizada. |
| Tipo | **Concept art de referencia**. |
| Estilo visual | Diagrama técnico pseudo-3D sobre layout editorial oscuro. |
| Materiales | Discos planos con canto fino; cara de la tripa con fibras plegadas (idea de `TEX-FILLER-01`). |
| Paleta | Capa `#171512`, capote `#211E19`, tripa `#0F0E0C` + fibras `#4A3220`–`#7A5236`; bordes bronce al 26 %; activo bronce al 14 %. |
| Composición | Izquierda: rótulo pequeño en mayúsculas sobre los discos inclinados (~58°) y separados en Z, el de la tripa elevado (activo). Derecha: tres pastillas de selección y bloque de texto. |
| Iluminación | Plana de UI; sombras cálidas suaves bajo cada disco. |
| Fondo | `#0F0E0C`. |
| Relación de aspecto | 16:10 |
| Resolución sugerida | 2560×1600 |
| Transparencia | No. |
| Evitar | `[COMMON NEGATIVES]` + realismo fotográfico de un cigarro completo, perspectiva exagerada, colores fuera de paleta. |
| Nombre / ruta | `docs/3d-exploration/refs/ref-c2-corte-relieve.png` |
| Dónde se usaría | Presentación; referencia para `src/components/TobaccoGuidePage.jsx` y `src/styles/tobacco-guide-page.css`. |

```text
Use case: UI concept mockup for client presentation, reference only. A dark editorial desktop web page section, background #0F0E0C, with a large serif section title area and a numbered chapter marker at the top left. Left half: a minimal technical diagram of a cigar cross-section rendered as three thin stacked discs seen in isometric view (tilted about 58 degrees), separated vertically in depth like an exploded diagram: the largest outer disc in #171512, the middle disc in #211E19, and the smallest inner disc lifted highest and highlighted with a subtle bronze glow #C7A479 at low opacity; each disc has a thin visible edge of 2 to 4 pixels with warm soft shadow and a hairline bronze outline at low opacity. The top face of the inner disc shows a subtle photographic texture of tightly folded dark brown tobacco leaf fibers (#4A3220 to #7A5236) cut flat. Small uppercase spaced labels float next to each disc (suggested, blocks only). Right half: three pill-shaped toggle buttons in a row, the first active, followed by a small uppercase kicker, a serif heading and two lines of body text in muted ivory #B5ADA1. Precise, restrained, educational, not illustrative or cartoonish. [COMMON NEGATIVES] Also no full cigar, no photographs, no gradients outside the palette.
```

### REF-C3-01 — Espiral de capa sobre beige (puente a la secuencia)

| Campo | Detalle |
|---|---|
| ID | `REF-C3-01` |
| Concepto | C3 |
| Objetivo | Visualizar el instante de transición: pantalla beige con el dibujo técnico de la hélice antes de que llegue el primer frame. |
| Tipo | **Concept art de referencia**. |
| Estilo visual | Lámina de dibujo técnico de taller, línea fina. |
| Materiales | Papel beige (idea de `IMG-PAPER-01`), tinta tierra. |
| Paleta | Fondo `#D6C8B9`; trazo ≈ `#3A2E22` (mezcla 75 % `#0F0E0C` + `#C7A479`); acentos `#C7A479`. |
| Composición | Pantalla completa; cilindro horizontal centrado en isométrico con una cinta helicoidal que lo envuelve desde el pie hacia la cabeza; líneas ocultas al 30 %; una cota y un rótulo mínimos. |
| Iluminación | Ninguna (dibujo lineal). |
| Fondo | `#D6C8B9` liso con grano mínimo. |
| Relación de aspecto | 16:9 |
| Resolución sugerida | 2560×1440 |
| Transparencia | No. |
| Evitar | `[COMMON NEGATIVES]` + sombreado, color de relleno, estética vintage o envejecida, cuadrícula. |
| Nombre / ruta | `docs/3d-exploration/refs/ref-c3-espiral.png` |
| Dónde se usaría | Presentación; referencia para la transición en `src/pages/CraftYourCigar.jsx` / `src/components/ScrollVideo.jsx`. |

```text
Use case: concept frame for client presentation, reference only. A full-screen flat warm beige background #D6C8B9 with an almost invisible fine paper grain. Centered: a precise technical line drawing, like a workshop blueprint, of a plain cylinder with the proportions of an unlit, unbranded cigar shown horizontally in isometric projection, with a single thin ribbon wrapping around it in a helix from the foot toward the rounded head. Lines are 1.25 px dark earth ink (#3A2E22); hidden back lines of the helix are drawn at 30 percent opacity to convey volume; a few small accents and one dimension line with tick marks in bronze #C7A479; one tiny uppercase label block (suggested). No shading, no fill, no color other than the listed ones, generous empty space around the drawing, calm and precise, suggesting the moment just before an image sequence begins. [COMMON NEGATIVES] Also no vintage aging, no grid paper, no handwriting, no perspective camera blur.
```

---

## 4. Modelos 3D (no imagen)

### GLB-CIGAR-01 — Cigarro en despiece (opcional, fase 2 de C1)

> **Los prompts de imagen de Codex no pueden producir este asset.** Un modelo de imagen entrega píxeles, no geometría con mallas nombradas, UVs ni materiales glTF. Se crea por código (procedural) o en una herramienta DCC (Blender). Solo se aborda si la versión procedural de C1 (fase 1) se queda corta.

| Campo | Especificación |
|---|---|
| Concepto | C1 "Anatomía de tu cigarro" |
| Objeto | Cigarro **sin encender, sin anilla, sin marca**; pie cortado limpio; cabeza redondeada cerrada (sin corte). |
| Mallas (nombres exactos) | `capa` (cinta helicoidal fina, 3–4 vueltas, que cierra en la cabeza), `capote` (cilindro interior de pared fina, abierto en el pie), `tripa_00` … `tripa_04` (5 haces de hoja plegada; el runtime oculta los que sobran según la mezcla de 2–5 hojas). Cada malla es un nodo independiente con su pivote en el eje del cigarro para poder desplazarse axialmente. |
| Escala y pivote | Unidades en metros (glTF): longitud ~0,150, diámetro ~0,020. Eje longitudinal = **+X** (pie en −X, cabeza en +X), origen en el centro geométrico. Transformaciones aplicadas (scale 1, rotation 0). |
| Presupuesto | ≤15 k triángulos en total (orientativo: `capa` ≤5 k, `capote` ≤2 k, `tripa_00..04` ≤1,5 k cada uno). Sin subdivisión en runtime. |
| UVs | `capa`: U a lo largo de la cinta, V a lo ancho, densidad de texel uniforme para tilear `TEX-WRAP-01` (sin solapes). `capote`: cilíndrica (U circunferencia, V longitud). `tripa_*`: laterales cilíndricos + tapa del pie con UV planar 0–1 centrado para `TEX-FILLER-01`. Sin UV2 salvo que se hornee AO. |
| Materiales | Un `MeshStandardMaterial` por grupo (`mat_capa`, `mat_capote`, `mat_tripa`), metalness 0, roughness 0.8–0.9, `baseColorFactor` neutro (se tiñe en runtime con el color medio de la thumb elegida). **Sin texturas embebidas**: se asignan en runtime. |
| Texturas que consume | `TEX-WRAP-01` (albedo/normal/roughness) en `capa` y opcionalmente `capote`; `TEX-FILLER-01` en las tapas de `tripa_*`; alternativa: la thumb de la hoja elegida como `map`. |
| Compresión | Geometría: **meshopt** (`EXT_meshopt_compression`) preferido por decodificación rápida, o Draco (`KHR_draco_mesh_compression`); cuantización (`KHR_mesh_quantization`). Texturas fuera del GLB en **KTX2** (`KHR_texture_basisu`). Objetivo **≤300 KB** el GLB. Pipeline: `gltf-transform optimize --compress meshopt` + `gltf-transform ktx` / `toktx`. Requiere en runtime `MeshoptDecoder` o `DRACOLoader` y `KTX2Loader` (transcoder Basis servido localmente). |
| Ruta sugerida | `public/models/glb-cigar-01.glb` (carpeta propuesta; hoy no existe). Fuente `.blend` fuera de `public/` (p. ej. `design-assets/3d/glb-cigar-01.blend`). |
| Dónde se usaría | Escena C1 dinámica desde `src/components/CigarResult.jsx`. |

**Métodos de creación**
1. **Procedural en código (recomendado, fase 1, sin GLB)**: `capa` = `TubeGeometry` sobre una `CatmullRomCurve3` helicoidal (o una cinta extruida con `ExtrudeGeometry`/geometría custom para que sea plana, no tubular); `capote` = `CylinderGeometry` abierto o `LatheGeometry` con perfil de pared fina; cabeza = `LatheGeometry` con perfil redondeado; `tripa_*` = `LatheGeometry`/`CylinderGeometry` con desplazamiento de vértices (ruido) para sugerir pliegues + `CircleGeometry` en el pie. Ventajas: 0 KB de modelo, número de haces dinámico, tematizable; UVs controladas en código.
2. **Blender (fase 2)**: modelar con curva + *Array/Curve modifiers* para la espiral, *Screw* para la cinta, *Solidify* para espesor; desplegar UVs (*Follow Active Quads* en la cinta); nombrar objetos exactamente; exportar glTF 2.0 (`+Y up`, aplicar modificadores, sin cámaras/luces) y optimizar con `gltf-transform`. Validar con glTF Validator y `gltf.report`.

---

## 5. Conceptos que no requieren assets (procedurales)

| Concepto | Por qué no necesita asset nuevo |
|---|---|
| **C2** Corte transversal en relieve | CSS 3D (`perspective`, `preserve-3d`, `box-shadow` en capas) sobre los anillos existentes. `TEX-FILLER-01` es **opcional**. |
| **C1 fase 1** Anatomía | Geometría paramétrica en código + thumbs existentes como textura (o color medio muestreado). `TEX-WRAP-01` / `GLB-CIGAR-01` opcionales. |
| **C3** Espiral de capa | SVG inline con hélice precalculada + GSAP `stroke-dashoffset`. `IMG-PAPER-01` es **opcional** (puede bastar el `#D6C8B9` liso). |
| **B1** Tilt de materia | CSS 3D + ~30 líneas JS (o Vanilla-Tilt); reutiliza thumbs. |
| **B2** La hoja viaja a tu mezcla | framer-motion sobre una copia de la thumb; el dorso es la misma imagen con `filter`. |
| **D2** Profundidad de pasos | `AnimatePresence` sobre la cuadrícula existente; sin imágenes. |
| **D1** (versión prototipo) | Máscara CSS (gradiente radial + `mix-blend-mode: soft-light`) sobre la foto; los height maps solo para la versión SVG/WebGL. |
| **A2** (versión mínima) | Puede montarse con las thumbs actuales (`public/assets/thumbs/*.webp`); `IMG-LEAF-TRIO-01` solo mejora nitidez a 2× y coherencia de luz. |

Excluido explícitamente: **D3** (cigarro héroe con humo) y cualquier `GLB-CIGAR-HERO` — no se especifican assets por promover el consumo (ver `02_3D_CONCEPTS.md` §3).
