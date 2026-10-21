# 01 — Análisis visual (Desktop)

> **Referencia histórica de exploración (19/10/2026).** H1/O2/L1/ART-C1 se implementaron después; tecnología, cifras y tareas de este documento describen aquella fase. Consultar [estado vigente](PROGRESS.md) y [pendientes del proyecto](../STATUS.md). Los encargos y restricciones de sesiones anteriores no son instrucciones actuales.

> Agente A1 — Visual UX Inspector (DESKTOP). Fecha: 2026-10-19.
> Capturas con Playwright/Chromium sobre el servidor dev `http://127.0.0.1:5173`: viewport **1440×1000**, escala 1, perfil visual **Black** (inyectado en `localStorage['ls-design-tokens'] = {version:3, profileId:'black'}` antes de cargar), idioma español. Se sigue la convención de `design-review/README.md`; las capturas viven en `design-review/desktop/`.
> Contexto previo: `docs/TOBACCO_PROJECT_AUDIT.md` (no se repite aquí). Solo se describe lo que se ve en las capturas.

## Progreso
- [x] Esqueleto creado
- [x] 31 capturas tomadas (Home, Biblioteca, Oficio, Perfiles, Acceso, Mesa de composición, guía, selector, frames). El CDN de frames respondió 39/39 peticiones con 200.
- [x] Revisión de capturas y análisis por pantalla
- [x] Hallazgos clave y oportunidades
- [x] `design-review/README.md` y `capture-manifest.json` actualizados

## Índice de capturas

| # | Captura | Ruta / estado | Tipo |
|---|---|---|---|
| 1 | [inicio.png](../../design-review/desktop/inicio.png) | `/` | Página completa (actualizada) |
| 2 | [inicio-hero.png](../../design-review/desktop/inicio-hero.png) | `/` hero | Vista (nueva) |
| 3 | [inicio-recorrido.png](../../design-review/desktop/inicio-recorrido.png) | `/#recorrido` | Vista (nueva) |
| 4 | [inicio-tres-momentos.png](../../design-review/desktop/inicio-tres-momentos.png) | `/#recorrido-pasos` | Vista (nueva) |
| 5 | [inicio-arte-de-mezclar.png](../../design-review/desktop/inicio-arte-de-mezclar.png) | `/` feature | Vista (nueva) |
| 6 | [inicio-cta.png](../../design-review/desktop/inicio-cta.png) | `/` CTA final + footer | Vista (nueva) |
| 7 | [biblioteca-hojas.png](../../design-review/desktop/biblioteca-hojas.png) | `/leaf-library` (con sesión) | Página completa (actualizada) |
| 8 | [hoja-detalle.png](../../design-review/desktop/hoja-detalle.png) | Ficha técnica, Habana | Vista (actualizada) |
| 9 | [hoja-inmersiva.png](../../design-review/desktop/hoja-inmersiva.png) | Recorrido inmersivo, cap. 01 | Vista (nueva) |
| 10 | [hoja-inmersiva-avance.png](../../design-review/desktop/hoja-inmersiva-avance.png) | Inmersivo +5 s sin interacción | Vista (nueva) |
| 11 | [oficio.png](../../design-review/desktop/oficio.png) | `/about` | Página completa (actualizada) |
| 12 | [proceso.png](../../design-review/desktop/proceso.png) | `/about#proceso` | Vista (re-capturada, sin cambios de píxel) |
| 13 | [perfiles-mezcla.png](../../design-review/desktop/perfiles-mezcla.png) | `/menu` | Página completa (actualizada) |
| 14 | [acceso.png](../../design-review/desktop/acceso.png) | `/login` | Página completa (actualizada) |
| 15 | [crea-tu-cigarro.png](../../design-review/desktop/crea-tu-cigarro.png) | 01 Tripa sin selección | Página completa (actualizada) |
| 16 | [crea-tu-cigarro-mezcla.png](../../design-review/desktop/crea-tu-cigarro-mezcla.png) | 01 Tripa, 2 hojas | Página completa (actualizada) |
| 17 | [crea-tu-cigarro-capote.png](../../design-review/desktop/crea-tu-cigarro-capote.png) | 02 Capote | Vista (nueva) |
| 18 | [crea-tu-cigarro-capa.png](../../design-review/desktop/crea-tu-cigarro-capa.png) | 03 Capa | Vista (nueva) |
| 19 | [tu-cigarro.png](../../design-review/desktop/tu-cigarro.png) | 04 Tu cigarro | Página completa (actualizada) |
| 20 | [tu-cigarro-vista.png](../../design-review/desktop/tu-cigarro-vista.png) | 04 Tu cigarro | Vista (nueva) |
| 21 | [recorridos-selector.png](../../design-review/desktop/recorridos-selector.png) | Panel flotante «Ver recorridos» abierto | Vista (nueva) |
| 22–26 | [guia-mezcla.png](../../design-review/desktop/guia-mezcla.png), [-2](../../design-review/desktop/guia-mezcla-2.png), [-3](../../design-review/desktop/guia-mezcla-3.png), [-4](../../design-review/desktop/guia-mezcla-4.png), [-5](../../design-review/desktop/guia-mezcla-5.png) | Guía (modal), scroll 0/25/50/75/100 % | Vistas (actualizadas) |
| 27 | [frames-cargando.png](../../design-review/desktop/frames-cargando.png) | Overlay de frames, 0,4 s tras el clic | Vista (nueva) |
| 28 | [frames-canvas.png](../../design-review/desktop/frames-canvas.png) | Canvas visible (~2,6 s + 2,5 s) | Vista (nueva) |
| 29 | [frames-canvas-avance.png](../../design-review/desktop/frames-canvas-avance.png) | Scroll interno al 35 %, +5 s | Vista (nueva) |

