# Optimización de ScrollVideo (secuencias de frames)

Contexto completo del trabajo sobre la animación por scroll de `CraftYourCigar`. Este documento es la fuente de contexto para retomar el trabajo: qué problema había, qué se decidió, cómo funciona hoy y qué falta.

Estado: **fase 1 implementada** (canvas + GSAP + secuencias de imágenes). Validada con simulaciones en Node; **pendiente de prueba en navegadores y dispositivos reales**, sobre todo Safari/iOS.

---

## A. Problema original

La página `CraftYourCigar` muestra una animación estilo Apple: al hacer scroll dentro de un overlay (`#video-root`), GSAP ScrollTrigger avanza un índice de frame y un `<canvas>` dibuja la imagen correspondiente.

Los assets eran secuencias de imágenes extraídas de videos MP4 4K a 60 fps:

- WebP **4K (3840×2160) sin pérdida**, generados con `scripts/convert-video.sh`.
- **1485–1501 frames** por animación (1485, 1486 o 1501 según el video).
- **~1.4–1.7 MB por frame**, entre **~2.1 y 2.5 GB** por carpeta de video. Son 20 animaciones.

La implementación inicial de `ScrollVideo.jsx`:

- Descargaba los **primeros 300 frames en serie** (`await` uno por uno) antes de mostrar nada: minutos de espera en la primera visita.
- Después lanzaba **todos los demás (~1185) a la vez**, sin límite de concurrencia ni prioridad.
- Guardaba **todas** las imágenes en `imagesRef.current[]` para siempre (~2.4 GB comprimidos en RAM y decodificación 4K en el hilo principal al dibujar).
- Tenía una caché en IndexedDB, pero sin límite de tamaño ni LRU real, con un `openDB()` por cada lectura y escritura, y sin deduplicar pedidos.
- No usaba `AbortController`, ignoraba `devicePixelRatio`, el autoplay iba a 120 fps (el doble de la velocidad real) y hacía un `setState` de React por cada frame.
- Si un frame no estaba listo, el canvas quedaba congelado en el último.

## B. Estructura del CDN

Base: `https://cdn.mbsoft.freeddns.org/`

Carpetas originales (60 fps), una por video, en snake_case:

```text
2t_colorado/  2t_colorado_claro/  2t_colorado_maduro/  2t_maduro/  2t_oscuro/
3t_... 4t_... 5t_...  (20 carpetas en total)
```

Carpetas optimizadas (30 fps), **generadas fuera del repo, en el servidor**:

```text
2t_colorado_30fps/ ... 5t_oscuro_30fps/
```

Cada carpeta `_30fps` contiene **uno de cada dos frames del original, empezando por el primero, renumerados de forma consecutiva** (`frame_0001.webp`, `frame_0002.webp`, …). Siguen siendo WebP 4K; solo cambia la cantidad:

```text
1485 → 743
1486 → 743
1501 → 751
```

Los archivos se llaman `frame_NNNN.webp` (4 dígitos, 1-based), como espera `padStart(4, "0")`.

## C. Perfiles de frames

`src/lib/frameProfile.js` → `getFrameProfile(videoInfo, mode)` es el **único** lugar que conoce el sufijo `_30fps` y la relación 2:1.

| Modo | Carpeta | FPS | Frames |
|---|---|---|---|
| `optimized` (por defecto) | `${name}_30fps` | 30 | `ceil(length / 2)` |
| `original` (solo depuración) | `${name}` | 60 | `length` |

`videoInfo.length` en `listVideos` (`CraftYourCigar.jsx`) es siempre la cantidad **original**. Todo lo demás (tween GSAP, pasos, autoplay, `goToStep`, estadísticas, selector de videos) usa `profile.frameCount` y `profile.fps`. El perfil expone además `frameUrl(n)` y `cacheKey(n)` (`${folder}:frame:NNNN`). Para agregar resoluciones en el futuro basta con sumar entradas a `SOURCE_PROFILES`.

