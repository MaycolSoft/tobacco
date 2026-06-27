#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

INPUT_DIR="src/assets/videos"
OUTPUT_DIR="src/assets/frames"

for video in "$INPUT_DIR"/*.mp4; do
    video_name=$(basename "$video" .mp4)
    target_folder="$OUTPUT_DIR/$video_name"

    mkdir -p "$target_folder"

    echo "------------------------------------------------"
    echo "Procesando: $video_name"
    echo "------------------------------------------------"

    ffmpeg -hide_banner -stats -threads 0 -i "$video" \
        -map 0:v:0 -an -sn -dn \
        -fps_mode passthrough \
        -vf "format=rgb24" \
        -c:v libwebp \
        -lossless 1 \
        -compression_level 0 \
        -quality 0 \
        "$target_folder/frame_%04d.webp" \
        -y
done

echo "¡Todos los videos han sido procesados!"







# #!/usr/bin/env bash
# set -euo pipefail
# shopt -s nullglob

# INPUT_DIR="src/assets/videos"
# OUTPUT_DIR="src/assets/frames"

# JOBS=4
# COMPRESSION_LEVEL=0
# QUALITY=0

# process_chunk() {
#     video="$1"
#     target_folder="$2"
#     start="$3"
#     end="$4"

#     ffmpeg -hide_banner -loglevel error -stats -threads 1 -i "$video" \
#         -map 0:v:0 -an -sn -dn \
#         -fps_mode passthrough \
#         -vf "trim=start_frame=${start}:end_frame=$((end + 1)),setpts=PTS-STARTPTS,format=rgb24" \
#         -c:v libwebp \
#         -lossless 1 \
#         -compression_level "$COMPRESSION_LEVEL" \
#         -quality "$QUALITY" \
#         -start_number $((start + 1)) \
#         "$target_folder/frame_%06d.webp" \
#         -y
# }

# export -f process_chunk
# export COMPRESSION_LEVEL QUALITY

# for video in "$INPUT_DIR"/*.mp4; do
#     video_name=$(basename "$video" .mp4)
#     target_folder="$OUTPUT_DIR/$video_name"

#     mkdir -p "$target_folder"
#     rm -f "$target_folder"/frame_*.webp

#     total_frames=$(ffprobe -v error -select_streams v:0 \
#         -show_entries stream=nb_frames \
#         -of default=noprint_wrappers=1:nokey=1 \
#         "$video")

#     chunk_size=$(( (total_frames + JOBS - 1) / JOBS ))

#     echo "------------------------------------------------"
#     echo "Procesando: $video_name"
#     echo "Frames: $total_frames"
#     echo "Jobs paralelos: $JOBS"
#     echo "------------------------------------------------"

#     for ((start=0; start<total_frames; start+=chunk_size)); do
#         end=$((start + chunk_size - 1))

#         if (( end >= total_frames )); then
#             end=$((total_frames - 1))
#         fi

#         printf '%s\0%s\0%s\0%s\0' "$video" "$target_folder" "$start" "$end"
#     done | xargs -0 -n 4 -P "$JOBS" bash -c 'process_chunk "$@"' _

# done

# echo "¡Todos los videos han sido procesados!"



