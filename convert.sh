#!/bin/bash

# Configuración de rutas
INPUT_DIR="src/assets/full"
OUTPUT_DIR="src/assets/thumbs"

# Procesa solo PNGs para asegurar transparencia y evitar duplicados
for f in "$INPUT_DIR"/*.png; do
    # Evita errores si el directorio está vacío
    [ -e "$f" ] || continue
    
    # Extrae el nombre base sin extensión
    name_no_ext=$(basename "$f" .png)

    echo "Procesando Grid Thumb: $name_no_ext"

    # FFmpeg: 
    # -vf "scale=400:-1" -> Ancho 400px, alto proporcional
    # -c:v libwebp       -> Conversión a formato WebP
    # -lossless 0 -q:v 60-> Compresión lossy al 60% de calidad (óptimo para web)
    # -y                 -> Sobrescribe si el archivo ya existe
    ffmpeg -i "$f" -vf "scale=400:-1" -c:v libwebp -lossless 0 -q:v 60 "$OUTPUT_DIR/thumb_${name_no_ext}.webp" -y
done