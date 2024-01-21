from moviepy.editor import VideoFileClip
import os
import cv2

def process_video(file_path):

    video_clip = VideoFileClip(file_path)
    rotation = video_clip.rotation

    if rotation == 90 or rotation == -90:
        
        print(f"Processing: {file_path}")
        processed_clip = video_clip
        processed_clip.rotation = 0
        processed_clip = processed_clip.resize(newsize=(video_clip.size[1], video_clip.size[0]))
        file_name, file_extension = os.path.splitext(os.path.basename(file_path))
        output_path = os.path.join(os.path.dirname(file_path), f"{file_name}_processed{file_extension}")
        #output_path = file_path
        processed_clip.write_videofile(output_path, codec="libx264", audio_codec="aac")
        video_clip.close()
        processed_clip.close()
        print(f"Conversion completed. Original file removed: {file_path}")



def process_directory(directory_path):
    
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.lower().endswith(".mp4"):    
                file_path = os.path.join(root, file)
                process_video(file_path)
                #print(f"ERROR: Could not generate for: {source_path}")



if __name__ == "__main__":
    
    target_directory = "./"#externalDrive/Cloud/"
    process_directory(target_directory)
