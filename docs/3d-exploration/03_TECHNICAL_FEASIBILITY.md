# 03 — Viabilidad técnica 3D (Agent C)

> **Referencia histórica de exploración (19/10/2026).** H1/O2/L1/ART-C1 se implementaron después; tecnología, cifras y tareas de este documento describen aquella fase. Consultar [estado vigente](PROGRESS.md) y [pendientes del proyecto](../STATUS.md). Los encargos y restricciones de sesiones anteriores no son instrucciones actuales.

> Alcance: viabilidad técnica de añadir 3D/pseudo-3D a TOBACCO sin romper la secuencia de frames.
> Convenciones: **[Confirmado]** = verificado en código (archivo:línea). **[Conocimiento]** = dato de la librería/plataforma no verificado en este repo. **[Estimación]** / **[Propuesta]** = valores orientativos, no medidos.
> No se modificó código de la app ni se instalaron dependencias.

## Progreso

- [x] Esqueleto creado
- [x] a. Mapa GSAP/ScrollTrigger y riesgos
- [x] b. Coexistencia 3D vs frames
- [x] c. Lazy loading
- [x] d. Control del render loop
- [x] e. Disposal
- [x] f. Reduced motion
- [x] g. Mobile
- [x] h. Theming
- [x] i. Comparativa de tecnologías
- [x] j. Presupuestos de rendimiento
- [x] k. Veredictos por ubicación
- [x] l. Checklist "antes de implementar"
- [x] Conclusión técnica

Versiones instaladas [Confirmado, `node_modules/*/package.json`]: react 19.2.0, gsap 3.13.0, framer-motion 12.23.24, zustand 5.0.9, vite 7.3.2. **No instalados**: three, @react-three/fiber, @react-three/drei, @gsap/react.

---

## a. Mapa actual de GSAP / ScrollTrigger

### Uso actual (único archivo: `src/components/ScrollVideo.jsx`)

| Aspecto | Detalle | Ref |
|---|---|---|
| Plugins | `ScrollTrigger` y `ScrollToPlugin` registrados a nivel de módulo (al importar el archivo) | `ScrollVideo.jsx:4-6`, `:13-14` |
| Instancias | **1** ScrollTrigger: tween de `frameRef.current.index` 0 → `frameCount-1`, `snap:"index"`, `ease:"none"` | `:317-344` |
| Trigger | `".scroll-container"` (selector de **clase global**, no ref) | `:322`, elemento en `:376` |
| Scroller | `"#video-root"` (overlay fijo con `overflow-y:auto`) | `:323`; overlay en `CraftYourCigar.jsx:198-204`, CSS `craft-your-cigar.css:8-19` |
| Rango | `start:"top top"`, `end:"bottom bottom"`, `scrub:0.6`; altura `scrollHeight vh` (150–3000, por defecto 1200, en `localStorage`) | `:324-326`, `:123-131`, `:378` |
| Creación | Solo cuando `showCanvas` es true (tras el loader) | `:311-313` |
| Refresh | `requestAnimationFrame(() => ScrollTrigger.refresh())` al cambiar `scrollHeight`/`showCanvas` — **refresh global** | `:353-357` |
| Tweens sin trigger | `gsap.to(scroller, {scrollTo})` para play (lineal) y pasos (`power2.inOut`, `overwrite:"auto"`) | `:187-193`, `:223-230` |
| Cleanup | `anim.scrollTrigger?.kill(); anim.kill(); autoPlayTweenRef.current?.kill()` | `:346-350` |
| Cleanup incompleto | El tween de `goToStep` no se guarda en ref; si el componente se desmonta durante esos 0,8–2,5 s, el tween sigue vivo hasta terminar (sobre un nodo ya desmontado; inocuo pero no limpio) | `:223` |

No hay `gsap.context()`, `gsap.matchMedia()` ni `@gsap/react` en el repo [Confirmado: `grep gsap` solo devuelve `ScrollVideo.jsx`; `node_modules/@gsap` no existe].

### Riesgos al añadir ScrollTriggers a nivel de página (scroller = `window`)

