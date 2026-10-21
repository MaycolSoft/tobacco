# TOBACCO — Recomendaciones 3D y UX

> **Referencia histórica de exploración (19/10/2026).** H1/O2/L1/ART-C1 se implementaron después; tecnología, cifras y tareas de este documento describen aquella fase. Consultar [estado vigente](3d-exploration/PROGRESS.md) y [pendientes del proyecto](STATUS.md). Los encargos y restricciones de sesiones anteriores no son instrucciones actuales.

> Fecha: 2026-10-19 · Solo exploración: no se modificó código, no se instaló nada y no hubo commits.
> Fuentes:
> - Auditoría base: [TOBACCO_PROJECT_AUDIT.md](TOBACCO_PROJECT_AUDIT.md).
> - Análisis visual: [01_VISUAL_ANALYSIS.md](3d-exploration/01_VISUAL_ANALYSIS.md).
> - Conceptos 3D: [02_3D_CONCEPTS.md](3d-exploration/02_3D_CONCEPTS.md).
> - Viabilidad técnica: [03_TECHNICAL_FEASIBILITY.md](3d-exploration/03_TECHNICAL_FEASIBILITY.md).
> - Prompts de imagen: [CODEX_IMAGE_PROMPTS.md](3d-exploration/CODEX_IMAGE_PROMPTS.md).
> - Progreso: [PROGRESS.md](3d-exploration/PROGRESS.md).
>
> Capturas: Playwright/Chromium, **solo desktop** a 1440×1000, escala 1 y perfil visual **Black**. Están en [design-review/desktop/](../design-review/desktop/), que se actualizó el 2026-10-19.

---

## 1. Executive Summary

- El diseño de TOBACCO funciona y **no necesita un rediseño**: es negro cálido con bronce, serif editorial y fotografía de hoja recortada. Las oportunidades están en los pocos **momentos vacíos o planos del recorrido**, no en decorar.
- **El hallazgo central es visual**: la pantalla **«Tu cigarro»** (paso 04), el clímax antes de la secuencia de frames, **no muestra ningún cigarro**. Es todo texto y sus medidores de perfil están vacíos ([tu-cigarro-vista.png](../design-review/desktop/tu-cigarro-vista.png)). Es el lugar con más justificación para un objeto 3D.
- **Top 3 recomendados**:
  1. **Anatomía de tu cigarro** (3D educativo, WebGL ligero en el paso 04).
  2. **Corte transversal en relieve** (CSS 3D en la guía; también sirve de alternativa sin WebGL para el concepto 1).
  3. **Espiral de capa** (dibujo SVG que hace de puente entre la mesa y la secuencia de frames).
- **Implementar primero el «Corte transversal en relieve»**: cuesta casi nada, no añade dependencias, valida el lenguaje visual de «capas» y deja listo el fallback del concepto 1.
- **No se recomienda**:
  - WebGL dentro del reproductor de frames: la decodificación ya supera 4 veces el presupuesto por frame.
  - Un cigarro héroe con humo en la Home: evoca consumo, rediseña una sección aprobada y empeora el LCP.
  - Spline y Vanta.
- **Antes de cualquier 3D** conviene arreglar varios defectos que se ven en las capturas (§5) y cumplir los prerequisitos técnicos (§11): quitar la plantilla heredada, code-splitting y `MotionConfig`.

---

## 2. Current Visual Experience

