# NoteTile

A fast, offline-first, Progressive Web App for taking notes. Built as a single HTML file with zero external JS dependencies, it works entirely in your browser.

## Overview

NoteTile is a self-contained note-taking application that requires no backend and no build step. All data persists securely in your browser's `localStorage`. Once loaded, it works completely offline via a service worker and can be installed as a standalone app on any desktop or mobile device.

## Features

- **Note CRUD**: Create, edit, and delete notes via a fast modal popup editor.
- **Auto-Formatting**: Use `Heading: Body` syntax to auto-split your notes. If both exist, they flow beautifully inline separated by a bright `→` arrow.
- **Markdown Support**: Built-in support for `**bold**`, `_italic_`, checklists (`[ ]`), and `#hashtags` without external libraries. Includes a handy formatting toolbar inside the editor.
- **Instant Search**: Filter notes instantly with the search bar or by simply tapping on any `#hashtag` in your notes.
- **Focus Mode**: Immersive full-screen editor mode with a single click (⤢ toggle).
- **Auto-Save**: Saves silently while typing, on popup close, or when pressing ESC. 
- **Drag & Drop**: Grab the handle (⋮) to reorder notes intuitively. Note ordering is fully persisted.
- **Swipe Gestures**: Swipe left to delete, swipe right to mark a note as active (★).
- **Active Note**: Highlight a specific note as active. Only one note can be active at a time.
- **Undo / Redo**: 40-state history for safe editing and reordering.
- **5 Cyclic Themes**: Cycles smoothly through Light, Dark, Sepia, OLED (pure black), and Ocean themes.
- **Export / Import**: Full JSON backup and restore capabilities to easily move your notes between devices.
- **PWA Ready**: Installable, standalone, and offline-first via the included service worker.
- **Responsive**: Mobile-first layout with native-feeling horizontal scrollable toolbars on small screens.

## Project Structure

```
NT/
  index.html        # Complete application (HTML + CSS + JS)
  manifest.json     # PWA web app manifest
  service-worker.js # Offline caching service worker
```
**Total:** 3 production files, ~70 KB combined.

## Data & Storage

All data persists locally in your browser's `localStorage` under the `notetile_` prefix. No data is ever sent to a server, ensuring complete privacy.

## PWA & Offline Support

1. Open the app in a supported browser (Chrome, Edge, Safari on iOS).
2. Tap "Add to Home Screen" or "Install App".
3. The app will cache itself via the `service-worker.js` and work 100% offline.

## Swipe Gestures

| Gesture | Action |
|---------|--------|
| Swipe left on card | Reveals delete action (red), requires confirmation dialog |
| Swipe right on card | Activates note (green), no confirmation needed |

*Note: Swipe works smoothly on both **touch** (mobile) and **mouse drag** (desktop).*

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `ESC` | Close popup, clear search, or close dialogs |
| `Ctrl+Z` / `Cmd+Z` | Undo action (when popup is closed) |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` / `Ctrl+Y` | Redo action (when popup is closed) |

## Development

Double-click `index.html` to open in your browser, or host via any static HTTP server for PWA installation support:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```
Then simply open `http://localhost:8000` in your browser.

## License

MIT License.
