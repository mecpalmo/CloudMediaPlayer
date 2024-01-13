function loadRelativeImageFromArray(path, relativeIndex){
	showLoading();
	fetch(URL + SCRIPT + path)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		hideLoading();
		const fileTree = data.filter(obj => obj.mediaType === "image");
		const currentIndex = fileTree.findIndex(obj => obj.path === currentImagePath);
		if(currentIndex != -1){
			const newIndex = currentIndex + relativeIndex;
			if(newIndex >= 0 && newIndex < fileTree.length){
				loadImageByPath(fileTree[newIndex].path);
			}else{
				showInfo("No more pictures there");
			}
		}else{
			showError("Cannot find current picture in current folder");
		}
	})
	.catch(() => {
		showError("Error when fetching file tree");
		hideLoading();
	});
}

function loadImageByPath(path){
	showLoading();
	fetch(URL + path)
	.then(response => {
		return response.blob();
	}).then(blob => {
		hideLoading();
		processExifInfo(blob, path);
	}).catch(() => {
		hideLoading();
	});	
}