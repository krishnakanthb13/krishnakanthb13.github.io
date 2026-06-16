/* ===========================================================================
   ai-helper.js  ·  v2  ·  Shared client-side AI helper for the L/ folder
   ---------------------------------------------------------------------------
   • One global  callAI(prompt, systemInstruction?)  that routes to any provider
   • A bubbly ⚙️ AI Config panel injected on load (settings stored in localStorage)
   • Keyless by default (Puter.js); BYOK for Groq, Gemini, Mistral, Cerebras,
     Cohere, OpenRouter, OpenAI
   • Auto-fetch model lists from each provider's /models endpoint (datalist)
   • Show/hide key, one-click connection test, and a request timeout
   No build step, no backend — keys live only in the visitor's own browser.
   =========================================================================== */
(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────
  // Provider registry — single source of truth
  // ──────────────────────────────────────────────────────────────────────
  const PROVIDERS = {
    puter: {
      label: 'Puter.js (Free · No Key)',
      keyless: true,
      // Puter's own current default; web search works on OpenAI models like this one.
      defaultModel: 'gpt-5-nano',
      supportsSearch: true,
      // Puter has no public model-list endpoint, so we suggest current popular ones
      // (per docs.puter.com). 500+ models are available; users can type any of them.
      suggestedModels: ['gpt-5-nano', 'gpt-5.4-nano', 'openai/gpt-5.2-chat',
        'claude-sonnet-4-5', 'claude-sonnet-4', 'gemini-2.5-flash',
        'gemini-2.5-flash-lite', 'deepseek-chat', 'meta-llama/llama-4-maverick'],
    },
    groq: {
      label: 'Groq (Free Key · Super Fast)',
      base: 'https://api.groq.com/openai/v1',
      defaultModel: 'llama-3.3-70b-versatile',
      keyLabel: 'Groq API Key',
      signupUrl: 'https://console.groq.com/keys',
      signupText: 'Groq Console',
      signupNote: 'free, no card needed',
    },
    gemini: {
      label: 'Google Gemini (Free Key)',
      defaultModel: 'gemini-3.1-flash-lite',
      supportsSearch: true,
      keyLabel: 'Gemini API Key',
      signupUrl: 'https://aistudio.google.com/',
      signupText: 'Google AI Studio',
      signupNote: 'generous free tier',
    },
    mistral: {
      label: 'Mistral AI (Free Key)',
      base: 'https://api.mistral.ai/v1',
      defaultModel: 'mistral-small-latest',
      keyLabel: 'Mistral API Key',
      signupUrl: 'https://console.mistral.ai/api-keys',
      signupText: 'Mistral Console',
      signupNote: 'free experimentation tier',
    },
    cerebras: {
      label: 'Cerebras (Free Key · Fastest)',
      base: 'https://api.cerebras.ai/v1',
      defaultModel: 'gpt-oss-120b',
      keyLabel: 'Cerebras API Key',
      signupUrl: 'https://cloud.cerebras.ai/',
      signupText: 'Cerebras Cloud',
      signupNote: 'free key, blazing inference',
    },
    cohere: {
      label: 'Cohere (Free Trial Key)',
      defaultModel: 'command-a-03-2025',
      keyLabel: 'Cohere API Key',
      signupUrl: 'https://dashboard.cohere.com/api-keys',
      signupText: 'Cohere Dashboard',
      signupNote: 'rate-limited free trial',
    },
    openrouter: {
      label: 'OpenRouter (Free Models)',
      base: 'https://openrouter.ai/api/v1',
      defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
      supportsSearch: true,
      keyLabel: 'OpenRouter API Key',
      signupUrl: 'https://openrouter.ai/keys',
      signupText: 'OpenRouter',
      signupNote: 'many models ending in :free',
    },
    openai: {
      label: 'OpenAI (Paid Key)',
      base: 'https://api.openai.com/v1',
      defaultModel: 'gpt-4.1-nano',
      keyLabel: 'OpenAI API Key',
      signupUrl: 'https://platform.openai.com/api-keys',
      signupText: 'OpenAI Platform',
      signupNote: 'requires loaded credits',
    },
  };

  // Providers that speak the OpenAI /chat/completions dialect.
  const OPENAI_COMPATIBLE = ['openai', 'groq', 'mistral', 'cerebras', 'openrouter'];

  const REQUEST_TIMEOUT_MS = 60000; // 60s ceiling on any single AI request

  // ──────────────────────────────────────────────────────────────────────
  // Small helpers
  // ──────────────────────────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const ls = {
    get: (k, d = '') => localStorage.getItem(k) ?? d,
    set: (k, v) => localStorage.setItem(k, v),
  };

  // fetch() with an automatic timeout via AbortController
  async function fetchT(url, opts = {}, ms = REQUEST_TIMEOUT_MS) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      return await fetch(url, { ...opts, signal: ctrl.signal });
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('Request timed out — try again.');
      throw e;
    } finally {
      clearTimeout(t);
    }
  }

  // ──────────────────────────────────────────────────────────────────────
  // 1. Inject Puter.js (only needed for the keyless default)
  //    Skip it on file:// — Puter throws an "Unsupported Protocol" error there,
  //    so we avoid loading it and surface friendly guidance in callAI instead.
  // ──────────────────────────────────────────────────────────────────────
  const IS_FILE = location.protocol === 'file:';
  if (!IS_FILE && !document.querySelector('script[src*="puter.com"]')) {
    const s = document.createElement('script');
    s.src = 'https://js.puter.com/v2/';
    s.async = true;
    document.head.appendChild(s);
  }

  // ──────────────────────────────────────────────────────────────────────
  // 2. Inject panel CSS (themed via the host page's --settings-* tokens)
  // ──────────────────────────────────────────────────────────────────────
  const styles = `
    .settings-trigger {
      position: fixed; top: 1rem; right: 1rem; cursor: pointer;
      font-family: 'Fredoka', 'Quicksand', sans-serif;
      font-size: 0.82rem; font-weight: 500;
      color: var(--settings-accent, #f25e9c);
      background: rgba(255,255,255,0.92); backdrop-filter: blur(6px);
      padding: 0.5rem 1rem; border-radius: 999px;
      border: 2px solid var(--settings-border, #f6cfe2);
      transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s, background 0.2s, color 0.2s;
      display: flex; align-items: center; gap: 0.4rem; z-index: 9000;
      box-shadow: 0 4px 14px rgba(242,94,156,0.18);
    }
    .settings-trigger:hover {
      background: linear-gradient(135deg, #ff9ec7, var(--settings-accent, #f25e9c));
      color: #fff; border-color: #fff;
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 7px 20px rgba(242,94,156,0.35);
    }
    .settings-trigger:active { transform: scale(0.97); }
    .settings-trigger:focus-visible { outline: 3px solid var(--settings-accent, #f25e9c); outline-offset: 2px; }

    .settings-modal {
      display: none; position: fixed; inset: 0;
      background: rgba(80,28,56,0.42); backdrop-filter: blur(7px);
      z-index: 10000; align-items: center; justify-content: center;
      padding: 1rem; box-sizing: border-box;
    }
    .settings-modal.show { display: flex; }

    .settings-content {
      background: var(--settings-bg, #fffafc);
      border-radius: 28px; width: 100%; max-width: 430px; max-height: 90vh;
      box-shadow: 0 22px 55px rgba(242,94,156,0.32), 0 0 0 6px rgba(255,255,255,0.45);
      overflow: hidden; display: flex; flex-direction: column;
      animation: settingsPop 0.34s cubic-bezier(0.34,1.4,0.64,1);
    }
    @keyframes settingsPop {
      from { opacity: 0; transform: scale(0.9) translateY(16px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .settings-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.25rem 1.5rem;
      background: linear-gradient(135deg, #ff9ec7 0%, var(--settings-accent, #f25e9c) 60%, #c97ce8 100%);
    }
    .settings-header h3 {
      font-family: 'Fredoka', 'Quicksand', sans-serif; color: #fff;
      font-size: 1.3rem; font-weight: 600; margin: 0; letter-spacing: 0.3px;
      text-shadow: 0 2px 5px rgba(150,40,90,0.25);
    }
    .settings-close-btn {
      cursor: pointer; font-size: 1.3rem; color: #fff; line-height: 1;
      width: 32px; height: 32px; border: none; border-radius: 50%;
      background: rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center;
      transition: background 0.16s, transform 0.16s;
    }
    .settings-close-btn:hover { background: rgba(255,255,255,0.5); transform: rotate(90deg); }

    .settings-body {
      padding: 1.5rem; display: flex; flex-direction: column; gap: 1.15rem;
      box-sizing: border-box; overflow-y: auto; min-height: 0;
    }
    .settings-body::-webkit-scrollbar { width: 8px; }
    .settings-body::-webkit-scrollbar-thumb { background: var(--settings-border, #f6cfe2); border-radius: 999px; }

    .settings-field { display: flex; flex-direction: column; gap: 0.4rem; }
    .settings-field label {
      font-family: 'Fredoka', 'Quicksand', sans-serif; font-size: 0.74rem; font-weight: 600;
      color: var(--settings-accent, #f25e9c); text-transform: uppercase;
      letter-spacing: 0.06em; margin: 0;
    }
    .settings-field input, .settings-field select {
      font-family: 'Quicksand', 'DM Sans', sans-serif; font-weight: 500; font-size: 0.92rem;
      padding: 0.75rem 0.95rem; border-radius: 15px;
      border: 2.5px solid var(--settings-border, #f6cfe2);
      background: #fff; color: var(--settings-text, #6b2d4f); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s; width: 100%; box-sizing: border-box;
    }
    .settings-field select {
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23f25e9c' stroke-width='3' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 0.95rem center;
      padding-right: 2.4rem; cursor: pointer;
    }
    .settings-field input:focus, .settings-field select:focus {
      border-color: var(--settings-accent, #f25e9c);
      box-shadow: 0 0 0 4px rgba(255,143,192,0.2);
    }
    .settings-field input::placeholder { color: #d9b3c6; }
    .settings-field select:hover { border-color: var(--settings-accent, #f25e9c); }
    /* Theme the open option list (supported on Chromium/Edge & Firefox) */
    .settings-field select option {
      background: var(--settings-bg, #fffafc);
      color: var(--settings-text, #6b2d4f);
      font-family: 'Quicksand', 'DM Sans', sans-serif; font-weight: 500;
      padding: 0.4rem;
    }
    .settings-field select option:checked,
    .settings-field select option:hover {
      background: var(--settings-sec-bg, #ffeaf4);
      color: var(--settings-accent, #f25e9c);
    }

    /* key row + model row share this inline layout */
    .settings-inline { display: flex; gap: 0.5rem; align-items: stretch; }
    .settings-inline input { flex: 1; }
    .mini-btn {
      flex-shrink: 0; cursor: pointer; border-radius: 13px;
      border: 2.5px solid var(--settings-border, #f6cfe2);
      background: #fff; color: var(--settings-accent, #f25e9c);
      font-family: 'Fredoka','Quicksand',sans-serif; font-weight: 600; font-size: 0.8rem;
      padding: 0 0.85rem; display: flex; align-items: center; gap: 0.3rem; white-space: nowrap;
      transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), background 0.18s, color 0.18s, border-color 0.18s;
    }
    .mini-btn:hover { background: var(--settings-accent, #f25e9c); color: #fff; border-color: var(--settings-accent, #f25e9c); transform: translateY(-1px); }
    .mini-btn:active { transform: scale(0.96); }
    .mini-btn:disabled { opacity: 0.5; cursor: progress; transform: none; }

    .settings-help {
      font-family: 'Quicksand','DM Sans',sans-serif; font-size: 0.78rem; font-weight: 500;
      color: var(--settings-text, #b07f9b); line-height: 1.5; margin-top: 0.05rem;
    }
    .settings-help a { color: var(--settings-accent, #f25e9c); text-decoration: none; font-weight: 700; }
    .settings-help a:hover { text-decoration: underline; }
    .settings-status { font-size: 0.78rem; font-weight: 600; min-height: 1.1em; }
    .settings-status.ok  { color: #2e9c5a; }
    .settings-status.err { color: #d6336c; }
    .settings-status.busy { color: var(--settings-text, #b07f9b); }

    .settings-row {
      display: flex; align-items: center; gap: 0.6rem;
      background: var(--settings-sec-bg, #ffeaf4);
      border: 2px solid var(--settings-border, #f6cfe2);
      border-radius: 15px; padding: 0.8rem 0.95rem;
    }
    .settings-checkbox { width: 19px; height: 19px; cursor: pointer; flex-shrink: 0; accent-color: var(--settings-accent, #f25e9c); }
    .settings-checkbox-label {
      font-family: 'Quicksand','DM Sans',sans-serif; font-size: 0.88rem; font-weight: 600;
      color: var(--settings-text, #6b2d4f); cursor: pointer; user-select: none;
    }

    .save-settings-btn {
      background: linear-gradient(135deg, #ff9ec7 0%, var(--settings-accent, #f25e9c) 60%, #c97ce8 100%);
      color: #fff; border: none; border-radius: 17px; padding: 0.95rem;
      font-family: 'Fredoka','Quicksand',sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer;
      transition: transform 0.15s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.2s;
      margin-top: 0.2rem; width: 100%; box-shadow: 0 7px 20px rgba(242,94,156,0.35);
    }
    .save-settings-btn:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 11px 26px rgba(242,94,156,0.45); }
    .save-settings-btn:active { transform: scale(0.98); }

    .settings-privacy {
      font-family: 'Quicksand','DM Sans',sans-serif; font-size: 0.76rem; line-height: 1.55;
      font-weight: 500; color: var(--settings-text, #6b2d4f);
      background: var(--settings-sec-bg, #ffeaf4);
      border: 2px solid var(--settings-border, #f6cfe2);
      border-radius: 15px; padding: 0.75rem 0.9rem;
    }
    .settings-privacy code {
      font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
      font-size: 0.72rem; background: rgba(0,0,0,0.05); padding: 0.05em 0.35em; border-radius: 6px;
    }

    .ai-toast {
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: #333; color: #fff; padding: 9px 18px; border-radius: 20px;
      font-family: 'Quicksand', sans-serif; font-size: 0.82rem; font-weight: 600;
      z-index: 100000; opacity: 0; transition: opacity 0.3s; box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }

    /* ── History pill (top-right, stacked below the AI Config pill) + panel ── */
    .history-trigger {
      position: fixed; top: 3.5rem; right: 1rem; cursor: pointer;
      font-family: 'Fredoka', 'Quicksand', sans-serif; font-size: 0.82rem; font-weight: 500;
      color: var(--settings-accent, #f25e9c);
      background: rgba(255,255,255,0.92); backdrop-filter: blur(6px);
      padding: 0.5rem 1rem; border-radius: 999px;
      border: 2px solid var(--settings-border, #f6cfe2);
      display: flex; align-items: center; gap: 0.4rem; z-index: 9000;
      box-shadow: 0 4px 14px rgba(242,94,156,0.18);
      transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s, background 0.2s, color 0.2s;
    }
    .history-trigger:hover {
      background: linear-gradient(135deg, #ff9ec7, var(--settings-accent, #f25e9c));
      color: #fff; border-color: #fff; transform: translateY(-2px) scale(1.05);
      box-shadow: 0 7px 20px rgba(242,94,156,0.35);
    }
    .history-trigger:active { transform: scale(0.97); }
    .history-trigger:focus-visible { outline: 3px solid var(--settings-accent, #f25e9c); outline-offset: 2px; }
    .history-badge {
      background: var(--settings-accent, #f25e9c); color: #fff;
      font-size: 0.68rem; font-weight: 700; border-radius: 999px; padding: 0.04rem 0.42rem; line-height: 1.5;
    }

    .hist-filters { display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center; }
    .hist-chip {
      cursor: pointer; font-family: 'Fredoka', sans-serif; font-size: 0.76rem; font-weight: 600;
      padding: 0.34rem 0.8rem; border-radius: 999px; border: 2px solid var(--settings-border, #f6cfe2);
      background: #fff; color: var(--settings-accent, #f25e9c);
      transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), background 0.18s, color 0.18s, border-color 0.18s;
    }
    .hist-chip:hover { transform: translateY(-1px); }
    .hist-chip.active {
      background: linear-gradient(135deg, #ff9ec7, var(--settings-accent, #f25e9c));
      color: #fff; border-color: #fff;
    }

    .hist-empty {
      text-align: center; color: var(--settings-text, #b07f9b);
      font-family: 'Quicksand', sans-serif; font-weight: 600; line-height: 1.6; padding: 1.6rem 0.5rem;
    }
    .hist-item {
      background: var(--settings-bg, #fffafc);
      border: 2px solid var(--settings-border, #f6cfe2);
      border-left-width: 6px; border-radius: 16px; padding: 0.85rem 0.95rem;
    }
    .hist-item[data-tool="charm"] { border-left-color: #f25e9c; }
    .hist-item[data-tool="flirt"] { border-left-color: #a86fe0; }
    .hist-meta {
      display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;
      font-family: 'Fredoka', sans-serif; font-size: 0.78rem; font-weight: 600;
    }
    .hist-tool { display: inline-flex; align-items: center; gap: 0.3rem; }
    .hist-item[data-tool="charm"] .hist-tool { color: #f25e9c; }
    .hist-item[data-tool="flirt"] .hist-tool { color: #a86fe0; }
    .hist-vibe {
      font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em;
      background: var(--settings-sec-bg, #ffeaf4); color: var(--settings-text, #6b2d4f);
      padding: 0.1rem 0.5rem; border-radius: 999px;
    }
    .hist-time { margin-left: auto; color: var(--settings-text, #b07f9b); font-weight: 500; font-size: 0.72rem; }
    .hist-params {
      margin-top: 0.5rem; padding: 0.5rem 0.6rem; border-radius: 11px;
      background: var(--settings-sec-bg, #ffeaf4);
      font-family: 'Quicksand', sans-serif; font-size: 0.76rem; line-height: 1.5; color: var(--settings-text, #6b2d4f);
    }
    .hist-params b { color: var(--settings-accent, #f25e9c); font-weight: 700; }
    .hist-text {
      margin-top: 0.55rem; font-family: 'Quicksand', sans-serif; font-size: 0.9rem;
      font-weight: 500; line-height: 1.6; color: var(--settings-text, #6b2d4f); white-space: pre-wrap;
    }
    .hist-actions { display: flex; gap: 0.4rem; margin-top: 0.6rem; }

    /* History panel is wider than the settings modal so it matches/exceeds the
       page widgets (Charm ~580px, Flirt ~640px). Mobile stays full-width. */
    #aiHistoryModal .settings-content { max-width: 680px; }

    @media (prefers-reduced-motion: reduce) {
      .history-trigger, .hist-chip { transition-duration: 0.01ms; }
    }
    @media (max-width: 600px) {
      .history-trigger { top: 2.7rem; right: 0.6rem; font-size: 0.74rem; padding: 0.4rem 0.75rem; }
      /* On phones the modal already fills the viewport (width:100% minus the
         1rem modal padding) — matching the page widgets' edge padding. */
      #aiHistoryModal.settings-modal { padding: 0.6rem; }
    }

    @media (max-width: 600px) {
      .settings-trigger { top: 0.6rem; right: 0.6rem; font-size: 0.74rem; padding: 0.4rem 0.75rem; }
      .settings-content { border-radius: 24px; }
      .settings-header { padding: 1.1rem 1.2rem; }
      .settings-body { padding: 1.2rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      .settings-content { animation-duration: 0.01ms; }
      .settings-trigger, .save-settings-btn, .settings-close-btn, .mini-btn { transition-duration: 0.01ms; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ──────────────────────────────────────────────────────────────────────
  // 3. Build the DOM (trigger pill + modal)
  // ──────────────────────────────────────────────────────────────────────
  function initDOM() {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'settings-trigger';
    trigger.innerHTML = '⚙️ AI Config';
    trigger.setAttribute('aria-label', 'Open AI provider settings');
    trigger.onclick = toggleSettingsModal;
    document.body.appendChild(trigger);

    const providerOptions = Object.entries(PROVIDERS)
      .map(([k, p]) => `<option value="${k}">${p.label}</option>`)
      .join('');

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'aiSettingsModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'AI Settings');
    modal.innerHTML = `
      <div class="settings-content">
        <div class="settings-header">
          <h3>AI Settings</h3>
          <button type="button" class="settings-close-btn" aria-label="Close" onclick="toggleSettingsModal()">&times;</button>
        </div>
        <div class="settings-body">
          <div class="settings-field">
            <label for="aiProviderSelect">AI Provider</label>
            <select id="aiProviderSelect">${providerOptions}</select>
          </div>

          <div class="settings-field" id="aiKeyField" style="display:none;">
            <label id="aiKeyLabel" for="aiApiKeyInput">API Key</label>
            <div class="settings-inline">
              <input type="password" id="aiApiKeyInput" placeholder="Paste your API key here…"
                     autocomplete="off" spellcheck="false"
                     data-lpignore="true" data-1p-ignore data-form-type="other" name="ai-key-no-store" />
              <button type="button" class="mini-btn" id="aiKeyToggle" aria-label="Show or hide key" onclick="aiToggleKey()">👁</button>
            </div>
            <small id="aiKeyHelp" class="settings-help"></small>
          </div>

          <div class="settings-field">
            <label for="aiModelInput">Model (Optional)</label>
            <div class="settings-inline">
              <input type="text" id="aiModelInput" list="aiModelList" placeholder="Leave blank for default…" autocomplete="off" spellcheck="false" />
              <button type="button" class="mini-btn" id="aiFetchModels" onclick="aiFetchModels()">↻ Models</button>
            </div>
            <datalist id="aiModelList"></datalist>
            <small id="aiModelStatus" class="settings-status"></small>
            <small class="settings-help">Leave blank to use the provider's default. Click <b>↻ Models</b> to pull the live list.</small>
          </div>

          <div class="settings-field settings-row">
            <input type="checkbox" id="aiSearchCheckbox" class="settings-checkbox" />
            <label for="aiSearchCheckbox" class="settings-checkbox-label">Enable Web Search (Puter / Gemini / OpenRouter)</label>
          </div>

          <div class="settings-inline">
            <button type="button" class="mini-btn" id="aiTestBtn" style="flex:1;justify-content:center;padding:0.7rem;" onclick="aiTestConnection()">⚡ Test connection</button>
            <button type="button" class="mini-btn" id="aiClearBtn" style="justify-content:center;padding:0.7rem;" onclick="aiClearSettings()">🗑 Forget key</button>
          </div>
          <small id="aiTestStatus" class="settings-status"></small>

          <div class="settings-privacy">
            🔒 <b>Private by design.</b> Your key is saved <b>only in this browser</b>
            (<code>localStorage</code>) and is sent <b>directly to your chosen provider</b> —
            never to this site or anyone else. Clear it any time with “Forget key”.
          </div>

          <button type="button" class="save-settings-btn" onclick="saveAISettings()">Save Changes</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    loadAISettings();
    $('aiProviderSelect').addEventListener('change', onProviderChange);

    // Auto-persist every change so the provider, key, model and web-search
    // toggle all survive reloads even if the user never clicks "Save".
    $('aiProviderSelect').addEventListener('change', persistForm);
    $('aiApiKeyInput').addEventListener('input', persistForm);
    $('aiModelInput').addEventListener('input', persistForm);
    $('aiModelInput').addEventListener('change', persistForm);
    $('aiSearchCheckbox').addEventListener('change', persistForm);

    modal.addEventListener('click', (e) => { if (e.target === modal) toggleSettingsModal(); });

    // ── History pill + panel (shared store, both pages) ──
    const histTrigger = document.createElement('button');
    histTrigger.type = 'button';
    histTrigger.className = 'history-trigger';
    histTrigger.innerHTML = '🕘 History <span class="history-badge" id="aiHistBadge" style="display:none">0</span>';
    histTrigger.setAttribute('aria-label', 'View your saved generation history');
    histTrigger.onclick = toggleHistoryModal;
    document.body.appendChild(histTrigger);

    const histModal = document.createElement('div');
    histModal.className = 'settings-modal';
    histModal.id = 'aiHistoryModal';
    histModal.setAttribute('role', 'dialog');
    histModal.setAttribute('aria-modal', 'true');
    histModal.setAttribute('aria-label', 'Generation history');
    histModal.innerHTML = `
      <div class="settings-content">
        <div class="settings-header">
          <h3>History</h3>
          <button type="button" class="settings-close-btn" aria-label="Close" onclick="toggleHistoryModal()">&times;</button>
        </div>
        <div class="settings-body" id="aiHistoryBody"></div>
      </div>
    `;
    document.body.appendChild(histModal);
    histModal.addEventListener('click', (e) => { if (e.target === histModal) toggleHistoryModal(); });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (modal.classList.contains('show')) toggleSettingsModal();
      if (histModal.classList.contains('show')) toggleHistoryModal();
    });

    updateHistoryBadge();
  }

  // ── Modal open/close ────────────────────────────────────────────────
  window.toggleSettingsModal = function () {
    const modal = $('aiSettingsModal');
    if (!modal) return;
    modal.classList.toggle('show');
    if (modal.classList.contains('show')) loadAISettings();
  };

  // ── Provider change → swap key field + signup link + suggestions ─────
  function onProviderChange() {
    const provider = $('aiProviderSelect').value;
    const cfg = PROVIDERS[provider] || {};
    const keyField = $('aiKeyField');
    const keyLabel = $('aiKeyLabel');
    const keyHelp = $('aiKeyHelp');
    const modelInput = $('aiModelInput');

    modelInput.placeholder = `Leave blank → ${cfg.defaultModel || 'default'}`;

    if (cfg.keyless) {
      keyField.style.display = 'none';
    } else {
      keyField.style.display = 'flex';
      keyLabel.textContent = cfg.keyLabel || 'API Key';
      keyHelp.innerHTML = `Get a key (${cfg.signupNote || 'free'}) from ` +
        `<a href="${cfg.signupUrl}" target="_blank" rel="noopener">${cfg.signupText}</a>`;
    }

    // Seed the datalist with sensible suggestions immediately.
    setModelOptions(cfg.suggestedModels || (cfg.defaultModel ? [cfg.defaultModel] : []));
    $('aiModelStatus').textContent = '';
    $('aiModelStatus').className = 'settings-status';
  }

  function setModelOptions(models) {
    const dl = $('aiModelList');
    if (!dl) return;
    dl.innerHTML = models.map((m) => `<option value="${m}"></option>`).join('');
  }

  // ── Show/hide the API key ───────────────────────────────────────────
  window.aiToggleKey = function () {
    const input = $('aiApiKeyInput');
    input.type = input.type === 'password' ? 'text' : 'password';
    $('aiKeyToggle').textContent = input.type === 'password' ? '👁' : '🙈';
  };

  // ── Auto-fetch the live model list from the provider ────────────────
  window.aiFetchModels = async function () {
    const provider = $('aiProviderSelect').value;
    const key = $('aiApiKeyInput').value.trim() || ls.get('ai_api_key');
    const cfg = PROVIDERS[provider] || {};
    const status = $('aiModelStatus');
    const btn = $('aiFetchModels');

    if (provider === 'puter') {
      setModelOptions(cfg.suggestedModels || []);
      status.className = 'settings-status ok';
      status.textContent = `✓ ${(cfg.suggestedModels || []).length} popular models suggested`;
      return;
    }
    if (!cfg.keyless && !key) {
      status.className = 'settings-status err';
      status.textContent = 'Enter your API key first.';
      return;
    }

    btn.disabled = true;
    status.className = 'settings-status busy';
    status.textContent = 'Fetching models…';

    try {
      const models = await listModels(provider, key);
      if (!models.length) throw new Error('none returned');
      models.sort();
      setModelOptions(models);
      status.className = 'settings-status ok';
      status.textContent = `✓ ${models.length} models loaded`;
    } catch (e) {
      setModelOptions(cfg.suggestedModels || (cfg.defaultModel ? [cfg.defaultModel] : []));
      status.className = 'settings-status err';
      status.textContent = `Couldn't fetch (${e.message}). Showing defaults.`;
    } finally {
      btn.disabled = false;
    }
  };

  // Provider-specific /models endpoints → array of model id strings
  async function listModels(provider, key) {
    const cfg = PROVIDERS[provider];

    if (provider === 'gemini') {
      const r = await fetchT(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      return (d.models || [])
        .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
        .map((m) => (m.name || '').replace(/^models\//, ''))
        .filter(Boolean);
    }

    if (provider === 'cohere') {
      const r = await fetchT('https://api.cohere.com/v1/models?page_size=100', {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      return (d.models || [])
        .filter((m) => !m.endpoints || m.endpoints.includes('chat'))
        .map((m) => m.name)
        .filter(Boolean);
    }

    // OpenAI-compatible: GET {base}/models  → { data: [{ id }] }
    if (cfg.base) {
      const headers = key ? { Authorization: `Bearer ${key}` } : {};
      const r = await fetchT(`${cfg.base}/models`, { headers });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      return (d.data || []).map((m) => m.id).filter(Boolean);
    }

    throw new Error('unsupported');
  }

  // ── Test connection with a tiny round-trip ──────────────────────────
  window.aiTestConnection = async function () {
    // Persist current form first so callAI reads the right values.
    persistForm();
    const status = $('aiTestStatus');
    const btn = $('aiTestBtn');
    btn.disabled = true;
    status.className = 'settings-status busy';
    status.textContent = 'Testing…';
    try {
      const reply = await callAI('Reply with exactly: OK');
      status.className = 'settings-status ok';
      status.textContent = `✓ Connected — model replied (${(reply || '').trim().slice(0, 24)}…)`;
    } catch (e) {
      status.className = 'settings-status err';
      status.textContent = `✗ ${e.message}`;
    } finally {
      btn.disabled = false;
    }
  };

  // ── Load / persist settings ─────────────────────────────────────────
  function loadAISettings() {
    const providerSelect = $('aiProviderSelect');
    if (providerSelect) providerSelect.value = ls.get('ai_provider', 'puter');
    const k = $('aiApiKeyInput'); if (k) k.value = ls.get('ai_api_key');
    const m = $('aiModelInput'); if (m) m.value = ls.get('ai_model');
    const s = $('aiSearchCheckbox'); if (s) s.checked = ls.get('ai_web_search') === 'true';
    onProviderChange();
  }

  function persistForm() {
    ls.set('ai_provider', $('aiProviderSelect').value);
    ls.set('ai_api_key', $('aiApiKeyInput').value.trim());
    ls.set('ai_model', $('aiModelInput').value.trim());
    ls.set('ai_web_search', $('aiSearchCheckbox').checked);
  }

  window.saveAISettings = function () {
    persistForm();
    toggleSettingsModal();
    showToast('AI Settings saved successfully! ✨');
  };

  // Wipe every stored value from this browser and reset the form.
  window.aiClearSettings = function () {
    ['ai_provider', 'ai_api_key', 'ai_model', 'ai_web_search'].forEach((k) => localStorage.removeItem(k));
    const k = $('aiApiKeyInput'); if (k) k.value = '';
    const m = $('aiModelInput'); if (m) m.value = '';
    const s = $('aiSearchCheckbox'); if (s) s.checked = false;
    const p = $('aiProviderSelect'); if (p) p.value = 'puter';
    onProviderChange();
    const status = $('aiTestStatus');
    if (status) { status.className = 'settings-status ok'; status.textContent = '✓ Key & settings cleared from this browser.'; }
    showToast('Saved key & settings forgotten 🗑');
  };

  function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'ai-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => (el.style.opacity = '1'), 50);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2000);
  }

  // ──────────────────────────────────────────────────────────────────────
  // 3b. Local history — one shared store for both tools, kept only in this
  //     browser (localStorage 'ai_history'). Each entry is tagged by tool and
  //     keeps the parameters that produced it.
  // ──────────────────────────────────────────────────────────────────────
  const HISTORY_KEY = 'ai_history';
  const HISTORY_MAX = 50;
  let historyFilter = 'all';

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  function loadHistory() {
    try { const a = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); return Array.isArray(a) ? a : []; }
    catch { return []; }
  }
  function storeHistory(arr) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, HISTORY_MAX)));
    updateHistoryBadge();
  }
  function relTime(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24); if (d < 7) return d + 'd ago';
    try { return new Date(ts).toLocaleDateString(); } catch { return ''; }
  }
  function updateHistoryBadge() {
    const b = $('aiHistBadge'); if (!b) return;
    const n = loadHistory().length;
    b.textContent = n; b.style.display = n ? 'inline-block' : 'none';
  }
  const TOOL_META = {
    charm: { icon: '✨', name: 'Charm School' },
    flirt: { icon: '💌', name: 'The Flirt Engine' },
  };

  // Pages call this after a successful generation.
  // entry = { tool:'charm'|'flirt', vibe:'…', params:{Label:value,…}, text:'…' }
  window.saveToHistory = function (entry) {
    if (!entry || !entry.text) return;
    const arr = loadHistory();
    arr.unshift({
      id: 'h' + Date.now() + '_' + Math.floor(Math.random() * 1e6),
      ts: Date.now(),
      tool: entry.tool || 'charm',
      vibe: entry.vibe || '',
      params: (entry.params && typeof entry.params === 'object') ? entry.params : {},
      text: String(entry.text),
    });
    storeHistory(arr);
    const m = $('aiHistoryModal');
    if (m && m.classList.contains('show')) renderHistory();
  };

  window.toggleHistoryModal = function () {
    const m = $('aiHistoryModal');
    if (!m) return;
    m.classList.toggle('show');
    if (m.classList.contains('show')) renderHistory();
  };

  function renderHistory() {
    const body = $('aiHistoryBody');
    if (!body) return;
    const all = loadHistory();
    const items = historyFilter === 'all' ? all : all.filter((x) => x.tool === historyFilter);

    const chip = (key, label) =>
      `<button type="button" class="hist-chip ${historyFilter === key ? 'active' : ''}" onclick="aiHistoryFilter('${key}')">${label}</button>`;
    const controls =
      `<div class="settings-inline" style="justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
        <div class="hist-filters">
          ${chip('all', 'All')}${chip('charm', '✨ Charm')}${chip('flirt', '💌 Flirt')}
        </div>
        ${all.length ? '<button type="button" class="mini-btn" onclick="aiClearHistory()">🗑 Clear all</button>' : ''}
      </div>`;

    if (!items.length) {
      body.innerHTML = controls +
        `<div class="hist-empty">No history yet ✨<br>Lines you generate are saved here — on this device only.</div>`;
      return;
    }

    const list = items.map((it) => {
      const meta = TOOL_META[it.tool] || TOOL_META.charm;
      const params = Object.entries(it.params || {})
        .map(([k, v]) => `<div><b>${esc(k)}:</b> ${esc(v)}</div>`).join('');
      return `<div class="hist-item" data-tool="${esc(it.tool)}">
        <div class="hist-meta">
          <span class="hist-tool">${meta.icon} ${meta.name}</span>
          ${it.vibe ? `<span class="hist-vibe">${esc(it.vibe)}</span>` : ''}
          <span class="hist-time">${relTime(it.ts)}</span>
        </div>
        ${params ? `<div class="hist-params">${params}</div>` : ''}
        <div class="hist-text">${esc(it.text)}</div>
        <div class="hist-actions">
          <button type="button" class="mini-btn" onclick="aiCopyHistory('${it.id}', this)">📋 Copy</button>
          <button type="button" class="mini-btn" onclick="aiDeleteHistory('${it.id}')">✕ Delete</button>
        </div>
      </div>`;
    }).join('');

    body.innerHTML = controls + list;
  }

  window.aiHistoryFilter = function (key) { historyFilter = key; renderHistory(); };

  window.aiCopyHistory = function (id, btn) {
    const it = loadHistory().find((x) => x.id === id);
    if (!it) return;
    navigator.clipboard.writeText(it.text).then(() => {
      if (btn) { const t = btn.innerHTML; btn.innerHTML = '✓ Copied'; setTimeout(() => (btn.innerHTML = t), 1400); }
    });
  };

  window.aiDeleteHistory = function (id) {
    storeHistory(loadHistory().filter((x) => x.id !== id));
    renderHistory();
  };

  window.aiClearHistory = function () {
    localStorage.removeItem(HISTORY_KEY);
    updateHistoryBadge();
    renderHistory();
    showToast('History cleared 🗑');
  };

  // ──────────────────────────────────────────────────────────────────────
  // 4. The one function the pages call
  // ──────────────────────────────────────────────────────────────────────
  window.callAI = async function (prompt, systemInstruction = '') {
    const provider = ls.get('ai_provider', 'puter');
    const apiKey = ls.get('ai_api_key');
    const customModel = ls.get('ai_model');
    const searchEnabled = ls.get('ai_web_search') === 'true';
    const cfg = PROVIDERS[provider] || PROVIDERS.puter;
    const model = customModel || cfg.defaultModel;

    // ── Puter.js (keyless) ──
    if (provider === 'puter') {
      if (location.protocol === 'file:')
        throw new Error('The free Puter.js engine needs a web server (it can\'t run from a file:// path). Run a local server (e.g. "python -m http.server"), or open ⚙️ AI Config and pick a key-based provider like Groq or Gemini.');
      if (typeof puter === 'undefined')
        throw new Error('Puter.js is still loading — please try again in a moment!');
      const messages = [];
      if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
      messages.push({ role: 'user', content: prompt });
      const options = { model };
      if (searchEnabled) options.tools = [{ type: 'web_search' }];
      const response = await puter.ai.chat(messages, options);
      if (typeof response === 'string') return response;
      if (response?.message?.content) {
        const c = response.message.content;
        return typeof c === 'string' ? c : (Array.isArray(c) ? c.map((p) => p.text || '').join('') : String(c));
      }
      return String(response);
    }

    // ── Google Gemini ──
    if (provider === 'gemini') {
      if (!apiKey) throw new Error('Please configure your Gemini API Key (⚙️ AI Config).');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const body = {
        contents: [{ role: 'user', parts: [{ text: (systemInstruction ? systemInstruction + '\n\n' : '') + prompt }] }],
        generationConfig: { temperature: 0.7 },
      };
      if (searchEnabled) body.tools = [{ googleSearch: {} }];
      const r = await fetchT(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e?.error?.message || `Gemini API error: ${r.statusText}`);
      }
      const d = await r.json();
      const text = d?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('');
      if (!text) throw new Error('Received empty response from Gemini.');
      return text;
    }

    // ── Cohere v2 ──
    if (provider === 'cohere') {
      if (!apiKey) throw new Error('Please configure your Cohere API Key (⚙️ AI Config).');
      const r = await fetchT('https://api.cohere.com/v2/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
        }),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e?.message || `Cohere API error: ${r.statusText}`);
      }
      const d = await r.json();
      return (d?.message?.content || []).map((p) => p.text || '').join('');
    }

    // ── OpenAI-compatible (OpenAI, Groq, Mistral, Cerebras, OpenRouter) ──
    if (OPENAI_COMPATIBLE.includes(provider)) {
      if (!apiKey) throw new Error(`Please configure your ${cfg.label.split(' (')[0]} API Key (⚙️ AI Config).`);
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };
      const body = {
        model,
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      };
      if (provider === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = document.title || 'Charm School';
        if (searchEnabled) body.plugins = [{ id: 'web-search' }];
      }
      const r = await fetchT(`${cfg.base}/chat/completions`, {
        method: 'POST', headers, body: JSON.stringify(body),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e?.error?.message || `${cfg.label.split(' (')[0]} API error: ${r.statusText}`);
      }
      const d = await r.json();
      const text = d?.choices?.[0]?.message?.content;
      if (text == null) throw new Error('Received empty response.');
      return text;
    }

    throw new Error('Unsupported AI provider selected.');
  };

  // Expose the registry so pages can read provider metadata if they want.
  window.AI_PROVIDERS = PROVIDERS;

  // ──────────────────────────────────────────────────────────────────────
  // 5. Go
  // ──────────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOM);
  } else {
    initDOM();
  }
})();
