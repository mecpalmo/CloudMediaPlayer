#!/bin/bash

WATCH_DIR="/home/pi/fileServer/externalDrive/Cloud"

inotifywait -m -r -e delete --format '%w%f' "$WATCH_DIR" |
while read FILE
do
  python3 /home/pi/fileServer/remove_thumbnail.py "$FILE"
done

