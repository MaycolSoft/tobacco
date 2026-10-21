# G — Sistema de color y tecnología 3D artística

> **Referencia histórica de exploración (19/10/2026).** H1/O2/L1/ART-C1 se implementaron después; tecnología, cifras y tareas de este documento describen aquella fase. Consultar [estado vigente](../PROGRESS.md) y [pendientes del proyecto](../../STATUS.md). Los encargos y restricciones de sesiones anteriores no son instrucciones actuales.

> Agente G · Asesor de color y tecnología 3D · TOBACCO / Tabacalera Tamboril
> Solo propuesta. No modifica código de la app ni instala dependencias.

## Progreso

- [x] 0. Lectura de fuentes
- [x] 1. Sistema de acentos
- [x] 2. Materiales artísticos y coste
- [x] 3. Geometría procedural
- [x] 4. Arquitectura multisección
- [x] 5. Comparativa de tecnologías
- [x] 6. Skills revisadas
- [x] 7. Conclusión y presupuesto global

---

## 0. Fuentes y punto de partida

- **Tokens** (`src/styles/tokens.css`): fondo `#0F0E0C`, card `#171512`, surface `#211E19`, bronce `#C7A479`, marfil `#F1ECE3`, beige del reproductor `#D6C8B9`. Todo el sistema actual es **un solo acento** (bronce) más neutros.
- **Perfiles** (`src/config/visualProfiles.js`): 7 perfiles. Cálidos (`base`, `heritage`, `modernLuxury`), grises cálidos (`executive`, `quietLuxury`) y **monocromos** (`black`: acento `#C8C8C8` sobre `#000000`; `editorialNoir`: `#BEBBB5` sobre `#0B0B0B`). Las capturas de `design-review/desktop/` están hechas en un perfil monocromo: allí el **único color de la página es la foto** (hoja marrón; en `inicio-hero.png`, el verde del cultivo y un azul de cielo apagado).
- **Desfase detectado**: `docs/PALETTE.md` documenta `#0F1110 / #181C19 / #222823` (base verdosa) mientras que `tokens.css` usa `#0F0E0C / #171512 / #211E19` (base cálida). Este documento toma `tokens.css` como verdad.
- **Restricciones heredadas** (UX §4, 03 §b/§d/§g/§h/§j): nada brillante ni plástico; sin humo ni brasa; el color de la hoja sale de la foto; nunca WebGL con `#video-root` montado; un contexto WebGL por vista; `vendor-3d` ≤220 KB gz; ≤50k/20k triángulos; ≤64/32 MB GPU.
- **Cambio de brief**: el usuario ahora pide **objetos artísticos** (esculturas flotantes, geometrías orgánicas, translúcidos, cintas, anillos, elementos foliares) y **color más allá del marrón**. Este documento reconcilia ese pedido con UX §4: el color nuevo entra como **luz y materia** (pátina, resina, savia, vino), no como pintura de UI.

---

## 1. Sistema de acentos

### 1.1 Principio

El bronce `#C7A479` sigue siendo **el único color de interfaz** (acción, selección, foco). Los acentos nuevos son **colores de materia y de luz** que solo existen dentro de los objetos 3D/decorativos: tinte de un translúcido, color de una luz de borde, emisión tenue, fina iridiscencia. Cada uno sale de algo real del oficio: el metal envejecido del taller, la hoja viva antes del curado, la resina y el aceite de una capa maduro, el vino oscuro de una tripa ligero-fuerte.

### 1.2 Paleta propuesta

Contrastes calculados (WCAG, luminancia relativa); se dan como referencia de **legibilidad del objeto sobre el fondo**, no porque vayan a usarse como texto.

| Token propuesto | Nombre | Hex | Origen material | Rol principal en 3D | Uso máx. (área visible del viewport) | Contraste vs `#0F0E0C` | vs bronce `#C7A479` |
|---|---|---|---|---|---|---|---|
| `--ls-accent-patina` | Verdín / pátina de bronce | `#6F907F` | Óxido verde de las herramientas, chavetas y prensas de bronce del taller; también el verde-gris de la hoja colgada en la casa de curado | Tinte de translúcidos, luz de relleno fría (fill), `sheenColor` | **≤6 %** | 5,49:1 | 1,51:1 (mismo valor, distinto tono → convive bien) |
| `--ls-accent-claret` | Clarete maduro | `#7B2F2B` | Rojo-vino de una capa maduro/oscuro y del aceite en la superficie de la hoja fermentada | Color de **sombra/attenuation** en translúcidos (`attenuationColor`), fondo de volumen, viñeta interna | **≤8 %** (es oscuro, pesa poco) | 2,10:1 (no sirve como forma aislada; solo como profundidad) | 3,95:1 |
| `--ls-accent-celadon` | Celadón de hoja verde | `#BCC8A4` | Verde pálido de la hoja fresca y de las nervaduras antes del curado (la única referencia de verde que ya aparece en el sitio: `inicio-hero.png`) | **Luz de borde** (rim/fresnel), hilo fino de nervadura, highlight de iridiscencia | **≤3 %** (líneas y bordes) | 10,97:1 | 1,32:1 |
| `--ls-accent-amber` | Ámbar resina | `#D4913F` | Resina y goma vegetal, el brillo cálido de la hoja a contraluz, el cedro de la caja | **Emisión tenue** / luz de contraluz (backlight) de los translúcidos; nunca superficie | **≤4 %** | 7,28:1 | 1,14:1 (demasiado cerca del bronce como superficie → solo como luz) |
| *(reserva)* `--ls-accent-ink` | Tinta índigo de plano | `#3F4C6E` | Tinta del dibujo técnico de los moldes y del cielo apagado del hero | Solo en la **Guía/Oficio** si se necesita una luz fría de "plano técnico" | ≤5 % | 2,27:1 | 3,65:1 |

