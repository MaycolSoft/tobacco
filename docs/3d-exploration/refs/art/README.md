# TOBACCO — Referencias artísticas 3D

Imágenes conceptuales para evaluar forma, material y escala. No son modelos 3D ni assets de producción. Generación: imagegen integrada. Las maquetas editan copias de las capturas Playwright; pueden introducir pequeñas variaciones raster y no prueban fidelidad de implementación.

| Concepto | Ubicación prevista | Imagen del objeto | Imagen integrada | Tecnología propuesta por Claude | Observaciones visuales |
|---|---|---|---|---|---|
| ART-H1 · Cinta del cultivo | Inicio · #recorrido, debajo de VER EL RECORRIDO | [Objeto](ART-H1-object.png) | [Maqueta](ART-H1-page-mockup.png) | SVG + GSAP; alternativa R3F con cinta paramétrica | Nervaduras, transición pátina/bronce/clarete y hélice abierta; referencia para comparar solución ligera. |
| ART-H1 · Variante orgánica | Misma sección y encuadre de H1 aprobado | [Objeto vegetal](ART-H1-organic-object.png) | [Maqueta vegetal](ART-H1-organic-page-mockup.png) | Referencia para comparar SVG + GSAP y geometría texturizada; sin implementación | Hoja curada cálida, arrugas, nervaduras y bordes naturales; enrollado irregular sin metal rojo. |
| ART-L1 · Anillo de espécimen | Biblioteca · ficha de hoja | [Objeto](ART-L1-object.png) | [Maqueta](ART-L1-page-mockup.png) | R3F + drei, TorusGeometry y transmisión; fallback SVG | Resina casi incolora, profundidad ámbar, arco fino de bronce; oclusión delante y detrás de la hoja. |
| ART-O2 · Nudo de tres capas | El oficio · #proceso, bajo el lead | [Objeto](ART-O2-object.png) | [Maqueta](ART-O2-page-mockup.png) | CSS 3D + GSAP; alternativa tres TorusGeometry | Tres grosores distintos, inclinaciones intermedias, satén/papel/cera. |
| ART-C1 · Haz suspendido | Crea tu cigarro · franja superior del panel Tu mezcla | [Objeto](ART-C1-object.png) | [Maqueta](ART-C1-page-mockup.png) | R3F, planos curvados y cintas; fallback SVG con imágenes recortadas | Tres láminas, resina ámbar y envoltura suelta; extremos abiertos. Ilustra conjunto completo, no el estado parcial de selección de la captura. No confundir con C1 Anatomía. |

## Fuentes y prompts

- [Prompts artísticos originales](../../CODEX_ARTISTIC_IMAGE_PROMPTS.md)
- [Propuesta artística consolidada](../../04_ARTISTIC_3D_EXPLORATION.md)
- [Progreso y prompts utilizados](../../CODEX_GENERATION_PROGRESS.md)
- Capturas base: [Inicio](../../../../design-review/desktop/inicio-recorrido.png), [Ficha](../../../../design-review/desktop/hoja-detalle.png), [Proceso](../../../../design-review/desktop/proceso.png), [Mesa](../../../../design-review/desktop/crea-tu-cigarro-mezcla.png).

Cada imagen tiene un archivo `.prompt.txt` contiguo. Consultar el progreso para distinguir resultados guardados de imágenes pendientes. La petición actual de conservar la interfaz prevalece sobre los prompts anteriores que pedían texto ilegible.

## Comparar las dos direcciones H1

| Dirección | Objeto aislado | En la sección aprobada | Lectura |
|---|---|---|---|
| Original satinada | [Abrir](ART-H1-object.png) | [Abrir](ART-H1-page-mockup.png) | Geometría regular, pátina/bronce/clarete; composición aprobada y conservada. |
| Orgánica | [Abrir](ART-H1-organic-object.png) | [Abrir](ART-H1-organic-page-mockup.png) | Textura vegetal, nervaduras y bordes naturales, marrones cálidos; enrollado irregular. |

La segunda maqueta utiliza la primera aprobada como imagen objetivo y sustituye únicamente la dirección del objeto. Ambas tienen el mismo tamaño de imagen. La regeneración puede producir variaciones mínimas de rasterizado; no se ha alterado código ni la primera imagen.
