# Auditoría de rendimiento de la animación por scroll

**Fecha:** 24 de septiembre de 2026.  
**Código examinado:** commit `09954abde40260593c39aab54df4b9d3c80ff863`.  
**Estado:** diagnóstico realizado; no se implementaron optimizaciones como parte de la auditoría.

## 1. Contexto: qué problema se investigó

El proyecto presenta una animación mediante React, GSAP ScrollTrigger y un canvas. Aunque visualmente parece un video, la implementación muestra una secuencia de imágenes WebP: la posición del scroll determina qué imagen debe aparecer.

El problema observado era que, al desplazarse, la imagen parecía detenerse brevemente y después saltaba varios fotogramas. El objetivo de la auditoría fue identificar qué parte del proceso provocaba ese comportamiento, basándose en el código real y en mediciones de Chrome.

Se investigaron la descarga, la caché, la decodificación, el dibujo, la memoria, el trabajo del hilo principal, la configuración de GSAP y la relación entre distancia de scroll y cantidad de imágenes.

La pregunta central fue:

> ¿Los saltos desaparecen cuando todos los archivos necesarios ya están disponibles localmente?

**Resultado: no desaparecieron.** La red agrava la primera visita, pero también existe un límite importante en la preparación y disponibilidad de las imágenes decodificadas.

Este documento explica qué se hizo, qué significan las mediciones y hasta dónde permiten concluir. Complementa el contexto de implementación de [scroll-video-optimization.md](scroll-video-optimization.md).

## 2. Glosario para interpretar la auditoría

| Término | Significado en este proyecto |
| --- | --- |
| Frame o fotograma | Una imagen de la secuencia. |
| Frame solicitado | La imagen que corresponde a la posición de la animación controlada por GSAP. |
| Frame dibujado | La imagen que realmente se envió al canvas; puede ser diferente de la solicitada. |
| Canvas | Superficie del navegador sobre la que se dibuja la imagen. |
| Blob | El archivo WebP comprimido disponible en memoria. Todavía necesita decodificarse para obtener un bitmap utilizable. |
| Bitmap / ImageBitmap | Imagen decodificada preparada para dibujar. Ocupa bastante más memoria que el WebP comprimido. |
| Decode o decodificación | Trabajo de convertir el WebP en una imagen utilizable; en esta implementación también puede incluir redimensionado. |
| Scheduler | Código que decide qué frames leer, descargar y decodificar primero. |
| Prefetch o precarga | Preparar recursos antes de que se soliciten. Descargar un archivo no significa haber terminado su decodificación. |
| IndexedDB | Almacenamiento local del navegador donde se guardan los WebP comprimidos entre visitas. |
| Caché HTTP | Caché de recursos gestionada por el navegador, distinta de IndexedDB. |
| Fallback | Imagen alternativa que se muestra cuando el frame exacto no está listo. Aquí se elige el bitmap más cercano. |
| Frame gap / lag | Diferencia entre el índice solicitado y el dibujado. Un gap de 10 significa un desfase de diez posiciones de la secuencia. |
| Exact hit | Intento en el que está disponible el frame exacto. |
| FPS | Frames por segundo. Hay que distinguir velocidad de avance solicitada, entregas de archivos y dibujos realizados. |
| p95 | Percentil 95: aproximadamente el 95 % de las observaciones queda en ese valor o por debajo. Describe el extremo lento mejor que el promedio. |
| Main thread | Hilo principal donde se ejecutan JavaScript, callbacks, actualizaciones de React y llamadas de dibujo. |
| Worker del navegador | Hilo interno donde el navegador puede ejecutar trabajo, como decodificar imágenes, sin hacerlo directamente en el hilo principal. |
| Long task | Tarea del hilo principal de más de 50 ms. Su ausencia no garantiza una cadencia perfecta. |
| rAF | `requestAnimationFrame()`: mecanismo para programar trabajo asociado al ciclo de actualización visual. |
| DPR | Relación entre píxeles físicos y píxeles CSS. DPR 2 multiplica por cuatro la cantidad de píxeles del canvas respecto a DPR 1. |
| GC | Garbage collection: recuperación de memoria de objetos JavaScript que dejaron de ser necesarios. |
| Scrub | Vinculación suavizada entre el scroll y el progreso de una animación de GSAP. |
| GOP / keyframe | En video comprimido, grupo de imágenes y punto de acceso desde el que puede reconstruirse el contenido siguiente. Influyen en el coste de buscar un instante. |

**La distinción más importante:** un WebP en IndexedDB, un Blob en memoria y un bitmap decodificado son tres estados diferentes. Solo tener el archivo local no significa tener la imagen preparada a tiempo.

