function goToGameField() {
    document.location.href = "gameField.html";
}

window.onload = function() {
	var field = document.getElementsByClassName("field")[0];
	var size = 8;
	for (var i = 0; i < size; i++) {
		var colDiv = document.createElement('div');
		for (var j = 0; j < size; j++) {
			var cell = document.createElement('div');
			cell.classList.add('cell');
			colDiv.appendChild(cell);
		}
		field.appendChild(colDiv);
	}

	var cells = document.querySelectorAll(".cell");
	for (var i = 0; i < cells.length; i++) {
		cells[i].onclick = clickCell;
	}
}

function clickCell(cell) {
	this.classList.add('checked');
}