| Zona | Lo que se ve | Captura |
|---|---|---|
| Home: hero | Foto a sangre de una plantación con un cigarro anillado, H1 serif en 3 líneas y 2 CTA. | [inicio-hero.png](../design-review/desktop/inicio-hero.png) |
| Home: secciones 2-4 | Intro tipográfica, «Tres momentos» (3 tarjetas con icono lineal) y «El arte de mezclar» (hoja recortada sobre negro). Son **tres pantallas seguidas estáticas**. | [inicio-recorrido.png](../design-review/desktop/inicio-recorrido.png), [inicio-tres-momentos.png](../design-review/desktop/inicio-tres-momentos.png), [inicio-arte-de-mezclar.png](../design-review/desktop/inicio-arte-de-mezclar.png) |
| Home: CTA | Foto oscurecida de manos enrollando, H2 centrado y CTA pill. | [inicio-cta.png](../design-review/desktop/inicio-cta.png) |
| Biblioteca | Filtros pill y rejilla de 4 columnas de fotos de hoja. | [biblioteca-hojas.png](../design-review/desktop/biblioteca-hojas.png) |
| Ficha de hoja | Hoja recortada dentro de un círculo fino, a modo de «espécimen», con la ficha a la derecha. | [hoja-detalle.png](../design-review/desktop/hoja-detalle.png) |
| Recorrido inmersivo | Hoja grande, 4 capítulos y un hotspot «01». | [hoja-inmersiva.png](../design-review/desktop/hoja-inmersiva.png) |
| El oficio | Es la página más editorial: filas alternas de texto e imagen y la fila «02 Composición» con 3 hojas. | [oficio.png](../design-review/desktop/oficio.png), [proceso.png](../design-review/desktop/proceso.png) |
| Mesa: Tripa, Capote, Capa | Stepper 01-04, rejilla de tarjetas y panel lateral «Tu mezcla», solo de texto. | [crea-tu-cigarro-mezcla.png](../design-review/desktop/crea-tu-cigarro-mezcla.png), [crea-tu-cigarro-capote.png](../design-review/desktop/crea-tu-cigarro-capote.png), [crea-tu-cigarro-capa.png](../design-review/desktop/crea-tu-cigarro-capa.png) |
| Tu cigarro | Tabla de partes y perfil vacío. **No hay imagen.** | [tu-cigarro.png](../design-review/desktop/tu-cigarro.png) |
| Guía de mezcla | Modal con un corte transversal 2D (3 círculos concéntricos que funcionan como botones), familias y rejilla de hojas. | [guia-mezcla.png](../design-review/desktop/guia-mezcla.png) … [guia-mezcla-5.png](../design-review/desktop/guia-mezcla-5.png) |
| Reproductor de frames | Loader negro, después canvas sobre beige `#D6C8B9`, 5 pasos y play. | [frames-cargando.png](../design-review/desktop/frames-cargando.png), [frames-canvas.png](../design-review/desktop/frames-canvas.png), [frames-canvas-avance.png](../design-review/desktop/frames-canvas-avance.png) |

---

## 3. Playwright Screenshot Analysis

Hay 31 capturas en total: 15 actualizadas y 14 nuevas. Todas cargaron bien y el CDN de frames respondió con 39 de 39 peticiones correctas (200). El índice completo y el análisis por pantalla están en [01_VISUAL_ANALYSIS.md](3d-exploration/01_VISUAL_ANALYSIS.md).

**Observaciones confirmadas en las capturas:**
1. **Imágenes de hoja recortadas sobre negro** en la feature de la Home, la ficha, el inmersivo, El oficio y los perfiles. Cada hoja ya funciona como un «objeto» aislado, así que son el material natural para 2.5D/3D sin romper la identidad.
2. **«Tu cigarro» es el mayor hueco visual con propósito** del sitio ([tu-cigarro-vista.png](../design-review/desktop/tu-cigarro-vista.png)).
3. **El panel «Tu mezcla» es solo texto**: falta una representación del cigarro que se va formando ([crea-tu-cigarro-mezcla.png](../design-review/desktop/crea-tu-cigarro-mezcla.png)).
4. **El corte transversal de la guía es plano**, aunque la interacción ya existe ([guia-mezcla.png](../design-review/desktop/guia-mezcla.png)).
5. **Corte brusco negro → beige** al entrar en el reproductor. Además, el primer frame que se ve es un **mosaico borroso** ([frames-canvas.png](../design-review/desktop/frames-canvas.png)).
6. **Ritmo de la Home**: alterna foto, negro, gris, negro, foto. Las secciones 2-4 no tienen movimiento, lo que deja sitio para GSAP editorial, no para objetos.

**Dónde NO añadir nada** (confirmado visualmente):
- Rejillas de tarjetas (biblioteca, mesa y la sección 03 de la guía).
- Tarjetas «Tres momentos».
- CTA final de la Home: la foto de manos ya cuenta el gesto.
- «03 Elaboración» en El oficio.
- Formulario de acceso.
- Canvas de frames.

---

## 4. Design Language to Preserve

- **Paleta** (`src/styles/tokens.css`):

  | Rol | Color |
  |---|---|
  | Fondo | `#0F0E0C` |
  | Card | `#171512` |
  | Surface | `#211E19` |
  | Bronce (reservado para acción y selección) | `#C7A479` |
  | Marfil | `#F1ECE3` |
  | Beige del reproductor | `#D6C8B9` |

  El color de las hojas sale **de las fotos reales**, nunca de colores inventados.