Por qué estos y no otros:
- **Saturación baja** (S ≤ 0,48 en HSL; verdín 0,13, celadón 0,25): leen como "color de materia envejecida", no como color de marca nuevo. Así se cumple UX §4 ("nada saturado nuevo") y a la vez se rompe el monotono marrón.
- **Pares complementarios suaves**: verdín/celadón (fríos) contra clarete/ámbar (cálidos) alrededor del bronce. Un objeto puede usar un frío como luz y un cálido como volumen sin chocar.
- **Origen dominicano**: el verde del Cibao (Tamboril, valle del Cibao) entra como celadón/pátina, no como verde bandera; el índigo queda en reserva para no "azulear" el sitio.

### 1.3 Roles técnicos por acento

| Acento | `color` de superficie | `attenuationColor` (volumen) | `sheenColor` | Luz rim / fresnel | Emisión | `iridescence` (tinte) |
|---|---|---|---|---|---|---|
| Verdín `#6F907F` | Sí, en metal patinado (anillos) | Sí | **Sí** | Sí | No | Sí (rango frío) |
| Clarete `#7B2F2B` | Solo en volúmenes oscuros | **Sí** (mejor uso) | No | No | No | No |
| Celadón `#BCC8A4` | No | No | Sí | **Sí** (mejor uso) | Mínima (líneas de vena) | Sí (pico claro) |
| Ámbar `#D4913F` | No | Sí (resina) | No | Contraluz | **Sí, ≤0,25 de intensidad** | No |

### 1.4 Comportamiento en los 7 perfiles

Propuesta: los acentos **no se exponen en el UI Kit** como editables en v1 (evita romper identidad); se derivan del perfil con una de tres estrategias.

| Perfil | Fondo / acento UI | Estrategia de acentos | Detalle |
|---|---|---|---|
| `base` | `#0F0E0C` / `#C7A479` | **Completos** | Paleta tal cual |
| `heritage` | `#120E0B` / `#B78D58` | **Completos, más cálidos** | Verdín y celadón con `color-mix(... 85%, var(--ls-gold))` para calentarlos |
| `modernLuxury` | `#0D0D0D` / `#D2B36B` | **Completos** | El ámbar se separa más del dorado; puede subir a 5 % |
| `executive` | `#111214` / `#A79576` | **Reducidos**: verdín + índigo | Grafito pide fríos; clarete y ámbar a la mitad de intensidad |
| `quietLuxury` | `#141413` / `#A59B86` | **Reducidos**: solo verdín y celadón al 60 % de saturación | Refinamiento sin exhibición |
| `black` | `#000000` / `#C8C8C8` | **Desaturados** (`color-mix(in oklab, acento 25%, var(--ls-gold))`) | Los objetos leen casi grises con un susurro de tono; la foto sigue siendo el único color |
| `editorialNoir` | `#0B0B0B` / `#BEBBB5` | **Uno solo**: clarete como atenuación y celadón como rim, ambos al 35 % | Dramático pero contenido, "foto de revista" |

Implementación sugerida (solo propuesta, no aplicar): 

```css
:root {
  --ls-accent-patina:  #6F907F;
  --ls-accent-claret:  #7B2F2B;
  --ls-accent-celadon: #BCC8A4;
  --ls-accent-amber:   #D4913F;
  --ls-accent-ink:     #3F4C6E;
  /* 0 = monocromo, 1 = completo. Lo fija cada perfil. */
  --ls-accent-strength: 1;
  /* Derivado que lee el 3D: mezcla hacia el acento UI según la fuerza */
  --ls-accent-patina-3d: color-mix(in oklab, var(--ls-accent-patina) calc(var(--ls-accent-strength) * 100%), var(--ls-gold));
  /* ...idem para cada acento */
}
```

- Para el 3D, leer el valor **resuelto** con `getComputedStyle` + un elemento sonda (`color-mix` no se resuelve leyendo la variable directamente; hay que aplicarla a `color` de un nodo oculto y leer `rgb()`), o calcular la mezcla en JS a partir de los hex y `--ls-accent-strength`.
- `visualProfiles.js` hoy solo acepta 11 claves fijas (`profile()` mapea por índice); añadir acentos implicaría una clave opcional `accentStrength` por perfil, no 5 hex más por perfil.
- Reutilizar el patrón de 03 §h (MutationObserver sobre `<html style>`) para re-teñir materiales e `invalidate()`.

### 1.5 Reglas de uso

