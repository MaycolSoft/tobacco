# Estado del proyecto y pendientes

Revisión documental y contraste de código: **21 de octubre de 2026**, con cuatro subagentes de lectura por tandas. Este documento reúne el trabajo abierto; las auditorías anteriores conservan contexto y mediciones, no una lista vigente de órdenes. No se implementan aquí cambios de producto ni se afirma haber repetido sus pruebas de navegador.

## Pausa temporal y punto de reanudación

**Desarrollo pausado por solicitud del usuario el 21/10/2026.** La última actividad fue diagnóstico de selección automática de video, sin implementación. No se han aprobado las tres decisiones siguientes. No instalar dependencias ni hacer commit como parte de este cierre.

### Diagnóstico confirmado

- CTA real: `src/components/CigarResult.jsx` → `src/components/LeafGrid.jsx` → `src/pages/CraftYourCigar.jsx`, `startCrafting()`. Este último fuerza `listVideos[1]` (`2t_colorado_maduro`) sin consultar la mezcla.
- `src/store/useBlendStore.js` conserva IDs en `selections`: 2–5 TRIPA, un CAPOTE y una CAPA. `isBlendComplete` comprueba cantidades; un resolver debe verificar además IDs válidos, categorías y ausencia de duplicados.
- Resolver desde las selecciones actuales cubre mezcla manual y futura mezcla maestra editable. `loadedBlend` es informativo, no se invalida al editar ni se persiste; no usarlo como fuente para decidir video. `src/data/masterBlends.js` sigue vacío.
- Catálogo local en `CraftYourCigar.jsx`: 20 masters, cuatro prefijos (`2t…5t`) por cinco acabados (`colorado_claro`, `colorado`, `colorado_maduro`, `maduro`, `oscuro`). Los nombres y el rango del store sugieren cantidad de tripas, pero no hay confirmación explícita documentada del significado de `t`.
- `src/data/leaves.js` tiene capas `capa-habana` y `capa-pensilvania`, sin metadato de acabado. La exploración `3d-exploration/04-parts/F_LIBRARY_CRAFT.md` sugiere Habana más clara/colorado y Pensilvania más oscura/maduro; `CODEX_ARTISTIC_IMAGE_PROMPTS.md` usa otros matices artísticos. Ninguno establece una correspondencia validada con los masters de video. No inferirla de nombres, fotos, origen o descripción.
- `src/lib/frameVariants.js`, `getAnimationCatalog()`, combina masters de API con catálogo local de respaldo; hoy lo consume el selector manual. `src/lib/frameProfile.js` y `ScrollVideo` ya admiten distintos masters y variantes por nombre. `FloatingPrepButton` no participa en el flujo actual.

### Tres decisiones pendientes de aprobación

| Decisión | Propuesta sin aprobar | Qué debe definir el usuario |
| --- | --- | --- |
| 1. Significado de `2t…5t` | `Nt = selections.TRIPA.length`, sin contar capa ni capote. | Confirmar que el prefijo de los archivos representa realmente la cantidad de tripas. |
| 2. Correspondencia de capas | Configuración explícita independiente, por ID estable: `wrapperFinishes = { 'capa-habana': null, 'capa-pensilvania': null }`. Los `null` significan sin definir, no valores por defecto. | Elegir para cada capa uno de los cinco acabados del catálogo. No hay asignación aprobada. |
| 3. Resolución de videos y casos sin correspondencia | Función pura `resolveBlendVideo({ selections, leaves, catalog, wrapperFinishes })` en `src/lib/blendVideo.js`: validar entrada, derivar nombre exacto `${cantidad}t_${acabado}`, buscar master y devolver video o motivo explícito (`invalid-blend`, `unmapped-wrapper`, `video-not-found`). Sin fallback silencioso a otra mezcla. | Aprobar contrato y política de no abrir reproducción automática si falta correspondencia o master; definir cómo comunicar ese caso antes de implementar. |

La firma, nombres de motivos y ubicación de la configuración son propuestas técnicas pendientes. El catálogo solo distingue cantidad y acabado: no hay evidencia de secuencias por variedad de tripa o capote; no prometer reproducción exacta de todas las hojas elegidas.

### Siguiente paso exacto para retomar

1. Leer este bloque, revisar `git status` y **pedir al usuario respuesta a las tres decisiones**, incluyendo ambos acabados. No implementar ni asumir aprobación por reanudar la conversación.
2. Una vez aprobadas las reglas y autorizada la implementación: extraer el catálogo fijo a un módulo compartido; añadir la configuración explícita y `blendVideo.js` sin React, Zustand, red, almacenamiento ni efectos. Consumir selecciones actuales en `startCrafting()` y reutilizar la resolución de perfiles/variantes existente. Determinar el catálogo de entrada reutilizando `getAnimationCatalog()` donde corresponda.
3. Mantener **intactos `ScrollVideo` y la selección manual de «Ver recorridos»**, según instrucción expresa. No se necesita cambiar los contratos de `CigarResult`/`LeafGrid` para leer selecciones en la página.
4. Validar reglas aprobadas para 2–5 tripas y ambas capas; IDs/categorías inválidos, duplicados, mezcla incompleta, configuración o video ausente; edición de mezcla y reapertura; selección manual y variantes conservadas. Ejecutar las comprobaciones pertinentes tras implementar, sin atribuir al código nuevo pruebas históricas.
5. Después de cerrar selección automática, revisar **carga, errores y reintentos** del reproductor como tarea siguiente. SEO, traducciones y ajustes visuales siguen fuera del alcance de esta prioridad; sus pendientes no se dan por aprobados ni cerrados.

`src/lib/blendVideo.js` **no existe todavía**. No se cambió código de producto ni se instalaron dependencias durante el diagnóstico y la pausa.