No se re-capturaron (sin relación con el análisis 3D): `contacto`, `error-404`, `experiencia-sensorial`, `presentacion-guiada`, `menu-experiencias`. El panel engranaje no se abrió: el botón es visible en todas las vistas (arriba a la derecha) y, dentro del overlay de frames, aparece además un segundo engranaje abajo a la izquierda.

---

## Análisis por pantalla

### 1. Home — Hero (`inicio-hero.png`)
- **Composición**: texto a la izquierda (≈ 40 % del ancho), foto a sangre con plantación desenfocada y el anillo «TAMBORILERO» de un cigarro abajo a la derecha. H1 en 3 líneas, enorme, con «la hoja» en itálica gris. Dos CTA (pill blanca + enlace ghost). «Descubrir» centrado abajo.
- **Espacios vacíos**: la mitad derecha es imagen oscurecida; la zona alta derecha (cielo/hojas) no aporta información.
- **Jerarquía/tipografía**: muy clara: kicker → H1 serif pesado → lead → CTA.
- **Paleta**: negro + marfil, con verdes y azul del cielo en la foto: es el único punto con verde/azul saturado del sitio.
- **Estático**: todo estático; el anillo del cigarro queda cortado por el borde derecho.
- **3D/flotante**: *estético-narrativo* posible: una hoja o un cigarro con parallax suave en el cuadrante derecho podría sustituir o reforzar la foto. **Pero** la foto ya trae un cigarro; superponer otro objeto duplicaría el motivo. Mejor un parallax de la propia foto (2 capas) que añadir un objeto.
- **GSAP**: entrada escalonada del H1 por líneas; parallax lento de la foto; fade del indicador «Descubrir» al hacer scroll.

### 2. Home — Intro `#recorrido` (`inicio-recorrido.png`)
- Dos columnas: H2 grande a la izquierda y párrafo + enlace a la derecha. Unos 260 px de negro vacío bajo el bloque antes del corte de sección.
- El header no es sticky (no aparece al hacer scroll).
- **3D**: es el **mejor hueco “vacío” con propósito narrativo**: «Del cultivo al cigarro» admite un objeto pequeño (hoja que se curva hasta enrollarse) ligado al scroll. Tiene que ser discreto y monocromo.
- **GSAP**: reveal por líneas del H2 + línea de tiempo scrubbed corta.

### 3. Home — Tres momentos (`inicio-tres-momentos.png`)
- Rejilla de 3 tarjetas con borde fino, icono lineal, número 01/02/03, título serif, texto y enlace. Ritmo regular y sobrio.
- Las tarjetas tienen mucho aire interno (≈ 60 px vacíos entre icono y título).
- **3D**: *no añadir objetos* dentro de las tarjetas: competirían con su lectura. Como mucho, iconos con micro-animación al hover.
- **GSAP**: stagger de entrada de las 3 tarjetas; dibujo progresivo de los bordes (stroke).

