function goToGameField() {
    document.location.href = "gameField.html";
}

window.onload = function() {
	var cells = document.querySelectorAll(".cell");
	for (var i = 0; i < cells.length; i++) {
		cells[i].onclick = clickCell;
	}
}

function clickCell(cell) {
	this.classList.add('checked');
}