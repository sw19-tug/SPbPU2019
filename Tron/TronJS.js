const canvas = document.getElementById('tron');
const context = canvas.getContext('2d');
const unit = 15;
const Direction = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
};

class Player {
    constructor(x, y, color) {
        this.color = color || '#fff';
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.dead = false;
        this.constructor.counter = (this.constructor.counter || 0) + 1;
        this._id = this.constructor.counter;

        Player.allInstances.push(this);
    }
}

Player.allInstances = [];
let color1, color2;
if (localStorage.getItem("player1color") !== null)
    color1 = localStorage.getItem("player1color");
else
    color1 = '#FF5050';
if (localStorage.getItem("player2color") !== null)
    color2 = localStorage.getItem("player2color");
else
    color2 = '#75A4FF';
let p1 = new Player(unit * 6, unit * 6, color1);
let p2 = new Player(unit * 44, unit * 28, color2);

if (localStorage.getItem("arenaSmallSize") === "T") {
    canvas.style.width = "510px";
    canvas.style.height = "300px"
}

function setKey(key, player, up, right, down, left) {
    switch (key) {
        case up:
            if (player.direction !== Direction.DOWN) {
                player.key = Direction.UP;
            }
            break;
        case right:
            if (player.direction !== Direction.LEFT) {
                player.key = Direction.RIGHT;
            }
            break;
        case down:
            if (player.direction !== Direction.UP) {
                player.key = Direction.DOWN;
            }
            break;
        case left:
            if (player.direction !== Direction.RIGHT) {
                player.key = Direction.LEFT;
            }
            break;
        default:
            break;
    }
}

function handleKeyPress(event) {
    let key = event.key.toLowerCase();
    switch (key) {
        case 'enter':
        case 'escape':
        case ' ':
            resetGame();
            break;
    }
    setKey(key, p1, 'w', 'd', 's', 'a');
    setKey(key, p2, 'arrowup', 'arrowright', 'arrowdown', 'arrowleft');
}

document.addEventListener('keydown', handleKeyPress);

function getPlayableCells(canvas, unit) {
    let playableCells = new Set();
    for (let i = 0; i < canvas.width / unit; i++) {
        for (let j = 0; j < canvas.height / unit; j++) {
            playableCells.add(`${i * unit}x${j * unit}y`);
        }
    }
    return playableCells;
}

let playableCells = getPlayableCells(canvas, unit);

function drawBackground() {
    context.strokeStyle = '#071126';
    for (let i = 0; i <= canvas.width / unit + 2; i += 2) {
        for (let j = 0; j <= canvas.height / unit + 2; j += 2) {
            context.strokeRect(0, 0, unit * i, unit * j);
        }
    }
    context.strokeStyle = '#000000';
    context.lineWidth = 0;
    for (let i = 1; i <= canvas.width / unit; i += 2) {
        for (let j = 1; j <= canvas.height / unit; j += 2) {
            context.strokeRect(0, 0, unit * i, unit * j);
        }
    }
    context.lineWidth = 0;
}

drawBackground();

function drawStartingPositions(players) {
    players.forEach(p => {
        context.fillStyle = p.color;
        context.fillRect(p.x, p.y, unit, unit);
        context.strokeStyle = 'black';
        context.strokeRect(p.x, p.y, unit, unit);
    });
}

drawStartingPositions(Player.allInstances);

let outcome, winnerColor, playerCount = Player.allInstances.length;

function draw() {
    if (Player.allInstances.filter(p => !p.key).length === 0) {
        Player.allInstances.forEach(p => {
            if (p.key) {
                p.direction = p.key;

                context.fillStyle = p.color;
                context.fillRect(p.x, p.y, unit, unit);
                context.strokeStyle = 'black';
                context.strokeRect(p.x, p.y, unit, unit);

                if (!playableCells.has(`${p.x}x${p.y}y`) && p.dead === false) {
                    p.dead = true;
                    p.direction = '';
                    playerCount -= 1;
                }

                playableCells.delete(`${p.x}x${p.y}y`);

                if (!p.dead) {
                    if (p.direction === Direction.LEFT) p.x -= unit;
                    if (p.direction === Direction.UP) p.y -= unit;
                    if (p.direction === Direction.RIGHT) p.x += unit;
                    if (p.direction === Direction.DOWN) p.y += unit;
                } else resetGame();
            }
        });
    }
}

let game = setInterval(draw, 100);

function resetGame() {
    // Remove the results node
    const result = document.getElementById('result');
    if (result) result.remove();

    // Remove background then re-draw it
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // Reset playableCells
    playableCells = getPlayableCells(canvas, unit);

    // Reset players
    Player.allInstances.forEach(p => {
        p.x = p.startX;
        p.y = p.startY;
        p.dead = false;
        p.direction = '';
        p.key = '';
    });
    playerCount = Player.allInstances.length;
    drawStartingPositions(Player.allInstances);

    // Reset outcome
    outcome = '';
    winnerColor = '';

    // Ensure draw() has stopped, then re-trigger it
    clearInterval(game);
    game = setInterval(draw, 100);
}