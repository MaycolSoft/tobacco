#!/bin/bash
INPUT_DIR="src/assets/full"
OUTPUT_DIR="src/assets/thumbs"

# Solo procesamos PNG para evitar duplicados y mantener calidad/transparencia
for f in "$INPUT_DIR"/*.png; do
    [ -e "$f" ] || continue
    name_no_ext=$(basename "$f" .png)

    echo "Procesando Grid Thumb: $name_no_ext"

    # Optimizamos: scale=400 (suficiente para grid) y mantenemos transparencia
    ffmpeg -i "$f" -vf "scale=400:-1" -c:v libwebp -lossless 0 -q:v 60 "$OUTPUT_DIR/thumb_${name_no_ext}.webp" -y
done