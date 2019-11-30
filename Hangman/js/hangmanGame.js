var flgBig = false;
function guessLetter(){
	const targetButton = event.target;;
	targetButton.setAttribute("disabled", "disabled")
}

function placeholders() {
    var words = [
        "javascript",
        "monkey",
        "amazing",
        "pancake",
        "galvainze",
        "cohort",
        "concatenate",
        "iteration",
        "index",
        "code",
        "angular",
        "react",
        "python"
    ];
    // Pick a random word
    var word = words[Math.floor(Math.random() * words.length)];
    var wrapper = document.getElementById('wordWrapper');
    var str = '';
    for (var i = 0; i < word.length; i++) {
        str = str + "_ ";
    }
    wrapper.textContent = str;
}


 function makeLettersBig(){
    
    if (flgBig) {
        document.getElementById("wordWrapper").style.fontSize = "50px";
        document.getElementById("letterBank").style.fontSize = "35px";
        document.getElementById("bigButton").value = "Big letters";
        flgBig = false;
    }
    else {
        document.getElementById("wordWrapper").style.fontSize = "75px";
        document.getElementById("letterBank").style.fontSize = "50px";
        document.getElementById("bigButton").value = "Small letters";
        flgBig = true;
    }
}
window.onload = function() { placeholders(); }
