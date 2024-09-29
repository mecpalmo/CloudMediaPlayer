function addKeyHandler() {
	document.addEventListener('keydown', function (event) {
		const videoWrapper = document.getElementById('video_wrapper');
		const videoPlayer = videoWrapper.firstChild;
		showControls();
		switch (event.keyCode) {
			case 10009: //key RETURN
				if(rewinding){
					hideControls();
				}else{
					exitPlayer();
				}
				break;
			case 10252: //key Play/Pause
				if(videoPlayer.paused){
					videoPlayer.play();
					removePauseButton();
					break;
				}
				videoPlayer.pause();
				setPauseButton();
				break;
			case 13: //key ENTER
				if(rewinding){
					rewind();
					break;
				}
				if(videoPlayer.paused){
					videoPlayer.play();
				    removePauseButton();
					break;
				}
				videoPlayer.pause();
				setPauseButton();
				break;
			case 39: // RIGHT 
				if (!videoPlayer.seeking){
					moveRight();
				}
				break;
			case 37: // LEFT
				if (!videoPlayer.seeking){
					moveLeft();
				}
				break;
			case 40: //key DOWN
				hideControls();
				break;
		}
	});
}