El usuario nunca ve ni elige FPS.

## D. Arquitectura actual

```text
GSAP ScrollTrigger (onUpdate)
  → frame pedido (entero) + dirección
  → scheduler.setTarget(index, dir)        reprioriza la cola (no toca descargas en curso)
  → scheduler.getDrawable(index)           exacto o decodificado más cercano
  → drawContain(canvas)                    backing store con DPR

Scheduler, para cada frame:
  memoria decodificada (ImageBitmap)
    → blob en memoria
      → IndexedDB                (carril propio, cacheReadConcurrency)
        → descarga en curso      (compartida, deduplicada)
          → CDN                  (carril de red, concurrency)
```

Piezas:

- **Concurrencia de red acotada** (`concurrency`) y **carril separado para leer IndexedDB** (`cacheReadConcurrency`): un frame ya guardado nunca espera detrás de descargas lentas del CDN.
- **Decodificación acotada y separada** (`decodeConcurrency`): decodificar no ocupa slots de red.
- **Tres prioridades de descarga**: `critical` (pedido ±2), `prefetch` (ventana cercana), `background` (resto de la secuencia).
- **Prefetch direccional**: más frames en la dirección del scroll (`prefetchAhead`) que en la contraria (`prefetchBehind`).
- **Precarga en segundo plano** progresiva, también con el usuario quieto.
- **Render con respaldo**: si el frame pedido no está, se dibuja el decodificado más cercano; si no hay ninguno, el canvas conserva lo último dibujado.
- **Deduplicación**: una sola descarga por frame (también entre montajes), y una sola decodificación por frame a la vez.
- **Reintentos**: `retryCount` con backoff exponencial para errores de red, 5xx, 408 y 429. 404/403 no se reintentan. Un frame que falla queda en espera `failedFrameCooldownMs` y no bloquea a los demás.
- **Sin cancelaciones por scroll**: una descarga que empezó siempre termina y se guarda. Solo se aborta en `dispose()`.

## E. Comportamiento del scheduler (`src/lib/frameScheduler.js`)

**Estado que se sigue por separado**

- `requestedFrame`: el que pide GSAP.
- `lastRenderedFrame`: el que está dibujado de verdad (bajo presión de red pueden diferir).
- `lastDirection`: dirección del scroll.
- `lastStableTarget`: dónde se detuvo el usuario la última vez.
- `focus`: destino de un salto.
- `velocity`: frames/s, media móvil.
- Tasa de entrega medida en los últimos 3 s.

**Estados de un frame** (`frameState(index)`): `idle`, `queued`, `downloading`, `cached` (en memoria o IndexedDB), `decoding`, `decoded`, `failed`.

**Arranque (sin necesidad de scroll)**

1. Al montar, `setRenderSize` dispara `refresh()`: la carga empieza sola, sin esperar a ScrollTrigger.
2. Mientras no hay ningún frame en pantalla, el frame 1 se descarga **solo** (concurrencia de red 1) para no compartir ancho de banda. En la simulación aparece a ~0.3 s en vez de ~1.2 s.
3. El overlay original ("PREPARANDO MEZCLA": nombre del video, humo, barra y "CALIDAD: PREMIUM") aparece de inmediato mientras el scheduler ya descarga detrás. El canvas dibuja el frame 1 apenas se decodifica.
   - El overlay se oculta con su fade de 1.5 s cuando el frame 1 está dibujable y hay `loaderBufferFrames` (8) frames consecutivos disponibles.
   - Tiene un mínimo visible de `loaderMinDisplayMs` (500 ms, para que no parpadee si todo viene de caché) y un tope de `loaderMaxWaitMs` (8 s): si un frame falla, el overlay nunca queda trabado.
   - La barra refleja cuántos de esos 8 frames están listos. No se espera el buffer de 30 frames.
