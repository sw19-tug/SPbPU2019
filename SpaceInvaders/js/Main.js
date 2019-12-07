// This is the main file

let game = new Game();

let startButton = document.getElementById('start_button');
startButton.addEventListener('click', () => game.start());

let cannonBall=document.createElement('IMG');
let isCannonBallMoving=0;
let cannonBallTimer;
let alienCoordinates=[];//list of coordinates of the lowest aliens



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
        cannonBallTimer=setInterval("moveCannonBall(cannonBall)", 100);
        isCannonBallMoving=1;
    }    
}

//animation of the cannon ball
function moveCannonBall(){
    speed=20;
    newBottom=parseInt(cannonBall.style.bottom)+speed;
    if(newBottom<game.fieldHeight){
        cannonBall.style.bottom=newBottom+'px';
        leftBound=cannonBall.getBoundingClientRect().left;
        rightBound=cannonBall.getBoundingClientRect().right;
        bottomBound=cannonBall.getBoundingClientRect().bottom;
        checkForCollision(leftBound, rightBound, bottomBound);
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
	for (var i=0; i<game.rows-1; i++){
		for (var j=0; j<game.cols; j++){
			if (game.alienContainers[i][j].hasChildNodes()&&!game.alienContainers[i+1][j].hasChildNodes()){
				alienCoordinates.push([document.getElementById('alien '+i+' '+j).getBoundingClientRect().left, 
				document.getElementById('alien '+i+' '+j).getBoundingClientRect().right,
				document.getElementById('alien '+i+' '+j).getBoundingClientRect().bottom,
				i, j]);
			}
		}
	}
	i=game.rows-1;
	for (var j=0; j<game.cols; j++){
		if (game.alienContainers[i][j].hasChildNodes()){
			alienCoordinates.push([document.getElementById('alien '+i+' '+j).getBoundingClientRect().left, 
				document.getElementById('alien '+i+' '+j).getBoundingClientRect().right,
				document.getElementById('alien '+i+' '+j).getBoundingClientRect().bottom,
				i, j]);
			
		}
	}
}

//checking if the cannon ball hit any of the aliens
function checkForCollision(left, right, bottom){
	for (var i=0; i<alienCoordinates.length; i++){
		if ((alienCoordinates[i][0]<=left)&&(alienCoordinates[i][1]>=right)&&(alienCoordinates[i][2]>=bottom)){
			cannonBall.style.display='none';
        	isCannonBallMoving=0;
        	clearInterval(cannonBallTimer);
        	elem=document.getElementById('alien '+alienCoordinates[i][3]+' '+alienCoordinates[i][4]);
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
    checkForBottom();

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
    }
}

function victory(){
    //what to do if all of the aliens are defeated
}
