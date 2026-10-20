# ART-L1 — Validación independiente

20 de octubre de 2026. Agente QA independiente de la implementación.

Actualización del coordinador: los cinco casos también pasaron sobre el build de producción. Ver [cierre conjunto](ART-INTEGRATION-PROGRESS.md); la ejecución dev de abajo se conserva como evidencia previa.

## Resultado

`tests/specimen-ring.spec.js`: **5 pruebas correctas, 16,0 s**, Chromium, servidor Vite coordinado en `127.0.0.1:5176`. Ejecución aislada con configuración temporal; falta el pase integrado sobre el build de producción coordinado por el agente principal.

La primera ejecución no pudo iniciar Chromium por la restricción del sandbox de macOS (`MachPortRendezvousServer`). La ejecución con permiso de navegador pasó todas las pruebas; no fue un fallo del producto.

## Comprobaciones

- Desktop 1440 × 900: CAPA un anillo, CAPOTE dos y TRIPA tres; siguiente espécimen de la misma categoría actualiza el título y conserva su cantidad.
- Dos SVG decorativos `aria-hidden`, `focusable=false`, sin interceptar puntero. Al ocultarlos temporalmente, el ancho y alto de la ficha no cambian en más de 2 px.
- Recorrido inmersivo: capítulos 0 → 1 → 2 → 3 → 2 → 1 → 0; transformación final idéntica a la inicial, cambio efectivo de pose, controles con `aria-current=step`. Wheel avanza y retrocede capítulos.
- Cierre durante una transición, reapertura, Escape con restitución de foco y navegación a «El oficio», sin errores de consola o excepciones de página.
- Móvil 390 × 844: un anillo, pose estática, capítulos utilizables y sin desbordamiento horizontal del documento.
- Reduced motion y save-data en desktop: sin transición de pose entre muestras separadas por 200 ms tras cambiar capítulo. No llamadas a contextos WebGL en ninguno de los tres modos de fallback.

## Revisión visual

Comparado `refs/art/ART-L1-page-mockup.png` con las capturas de esta ejecución. El aro rodea la fotografía original con oclusión delante/detrás y no desplaza el texto. Los anillos son finos y discretos. **El SVG no reproduce la refracción ni el volumen de resina del concept art**: el acabado resulta más próximo a un aro bronceado; esta diferencia es una limitación visual real, no una validación de equivalencia material.

En móvil el título existente «Criollo 98» se parte dentro de su columna estrecha del encabezado. El anillo no causa esa dimensión ni intercepta controles. No se modificó ese encabezado, fuera del alcance de la pieza.

## Evidencia y continuidad

Capturas en [validation/art-l1](validation/art-l1/), incluyendo fichas de las tres categorías, capítulo 3 y las tres alternativas estáticas. Los nombres de subcarpetas son generados por Playwright.

Selectores estables: `.specimen-ring--back`, `.specimen-ring--front`, `data-category`, `data-chapter`, `.specimen-ring__pose`, `.specimen-ring__arc`. Las pruebas no requieren endpoints ni assets nuevos. No dependencias instaladas ni commits.