1. **`ScrollTrigger.refresh()` global** (`ScrollVideo.jsx:356`): recalcula *todas* las instancias, incluidas las de página. Las de la página Craft se desmontan al abrir el overlay (`CraftYourCigar.jsx:217`), pero **Navbar, Header y Footer siguen montados** (están en `MainLayout.jsx:29-45`, fuera de `children`) y `LayoutControlPanel` está siempre montado (`App.jsx:38`). Un trigger en esos componentes se recalcularía con el body bloqueado (ver 3).
2. **Diferencia de scroller**: la secuencia escucha `#video-root`; cualquier trigger de página debe usar el default (`window`) y **no** compartir el selector `.scroll-container`. Regla: usar refs (`trigger: ref.current`), nunca selectores de clase globales.
3. **Body scroll lock con `position:fixed`** (`useBodyScrollLock.js:18-24`): durante el bloqueo `window.scrollY` pasa a 0 y el documento queda con la altura del viewport. Un `refresh()` en ese estado calcula `start/end` erróneos para triggers de `window`. Al desbloquear se hace `window.scrollTo(x,y)` (`:28`), pero **no hay refresh posterior**, y ScrollTrigger por defecto solo se auto-refresca con `resize`, `load`, `DOMContentLoaded` y `visibilitychange` [Conocimiento]. Afecta a todos los usuarios del hook: overlay Craft (`CraftYourCigar.jsx:176`), guía (`TobaccoGuidePage.jsx:33`), LeafLibrary (`LeafLibrary.jsx:50`), `FrameVariantsModal.jsx:36`, `UIControlCenterModal.jsx:26`.
   - **Mitigación propuesta**: al liberar el último lock, `requestAnimationFrame(() => ScrollTrigger.refresh())`; o bien `trigger.disable()` al bloquear y `enable()` al liberar. Mejor: un único helper que emita un evento `scroll-lock-change`.
4. **`MainLayout` hace `window.scrollTo(0,0)` en `useEffect` por cambio de ruta** (`MainLayout.jsx:17-22`). Los efectos del padre corren **después** de los de los hijos, así que un trigger creado en `useEffect`/`useLayoutEffect` de la página se crea con el scroll de la ruta anterior y luego salta a 0. `start/end` no dependen del scroll actual, pero los callbacks `onEnter/onLeave` y `toggleActions` pueden dispararse en falso durante el salto. Mitigación: crear triggers en `useLayoutEffect` y llamar a `ScrollTrigger.refresh()` tras `load` de imágenes; o mover el reset de scroll a `useLayoutEffect`/`history.scrollRestoration` (cambio futuro, fuera de este alcance).
5. **Imágenes sin dimensiones** (hero `Home.jsx:22`, sin `srcset`/`width`): cambian el layout al cargar y desfasan triggers. Requiere `refresh` tras `load` o dimensiones explícitas.
6. **Mezcla GSAP + framer-motion** en el mismo elemento: conflicto de `transform`. Regla: un elemento, una librería.

### Patrón de limpieza recomendado (sin `@gsap/react`)

```jsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, ({ conditions }) => {
      if (!conditions.motion) return;
      gsap.from(ref.current, { y: 40, opacity: 0, scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
    });
  }, rootRef); // scope: selectores relativos al nodo raíz
  return () => ctx.revert(); // mata tweens, ScrollTriggers y matchMedia creados dentro
}, []);
```

`ctx.revert()` revierte estilos inline y mata ScrollTriggers creados dentro del contexto [Conocimiento]. En React 19 StrictMode (dev) el efecto corre dos veces: `revert()` lo hace idempotente.

---

## b. Coexistencia 3D vs secuencia de frames

### Qué se desmonta al abrir el overlay [Confirmado]