## 3. Alcance y archivos examinados

- [ScrollVideo.jsx](../src/components/ScrollVideo.jsx): integración con GSAP, loader y dibujo.
- [frameScheduler.js](../src/lib/frameScheduler.js): prioridades, colas, precarga, selección de imágenes y límites de memoria.
- [frameCache.js](../src/lib/frameCache.js): IndexedDB, fetch, reintentos y decodificación.
- [frameProfile.js](../src/lib/frameProfile.js): carpetas, cantidad de frames y FPS de cada perfil.
- [animationPerformance.js](../src/config/animationPerformance.js): configuración por defecto.
- [useAnimationPerfStore.js](../src/store/useAnimationPerfStore.js): configuración persistida.
- [LayoutControlPanel.jsx](../src/components/LayoutControlPanel.jsx): métricas y controles internos.
- [CraftYourCigar.jsx](../src/pages/CraftYourCigar.jsx): inventario de secuencias y overlay.
- [convert-video.sh](../scripts/convert-video.sh): exportación de imágenes.

Durante la auditoría no se modificaron archivos del proyecto. Se utilizaron scripts temporales y modificaciones en memoria de un Chrome con perfil aislado. Al finalizar se cerró ese Chrome y se eliminó su perfil temporal. Este Markdown documenta después el trabajo realizado; no introduce cambios en la animación.

## 4. Cómo llega realmente un frame al canvas

```text
El usuario desplaza #video-root
→ ScrollTrigger actualiza el progreso objetivo
→ el tween con scrub actualiza frameRef.current.index
→ onUpdate redondea el índice
→ setTarget() actualiza la prioridad
→ refresh() reconstruye candidatos y colas
→ pump() inicia el trabajo permitido por las concurrencias
→ drawCurrent() intenta dibujar inmediatamente
```

Si ya existe una imagen decodificada:

```text
getDrawable()
→ frame exacto, o bitmap disponible más cercano
→ si es diferente del último dibujado:
  clearRect() → drawImage() → noteRendered()
```

Si hay que prepararla:

```text
IndexedDB
→ si falta: fetch() → response.blob()
→ Blob en memoria
→ cola de decodificación
→ createImageBitmap()
→ caché de bitmaps
→ onFrameReady()
→ requestAnimationFrame()
→ nuevo intento de drawCurrent() para el objetivo vigente
```

No todos los dibujos pasan por un rAF propio: el `onUpdate` de GSAP llama directamente a `drawCurrent()`. El rAF adicional se usa cuando termina una decodificación.

Las prioridades, búsquedas, sorts y cambios en mapas se ejecutan de forma síncrona en el hilo principal. La red y IndexedDB son asíncronos, aunque sus callbacks vuelven a ejecutar JavaScript en ese hilo. La traza de Chrome situó la decodificación de imágenes en workers internos.

La escritura de un Blob descargado en IndexedDB se lanza independientemente: no se espera a que termine para utilizar ese Blob.

## 5. Por qué la imagen se congela y después salta

El índice solicitado se obtiene con `Math.round(frameRef.current.index)`. `getDrawable()` busca primero ese índice en el mapa de bitmaps decodificados. Si no existe, realiza una búsqueda binaria en los índices disponibles y elige el más cercano; en empate favorece la dirección del movimiento.

No hay una distancia máxima para aceptar ese respaldo. Tampoco se garantiza que los dibujos avancen siempre en el mismo sentido: la llegada de un bitmap más cercano puede cambiar la selección hacia atrás.

`drawCurrent()` tiene dos comportamientos decisivos:

```js
if (!drawable) return;
if (!force && drawable.index === lastDrawnRef.current) return;
```

Si no hay una imagen utilizable, conserva el canvas. Si el mejor respaldo sigue siendo el que ya estaba dibujado, también lo conserva. El scroll puede seguir avanzando mientras la imagen permanece igual; cuando llega otro bitmap adecuado, la imagen cambia de golpe.

Ejemplo medido sin red, con índices internos que empiezan en cero:

```text
Solicitado 156 → seleccionado y dibujado 151
...
Solicitado 159 → seleccionado y dibujado 151
```

El mismo drawable permaneció seleccionado durante 87 ms mientras cambiaba la solicitud. En una inversión de dirección se observó aproximadamente 150 ms conservando el frame 114 mientras el solicitado retrocedía de 113 a 95.

