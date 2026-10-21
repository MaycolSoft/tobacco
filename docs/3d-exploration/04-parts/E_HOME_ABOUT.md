# E — Objetos artísticos 3D para Inicio y Oficio

> **Referencia histórica de exploración (19/10/2026).** H1/O2/L1/ART-C1 se implementaron después; tecnología, cifras y tareas de este documento describen aquella fase. Consultar [estado vigente](../PROGRESS.md) y [pendientes del proyecto](../../STATUS.md). Los encargos y restricciones de sesiones anteriores no son instrucciones actuales.

> Agente E (dirección de arte 3D). Solo exploración: no se toca el código, no se instala nada y no se generan imágenes.
> Fuentes: [TOBACCO_3D_UX_RECOMMENDATIONS.md](../../TOBACCO_3D_UX_RECOMMENDATIONS.md) (§3-§11, §14, §17), [01_VISUAL_ANALYSIS.md](../01_VISUAL_ANALYSIS.md) (§1-6, §10), [02_3D_CONCEPTS.md](../02_3D_CONCEPTS.md) (lista de conceptos y descartes), `src/pages/Home.jsx`, `src/pages/About.jsx` y `src/styles/site-editorial.css`.

## Progreso

- [x] Lectura de documentos
- [x] Revisión de código (Home, About, CSS)
- [x] Revisión de capturas (inicio-hero, inicio-recorrido, inicio-tres-momentos, inicio-arte-de-mezclar, inicio-cta, oficio, proceso)
- [x] Propuestas AR-H1…H3 / AR-O1…O2
- [x] Ideas descartadas
- [x] Top 2

---

## 1. Contexto verificado

**Lo que se ve en las capturas**
- **Hero** ([inicio-hero.png](../../../design-review/desktop/inicio-hero.png)): H1 a la izquierda y foto a sangre con plantación verde, un trozo de cielo azul y un cigarro con anilla «TAMBORILERO» abajo a la derecha. Es el **único punto del sitio con verde y azul**. El cuadrante derecho ya tiene objeto (el cigarro), así que no se añade nada.
- **Intro `#recorrido`** ([inicio-recorrido.png](../../../design-review/desktop/inicio-recorrido.png)): H2 «Del cultivo al cigarro, sin saltarse la historia.» a la izquierda. A la derecha, el párrafo y el enlace «VER EL RECORRIDO» terminan hacia y≈280 px, y debajo quedan **unos 250 px de negro puro** hasta el corte de sección (y≈537). El hueco tiene propósito: el titular habla de un recorrido que nunca se ve.
- **Tres momentos** ([inicio-tres-momentos.png](../../../design-review/desktop/inicio-tres-momentos.png)): `.site-section-heading` con el H2 a la izquierda y el párrafo «21 hojas documentadas…» alineado abajo a la derecha. Encima de ese párrafo hay **unos 90 px de vacío** (x≈915-1305, y≈140-220). Las tarjetas no se tocan (§3 de las recomendaciones).
- **El arte de combinar** ([inicio-arte-de-mezclar.png](../../../design-review/desktop/inicio-arte-de-mezclar.png)): caja `#171512` de unos 560×600 px. La hoja ocupa una franja diagonal central y **el tercio superior izquierdo y la franja derecha de la caja están vacíos**. La leyenda tapa un sello cortado (U8).
- **CTA** ([inicio-cta.png](../../../design-review/desktop/inicio-cta.png)): la foto de manos ya cuenta el gesto. No se toca.
- **El oficio** ([oficio.png](../../../design-review/desktop/oficio.png), [proceso.png](../../../design-review/desktop/proceso.png)):
  - En `#proceso`, la cabecera `.site-section-heading--wide` deja la columna derecha con el lead en 2 líneas (y≈170-215) y luego **unos 220 px vacíos** a la derecha de las pills 01-03 (x≈905-1305, y≈230-440).
  - La cita final `.site-quote` está centrada sobre un negro amplio.
  - «03 Elaboración» no se toca.

