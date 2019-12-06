
/* This class aggregates
- class GameViewer (renders all game field)
- class GameCore (runs all logics of the game)
*/

class Game {
	
	constructor() {
		
	}

	start() {
		// hide main menu
        document.getElementById("main_menu").style.display="none";  

		// show gamefield elements
        document.getElementById("game_field").style.display="block";
        this.fieldHeight=document.getElementById("game_field").clientHeight;
        this.fieldWidth=document.getElementById("game_field").clientWidth;
		
		// show cannon
        this.cannonPosition=0;
        document.getElementById("cannon").style.left=this.cannonPosition;
        this.cannonWidth=document.getElementById("cannonPic").clientWidth;
		
		// setup controls
        document.onkeydown = logKey;
    }

	stop() {

    }
    
}