### 4. Home — El arte de mezclar (`inicio-arte-de-mezclar.png`)
- Imagen en caja (hoja oscura recortada sobre fondo casi negro) a la izquierda y copy a la derecha con H2 de 4 líneas y botón outline.
- **Bug visual**: la leyenda «MATERIA · PROPORCIÓN · OFICIO» se superpone al pie de la hoja y tapa parcialmente un elemento circular (parece un sello) que asoma cortado bajo la leyenda.
- La hoja ocupa solo ~⅓ de la caja: hay mucho fondo negro alrededor.
- **3D**: **candidato fuerte**. La hoja recortada sobre negro es justo el tipo de imagen que una hoja 3D (o 2.5D con tilt/parallax) podría sustituir, con rotación lenta ligada al scroll. Encaja con «entenderlas».
- **GSAP**: rotación/traslación de la hoja con scrub; reveal del copy.

### 5. Home — CTA final + footer (`inicio-cta.png`)
- Foto de manos enrollando a sangre, muy oscurecida, con H2 centrado de 2 líneas, subtítulo y CTA pill. Footer con lema serif grande y dos columnas de enlaces.
- **3D**: *no añadir*: la foto de manos ya es la imagen narrativa del gesto. Un objeto encima ensuciaría el cierre.
- **GSAP**: zoom lento (Ken Burns) de la foto con scrub; es el punto natural para un «preview» del cigarro que cobra forma (p. ej. 6-8 frames ya cacheados), pero sin cargar la secuencia.

### 6. Home — página completa (`inicio.png`)
- Ritmo: hero foto → negro (intro) → gris muy oscuro (tres momentos) → negro (feature) → foto (CTA) → negro (footer). La alternancia funciona, pero las secciones 2-4 son **puramente tipográficas y estáticas**: 3 pantallas seguidas sin movimiento ni foto grande.
- Hay una banda vertical clara de ~12 px en el borde derecho de todas las capturas con scroll (canal de la barra de desplazamiento).

### 7. Biblioteca de hojas (`biblioteca-hojas.png`)
- Intro centrada (H1 «El carácter comienza en la hoja»), filtros pill (Todas 21 / Capa 2 / Capote 5 / Tripa 14) + selector de origen. Grupos Capa → Capote → Tripa en rejilla de 4 columnas con tarjetas de foto + metadatos.
- **Espacios vacíos**: el grupo Capa muestra 2 tarjetas y deja 2 columnas vacías; Capote deja 3 huecos en la 2ª fila; Tripa, 2 huecos al final. La columna derecha de cada cabecera de grupo tiene solo 2 líneas de texto.
- **Paleta**: dominan los marrones de las fotos sobre negro; consistente.
- **Interactivo**: tarjetas clicables con badge de categoría y número.
- **3D**: los huecos del grupo Capa son el único sitio donde un elemento decorativo no molestaría, pero **es mejor no añadir objetos** a la rejilla: el contenido son las fotos. Mejor: tilt sutil (vanilla-tilt / CSS) en hover de las tarjetas.
- **GSAP**: batch reveal por fila (ScrollTrigger.batch); transición tipo FLIP al filtrar.

### 8. Ficha de hoja (`hoja-detalle.png`)
- **Bug visual claro**: la cabecera del overlay está rota. El `LanguageSwitcher` aparece arriba a la izquierda, el botón «Biblioteca» se desplaza al centro-izquierda con foco azul, la identidad «Capa / Habana» se va a la derecha y **la X de cierre baja a una segunda fila** (≈ x 355, y 104). La cabecera mide ~138 px en lugar de ~76. Causa en código: `<LanguageSwitcher />` insertado como primer hijo de `.ls-experience-header` (`src/pages/LeafLibrary.jsx:178`). La captura anterior (25-09) no tenía este problema.
- Cuerpo: foto de la hoja dentro de un círculo fino a la izquierda; ficha a la derecha (H1 «Habana», función/origen, «El arte de combinar», radios Capa/Capote/Tripa, CTA «Añadir a mi mezcla», tarjeta «Explorar la hoja»). La tarjeta «Explorar la hoja» queda cortada por el footer fijo.
- **3D**: **candidato muy fuerte** para un visor de hoja 3D (rotar e inclinar con el ratón): el círculo ya actúa como «peana». Propósito interactivo real: ver textura y nervadura.
- **GSAP**: transición entre hojas (anterior/siguiente) con crossfade + leve rotación.