**Código**
- Las secciones de la Home son `section.site-hero`, `section#recorrido.site-section.site-shell.site-intro-grid` (grid `1.08fr .92fr`), `section#recorrido-pasos.site-section--surface` › `.site-section-heading`, `section.site-feature` › `figure.site-feature__image` (`min-height:600px; overflow:hidden; position:relative`) y `section.site-cta`.
- Las de El oficio son `.site-about-intro` (grid 1fr 1fr), `.site-principles--flow` (4 columnas), `#proceso` › `.site-section-heading--wide` + `.site-chapter-nav`, `.site-process-chapter` (`.85fr 1.15fr`), `#elaboracion.site-process-feature` y `.site-quote` (`max-width:920px`, centrada).
- Por debajo de 1100 px las rejillas pasan a una columna (líneas 251-258).
- El color de marca se lee de `--ls-gold` (`tokens.css:31`). Hay 7 perfiles visuales, así que **los acentos deben derivarse por `color-mix` de los tokens**, no fijarse en el código.

---

## 2. Paleta de acentos (propuesta)

La regla es que los acentos **solo viven dentro de los materiales 3D**, nunca en la UI: los botones, los enlaces y el estado seleccionado siguen siendo bronce o marfil. Cada acento cubre como mucho el 5 % del área visible de su sección y aparece como reflejo, veladura o filo, nunca como relleno plano.

| Acento | Hex | Origen y justificación | Uso |
|---|---|---|---|
| **Pátina** (verdete de bronce) | `#7E9A8C` | Es el bronce `#C7A479` oxidado: comparte familia y relato (metal trabajado, tiempo). Hace eco del único verde real del sitio (la plantación del hero) sin ser «verde planta». | Filos, iridiscencia de baja intensidad, segunda cara de las cintas |
| **Ámbar resina** | `#C98A3E` (veladura al 35-50 %) | La luz cálida que atraviesa la hoja curada a contraluz. Es más saturado y luminoso que el bronce y, al ser translúcido, no compite con él. | Volumen de la resina (`attenuationColor`) |
| **Colorado profundo** (oxblood) | `#6B2B24` | Nombre real de un tono de capa («colorado»). Da calidez y peso al centro sin introducir rojo de alerta. | Núcleo interior (la tripa) y sombras coloreadas |
| **Tinta nocturna** | `#26303D` | Recoge el azul del cielo del hero, muy oscurecido. Solo se usa como luz de relleno o rim frío, para que el bronce «brille» por contraste. | Luz de relleno o hemisférica, nunca superficie |

Derivación por tokens (ejemplo): `--art-patina: color-mix(in oklab, var(--ls-gold) 45%, #5F8A80)`. En los perfiles visuales claros se reduce la mezcla. **Evitar**: saturaciones por encima de ~45 %, el verde `#5FA14A` de `MixingAnimation.jsx` y los neones.

---

## 3. Estrategia técnica común

- **Un único `<Canvas>` por página**, `position:fixed; inset:0; pointer-events:none; z-index:0`. Cada objeto se dibuja en su `<View>` de drei (scissor) anclado a un `div` vacío dentro de la sección. Así hay un solo contexto WebGL, un solo chunk lazy (three + R3F v9 + drei) y ninguna alteración del layout.
- **Render**:
  - `frameloop="demand"`; el idle invalida a unos 30 fps solo mientras algún `View` está en el viewport (IntersectionObserver).
  - `dpr` ≤1,5.
  - `powerPreference:'low-power'`.
  - `dispose` y `forceContextLoss()` al salir de la ruta.
- **GSAP**:
  - `gsap.context()` + `matchMedia('(min-width:1100px) and (prefers-reduced-motion:no-preference)')`.
  - `scroller: window` y triggers por ref.
  - El scrub escribe en refs, y `useFrame` o `invalidate()` las leen.
  - Ningún pin nuevo en la Home.
- **Transmission**: solo **un** objeto por página la usa (AR-H2), porque añade un render pass de la escena opaca. El resto usa un shader de fresnel o `MeshPhysicalMaterial` sin transmission (sheen, clearcoat e iridescence bajos).
- **Gating**: <1100 px, `saveData`, `deviceMemory`<4 o reduced motion implican **sin WebGL**. Se muestra un póster WebP o un SVG estático en el mismo ancla.
- **Accesibilidad**: todo `aria-hidden`, sin foco y sin texto dentro del 3D.
- Si las recomendaciones mantienen «sin three fuera de C1», AR-H1, AR-H3 y AR-O2 tienen **versión SVG + GSAP de calidad equivalente** (indicada en cada ficha).

