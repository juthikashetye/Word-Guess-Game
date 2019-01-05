const totalGuesses = 10;
const validateKeys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

//Counter for Wins, Goes up for every correct country guessed
var winCounter = 0;
//Counter for Guesses Left, Goes down for every wrong alphabet guessed
var guessLeftCounter = totalGuesses;
//Alphabets already guessed
var historyArray = [];
//Winning music
var winMusic = new Audio('assets/audio/NFF-got-news-a.wav');
//Wrong Guess Music
var wrongGuessMusic = new Audio('assets/audio/NFF-bump.wav');
//Losing music
var loseMusic = new Audio('assets/audio/NFF-no-go.wav');

var spacemanImage = ['<img src="assets/images/spaceman1 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman2 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman3 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman4 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman5 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman6 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman7 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman8 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman9 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman10 copy.jpeg" width=170px>',
                    '<img src="assets/images/spaceman11 copy.jpeg" width=170px>'];

//Selecting Spans created in html
var winSpan = document.querySelector('#winSpan');
var maskedWordSpan = document.querySelector('#currentWordSpan');
var guessLeftSpan = document.querySelector('#guessLeftSpan');
var historySpan = document.querySelector('#historySpan');
var detailSpan = document.querySelector('#detailSpan');
var gmapCanvas = document.querySelector('#gmap_canvas2');
var flagSpan = document.querySelector('#flagSpan');
var spacemanSpan = document.querySelector('#spacemanSpan');

//A function for setting content of span
//so that we don't have to repeat .innerText for all spans
function setInnerTextOfSpan(span, text) {
    span.innerHTML = text;
}

//Holds randomly selected country details
var computerCountry = null;
//Holds state of current masked word
var maskedWord = [];

//Computer selects random country object from the list declared in countries.js
function generateRandomCountry() {
    var guessedCountry = countries[Math.floor(Math.random() * countries.length)];
    //To make life simpler we are changing name to same case
    return {
        longCode: guessedCountry.longCode,
        name: guessedCountry.name.toUpperCase(),
        shortCode: guessedCountry.shortCode
    }
}

//Set initial content for required html spans
function initializeDisplay() {
    setInnerTextOfSpan(winSpan, winCounter);
    setInnerTextOfSpan(maskedWordSpan, arrayToStringWithSpaceDelimited(maskedWord));
    setInnerTextOfSpan(guessLeftSpan, guessLeftCounter);
    setInnerTextOfSpan(historySpan, historyArray);
    setInnerTextOfSpan(spacemanSpan, spacemanImage[0]);
}

//Without this array of alphabets is separated by commas in it's string representation.
//We replace spaces with hyphens, in names of countries with multiple words.
//We then replace commas with spaces. 
function arrayToStringWithSpaceDelimited(inputArray) {
    return inputArray.toString()
        .replace(new RegExp(" ", 'g'), "-")
        .replace(new RegExp(",", 'g'), " ");
}

//Sets dashes according to the length of the chosen word
function initializeMaskedWord(guessedWord) {
    maskedWord = [];
    //for loop iterating through each character
    for (var i = 0; i < guessedWord.length; i++) {
        //for each character add "_" to the output String
        if (guessedWord[i] == " ")
            maskedWord[i] = " ";
        else
            maskedWord[i] = "_";
    }
}

//Function updateMaskedWord takes user input key and checks it's
//position in the computerCountry and updates the same postion in maskedWord
function updateMaskedWord(key) {
    for (var i = 0; i < maskedWord.length; i++) {
        if (computerCountry.name[i] == key) {
            maskedWord[i] = key;
        }
    }
}

//return key to uppercase if it is an alphabet
//if it is not an aplabet return null
function sanitizeInput(key) {
    if (validateKeys.includes(key)) {
        return key.toUpperCase();
    } else {
        return null;
    }
}

//Core game logic
function gameLoop() {
    if (guessLeftCounter > 0) {
        //1. get user input
        var k = sanitizeInput(event.key);
        //2. if user key was already guessed do nothing
        if (!historyArray.includes(k) && k != null) {
            //2.1 add letter in guesses so far
            historyArray.push(k);
            setInnerTextOfSpan(historySpan, historyArray);
            //3. Check if key is in computer's word
            if (computerCountry.name.includes(k)) {
                // 3.1 if true then display ALL occurances of 
                //user key in current word
                updateMaskedWord(k);
                //change text of maskedWord
                setInnerTextOfSpan(maskedWordSpan, arrayToStringWithSpaceDelimited(maskedWord));
                // 3.1.1 if complete word is guessed perform win process
                if (maskedWord.join("") == computerCountry.name) {
                    winCounter++;
                    winMusic.play();
                    //Reset guesses left and history span
                    guessLeftCounter = totalGuesses;
                    historyArray = [];
                    //Start new round
                    start();
                }

            }
            //3.2 if key is NOT in computer's word then 	
            else {
                //3.2.1 reduce guess left
                guessLeftCounter--;
                setInnerTextOfSpan(guessLeftSpan, guessLeftCounter);
                setInnerTextOfSpan(spacemanSpan, spacemanImage[totalGuesses-guessLeftCounter]);
                wrongGuessMusic.play();
            }
        }
    } //3.2.3 if guesses left is zero then start new round
    if (guessLeftCounter === 0) {
        loseMusic.play();
        guessLeftCounter = totalGuesses;
        historyArray = [];
        start();
    }
}

function getContinentName(continentShort) {
    var continentDetails = {
        "AF": "Africa",
        "AN": "Antarctica",
        "AS": "Asia",
        "EU": "Europe",
        "NA": "North America",
        "OC": "Oceania",
        "SA": "South America"
    }
    return continentDetails[continentShort];
}

//Start new round of game
function start() {
    if (computerCountry != null) {
        flagSpan.innerHTML =
            `<figure>
                <figcaption>This is the flag of ${computerCountry.name.toUpperCase()}.</figcaption> 
                <img  class = "img-fluid" id = "flagImage" src = "assets/images/flags-medium/${computerCountry.shortCode.toLowerCase()}.png"
                alt = "Sorry! Do not have flag of ${computerCountry.shortCode}">
            </figure>`;

        var countryDetails = countriesMap[computerCountry.shortCode];
        if (countryDetails != null) {
            detailSpan.innerHTML = ` The Country was ${computerCountry.name.toUpperCase()}.
            <br>
            ${computerCountry.name.toUpperCase()} lies in ${getContinentName(countryDetails.continent)}.
            <br>
            The capital of ${computerCountry.name.toUpperCase()} is ${countryDetails.capital}.
            <br>
            The currency of ${computerCountry.name.toUpperCase()} is ${countryDetails.currency}.`;
            gmapCanvas.src = "https://maps.google.com/maps?q=Country+of+" + computerCountry.name + "&ie=UTF8&iwloc=&output=embed";
        }

    }
    //start with main hangman image
    else{
        flagSpan.innerHTML =
            `<figure>
                <img  class = "img-fluid" id = "flagImage" src = "assets/images/earth.gif"
                alt = "Earth">
            </figure>`;
    }

    computerCountry = generateRandomCountry();
    initializeMaskedWord(computerCountry.name);
    initializeDisplay();
    document.onkeypress = gameLoop;
}
start();