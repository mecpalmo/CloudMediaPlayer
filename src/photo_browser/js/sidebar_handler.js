var lastSiderowFocus = 0; //to remember what siderow was focused when moving from grid to sidebar
var sidebarExtended = false;

function setSidebarExtended(isExtended){
	if(sidebarExtended === isExtended){
		return;
	}
	sidebarExtended = isExtended;
	const sideBar = document.getElementById("sidebar");
	if(!sideBar){
		return;
	}
	if(!isExtended && sideBar.classList.contains('extended')){
		sideBar.classList.remove('extended');
	}
	if(isExtended && !sideBar.classList.contains('extended')){
		sideBar.classList.add('extended');
	}
	const sideRows = Array.from(document.getElementsByClassName("siderow"));
	for (var i = 0; i < sideRows.length; i++) {
		const row = sideRows[i];
		const sideText = row.querySelector('.sideText');
		if(!sideText){
			continue;
		}
		if (isExtended && sideText.classList.contains('hidden')){
			sideText.classList.remove('hidden');
		}
		if(!isExtended && !sideText.classList.contains('hidden')){
			sideText.classList.add('hidden');
		}
	}
}

function setSiderowFocused(index){
	setSidebarExtended(true);
	const sideRows = Array.from(document.getElementsByClassName("siderow"));
	if(sideRows[index]) {
		sideRows[index].focus();
		lastSiderowFocus = index;
	}
}