---

## 4. Propuestas

### AR-H1 — «Cinta del cultivo»

| Campo | Detalle |
|---|---|
| Captura | [inicio-recorrido.png](../../../design-review/desktop/inicio-recorrido.png): unos 250 px de negro bajo «VER EL RECORRIDO» en la columna derecha. El H2 promete un recorrido «del cultivo al cigarro» que la página no muestra. Es un vacío con propósito y la primera de tres pantallas tipográficas sin movimiento (01 §6). |
| Ubicación | `Home.jsx` › `section#recorrido.site-intro-grid`, segunda columna. Un `div` ancla `aria-hidden` tras el enlace, de unos 420×240 px, alineado a la izquierda de la columna y con `z-index:0` bajo el texto. No cambia la altura de la sección: el ancla se coloca absoluta en el padding inferior. |
| Aspecto | Una **cinta estrecha** (unos 18 px de ancho aparente y 600 px de largo) que entra plana y ondulante por la izquierda como una lámina de hoja con su nervio central marcado. Hacia la derecha se tuerce y termina **enrollada en una hélice cerrada** de 5-6 vueltas, la forma del cigarro sugerida, no dibujada. Flota con una sombra tenue y sin suelo. |
| Materiales | Satén con `sheen` (`sheenRoughness .6`), `roughness .55` y un normal map procedural de venas finas (ruido direccional en el shader, sin textura). La cara posterior tiene un tono distinto (material de dos caras). |
| Color | Gradiente a lo largo de la cinta: **pátina `#7E9A8C`** en el extremo plano (el cultivo) → bronce `#C7A479` → **colorado `#6B2B24`** en el interior de la hélice. El reverso es superficie `#211E19`. El color *cuenta* el curado: de verde a marrón. |
| Movimiento | Idle: ondulación del extremo plano (amplitud de 4 px y periodo de 7 s) y respiración de la hélice (±1,5° de rotación). Se detiene al salir del viewport. |
| Interacción | El cursor sobre la columna desplaza la luz clave ±15°, no el objeto. Sin clic. |
| GSAP | ScrollTrigger con trigger `#recorrido`, `start:'top 70%'`, `end:'bottom 40%'`, `scrub:0.6`, **sin pin**. El progreso (0→1) mueve un uniform `uRoll`: la cinta pasa de plana a enrollada. Al llegar a «Tres momentos» queda cerrada. |
| Implementación | `TubeGeometry` aplanada o un `PlaneGeometry` de 200×4 segmentos deformado en el vertex shader: la posición a lo largo de la cinta interpola entre una curva sinusoidal y una hélice según `uRoll`. **Alternativa SVG**: un path con `stroke` en gradiente y morph de dos paths (MorphSVG no está; se interpola con `attr:{d}` y el mismo número de puntos) más `strokeDashoffset`. |
| Rendimiento | ≈1,6k triángulos, 1 material y 0 texturas. Muy bajo. |
| Móvil | Póster estático (la cinta a mitad de enrollar) o la versión SVG sin scrub. |
| Reduced motion | Estado final enrollado, estático. |
| Narrativa | Materializa el titular «Del cultivo al cigarro» y anticipa la espiral de capa (C3) y la anatomía (C1): es la misma hélice a otra escala. |
| Riesgo de identidad | **Bajo**. Es un trazo fino y monocromo-cálido, y solo una punta de pátina. |
| Imagen conceptual | Sí: **ART-H1-REF**. Cinta satinada estrecha sobre negro cálido: plana con nervio y tono verde pátina a la izquierda, que se enrolla en hélice bronce-colorado a la derecha. Luz lateral cálida, sin fondo ni texto. |

### AR-H2 — «Lente de resina» (evolución artística de A2)

