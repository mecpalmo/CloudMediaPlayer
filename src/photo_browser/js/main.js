var currentPath = PHOTO_CLOUD_PATH; //path of the current visible folder

window.onload = function () {
	const path = sessionStorage.getItem(sessionPath);
	if(path !== null){
		currentPath = path;
	}
	addKeyHandler();
	resolvePath(currentPath);
}

function resolvePath(path){
	if(path.slice(0, PHOTO_CLOUD_PATH.length) === PHOTO_CLOUD_PATH){
		reloadFileArray(path);
		return;
	}
	window.history.back();
	//exitApp();
}

function launchVideoPlayer(file){
	setSessionStorage(currentPath, file.path);
	const nextPageUrl = '../video_player/player.html?'+pathParameter+'=' + encodeURIComponent(file.path);
	window.location.href = nextPageUrl;
}

function launchImageViewer(file){
	setSessionStorage(currentPath, file.path);
	var nextPageUrl = '../image_viewer/viewer.html?'+pathParameter+'=' + encodeURIComponent(file.path);
	window.location.href = nextPageUrl;
}

function setCurrentPath(path){
	currentPath = path;
}

function getCurrentPath(){
	return currentPath;
}

function exitApp(){
	try {
		tizen.application.getCurrentApplication().exit();
	} catch (error) {
		console.error('Error: ' + error.message);
	}
}
