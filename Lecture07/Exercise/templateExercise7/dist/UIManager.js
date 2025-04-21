import { GameEvents } from './types';
/**
 * UIManager Klasse
 * Verwaltet die Benutzeroberfläche des Memory-Spiels
 */
export class UIManager {
    /**
     * Konstruktor
     * @param gameManager - Referenz zum GameManager
     */
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.cardElements = new Map(); // Karten-Elemente
        this.elements = {
            gameBoard: document.getElementById('game-board'),
            scoreBoard: document.getElementById('score-board')
        };
        this.initializeEventListeners();
        this.renderInitialState();
    }
    /**
     * Initialisiert die Event Listener für Spielereignisse
     */
    initializeEventListeners() {
        // Event: Karte wurde umgedreht
        this.gameManager.addEventListener(GameEvents.CARD_FLIP, ({ cardId }) => this.updateCardUI(cardId));
        // Event: Ein Paar wurde gefunden
        this.gameManager.addEventListener(GameEvents.MATCH_FOUND, ({ cards }) => {
            cards.forEach(cardId => this.updateCardUI(cardId));
            this.updateScoreBoard();
        });
        // Event: Kein Paar gefunden
        this.gameManager.addEventListener(GameEvents.NO_MATCH, ({ cards }) => {
            cards.forEach(cardId => this.updateCardUI(cardId));
        });
        // Event: Spielerwechsel
        this.gameManager.addEventListener(GameEvents.PLAYER_SWITCH, () => this.updateScoreBoard());
        // Event: Spiel ist beendet
        this.gameManager.addEventListener(GameEvents.GAME_OVER, (state) => this.showGameOver(state.players));
    }
    /**
     * Rendert den initialen Spielzustand
     */
    renderInitialState() {
        this.renderGameBoard();
        this.renderScoreBoard();
    }
    /**
     * Rendert das Spielbrett mit allen Karten
     */
    renderGameBoard() {
        const state = this.gameManager.getState();
        this.elements.gameBoard.innerHTML = '';
        this.cardElements.clear();
        state.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            this.elements.gameBoard.appendChild(cardElement);
            this.cardElements.set(card.id, cardElement);
        });
    }
    /**
     * Erstellt ein DOM-Element für eine Spielkarte
     */
    createCardElement(card) {
        const container = document.createElement('div');
        container.className = 'col-2 mb-3';
        container.innerHTML = `
            <div class="card-container" data-card-id="${card.id}">
                <div class="card ${this.getCardClasses(card)}">
                    <div class="card-front"></div>
                    <div class="card-back">${card.value}</div>
                </div>
            </div>
        `;
        const cardContainer = container.querySelector('.card-container');
        cardContainer.addEventListener('click', () => this.handleCardClick(card.id));
        return container;
    }
    /**
     * Generiert CSS-Klassen für eine Karte basierend auf ihrem Zustand
     */
    getCardClasses(card) {
        const classes = [];
        if (card.isFlipped)
            classes.push('flipped');
        if (card.isMatched)
            classes.push('matched');
        return classes.join(' ');
    }
    /**
     * Behandelt Klick-Events auf Karten
     */
    handleCardClick(cardId) {
        this.gameManager.flipCard(cardId);
    }
    /**
     * Aktualisiert die Darstellung einer Karte
     */
    updateCardUI(cardId) {
        const state = this.gameManager.getState();
        const card = state.cards.find(c => c.id === cardId);
        if (!card)
            return;
        const cardElement = this.cardElements.get(cardId);
        if (!cardElement)
            return;
        const cardInner = cardElement.querySelector('.card');
        cardInner.className = `card ${this.getCardClasses(card)}`;
    }
    /**
     * Rendert die Punkteanzeige
     */
    renderScoreBoard() {
        const state = this.gameManager.getState();
        this.elements.scoreBoard.innerHTML = `
            <div class="row">
                ${state.players.map(player => this.createPlayerScoreElement(player)).join('')}
            </div>
        `;
    }
    /**
     * Erstellt das HTML für einen Spieler in der Punkteanzeige
     */
    createPlayerScoreElement(player) {
        return `
            <div class="col text-center ${player.isActive ? 'active-player' : ''}">
                <h3>${player.name}</h3>
                <p class="score">Score: ${player.score}</p>
            </div>
        `;
    }
    /**
     * Aktualisiert die Punkteanzeige
     */
    updateScoreBoard() {
        this.renderScoreBoard();
    }
    /**
     * Zeigt den Game Over Dialog an
     */
    showGameOver(players) {
        const winner = this.determineWinner(players);
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Game Over!</h2>
                <p>${this.createWinnerMessage(winner)}</p>
                <button class="btn btn-primary" onclick="location.reload()">Play Again</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    /**
     * Ermittelt den/die Gewinner des Spiels
     */
    determineWinner(players) {
        const maxScore = Math.max(...players.map(p => p.score));
        return players.filter(p => p.score === maxScore);
    }
    /**
     * Erstellt die Gewinner-Nachricht
     */
    createWinnerMessage(winners) {
        if (winners.length > 1) {
            return `It's a tie between ${winners.map(w => w.name).join(' and ')}!`;
        }
        return `${winners[0].name} wins with ${winners[0].score} points!`;
    }
}
