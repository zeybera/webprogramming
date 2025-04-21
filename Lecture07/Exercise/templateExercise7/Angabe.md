# Week 7: Memory Game Refactoring - Task Description

## **Objective**
The goal of this exercise is to **enhance and extend the Memory Game** using TypeScript. Each team consists of **2 students**, who will collaborate on improving the game’s structure, features, and user interface.

Each team can earn **up to 10 points** based on the successful completion of specific tasks.

---

## **Tasks and Evaluation Criteria**

### **Task 1: Code Refactoring and Optimization (2 points)**
- Improve the existing TypeScript structure for better readability and maintainability.
- Apply best practices such as using `interfaces`, `enums`, and `generics`.
- **Include a README file** explaining the implementation and any additional features.

### **Task 2: Game Configurability (2 points)**
- Allow players to select the number of card pairs before starting the game.
- Ensure the settings update dynamically based on user input.

### **Task 3: Multiplayer Mode (3 points)**
- Implement player tracking with an alternating turn system.
- Display the current player and update the scoreboard dynamically.
- Ensure a fair and structured point system for scoring.

### **Task 4: UI and User Experience Enhancements (2 points)**
- Highlight the active player's turn visually.
- Implement animations for card flipping and matching pairs.
- Display an intuitive end-game summary with final scores.

### **Bonus Challenge (1 point)**
- Implement a **hint system** that briefly reveals unmatched cards.
- Introduce different **game themes** (e.g., fruits, animals, numbers).

---

## **Submission Requirements**
- **Submit the project as a ZIP file via Moodle.**
- **Ensure full documentation** with comments explaining key components.
- **Maintain type safety** using TypeScript best practices.

---

## **Memory Game Implementation**

### **Project Structure**
The project has been refactored using TypeScript with a focus on maintainability and type safety. Here's an overview of the key components:

#### **Core Components**
- `types.ts`: Contains all TypeScript interfaces and enums
- `GameManager.ts`: Handles game logic and state management
- `UIManager.ts`: Manages DOM manipulation and UI updates
- `index.ts`: Entry point that initializes the game

#### **TypeScript Features Used**
- **Interfaces**: `Card`, `Player`, `GameState`, `GameConfig`
- **Enums**: `GameEvents`, `GameTheme`
- **Event System**: Type-safe event handling using enums
- **Access Modifiers**: Private methods and properties for encapsulation

#### **Game Features**
1. **Core Game Logic**
   - Card matching mechanism
   - Turn-based gameplay
   - Score tracking
   - Win condition checking

2. **UI/UX**
   - Smooth card flip animations
   - Visual feedback for matches
   - Active player highlighting
   - Game over modal with results

3. **Themes**
   - Numbers
   - Emojis
   - Colors

### **Setup and Running**
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Open `index.html` in a web browser

### **Implementation Details**
- **State Management**: Centralized in `GameManager` class
- **Event System**: Custom event system for loose coupling
- **Type Safety**: Strict TypeScript configuration
- **Animations**: CSS transitions for smooth interactions
- **Responsive Design**: Bootstrap-based layout

Good luck and happy coding!


---
marp: true
theme: fhtw
footer: 'Advanced TypeScript Concepts'

title: Week 7 - Advanced TypeScript Concepts
keywords: TypeScript, Advanced Features, Memory Game Refactoring
description: Lecture on advanced TypeScript concepts and refactoring the Memory Game.
author: Birgit Pohn (birgit.pohn@technikum-wien.at)

---

<!--
_paginate: skip
_footer: ''
_class : lead
-->

# Week 7: Advanced TypeScript Concepts

---

# Week 7: Advanced TypeScript Concepts

### This week we’ll cover:
- Recap of TypeScript Basics
- Advanced TypeScript Features
- Managing Configuration and Options
- Refactoring the Memory Game with TypeScript
- Example Solution Overview

---

# Recap of TypeScript Basics

### Key Concepts:
1. **Type Annotations**:
   - Define types for variables, parameters, and return values.
   ```typescript
   let message: string = "Hello, TypeScript!";
   ```

2. **Interfaces**:
   - Enforce object structure with `interface`.
   ```typescript
   interface Card {
       id: number;
       symbol: string;
   }
   ```

3. **Compilation**:
   - Use `tsc` to compile TypeScript to JavaScript.
   ```bash
   tsc app.ts
   ```

---

# Advanced TypeScript Features