- **Tipografía**: Playfair Display (con itálicas de énfasis) + Inter. Kickers en mayúsculas de 10 px con tracking `.19em`.
- **Materiales**: hoja curada, papel, madera mate y luz cálida lateral. **Nada brillante ni plástico. Sin humo, brasa ni gestos de consumo.**
- **Gestos de UI**: bordes de 1 px, botones pill, mucho espacio negativo y el círculo fino como «marco de espécimen».
- **Tematización en runtime**: hay 7 perfiles visuales. Todo 3D debe leer los tokens `--ls-*` (ver [03 §h](3d-exploration/03_TECHNICAL_FEASIBILITY.md)).
- **Interpretación**: el pedido de «objetos 3D coloridos» debe traducirse a *color de materia* (los marrones reales de capa, capote y tripa) y no a colores saturados nuevos.

---

## 5. UX Opportunities

Son mejoras de UX sin 3D y conviene hacerlas antes que cualquier objeto. Todas tienen evidencia visual o de código.

| # | Problema | Evidencia | Mejora |
|---|---|---|---|
| U1 | La cabecera del overlay de hoja está rota: `LanguageSwitcher` la parte en 2 filas y la X de cierre baja de sitio | [hoja-detalle.png](../design-review/desktop/hoja-detalle.png), `src/pages/LeafLibrary.jsx:178` | Sacar el selector de la cabecera del overlay o recolocarlo |
| U2 | Las tarjetas seleccionadas parecen deshabilitadas (atenuadas al ~30 %) | [crea-tu-cigarro-mezcla.png](../design-review/desktop/crea-tu-cigarro-mezcla.png) | Usar un estado «elegida» con borde bronce y foto al 100 % |
| U3 | La animación y su título no reflejan la mezcla elegida | [frames-cargando.png](../design-review/desktop/frames-cargando.png), `CraftYourCigar.jsx:249` | Mapear la mezcla a la secuencia `2t…5t × capa` (auditoría 1.1) |
| U4 | El primer frame visible es un mosaico borroso | [frames-canvas.png](../design-review/desktop/frames-canvas.png) | Mantener el loader hasta que haya un frame nítido o tapar el hueco con la Espiral de capa (C3) |
| U5 | Herramientas internas visibles: 2 engranajes, y el selector muestra «30 fps · 743 frames · POR DEFECTO» | [recorridos-selector.png](../design-review/desktop/recorridos-selector.png) | Ocultarlas en producción y mostrar miniaturas en lugar de metadatos técnicos |
| U6 | El botón «Ver recorridos» tapa la tabla del resultado | [tu-cigarro.png](../design-review/desktop/tu-cigarro.png) | Reposicionarlo u ocultarlo en el paso 04 |
| U7 | «Guía de la mezcla» aparece duplicada | [crea-tu-cigarro-mezcla.png](../design-review/desktop/crea-tu-cigarro-mezcla.png) | Dejar una sola entrada |
| U8 | La leyenda tapa un sello cortado en «El arte de mezclar» | [inicio-arte-de-mezclar.png](../design-review/desktop/inicio-arte-de-mezclar.png) | Ajustar el encuadre o la posición de la leyenda |
| U9 | Los pasos 1-5 del reproductor no tienen nombre | [frames-canvas-avance.png](../design-review/desktop/frames-canvas-avance.png) | Etiquetas y capítulos de texto sincronizados con `activeStep` |

---

## 6. Creative 3D Concepts

Hay 10 conceptos con sus 16 campos completos en [02_3D_CONCEPTS.md](3d-exploration/02_3D_CONCEPTS.md). Aquí van clasificados según la separación pedida, más uno añadido a partir del análisis visual (E1).

### Objetos 3D educativos
- **C1 · Anatomía de tu cigarro**: despiece axial de capa, capote y tripa en el paso 04. Lleva un haz de tripa por cada hoja elegida y el color sale de la miniatura real. Al pasar el cursor por una fila de la tabla se adelanta la capa correspondiente.
- **C2 · Corte transversal en relieve**: los 3 anillos de la guía pasan a discos que se inclinan a vista isométrica y se elevan al pulsarlos. Es CSS 3D.
- **D1 · Luz rasante sobre la nervadura**: en el capítulo «Forma» del recorrido inmersivo, una luz virtual revela venas y arrugas. Se prototipa con una máscara CSS.
- **E1 · Cigarro en construcción** (nuevo, del análisis visual): una silueta lineal o 2.5D del cigarro dentro del panel «Tu mezcla» que gana capas en cada paso (tripa, luego capote, luego capa). Se puede hacer en SVG y es la antesala de C1.

