/* Task 1: Set Up the Virtual Piano (1 Point)**
- Use the provided **HTML and CSS templates** to create a piano layout.
- Ensure the piano keys are correctly styled and positioned.
- Each key should have a unique identifier corresponding to a musical note.

Task 2: Implement Sound Playback (1 Point)**
- Ensure that each key plays the correct sound when clicked.
- Each key must correspond to a specific `.mp3` file stored in the `sounds` folder.
- Use the `<audio>` element in HTML or JavaScript to trigger sound playback.

Task 3: Enable Keyboard Input (1 Point)**
- Implement a way to play notes using keyboard keys (e.g., "A", "S", "D").
- Ensure that the correct note is played when the associated key is pressed.
- Test the functionality by verifying that both mouse clicks and keyboard presses trigger the expected notes.*/


// Zuordnung von Tasten zu Noten - Task 3
const keyMap = {
    "A": "C",
    "S": "D",
    "D": "E",
    "F": "F",
    "G": "G",
    "H": "A",
    "J": "B",

    //for #
    "W": "C5",
    "E": "D5",
    "T": "F4",
    "Z": "G4",
    "U": "A4",
};


// Funktion zum Abspielen des Sounds / sounds
function playSound(note) {
    new Audio(`sounds/${note}.mp3`).play();
    
}

// Funktion für visuelles Feedback -> wenn Taste gedrückt wird
function activateKey(note) {
    let keyElement = document.getElementById(`key${note}`);
    if (keyElement) {
        keyElement.classList.add("active");
        setTimeout(() => keyElement.classList.remove("active"), 200); // Nach 200ms entfernen
    }
}

// Klickereignis > Tasten; ruft playSound auf
document.querySelectorAll(".key, .black-key").forEach(key => {
    key.addEventListener("click", () => {           //statt click auch mousedown möglich
        let note = key.id.replace("key", "");       // Entfernt "key" aus der ID
        playSound(note);
        activateKey(note);
    });
});

// Tastatursteuerung
//mit keydown (und/oder keyup)

document.addEventListener("keydown", (event) => {
    let note = keyMap[event.key.toUpperCase()]; // damit Taste in Notennamen umgewandelt wird 
    if (note) {
        playSound(note);
        activateKey(note);
    }
});