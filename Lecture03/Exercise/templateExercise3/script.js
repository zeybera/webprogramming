
// Task 1: Card Data Setup (1 Point) mit Array

let cards = ['🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍒', '🍒'];


//Task 2: Shuffling and Rendering the Cards with Loops(1 Point)
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
shuffle(cards);

const gameBoard = document.getElementById('game-board');


// Funktion zum Rendern der Karten
function renderCards() {
    gameBoard.innerHTML = ''; // Spielbrett leeren
    for (let i = 0; i < cards.length; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.symbol = cards[i]; // Speichere das Symbol als Datenattribut
      card.textContent = '?';           // Zeige einen Platzhalter
      card.addEventListener('click', flipCard);
      gameBoard.appendChild(card);
    }
  }
  
  // Initiales Rendering der Karten
  renderCards();


//Task 3: Implementing Flip Logic (1 Point) 
//mit Array flippedCards tracken, nur 2 gleichzeitig 
//Track flipped cards using an array.
//Ensure that only two cards can be flipped at a time.
//If two flipped cards match, keep them visible; otherwise, flip them back after a short delay.

let flippedCards = [];
let matchedPairs = 0;

function flipCard(event) {
  const card = event.target;
  
  // Verhindere, dass eine bereits umgedrehte Karte erneut geklickt wird
  // oder dass mehr als zwei Karten gleichzeitig umgedreht werden.
  if (card.classList.contains('flipped') || flippedCards.length === 2) return;
  
  // Karte umdrehen: Symbol anzeigen und CSS-Klasse hinzufügen
  card.classList.add('flipped');
  card.textContent = card.dataset.symbol;
  
  // Füge die Karte dem Array hinzu
  flippedCards.push(card);
  
  // Wenn zwei Karten umgedreht sind, prüfe, ob sie übereinstimmen
  if (flippedCards.length === 2) {
    checkForMatch();
  }
}


// Funktion zum Überprüfen, ob zwei umgedrehte Karten übereinstimmen
function checkForMatch() {
    // Destrukturiere die beiden Karten aus dem Array
    const [card1, card2] = flippedCards;
    
    // Vergleiche die Symbole der beiden Karten
    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;
      // Wenn sie übereinstimmen, lasse sie umgedreht und setze das Array zurück
      flippedCards = [];
       // Überprüfe, ob alle Paare gefunden wurden
        if (matchedPairs === cards.length / 2) {
        document.getElementById('message').classList.remove('d-none');
      }
    } else {
      // Wenn sie nicht übereinstimmen, drehe die Karten nach 1 Sekunde wieder um
      setTimeout(() => {
        card1.textContent = '?';
        card1.classList.remove('flipped');
        card2.textContent = '?';
        card2.classList.remove('flipped');
        // Array zurücksetzen, damit wieder Karten umgedreht werden können
        flippedCards = [];
      }, 1000);
    }
  }

// Annahme: gameBoard, cards, shuffle() und renderCards() sind bereits definiert

// Hole den Reset-Button aus dem DOM
const resetButton = document.getElementById('reset-button');

// Event-Listener für den Reset-Button
resetButton.addEventListener('click', () => {
    // Leere das Spielbrett
    gameBoard.innerHTML = '';
    
    // Mische das Karten-Array neu
    shuffle(cards);
    
    // Rende das Spielbrett neu (erstellt alle Karten wieder)
    renderCards();

    flippedCards = [];
    matchedPairs = 0;

     // Optionale: Gewinnmeldung wieder ausblenden
  document.getElementById('message').classList.add('d-none');
});

