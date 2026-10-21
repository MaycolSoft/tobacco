# 04 — Exploración 3D artística (objetos flotantes, decorativos e interactivos)

> **Referencia histórica de exploración (19/10/2026).** H1/O2/L1/ART-C1 se implementaron después; tecnología, cifras y tareas de este documento describen aquella fase. Consultar [estado vigente](PROGRESS.md) y [pendientes del proyecto](../STATUS.md). Los encargos y restricciones de sesiones anteriores no son instrucciones actuales.

> Fecha: 2026-10-19. Continuación de [TOBACCO_3D_UX_RECOMMENDATIONS.md](../TOBACCO_3D_UX_RECOMMENDATIONS.md). Se mantiene **C1 «Anatomía de tu cigarro»** tal cual.
> Nueva dirección: objetos 3D **artísticos** en varias secciones (Home, El oficio, Biblioteca, Craft) sin rediseñar páginas. En esta fase solo se exploraron propuestas; la implementación posterior está enlazada en el aviso histórico superior.
> Evidencia visual: capturas desktop (1440×1000, perfil Black) en [design-review/desktop/](../../design-review/desktop/).
> Documentos de trabajo (con todo el detalle por campo):
> - [04-parts/E_HOME_ABOUT.md](04-parts/E_HOME_ABOUT.md)
> - [04-parts/F_LIBRARY_CRAFT.md](04-parts/F_LIBRARY_CRAFT.md)
> - [04-parts/G_COLOR_TECH.md](04-parts/G_COLOR_TECH.md)
>
> Prompts de imagen: [CODEX_ARTISTIC_IMAGE_PROMPTS.md](CODEX_ARTISTIC_IMAGE_PROMPTS.md).

## Progreso
- [x] Investigación paralela: Home + El oficio (E), Biblioteca + Craft (F), Paleta de acentos + skills + tecnología (G)
- [x] Consolidación: 10 propuestas + 1 opcional
- [x] Paleta de acentos unificada
- [x] Ranking y recomendación
- [x] Prompts Codex artísticos (agente H)

---

## 1. Resumen

- **Idea rectora: «La materia en tres gestos».** Todos los objetos salen de tres formas del oficio:
  - la **cinta** (una hoja que se enrolla);
  - el **anillo** (las capas vistas en corte);
  - la **lámina translúcida** (la hoja a contraluz).
  Repetidas con variaciones en cada sección, dan una familia escultórica reconocible en lugar de adornos sueltos. También conectan con lo ya propuesto: la Espiral de capa (C3), el Corte en relieve (C2) y la Anatomía (C1).
- **Color más allá del marrón**, como *luz y materia* y nunca como UI:
  - verdín `#6F907F`;
  - clarete `#7B2F2B`;
  - celadón `#BCC8A4`;
  - ámbar resina `#D4913F`;
  - tinta índigo `#3F4C6E`, en reserva.
  El bronce `#C7A479` sigue siendo el único color de interfaz.
- **Ligereza como estrategia:**
  - **Home y El oficio** pueden hacerse **sin three.js** en una primera versión: SVG o CSS 3D con GSAP. Sus objetos son lineales o geométricos, así que no cargan ningún chunk 3D.
  - **WebGL solo donde aporta algo que CSS no puede**: en Craft y en la ficha de hoja, el objeto usa las **texturas reales de las hojas elegidas** y materiales translúcidos.
- **Set recomendado:** como máximo 1-2 objetos por página.

  | Página | Objetos |
  |---|---|
  | Home | AR-H1 |
  | El oficio | AR-O2 |
  | Biblioteca | AR-L1 |
  | Craft | AR-C1 + AR-C2 |

  El resto queda como reserva o variante.

> Nota de nombres: los IDs `AR-*` son objetos artísticos de este documento. **AR-C1 «Haz suspendido»** no es **C1 «Anatomía de tu cigarro»**.

---

## 2. Lo que justifica cada sitio (capturas)