El exacto vuelve a considerarse al cambiar el objetivo, terminar una operación, cambiar foco/tamaño/configuración o transcurrir 150 ms sin cambios de objetivo. Los frames fallidos tienen un cooldown de 10 segundos, pero vencer ese plazo no dispara por sí solo otro intento: hace falta un nuevo `refresh()`.

### La telemetría existente puede ocultar las pausas

Ya existen `requestedFrame`, `renderedFrame`, `frameLag`, `exactRenders`, `fallbackRenders` y `maxLag`. Sin embargo, `noteRendered()` solo se ejecuta después de un dibujo nuevo. Los intentos que mantienen la imagen no incrementan esos contadores.

En la primera visita se registró, con índices publicados que empiezan en uno:

```text
requestedFrame: 181
renderedFrame:   84
frameLag:       97
maxLag:         36
```

El desfase real instantáneo era mayor que el máximo registrado porque creció mientras no había nuevos dibujos.

Para una instrumentación posterior, el lugar adecuado es `drawCurrent()`, después de obtener el drawable y antes de los retornos por ausencia o repetición. Allí habría que registrar el solicitado, el candidato y el frame que sigue visible. Después del dibujo se registraría el frame efectivamente dibujado. Así podrían calcularse `requestedFrame - drawnFrame` y `requestedFrame === drawnFrame` incluso cuando el canvas no cambia. Esto no se implementó durante la auditoría.

## 6. Qué se midió y cómo

### Entorno

| Elemento | Condición |
| --- | --- |
| Equipo | Apple M1 |
| Navegador | Chrome Headless 153 |
| Aplicación | Servidor Vite existente, en desarrollo |
| Montaje | Componente real dentro de un overlay temporal con `#video-root` |
| Secuencia | `2t_colorado_maduro_30fps`, 743 frames |
| Viewport | 1440 × 900 píxeles CSS |
| DPR | 2 |
| Canvas | 2880 × 1800 |
| Bitmap objetivo | 2880 × 1620, conservando proporción |
| Altura de scroll | 1200vh; recorrido aproximado de 9900 px |
| Interacción | Scroll programático reproducible |
| Red | Sin throttling artificial; bloqueada explícitamente en C |

Se envolvieron temporalmente llamadas de selección, actualización del scheduler, `createImageBitmap()` y `drawImage()` para registrar tiempos e índices. Se observaron recursos, intervalos rAF y long tasks. Una prueba adicional capturó una traza de Chrome para localizar decodificación y GC.

### Tres escenarios

| Escenario | Preparación | Qué permite observar |
| --- | --- | --- |
| A: primera visita | IndexedDB y caché HTTP vaciados al inicio; después se dejó el tiempo de arranque | Comportamiento cuando se deben adquirir archivos nuevos |
| B: segunda visita | Recarga conservando la caché parcial acumulada | Mejora al reutilizar recursos, con zonas todavía pendientes |
| C: secuencia local | 743 frames verificados en IndexedDB y CDN bloqueado | Comportamiento sin depender de descargas de la secuencia |

Para C se aumentó únicamente el presupuesto persistente a 2 GiB en el perfil temporal: el valor por defecto no permite guardar la secuencia completa. Las demás concurrencias y el límite de bitmaps siguieron igual.

### Recorridos

| Recorrido | Movimiento de índices | Velocidad nominal |
| --- | --- | --- |
| Lento | 0 → 60 en 6 s | 10 frames/s |
| Normal | 0 → 180 en 6 s | 30 frames/s |
| Rápido | 0 → 180 en 1,5 s | 120 frames/s |
| Inversión | 0 → 180 → 0, 1,5 s por tramo | 120 frames/s por tramo |

Antes de cada recorrido se volvió a cero y se dejó un intervalo de estabilización. Se incluyeron 800 ms finales para dejar terminar el scrub. Los cuatro recorridos se hicieron en orden dentro de cada escenario: la caché evolucionó entre ellos; no son cuatro pruebas independientes con idéntico estado inicial.

## 7. Resultados de scroll

| Escenario | Recorrido | Dibujos/s | Exacto disponible | Gap medio | Gap máximo | Decode medio / p95 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| A | Lento | 8,2 | 87,1 % | 0,3 | 3 | 126 / 203 ms |
| A | Normal | 4,3 | 10,8 % | 35,9 | 97 | 144 / 201 ms |
| A | Rápido | 9,5 | 33,7 % | 16,9 | 49 | 145 / 167 ms |
| A | Inversión | 9,0 | 14,6 % | 13,0 | 44 | 135 / 193 ms |
| B | Lento | 8,8 | 99,4 % | 0,01 | 1 | 118 / 166 ms |
| B | Normal | 6,0 | 16,9 % | 5,6 | 16 | 153 / 212 ms |
| B | Rápido | 8,8 | 14,9 % | 24,5 | 45 | 183 / 282 ms |
| B | Inversión | 12,1 | 14,7 % | 18,6 | 60 | 149 / 229 ms |
| C | Lento | 8,8 | 100 % | 0 | 0 | 101 / 121 ms |
| C | Normal | 7,8 | 17,3 % | 5,0 | 9 | 143 / 189 ms |
| C | Rápido | 9,4 | 20,4 % | 17,3 | 35 | 143 / 189 ms |
| C | Inversión | 9,2 | 15,6 % | 16,8 | 37 | 138 / 193 ms |

