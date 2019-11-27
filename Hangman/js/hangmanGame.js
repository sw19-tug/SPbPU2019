function guessLetter(){
	const targetButton = event.target
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
window.onload = placeholders();