### 1. Enums
- Define named constants for better code readability.

```typescript
enum GameState {
    NotStarted,
    InProgress,
    Completed,
}
```
- Use in conditional logic:

```typescript
if (gameState === GameState.InProgress) {
    console.log("Game is running");
}
```

---

### 2. Union Types
- Combine multiple types into a single variable.

```typescript
type Player = string | null;

let currentPlayer: Player = "Alice";
currentPlayer = null; // Valid
```
&nbsp;

### 3. Generics
- Add flexibility while maintaining type safety.

```typescript
function shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}

const numbers = shuffle<number>([1, 2, 3, 4]);
```

---

### 4. Sync and Async Functions
- Understand synchronous and asynchronous functions for managing operations.

#### Synchronous Functions:
- Execute line by line, blocking further execution until complete.

```typescript
function syncGreet(name: string): string {
    return `Hello, ${name}!`;
}
console.log(syncGreet("Alice")); // Immediate execution
```

#### Asynchronous Functions:
- Use `async` and `await` for non-blocking operations.

```typescript
async function asyncGreet(name: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`Hello, ${name}!`), 1000);
    });
}

asyncGreet("Bob").then(console.log); // Delayed execution
```

---

# Managing Configuration and Options

### Define Game Settings
Use an `interface` to manage configurable options.

```typescript
interface GameSettings {
    numPairs: number;
    isMultiplayer: boolean;
    playerNames: string[];
}

const settings: GameSettings = {
    numPairs: 6,
    isMultiplayer: true,
    playerNames: ["Alice", "Bob"]
};
```

---

# Example Solution: Memory Game Refactoring

### Overview of Changes

1. **Core Components:**
   - `GameManager.ts`: Handles game logic such as card generation, shuffling, and state updates.
   - `StateManager.ts`: Manages application state and updates dynamically.
   - `UIManager.ts`: Manages user interface updates like the scoreboard and turn highlights.

2. **Key Features Implemented:**
   - Multiplayer support with score tracking and turn switching.
   - Dynamic card generation based on configurable number of pairs.
   - TypeScript features like `interfaces`, `enums`, and `generics` to ensure type safety and maintainability.

---

### Example Code Snippets

#### **Game Manager**
Manages card generation and shuffling:
```typescript
export class GameManager {
    constructor(cardSymbols: string[]) {
        this.cards = this.generateShuffledCards(cardSymbols);
    }

    private generateShuffledCards(symbols: string[]): Card[] {
        const deck = symbols.flatMap((symbol) => [
            { id: Math.random(), symbol, isFlipped: false, isMatched: false },
            { id: Math.random(), symbol, isFlipped: false, isMatched: false }
        ]);
        return this.shuffle(deck);
    }

    private shuffle<T>(array: T[]): T[] {
        return array.sort(() => Math.random() - 0.5);
    }
}
```
---

#### **UI Manager**
Updates the scoreboard dynamically:
```typescript
export class UIManager {
    updateScoreboard(players: { name: string; score: number }[]): void {
        const scoreboard = document.getElementById("scoreboard")!;
        scoreboard.innerHTML = players
            .map((player) => `${player.name}: ${player.score}`)
            .join("<br>");
    }
}
```

---

# Weekly Exercise: Memory Game Refactoring

### Exercise Objectives:

1. **Refactor to TypeScript**:
   - Convert the Memory Game to TypeScript, ensuring type safety.
2. **Add Configurability**:
   - Allow players to configure the number of pairs.
3. **Implement Multiplayer**:
   - Track scores for multiple players.
   - Switch turns automatically.
4. **Enhance the UI**:
   - Display scores, turns, and game state dynamically.
   - Highlight the active player.
5. **Ensure Maintainability**:
   - Use TypeScript features like interfaces and enums.

---

### Submission Requirements

1. **Fully Refactored Project**:
   - TypeScript implementation.
2. **Working Features**:
   - Configurable settings.
   - Multiplayer mode.
3. **Code Documentation**:
   - Inline comments and explanation for all components.
4. **ZIP or GitHub Submission**.

---

### Bonus Challenges

- Add a hint system.
- Implement animations for flips and matches.
- Display an end-game summary.

---

# Summary and Q&A

- **Core Focus:**
  - Refactoring and TypeScript application.
  - Dynamic and maintainable game architecture.
  - UI updates and multiplayer functionality.

**Questions?**