### 9. Recorrido inmersivo (`hoja-inmersiva.png`, `hoja-inmersiva-avance.png`)
- Misma cabecera rota. Hoja grande con dos círculos concéntricos y un marcador «01» sobre la hoja; a la derecha, 4 capítulos (Identidad, Forma, Carácter, En el cigarro), H1, texto, origen, botón «Reproducir recorrido» y flechas.
- Tras 5 s sin interacción la vista es idéntica: el recorrido no avanza solo, hace falta pulsar «Reproducir».
- **3D**: es el lugar **natural** para que la hoja 3D cambie de pose por capítulo (frente → perfil → detalle → enrollada). El marcador «01» ya sugiere hotspots.
- **GSAP**: timeline por capítulo (posición del hotspot, zoom de la hoja, texto).

### 10. El oficio (`oficio.png`, `proceso.png`)
- Hero a 2 columnas con foto de manos sobre hoja; principios en 4 tarjetas; «El proceso» con pills 01-03, filas alternas texto/imagen (hoja Habana; tres hojas Capa/Capote/Tripa); bloque «03 Elaboración» con foto a sangre a la izquierda y copy corto a la derecha (gran vacío negro alrededor del copy); cita centrada; footer.
- Ritmo bueno, el más «editorial» del sitio.
- **3D**: la fila «02 Composición» (tres hojas Capa/Capote/Tripa en fila) es la candidata a un **diagrama 3D explosionado** (capas que se separan y se ensamblan con el scroll). En «03 Elaboración» es mejor no añadir nada: la foto ya cuenta el gesto.
- **GSAP**: pin de la sección «El proceso» con las 3 pills como progreso.

### 11. Perfiles de mezcla (`perfiles-mezcla.png`)
- Hero con hojas colgando a la derecha (foto oscura), H1 grande. 3 tarjetas Aroma/Estructura/Fortaleza con hoja de referencia; CTA «Encuentra tu equilibrio».
- Mucho vacío sobre las hojas de las tarjetas (las hojas ocupan ~30 % de la zona de imagen).
- **3D**: *estético opcional*: las hojas de referencia podrían balancearse levemente con el cursor. Prioridad baja.

### 12. Acceso (`acceso.png`)
- Split: hoja oscura enorme como fondo de la mitad izquierda con «Selecciona. Equilibra. *Observa.*» y una lista 01-04; formulario a la derecha (admin / •••• precargados), botón pill.
- La hoja de fondo queda muy apagada (bajo contraste), pero funciona como textura.
- **3D**: *no necesario*; como mucho, un parallax lento de la hoja.

### 13. Mesa de composición — Tripa / Capote / Capa (`crea-tu-cigarro*.png`)
- Header + «Compón tu mezcla.» + botón «Guía de la mezcla»; stepper 01-04 centrado sobre la columna izquierda; rejilla de 4 columnas; panel lateral «Tu mezcla» (Tripa 2-5, Capote 1, Capa 1) y botón flotante «Ver recorridos» abajo a la derecha.
- **Selección poco legible**: las tarjetas seleccionadas se **oscurecen y apagan** (foto y texto a ~30 % de opacidad) con un check y «EN TU MEZCLA»: visualmente parecen *deshabilitadas*, no *elegidas*. Una de ellas muestra además un anillo de foco azul desalineado (2-3 px más arriba que el borde blanco de la otra).
- El botón «Guía de la mezcla» aparece **dos veces** (cabecera y panel lateral).
- En Capa solo hay 2 tarjetas: ~520 px de vacío a la derecha de la rejilla.
- El panel «Tu mezcla» es texto puro: no hay representación visual del cigarro que se va formando.
- **3D**: **oportunidad principal**: un **cigarro 3D/2.5D en el panel lateral** que se construye por capas (tripa → capote → capa) a medida que se eligen hojas, con color de capa según la elección. Propósito: feedback inmediato y narrativo. *No* poner 3D dentro de la rejilla.
- **GSAP**: transición entre pasos (slide/fade de la rejilla), check animado, «vuelo» de la tarjeta al panel (FLIP).

