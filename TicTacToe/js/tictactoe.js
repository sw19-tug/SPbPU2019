var player1 = "X",
    player2 = "O",
    currentPlayer,
    stepCount = 0,
    cells,
    winCombinations = [
        [1, 2, 3],
        [1, 4, 7],
        [1, 5, 9],
        [2, 5, 8],
        [3, 6, 9],
        [3, 5, 7],
        [4, 5, 6],
        [7, 8, 9]
      ],
      dataX = [],
      dataO = [];

function selectMode(mode) {
    document.getElementById('modal-menu').style.display = 'none';
    !!mode ? multiPlayer() : singlePlayer();
}

function singlePlayer() {
    document.getElementById('modal-sign').style.display = 'inline';
    document.getElementById("X").addEventListener('click', chooseSign);
    document.getElementById("O").addEventListener('click', chooseSign);
    startGame();
}

function multiPlayer() {
  info = document.querySelectorAll(".player-info")
  info.forEach(element => {
    element.classList.remove("invisible");
  });
  sign_1=document.getElementById("sign-1");
  sign_1.innerHTML="O";
  sign_2=document.getElementById("sign-2");
  sign_2.innerHTML="X";
  startGame();
}

function startGame() {
	cells = document.querySelectorAll('.cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', currentStep);
    }
    document.getElementById('turn').innerHTML = "Turn: Player " + player1;
}

function currentStep() {
	if (this.innerHTML !== '') {
    return;
  }
  var num = +this.getAttribute("id");
	if (!currentPlayer || currentPlayer == player2){
    currentPlayer = player1;
    document.getElementById(this.id).className += player1 == "X" ? " cross" : " zero";
    this.innerHTML = currentPlayer;
    dataX.push(num)
		document.getElementById('turn').innerHTML = "Turn: Player " + player2;
	} else {
		currentPlayer = player2;
    document.getElementById(this.id).className += player2 == "O" ? " zero" : " cross";
    this.innerHTML = currentPlayer;
    dataO.push(num)
		document.getElementById('turn').innerHTML = "Turn: Player " + player1;
  }
  stepCount++
  if (
      (dataO.length > 2 || dataX.length > 2) &&
      (checkWin(dataO, num) || checkWin(dataX, num))
      ) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", currentStep);
    }       
    //show resulte here
    console.log("Win"+ currentPlayer);
    return
    }
  if (stepCount == 9) {
    console.log("Draw");
    return
  }
}

function checkWin(arr, number) {
  for (var w = 0, wLen = winCombinations.length; w < wLen; w++) {
    var someWinArr = winCombinations[w],
        count = 0;
    if (someWinArr.indexOf(number) !== -1) {
      for (var k = 0, kLen = someWinArr.length; k < kLen; k++) {
        if (arr.indexOf(someWinArr[k]) !== -1) {
          count++;
          if (count === 3) {
            drowCells(someWinArr)
            return true;
          }
        }
      }
      count = 0;
    }
  }
}

function drowCells(winArr) {
  cellsArr = [];
  winArr.forEach(element => {
    cellsArr.push(document.getElementById(element))
  });
  cellsArr.forEach(element => {
    element.className += ' winCell'
  });
 }

function chooseSign(){
  player1 = this.getAttribute("id");
  player2 = player1 == "O" ? "X" : "O";
  document.getElementById('modal-sign').style.display = 'none';
  document.getElementById('turn').innerHTML = "Turn: Player " + player1;
}
