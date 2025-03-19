//1. Piano Key Representation (1 point)
//Define piano keys as JavaScript objects, storing their relevant properties such as musical note and corresponding keyboard key.

//2. Dynamic Note Loading (1 point)
//Retrieve musical note sequences from an external JSON file using the fetch API. 
//The loaded data should be processed and made available for interactive use within the game.


//3. User Interaction (1 point)
//Implement interactive controls that allow users to trigger piano notes by either pressing designated keys on the keyboard or clicking on the displayed piano keys.

//4. Reset Functionality (1 point)
//Provide a mechanism to reset the game state, clearing active styles or effects and preparing the interface for a new session.


const pianoKeys = [];   //Noten-Objekte als Array speichern 
let currentSong = "notes.json";
let songPlaying = false; // Verhindert parallele Song-Wiedergaben
let songTimeouts = []; // Speichert aktive Zeitgeber

// Lade die Noten beim Start der Seite
document.addEventListener("DOMContentLoaded", () => loadPianoKeys());

document.getElementById("song1-btn")?.addEventListener("click", () => playSong("twinkle.json"));
document.getElementById("song2-btn")?.addEventListener("click", () => playSong("jakob.json"));
document.getElementById("reset-btn")?.addEventListener("click", resetPiano);

//Aufgabe 2: Notenfolge aus externer JSON-Datei laden
function loadPianoKeys(songFile = "notes.json") {
    fetch(songFile)
        .then(response => response.json())
        .then(data => {
            pianoKeys.length = 0;
            pianoKeys.push(...data.keys); // Noten-Objekte in Array einfügen-Aufagabe 1
            renderPianoKeys();
        })
        .catch(console.error);
}

// Aufgabe 3: Klaviertasten erstellt &  Mausklick auf eine Taste spielt den Sound ab
function renderPianoKeys() {
    const pianoContainer = document.getElementById('piano');
    pianoContainer.innerHTML = "";
    
    pianoKeys.forEach(keyObj => {
        const keyElement = document.createElement("div");
        keyElement.classList.add("key");
        keyElement.dataset.note = keyObj.note;
        keyElement.innerText = keyObj.key;
        keyElement.addEventListener("click", () => playSound(keyObj.note, keyElement));
        pianoContainer.appendChild(keyElement);
    });
    //Tastatursteuerung
    document.addEventListener("keydown", handleKeyPress);
}

//Ton Abspielen & animation 
function playSound(note, keyElement = null) {
    new Audio(`sounds/${note}.mp3`).play();
    
    if (!keyElement) {
        keyElement = document.querySelector(`.key[data-note='${note}']`);
    }
    
    if (keyElement) {
        keyElement.classList.add("active");
        setTimeout(() => keyElement.classList.remove("active"), 300);
    }
}

//Aufgabe 3: Tastatursteuerung
function handleKeyPress(event) {    //event.key
    const keyObj = pianoKeys.find(k => k.key.toUpperCase() === event.key.toUpperCase());
    if (keyObj) {
        const keyElement = document.querySelector(`.key[data-note='${keyObj.note}']`);
        playSound(keyObj.note, keyElement);
    }
}

//Aufagbe 4: Reset
function resetPiano() {
    document.querySelectorAll(".active").forEach(key => key.classList.remove("active"));
    songTimeouts.forEach(clearTimeout); // Alle laufenden Timeouts abbrechen
    songTimeouts = [];
    songPlaying = false; // Markiert, dass kein Song läuft
}

//optional: song abspielen
function playSong(songFile) {
    if (songPlaying) return; // Falls ein Song läuft, nicht erneut starten
    songPlaying = true;
    resetPiano(); // Setzt vorherigen Song zurück

    fetch(songFile)
        .then(response => response.json())
        .then(data => {
            data.keys.forEach((keyObj, i) => {
                const timeout = setTimeout(() => {
                    const keyElement = document.querySelector(`.key[data-note='${keyObj.note}']`);
                    playSound(keyObj.note, keyElement);
                    
                    if (i === data.keys.length - 1) {
                        songPlaying = false; // Song ist zu Ende
                    }
                }, i * 500);
                songTimeouts.push(timeout);
            });
        })
        .catch(console.error);
}
