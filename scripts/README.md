# Conversión de imágenes y videos

Ejecutar desde la raíz del repositorio: los scripts actuales resuelven las rutas
respecto al directorio de trabajo, no respecto a esta carpeta.
Requieren `ffmpeg` disponible en el PATH.

## Videos → fotogramas

```bash
bash scripts/convert-video.sh
```

- Entrada: `src/assets/videos/*.mp4` (solo extensión minúscula y sin subcarpetas).
- Salida: `src/assets/frames/<nombre-del-video>/frame_0001.webp`, etc.
- Crea automáticamente una carpeta por video y conserva la resolución original.
- Usa WebP sin pérdida (`-lossless 1`) y no impone un FPS nuevo
  (`-fps_mode passthrough`). `-quality 0` no significa calidad visual cero en este modo.
- Sobrescribe fotogramas con el mismo nombre (`-y`). Si un video nuevo es más corto,
  los fotogramas sobrantes de una conversión anterior permanecen: usar una carpeta
  de salida limpia para evitar mezclarlos.
- Actualmente imprime éxito aunque no encuentre videos.
- La variante paralela al final está comentada y no se ejecuta.

El sitio lee los fotogramas desde `https://cdn.mbsoft.freeddns.org/<nombre-del-video>/`,
no desde esta salida local. Convertir no publica los archivos: hay que subir la carpeta
al CDN y comprobar el nombre y la cantidad de fotogramas en `src/pages/CraftYourCigar.jsx`.
El formato activo de cuatro dígitos coincide con `src/components/ScrollVideo.jsx`.

La carpeta de salida actual `src/assets/frames` **no** está ignorada por Git;
la regla existente cubre `public/frames`. Evitar incluir los fotogramas generados
accidentalmente en un commit.

## PNG → miniaturas WebP

```bash
bash scripts/convert.sh
```

Este script no convierte videos. Lee `src/assets/full/*.png` y escribe miniaturas
de 400 px de ancho, con transparencia y compresión con pérdida, en
`src/assets/thumbs/thumb_<nombre>.webp`.

Sus rutas están desactualizadas respecto al inventario actual, que está en
`public/assets/full` y `public/assets/thumbs`. Además, no crea la carpeta de salida.
No usarlo para regenerar las miniaturas actuales sin ajustar primero esas rutas.
Los originales y miniaturas existentes se han conservado sin cambios.
