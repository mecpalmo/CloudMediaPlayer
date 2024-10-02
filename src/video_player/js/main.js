var currentVideoPath;
var SORT_BY_DATE = false;

window.onload = function () {
	currentVideoPath = "";
	const urlParams = new URLSearchParams(window.location.search);
	currentVideoPath = urlParams.get(pathParameter);
	const sort = urlParams.get(sortParameter);
	SORT_BY_DATE = sort === 'true';

	addKeyHandler();
	setupVideoPlayer();
	setVideoSource(currentVideoPath);
}

function exitPlayer(){
	window.history.back();
}

function launchNextVideo(){
	hideMessages();
	const path = sessionStorage.getItem(sessionPath);
	if(path === null){
		showError("Missing current path in session storage");
		return;
	}
	loadNextVideoFromCurrentFolder(path);
}

function setupVideoPlayer(){
	const videoPlayer = document.getElementById('main_video');
	videoPlayer.setAttribute("autoplay", "");
	initProgressVisuals(videoPlayer);
	videoPlayer.addEventListener('play', () => {
		showTitle();
        showControls();
        hideLoading();
    });
	videoPlayer.addEventListener('ended', () => {
		launchNextVideo();
	});
}

function setVideoSource(path){
	setCurrentPath(path);
	const videoPlayer = document.getElementById('main_video');
	videoPlayer.src = URL + path;
	setTitle(path);
}

function setCurrentPath(path){
	currentVideoPath = path;
	sessionStorage.setItem(sessionFileFocus, path);
}