| Campo | Detalle |
|---|---|
| Captura | [inicio-arte-de-mezclar.png](../../../design-review/desktop/inicio-arte-de-mezclar.png): la caja `.site-feature__image` tiene vacío arriba a la izquierda y en la franja derecha, y el copy dice «Se trata de entenderlas». Una lente invita literalmente a *mirar de cerca*. |
| Ubicación | `Home.jsx` › `section.site-feature` › `figure.site-feature__image`. Un ancla absoluta dentro de la figura, en el cuadrante superior derecho (unos 220×220 px, `top:12%`, `right:10%`), `z-index:1`, sobre la `img` y bajo la `figcaption`. Al hacer scroll, la lente baja en diagonal hasta quedar **sobre la hoja**. |
| Aspecto | Un **canto rodado de resina** (elipsoide aplanado de bordes muy suaves, unos 200 px) que contiene en suspensión **un fragmento de nervio de hoja** y fibras finas. Cuando pasa por delante de la hoja de la foto la refracta y la aumenta: la hoja «se entiende» a través de la lente. |
| Materiales | `MeshPhysicalMaterial`: `transmission 1`, `thickness 1.2`, `ior 1.5`, `roughness .08`, `attenuationColor` ámbar y `attenuationDistance .9`, `clearcoat .4`. Iridescencia **muy baja** (`iridescence .15`, rango 200-400 nm) para un filo de pátina en el contorno. Fibra interior: 30-40 tubos finos (`InstancedMesh`) en colorado y bronce, mate. |
| Color | El cuerpo es una veladura **ámbar `#C98A3E`**; el borde, iridiscencia hacia **pátina `#7E9A8C`**; las fibras, **colorado `#6B2B24`** y bronce. Encaja porque es la luz que atraviesa la hoja a contraluz: color de materia, no inventado. |
| Movimiento | Idle: rotación lenta en Y (360° en 40 s) y flotación vertical de ±6 px con periodo de 6 s. |
| Interacción | Hover sobre la figura: la lente se inclina hacia el cursor (≤8°, con lerp) y la refracción desplaza la hoja de detrás. Sin clic (el CTA «Ver cómo se compone» sigue siendo la acción). |
| GSAP | Trigger `.site-feature`, `start:'top 75%'`, `end:'center center'`, `scrub:0.8`, sin pin. Mueve la lente de la esquina superior derecha a 30 % del centro de la hoja y escala de 0,85 a 1. **Incompatible con A2 en el mismo sitio**: o se hace A2 (tres hojas) o AR-H2. Variante híbrida: la lente aparece cuando A2 termina, sobre la capa. |
| Implementación | `SphereGeometry(1, 64, 48)` escalada (1, 0,62, 0,9) y deformada con ruido suave, más fibras como `TubeGeometry` instanciadas. La transmisión necesita **ver la foto**: la `img` se replica como un plano texturizado dentro del `View` (textura ≤1024 px, la thumb), porque WebGL no refracta el DOM. **Alternativa CSS**: un círculo con `backdrop-filter: blur(0) saturate(1.2)` + SVG `feDisplacementMap` sobre la imagen. Es menos convincente pero tiene coste cero. |
| Rendimiento | ≈8k triángulos de lente + ≈6k de fibras. **Transmission = render pass extra** de la escena opaca (aquí solo el plano de la foto, barato). Es el objeto más caro: debe ser el único con transmission en la Home. |
| Móvil | Póster WebP de la lente sobre la hoja (generado del propio render). Sin WebGL. |
| Reduced motion | Lente estática sobre la hoja, sin rotación. |
| Narrativa | «Entenderlas»: la lente es el gesto de observar del tabaquero. Además conecta con el principio «Observar» de El oficio. |
| Riesgo de identidad | **Medio**. El vidrio puede leerse como «tech» si brilla demasiado. Hay que mantener la rugosidad baja pero no cero, sin reflejos de entorno blancos (un environment cálido propio, generado con `Lightformer` de drei) e iridiscencia casi imperceptible. |
| Imagen conceptual | Sí: **ART-H2-REF**. Canto de resina ámbar translúcido con un fragmento de nervio de hoja curada suspendido dentro. Flota sobre negro cálido junto a una hoja oscura que se ve refractada a través de él. |

### AR-H3 — «Tres anillos, una materia»

