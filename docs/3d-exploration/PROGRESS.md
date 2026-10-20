# TOBACCO — 3D & UX Exploration · PROGRESS

> Inicio: 2026-10-19 · Actualizado: 2026-10-20 · Base: `docs/TOBACCO_PROJECT_AUDIT.md`.
> Sesión actual: **implementación paralela del set ART-O2, ART-L1 y ART-C1**, solicitada por el usuario. Sin instalaciones ni commits. ART-H1 y el reproductor de frames se conservan.

## Estado general
**Set seleccionado implementado.** ART-H1 se conserva; O2, L1 y C1 ya están integrados y revisados en escritorio/móvil. El cierre de pruebas, las incidencias corregidas y los límites visuales están en [ART-INTEGRATION-PROGRESS](implementation/ART-INTEGRATION-PROGRESS.md). L1/C1 usan las alternativas SVG: no equivalen al volumen/materiales físicos de los conceptos.

| Entregable | Estado real | Dónde continuar |
|---|---|---|
| Exploración inicial/artística | Documentada, finalizada | `01`–`04`, `04-parts/`, recomendaciones y prompts |
| Concept art | 10 imágenes finales: H1 original y orgánica, O2, L1, C1 (objeto + maqueta por dirección); un borrador C1 conservado | [Galería](refs/art/README.md), [registro](CODEX_GENERATION_PROGRESS.md) |
| ART-H1 orgánica · Home #recorrido | **Implementado y validado; no modificar por ahora** | [Progreso y evidencias](implementation/ART-H1-PROGRESS.md) |
| ART-O2 · El oficio #proceso | Three lazy integrado; diez casos QA aprobados, incluido fix de visibilidad | [Plan](implementation/ART-O2-NEXT-STEPS.md), [progreso](implementation/ART-O2-PROGRESS.md) |
| ART-L1 · Biblioteca | SVG integrado; cinco casos aprobados en producción | [Plan](implementation/ART-L1-NEXT-STEPS.md), [progreso](implementation/ART-L1-PROGRESS.md) |
| ART-C1 · Tu mezcla | SVG integrado; cinco casos aprobados en producción | [Plan](implementation/ART-C1-NEXT-STEPS.md), [progreso](implementation/ART-C1-PROGRESS.md) |
| Otras propuestas | Reserva; fuera del set seleccionado | Exploración y referencias |

Los apartados de agentes y fases de abajo conservan el historial; no describen agentes activos ni autorizan reanudarlos. Los resultados de H1 no constituyen validación de O2.

## Agentes
| Agente | Rol | Archivo | Estado |
|---|---|---|---|
| A | Visual UX Inspector (capturas **solo desktop**) | `../../design-review/desktop/` + `01_VISUAL_ANALYSIS.md` | **finalizado** (31 capturas) |
| ~~A2~~ | ~~Mobile~~ | — | cancelado (usuario: solo desktop) |
| B | 3D Creative Researcher (skills + conceptos) | `02_3D_CONCEPTS.md` | **finalizado** |
| C | Technical Feasibility | `03_TECHNICAL_FEASIBILITY.md` | **finalizado** |
| D | Asset & Prompt Designer | `CODEX_IMAGE_PROMPTS.md` | **finalizado** |
| Main | Consolidación | `../TOBACCO_3D_UX_RECOMMENDATIONS.md` | **finalizado** |

## Entorno de la exploración original (histórico)
- Dev server: `npx vite --host 127.0.0.1 --port 5173 --strictPort --open false` → http://127.0.0.1:5173
- Playwright: `@playwright/test` 1.63 + chromium-1243 instalados.
- Login demo: `/login` con `admin` / `1234` (precargado).
- Skills 3D disponibles: `lightweight-3d-effects`, `gsap-scrolltrigger` (instaladas). En marketplace `claude-design-skillstack` (no instaladas como skill invocable): react-three-fiber, threejs-webgl, spline-interactive, web3d-integration-patterns, substance-3d-texturing → `~/.claude/plugins/marketplaces/claude-design-skillstack/.factory/skills/*/SKILL.md`.

## Tareas completadas
- [x] Lectura de auditoría previa.
- [x] Verificación de entorno Playwright y skills.