### Estado de Git al pausar

- Rama: `3d-ux-exploration`. HEAD: `46f615f` (asunto: `commit`). No se creó ningún commit en esta sesión.
- Árbol de trabajo: **37 rutas pendientes**, todas Markdown: 26 modificadas, 10 eliminadas por consolidación y `docs/STATUS.md` nuevo/sin seguimiento. No hay cambios en staging. Conservar este trabajo documental; las eliminaciones forman parte del squash documentado abajo.
- Los cambios están escritos en disco pero **sin commit**; `docs/STATUS.md` no aparecerá en un `git diff` normal hasta que se incluya en el índice. No se ejecutó `git add`.
- `git diff --check` correcto. Git permite comprobar archivos en disco, no buffers de editor sin guardar; no se afirma haber inspeccionado estos últimos. La lista exacta se obtiene con `git status --short` y el contenido rastreado con `git diff`.
- En este cierre solo se actualiza `docs/STATUS.md`; no se ejecutan nuevas pruebas funcionales ni builds, por tratarse de una pausa documental.

## Terminado

- Internacionalización ES/EN/FR/ZH-CN, rutas localizadas, catálogos y metadatos: [I18N](I18N.md).
- SEO local: shells HTML por ruta, canonical/alternates, sitemap y manifests. La verificación del alojamiento sigue pendiente: [SEO](SEO.md).
- Exploración, diez imágenes conceptuales y set artístico **H1/O2/L1/C1 implementado y validado funcionalmente**: [estado artístico](3d-exploration/PROGRESS.md).
- Primera optimización del reproductor: scheduler, cachés y perfiles de frames. No equivale a resolver toda la fluidez: [arquitectura](scroll-video-optimization.md).

## Pendientes confirmados

| Prioridad propuesta | Trabajo | Evidencia y criterio de cierre |
| --- | --- | --- |
| Alta | Vincular mezcla y secuencia, o presentar explícitamente el recorrido como demostración genérica | `src/pages/CraftYourCigar.jsx`, `startCrafting()` abre siempre `listVideos[1]`. Definir el comportamiento y comprobar mezclas distintas sin inventar correspondencias. |
| Alta | Mejorar inicio y error del reproductor | `src/components/ScrollVideo.jsx`: cierre del loader por tiempo y ausencia de reintento visible. Mostrar el primer frame útil antes de cerrar la carga y permitir recuperar un fallo de red. |
| Alta antes de publicación | Delimitar herramientas internas | `src/App.jsx` monta `LayoutControlPanel` y `src/main.jsx` monta `CentralLogViewer` sin gate en el punto de montaje. Decidir acceso de edición/diagnóstico para visitantes y verificar la salida pública. |
| Media | Reducir carga inicial heredada | `index.html` carga jQuery, Bootstrap y plugins; `src/App.jsx` importa páginas directamente. Revisar usos antes de retirar scripts y separar rutas sin romper overlays, i18n o navegación. |
| Media | Medir y mejorar fluidez del reproductor | Medir target→bitmap listo, colas, decode y desfase solicitado/dibujado; comparar assets de menor resolución y presupuestos por dispositivo. Probar Safari/iOS y equipos físicos. Las cifras del 24/09 no describen automáticamente el código actual. |
| Media | Completar narrativa de los cinco pasos del reproductor | Etiquetas «Paso N» sin explicación del proceso; requiere contenido editorial validado. |
| Menor | Reparar conversor de miniaturas | `scripts/convert.sh` sigue apuntando a `src/assets/full` y `src/assets/thumbs`; el inventario está en `public/assets`. Corregir rutas y creación de salida antes de regenerar. |

Las prioridades son una propuesta para decidir el siguiente trabajo, no autorización para ejecutar todos los cambios.

## Decisiones y validaciones pendientes

- **Aceptación visual:** refinamiento H1, paleta fija de O2 y aproximaciones SVG L1/C1. H1 tiene estiramiento de vetas en los rizos; L1/C1 no reproducen refracción/volumen físico. Detalle y capturas en los registros de cada pieza.
- **Datos:** `src/data/masterBlends.js` está vacío; la carga de mezcla maestra no puede validarse por UI hasta disponer de datos reales. No bloquea la selección manual ya comprobada.
- **Producto:** decidir si autenticación y formularios locales son suficientes para la entrega prevista o necesitan backend. Revisar editorialmente traducciones, afirmaciones y datos técnicos antes de publicar.
- **Despliegue:** no hay verificación de producción en esta revisión. Comprobar entradas directas, recargas, HTTP 404, anclas, retorno de login y previews sociales en el alojamiento real; revisar configuración del CDN.
- **Deuda técnica:** el cierre artístico registró 270 errores y 2 avisos de lint global, junto al aviso de tamaño de chunks. Son resultados históricos; medir el estado vigente antes de planificar su corrección.

C1 «Anatomía de tu cigarro», C2/C3 y demás conceptos de reserva son **opciones futuras**, distintas de ART-C1 «Haz suspendido». No son tareas pendientes del set seleccionado.

## Consolidación documental

Se fusionaron los planes `ART-*-NEXT-STEPS` y QA individuales en cada `ART-*-PROGRESS`; la revisión conjunta en `ART-INTEGRATION-PROGRESS`; generación conceptual en la galería; el plan i18n implementado en `I18N.md`. Se retiraron diez Markdown redundantes y cronologías completadas. Se conservaron prompts, imágenes, logs y mediciones únicas. Se verificaron los enlaces locales de los 31 Markdown resultantes y los SHA-256 de las diez imágenes conceptuales; `git diff --check` pasó. Las auditorías y propuestas conservadas se identifican como históricas.