| Campo | Detalle |
|---|---|
| Captura | [inicio-tres-momentos.png](../../../design-review/desktop/inicio-tres-momentos.png): el H2 «Tres momentos. Una misma materia.» enuncia una idea (tres en uno) que las tarjetas no visualizan. Además hay vacío sobre el párrafo de la derecha (y≈140-220). Es la tercera pantalla estática seguida. |
| Ubicación | `Home.jsx` › `section#recorrido-pasos` › `.site-section-heading`. Un ancla de unos 200×150 px en la columna derecha, **encima** del `p` («21 hojas…»), alineada a la derecha y a `z-index:0`. **Nada dentro de las tarjetas.** |
| Aspecto | Tres **anillos finos** (toros de sección muy delgada, relación 1:40) de igual diámetro, entrelazados en ángulos distintos (como un astrolabio mínimo), que comparten un centro vacío. En reposo forman una esfera abierta y ligera. |
| Materiales | Anillo 1: bronce cepillado (`metalness .9`, `roughness .45`, anisotropía `.6`). Anillo 2: pátina mate (`metalness .3`, `roughness .7`). Anillo 3: marfil de cera/porcelana (`roughness .5`, `sheen .3`). Sin transmission. |
| Color | Bronce `#C7A479`, **pátina `#7E9A8C`** y marfil `#F1ECE3` al 85 %. Son los tres colores de la identidad más un solo acento. Fondo de la sección `#171512`. |
| Movimiento | Idle: cada anillo gira sobre su eje a velocidades distintas (25, 32 y 41 s por vuelta). El conjunto no se traslada. |
| Interacción | Hover en la tarjeta 01/02/03 → el anillo correspondiente se ilumina (emisivo +0,15) y se alinea en vertical en 500 ms; los demás bajan al 40 %. En táctil no aplica. Sin clic (las tarjetas ya enlazan). |
| GSAP | Trigger `#recorrido-pasos`, `start:'top 80%'`, `end:'top 30%'`, `scrub:0.5`, sin pin: los tres anillos llegan **coplanares y separados** (tres círculos en fila, eco de las 3 columnas) y se entrelazan al progresar. Lectura: «tres momentos» → «una materia». |
| Implementación | 3 × `TorusGeometry(1, 0.025, 12, 160)`. Las tarjetas emiten `pointerenter` a un store mínimo (zustand ya existe) que lee el `View`. **Alternativa SVG**: tres elipses con `rotateX/Y` en CSS 3D (`transform-style: preserve-3d`), muy fiel a este diseño lineal. |
| Rendimiento | ≈11k triángulos, 3 materiales simples. Bajo. |
| Móvil | SVG estático (tres anillos entrelazados) o nada; en una columna, el `p` ya ocupa el ancho. |
| Reduced motion | Estado entrelazado estático; el hover solo cambia la opacidad. |
| Narrativa | Traduce literalmente el H2. Es el único objeto de la Home que **reacciona a la UI** (a las tarjetas) sin estar dentro de ella. |
| Riesgo de identidad | **Bajo-medio**: el lenguaje lineal de 1 px y el «círculo fino como marco de espécimen» (§4) ya existen en el sitio. El riesgo es que se lea como logotipo genérico si los anillos son gruesos. |
| Imagen conceptual | Sí: **ART-H3-REF**. Tres anillos muy finos entrelazados (bronce cepillado, pátina mate y marfil de cera) flotando sobre gris casi negro. Luz cálida lateral y sombra apenas visible. |

### AR-O1 — «Velo de cera»