4. Sigue el buffer consecutivo 2, 3, 4, … Los slots reservados para background no se ceden mientras quede demanda a ≤ 30 frames (`NEAR_BUFFER`).
5. Con el buffer cercano completo, la precarga en segundo plano continúa con 41, 42, … y recorre toda la secuencia.

**Scroll**

- **Quieto** (sin cambios por `stationaryDelayMs`) o **en salto**: prioridad al frame exacto y sus vecinos (N, N+1, N-1, N+2, …). El exacto reemplaza al de respaldo apenas llega.
- **En movimiento**:
  - Los `max(8, decodedFrameLimit)` frames siguientes se cargan siempre **consecutivos** (zona densa).
  - Más adelante se apunta al punto donde estará el usuario cuando termine la descarga (`lead` = velocidad × latencia, máximo `prefetchAhead`).
  - Si el scroll va más rápido que la red, solo en esa zona lejana se piden frames salteados (`stride`, hasta 1 de cada 8). Los huecos se rellenan después.
- Los frames entre lo dibujado y lo pedido siguen siendo útiles: se decodifican porque hacen avanzar la imagen.
- **Saltos** (`FloatingSteps` → `goToStep`):
  - `setFocus(destino)` pone el destino y su vecindario como máxima prioridad, sin exigir los frames intermedios. Se limpia al terminar o interrumpir el tween.
  - Las descargas en curso de la zona anterior terminan y quedan en caché.
- **Idle**: si el usuario está quieto y el buffer cercano está listo, `backgroundSlots` descargas quedan garantizadas para background. Si no hay demanda cercana, background usa todos los slots.

**Render (`getDrawable`)**

- Búsqueda binaria sobre la lista ordenada de frames decodificados, **sin radio máximo**. En empate gana el de la dirección del scroll.
- Ejemplo: pedido 300 con 295, 297, 301 y 304 disponibles dibuja el 301.
- `ScrollVideo` solo redibuja si cambia el frame elegido, y registra cada dibujo con `noteRendered` (exacto o de respaldo).

## F. Cachés

### Persistente: IndexedDB (`src/lib/frameCache.js`)

- Base `scroll-video-cache`, **versión 2**. Al actualizar desde v1 se borra la caché vieja: es descartable.
- Dos stores:
  - `frames`: `{ key, blob }`.
  - `frameMeta`: `{ key, videoName, frame, size, createdAt, lastAccessedAt, expiresAt }`, con índice `lastAccessedAt`.
  - Separar metadatos permite actualizar accesos y desalojar sin reescribir blobs.
- **Una sola conexión compartida**. Si IndexedDB no está disponible (modo privado, etc.), todo funciona solo con red.
- **TTL**: `cacheTtlMs` (14 días) desde el último acceso. Los hits actualizan `lastAccessedAt` y `expiresAt` en lote cada 2 s.
- **Presupuesto**: `cacheBudgetBytes` (750 MB).
  - El desalojo LRU hace un único recorrido del índice, del más reciente al más viejo: conserva hasta llenar el presupuesto y borra el resto y los vencidos.
  - Se programa por lotes (3 s): cuando el total conocido supera el presupuesto, o tras 64 MB escritos si aún no se conoce el total. Nunca corre por cada frame.
- **Escritura independiente**: si guardar falla (cuota llena, etc.), el frame se usa igual y se cuenta `cacheWriteFailures`. Nunca bloquea la animación.
- **Deduplicación**: `getOrDownloadFrame` comparte una sola lectura/descarga por clave. La descarga compartida solo se aborta si **todos** los interesados abortan.
- `getCachedFrameKeys(prefix)` lista las claves de una carpeta sin leer blobs. El scheduler lo usa al abrir para saber qué frames ya están guardados.
- `clearFrameCache()` vacía ambos stores (botón del panel).

### Blobs en memoria (dentro del scheduler)

