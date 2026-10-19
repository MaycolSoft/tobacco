# ART-H1 — Implementación

2026-10-19. Handoff leído completo. Autorizado: únicamente `three` nueva dependencia; GSAP existente; sin cursor; poster ≤1080px, reduced motion/saveData/error; lazy y dispose. Sin commits, sin cambios al reproductor.

## Avance
- [x] Revisar handoff y assets requeridos.
- [x] Generar albedo cenital desde fotografía real; derivar alpha y normal, producir posters.
- [x] Montar poster sin alterar altura de sección.
- [x] Escena con deformación orgánica reversible, lazy y limpieza.
- [x] Playwright desktop/móvil/tablet/reduced motion, consola y navegación.
- [x] Ejecutar lint, unitarias, e2e y revisión visual (lint global falla por deuda previa; detalle abajo).

## Decisiones
El concept art aprobado es referencia de material/composición, nunca textura UV. La textura se genera plana sin luz horneada; alpha y normal se derivan para mantener alineación. Las skills opcionales gsap-scrolltrigger y lightweight-3d-effects no están disponibles; se sigue el handoff y documentación oficial.

## Assets y primera implementación
Assets generados con imagegen integrada usando CAPA HABANA real y referencia aprobada. Alpha/normal derivados con canvas offline y cwebp. Fuentes PNG y prompts conservados. `three` 0.186.1 es la única dependencia añadida, lockfile actualizado sin otras versiones modificadas. Chunk lazy medido: 131.68 KB gzip (incluye renderer).

Geometría CPU de 240×8 segmentos (~3840 triángulos), integración de tangentes por longitud de arco, cinco vueltas con irregularidades fijas y envés oscurecido. No acumulativa: progress determina toda la geometría. Normal map, material seco roughness .91, metalness 0. GSAP scrub .6 y idle pausado por visibilidad/document.hidden. Assets GPU/renderer/contexto y triggers liberados al desmontar o cambiar capacidades.

Primera verificación: build pasa; 19 unitarias pasan; lint de archivos nuevos pasa. Lint global falla por deuda preexistente (270 errores/2 warnings), incluyendo el patrón Icon JSX ya presente en Home; se conserva alcance ART-H1. Playwright en curso.

## Revisión visual — primer intento
El primer enrollado se ve demasiado estrecho y comprimido en la derecha, con lectura de cordón en vez de hoja: radio insuficiente y taper UV excesivo. Se mantiene la técnica autorizada y se corrigen longitud de arco, relación radio/paso, anchura y muestreo UV; no se sustituye por otra solución. Los primeros tests pasan reversibilidad/layout/lazy pero fallan por warnings GPU ReadPixels al capturar en Chromium y por un mock saveData incompleto (sin EventTarget), no por el shader. Se investigan ambos antes de cerrar.

Segundo ajuste visual: radio y superficie ya visibles; se detectó solape de vueltas al final (anchura mayor que paso). Se reduce solo la franja enrollada, conservando extremo extendido ancho y geometría continua, para abrir huecos reales y evitar lectura de tubo.

## Rendimiento — variabilidad detectada
La suite funcional completa pasó (20 tests), pero al añadir medición de rendimiento a la suite una ronda registró tareas largas de 63 y 81 ms (CLS 0); la medición aislada anterior no registró ninguna. No se toma una sola pasada como garantía. Optimización: reutilizar vectores, normales analíticas de la cinta en vez de recalcular todas las caras, aplicar deformación solo antes de dibujar, limitar render decorativo a 30 fps, DPR máximo 1.5 y anisotropía 2. Se repite medición tres veces.

Advertencia de consola de Chromium durante screenshots: `GPU stall due to ReadPixels`. Es la lectura de framebuffer para captura del driver, sin error de shader; el test la filtra explícitamente y conserva errores de aplicación/Three/WebGL. No se ha silenciado consola de producción.

Recarga: MainLayout ya hace scrollTo(0,0). Se conserva; prueba de recarga simula restauración posterior de posición y comprueba progreso correcto, sin modificar el layout general.

## Resultado de optimización
Tres mediciones consecutivas (`validation/performance-optimized.json`): 0 tareas largas >50 ms, CLS 0; máximos intervalos rAF 17.9 / 24.4 / 20.2 ms. Medición local Chromium, no garantía de hardware ajeno. Se mantiene test de rendimiento en la suite.

## Alcance final
Home solo añade import y montaje en segunda columna de #recorrido. CSS nuevo enteramente ligado al objeto/ancla. No se toca App.jsx, rutas, i18n, site-editorial.css ni ScrollVideo. Package/lockfile solo incorporan three. Sin @gsap/react ni otras dependencias. Sin commits.

## Límites de referencia
La escena es geometría texturizada deformable, no el render del concept art: las vueltas y la iluminación no son idénticas al póster. Los pósteres se generaron con la misma referencia fotográfica, pero no son renders de esta malla. Los mapas normales se aproximan desde luminancia; no se presentan como un escaneo físico. En móvil el póster se ajusta al padding inferior disponible para conservar exactamente la altura de sección.

Referencias técnicas consultadas: [Three.js](https://threejs.org/docs/) y [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).

## Validación final
- Build correcto, chunk lazy ART-H1 + Three: **132.55 KB gzip**. Warning de tamaño >500 KB sin comprimir (también existe en bundle principal); no se modificó configuración global para ocultarlo.
- **21 e2e pasan** en la última suite completa (`validation/e2e-final.log`): desktop, scroll 0/.5/1/.5/0, lazy, altura ±2 px, no solape con textos, 390/860/861/1080 px sin canvas ni descarga de Three/texturas, reduced motion, cambios de breakpoint, saveData, contexto perdido, textura fallida, desmontaje/navegación, pestaña oculta, anclas/restauración y en/fr/zh-CN.
- **19 unitarias pasan**. `npm run lint` ejecutado: 270 errores y 2 warnings preexistentes; los archivos nuevos pasan ESLint. El Icon de Home ya fallaba antes de esta tarea y no se alteró. `git diff --check` correcto.
- La medición se separa del tracing automático de screenshots del driver GPU; se mantienen capturas explícitas. Playwright requiere desactivar trace a nivel de archivo (no describe). La ronda final sin tracing pasa con CLS 0 y sin tareas largas; se conserva también el registro de 170 ms con tracing para no ocultar variabilidad.
- Consola: ningún error de aplicación, shader o WebGL en los recorridos normales. Los avisos ReadPixels asociados a screenshots se identifican por separado en el test.

### Capturas de la implementación (no concept art)
- [Desktop — plano](validation/desktop-0.png), [intermedio](validation/desktop-0.5.png), [enrollado](validation/desktop-1.png).
- [Móvil 390](validation/poster-390.png), [860](validation/poster-860.png), [tablet 861](validation/poster-861.png), [tablet 1080](validation/poster-1080.png).
- [Métricas finales](validation/performance-final.json), [tres rondas optimizadas](validation/performance-optimized.json), [métrica con tracing](validation/performance-with-tracing.json).

### Estado
Implementación lista para revisión visual. Se mantiene Three y deformación real de geometría; no se sustituyó la animación por secuencia raster ni SVG. Los ajustes y límites visuales quedan documentados arriba. No se hicieron commits.