### Objetos 3D decorativos
- **A1 · Hoja en vilo**: la hoja de la ficha se curva de verdad (una malla flexible) y el cursor mueve la luz. Queda reservado hasta validar C1.
- **D3 · Cigarro héroe con humo**: **NO RECOMENDADO** (ver §14).

### Microinteracciones
- **B1 · Tilt de materia**: inclinación de ≤4° de la tarjeta con la hoja flotando delante. Solo en dispositivos con hover.
- **B2 · La hoja viaja a tu mezcla**: la hoja gira sobre su nervio y vuela hasta el panel lateral.

### Animaciones con GSAP
- **A2 · Tres hojas en profundidad**: con el scroll, la hoja de «El arte de mezclar» se desdobla en capa, capote y tripa. Variante: la fila «02 Composición» de `/about#proceso`.
- **C3 · Espiral de capa**: un dibujo técnico SVG traza la hélice de la capa sobre el beige mientras carga la secuencia.

### Mejoras de UX con movimiento
- **D2 · Profundidad de pasos**: la rejilla retrocede o avanza en Z al pasar de Tripa a Capote a Capa, con la metáfora «de dentro hacia fuera».
- La tabla U1-U9 de §5.

---

## 7. Recommended Placement by Page

| Página / componente | Concepto | Tecnología | Captura de referencia |
|---|---|---|---|
| `/` · `.site-feature__image` (`src/pages/Home.jsx`) | A2 Tres hojas en profundidad | CSS 3D + GSAP | [inicio-arte-de-mezclar.png](../design-review/desktop/inicio-arte-de-mezclar.png) |
| `/` · H2 de las secciones, tarjetas y hero | Reveals por línea, stagger, parallax de la foto (sin objetos) | GSAP | [inicio.png](../design-review/desktop/inicio.png) |
| `/leaf-library` · tarjetas | B1 Tilt de materia | CSS | [biblioteca-hojas.png](../design-review/desktop/biblioteca-hojas.png) |
| `/leaf-library` · ficha (`TechnicalSheet.jsx`) | A1 Hoja en vilo (fase 2) | R3F | [hoja-detalle.png](../design-review/desktop/hoja-detalle.png) |
| `/leaf-library` · inmersivo (`ImmersiveView.jsx`, capítulo 02) | D1 Luz rasante | Máscara CSS, después shader | [hoja-inmersiva.png](../design-review/desktop/hoja-inmersiva.png) |
| `/about#proceso` · fila 02 Composición | Variante de A2 (despiece con pin) | GSAP | [proceso.png](../design-review/desktop/proceso.png) |
| `/craft-your-cigar` · `LeafGrid.jsx` | D2 Profundidad de pasos + B1 + B2 | framer-motion + CSS | [crea-tu-cigarro-capote.png](../design-review/desktop/crea-tu-cigarro-capote.png) |
| `/craft-your-cigar` · `BlendSummary.jsx` | E1 Cigarro en construcción | SVG + framer | [crea-tu-cigarro-mezcla.png](../design-review/desktop/crea-tu-cigarro-mezcla.png) |
| `/craft-your-cigar` · `CigarResult.jsx` | **C1 Anatomía de tu cigarro** | R3F lazy (alternativa: C2/SVG) | [tu-cigarro-vista.png](../design-review/desktop/tu-cigarro-vista.png) |
| `TobaccoGuidePage.jsx` · `.tg-cross-section` | **C2 Corte transversal en relieve** | CSS 3D | [guia-mezcla.png](../design-review/desktop/guia-mezcla.png) |
| Transición `CigarResult` → `#video-root` | **C3 Espiral de capa** | SVG + GSAP (solo DOM) | [frames-cargando.png](../design-review/desktop/frames-cargando.png) |
| `#video-root` (reproductor) | Solo etiquetas y capítulos de texto ligados a `activeStep`. **Sin WebGL.** | DOM | [frames-canvas-avance.png](../design-review/desktop/frames-canvas-avance.png) |

