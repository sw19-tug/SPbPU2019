var flgBig = false;    
const words=["light","respect","profit","expansion","heat","touch","move","rate","sound",
        "change","front","talk","relation","learning","print","servant","feeling","insurance",
        "punishment","iron","vessel","disease","event","price","judge","summer","science",
        "measure","organization","side","stage","account","javascript","monkey","amazing",
        "pancake","galvainze","cohort","concatenate","iteration","index","code","angular",
        "react","python",'good luck',"take care","welcome guest","written word","heavy competition",
        "the beginning of time","broken heart","seven virtues"]
var word = words[Math.floor(Math.random() * words.length)];
function guessLetter(){
	const targetButton = event.target;;
    targetButton.setAttribute("disabled", "disabled")
    let wordToUpper= word.toUpperCase();
    if (wordToUpper.indexOf(targetButton.value)===-1){
        drowHangman();
    }
}

function drowHangman(){
    if(hangmanParts.length){
    if( hangmanParts[0].className!='man')
    {
    hangmanParts[0].classList.remove("invisible");
    hangmanParts.shift();
    }
    else{
        man=document.querySelector(".man")
        hangmanParts=Array.from(man.children)
        console.log(hangmanParts)
    }
}
}

function placeholders() {
    var wrapper = document.getElementById('wordWrapper');
    var str = '';
    for (var i = 0; i < word.length; i++) {
        if(word[i]!=" ")
        {
            str = str + "_ ";
        }
        else {str = str + "  ";}
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
window.onload = function() { 
    placeholders();
    const hangmanPic=document.querySelector(".hangman");
    const hangmanPartsCollection=hangmanPic.children; 
    hangmanParts=this.Array.from(hangmanPartsCollection);
}