- WebP comprimidos (~1.6 MB c/u) recién descargados o leídos. Permiten decodificar sin volver a IndexedDB ni a la red (cuentan como "memory hits").
- Límite: `prefetchAhead + prefetchBehind + decodedFrameLimit` blobs (67 con los valores actuales, unos 107 MB). Se descarta primero el más lejano al frame pedido; sigue en IndexedDB.

### Decodificados (ImageBitmap)

- `decodeFrame()` usa `createImageBitmap(blob, { resizeWidth, resizeHeight, resizeQuality: "high" })`.
  - El bitmap sale ya escalado al tamaño en que se dibuja (contain dentro del canvas, nunca más grande que el original). El tamaño se calcula una sola vez por resize.
  - Si el navegador no acepta las opciones de redimensionado, reintenta sin ellas.
  - Si no hay `createImageBitmap`, usa `<img>` + `decode()` y revoca la object URL.
- Límite estricto: `decodedFrameLimit` (12). Se conservan los más cercanos al frame pedido. **Nunca se liberan el frame dibujado ni el pedido.** Al liberar se llama a `bitmap.close()`.
- En un resize, los bitmaps viejos siguen sirviendo como respaldo hasta que se re-decodifican al nuevo tamaño (desde el blob, sin volver a descargar).

## G. Valores por defecto actuales

Fuente: `src/config/animationPerformance.js` (`ANIMATION_PERF_DEFAULTS`).

| Clave | Valor | Uso |
|---|---|---|
| `sourceMode` | `"optimized"` | carpetas `_30fps` |
| `concurrency` | 6 | descargas simultáneas desde el CDN |
| `decodeConcurrency` | 2 | decodificaciones simultáneas |
| `cacheReadConcurrency` | 4 | lecturas simultáneas de IndexedDB |
| `backgroundSlots` | 2 | slots garantizados para background con el usuario quieto (0 = sin precarga) |
| `prefetchAhead` | 40 | frames hacia adelante (en la dirección del scroll) |
| `prefetchBehind` | 15 | frames hacia atrás |
| `decodedFrameLimit` | 12 | bitmaps en memoria |
| `cacheBudgetBytes` | 750 MB | presupuesto de IndexedDB |
| `cacheTtlMs` | 14 días | vencimiento desde el último acceso |
| `maxDpr` | 2 | tope de `devicePixelRatio` del canvas |
| `retryCount` | 2 | reintentos por frame |
| `retryBaseDelayMs` | 300 | backoff: 300 ms, 600 ms |
| `failedFrameCooldownMs` | 10000 | espera antes de reintentar un frame fallido |
| `stationaryDelayMs` | 150 | sin cambios por este tiempo = quieto |
| `showLoaderStats` | `false` | overlay de diagnóstico sobre la animación |
| `loaderBufferFrames` | 8 | frames consecutivos listos antes de ocultar el overlay de carga |
| `loaderMinDisplayMs` | 500 | tiempo mínimo visible del overlay |
| `loaderMaxWaitMs` | 8000 | tope de espera del overlay |

Constantes internas de `frameScheduler.js`: `MAX_STRIDE = 8`, `CRITICAL_SCORE = 5` (pedido ±2), `MIN_DENSE_AHEAD = 8`, `NEAR_BUFFER = 30`, ventana de medición de 3 s.

Los ajustes del panel se guardan en `localStorage` (`tamborilero-animation-perf`, zustand persist **versión 4**). Al cambiar la versión se descartan los ajustes guardados y se vuelve a estos defaults.

## H. Limitaciones conocidas

