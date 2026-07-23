# OpenCode Go — Models & Usage Dashboard

Compact single-page dashboard pulling live data from the OpenCode API. Models list, usage limits, pricing, and charts — all in one file.

**Source:** [opencode.ai/docs/go](https://opencode.ai/docs/go/)

## Features

- **Full Live Sync** — on load and refresh, fetches everything from source: model list (API), pricing, estimates, endpoints/SDK mapping, token patterns, usage limits, info cards
- **Data Source Badges** — green "Live" badge when docs sync succeeds, orange "Hardcoded" when using fallback data. Shown on chart and pricing table section headers
- **Token Patterns** — shows input/cached/output tokens per request for each model, parsed from source
- **Dark / Light Mode** — toggle in status bar. Respects system preference on first load. Persisted to localStorage. Charts update colors dynamically without full recreate
- **Usage Limits** — $12/5hr, $30/week, $60/month dollar-based rolling limits
- **Grouped Bar Chart** — single horizontal chart showing all three time windows (5h/weekly/monthly) side by side with legend. Aligned data labels at bar end. Smooth animations, themed tooltips (Chart.js)
- **Full Pricing Table** — input/output/cached read/cached write token prices, monthly allocation, request estimates. All 9 columns sortable (asc → desc → reset). Tiered pricing marked with badge
- **Info Cards** — "Usage Beyond Limits" (Zen balance fallback) and "Why Some Models Have Lower Usage" (bulk discount explanation)
- **Responsive** — large (>1200px), medium (768–1199px), small (<768px) breakpoints
- **OpenCode Theme** — IBM Plex Sans/Mono fonts, `#0c0c0e` dark / `#f5f5f7` light, `#007aff` accent blue

## Security & Reliability

- **XSS Prevention** — external content from docs page sanitized via `sanitizeHTML()` before DOM injection
- **Race Condition Protection** — debounced refresh with request ID tracking prevents concurrent fetches and stale data overwrites
- **Browser Compatibility** — `AbortController` with timeout (no `AbortSignal.timeout()` dependency). Works in Chrome 66+, Firefox 57+, Safari 12.1+
- **Safe Number Parsing** — `safeParseInt()` / `safeParseFloat()` handle invalid input gracefully (returns 0 instead of NaN)
- **Chart.js Guard** — checks `typeof Chart` before instantiation to handle CDN failures
- **Cache Versioning** — localStorage entries include version for future invalidation

## Performance

- **DOM Caching** — `getElementById` results cached to avoid repeated queries
- **DocumentFragment** — batch DOM insertions reduce reflow in model/pricing tables
- **Index Map Sorting** — O(1) lookup instead of O(n) `indexOf()` for model index column
- **Chart In-Place Updates** — theme toggle updates chart colors without destroy/recreate cycle
- **DNS Prefetch** — third-party CORS proxy domains prefetched (not preconnected)

## Accessibility

- `aria-sort` on sortable table headers (updates to ascending/descending on toggle)
- `tabindex="0"` + keyboard navigation (Enter/Space to sort) on all sortable headers
- `role="img"` + `aria-label` on SVG logo and canvas chart
- Canvas fallback content for screen readers
- Focus-visible ring on keyboard-focused elements

## Available Models

| Model | Provider | ID |
|-------|----------|-----|
| Grok 4.5 | xAI | `grok-4.5` |
| GLM-5.2 | Zhipu | `glm-5.2` |
| GLM-5.1 | Zhipu | `glm-5.1` |
| GLM-5 | Zhipu | `glm-5` |
| Kimi K3 | Moonshot | `kimi-k3` |
| Kimi K2.7 Code | Moonshot | `kimi-k2.7-code` |
| Kimi K2.6 | Moonshot | `kimi-k2.6` |
| Kimi K2.5 | Moonshot | `kimi-k2.5` |
| MiMo-V2.5 | Xiaomi | `mimo-v2.5` |
| MiMo-V2.5-Pro | Xiaomi | `mimo-v2.5-pro` |
| MiMo-V2-Pro | Xiaomi | `mimo-v2-pro` |
| MiMo-V2-Omni | Xiaomi | `mimo-v2-omni` |
| MiniMax M3 | MiniMax | `minimax-m3` |
| MiniMax M2.7 | MiniMax | `minimax-m2.7` |
| MiniMax M2.5 | MiniMax | `minimax-m2.5` |
| Qwen3.7 Max | Alibaba | `qwen3.7-max` |
| Qwen3.7 Plus | Alibaba | `qwen3.7-plus` |
| Qwen3.6 Plus | Alibaba | `qwen3.6-plus` |
| Qwen3.5 Plus | Alibaba | `qwen3.5-plus` |
| DeepSeek V4 Pro | DeepSeek | `deepseek-v4-pro` |
| DeepSeek V4 Flash | DeepSeek | `deepseek-v4-flash` |
| Hy3 | HY | `hy3` |
| HY3 Preview | HY | `hy3-preview` |

## Pricing (per 1M tokens)

| Model | Input | Output | Cached Read | Cached Write | Monthly |
|-------|-------|--------|-------------|--------------|---------|
| Grok 4.5 | $2.00 | $6.00 | $0.3000 | — | $15 |
| GLM-5.2 | $1.40 | $4.40 | $0.2600 | — | $60 |
| GLM-5.1 | $1.40 | $4.40 | $0.2600 | — | $60 |
| Kimi K3 | $3.00 | $15.00 | $0.3000 | — | $15 |
| Kimi K2.7 Code | $0.95 | $4.00 | $0.1900 | — | $60 |
| Kimi K2.6 | $0.95 | $4.00 | $0.1600 | — | $60 |
| MiMo-V2.5 | $0.14 | $0.28 | $0.0028 | — | $60 |
| MiMo-V2.5-Pro | $0.435 | $0.87 | $0.003625 | — | $15 |
| MiniMax M3 | $0.30 | $1.20 | $0.0600 | — | $60 |
| MiniMax M2.7 | $0.30 | $1.20 | $0.0600 | $0.375 | $60 |
| MiniMax M2.5 | $0.30 | $1.20 | $0.0600 | $0.375 | $60 |
| Qwen3.7 Max | $2.50 | $7.50 | $0.5000 | $3.125 | $60 |
| Qwen3.7 Plus* | $0.40 | $1.60 | $0.0400 | $0.50 | $60 |
| Qwen3.6 Plus* | $0.50 | $3.00 | $0.0500 | $0.625 | $60 |
| DeepSeek V4 Pro | $0.435 | $0.87 | $0.003625 | — | $15 |
| DeepSeek V4 Flash | $0.14 | $0.28 | $0.0028 | — | $60 |
| Hy3 | $0.14 | $0.58 | $0.0350 | — | $60 |

\* Qwen3.7 Plus and Qwen3.6 Plus have tiered pricing: shown prices are for ≤256K tokens. Above 256K: Qwen3.7 Plus → $1.20/$4.80/$0.12/$1.50; Qwen3.6 Plus → $2.00/$6.00/$0.20/$2.50.

## Estimated Requests

| Model | 5h | Week | Month |
|-------|-----|------|-------|
| Grok 4.5 | 120 | 300 | 600 |
| GLM-5.2 | 880 | 2,150 | 4,300 |
| GLM-5.1 | 880 | 2,150 | 4,300 |
| Kimi K3 | 110 | 250 | 490 |
| Kimi K2.7 Code | 1,350 | 4,630 | 9,250 |
| Kimi K2.6 | 1,150 | 2,880 | 5,750 |
| MiMo-V2.5 | 30,100 | 75,200 | 150,400 |
| MiMo-V2.5-Pro | 3,250 | 8,150 | 16,300 |
| MiniMax M3 | 3,200 | 8,000 | 16,000 |
| MiniMax M2.7 | 3,400 | 8,500 | 17,000 |
| Qwen3.7 Max | 950 | 2,390 | 4,770 |
| Qwen3.7 Plus | 4,300 | 10,800 | 21,600 |
| Qwen3.6 Plus | 3,300 | 8,200 | 16,300 |
| DeepSeek V4 Pro | 3,450 | 8,550 | 17,150 |
| DeepSeek V4 Flash | 31,650 | 79,050 | 158,150 |
| Hy3 | 4,300 | 10,750 | 21,500 |

## Usage Limits

- **5 hour** — $12 (rolling) · **Weekly** — $30 (7-day) · **Monthly** — $60 (calendar)

### Usage Beyond Limits
Enable **Use balance** in the console to fall back to Zen balance instead of blocking.

### Why Lower Usage on Some Models
Go gives 6x the $10 sub via bulk discounts. Newer/pre-discounted models get a smaller multiplier — still more than paying directly.

## Syncing with Source

Everything syncs automatically on page load and refresh:

1. **Model list** — fetched from `opencode.ai/zen/go/v1/models` API
2. **Pricing + estimates** — scraped from `opencode.ai/docs/go` HTML via CORS proxy. Parses pricing table and estimates table, updates `MODEL_DATA` in memory
3. **Endpoints/SDK** — parsed from docs page Endpoints table. Maps each model ID to its SDK package (OpenAI vs Anthropic)
4. **Token patterns** — parsed from docs page text line-by-line. Shows input/cached/output tokens per request for each model
5. **Usage limits** — parsed from docs page text (`$12`, `$30`, `$60`), updates the limit cards
6. **Info cards** — "Usage Beyond Limits" and "Why Some Models Have Lower Usage" sections extracted from docs page headings/paragraphs/lists, sanitized before injection
7. **Fallback** — if docs page is unreachable, uses hardcoded values (still accurate as of last manual update)
8. **Data source badges** — section headers show green "Live" when docs sync succeeds, orange "Hardcoded" when using fallback

The `SOURCE:` comments in `MODEL_DATA` and `EXTRA_MODELS` mark where to manually update if the auto-sync breaks.

**CORS proxy note:** The live docs fetch relies on third-party CORS proxies (`corsproxy.io`, `allorigins.win`). These are unreliable and often down — when they fail, the page falls back to hardcoded data. The hardcoded `MODEL_DATA` is kept in sync with the docs source manually.

## Tech

Single HTML file. Chart.js (CDN, `defer`). IBM Plex Sans/Mono (Google Fonts, `display=swap`). Live API + docs scraping with CORS proxy fallback. Data source badges (Live/Hardcoded). Sortable columns. Dark/light theme toggle. Three responsive breakpoints.

## Usage

```
start index.html    # Windows
open index.html     # macOS
xdg-open index.html # Linux
```
