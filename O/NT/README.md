# NoteTile

A fast, offline-first, Progressive Web App for taking notes. Built with modern, vanilla web standards, it features high performance, strong security (strict CSP), infinite scaling (IndexedDB), and cross-tab synchronization.

## Overview

NoteTile is a self-contained note-taking application that requires no backend and no build step. By separating concerns, it features HTML/CSS in `index.html` and logic in `app.js`, adhering to a strict Content Security Policy (`script-src 'self'`). Once loaded, it works completely offline via a service worker and can be installed as a standalone app on any desktop or mobile device.

## Features

- **Note CRUD**: Create, edit, and delete notes via a fast modal popup editor.
- **Auto-Formatting**: Use `Heading: Body` syntax to auto-split your notes. If both exist, they flow beautifully inline separated by a bright `→` arrow.
- **Markdown Support**: Built-in support for `**bold**`, `_italic_`, checklists (`[ ]`), and `#hashtags` without external libraries. Includes a handy formatting toolbar inside the editor. Checkboxes in notes are fully interactive—tap any checkbox directly on a note card to check/uncheck it without opening the editor.
- **Instant Search**: Filter notes instantly with the search bar or by simply tapping on any `#hashtag` in your notes. On smaller screens (<768px), the search box collapses into a magnifying glass icon to save space, and expands smoothly to full width on focus.
- **Focus Mode**: Immersive full-screen editor mode with a single click (⤢ toggle).
- **Auto-Save**: Saves silently while typing, on popup close, or when pressing ESC. 
- **Drag & Drop**: Grab the handle (⋮) to reorder notes intuitively. Note ordering is fully persisted.
- **Swipe Gestures**: Swipe left to delete, swipe right to toggle the note's active state (★).
- **Active Note**: Swipe right toggles the selected note's active state. At most one note can be active.
- **Undo / Redo**: 40-state history for safe editing and reordering.
- **5 Cyclic Themes**: Cycles smoothly through Light, Dark, Sepia, OLED (pure black), and Ocean themes.
- **Quick Links**: A heart-shaped shortcut button in the header opens your favorite external space (`https://krishnakanthb13.github.io/S/`) in a new tab.
- **Export / Import**: Full JSON backup and restore capabilities (downloads as `NoteTile-YYYY-MM-DD.json`) to easily move your notes between devices.
- **PWA Ready**: Installable, standalone, and offline-first via the included service worker.
- **Responsive**: Mobile-first layout with native-feeling horizontal scrollable toolbars on small screens. Now features touch-optimized sizing (coarse pointer support) and clean, responsive SVG iconography throughout.

## Project Structure

```
NT/
  index.html        # App shell and styling (HTML + CSS)
  app.js            # Main application logic (IIFE, IndexedDB, routing, events)
  manifest.json     # PWA web app manifest with install shortcuts
  service-worker.js # Offline caching service worker (v16)
```
**Total:** 4 production files, ~90 KB combined.

## Data & Storage

All data is stored locally in your browser using **IndexedDB** (under the database name `NoteTileDB`).
* **Auto-Migration**: Existing notes in `localStorage` from older installations are automatically migrated to IndexedDB on startup.
* **Fallback**: If IndexedDB is blocked or unavailable (e.g. inside private browsing mode), the application gracefully falls back to `localStorage` under the `notetile_` prefix.
* **Cross-Tab Synchronization**: Uses the `BroadcastChannel` API (`notetile_sync`) to keep multiple open browser tabs/windows perfectly in sync.

## PWA & Offline Support

1. Open the app in a supported browser (Chrome, Edge, Safari on iOS).
2. Tap "Add to Home Screen" or "Install App".
3. The app will cache itself via the `service-worker.js` and work 100% offline.

## Swipe Gestures

| Gesture | Action |
|---------|--------|
| Swipe left on card | Reveals delete action (red), requires confirmation dialog |
| Swipe right on card | Toggles active note state (green/active or gray/inactive), no confirmation needed |

*Note: Swipe works smoothly on both **touch** (mobile) and **mouse drag** (desktop).*

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `ESC` | Close popup, clear search, or close confirmation dialogs |
| `Ctrl+N` / `Cmd+N` | Create a new note (when popup is closed) |
| `Ctrl+F` / `Cmd+F` | Focus and highlight the search input (when popup is closed) |
| `Ctrl+S` / `Cmd+S` | Save and close the edit note popup |
| `Ctrl+Z` / `Cmd+Z` | Undo action (when popup is closed) |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` / `Ctrl+Y` | Redo action (when popup is closed) |

## Development

Host the directory via any static HTTP server to support PWA installation:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```
Then simply open `http://localhost:8000` in your browser.

## License

MIT License.