- Los frames siguen siendo **WebP 4K sin pérdida, ~1.6 MB cada uno**. Una secuencia optimizada pesa ~1.2 GB.
- **En la primera visita no se sostienen 30 fps exactos** con redes normales. A 80 Mbps llegan ~6 frames/s; el autoplay necesita 30 (~380 Mbps). El scroll rápido y el autoplay muestran frames aproximados (el más cercano) hasta que llegan los exactos.
- Con 750 MB caben **~420 frames**: una secuencia optimizada completa (743) **no entra**. La precarga en segundo plano se detiene al 90% del presupuesto para que el LRU no borre lo recién precargado.
- La precarga en segundo plano comparte ancho de banda con la carga cercana cuando el usuario está quieto.
- En pantallas 4K con DPR ≥ 2, cada bitmap ocupa hasta 33 MB (12 ≈ 400 MB).
- **Falta probar en navegadores y dispositivos reales**:
  - IndexedDB y sus cuotas (Safari es más restrictivo).
  - `createImageBitmap` con redimensionado.
  - Memoria en iOS.
  - Comportamiento visual real.
- La configuración del CDN (Cache-Control, HTTP/2, CORS) está fuera del repositorio y no se revisó.

Resultados de la simulación (red de 80 Mbps compartida, frames de 1.6 MB, decodificación de 40 ms, IndexedDB falsa):

| Métrica | Antes | Ahora |
|---|---|---|
| Primer frame | — | ~0.3 s |
| Buffer tras 5 s quieto, sin scroll | — | frames 1–31 consecutivos |
| Pausa máxima con scroll activo | 2.3–9.8 s | 0.4–1.5 s |
| Descargas canceladas por scroll | — | 0 |
| Descargas repetidas | — | 0 |
| Reabrir y recorrer lo ya descargado | — | 0 pedidos de red, sin pausas |

## I. LayoutControlPanel (herramienta interna)

`src/components/LayoutControlPanel.jsx` es el "UI Control Center", una herramienta de diseño y desarrollo (layout, tema, tipografías). **Hoy se muestra a todos los visitantes en producción**; conviene ocultarla antes de publicar.

La sección **Animation Performance** tiene su propia tarjeta (`.cp-perf-panel`) e incluye:

- **Frame source**: Optimized (por defecto) u Original (depuración). Es interno; no menciona FPS.
- **Sliders**: loader concurrency, decode concurrency, background preload slots, prefetch ahead/behind, decoded frame limit y cache budget. `cacheReadConcurrency`, `maxDpr` y los reintentos no están en el panel.
- **Show loader stats**: activa el overlay de `ScrollVideo`. Se actualiza cada 250 ms escribiendo directo en el DOM, sin renders de React.
- **Clear animation cache**: vacía IndexedDB y muestra si funcionó o el error.
- **Restaurar valores**: vuelve a los defaults.
- **Estadísticas**, que se consultan cada 500 ms solo con el panel abierto:
  - Frames: perfil, cantidad, frame pedido/dibujado y origen del dibujado, desfase y desfase máximo, decodificado más cercano adelante/atrás.
  - Scroll: movimiento, dirección, velocidad, stride, lead y último punto de detención.
  - Memoria y caché: frames decodificados, blobs en memoria, frames en caché persistente y aproximado en MB.
  - Trabajo: cola de descarga y de decodificación; descargas activas (critical/prefetch/bg), lecturas de caché y decodificaciones activas; posición de la precarga y descargas en segundo plano.
  - Red: frames/s entregados, Mbps y tiempos promedio de carga y decodificación.
  - Contadores: renders exactos y de respaldo, persistent cache hits, memory hits, network downloads, **cancelled downloads (debe quedar en 0)**, frames fallidos, reintentos y fallos de escritura en caché.

Los valores avanzados existen para ajustar y depurar; no son opciones para el cliente.

## J. Decisiones tomadas

