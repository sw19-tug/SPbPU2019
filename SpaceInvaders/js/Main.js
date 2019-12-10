// This is the main file

let game = new Game();

let startButton = document.getElementById('start_button');
startButton.addEventListener('click', () => game.start());
let restartButton = document.getElementById('restart_button');
restartButton.addEventListener('click', () => game.start());

let cannonBall = document.createElement('IMG');
let isCannonBallMoving = 0;
let cannonBallTimer;
let alienCoordinates = []; //list of coordinates of the lowest aliens
let horDir = 1; //direction for horizontal movement
let bulletList = [];

//choose action depending on the pressed key
function logKey(e) {
    pressedKey = `${e.code}`;
    switch (pressedKey) {
        case 'ArrowRight':
            moveCannon(1);
            break;
        case 'ArrowLeft':
            moveCannon(-1);
            break;
        case 'Space':
            shoot();
            break;
    }
}

//////////////////////////////////////
//////////////////////////////////////

//move the cannon either left or right depending on given argument
function moveCannon(direction) {
    speed = 10;
    currentPosition = game.cannonPosition + direction * speed;
    if (currentPosition > 0 && currentPosition + game.cannonWidth < game.fieldWidth) {
        game.cannonPosition = currentPosition;
        document.getElementById("cannon").style.left = game.cannonPosition + 'px';
    }
}

//appearing of the cannon ball
function shoot() {
    if (!isCannonBallMoving) {
        cannonBall.src = "images/cannon ball.png";
        cannonBall.width = game.cannonWidth / 8;
        cannonBall.style.position = 'absolute';
        cannonBall.style.display = 'block';
        initialPositionLeft = game.cannonPosition + game.cannonWidth / 2 - 2;
        initialPositionBottom = game.cannonHeight + 5;
        cannonBall.style.left = initialPositionLeft + 'px';
        cannonBall.style.bottom = initialPositionBottom + 'px';
        document.getElementById("game_field").appendChild(cannonBall);
        cannonBallTimer = setInterval("moveCannonBall(cannonBall)", 60);
        isCannonBallMoving = 1;
    }
}

//animation of the cannon ball
function moveCannonBall() {
    speed = 20;
    newBottom = parseInt(cannonBall.style.bottom) + speed;
    if (newBottom < game.fieldHeight) {
        cannonBall.style.bottom = newBottom + 'px';
        cannonCoord = cannonBall.getBoundingClientRect();
        leftBound = cannonCoord.left;
        rightBound = leftBound + cannonBall.clientWidth;
        bottomBound = cannonCoord.bottom;
        topBound = bottomBound + cannonBall.clientHeight;
        checkForCollision(leftBound, rightBound, topBound, bottomBound);
    } else {
        removeCannonBall();
    }
}

// removes cannon ball from gamefield
function removeCannonBall() {
    cannonBall.style.display = 'none';
    isCannonBallMoving = 0;
    clearInterval(cannonBallTimer);
}

//////////////////////////////////////
//////////////////////////////////////

//get coordinates of aliens which are not dead and are the last ones in their columns
function getAliens() {
    alienCoordinates = [];
    for (var i = 0; i <= game.lastRow; i++) {
        for (var j = game.firstCol; j <= game.lastCol; j++) {
            var cond = true;
            if (i != game.lastRow) {
                cond = !game.alienContainers[i + 1][j].hasChildNodes();
            }
            if (game.alienContainers[i][j].hasChildNodes() && cond) {
                alien = document.getElementById('alien ' + i + ' ' + j);
                coord = alien.getBoundingClientRect();
                aLeft = coord.left;
                aBottom = coord.bottom;
                aRight = aLeft + alien.clientWidth;
                aTop = aBottom + alien.clientHeight;
                alienCoordinates.push([aLeft, aRight, aTop, aBottom, i, j]);
            }
        }
    }
}