## Tareas pendientes
- [x] Capturas desktop (A) → `design-review/desktop/` (actualiza las existentes 1440×1000 + nuevas para 3D; README y manifest actualizados)
- [x] 01 / 02 / 03 / CODEX prompts
- [x] Documento principal

## Capturas realizadas
Decisión usuario (2026-10-19): solo desktop; capturas en `design-review/desktop/` (no en `docs/3d-exploration/screenshots/`).

## Veredictos técnicos (C)
- WebGL: CigarResult (mejor), Home CTA (lazy+IO), Home hero (con reservas), guía (SVG primero).
- Solo CSS 3D: tarjetas Leaf Library y grid Craft. Overlay `#video-root`: sin WebGL.
- Riesgos: `ScrollTrigger.refresh()` global, scroll lock sin refresh, AnimatePresence dentro del condicional, bundle único ~288 KB gz.

## Hallazgos visuales confirmados (A)
- «Tu cigarro» sin imagen (clímax vacío). Panel «Tu mezcla» solo texto.
- Bug cabecera overlay hoja (`LeafLibrary.jsx:178` LanguageSwitcher).
- Primer frame visible = mosaico borroso; corte negro→beige.
- Tarjetas seleccionadas parecen deshabilitadas; «Guía» duplicada; «Ver recorridos» tapa resultado; 2 engranajes visibles.
- Home: 3 pantallas estáticas seguidas; leyenda tapa sello en feature.

## Ideas identificadas (B)
10 conceptos: C1 Anatomía de tu cigarro (WebGL, paso 04), C2 Corte transversal en relieve (CSS 3D, guía), C3 Espiral de capa (SVG, transición a frames), A1 Hoja en vilo, A2 Tres hojas en profundidad (Home), B1 Tilt de materia, B2 Hoja viaja a tu mezcla, D1 Luz rasante, D2 Profundidad de pasos, D3 Cigarro héroe con humo (NO recomendado).
Top 3: C1, C2, C3. Orden sugerido: C2 → D2/B1 → C3 → C1 → A2 → B2 → A1/D1.
Assets: TEX-WRAP-01, TEX-FILLER-01, TEX-LEAF-NRM-xx, TEX-LEAF-HGT-xx, IMG-LEAF-TRIO-01, IMG-PAPER-01, GLB-CIGAR-01.

## Archivos generados
- `docs/3d-exploration/PROGRESS.md`, `01_VISUAL_ANALYSIS.md`, `02_3D_CONCEPTS.md`, `03_TECHNICAL_FEASIBILITY.md`
- `docs/TOBACCO_3D_UX_RECOMMENDATIONS.md`
- `docs/3d-exploration/CODEX_IMAGE_PROMPTS.md`
- `design-review/desktop/*.png` (15 actualizadas, 14 nuevas), `design-review/README.md`, `capture-manifest.json`
- Script captura (temporal): scratchpad `cap.mjs`

## Próximo paso
Revisar visualmente el set funcionando antes de elegir otro refinamiento. La fidelidad material de L1/C1 sigue limitada por SVG; cualquier mejora debe partir de las capturas y límites documentados. O2 probó CSS 3D y documentó su falta de volumen antes de pasar a Three existente. No hay implementación adicional del set seleccionado pendiente; las propuestas de reserva quedan fuera del alcance.

## Cómo reanudar
1. Leer este estado general, [H1-PROGRESS](implementation/ART-H1-PROGRESS.md) y [O2-NEXT-STEPS](implementation/ART-O2-NEXT-STEPS.md).
2. Conservar H1. Revisar `git status`, About/CSS actuales y decisiones propuestas de O2 antes de editar código.
3. Consultar [registro conjunto](implementation/ART-INTEGRATION-PROGRESS.md) y los progresos individuales antes de repetir trabajo. La petición del 2026-10-20 autoriza implementar el set; las restricciones de la sesión de planificación anterior son históricas. No instalar dependencias ni reiniciar agentes antiguos por indicaciones de exploración.
4. Usar scripts actuales de package.json: dev con `npm run dev`; e2e usa build + preview en 127.0.0.1:4173. Verificar puertos y herramientas al reanudar.

---

# Fase 2 — Exploración 3D artística (2026-10-19)

## Estado histórico de fase 2
**Exploración completada.** En ese momento no había implementación; posteriormente ART-H1 sí se implementó. Ver estado general actualizado arriba.

