var lastTileFocus;
var gridSizeIndex = 0;
const gridContainerId = "grid-container";
var tileToFileMap = new Map();
var DEFAULT_RATIO_SUM = 5;

function getFileByTile(tile){
	return tileToFileMap.get(tile);
}

function updateGridContainer() {
	tileToFileMap.clear();
	lastTileFocus = null;
	removeTiles();
	addFoldersToGrid();
	addImagesToGrid();
	resetFocus();
	handleFocusChange();
}

function removeTiles(){
	const gridContainer = document.getElementById("grid-container");
	while (gridContainer.children.length > 0) {
		gridContainer.removeChild(gridContainer.lastElementChild);
	}
}

function addFoldersToGrid(){
	const gridContainer = document.getElementById(gridContainerId);
	const foldersRow = document.createElement('div');
    foldersRow.classList.add('folders-row');
	getCurrentFileArray().forEach(function (file) {
		if (file.type === 'directory') {
			var folder = document.createElement('div');
        	folder.classList.add('folder');
			folder.setAttribute('tabindex', '-1');
        	var folderIconWrapper = document.createElement('div');
        	folderIconWrapper.classList.add('folder-icon-wrapper');
        	var folderIcon = document.createElement('img');
        	folderIcon.classList.add('folder-icon');
        	folderIcon.src = "../../icons/folder2.png";
        	folderIconWrapper.appendChild(folderIcon);
        	var folderName = document.createElement('div');
        	folderName.classList.add("folder-name");
        	folderName.textContent = file.name;
        	folder.appendChild(folderIconWrapper);
        	folder.appendChild(folderName);
        	foldersRow.appendChild(folder);
			tileToFileMap.set(folder, file);
		}
	});
	gridContainer.appendChild(foldersRow);
}

function addImagesToGrid(){
	const gridContainer = document.getElementById(gridContainerId);
	var gridRow = document.createElement('div');
    gridRow.classList.add('grid-row');
	var ratioSum = 0;
	const imageArray = getCurrentFileArray().filter(obj => (obj.mediaType === "image"));
	imageArray.forEach(function (file) {
		const img = new Image();
		img.onload = function() {
			if(ratioSum > DEFAULT_RATIO_SUM){
				gridContainer.appendChild(gridRow);
				gridRow = document.createElement('div');
				gridRow.classList.add('grid-row');
				ratioSum = 0;
			}
			const aspectRatio = img.naturalWidth / img.naturalHeight;
			ratioSum = ratioSum + aspectRatio;
			var tile = document.createElement('div');
			tile.classList.add('tile');
			tile.setAttribute('tabindex', '-1');
			const thumbnail = document.createElement('img');
			thumbnail.src = URL + getThumbnailPath(file.path);
			tile.appendChild(thumbnail);
			gridRow.appendChild(tile);
			tileToFileMap.set(tile,file);
			if(file === imageArray[imageArray.length - 1]){
				gridContainer.appendChild(gridRow);
			}
		}
		img.onerror = function() {
			if(ratioSum > DEFAULT_RATIO_SUM){
				gridContainer.appendChild(gridRow);
				gridRow = document.createElement('div');
				gridRow.classList.add('grid-row');
				ratioSum = 0;
			}
			const aspectRatio = 4.0 / 3.0;
			ratioSum = ratioSum + aspectRatio;
			var tile = document.createElement('div');
			tile.classList.add('tile');
			tile.setAttribute('tabindex', '-1');
			const thumbnail = document.createElement('img');
			thumbnail.src = "../../icons/missing_photo.jpg";
			tile.appendChild(thumbnail);
			const title = document.createElement('div');
			title.classList.add("title");
			title.textContent = file.name;
			tile.appendChild(title);
			gridRow.appendChild(tile);
			tileToFileMap.set(tile,file);
			if(file === imageArray[imageArray.length - 1]){
				gridContainer.appendChild(gridRow);
			}
		};
		img.src = URL + getThumbnailPath(file.path);
	});
}

function handleFocusChange() {
    const gridContainer = document.getElementById(gridContainerId);
	const focusedItem = document.activeElement;
    const itemPosition = focusedItem.getBoundingClientRect();
    const containerPosition = gridContainer.getBoundingClientRect();
    const scrollPosition = gridContainer.scrollTop + itemPosition.top - containerPosition.top;
    gridContainer.scrollTop = scrollPosition;
}

function resetFocus(){
	const fileFocus = sessionStorage.getItem(sessionFileFocus);
	if(fileFocus !== null){ 
		focusTileByPath(fileFocus);
		sessionStorage.removeItem(sessionFileFocus);
		return;
	}
	if(lastFolderEntered !== null){
		focusTileByName(lastFolderEntered);
		lastFolderEntered = null;
		return;
	}
	setFirstFocus();
}

function setFirstFocus(){
	const folderArray = Array.from(document.getElementsByClassName("folder"));
	if(folderArray.length > 0){
		setTileFocused(folderArray[0]);
		return;
	}
	const tileArray = Array.from(document.getElementsByClassName("tile"));
	if(tileArray.length > 0){
		setTileFocused(tileArray[0]);
		return;
	}
}

function setTileFocused(tile){
	setSidebarExtended(false);
	if(tile){
		tile.focus();
		lastTileFocus = tile;
		return;
	}
	setFirstFocus();
}

function focusTileByPath(filePath){
	tileToFileMap.forEach( function (file, tile){
		if(file.path === filePath){
			setTileFocused(tile);
		}
	});
}

function focusTileByName(fileName){
	tileToFileMap.forEach( function (file, tile){
		if(file.name === fileName){
			setTileFocused(tile);
		}
	});
}

function getFormattedTitle(text){ //the title needs to be shortened bc too long can destroy the grid
	const maxLength = 30;
	if (text.length <= maxLength) {
	    return text;
	}
	const truncatedText = text.slice(0, maxLength / 2 - 2) + '...' + text.slice(text.length - maxLength / 2 + 1);
	return truncatedText;
}

function getThumbnailPath(filePath) {
	filePath = filePath.replace('Cloud', 'PhotoThumbnails');
	var indexOfDot = filePath.lastIndexOf('.');
	if (indexOfDot !== -1) {
		return filePath.substring(0, indexOfDot) + '.jpg';
	}
	return "";
}

function switchGridSize(){
	if(DEFAULT_RATIO_SUM === 5){
		DEFAULT_RATIO_SUM = 6;
	}else{
		DEFAULT_RATIO_SUM = 5;
	}
}
