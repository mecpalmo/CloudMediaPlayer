var lastFolderEntered;

function addKeyHandler(){
    document.addEventListener("keydown", function(event) {
		const currentFocusedItem = document.activeElement;
		if(currentFocusedItem.classList.contains("tile")){
			handleGridNavigation(event.keyCode, currentFocusedItem);
			return;
		}
		if(currentFocusedItem.classList.contains("siderow")){
			handleSidebarNavigation(event.keyCode, currentFocusedItem);
			return;
		}
		setTileFocused(0);
    });
}

function handleGridNavigation(keyCode, currentFocusedItem){
	const tiles = Array.from(document.getElementsByClassName("tile"));
	const tileIndex = tiles.indexOf(currentFocusedItem);
	switch(keyCode){
		case 37: //Arrow Left
			if((tileIndex % gridSizesTable[gridSizeIndex]) === 0){
				setSiderowFocused(lastSiderowFocus);
				break;
			}
			setTileFocused(tileIndex - 1);
			break;
		case 38: //Arrow Up
			setTileFocused(tileIndex - gridSizesTable[gridSizeIndex]);	
			break;
		case 39: //Arrow Right
			setTileFocused(tileIndex + 1);
			break;
		case 40: //Arrow Down
			setTileFocused(tileIndex + gridSizesTable[gridSizeIndex]);
			break;
		case 13: //Enter
			enterTile(currentFocusedItem);
			break;
		case 10009: //Back
			exitFolder();
			break;
	}
}

function handleSidebarNavigation(keyCode, currentFocusedItem){
	const siderows = Array.from(document.getElementsByClassName("siderow"));
    const siderowIndex = siderows.indexOf(currentFocusedItem);
	switch(keyCode){
		case 38: //Arrow Up
			setSiderowFocused(Math.max(siderowIndex - 1, 0));
			break;
		case 39: //Arrow Right
			setTileFocused(lastTileFocus);
			break;
		case 40: //Arrow Down
			setSiderowFocused(Math.min(siderowIndex + 1, siderows.length - 1));
			break;
		case 13: //Enter
			enterSiderow(currentFocusedItem);
			break;
		case 10009: //Back
			setTileFocused(lastTileFocus);
			break;
	}
}

function exitFolder() {
	var folders = getCurrentPath().split('/');
	lastFolderEntered = folders.pop();
	newPath = folders.join('/');
	resolvePath(newPath);
}

function enterTile(tile) {
	const file = getFileByTile(tile);
	if(!file){
		exitFolder();
		return;
	}
	if (file.type === 'directory'){
		resolvePath(file.path);
		return;
	}
	if(file.mediaType === 'video'){
		launchVideoPlayer(file);
		return;
	}
	if(file.mediaType === 'image'){
		launchImageViewer(file);
	}
}

function enterSiderow(siderow){
	switch(siderow.id){
		case "home":
			resolvePath(CLOUD_PATH);
			break;
		case "refresh":
			resolvePath(getCurrentPath());
			break;
		case "gridSize":
			switchGridSize();
			break;
		case "sort":
			switchSorting();
			resolvePath(getCurrentPath());
			break;
		case "photos":
			window.location.href = "../photo_browser/browser.html";
			break;
	}
}
