# TOBACCO — Referencias artísticas 3D

Imágenes conceptuales para evaluar forma, material y escala. No son modelos 3D ni assets de producción. Generación: imagegen integrada. Las maquetas editan copias de las capturas Playwright; pueden introducir pequeñas variaciones raster y no prueban fidelidad de implementación.

| Concepto | Ubicación prevista | Imagen del objeto | Imagen integrada | Tecnología propuesta por Claude | Observaciones visuales |
|---|---|---|---|---|---|
| ART-H1 · Cinta del cultivo | Inicio · #recorrido, debajo de VER EL RECORRIDO | [Objeto](ART-H1-object.png) | [Maqueta](ART-H1-page-mockup.png) | SVG + GSAP; alternativa R3F con cinta paramétrica | Nervaduras, transición pátina/bronce/clarete y hélice abierta; referencia para comparar solución ligera. |
| ART-H1 · Variante orgánica | Misma sección y encuadre de H1 aprobado | [Objeto vegetal](ART-H1-organic-object.png) | [Maqueta vegetal](ART-H1-organic-page-mockup.png) | Referencia orgánica implementada después con Three lazy | Hoja curada cálida, arrugas, nervaduras y bordes naturales; enrollado irregular sin metal rojo. |
| ART-L1 · Anillo de espécimen | Biblioteca · ficha de hoja | [Objeto](ART-L1-object.png) | [Maqueta](ART-L1-page-mockup.png) | R3F + drei, TorusGeometry y transmisión; fallback SVG | Resina casi incolora, profundidad ámbar, arco fino de bronce; oclusión delante y detrás de la hoja. |
| ART-O2 · Nudo de tres capas | El oficio · #proceso, bajo el lead | [Objeto](ART-O2-object.png) | [Maqueta](ART-O2-page-mockup.png) | CSS 3D + GSAP; alternativa tres TorusGeometry | Tres grosores distintos, inclinaciones intermedias, satén/papel/cera. |
| ART-C1 · Haz suspendido | Crea tu cigarro · franja superior del panel Tu mezcla | [Objeto](ART-C1-object.png) | [Maqueta](ART-C1-page-mockup.png) | R3F, planos curvados y cintas; fallback SVG con imágenes recortadas | Tres láminas, resina ámbar y envoltura suelta; extremos abiertos. Ilustra conjunto completo, no el estado parcial de selección de la captura. No confundir con C1 Anatomía. |

## Fuentes y prompts

- [Prompts artísticos originales](../../CODEX_ARTISTIC_IMAGE_PROMPTS.md)
- [Propuesta artística consolidada](../../04_ARTISTIC_3D_EXPLORATION.md)
- [Estado de implementación](../../PROGRESS.md); inventario de generación consolidado abajo.
- Capturas base: [Inicio](../../../../design-review/desktop/inicio-recorrido.png), [Ficha](../../../../design-review/desktop/hoja-detalle.png), [Proceso](../../../../design-review/desktop/proceso.png), [Mesa](../../../../design-review/desktop/crea-tu-cigarro-mezcla.png).

Cada imagen tiene un archivo `.prompt.txt` contiguo. Las diez imágenes finales están guardadas. Los prompts de maqueta empleados preservan la UI real; los prompts exploratorios anteriores no son instrucciones vigentes.

## Comparar las dos direcciones H1

| Dirección | Objeto aislado | En la sección aprobada | Lectura |
|---|---|---|---|
| Original satinada | [Abrir](ART-H1-object.png) | [Abrir](ART-H1-page-mockup.png) | Geometría regular, pátina/bronce/clarete; composición aprobada y conservada. |
| Orgánica | [Abrir](ART-H1-organic-object.png) | [Abrir](ART-H1-organic-page-mockup.png) | Textura vegetal, nervaduras y bordes naturales, marrones cálidos; enrollado irregular. |

La segunda maqueta utiliza la primera aprobada como imagen objetivo y sustituye únicamente la dirección del objeto. Ambas tienen el mismo tamaño de imagen. La regeneración puede producir variaciones mínimas de rasterizado; no se ha alterado código ni la primera imagen.

## Generación completada (19/10/2026)

Diez imágenes finales: H1 original y orgánica, O2, L1 y C1, cada dirección con objeto y maqueta. Prompts exactos `.prompt.txt` contiguos; las capturas originales se conservaron. Las tecnologías de la tabla son propuestas históricas; H1/O2 terminaron con Three y L1/C1 con SVG.

La maqueta C1 se corrigió una vez por tamaño, extremos cortados y brillo ámbar excesivo. [Borrador conservado](drafts/ART-C1-page-mockup-v1.png). El resultado muestra la composición completa aunque la captura base tenía selección parcial; no representa el estado real del store. La franja conceptual no fija medidas de producción. Se conservan relaciones de aspecto generadas y pequeñas variaciones raster de texto/escala: no equivalen a capturas de la implementación.

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