| Sección | Lo que se ve | Captura | Oportunidad con propósito |
|---|---|---|---|
| Home · `#recorrido` | El H2 «Del cultivo al cigarro» y ~250 px de negro bajo «Ver el recorrido» | [inicio-recorrido.png](../../design-review/desktop/inicio-recorrido.png) | Mostrar el recorrido que el titular promete |
| Home · Tres momentos | El H2 «Tres momentos. Una misma materia.» y ~90 px de vacío sobre el párrafo derecho | [inicio-tres-momentos.png](../../design-review/desktop/inicio-tres-momentos.png) | Visualizar «tres en uno» sin tocar las tarjetas |
| Home · El arte de mezclar | Caja de ~560×600 con la hoja en diagonal; arriba a la izquierda y la franja derecha están vacías | [inicio-arte-de-mezclar.png](../../design-review/desktop/inicio-arte-de-mezclar.png) | «Entenderlas»: el gesto de observar |
| El oficio · `#proceso` | Pills 01-03 y ~220 px vacíos a su derecha | [proceso.png](../../design-review/desktop/proceso.png) | Dar progreso visual a Selección → Composición → Elaboración |
| El oficio · cita final | Cita centrada sobre negro amplio, con solo unas comillas bronce | [oficio.png](../../design-review/desktop/oficio.png) | Cierre emocional: «conocer la hoja» |
| Biblioteca · cabeceras de grupo | Franja central vacía de ~350 px entre el título y el párrafo; el grupo Capa deja 2 columnas vacías | [biblioteca-hojas.png](../../design-review/desktop/biblioteca-hojas.png) | Mostrar *cómo trabaja* cada función |
| Ficha / inmersivo | La hoja inscrita en un círculo fino, que hace de «marco de espécimen» | [hoja-detalle.png](../../design-review/desktop/hoja-detalle.png), [hoja-inmersiva.png](../../design-review/desktop/hoja-inmersiva.png) | Convertir el círculo 2D en objeto |
| Craft · panel «Tu mezcla» | Texto puro con checks | [crea-tu-cigarro-mezcla.png](../../design-review/desktop/crea-tu-cigarro-mezcla.png) | Feedback visual de la mezcla en construcción |
| Craft · paso 03 Capa | Solo 2 tarjetas y ~520 px vacíos a la derecha | [crea-tu-cigarro-capa.png](../../design-review/desktop/crea-tu-cigarro-capa.png) | El mayor vacío de la mesa |
| Guía · intro | La mitad derecha de «El arte de combinar» está vacía | [guia-mezcla.png](../../design-review/desktop/guia-mezcla.png) | Abrir la guía con «de dentro hacia fuera» |
| Acceso | Franja negra vertical de ~270 px entre la hoja de fondo y el formulario | [acceso.png](../../design-review/desktop/acceso.png) | Umbral de la experiencia privada (opcional) |

**Dónde no se pone nada:**
- Hero de la Home (la foto ya trae un cigarro).
- Tarjetas y rejillas.
- CTA final (la foto de manos).
- «03 Elaboración».
- Overlay de frames `#video-root`.
- Formulario de acceso.

---

## 3. Paleta de acentos unificada

Fuente: [G §1](04-parts/G_COLOR_TECH.md). Los agentes E y F propusieron tonos muy cercanos, que se unifican así: el colorado y el lacre pasan a **clarete**; el oliva pasa a **celadón**; los distintos verdines y ámbares se ajustan a la tabla.

| Token propuesto | Hex | Origen material | Rol en 3D | Uso máx. | Sección dominante |
|---|---|---|---|---|---|
| `--ls-accent-patina` (verdín) | `#6F907F` | Bronce oxidado de las herramientas; eco del verde del hero | Tinte translúcido, `sheenColor`, luz de relleno, metal patinado | ≤6 % | El oficio |
| `--ls-accent-claret` (clarete) | `#7B2F2B` | Capa maduro y aceite de la hoja fermentada; también el «sello de lacre» | `attenuationColor`, núcleo, destello de cierre | ≤8 % | Craft |
| `--ls-accent-celadon` (celadón) | `#BCC8A4` | Hoja fresca antes del curado, nervaduras | Luz de borde (fresnel), hilos de vena | ≤3 % | Home |
| `--ls-accent-amber` (ámbar) | `#D4913F` | Resina, la hoja a contraluz | **Solo emisión o contraluz** (≤0,25): como superficie quedaría casi igual que el bronce (contraste 1,14:1) | ≤4 % | Biblioteca |
| `--ls-accent-ink` (reserva) | `#3F4C6E` | Tinta de plano técnico, cielo del hero apagado | Luz fría de «lámina técnica» | ≤5 % | Guía |

