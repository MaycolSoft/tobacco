# ART-H1 production assets

`leaf-albedo.webp`: nueva hoja cenital generada con imagegen, con la fotografía real `public/assets/full/CAPA HABANA.png` y el concept aprobado como referencias de material. No es el concept art convertido a textura. UV horizontal 2048×512, sRGB, alfa conservado.

`leaf-alpha.webp`: canal alfa extraído del mismo albedo, convertido a RGB gris, lossless. `leaf-normal.webp`: gradientes de luminancia del albedo a 1024×256, convención OpenGL (+Y), dato lineal. Aproximación de relieve, no escaneo físico; misma UV. Los mapas derivados no se generan independientemente para evitar desalineación.

`leaf-poster-mid.webp` y `leaf-poster-rolled.webp`: pósteres transparentes generados separadamente con referencia fotográfica, 840×420; no texturas. Pueden diferir ligeramente de la geometría en vivo. Los prompts exactos están junto a sus assets. Las fuentes PNG se conservan en `docs/3d-exploration/implementation/`.

Reproducir derivación/optimización: `node scripts/prepare-leaf-ribbon-assets.mjs docs/3d-exploration/implementation/leaf-albedo-source.png docs/3d-exploration/implementation/leaf-poster-mid-source.png docs/3d-exploration/implementation/leaf-poster-rolled-source.png`. Usa Playwright ya instalado y cwebp del sistema; sin nuevas dependencias.