### 14. Tu cigarro (`tu-cigarro.png`, `tu-cigarro-vista.png`)
- Stepper completo, H2 «Tu composición está lista.», tabla de 2 columnas: partes (Capa Habana, Capote Criollo 98, Tripa Broad Leaf + Corojo Ligero) y «Perfil de la composición» con 3 medidores de puntos **todos vacíos** y el aviso «Perfil en preparación…». CTA «Ver cómo cobra forma» + «Modificar mi mezcla».
- El botón flotante «Ver recorridos» **se superpone** a la columna de perfil de la tabla (≈ y 946).
- **No hay ninguna imagen del cigarro** en la pantalla de resultado: es la pantalla culminante y es 100 % texto.
- **3D**: **el mejor punto de todo el sitio** para un objeto 3D con propósito: el cigarro resultante (capa coloreada según la hoja elegida, corte transversal que muestra tripa/capote/capa). Sustituiría el vacío y los medidores vacíos como foco visual.
- **GSAP**: ensamblado del cigarro al entrar (capas que se enrollan), conteo de los medidores cuando haya datos.

### 15. Selector «Ver recorridos» (`recorridos-selector.png`)
- Panel flotante oscuro con «RECORRIDOS DISPONIBLES · 20 secuencias»; cada fila: nombre en inglés («Double Leaf Colorado Edition», «… Claro», «… Maduro»…), «30 fps · 743 frames» y badge «POR DEFECTO». El botón cambia a «Cerrar recorridos» (pill blanca).
- Expone jerga técnica (fps, frames, «por defecto») a usuario final y tapa la tabla del resultado.
- **3D**: no. Necesita rediseño de contenido (miniaturas en lugar de metadatos técnicos), no objetos.

### 16. Guía de la mezcla (`guia-mezcla*.png`)
- Modal a pantalla completa: cabecera (también con `LanguageSwitcher` a la izquierda que desplaza «Volver a mi mezcla», aunque aquí la X sí se mantiene en su sitio), tabs 01-03, H1 «El arte de *combinar*.», sección 01 con **corte transversal 2D** (3 círculos concéntricos Capa/Capote/Tripa, «Toca una capa…») y selector de capas; 02 con 4 tarjetas Kentucky/Burley/Virginia/Oriental; 03 con rejilla de hojas filtrable; barra inferior fija «Continuar mi mezcla».
- **3D**: el **corte transversal** es el candidato más claro para un objeto 3D *interactivo*: un cilindro con capas que se separan al tocar cada una. Ya existe la interacción; solo cambiaría la representación.
- **GSAP**: scroll interno sincronizado con el tab activo (ya existe); reveal del diagrama.

### 17. Overlay de frames (`frames-cargando.png`, `frames-canvas.png`, `frames-canvas-avance.png`)
- **Cargando (0,4 s)**: fondo negro con halo radial muy tenue, título «DOUBLE LEAF COLORADO MADURO» espaciado en gris (sin efecto shimmer visible), «PREPARANDO MEZCLA», barra fina al 13 % y «CALIDAD: PREMIUM». Botón «Volver a mi cigarro» arriba a la izquierda.
- El título del loader **no corresponde a la mezcla elegida** (Habana / Criollo 98 / Broad Leaf + Corojo Ligero): confirma visualmente el hallazgo del audit.
- **Canvas (~5 s tras el clic)**: el loader se cerró a los ~2,6 s. El fondo pasa a beige `#D6C8B9`, título serif itálica marrón arriba, 5 pastillas «PASO 1-5» + play a la derecha. **La imagen del canvas es un mosaico borroso de bloques beige/gris sin contenido reconocible** (primer frame aún a baja resolución o frame cercano escalado). Visualmente parece un error.
- **Avance (scroll 35 %, +5 s)**: ya se ve el contenido real: un mazo de hojas arriba y una hoja de capa extendida abajo sobre fondo beige, nítido. Paso 2 activo (pastilla blanca).
- El canvas ocupa la banda y ≈ 95-905; abajo queda una franja beige vacía de ~95 px con un **segundo botón engranaje** (abajo a la izquierda), además del engranaje de arriba a la derecha (el de arriba queda negro sobre beige, muy visible).
- Contraste brusco: todo el sitio es negro y el overlay es beige claro, sin transición entre ambos mundos.
- **3D**: **no añadir WebGL aquí** (el audit ya señala que la decodificación satura el hilo principal). Sí caben overlays DOM ligeros: nombre y explicación de cada paso sincronizados con `activeStep`.
- **GSAP**: transición negro → beige al cerrar el loader; etiquetas de paso con timeline; fundido de los frames de baja resolución.

