# Memory Game - TypeScript Implementation

## Overview
This project is a modern implementation of the classic Memory Game using TypeScript. The game features a clean architecture with a focus on type safety, maintainability, and extensibility.

## Features

### Core Game Mechanics
- **Card Matching**: Flip cards to find matching pairs
- **Turn-Based Gameplay**: Players take turns flipping cards
- **Score Tracking**: Points awarded for each matched pair
- **Game Over Detection**: Game ends when all pairs are matched

### Advanced Features
- **Multiple Game Themes**: Choose between numbers, emojis, or colors
- **Configurable Difficulty**: Select the number of card pairs
- **Multiplayer Support**: Play with multiple players (turn-based)
- **Responsive UI**: Works on different screen sizes

## Technical Implementation

### Architecture
The game is built using a modular architecture with clear separation of concerns:

- **GameManager**: Handles game logic and state management
- **UIManager**: Manages the DOM and user interactions
- **Type System**: Extensive use of TypeScript interfaces, enums, and generics

### TypeScript Features Used
- **Interfaces**: For type definitions (Card, Player, GameState, etc.)
- **Enums**: For game themes, difficulty levels, and event types
- **Generics**: For type-safe event handling
- **Type Guards**: For runtime type checking

### Event System
The game uses a custom event system to handle communication between components:
- Card flips
- Match detection
- Player switching
- Game over conditions

## How to Play
1. Open the game in a web browser
2. Select the number of card pairs and theme (if available)
3. Players take turns flipping two cards at a time
4. If the cards match, the player scores a point and gets another turn
5. If the cards don't match, the next player takes their turn
6. The game ends when all pairs are found
7. The player with the most points wins

## Setup and Development

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

