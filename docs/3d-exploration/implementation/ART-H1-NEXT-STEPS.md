# ART-H1 orgánica · Handoff de implementación

> Estado: **aprobado visualmente, sin implementar**. Documento para que Codex continúe en otra sesión.
> Rama de trabajo: `3d-ux-exploration`. No se ha instalado nada ni tocado código.

---

## 1. Objetivo visual e interacción

- **Qué**: una hoja de tabaco curada, realista, flotando en la columna derecha de `section#recorrido` (Home), debajo del enlace «VER EL RECORRIDO».
- **Aspecto**: lámina larga y estrecha; nervio central marcado, nervaduras finas ramificadas, superficie fibrosa y arrugada, bordes irregulares y algo rasgados. Mate, seco, vegetal. Sin brillo metálico, sin rojo metal, sin bronce, sin humo, sin partículas.
- **Paleta**: ocre miel, colorado `#9C6A48`, marrón tabaco `#8A5A3B`, envés `#5E3F28`. Luz cálida rasante desde la izquierda (~3200 K), contraluz ámbar muy sutil en los bordes finos. Fondo de la página: negro cálido `#0F0E0C`.
- **Silueta (izquierda → derecha)**: extremo izquierdo extendido y ondulante; torsión en el centro; a la derecha se enrolla en ~5 vueltas irregulares y abiertas, con huecos. Extremos abiertos. **Nunca** un cigarro literal ni un muelle uniforme.
- **Interacción**:
  - Scroll hacia abajo: la hoja pasa de **plana → enrollada** de forma progresiva.
  - Scroll hacia arriba: se desenrolla exactamente igual (**reversible**, ligado al scrub).
  - Reposo: flotación muy suave (±4 px, ~7 s) y ondulación leve del extremo plano. Se para fuera del viewport.
  - Opcional: el cursor desplaza la luz (±15°), no el objeto.
- **Restricciones de layout**: elemento decorativo `aria-hidden`, posición absoluta, `z-index: 0`, ~420×240 px en desktop. **No altera la altura de la sección** ni mueve textos o UI.

## 2. Referencias aprobadas

Carpeta: `docs/3d-exploration/refs/art/`

| Uso | Archivo | Tamaño |
|---|---|---|
| **Objeto aprobado (fuente de verdad)** | `ART-H1-organic-object.png` | 1916×821 |
| Prompt del objeto | `ART-H1-organic-object.prompt.txt` | — |
| **Integración aprobada en página** | `ART-H1-organic-page-mockup.png` | 1505×1045 |
| Prompt de la maqueta | `ART-H1-organic-page-mockup.prompt.txt` | — |
| Composición original (solo encuadre/caja) | `ART-H1-page-mockup.png` | — |
| Índice comparativo | `README.md` | — |

Descartado como estilo: `ART-H1-object.png` (cinta satinada pátina/bronce/clarete). Solo sirve para ver el bounding box y el centro visual.

Documentos de contexto:
- `docs/3d-exploration/04_ARTISTIC_3D_EXPLORATION.md` § «AR-H1 · Cinta del cultivo» (ubicación, ScrollTrigger, coste, móvil, reduced motion).
- `docs/3d-exploration/04-parts/E_HOME_ABOUT.md` (ficha completa de 16 campos).
- `docs/3d-exploration/03_TECHNICAL_FEASIBILITY.md` y `04-parts/G_COLOR_TECH.md` (tecnología y tokens de color).
- `docs/3d-exploration/CODEX_GENERATION_PROGRESS.md` (historial de imágenes).
- Captura base: `design-review/desktop/inicio-recorrido.png`.

> Nota: las imágenes son concept art, no assets de producción. Ver § 4 «Assets» para lo que hay que generar.

## 3. Archivos a tocar

| Archivo | Cambio |
|---|---|
| `src/pages/Home.jsx` (línea ~36-39, `section#recorrido`) | Montar `<LeafRibbon />` dentro de la **segunda columna** (el `<div>` con `.site-lead` y `.site-text-link`), detrás del contenido. |
| `src/components/home/LeafRibbon.jsx` (**nuevo**) | Componente contenedor: detección de capacidades, fallback, ScrollTrigger, lazy-load del renderer. |
| `src/components/home/leafRibbonRenderer.js` (**nuevo**, solo si se aprueba WebGL) | Escena WebGL, geometría y shader de enrollado. Import dinámico. |
| `src/styles/leaf-ribbon.css` (**nuevo**) | Posicionamiento absoluto, tamaños responsive, fallback, reduced motion. |
| `src/styles/site-editorial.css` (línea 88-90) | Solo `position: relative` en `.site-intro-grid > div:last-child` si hace falta anclar. No cambiar grid ni espaciados. |
| `public/img/art/leaf-ribbon/` (**nuevo**) | Texturas y posters (WebP/AVIF). |
| `tests/leaf-ribbon.spec.js` (**nuevo**) | Validación Playwright (§ 9). |