- **No migrar a video todavía.** La fase 1 mantiene canvas + GSAP + secuencias de imágenes.
- Las carpetas `_30fps` se generan **fuera del repo**, en el CDN.
- **No cancelar descargas activas durante el scroll normal ni en saltos.** Solo se aborta al cerrar, desmontar o cambiar de video o fuente. La cola (trabajo no iniciado) sí se reprioriza.
- **Todo frame descargado se guarda** y se reutiliza: memoria → IndexedDB → descarga en curso → CDN. Nunca se descarga dos veces.
- **Precargar aunque el usuario esté quieto**: el tiempo inactivo se usa para construir buffer.
- **Carga densa y consecutiva cerca del frame actual.** El salteo solo se usa lejos, durante scroll muy rápido.
- La precarga en segundo plano **llena progresivamente la secuencia** hasta el presupuesto de caché.
- **Quieto → frame exacto**; **scroll rápido → frame aproximado aceptable**. Mejor movimiento aproximado y fluido que esperar el exacto.
- El canvas **nunca queda vacío** si ya se dibujó algo: se dibuja el decodificado más cercano, o se conserva el último.
- El autoplay reproduce a los FPS del perfil (duración real del video, ~24.8 s).
- React solo se actualiza cuando cambia uno de los 5 pasos, no en cada frame.

## K. Archivos involucrados

| Archivo | Rol |
|---|---|
| `src/components/ScrollVideo.jsx` | Canvas (DPR con `maxDpr`), tween GSAP/ScrollTrigger, `FloatingSteps`, autoplay, `goToStep` (`setFocus`), control de velocidad del scroll, loader y overlay de estadísticas. Crea y descarta el scheduler por perfil. |
| `src/lib/frameScheduler.js` | Prioridades, carriles (red, IndexedDB, decodificación), precarga en segundo plano, cachés en memoria, render con respaldo y diagnóstico (`getFrameDiagnostics`). |
| `src/lib/frameCache.js` | IndexedDB (conexión única, metadatos, LRU, TTL), `getOrDownloadFrame` (deduplicación y reintentos), `getCachedFrameKeys`, `clearFrameCache`, `decodeFrame`/`blobToImage`. |
| `src/lib/frameProfile.js` | `getFrameProfile`: carpeta, cantidad de frames, FPS, URLs y claves. |
| `src/config/animationPerformance.js` | Defaults, límites, `FRAME_CDN_BASE`, `SOURCE_FPS`, `normalizePerfConfig`. |
| `src/store/useAnimationPerfStore.js` | Estado persistido de los ajustes internos (zustand, versión 4). |
| `src/components/LayoutControlPanel.jsx` | Sección Animation Performance (controles y estadísticas). |
| `src/pages/CraftYourCigar.jsx` | `listVideos` (nombre, cantidad original de frames, nombre visible), overlay `#video-root` y selector de videos (muestra `profile.frameCount`). |
| `src/styles/craft-your-cigar.css` | `.craft-immersive-overlay`: el scroller fijo de pantalla completa. |
| `src/hooks/useBodyScrollLock.js` | Bloquea el scroll del body mientras el overlay está abierto. |
| `scripts/convert-video.sh` | Genera los frames 4K sin pérdida desde los MP4 (no genera `_30fps`). |
| `src/styles/scroll-video.css` | CSS de una versión anterior con `<video>`; no lo importa ningún archivo. |

Pendiente no relacionado: `FloatingPrepButton` siempre abre `listVideos[1]` sin importar la mezcla elegida.

## L. Próxima fase (no implementada)

1. **Assets más livianos** (el cambio de mayor impacto):
   - WebP con pérdida (calidad ~80) en **1080p y 1440p**, elegidos según `innerWidth × DPR`.
   - Estimado: 100–250 KB por frame en vez de 1.6 MB (10–15 veces menos). Así una secuencia completa entra en caché y la primera visita puede sostener 30 fps.
   - Se integra agregando perfiles en `frameProfile.js` y carpetas nuevas en el CDN (por ejemplo `*_30fps_1080`), más la actualización de `convert-video.sh`.
2. Revisar la configuración del CDN: `Cache-Control: immutable`, HTTP/2 o HTTP/3, CORS.
3. Ajustar el presupuesto de caché cuando los assets sean livianos.
4. **Prototipo aparte de video controlado por scroll** (`currentTime` manejado por GSAP) con keyframes frecuentes (GOP corto), para comparar peso, precisión del seek, retroceso y comportamiento en iOS.