### Cómo leer esta tabla

- **Dibujos/s** cuenta llamadas de dibujo durante la ventana medida, incluidos los 800 ms finales. No mide presentaciones físicas en pantalla. Por eso el recorrido lento, que avanza a 10 índices/s, puede dar unos 8,8 dibujos/s sin presentar un problema de exactitud.
- **Exacto disponible** es el porcentaje de consultas instrumentadas al drawable que encontraron el índice exacto. Incluye repeticiones: no es el ratio de `exactRenders` del proyecto ni un porcentaje ponderado por tiempo.
- **Gap** compara el solicitado con el drawable seleccionado en cada consulta; si no hubiera candidato, se toma el último dibujado. En este camino de dibujo, un candidato nuevo se dibuja inmediatamente y uno repetido conserva el canvas.
- **Decode** mide el tiempo transcurrido de las llamadas instrumentadas a `createImageBitmap()`, incluyendo espera y redimensionado. No representa exclusivamente tiempo de CPU del codec.

En C, midiendo solo el tramo activo, las tasas de dibujo fueron aproximadamente 9,8 / 8,4 / 12,3 / 10,3 por segundo para lento, normal, rápido e inversión.

### Resultado que separa red de preparación local

Los cuatro recorridos de C terminaron con **cero descargas y cero fallos de descarga**, pero los recorridos normal y rápido siguieron presentando desfases.

También se recorrió toda la secuencia, 0 → 742 → 0, en seis segundos por sentido, con el CDN bloqueado:

- Disponibilidad exacta: 4,9 %.
- Gap medio: 20,3 frames; máximo: 37.
- Dibujos: aproximadamente 9,3/s.
- Descargas y fallos de descarga: cero.

Esto demuestra que la red no basta para explicar el problema observado. No implica que la red carezca de impacto: el desfase fue mucho mayor en el recorrido normal de la primera visita.

## 8. Decodificación, dibujo, hilo principal y memoria

### La decodificación sigue costando aunque no bloquee directamente el main thread

La traza mostró eventos `Decode Image` en `ThreadPoolForegroundWorker`, separados de `CrRendererMain`. En este Chrome, el trabajo de decodificación se ejecutó fuera del hilo principal.

Pero una operación asíncrona puede llegar tarde. Con dos decodificaciones simultáneas y unos 143 ms por operación, la capacidad orientativa es:

```text
2 / 0,143 ≈ 14 preparaciones por segundo
```

Es una aproximación, no una garantía: las operaciones compiten por recursos y no todo bitmap preparado acaba mostrándose. El recorrido normal demanda alrededor de 30 índices/s.

`decodeFrame()` solicita redimensionado de alta calidad. Si falla esa vía, reintenta sin las opciones; si no puede usar ImageBitmap, recurre a `new Image()`, object URL e `img.decode()`. No utiliza un canvas intermedio. El primer frame revela el tamaño original y puede necesitar una segunda decodificación al tamaño objetivo.

### Dibujo con imágenes ya preparadas

Una prueba separada rotó 12 bitmaps ya decodificados durante unos cuatro segundos, manteniendo limpieza y dibujo del canvas:

- Aproximadamente 60,6 llamadas de dibujo/s.
- Intervalo rAF p95: 16,7 ms.
- Tiempo de las llamadas de limpieza/dibujo p95: aproximadamente 0,2 ms.

En C normal, la llamada a `drawImage()` por sí sola tuvo p95 de aproximadamente 0,1 ms. Su retorno no incluye necesariamente toda la rasterización y composición posterior.

La prueba con 12 bitmaps residentes respalda que emitir dibujos puede sostener una cadencia cercana a 60 Hz en ese entorno. No demuestra que se puedan preparar y presentar 60 imágenes nuevas por segundo ni valida la fluidez en una pantalla física.

### Main thread y GC

