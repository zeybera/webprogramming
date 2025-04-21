import { 
    Card, Player, GameState, GameEvents, GameConfig, GameTheme,
    EventHandler, CardId, PlayerId, CardFlipPayload,
    MatchFoundPayload, PlayerSwitchPayload, GameAction
} from './types';

/**
 * GameManager Klasse
 * Verwaltet die Spiellogik und den Spielzustand
 */
export class GameManager {
    private state: GameState;                                          // Aktueller Spielzustand
    private config: GameConfig;                                        // Spielkonfiguration
    private flippedCards: Card[] = [];                                // Aktuell umgedrehte Karten
    private eventListeners: Map<GameEvents, EventHandler<any>[]> = new Map(); // Event Listener

    /**
     * Konstruktor
     * @param config - Spielkonfiguration (Anzahl Paare, Spieler, Theme)
     */
    constructor(config: GameConfig) {
        this.config = config;
        this.state = this.initializeGame();
    }

    /**
     * Initialisiert ein neues Spiel
     */
    private initializeGame(): GameState {
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
    private generateCards(): Card[] {
        const cards: Card[] = [];
        const values = this.getCardValues();
        
        for (let i = 0; i < this.config.numberOfPairs; i++) {
            const value = values[i];
            cards.push(
                this.createCard(i * 2, value),
                this.createCard(i * 2 + 1, value)
            );
        }

        return this.shuffleCards(cards);
    }

    /**
     * Erstellt eine neue Spielkarte
     */
    private createCard(id: CardId, value: string): Card {
        return { id, value, isFlipped: false, isMatched: false };
    }

    /**
     * Gibt die Kartenwerte basierend auf dem gewählten Theme zurück
     */
    private getCardValues(): string[] {
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
    private shuffleCards<T>(array: T[]): T[] {
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
    private initializePlayers(): Player[] {
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
    public addEventListener<T>(event: GameEvents, handler: EventHandler<T>): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)?.push(handler);
    }

    /**
     * Entfernt einen Event Listener
     */
    public removeEventListener<T>(event: GameEvents, handler: EventHandler<T>): void {
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
    private emitEvent<T>(event: GameEvents, data: T): void {
        const handlers = this.eventListeners.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    /**
     * Dreht eine Karte um
     */
    public flipCard(cardId: CardId): void {
        const card = this.state.cards.find(c => c.id === cardId);
        if (!card || card.isMatched || card.isFlipped || this.flippedCards.length >= 2) {
            return;
        }

        card.isFlipped = true;
        this.flippedCards.push(card);

        const payload: CardFlipPayload = {
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
    private checkMatch(): void {
        const [card1, card2] = this.flippedCards;
        const isMatch = card1.value === card2.value;

        if (isMatch) {
            card1.isMatched = card2.isMatched = true;
            const currentPlayer = this.state.players[this.state.currentPlayer];
            currentPlayer.score += 1;

            const payload: MatchFoundPayload = {
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
        } else {
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
    private switchPlayer(): void {
        const currentPlayer = this.state.currentPlayer;
        const nextPlayer = (currentPlayer + 1) % this.config.numberOfPlayers;

        const payload: PlayerSwitchPayload = {
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
    private checkGameOver(): boolean {
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
    private updateGameState(newState: GameState): void {
        this.state = newState;
    }

    /**
     * Gibt den aktuellen Spielzustand zurück (schreibgeschützt)
     */
    public getState(): Readonly<GameState> {
        return Object.freeze({ ...this.state });
    }

    /**
     * Gibt die aktuelle Spielkonfiguration zurück (schreibgeschützt)
     */
    public getConfig(): Readonly<GameConfig> {
        return Object.freeze({ ...this.config });
    }
}
