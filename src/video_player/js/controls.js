const rewindSeconds = 10;
const controlsDurationMillis = 3000;

var previewTime = 0; //time of the preview frame when rewinding
var controlsTimer; //timer for auto fading out controls

var rewinding = false;
var rewindSeeking = false;

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
	videoPlayer.addEventListener("seeking", function () {
		showLoading();
	});

	videoPlayer.addEventListener("seeked", function() {
		hideLoading();
		rewindSeeking = false;
		if(Math.abs(videoPlayer.currentTime - previewTime) > (rewindSeconds / 2)){
			rewindVideo();
		}
	})
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
		if(rewindSeeking){
			showControls();
			showRewinding(true);
		}else{
			rewindingMarker.style.display = "none";
			rewinding = false;
		}
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

function resetMarkerPosition(){
	const marker = document.getElementById('rewind_marker');
	const video = document.getElementById('main_video');
	const currentTime = video.currentTime;
	const duration = video.duration;
	previewTime = currentTime;
	var position = (previewTime / duration) * 100; //in %
	marker.style.left = position + '%';
	updatePreviewTimer();
}

function moveTheMarkerWithSeconds(seconds) {
	const marker = document.getElementById('rewind_marker');
	const video = document.getElementById('main_video');
	const duration = video.duration;
	previewTime += seconds;
	if(previewTime > duration){
		previewTime = duration;
	}else if(previewTime < 0){
		previewTime = 0;
	}
	var position = (previewTime / duration) * 100; //in %
	marker.style.left = position + '%';
	updatePreviewTimer();
	rewindVideo();
}

function rewindVideo(){
	if(rewindSeeking || !rewinding){
		return;
	}
	rewindSeeking = true;
	const video = document.getElementById('main_video');
	video.currentTime = previewTime;
}

function updatePreviewTimer(){
	const previewTimer = document.getElementById('preview_time');
	previewTimer.innerHTML = getTimeFormatted(previewTime);
}
