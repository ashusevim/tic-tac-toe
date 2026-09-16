# Tic Tac Toe Game

A Tic-Tac-Toe game built using React.js, TypeScript, and Tailwind CSS.

## Features

- Interactive 3x3 game board
- **1 Player (vs AI)** mode backed by an unbeatable minimax AI, or local **2 Players** mode
- Custom player names for both X and O
- Scoreboard that tracks wins for X, wins for O, and draws across rounds
- Real-time winner detection with the winning line highlighted
- Draw game detection
- "New Round" keeps the running score, "Back to Menu" starts a fresh series
- Animated board, buttons, and score rolls (respects `prefers-reduced-motion`)
- Icon-driven UI with active-player feedback and screen-reader friendly controls
- Responsive design with Tailwind CSS

## Tech Stack

- **React.js**, **TypeScript**, and **Tailwind CSS** for the frontend
- **Vite** as the build tool
- **motion** (`motion/react`) for animations and view transitions
- **@tabler/icons-react** for icons
- **clsx** + **tailwind-merge** via the `cn()` helper in `src/lib/utils.ts`

## Project Structure

```
src/
├── components/
│   ├── Board.tsx       # Game state, minimax AI, status banner
│   ├── Button.tsx      # Animated button with variants + toggle state
│   ├── Scoreboard.tsx  # X / draws / O score cards
│   └── Square.tsx      # Individual square component
├── lib/
│   └── utils.ts        # cn() class name helper (clsx + tailwind-merge)
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Game Modes

- **1 Player (vs AI)** - you play X, the AI plays O. The AI uses minimax, so the
  best you can achieve is a draw.
- **2 Players** - both players share the same board and take turns.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tic-tac-toe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How to Play

1. Pick a mode (1 Player vs AI or 2 Players), optionally type player names, then click "Start Game"
2. Players take turns clicking on empty squares (the board locks itself while the AI is thinking)
3. Player X goes first, followed by Player O
4. The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins, and the winning line is highlighted
5. If all squares are filled without a winner, the game ends in a draw
6. Click "New Round" to replay with the same players and a kept score, or "Back to Menu" to change mode/names and reset the score

## Game Winning Logic

The game implements these winning combinations:
- Horizontal: [1,2,3], [4,5,6], [7,8,9]
- Vertical: [1,4,7], [2,5,8], [3,6,9]
- Diagonal: [1,5,9], [3,5,7]

## winning combinations image
![Winning Combinations](public/Component-1.png)

## Components

### App.tsx
Main application component. Manages the mode, player names, screen state, and the
scoreboard totals, and animates between the menu and the game.

### Board.tsx
Core game component that handles:
- Game state management
- Player turns and the minimax AI opponent
- Winner detection and winning-line highlighting
- Draw detection
- Square click handling
- An accessible status banner (`role="status"`, `aria-live="polite"`)

### Button.tsx
Reusable animated button with `primary` / `warning` / `danger` / `neutral`
variants, `md` / `lg` sizes, and an optional `toggle` + `selected` mode that
exposes `aria-pressed` for the mode selector.

### Scoreboard.tsx
Score cards for X, draws, and O with animated number transitions.

### Square.tsx
Individual square component that represents each cell in the 3x3 grid. Renders
Tabler X/O icons with an entrance animation and an `aria-label` describing the cell.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).