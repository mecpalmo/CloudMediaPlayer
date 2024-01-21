var currentFileArray;

function getCurrentFileArray(){
    return currentFileArray;
}

function reloadFileArray(path) {
	showLoading();
	fetch(URL + SCRIPT + path)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			setCurrentPath(path);
			currentFileArray = data;
			updatePathDescription();
            updateGridContainer();
			hideLoading();
		})
		.catch(function(error) {
			currentFileArray = [];
			//showErrorMessage(error);
			hideLoading();
			setCurrentPath(CLOUD_PATH);
		});
}

function setSessionStorage(path, filePath){
	sessionStorage.setItem(sessionPath, path);
	sessionStorage.setItem(sessionFileFocus, filePath);
	sessionStorage.setItem(sessionSort, SORT_BY_DATE);
	const gridContainer = document.getElementById(gridContainerId);
	if(gridContainer){
		sessionStorage.setItem(sessionScrollPosition, gridContainer.scrollY);
	}
}

function updatePathDescription(){
	const visiblePath = getCurrentPath().replace(CLOUD_PATH, "");
	const folders = visiblePath.split('/');
	const path = folders.join(" / ");
	const pathDescription = document.getElementById("path");
	pathDescription.innerHTML = path;
}

function showErrorMessage(error){
	const pathDescription = document.getElementById("path");
	pathDescription.innerHTML = "Błąd połączenia. " + error;
}