| Elemento | ¿Se desmonta con `showVideo=true`? | Ref |
|---|---|---|
| Intro, MasterBlends, LeafGrid (incluye `CigarResult`), BlendSummary, selector de recorridos | **Sí** (`{!showVideo && …}`) | `CraftYourCigar.jsx:217-245`; `CigarResult` se renderiza dentro de LeafGrid (`LeafGrid.jsx:6`, `:65`) |
| `TobaccoGuidePage` | **No**: está fuera de la condición (`{showGuide && …}`) | `CraftYourCigar.jsx:247` |
| Navbar / Header / Footer | **No** (MainLayout) | `MainLayout.jsx:29-45` |
| LayoutControlPanel, CentralLogViewer | **No** (montados globalmente) | `App.jsx:38`, `main.jsx:29` |

Notas:
- El `AnimatePresence` está **dentro** del condicional (`CraftYourCigar.jsx:196-197`): la animación `exit` nunca se ejecuta y el overlay se desmonta de golpe. Para 3D es una ventaja (teardown síncrono), pero no hay transición de salida.
- En la práctica la guía no puede abrir el overlay (los botones están en el contenido desmontado y la guía es modal), pero si en el futuro se añade 3D a la guía debe comprobar explícitamente `showVideo`.

### Evidencia de contención GPU/decodificador [Confirmado en docs]

- Decode medio ~101–183 ms (p95 hasta 282 ms) con 2 decodificaciones en paralelo ≈ 14 preparaciones/s frente a ~30 índices/s requeridos (`docs/scroll-video-performance-audit.md:198-211`, `:241-247`).
- Memoria estimada: 12 bitmaps 2880×1620 ≈ 224 MB + blobs ≈ 100 MB + backing store ≈ 21 MB (`scroll-video-performance-audit.md:273-283`); en 4K con DPR≥2 hasta ~400 MB solo en bitmaps (`scroll-video-optimization.md:204-212`).
- rAF medio 23,3 ms y p95 66,6 ms en escenario C normal: ya no se sostienen 60 Hz (`scroll-video-performance-audit.md:263-271`).
- Composición extra: máscara CSS sobre canvas a pantalla completa + `backdrop-filter` en controles (`ScrollVideo.jsx:451-452`, `:534`, `:560`).

### Reglas de coexistencia [Propuesta]

1. **Nunca WebGL mientras `#video-root` existe.** El 3D de cualquier componente que siga montado (Navbar, Footer, guía, paneles globales) debe pausar *y* liberar el contexto al abrir el overlay. Recomendado: exponer `showVideo` en un store (hoy es `useState` local, `CraftYourCigar.jsx:171`) o un evento, y que el 3D se desmonte.
2. **Un solo contexto WebGL activo por vista.** Chrome limita ~16 contextos activos y descarta el más antiguo [Conocimiento]; iOS Safari es más estricto con memoria. Las tarjetas (LeafLibrary, grid de selección) **no** deben tener un `<Canvas>` cada una: usar CSS 3D o un único canvas compartido (drei `<View>`).
3. **Teardown antes de abrir**: `startCrafting`/`onSelect` (`CraftYourCigar.jsx:191`, `:240`) disparan `setShowVideo(true)`; el desmontaje del 3D ocurre en el mismo commit. Si se necesita liberar antes de que el scheduler empiece a pedir frames, desmontar el 3D primero (un tick) y luego abrir el overlay.
4. Ya existe un patrón de instancia única: `activeScheduler?.dispose()` (`frameScheduler.js:51`). Replicarlo para el renderer 3D (módulo `active3D`).

---

## c. Lazy loading

Estado actual [Confirmado]: **cero code-splitting** (`grep "lazy(|import("` en `src` sin resultados). El `dist/` existente tiene **un solo JS** `index-Cs4nJUBE.js` de 907 KB (~288 KB gz) — build del 9-oct, puede estar desactualizado respecto a `HEAD`. `vite.config.js` no define `build.rollupOptions`.

Estrategia [Propuesta]:

