from PIL import Image, ExifTags
import os


def log_image(image_path):
    # Read existing log file content
    log_file_path = "./faulty_images.log"
    try:
        with open(log_file_path, 'r') as file:
            existing_content = file.read().splitlines()
    except FileNotFoundError:
        existing_content = []

    # Check if the input string is not already in the log file
    if image_path not in existing_content:
        # Append the input string to the log file
        with open(log_file_path, 'a') as file:
            file.write(image_path + '\n')
        print(f'{image_path} added to the log file.')
    else:
        print(f'{image_path} already exists in the log file.')

def create_thumbnail(source_path, thumbnail_path):
    # Open the image
    with Image.open(source_path) as img:
        # Check for orientation in exif data and rotate if necessary
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
        except (AttributeError, KeyError, IndexError):
            # No exif data or no Orientation tag
            pass

        # Calculate the target aspect ratio
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

        # Resize the image to the target size (640x480)
        img = img.resize((640, 480))
        
        # Save the thumbnail
        img.save(thumbnail_path, "JPEG")

def generate_thumbnails(source_folder, thumbnail_folder):
    # Iterate through all files and subdirectories in the source folder
    for root, dirs, files in os.walk(source_folder):
        for file in files:
            # Check if the file is an image
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                source_path = os.path.join(root, file)
                
                # Calculate the relative path to maintain folder structure
                relative_path = os.path.relpath(source_path, source_folder)
                
                # Create the corresponding thumbnail path
                thumbnail_path = os.path.join(thumbnail_folder, relative_path)
                thumbnail_path = os.path.splitext(thumbnail_path)[0] + ".jpg"
                
                # Create the thumbnail only if it doesn't exist
                if not os.path.exists(thumbnail_path):
                    # Create the necessary directories if they don't exist
                    os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)
                    
                    # Generate the thumbnail
                    try:
                        create_thumbnail(source_path, thumbnail_path)
                        print(f"Thumbnail created: {thumbnail_path}")
                    except:
                        print(f"ERROR: Could not generate for: {source_path}")
                        log_image(source_path)

if __name__ == "__main__":
    source_folder = "./externalDrive/Cloud/"
    thumbnail_folder = "./externalDrive/Thumbnails/"
    
    generate_thumbnails(source_folder, thumbnail_folder)

