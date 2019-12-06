// This is the main file

let game = new Game();

let startButton = document.getElementById('start_button');
startButton.addEventListener('click', () => game.start());

function logKey(e) {
	pressedKey=`${e.code}`;
	switch(pressedKey){
		case 'ArrowRight':
			moveCannon(1);
			break;
		case 'ArrowLeft':
			moveCannon(-1);
			break;
	}
}

function moveCannon(direction){
	speed=10;
	currentPosition=game.cannonPosition+direction*speed;
	if((Math.abs(currentPosition)+game.cannonWidth/2<(game.fieldWidth-game.cannonWidth/2))){
		game.cannonPosition=currentPosition;
		document.getElementById("cannon").style.left=game.cannonPosition+'px';
	}
}	
