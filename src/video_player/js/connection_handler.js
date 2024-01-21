function loadNextVideoFromCurrentFolder(path){
	showLoading();
	fetch(URL + SCRIPT + path)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		hideLoading();
		const fileTree = data.filter(obj => obj.mediaType === "video");
		if(SORT_BY_DATE){
			fileTree.sort((a, b) => a.date - b.date);
		}
		const currentIndex = fileTree.findIndex(obj => obj.path === currentVideoPath);
		if(currentIndex != -1){
			const newIndex = currentIndex + 1;
			if(newIndex >= 0 && newIndex < fileTree.length){
				setVideoSource(fileTree[newIndex].path);
				return;
			}
			if(newIndex >= fileTree.length){
				exitPlayer();
			}
		}else{
			showError("Cannot find current video path");
		}
	})
	.catch(() => {
		showError("Error when fetching the file tree");
		hideLoading();
	});
}