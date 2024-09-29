const rewindSeconds = 10;
const controlsDurationMillis = 3000;

var previewTime = 0; //time of the preview frame when rewinding
var controlsTimer; //timer for auto fading out controls

var rewinding = false;

function initProgressVisuals(videoPlayer){
	videoPlayer.addEventListener("timeupdate", function () {
	      const currentTime = videoPlayer.currentTime;
	      const duration = videoPlayer.duration;
	      const progressPercentage = (currentTime / duration) * 100;
	      const bar = document.getElementById('bar');
	      const currentTimer = document.getElementById("current_time");
	      const remainingTimer = document.getElementById("remaining_time");
	      currentTimer.innerHTML = getTimeFormatted(currentTime);
	      remainingTimer.innerHTML = getTimeFormatted(duration - currentTime);
	      bar.style.width = progressPercentage + "%";
	});
}

function getTimeFormatted(time){
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = Math.floor(time % 60);
	if (hours > 0) {
		const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	    return formattedTime;
	} else {
		const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
		return formattedTime;
	}
}

function removePauseButton(){
	const icons = document.getElementById('icons');
	icons
	while (icons.children.length > 0) {
		icons.removeChild(icons.lastElementChild);
	}
}

function setPauseButton(){
	var pause = document.createElement('img');
	pause.src = "../../icons/pause.png";
	pause.classList.add('pause');
	const icons = document.getElementById('icons');
	icons.appendChild(pause);
}

function showControls() {
	showTitle();
	const controls = document.getElementById("controls");
	controls.style.opacity = 1;
	clearTimeout(controlsTimer);
	controlsTimer = setTimeout(hideControls, controlsDurationMillis);
}

function hideControls() {
	hideTitle();
	showRewinding(false);
	const controls = document.getElementById("controls");
	controls.style.opacity = 0;
}

function showRewinding(isVisible){
	const rewindingMarker = document.getElementById('rewind_marker');
	if(isVisible){
		rewindingMarker.style.display = "block";
		rewinding = true;
	}else{
		rewindingMarker.style.display = "none";
		rewinding = false;
	}
}

function moveRight(){
	if(rewinding){
		moveTheMarkerWithSeconds(rewindSeconds);
	}else{
		resetMarkerPosition();
		showRewinding(true);
	}
}

function moveLeft(){
	if(rewinding){
		moveTheMarkerWithSeconds(-rewindSeconds);
	}else{
		resetMarkerPosition();
		showRewinding(true);
	}
}

function rewind(){
	const videoWrapper = document.getElementById('video_wrapper');
	const videoPlayer = videoWrapper.firstChild
	if (videoPlayer && !videoPlayer.seeking){	
		videoPlayer.currentTime = previewTime;
	}
}

function resetMarkerPosition(){
	const marker = document.getElementById('rewind_marker');
	const currentTime = getVideoCurrentTime();
	const duration = getVideoDuration();
	previewTime = currentTime;
	var position = (previewTime / duration) * 100; //in %
	marker.style.left = position + '%';
	updatePreviewTimer();
}

function moveTheMarkerWithSeconds(seconds) {
	const marker = document.getElementById('rewind_marker');
	const duration = getVideoDuration();
	previewTime += seconds;
	if(previewTime > duration){
		previewTime = duration;
	}else if(previewTime < 0){
		previewTime = 0;
	}
	var position = (previewTime / duration) * 100; //in %
	marker.style.left = position + '%';
	updatePreviewTimer();
	updatePreviewFrame();
}

function updatePreviewFrame(){
	
}

function getVideoDuration(){
	const videoWrapper = document.getElementById('video_wrapper');
	const videoPlayer = videoWrapper.firstChild;
	if(!videoPlayer){
		return 1;
	}
	return videoPlayer.duration;
}

function getVideoCurrentTime(){
	const videoWrapper = document.getElementById('video_wrapper');
	const videoPlayer = videoWrapper.firstChild;
	if(!videoPlayer){
		return 1;
	}
	return videoPlayer.currentTime;
}

function updatePreviewTimer(){
	const previewTimer = document.getElementById('preview_time');
	previewTimer.innerHTML = getTimeFormatted(previewTime);
}

function getVideoFrameAsImage(video, timestamp, callback) {
	const canvas = document.createElement('canvas');
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	const context = canvas.getContext('2d');
	video.currentTime = timestamp;
	video.addEventListener('seeked', () => {
	  context.drawImage(video, 0, 0, canvas.width, canvas.height);
	  const imageDataUrl = canvas.toDataURL('image/png');
	  callback(imageDataUrl);
	});
}
