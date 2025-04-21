import { GameManager } from './GameManager';
import {
    Card, GameEvents, Player, CardId,
    CardFlipPayload, MatchFoundPayload,
    PlayerSwitchPayload, GameState
} from './types';

/**
 * Interface für die UI-Elemente des Spiels
 */
interface UIElements {
    gameBoard: HTMLElement;  // Container für die Spielkarten
    scoreBoard: HTMLElement; // Container für die Punkteanzeige
}

/**
 * Interface für ein Karten-DOM-Element
 */
interface CardElement extends HTMLElement {
    dataset: {
        cardId: string;  // ID der Karte im data-attribute
    };
}

/**
 * UIManager Klasse
 * Verwaltet die Benutzeroberfläche des Memory-Spiels
 */
export class UIManager {
    private readonly elements: UIElements;                             // UI-Elemente
    private readonly cardElements: Map<CardId, CardElement> = new Map(); // Karten-Elemente

    /**
     * Konstruktor
     * @param gameManager - Referenz zum GameManager
     */
    constructor(private readonly gameManager: GameManager) {
        this.elements = {
            gameBoard: document.getElementById('game-board') as HTMLElement,
            scoreBoard: document.getElementById('score-board') as HTMLElement
        };
        this.initializeEventListeners();
        this.renderInitialState();
    }

    /**
     * Initialisiert die Event Listener für Spielereignisse
     */
    private initializeEventListeners(): void {
        // Event: Karte wurde umgedreht
        this.gameManager.addEventListener<CardFlipPayload>(
            GameEvents.CARD_FLIP,
            ({ cardId }) => this.updateCardUI(cardId)
        );

        // Event: Ein Paar wurde gefunden
        this.gameManager.addEventListener<MatchFoundPayload>(
            GameEvents.MATCH_FOUND,
            ({ cards }) => {
                cards.forEach(cardId => this.updateCardUI(cardId));
                this.updateScoreBoard();
            }
        );

        // Event: Kein Paar gefunden
        this.gameManager.addEventListener<{ cards: [CardId, CardId] }>(
            GameEvents.NO_MATCH,
            ({ cards }) => {
                cards.forEach(cardId => this.updateCardUI(cardId));
            }
        );

        // Event: Spielerwechsel
        this.gameManager.addEventListener<PlayerSwitchPayload>(
            GameEvents.PLAYER_SWITCH,
            () => this.updateScoreBoard()
        );

        // Event: Spiel ist beendet
        this.gameManager.addEventListener<GameState>(
            GameEvents.GAME_OVER,
            (state) => this.showGameOver(state.players)
        );
    }

    /**
     * Rendert den initialen Spielzustand
     */
    private renderInitialState(): void {
        this.renderGameBoard();
        this.renderScoreBoard();
    }

    /**
     * Rendert das Spielbrett mit allen Karten
     */
    private renderGameBoard(): void {
        const state = this.gameManager.getState();
        this.elements.gameBoard.innerHTML = '';
        this.cardElements.clear();

        state.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            this.elements.gameBoard.appendChild(cardElement);
            this.cardElements.set(card.id, cardElement as CardElement);
        });
    }

    /**
     * Erstellt ein DOM-Element für eine Spielkarte
     */
    private createCardElement(card: Card): HTMLElement {
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

        const cardContainer = container.querySelector('.card-container') as CardElement;
        cardContainer.addEventListener('click', () => this.handleCardClick(card.id));
        return container;
    }

    /**
     * Generiert CSS-Klassen für eine Karte basierend auf ihrem Zustand
     */
    private getCardClasses(card: Card): string {
        const classes: string[] = [];
        if (card.isFlipped) classes.push('flipped');
        if (card.isMatched) classes.push('matched');
        return classes.join(' ');
    }

    /**
     * Behandelt Klick-Events auf Karten
     */
    private handleCardClick(cardId: CardId): void {
        this.gameManager.flipCard(cardId);
    }

    /**
     * Aktualisiert die Darstellung einer Karte
     */
    private updateCardUI(cardId: CardId): void {
        const state = this.gameManager.getState();
        const card = state.cards.find(c => c.id === cardId);
        if (!card) return;

        const cardElement = this.cardElements.get(cardId);
        if (!cardElement) return;

        const cardInner = cardElement.querySelector('.card') as HTMLElement;
        cardInner.className = `card ${this.getCardClasses(card)}`;
    }

    /**
     * Rendert die Punkteanzeige
     */
    private renderScoreBoard(): void {
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
    private createPlayerScoreElement(player: Player): string {
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
    private updateScoreBoard(): void {
        this.renderScoreBoard();
    }

    /**
     * Zeigt den Game Over Dialog an
     */
    private showGameOver(players: Player[]): void {
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
    private determineWinner(players: Player[]): Player[] {
        const maxScore = Math.max(...players.map(p => p.score));
        return players.filter(p => p.score === maxScore);
    }

    /**
     * Erstellt die Gewinner-Nachricht
     */
    private createWinnerMessage(winners: Player[]): string {
        if (winners.length > 1) {
            return `It's a tie between ${winners.map(w => w.name).join(' and ')}!`;
        }
        return `${winners[0].name} wins with ${winners[0].score} points!`;
    }
}