1. **Nunca en texto ni en controles.** Botones, enlaces, foco, kickers y bordes de UI siguen con `--ls-gold`/neutros. Los acentos solo existen en luz y material 3D (o su equivalente pre-renderizado/SVG decorativo).
2. **Un acento dominante por sección**, más como máximo un segundo como luz de borde. Propuesta: Home hero → celadón (hoja viva); Oficio/About → verdín (metal y herramienta); Biblioteca de hojas → ámbar (contraluz de la hoja); Craft/Crea tu cigarro → clarete (madurez, volumen).
3. **La hoja real no se tiñe.** Ni el albedo de fotos/texturas de tabaco ni el beige del reproductor `#D6C8B9` reciben acentos. Los acentos rodean a la hoja (luz, anillo, cinta), no la pintan.
4. **Presupuesto de área**: suma de acentos ≤10 % del viewport; bronce + acentos ≤15 %. Medible en QA con una captura y un umbral de saturación.
5. **Intensidad**: emisión ≤0,25; iridiscencia `iridescence` ≤0,4; nada de bloom en v1. Si un objeto "brilla", está mal.
6. **Sin acentos en el overlay de frames** (`#video-root`): de todas formas el WebGL está desmontado allí.
7. **Accesibilidad**: como son decorativos y `aria-hidden`, no hay requisito de contraste; aun así, ningún acento debe ser el único portador de información (p. ej. un tipo de hoja codificado solo por color).
8. **Perfiles monocromos mandan**: si `--ls-accent-strength` es bajo, el objeto debe seguir funcionando solo con forma, luz y valor. Diseñar primero en gris.

---

## 2. Materiales artísticos y su coste (three.js)

Costes **[Conocimiento/Estimación]** sobre three r16x–r17x; verificar con `renderer.info` y una traza en el dispositivo objetivo. "Pase extra" = renderizar la escena (o parte) otra vez a un render target.

### 2.1 Tabla de materiales

| Material / técnica | Qué da | Coste GPU | Pases extra | Móvil (tier 1) | Equivalente barato |
|---|---|---|---|---|---|
| `MeshStandardMaterial` | PBR base (madera mate, hoja, papel) | Bajo | 0 | Sí | — |
| `MeshPhysicalMaterial` + `clearcoat` | Laca/barniz fino sobre metal o madera | Bajo-medio (2º lóbulo especular) | 0 | Sí, con moderación | Subir `roughness` y quitarlo |
| `MeshPhysicalMaterial` + `sheen` (`sheenColor`, `sheenRoughness`) | Terciopelo/fibra: **ideal para la pelusa de la hoja y el papel** | Bajo-medio | 0 | Sí | Fresnel rim en `onBeforeCompile` |
| `MeshPhysicalMaterial` + `iridescence` (`iridescenceIOR`, `iridescenceThicknessRange`) | Película fina tipo aceite/nácar | Medio (ALU de thin-film por píxel) | 0 | Con cuidado (objetos pequeños) | Matcap iridiscente pintado (1 textura) |
| `MeshPhysicalMaterial` + `anisotropy` (+`anisotropyRotation`) | Metal cepillado (anillos de bronce/verdín) | Medio; requiere tangentes/UV coherentes | 0 | Sí en objetos pequeños | Normal map de cepillado + `roughness` 0,35 |
| `MeshPhysicalMaterial` + `transmission`, `thickness`, `ior`, `attenuationColor/Distance` | Vidrio, resina, cera translúcida **real** | **Alto** | **+1 pase**: three renderiza los opacos a un *transmission render target* (con mipmaps para la rugosidad), compartido por todos los transmisivos del frame; con `side: DoubleSide` añade el render de caras traseras | Evitar o 1 objeto, DPR 1 | Fresnel + matcap + `opacity`; o pre-render |
| drei `MeshTransmissionMaterial` | Vidrio "de portfolio" (aberración cromática, distorsión, `backside`) | **Muy alto** | **+1 pase por instancia** (FBO propio, `resolution` por defecto alta) y **+1 más con `backside`**; `samples` 6–10 por píxel | **No** | `MeshPhysicalMaterial transmission` compartido, o pre-render. Si se usa: `samples={4}`, `resolution={256..512}`, `buffer` compartido, sin `backside`, solo tier 2 |
| `MeshMatcapMaterial` | Look "esculpido" sin luces ni env | **Mínimo** (1 lookup de textura) | 0 | **Sí, preferente** | — (es el barato) |
| Fresnel custom (`ShaderMaterial` o `onBeforeCompile`) | Borde luminoso celadón/ámbar, falsa translucidez | Mínimo | 0 | Sí | — |
| Cera / subsurface falso (wrap lighting + mapa de grosor) | Aspecto ceroso, luz que "entra" | Bajo | 0 | Sí | — |
| Papel / fibra (Standard rugoso + normal de fibra + `alphaMap` de borde + backlight falso) | Hoja seca, papel de anilla, etiqueta | Bajo | 0 (alpha-test, no blending) | Sí | — |

Notas clave:
- **Transmisión ≠ transparencia.** `transparent: true` + `opacity` es barato pero sin refracción; ordenar transparencias trae artefactos en geometrías auto-superpuestas (cintas, nudos). Para cintas preferir `alphaTest`/dither o materiales opacos con fresnel.
- **Un solo tipo de transmisión por escena** y, si hay varios objetos transmisivos, que usen `MeshPhysicalMaterial` (comparten el pase) y no `MeshTransmissionMaterial` (un pase cada uno).
- **Iridiscencia ≤0,4** y con `iridescenceThicknessRange` estrecho (p. ej. `[250, 420]` nm) para que el tinte caiga en verdín→celadón→ámbar y no en arcoíris de burbuja.
- **"Nada plástico" (UX §4)**: rugosidad mínima 0,3 en todo lo que no sea vidrio/resina; `clearcoat` ≤0,3; `envMapIntensity` ≤0,8.

### 2.2 Recetas recomendadas por "materia" del sitio