1. **`React.lazy(() => import('./three/HeroScene'))`** por escena; three/R3F solo dentro de ese módulo. Vite genera el chunk automáticamente al ver `import()`.
2. **`<Suspense fallback={<img src="poster.webp" …/>}>`**: el fallback es la imagen estática que ya existe (p. ej. `/img/carousel-1.jpg` en Home). El póster es también el estado final para reduced-motion, móvil bajo y error (`ErrorBoundary` local alrededor del lazy).
3. **Gating con `IntersectionObserver`** (`rootMargin: '200px'`): no montar el lazy hasta que el contenedor esté cerca del viewport. Hoy no hay ningún IntersectionObserver en `src` [Confirmado].
4. **Preload**: `onPointerEnter`/`onFocus` del CTA o `requestIdleCallback(() => import(...))` tras el `load`, **solo** si el tier lo permite y `!navigator.connection?.saveData`.
5. **`manualChunks`** (`build.rollupOptions.output.manualChunks`): agrupar `three` + `@react-three/*` en un chunk `vendor-3d` para que varias escenas compartan caché, y separar `gsap` (hoy solo lo usa la ruta protegida) junto a ScrollVideo. Cuidado: un `manualChunks` mal definido puede arrastrar three al chunk de entrada; verificar con `rollup-plugin-visualizer` o `vite build --mode analyze` (no instalado; solo recomendación).
6. **Prerequisito independiente del 3D**: lazy de rutas (`CraftYourCigar`, `LeafLibrary`) para que GSAP y el reproductor salgan del bundle inicial (`App.jsx:18-25` importa todas las páginas estáticamente).

---

## d. Control del render loop

| Técnica | Aplicación [Propuesta] |
|---|---|
| `frameloop="demand"` + `invalidate()` | Default para escenas estáticas o dirigidas por interacción (hover, drag, scroll). Solo renderiza cuando algo cambia. |
| `frameloop="never"` + `advance()` | Escenas guiadas por scroll vía GSAP: el `onUpdate` del tween llama `advance(time)` — un render por update, sin rAF propio. |
| `frameloop="always"` | Solo si hay animación continua real (humo, rotación lenta) y mientras sea visible. |
| IntersectionObserver | Fuera de pantalla → `frameloop="never"` (o desmontar si sale > 1 viewport). |
| `visibilitychange` | `document.hidden` → pausar (el rAF ya se pausa en pestañas ocultas, pero timers/tweens no). `ImmersiveView.jsx:33-35` ya usa este patrón con `document.hidden`. |
| DPR | `dpr={[1, 1.5]}` en escritorio, `1` en móvil. El reproductor ya topa en 2 (`animationPerformance.js:22`). |
| `antialias` | `false` + DPR ≥1.5 en escritorio, o FXAA puntual; `antialias:false` en móvil. |
| `powerPreference` | `'low-power'` para decorativo (evita activar la GPU discreta en portátiles); `'high-performance'` no justificado en TOBACCO. |
| Adaptativo | drei `<PerformanceMonitor onDecline>` → bajar DPR/desactivar sombras; `<AdaptiveDpr>`; o fallback a póster si fps < 30 sostenido 2 s. |
| Sombras / postprocesado | Evitar sombras dinámicas; hornear AO/sombras en texturas. Sin postprocessing en v1. |

---

## e. Disposal

- **Three.js vanilla**: recorrer la escena y llamar `geometry.dispose()`, `material.dispose()` y `texture.dispose()` de cada mapa; luego `renderer.dispose()` y `renderer.forceContextLoss()` para liberar el contexto inmediatamente (sin esperar al GC), y retirar el `<canvas>` del DOM [Conocimiento].
- **R3F**: al desmontar un `<mesh>` con geometría/material declarados en JSX, R3F llama a `dispose()` automáticamente (salvo `dispose={null}`) [Conocimiento]. **No** dispone recursos creados manualmente (`new THREE.Texture`, `useMemo(() => new Geometry)`) ni los compartidos por la caché de `useLoader`/`useGLTF` (persisten hasta `useGLTF.clear(url)`). Al desmontar `<Canvas>` el renderer se dispone; forzar `gl.forceContextLoss()` en un `onUnmount` si el siguiente paso es abrir el overlay.
- **Texturas desde imagen**: usar `ImageBitmapLoader`/`createImageBitmap` y `bitmap.close()` tras subirla a GPU, como ya hace el scheduler con sus bitmaps (`frameScheduler.js`, `dispose()` cierra bitmaps — documentado en `TOBACCO_PROJECT_AUDIT.md` §7.8).
- **Verificación**: `renderer.info.memory` (`geometries`, `textures`) debe volver a 0 tras desmontar; incluir en el checklist de QA.

