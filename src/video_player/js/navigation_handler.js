function addKeyHandler() {
	document.addEventListener('keydown', function (event) {
		const videoWrapper = document.getElementById('video_wrapper');
		const videoPlayer = videoWrapper.firstChild;
		showTitle();
		showControls();
		switch (event.keyCode) {
			case 10009: //key RETURN
				exitPlayer();
				break;
			case 10252:
			case 13: //key ENTER
				if(videoPlayer.paused){
					videoPlayer.play();
				    setPlayButton(false);
					break;
				}
				videoPlayer.pause();
				setPlayButton(true);
				break;
			case 39: // RIGHT 
				if (!videoPlayer.seeking){
					fastForward();
					//videoPlayer.currentTime = Math.min(videoPlayer.currentTime + rewindSeconds, videoPlayer.seekable.end(0));
				}
				break;
			case 37: // LEFT
				if (!videoPlayer.seeking){
					rewind();
					//videoPlayer.currentTime = Math.max(videoPlayer.currentTime - rewindSeconds, videoPlayer.seekable.start(0));
				}
				break;
			case 40: //key DOWN
				hideControls();
				hideTitle();
				break;
		}
	});
}