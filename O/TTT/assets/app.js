// AUDIO SYNTHESIZER (Web Audio API)
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  play(type) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;

    if (type === "click") {
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "place") {
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "win") {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.3); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "lose") {
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(150, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === "chaos") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }
}

const synth = new SoundSynth();

// STATS MANAGER
const StatsManager = {
  load() {
    const stats = localStorage.getItem("ttt_arena_stats");
    if (stats) {
      return JSON.parse(stats);
    }
    return this.defaultStats();
  },

  defaultStats() {
    return {
      overall: {
        played: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
      classic: { wins: 0, losses: 0, draws: 0 },
      "fade-away": { wins: 0, losses: 0, draws: 0 },
      "infinite-canvas": { wins: 0, losses: 0, draws: 0 },
      ultimate: { wins: 0, losses: 0, draws: 0 },
      gravity: { wins: 0, losses: 0, draws: 0 },
      chaos: { wins: 0, losses: 0, draws: 0 },
      puzzle: { wins: 0, losses: 0, draws: 0 },
      gobblet: { wins: 0, losses: 0, draws: 0 },
      "memory-trainer": { wins: 0, losses: 0, draws: 0 },
    };
  },

  save(stats) {
    localStorage.setItem("ttt_arena_stats", JSON.stringify(stats));
  },

  recordGame(mode, result) {
    const stats = this.load();
    stats.overall.played++;

    if (result === "win") {
      stats.overall.wins++;
      stats.overall.currentStreak++;
      stats.overall.bestStreak = Math.max(
        stats.overall.bestStreak,
        stats.overall.currentStreak,
      );
      stats[mode].wins++;
    } else if (result === "lose") {
      stats.overall.losses++;
      stats.overall.currentStreak = 0;
      stats[mode].losses++;
    } else {
      stats.overall.draws++;
      stats.overall.currentStreak = 0;
      stats[mode].draws++;
    }
    this.save(stats);
  },

  reset() {
    this.save(this.defaultStats());
  },
};

// PUZZLES LIST
const PUZZLES = [
  {
    name: "Double Attack Setup",
    description: "Find the single move that creates a double threat for X.",
    board: ["X", "", "O", "", "X", "", "O", "", ""],
    solution: 8, // index 8 creates wins at diagonal and bottom row
    player: "X",
  },
  {
    name: "Lethal Block",
    description:
      "O is about to win. Find the critical block or winning move for X.",
    board: ["O", "O", "", "", "X", "", "", "", ""],
    solution: 2,
    player: "X",
  },
  {
    name: "Fork Counter",
    description:
      "O has played corners. Choose the center or correct side to avoid defeat.",
    board: ["O", "", "", "", "X", "", "", "", "O"],
    solution: 1, // playing cell 1 is a safe response
    player: "X",
  },
];

// GAME CONTROLLER
class GameArena {
  constructor() {
    this.mode = "classic";
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.opponentType = "ai"; // 'ai' or 'human'
    this.aiDifficulty = "hard"; // easy, medium, hard, expert
    this.gameActive = true;
    this.blitzTimer = null;
    this.timeLeft = 10;
    this.timerLimit = 10;
    this.timerEnabled = false;

    // Mode specific variables
    this.moveHistory = { X: [], O: [] }; // For Fade-away (holds indices)
    this.ultimateBoards = Array(9)
      .fill(null)
      .map(() => Array(9).fill(""));
    this.ultimateActiveBoard = -1; // -1 means any board is playable
    this.ultimateSubWins = Array(9).fill("");
    this.infiniteCanvasCells = new Map(); // key: 'x,y', value: symbol
    this.infiniteZoom = 1.0;
    this.infinitePanX = 0;
    this.infinitePanY = 0;
    this.infiniteWinLen = 5;
    this.gravityRows = 6;
    this.gravityCols = 6;
    this.gravityBoard = Array(36).fill("");
    this.chaosLogs = [];
    this.activePuzzleIndex = 0;

    // Infinite canvas drag state
    this.isDragging = false;
    this.hasDragged = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Size-Capture (Gobblet) variables
    this.gobbletReserve = {
      X: { 1: 2, 2: 2, 3: 2 }, // size: count (1=Small, 2=Medium, 3=Large)
      O: { 1: 2, 2: 2, 3: 2 },
    };
    this.gobbletBoard = Array(9)
      .fill(null)
      .map(() => []); // Stack of pieces per cell
    this.gobbletSelectedSize = null; // Currently chosen size to place (1, 2, or 3)
    this.gobbletSourceIndex = null; // Index from where piece was picked up

    // Memory Trainer variables
    this.memorySequence = [];
    this.memoryPlayerSequence = [];
    this.memoryLevel = 1;
    this.memoryShowing = false;

    // UI Binding elements
    this.boardWrapper = document.getElementById("board-wrapper");
    this.statusText = document.getElementById("game-status-text");
    this.specialInfoCard = document.getElementById("mode-special-info");
  }

  init() {
    this.setupEventListeners();
    this.updateStatsUI();
    this.applyTheme(localStorage.getItem("ttt_arena_theme") || "theme-dark");
  }

  setupEventListeners() {
    // Mode Buttons
    document.querySelectorAll(".mode-card").forEach((card) => {
      card.addEventListener("click", () => {
        this.selectMode(card.dataset.mode);
      });
    });

    // Navigation
    document.getElementById("btn-back-menu").addEventListener("click", () => {
      synth.play("click");
      this.showMenu();
    });

    // Modals
    document.getElementById("btn-stats").addEventListener("click", () => {
      synth.play("click");
      this.openModal("modal-stats");
      this.updateStatsUI();
    });

    document.getElementById("btn-settings").addEventListener("click", () => {
      synth.play("click");
      this.openModal("modal-settings");
    });

    document.querySelectorAll(".btn-close-modal").forEach((btn) => {
      btn.addEventListener("click", () => {
        synth.play("click");
        this.closeAllModals();
      });
    });

    // Controls
    document
      .getElementById("btn-action-primary")
      .addEventListener("click", () => {
        synth.play("click");
        this.resetGame();
      });

    document
      .getElementById("btn-reset-scores")
      .addEventListener("click", () => {
        synth.play("click");
        this.resetScores();
      });

    document.getElementById("btn-clear-stats").addEventListener("click", () => {
      if (confirm("Reset all arena progress?")) {
        StatsManager.reset();
        this.updateStatsUI();
        this.showToast("Statistics cleared!");
      }
    });

    // Settings change listeners
    document.querySelectorAll('input[name="opponent"]').forEach((input) => {
      input.addEventListener("change", (e) => {
        this.opponentType = e.target.value;
        document
          .getElementById("difficulty-group")
          .classList.toggle("hidden", this.opponentType === "human");
        this.resetGame();
      });
    });

    document.getElementById("ai-difficulty").addEventListener("change", (e) => {
      this.aiDifficulty = e.target.value;
    });

    document.getElementById("theme-select").addEventListener("change", (e) => {
      this.applyTheme(e.target.value);
    });

    document
      .getElementById("settings-sound")
      .addEventListener("change", (e) => {
        synth.enabled = e.target.checked;
      });

    document
      .getElementById("settings-timer-enabled")
      .addEventListener("change", (e) => {
        this.timerEnabled = e.target.checked;
        this.resetGame();
      });

    document
      .getElementById("settings-timer-val")
      .addEventListener("input", (e) => {
        this.timerLimit = parseInt(e.target.value);
        document.getElementById("timer-val-display").innerText =
          `${this.timerLimit}s`;
        this.resetGame();
      });

    document
      .getElementById("infinite-win-len")
      .addEventListener("change", (e) => {
        this.infiniteWinLen = parseInt(e.target.value);
        this.resetGame();
      });

    // Infinite Canvas Handlers
    this.boardWrapper.addEventListener("mousedown", (e) => {
      if (this.mode !== "infinite-canvas") return;
      this.isDragging = true;
      this.hasDragged = false;
      this.dragStartX = e.clientX - this.infinitePanX;
      this.dragStartY = e.clientY - this.infinitePanY;
      this.dragStartPanX = this.infinitePanX;
      this.dragStartPanY = this.infinitePanY;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging || this.mode !== "infinite-canvas") return;
      
      const newPanX = e.clientX - this.dragStartX;
      const newPanY = e.clientY - this.dragStartY;

      if (
        Math.abs(newPanX - this.dragStartPanX) > 5 ||
        Math.abs(newPanY - this.dragStartPanY) > 5
      ) {
        this.hasDragged = true;
      }

      this.infinitePanX = newPanX;
      this.infinitePanY = newPanY;
      
      const canvasBoard = document.querySelector(".infinite-canvas-board");
      if (canvasBoard)
        canvasBoard.style.transform = `translate(${this.infinitePanX}px, ${this.infinitePanY}px) scale(${this.infiniteZoom})`;
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    this.boardWrapper.addEventListener("wheel", (e) => {
      if (this.mode !== "infinite-canvas") return;
      e.preventDefault();
      const zoomAmount = 0.05;
      if (e.deltaY < 0) {
        this.infiniteZoom = Math.min(1.8, this.infiniteZoom + zoomAmount);
      } else {
        this.infiniteZoom = Math.max(0.5, this.infiniteZoom - zoomAmount);
      }
      const canvasBoard = document.querySelector(".infinite-canvas-board");
      if (canvasBoard)
        canvasBoard.style.transform = `translate(${this.infinitePanX}px, ${this.infinitePanY}px) scale(${this.infiniteZoom})`;
    });
  }

  applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem("ttt_arena_theme", theme);
    document.getElementById("theme-select").value = theme;
  }

  openModal(id) {
    document.getElementById(id).classList.remove("hidden");
  }

  closeAllModals() {
    document
      .querySelectorAll(".modal-overlay")
      .forEach((modal) => modal.classList.add("hidden"));
  }

  showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = `toast ${isError ? "error" : ""}`;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
  }

  showMenu() {
    document.getElementById("game-view").classList.add("hidden");
    document.getElementById("menu-view").classList.remove("hidden");
    this.stopTimer();
  }

  selectMode(mode) {
    synth.play("click");
    this.mode = mode;
    document.getElementById("current-mode-display").innerText =
      this.getModeFriendlyName(mode);
    document.getElementById("menu-view").classList.add("hidden");
    document.getElementById("game-view").classList.remove("hidden");

    // Toggle special info container based on mode
    this.specialInfoCard.classList.add("hidden");

    // Update Context/Instructions
    const instructions = {
      classic: "Connect 3 in a row to win. Simple and timeless.",
      "fade-away":
        "Only your last 3 pieces stay on the board. Plan ahead as your old pieces fade away!",
      "infinite-canvas":
        "Connect 5 in a row on an endless board. Drag to pan, scroll to zoom.",
      ultimate:
        "Win small boards to claim cells in the large board. Your move dictates the next board.",
      gravity: "Pieces fall to the lowest empty spot. Connect 4 to win!",
      chaos:
        "Random events strike! Boards rotate, cells block, and symbols swap unexpectedly.",
      puzzle: "Find the exact move to solve the tactical challenge.",
      gobblet: "Capture smaller pieces. Move pieces from the board. No draws!",
      "memory-trainer": "Watch the flashing sequence and repeat it. Level up your memory!",
    };
    const instContainer = document.getElementById("game-instructions-text");
    if (instContainer) {
      instContainer.innerText = instructions[mode] || "";
    }

    this.resetGame();
  }

  getModeFriendlyName(mode) {
    const names = {
      classic: "Classic 3×3",
      "fade-away": "Fade-Away TTT",
      "infinite-canvas": "Infinite Canvas",
      ultimate: "Ultimate TTT",
      gravity: "Gravity 6×6",
      chaos: "Chaos Mode",
      puzzle: "Tactical Puzzles",
      gobblet: "Size-Capture (No Draws)",
      "memory-trainer": "Memory Trainer",
    };
    return names[mode] || "Tic-Tac-Toe";
  }

  resetScores() {
    document.getElementById("score-val-x").innerText = "0";
    document.getElementById("score-val-o").innerText = "0";
    document.getElementById("score-val-draws").innerText = "0";
    this.showToast("Scores reset!");
  }

  incrementScore(winner) {
    if (winner === "X") {
      const el = document.getElementById("score-val-x");
      el.innerText = parseInt(el.innerText) + 1;
      StatsManager.recordGame(this.mode, "win");
    } else if (winner === "O") {
      const el = document.getElementById("score-val-o");
      el.innerText = parseInt(el.innerText) + 1;
      StatsManager.recordGame(
        this.mode,
        this.opponentType === "ai" ? "lose" : "win",
      );
    } else {
      const el = document.getElementById("score-val-draws");
      el.innerText = parseInt(el.innerText) + 1;
      StatsManager.recordGame(this.mode, "draw");
    }
    this.updateStatsUI();
  }

  updateStatsUI() {
    const stats = StatsManager.load();
    document.getElementById("stat-games-played").innerText =
      stats.overall.played;
    const wr =
      stats.overall.played > 0
        ? Math.round((stats.overall.wins / stats.overall.played) * 100)
        : 0;
    document.getElementById("stat-win-rate").innerText = `${wr}%`;
    document.getElementById("stat-streak-current").innerText =
      stats.overall.currentStreak;
    document.getElementById("stat-streak-best").innerText =
      stats.overall.bestStreak;

    const tableBody = document.getElementById("stats-table-body");
    tableBody.innerHTML = "";
    const modes = [
      "classic",
      "fade-away",
      "infinite-canvas",
      "ultimate",
      "gravity",
      "chaos",
      "puzzle",
      "gobblet",
      "memory-trainer",
    ];
    modes.forEach((m) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><strong>${this.getModeFriendlyName(m)}</strong></td>
                <td>${stats[m].wins}</td>
                <td>${stats[m].losses}</td>
                <td>${stats[m].draws}</td>
            `;
      tableBody.appendChild(row);
    });
  }

  // TIMER LOGIC
  startTimer() {
    this.stopTimer();
    if (!this.timerEnabled || !this.gameActive) return;

    document.getElementById("turn-timer-container").classList.remove("hidden");
    this.timeLeft = this.timerLimit;
    this.updateTimerUI();

    this.blitzTimer = setInterval(() => {
      this.timeLeft -= 0.1;
      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.handleTimeout();
      } else {
        this.updateTimerUI();
      }
    }, 100);
  }

  stopTimer() {
    if (this.blitzTimer) {
      clearInterval(this.blitzTimer);
      this.blitzTimer = null;
    }
    document.getElementById("turn-timer-container").classList.add("hidden");
  }

  updateTimerUI() {
    const percent = (this.timeLeft / this.timerLimit) * 100;
    document.getElementById("timer-bar-fill").style.width = `${percent}%`;
  }

  handleTimeout() {
    const nextPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.gameActive = false;
    synth.play("lose");
    this.statusText.innerText = `Timeout! Player ${nextPlayer} Wins!`;
    this.incrementScore(nextPlayer);
  }

  // GENERAL GAMEPLAY
  resetGame() {
    this.stopTimer();
    this.gameActive = true;
    this.currentPlayer = "X";
    this.statusText.innerText = "Player X's Turn";
    this.moveHistory = { X: [], O: [] };

    // Reset subboard metrics
    this.ultimateBoards = Array(9)
      .fill(null)
      .map(() => Array(9).fill(""));
    this.ultimateActiveBoard = -1;
    this.ultimateSubWins = Array(9).fill("");

    this.infiniteCanvasCells.clear();

    // Reset Gobblet metrics
    this.gobbletReserve = {
      X: { 1: 2, 2: 2, 3: 2 },
      O: { 1: 2, 2: 2, 3: 2 },
    };
    this.gobbletBoard = Array(9)
      .fill(null)
      .map(() => []);
    this.gobbletSelectedSize = null;
    this.gobbletSourceIndex = null;

    // Build Board representation
    if (
      this.mode === "classic" ||
      this.mode === "fade-away" ||
      this.mode === "chaos"
    ) {
      this.board = Array(9).fill("");
      this.renderStandardGrid();
    } else if (this.mode === "gravity") {
      this.gravityBoard = Array(this.gravityRows * this.gravityCols).fill("");
      this.renderGravityGrid();
    } else if (this.mode === "ultimate") {
      this.renderUltimateGrid();
    } else if (this.mode === "infinite-canvas") {
      this.renderInfiniteCanvas();
    } else if (this.mode === "puzzle") {
      this.loadPuzzle();
    } else if (this.mode === "gobblet") {
      this.renderGobbletGrid();
    } else if (this.mode === "memory-trainer") {
      this.memoryLevel = 1;
      this.memorySequence = [];
      this.memoryPlayerSequence = [];
      this.memoryShowing = false;
      this.board = Array(9).fill("");
      this.renderStandardGrid();
      this.statusText.innerText = "Level 1 - Get Ready!";
      setTimeout(() => this.startMemorySequence(), 1000);
    }

    this.updateHUDActivePlayer();
    this.startTimer();
  }

  updateHUDActivePlayer() {
    document
      .getElementById("hud-player-x")
      .classList.toggle("active", this.currentPlayer === "X");
    document
      .getElementById("hud-player-o")
      .classList.toggle("active", this.currentPlayer === "O");
  }

  switchTurn() {
    if (!this.gameActive) return;

    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.statusText.innerText = `Player ${this.currentPlayer}'s Turn`;
    this.updateHUDActivePlayer();

    // Start timer for the next turn
    this.startTimer();

    // Trigger AI if it's AI's turn
    if (this.opponentType === "ai" && this.currentPlayer === "O") {
      setTimeout(() => this.triggerAIMove(), 400);
    }
  }

  // RENDER STANDARD 3X3 GRID (Classic, Fade-Away, Chaos)
  renderStandardGrid() {
    this.boardWrapper.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "ttt-grid";
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = i;

      // Re-draw values if present
      if (this.board[i] === "X") {
        cell.innerHTML = '<span class="symbol-x">X</span>';
        cell.classList.add("occupied");
      } else if (this.board[i] === "O") {
        cell.innerHTML = '<span class="symbol-o">O</span>';
        cell.classList.add("occupied");
      }

      // Apply special fade properties for fade-away mode
      if (this.mode === "fade-away") {
        this.applyFadeClasses(cell, i);
      }

      cell.addEventListener("click", () => this.handleCellClick(i));
      grid.appendChild(cell);
    }
    this.boardWrapper.appendChild(grid);
  }

  applyFadeClasses(cellElement, index) {
    // Find which moves are upcoming to fade
    const playerXFirst = this.moveHistory["X"][0];
    const playerOFirst = this.moveHistory["O"][0];

    if (
      this.board[index] === "X" &&
      index === playerXFirst &&
      this.moveHistory["X"].length >= 3
    ) {
      cellElement.classList.add("critical-fade");
    } else if (
      this.board[index] === "O" &&
      index === playerOFirst &&
      this.moveHistory["O"].length >= 3
    ) {
      cellElement.classList.add("critical-fade");
    }
  }

  handleCellClick(index) {
    if (!this.gameActive) return;
    
    if (this.mode === "memory-trainer") {
      this.handleMemoryClick(index);
      return;
    }

    if (this.board[index] !== "") return;
    if (this.opponentType === "ai" && this.currentPlayer === "O") return; // block manual O turns

    if (this.mode === "puzzle") {
      const sol = PUZZLES[this.activePuzzleIndex].solution;
      if (index === sol) {
        synth.play("place");
        this.board[index] = this.currentPlayer;
        this.renderStandardGrid();
        setTimeout(() => {
          this.showToast("Correct! Puzzle Solved!");
          this.incrementScore("X");
          this.activePuzzleIndex =
            (this.activePuzzleIndex + 1) % PUZZLES.length;
          this.resetGame();
        }, 300);
      } else {
        synth.play("lose");
        this.showToast("Wrong move! Resetting puzzle.", true);
        setTimeout(() => this.resetGame(), 800);
      }
      return;
    }

    this.makeMove(index);
  }

  makeMove(index) {
    synth.play("place");
    this.board[index] = this.currentPlayer;

    if (this.mode === "fade-away") {
      // Manage move queues
      const history = this.moveHistory[this.currentPlayer];
      history.push(index);
      if (history.length > 3) {
        const oldest = history.shift();
        this.board[oldest] = "";
      }
    }

    // Re-render
    if (
      this.mode === "classic" ||
      this.mode === "fade-away" ||
      this.mode === "chaos"
    ) {
      this.renderStandardGrid();
      this.checkStandardWin();
    }

    if (this.gameActive && this.mode === "chaos") {
      this.triggerChaosEvent();
      this.checkStandardWin();
    }

    if (this.gameActive) {
      this.switchTurn();
    }
  }

  checkStandardWin() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.endGame(this.board[a], pattern);
        return;
      }
    }

    if (!this.board.includes("")) {
      this.endGame("draw");
    }
  }

  endGame(winner, winCells = []) {
    this.gameActive = false;
    this.stopTimer();

    if (winner === "draw") {
      synth.play("lose");
      this.statusText.innerText = "Match Draw!";
      this.incrementScore("draw");
    } else {
      synth.play("win");
      this.statusText.innerText = `Player ${winner} Wins!`;
      this.incrementScore(winner);

      // Highlight cells
      if (
        this.mode === "classic" ||
        this.mode === "fade-away" ||
        this.mode === "chaos" ||
        this.mode === "puzzle"
      ) {
        const cells = this.boardWrapper.querySelectorAll(".cell");
        winCells.forEach((idx) => {
          cells[idx].classList.add("winning-cell");
        });
      } else if (this.mode === "gravity") {
        const cells = this.boardWrapper.querySelectorAll(".cell");
        winCells.forEach((idx) => {
          cells[idx].classList.add("winning-cell");
        });
      }
    }
  }

  // GRAVITY GAME MODE
  renderGravityGrid() {
    this.boardWrapper.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "ttt-grid";
    grid.style.gridTemplateColumns = `repeat(${this.gravityCols}, 1fr)`;

    for (let r = 0; r < this.gravityRows; r++) {
      for (let c = 0; c < this.gravityCols; c++) {
        const i = r * this.gravityCols + c;
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;

        if (this.gravityBoard[i] === "X") {
          cell.innerHTML = '<span class="symbol-x">X</span>';
        } else if (this.gravityBoard[i] === "O") {
          cell.innerHTML = '<span class="symbol-o">O</span>';
        }

        cell.addEventListener("click", () => this.handleGravityClick(c));
        grid.appendChild(cell);
      }
    }
    this.boardWrapper.appendChild(grid);
  }

  handleGravityClick(col) {
    if (!this.gameActive) return;
    if (this.opponentType === "ai" && this.currentPlayer === "O") return;

    this.makeGravityMove(col);
  }

  makeGravityMove(col) {
    // Drop pieces Connect-4 style
    for (let r = this.gravityRows - 1; r >= 0; r--) {
      const idx = r * this.gravityCols + col;
      if (this.gravityBoard[idx] === "") {
        synth.play("place");
        this.gravityBoard[idx] = this.currentPlayer;
        this.renderGravityGrid();
        this.checkGravityWin(idx);
        this.switchTurn();
        return;
      }
    }
    this.showToast("Column full!", true);
  }

  checkGravityWin(lastIdx) {
    const r = Math.floor(lastIdx / this.gravityCols);
    const c = lastIdx % this.gravityCols;
    const symbol = this.gravityBoard[lastIdx];

    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [-1, 1], // diagonal up-right
    ];

    for (const [dr, dc] of directions) {
      const matched = [lastIdx];
      // Positive dir
      let nr = r + dr;
      let nc = c + dc;
      while (
        nr >= 0 &&
        nr < this.gravityRows &&
        nc >= 0 &&
        nc < this.gravityCols
      ) {
        const checkIdx = nr * this.gravityCols + nc;
        if (this.gravityBoard[checkIdx] === symbol) {
          matched.push(checkIdx);
        } else {
          break;
        }
        nr += dr;
        nc += dc;
      }

      // Negative dir
      nr = r - dr;
      nc = c - dc;
      while (
        nr >= 0 &&
        nr < this.gravityRows &&
        nc >= 0 &&
        nc < this.gravityCols
      ) {
        const checkIdx = nr * this.gravityCols + nc;
        if (this.gravityBoard[checkIdx] === symbol) {
          matched.push(checkIdx);
        } else {
          break;
        }
        nr -= dr;
        nc -= dc;
      }

      if (matched.length >= 4) {
        // Connect 4 to win
        this.endGame(symbol, matched);
        return;
      }
    }

    if (!this.gravityBoard.includes("")) {
      this.endGame("draw");
    }
  }

  // ULTIMATE TIC-TAC-TOE
  renderUltimateGrid() {
    this.boardWrapper.innerHTML = "";
    const ultGrid = document.createElement("div");
    ultGrid.className = "ultimate-grid";

    for (let b = 0; b < 9; b++) {
      const subboard = document.createElement("div");
      subboard.className = "ultimate-subboard";

      // Subboard outcomes
      if (this.ultimateSubWins[b] === "X") subboard.classList.add("won-x");
      else if (this.ultimateSubWins[b] === "O") subboard.classList.add("won-o");
      else if (this.ultimateSubWins[b] === "draw")
        subboard.classList.add("draw");

      const isPlayable =
        this.gameActive &&
        (this.ultimateActiveBoard === -1 || this.ultimateActiveBoard === b) &&
        !this.ultimateSubWins[b];

      if (isPlayable) {
        subboard.classList.add("active-target");
      }

      for (let c = 0; c < 9; c++) {
        const cell = document.createElement("div");
        cell.className = "cell ultimate-cell";

        const val = this.ultimateBoards[b][c];
        if (val === "X") {
          cell.innerHTML = '<span class="symbol-x">X</span>';
        } else if (val === "O") {
          cell.innerHTML = '<span class="symbol-o">O</span>';
        }

        cell.addEventListener("click", () => this.handleUltimateClick(b, c));
        subboard.appendChild(cell);
      }
      ultGrid.appendChild(subboard);
    }
    this.boardWrapper.appendChild(ultGrid);
  }

  handleUltimateClick(boardIdx, cellIdx) {
    if (!this.gameActive) return;
    if (this.opponentType === "ai" && this.currentPlayer === "O") return;

    // Validation
    if (
      this.ultimateActiveBoard !== -1 &&
      this.ultimateActiveBoard !== boardIdx
    )
      return;
    if (this.ultimateSubWins[boardIdx]) return;
    if (this.ultimateBoards[boardIdx][cellIdx] !== "") return;

    this.makeUltimateMove(boardIdx, cellIdx);
  }

  makeUltimateMove(boardIdx, cellIdx) {
    synth.play("place");
    this.ultimateBoards[boardIdx][cellIdx] = this.currentPlayer;

    // Check subboard win
    this.checkUltimateSubWin(boardIdx);

    // Next board calculation
    if (this.ultimateSubWins[cellIdx] !== "") {
      this.ultimateActiveBoard = -1; // board locked or won, next player gets free choice
    } else {
      this.ultimateActiveBoard = cellIdx;
    }

    this.renderUltimateGrid();
    this.checkUltimateOverallWin();
    this.switchTurn();
  }

  checkUltimateSubWin(bIdx) {
    const board = this.ultimateBoards[bIdx];
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        this.ultimateSubWins[bIdx] = board[a];
        return;
      }
    }

    if (!board.includes("")) {
      this.ultimateSubWins[bIdx] = "draw";
    }
  }

  checkUltimateOverallWin() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const s = this.ultimateSubWins;
      if (s[a] && s[a] !== "draw" && s[a] === s[b] && s[a] === s[c]) {
        this.endGame(s[a]);
        return;
      }
    }

    // check draw
    if (!this.ultimateSubWins.includes("")) {
      this.endGame("draw");
    }
  }

  // INFINITE CANVAS MODE (BOUNDLESS BOARD)
  renderInfiniteCanvas() {
    this.boardWrapper.innerHTML = "";

    const view = document.createElement("div");
    view.className = "infinite-canvas-viewport";

    const canvasBoard = document.createElement("div");
    canvasBoard.className = "infinite-canvas-board";

    // Define rendering grid size based on center pan
    const gridCellsWide = 25;
    const gridCellsHigh = 25;
    canvasBoard.style.gridTemplateColumns = `repeat(${gridCellsWide}, 50px)`;
    canvasBoard.style.gridTemplateRows = `repeat(${gridCellsHigh}, 50px)`;

    // Inject cells
    // Render coordinates offset around (0,0) center coordinate
    const halfW = Math.floor(gridCellsWide / 2);
    const halfH = Math.floor(gridCellsHigh / 2);

    for (let y = -halfH; y <= halfH; y++) {
      for (let x = -halfW; x <= halfW; x++) {
        const coord = `${x},${y}`;
        const cell = document.createElement("div");
        cell.className = "infinite-cell";

        const val = this.infiniteCanvasCells.get(coord) || "";
        if (val === "X") {
          cell.innerHTML = '<span class="symbol-x">X</span>';
        } else if (val === "O") {
          cell.innerHTML = '<span class="symbol-o">O</span>';
        }

        cell.addEventListener("click", () => {
          this.handleInfiniteCanvasClick(x, y);
        });

        canvasBoard.appendChild(cell);
      }
    }

    // Apply transformation initially
    canvasBoard.style.transform = `translate(${this.infinitePanX}px, ${this.infinitePanY}px) scale(${this.infiniteZoom})`;
    view.appendChild(canvasBoard);
    this.boardWrapper.appendChild(view);
  }

  handleInfiniteCanvasClick(x, y) {
    if (this.hasDragged) return;
    if (!this.gameActive) return;
    if (this.opponentType === "ai" && this.currentPlayer === "O") return;

    const coord = `${x},${y}`;
    if (this.infiniteCanvasCells.has(coord)) return;

    this.makeInfiniteMove(x, y);
  }

  makeInfiniteMove(x, y) {
    synth.play("place");
    const coord = `${x},${y}`;
    this.infiniteCanvasCells.set(coord, this.currentPlayer);
    this.renderInfiniteCanvas();

    this.checkInfiniteWin(x, y);
    this.switchTurn();
  }

  checkInfiniteWin(x, y) {
    const symbol = this.infiniteCanvasCells.get(`${x},${y}`);
    const dirs = [
      [0, 1], // V
      [1, 0], // H
      [1, 1], // D1
      [-1, 1], // D2
    ];

    for (const [dx, dy] of dirs) {
      let count = 1;

      // Pos
      let nx = x + dx;
      let ny = y + dy;
      while (this.infiniteCanvasCells.get(`${nx},${ny}`) === symbol) {
        count++;
        nx += dx;
        ny += dy;
      }

      // Neg
      nx = x - dx;
      ny = y - dy;
      while (this.infiniteCanvasCells.get(`${nx},${ny}`) === symbol) {
        count++;
        nx -= dx;
        ny -= dy;
      }

      if (count >= this.infiniteWinLen) {
        this.endGame(symbol);
        return;
      }
    }
  }

  // CHAOS MODE EVENTS
  triggerChaosEvent() {
    // Trigger a chaos event every 3 turns randomly (approx 30% chance per turn)
    if (Math.random() > 0.35) return;

    const events = ["rotate", "block", "swap", "bonus"];
    const chosen = events[Math.floor(Math.random() * events.length)];
    synth.play("chaos");

    if (chosen === "rotate") {
      // Rotate the board 90deg clockwise
      const newBoard = Array(9).fill("");
      const rotateIndices = [6, 3, 0, 7, 4, 1, 8, 5, 2];
      for (let i = 0; i < 9; i++) {
        newBoard[i] = this.board[rotateIndices[i]];
      }
      this.board = newBoard;
      this.renderStandardGrid();
      this.showToast("CHAOS EVENT: Board Rotated 90 Degrees!");
    } else if (chosen === "block") {
      // Block a random empty spot
      const empties = [];
      for (let i = 0; i < 9; i++) {
        if (this.board[i] === "") empties.push(i);
      }
      if (empties.length > 0) {
        const blockIdx = empties[Math.floor(Math.random() * empties.length)];
        this.board[blockIdx] = "🔥"; // block character
        this.renderStandardGrid();
        this.showToast("CHAOS EVENT: A random cell was blocked with Fire!");
      }
    } else if (chosen === "swap") {
      // Swap all X and O values
      for (let i = 0; i < 9; i++) {
        if (this.board[i] === "X") this.board[i] = "O";
        else if (this.board[i] === "O") this.board[i] = "X";
      }
      this.renderStandardGrid();
      this.showToast("CHAOS EVENT: Symbols Swapped!");
    } else if (chosen === "bonus") {
      // Give current player a bonus move
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X"; // toggles back so player moves again
      this.showToast(
        `CHAOS EVENT: Bonus Turn for Player ${this.currentPlayer}!`,
      );
    }
  }

  // PUZZLE MODE
  loadPuzzle() {
    const pz = PUZZLES[this.activePuzzleIndex];
    this.board = [...pz.board];
    this.currentPlayer = pz.player;

    // Show description
    this.specialInfoCard.classList.remove("hidden");
    this.specialInfoCard.innerHTML = `
            <h4>PUZZLE CHALLENGE</h4>
            <p><strong>${pz.name}</strong></p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">${pz.description}</p>
        `;

    this.renderStandardGrid();
  }

  // AI MOVE ROUTING & LOGIC
  triggerAIMove() {
    if (!this.gameActive) return;

    let selectedMove = null;

    if (
      this.mode === "classic" ||
      this.mode === "fade-away" ||
      this.mode === "chaos"
    ) {
      selectedMove = this.getStandardAIMove();
      if (selectedMove !== null) {
        this.makeMove(selectedMove);
      }
    } else if (this.mode === "gravity") {
      selectedMove = this.getGravityAIMove();
      if (selectedMove !== null) {
        this.makeGravityMove(selectedMove);
      }
    } else if (this.mode === "ultimate") {
      selectedMove = this.getUltimateAIMove();
      if (selectedMove !== null) {
        this.makeUltimateMove(selectedMove.boardIdx, selectedMove.cellIdx);
      }
    } else if (this.mode === "infinite-canvas") {
      selectedMove = this.getInfiniteAIMove();
      if (selectedMove !== null) {
        this.makeInfiniteMove(selectedMove.x, selectedMove.y);
      }
    } else if (this.mode === "gobblet") {
      selectedMove = this.getGobbletAIMove();
      if (selectedMove !== null) {
        this.makeGobbletAIMove(selectedMove);
      }
    }
  }

  getStandardAIMove() {
    // Easy: Random
    if (this.aiDifficulty === "easy") {
      const empties = [];
      for (let i = 0; i < 9; i++) {
        if (this.board[i] === "") empties.push(i);
      }
      return empties[Math.floor(Math.random() * empties.length)];
    }

    // Medium: Simple win/block heuristics
    if (this.aiDifficulty === "medium") {
      // 1. Can AI Win?
      const aiWin = this.findWinningCell("O");
      if (aiWin !== null) return aiWin;
      // 2. Can Player Win? Block them.
      const block = this.findWinningCell("X");
      if (block !== null) return block;
      // 3. Center
      if (this.board[4] === "") return 4;
      // 4. Random Corner
      const corners = [0, 2, 6, 8].filter((idx) => this.board[idx] === "");
      if (corners.length > 0)
        return corners[Math.floor(Math.random() * corners.length)];
      // 5. Default random
      const empties = [];
      for (let i = 0; i < 9; i++) {
        if (this.board[i] === "") empties.push(i);
      }
      return empties[Math.floor(Math.random() * empties.length)];
    }

    // Hard & Expert: Minimax & Alpha-Beta Pruning
    return this.minimaxBestMove();
  }

  findWinningCell(player) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const vals = [this.board[a], this.board[b], this.board[c]];
      const playerCount = vals.filter((v) => v === player).length;
      const emptyCount = vals.filter((v) => v === "").length;

      if (playerCount === 2 && emptyCount === 1) {
        if (this.board[a] === "") return a;
        if (this.board[b] === "") return b;
        if (this.board[c] === "") return c;
      }
    }
    return null;
  }

  minimaxBestMove() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
      if (this.board[i] === "") {
        this.board[i] = "O";
        const score = this.minimax(this.board, 0, false, -Infinity, Infinity);
        this.board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  minimax(board, depth, isMaximizing, alpha, beta) {
    // Basic static evaluator
    const scores = { O: 10, X: -10, draw: 0 };
    const result = this.checkStaticWinner(board);
    if (result) {
      return scores[result] - depth;
    }

    if (this.aiDifficulty === "hard") {
      // Normal minimax without alpha-beta pruning
      if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === "") {
            board[i] = "O";
            const score = this.minimax(board, depth + 1, false);
            board[i] = "";
            maxEval = Math.max(maxEval, score);
          }
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === "") {
            board[i] = "X";
            const score = this.minimax(board, depth + 1, true);
            board[i] = "";
            minEval = Math.min(minEval, score);
          }
        }
        return minEval;
      }
    } else {
      // Expert: Alpha-Beta Pruning Minimax
      if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === "") {
            board[i] = "O";
            const score = this.minimax(board, depth + 1, false, alpha, beta);
            board[i] = "";
            maxEval = Math.max(maxEval, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
          }
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === "") {
            board[i] = "X";
            const score = this.minimax(board, depth + 1, true, alpha, beta);
            board[i] = "";
            minEval = Math.min(minEval, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
          }
        }
        return minEval;
      }
    }
  }

  checkStaticWinner(board) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes("")) {
      return "draw";
    }
    return null;
  }

  // GRAVITY AI (Column strategy)
  getGravityAIMove() {
    // Select column with highest score
    const validCols = [];
    for (let c = 0; c < this.gravityCols; c++) {
      // Check top row of column
      if (this.gravityBoard[c] === "") {
        validCols.push(c);
      }
    }

    // Try win, then block
    for (const col of validCols) {
      // Find drop row
      let rIdx = -1;
      for (let r = this.gravityRows - 1; r >= 0; r--) {
        if (this.gravityBoard[r * this.gravityCols + col] === "") {
          rIdx = r * this.gravityCols + col;
          break;
        }
      }

      if (rIdx !== -1) {
        // If makes a win for O
        this.gravityBoard[rIdx] = "O";
        if (this.testGravityWin(rIdx, "O")) {
          this.gravityBoard[rIdx] = "";
          return col;
        }
        this.gravityBoard[rIdx] = "";
      }
    }

    // Try block
    for (const col of validCols) {
      let rIdx = -1;
      for (let r = this.gravityRows - 1; r >= 0; r--) {
        if (this.gravityBoard[r * this.gravityCols + col] === "") {
          rIdx = r * this.gravityCols + col;
          break;
        }
      }

      if (rIdx !== -1) {
        this.gravityBoard[rIdx] = "X";
        if (this.testGravityWin(rIdx, "X")) {
          this.gravityBoard[rIdx] = "";
          return col;
        }
        this.gravityBoard[rIdx] = "";
      }
    }

    // Default to random valid column
    return validCols[Math.floor(Math.random() * validCols.length)];
  }

  testGravityWin(lastIdx, symbol) {
    const r = Math.floor(lastIdx / this.gravityCols);
    const c = lastIdx % this.gravityCols;
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, 1],
    ];

    for (const [dr, dc] of directions) {
      let count = 1;

      let nr = r + dr;
      let nc = c + dc;
      while (
        nr >= 0 &&
        nr < this.gravityRows &&
        nc >= 0 &&
        nc < this.gravityCols
      ) {
        if (this.gravityBoard[nr * this.gravityCols + nc] === symbol) count++;
        else break;
        nr += dr;
        nc += dc;
      }

      nr = r - dr;
      nc = c - dc;
      while (
        nr >= 0 &&
        nr < this.gravityRows &&
        nc >= 0 &&
        nc < this.gravityCols
      ) {
        if (this.gravityBoard[nr * this.gravityCols + nc] === symbol) count++;
        else break;
        nr -= dr;
        nc -= dc;
      }

      if (count >= 4) return true;
    }
    return false;
  }

  // ULTIMATE AI
  getUltimateAIMove() {
    // Choose playable board
    let bIdx = this.ultimateActiveBoard;
    if (bIdx === -1) {
      const availBoards = [];
      for (let b = 0; b < 9; b++) {
        if (!this.ultimateSubWins[b]) availBoards.push(b);
      }
      bIdx = availBoards[Math.floor(Math.random() * availBoards.length)];
    }

    const availCells = [];
    for (let c = 0; c < 9; c++) {
      if (this.ultimateBoards[bIdx][c] === "") {
        availCells.push(c);
      }
    }

    // Try win/block within subboard
    // win
    for (const cell of availCells) {
      this.ultimateBoards[bIdx][cell] = "O";
      if (this.testUltimateSubWin(bIdx, "O")) {
        this.ultimateBoards[bIdx][cell] = "";
        return { boardIdx: bIdx, cellIdx: cell };
      }
      this.ultimateBoards[bIdx][cell] = "";
    }

    // block
    for (const cell of availCells) {
      this.ultimateBoards[bIdx][cell] = "X";
      if (this.testUltimateSubWin(bIdx, "X")) {
        this.ultimateBoards[bIdx][cell] = "";
        return { boardIdx: bIdx, cellIdx: cell };
      }
      this.ultimateBoards[bIdx][cell] = "";
    }

    // Select center cell if available, else random
    if (availCells.includes(4)) {
      return { boardIdx: bIdx, cellIdx: 4 };
    }

    const cellIdx = availCells[Math.floor(Math.random() * availCells.length)];
    return { boardIdx: bIdx, cellIdx };
  }

  testUltimateSubWin(bIdx, symbol) {
    const board = this.ultimateBoards[bIdx];
    const patterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of patterns) {
      if (board[a] === symbol && board[b] === symbol && board[c] === symbol)
        return true;
    }
    return false;
  }

  // INFINITE CANVAS AI
  getInfiniteAIMove() {
    // Fast local evaluation heuristic
    // Find all non-empty cell coordinates, and look at their neighbors
    const candidates = new Set();
    const coords = Array.from(this.infiniteCanvasCells.keys());

    if (coords.length === 0) {
      return { x: 0, y: 0 };
    }

    coords.forEach((coord) => {
      const [cx, cy] = coord.split(",").map(Number);
      // Add all neighbor spots within distance 1
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = cx + dx;
          const ny = cy + dy;
          // Restrict AI to the rendered 25x25 grid (-12 to 12)
          if (nx >= -12 && nx <= 12 && ny >= -12 && ny <= 12) {
            const key = `${nx},${ny}`;
            if (!this.infiniteCanvasCells.has(key)) {
              candidates.add(key);
            }
          }
        }
      }
    });

    // Evaluate each candidate for strength (threat detection)
    let bestScore = -1;
    let bestMove = null;

    candidates.forEach((coord) => {
      const [x, y] = coord.split(",").map(Number);
      const score = this.evaluateInfiniteCoord(x, y);
      if (score > bestScore) {
        bestScore = score;
        bestMove = { x, y };
      }
    });

    return bestMove || { x: 0, y: 0 };
  }

  evaluateInfiniteCoord(x, y) {
    // Assess how many aligned elements we get by playing here
    // Check both O (our alignment) and X (blocking opponent alignment)
    let totalScore = 0;
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, 1],
    ];

    for (const [dx, dy] of dirs) {
      const oCount = this.countLine(x, y, dx, dy, "O");
      const xCount = this.countLine(x, y, dx, dy, "X");

      // High weight to winning immediately (length >= winLen)
      if (oCount >= this.infiniteWinLen) totalScore += 10000;
      // High weight to blocking opponent winning move
      if (xCount >= this.infiniteWinLen) totalScore += 5000;

      // Otherwise, score based on chain length
      totalScore += oCount * 10;
      totalScore += xCount * 8; // prioritize self over blocks slightly unless it's critical
    }
    return totalScore;
  }

  countLine(x, y, dx, dy, symbol) {
    let count = 1;
    // Pos direction
    let nx = x + dx;
    let ny = y + dy;
    while (this.infiniteCanvasCells.get(`${nx},${ny}`) === symbol) {
      count++;
      nx += dx;
      ny += dy;
    }
    // Neg direction
    nx = x - dx;
    ny = y - dy;
    while (this.infiniteCanvasCells.get(`${nx},${ny}`) === symbol) {
      count++;
      nx -= dx;
      ny -= dy;
    }
    return count;
  }

  // SIZE-CAPTURE (GOBBLET) INTERFACE & LOGIC
  renderGobbletGrid() {
    this.boardWrapper.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "ttt-grid";
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = i;

      const topPiece = this.getGobbletTopPiece(i);
      if (topPiece) {
        const symClass = topPiece.player === "X" ? "symbol-x" : "symbol-o";
        let sizeClass = "symbol-small";
        if (topPiece.size === 2) sizeClass = "symbol-medium";
        if (topPiece.size === 3) sizeClass = "symbol-large";

        cell.innerHTML = `<span class="${symClass} ${sizeClass}">${topPiece.player}</span>`;
      }

      cell.addEventListener("click", () => this.handleGobbletCellClick(i));
      grid.appendChild(cell);
    }
    this.boardWrapper.appendChild(grid);

    // Render reserve interface in the special info card
    this.renderGobbletReserve();
  }

  getGobbletTopPiece(index) {
    const cellStack = this.gobbletBoard[index];
    if (cellStack && cellStack.length > 0) {
      return cellStack[cellStack.length - 1];
    }
    return null;
  }

  renderGobbletReserve() {
    this.specialInfoCard.classList.remove("hidden");
    this.specialInfoCard.innerHTML = "";

    const title = document.createElement("div");
    title.className = "gobblet-reserve-title";
    title.innerText = `${this.currentPlayer === "X" ? "Player X" : "Player O"} - Choose Piece Size`;
    this.specialInfoCard.appendChild(title);

    const row = document.createElement("div");
    row.className = "gobblet-reserve-row";

    const sizes = [
      { val: 1, name: "Small" },
      { val: 2, name: "Medium" },
      { val: 3, name: "Large" },
    ];

    sizes.forEach((sz) => {
      const qty = this.gobbletReserve[this.currentPlayer][sz.val];
      const slot = document.createElement("div");
      slot.className = `reserve-slot ${this.gobbletSelectedSize === sz.val ? "selected" : ""}`;
      slot.dataset.size = sz.val;
      slot.dataset.player = this.currentPlayer;

      let sizeClass = "symbol-small";
      if (sz.val === 2) sizeClass = "symbol-medium";
      if (sz.val === 3) sizeClass = "symbol-large";

      slot.innerHTML = `
                <div class="reserve-piece-icon ${sizeClass}">${this.currentPlayer}</div>
                <div class="reserve-qty">${sz.name} (${qty})</div>
            `;

      if (
        qty > 0 &&
        (this.opponentType === "human" || this.currentPlayer === "X")
      ) {
        slot.addEventListener("click", () => {
          synth.play("click");
          // Put piece back if currently holding one from the board
          if (
            this.gobbletSourceIndex !== null &&
            this.gobbletSourceIndex !== undefined
          ) {
            this.gobbletBoard[this.gobbletSourceIndex].push({
              player: this.currentPlayer,
              size: this.gobbletSelectedSize,
            });
            this.gobbletSourceIndex = null;
            this.renderGobbletGrid(); // This will re-render everything
          }
          this.gobbletSelectedSize = sz.val;
          this.renderGobbletReserve();
        });
      } else if (qty === 0) {
        slot.style.opacity = "0.3";
        slot.style.cursor = "not-allowed";
      }

      row.appendChild(slot);
    });

    this.specialInfoCard.appendChild(row);
  }

  handleGobbletCellClick(index) {
    if (!this.gameActive) return;
    if (this.opponentType === "ai" && this.currentPlayer === "O") return;

    if (this.gobbletSelectedSize === null) {
      const topPiece = this.getGobbletTopPiece(index);
      if (topPiece && topPiece.player === this.currentPlayer) {
        // Pick up piece
        this.gobbletBoard[index].pop();
        this.gobbletSelectedSize = topPiece.size;
        this.gobbletSourceIndex = index;
        this.renderGobbletGrid();
        this.showToast("Piece picked up. Now place it!");

        const revealedWinner = this.checkGobbletWin();
        if (revealedWinner) {
          this.endGobbletGame(revealedWinner);
        }
        return;
      }
      this.showToast(
        "Select a piece size from your reserve or board first!",
        true,
      );
      return;
    }

    const topPiece = this.getGobbletTopPiece(index);
    if (!topPiece || topPiece.size < this.gobbletSelectedSize) {
      // Valid capture / placement
      this.makeGobbletMove(index, this.gobbletSelectedSize);
    } else {
      this.showToast("You can only capture with a LARGER piece!", true);
    }
  }

  makeGobbletMove(index, size) {
    synth.play("place");

    // Push piece to cell stack
    this.gobbletBoard[index].push({ player: this.currentPlayer, size: size });

    if (
      this.gobbletSourceIndex !== undefined &&
      this.gobbletSourceIndex !== null
    ) {
      this.gobbletSourceIndex = null;
    } else {
      // Consume from reserve
      this.gobbletReserve[this.currentPlayer][size]--;
    }

    this.gobbletSelectedSize = null;
    this.renderGobbletGrid();

    const winner = this.checkGobbletWin();
    if (winner) {
      this.endGobbletGame(winner);
    } else {
      this.switchTurn();
    }
  }

  checkGobbletWin() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Gather top piece owner for each cell
    const currentTopOwners = Array(9).fill("");
    for (let i = 0; i < 9; i++) {
      const top = this.getGobbletTopPiece(i);
      if (top) currentTopOwners[i] = top.player;
    }

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        currentTopOwners[a] &&
        currentTopOwners[a] === currentTopOwners[b] &&
        currentTopOwners[a] === currentTopOwners[c]
      ) {
        // Highlight winning cells
        const cells = this.boardWrapper.querySelectorAll(".cell");
        pattern.forEach((idx) => cells[idx].classList.add("winning-cell"));
        return currentTopOwners[a];
      }
    }
    return null;
  }

  endGobbletGame(winner) {
    this.gameActive = false;
    this.stopTimer();
    synth.play("win");
    this.statusText.innerText = `Player ${winner} Wins!`;
    this.incrementScore(winner);
  }

  // GOBBLET AI STRATEGY
  getGobbletAIMove() {
    const aiReserve = this.gobbletReserve["O"];
    const availableSizes = [3, 2, 1].filter((sz) => aiReserve[sz] > 0);

    // Gather current board top piece owners and sizes
    const topOwners = Array(9).fill("");
    const topSizes = Array(9).fill(0);
    for (let i = 0; i < 9; i++) {
      const top = this.getGobbletTopPiece(i);
      if (top) {
        topOwners[i] = top.player;
        topSizes[i] = top.size;
      }
    }

    // Helper: Check if placing a symbol at index wins
    const checkHypotheticalWin = (index, symbol) => {
      const tempOwners = [...topOwners];
      tempOwners[index] = symbol;
      const patterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (const [a, b, c] of patterns) {
        if (
          tempOwners[a] &&
          tempOwners[a] === tempOwners[b] &&
          tempOwners[a] === tempOwners[c]
        )
          return true;
      }
      return false;
    };

    if (availableSizes.length > 0) {
      // 1. Check if AI can win on this turn
      for (const sz of availableSizes) {
        for (let i = 0; i < 9; i++) {
          if (topSizes[i] < sz && topOwners[i] !== "O") {
            if (checkHypotheticalWin(i, "O")) {
              return { targetIndex: i, size: sz };
            }
          }
        }
      }

      // 2. Check if AI needs to block player X win
      for (const sz of availableSizes) {
        for (let i = 0; i < 9; i++) {
          if (topSizes[i] < sz) {
            if (checkHypotheticalWin(i, "X")) {
              return { targetIndex: i, size: sz };
            }
          }
        }
      }

      // 3. Try to capture center (index 4)
      if (topSizes[4] < 3 && availableSizes.includes(3)) {
        return { targetIndex: 4, size: 3 };
      }

      // 4. Fallback: play random valid move with largest available size
      const preferredSize = availableSizes[0];
      const validIndices = [];
      for (let i = 0; i < 9; i++) {
        if (topSizes[i] < preferredSize) {
          validIndices.push(i);
        }
      }

      if (validIndices.length > 0) {
        const index =
          validIndices[Math.floor(Math.random() * validIndices.length)];
        return { targetIndex: index, size: preferredSize };
      }
    }

    // 5. If no pieces in reserve or nowhere to place them, AI must move a piece from the board
    const aiPieces = [];
    for (let i = 0; i < 9; i++) {
      if (topOwners[i] === "O") {
        aiPieces.push({ index: i, size: topSizes[i] });
      }
    }

    if (aiPieces.length > 0) {
      // Very simple AI fallback for moving pieces: pick a random piece and move it to a random valid spot
      for (let attempt = 0; attempt < 10; attempt++) {
        const piece = aiPieces[Math.floor(Math.random() * aiPieces.length)];
        const emptyOrSmaller = [];
        for (let j = 0; j < 9; j++) {
          if (j !== piece.index && topSizes[j] < piece.size) {
            emptyOrSmaller.push(j);
          }
        }
        if (emptyOrSmaller.length > 0) {
          const target =
            emptyOrSmaller[Math.floor(Math.random() * emptyOrSmaller.length)];
          return {
            sourceIndex: piece.index,
            targetIndex: target,
            size: piece.size,
          };
        }
      }
    }

    // Absolutely final fallback if completely stuck
    return {
      targetIndex: 0,
      size: availableSizes.length ? availableSizes[0] : 1,
    };
  }

  makeGobbletAIMove(move) {
    synth.play("place");

    if (move.sourceIndex !== undefined) {
      this.gobbletBoard[move.sourceIndex].pop();
    } else {
      this.gobbletReserve["O"][move.size]--;
    }

    this.gobbletBoard[move.targetIndex].push({ player: "O", size: move.size });

    this.renderGobbletGrid();

    const winner = this.checkGobbletWin();
    if (winner) {
      this.endGobbletGame(winner);
    } else {
      this.switchTurn();
    }
  }

  // MEMORY TRAINER LOGIC
  startMemorySequence() {
    this.memoryPlayerSequence = [];
    this.memoryShowing = true;
    this.gameActive = true;
    this.statusText.innerText = `Level ${this.memoryLevel} - Watch...`;
    
    // Add new step
    this.memorySequence.push(Math.floor(Math.random() * 9));
    
    this.playMemorySequence(0);
  }

  playMemorySequence(idx) {
    if (idx >= this.memorySequence.length) {
      this.memoryShowing = false;
      this.statusText.innerText = `Level ${this.memoryLevel} - Your Turn!`;
      return;
    }
    
    const cellIdx = this.memorySequence[idx];
    const cells = this.boardWrapper.querySelectorAll('.cell');
    if (cells[cellIdx]) {
      cells[cellIdx].classList.add('memory-flash');
      synth.play('click');
      
      setTimeout(() => {
        cells[cellIdx].classList.remove('memory-flash');
        setTimeout(() => {
          this.playMemorySequence(idx + 1);
        }, 300);
      }, 500);
    }
  }

  handleMemoryClick(index) {
    if (this.memoryShowing) return;
    
    const expected = this.memorySequence[this.memoryPlayerSequence.length];
    const cells = this.boardWrapper.querySelectorAll('.cell');
    
    if (index === expected) {
      synth.play('place');
      this.memoryPlayerSequence.push(index);
      cells[index].classList.add('memory-success');
      setTimeout(() => cells[index].classList.remove('memory-success'), 200);
      
      if (this.memoryPlayerSequence.length === this.memorySequence.length) {
        this.memoryShowing = true;
        this.statusText.innerText = "Correct! Next Level...";
        synth.play('win');
        this.incrementScore('X');
        this.memoryLevel++;
        setTimeout(() => this.startMemorySequence(), 1500);
      }
    } else {
      synth.play('lose');
      cells[index].classList.add('memory-error');
      this.statusText.innerText = `Wrong! Game Over at Level ${this.memoryLevel}`;
      this.gameActive = false;
      StatsManager.recordGame(this.mode, 'lose');
      this.updateStatsUI();
    }
  }
}

// Initialise Game Area
document.addEventListener("DOMContentLoaded", () => {
  const arena = new GameArena();
  arena.init();
});