`refresh()` crea y ordena candidatos, recorre colas y actualiza prioridades. Ese coste se midió alrededor de 0,07–0,09 ms de media; el máximo de la captura ampliada fue 0,9 ms. `getDrawable()` usa un mapa y una búsqueda binaria sobre una colección pequeña.

React no recibe un cambio de estado por cada frame: durante el scroll se actualiza cuando cambia uno de los cinco pasos lógicos. El loader actualiza su progreso cada 100 ms. El panel de diagnóstico añade actualizaciones cada 500 ms mientras está abierto.

En C no se registraron long tasks de más de 50 ms durante los cuatro recorridos. Aun así, C normal tuvo un intervalo rAF medio de 23,3 ms y p95 de 66,6 ms: **no observar long tasks no significa mantener 60 Hz**.

En la traza adicional se registraron ocho pausas MinorGC, con 3,8 ms acumulados y menos de 0,8 ms por pausa. Esa evidencia no sitúa a GC como causa principal.

### Memoria

La configuración limita cantidades, no bytes: hasta 67 Blobs y aproximadamente 12 bitmaps retenidos, además de operaciones y recursos temporales.

| Elemento | Estimación de memoria |
| --- | ---: |
| 12 bitmaps RGBA de 2880 × 1620 | 224 MB |
| 67 Blobs al tamaño medio de esta secuencia | 100 MB |
| Un backing store RGBA de canvas 2880 × 1800 | 20,7 MB |

Son estimaciones de orden de magnitud. No incluyen copias internas, temporales de decode o recursos gráficos. El heap JS observado en C fue de unos 36,7–38,8 MB, pero ese dato no representa toda la memoria de imágenes nativas.

## 9. Comportamiento del scheduler y de la caché

La configuración por defecto contiene seis slots de adquisición por red, cuatro de lectura de caché, dos de decode, 40 frames de precarga hacia delante, 15 hacia atrás y 12 bitmaps retenidos.

### Tener toda la secuencia en IndexedDB no prepara toda la ventana

Al iniciar C había 743 frames persistentes, pero solo tres Blobs en memoria y tres bitmaps decodificados.

`refresh()` considera los Blobs ya residentes, las adquisiciones activas y añade explícitamente el objetivo y sus vecinos ±2. Los frames que solo están en IndexedDB no se leen simplemente por pertenecer a la ventana de 40 frames hacia delante. Esta diferencia entre precarga de archivos y anticipación de decode ayuda a explicar por qué la caché completa no eliminó el desfase.

El loader también acepta como parte de su buffer frames presentes como Blob o en IndexedDB: no exige que los ocho estén decodificados. Exige que el primero sea dibujable, respeta un mínimo de 500 ms y tiene un tope de espera de ocho segundos.

### Trabajo que deja de ser relevante

`setTarget()` reprioriza trabajo pendiente y elimina entradas que salen de la ventana. No cancela descargas ni decodificaciones ya iniciadas. Las descargas solo se abortan al disponer el scheduler.

`backgroundSlots: 2` es una reserva, no un máximo absoluto de dos descargas de background. Cuando no hay demanda cercana, el background puede ocupar los seis slots; se observó durante la prueba. Un nuevo objetivo no interrumpe inmediatamente ese trabajo.

### Capacidad y coherencia de IndexedDB

El presupuesto por defecto es 750 MiB, equivalentes a 786.432.000 bytes. La secuencia principal ocupa 1.112.691.808 bytes, por lo que no cabe completa. La precarga de background intenta detenerse alrededor del 90 % del presupuesto estimado.

Además, el conjunto `cached` del scheduler no es una comprobación continua de IndexedDB: puede añadir un índice antes de confirmar la escritura y no recibe las invalidaciones del desalojo LRU. El listado inicial de claves tampoco filtra expiración. Son riesgos de coherencia observados en el código; no se demostró que causaran los saltos concretos medidos.

## 10. Assets y coste de transferencia

Se consultaron los tamaños de 44.636 archivos repartidos en 40 perfiles, correspondientes a 20 secuencias en dos modos. Los recuentos del CDN coincidieron con los del proyecto. Las cabeceras de imagen inspeccionadas por perfil indicaron 3840 × 2160 y WebP VP8L, consistente con exportación sin pérdida.

Los FPS son los declarados en la configuración; no son una propiedad medible de cada WebP. El modo `optimized` conserva aproximadamente la mitad de los frames, pero sigue usando assets 4K.

| Perfil | Frames por secuencia | FPS declarados | Tamaño total observado |
| --- | --- | ---: | --- |
| Optimized | 743 o 751 | 30 | Aproximadamente 1,06–1,24 GB |
| Original | 1485, 1486 o 1501 | 60 | Aproximadamente 2,12–2,48 GB |

