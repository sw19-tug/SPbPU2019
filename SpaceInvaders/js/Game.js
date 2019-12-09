/* This class aggregates
- class GameViewer (renders all game field)
- class GameCore (runs all logics of the game)
*/

class Game {

    constructor() {

    }

    start() {

        document.getElementById('header').insertAdjacentHTML('beforeend', `
        <font style=" margin-left: 710px;"><img src="images/live.png" width="40" height="20" style="margin-top: -7px;"> <font style="color: #868a8d;" id="countLives" class="header-font">3</font> </font>
        </div>`);
        //set the position of the cannon
        this.cannonPosition = document.getElementById("main_menu").clientWidth / 2;
        document.getElementById("cannon").style.left = this.cannonPosition + 'px';
        //hide the main menu
        document.getElementById("main_menu").style.display = "none";
        //show the gamefield
        document.getElementById("game_field").style.display = "block";
        //get gamefield and cannon parameters
        this.fieldHeight = document.getElementById("game_field").clientHeight;
        this.fieldWidth = document.getElementById("game_field").clientWidth;
        this.cannonWidth = document.getElementById("cannonPic").clientWidth;
        this.cannonHeight = document.getElementById("cannon").clientHeight;
        this.moveToTheSideTimer;
        document.onkeydown = logKey;
        this.setAliens();
        this.moveDownTimer = setInterval("moveAliensDown()", 6000);
        this.moveToTheSideTimer = setInterval("moveAliensSideways()", 700);

        this.bulletCreateTimer = setInterval("createBullet()", 200);
        this.bulletMoveTimer = setInterval("moveAllBullets()", 200);

        this.lives = 3;
        this.points = 0;
    }

    stop() {

    }

    setAliens() {
        //create an array of blocks containing aliens
        this.rows = 5;
        this.cols = 11;
        this.firstCol = 0;
        this.lastCol = 10;
        this.lastRow = 4;
        this.numberOfAliens = this.cols * this.rows;
        this.alienContainers = [];
        this.mainContainer = document.createElement('DIV');
        this.mainContainer.style.position = "absolute";
        this.mainContainer.style.left = '0px';
        this.mainContainer.style.top = document.getElementById('header').offsetHeight + 10 + 'px';
        this.mainContainer.id = "mainContainer";
        //this.mainContainer.style.border="1px solid blue";
        this.elementWidth = 40;
        for (var i = 0; i < this.rows; i++) {
            this.alienContainers.push([]);
            //creating a diffrent container for each row
            this.rowContainer = document.createElement('DIV');
            this.rowContainer.id = 'row' + i;
            for (var j = 0; j < this.cols; j++) {
                //creating a container for each alien
                this.container = document.createElement('DIV');
                this.alienContainers[i].push(this.container);
                this.alienContainers[i][j].style.height = '40px';
                this.alienContainers[i][j].style.width = this.elementWidth * 1.5 + 2 + 'px';
                this.alienContainers[i][j].style.float = 'left';
                this.alienImg = document.createElement("IMG");
                this.alienImg.src = "images/invader.png";
                this.alienImg.style.width = this.elementWidth + 'px';
                this.alienImg.id = 'alien ' + i + ' ' + j;
                this.container.id = 'cont ' + i + ' ' + j;
                this.container.appendChild(this.alienImg);

                this.rowContainer.appendChild(this.alienContainers[i][j]);
            }
            this.mainContainer.appendChild(this.rowContainer);
        }
        document.getElementById("game_field").appendChild(this.mainContainer);

        getAliens();
    }
}
