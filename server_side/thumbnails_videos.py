import os
import subprocess
from PIL import Image

def log_video(video_path):
    # Read existing log file content
    log_file_path = "./faulty_videos.log"
    try:
        with open(log_file_path, 'r') as file:
            existing_content = file.read().splitlines()
    except FileNotFoundError:
        existing_content = []

    # Check if the input string is not already in the log file
    if video_path not in existing_content:
        # Append the input string to the log file
        with open(log_file_path, 'a') as file:
            file.write(video_path + '\n')
        print(f'{video_path} added to the log file.')
    else:
        print(f'{video_path} already exists in the log file.')


def generate_thumbnail(video_path, thumbnail_path):
    # Set the output thumbnail file path
    relative_path = os.path.relpath(video_path, start='./externalDrive/Cloud/')
    thumbnail_name = os.path.join(thumbnail_path, relative_path)
    thumbnail_name, _ = os.path.splitext(thumbnail_name)
    thumbnail_name += '.jpg'

    # Skip processing if the thumbnail already exists
    if os.path.exists(thumbnail_name):
        print(f"Thumbnail already exists for {video_path}")
        return

    # Create the thumbnail folder if it doesn't exist
    os.makedirs(os.path.dirname(thumbnail_name), exist_ok=True)

    # Use ffmpeg to extract a frame at the 10th second or the first frame if the video is shorter
    command = [
        'ffmpeg',
        '-i', video_path,
        '-ss', '1',  # Use 1st second
        '-vframes', '1',
        '-q:v', '2',  # Set quality (1 is the best, 31 is the worst)
        thumbnail_name
    ]
        
    # Run the command and wait for completion
    subprocess.run(command, check=True, capture_output=True)

    # Resize the thumbnail
    resize_thumbnail(thumbnail_name)

    print(f"Thumbnail created for {video_path}")


def resize_thumbnail(thumbnail_path):
    # Load the extracted frame and resize it to match the target size and aspect ratio
    img = Image.open(thumbnail_path)
    target_aspect_ratio = 640 / 480
        
    # Get the current aspect ratio
    current_aspect_ratio = img.width / img.height

    # Crop the image to match the target aspect ratio
    if current_aspect_ratio > target_aspect_ratio:
        # Crop vertically
        new_width = int(img.height * target_aspect_ratio)
        left = (img.width - new_width) // 2
        right = left + new_width
        img = img.crop((left, 0, right, img.height))
    elif current_aspect_ratio < target_aspect_ratio:
        # Crop horizontally
        new_height = int(img.width / target_aspect_ratio)
        top = (img.height - new_height) // 2
        bottom = top + new_height
        img = img.crop((0, top, img.width, bottom))
        
    # Crop and resize the image to the target size (640x480)
    img = img.resize((640, 480))
    # Save the thumbnail
    img.save(thumbnail_path, "JPEG")


def generate_thumbnails(source_folder, thumbnail_folder):
    # Iterate through all video files in the source folder
    for root, dirs, files in os.walk(source_folder):
        for file in files:
            if file.lower().endswith(('.mp4', '.avi', '.mkv')):
                video_path = os.path.join(root, file)
                try:
                    generate_thumbnail(video_path, thumbnail_folder)
                except: 
                    print(f"ERROR: Could not create for: {video_path}")
                    log_video(video_path)


if __name__ == "__main__":
    source_folder = "./externalDrive/Cloud/"
    thumbnail_folder = "./externalDrive/Thumbnails/"

    # Generate thumbnails
    generate_thumbnails(source_folder, thumbnail_folder)
    