Detalle de `2t_colorado_maduro`, la secuencia usada en navegador:

| Medida | Optimized | Original |
| --- | ---: | ---: |
| Frames | 743 | 1485 |
| Mínimo | 0,053 MB | 0,053 MB |
| Promedio | 1,498 MB | 1,499 MB |
| Mediana | 1,674 MB | 1,675 MB |
| p90 | 1,984 MB | 1,986 MB |
| p95 | 2,039 MB | 2,045 MB |
| Máximo | 2,252 MB | 2,280 MB |
| Total exacto | 1.112.691.808 bytes | 2.226.484.210 bytes |

Aquí MB y GB son decimales. MiB y GiB representan unidades binarias y se usan al describir el presupuesto de caché.

Para descargar 30 imágenes nuevas por segundo del perfil principal:

```text
30 × 1,497566 MB ≈ 44,927 MB/s
44,927 × 8      ≈ 359,416 Mbps
```

Entre todos los perfiles optimizados, el caudal teórico a 30 frames/s está entre 342,77 y 397,17 Mbps. El original tiene un peso por imagen parecido; a sus 60 fps nominales exigiría aproximadamente el doble.

| Conexión | Secuencia principal de 743 frames | Original de 1485 frames |
| --- | ---: | ---: |
| 10 Mbps | 890,2 s | 1781,2 s |
| 25 Mbps | 356,1 s | 712,5 s |
| 50 Mbps | 178,0 s | 356,2 s |
| 100 Mbps | 89,0 s | 178,1 s |
| 300 Mbps | 29,7 s | 59,4 s |

Estos tiempos son teoría de bytes/ancho de banda: excluyen latencia, competencia, decodificación y almacenamiento. La demanda real depende de la velocidad del scroll, no solo de los FPS nominales del perfil.

## 11. GSAP y distancia de scroll

En una inicialización desde cero, el índice se aproxima a:

```text
round(progreso del tween × (cantidad de frames − 1))
```

`scrub: 0.6` suaviza la recuperación hacia la posición objetivo durante aproximadamente 0,6 segundos. No espera imágenes, no limita la reproducción a 30 fps y no garantiza recorrer todos los índices. El `onUpdate` pertenece al tween, por lo que puede seguir solicitando imágenes mientras alcanza el objetivo después de terminar el scroll físico.

La distancia geométrica aproximada es:

```text
distancia = (alturaConfiguradaEnVh / 100 − 1) × alturaViewport
px/frame  = distancia / (cantidadFrames − 1)
```

El valor por defecto es 1200vh; el control declara límites de 150 y 3000vh.

| Frames | Altura | Viewport 700 px | 900 px | 1000 px | 1200 px |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 743 | 150vh | 0,47 | 0,61 | 0,67 | 0,81 |
| 743 | 1200vh | 10,38 | 13,34 | 14,82 | 17,79 |
| 743 | 3000vh | 27,36 | 35,18 | 39,08 | 46,90 |
| 751 | 1200vh | 10,27 | 13,20 | 14,67 | 17,60 |
| 1485 | 150vh | 0,24 | 0,30 | 0,34 | 0,40 |
| 1485 | 1200vh | 5,19 | 6,67 | 7,41 | 8,89 |
| 1485 | 3000vh | 13,68 | 17,59 | 19,54 | 23,45 |
| 1486 | 1200vh | 5,19 | 6,67 | 7,41 | 8,89 |
| 1501 | 1200vh | 5,13 | 6,60 | 7,33 | 8,80 |

La tabla expresa px/frame. A 150vh y viewport de 900 px, un movimiento de tres píxeles representa unos 4,9 frames en el perfil de 743 y unos 9,9 en el de 1485. Esa densidad puede exigir saltos incluso con todos los bitmaps preparados.

A la configuración por defecto de 1200vh no se presenta esa densidad extrema. Además, demandar 120 índices/s en una pantalla de 60 Hz necesariamente omite posiciones: eso debe distinguirse de conservar una imagen porque no llegó su reemplazo.

## 12. Métricas disponibles y faltantes

