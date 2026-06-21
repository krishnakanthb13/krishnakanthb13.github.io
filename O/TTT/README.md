# Tic-Tac-Toe Arena: Infinite & Creative Variants

Welcome to **Tic-Tac-Toe Arena**, a modern, responsive, and neon-themed reimagining of the classic game. This project features **9 unique game modes**, completely transforming how Tic-Tac-Toe is played by introducing gravity, chaos events, infinite canvases, and memory training.

## 🎮 Game Modes

1. **Classic 3×3**: The traditional game you know and love.
2. **Fade-Away (3-Move Limit)**: Only your last 3 pieces stay on the board. Plan ahead as your oldest pieces fade away!
3. **Infinite Canvas**: Connect 5 in a row on an endless, pannable, and zoomable board.
4. **Ultimate TTT**: 9 mini-boards inside a giant board. Where you play in a mini-board dictates where your opponent must play next.
5. **Gravity 6×6**: Pieces fall to the lowest empty spot. Connect 4 to win.
6. **Chaos Mode**: Random events strike! Boards rotate, cells get blocked, and symbols swap unexpectedly.
7. **Tactical Puzzles**: Find the exact move to solve the tactical challenge and win.
8. **Size-Capture (No Draws)**: Players have 3 sizes of pieces (Small, Medium, Large). Larger pieces can cover smaller ones to capture cells.
9. **Memory Trainer**: Sequences of lights flash on the grid. Repeat the pattern correctly to progress through increasing difficulty levels!

## ✨ Features

- **Beautiful UI/UX**: Premium neon glassmorphism design with sleek animations and glow effects.
- **Responsive Design**: Fully playable on desktop, tablet, and mobile browsers.
- **Smart AI**: Every mode supports playing against a computer opponent.
- **Stats Tracking**: Automatically saves your win/loss/draw records and streaks to `localStorage`.
- **Audio Feedback**: Custom synthesizer sounds for piece placements, UI clicks, wins, and errors.
- **Dark/Light/Neon/Retro Themes**: Pick the aesthetic that suits you best!

## 🚀 How to Run

Since the project is built using strictly Vanilla Web Technologies (HTML, CSS, JS), there is no build step required.

1. Clone or download the repository.
2. Navigate to the folder containing `index.html`.
3. Open `index.html` directly in your web browser, OR serve it via a local web server (e.g., `python -m http.server 8000`).
4. Enjoy!

## 📂 Project Structure

- `index.html`: The main entry point and UI structure.
- `assets/styles.css`: The styling, grid layouts, and theme definitions.
- `assets/app.js`: The central GameArena engine, game state logic, and AI handlers.
- `assets/favicon.svg`: A neon SVG icon.

## 🛠️ Recent Bug Fixes & Enhancements

As part of a comprehensive quality sweep, the following issues were resolved and features added:

### Bug Fixes
- **Chaos Mode Win Conditions**: Prevented blocked/destroyed cells (`🔥`) from triggering false win detections.
- **Turn State Guarding**: Standardized state validation across Gravity, Infinite Canvas, and Ultimate modes to prevent moves after a match ends.
- **Infinite Canvas Pan/Zoom Reset**: Fixed canvas offset persistence so starting a new match correctly resets the viewport.
- **Memory Trainer Statistics**: Fixed an issue where completing Memory Trainer levels incorrectly counted as a standard game win.
- **Size-Capture (Gobblet) Pickup Exploits**: Fixed an exploit where picked-up pieces could be placed back onto the cell they were picked up from, wasting a turn or duplicating logic.
- **CSS Animation Issues**: Resolved a missing `@keyframes fade-in` definition which was causing menu transitions to fail.

### Enhancements
- **Mobile Touch Pan & Zoom**: Integrated `touchstart`, `touchmove`, and `touchend` support for seamless mobile/tablet navigation on the Infinite Canvas.
- **Firefox Scrollbar Support**: Customized scrollbars for Firefox using modern standard scrollbar properties (`scrollbar-width` and `scrollbar-color`) to match the neon styling.
- **Layout Animations**: Applied micro-animations to game transitions for a more dynamic and premium user experience.

