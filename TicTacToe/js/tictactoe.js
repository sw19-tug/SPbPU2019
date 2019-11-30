var player1 = "X",
    player2 = "O",
    currentPlayer,
    cells;

function selectMode(mode) {
    document.getElementById('modal').style.display = 'none';
    !!mode ? multiPlayer() : singlePlayer();
}

function singlePlayer() {
    startGame();
}

function multiPlayer() {
    startGame();
}

function startGame() {
	cells = document.querySelectorAll('.cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', setMark);
    }
    document.getElementById('turn').innerHTML = "Turn: Player " + player1;
}

function setMark() {
	if (this.innerHTML !== '') {
        return;
    }

	if (!currentPlayer || currentPlayer == player2){
		currentPlayer = player1;
		document.getElementById(this.id).className += " cross";
		document.getElementById('turn').innerHTML = "Turn: Player " + player2;
	} else {
		currentPlayer = player2;
		document.getElementById(this.id).className += " zero";
		document.getElementById('turn').innerHTML = "Turn: Player " + player1;
	}

    this.innerHTML = currentPlayer;
}