| Métrica | Estado antes de la instrumentación temporal |
| --- | --- |
| Velocidad solicitada | `velocity` estima avance de índices/s; no cuenta solicitudes/s |
| FPS de dibujo | No existe directamente; aproximable con deltas de contadores |
| Exact hit rate | Derivable entre dibujos, pero omite intentos que conservan la imagen |
| Gap medio | Faltante |
| Gap máximo | `maxLag`, incompleto durante pausas sin nuevos dibujos |
| Tiempo medio de adquisición | `avgLatencyMs`, media exponencial que mezcla IndexedDB y fetch |
| p95 de descarga | Faltante |
| Tiempo medio de decode | `avgDecodeMs`, media exponencial del proceso |
| p95 de decode | Faltante |
| Tiempo de dibujo | Faltante |
| Descargas activas | `activeDownloads`, según carril asignado |
| Esperando decode | `decodeQueueLength` |
| Lecturas IndexedDB activas | `activeCacheReads` |
| Esperando IndexedDB | Sin contador específico; cola de adquisición mezclada |
| Dibujos aproximados | `fallbackRenders`, sin contar repeticiones |
| Solicitados y nunca mostrados | Faltante |

`framesPerSecond` en el diagnóstico actual mide entregas de Blobs, no FPS del canvas. `throughputMbps` cuenta bytes de Blobs obtenidos por fetch, incluso cuando el navegador pudiera satisfacerlo desde caché HTTP; no equivale necesariamente a tráfico físico de red.

## 13. Comparación de arquitecturas sin elegir una solución

| Aspecto | Canvas + WebP actual | Video común controlado con `currentTime` | Video preparado para seeking |
| --- | --- | --- | --- |
| Red | Volumen medido elevado; imágenes independientes | Habitualmente menor por compresión temporal; depende del encode | GOP corto puede aumentar el peso frente a un encode equivalente de GOP largo |
| Memoria | Blobs y bitmaps gestionados por la aplicación | Buffers gestionados por el navegador | Similar al video común, con variantes y buffers según diseño |
| Decode | Cada imagen se prepara independientemente | Buscar un instante puede exigir reconstruir desde un keyframe anterior | Puntos de acceso frecuentes reducen esa distancia |
| Precisión | Índice exacto si el bitmap está listo | Asignar un tiempo no presenta inmediatamente ese frame | Mejora acceso, pero no garantiza una presentación por cada actualización |
| Retroceso | Independiente si está preparado; si no, redecode | Puede requerir seeks y reconstrucciones repetidas | Generalmente más favorable con GOP corto |
| Safari/iOS | Depende de memoria, APIs y fallback | Depende de codec, versión y seeking | Requiere igualmente validación real |
| Caché | Granular por frame; muchos objetos | Archivo o rangos HTTP | Archivo/rangos y posiblemente varias resoluciones |
| Fluidez | Depende de suministro suficiente de bitmaps | Variable con seeks frecuentes y GOP largo | Potencialmente más apropiado para saltos; no medido aquí |
| Complejidad | Scheduler, caché, decode y memoria propios | Integración inicial menor; sincronización delicada | Añade trabajo de codificación y validación |

MP4 y WebM son contenedores; codec, keyframes y GOP determinan buena parte del comportamiento. Las alternativas de video no se implementaron ni se midieron durante esta auditoría. No se seleccionó una arquitectura.

Tampoco se investigó una página concreta de Apple, por lo que no se atribuye una tecnología a sus sitios. La percepción de fluidez depende conjuntamente de assets, resolución, compresión, preparación anticipada, composición, sincronización, distancia de scroll y adaptación al dispositivo.

## 14. Diagnóstico y fuerza de la evidencia

Las probabilidades de esta tabla son valoraciones cualitativas para el entorno examinado, no porcentajes estadísticos.

| Posible cuello | Evidencia en código | Evidencia medida | Probabilidad como contribuyente | Impacto |
| --- | --- | --- | --- | --- |
| Tamaño de assets | Sin variante de resolución en los perfiles actuales | Secuencia principal de 1,113 GB; cabeceras 4K inspeccionadas | Confirmado como carga elevada | Muy alto |
| Red | Necesidad de adquirir Blobs nuevos | Gap máximo 97 en A normal; mejora con caché | Alta en primera visita | Muy alto |
| Decode | Dos operaciones simultáneas con redimensionado | C normal: 143 ms medios, 189 ms p95 | Muy alta | Muy alto |
| Main thread del scheduler | Recorridos, sorts y asignaciones | `refresh()` medio alrededor de 0,07–0,09 ms | Baja como causa principal medida | Bajo aquí |
| GSAP scrub | Suavizado independiente de la disponibilidad | Solicitudes que el pipeline no satisface a tiempo | Contribuyente; raíz no demostrada | Medio |
| Fallback / frame skipping | Vecino sin radio máximo; retorno si se repite | Repeticiones y desfases registrados | Confirmado como comportamiento | Alto como manifestación |
| IndexedDB | Lecturas y mantenimiento de transacciones | El problema persiste sin red; falta aislar su latencia | Posible | Medio |
| Memoria de bitmaps | Doce retenidos y desalojos por distancia | Cantidad acotada y nuevas decodificaciones al avanzar | Alta como restricción del buffer | Alto |
| Garbage collection | Asignaciones frecuentes | Ocho pausas menores de 0,8 ms en la traza | Baja en la captura | Bajo |
| DPR | Tope de 2 por defecto | Bitmap objetivo de 2880 × 1620 | Amplificador probable; sin comparación DPR 1/2 | Medio/alto |
| Dibujo de canvas | Limpieza y dibujo completo | Bitmaps residentes: aproximadamente 60 llamadas/s | Baja como causa principal aislada | No dominante aquí |
| Anticipación de decode | Incorporación explícita de vecinos ±2 desde caché | C comienza con 743 persistentes y tres decodificados | Muy alta | Alto |
| Trabajo obsoleto | Operaciones activas no canceladas por scroll | Preparación que no se traduce en dibujos | Alta como contribuyente | Alto en saltos/inversiones |
| Capacidad de caché | Presupuesto menor que una secuencia | Ninguna secuencia optimizada cabe completa por defecto | Confirmado | Alto entre visitas |

