/**
 * Generischer Typ für Event Handler Funktionen
 * T ist der Typ der Daten, die der Event Handler empfängt
 */
export type EventHandler<T> = (data: T) => void;

/**
 * Karten-bezogene Typen
 */
export interface Card {
    id: number;          // Eindeutige ID der Karte
    value: string;       // Der Wert/Symbol auf der Karte (z.B. "🐶" oder "1")
    isFlipped: boolean;  // Ist die Karte umgedreht?
    isMatched: boolean;  // Wurde die Karte bereits gematcht?
}

// Typ-Alias für Karten-IDs zur besseren Lesbarkeit
export type CardId = number;

/**
 * Spieler-bezogene Typen
 */
export interface Player {
    id: number;         // Eindeutige ID des Spielers
    name: string;       // Name des Spielers
    score: number;      // Punktestand
    isActive: boolean;  // Ist dieser Spieler gerade am Zug?
}

// Typ-Alias für Spieler-IDs
export type PlayerId = number;

/**
 * Spielzustand
 */
export interface GameState {
    cards: Card[];              // Liste aller Karten im Spiel
    players: Player[];          // Liste aller Spieler
    currentPlayer: PlayerId;    // ID des aktuellen Spielers
    isGameOver: boolean;        // Ist das Spiel beendet?
    lastAction?: GameAction;    // Letzte Aktion im Spiel
}

/**
 * Spielkonfiguration
 */
export interface GameConfig {
    numberOfPairs: number;      // Anzahl der Kartenpaare
    numberOfPlayers: number;    // Anzahl der Spieler
    theme: GameTheme;          // Ausgewähltes Spielthema
    difficulty?: GameDifficulty; // Optionaler Schwierigkeitsgrad
}

/**
 * Verfügbare Spielthemen
 */
export enum GameTheme {
    NUMBERS = 'numbers',  // Zahlen als Kartensymbole
    EMOJIS = 'emojis',   // Emojis als Kartensymbole
    COLORS = 'colors'    // Farben als Kartensymbole
}

/**
 * Schwierigkeitsgrade
 */
export enum GameDifficulty {
    EASY = 'easy',     // Leicht (z.B. weniger Karten)
    MEDIUM = 'medium', // Mittel
    HARD = 'hard'     // Schwer (z.B. mehr Karten, kürzere Anzeigezeit)
}

/**
 * Spielereignisse
 */
export enum GameEvents {
    CARD_FLIP = 'cardFlip',         // Karte wurde umgedreht
    MATCH_FOUND = 'matchFound',     // Ein Paar wurde gefunden
    NO_MATCH = 'noMatch',           // Kein Paar gefunden
    GAME_OVER = 'gameOver',         // Spiel ist beendet
    PLAYER_SWITCH = 'playerSwitch'  // Spielerwechsel
}

/**
 * Event-Payload Typen
 */
export interface CardFlipPayload {
    cardId: CardId;     // ID der umgedrehten Karte
    playerId: PlayerId; // ID des Spielers, der die Karte umgedreht hat
}

export interface MatchFoundPayload {
    cards: [CardId, CardId];  // IDs der gematchten Karten
    playerId: PlayerId;       // Spieler, der das Match gefunden hat
    score: number;            // Aktueller Punktestand des Spielers
}

export interface PlayerSwitchPayload {
    previousPlayer: PlayerId; // ID des vorherigen Spielers
    nextPlayer: PlayerId;     // ID des nächsten Spielers
}

/**
 * Spielaktion mit Zeitstempel
 */
export interface GameAction {
    type: GameEvents;   // Art der Aktion
    timestamp: number;  // Zeitpunkt der Aktion
    payload: CardFlipPayload | MatchFoundPayload | PlayerSwitchPayload; // Aktionsdaten
}

/**
 * Type Guards zur Überprüfung von Payload-Typen
 */
export const isCardFlipPayload = (payload: any): payload is CardFlipPayload => {
    return 'cardId' in payload && 'playerId' in payload;
};

export const isMatchFoundPayload = (payload: any): payload is MatchFoundPayload => {
    return 'cards' in payload && 'playerId' in payload && 'score' in payload;
};

export const isPlayerSwitchPayload = (payload: any): payload is PlayerSwitchPayload => {
    return 'previousPlayer' in payload && 'nextPlayer' in payload;
};