---

## Hallazgos clave
1. **Bug de cabecera** en el overlay de hoja: `LanguageSwitcher` dentro de `.ls-experience-header` (`src/pages/LeafLibrary.jsx:178`) parte la cabecera en dos filas y desplaza la X de cierre (`hoja-detalle.png`, `hoja-inmersiva.png`). También desplaza «Volver a mi mezcla» en la guía (`guia-mezcla.png`).
2. **La pantalla «Tu cigarro» no muestra ningún cigarro**: es solo texto, con los medidores de perfil vacíos. Es el clímax del recorrido y el hueco visual más grande (`tu-cigarro.png`).
3. **El primer frame visible del overlay es un mosaico borroso** durante varios segundos tras cerrarse el loader (`frames-canvas.png`); el contenido nítido llega después (`frames-canvas-avance.png`).
4. **El título de la secuencia no refleja la mezcla** del usuario («Double Leaf Colorado Maduro», en inglés) (`frames-cargando.png`).
5. **Las tarjetas seleccionadas parecen deshabilitadas** (oscurecidas) en la mesa de composición (`crea-tu-cigarro-mezcla.png`).
6. **Herramientas internas visibles**: engranaje en todas las vistas y un segundo engranaje en el overlay de frames. El selector «Ver recorridos» expone fps/frames y se superpone al resultado (`recorridos-selector.png`, `tu-cigarro.png`).
7. **La Home tiene 3 pantallas seguidas estáticas y tipográficas** (intro, tres momentos, feature) entre dos fotos; el header no es sticky.
8. **Imágenes de hojas recortadas sobre negro** (feature Home, ficha, inmersivo, oficio, perfiles) son ya “objetos” aislados: son el material natural para 2.5D/3D sin romper la identidad negro-marfil-tierra.

## Oportunidades visuales concretas
1. **Cigarro 3D en «Tu cigarro»** (interactivo + narrativo): cilindro con capa del color elegido, rotable, con corte transversal que muestra tripa/capote/capa. Prioridad alta.
2. **Cigarro que se construye en el panel «Tu mezcla»** durante los pasos 01-03 (2.5D o 3D ligero): cada hoja elegida añade una capa. Prioridad alta.
3. **Corte transversal 3D en la guía** (sustituye los 3 círculos 2D, misma interacción «toca una capa»). Prioridad media.
4. **Visor de hoja 3D/2.5D en la ficha y el recorrido inmersivo**: rotación con ratón, poses por capítulo y hotspots. Prioridad media (requiere modelos/texturas por hoja; se puede empezar con tilt + parallax sobre la foto existente).
5. **Hoja con scroll en la feature «El arte de mezclar» de la Home** (rotación/curvatura con scrub). Además, corregir el solapamiento de la leyenda. Prioridad media.
6. **GSAP en la Home**: reveal por líneas de los H2, stagger de las tarjetas, parallax del hero y Ken Burns del CTA. Bajo riesgo, sin 3D.
7. **Overlay de frames**: transición negro → beige, etiquetas de paso con nombre y texto sincronizadas con `activeStep`, ocultar el frame de baja resolución hasta tener uno nítido. Sin WebGL.
8. **Diagrama explosionado Capa/Capote/Tripa en `/about#proceso`** (fila 02 Composición) con pin y scrub.
9. **Dónde NO añadir nada**: rejillas de tarjetas (biblioteca, mesa, guía 03), tarjetas «Tres momentos», CTA final de la Home, «03 Elaboración» en El oficio, formulario de acceso y el canvas de frames.