### Las cinco causas más probables

1. **Preparación de bitmaps demasiado lenta para la demanda normal y rápida.** El problema persistió sin red y con todos los archivos disponibles.
2. **Anticipación insuficiente de decode cuando los recursos están en IndexedDB.** Caché completa no equivale a una ventana completa de bitmaps futuros.
3. **Volumen de assets elevado para adquirirlos durante el scroll.** La secuencia principal requiere unos 359 Mbps teóricos para descargar 30 imágenes nuevas/s.
4. **Trabajo activo que pierde relevancia y no se interrumpe.** Sigue consumiendo slots mientras el objetivo se aleja o cambia de dirección.
5. **Retención reducida de bitmaps frente al recorrido y las inversiones.** Obliga a preparar de nuevo imágenes locales; el fallback conserva y después salta cuando no llegan a tiempo.

Estos factores se relacionan entre sí; no son cinco causas independientes cuya contribución se haya cuantificado por separado.

## 15. Limitaciones y siguiente dato necesario

La auditoría aporta evidencia del código y una prueba exploratoria instrumentada. **No es un benchmark de producción ni una garantía de rendimiento entre dispositivos.**

- Se utilizó Chrome Headless y una compilación de desarrollo, no una pantalla física ni un build de producción.
- El componente real se montó en un overlay temporal; no se validó todo el flujo de interacción de la página con gestos humanos.
- La instrumentación añade trabajo y los recorridos se ejecutaron secuencialmente, calentando la caché.
- Parte del inventario de cabeceras del CDN coincidió con A/B; sus latencias no representan un benchmark aislado del servidor.
- No se probaron Safari/iOS, otros equipos ni distintos DPR de forma controlada.
- El tiempo de retorno de `drawImage()` no mide toda la presentación gráfica.
- No se midió estabilidad de memoria nativa durante sesiones prolongadas.
- Las muestras de long tasks y GC no descartan esos problemas en otras condiciones.
- Los artefactos originales se generaron en almacenamiento temporal; este Markdown conserva el contexto y los resultados esenciales, pero no incorpora la traza ni instala una suite automatizada de pruebas.

El dato más importante pendiente es la distribución de **tiempo desde `setTarget(n)` hasta que el bitmap de `n` queda listo**, separada en espera de cola, lectura de IndexedDB, espera de decode, decode/redimensionado y presentación. Debe incluir solicitudes que quedaron obsoletas y nunca se mostraron.

El experimento para separar red de preparación local ya se realizó: precargar y verificar los 743 WebP, bloquear el CDN y repetir el scroll. Los saltos persistieron. La interpretación respaldada por esta prueba es que **la red agrava el problema, pero disponer a tiempo del bitmap correcto sigue siendo el cuello principal observado una vez eliminada la descarga**.

No se implementó una solución ni se decidió migrar a video. Este diagnóstico sirve como punto de partida documentado para una siguiente fase de experimentos y cambios medidos.

## Referencias técnicas consultadas

- [GSAP ScrollTrigger: semántica de scrub](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
- [HTML Standard: ImageBitmap y procesamiento de Blob](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html).
- [HTML Standard: seeking de elementos multimedia](https://html.spec.whatwg.org/multipage/media.html#seeking).
- [FFmpeg: opciones de codecs y GOP](https://ffmpeg.org/ffmpeg-codecs.html).
- [WebKit: políticas de reproducción de video en iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/).