---

## f. Reduced motion

Cobertura actual [Confirmado]:

| Área | Estado | Ref |
|---|---|---|
| CSS | `@media (prefers-reduced-motion: reduce)` en 6 hojas | `site-editorial.css:311`, `tobacco-guide-page.css:112`, `ui-control-center.css:140`, `scroll.css:25`, `leaf-library.css:132`, `craft-your-cigar.css:74` |
| JS puntual | Guía (scroll instantáneo) e ImmersiveView (pausa autoplay) | `TobaccoGuidePage.jsx:63`, `ImmersiveView.jsx:22-28` |
| framer-motion | **Sin `MotionConfig reducedMotion="user"`** ni `useReducedMotion` en ningún sitio (7 archivos usan framer) | `grep MotionConfig` vacío |
| ScrollVideo / GSAP | **Sin ninguna rama**: `scrub`, `scrollTo` animado, shimmer, pulsos infinitos (`ScrollVideo.jsx:417-418`) | — |

Política para 3D [Propuesta]:
1. `prefers-reduced-motion: reduce` → **no montar WebGL**: mostrar póster estático (o un único frame renderizado). Interacciones que no son movimiento (cambiar color/capa con click) pueden mantenerse como intercambio de imagen.
2. GSAP nuevo siempre dentro de `gsap.matchMedia()` con condición `(prefers-reduced-motion: no-preference)`; `ctx.revert()` lo deshace al cambiar la preferencia en caliente.
3. Envolver la app en `<MotionConfig reducedMotion="user">` (deuda existente, pre-requisito barato).
4. Escuchar `change` del media query (patrón ya presente en `ImmersiveView.jsx:23-27`) para desmontar la escena sin recargar.

---

## g. Mobile

Estado [Confirmado]: el reproductor no tiene rama móvil (`TOBACCO_PROJECT_AUDIT.md` §7.7); solo existe `(hover: none)` en `anatomia-hoja.css:39` y el chequeo `(min-width: 801px) and (hover: hover)` en `ImmersiveView.jsx:59`. No se usan `deviceMemory`, `hardwareConcurrency` ni `saveData`.

Tiers [Propuesta]:

| Tier | Condición (orientativa) | Comportamiento 3D |
|---|---|---|
| **0 – Estático** | `prefers-reduced-motion` **o** `saveData` **o** `deviceMemory ≤ 2` **o** sin WebGL2 | Póster, sin descargar chunk 3D |
| **1 – Ligero** | `(hover: none)` / `(pointer: coarse)` **o** `deviceMemory ≤ 4` **o** `hardwareConcurrency ≤ 4` | CSS 3D / SVG; WebGL solo en un punto (CigarResult) con DPR 1, `frameloop="demand"`, texturas ≤1K |
| **2 – Completo** | Escritorio con hover, `deviceMemory ≥ 8` (o no informado + `hardwareConcurrency ≥ 8`) | WebGL con DPR ≤1.5, texturas ≤2K |

- `navigator.deviceMemory` no existe en Safari/Firefox [Conocimiento]: tratar `undefined` como "desconocido" y decidir por `hover`/`hardwareConcurrency`, nunca asumir alto.
- **iOS Safari**: límite de memoria por pestaña bajo y no documentado (del orden de cientos de MB en iPhone [Conocimiento/Estimación]); la pestaña se recarga sin aviso al excederlo. El reproductor ya usa ~224 MB solo en bitmaps (estimado): **nunca** solapar con WebGL. Además el resize por la barra de URL dispara `setSize` (`ScrollVideo.jsx:278-288`); en 3D usar `dvh` y debounce de resize.
- **Contexto perdido**: manejar `webglcontextlost` → mostrar póster.
- **Touch vs hover**: no depender de `:hover`/tilt para revelar información; en táctil usar tap/drag con `touch-action: pan-y` para no secuestrar el scroll vertical. OrbitControls con zoom deshabilitado en móvil.

