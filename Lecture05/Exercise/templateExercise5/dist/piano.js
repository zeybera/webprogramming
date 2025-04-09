"use strict";
// 🎹 Virtuelles Piano – Aufgabe 5 in TypeScript
// ✅ Globale Variablen mit Typisierung
const pianoKeys = [
    { key: "A", note: "C", sound: "sounds/C.mp3" },
    { key: "S", note: "D", sound: "sounds/D.mp3" },
    { key: "D", note: "E", sound: "sounds/E.mp3" },
    { key: "F", note: "F", sound: "sounds/F.mp3" },
    { key: "G", note: "G", sound: "sounds/G.mp3" },
    { key: "H", note: "A", sound: "sounds/A.mp3" },
    { key: "J", note: "B", sound: "sounds/B.mp3" }
];
// ✅ Funktion zum Abspielen des Sounds
function playSound(note) {
    const audio = new Audio(`sounds/${note}.mp3`);
    audio.play();
    const keyElement = document.querySelector(`.key[data-note='${note}']`);
    if (keyElement) {
        keyElement.classList.add("active");
        setTimeout(() => keyElement.classList.remove("active"), 300);
    }
}
// ✅ Tastendruck erkennen
function handleKeyPress(event) {
    const keyObj = pianoKeys.find(k => k.key.toUpperCase() === event.key.toUpperCase());
    if (keyObj) {
        playSound(keyObj.note);
    }
}
// ✅ Mausklick auf HTML-Tasten erkennen
function initClickEvents() {
    pianoKeys.forEach(keyObj => {
        const el = document.querySelector(`.key[data-note='${keyObj.note}']`);
        if (el) {
            el.addEventListener("click", () => playSound(keyObj.note));
        }
    });
}
// ✅ Reset-Funktion (z. B. für Reset-Button)
function resetPiano() {
    document.querySelectorAll(".key.active").forEach(el => el.classList.remove("active"));
}
// ✅ Initialisierung
window.addEventListener("DOMContentLoaded", () => {
    var _a;
    document.addEventListener("keydown", handleKeyPress);
    initClickEvents();
    (_a = document.getElementById("reset-notes")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", resetPiano);
});