No tocar: `App.jsx`, rutas, i18n (no hay texto nuevo), `ScrollVideo.jsx`.

Referencia de patrón GSAP existente: `src/components/ScrollVideo.jsx` (registro de `ScrollTrigger`, `ScrollTrigger.refresh()` tras cambios de layout).

## 4. Arquitectura y tecnología recomendada

### Por qué no SVG puro
La propuesta original (cinta satinada) era SVG + morph de path. La dirección **orgánica realista** necesita textura fotográfica (nervaduras, fibras, bordes rotos) **deformada a lo largo de una curva**. SVG no puede deformar una imagen sobre un path; el resultado sería plano o vectorial.

### Recomendación: WebGL ligero con textura + fallback raster

**Opción A (recomendada)** — `three` vanilla (sin R3F), cargado con `import()` dinámico solo cuando la sección se acerca al viewport.
- Geometría: `PlaneGeometry` estrecha y larga (p. ej. 1 × 0.16, segmentos 240 × 12).
- Vertex shader con uniform `uRoll` (0..1): para cada vértice, según su coordenada `x` a lo largo de la hoja, aplica enrollado en espiral (radio decreciente tipo Arquímedes) desde el extremo derecho; `uTwist` para la torsión central; ruido de bajo coste para irregularidad (vueltas imperfectas, huecos variables).
- Material: `MeshStandardMaterial` con `map` (albedo), `alphaMap` (silueta y bordes rotos), `normalMap` (nervaduras/arrugas), `roughness` ~0.85, `metalness` 0. `side: DoubleSide`; envés oscurecido vía `onBeforeCompile` o segundo mapa.
- Luz: una direccional cálida desde la izquierda + ambient tenue fría. Sin sombras dinámicas (una sombra suave falsa como sprite o CSS `filter: drop-shadow` en el canvas).
- Coste: ~3k triángulos, 1 draw call, texturas ≤ 2048×512.
- Dependencia nueva: `three` (**pendiente de aprobación**, ver § 10). Bundle aparte por el import dinámico.

**Opción B (sin dependencias)** — secuencia de frames pre-renderizada (Blender u otra herramienta) del enrollado, reproducida por scroll en `<canvas>` reutilizando el enfoque de `ScrollVideo`. Máximo realismo, cero shaders, pero exige producir 60-90 frames con canal alfa y pesa más.

**Opción C (fallback universal, obligatorio en ambas)** — imagen estática WebP/AVIF a medio enrollar (móvil, reduced motion, sin WebGL, error de carga).

### Assets a producir (antes de codificar el shader)
1. `leaf-albedo.webp`: hoja **plana, vista cenital**, recortada, con la textura del objeto aprobado (generar con imagegen tomando `ART-H1-organic-object.png` como referencia de material).
2. `leaf-alpha.webp`: máscara de silueta con bordes irregulares.
3. `leaf-normal.webp`: normal map derivado del albedo (nervio central + nervaduras).
4. `leaf-poster-mid.webp` / `.avif`: estado medio enrollado para fallback (puede recortarse del objeto aprobado).
5. `leaf-poster-rolled.webp`: estado final para reduced motion.

### Estructura del componente

```jsx
// LeafRibbon.jsx (esqueleto orientativo)
export default function LeafRibbon() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('poster'); // 'poster' | 'webgl'

  // 1. Decidir modo: reduced motion, ancho, soporte WebGL, saveData.
  // 2. IntersectionObserver (rootMargin ~300px) => import('./leafRibbonRenderer')
  // 3. useGSAP / useLayoutEffect con gsap.context() para ScrollTrigger
  // 4. Cleanup: ctx.revert(), renderer.dispose(), texturas, geometría.

  return (
    <div ref={rootRef} className="leaf-ribbon" aria-hidden="true">
      <img className="leaf-ribbon__poster" src="/img/art/leaf-ribbon/leaf-poster-mid.webp" alt="" />
      {mode === 'webgl' && <canvas ref={canvasRef} className="leaf-ribbon__canvas" />}
    </div>
  );
}
```

El renderer expone una API mínima: `init(canvas)`, `setProgress(p)`, `setIdle(bool)`, `resize()`, `dispose()`. El componente React no conoce three.

