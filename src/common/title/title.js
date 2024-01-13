const titleDurationMillis = 3000;
var titleTimer;

function setTitle(path){
    const title = document.getElementById("title");
	var dupa = path.split('/');
	var text = dupa.pop();
    title.textContent = text;
}

function showTitle(){
    const title = document.getElementById("title");
	title.style.opacity = 1;
	clearTimeout(titleTimer);
	titleTimer = setTimeout(hideTitle, titleDurationMillis);
}

function hideTitle(){
    const title = document.getElementById("title");
	title.style.opacity = 0;
}