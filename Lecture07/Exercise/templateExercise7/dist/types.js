/**
 * Verfügbare Spielthemen
 */
export var GameTheme;
(function (GameTheme) {
    GameTheme["NUMBERS"] = "numbers";
    GameTheme["EMOJIS"] = "emojis";
    GameTheme["COLORS"] = "colors"; // Farben als Kartensymbole
})(GameTheme || (GameTheme = {}));
/**
 * Schwierigkeitsgrade
 */
export var GameDifficulty;
(function (GameDifficulty) {
    GameDifficulty["EASY"] = "easy";
    GameDifficulty["MEDIUM"] = "medium";
    GameDifficulty["HARD"] = "hard"; // Schwer (z.B. mehr Karten, kürzere Anzeigezeit)
})(GameDifficulty || (GameDifficulty = {}));
/**
 * Spielereignisse
 */
export var GameEvents;
(function (GameEvents) {
    GameEvents["CARD_FLIP"] = "cardFlip";
    GameEvents["MATCH_FOUND"] = "matchFound";
    GameEvents["NO_MATCH"] = "noMatch";
    GameEvents["GAME_OVER"] = "gameOver";
    GameEvents["PLAYER_SWITCH"] = "playerSwitch"; // Spielerwechsel
})(GameEvents || (GameEvents = {}));
/**
 * Type Guards zur Überprüfung von Payload-Typen
 */
export const isCardFlipPayload = (payload) => {
    return 'cardId' in payload && 'playerId' in payload;
};
export const isMatchFoundPayload = (payload) => {
    return 'cards' in payload && 'playerId' in payload && 'score' in payload;
};
export const isPlayerSwitchPayload = (payload) => {
    return 'previousPlayer' in payload && 'nextPlayer' in payload;
};
