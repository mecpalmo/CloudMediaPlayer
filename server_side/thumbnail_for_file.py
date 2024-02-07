import sys
import os
import subprocess
from PIL import Image, ExifTags

source_folder = "/home/pi/fileServer/externalDrive/Cloud/"
thumbnail_folder = "/home/pi/fileServer/externalDrive/Thumbnails/"

def log_file(file_path):
    log_file_path = "/home/pi/fileServer/faulty_files.log"
    try:
        with open(log_file_path, 'r') as file:
            existing_content = file.read().splitlines()
    except FileNotFoundError:
        existing_content = []

    if file_path not in existing_content:
        with open(log_file_path, 'a') as file:
            file.write(file_path + '\n')
        print(f'{file_path} added to the log file.')
    else:
        print(f'{file_path} already exists in the log file.')



def generate_image_thumbnail(source_path):
                
    relative_path = os.path.relpath(source_path, source_folder)
    thumbnail_path = os.path.join(thumbnail_folder, relative_path)
    thumbnail_path = os.path.splitext(thumbnail_path)[0] + ".jpg"                
    if not os.path.exists(thumbnail_path):
        os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)
    
    with Image.open(source_path) as img:
        try:
            for orientation in ExifTags.TAGS.keys():
                if ExifTags.TAGS[orientation] == 'Orientation':
                    exif = dict(img._getexif().items())
                    if exif[orientation] == 3:
                        img = img.rotate(180, expand=True)
                    elif exif[orientation] == 6:
                        img = img.rotate(270, expand=True)
                    elif exif[orientation] == 8:
                        img = img.rotate(90, expand=True)
        except (AttributeError, KeyError, IndexError): # No exif data or no Orientation tag
            pass

        target_aspect_ratio = 640 / 480
        current_aspect_ratio = img.width / img.height
        if current_aspect_ratio > target_aspect_ratio: # Crop vertically
            
            new_width = int(img.height * target_aspect_ratio)
            left = (img.width - new_width) // 2
            right = left + new_width
            img = img.crop((left, 0, right, img.height))
        
        elif current_aspect_ratio < target_aspect_ratio: # Crop horizontally
            
            new_height = int(img.width / target_aspect_ratio)
            top = (img.height - new_height) // 2
            bottom = top + new_height
            img = img.crop((0, top, img.width, bottom))

        img = img.resize((640, 480))
        img.save(thumbnail_path, "JPEG")



def generate_video_thumbnail(video_path):

    relative_path = os.path.relpath(video_path, start=source_folder)
    thumbnail_name = os.path.join(thumbnail_folder, relative_path)
    thumbnail_name, _ = os.path.splitext(thumbnail_name)
    thumbnail_name += '.jpg'
    os.makedirs(os.path.dirname(thumbnail_name), exist_ok=True)
    command = [
        'ffmpeg',
        '-i', video_path,
        '-ss', '1',  # Use 1st second
        '-vframes', '1',
        '-q:v', '2',  # Set quality (1 is the best, 31 is the worst)
        thumbnail_name
    ]
    subprocess.run(command, check=True, capture_output=True)
    resize_thumbnail(thumbnail_name)
    print(f"Thumbnail created for {video_path}")



def resize_thumbnail(thumbnail_path):

    img = Image.open(thumbnail_path)
    target_aspect_ratio = 640 / 480    
    current_aspect_ratio = img.width / img.height
    if current_aspect_ratio > target_aspect_ratio: # Crop vertically
        
        new_width = int(img.height * target_aspect_ratio)
        left = (img.width - new_width) // 2
        right = left + new_width
        img = img.crop((left, 0, right, img.height))
    
    elif current_aspect_ratio < target_aspect_ratio: # Crop horizontally
        new_height = int(img.width / target_aspect_ratio)
        top = (img.height - new_height) // 2
        bottom = top + new_height
        img = img.crop((0, top, img.width, bottom))
        
    img = img.resize((640, 480))
    img.save(thumbnail_path, "JPEG")



if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("Missing param!")
        sys.exit(1)
    
    source_file = sys.argv[1]
    print(f"Provided param: {source_file}")

    if(source_file.lower().endswith(('.mp4', '.avi', '.mkv'))):
        try:
            generate_video_thumbnail(source_file)
        except:
            print(f"ERROR: Could not create for: {source_file}")
            log_file(source_file)

    if(source_file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.jpeg'))):
        try:
            generate_image_thumbnail(source_file)
        except:
            print(f"ERROR: Could not create for: {source_file}")
            log_file(source_file)