**Reglas** ([G §1.5](04-parts/G_COLOR_TECH.md)):
1. Nunca en texto ni en controles.
2. Un acento dominante por sección, más como mucho un segundo como luz de borde.
3. La foto de la hoja **no se tiñe**.
4. Los acentos suman ≤10 % del viewport.
5. Emisión ≤0,25, iridiscencia ≤0,4 y sin bloom.
6. **Diseñar primero en gris**: en los perfiles `black` y `editorialNoir` los acentos casi desaparecen (`--ls-accent-strength`) y el objeto debe funcionar solo con forma y luz.

---

## 4. Propuestas

Cada ficha resume lo esencial. Los 16 campos completos están en los documentos E y F.

### AR-H1 · «Cinta del cultivo»: Home, `#recorrido`
- **Captura**: [inicio-recorrido.png](../../design-review/desktop/inicio-recorrido.png). Es el vacío con más propósito de la Home y la primera de tres pantallas estáticas.
- **Ubicación**: `src/pages/Home.jsx` › `section#recorrido.site-intro-grid`, segunda columna. Ancla absoluta `aria-hidden` de ~420×240 px bajo el enlace, `z-index:0`. No cambia la altura de la sección.
- **Aspecto**: cinta estrecha y satinada. Entra plana con su nervio (una hoja) y termina enrollada en una hélice de 5-6 vueltas: el cigarro sugerido, no dibujado.
- **Materiales y color**: satén con `sheen`, venas procedurales y reverso en superficie `#211E19`. Gradiente a lo largo: **celadón → bronce → clarete**, es decir, del cultivo al curado.
- **Movimiento**: el extremo plano ondula (4 px, 7 s) y la hélice respira (±1,5°). Se detiene fuera del viewport.
- **Interacción**: el cursor mueve la luz (±15°), no el objeto.
- **GSAP**: `ScrollTrigger` con trigger `#recorrido`, `top 70%` → `bottom 40%`, `scrub:0.6`, sin pin. El progreso controla `uRoll` (de plana a enrollada).
- **Técnica**: **v1 en SVG**: un path con gradiente y morph interpolado (`attr:{d}`) + `strokeDashoffset`, 0 KB. v2: R3F, `PlaneGeometry` 200×4 deformado en el vertex shader, ~1,6k triángulos.
- **Coste**: muy bajo.
- **Móvil**: SVG estático, a medio enrollar.
- **Reduced motion**: estado final enrollado.
- **Narrativa**: materializa el titular. Es la misma hélice que C3 y C1, a otra escala.
- **Riesgo para la identidad**: bajo.
- **Imagen conceptual**: ART-H1-REF.

### AR-H2 · «Lente de resina»: Home, El arte de mezclar *(alternativa a A2)*
- **Captura**: [inicio-arte-de-mezclar.png](../../design-review/desktop/inicio-arte-de-mezclar.png). El copy dice «se trata de entenderlas».
- **Ubicación**: `figure.site-feature__image`. Arranca en el cuadrante superior derecho (~220 px) y el scroll la baja **sobre la hoja**.
- **Aspecto**: canto rodado de resina con un fragmento de nervio de hoja suspendido. Refracta y amplía la hoja de la foto.
- **Materiales y color**: `MeshPhysicalMaterial` con `transmission 1`, `thickness 1.2` e `ior 1.5`. **Ámbar** como `attenuationColor`, filo de iridiscencia **verdín** de ≤0,15 y fibras **clarete** y bronce.
- **Movimiento**: rotación en Y (40 s por vuelta) y flotación de ±6 px.
- **Interacción**: con hover se inclina hacia el cursor (≤8°).
- **GSAP**: `scrub:0.8`, de la esquina al centro de la hoja.
- **Técnica**: R3F. La foto se replica como plano texturizado (la thumb), porque WebGL no refracta el DOM. ~14k triángulos. Alternativa CSS: `feDisplacementMap`.
- **Coste**: el **más alto** del set (un pase extra por la transmisión). Tiene que ser el único objeto transmisivo de la página.
- **Móvil**: póster.
- **Reduced motion**: lente estática sobre la hoja.
- **Riesgo para la identidad**: medio; puede leerse como «tech» si brilla.
- **Incompatible con A2** en el mismo hueco: hay que elegir uno de los dos.
- **Imagen conceptual**: ART-H2-REF.