function alienDefeated(i) {
    //ALIEN DEFEATED
    elem = document.getElementById('alien ' + alienCoordinates[i][4] + ' ' + alienCoordinates[i][5]);
    elem.parentNode.removeChild(elem);
    game.numberOfAliens--;
    game.points += 10;
    document.getElementById('countPoints').innerHTML = game.points < 100 ? '0' + game.points : game.points;
    console.log('my points: ' + game.points);
}

//checking if the cannon ball hit any of the aliens
function checkForCollision(leftB, rightB, topB, bottomB) {
    getAliens();
    for (var i = 0; i < alienCoordinates.length; i++) {
        aLeft = alienCoordinates[i][0];
        aRight = alienCoordinates[i][1];
        aTop = alienCoordinates[i][2];
        aBottom = alienCoordinates[i][3];

        var cond1 = ((leftB >= aLeft && rightB <= aRight) || (leftB <= aLeft && rightB >= aLeft) || (leftB <= aRight && rightB >= aRight));
        var cond2 = ((topB <= aTop && bottomB >= aBottom) || (topB >= aBottom && bottomB <= aBottom) || (topB >= aTop && bottomB <= aBottom));

        if (cond1 && cond2) {

            removeCannonBall();
            alienDefeated(i);
            if (game.numberOfAliens == 0) {
                //NO ALIENS LEFT
                endGame();
            } else {

                if (game.alienContainers.length != 0) {
                    getAliens();
                    isEmpty();

                }
            }

        }
    }
}

// aliens moving down
function moveAliensDown() {
    offset = 10;
    currentTop = parseInt(document.getElementById("mainContainer").style.top);
    document.getElementById("mainContainer").style.top = currentTop + offset + 'px';
    getAliens();
    if (checkBottomReached()) {
        endGame();
    }

}

//moving aliens either left or right
function moveAliensSideways() {
    changeAliensDirectionIfNeeded();
    sideOffset = 7;
    currentLeft = parseInt(document.getElementById('mainContainer').style.left);
    document.getElementById('mainContainer').style.left = currentLeft + sideOffset * horDir + 'px';
    getAliens();
}



//checking if either the first column, the last column or the last row are empty
function isEmpty() {
    lastColumnIsEmpty = 1;
    firstColumnIsEmpty = 1;
    lastRowIsEmpty = 1;
    //checking if the first or the last columns are empty
    for (var i = 0; i <= game.lastRow; i++) {
        if (game.alienContainers[i][game.firstCol].hasChildNodes()) {
            firstColumnIsEmpty = 0;
        }
        if (game.alienContainers[i][game.lastCol].hasChildNodes()) {
            lastColumnIsEmpty = 0;
        }

    }

    for (var j = game.firstCol; j <= game.lastCol; j++) {
        if (game.alienContainers[game.lastRow][j].hasChildNodes()) {
            lastRowIsEmpty = 0;
        }
    }

    if (firstColumnIsEmpty) {
        clearColumn(game.firstCol);
        game.firstCol++;
        isEmpty();
        return;
    }
    if (lastColumnIsEmpty) {
        clearColumn(game.lastCol);
        game.lastCol--;
        isEmpty();
        return;
    }
    if (lastRowIsEmpty) {
        clearLastRow();
        isEmpty();
        return;
    }
}

//removing alien containers from a column
function clearColumn(index) {
    for (var i = 0; i <= game.lastRow; i++) {
        elem = document.getElementById('cont ' + i + ' ' + index);
        elem.parentNode.removeChild(elem);
    }
    if (index == game.firstCol) {
        left = parseInt(document.getElementById('mainContainer').style.left);
        document.getElementById('mainContainer').style.left = left + 60 + 'px';
    }
}

//removing alien containers from the last row
function clearLastRow() {
    for (j = game.firstCol; j <= game.lastCol; j++) {
        elem = document.getElementById('cont ' + game.lastRow + ' ' + j);
        elem.parentNode.removeChild(elem);
    }
    game.lastRow--;
}

//////////////////////////////////////
//////////////////////////////////////

