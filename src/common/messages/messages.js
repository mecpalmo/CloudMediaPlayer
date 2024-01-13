var messageTimer;

function showInfo(text){
    var errorDiv = document.createElement("div");
    errorDiv.className = "info";
    errorDiv.textContent = text;
    document.body.appendChild(errorDiv);
    clearTimeout(messageTimer);
	messageTimer = setTimeout(hideMessages, 3000);
}

function showError(text){
    var errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = text;
    document.body.appendChild(errorDiv);
    clearTimeout(messageTimer);
	messageTimer = setTimeout(hideMessages, 3000);
}

function hideMessages(){
    var errorElements = document.querySelectorAll(".error");
    errorElements.forEach(function(errorElement) {
        errorElement.remove();
    });
    var errorElements = document.querySelectorAll(".info");
    errorElements.forEach(function(errorElement) {
        errorElement.remove();
    });
}