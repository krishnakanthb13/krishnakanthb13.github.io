        (function () {
            'use strict';
            const STORAGE_PREFIX = 'notetile_';
            const MAX_UNDO = 40;
            const APP_VERSION = '1.0.3';
            const DEBOUNCE_MS = 400;

            const bc = window.BroadcastChannel ? new BroadcastChannel('notetile_sync') : null;

            const Storage = {
                _dbName: 'NoteTileDB',
                _storeName: 'kv',
                _db: null,
                _useIndexedDB: false,
                _key(n) { return STORAGE_PREFIX + n; },
                _sizeCache: 0, _sizeTimer: -Infinity,

                async init() {
                    if (!window.indexedDB) {
                        this._useIndexedDB = false;
                        return;
                    }
                    try {
                        this._db = await new Promise((resolve, reject) => {
                            const req = indexedDB.open(this._dbName, 1);
                            req.onupgradeneeded = () => {
                                const db = req.result;
                                if (!db.objectStoreNames.contains(this._storeName)) {
                                    db.createObjectStore(this._storeName);
                                }
                            };
                            req.onsuccess = () => resolve(req.result);
                            req.onerror = () => reject(req.error);
                        });
                        this._useIndexedDB = true;

                        // One-time migration: check if there's data in localStorage and not in IndexedDB
                        const hasOldNotes = localStorage.getItem(this._key('notes'));
                        if (hasOldNotes) {
                            const idbNotes = await this.get('notes', null);
                            if (idbNotes === null) {
                                const notes = JSON.parse(hasOldNotes);
                                const activeId = localStorage.getItem(this._key('activeId'));
                                const theme = localStorage.getItem(this._key('theme'));
                                const undo = localStorage.getItem(this._key('undoHistory'));
                                const redo = localStorage.getItem(this._key('redoHistory'));
                                
                                if (notes) await this.set('notes', notes);
                                if (activeId) await this.set('activeId', JSON.parse(activeId));
                                if (theme) await this.set('theme', JSON.parse(theme));
                                if (undo) await this.set('undoHistory', JSON.parse(undo));
                                if (redo) await this.set('redoHistory', JSON.parse(redo));
                                
                                // Clean up localStorage to prevent future redundant migration
                                localStorage.removeItem(this._key('notes'));
                                localStorage.removeItem(this._key('activeId'));
                                localStorage.removeItem(this._key('theme'));
                                localStorage.removeItem(this._key('undoHistory'));
                                localStorage.removeItem(this._key('redoHistory'));
                                
                                console.log('Successfully migrated data to IndexedDB');
                            }
                        }
                    } catch (e) {
                        console.warn('IndexedDB failed to initialize. Falling back to localStorage.', e);
                        this._useIndexedDB = false;
                    }
                },

                async get(n, fb) {
                    if (this._useIndexedDB) {
                        try {
                            const val = await new Promise((resolve, reject) => {
                                const tx = this._db.transaction(this._storeName, 'readonly');
                                const req = tx.objectStore(this._storeName).get(n);
                                req.onsuccess = () => resolve(req.result);
                                req.onerror = () => reject(req.error);
                            });
                            return val !== undefined ? val : fb;
                        } catch (e) {
                            console.error('IndexedDB get error:', e);
                        }
                    }
                    try {
                        const r = localStorage.getItem(this._key(n));
                        return r !== null ? JSON.parse(r) : fb;
                    } catch {
                        return fb;
                    }
                },

                async set(n, v) {
                    if (this._useIndexedDB) {
                        try {
                            await new Promise((resolve, reject) => {
                                const tx = this._db.transaction(this._storeName, 'readwrite');
                                tx.objectStore(this._storeName).put(v, n);
                                tx.oncomplete = () => resolve();
                                tx.onerror = () => reject(tx.error);
                            });
                            this._invalidateSize();
                            this._notifyTabs();
                            return;
                        } catch (e) {
                            console.error('IndexedDB set error:', e);
                        }
                    }
                    try {
                        localStorage.setItem(this._key(n), JSON.stringify(v));
                        this._invalidateSize();
                    } catch (e) {
                        Toast.show('Storage full');
                        console.error('Storage.set:', e);
                    }
                },

                async remove(n) {
                    if (this._useIndexedDB) {
                        try {
                            await new Promise((resolve, reject) => {
                                const tx = this._db.transaction(this._storeName, 'readwrite');
                                tx.objectStore(this._storeName).delete(n);
                                tx.oncomplete = () => resolve();
                                tx.onerror = () => reject(tx.error);
                            });
                            this._invalidateSize();
                            this._notifyTabs();
                            return;
                        } catch (e) {
                            console.error('IndexedDB delete error:', e);
                        }
                    }
                    try {
                        localStorage.removeItem(this._key(n));
                        this._invalidateSize();
                    } catch {}
                },

                _invalidateSize() { this._sizeTimer = -Infinity; },
                _notifyTabs() {
                    if (bc) bc.postMessage('sync');
                },

                async estimateSize() {
                    const now = Date.now();
                    if (now - this._sizeTimer < 5000) return this._sizeCache;
                    let t = 0;
                    if (navigator.storage && navigator.storage.estimate) {
                        try { const { usage } = await navigator.storage.estimate(); t = usage; } catch(e) { }
                    }
                    if (t === 0) {
                        try {
                            for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(STORAGE_PREFIX)) { const v = localStorage.getItem(k); if (v !== null) t += v.length * 2; } }
                        } catch(e) { console.warn('Error estimating storage size:', e); return 0; }
                    }
                    this._sizeCache = t; this._sizeTimer = now; return t;
                }
            };

            const Toast = {
                _el: document.getElementById('toast'), _timer: null,
                show(msg, dur) { clearTimeout(this._timer); this._el.textContent = msg; this._el.classList.add('show'); this._timer = setTimeout(() => this._el.classList.remove('show'), dur || 2000); }
            };

            const History = {
                _undo: [], _redo: [],
                snapshot() { return JSON.stringify({ notes: Notes.getAll(), activeId: Notes.getActiveId() }); },
                async push(state) { this._undo.push(state); if (this._undo.length > MAX_UNDO) this._undo.shift(); this._redo = []; this._updateButtons(); await this._persist(); },
                async undo() { if (!this._undo.length) return; this._redo.push(this.snapshot()); const s = JSON.parse(this._undo.pop()); Notes._notes = s.notes; Notes._activeId = s.activeId || null; if (Notes._activeId && !Notes.getById(Notes._activeId)) Notes._activeId = null; await Notes._save(); UI.render(); this._updateButtons(); await this._persist(); },
                async redo() { if (!this._redo.length) return; this._undo.push(this.snapshot()); const s = JSON.parse(this._redo.pop()); Notes._notes = s.notes; Notes._activeId = s.activeId || null; if (Notes._activeId && !Notes.getById(Notes._activeId)) Notes._activeId = null; await Notes._save(); UI.render(); this._updateButtons(); await this._persist(); },
                _updateButtons() { document.getElementById('undoBtn').disabled = !this._undo.length; document.getElementById('redoBtn').disabled = !this._redo.length; },
                async _persist() { await Storage.set('undoHistory', this._undo); await Storage.set('redoHistory', this._redo); },
                async load() { this._undo = await Storage.get('undoHistory', []); this._redo = await Storage.get('redoHistory', []); this._updateButtons(); }
            };

            const Notes = {
                _notes: [], _activeId: null,
                async init() {
                    this._notes = await Storage.get('notes', []);
                    this._activeId = await Storage.get('activeId', null);
                    if (this._activeId && !this.getById(this._activeId)) this._activeId = null;
                    if (!this._notes.length) await this.add('Welcome: This is NoteTile');
                    await this._save();
                },
                getAll() { return this._notes; },
                getById(id) { return this._notes.find(n => n.id === id); },
                getActiveId() { return this._activeId; },
                getActive() { return this._notes.find(n => n.id === this._activeId) || null; },
                async add(text, afterId) {
                    const note = { id: uid(), text: text || '', created: Date.now() };
                    if (afterId) { const i = this._notes.findIndex(n => n.id === afterId); this._notes.splice(i + 1, 0, note); }
                    else this._notes.push(note);
                    await this._save(); return note;
                },
                async update(id, text) { const n = this.getById(id); if (n) { n.text = text; await this._save(); } },
                async remove(id) { const i = this._notes.findIndex(n => n.id === id); if (i === -1) return; this._notes.splice(i, 1); if (this._activeId === id) this._activeId = null; await this._save(); },
                async setActive(id) { this._activeId = this._activeId === id ? null : id; await this._save(); },
                async move(from, to) { if (from === to) return; const [item] = this._notes.splice(from, 1); this._notes.splice(to, 0, item); await this._save(); },
                async _save() { await Storage.set('notes', this._notes); await Storage.set('activeId', this._activeId); },
                exportAll() { return { version: APP_VERSION, timestamp: new Date().toISOString(), notes: this._notes, activeId: this._activeId, theme: Theme.current(), settings: {} }; },
                async importData(data) {
                    if (!data || typeof data !== 'object') throw new Error('Invalid format');
                    if (data.version && data.version.split('.')[0] !== APP_VERSION.split('.')[0]) throw new Error('Incompatible version: expected ' + APP_VERSION + ', got ' + data.version);
                    if (!Array.isArray(data.notes) || data.notes.length === 0) throw new Error('No valid notes found');
                    const seenIds = new Set();
                    this._notes = data.notes
                        .filter(n => n && typeof n === 'object' && typeof n.text === 'string')
                        .map(n => {
                            let id = n.id || uid();
                            while (seenIds.has(id)) id = uid();
                            seenIds.add(id);
                            return { id, text: n.text || '', created: n.created || Date.now() };
                        });
                    if (this._notes.length === 0) throw new Error('No valid notes found');
                    this._activeId = data.activeId || null;
                    if (this._activeId && !this.getById(this._activeId)) this._activeId = null;
                    if (data.theme) Theme.apply(data.theme);
                    await this._save();
                }
            };

            const Theme = {
                _themes: ['light', 'dark', 'sepia', 'oled', 'ocean'],
                _colors: { 'light': '#f5f5f7', 'dark': '#1c1c1e', 'sepia': '#f4ecd8', 'oled': '#000000', 'ocean': '#0f172a' },
                _current: 'light',
                async init() { this._current = await Storage.get('theme', 'light'); this.apply(this._current); },
                async toggle() {
                    const idx = this._themes.indexOf(this._current);
                    this._current = this._themes[(idx + 1) % this._themes.length];
                    this.apply(this._current);
                    await Storage.set('theme', this._current);
                    UI.updateFooter();
                },
                apply(theme) {
                    this._current = theme;
                    document.documentElement.setAttribute('data-theme', theme);
                    const m = document.querySelector('meta[name="theme-color"]');
                    if (m) m.content = this._colors[theme] || '#f5f5f7';
                    UI.updateFooter();
                },
                current() { return this._current; }
            };

            const Popup = {
                _overlay: document.getElementById('popupOverlay'),
                _textarea: document.getElementById('popupTextarea'),
                _noteId: null, _debounceTimer: null, _isOpen: false,
                open(noteId) { this._noteId = noteId; const n = Notes.getById(noteId); const draft = sessionStorage.getItem('draft_' + noteId); this._textarea.value = draft || (n ? n.text : ''); this._overlay.classList.add('open'); this._isOpen = true; setTimeout(() => this._textarea.focus(), 100); },
                async close() { await this._saveNow(); this._overlay.classList.remove('open'); document.querySelector('.popup-box').classList.remove('focus-mode'); this._isOpen = false; if (this._noteId) sessionStorage.removeItem('draft_' + this._noteId); this._noteId = null; clearTimeout(this._debounceTimer); UI.render(); },
                async _saveNow() {
                    if (!this._noteId) return;
                    const newText = this._textarea.value.trim();
                    const old = Notes.getById(this._noteId);
                    if (old) {
                        if (newText === '') {
                            if (old.text !== '') {
                                await History.push(History.snapshot());
                            }
                            await Notes.remove(this._noteId);
                            UI.render();
                        } else if (old.text !== newText) {
                            await History.push(History.snapshot());
                            await Notes.update(this._noteId, newText);
                            UI.render();
                        }
                    }
                },
                _onInput() { clearTimeout(this._debounceTimer); if (this._noteId) sessionStorage.setItem('draft_' + this._noteId, this._textarea.value); this._debounceTimer = setTimeout(async () => { if (this._noteId) { await Notes.update(this._noteId, this._textarea.value); UI.updateFooter(); sessionStorage.removeItem('draft_' + this._noteId); } }, DEBOUNCE_MS); },
                isOpen() { return this._isOpen; }
            };

            const Confirm = {
                _overlay: document.getElementById('confirmOverlay'), _msg: document.getElementById('confirmMsg'), _resolve: null,
                show(msg) { this._msg.textContent = msg; this._overlay.classList.add('open'); return new Promise(r => { this._resolve = r; }); },
                accept() { this._overlay.classList.remove('open'); if (this._resolve) this._resolve(true); },
                cancel() { this._overlay.classList.remove('open'); if (this._resolve) this._resolve(false); }
            };

            // ============================================================
            //  INTERACTION MODULE  —  Drag + Swipe
            // ============================================================
            const Interaction = {
                _drag: null,
                _swipe: null,
                _blocked: false,

                init() {
                    document.addEventListener('pointerdown', e => this._onDown(e));
                    document.addEventListener('pointermove', e => this._onMove(e));
                    document.addEventListener('pointerup', e => this._onUp(e));
                    document.addEventListener('pointercancel', () => this._cancel());
                },

                _onDown(e) {
                    if (this._blocked || Popup.isOpen()) return;
                    const card = e.target.closest('.note-card');
                    if (!card) return;

                    if (e.target.closest('.note-drag-handle')) {
                        e.preventDefault();
                        this._dragStart(e, card);
                    } else if (e.target.closest('.note-content')) {
                        this._swipeStart(e, card);
                    }
                },

                _onMove(e) {
                    if (this._drag) { e.preventDefault(); this._dragMove(e); }
                    else if (this._swipe) { e.preventDefault(); this._swipeMove(e); }
                },

                _onUp() {
                    if (this._drag) this._dragEnd();
                    else if (this._swipe) this._swipeEnd();
                },

                _cancel() {
                    this._dragCleanup();
                    this._swipeCleanup();
                },

                // ────── DRAG ──────
                _dragStart(e, card) {
                    if ('vibrate' in navigator) navigator.vibrate(10);
                    const rect = card.getBoundingClientRect();
                    this._drag = {
                        card, idx: +card.dataset.idx, target: +card.dataset.idx,
                        offX: e.clientX - rect.left, offY: e.clientY - rect.top, ghost: null
                    };
                    const g = document.createElement('div');
                    g.className = 'drag-ghost';
                    const inner = card.querySelector('.note-inner');
                    if (inner) {
                        const clone = inner.cloneNode(true);
                        clone.style.width = '100%';
                        clone.style.height = '100%';
                        g.appendChild(clone);
                    }
                    g.style.width = rect.width + 'px';
                    g.style.height = rect.height + 'px';
                    g.style.left = (e.clientX - this._drag.offX) + 'px';
                    g.style.top = (e.clientY - this._drag.offY) + 'px';
                    document.body.appendChild(g);
                    this._drag.ghost = g;
                    card.classList.add('dragging');
                    this._indicator(this._drag.idx);
                },

                _dragMove(e) {
                    if (!this._drag) return;
                    this._drag.ghost.style.left = (e.clientX - this._drag.offX) + 'px';
                    this._drag.ghost.style.top = (e.clientY - this._drag.offY) + 'px';
                    const cards = document.querySelectorAll('.note-card:not(.dragging)');
                    let idx = this._drag.idx;
                    for (const c of cards) {
                        const r = c.getBoundingClientRect();
                        if (e.clientY > r.top + r.height / 2) idx = +c.dataset.idx + 1;
                        else { idx = +c.dataset.idx; break; }
                    }
                    idx = Math.max(0, Math.min(Notes.getAll().length, idx));
                    if (idx !== this._drag.target) { this._drag.target = idx; this._indicator(idx); }
                },

                async _dragEnd() {
                    if (!this._drag) return;
                    const { card, idx, target } = this._drag;
                    this._dragCleanup();
                    if (idx !== target && target >= 0) {
                        const to = target > idx ? target - 1 : target;
                        await History.push(History.snapshot());
                        await Notes.move(idx, to);
                        UI.render();
                        Toast.show('Note moved');
                    }
                },

                _dragCleanup() {
                    if (!this._drag) return;
                    this._drag.card.classList.remove('dragging');
                    if (this._drag.ghost) this._drag.ghost.remove();
                    document.querySelector('.drop-indicator')?.remove();
                    this._drag = null;
                },

                _indicator(idx) {
                    document.querySelector('.drop-indicator')?.remove();
                    const list = document.getElementById('noteList');
                    const ind = document.createElement('div');
                    ind.className = 'drop-indicator visible';
                    const cards = list.querySelectorAll('.note-card');
                    if (idx === 0) { const first = list.querySelector('.note-card'); first ? list.insertBefore(ind, first) : list.appendChild(ind); }
                    else if (idx >= Notes.getAll().length) { list.appendChild(ind); }
                    else { const target = cards[idx]; target ? list.insertBefore(ind, target) : list.appendChild(ind); }
                },

                // ────── SWIPE ──────
                _swipeStart(e, card) {
                    this._swipe = {
                        card, content: card.querySelector('.note-inner'),
                        actions: card.querySelector('.swipe-actions'),
                        sx: e.clientX, sy: e.clientY, dir: null, did: false
                    };
                },

                _swipeMove(e) {
                    const s = this._swipe;
                    if (!s) return;
                    const dx = e.clientX - s.sx, dy = e.clientY - s.sy;
                    if (!s.dir) {
                        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) s.dir = 'h';
                        else if (Math.abs(dy) > 8) { this._swipe = null; return; }
                        else return;
                    }
                    s.did = true;
                    const c = Math.max(-120, Math.min(120, dx));
                    s.content.style.transform = `translateX(${c}px)`;
                    s.content.classList.add('swiping');
                    if (s.actions) s.actions.style.opacity = Math.abs(c) > 20 ? '1' : '0';
                },

                async _swipeEnd() {
                    const s = this._swipe;
                    if (!s) return;
                    const m = s.content.style.transform.match(/translateX\((.+)px\)/);
                    const dx = m ? parseFloat(m[1]) : 0;
                    s.content.classList.remove('swiping');
                    s.content.style.transition = 'transform 0.2s ease';
                    const id = s.card.dataset.id;

                    if (s.did) {
                        if (dx < -60) {
                            s.content.style.transform = 'translateX(-80px)';
                            setTimeout(async () => { s.content.style.transform = ''; s.content.style.transition = ''; await this._delete(id); }, 200);
                        } else if (dx > 60) {
                            s.content.style.transform = '';
                            s.content.style.transition = '';
                            await History.push(History.snapshot());
                            const wasActive = (Notes.getActiveId() === id);
                            await Notes.setActive(id);
                            UI.render();
                            Toast.show(wasActive ? 'Note deactivated' : 'Note activated');
                        } else {
                            s.content.style.transform = '';
                        }
                        this._blocked = true;
                        setTimeout(() => { this._blocked = false; }, 300);
                    } else {
                        s.content.style.transform = '';
                    }

                    this._swipe = null;
                },

                async _delete(id) {
                    const ok = await Confirm.show('Delete this note?');
                    if (ok) {
                        await History.push(History.snapshot());
                        const card = document.querySelector(`.note-card[data-id="${id}"]`);
                        if (card) {
                            card.style.transition = 'transform 0.3s, opacity 0.3s, padding 0.3s, margin 0.3s, height 0.3s';
                            card.style.transform = 'scale(0.8)';
                            card.style.opacity = '0';
                            setTimeout(async () => { await Notes.remove(id); UI.render(); Toast.show('Note deleted'); }, 300);
                        } else {
                            await Notes.remove(id); UI.render(); Toast.show('Note deleted');
                        }
                    }
                },

                _swipeCleanup() {
                    if (!this._swipe) return;
                    this._swipe.content.style.transform = '';
                    this._swipe.content.classList.remove('swiping');
                    if (this._swipe.actions) this._swipe.actions.style.opacity = '';
                    this._swipe = null;
                },

                wasSwipe() { return this._swipe && this._swipe.did; }
            };

            // ============================================================
            //  UI
            // ============================================================
            const UI = {
                _list: document.getElementById('noteList'), _empty: document.getElementById('emptyState'),
                render() {
                    const notes = Notes.getAll();
                    const term = (document.getElementById('searchInput')?.value || '').toLowerCase();
                    const filtered = term ? notes.filter(n => n.text.toLowerCase().includes(term)) : notes;

                    if (notes.length === 0) {
                        this._empty.style.display = 'block';
                        this._empty.innerHTML = `<div class="empty-state-icon"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='width:64px;height:64px;'><rect x='20' y='15' width='60' height='70' rx='10' fill='none' stroke='currentColor' stroke-width='6'/><line x1='36' y1='40' x2='64' y2='40' stroke='currentColor' stroke-width='4' stroke-linecap='round'/><line x1='36' y1='60' x2='54' y2='60' stroke='currentColor' stroke-width='4' stroke-linecap='round'/></svg></div><div class="empty-state-text">No notes yet.<br>Tap + to create your first note.</div>`;
                    } else if (filtered.length === 0) {
                        this._empty.style.display = 'block';
                        this._empty.innerHTML = `<div class="empty-state-icon"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='width:64px;height:64px;'><circle cx='45' cy='45' r='20' fill='none' stroke='currentColor' stroke-width='6'/><line x1='60' y1='60' x2='75' y2='75' stroke='currentColor' stroke-width='6' stroke-linecap='round'/></svg></div><div class="empty-state-text">No notes match your search.</div>`;
                    } else {
                        this._empty.style.display = 'none';
                    }

                    this._list.innerHTML = '';
                    filtered.forEach((note, idx) => this._list.appendChild(this._createCard(note, idx)));
                    const addBtn = document.createElement('button');
                    addBtn.className = 'note-add-btn note-add-bottom';
                    addBtn.textContent = '+';
                    addBtn.setAttribute('aria-label', 'Add new note');
                    addBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const search = document.getElementById('searchInput');
                        if (search.value) { search.value = ''; }
                        await History.push(History.snapshot());
                        const n = await Notes.add('');
                        UI.render();
                        Popup.open(n.id);
                    });
                    this._list.appendChild(addBtn);
                    this.updateFooter();
                },
                _createCard(note, idx) {
                    const card = document.createElement('div');
                    const isActive = note.id === Notes.getActiveId();
                    card.className = 'note-card' + (isActive ? ' active' : '');
                    card.dataset.id = note.id;
                    card.dataset.idx = idx;
                    const { heading, body } = parseNote(note.text);
                    card.innerHTML = `
                    <div class="swipe-actions"><div class="swipe-action swipe-active">${isActive ? '✕ Deactivate' : '✓ Activate'}</div><div class="swipe-action swipe-delete">✕ Delete</div></div>
                    <div class="note-inner">
                        <div class="note-drag-handle" aria-label="Drag to reorder">⋮</div>
                        <div class="note-content">
                            ${isActive ? '<div class="active-icon" style="position:absolute; right:0px; top:50%; transform:translateY(-50%); color:var(--active-green); font-size:14px; z-index:2; pointer-events:none;">★</div>' : ''}
                            ${heading && body ? `<div class="note-body"><span class="note-heading" style="display:inline; margin-bottom:0;">${parseMarkdown(heading)}</span> <span style="display: inline-block; vertical-align: middle; color: var(--accent); margin: 0 4px; line-height: 0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle; transform: translateY(-1px);"><line x1="2" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span> ${parseMarkdown(body)}</div>` : ''}
                            ${heading && !body ? `<div class="note-heading">${parseMarkdown(heading)}</div>` : ''}
                            ${!heading && body ? `<div class="note-body">${parseMarkdown(body)}</div>` : ''}
                            ${!heading && !body ? '<div class="note-body" style="font-style:italic;">Empty note</div>' : ''}
                        </div>
                        <div class="note-chevron">›</div>
                    </div>
                `;

                    const content = card.querySelector('.note-content');
                    content.addEventListener('click', (e) => {
                        if (Interaction._blocked || Interaction.wasSwipe()) return;

                        const cbEl = e.target.closest('.md-cb');
                        if (cbEl) {
                            e.stopPropagation();
                            const taskEl = cbEl.closest('.md-task-inline');
                            if (taskEl) {
                                const tIdx = parseInt(taskEl.dataset.taskIdx, 10);
                                toggleTaskState(note.id, tIdx);
                            }
                            return;
                        }

                        if (e.target.classList.contains('hashtag')) {
                            const search = document.getElementById('searchInput');
                            if (search.value === e.target.textContent) search.value = '';
                            else search.value = e.target.textContent;
                            UI.render();
                            return;
                        }
                        if (!Popup.isOpen()) Popup.open(note.id);
                    });

                    return card;
                },
                async updateFooter() {
                    const notes = Notes.getAll(), active = Notes.getActive();
                    document.getElementById('footerCount').textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`;
                    document.getElementById('footerActive').textContent = active ? `Active: ${parseNote(active.text).heading || 'Note'}` : 'No active';
                    document.getElementById('footerTheme').textContent = Theme.current().charAt(0).toUpperCase() + Theme.current().slice(1);
                    const size = await Storage.estimateSize();
                    document.getElementById('footerStorage').textContent = formatBytes(size);
                }
            };

            const ImportExport = {
                export() {
                    const data = Notes.exportAll();
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    this._download(blob, `NoteTile-${new Date().toISOString().slice(0, 10)}.json`);
                },
                exportMd() {
                    const notes = Notes.getAll();
                    let md = `# NoteTile Export - ${new Date().toISOString().slice(0, 10)}\n\n`;
                    notes.forEach(n => { md += `${n.text}\n\n---\n\n`; });
                    const blob = new Blob([md], { type: 'text/markdown' });
                    this._download(blob, `NoteTile_Notes_${new Date().toISOString().slice(0, 10)}.md`);
                },
                _download(blob, filename) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = filename;
                    document.body.appendChild(a); a.click();
                    document.body.removeChild(a); URL.revokeObjectURL(url);
                },
                _input: document.getElementById('importInput'),
                import() { this._input.click(); },
                _onFile(e) {
                    const file = e.target.files[0]; if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async ev => { try { const data = JSON.parse(ev.target.result); const ok = await Confirm.show(`Import ${data.notes?.length || 0} notes? This will replace all current notes.`); if (ok) { await History.push(History.snapshot()); await Notes.importData(data); UI.render(); Toast.show('Notes imported'); } } catch (err) { Toast.show('Invalid file format'); console.error('Import:', err); } };
                    reader.readAsText(file); this._input.value = '';
                }
            };

            function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
            function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
            function parseNote(t) { if (!t) return { heading: '', body: '' }; const i = t.indexOf(':'); if (i > 0 && i < 120) return { heading: escHtml(t.slice(0, i).trim()), body: t.slice(i + 1).trim() }; return { heading: '', body: t }; }
            function parseMarkdown(text) {
                let h = escHtml(text);
                h = h.replace(/\*\*(.*?)\*\*/g, '<span class="md-bold">$1</span>');
                h = h.replace(/_(.*?)_/g, '<span class="md-italic">$1</span>');
                h = h.replace(/(^|\s)(#[a-zA-Z0-9_]+)/g, '$1<span class="hashtag">$2</span>');

                let taskIdx = 0;
                h = h.replace(/(\[ \]|\[x\]) (.*?)(?=\n|$)/g, (match, cbState, taskText) => {
                    const isChecked = cbState === '[x]';
                    const idx = taskIdx++;
                    return `<span class="md-task-inline" data-task-idx="${idx}"><span class="md-cb${isChecked ? ' checked' : ''}">${isChecked ? '✓' : ''}</span> <span>${taskText}</span></span>`;
                });
                return h;
            }

            async function toggleTaskState(id, taskIndex) {
                const note = Notes.getById(id);
                if (!note) return;
                let currentIdx = 0;
                const newText = note.text.replace(/(\[ \]|\[x\]) (.*?)(?=\n|$)/g, (match, cbState, taskText) => {
                    if (currentIdx === taskIndex) {
                        const newCb = cbState === '[ ]' ? '[x]' : '[ ]';
                        currentIdx++;
                        return `${newCb} ${taskText}`;
                    }
                    currentIdx++;
                    return match;
                });
                await History.push(History.snapshot());
                await Notes.update(id, newText);
                UI.render();
            }

            function formatBytes(b) { if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; }

            function applyMarkdown(type) {
                const ta = document.getElementById('popupTextarea');
                const start = ta.selectionStart, end = ta.selectionEnd;
                const sel = ta.value.substring(start, end);
                let rep = '', curStart = start, curEnd = end;
                if (type === 'bold') { rep = `**${sel || 'bold'}**`; curStart = start + 2; curEnd = curStart + (sel || 'bold').length; }
                else if (type === 'italic') { rep = `_${sel || 'italic'}_`; curStart = start + 1; curEnd = curStart + (sel || 'italic').length; }
                else if (type === 'task') {
                    if (sel) { rep = sel.split('\n').map(l => `[ ] ${l}`).join('\n'); curStart = start; curEnd = start + rep.length; }
                    else { rep = `[ ] task`; curStart = start + 4; curEnd = curStart + 4; }
                }
                else if (type === 'tag') { rep = `#${sel || 'tag'}`; curStart = start + 1; curEnd = curStart + (sel || 'tag').length; }
                ta.focus();
                if (!document.execCommand('insertText', false, rep)) ta.setRangeText(rep, start, end, 'end');
                ta.setSelectionRange(curStart, curEnd);
                Popup._onInput();
            }

            function bindEvents() {
                document.getElementById('themeBtn').addEventListener('click', () => Theme.toggle());
                document.getElementById('undoBtn').addEventListener('click', () => History.undo());
                document.getElementById('redoBtn').addEventListener('click', () => History.redo());
                document.getElementById('exportBtn').addEventListener('click', () => ImportExport.export());
                document.getElementById('importBtn').addEventListener('click', () => ImportExport.import());
                document.getElementById('addBtn').addEventListener('click', async () => {
                    const search = document.getElementById('searchInput');
                    if (search.value) { search.value = ''; UI.render(); }
                    await History.push(History.snapshot());
                    const n = await Notes.add('');
                    UI.render();
                    Popup.open(n.id);
                });
                document.getElementById('popupClose').addEventListener('click', () => Popup.close());
                document.getElementById('popupOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) Popup.close(); });
                document.getElementById('popupTextarea').addEventListener('input', () => Popup._onInput());
                document.getElementById('popupFocus').addEventListener('click', () => document.querySelector('.popup-box').classList.toggle('focus-mode'));
                document.getElementById('searchInput').addEventListener('input', () => UI.render());
                document.getElementById('confirmCancel').addEventListener('click', () => Confirm.cancel());
                document.getElementById('confirmDelete').addEventListener('click', () => Confirm.accept());
                document.getElementById('confirmOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) Confirm.cancel(); });
                document.getElementById('importInput').addEventListener('change', (e) => ImportExport._onFile(e));

                document.querySelectorAll('.md-btn').forEach(btn => {
                    btn.addEventListener('mousedown', (e) => { e.preventDefault(); applyMarkdown(btn.dataset.md); });
                });

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        if (Popup._overlay.classList.contains('open')) {
                            Popup.close();
                            e.preventDefault();
                        }
                        if (Confirm._overlay.classList.contains('open')) {
                            Confirm.cancel();
                            e.preventDefault();
                        }
                    }
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                        e.preventDefault();
                        if (Popup.isOpen()) {
                            Popup.close();
                        }
                    }
                    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                        e.preventDefault();
                        if (!Popup.isOpen()) History.undo();
                    }
                    if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) {
                        e.preventDefault();
                        if (!Popup.isOpen()) History.redo();
                    }
                    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                        e.preventDefault();
                        if (!Popup.isOpen()) History.redo();
                    }
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
                        e.preventDefault();
                        if (!Popup.isOpen()) {
                            const searchInput = document.getElementById('searchInput');
                            searchInput.focus();
                            if (searchInput.value.length > 0) {
                                searchInput.selectionStart = searchInput.value.length;
                            }
                        }
                    }
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
                        e.preventDefault();
                        if (!Popup.isOpen()) {
                            document.getElementById('addBtn').click();
                        }
                    }
                });
            }

            function registerSW() { if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => { }); }

            async function init() {
                await Storage.init();
                await Theme.init();
                await Notes.init();
                await History.load();
                UI.render();
                document.querySelector(".footer-version").textContent = "v" + APP_VERSION;
                Interaction.init();
                bindEvents();
                registerSW();

                if (bc) {
                    bc.onmessage = async (e) => {
                        if (e.data === 'sync') {
                            Notes._notes = await Storage.get('notes', []);
                            Notes._activeId = await Storage.get('activeId', null);
                            if (!Popup.isOpen()) UI.render();
                        }
                    };
                }

                window.addEventListener('beforeunload', () => {
                    if (bc) bc.close();
                });

                const params = new URLSearchParams(window.location.search);
                if (params.get('action') === 'new') {
                    document.getElementById('addBtn').click();
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }

            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
        })();