| Materia artística | Receta v1 (tier 2 escritorio) | Receta tier 1 (móvil) | Acento |
|---|---|---|---|
| **Resina ámbar** (gota, cápsula, anillo translúcido) | `MeshPhysicalMaterial({ transmission: 1, thickness: 0.8, ior: 1.5, roughness: 0.25, attenuationColor: claret, attenuationDistance: 0.6, color: '#F1ECE3' })` + contraluz ámbar | Matcap de resina (512 px) + fresnel ámbar | Ámbar + clarete |
| **Bronce patinado** (anillos, aros, toros) | `MeshPhysicalMaterial({ metalness: 1, roughness: 0.45, anisotropy: 0.6, color: gold })` + mapa de pátina (máscara 512 px mezclando `color` hacia verdín en cavidades) | `MeshStandard` metal + misma máscara, sin anisotropía | Verdín |
| **Cera / vela de hoja** (blob orgánico) | Standard + wrap lighting + fresnel celadón; o transmisión baja (0,3) | Wrap lighting + fresnel | Celadón |
| **Hoja/papel flotante** | Standard (`roughness` 0,85) + `sheen` 0,4 (`sheenColor` celadón) + normal de nervaduras + `alphaTest` + backlight falso ámbar | Igual sin `sheen` | Celadón / ámbar |
| **Cinta de seda/tabaco** | Physical `sheen` + `side: DoubleSide`, opaca | Standard DoubleSide + fresnel | Verdín o clarete |
| **Vidrio humo** (escultura central de Home) | Physical transmission compartida, `roughness` 0,35 (vidrio esmerilado: menos "lujo de plástico", más artesanal) | **Pre-render** o matcap | Celadón rim |

### 2.3 Iluminación de entorno

| Opción | Descarga | Coste en runtime | Calidad | Tematizable | Recomendación |
|---|---|---|---|---|---|
| `RoomEnvironment` (three/examples) + `PMREMGenerator` | 0 KB (código ~3 KB) | Generación única ~decenas de ms al montar | Neutro de estudio, bueno para metal y vidrio | Parcial (es gris) | **Default de v1** |
| drei `<Environment>` con `<Lightformer>` (procedural, `frames={1}`, `resolution={256}`) | 0 KB | Se rinde una vez a cubemap 256 | Muy buena: "softboxes" que dibujan reflejos alargados de estudio | **Total**: cada Lightformer toma `color` de un acento (celadón arriba, ámbar contraluz) | **Preferente para el look artístico** |
| HDR pequeño auto-alojado (`.hdr` 256–512 px, o `.exr`/KTX2 RGBM) | ~150–400 KB (256–512 px); un 1K `.hdr` ronda 1–1,5 MB | PMREM al cargar | Realista | No (fotográfico) | Solo si hiciera falta realismo; **no** usar presets de drei que bajan de CDN externo |
| Matcap horneado (WebP/KTX2 256–512 px) | 15–60 KB por matcap | Mínimo | Fijo, "esculpido" | Un matcap por perfil cálido/frío o tintado en shader | **Tier 1 y fallback** |
| Luces analíticas (1 dir + 1 rim) sin env | 0 KB | Mínimo | Pobre en metal/vidrio | Total | Solo para papel/hoja |

Regla: **un solo entorno por canvas**, generado una vez y compartido por todas las vistas (ver §4). Con Lightformers, regenerar (`frames={1}` de nuevo) solo cuando cambia el perfil visual.

---

## 3. Geometría procedural (sin modelos GLB)

Ventaja para TOBACCO: **0 KB de assets**, todo en el chunk de escena (≤30 KB gz), tematizable y con detalle ajustable por tier. Triángulos calculados con las fórmulas de las geometrías de three.

### 3.1 Recetas

| Objeto | Receta | Parámetros tier 2 → tier 1 | Triángulos | Draw calls |
|---|---|---|---|---|
| **Cinta (ribbon) tubular** | `new CatmullRomCurve3(puntos, true, 'centripetal')` → `TubeGeometry(curve, tubular, radius, radial, closed)` | tubular 240→120, radial 8→6 | 240×8×2 = **3.840** → 1.440 | 1 |
| **Cinta plana (seda, hoja larga)** | `PlaneGeometry(1, 1, 4, 256)` doblada en el **vertex shader** siguiendo la curva (curva codificada en una `DataTexture` de 256×1 o en un array uniform); torsión = `uTwist * t`; animable sin recalcular geometría | 4×256 → 2×128 | 4×256×2 = **2.048** → 512 | 1 |
| **Anillo / aro** | `TorusGeometry(R, r, radial, tubular)` | 16×160 → 12×96 | 16×160×2 = **5.120** → 2.304 | 1 |
| **Nudo** | `TorusKnotGeometry(R, r, tubular, radial, p, q)`; p/q = 2/3 o 3/5 para "lazo de anilla" | 256×16 → 128×10 | **8.192** → 2.560 | 1 |
| **Blob orgánico** | `IcosahedronGeometry(1, detail)` + desplazamiento por **simplex/curl noise en el vertex shader** (`pos += normal * noise(pos * f + t) * amp`); normales recalculadas en el shader por diferencias finitas (3 evaluaciones de ruido extra) o derivadas en fragment (`dFdx/dFdy`, facetado sutil) | detail 24 → 12 | 20×(d+1)² = **12.500** → 3.380 | 1 |
| **Superficie de hoja** | `PlaneGeometry(1, 2, 24, 48)`; silueta por **SDF/alpha** en fragment (`alphaTest` 0,5); nervaduras por shader (vena central + secundarias a ±40° con `smoothstep` sobre distancia a líneas) o por `normalMap`/`alphaMap` de 512 px; curvatura y "respiración" en vertex shader | 24×48 → 12×24 | **2.304** → 576 | 1 |
| **Clúster flotante** | `InstancedMesh(geo, mat, N)` con matrices iniciales aleatorias (seed fija) y deriva en vertex shader (`instanceId` → fase) para no tocar CPU cada frame | N 160 × ico detail 1 (80 tris) → N 60 | **12.800** → 4.800 | **1** |
| **Esquirlas de hoja (clúster)** | `InstancedMesh` de quads (2 tris) con atlas de 4 fragmentos de hoja recortados de fotos reales (1 textura 1024 px con alpha) | N 300 → 120 | **600** → 240 | 1 |
| **Partículas de polvo dorado** | `Points` con `size` atenuado; 1 color (bronce/ámbar) | 800 → 200 | 0 (puntos) | 1 |

