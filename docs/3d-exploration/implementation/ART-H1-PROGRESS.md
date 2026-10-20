# ART-H1 — Implementación

2026-10-19. Handoff leído completo. Autorizado: únicamente `three` nueva dependencia; GSAP existente; sin cursor; poster ≤1080px, reduced motion/saveData/error; lazy y dispose. Sin cambios al reproductor. (Nota: Codex escribió «sin commits», pero la implementación quedó registrada en el commit `e41aa65` — `feat(3d): implement organic tobacco leaf scroll animation`.)

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
Home solo añade import y montaje en segunda columna de #recorrido. CSS nuevo enteramente ligado al objeto/ancla. No se toca App.jsx, rutas, i18n, site-editorial.css ni ScrollVideo. Package/lockfile solo incorporan three. Sin @gsap/react ni otras dependencias. Commit: `e41aa65`.

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
Implementación lista para revisión visual. Se mantiene Three y deformación real de geometría; no se sustituyó la animación por secuencia raster ni SVG. Los ajustes y límites visuales quedan documentados arriba. Todo lo anterior está en el commit `e41aa65`.

---

## Refinamiento visual (Claude, 2026-10-19) — pendiente de aprobación

Problemas de la versión `e41aa65`: al 50 % se leía como cinta fina en zigzag; perdía ~79 % de ancho al enrollar; al 100 % vueltas comprimidas tipo cordón.

**Causa**: la tangente mezclaba recta y hélice con `curl = p` (al 50 % = hélice estirada a medias = zigzag), la fase escalaba con `p`, pendiente axial .16 (vueltas pegadas) y el ancho dependía de `u` (estrecho aunque no estuviera enrollado).

**Cambio (solo `deform()` en `src/components/home/leafRibbonRenderer.js`; arquitectura, carga diferida, fallbacks, texturas y material intactos)**:
- El enrollado avanza desde la punta: frente `front = 1 − p·(1 − FLAT)`; detrás del frente la hoja está plana, delante es hélice completa de radio constante. Al 50 % se ve hoja + inicio de espiral, no zigzag.
- Hélice abierta: `RADIUS 1.1`, `SLOPE .34` (paso ≈ 2.5 u > ancho enrollado ≈ 1.67 u → huecos reales, sin intersecciones), irregularidad fija en radio y pendiente (semillas por fase).
- Torsión central: el ancho pasa de vertical en pantalla (hoja plana) a paralelo al eje (banda enrollada), como en el concept art.
- Ancho ligado al grado de enrollado (`COIL_WIDTH .62`), no a `u`: en plano conserva la silueta natural completa.
- `FLAT .5`: mitad izquierda plana al 100 %, como la referencia. UV remap movido a `u > .5`.
- Escala de cámara fija (sin zoom al hacer scroll), centrada en el bounding box deformado. Idle: oscilación leve de `rotation.z` (ya no escribe `mesh.position`, que ahora controla el centrado).

**Capturas (Playwright, 1440×1700, build de producción)**: [0 %](validation/refine-desktop-0.png) · [25 %](validation/refine-desktop-0.25.png) · [50 %](validation/refine-desktop-0.5.png) · [75 %](validation/refine-desktop-0.75.png) · [100 %](validation/refine-desktop-1.png). Capturas de Codex conservadas sin tocar.

**Validación**:
- `tests/leaf-ribbon.spec.js`: 12/12 pasan (reversibilidad 0/.5/1/.5/0, layout ±2 px, lazy, 390/860/861/1080 poster, reduced motion, saveData, contexto perdido, textura fallida, i18n, hash/reload, rendimiento CLS 0).
- Unitarias 19/19. ESLint de `src/components/home/` limpio. Build OK; chunk lazy 132.74 KB gzip (+0.2 KB).
- Consola: solo `GPU stall due to ReadPixels` (driver, provocado por las capturas).

**Límites conocidos**: la parte enrollada estira la textura ~2.7× a lo largo (vetas alargadas); ~2.5 vueltas frente a ~3.5 del concept art; el 0 % no es visible en un viewport normal (el trigger empieza con la sección al 70 %).

**Próximas tareas**: aprobación visual del usuario → commit → ART-O2 (no iniciado).

**Revisión por subagentes**:
- Revisión de código: 0 bloqueantes. Aplicado: recentrado con `mesh.quaternion` (antes ignoraba la rotación), guard si `across` colapsa, comentario de estiramiento corregido. Pendiente menor: el idle (±0.01 rad) no recentra; la hoja en reposo queda espejada en vertical respecto a `e41aa65` (normales coherentes).
- Revisión visual vs concept art: zigzag del 50 % resuelto; vueltas abiertas sin colisiones. Gaps restantes, por prioridad: (1) vetas estiradas en los rizos, (2) falta torsión helicoidal 180–270° antes de los rizos, (3) radio/paso demasiado regulares y rizos algo por debajo del eje, (4) silueta plana más lanceolada (4:1 vs 2.5:1), (5) tono más rojizo que el ocre del concept, (6) relieve suave, (7) objeto pequeño vs mockup (×1.3–1.5). Los puntos 4, 5 y 7 tocan textura/color/posición, que se pidió conservar: requieren decisión del usuario.
- Tras las correcciones: e2e 12/12, build y lint OK; capturas `refine-desktop-*` regeneradas.
