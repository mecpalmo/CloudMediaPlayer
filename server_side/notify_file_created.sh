#!/bin/bash

WATCH_DIR="/home/pi/fileServer/externalDrive/Cloud"

inotifywait -m -r -e close_write --format '%w%f' "$WATCH_DIR" |
while read FILE
do
  python3 /home/pi/fileServer/thumbnail_for_file.py "$FILE"
done

