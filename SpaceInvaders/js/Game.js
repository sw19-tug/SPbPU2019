
/* This class aggregates
- class GameViewer (renders all game field)
- class GameCore (runs all logics of the game)
*/

class Game {
	constructor() {

	}

	start() {
        document.getElementById("main_menu").style.display="none";
        document.getElementById("game_field").style.display="block";
    }

	stop() {

    }
}