function addKeyHandler(){
    document.addEventListener("keydown", function(event) {
        switch (event.keyCode) {
            case 37: //Arrow Left
                displayRelativeImage(-1);
                break;
            case 39: //Arrow Right
                displayRelativeImage(1);
                break;
            case 38: //Arrow Up
            case 40: //Arrow Down
                showTitle();
                break;
            case 13: //Enter
                switchFillMode();
                break;
            case 10009: //Back
                exitViewer();
                break;
        }
    });
}