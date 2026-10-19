# TOBACCO — 3D & UX Exploration · PROGRESS

> Inicio: 2026-10-19 · Base: `docs/TOBACCO_PROJECT_AUDIT.md` · Reglas: no tocar código, no instalar, no commits.

## Estado general
**COMPLETADO** (2026-10-19). Exploración documentada; nada implementado.

## Agentes
| Agente | Rol | Archivo | Estado |
|---|---|---|---|
| A | Visual UX Inspector (capturas **solo desktop**) | `../../design-review/desktop/` + `01_VISUAL_ANALYSIS.md` | **finalizado** (31 capturas) |
| ~~A2~~ | ~~Mobile~~ | — | cancelado (usuario: solo desktop) |
| B | 3D Creative Researcher (skills + conceptos) | `02_3D_CONCEPTS.md` | **finalizado** |
| C | Technical Feasibility | `03_TECHNICAL_FEASIBILITY.md` | **finalizado** |
| D | Asset & Prompt Designer | `CODEX_IMAGE_PROMPTS.md` | **finalizado** |
| Main | Consolidación | `../TOBACCO_3D_UX_RECOMMENDATIONS.md` | **finalizado** |

## Entorno
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
Validación humana: elegir conceptos (recomendado empezar por C2), responder preguntas de la auditoría §16, generar concept art REF-C1/C2/C3 con Codex para mostrar al cliente.

## Cómo reanudar
1. Leer este archivo y la tabla de agentes.
2. Arrancar dev server (ver Entorno).
3. Retomar solo los agentes en estado distinto a "finalizado"; cada doc de agente tiene su propia sección de progreso.

---

# Fase 2 — Exploración 3D artística (2026-10-19)

## Estado
**COMPLETADO.** Nada implementado.

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
Todo finalizado. Próximo paso humano: generar en Codex ART-H1/O2/L1/C1 (P1) → `docs/3d-exploration/refs/art/` y validar con cliente las 4 preguntas de §8 del doc 04. Detalle por campo en `04-parts/*`.

## Resultado fase 2
- 10 objetos (AR-H1..H3, AR-O1..O2, AR-L1..L2, AR-C1..C3) + AR-A1 opcional.
- Paleta acentos unificada: verdín #6F907F, clarete #7B2F2B, celadón #BCC8A4, ámbar #D4913F (solo luz), tinta #3F4C6E (reserva).
- Set recomendado: Home AR-H1 · Oficio AR-O2 · Biblioteca AR-L1 · Craft AR-C1 (+AR-C2) · C1.
- Primero: AR-H1 (SVG+GSAP, 0 KB three).