| Campo | Detalle |
|---|---|
| Captura | [oficio.png](../../../design-review/desktop/oficio.png): la cita final «Conocer la hoja transforma la manera de entender el cigarro.» está centrada en un negro amplio entre el bloque 03 y el footer. Es el cierre emocional de la página y hoy solo lleva unas comillas bronce. |
| Ubicación | `About.jsx` › `section.site-quote`. Un ancla absoluta centrada **detrás** del `blockquote` (unos 520×360 px, `z-index:-1`, la sección con `position:relative; isolation:isolate`). El texto queda siempre delante. |
| Aspecto | La **silueta de una hoja** (contorno lanceolado con nervio central y 6-8 nervios secundarios) hecha de una lámina translúcida muy fina, como papel vegetal encerado. Flota ligeramente curvada, de canto a 20-30° y casi inmaterial: se nota más por la luz que la atraviesa que por su superficie. Los nervios son algo más opacos. |
| Materiales | Shader propio (no transmission): fresnel + **retroiluminación** (wrap lighting) con opacidad 0,12-0,22 y nervios de un mapa de distancia procedural. Aspecto de cera o papel vegetal. Blending normal, `depthWrite:false`. |
| Color | Cuerpo marfil `#F1ECE3` muy transparente, con luz trasera **ámbar `#C98A3E`** que tiñe los nervios y un filo de **tinta `#26303D`** en el contorno opuesto. Las comillas `#C7A479` siguen siendo el único bronce. |
| Movimiento | Idle: balanceo de ±3° con periodo de 9 s y flexión del ápice (vertex shader). Sin traslación. |
| Interacción | El cursor sobre la sección mueve la luz trasera: los nervios «se encienden» del lado del cursor. Sin hover de objeto ni clic. |
| GSAP | Trigger `.site-quote`, `start:'top 85%'`, `end:'center center'`, `scrub:1`, sin pin. La hoja pasa de canto (invisible, 90°) a 25° mientras su opacidad sube de 0 a 0,2. Se sincroniza con un reveal por líneas del blockquote (DOM). |
| Implementación | `ShapeGeometry` del contorno de hoja (paths de un SVG hecho a mano) subdividido en ~1,5k triángulos para poder flexionarlo. Los nervios son líneas de distancia en el fragment shader. **Alternativa SVG**: el mismo contorno con `feSpecularLighting` y un `mask` de gradiente movido por el cursor. Es muy parecida y cuesta cero. |
| Rendimiento | ≈1,5k triángulos, 1 shader y 0 texturas. Muy bajo. |
| Móvil | SVG estático al 15 % de opacidad. |
| Reduced motion | Hoja fija a 25°, sin balanceo. |
| Narrativa | «Conocer la hoja»: la hoja se *ve a contraluz* y revela su estructura. Es la versión poética de D1 (luz rasante), sin pretensión educativa. |
| Riesgo de identidad | **Bajo**. Es casi un watermark de luz. El riesgo es la legibilidad de la cita: hay que mantener la opacidad ≤0,22 y no poner nervios bajo los trazos del texto (se desplaza 8 % a la derecha). |
| Imagen conceptual | Sí: **ART-O1-REF**. Silueta de hoja de tabaco en lámina translúcida tipo papel vegetal encerado, retroiluminada en ámbar, con nervios visibles, sobre negro cálido. Muy etérea y sin texto. |

### AR-O2 — «Nudo de tres capas»