### AR-H3 · «Tres anillos, una materia»: Home, Tres momentos
- **Captura**: [inicio-tres-momentos.png](../../design-review/desktop/inicio-tres-momentos.png).
- **Ubicación**: `#recorrido-pasos` › `.site-section-heading`, sobre el párrafo derecho (~200×150 px). **Nada dentro de las tarjetas.**
- **Aspecto**: tres toros muy finos (sección 1:40) entrelazados como un astrolabio mínimo.
- **Materiales y color**: bronce cepillado (anisotropía), **verdín** mate y marfil de cera.
- **Movimiento**: cada anillo gira a una velocidad distinta (25, 32 y 41 s por vuelta).
- **Interacción**: hover en la tarjeta 01, 02 o 03 alinea e ilumina su anillo; los otros bajan al 40 %.
- **GSAP**: con el scrub, los anillos pasan de **coplanares en fila** (eco de las 3 columnas) a **entrelazados** («una materia»).
- **Técnica**: v1 en **CSS 3D** (tres elipses con `preserve-3d`), muy fiel a este diseño lineal. v2: R3F, ~11k triángulos.
- **Coste**: bajo.
- **Móvil**: SVG estático o nada.
- **Riesgo para la identidad**: bajo-medio; puede leerse como logo si los anillos son gruesos.
- **Imagen conceptual**: ART-H3-REF.

### AR-O1 · «Velo de cera»: El oficio, cita final
- **Captura**: [oficio.png](../../design-review/desktop/oficio.png).
- **Ubicación**: `About.jsx` › `section.site-quote`, **detrás** del blockquote (~520×360 px, `z-index:-1`).
- **Aspecto**: silueta de hoja en lámina translúcida tipo papel vegetal encerado. Se ve por la luz que la atraviesa.
- **Materiales y color**: shader de fresnel y retroiluminación, con opacidad ≤0,22. Marfil con contraluz **ámbar** en los nervios y filo **tinta**.
- **Movimiento**: balanceo de ±3° (9 s) y flexión del ápice.
- **Interacción**: el cursor mueve la luz trasera y los nervios «se encienden» de ese lado.
- **GSAP**: la hoja pasa de canto (invisible) a 25° junto a un reveal por líneas de la cita.
- **Técnica**: v1 en **SVG** (`feSpecularLighting` + máscara), 0 KB.
- **Coste**: muy bajo.
- **Móvil**: SVG estático al 15 %.
- **Riesgo para la identidad**: bajo, pero hay que vigilar la legibilidad de la cita.
- **Imagen conceptual**: ART-O1-REF.

### AR-O2 · «Nudo de tres capas»: El oficio, `#proceso`
- **Captura**: [proceso.png](../../design-review/desktop/proceso.png).
- **Ubicación**: `.site-section-heading--wide`, columna derecha bajo el lead (~300×200 px).
- **Aspecto**: tres toros concéntricos de grosor creciente hacia dentro (capa, capote, tripa). Empiezan **dispersos** y terminan alineados en un **corte transversal** perfecto.
- **Materiales y color**: satén **bronce**, papel con filo **verdín** y cera **clarete** (falso SSS). De fuera adentro va del color de marca al corazón de la mezcla.
- **Movimiento**: deriva lenta mientras están dispersos y precesión de ±2° cuando están alineados.
- **Interacción**: hover o foco en la pill 01, 02 o 03 adelanta su anillo.
- **GSAP**: trigger `#proceso`, `scrub:0.6`, en tres tramos (cada tramo alinea un anillo). El pin es opcional. Antes hay que resolver el `refresh` tras el `scrollIntoView` por hash (`About.jsx:37-41`).
- **Técnica**: v1 en **CSS 3D** (tres `div` con `rotate3d`), y puede compartir componente con C2. v2: R3F, ~9k triángulos.
- **Coste**: bajo.
- **Móvil**: SVG del corte alineado.
- **Riesgo para la identidad**: bajo.
- **Imagen conceptual**: ART-O2-REF.

