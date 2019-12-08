// This is the main file

let game = new Game();

let startButton = document.getElementById('start_button');
startButton.addEventListener('click', () => game.start());

let cannonBall=document.createElement('IMG');
let isCannonBallMoving=0;
let cannonBallTimer;
let alienCoordinates=[];//list of coordinates of the lowest aliens
let horDir=1;//direction for horizontal movement
let bulletList=[];


//choose action depending on the pressed key
function logKey(e) {
	pressedKey=`${e.code}`;
	switch(pressedKey){
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
function moveCannon(direction){
	speed=10;
	currentPosition=game.cannonPosition+direction*speed;
	if(currentPosition>0&&currentPosition+game.cannonWidth<game.fieldWidth){
            game.cannonPosition=currentPosition;
            document.getElementById("cannon").style.left=game.cannonPosition+'px';
	}
}	

//appearing of the cannon ball
function shoot(){
    if (!isCannonBallMoving){
        cannonBall.src="images/cannon ball.png";
        cannonBall.width=game.cannonWidth/8;
        cannonBall.style.position='absolute';
        cannonBall.style.display='block';
        initialPositionLeft=game.cannonPosition+game.cannonWidth/2-2;
        initialPositionBottom=game.cannonHeight+5;
        cannonBall.style.left=initialPositionLeft+'px';
        cannonBall.style.bottom=initialPositionBottom+'px';
        document.getElementById("game_field").appendChild(cannonBall);
        cannonBallTimer=setInterval("moveCannonBall(cannonBall)", 60);
        isCannonBallMoving=1;
    }    
}

//animation of the cannon ball
function moveCannonBall(){
    speed=20;
    newBottom=parseInt(cannonBall.style.bottom)+speed;
    if(newBottom<game.fieldHeight){
        cannonBall.style.bottom=newBottom+'px';
        cannonCoord=cannonBall.getBoundingClientRect();
        leftBound=cannonCoord.left;
        rightBound=leftBound+cannonBall.clientWidth;
        bottomBound=cannonCoord.bottom;
        topBound=bottomBound+cannonBall.clientHeight;
        checkForCollision(leftBound, rightBound, topBound, bottomBound);
    }
    else{
		removeCannonBall();
    }
}

// removes cannon ball from gamefield
function removeCannonBall() {
    cannonBall.style.display='none';
    isCannonBallMoving=0;
    clearInterval(cannonBallTimer);
}

	//////////////////////////////////////
	//////////////////////////////////////

//get coordinates of aliens which are not dead and are the last ones in their columns
function getAliens(){
	alienCoordinates=[];
	for (var i = 0; i <= game.lastRow; i++){
		for (var j = game.firstCol; j <= game.lastCol; j++){
			var cond = true;
			if (i != game.lastRow) {
				cond = !game.alienContainers[i+1][j].hasChildNodes();
			}
			if (game.alienContainers[i][j].hasChildNodes() && cond){
				alien = document.getElementById('alien '+i+' '+j);
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

//checking if the cannon ball hit any of the aliens
function checkForCollision(leftB, rightB, topB, bottomB){
    getAliens();
	for (var i=0; i<alienCoordinates.length; i++){
        aLeft=alienCoordinates[i][0];
        aRight=alienCoordinates[i][1];
        aTop=alienCoordinates[i][2];
        aBottom=alienCoordinates[i][3];
		
		var cond1 = ((leftB>=aLeft&&rightB<=aRight)||(leftB<=aLeft&&rightB>=aLeft)||(leftB<=aRight&&rightB>=aRight));
		var cond2 = ((topB<=aTop&&bottomB>=aBottom)||(topB>=aBottom&&bottomB<=aBottom)||(topB>=aTop&&bottomB<=aBottom));
        
		if (cond1 && cond2){

			removeCannonBall();
        	elem=document.getElementById('alien '+alienCoordinates[i][4]+' '+alienCoordinates[i][5]);
        	elem.parentNode.removeChild(elem);
            //ALIEN DEFEATED
            if (game.alienContainers.length != 0){
            	getAliens();
                EmptyRow();
                EmptyColumn(game.lastCol, 1);
                EmptyColumn(game.firstCol, 0);
            }
            else{
                //NO ALIENS LEFT
            }
		}
	}
}

// aliens moving down
function moveAliensDown(){
    offset=10;
    currentTop=parseInt(document.getElementById("mainContainer").style.top);
    document.getElementById("mainContainer").style.top=currentTop+offset+'px';
    getAliens();
    var defeat = checkBottomReached();
	if (defeat) {
		endGame();
	}

}

//moving aliens either left or right
function moveAliens(){  
    changeAliensDirectionIfNeeded();
    sideOffset=7;
    currentLeft=parseInt(document.getElementById('mainContainer').style.left);
    document.getElementById('mainContainer').style.left=currentLeft+sideOffset*horDir+'px';
    getAliens();
}

//checking if the last row is empty and removing containers if it is
function EmptyRow(){
    i=game.lastRow;
    isEmpty=1;
    for (var j=0; j<=game.lastCol; j++){
        if (game.alienContainers[i][j].hasChildNodes()){
            isEmpty=0;
        }
    }
    if(isEmpty){
        elem=document.getElementById('row'+i);
        elem.parentNode.removeChild(elem);
        game.lastRow--;
    }
}

//checking if the first or the last columns are empty and removing if they are
function EmptyColumn(j, pos){
    isEmpty=1;
    for (var i=0; i<=game.lastRow; i++){
        if (game.alienContainers[i][j].hasChildNodes()){
            isEmpty=0;
        }
    }
    if(isEmpty){
            for (var i=0; i<=game.lastRow; i++){
                elem=document.getElementById('cont '+i+' '+j);
                elem.parentNode.removeChild(elem); 
            }
            if (pos){
				game.lastCol--; 
            }
            else{
                game.firstCol++;
                colWidth=document.getElementById('cont '+game.lastRow+' '+game.firstCol).offsetWidth;
                left=parseInt(document.getElementById('mainContainer').style.left);
                document.getElementById('mainContainer').style.left=left+colWidth+'px';        
            }
    }
}

	//////////////////////////////////////
	//////////////////////////////////////

// cleanup and destroy at the end of the game
function endGame() {
    clearInterval(game.moveDownTimer);
    clearInterval(game.moveToTheSideTimer);
    clearInterval(game.bulletCreateTimer);
    clearInterval(game.bulletMoveTimer);
}

//checking if the last row of aliens reached the bottom of the gamefield
function checkBottomReached(){
	var aliens_bottom = document.getElementById('mainContainer').getBoundingClientRect().bottom;
	var cannon_top = document.getElementById('cannon').getBoundingClientRect().top;
    return aliens_bottom >= cannon_top;
}


// checking if the aliens reached either left or right border of the gamefield (and if reached, change direction)
function changeAliensDirectionIfNeeded(){
    var al_left = document.getElementById('mainContainer').getBoundingClientRect().left;
    var game_left = document.getElementById('game_field').getBoundingClientRect().left;
	
    var al_right = document.getElementById('mainContainer').getBoundingClientRect().right;
    var game_right = document.getElementById('game_field').getBoundingClientRect().right;
	
    if( (al_left <= game_left - 1) || (al_right + 1 >= game_right) ){
        horDir=horDir*(-1);
    }
}

	//////////////////////////////////////
	//////////////////////////////////////

//creating a bullet from a random alien at random time intervals
function createBullet(){
    randTime=Math.floor(Math.random()*100);
    if (randTime%10==0){
        fieldLeft=document.getElementById("game_field").getBoundingClientRect().left;
        fieldTop=document.getElementById("game_field").getBoundingClientRect().top;
        randAlien=Math.floor(Math.random()*alienCoordinates.length);
        raBottom=alienCoordinates[randAlien][2]-fieldTop;
        raLeft=alienCoordinates[randAlien][0]-fieldLeft+15;
        bullet=document.createElement('IMG');
        bullet.src='images/bullet.png';
        bullet.id='bullet'+bulletList.length;
        bullet.style.position='absolute';
        bullet.style.width='10px';
        bullet.style.top=raBottom+11+'px';
        bullet.style.left=raLeft+'px';
        document.getElementById('game_field').appendChild(bullet);
        bulletList.push(bullet);
    }

}

function moveAllBullets(){
    bulletOffset=10;
    for (var i=0; i<bulletList.length; i++){        
        cannonObj=document.getElementById("cannonPic");
        cannonPos=cannonObj.getBoundingClientRect();
        cannonLeft=cannonPos.left;
        cannonTop=cannonPos.bottom-cannonObj.clientHeight;
        cannonRight=cannonLeft+cannonObj.clientWidth;
        currentBulletTop=parseInt(bulletList[i].style.top);  
        bulletList[i].style.top=currentBulletTop+bulletOffset+'px';
        bulletBottom=bulletList[i].getBoundingClientRect().bottom;
        bulletLeft=bulletList[i].getBoundingClientRect().left;
        bulletRight=bulletLeft+bulletList[i].clientWidth;
        if(bulletBottom>=cannonTop&&((bulletLeft>=cannonLeft&&bulletRight<=cannonRight)||
            (bulletRight>=cannonLeft&&bulletRight<=cannonRight)||(bulletLeft>=cannonLeft&&bulletLeft<=cannonRight))){
            bulletList[i].parentNode.removeChild(bulletList[i]);
            document.getElementById("cannonPic").src='images/cannon gray.png';
            changePicTimer=setTimeout("document.getElementById('cannonPic').src='images/cannon.png'", 175);
            game.lives--;
            console.log("minus one live, remaining lives: "+game.lives);
        }
        else{
            if(bulletBottom>=document.getElementById("cannon").getBoundingClientRect().top+
                document.getElementById("cannon").clientHeight){
                bulletList[i].parentNode.removeChild(bulletList[i]);
            }  
        }
        
    }
}