---

## h. Theming (tokens `--ls-*` en runtime)

[Confirmado] `LayoutControlPanel` está siempre montado y aplica tokens como estilos inline en `<html>` vía `applyTokens` (`LayoutControlPanel.jsx:31`, `designTheme.js:93-99`); fuentes vía `setProperty('--ls-font-*')` (`LayoutControlPanel.jsx:37-38`). El estado de apariencia es `useState` local del panel (`:28`) — **no hay store ni evento** al que suscribirse. Tokens relevantes para 3D: `--ls-gold`, `--ls-bg`, `--ls-bg-card`, `--ls-text-primary`, `--ls-video-bg`, `--ls-btn-primary` (`designTheme.js:4-18`).

Patrón [Propuesta]:
```js
const readToken = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
// material.color.set(readToken('--ls-gold')); invalidate();
const mo = new MutationObserver(() => { /* releer tokens, actualizar materiales, invalidate() */ });
mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
```
- Los valores son hex validados (`designTheme.js:95` `isHex`), parseables por `THREE.Color`. Gestionar espacio de color: `Color.set()` asume sRGB y convierte a lineal cuando `ColorManagement` está activo [Conocimiento].
- Solo colores de acento/fondo; la textura del tabaco (albedo) no debe teñirse con el token.
- Alternativa más limpia (cambio futuro): mover `appearance` a un store zustand o emitir `CustomEvent('ls-theme-change')` en `applyTokens`.
- Canvas con `alpha:true` y fondo transparente para heredar `--ls-bg` del DOM sin releerlo.

---

## i. Comparativa de tecnologías

Tamaños **[Estimación]** (min+gzip aproximado, conocimiento general y skills; verificar con build real).

| Tecnología | Peso aprox. | Encaje con stack | Móvil | A11y | Mantenimiento | Uso recomendado en TOBACCO |
|---|---|---|---|---|---|---|
| **CSS 3D transforms** | 0 KB | Total (CSS ya tematizado) | Excelente | Fácil (DOM real) | Mínimo | Tarjetas de hojas (flip/tilt), capas del cigarro en CigarResult, grid de selección |
| **SVG + framer-motion** | 0 KB extra (framer ya en bundle) | Total | Excelente | Buena (texto/ARIA) | Bajo | Corte transversal de la guía, indicadores sincronizados a `activeStep` en el overlay |
| **Canvas 2D** | 0 KB | Ya usado en frames | Buena | Decorativo (aria-hidden) | Medio | Partículas/humo sutil fuera del overlay |
| **Zdog** | ~10 KB gz (skill: ~28 KB min) | Vanilla, envolver en ref | Buena | Decorativo | Bajo; proyecto poco activo [Conocimiento] | Ilustración pseudo-3D plana de un cigarro (estilo flat). Poco alineado con estética fotográfica |
| **Vanilla-Tilt** | ~3 KB gz (skill: ~8,5 KB min) | Vanilla con cleanup `.destroy()` | Inútil sin hover (giroscopio requiere permiso en iOS) | Respetar reduced-motion manualmente | Bajo | Sustituible por ~30 líneas de CSS/JS propio; no justifica dependencia |
| **Vanta.js** | Vanta ~10–20 KB + **three completo** (~150 KB gz) | Envuelve three; difícil de tematizar finamente | Costoso (shader a pantalla completa continuo) | Decorativo | Bajo mantenimiento upstream [Conocimiento] | **No recomendado**: coste de three para un fondo genérico |
| **Three.js vanilla** | ~150–170 KB gz (tree-shaking limitado) | Imperativo dentro de `useEffect` | Aceptable con tiers | Decorativo + alternativa textual | Medio-alto | Solo si se evita R3F por peso; no aporta frente a R3F en un proyecto React |
| **React Three Fiber (+drei)** | three + ~40–50 KB R3F + drei tree-shakeable (~10–60 KB según helpers) | Alto: componentes, Suspense, zustand. **R3F v9 es la línea para React 19** (v8 = React 18); drei v10 acompaña a R3F v9 [Conocimiento] | Aceptable con tiers y `demand` | Decorativo; drei `<Html>` para etiquetas accesibles | Medio | **Opción WebGL preferente**: CigarResult (modelo de capas), guía (corte 3D), Home CTA (teaser) |
| **Spline** | Runtime ~500 KB+ gz + escena | Bajo (caja negra, `@splinetool/react-spline`) | Pobre | Pobre | Dependencia de herramienta externa | **No recomendado** (coincide con `TOBACCO_PROJECT_AUDIT.md` §14) |