---

## 8. Interaction & Motion Proposals

Principios:
- **Movimiento con causa**: cada movimiento responde a una acción (elegir, avanzar, pulsar) o al scroll. Nada en bucle infinito.
- **Duraciones cortas**: 300-700 ms en microinteracciones y ≤1,5 s en entradas, después quietud.
- **Una librería por elemento**: GSAP o framer, nunca las dos sobre el mismo nodo.
- **El cursor mueve la luz, no el objeto** cuando la lectura importa (A1, D1). Así se evita el mareo.
- **En táctil**, tap en lugar de hover y `touch-action: pan-y` para no secuestrar el scroll.

| Interacción | Disparador | Respuesta | Concepto |
|---|---|---|---|
| Hover sobre una fila de la tabla (Capa/Capote/Tripa) | Cursor | La capa 3D se adelanta y las demás bajan al 40 % | C1 |
| Pulsar una capa del corte | Clic o teclado (`aria-pressed` se mantiene) | El disco se eleva 12-24 px | C2 |
| Elegir una hoja | Clic | La hoja gira y vuela al resumen, y el cigarro del panel gana su capa | B2 + E1 |
| Cambiar de paso | Botón «Continuar» o stepper | La rejilla retrocede en Z y entra la siguiente | D2 |
| «Ver cómo cobra forma» | Clic | El botón se expande en beige y se dibuja la espiral, que se funde con el primer frame nítido | C3 |
| Scroll en la Home | Scroll | Las 3 hojas se separan con scrub corto (~40 vh) | A2 |

---

## 9. GSAP Integration Opportunities

GSAP 3.13 ya está instalado y solo se usa en `ScrollVideo.jsx`, con **un** ScrollTrigger sobre `scroller: "#video-root"`. Las reglas para añadir más están en [03 §a](3d-exploration/03_TECHNICAL_FEASIBILITY.md):

- Las páginas usan `window` como scroller y la guía usa `.tg-scroll`. Hay que usar **refs** como trigger, nunca la clase global `.scroll-container`.
- Envolver todo en `gsap.context()` + `gsap.matchMedia()` y limpiar con `ctx.revert()`. `@gsap/react` no está instalado.
- **Riesgos a resolver antes**:
  - El `ScrollTrigger.refresh()` global de `ScrollVideo.jsx:356`.
  - `useBodyScrollLock` (`position:fixed`), que no hace refresh al liberar el scroll.
  - El `scrollTo(0,0)` de `MainLayout`, que se ejecuta después de los efectos de los hijos.

Oportunidades con bajo riesgo:
- Reveals por línea en los H2 de la Home y de El oficio.
- `ScrollTrigger.batch` en la rejilla de la biblioteca.
- Pin de «El proceso» con las pills 01-03 como progreso.
- A2 con scrub corto.
- C3 como timeline sin scroll.
- Ken Burns en el CTA final.

**No se toca** el tween ni el trigger del reproductor.

---

## 10. Three.js vs React Three Fiber vs CSS 3D

| Opción | Peso (estimado) | Uso en TOBACCO |
|---|---|---|
| **CSS 3D / SVG + framer** | 0 KB extra | **Por defecto**: C2, C3, A2, B1, B2, D2 y E1 |
| **React Three Fiber v9 + drei** | ~190-220 KB gz en un chunk lazy | **1-2 escenas**: C1 primero y, después, A1 |
| Three.js vanilla | ~150-170 KB gz | No aporta frente a R3F en un proyecto React |
| Zdog / Vanilla-Tilt | 3-10 KB | El tilt se resuelve con unas 30 líneas propias; Zdog no encaja con la estética fotográfica |
| Vanta / Spline | three completo o más de 500 KB | **Descartados** |

R3F v9 es la línea compatible con React 19 (dato de conocimiento general, no verificado en el repo). Comparativa completa en [03 §i](3d-exploration/03_TECHNICAL_FEASIBILITY.md).

---

## 11. Performance and Accessibility

