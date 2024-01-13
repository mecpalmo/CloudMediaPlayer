var lastTileFocus = 0; //to remember what tile was focused when moving from sidebar to grid
const gridSizesTable = [5, 6, 4];
var gridSizeIndex = 0;
const gridContainerId = "grid-container";
var tileToFileMap = new Map();

function getFileByTile(tile){
	return tileToFileMap.get(tile);
}

function updateGridContainer() {
	tileToFileMap.clear();
	removeTiles();
	addFoldersToGrid();
	addFilesToGrid();
	resetFocus();
	updateThumbnails();
	handleFocusChange();
}

function removeTiles(){
	const gridContainer = document.getElementById(gridContainerId);
	while (gridContainer.children.length > 1) {
		gridContainer.removeChild(gridContainer.lastElementChild);
	}
}

function addFoldersToGrid(){
	const gridContainer = document.getElementById(gridContainerId);
	getCurrentFileArray().forEach(function (file) {
		if (file.type === 'directory') {
			const tile = generateTile(file.type, file.name);
			gridContainer.appendChild(tile);
			tileToFileMap.set(tile,file);
		}
	});
}

function addFilesToGrid(){
	const gridContainer = document.getElementById(gridContainerId);
	getCurrentFileArray().forEach(function (file) {
		if (file.type != 'directory') {
			const tile = generateTile(file.mediaType, file.name);
			gridContainer.appendChild(tile);
			tileToFileMap.set(tile,file);
		}
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
	setTileFocused(0);
}

function setTileFocused(index){
	setSidebarExtended(false);
	const gridContainer = document.getElementById(gridContainerId);
	if(gridContainer.children[index]){
		gridContainer.children[index].focus();
		lastTileFocus = index;
	}
}

function focusTileByPath(filePath){
	tileToFileMap.forEach( function (file, tile){
		if(file.path === filePath){
			tile.focus();
		}
	});
}

function focusTileByName(fileName){
	tileToFileMap.forEach( function (file, tile){
		if(file.name === fileName){
			tile.focus();
		}
	});
}

function generateTile(type, name){
	const tile = document.createElement('div');
	tile.classList.add('tile');
	tile.setAttribute('tabindex', '-1');
	const thumbnail = document.createElement('img');
	thumbnail.classList.add('thumbnail');
	thumbnail.src = getFileIconPath(type);
	const title = document.createElement('div');
	title.classList.add('title');
	title.textContent = getFormattedTitle(name);
	tile.appendChild(thumbnail);
	tile.appendChild(title);
	return tile;
}

function getFormattedTitle(text){ //the title needs to be shortened bc too long can destroy the grid
	const maxLength = 30;
	if (text.length <= maxLength) {
	    return text;
	}
	const truncatedText = text.slice(0, maxLength / 2 - 2) + '...' + text.slice(text.length - maxLength / 2 + 1);
	return truncatedText;
}

function getFileIconPath(type){
	const icons_path = '../../icons/';
	switch(type){
		case 'directory':
			return icons_path + 'folder.png';
		case 'video':
			return icons_path + 'video.png';
		case 'image':
			return icons_path + 'image.png';
		case 'back':
			return icons_path + 'back.png';
		default:
			return icons_path + 'file.png';
	}
}

function updateThumbnails(){
	const tiles = Array.from(document.getElementsByClassName("tile"));
	tiles.forEach( function (tile){
		const file = getFileByTile(tile);
		if (file && (file.mediaType === 'video' || file.mediaType === 'image')) {
			const thumbnail = tile.querySelector('.thumbnail');
			setImageSourceIfValid(thumbnail, URL + getThumbnailPath(file.path));
		}
	});
}

function setImageSourceIfValid(imgElement, imageUrl) {
	const tempImage = new Image();
	tempImage.onload = function() {
		imgElement.src = imageUrl;
	};
	tempImage.src = imageUrl;
}

function getThumbnailPath(filePath) {
	filePath = filePath.replace('Cloud', 'Thumbnails');
	var indexOfDot = filePath.lastIndexOf('.');
	if (indexOfDot !== -1) {
		return filePath.substring(0, indexOfDot) + '.jpg';
	}
	return "";
}

function switchGridSize(){
	gridSizeIndex += 1;
	if(gridSizeIndex >= gridSizesTable.length){
		gridSizeIndex = 0;
	}
	const gridContainer = document.getElementById(gridContainerId);
	gridContainer.style.gridTemplateColumns = "repeat(" + gridSizesTable[gridSizeIndex] + ", 1fr)";
}

function switchSorting(){
	const sortText = document.getElementById("sideText_sort");
	if(!SORT_BY_DATE){
		SORT_BY_DATE = true;
		sortText.textContent = "by date";
	}else{
		SORT_BY_DATE = false;
		sortText.textContent = "by name";
	}
}