### 3.2 Composiciones tipo y presupuesto por escena

| Composición (ejemplo) | Piezas | Triángulos tier 2 | Draw calls |
|---|---|---|---|
| Home "escultura de la hoja": blob de resina + 2 anillos de bronce patinado + 1 cinta | 12.500 + 2×5.120 + 3.840 | **≈26.600** | 4 |
| About/Oficio "herramienta-anillo": nudo de bronce + clúster de 60 esquirlas | 8.192 + 120 | **≈8.300** | 2 |
| Biblioteca "hoja flotante": hoja procedural + polvo | 2.304 + puntos | **≈2.300** | 2 |
| Craft "tres capas": 3 cintas concéntricas (capa/capote/tripa) + aro | 3×3.840 + 5.120 | **≈16.600** | 4 |

Todas caben holgadas en ≤50k escritorio; en tier 1 caen a <10k. El coste real no está en los triángulos sino en **los fragmentos** (transmisión, ruido por píxel, DPR): ese es el presupuesto a vigilar.

### 3.3 Notas de implementación

- **Ruido**: una sola función simplex 3D (~1 KB GLSL) compartida por blob, hoja y cinta vía `onBeforeCompile` para conservar iluminación PBR. `three-custom-shader-material` (CSM, ~3 KB) es la vía cómoda en R3F para extender `MeshPhysicalMaterial` sin reescribirlo [Conocimiento].
- **Determinismo**: semillas fijas → el póster de fallback (§4) coincide con el primer frame del 3D.
- **Animación**: el tiempo/scroll entra como `uniform` (`uTime`, `uProgress`); GSAP anima el uniform, no la geometría.
- **Sombras**: ninguna dinámica; una `ContactShadows` horneada una vez (`frames={1}`) o una textura radial de 128 px bajo el objeto.

---

## 4. Arquitectura multisección

Home, About/Oficio, Biblioteca de hojas y Craft son **rutas distintas**: nunca hay 4 objetos visibles a la vez. La pregunta real es cuántos contextos WebGL se crean/destruyen al navegar y cómo se coordinan con GSAP y con el overlay de frames.

### 4.1 Opciones

| | **A. Canvas por ruta** (lazy, uno por página) | **B. Canvas global persistente** + drei `<View>` (scissor) |
|---|---|---|
| Contextos | 1 por ruta; se destruye al salir | 1 para toda la app |
| Coste de navegar | Recrear contexto + compilar shaders (~100–400 ms en frío [Estimación]) → hay que mostrar póster mientras | Casi nulo: programas, entorno PMREM y geometrías compartidas se reutilizan |
| Varios objetos en una página | `<View>` dentro del canvas de la ruta | `<View>` nativo |
| Regla "sin WebGL con `#video-root`" | Trivial en Craft: el canvas vive dentro del contenido que ya se desmonta con `showVideo` (03 §b) | **Exige un store/evento global `showVideo`** (hoy `useState` local, `CraftYourCigar.jsx:171`) para desmontar el canvas y `forceContextLoss()` |
| Memoria | Se libera al navegar | Se acumula si no se hace `dispose` por vista |
| Complejidad | Baja | Media (eventSource, z-index, `position: fixed`, gestión de visibilidad) |
| Riesgo | Bajo | Canvas fijo sobre todo el layout: cuidado con `pointer-events`, stacking con Navbar y el panel de diseño |

**Veredicto**: **Fase 1 = A** (canvas por ruta, lazy, con `<View>` si la ruta tiene más de un objeto). **Fase 2 = B** solo si (a) hay 3D en ≥3 rutas, (b) existe el store/evento de `showVideo` y (c) la medición muestra que la recreación de contexto se nota (>200 ms de póster visible). Hasta entonces B es optimización prematura con más riesgo que beneficio.

### 4.2 Sincronía con GSAP ScrollTrigger

Contexto (03 §a): ScrollTrigger usa `scroller = window`; único uso actual en `ScrollVideo.jsx`.

| Tipo de objeto | Frameloop | Patrón |
|---|---|---|
| Dirigido por scroll (la cinta se enrolla, el anillo gira con el avance) | `frameloop="demand"` | `ScrollTrigger.create({ trigger: sectionEl, start, end, scrub: 0.6, onUpdate: s => { uniforms.uProgress.value = s.progress; invalidate(); } })`. `scrub` numérico ya suaviza; no hace falta lerp propio |
| Dirigido por scroll con timeline compleja | `frameloop="never"` | Timeline GSAP con `onUpdate: () => advance(performance.now())`: un render por tick de GSAP, sin rAF de R3F |
| Flotación ambiental (deriva lenta) | `"always"` **solo mientras visible** y tier 2; en tier 1, deriva **a 30 fps** con `gsap.ticker` propio (acumulador) + `advance` | Alternar a `"never"` con IntersectionObserver |
| Hover / puntero | `"demand"` | `invalidate()` en `pointermove` (throttle rAF) |

