// 🎹 Virtuelles Piano – Aufgabe 5 in TypeScript

// ✅ Interface zur Typdefinition für Tastenobjekte
interface PianoKey {
  key: string;
  note: string;
  sound: string;
}

// ✅ Globale Variablen mit Typisierung
const pianoKeys: PianoKey[] = [
  { key: "A", note: "C", sound: "sounds/C.mp3" },
  { key: "S", note: "D", sound: "sounds/D.mp3" },
  { key: "D", note: "E", sound: "sounds/E.mp3" },
  { key: "F", note: "F", sound: "sounds/F.mp3" },
  { key: "G", note: "G", sound: "sounds/G.mp3" },
  { key: "H", note: "A", sound: "sounds/A.mp3" },
  { key: "J", note: "B", sound: "sounds/B.mp3" }
];

// ✅ Funktion zum Abspielen des Sounds
function playSound(note: string): void {
  const audio: HTMLAudioElement = new Audio(`sounds/${note}.mp3`);
  audio.play();

  const keyElement = document.querySelector(`.key[data-note='${note}']`);
  if (keyElement) {
    keyElement.classList.add("active");
    setTimeout(() => keyElement.classList.remove("active"), 300);
  }
}

// ✅ Tastendruck erkennen
function handleKeyPress(event: KeyboardEvent): void {
  const keyObj = pianoKeys.find(k => k.key.toUpperCase() === event.key.toUpperCase());
  if (keyObj) {
    playSound(keyObj.note);
  }
}

// ✅ Mausklick auf HTML-Tasten erkennen
function initClickEvents(): void {
  pianoKeys.forEach(keyObj => {
    const el = document.querySelector(`.key[data-note='${keyObj.note}']`);
    if (el) {
      el.addEventListener("click", () => playSound(keyObj.note));
    }
  });
}

// ✅ Reset-Funktion (z. B. für Reset-Button)
function resetPiano(): void {
  document.querySelectorAll(".key.active").forEach(el => el.classList.remove("active"));
}

// ✅ Initialisierung
window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", handleKeyPress);
  initClickEvents();

  document.getElementById("reset-notes")?.addEventListener("click", resetPiano);
});
