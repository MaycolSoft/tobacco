# Progreso de generación conceptual

Fecha: 2026-10-19. Herramienta: imagegen integrada. Solo referencias raster; sin cambios de código.

## Estado

- [x] ART-H1-object.png — generada; destino `refs/art/ART-H1-object.png`
- [x] ART-H1-page-mockup.png — generada; destino `refs/art/ART-H1-page-mockup.png`
- [x] ART-L1-object.png — generada; destino `refs/art/ART-L1-object.png`
- [x] ART-L1-page-mockup.png — generada; destino `refs/art/ART-L1-page-mockup.png`
- [x] ART-O2-object.png — generada; destino `refs/art/ART-O2-object.png`
- [x] ART-O2-page-mockup.png — generada; destino `refs/art/ART-O2-page-mockup.png`
- [x] ART-C1-object.png — generada; destino `refs/art/ART-C1-object.png`
- [x] ART-C1-page-mockup.png — generada; destino `refs/art/ART-C1-page-mockup.png`

## Método y fuentes

Prompts originales: `CODEX_ARTISTIC_IMAGE_PROMPTS.md`; paleta y tecnología: `04_ARTISTIC_3D_EXPLORATION.md` y `04-parts/`. Maquetas mediante edición de capturas reales, preservando texto y UI conforme al encargo actual. No sobrescribir originales.

## Prompts y resultados

Los prompts exactos usados están guardados junto a cada PNG, con sufijo `.prompt.txt`. Los originales siguen en `CODEX_ARTISTIC_IMAGE_PROMPTS.md`; las adaptaciones de maqueta preservan UI real y describen la captura objetivo y el objeto de apoyo.

## Problemas

Las maquetas generativas conservan la composición, pero presentan pequeñas variaciones raster de tipografía y escala. No equivalen a capturas de una implementación. El modelo entrega algunas relaciones de aspecto distintas de las sugeridas (O2 cuadrado, L1 vertical más alargado); se conservan sin recortes destructivos porque permiten evaluar las piezas.

## Próximos pasos

Trabajo completado. Próximo paso: comparar las referencias y decidir dirección visual antes de aprobar desarrollo.

### ART-H1 objeto
Generado con imagegen: cinta estrecha satinada, tramo plano pátina con nervaduras, torsión bronce, hélice de 5–6 vueltas clarete, fondo negro cálido. Fuente: prompt original H1(a), con huecos explícitos para evitar forma literal de cigarro. Prompt de referencia: `refs/art/ART-H1-object.prompt.txt`.

### ART-H1-page-mockup
Archivo: refs/art/ART-H1-page-mockup.png. Prompt exacto: refs/art/ART-H1-page-mockup.prompt.txt. Herramienta: imagegen integrada.

## Ampliación solicitada: H1 orgánica

Conservar la composición y los dos archivos H1 originales. Añadir segunda dirección vegetal realista, sin metal rojo ni aspecto industrial.
- [x] ART-H1-organic-object.png — generada; destino refs/art/ART-H1-organic-object.png
- [x] ART-H1-organic-page-mockup.png — generada; destino refs/art/ART-H1-organic-page-mockup.png

### ART-L1-object
Archivo: refs/art/ART-L1-object.png. Prompt exacto: refs/art/ART-L1-object.prompt.txt. Herramienta: imagegen integrada.

### ART-H1-organic-object
Archivo: refs/art/ART-H1-organic-object.png. Prompt exacto: refs/art/ART-H1-organic-object.prompt.txt. Herramienta: imagegen integrada.

### ART-L1-page-mockup
Archivo: refs/art/ART-L1-page-mockup.png. Prompt exacto: refs/art/ART-L1-page-mockup.prompt.txt. Herramienta: imagegen integrada.

### ART-O2-object
Archivo: refs/art/ART-O2-object.png. Prompt exacto: refs/art/ART-O2-object.prompt.txt. Herramienta: imagegen integrada.

### ART-H1-organic-page-mockup
Archivo: refs/art/ART-H1-organic-page-mockup.png. Prompt exacto: refs/art/ART-H1-organic-page-mockup.prompt.txt. Herramienta: imagegen integrada.

### ART-C1-object
Archivo: refs/art/ART-C1-object.png. Prompt exacto: refs/art/ART-C1-object.prompt.txt. Herramienta: imagegen integrada.

## Revisión visual parcial

- H1 original: geometría continua, nervaduras, transición pátina/bronce/clarete y 5–6 vueltas abiertas. En maqueta no tapa texto ni enlace. Composición aprobada por el usuario; archivos originales conservados.
- H1 orgánica: superficie vegetal mate, venas y bordes irregulares, ocres y marrones cálidos, vueltas menos uniformes. La imagen aislada muestra menos vueltas que la dirección satinada; prima el nuevo pedido de naturalidad. Integración en el encuadre aprobado, sin ocultar CTA ni titulares.
- L1: resina translúcida con profundidad ámbar y arco de bronce; buena separación delante/detrás de la hoja. La maqueta mantiene la foto de la ficha y deja despejado el CTA.
- O2 objeto: tres anillos y grosores diferenciados, materiales satinados/papel/cera e inclinaciones distintas. El estudio ocupa más encuadre que el 50 % sugerido, adecuado para revisar material.
- C1 objeto: tres láminas fibrosas paralelas, extremos abiertos, cinta translúcida y exterior opaco. El ámbar es intenso en estudio; se pide menor intensidad en la maqueta para no competir con la UI.

