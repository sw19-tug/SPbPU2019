// This is the main file

let game = new Game();

let startButton = document.getElementById('start_button');
startButton.addEventListener('click', () => game.start());

let cannonBall=document.createElement('IMG');
let isCannonBallMoving=0;
let cannonBallTimer;
let alienCoordinates=[];//list of coordinates of the lowest aliens
let horDir=1;//direction for horizontal movement
let bulletTimer;
let bulletCounter=0;
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
        cannonBall.style.display='none';
        isCannonBallMoving=0;
        clearInterval(cannonBallTimer);
    }
}

//get coordinates of aliens which are not dead and are the last ones in their columns
function getAliens(){
	alienCoordinates=[];
	for (var i=0; i<game.lastRow; i++){
		for (var j=game.firstCol; j<=game.lastCol; j++){
			if (game.alienContainers[i][j].hasChildNodes()&&!game.alienContainers[i+1][j].hasChildNodes()){
            alien=document.getElementById('alien '+i+' '+j);
            coord=alien.getBoundingClientRect();
            aaLeft=coord.left;
            aaBottom=coord.bottom;
            aaRight=aaLeft+alien.clientWidth;
            aaTop=aaBottom+alien.clientHeight;
            alienCoordinates.push([aaLeft, aaRight, aaTop, aaBottom, i, j]);
			}
		}
	}
	i=game.lastRow;
	for (var j=game.firstCol; j<=game.lastCol; j++){

		if (game.alienContainers[i][j].hasChildNodes()){
            alien=document.getElementById('alien '+i+' '+j);
            coord=alien.getBoundingClientRect();
            aaLeft=coord.left;
            aaBottom=coord.bottom;
            aaRight=aaLeft+alien.clientWidth;
            aaTop=aaBottom+alien.clientHeight;
			alienCoordinates.push([aaLeft, aaRight, aaTop, aaBottom, i, j]);
			
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
        
		if (((leftB>=aLeft&&rightB<=aRight)||(leftB<=aLeft&&rightB>=aLeft)||(leftB<=aRight&&rightB>=aRight))&&
            ((topB<=aTop&&bottomB>=aBottom)||(topB>=aBottom&&bottomB<=aBottom)||(topB>=aTop&&bottomB<=aBottom))){

            
			cannonBall.style.display='none';
        	isCannonBallMoving=0;
        	clearInterval(cannonBallTimer);
        	elem=document.getElementById('alien '+alienCoordinates[i][4]+' '+alienCoordinates[i][5]);
        	elem.parentNode.removeChild(elem);
            game.numberOfAliens--;
            if (game.numberOfAliens){
            	getAliens();
                EmptyRow();
                EmptyColumn(game.lastCol, 1);
                EmptyColumn(game.firstCol, 0);
            }
            else{
                victory();
            }
		}
	}
}

function moveAliensDown(){
    offset=10;
    currentTop=parseInt(document.getElementById("mainContainer").style.top);
    document.getElementById("mainContainer").style.top=currentTop+offset+'px';
    getAliens();
    checkForBottom();

}

//moving aliens either left or right
function moveAliens(){  
    checkForSide();
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

//checking if the last row of aliens riched the bottom of the gamefield
function checkForBottom(){
    if(document.getElementById('mainContainer').getBoundingClientRect().bottom>=document.getElementById('cannon').getBoundingClientRect().top){
        clearInterval(game.moveDownTimer);
        clearInterval(game.moveToTheSideTimer);
        clearInterval(game.bulletTimer);
    }
}

//checking if the aliens riched either left or right border of the gamefield
function checkForSide(){
    
    if((document.getElementById('mainContainer').getBoundingClientRect().left
        <=document.getElementById('game_field').getBoundingClientRect().left-1)||
        (document.getElementById('mainContainer').getBoundingClientRect().right+1
        >=document.getElementById('game_field').getBoundingClientRect().right)){
        horDir=horDir*(-1);
    }
}

function victory(){
    //what to do if all of the aliens are defeated
}

function bulletReachedCannon(){
    console.log('Bullet reached cannon');
}


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
        bullet.id='bullet'+bulletCounter;
        bullet.style.position='absolute';
        bullet.style.width='10px';
        bullet.style.top=raBottom+11+'px';
        bullet.style.left=raLeft+'px';
        document.getElementById('game_field').appendChild(bullet);
        bulletList.push(bullet);
        bulletCounter++;
    }

}

function moveAllBullets(){
    bulletOffset=10;
    for (var i=0; i<bulletList.length; i++){        
        currentBulletTop=parseInt(bulletList[i].style.top);

        bulletList[i].style.top=currentBulletTop+bulletOffset+'px';
        if(bulletList[i].getBoundingClientRect().bottom>=document.getElementById("cannon").getBoundingClientRect().top+
            document.getElementById("cannon").clientHeight){
            bulletList[i].parentNode.removeChild(bulletList[i]);
        }
    }
}