## 5. GSAP y ScrollTrigger

- `gsap` ^3.13 ya instalado; `ScrollTrigger` disponible en `gsap/ScrollTrigger`. No instalar `@gsap/react` salvo aprobación; usar `useLayoutEffect` + `gsap.context()`.
- Config base (de la propuesta AR-H1):

```js
const state = { roll: 0 };
const ctx = gsap.context(() => {
  gsap.to(state, {
    roll: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#recorrido',
      start: 'top 70%',
      end: 'bottom 40%',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
    onUpdate: () => renderer.setProgress(state.roll),
  });
}, rootRef);
```

- **Sin pin**. No cambia la altura ni el flujo de la página.
- Idle (flotación) en un `gsap.to` independiente con `yoyo`/`repeat:-1` sobre el contenedor (`y: ±4`), pausado con `ScrollTrigger` `onToggle` cuando no está visible.
- Llamar `ScrollTrigger.refresh()` tras cargar el poster/canvas (cambio de layout) y en cambio de idioma si cambian alturas de texto.
- Render loop: `gsap.ticker.add(render)` solo mientras visible y con cambios pendientes (dirty flag); quitar en `onLeave`.

## 6. Animación reversible

- El estado visual es **función pura de `progress`** (0 = plana, 1 = enrollada). Nada acumulativo.
- `scrub` garantiza reversibilidad: subir el scroll desenrolla.
- Mapeo sugerido dentro del shader/renderer:
  - `0.00–0.25`: ondulación del extremo izquierdo se calma; ligera elevación.
  - `0.25–0.55`: torsión central (`uTwist` 0→~35°).
  - `0.55–1.00`: enrollado del extremo derecho hasta ~5 vueltas abiertas e irregulares.
- Las irregularidades (ruido, huecos) usan semillas fijas: mismo `progress` = mismo frame, ida y vuelta.
- Probar saltos bruscos (anclas `#recorrido-pasos`, recarga a mitad de página): el estado debe recalcularse desde `self.progress`, no animar desde 0.

## 7. Responsive, accesibilidad, rendimiento

**Responsive**
- ≥ 1081 px: WebGL, ~420×240 px, columna derecha bajo el enlace.
- 861–1080 px: WebGL reducido (~340×200) si cabe; si no, poster.
- ≤ 860 px (la grid pasa a 1 columna, `site-editorial.css:251`): **poster estático a medio enrollar**, ancho 100 % de la columna con `max-width` ~360 px, sin ScrollTrigger.
- Usar `gsap.matchMedia()` para crear/destruir triggers por breakpoint.

**Accesibilidad**
- `aria-hidden="true"`, `alt=""`, sin foco, `pointer-events: none`.
- `prefers-reduced-motion: reduce` → poster final enrollado, sin scrub ni idle (existe bloque en `site-editorial.css:311`, seguir el mismo patrón).
- Contraste de textos intacto: el objeto queda detrás (`z-index: 0`) y no se superpone a `.site-lead` ni al enlace.

**Rendimiento**
- Lazy: no descargar `three` ni texturas hasta `IntersectionObserver`.
- DPR máximo 2 (coherente con `animationPerformance.js`).
- Pausar render fuera del viewport y con `document.hidden`.
- Texturas WebP ≤ ~250 KB en total; normal map a menor resolución.
- `navigator.connection?.saveData` → poster.
- Fallo de contexto WebGL (`webglcontextlost`) → volver a poster.
- Objetivo: sin long tasks > 50 ms en scroll; CLS = 0.

## 8. Pasos para Codex

1. Leer este documento, `refs/art/README.md`, ambos `ART-H1-organic-*.png` y la ficha AR-H1 en `04_ARTISTIC_3D_EXPLORATION.md`.
2. **Confirmar con el usuario** la decisión pendiente de § 10 (Opción A con `three` vs B). No instalar nada sin aprobación.
3. Generar assets (§ 4) en `public/img/art/leaf-ribbon/`. Guardar prompts junto a ellos (`*.prompt.txt`), igual que en `refs/art/`.
4. Crear `leaf-ribbon.css` y `LeafRibbon.jsx` **solo con el poster**. Montar en `Home.jsx`. Verificar que la sección no cambia de altura (comparar con `design-review/desktop/inicio-recorrido.png`).
5. Añadir ScrollTrigger y prueba de progreso con un placeholder (p. ej. `data-progress` en el contenedor) para validar el scrub antes del WebGL.
6. Implementar `leafRibbonRenderer.js`: plano + textura, luego shader de enrollado, luego torsión, luego irregularidad.
7. Ajustar visualmente contra `ART-H1-organic-page-mockup.png` (encuadre, tamaño, tono). Sin brillo metálico.
8. Añadir `matchMedia`, reduced motion, saveData, pausa fuera de viewport, dispose.
9. Escribir `tests/leaf-ribbon.spec.js` (§ 9). Ejecutar `npm run lint`, `npm test`, `npm run test:e2e`.
10. Commit en la rama actual con Conventional Commits (`feat(home): add organic leaf ribbon to journey section`), **sin** `Co-Authored-By`, sin push.

