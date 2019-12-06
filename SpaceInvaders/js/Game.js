
/* This class aggregates
- class GameViewer (renders all game field)
- class GameCore (runs all logics of the game)
*/

class Game {
	
	constructor() {
		
	}

	start() {		
        document.getElementById("main_menu").style.display="none";        
        this.cannonPosition=0;
        document.getElementById("cannon").style.left=this.cannonPosition;
        document.getElementById("game_field").style.display="block";
        this.fieldHeight=document.getElementById("game_field").clientHeight;
        this.fieldWidth=document.getElementById("game_field").clientWidth;
        this.cannonWidth=document.getElementById("cannonPic").clientWidth;
        document.onkeydown = logKey;
    }

	stop() {

    }
    
}