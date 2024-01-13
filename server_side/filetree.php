<?php
//filetree.php

$basePath = '/home/pi/fileServer';

$path = isset($_GET['path']) ? $_GET['path'] : '/externalDrive/Cloud';

$files = scandir($basePath . $path);

$response = [];
foreach ($files as $file) {
  if ($file !== '.' && $file !== '..') {
    $filePath = $path . '/' . $file;
    $fileInfo = [
      'name' => $file,
      'path' => $filePath,
      'type' => is_dir($basePath . $filePath) ? 'directory' : 'file',
      'mediaType' => getMediaType($file),
      'date' => filectime($basePath . $filePath)
    ];
    $response[] = $fileInfo;
  }
}

header('Content-Type: application/json');
echo json_encode($response);

function getMediaType($fileName) {
  $video_extensions = array("mp4", "avi", "3gp", "asf", "ogv", "mkv", "wmv");
  $image_extensions = array("jpg", "png");
  $extension = strtolower(substr($fileName, strrpos($fileName, '.') + 1));
  if (in_array($extension, $video_extensions, false)) {
    return "video";
  }
  if (in_array($extension, $image_extensions, false)) {
    return "image";
  }
  return 'other';
}

?>
