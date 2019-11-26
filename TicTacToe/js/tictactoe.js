function selectMode(mode) {
    document.getElementById('modal').style.display = 'none';
    !!mode ? multiPlayer() : singlePlayer();
}

function singlePlayer() {
    alert('You chose to play with a computer!');
}

function multiPlayer() {
    alert('You chose to play with a friend!');
}