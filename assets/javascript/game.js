const totalGuesses = 10;


function generateRandomCountry() {
	//TODO : add randomization logic
	var guessedCountry = countries[Math.floor(Math.random()*countries.length)];
	return { 
		longCode : guessedCountry.longCode,
		name: guessedCountry.name.toLowerCase(),
		shortCode: guessedCountry.shortCode
	}
}	

function setInnerTextOfSpan (span, text){
	span.innerText = text;
}

var winCounter = 0;
var guessLeftCounter = totalGuesses;
var historyArray = [];

var winSpan = document.querySelector('#winSpan');
var maskedWordSpan = document.querySelector('#currentWordSpan');
var guessLeftSpan = document.querySelector('#guessLeftSpan');
var historySpan= document.querySelector('#historySpan');
var computerCountry = null;
var maskedWord = [];
var validateKeys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
//TODO : Remove
var tempSpan = document.querySelector('#tempSpan');	

function initializeDisplay() {
	setInnerTextOfSpan(winSpan, winCounter);
	setInnerTextOfSpan(maskedWordSpan, arrayToStringWithSpaceDelimited(maskedWord));
	setInnerTextOfSpan(guessLeftSpan, guessLeftCounter);
	setInnerTextOfSpan(historySpan, historyArray);
}
function arrayToStringWithSpaceDelimited(inputArray){
	return inputArray.toString()
	.replace(new RegExp(" ", 'g'), "-")
	.replace(new RegExp(",", 'g'), " ");
}
function initializeMaskedWord (guessedWord){
	var outputArray = [];
	//for loop iterating through each character
	for (var i = 0; i < guessedWord.length; i++) {
		//for each character add "_" to the output String
		if(guessedWord[i] == " ")
			outputArray[i] = " ";
		else	
			outputArray[i] = "_";
	}
	// outside loop return output string
	return outputArray;
}
//function updateMaskedWord takes user input key and checks it's
//position in the computerCountry and updates the same postion in maskedWord
function updateMaskedWord(key){
	for (var i = 0; i < maskedWord.length; i++) {
		if(computerCountry.name[i]==key){
		maskedWord[i] = key;
	}
	}
}
function sanitizeInput(key){
	//return key to lowercase if it is an alphabet
	//if it is not an aplabet return null
      if(validateKeys.includes(key)){
		return key.toLowerCase();
		}else {
			return null;
		}
}
function gameLoop(){
	//TODO : change to true when ready

	if(guessLeftCounter > 0){
		//1. get user input
		var k = sanitizeInput(event.key);
		//2. if user key was already guessed do nothing
		if(!historyArray.includes(k) && k !=null){
			//2.1 add letter in guesses so far
			historyArray.push(k);
			setInnerTextOfSpan(historySpan, historyArray);
			//3. Check if key is in computer's word
			if(computerCountry.name.includes(k)){
				// 3.1 if true then display ALL occurances of 
				//user key in current word
				updateMaskedWord(k);
				//change text of maskedWord
				setInnerTextOfSpan(maskedWordSpan, arrayToStringWithSpaceDelimited(maskedWord));
				// 3.1.1 if word is guessed perform win process
				if (maskedWord.join("")==computerCountry.name) {
					winCounter++;
					guessLeftCounter = totalGuesses;
					historyArray = [];
					start();
				}

			}
			//3.2 if key is NOT in computer's word then 	
			else {
				//3.2.1 reduce guess left
				guessLeftCounter--;
				setInnerTextOfSpan(guessLeftSpan, guessLeftCounter);
				}
		}
	}//3.2.3 if guesses left is zero then start new round
	if (guessLeftCounter==0) {
		alert("The word was : "+computerCountry.name);
		guessLeftCounter = totalGuesses;
		historyArray = [];
		start();
	}
}
function start(){
	var flagCode = "US";
	if(computerCountry != null){
		flagCode = computerCountry.name;
	}
	computerCountry = generateRandomCountry();
	maskedWord = initializeMaskedWord(computerCountry.name);
	initializeDisplay();
	document.onkeypress = gameLoop;
}
start();