### AR-L1 · «Anillo de espécimen»: ficha de hoja e inmersivo
- **Captura**: [hoja-detalle.png](../../design-review/desktop/hoja-detalle.png), [hoja-inmersiva.png](../../design-review/desktop/hoja-inmersiva.png).
- **Ubicación**: `TechnicalSheet.jsx` › `figure.ts-image-side`, sobre el círculo existente. En el inmersivo, `.th-leaf-frame`.
- **Aspecto**: el círculo de 1 px se convierte en un toro finísimo inclinado ~68° que **orbita** la hoja: pasa por detrás y por delante de ella. El número de arcos sale de la categoría: **Capa 1, Capote 2, Tripa 3**.
- **Materiales y color**:
  - Anillo principal en resina (`transmission`, iridiscencia ≤0,35, `attenuationColor` **ámbar**), con un canto **verdín** muy leve.
  - Arcos secundarios en bronce cepillado.
- **Movimiento**: casi imperceptible (una vuelta cada ~5 min). Se detiene a los 6 s sin interacción.
- **Interacción**:
  - El cursor mueve el reflejo.
  - Al pasar a la hoja anterior o siguiente, gira 180° y cambia el número de arcos.
  - En el inmersivo hay una pose por capítulo: frontal, rasante, cerrado y apilado.
- **Sincronización**: framer-motion (ya gobierna el overlay). Sin GSAP.
- **Técnica**: R3F con `TorusGeometry` y `RingGeometry`, ~2k triángulos. Alternativa **SVG**: 2 elipses + gradiente animado.
- **Coste**: un pase extra por la transmisión. En tier 1, resina falsa (`opacity` + `clearcoat`).
- **Móvil**: 1 anillo, sin transmisión.
- **Riesgo para la identidad**: medio-bajo; puede leerse como «joya» si hay demasiada iridiscencia.
- **Imagen conceptual**: ART-L1-REF.

### AR-L2 · «Sellos de función»: cabeceras de grupo de la Biblioteca
- **Captura**: [biblioteca-hojas.png](../../design-review/desktop/biblioteca-hojas.png).
- **Ubicación**: `LeafLibrary.jsx` › `header.ls-group-heading`, hueco central de ~140×110 px. Solo con el filtro «Todas». **No entra en la rejilla.**
- **Aspecto**: tres esculturas pequeñas, como pesos de papel:
  - **Capa** → una cinta ancha con media torsión («envuelve»).
  - **Capote** → dos cintas entrelazadas («abraza»).
  - **Tripa** → un abanico de 5 láminas en acordeón («el corazón»).
- **Materiales y color**: cera mate (`sheen`, sin transmisión) y fibra de hoja como `roughnessMap`. Canto de acento por grupo: ámbar, verdín y clarete.
- **Movimiento**: se «posan» al entrar (900 ms) y después quedan quietas.
- **Interacción**:
  - Hover sobre la cabecera: giran 25°.
  - Al filtrar: un «asentimiento».
  - Si ya hay hojas de ese grupo en la mezcla: un punto bronce.
- **GSAP**: `ScrollTrigger.batch`.
- **Técnica**: R3F, o **sprites prerenderizados** (24 frames de giro, 280 px) sin three.
- **Coste**: bajo, ~6k triángulos.
- **Móvil**: sprite estático de 72 px.
- **Riesgo para la identidad**: bajo, si se mantienen pequeñas y mates; si no, parecen iconos de SaaS.
- **Imagen conceptual**: ART-L2-REF.

### AR-C1 · «Haz suspendido»: Craft, panel «Tu mezcla» *(evoluciona E1)*
- **Captura**: [crea-tu-cigarro-mezcla.png](../../design-review/desktop/crea-tu-cigarro-mezcla.png), [crea-tu-cigarro-capote.png](../../design-review/desktop/crea-tu-cigarro-capote.png).
- **Ubicación**: `BlendSummary.jsx` › franja superior de `aside.craft-summary` (300×150 px). Cabe en el vacío que se ve bajo el panel.
- **Aspecto**: un «capullo» abstracto, nunca un cigarro cerrado. Se forma así:
  - **Tripa**: 2-5 láminas curvas suspendidas, **una por hoja elegida**.
  - **Capote**: una cinta translúcida en espiral abierta.
  - **Capa**: una hélice exterior satinada.
- **Materiales y color**:
  - Cada lámina lleva **la thumb real de la hoja elegida**.
  - Capote en resina con contraluz **ámbar**.
  - Capa en `sheen` con el color medio de la thumb.
  - Un único destello **clarete** («sello») al cerrar la capa.
