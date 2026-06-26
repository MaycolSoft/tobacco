#!/bin/bash

INPUT_DIR="src/assets/videos"
OUTPUT_DIR="src/assets/frames"

# Procesamiento secuencial (uno por uno) con progreso visible
for video in "$INPUT_DIR"/*.mp4; do
    [ -e "$video" ] || continue
    
    video_name=$(basename "$video" .mp4)
    target_folder="$OUTPUT_DIR/$video_name"
    
    mkdir -p "$target_folder"
    echo "------------------------------------------------"
    echo "Procesando: $video_name"
    echo "------------------------------------------------"

    # Configuración optimizada para mantener el 100% de la calidad original (Lossless)
    ffmpeg -i "$video" \
        -threads 8 \
        -c:v libwebp -lossless 1 -compression_level 6 \
        -fps_mode passthrough \
        "$target_folder/frame_%04d.webp" -y
done

echo "¡Todos los videos han sido procesados!"