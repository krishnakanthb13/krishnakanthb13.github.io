# L Folder: Charm School & Flirt Engine ✨

A client-side suite of AI-powered conversational assistants designed to help users practice social charm, flirting, and conversational confidence.

---

## 📌 Clickable Index

- [1. Directory Overview](#1-directory-overview)
- [2. Core Applications](#2-core-applications)
  - [Charm School (`charm-practice.html`)](#charm-school-charm-practicehtml)
  - [The Flirt Engine (`flirt_engine.html`)](#the-flirt-engine-flirt_enginehtml)
- [3. AI Integration Architecture (`ai-helper.js`)](#3-ai-integration-architecture-ai-helperjs)
  - [Dynamic Injections](#dynamic-injections)
  - [LocalStorage Persistence](#localstorage-persistence)
- [4. AI Providers & Configuration](#4-ai-providers--configuration)
  - [Puter.js (Free & Keyless)](#puterjs-free--keyless)
  - [Google Gemini (BYOK)](#google-gemini-byok)
  - [OpenAI (BYOK)](#openai-byok)
  - [OpenRouter (BYOK)](#openrouter-byok)
- [5. Web Search Grounding](#5-web-search-grounding)
- [6. Custom Theme Styles (CSS Variables)](#6-custom-theme-styles-css-variables)
- [7. Local Development & Deployment](#7-local-development--deployment)

---

## 1. Directory Overview

This folder contains the source files for interactive coaching tools designed to run completely on the client-side (directly in the browser).

```
L/
├── charm-practice.html    # Charm School practice page
├── flirt_engine.html      # The Flirt Engine detail builder
├── ai-helper.js          # Shared client-side AI helper & settings panel
└── README.md              # This documentation file
```

---

## 2. Core Applications

### Charm School (`charm-practice.html`)
* **Vibe Selection:** Pick between 6 different conversational vibes: `Funny` 😄, `Flirty` 😏, `Cheesy` 🧀, `Caring` 🤍, `Loving` 💕, and `Witty` 🧠.
* **Scenarios:** Practice with randomly generated scenarios (e.g., meeting someone reading a book at a coffee shop, being stuck in a slow line) or enter custom moments.
* **Coaching Output:** Generates 2–3 response suggestions and a practical delivery tip (`💡 Why it works`).

### The Flirt Engine (`flirt_engine.html`)
* **Setting Context:** Input fields for location, context, and how you met.
* **Target Character Profile:** Form fields to define the target's vibe, interests, and details noticed.
* **Sender Profile:** Optional input for your own personality style (shy, goofy, sarcastic) and shared moments.
* **Structured Response:** Generates exactly 3 tailored lines categorized by tone (Charming, Funny, Heartfelt) with quick copy-to-clipboard buttons and delivery tips.

---

## 3. AI Integration Architecture (`ai-helper.js`)

To ensure that the applications are serverless, private, and customizable, all AI calls go through a centralized script `ai-helper.js`. 

### Dynamic Injections
When a page loads `ai-helper.js`, the script:
1. Checks for the presence of the **Puter.js** library CDN and loads it dynamically.
2. Injects custom styling rules matching the host page's visual color tokens.
3. Injects a floating **⚙️ AI Config** button in the top-right corner.
4. Appends a hidden settings overlay modal to the DOM.

### LocalStorage Persistence
Configuration details entered by the user are stored locally in their browser:
* `ai_provider`: Selected engine (e.g., `puter`, `gemini`, `openai`, `openrouter`).
* `ai_api_key`: Stored API key for the chosen provider (stored securely client-side).
* `ai_model`: Override option for custom LLM models.
* `ai_web_search`: Boolean toggle to enable/disable internet searching.

---

## 4. AI Providers & Configuration

Click the **⚙️ AI Config** button to swap between the following providers:

| Provider | Key Required | Cost | Best For | Default Model |
| :--- | :--- | :--- | :--- | :--- |
| **Puter.js** | ❌ No | Free | Zero setup, instant play | `gpt-4o-mini` |
| **Google Gemini** | ⚿ Yes | Free Tier | Speed & search grounding | `gemini-1.5-flash` |
| **OpenAI** | ⚿ Yes | Paid (per token) | High quality | `gpt-4o-mini` |
| **OpenRouter** | ⚿ Yes | Free & Paid models | Open-source variety | `google/gemma-2-9b-it:free` |

### Puter.js (Free & Keyless)
* **How it works:** Puter.js routes requests securely through its bridge. No registration is required for moderate use.
* **Limits:** Temporary usage limits apply to avoid abuse. If limits are reached, users are prompted with a quick, free login modal.

### Google Gemini (BYOK)
1. Navigate to [Google AI Studio](https://aistudio.google.com/).
2. Click **Create API Key** (Gemini offers a generous free tier for developers).
3. Paste the key into the **⚙️ AI Config** API key field.

### OpenAI (BYOK)
1. Go to the [OpenAI Platform](https://platform.openai.com/api-keys).
2. Generate a key (requires credits loaded into your OpenAI balance).
3. Paste the key into the **⚙️ AI Config** API key field.

### OpenRouter (BYOK)
1. Sign up on [OpenRouter](https://openrouter.ai/keys).
2. Create an API key. OpenRouter supports several zero-cost models (ending in `:free`).
3. Paste the key and set the Model name to a free variant (e.g. `google/gemma-2-9b-it:free`).

---

## 5. Web Search Grounding

Web search grounding can be toggled on inside the **⚙️ AI Config** modal:
* **Puter.js:** Appends `{ tools: [{ type: 'web_search' }] }` to fetch current information.
* **Gemini:** Injects official Google Search retrieval tools (`{ tools: [{ googleSearchRetrieval: {} }] }`).
* **OpenRouter:** Activates the OpenRouter search plugin wrapper.

---

## 6. Custom Theme Styles (CSS Variables)

The configuration modal automatically adjusts its borders, accents, text color, and background to match the style guides of the containing page. To customize the settings panel look on a new HTML page, specify these variables inside your `:root` stylesheet:

```css
:root {
  --settings-accent: #D4537E;  /* primary buttons / focus borders */
  --settings-bg: white;        /* modal wrapper background */
  --settings-text: #1a1a1a;    /* primary labels & header text */
  --settings-sec-bg: #FDF6F0;  /* table headers / trigger button background */
  --settings-border: #e8d5cc;  /* input borders */
}
```

---

## 7. Local Development & Deployment

### Run Locally
Since the pages fetch resources from CDN and query public API endpoints, you can run them directly by opening the `.html` files, or serving them through a local HTTP server:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```
Navigate to `http://localhost:8000/L/charm-practice.html` or `http://localhost:8000/L/flirt_engine.html`.

### GitHub Pages Deployment
This repository is configured to deploy static pages automatically. Because all keys are entered directly by visitors and stored in their own local storage, you can safely host these files on GitHub Pages without risking credit leaks or billing vulnerabilities.
