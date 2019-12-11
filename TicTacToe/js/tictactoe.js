var player1 = "X",
    player2 = "O",
    playerAI,
    currentPlayer,
    stepCount = 0,
    cells,
    gameMode,
    playAiTO,
    emptyCells = [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
    data1 = [],
    data2 = [];

function selectMode(mode) {
    document.getElementById('modal-menu').style.display = 'none';
    gameMode = mode;
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
    RandomSign();
    startGame();
}

function RandomSign() {
    const rand = Math.floor(1 + Math.random() * 2);
    const signX = "sign-" + rand;
    const playerX = document.getElementById(signX);
    playerX.innerHTML = "X";
    const signO = "sign-" + (3 - rand);
    const playerO = document.getElementById(signO);
    playerO.innerHTML = "O";

    if (Math.round(Math.random()) == 1) {
        currentPlayer = player1;
        document.getElementById('turn').innerHTML = "Turn: Player " + player2;
    } else {
        currentPlayer = player2;
        document.getElementById('turn').innerHTML = "Turn: Player " + player1;
    }
}

function startGame() {
    cells = document.querySelectorAll('.cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', currentStep);
    }
}

function currentStep(me) {
    if (!!me == false || me.innerHTML || me.currentTarget && me.currentTarget.innerHTML) {
        return;
    }

    if (me.currentTarget) {
        me = me.currentTarget;
    }

    var num = +me.id;

    if (!currentPlayer || currentPlayer == player2) {
        currentPlayer = player1;
        me.className += player1 == "X" ? " cross" : " zero";
        me.innerHTML = currentPlayer;
        data1.push(num)
        document.getElementById('turn').innerHTML = "Turn: Player " + player2;
    } else {
        currentPlayer = player2;
        me.className += player2 == "O" ? " zero" : " cross";
        me.innerHTML = currentPlayer;
        data2.push(num)
        document.getElementById('turn').innerHTML = "Turn: Player " + player1;
    }

    if (!gameMode && currentPlayer != playerAI) {
        if (playAiTO) {
            window.clearTimeout(playAiTO);
        }
        playAiTO = window.setTimeout(function() { playAI(); }, 100);
    }

    stepCount++
    if (
        (data2.length > 2 || data1.length > 2) &&
        (checkWin(data2, num) || checkWin(data1, num))
    ) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].removeEventListener("click", currentStep);
        }

        if (playAiTO) {
            window.clearTimeout(playAiTO);
        }
        //show resulte here
        document.getElementById('result').style.display = 'inline';
        document.getElementById('image').src = "img/image2.png";
        document.getElementById("word").innerHTML += "Win: Player " + currentPlayer;
        return
    }
    if (stepCount == 9) {
        document.getElementById('result').style.display = 'inline';
        document.getElementById('image').src = "img/image3.png";
        document.getElementById("word").innerHTML += "Draw";

        if (playAiTO) {
            window.clearTimeout(playAiTO);
        }
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
        cellsArr.push(document.getElementById(element));
    });
    cellsArr.forEach(element => {
        element.className += ' winCell';
    });
}

function chooseSign() {
    player1 = this.getAttribute("id");
    player2 = player1 == "O" ? "X" : "O";
    playerAI = player2;

    document.getElementById('modal-sign').style.display = 'none';
    if (Math.round(Math.random()) == 1) {
      document.getElementById('turn').innerHTML = "Turn: Player " + playerAI;
      currentPlayer = player1;
      playAI();
    }
}

function playAI() {
    var cell = bestCell();
    var nextCell = document.getElementById(cell);
    if (nextCell) {
        currentStep(nextCell);
    }
}

function bestCell() {
    var dataAI,
        dataPlayer;

    if (emptyCells.length == 0) {
        return;
    }

    dataAI = data2;
    dataPlayer = data1;

    for (cell in data2) {
        if (emptyCells.includes(data2[cell])) {
            emptyCells.splice(emptyCells.indexOf(data2[cell]), 1);
        }
    }

    for (cell in data1) {
        if (emptyCells.includes(data1[cell])) {
            emptyCells.splice(emptyCells.indexOf(data1[cell]), 1);
        }
    }

    if (emptyCells.length == 8) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    var score = [];
    for (i in winCombinations) {
        score[i] = 0;
        for (j in emptyCells) {
            if (winCombinations[i].includes(emptyCells[j])) {
                score[i] += 1;
            }
        }
        for (k in dataAI) {
            if (winCombinations[i].includes(dataAI[k])) {
                score[i] += 2;
            }
        }
        for (l in dataPlayer) {
            if (winCombinations[i].includes(dataPlayer[l])) {
                score[i] += 3;
            }
        }
    }

    var maxArr = score.slice();
    maxArr.sort(function(a, b) { return b - a });

    console.log(score);
    console.log(maxArr);

    if (maxArr[0] != 0) {
        for (i in maxArr) {
            var strategy = winCombinations[score.indexOf(maxArr[i])].slice();
            strat = checkStrategy(strategy);
            if (strat.length != 0) {
                return strat[Math.floor(Math.random() * strat.length)]
            }
        }
    } else {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
}

function checkStrategy(arrStrat) {
    for (i in data2) {
        if (arrStrat.includes(data2[i])) {
            arrStrat.splice(arrStrat.indexOf(data2[i]), 1);
        }
    }

    for (i in data1) {
        if (arrStrat.includes(data1[i])) {
            arrStrat.splice(arrStrat.indexOf(data1[i]), 1);
        }
    }

    return arrStrat;
}