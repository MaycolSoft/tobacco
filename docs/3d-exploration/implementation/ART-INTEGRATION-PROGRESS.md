# Integración artística — continuación paralela

> 2026-10-20. El usuario solicita continuar todo el set seleccionado y utilizar al menos siete subagentes. Límite del entorno: tres subagentes simultáneos; trabajo por tandas. Sin instalaciones ni commits.

## Alcance

- Conservar ART-H1. Al iniciar ya existían cambios en `leafRibbonRenderer.js`, su documento de progreso y cinco capturas `refine-desktop-*`; pertenecen al estado previo y no se sobrescriben.
- Implementar ART-O2 (El oficio), ART-L1 (ficha/inmersivo de Biblioteca) y ART-C1 (haz suspendido en Tu mezcla).
- No ampliar a conceptos alternativos ni modificar el reproductor de frames.
- Usar React, CSS/SVG y librerías existentes; documentar las diferencias respecto de materiales físicos del concept art.

## Trabajo paralelo

1. `o2_implementation`: implementación y documentación O2.
2. `l1_implementation`: implementación y documentación L1.
3. `c1_implementation`: implementación y documentación C1.
4. `l1_qa`: cinco pruebas independientes L1 aprobadas.
5. `c1_qa`: cinco pruebas independientes C1 aprobadas.
6. `o2_qa`: pruebas independientes O2 y comparación visual.
7. `integration_review`: diez ciclos SPA, recursos y tres repeticiones de rendimiento por pieza.

Cada responsable modifica archivos separados. La integración, ejecución conjunta y estado general corresponden al agente principal.

## Verificación inicial

- `npm test`: 19 pruebas aprobadas.
- `npm run build`: aprobado, advertencia existente de chunks >500 kB.
- Regresión i18n Playwright inicial: 9/9 aprobadas.

## Estado

Implementaciones realizadas. Primer pase conjunto parcial: 30/31; falló el benchmark H1 con una tarea de 112 ms mientras otros navegadores de validación estaban activos. Se conserva evidencia; no se modifica H1 ni se debilita su prueba.

Pase completo posterior sin los agentes de QA en navegador: 38/40; H1 pasó con CLS0 y sin tareas largas. Fallaron dos casos O2 al quedarse el modo estático cuando se esperaba WebGL. Ese fallo se resolvió como se describe abajo. Ver `validation/art-integration/e2e-before-o2-fix.log` y los informes individuales.

La causa O2 se reprodujo en producción: un mismo callback de IntersectionObserver entregó primero una salida antigua y después la entrada actual. Leer solo la primera dejaba el objeto visible sin inicializar. Se corrige usando la última observación, sin polling, y se añade una regresión determinista. Evidencia en `validation/art-o2/observer-batch-reproduction.json`. Build + suite completa se repiten después de la corrección.

Lint global: 270 errores y 2 avisos heredados; los componentes nuevos y tests pasan ESLint específico. Build aprobado. No dependencias instaladas ni commits.

## Cierre de implementación

ART-O2, ART-L1 y ART-C1 están integrados. O2 usa Three existente en un renderer lazy independiente; L1 y C1 usan las alternativas SVG descritas en sus propuestas. Se revisaron manualmente las capturas y se documentaron sus diferencias materiales frente al concept art. Las propuestas de reserva (L2, C2, C3, etc.) no se implementaron dentro del set seleccionado.

La suite de producción posterior al fix O2 dio **40/41**: pasaron los diez casos O2 (incluida regresión del observer), cinco L1, cinco C1, doce H1 y ocho i18n. Falló un caso i18n al seleccionar idioma inmediatamente después de cambiar la URL, antes del commit de la vista About: el control todavía retenía la ruta anterior. Se añadió una espera por `#proceso` al test existente, sin modificar navegación ni código i18n. La repetición focalizada dio **5/5 aprobadas en 13.6s**, registrada en `validation/art-integration/route-readiness-final.log`. El resto de los cuarenta casos no cambió después de ese pase. No afirmar que hubo una única ejecución completa 41/41.

Rendimiento: el benchmark de producción O2 registró cero tareas largas y cero desplazamientos atribuibles al objeto; hubo CLS global 0.0003994 con fuentes de texto/pills ajenas a `.layer-knot`. H1 en el pase final: CLS0, cero tareas largas, máximo RAF18ms. Las nueve ventanas adicionales de revisión conjunta tuvieron CLS0; dos tareas aisladas de 53/64ms se conservan sin atribución ni promesas de ausencia absoluta de tirones. Consultar [revisión independiente](ART-INTEGRATION-REVIEW.md) y los JSON de `validation/art-integration/`.

Build: main302.47kB gzip (base298.26), CSS22.95kB gzip, renderer O2 1.04kB gzip y Three compartido lazy130.95kB gzip. Sigue el aviso existente de chunks >500kB; no se cambió la configuración de bundling. La extracción del chunk compartido es automática por los dos imports dinámicos, sin editar H1.

## Continuidad

Consultar los tres documentos `ART-*-PROGRESS.md`, sus `*-QA.md`, este registro y `ART-INTEGRATION-REVIEW.md`. Los límites estéticos conocidos son L1 sin refracción de resina, C1 más plano que el render y O2 con toros lisos sin microtextura. Una futura revisión de esos materiales es una mejora estética; no debe darse por conseguida la fidelidad fotográfica.

ART-H1 conserva exactamente los archivos/capturas modificados que ya estaban presentes al comenzar. Reproductor, dependencias y lockfile no se tocaron. No se hicieron commits. Los servidores de desarrollo temporales se cerraron; Playwright administra su preview de producción.
