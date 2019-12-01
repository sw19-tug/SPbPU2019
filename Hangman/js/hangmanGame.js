var flgBig = false;
var arrayRes = [];
var word;
function guessLetter() {
    const targetButton = event.target;;
    targetButton.setAttribute("disabled", "disabled");
    //getting id letter
    document.getElementById('letterBank').onclick = function (e) {
        letter = e.target.getAttribute('id');
        addLetters(letter);
    }
}

function placeholders() {
    const words = ["light", "respect", "profit", "expansion", "heat", "touch", "move", "rate", "sound",
        "change", "front", "talk", "relation", "learning", "print", "servant", "feeling", "insurance",
        "punishment", "iron", "vessel", "disease", "event", "price", "judge", "summer", "science",
        "measure", "organization", "side", "stage", "account", "javascript", "monkey", "amazing",
        "pancake", "galvainze", "cohort", "concatenate", "iteration", "index", "code", "angular",
        "react", "python", 'good luck', "take care", "welcome guest", "written word", "heavy competition",
        "the beginning of time", "broken heart", "seven virtues"]
    // Pick a random word
    word = words[Math.floor(Math.random() * words.length)];
    var wrapper = document.getElementById('wordWrapper');
    for (var i = 0; i < word.length; i++) {
        if (word[i] != " ") {
            arrayRes[i] = "_";
        }
        else { arrayRes[i] = " "; }
    }
    wrapper.textContent = arrayRes.join(" ");
}

//adding a letter to placeholder
function addLetters(letter) {
    for (var j = 0; j < word.length; j++) {
        if (word[j] === letter && arrayRes[j] === "_") {
            arrayRes[j] = letter;
        }
    }
    var wrapper = document.getElementById('wordWrapper');
    wrapper.textContent = arrayRes.join(" ");
}

function makeLettersBig() {
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
window.onload = function () { placeholders(); }