- **Movimiento**: flotación durante 4 s tras cada cambio. Cada lámina entra girando sobre su nervio y cada cinta se «dibuja» (`drawRange`).
- **Interacción**:
  - Hover en un `<li>` adelanta su lámina.
  - `loadBlend` hace entrar las láminas en cascada.
  - Al cambiar de paso, la cámara gira 15°.
- **Sincronización**: framer-motion desde `useBlendStore`. Si se hace B2, termina justo donde entra la lámina.
- **Técnica**: R3F, ~8k triángulos y ≤6 texturas de 256 px. Alternativa **SVG** con `<image>` + `clipPath`.
- **Restricciones de montaje**:
  - **Pausa obligatoria** mientras la guía está abierta, porque la mesa queda montada debajo.
  - Se desmonta en el paso 04 y con `showVideo`.
- **Coste**: un pase extra solo mientras se anima.
- **Móvil**: franja de 100 px, sin transmisión.
- **Riesgo para la identidad**: bajo-medio. Regla: nunca cerrar los extremos, para no duplicar C1.
- **Imagen conceptual**: ART-C1-REF.

### AR-C2 · «Cinta de capa»: Craft, paso 03
- **Captura**: [crea-tu-cigarro-capa.png](../../design-review/desktop/crea-tu-cigarro-capa.png). Es el vacío más evidente de la mesa (~520 px).
- **Ubicación**: `LeafGrid.jsx` › último hijo `aria-hidden` de `.ls-grid-container`, solo en el paso CAPA, `grid-column: 3 / span 2`. No desplaza ninguna tarjeta.
- **Aspecto**: una gran cinta de hoja de capa «laqueada en cera» que flota en una hélice suelta de 1,5 vueltas, con los bordes ondulados.
- **Materiales y color**:
  - `map` y `normalMap` sacados de la **thumb de la capa** sobre la que está el cursor o la elegida.
  - `sheen` **ámbar** y contraluz ámbar en el borde, con transmisión solo en el canto.
  - Luz de relleno tinta.
  - Destello **clarete** al seleccionar.
- **Movimiento**: respira 5 s y se detiene.
- **Interacción**:
  - Hover en una tarjeta: la cinta **toma esa hoja** (crossfade en 400 ms).
  - Al seleccionar: la hélice se cierra de 1,5 a 2,5 vueltas.
- **Sincronización**: timeline de GSAP sin scroll.
- **Técnica**: R3F con una cinta en el vertex shader (`uTwist`, `uTurns`, `uWave`), ~1k triángulos. Comparte canvas con AR-C1. Alternativa: sprites prerenderizados por capa.
- **Coste**: un pase extra solo en el paso 03.
- **Móvil**: no se monta (no hay hueco).
- **Riesgo para la identidad**: medio, porque ocupa espacio dentro de una rejilla aprobada.
- **Imagen conceptual**: ART-C2-REF.

### AR-C3 · «Pliegue de dentro hacia fuera»: intro de la Guía
- **Captura**: [guia-mezcla.png](../../design-review/desktop/guia-mezcla.png).
- **Ubicación**: `TobaccoGuidePage.jsx` › `header.tg-intro`, columna derecha (~420×260 px). Desaparece antes del corte transversal (C2), así que no lo duplica.
- **Aspecto**: una lámina de papel de algodón translúcido que se pliega: plana, luego 2 pliegues, luego 3 capas enrolladas a medias.
- **Materiales y color**: marfil al 85 %. **Verdín** en la luz que se suma donde las capas se solapan y una vena **celadón**. Si el usuario ya tiene mezcla, las capas toman sus colores.
- **Movimiento e interacción**: scrub con el scroll de la guía. Los tabs 01-03 fijan poses: enrollado, abanico de 4 (las familias) y plano.
- **GSAP**: `scroller: scrollRef.current` (`.tg-scroll`), dentro de un `gsap.context` que se revierte al cerrar la guía.
- **Técnica**: R3F en el **mismo canvas** que la mesa, que queda pausada debajo. Alternativa: CSS 3D con bisagras.
- **Coste**: un pase extra solo mientras la intro está visible.
- **Móvil**: opaco, solo poses por tab.
- **Riesgo para la identidad**: bajo-medio, porque es el único objeto claro del set.
- **Imagen conceptual**: ART-C3-REF.

