var currentVideoPath;

window.onload = function () {
	currentVideoPath = "";
	const urlParams = new URLSearchParams(window.location.search);
	currentVideoPath = urlParams.get(pathParameter);
	addKeyHandler();
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

function setVideoSource(path){
	setCurrentPath(path);
	const videoPlayer = document.createElement("video");
	videoPlayer.src = URL + path;
	setTitle(path);
	videoPlayer.setAttribute("autoplay", "");
	const videoWrapper = document.getElementById('video_wrapper');
	while (videoWrapper.firstChild) {
		videoWrapper.removeChild(videoWrapper.firstChild);
	}
	videoWrapper.appendChild(videoPlayer);
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

function setCurrentPath(path){
	currentVideoPath = path;
	sessionStorage.setItem(sessionFileFocus, path);
}