---

## j. Presupuestos de rendimiento [Propuesta]

| Métrica | Presupuesto |
|---|---|
| Bundle inicial | **No crece** por 3D (0 KB en el chunk de entrada) |
| Chunk `vendor-3d` (three + R3F + drei) | ≤ 220 KB gz, cargado bajo demanda |
| Chunk por escena (código + materiales) | ≤ 30 KB gz |
| Modelo (glTF/GLB + Draco/Meshopt) | ≤ 500 KB por escena; ≤ 1,5 MB total por ruta |
| Triángulos | ≤ 50k escritorio, ≤ 20k móvil por escena |
| Draw calls | ≤ 50 |
| Texturas | ≤ 2048² escritorio, ≤ 1024² móvil; **KTX2 (Basis/UASTC)** para color/normal en GPU; WebP como fallback/póster. Máx. 4 texturas por material |
| Memoria GPU estimada | ≤ 64 MB escritorio, ≤ 32 MB móvil (texturas KTX2 descomprimen en GPU a formatos comprimidos; WebP se expande a RGBA: 2048² ≈ 16 MB + mipmaps) |
| FPS objetivo | 60 escritorio, ≥ 30 móvil sostenido; si < 30 durante 2 s → bajar tier/póster |
| LCP | Póster como LCP; el canvas aparece después (no bloquear LCP con WebGL) |
| Main thread | Sin long tasks > 50 ms al montar escena (parsear GLB en worker: Draco/Meshopt decoders) |
| Teardown | `renderer.info.memory.textures/geometries` = 0 tras desmontar |

Requiere **baseline previo** (Lighthouse + traza) antes de cualquier 3D, tras eliminar scripts heredados.

---

## k. Veredicto por ubicación

| Ubicación | Veredicto | Tecnología | Notas técnicas |
|---|---|---|---|
| **Home hero** | **Viable con reservas** — no prioritario | Póster + (opcional) R3F tier 2 | Es el LCP (`Home.jsx:21-22`); el 3D nunca debe sustituir a la imagen como LCP. Prerenderizado SEO: el 3D debe ser decorativo. Mejor parallax CSS. |
| **Home CTA** | **Viable** | R3F `frameloop="demand"` lazy + IO, o clip de vídeo corto | Buen sitio para precargar el chunk que luego usará CigarResult. Debe ir fuera de Navbar/Footer (que no se desmontan). |
| **Leaf Library tarjetas** | **Viable solo sin WebGL** | CSS 3D / tilt propio | N tarjetas → N contextos inviable. Respetar `hover:none`. |
| **Leaf Library overlay (ImmersiveView)** | **Viable con reservas** | CSS 3D sobre imágenes existentes; WebGL solo con un único canvas | Ya tiene autoplay, gestos de rueda/touch y reduced-motion (`ImmersiveView.jsx:22-60`); un canvas 3D competiría con esos gestos. Usa body lock (`LeafLibrary.jsx:50`). |
| **CraftYourCigar grid de selección** | **Viable solo sin WebGL** | CSS 3D / framer | Mismo problema de multiplicidad; además se desmonta al abrir overlay. |
| **CigarResult** | **Mejor candidato WebGL** | R3F lazy, un canvas, capas tripa/capote/capa tematizadas | Se desmonta automáticamente al abrir el overlay (`CraftYourCigar.jsx:217`, `LeafGrid.jsx:65`). Forzar `forceContextLoss` en unmount. Tier 1 con DPR 1. |
| **TobaccoGuidePage corte transversal** | **Viable**; preferente SVG, WebGL opcional | SVG+framer (v1), R3F (v2) | Es modal con scroller propio (`.tg-scroll`, `TobaccoGuidePage.jsx:85`): triggers deben usar `scroller: scrollRef.current`. No se desmonta con `showVideo` (`CraftYourCigar.jsx:247`). Tiene reduced-motion CSS (`tobacco-guide-page.css:112`). |
| **Overlay de frames (`#video-root`)** | **No WebGL** | DOM/SVG ligero sincronizado a `activeStep` (`ScrollVideo.jsx:337-342`) | Decode y GPU ya saturados (§b). Solo textos/etiquetas por paso, sin `backdrop-filter` adicional. |