### AR-A1 · «Umbral»: Acceso *(opcional, fuera del top)*
- **Captura**: [acceso.png](../../design-review/desktop/acceso.png).
- **Aspecto**: una cuchilla vertical de resina con la hoja de fondo atrapada dentro.
- **Interacción**: gira según el foco en los campos y se enrolla en un anillo al entrar.
- **Técnica recomendada**: **vídeo prerenderizado con alfa** (HEVC + VP9), sin three en una página que solo es puerta de entrada.
- **Imagen conceptual**: ART-A1-REF.

---

## 5. Ideas descartadas

| Idea | Motivo |
|---|---|
| Objeto flotante en el hero de la Home | Duplica el cigarro de la foto, penaliza el LCP y rediseña una sección aprobada |
| Partículas o polvo dorado (CTA, cita, fondo) | Se leen como humo o ceniza (señal de consumo). Decoración genérica |
| Pompas o esferas iridiscentes | Lenguaje «tech» ajeno a la artesanía |
| Cinta Möbius que envuelve todo el scroll de la Home | En la práctica rediseña la página y obliga a tener WebGL activo siempre |
| Campo de hojas flotando detrás de la rejilla de la Biblioteca | Compite con las fotos, que son el contenido. Bucle infinito tipo Vanta |
| «Cigarro de vidrio» iridiscente junto a C1 | Lujo genérico de joyería. Duplica C1 |
| Globo 3D de orígenes | Cliché de visualización de datos; hay orígenes no geolocalizables («Various», «Hybrid») |
| Cualquier objeto o vídeo decorativo con `#video-root` montado | La decodificación ya satura la GPU |

---

## 6. Tecnología: decisión por tipo de objeto

Revisión de skills en [G §6](04-parts/G_COLOR_TECH.md):
- **Instaladas**: `gsap-scrolltrigger` (alta relevancia) y `lightweight-3d-effects` (baja: Vanta y Zdog no encajan).
- **En el marketplace, sin instalar**:
  - Relevancia alta: `react-three-fiber`, `threejs-webgl` y `web3d-integration-patterns`.
  - Relevancia media-alta: `blender-web-pipeline`, útil si se opta por pre-render.
- Ninguna cubre `<View>`, `MeshTransmissionMaterial` ni vídeo con alfa, así que hay que verificarlos contra la versión real cuando se instalen.

| Tipo | Objetos | Stack v1 | Stack v2 |
|---|---|---|---|
| Lineal o geométrico, ligado al scroll | AR-H1, AR-H3, AR-O1, AR-O2 | **SVG / CSS 3D + GSAP**, 0 KB | R3F, si la ruta ya carga three |
| Ligado a datos o texturas reales | AR-C1, AR-C2, AR-L1 | **R3F + drei**, chunk lazy `vendor-3d` ≤220 KB gz | — |
| Translúcido de alto impacto | AR-H2, AR-C3 | R3F, **un solo objeto transmisivo por vista** | — |
| Decorativo de bucle sin interacción | AR-L2, AR-A1 | **Sprites o vídeo con alfa** (solo si es el único 3D de la ruta) | R3F |

**Arquitectura**:
- **Un canvas lazy por ruta**, con drei `<View>` cuando la ruta tiene varios objetos.
- En Craft, el canvas vive **dentro** de `{!showVideo && …}`.
- El canvas global persistente queda para una fase 2, con `showVideo` en un store.

**Render y GSAP**:
- `frameloop="demand"`. ScrollTrigger (scroller `window` o `.tg-scroll`) escribe uniforms y llama a `invalidate()`.
- **Materiales**: `MeshPhysicalMaterial` con la transmisión compartida (1 pase), `sheen`, anisotropía e iridiscencia ≤0,4. `MeshTransmissionMaterial` solo en tier 2.
- **Entorno**: Lightformers procedurales (0 KB). Nunca HDR de CDN.

**Presupuesto por ruta** ([G §7.2](04-parts/G_COLOR_TECH.md)):

| Recurso | Límite |
|---|---|
| Triángulos | ≤30k (techo 50k) |
| Pases extra por frame | ≤1 |
| Draw calls | ≤12 |
| GPU | ≤32 MB |
| Pósters | ≤60 KB cada uno |
| Bundle inicial | +0 KB |

**Fallbacks**:
- Tier 0 (reduced motion, `saveData` o poca memoria): póster.
- Tier 1 (táctil o gama media): SVG o CSS, sin transmisión.
- Por debajo de 1100 px: sin WebGL en Home y El oficio.