Reglas:
- Crear los ScrollTriggers en un `useLayoutEffect` con `gsap.context(…, scope)` y `ctx.revert()` al desmontar (patrón de 03 §a), **después** de que el canvas lazy haya montado; luego `ScrollTrigger.refresh()` (el alto de la sección puede cambiar al sustituir el póster).
- **No** usar `ScrollControls` de drei (crea su propio scroller y choca con `window`).
- Al liberar el scroll lock del overlay, `ScrollTrigger.refresh()` (prerrequisito ya listado en UX §11).
- El objeto lee el progreso de un `uniform`; el DOM (texto) se anima con GSAP/framer como siempre. Una sola fuente de verdad: el `ScrollTrigger` de la sección.

### 4.3 Pausa, carga y fallback

1. **IntersectionObserver** con `rootMargin: '200px'`: fuera → `frameloop="never"`; a más de 1 viewport → desmontar la escena (no el canvas, en B).
2. `visibilitychange` → pausar tweens y `"never"`.
3. **Lazy chunk**: `React.lazy(() => import('./three/HomeSculpture'))` con `vendor-3d` separado en `manualChunks`; precarga en `requestIdleCallback` solo si tier 2 y sin `saveData`.
4. **Póster**: WebP/AVIF del primer frame (misma semilla, §3.3), 1 por perfil cálido/monocromo como máximo (2 variantes), ≤60 KB cada uno. Es el fallback de `Suspense`, el estado de `prefers-reduced-motion`, el de tier 0 y el de `webglcontextlost`. Debe ser el LCP si el objeto está en el hero.
5. **Desmontaje antes de `#video-root`**: en A ya ocurre por estructura en Craft; en B, `showVideo` global → desmontar `<Canvas>` + `gl.forceContextLoss()` **un tick antes** de montar el overlay (03 §b regla 3).
6. **QA**: `renderer.info.memory` vuelve a 0 tras 10 navegaciones Home↔Biblioteca y 10 aperturas del overlay.

### 4.4 Presupuesto con objetos en 4 secciones

| Recurso | Por ruta (A) | Global (B, peor caso con 4 vistas registradas) |
|---|---|---|
| JS | `vendor-3d` ≤220 KB gz (una vez, cacheado) + escena ≤30 KB gz × ruta | Igual; las 4 escenas ≤120 KB gz en total, cada una lazy |
| Triángulos visibles | ≤30k (objetivo), ≤50k (techo) | ≤50k sumando vistas visibles a la vez |
| Draw calls | ≤12 | ≤20 visibles |
| Pases extra | ≤1 (una transmisión compartida) en tier 2; 0 en tier 1 | ≤1 por frame en total |
| Texturas | ≤4 (matcap, normal de fibra, máscara de pátina, atlas de esquirlas), ≤1024², KTX2/WebP | Compartidas: ≤8 en total |
| Memoria GPU | ≤32 MB | ≤48 MB |
| Entorno | Lightformers 256 px (≈1,5 MB GPU) | Uno compartido |
| Pósters | ≤60 KB × objeto × 2 variantes | Igual |
| FPS | 60 escritorio / ≥30 móvil; <30 sostenido 2 s → póster | Igual |

---

## 5. Comparativa para objetos artísticos flotantes

Tamaños y soporte **[Conocimiento/Estimación]**, a verificar con build y pruebas en Safari iOS real.

