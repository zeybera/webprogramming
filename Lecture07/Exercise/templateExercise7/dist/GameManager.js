import { GameEvents, GameTheme } from './types';
/**
 * GameManager Klasse
 * Verwaltet die Spiellogik und den Spielzustand
 */
export class GameManager {
    /**
     * Konstruktor
     * @param config - Spielkonfiguration (Anzahl Paare, Spieler, Theme)
     */
    constructor(config) {
        this.flippedCards = []; // Aktuell umgedrehte Karten
        this.eventListeners = new Map(); // Event Listener
        this.config = config;
        this.state = this.initializeGame();
    }
    /**
     * Initialisiert ein neues Spiel
     */
    initializeGame() {
        return {
            cards: this.generateCards(),
            players: this.initializePlayers(),
            currentPlayer: 0,
            isGameOver: false
        };
    }
    /**
     * Generiert die Spielkarten basierend auf der Konfiguration
     */
    generateCards() {
        const cards = [];
        const values = this.getCardValues();
        for (let i = 0; i < this.config.numberOfPairs; i++) {
            const value = values[i];
            cards.push(this.createCard(i * 2, value), this.createCard(i * 2 + 1, value));
        }
        return this.shuffleCards(cards);
    }
    /**
     * Erstellt eine neue Spielkarte
     */
    createCard(id, value) {
        return { id, value, isFlipped: false, isMatched: false };
    }
    /**
     * Gibt die Kartenwerte basierend auf dem gewählten Theme zurück
     */
    getCardValues() {
        switch (this.config.theme) {
            case GameTheme.NUMBERS:
                return Array.from({ length: this.config.numberOfPairs }, (_, i) => (i + 1).toString());
            case GameTheme.EMOJIS:
                return ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'].slice(0, this.config.numberOfPairs);
            case GameTheme.COLORS:
                return ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'cyan'].slice(0, this.config.numberOfPairs);
            default:
                return Array.from({ length: this.config.numberOfPairs }, (_, i) => (i + 1).toString());
        }
    }
    /**
     * Mischt ein Array von Elementen (Fisher-Yates Algorithmus)
     */
    shuffleCards(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    /**
     * Initialisiert die Spieler
     */
    initializePlayers() {
        return Array.from({ length: this.config.numberOfPlayers }, (_, i) => ({
            id: i,
            name: `Player ${i + 1}`,
            score: 0,
            isActive: i === 0
        }));
    }
    /**
     * Fügt einen Event Listener hinzu
     */
    addEventListener(event, handler) {
        var _a;
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        (_a = this.eventListeners.get(event)) === null || _a === void 0 ? void 0 : _a.push(handler);
    }
    /**
     * Entfernt einen Event Listener
     */
    removeEventListener(event, handler) {
        const handlers = this.eventListeners.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }
    /**
     * Löst ein Event aus
     */
    emitEvent(event, data) {
        const handlers = this.eventListeners.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }
    /**
     * Dreht eine Karte um
     */
    flipCard(cardId) {
        const card = this.state.cards.find(c => c.id === cardId);
        if (!card || card.isMatched || card.isFlipped || this.flippedCards.length >= 2) {
            return;
        }
        card.isFlipped = true;
        this.flippedCards.push(card);
        const payload = {
            cardId,
            playerId: this.state.currentPlayer
        };
        this.emitEvent(GameEvents.CARD_FLIP, payload);
        this.updateGameState({
            ...this.state,
            lastAction: {
                type: GameEvents.CARD_FLIP,
                timestamp: Date.now(),
                payload
            }
        });
        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }
    }
    /**
     * Prüft, ob die umgedrehten Karten ein Paar bilden
     */
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const isMatch = card1.value === card2.value;
        if (isMatch) {
            card1.isMatched = card2.isMatched = true;
            const currentPlayer = this.state.players[this.state.currentPlayer];
            currentPlayer.score += 1;
            const payload = {
                cards: [card1.id, card2.id],
                playerId: this.state.currentPlayer,
                score: currentPlayer.score
            };
            this.emitEvent(GameEvents.MATCH_FOUND, payload);
            this.updateGameState({
                ...this.state,
                lastAction: {
                    type: GameEvents.MATCH_FOUND,
                    timestamp: Date.now(),
                    payload
                }
            });
            if (this.checkGameOver()) {
                this.emitEvent(GameEvents.GAME_OVER, this.state);
            }
        }
        else {
            setTimeout(() => {
                card1.isFlipped = card2.isFlipped = false;
                this.emitEvent(GameEvents.NO_MATCH, { cards: [card1.id, card2.id] });
                this.switchPlayer();
            }, 1000);
        }
        this.flippedCards = [];
    }
    /**
     * Wechselt zum nächsten Spieler
     */
    switchPlayer() {
        const currentPlayer = this.state.currentPlayer;
        const nextPlayer = (currentPlayer + 1) % this.config.numberOfPlayers;
        const payload = {
            previousPlayer: currentPlayer,
            nextPlayer
        };
        this.state.players[currentPlayer].isActive = false;
        this.state.players[nextPlayer].isActive = true;
        this.updateGameState({
            ...this.state,
            currentPlayer: nextPlayer,
            lastAction: {
                type: GameEvents.PLAYER_SWITCH,
                timestamp: Date.now(),
                payload
            }
        });
        this.emitEvent(GameEvents.PLAYER_SWITCH, payload);
    }
    /**
     * Prüft, ob das Spiel beendet ist
     */
    checkGameOver() {
        const isGameOver = this.state.cards.every(card => card.isMatched);
        if (isGameOver) {
            this.updateGameState({
                ...this.state,
                isGameOver: true
            });
        }
        return isGameOver;
    }
    /**
     * Aktualisiert den Spielzustand
     */
    updateGameState(newState) {
        this.state = newState;
    }
    /**
     * Gibt den aktuellen Spielzustand zurück (schreibgeschützt)
     */
    getState() {
        return Object.freeze({ ...this.state });
    }
    /**
     * Gibt die aktuelle Spielkonfiguration zurück (schreibgeschützt)
     */
    getConfig() {
        return Object.freeze({ ...this.config });
    }
}