Los prerequisitos son los mismos que en [TOBACCO_3D_UX_RECOMMENDATIONS.md §11](../TOBACCO_3D_UX_RECOMMENDATIONS.md).

---

## 7. Ranking

Escala de 1 a 5. En *Ligereza*, 5 significa más ligero.

| # | Objeto | Página | Elegancia | Originalidad | Ligereza | Coherencia | Valor narrativo | Móvil | **Total /30** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | AR-H1 Cinta del cultivo | Home | 5 | 4 | 5 | 5 | 5 | 4 | **28** |
| 2 | AR-O2 Nudo de tres capas | El oficio | 4 | 4 | 5 | 5 | 5 | 4 | **27** |
| 3 | AR-C1 Haz suspendido | Craft | 5 | 5 | 3 | 5 | 5 | 3 | **26** |
| 4 | AR-L1 Anillo de espécimen | Biblioteca | 5 | 4 | 4 | 5 | 4 | 3 | **25** |
| 5 | AR-H3 Tres anillos | Home | 4 | 3 | 5 | 5 | 4 | 4 | **25** |
| 6 | AR-O1 Velo de cera | El oficio | 5 | 4 | 5 | 4 | 3 | 4 | **25** |
| 7 | AR-C2 Cinta de capa | Craft | 5 | 4 | 3 | 4 | 4 | 2 | **22** |
| 8 | AR-H2 Lente de resina | Home | 5 | 5 | 2 | 3 | 4 | 2 | **21** |
| 9 | AR-C3 Pliegue | Guía | 4 | 4 | 3 | 4 | 3 | 3 | **21** |
| 10 | AR-L2 Sellos de función | Biblioteca | 4 | 3 | 4 | 4 | 3 | 3 | **21** |
| — | AR-A1 Umbral | Acceso | 4 | 4 | 3 | 3 | 2 | 1 | 17 (opcional) |

---

## 8. Recomendación

**Set curado: un objeto «firma» por página, todos de la misma familia.**

| Página | Objeto | Familia | Acento dominante | Stack v1 |
|---|---|---|---|---|
| Home | **AR-H1 Cinta del cultivo** | Cinta | Celadón | SVG + GSAP |
| El oficio | **AR-O2 Nudo de tres capas** | Anillo | Verdín | CSS 3D + GSAP |
| Biblioteca (ficha) | **AR-L1 Anillo de espécimen** | Anillo | Ámbar | R3F (fallback SVG) |
| Craft (pasos 01-03) | **AR-C1 Haz suspendido** (+ AR-C2 en el paso 03) | Cinta + lámina | Clarete | R3F |
| Craft (paso 04) | **C1 Anatomía** (ya recomendado) | Anillo + cinta | Clarete | R3F |

**Qué haría primero: AR-H1 «Cinta del cultivo».**
1. **Coste mínimo**: 0 KB de three, SVG + GSAP ya instalado.
2. **Valida el lenguaje con el cliente** en la página más visitada: cinta, hélice y el primer acento no marrón (celadón).
3. **Prueba la integración de GSAP en páginas** con `scroller: window`. Es un prerequisito de todo lo demás y hoy GSAP solo vive en el reproductor.
4. **Hila la narrativa**: la hélice reaparece en C3, en AR-C1 y en C1.

**Orden propuesto:**
1. AR-H1.
2. AR-O2 (comparte componente con C2).
3. AR-L1, en su versión SVG.
4. Instalación de R3F (prerequisitos) → AR-C1 → AR-C2 → C1.
5. Reserva: AR-H3, AR-O1, AR-H2 (si se descarta A2), AR-C3, AR-L2 y AR-A1.

**Validar con el cliente antes de implementar:**
1. ¿Se aceptan acentos no marrones (verdín, celadón, clarete) en los objetos?
2. ¿AR-H2 «Lente de resina» o A2 «Tres hojas en profundidad» en «El arte de mezclar»?
3. ¿Densidad: un objeto por página o más?
4. Generar primero los concept art ART-H1, ART-O2, ART-L1 y ART-C1 ([CODEX_ARTISTIC_IMAGE_PROMPTS.md](CODEX_ARTISTIC_IMAGE_PROMPTS.md)) y enseñarlos en contexto.
