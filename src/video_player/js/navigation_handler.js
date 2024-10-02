function addKeyHandler() {
	document.addEventListener('keydown', function (event) {
		const videoPlayer = document.getElementById('main_video');
		showControls();
		switch (event.keyCode) {
			case 10009: //key RETURN
				exitPlayer();
				break;
			case 10252: //key Play/Pause
			case 13: //key ENTER
				if(videoPlayer.paused){
					videoPlayer.play();
				    removePauseButton();
					break;
				}
				videoPlayer.pause();
				setPauseButton();
				break;
			case 39: // RIGHT 
				moveRight();
				break;
			case 37: // LEFT
				moveLeft();
				break;
			case 40: //key DOWN
				hideControls();
				break;
		}
	});
}