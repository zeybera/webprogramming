import { GameManager } from './GameManager';
import { UIManager } from './UIManager';
import { GameConfig, GameTheme } from './types';

// Initial game configuration
const config: GameConfig = {
    numberOfPairs: 6,
    numberOfPlayers: 2,
    theme: GameTheme.EMOJIS
};

// Initialize the game
const gameManager = new GameManager(config);
const uiManager = new UIManager(gameManager);

// Make game manager available globally for debugging
(window as any).gameManager = gameManager;