| Tecnología | Peso de red | Calidad de translúcidos/metal | Tematizable en runtime (7 perfiles) | Scroll-scrub / interacción | Móvil | Producción | Veredicto |
|---|---|---|---|---|---|---|---|
| **R3F + drei** | three+R3F+drei ≈190–220 KB gz (una vez) + escena ≤30 KB | Real (transmisión, iridiscencia, sheen, anisotropía) | **Total** (uniforms desde tokens) | **Total**, a cualquier progreso | Con tiers y fallback | Código; iteración rápida | **Para piezas interactivas o ligadas a scroll y para la escultura del Home** |
| **three vanilla** | ≈150–170 KB gz | Igual | Total | Total | Igual | Más código imperativo en `useEffect` | Solo si se quiere ahorrar ~40–50 KB y no usar `<View>`; en React no compensa |
| **Spline** | Runtime ≈500 KB+ gz + `.splinecode` (cientos de KB) | Buena, pero shaders cerrados | Limitado (variables de Spline, no tokens) | Eventos propios; scrub frágil | Pobre; la skill recomienda escenas móviles separadas | Muy rápida para diseñadores | **No** (ya descartado en UX §10 / 03 §i). Útil solo como **herramienta de boceto** para exportar después a GLB o pre-render |
| **CSS / SVG fake-3D** (gradientes cónicos, `filter: blur`, máscaras, `perspective`, framer) | 0 KB | Translucidez sugerida, no real; anillos e iridiscencia convincentes con `conic-gradient` + `mix-blend-mode` | **Total** (CSS vars) | Total (GSAP/framer) | Excelente | Bajo | **Para anillos, halos, aros de "espécimen" y tier 1** |
| **Vídeo loop con alpha** (WebM VP9 alpha + HEVC alpha `.mov`/`hvc1`) | 512×512, 4–6 s en bucle: VP9 ≈300–800 KB; HEVC alpha suele ser **mayor** (≈0,8–2 MB). **Dos codificaciones** obligatorias | **Máxima** (render offline: Cycles/Blender con SSS, cáusticas, DOF) | **No**: 1 render por variante (cálida / monocroma) → ×2 peso de assets; tinte CSS parcial con `filter`/`mix-blend-mode` | Autoplay en bucle sí; **scrub malo** (seek necesita keyframes; all-intra multiplica el peso) | Autoplay `muted playsinline` falla en modo bajo consumo de iOS → póster; ocupa decodificador de vídeo | Pipeline Blender + ffmpeg + `avconvert`/Compressor para HEVC alpha | **Muy buena para objetos puramente decorativos de bucle** (Home lateral, About) |
| **Secuencia de imágenes / sprite** (WebP/AVIF con alpha, dibujado en canvas 2D como el reproductor actual) | 48 frames × 512 px × ~20–35 KB ≈1–1,7 MB; atlas 4×4 a 2048² ≈ 600 KB–1 MB | Máxima (offline) | No (igual que vídeo) | **Scrub perfecto** (índice = progreso), reutiliza conocimiento de `frameScheduler` | Memoria: 48 bitmaps 512² ≈ 50 MB decodificados → limitar a 24–32 frames en móvil | Igual que vídeo | Para un objeto que **gira con el scroll** sin WebGL; vigilar memoria |
| AVIF/WebP animado con alpha (`<img>`) | Similar o mayor que VP9 | Máxima | No | No | Bueno (sin decodificador de vídeo; AVIF animado: Chrome, Firefox, Safari 16.4+) | Igual | Alternativa al vídeo cuando el autoplay sea un problema |
| Lottie / Rive / Zdog | 30–80 KB runtime | Vectorial plano | Parcial | Sí | Bien | Medio | **No encajan** con la estética fotográfica/material |

### 5.1 Lectura honesta de la opción pre-renderizada

A favor:
- **Calidad imposible en tiempo real** con el presupuesto móvil: subsurface verdadero en cera/resina, cáusticas del ámbar, profundidad de campo, polvo con motion blur.
- **Coste de runtime casi nulo**: sin chunk `vendor-3d` en rutas que solo tengan decorativos; sin riesgo de contexto WebGL junto al reproductor.
- Póster gratis (frame 0) y `prefers-reduced-motion` trivial.

En contra:
- **Tematización**: los 7 perfiles obligan a 2 variantes mínimas (cálida y monocroma); los acentos dejan de ser tokens y pasan a estar "horneados". Si el usuario edita colores en el UI Kit, el objeto no le sigue.
- **Alpha multiplataforma = dos archivos**: Safari no reproduce el canal alpha de WebM VP9 [Conocimiento]; necesita HEVC con alpha (macOS 10.15+/iOS 13+). Orden de `<source>`: primero `video/mp4; codecs="hvc1"` (HEVC alpha), después `video/webm` (VP9). Firefox/Chrome toman el WebM.
- **Halo/borde**: el alpha premultiplicado mal exportado deja contorno oscuro sobre `#0F0E0C`; renderizar sobre fondo del mismo valor o exportar premultiplicado correctamente.
- **Sin interacción real** (no reacciona al puntero salvo parallax CSS del contenedor).
- **Decodificador**: en Craft, nunca reproducir un vídeo decorativo mientras exista `#video-root` (misma regla que WebGL).

Conclusión: para un objeto **decorativo, de bucle, sin interacción** (p. ej. una gota de resina que gira en About), el vídeo con alpha a 512 px (~0,5 MB VP9 / ~1,2 MB HEVC) es **más ligero en total que cargar three** (~200 KB gz de JS + compilación de shaders + GPU) **solo si** es el único 3D de la ruta. En cuanto la ruta ya paga `vendor-3d`, un objeto procedural más cuesta ~5–15 KB y es tematizable: ahí gana R3F.

---

## 6. Skills revisadas

Instaladas: `gsap-scrolltrigger`, `lightweight-3d-effects` (cache del plugin). Resto: `~/.claude/plugins/marketplaces/claude-design-skillstack/.factory/skills/` (no instaladas). Observación general: las skills de 3D son **genéricas** (Environment con presets de CDN, `frameloop="demand"`, glTF); **no cubren** `MeshTransmissionMaterial`, `<View>`/scissor, Lightformers ni vídeo con alpha. Las recomendaciones de §2–§5 vienen de conocimiento propio de three/drei y deben verificarse con la versión instalada.