**Reglas de coexistencia con los frames** ([03 §b](3d-exploration/03_TECHNICAL_FEASIBILITY.md)):
1. **Nunca usar WebGL mientras exista `#video-root`.** CigarResult ya se desmonta al abrir el overlay (`CraftYourCigar.jsx:217`, `LeafGrid.jsx:65`). Navbar, Footer, la guía y los paneles **no** se desmontan, así que ningún 3D debe vivir en ellos.
2. **Un solo contexto WebGL por vista**, con `frameloop="demand"`, DPR ≤1,5 (1 en móvil), `powerPreference: 'low-power'` y `forceContextLoss()` al desmontar.
3. **Liberar recursos al desmontar**: `dispose()` de geometrías, materiales y texturas. En QA, `renderer.info.memory` debe volver a 0 tras abrir y cerrar el overlay 10 veces.
4. **Carga diferida**: `React.lazy` + `IntersectionObserver`, con un póster estático como fallback de `Suspense`. Precarga en `pointerenter` o en idle solo si no hay `saveData`.
5. **Pausar fuera de pantalla** (IntersectionObserver) y con `visibilitychange`.

**Accesibilidad / reduced motion:**
- Con `prefers-reduced-motion`, **no se monta WebGL** y se muestra el póster con el estado final. Las interacciones que no son movimiento se mantienen.
- Prerequisito: `<MotionConfig reducedMotion="user">`. Hoy framer y ScrollVideo ignoran la preferencia.
- Los botones existentes (`aria-pressed`, tabla `<dl>`) siguen siendo la interfaz real. El 3D va `aria-hidden`.

**Móvil** (no se capturó por decisión del usuario; aquí solo hay reglas técnicas):
- Tres niveles según el dispositivo: estático, ligero y completo. Se deciden por `hover`, `deviceMemory`, `hardwareConcurrency` y `saveData`.
- En iOS no debe coincidir nunca con el reproductor (~224 MB estimados solo en bitmaps).

**Prerequisitos antes de pagar el peso de three** ([03 §l](3d-exploration/03_TECHNICAL_FEASIBILITY.md)):
1. Quitar jQuery, Bootstrap y el resto de la plantilla de `index.html`.
2. Code-splitting de rutas (hoy hay un único chunk de ~288 KB gz).
3. Medir un baseline con Lighthouse.
4. Añadir `MotionConfig`.
5. Hacer refresh de ScrollTrigger al liberar el scroll lock.
6. Exponer `showVideo` en un store o un evento.
7. Crear el helper `getDeviceTier()`.

**Presupuestos propuestos** (no son mediciones):

| Concepto | Presupuesto |
|---|---|
| Chunk `vendor-3d` | ≤220 KB gz |
| Triángulos por escena | ≤50k en escritorio, ≤20k en móvil |
| Texturas | ≤2K/1K |
| Memoria de GPU | ≤64/32 MB |
| FPS objetivo | 60 en escritorio, ≥30 en móvil |

---

## 12. Asset Requirements

**Imágenes y texturas 2D** (prompts en [CODEX_IMAGE_PROMPTS.md](3d-exploration/CODEX_IMAGE_PROMPTS.md)):

| ID | Concepto | Tipo | ¿Imprescindible? |
|---|---|---|---|
| `TEX-WRAP-01` | C1 | Textura tileable de hoja de capa (albedo) | Recomendable (evita estirar la thumb) |
| `TEX-FILLER-01` | C1, C2 | Cara de corte de la tripa, con alfa | Opcional |
| `IMG-LEAF-TRIO-01` | A2 | 3 recortes de hoja con alfa (capa, capote, tripa) | Opcional (pueden salir de la colección real) |
| `IMG-PAPER-01` | C3 | Papel técnico beige tileable | Opcional |
| `TEX-LEAF-NRM-xx` / `TEX-LEAF-HGT-xx` | A1, D1 | Normal maps y mapas de alturas por hoja | **Se derivan de las fotos existentes por proceso, no con IA** |

**Modelo 3D (no es una imagen):**
- `GLB-CIGAR-01`, solo para una segunda fase de C1. Cigarro sin encender y sin anilla, con mallas `capa`, `capote` y `tripa_00..04`.
- Presupuesto: ≤15k triángulos y ≤300 KB con Draco/meshopt.
- **Un prompt de imagen no puede producirlo.** Se construye de forma procedural (`LatheGeometry`/`TubeGeometry`) o en Blender.

**Sin assets** (procedurales o reutilizando `public/assets/thumbs/*.webp`, WebP con alfa, 828 KB en total): C2, B1, B2, D2, E1 y la fase 1 de C1.

**Regla**: nunca usar las PNG `full` (hasta 8 MB, 1939×4000) como textura WebGL.

---