## Objetivo
Objetos 3D artísticos/flotantes/decorativos/interactivos en Home, About, Leaf Library y Craft (no solo resultado). Acentos de color más allá del marrón. Conservar C1.

## Agentes fase 2
| Agente | Rol | Archivo | Estado |
|---|---|---|---|
| E | Conceptos Home + About | `04-parts/E_HOME_ABOUT.md` | **finalizado** (AR-H1..H3, AR-O1..O2; top: H1, O2) |
| F | Conceptos Leaf Library + Craft | `04-parts/F_LIBRARY_CRAFT.md` | **finalizado** (AR-L1..L2, AR-C1..C3, AR-A1; top: C1, C2) |
| G | Paleta de acentos + skills/tecnología (materiales translúcidos, coste) | `04-parts/G_COLOR_TECH.md` | **finalizado** |
| H | Prompts Codex artísticos | `CODEX_ARTISTIC_IMAGE_PROMPTS.md` | **finalizado** (11 IDs × 2 prompts: object study + in-context) |
| Main | Consolidación | `04_ARTISTIC_3D_EXPLORATION.md` | **finalizado** |

## Cómo reanudar fase 2
La generación prioritaria ya se realizó y H1 ya se implementó. No repetir imágenes ni volver a empezar H1. Continuar con el plan de ART-O2; `04-parts/*` conserva las propuestas históricas, subordinadas a las decisiones nuevas del usuario.

## Resultado fase 2
- 10 objetos (AR-H1..H3, AR-O1..O2, AR-L1..L2, AR-C1..C3) + AR-A1 opcional.
- Paleta acentos unificada: verdín #6F907F, clarete #7B2F2B, celadón #BCC8A4, ámbar #D4913F (solo luz), tinta #3F4C6E (reserva).
- Set recomendado: Home AR-H1 · Oficio AR-O2 · Biblioteca AR-L1 · Craft AR-C1 (+AR-C2) · C1.
- Recomendación histórica inicial: AR-H1 SVG+GSAP. **Fue sustituida**, con aprobación del usuario para H1 orgánica, por Three vanilla lazy y GSAP existente. No extrapolar a O2 una autorización automática de WebGL.


## Continuación documentada — ART-O2 (2026-10-19)

- [x] Revisar progreso, propuesta consolidada, E/F/G, prompts, galería y aprendizaje H1.
- [x] Revisar visualmente ART-O2 objeto y maqueta, y contrastar con About y CSS actuales.
- [x] Preparar [plan técnico detallado](implementation/ART-O2-NEXT-STEPS.md): tecnología, DOM, geometría/materiales/tema, GSAP, responsive, archivos, assets, cleanup y matriz Playwright.
- [x] Actualizar este estado sin cambiar ART-H1, aplicación ni dependencias.
- [x] Implementación solicitada posteriormente por el usuario (2026-10-20); ver estado actual arriba.
- [x] Validación funcional conjunta y revisión independiente de ART-O2/ART-L1/ART-C1; resultados exactos y límites en el registro conjunto.

### Hallazgos que condicionan el próximo desarrollo

- About usa flex con p.site-lead directo; envolverlo alteraría selectores y podría mover el diseño. El plan propone ancla absoluta independiente y medición del hueco.
- El recorrido largo de la propuesta E terminaría cuando el nudo ya está fuera de pantalla si no hay pin. Se propone scrub local de tres fases, visible y reversible; no se ha aprobado ni construido un pin.
- CSS 3D se recomienda como v1 geométrica, pero no promete el volumen/oclusión material del render. Revisar poses antes de seguir; documentar problemas antes de plantear Three existente como alternativa.
- En móvil no está demostrado que quepa el SVG sin añadir altura: el plan explicita la alternativa de ocultarlo; no se inventa una reserva de espacio.
- Aprendizajes H1: progreso puro, cleanup local, pausa por visibilidad, mock saveData como EventTarget, separación entre concept y producción, medición sin interferencia de tracing. Última evidencia H1: build y 19 unitarias/21 e2e correctos; lint global con deuda previa. No se han vuelto a ejecutar pruebas de aplicación en esta sesión documental.
- Las disponibilidades de skills y tecnologías de las fases históricas deben verificarse en cada entorno; no instalar ni asumir R3F/drei por aparecer en esos documentos.
