#this script generates thumbnails for the local cloud

import os
import subprocess

source_directory = "/home/pi/fileServer/externalDrive/Cloud/"
target_directory = "/home/pi/fileServer/externalDrive/Thumbnails/"

def generate_thumbnail(source_path, target_path):
    if not os.path.exists(target_path):
        os.makedirs(target_path)
    
    source_filename = os.path.basename(source_path)
    target_filename = os.path.splitext(source_filename)[0] + ".jpg"
    target_filepath = os.path.join(target_path, target_filename)

    if os.path.exists(target_filepath):
        print(f"Thumbnail already exists for {source_path}")
        return
    
    cmd = [
        "ffmpeg",
        "-i", source_path,
        "-vf", "thumbnail,scale=600:400,crop=600:400",
        "-q:v", "2",
        "-frames:v", "1",
        target_filepath
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print(f"Thumbnail generated for {source_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error generating thumbnail for {source_path}: {e}")

def process_files(directory):
    for root, _, files in os.walk(directory):
        for filename in files:
            if filename.lower().endswith((".mp4", ".avi", ".jpg", ".jpeg", ".png", "mkv", "3gp", "wmv")):
                source_path = os.path.join(root, filename)
                target_path = source_path.replace(source_directory, target_directory, 1)
                target_path = os.path.splitext(target_path)[0] + ".jpg"
                generate_thumbnail(source_path, os.path.dirname(target_path))

if __name__ == "__main__":
    process_files(source_directory)