var lastFolderEntered;

function addKeyHandler(){
    document.addEventListener("keydown", function(event) {
		const currentFocusedItem = document.activeElement;
		if(currentFocusedItem.classList.contains("folder")){
			handleFolderNavigation(event.keyCode, currentFocusedItem);
			return;
		}
		if(currentFocusedItem.classList.contains("tile")){
			handleTileNavigation(event.keyCode, currentFocusedItem);
			return;
		}
		if(currentFocusedItem.classList.contains("siderow")){
			handleSidebarNavigation(event.keyCode, currentFocusedItem);
			return;
		}
		if(event.keyCode === 10009){
			exitFolder();
		}
		setFirstFocus();
    });
}

function handleFolderNavigation(keyCode, currentFocusedItem){
	const foldersArray = Array.from(document.getElementsByClassName("folder"));
	const folderIndex = foldersArray.indexOf(currentFocusedItem);
	switch(keyCode){
		case 37: //Arrow Left
			if((folderIndex % 5) === 0){
				setSiderowFocused(lastSiderowFocus);
				break;
			}
			setTileFocused(foldersArray[folderIndex - 1]);
			break;
		case 38: //Arrow Up
			setTileFocused(foldersArray[folderIndex - 5]);	
			break;
		case 39: //Arrow Right
			if(folderIndex < foldersArray.length - 1){
				setTileFocused(foldersArray[folderIndex + 1]);
			}
			break;
		case 40: //Arrow Down
			if(folderIndex + 5 > foldersArray.length - 1){
				const tilesArray = Array.from(document.getElementsByClassName("tile"));
				if(tilesArray.length > 0){
					setTileFocused(tilesArray[0]);
				}
				return;
			}
			setTileFocused(foldersArray[folderIndex + 5]);
			break;
		case 13: //Enter
			enterTile(currentFocusedItem);
			break;
		case 10009: //Back
			exitFolder();
			break;
	}
}

function handleTileNavigation(keyCode, currentFocusedItem){
	const gridRowsArray = Array.from(document.getElementsByClassName("grid-row"));
	const currentGridRow = currentFocusedItem.parentNode;
	const currentGridRowIndex = gridRowsArray.indexOf(currentGridRow);
	const currentTilesArray = Array.from(currentGridRow.children);
	const currentTileIndex = currentTilesArray.indexOf(currentFocusedItem);
	const ratio = currentTileIndex != -1 ? currentTileIndex/currentTilesArray.length : 0;
	switch(keyCode){
		case 37: //Arrow Left
			if(currentTileIndex === 0){
				setSiderowFocused(lastSiderowFocus);
				break;
			}
			setTileFocused(currentTilesArray[currentTileIndex - 1]);
			break;
		case 38: //Arrow Up
			if(currentGridRowIndex === 0){
				const foldersArray = Array.from(document.getElementsByClassName("folder"));
				if(foldersArray.length > 0){
					setTileFocused(foldersArray[foldersArray.length - 1]);
				}
				return;
			}
			const nextRowTilesArray = Array.from((gridRowsArray[currentGridRowIndex - 1]).children);
			const nextRowTilesAmount = nextRowTilesArray.length;
			const nextTileIndex = Math.round(ratio * nextRowTilesAmount);
			setTileFocused(nextRowTilesArray[nextTileIndex]);
			break;
		case 39: //Arrow Right
			setTileFocused(currentTilesArray[Math.min(currentTileIndex + 1, currentTilesArray.length - 1)]);
			break;
		case 40: //Arrow Down
			if(currentGridRowIndex < gridRowsArray.length - 1){
				const nextRowTilesAmount = gridRowsArray[currentGridRowIndex + 1].children.length;
				const nextTileIndex = Math.round(ratio * nextRowTilesAmount);
				setTileFocused((gridRowsArray[currentGridRowIndex + 1].children)[nextTileIndex]);
			}
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
		case 10009: //Back
		case 39: //Arrow Right
			setTileFocused(lastTileFocus);
			break;
		case 40: //Arrow Down
			setSiderowFocused(Math.min(siderowIndex + 1, siderows.length - 1));
			break;
		case 13: //Enter
			enterSiderow(currentFocusedItem);
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
	if(file.mediaType === 'image'){
		launchImageViewer(file);
	}
}

function enterSiderow(siderow){
	switch(siderow.id){
		case "home":
			resolvePath(PHOTO_CLOUD_PATH);
			break;
		case "refresh":
			resolvePath(getCurrentPath());
			break;
		case "gridSize":
			switchGridSize();
			break;
	}
}
