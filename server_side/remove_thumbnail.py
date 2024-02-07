import os
import sys

source_folder = "/home/pi/fileServer/externalDrive/Cloud/"
thumbnail_folder = "/home/pi/fileServer/externalDrive/Thumbnails/"

def remove_file(file_path):
    try:
        os.remove(file_path)
        print(f"File '{file_path}' successfully removed.")
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
    except Exception as e:
        print(f"An Error occured: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Missing param!")
        sys.exit(1)

    file_path = sys.argv[1]
    relative_path = os.path.relpath(file_path, source_folder)
    thumbnail_path = os.path.join(thumbnail_folder, relative_path)
    thumbnail_path = os.path.splitext(thumbnail_path)[0] + ".jpg"
    remove_file(thumbnail_path)
