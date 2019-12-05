const fieldDimension = 8;

function goToGameField() {
    document.location.href = "gameField.html";
}

window.onload = function () {
    const field = document.getElementsByClassName("field")[0];
    for (let i = 0; i < fieldDimension; i++) {
        const colDiv = document.createElement('div');
        for (let j = 0; j < fieldDimension; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            colDiv.appendChild(cell);
        }
        field.appendChild(colDiv);
    }

    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].onclick = clickCell;
    }
};

function clickCell(cell) {
	this.classList.add('checked');
}
