# L Folder: Charm School & Flirt Engine ✨

A client-side suite of AI-powered conversational assistants designed to help users
practice social charm, flirting, and conversational confidence — wrapped in a soft,
bubbly, lovingly-designed interface. Everything runs **entirely in the browser**: no
backend, no build step, no server-side keys.

---

## 📌 Clickable Index

- [1. Directory Overview](#1-directory-overview)
- [2. Core Applications](#2-core-applications)
  - [Charm School (`charm-practice.html`)](#charm-school-charm-practicehtml)
  - [The Flirt Engine (`flirt_engine.html`)](#the-flirt-engine-flirt_enginehtml)
- [3. Design System & Look-and-Feel](#3-design-system--look-and-feel)
  - [Palette](#palette)
  - [Typography](#typography)
  - [Motion & Animation](#motion--animation)
  - [Favicons & Metadata](#favicons--metadata)
  - [Icons](#icons)
- [4. AI Integration Architecture (`ai-helper.js`)](#4-ai-integration-architecture-ai-helperjs)
  - [Dynamic Injections](#dynamic-injections)
  - [The `callAI()` Function](#the-callai-function)
  - [LocalStorage Persistence](#localstorage-persistence)
- [5. The AI Config Panel](#5-the-ai-config-panel)
- [6. AI Providers & Configuration](#6-ai-providers--configuration)
  - [Puter.js (Free & Keyless)](#puterjs-free--keyless)
  - [Groq (BYOK — Free, No Card)](#groq-byok--free-no-card)
  - [Google Gemini (BYOK)](#google-gemini-byok)
  - [Mistral AI (BYOK — Free Tier)](#mistral-ai-byok--free-tier)
  - [Cohere (BYOK — Free Trial)](#cohere-byok--free-trial)
  - [OpenRouter (BYOK)](#openrouter-byok)
  - [OpenAI (BYOK)](#openai-byok)
- [7. Web Search Grounding](#7-web-search-grounding)
- [8. Custom Theme Styles (CSS Variables)](#8-custom-theme-styles-css-variables)
- [9. Local Development & Deployment](#9-local-development--deployment)
- [10. Privacy & Security](#10-privacy--security)
- [11. Version History](#11-version-history)

---

## 1. Directory Overview

This folder contains the source files for interactive coaching tools designed to run
completely on the client-side (directly in the browser).

```
L/
├── charm-practice.html    # Charm School practice page
├── flirt_engine.html      # The Flirt Engine detail builder
├── ai-helper.js           # Shared client-side AI helper, provider router & settings panel
└── README.md              # This documentation file
```

There are **no dependencies to install** — fonts, the Tabler icon webfont, and the
Puter.js library all load from public CDNs at runtime.

---

## 2. Core Applications

### Charm School (`charm-practice.html`)
A quick, playful practice tool for everyday social moments.

* **Vibe Selection:** Pick between 6 conversational vibes — `Funny` 😄, `Flirty` 😏,
  `Cheesy` 🧀, `Caring` 🤍, `Loving` 💕, and `Witty` 🧠. Each is a bubbly colour-coded pill.
* **Scenarios:** Practice with randomly generated scenarios (e.g. meeting someone reading
  a book at a coffee shop, being stuck in a slow line) via the `🎲 New scenario` button,
  or type your own custom moment.
* **Coaching Output:** Generates 2–3 numbered response suggestions plus a practical
  delivery tip (`💡 Why it works`).
* **Result Actions:** `Copy all`, `Regenerate`, and `New input` buttons (with Tabler
  icons). Press **Enter** in the textarea to generate.

### The Flirt Engine (`flirt_engine.html`)
A more detailed line-builder that tailors output to a specific situation and person.

* **The Setting:** Input fields for location/context and how you met.
* **About Them:** Define their vibe/personality, interests/hobby, and a detail you noticed.
* **About You (optional):** Your own personality/style and any shared moment.
* **Tone Picker:** Choose a flavour — 🌹 Charming, 😂 Funny, 🧠 Witty, 💛 Heartfelt,
  🤓 Nerdy, or 🔥 Bold.
* **Structured Response:** Returns exactly 3 tailored lines categorised by tone
  (Charming / Funny / Heartfelt) as JSON, each with a one-click copy button and a
  delivery tip. Result cards animate in with a staggered pop. Press **⌘+Enter** to generate.

---

## 3. Design System & Look-and-Feel

Both pages share a single soft, bubbly, "girly" aesthetic — rounded, pastel, and gently
animated.

### Palette
A warm pink / lavender / peach scheme over a multi-layer radial-gradient background.

| Token | Value | Role |
| :--- | :--- | :--- |
| `--pink` | `#ff8fc0` | Bubblegum highlight |
| `--pink-deep` | `#f25e9c` | Primary accent / buttons |
| `--lavender` | `#c9a7f5` | Secondary gradient stop |
| `--peach` | `#ffd9c9` | Warm gradient stop |
| `--cream` | `#fff5fa` | Base background |
| `--deep` | `#6b2d4f` | Plum body text |
| `--muted` | `#b07f9b` | Secondary text |

Cards use frosted-glass translucency (`backdrop-filter: blur`), generous 22–28px corner
radii, and soft pink-tinted shadows. Buttons and pills use glossy pink→purple→peach
gradients.

### Typography
- **Fredoka** — rounded, bubbly display font for headings, labels, and buttons.
- **Quicksand** — soft, friendly font for body text and inputs.

Both load from Google Fonts. Page titles use an animated gradient **text fill** with a
slow shimmer.

### Motion & Animation
- **Entrance:** Header and cards fade/pop in with a staggered `enterPop` animation.
- **Idle:** Primary buttons have a gentle `heartbeat` pulse (pauses on hover); titles
  shimmer; floating background emoji & blurred "blobs" drift.
- **Interaction:** Pills, buttons, and cards use springy `cubic-bezier` overshoot on
  hover; Flirt Engine result cards stagger as they appear.
- **Accessibility:** All motion is disabled for users with `prefers-reduced-motion: reduce`.

### Favicons & Metadata
Each page ships an inline emoji-SVG favicon (no external file needed) plus an
`apple-touch-icon`, a `theme-color` meta tag (`#f25e9c`), and a `meta description`:

- **Charm School** → ✨
- **The Flirt Engine** → 💌

### Icons
Both pages load the **Tabler Icons** webfont from jsDelivr. It powers the copy buttons,
the result-action buttons (`Copy / Regenerate / New input`), and footer heart icons.
Decorative emoji are used throughout for the playful, bubbly character.

---

## 4. AI Integration Architecture (`ai-helper.js`)

To keep the applications serverless, private, and customizable, **all AI calls go
through a single shared script — `ai-helper.js`**. Each page only needs:

```html
<script src="ai-helper.js"></script>
```

### Dynamic Injections
When a page loads `ai-helper.js`, the script automatically:
1. Loads the **Puter.js** library from its CDN (if not already present).
2. Injects CSS for the settings panel, themed via the host page's `--settings-*` tokens.
3. Injects a fixed-position **⚙️ AI Config** trigger pill (top-right, stays visible while scrolling).
4. Appends a hidden **AI Settings** modal to the DOM.

### The `callAI()` Function
The script exposes one global function the pages call:

```js
const text = await callAI(prompt, systemInstruction /* optional */);
```

It reads the user's saved provider/key/model from `localStorage`, dispatches the request
to the correct provider API, normalises the many response shapes, and returns a plain
string. OpenAI, Groq, and Mistral share one OpenAI-compatible request path; Gemini,
Cohere, OpenRouter, and Puter.js each have their own adapter. Errors throw with a
human-readable message.

### LocalStorage Persistence
Configuration is stored locally in the visitor's own browser — never transmitted anywhere
except directly to the chosen provider:

| Key | Purpose |
| :--- | :--- |
| `ai_provider` | Selected engine (`puter`, `groq`, `gemini`, `mistral`, `cohere`, `openrouter`, `openai`) |
| `ai_api_key` | API key for the chosen provider (not needed for Puter.js) |
| `ai_model` | Optional model override; blank = provider default |
| `ai_web_search` | Boolean toggle for internet search grounding |

---

## 5. The AI Config Panel

Clicking the **⚙️ AI Config** pill opens the settings modal, styled to match the bubbly
theme:

- Rounded **28px** card with a pink→purple gradient header and white title.
- A **provider dropdown**, a conditional **API key** field (hidden for Puter.js, shown
  with a provider-specific signup link for everyone else), an optional **model** override,
  and a **web search** toggle.
- The body **scrolls** (`max-height: 90vh`) so the panel never overflows on small screens.
- Springy pop-in animation; a confirmation toast appears after saving.
- Fully responsive, and respects `prefers-reduced-motion`.

Settings persist across visits via `localStorage` (see above).

---

## 6. AI Providers & Configuration

Click the **⚙️ AI Config** button to swap between the following providers:

| Provider | Key Required | Cost | Best For | Default Model |
| :--- | :--- | :--- | :--- | :--- |
| **Puter.js** | ❌ No | Free | Zero setup, instant play | `gpt-4o-mini` |
| **Groq** | 🔑 Yes | Free (no card) | Blazing-fast Llama models | `llama-3.3-70b-versatile` |
| **Google Gemini** | 🔑 Yes | Free tier | Speed & search grounding | `gemini-1.5-flash` |
| **Mistral AI** | 🔑 Yes | Free tier | European open models | `mistral-small-latest` |
| **Cohere** | 🔑 Yes | Free trial | Command R+ chat models | `command-r-plus` |
| **OpenRouter** | 🔑 Yes | Free & paid models | Open-source variety | `google/gemma-2-9b-it:free` |
| **OpenAI** | 🔑 Yes | Paid (per token) | High quality | `gpt-4o-mini` |

> **No login at all:** only **Puter.js** works with zero account and zero key — it is the
> default provider, so the apps work the moment the page loads.
>
> **Free, no credit card (but a free signup is needed for a key):** Groq, Google Gemini,
> and Mistral. Cohere offers a free rate-limited trial key. OpenRouter has several
> zero-cost models (names ending in `:free`). OpenAI is paid.

### Puter.js (Free & Keyless)
* **How it works:** Puter.js routes requests securely through its own bridge. No
  registration or API key is required for moderate use.
* **Limits:** Temporary usage limits apply to prevent abuse. If a limit is reached, the
  user is shown a quick, free Puter login prompt (this popup is Puter's own — not a bug).

### Groq (BYOK — Free, No Card)
1. Sign up at the [Groq Console](https://console.groq.com/keys).
2. Click **Create API Key** — no credit card required.
3. Paste the key into the **⚙️ AI Config** API key field. Groq runs Llama, Mixtral, and
   Gemma models at exceptional speed.

### Google Gemini (BYOK)
1. Navigate to [Google AI Studio](https://aistudio.google.com/).
2. Click **Create API Key** (Gemini offers a generous free tier for developers).
3. Paste the key into the **⚙️ AI Config** API key field.

### Mistral AI (BYOK — Free Tier)
1. Go to the [Mistral Console](https://console.mistral.ai/api-keys).
2. Generate an API key (free experimentation tier available).
3. Paste the key into the **⚙️ AI Config** API key field.

### Cohere (BYOK — Free Trial)
1. Sign up at the [Cohere Dashboard](https://dashboard.cohere.com/api-keys).
2. Create a **Trial** key (rate-limited but free for prototyping).
3. Paste the key into the **⚙️ AI Config** API key field. Uses Cohere's v2 Chat API.

### OpenRouter (BYOK)
1. Sign up on [OpenRouter](https://openrouter.ai/keys).
2. Create an API key. OpenRouter supports several zero-cost models (ending in `:free`).
3. Paste the key and set the Model field to a free variant (e.g. `google/gemma-2-9b-it:free`).

### OpenAI (BYOK)
1. Go to the [OpenAI Platform](https://platform.openai.com/api-keys).
2. Generate a key (requires credits loaded into your OpenAI balance).
3. Paste the key into the **⚙️ AI Config** API key field.

---

## 7. Web Search Grounding

Web search grounding can be toggled on inside the **⚙️ AI Config** modal. It is supported
by a subset of providers:

* **Puter.js:** Appends `{ tools: [{ type: 'web_search' }] }` to fetch current information.
* **Gemini:** Injects official Google Search retrieval tools (`{ tools: [{ googleSearchRetrieval: {} }] }`).
* **OpenRouter:** Activates the OpenRouter search plugin wrapper.

> Groq, Mistral, Cohere, and OpenAI do **not** support web search through this helper —
> the toggle simply has no effect when one of those providers is selected.

---

## 8. Custom Theme Styles (CSS Variables)

The settings panel automatically adjusts its accent, background, text colour, and borders
to match the host page. To restyle the panel on a new HTML page, define these variables
in your `:root` stylesheet:

```css
:root {
  --settings-accent: #f25e9c;   /* gradient buttons / focus rings / labels */
  --settings-bg:      #fffafc;  /* modal card background */
  --settings-text:    #6b2d4f;  /* labels & input text */
  --settings-sec-bg:  #ffeaf4;  /* checkbox-row background */
  --settings-border:  #f6cfe2;  /* input & trigger borders */
}
```

If a variable is omitted, the script falls back to its built-in bubbly pink defaults.

---

## 9. Local Development & Deployment

### Run Locally
The pages fetch fonts, icons, and the Puter.js library from CDNs and call public API
endpoints, so they work straight from a static server. Serving over HTTP is recommended
(some browser APIs behave better than from `file://`):

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

Then open `http://localhost:8000/L/charm-practice.html` or
`http://localhost:8000/L/flirt_engine.html`.

### GitHub Pages Deployment
This repository deploys static pages automatically. Because every API key is entered by
the visitor and stored only in **their own** browser's `localStorage`, these files can be
hosted publicly on GitHub Pages with no risk of leaking credentials or incurring billing.

---

## 10. Privacy & Security

- **No backend.** There is no server component — nothing is logged or stored remotely.
- **Keys stay local.** API keys live only in the visitor's `localStorage` and are sent
  directly from their browser to the provider they chose. They never touch this repo or
  any third party.
- **Default is keyless.** Out of the box the apps use Puter.js, so a visitor can use them
  without ever creating an account or pasting a key.
- **HTML escaping.** The Flirt Engine escapes AI-returned text before rendering it, to
  avoid markup-injection glitches.

---

## 11. Version History

| Version | Highlights |
| :--- | :--- |
| `v0.0.10` | Initial Flirt Engine & Charm School tools |
| `v0.0.11` | Shared `ai-helper.js` with multi-provider `callAI()` and config panel |
| `v0.0.12` | Bubbly girly redesign; added Groq, Mistral & Cohere providers |
| `v0.0.13` | Favicons, Tabler icons, and entrance/idle animations |
| `v0.0.14` | Redesigned the AI Config popup to match the bubbly theme |

---

*Made with 💕 — charm is kindness with confidence.*
