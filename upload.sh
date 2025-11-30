#!/bin/bash

if [ -z "$1" ]; then
  echo "Uso: ./upload.sh <num_inicio>"
  exit 1
fi

START=$1
FILES=(public/frames/*.webp)
TOTAL=${#FILES[@]}
COUNT=0

echo "Iniciando subida desde el frame número: $START"
echo "Total de archivos a revisar: $TOTAL"
echo ""

for file in "${FILES[@]}"; do
  COUNT=$((COUNT + 1))

  BASENAME=$(basename "$file")
  NUMBER=$(echo "$BASENAME" | sed 's/[^0-9]//g')
  NUMBER=$((10#$NUMBER))

  if [ "$NUMBER" -lt "$START" ]; then
    continue
  fi

  echo "[$COUNT/$TOTAL] Uploading: $file"

  until OUTPUT=$(vercel blob put "$file" 2>/dev/null); do
    echo "$OUTPUT"
    echo "Retrying $file ..."
    sleep 1
  done

  echo "$OUTPUT"
done