### Skills a usar (si están disponibles en el entorno de Codex)
- **gsap-scrolltrigger**: patrones de `scrub`, `matchMedia`, `gsap.context` y limpieza en React. Consultarla antes del paso 5.
- **lightweight-3d-effects**: solo como referencia para alternativas ligeras (no usar Zdog/Vanta: no dan realismo de textura). Útil para la idea de pausa/visibilidad y fallbacks.
- **imagegen** (integrada): generación de albedo/alpha/poster en el paso 3, usando las imágenes aprobadas como referencia.
- **Playwright** (MCP o CLI ya instalado `@playwright/test`): capturas y validación del paso 9.
- Si una skill no existe o no es compatible, seguir este documento directamente.

## 9. Validación con Playwright

Config existente: `playwright.config.js` (build + preview en `127.0.0.1:4173`, chromium). Crear `tests/leaf-ribbon.spec.js`:

1. **Presencia**: en `/`, `#recorrido .leaf-ribbon` existe, tiene `aria-hidden="true"` y no es focusable.
2. **Layout estable**: altura de `#recorrido` igual con y sin el componente (tolerancia ±2 px); los textos `.site-lead` y `.site-text-link` no se solapan con el bounding box del objeto.
3. **Scrub reversible**: hacer scroll a `start`, mitad y `end`; leer `data-progress` (exponerlo en el contenedor) ≈ 0, ≈ 0.5, ≈ 1. Volver arriba: vuelve a ≈ 0.
4. **Capturas**: screenshots en progreso 0 / 0.5 / 1 (desktop 1440×900) para revisión visual contra la maqueta aprobada. Guardar en `test-results/` (no comparar píxel a píxel con el concept art).
5. **Móvil** (390×844): se muestra poster, no hay `<canvas>`, sin scroll horizontal.
6. **Reduced motion**: `page.emulateMedia({ reducedMotion: 'reduce' })` → poster final, sin canvas, `data-progress` fijo.
7. **Lazy load**: antes de llegar a la sección, no se ha pedido ningún chunk de `three` ni texturas (`page.on('request')`).
8. **Consola limpia**: sin errores ni warnings de WebGL.
9. **i18n**: repetir presencia/layout en `/en`, `/fr`, `/zh` (textos de distinta longitud).

## 10. Riesgos y decisiones pendientes

**Decisiones pendientes (usuario)**
- [ ] **Tecnología**: Opción A (`three` vanilla + shader, nueva dependencia) vs Opción B (secuencia de frames pre-renderizada, sin dependencia pero con producción 3D externa). Recomendación: **A**.
- [ ] ¿Se permite `@gsap/react` (`useGSAP`) o se mantiene `useLayoutEffect` + `gsap.context`? Recomendación: mantener sin dependencia.
- [ ] ¿Interacción de luz con el cursor sí/no? Recomendación: dejarlo para una v2.
- [ ] ¿Tablet (861–1080) con WebGL o poster?

**Riesgos**
- **Realismo del shader**: un plano texturizado enrollado puede verse «papel» o «cinta» si el normal map y el envés no están cuidados. Mitigar con assets buenos y luz rasante.
- **Calidad de assets**: el concept art no es una textura plana; hay que generar una hoja cenital coherente. Puede requerir varias iteraciones.
- **Lectura como cigarro literal**: mantener vueltas abiertas e irregulares y extremos sin tapa.
- **Peso**: `three` añade ~150 KB gz en chunk aparte; justificar con lazy load y medir con `npm run build`.
- **Conflicto con otros triggers**: `ScrollVideo` registra ScrollTrigger en otras páginas; asegurar `ctx.revert()` al desmontar para no dejar triggers huérfanos en navegación SPA.
- **Cambios de layout por idioma o fuentes**: requerir `ScrollTrigger.refresh()` tras `document.fonts.ready`.
- **Bordes alfa**: halos en el recorte sobre fondo `#0F0E0C`; usar alpha premultiplicado o `alphaTest` con mapa limpio.
