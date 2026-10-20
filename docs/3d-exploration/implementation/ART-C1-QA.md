# ART-C1 — QA independiente

Actualización del coordinador: los cinco casos también pasaron sobre el build de producción. Ver [cierre conjunto](ART-INTEGRATION-PROGRESS.md); las comprobaciones individuales siguientes conservan su contexto original.

Fecha: 2026-10-20. Validación sobre Vite local `127.0.0.1:5176`, Chromium, escritorio 1440×1000 y móvil 390×844. Suite: [craft-sculpture.spec.js](../../../tests/craft-sculpture.spec.js).

## Resultado funcional

**5 pruebas Playwright pasan, 21,3 segundos.** Ejecución con configuración temporal eliminada después; las pruebas quedan compatibles con la configuración habitual del repositorio.

- Estado vacío y selección mediante controles reales: 0 → 5 hojas de tripa; quitar una → 4 láminas. Capote y capa aparecen únicamente después de seleccionar cada categoría.
- El foco de quitar hoja prima sobre hover de otra fila: lámina enfocada opacidad 1, otra 0,4. Los botones siguen funcionando.
- Abrir guía detiene movimiento; cerrar guía permite continuar. Resultado desmonta la escultura.
- Cambiar ES/EN/FR/ZH mantiene dos tripas y cinta de capa.
- Móvil, reduced motion y Save-Data muestran composición estática; sin desbordamiento horizontal.
- Sin errores de consola ni de página en el recorrido completo de selección/guía/resultado. Ninguna petición Three ni `leafRibbonRenderer` en Craft.

La carga mediante mezcla del maestro **no pudo probarse mediante UI**: `src/data/masterBlends.js` contiene una lista vacía y el componente se oculta. No se inventaron mezclas ni se modificó inventario. La selección manual y su conservación entre idiomas sí se validaron.

## Revisión visual

Capturas: [objeto completo](validation/art-c1/complete-object.png), [página escritorio](validation/art-c1/complete-desktop.png), [página móvil](validation/art-c1/complete-mobile.png). Comparadas visualmente con [concepto](../refs/art/ART-C1-object.png).

La imagen generada por SVG conserva las láminas, cintas vegetales, extremos abiertos y fotografía cálida. No invade controles; el resumen mantiene legibilidad y las cintas aparecen con cambios reales de selección. En móvil ocupa una franja de 100 px y conserva acceso al resultado y guía.

**La fidelidad volumétrica sigue limitada.** Las láminas parecen recortes planos, con menor separación y profundidad que el concepto; la cinta ámbar es sólida y no reproduce transmisión vegetal. No se considera equivalencia con el concept art 3D. Se acepta funcionalmente la alternativa SVG documentada, con revisión estética pendiente del usuario.

Mejoras propuestas, sin aplicar en QA: variar ligeramente silueta e inclinación por lámina; sombras locales entre capas; diferenciar frente/dorso de cintas para expresar oclusión; aclarar la cinta ámbar y oscurecer su reverso. Si esos cambios no bastan, documentar la diferencia y evaluar Three antes de sustituir tecnología.

## Alcance

No se editó código de producto, dependencias ni ART-H1. No se hicieron commits. La validación de build y regresión global corresponde al coordinador; estos cinco resultados no sustituyen esa revisión.