## 13. References to Codex Image Prompts

Todos los prompts están en inglés en [docs/3d-exploration/CODEX_IMAGE_PROMPTS.md](3d-exploration/CODEX_IMAGE_PROMPTS.md). Cada uno indica objetivo, estilo, materiales, paleta, composición, iluminación, fondo, relación de aspecto, resolución, transparencia, qué evitar, nombre de archivo y ubicación.

| Concepto | IDs de recurso | Prioridad | Archivo sugerido (no existe aún) |
|---|---|---|---|
| C1 Anatomía de tu cigarro | `TEX-WRAP-01` (albedo, normal y roughness, tileable) | P2 | `public/img/3d/tex-wrap-01_{albedo,normal,roughness}.ktx2` (+ `.webp`) |
| C1, C2 | `TEX-FILLER-01` (cara de corte de la tripa, con alfa) | P1 | `public/img/3d/tex-filler-01.webp` |
| C3 Espiral de capa | `IMG-PAPER-01` (papel beige tileable) | P1 | `public/img/3d/img-paper-01.webp` |
| A2 Tres hojas en profundidad | `IMG-LEAF-TRIO-01` (recomendado: recortar de la colección real) | P3 | `public/img/3d/leaf-trio-01_{tripa,capote,capa}.webp` |
| D1 / A1 | `TEX-LEAF-HGT-{leafId}`, `TEX-LEAF-NRM-{leafId}` (derivados de las PNG `full` con herramientas; primero `capa-habana` y `capa-pensilvania`) | P4 | `public/img/3d/leaves/{leafId}_height.webp` / `_normal.ktx2` |
| Concept art (referencia para el cliente, no es un asset final) | `REF-C1-01`, `REF-C2-01`, `REF-C3-01` | Ref. | `docs/3d-exploration/refs/ref-c{1,2,3}-*.png` |
| C1 fase 2 | `GLB-CIGAR-01` (especificación de modelo; **no** sale de un prompt de imagen) | P5 opcional | `public/models/glb-cigar-01.glb` |

Notas verificadas por el agente de prompts:
- `public/img/3d/` no existe: todas las rutas son propuestas.
- `src/data/leaves.js` no define colores por hoja; los hex de hoja que aparecen en los prompts están aproximados a partir de las thumbs.
- `public/img/about.png` incluye un sello con monograma y sombra horneada, así que no sirve como textura limpia.
- Todos los prompts llevan un bloque común de exclusiones: sin humo, sin cigarro encendido, sin anilla ni logo, sin personas fumando y sin texto.

---

## 14. Creative Concepts Ranked

Puntuación del 1 al 5 en 10 criterios: coherencia, valor UX, estética, integración, originalidad, facilidad, rendimiento, móvil, mantenimiento y compatibilidad con las animaciones actuales. Detalle en [02 §5](3d-exploration/02_3D_CONCEPTS.md).

| # | Concepto | Clasificación | Total /50 | Comentario |
|---|---|---|---|---|
| 1 | C2 Corte transversal en relieve | 3D educativo | **46** | La mejor relación entre coste y valor |
| 2 | C3 Espiral de capa | Animación GSAP | **43** | Resuelve la espera y el corte brusco hacia los frames |
| 3 | D2 Profundidad de pasos | UX con movimiento | 41 | Orientación entre pasos sin coste |
| 4 | A2 Tres hojas en profundidad | Animación GSAP | 40 | Da ritmo a una Home estática y enseña el vocabulario |
| 5 | B1 Tilt de materia | Microinteracción | 40 | Pulido barato |
| 6 | **C1 Anatomía de tu cigarro** | 3D educativo | 39 | **El de más valor narrativo**; puntúa menos solo por su coste |
| 7 | B2 La hoja viaja a tu mezcla | Microinteracción | 37 | Une causa y efecto entre la rejilla y el resumen |
| 8 | D1 Luz rasante | 3D educativo | 37 | Enseña a mirar la hoja; requiere mapas |
| 9 | A1 Hoja en vilo | 3D decorativo | 34 | Bonito pero secundario; caro en móvil |
| — | E1 Cigarro en construcción | 3D educativo (SVG) | sin puntuar | Añadido en la consolidación; complementa C1 |
| ✗ | D3 Cigarro héroe con humo | Decorativo | descartado | Evoca consumo, rediseña el hero, penaliza el LCP y compite con la secuencia |

