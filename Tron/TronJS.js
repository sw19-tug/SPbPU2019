let movement;
player1=document.getElementById("player1");

function init(){
    player1.style.top='150px';
    player1.style.left='150px';
}

window.onload=init;

function setKey(key) {
    switch (key) {
        case 'w':
        case 'ц':
            player1.style.top=parseInt(player1.style.top)-5+'px';
            break;
        case 'd':
        case 'в':
            player1.style.left=parseInt(player1.style.left)+5+'px';
            break;
        case 's':
        case 'ы':
            player1.style.top=parseInt(player1.style.top)+5+'px';
            break;
        case 'a':
        case 'ф':
            player1.style.left=parseInt(player1.style.left)-5+'px';
            break;
        default:
            break;
    };
};

function handleKeyPress(event) {
    let key = event.key;
    switch (key) {
        case 'w':
        case 'ц':
        case 'd':
        case 'ф':
        case 's':
        case 'ы':
        case 'a':
        case 'в':
            if(movement!==undefined)
                clearInterval(movement);
            movement=setInterval(()=>setKey(key),100);
            break;
        case ' ':
            if(movement!==undefined)
                clearInterval(movement);
            break;
        default:
            break;
    };
};
document.addEventListener('keydown', handleKeyPress);