Estas imágenes sirven para modelado futuro; transmisión, sombras y materiales complejos de los estudios no implican que SVG/CSS vaya a reproducir cada efecto óptico. No se implementó GSAP, SVG ni R3F.

### ART-O2-page-mockup
Archivo: refs/art/ART-O2-page-mockup.png. Prompt exacto: refs/art/ART-O2-page-mockup.prompt.txt. Herramienta: imagegen integrada.

### ART-C1-page-mockup
Archivo: refs/art/ART-C1-page-mockup.png. Prompt exacto: refs/art/ART-C1-page-mockup.prompt.txt. Herramienta: imagegen integrada.

## Ajuste de calidad C1

La primera maqueta sobredimensionó la franja, recortó extremos del objeto y elevó demasiado el brillo ámbar. Borrador preservado en `refs/art/drafts/ART-C1-page-mockup-v1.png`. Se solicita una única corrección: encajar objeto entero con margen en franja 2:1 y reducir exposición.

La maqueta C1 ilustra el conjunto completo propuesto, aunque la captura real muestra dos hojas seleccionadas y capote/capa pendientes. Se conservan los textos reales: no es simulación del estado de datos. En la futura implementación deben aparecer solo las capas seleccionadas, como prescribe Claude.

### ART-C1-page-mockup
Archivo: refs/art/ART-C1-page-mockup.png. Prompt exacto: refs/art/ART-C1-page-mockup.prompt.txt. Herramienta: imagegen integrada.

## Cierre y validación

10 imágenes finales guardadas: ocho del encargo original más dos de H1 orgánica. Todos los enlaces relativos del README y los diez prompts contiguos comprobados. Sin generaciones duplicadas: una única corrección de calidad justificada en C1, con borrador preservado.

O2 integrada: los tres anillos encajan bajo el lead, sobre la línea divisoria, sin tapar pills ni fotografía. C1 corregida: objeto completo visible dentro del panel, sin extremos recortados, ámbar reducido y controles despejados; conserva las limitaciones de estado parcial descritas arriba. La franja final sigue algo más alta que la proporción 2:1 ideal: referencia conceptual, no medida de implementación.

Revisión global: geometrías y materiales distinguibles, identidad oscura editorial conservada, CTA y textos principales despejados. Las maquetas son ediciones generativas, no copias píxel a píxel. No se modificó React, GSAP, ScrollTrigger, frames, capturas originales ni recomendaciones. No se instalaron dependencias ni se realizaron commits.

### Inventario final

- `refs/art/ART-C1-object.png` — 1774×887; SHA-256 `ff63bceef0f5e83b6bfab8d39c34231883f77aa49bac78c6cfbd48ee4df5b0cf`
- `refs/art/ART-C1-page-mockup.png` — 967×1627; SHA-256 `0dc98e14161d99fc1490136645cc5bf6791fc2d18d0f57d5934fa5b7952c2361`
- `refs/art/ART-H1-object.png` — 1916×821; SHA-256 `cd79e528c02e0a5317bd790c6fd123eec6c17651f1799cd0d7472db1d96cd533`
- `refs/art/ART-H1-organic-object.png` — 1916×821; SHA-256 `964bafa82ec03206ddb28a863d847ce486dc6aff4e27ca1eb728b69373c862a4`
- `refs/art/ART-H1-organic-page-mockup.png` — 1505×1045; SHA-256 `34c091a93d94921b0feaf277071145a17fba63cdfc1d2cdc8c97a837976bd6d6`
- `refs/art/ART-H1-page-mockup.png` — 1505×1045; SHA-256 `dbed5223de03c467ff33727e6448ae9e2f3efdc95af740ce4559f21a94d7ed97`
- `refs/art/ART-L1-object.png` — 1024×1536; SHA-256 `2f03b38d836c25b4d27711af701c6472dcbac2ce39020efaf7afa6a44fd0ae29`
- `refs/art/ART-L1-page-mockup.png` — 1505×1045; SHA-256 `86f03bc61f1385ef5f7592dcb815abda44e8dc54ca3b6570e6729fe69fba569c`
- `refs/art/ART-O2-object.png` — 1254×1254; SHA-256 `15d3b4deb8f2410bf9b74df3852bf508f37a75a88da1018b512fcf3fbfd6bd5b`
- `refs/art/ART-O2-page-mockup.png` — 1505×1045; SHA-256 `cee84a32c83ae042cf6d24beddd78411a69557dac40f259e43dbf0573c8fd750`
