function processExifInfo(blob, path){
	showLoading();
	EXIF.getData(blob, function() {
		const exifData = EXIF.getAllTags(this);
		const orientation = exifData.Orientation || 1;
		var rotation = 0;
		switch (orientation) {
			case 3:
				rotation = 180;
				break;
			case 6:
				rotation = 90;
				break;
			case 8:
				rotation = 270;
				break;
		}
		hideLoading();
		displayImageByPathAndRotation(path, rotation);
	})
	.catch(() => {
		hideLoading();
		displayImageByPathAndRotation(path, 0);
	});
}

function getRotatedImageViewer(rotation){
    const imgElement = document.createElement('img');
    imgElement.style.transform = 'rotate(' + rotation + 'deg)';
    return imgElement;
}

function adjustWrapperHeight(imageWrapper, rotation, ratio){
	if(rotation === 90 || rotation === 270){
		imageWrapper.style.height = ratio*100+"%";
	}else{
		imageWrapper.style.height = "100%";
	}
}

function switchFillMode(){
	fillMode = !fillMode;
	const imageWrapper = document.getElementById("image_wrapper");
}