| Skill | Estado | Relevancia | Uso para TOBACCO |
|---|---|---|---|
| `gsap-scrolltrigger` | Instalada | **Alta** | Sección "With Three.js/WebGL" y secuencia en canvas: base de §4.2 y de la opción sprite |
| `react-three-fiber` | Marketplace | **Alta** | `frameloop`, `Environment`, rendimiento. Incompleta para materiales avanzados |
| `threejs-webgl` | Marketplace | **Alta** | `MeshPhysicalMaterial` (clearcoat/transmission), culling, PMREM |
| `web3d-integration-patterns` | Marketplace | **Alta** | Arquitectura GSAP + R3F + framer; `frameloop="demand"`. Cuidado: usa presets de entorno de CDN |
| `blender-web-pipeline` | Marketplace | **Media-alta** | Si se elige pre-render (vídeo/sprites) o se esculpe un GLB; export glTF + Draco/Meshopt |
| `motion-framer` | Marketplace (framer ya instalado) | Media | Capa DOM/SVG de los objetos fake-3D y del póster |
| `lightweight-3d-effects` | Instalada | Baja | Zdog/Vanta/Vanilla-Tilt: la propia skill indica Vanta ≈120 KB con three; no encaja (coincide con 03 §i) |
| `substance-3d-texturing` | Marketplace | Baja-media | Solo si se hornean mapas de pátina/fibra a 512–1024 px; la máscara procedural lo hace innecesario en v1 |
| `spline-interactive` | Marketplace | Baja | Boceto de formas; runtime descartado |
| `pixijs-2d` | Marketplace | Baja | Alternativa a canvas 2D para sprites; innecesaria (el proyecto ya tiene scheduler propio) |
| `lottie-animations`, `rive-interactive` | Marketplace | Baja | Vectorial plano, fuera de la estética |
| `babylonjs-engine`, `playcanvas-engine` | Marketplace | Muy baja | Motores completos; peso y paradigma no justifican cambiar de three |
| `aframe-webxr` | Marketplace | Nula | XR fuera de alcance |
| `animejs`, `react-spring-physics`, `locomotive-scroll`, `scroll-reveal-libraries`, `barba-js`, `animated-component-libraries` | Marketplace | Nula-baja | Duplican GSAP/framer o chocarían con ScrollTrigger (`locomotive-scroll` cambia el scroller) |
| `modern-web-design` | Marketplace | Baja | Referencias generales |
| `skill-creator` | Marketplace | Nula | — |

---

## 7. Conclusión: stack por tipo de objeto y presupuesto global

### 7.1 Stack recomendado

| Tipo de objeto | Ejemplo | Stack v1 | Material | Acento | Tier 1 / fallback |
|---|---|---|---|---|---|
| Escultura central ligada al scroll | Home: blob de resina + anillos patinados que se ordenan al bajar | **R3F + drei**, `frameloop="demand"` + ScrollTrigger `onUpdate`→`invalidate` | Physical transmission compartida (1 pase) + bronce anisotrópico + Lightformers | Celadón rim + ámbar contraluz | Matcap + fresnel; póster |
| Cinta / anillo de la composición (capa-capote-tripa) | Craft: tres cintas concéntricas | **R3F** (dentro del contenido que se desmonta con `showVideo`) | Physical `sheen`, opacas DoubleSide | Clarete | SVG/CSS (anillos cónicos) |
| Hoja flotante procedural | Biblioteca: hoja que "respira" junto a la foto real | **R3F** si la ruta ya lo carga; si no, **CSS 3D** sobre la foto | Standard + sheen + alphaTest + backlight falso | Ámbar | Foto real con tilt CSS |
| Decorativo de bucle sin interacción | About/Oficio: gota de resina o nudo de bronce girando | **Vídeo alpha** (HEVC + VP9, 512 px) **si es el único 3D de la ruta**; si no, R3F | Render offline | Verdín | Póster WebP |
| Halos, aros de espécimen, iridiscencia de fondo | Todas | **CSS/SVG** (conic-gradient, máscaras) | — | Cualquiera, ≤3 % | Mismo |
| Clúster de esquirlas/polvo | Home/Oficio | R3F `InstancedMesh` / `Points` (1 draw call) | Atlas de recortes reales | Bronce/ámbar | Ocultar |

**Materiales**: preferir `MeshPhysicalMaterial` (transmisión compartida, sheen, iridiscencia ≤0,4, anisotropía) sobre `MeshTransmissionMaterial`; este último solo en tier 2, una instancia, `samples` 4, `resolution` ≤512, sin `backside`. Entorno: Lightformers procedurales (0 KB) teñidos con acentos; `RoomEnvironment` como alternativa; nunca presets de CDN.

**Arquitectura**: canvas lazy **por ruta** con `<View>` para varios objetos; canvas global persistente solo en fase 2 y con `showVideo` en un store. ScrollTrigger con `scroller = window` gobierna uniforms; R3F en `demand`/`never`.

### 7.2 Presupuesto global

| Métrica | Valor |
|---|---|
| Bundle inicial | +0 KB |
| `vendor-3d` | ≤220 KB gz, cargado una vez, solo tier 2 (y tier 1 donde haya escena) |
| Escenas | ≤30 KB gz cada una; ≤4 escenas |
| Vídeos/sprites decorativos | ≤1,5 MB por ruta sumando variantes; ≤2 variantes por objeto |
| Pósters | ≤60 KB por objeto y variante |
| Triángulos | ≤30k objetivo / 50k techo escritorio; ≤10k móvil |
| Pases extra | ≤1 por frame (transmisión) escritorio; 0 móvil |
| Draw calls | ≤12 por ruta |
| GPU | ≤32 MB por ruta (≤48 MB con canvas global) |
| Color | acentos ≤10 % del viewport; un acento dominante por sección; 0 % en texto/UI |
| Coexistencia | 0 WebGL y 0 vídeo decorativo con `#video-root` montado |

Prerrequisitos (no cambian): limpieza de `index.html`, code-splitting, baseline Lighthouse, `MotionConfig`, `getDeviceTier()`, evento/store de tema y de `showVideo` (UX §11, 03 §l).
