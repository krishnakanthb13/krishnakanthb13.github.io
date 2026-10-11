# OpenCode Go — Models & Usage Dashboard

Compact single-page dashboard pulling live data from the OpenCode API. Models list, pricing, usage limits, Go/Go Plus plans, and charts — all in one file.

**Source:** [opencode.ai/docs/go](https://opencode.ai/docs/go/)

## Features

- **Full Live Sync** — on load and refresh, fetches everything from source: model list (API), pricing (Go + Go Plus tables), estimates (both plans), endpoints/SDK mapping, token patterns, usage limits, plan prices, info cards
- **Two Plans** — Go ($10/month) and Go Plus ($40/month). Chart toggle switches estimated requests between plans; pricing table shows both monthly limits per model
- **Data Source Badges** — green "Live" badge when docs sync succeeds, orange "Hardcoded" when using fallback data. Shown on chart and pricing table section headers
- **Token Patterns** — shows input/cached/output tokens per request for each model, parsed from source with prefix expansion for shorthand names
- **Dark / Light Mode** — toggle in status bar. Respects system preference on first load. Persisted to localStorage. Charts update colors dynamically
- **Usage Limits** — per-model monthly dollar limits; 5-hour = 20%, weekly = 50%, monthly = 100% of each model's limit
- **Grouped Bar Chart** — single horizontal chart showing all three time windows (5h/weekly/monthly) side by side with legend. Go/Go Plus plan toggle. Smooth animations, themed tooltips (Chart.js)
- **Full Pricing Table** — input/output/cached read/cached write token prices, Go + Go Plus monthly allocation, request estimates. All 10 columns sortable (asc → desc → reset). Tiered pricing and free models marked with badges. Formatted with exact precision (`formatPrice`)
- **Info Cards** — "Usage Beyond Limits" (Zen balance fallback) and "Why Some Models Have Lower Usage" (bulk discount explanation) with rich HTML formatting
- **Responsive** — large (>1200px), medium (768–1199px), small (<768px) breakpoints
- **OpenCode Theme** — IBM Plex Sans/Mono fonts, `#0c0c0e` dark / `#f5f5f7` light, `#007aff` accent blue

## Security & Reliability

- **XSS Prevention** — external content from docs page sanitized via `sanitizeHTML()` (strips `<script>`, `<iframe>`, inline `on*` handlers while preserving structural formatting tags)
- **Race Condition Protection** — debounced refresh with request ID tracking prevents concurrent fetches and stale data overwrites
- **Browser Compatibility** — `AbortController` with timeout (no `AbortSignal.timeout()` dependency). Works in Chrome 66+, Firefox 57+, Safari 12.1+
- **Safe Number Parsing** — `safeParseInt()` / `safeParseFloat()` strip currency symbols (`$`) and non-numeric characters gracefully
- **Resilient Matching** — `normalizeName()` strips non-alphanumeric characters to bridge spacing/hyphen differences (`MiMo V2.5` ↔ `MiMo-V2.5`)
- **Tier Filtering** — skips secondary tier rows (`> 256K tokens`, `Peak` rows) so base/Off-Peak rates are kept
- **Free / Unlimited Handling** — `Free` token prices and `Unlimited` limits/estimates parsed and displayed as strings, excluded from numeric chart data
- **Chart.js Guard** — checks `typeof Chart` before instantiation to handle CDN failures
- **Cache Versioning** — localStorage entries include version for future invalidation

## Performance

- **DOM Caching** — `getElementById` results cached to avoid repeated queries
- **DocumentFragment** — batch DOM insertions reduce reflow in model/pricing tables
- **Index Map Sorting** — O(1) lookup instead of O(n) `indexOf()` for model index column
- **DNS Prefetch** — third-party CORS proxy domains prefetched (not preconnected)

## Accessibility

- `aria-sort` on sortable table headers (updates to ascending/descending on toggle)
- `tabindex="0"` + keyboard navigation (Enter/Space to sort) on all sortable headers
- `role="img"` + `aria-label` on SVG logo and canvas chart
- Canvas fallback content for screen readers
- Focus-visible ring on keyboard-focused elements

## Available Models (in docs pricing)

| Model | Provider | ID | Endpoint |
|-------|----------|-----|----------|
| Grok 4.7 | xAI | `grok-4.7` | OpenAI SDK |
| Grok 4.6 | xAI | `grok-4.6` | OpenAI SDK |
| GLM-5.3-Flash | Zhipu | `glm-5.3-flash` | OpenAI-compatible |
| GLM-5.3 | Zhipu | `glm-5.3` | OpenAI-compatible |
| GLM-5.2 | Zhipu | `glm-5.2` | OpenAI-compatible |
| GPT 6 Luna | OpenAI | `gpt-6-luna` | OpenAI SDK |
| GPT 5.6 Luna | OpenAI | `gpt-5.6-luna` | OpenAI SDK |
| Claude Haiku 5.5 | Anthropic | `claude-haiku-5-5` | Anthropic SDK |
| Kimi K3 | Moonshot | `kimi-k3` | OpenAI-compatible |
| Kimi K2.7 Code | Moonshot | `kimi-k2.7-code` | OpenAI-compatible |
| Kimi K2.6 | Moonshot | `kimi-k2.6` | OpenAI-compatible |
| LongCat-2.0 | Meituan | `longcat-2.0` | OpenAI-compatible |
| LongCat 2.5 Preview Free | Meituan | `longcat-2.5-preview-free` | OpenAI-compatible |
| Step 5 Preview Free | StepFun | `step-5-preview-free` | OpenAI-compatible |
| MiMo-V2.6-Flash | Xiaomi | `mimo-v2.6-flash` | OpenAI-compatible |
| MiMo-V2.6-Pro | Xiaomi | `mimo-v2.6-pro` | OpenAI-compatible |
| MiMo-V2.5 | Xiaomi | `mimo-v2.5` | OpenAI-compatible |
| MiMo-V2.5-Pro | Xiaomi | `mimo-v2.5-pro` | OpenAI-compatible |
| MiniMax M3 | MiniMax | `minimax-m3` | Anthropic SDK |
| MiniMax M2.7 | MiniMax | `minimax-m2.7` | Anthropic SDK |
| Muse Spark 1.3 Contributor | Meta | `muse-spark-1.3-contributor` | OpenAI SDK |
| Muse Spark 1.2 Contributor | Meta | `muse-spark-1.2-contributor` | OpenAI SDK |
| Qwen3.8 Max | Alibaba | `qwen3.8-max` | Anthropic SDK |
| Qwen3.8 Flash | Alibaba | `qwen3.8-flash` | Anthropic SDK |
| Qwen3.7 Plus | Alibaba | `qwen3.7-plus` | Anthropic SDK |
| DeepSeek V4.1 Flash | DeepSeek | `deepseek-v4.1-flash` | OpenAI-compatible |
| DeepSeek V4 Pro | DeepSeek | `deepseek-v4-pro` | OpenAI-compatible |
| DeepSeek V4 Flash | DeepSeek | `deepseek-v4-flash` | OpenAI-compatible |
| DeepSeek V4 Flash Vision Exp | DeepSeek | `deepseek-v4-flash-vision-exp` | OpenAI-compatible |
| Hy4 preview | HY | `hy4-preview` | OpenAI-compatible |
| Hy3 | HY | `hy3` | OpenAI-compatible |
| Space Bunny | Space Bunny | `space-bunny` | OpenAI-compatible |

## API-Only Models (served by API, not in docs pricing)

| Model | ID |
|-------|-----|
| MiniMax M2.5 | `minimax-m2.5` |
| Kimi K2.5 | `kimi-k2.5` |
| GLM-5.1 | `glm-5.1` |
| GLM-5 | `glm-5` |
| DeepSeek Flash | `deepseek-flash` |
| Qwen3.7 Max | `qwen3.7-max` |
| Qwen3.6 Plus | `qwen3.6-plus` |
| Qwen3.5 Plus | `qwen3.5-plus` |
| MiMo-V2-Pro | `mimo-v2-pro` |
| MiMo-V2-Omni | `mimo-v2-omni` |
| HY3 Preview | `hy3-preview` |
| Grok 4.5 | `grok-4.5` |
| Omen Alpha | `omen-alpha` |

## Pricing (per 1M tokens)

| Model | Input | Output | Cached Read | Cached Write | Monthly (Go) | Plus Monthly |
|-------|-------|--------|-------------|--------------|--------------|--------------|
| Grok 4.7 | $2.00 | $6.00 | $0.50 | — | $15 | $60 |
| Grok 4.6 | $2.00 | $6.00 | $0.50 | — | $15 | $60 |
| GLM-5.3-Flash | $0.15 | $0.50 | $0.03 | — | $60 | $180 |
| GLM-5.3 | $1.40 | $4.40 | $0.26 | — | $15 | $120 |
| GLM-5.2 | $1.40 | $4.40 | $0.26 | — | $60 | $180 |
| GPT 6 Luna* | $0.10 | $0.50 | $0.01 | $0.125 | $15 | $60 |
| GPT 5.6 Luna* | $0.20 | $1.20 | $0.02 | $0.25 | $15 | $60 |
| Claude Haiku 5.5* | $0.10 | $0.50 | $0.01 | $0.125 | $15 | $60 |
| Kimi K3 | $3.00 | $15.00 | $0.30 | — | $15 | $60 |
| Kimi K2.7 Code | $0.95 | $4.00 | $0.19 | — | $60 | $180 |
| Kimi K2.6 | $0.95 | $4.00 | $0.16 | — | $60 | $240 |
| LongCat-2.0 | $0.30 | $1.20 | $0.006 | — | $60 | $240 |
| LongCat 2.5 Preview Free | Free | Free | Free | — | Unlimited | Unlimited |
| Step 5 Preview Free | Free | Free | Free | — | Unlimited | Unlimited |
| MiMo-V2.6-Flash | $0.14 | $0.28 | $0.0028 | — | $60 | $120 |
| MiMo-V2.6-Pro | $0.435 | $0.87 | $0.003625 | — | $15 | $60 |
| MiMo-V2.5 | $0.14 | $0.28 | $0.0028 | — | $60 | $120 |
| MiMo-V2.5-Pro | $0.435 | $0.87 | $0.003625 | — | $15 | $60 |
| MiniMax M3 | $0.30 | $1.20 | $0.06 | — | $60 | $180 |
| MiniMax M2.7 | $0.30 | $1.20 | $0.06 | $0.375 | $60 | $240 |
| Muse Spark 1.3 Contributor | $0.10 | $0.20 | $0.002 | — | $60 | $120 |
| Muse Spark 1.2 Contributor | $0.10 | $0.20 | $0.002 | — | $60 | $120 |
| Qwen3.8 Max | $2.00 | $6.00 | $0.25 | $2.50 | $15 | $60 |
| Qwen3.8 Flash | $0.15 | $0.47 | $0.016 | $0.20 | $30 | $90 |
| Qwen3.7 Plus* | $0.40 | $1.60 | $0.04 | $0.50 | $60 | $180 |
| DeepSeek V4.1 Flash* | $0.15 | $0.60 | $0.003 | — | $60 | $120 |
| DeepSeek V4 Pro* | $0.66 | $1.98 | $0.022 | — | $15 | $60 |
| DeepSeek V4 Flash* | $0.15 | $0.60 | $0.003 | — | $30 | $120 |
| DeepSeek V4 Flash Vision Exp* | $0.15 | $0.60 | $0.003 | — | $15 | $60 |
| Hy4 preview | $0.834 | $2.501 | $0.042 | — | $30 | $120 |
| Hy3 | $0.14 | $0.58 | $0.035 | — | $60 | $240 |
| Space Bunny | $0.15 | $0.60 | $0.03 | — | $30 | $120 |

\* Tiered pricing: shown prices are the base tier. Grok 4.7/4.6 (>200K: $4.00/$12.00/$1.00), GPT 6 Luna (>272K: $0.20/$0.75/$0.02/$0.25), GPT 5.6 Luna (>272K: $0.40/$1.80/$0.04/$0.50), Claude Haiku 5.5 (>100K: $0.50/$2.50/$0.05/$0.625), Qwen3.7 Plus (>256K: $1.20/$4.80/$0.12/$1.50), DeepSeek V4.1 Flash / V4 Pro / V4 Flash / V4 Flash Vision Exp Peak hours (01:00–04:00 & 06:00–10:00 UTC, Mon–Fri): V4.1 Flash $0.30/$1.20/$0.006, V4 Pro $1.32/$3.96/$0.044, V4 Flash $0.30/$1.20/$0.006, V4 Flash Vision Exp $0.30/$1.20/$0.006.

## Estimated Requests (Go plan)

| Model | 5h | Week | Month |
|-------|-----|------|-------|
| Grok 4.7 | 169 | 423 | 845 |
| Grok 4.6 | 169 | 423 | 845 |
| GLM-5.3-Flash | 6,320 | 15,790 | 31,580 |
| GLM-5.3 | 220 | 540 | 1,080 |
| GLM-5.2 | 880 | 2,150 | 4,300 |
| GPT 6 Luna | 4,230 | 10,560 | 21,130 |
| GPT 5.6 Luna | 2,050 | 5,100 | 10,250 |
| Claude Haiku 5.5 | 3,850 | 9,620 | 19,230 |
| Kimi K3 | 110 | 250 | 490 |
| Kimi K2.7 Code | 1,350 | 3,380 | 6,750 |
| Kimi K2.6 | 1,150 | 2,880 | 5,750 |
| LongCat-2.0 | 11,400 | 28,600 | 57,200 |
| LongCat 2.5 Preview Free | Unlimited | Unlimited | Unlimited |
| Step 5 Preview Free | Unlimited | Unlimited | Unlimited |
| MiMo-V2.6-Flash | 30,100 | 75,200 | 150,400 |
| MiMo-V2.6-Pro | 3,250 | 8,150 | 16,300 |
| MiMo-V2.5 | 30,100 | 75,200 | 150,400 |
| MiMo-V2.5-Pro | 3,250 | 8,150 | 16,300 |
| MiniMax M3 | 3,200 | 8,000 | 16,000 |
| MiniMax M2.7 | 3,400 | 8,500 | 17,000 |
| Muse Spark 1.3 Contributor | 45,300 | 113,300 | 226,600 |
| Muse Spark 1.2 Contributor | 45,300 | 113,300 | 226,600 |
| Qwen3.8 Max | 160 | 400 | 810 |
| Qwen3.8 Flash | 5,400 | 13,500 | 27,000 |
| Qwen3.7 Plus | 4,300 | 10,800 | 21,600 |
| DeepSeek V4.1 Flash | 26,000 | 65,000 | 130,000 |
| DeepSeek V4 Pro | 1,050 | 2,600 | 5,200 |
| DeepSeek V4 Flash | 13,000 | 32,500 | 65,000 |
| DeepSeek V4 Flash Vision Exp | 6,500 | 16,250 | 32,500 |
| Hy4 preview | 1,350 | 3,380 | 6,770 |
| Hy3 | 4,300 | 10,750 | 21,500 |
| Space Bunny | 3,130 | 7,810 | 15,630 |

Go Plus estimates scale with each model's higher usage limit — toggle the plan above the chart to view them.

## Token Patterns per Request

| Model | Input | Cached | Output |
|-------|-------|--------|--------|
| Grok 4.7/4.6 | 390 | 32,500 | 120 |
| GLM-5.3-Flash | 1,000 | 55,000 | 200 |
| GLM-5.3/5.2 | 700 | 52,000 | 150 |
| GPT 6 Luna | 1,000 | 50,000 | 220 |
| GPT 5.6 Luna | 1,000 | 50,000 | 220 |
| Claude Haiku 5.5 | 1,100 | 55,000 | 240 |
| Kimi K3 | 1,050 | 76,500 | 300 |
| Kimi K2.7/K2.6 | 870 | 55,000 | 200 |
| LongCat-2.0 | 920 | 88,900 | 200 |
| DeepSeek V4.1 Flash | 410 | 71,300 | 310 |
| DeepSeek V4 Pro | 750 | 82,000 | 290 |
| DeepSeek V4 Flash | 410 | 71,300 | 310 |
| DeepSeek V4 Flash Vision Exp | 410 | 71,300 | 310 |
| MiniMax M3 | 510 | 56,000 | 190 |
| MiniMax M2.7 | 300 | 55,000 | 125 |
| Muse Spark 1.3/1.2 Contributor | 620 | 71,400 | 300 |
| MiMo-V2.6-Flash | 830 | 71,500 | 295 |
| MiMo-V2.6-Pro | 790 | 86,000 | 305 |
| MiMo-V2.5 | 830 | 71,500 | 295 |
| MiMo-V2.5-Pro | 790 | 86,000 | 305 |
| Qwen3.8 Max | 420 | 66,000 | 200 |
| Qwen3.8 Flash | 600 | 58,000 | 200 |
| Qwen3.7 Plus | 500 | 57,000 | 190 |
| Hy4 preview | 830 | 71,500 | 295 |
| Hy3 | 830 | 71,500 | 295 |
| Space Bunny | 1,000 | 55,000 | 200 |

## Usage Limits

- **Go** — $10/month · **Go Plus** — $40/month
- **5 hour** — 20% of the model's monthly limit (rolling) · **Weekly** — 50% · **Monthly** — 100%
- Each model has its own monthly dollar limit (see pricing table); limits may change as usage patterns are learned

### Usage Beyond Limits
Enable **Use balance** in the console to fall back to Zen balance instead of blocking.

### Why Lower Usage on Some Models
Included monthly usage varies by model. Most models work through bulk discounts and reserved GPU capacity; newer or already-discounted models get a smaller multiplier — still more than paying providers directly.

## Syncing with Source

Everything syncs automatically on page load and refresh:

1. **Model list** — fetched from `opencode.ai/zen/go/v1/models` API
2. **Pricing + estimates** — scraped from `opencode.ai/docs/go` HTML via CORS proxy. Parses both pricing tables (Go, then Go Plus) and both estimate tables, updates `MODEL_DATA` in memory
3. **Endpoints/SDK** — parsed from docs Endpoints table. Maps each model ID to its SDK package: `OpenAI SDK` (`/v1/responses`), `OpenAI-compatible SDK` (`/v1/chat/completions`), or `Anthropic SDK` (`/v1/messages`)
4. **Token patterns** — parsed from docs page text line-by-line with prefix expansion for shorthand model names (e.g. `GLM-5.3/5.2`, `Kimi K2.7/K2.6`). Shows input/cached/output tokens per request for each model
5. **Usage limits** — parsed from docs page text (`5-hour — 20%`, `weekly — 50%`, `monthly — 100%`), updates the limit cards
6. **Plan prices** — parsed from docs page text (`Go $10/month`, `Go Plus $40/month`), updates the hero badge
7. **Info cards** — "Usage Beyond Limits" and "Why Some Models Have Lower Usage" sections extracted from docs page headings/paragraphs/lists, sanitized before injection
8. **Tier filtering & normalization** — ignores secondary tier rows (`> 256K tokens`, `Peak` rows) and normalizes model names (spacing/hyphens) for resilient matching
9. **Dynamic model addition** — automatically creates entries via `slugify()` for any new model appearing in docs
10. **Exact price formatting** — `formatPrice()` formats token costs without artificial rounding or zero padding (`$0.435`, `$0.003625`)
11. **Fallback** — if docs page is unreachable, uses hardcoded values (still accurate as of last manual update)
12. **Data source badges** — section headers show green "Live" when docs sync succeeds, orange "Hardcoded" when using fallback

The `SOURCE:` comments in `MODEL_DATA`, `EXTRA_MODELS`, and `endpointMap` mark where to manually update if the auto-sync breaks.

**CORS proxy note:** The live docs fetch relies on third-party CORS proxies (`corsproxy.io`, `allorigins.win`). These are unreliable and often down — when they fail, the page falls back to hardcoded data. The hardcoded `MODEL_DATA` is kept in sync with the docs source manually.

## Tech

Single HTML file. Chart.js (CDN, `defer`). IBM Plex Sans/Mono (Google Fonts, `display=swap`). Live API + docs scraping with CORS proxy fallback. Two-plan support (Go / Go Plus). Data source badges (Live/Hardcoded). Sortable columns. Dark/light theme toggle. Three responsive breakpoints.

## Usage

```
start index.html    # Windows
open index.html     # macOS
xdg-open index.html # Linux
```