**Otras ideas descartadas:**
- WebGL en `#video-root`.
- Humo o partículas.
- `MixingAnimation.jsx` tal cual (hojas verdes `#5FA14A` en bucle).
- Fondos Vanta.
- Spline.
- Galería 3D de la biblioteca.
- Hojas 3D en «Tres momentos».

---

## 15. Top 3 Recommendations

1. **C2 · Corte transversal en relieve: implementar primero.**
   - **Por qué**: coste bajo, cero dependencias y cero riesgo para los frames.
   - **Qué valida**: convierte una interacción que ya existe en un objeto legible y valida con el cliente el lenguaje de «capas de materia».
   - **Qué deja hecho**: el fallback sin WebGL de C1.
   - Referencia visual: [guia-mezcla.png](../design-review/desktop/guia-mezcla.png).
2. **C3 · Espiral de capa.**
   - **Qué resuelve**: el corte negro → beige y el mosaico borroso del primer frame (U4) con narrativa en lugar de un spinner.
   - **Cómo**: solo DOM/SVG, compatible con la regla de no usar WebGL en el overlay.
   - Referencia visual: [frames-canvas.png](../design-review/desktop/frames-canvas.png).
3. **C1 · Anatomía de tu cigarro.**
   - **Qué aporta**: es el único WebGL plenamente justificado. Llena el paso 04, que hoy no tiene imagen, refleja la mezcla real y *anuncia* la secuencia.
   - **Condiciones**: carga diferida, `frameloop="demand"` y desmontaje antes de abrir el overlay.
   - **Requisito previo**: los prerequisitos de §11.
   - Referencia visual: [tu-cigarro-vista.png](../design-review/desktop/tu-cigarro-vista.png).

**Acompañamiento barato**: D2 + B1 en la mesa y E1 en el panel «Tu mezcla».

---

## 16. Implementation Roadmap

| Fase | Contenido | Dependencias nuevas | Riesgo |
|---|---|---|---|
| **0 · Higiene** | U1-U9 (cabecera, estado elegida, mezcla → secuencia, primer frame nítido, ocultar herramientas internas), quitar la plantilla heredada, code-splitting, `MotionConfig` y medir un baseline | Ninguna | Bajo |
| **1 · Lenguaje de capas** | C2 en la guía, D2 + B1 en la mesa, E1 en el resumen | Ninguna | Bajo |
| **2 · Puente a la secuencia** | C3 + etiquetas de paso sincronizadas con `activeStep` en el overlay (solo DOM) | Ninguna | Bajo-medio (perfilar que no compite con el decode) |
| **3 · GSAP editorial** | A2 en la Home y en `/about#proceso`, reveals, batch en la biblioteca. Antes, el refresh tras el scroll lock | Ninguna | Medio (gestionar los ScrollTrigger de página) |
| **4 · WebGL puntual** | C1 fase 1 (procedural + thumbs) como prototipo aislado, medido en iPhone y Android de gama media | three + R3F v9 + drei (chunk lazy) | Medio |
| **5 · Opcional** | B2, A1/D1 (pipeline de texturas de hoja), C1 fase 2 con `GLB-CIGAR-01` | Pipeline glTF/KTX2 | Medio-alto |

Cada fase se valida con el cliente contra las capturas de `design-review/desktop/` antes de pasar a la siguiente.

---

## 17. Final Creative Direction

> **«Materia en capas.»** El 3D de TOBACCO no es un producto flotando: es **la anatomía de lo que el usuario construye**. La pieza central es el cigarro sin encender, sin anilla y sin humo, contado de dentro hacia fuera con las hojas reales que el usuario eligió, sobre negro cálido, con luz rasante y cotas en bronce de 1 px, como una lámina técnica de taller.

- **Una sola idea visual repetida en tres escalas**: el corte de la guía (C2), el cigarro que se forma en el panel (E1) y la anatomía del resultado (C1). Todo prepara la secuencia de frames, que sigue siendo **el clímax intacto**.
- **El movimiento es consecuencia, no adorno**: se elige, se avanza, se envuelve.
- **La identidad aprobada no se toca**: los colores del 3D son los de la materia, la tipografía sigue siendo la del sitio y el espacio negativo se respeta.
- **Primero coherencia, luego espectáculo**: corregir lo que se ve roto (§5) aporta más «premium» que cualquier objeto nuevo.