---

## l. Checklist "antes de implementar"

1. [ ] **Eliminar scripts/CSS heredados** de `index.html:23-40` (jQuery, Bootstrap JS, Owl, Tempus, moment, waypoints, easing, `main.js`; revisar dependencia de `.btn` de Bootstrap en `presentation-theme.css:24-39`).
2. [ ] **Code-splitting de rutas** (`React.lazy` en `App.jsx:18-25`) y verificar que GSAP sale del chunk inicial.
3. [ ] **Baseline de rendimiento** (Lighthouse móvil/escritorio, LCP, TBT, tamaño de chunks, memoria) con build actual.
4. [ ] **`<MotionConfig reducedMotion="user">`** global y rama reduced-motion en ScrollVideo.
5. [ ] **Refresh de ScrollTrigger al liberar `useBodyScrollLock`** (o evento de lock) antes de añadir triggers de página.
6. [ ] Exponer `showVideo` (o un evento "overlay abierto") para que cualquier 3D montado fuera de la página se desmonte.
7. [ ] Helper `getDeviceTier()` (reduced-motion, saveData, deviceMemory, hardwareConcurrency, hover, WebGL2) con tests `node --test`.
8. [ ] Mecanismo de tema observable (MutationObserver o `CustomEvent` en `applyTokens`).
9. [ ] Definir `manualChunks` para `vendor-3d` y añadir análisis de bundle al flujo de build.
10. [ ] Pipeline de assets: glTF → Draco/Meshopt + texturas KTX2, póster WebP por escena.
11. [ ] Prototipo aislado (una escena en CigarResult) medido en iPhone real + Android medio antes de extender.
12. [ ] QA de teardown: abrir/cerrar overlay 10 veces con 3D previo; `renderer.info.memory` a 0 y sin `webglcontextlost` inesperados.

---

## Conclusión técnica

- **El 3D es viable fuera del overlay y prohibido dentro**: `#video-root` ya satura decodificación y GPU (decode ~143 ms vs 33 ms de presupuesto); allí solo DOM/SVG ligado a `activeStep`.
- **El aislamiento ya existe a medias**: el contenido de Craft se desmonta con el overlay (`CraftYourCigar.jsx:217`), pero Navbar/Footer/guía/paneles no; ningún 3D debe vivir en componentes globales.
- **GSAP para páginas requiere disciplina**: `gsap.context()` + `matchMedia`, refs en vez de selectores, y un `refresh` tras liberar el body lock; el `refresh()` global de ScrollVideo y el `position:fixed` del lock pueden corromper triggers de `window`.
- **Pre-requisitos antes de pagar ~200 KB gz de three/R3F**: quitar scripts heredados, code-splitting de rutas (hoy 1 chunk de ~288 KB gz) y medir baseline.
- **Stack recomendado**: CSS 3D/SVG+framer para la mayoría de ubicaciones; **R3F v9 + drei** (compatible con React 19 [Conocimiento]) solo para 1–2 escenas lazy (CigarResult primero, corte de la guía después); descartar Spline y Vanta.
- **Un contexto WebGL por vista**, `frameloop="demand"`, DPR ≤1.5 (1 en móvil), `powerPreference:'low-power'`, `forceContextLoss` al desmontar.
- **Tiers + póster estático** como fallback universal (reduced-motion, saveData, baja memoria, iOS), y tokens `--ls-*` leídos con `getComputedStyle` + observador para el theming en caliente.