// cleanup and destroy at the end of the game
function endGame() {
    clearInterval(game.moveDownTimer);
    clearInterval(game.moveToTheSideTimer);
    clearInterval(game.bulletCreateTimer);
    clearInterval(game.bulletMoveTimer);
    clearInterval(cannonBallTimer);
    document.onkeydown = false;
    game.stop();
}

//checking if the last row of aliens reached the bottom of the gamefield
function checkBottomReached() {
    var aliens_bottom = document.getElementById('mainContainer').getBoundingClientRect().bottom;
    var cannon_top = document.getElementById('cannon').getBoundingClientRect().top;
    return aliens_bottom >= cannon_top;
}


// checking if the aliens reached either left or right border of the gamefield (and if reached, change direction)
function changeAliensDirectionIfNeeded() {
    var al_left = document.getElementById('mainContainer').getBoundingClientRect().left;
    var game_left = document.getElementById('game_field').getBoundingClientRect().left;

    var al_right = al_left + document.getElementById('mainContainer').offsetWidth;
    var game_right = game_left + document.getElementById('game_field').offsetWidth;

    if ((al_left + 7 <= game_left) || (al_right + 7 >= game_right)) {
        horDir = horDir * (-1);
    }
}

//////////////////////////////////////
//////////////////////////////////////

//creating a bullet from a random alien at random time intervals
function createBullet() {
    randTime = Math.floor(Math.random() * 100);
    if (randTime % 10 == 0) {
        getAliens();
        fieldLeft = document.getElementById("game_field").getBoundingClientRect().left;
        fieldTop = document.getElementById("game_field").getBoundingClientRect().top;
        randAlien = Math.floor(Math.random() * alienCoordinates.length);
        raBottom = alienCoordinates[randAlien][2] - fieldTop;
        raLeft = alienCoordinates[randAlien][0] - fieldLeft + 15;
        bullet = document.createElement('IMG');
        bullet.src = 'images/bullet.png';
        bullet.id = 'bullet' + bulletList.length;
        bullet.className='bullet';
        bullet.style.position = 'absolute';
        bullet.style.width = '10px';
        bullet.style.top = raBottom + 11 + 'px';
        bullet.style.left = raLeft + 'px';
        document.getElementById('game_field').appendChild(bullet);
        bulletList.push(bullet);
    }

}

function moveAllBullets() {
    bulletOffset = 10;
    for (var i = 0; i < bulletList.length; i++) {
        cannonObj = document.getElementById("cannonPic");
        cannonPos = cannonObj.getBoundingClientRect();
        cannonLeft = cannonPos.left;
        cannonTop = cannonPos.bottom - cannonObj.clientHeight;
        cannonRight = cannonLeft + cannonObj.clientWidth;
        currentBulletTop = parseInt(bulletList[i].style.top);
        bulletList[i].style.top = currentBulletTop + bulletOffset + 'px';
        bulletBottom = bulletList[i].getBoundingClientRect().bottom;
        bulletLeft = bulletList[i].getBoundingClientRect().left;
        bulletRight = bulletLeft + bulletList[i].clientWidth;
        if (bulletBottom >= cannonTop && ((bulletLeft >= cannonLeft && bulletRight <= cannonRight) ||
                (bulletRight >= cannonLeft && bulletRight <= cannonRight) || (bulletLeft >= cannonLeft && bulletLeft <= cannonRight))) {
            bulletList[i].parentNode.removeChild(bulletList[i]);
            document.getElementById("cannonPic").src = 'images/cannon gray.png';
            changePicTimer = setTimeout("document.getElementById('cannonPic').src='images/cannon.png'", 175);
            game.lives--;
            if (game.lives >= 1) {
                document.getElementById('countLives').innerHTML = game.lives;
            } else {
                document.getElementById('countLives').innerHTML = game.lives;
                endGame();
            }
            console.log("minus one live, remaining lives: " + game.lives);
        } else {
            if (bulletBottom >= document.getElementById("cannon").getBoundingClientRect().top +
                document.getElementById("cannon").clientHeight) {
                bulletList[i].parentNode.removeChild(bulletList[i]);
            }
        }

    }
}
