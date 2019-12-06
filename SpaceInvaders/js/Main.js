// This is the main file

let game = new Game();

let startButton = document.getElementById('start_button');
startButton.addEventListener('click', () => game.start());

let cannonBall=document.createElement('IMG');
let isCannonBallMoving=0;
let intr;//timer for the cannon ball

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
        intr=setInterval("moveCannonBall(cannonBall)", 100);
        isCannonBallMoving=1;
    }    
}

//animation of the cannon ball
function moveCannonBall(){
    speed=20;
    newBottom=parseInt(cannonBall.style.bottom)+speed;
    if(newBottom<game.fieldHeight){
        cannonBall.style.bottom=newBottom+'px';
    }
    else{
        cannonBall.style.display='none';
        isCannonBallMoving=0;
        clearInterval(intr);
    }
}