| Campo | Detalle |
|---|---|
| Captura | [proceso.png](../../../design-review/desktop/proceso.png): en la cabecera de «El proceso», a la derecha de las pills 01-03 y bajo el lead, quedan unos 220 px de vacío. Las pills indican una secuencia (Selección → Composición → Elaboración) que no tiene representación ni progreso visual. |
| Ubicación | `About.jsx` › `section#proceso` › `.site-section-heading--wide`, columna derecha bajo el `p.site-lead`. Ancla de unos 300×200 px alineada a la derecha y `z-index:0`. Si se hace el pin de «El proceso» propuesto en §9, el objeto vive en ese contenedor pinneado. |
| Aspecto | Tres **toros concéntricos** de grosor creciente hacia dentro: exterior fino (capa), medio (capote) e interior grueso (tripa). Al inicio están **dispersos e inclinados** en ejes distintos, como tres decisiones sueltas. Con el avance se alinean hasta formar un **corte transversal perfecto**, que es el corte del cigarro visto de frente sin decirlo. |
| Materiales | Exterior: satén con sheen (piel de capa). Medio: papel mate (`roughness .85`). Interior: cera densa con un *falso* SSS (wrap lighting). Sin transmission. |
| Color | Exterior bronce `#C7A479`, medio superficie aclarada `#3A332B` con filo **pátina `#7E9A8C`** e interior **colorado `#6B2B24`**. De fuera adentro, del color de marca al color del corazón de la mezcla. |
| Movimiento | Idle mínimo: precesión de ±2° cuando están alineados. Mientras están dispersos, deriva lenta (periodo de 10 s). |
| Interacción | Hover o foco en la pill 01/02/03 → el anillo correspondiente se adelanta 10 % en Z y los demás bajan al 40 %. Sin clic propio: las pills ya navegan por ancla. |
| GSAP | Trigger `#proceso`, `start:'top 60%'` → `end:'#composicion bottom 60%'`, `scrub:0.6`, `scroller:window`. Tramo 0-0,33: el exterior se alinea (Selección); 0,33-0,66: el medio (Composición); 0,66-1: el interior encaja (Elaboración). Pin opcional solo si el equipo acepta el de §9; sin pin funciona igual. Hay que resolver antes el `ScrollTrigger.refresh()` tras `scrollIntoView` del `useEffect` por hash (`About.jsx:37-41`). |
| Implementación | 3 × `TorusGeometry` con radios 1 / 0,8 / 0,55 y tubos 0,03 / 0,06 / 0,14. Rotaciones interpoladas por cuaternión (slerp) desde el progreso. **Alternativa CSS 3D**: tres `div` con borde circular y `rotate3d`, con resultado muy cercano. Comparte el lenguaje de C2 (corte transversal) y podría reutilizar su componente. |
| Rendimiento | ≈9k triángulos, 3 materiales. Bajo. |
| Móvil | SVG del corte alineado, estático, bajo el lead. |
| Reduced motion | Estado alineado final. Las pills siguen funcionando. |
| Narrativa | «La forma final comienza en la selección»: las decisiones dispersas se ordenan en la forma del cigarro. Prepara C2 y C1 (la misma idea de capas a otra escala, §17). |
| Riesgo de identidad | **Bajo**. Es geométrico y sobrio, y el color de materia domina. |
| Imagen conceptual | Sí: **ART-O2-REF**. Tres anillos concéntricos de grosor creciente hacia dentro (satén bronce, papel con filo pátina y cera colorada), a medio alinear, flotando sobre negro cálido. |

---

## 5. Ideas consideradas y descartadas

| Idea | Motivo del descarte |
|---|---|
| **Objeto flotante en el cuadrante derecho del hero** (hoja de vidrio o esfera de resina sobre la plantación) | La foto ya trae un objeto (el cigarro «TAMBORILERO») en ese cuadrante, así que duplicaría el motivo. Además penaliza el LCP del hero y lo rediseña, que está aprobado. |
| **Polvo o partículas doradas de hoja flotando sobre el CTA o la cita** | En una foto de manos enrollando, las partículas en suspensión se leen como humo o ceniza: es una señal de consumo. Además es decoración genérica sin relato. |
| **Pompas o esferas iridiscentes (estilo «soap bubble») en los principios de El oficio** | La iridiscencia fuerte es lenguaje «tech/cripto» ajeno a la artesanía, y las 4 tarjetas ya funcionan con iconos lineales (misma regla que «Tres momentos»). |
| **Cinta Möbius continua envolviendo todo el scroll de la Home (fondo fijo)** | Rediseña la página entera en la práctica, compite con cada H2 y obliga a tener WebGL activo durante todo el recorrido. Va contra «movimiento con causa». |

---

## 6. Top 2 (Home / El oficio)

1. **AR-H1 «Cinta del cultivo»** (Home, `#recorrido`). Es el vacío con más propósito de la Home, cuesta casi nada, tiene versión SVG equivalente y su hélice es el hilo visual que lleva a C3 y C1. Introduce la pátina como acento de forma natural (cultivo → curado).
2. **AR-O2 «Nudo de tres capas»** (El oficio, `#proceso`). Da progreso visual a la secuencia 01-03, es geométrico, sobrio y de bajo riesgo, y reutiliza el lenguaje de capas de C2 y C1.

Reserva de alto impacto: **AR-H2 «Lente de resina»**. Es la pieza más «artística» y memorable, pero es la única con transmission y compite con A2 en el mismo hueco, así que hay que elegir una de las dos.
