
/* This class aggregates
- class GameViewer (renders all game field)
- class GameCore (runs all logics of the game)
*/

class Game {
	
	constructor() {
		
	}

	start() {	
        //set the position of the cannon
        this.cannonPosition=document.getElementById("main_menu").clientWidth/2;
        document.getElementById("cannon").style.left=this.cannonPosition+'px';
        //hide the main menu
        document.getElementById("main_menu").style.display="none";
        //show the gamefield
        document.getElementById("game_field").style.display="block";
        //get gamefield and cannon parameters
        this.fieldHeight=document.getElementById("game_field").clientHeight;
        this.fieldWidth=document.getElementById("game_field").clientWidth;
        this.cannonWidth=document.getElementById("cannonPic").clientWidth;
        this.cannonHeight=document.getElementById("cannon").clientHeight;
        document.onkeydown = logKey;
    }

	stop() {

    }
    
}