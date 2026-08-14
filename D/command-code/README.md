# CommandCode Plans — Models & Usage Dashboard

Compact single-page dashboard pulling live data from the Command Code docs. Plans at a glance, usage limits, active deals, model pricing, and request charts — all in one file.

**Source:** [commandcode.ai/pricing](https://commandcode.ai/pricing) · [Pricing & Limits Docs](https://commandcode.ai/docs/resources/pricing-limits)

## Features

- **Full Live Sync** — on load and refresh, fetches everything from source: model pricing, usage limits, and token patterns from the docs page. Model count is dynamic (starts at 57 hardcoded, grows as docs add models)
- **Data Source Badges** — section headers reflect the actual provenance of each section: green **Live** when a fresh sync succeeded, **Cached** when showing a TTL-valid cache, **Stale cache** when the cache is older than 6h, or **Built-in** when falling back to hardcoded data. Pricing, chart, and limits badges are independent
- **Plans at a Glance** — 7 plan cards (Go, GOAT, Pro, Max 10×, Max 20×, Provider, Team Pro) with price, monthly credits, typical request volume, effective usage with deals, and model count. GOAT marked "BEST VALUE"
- **Usage Limits Table** — all 7 plans (Go, GOAT, Pro, Max 10×, Max 20×, Provider API, Team Pro) with price, monthly credits, 5-hour limit, weekly limit, and window percentages. Centered, sortable
- **Active Deals** — deal cards with discount, term, and details. Expired deals are hidden automatically via `expiresAt` timestamps (re-checked on tab visibility change and every 60s, so expiry goes live without a manual refresh); an empty state shows when no deals are active
- **Available Models** — all known models with provider, context window, and plan tier (Open / GOAT / Pro / Max / All). Newly discovered models show **Unknown** provider/tier instead of invented labels
- **Grouped Bar Chart** — single horizontal chart showing GOAT request estimates across 5-hour / weekly / monthly windows. Dynamic height scales with bar count (clamped to CSS max-height) so nothing clips. Bar colors are theme-aware
- **Full Model Pricing Table** — context, input/output/cached read/cached write per 1M tokens, GOAT credit allowance, and request estimates. 10 sortable columns
- **Token Patterns** — input/cached/output tokens per request for each model, parsed from source
- **Dark / Light Mode** — toggle in status bar. Respects system preference on first load. Persisted to localStorage. Charts update colors dynamically
- **Responsive** — large (>1200px), medium (768–1199px), small (<768px) breakpoints
- **Command Code Theme** — IBM Plex Sans/Mono fonts, `#0e1320` dark / `#f2ebda` light, `#b06a36` accent (Command Code's brand color)

## Security & Reliability

- **DOM Safety** — all dynamic content is inserted via `textContent` / `createElement`; no scraped string is ever interpolated into `innerHTML`
- **Race Condition Protection** — a single generation token (`syncGeneration`) discards results from a stale sync that finishes after a newer one has committed
- **Atomic State Updates** — `fetchDocsData` parses and validates everything into a result object; `applyDocsData` builds all collections (models, estimates, limits) on clones and swaps the live references in one commit. A failed sync leaves previous state untouched
- **Real Data Cache** — `cc-docs-cache` stores the normalized `modelData`, `usageLimits`, and `tokenPatterns` (versioned, 6h TTL, with a request-profile version). Cache payloads are schema-validated on load; malformed caches are rejected and cleared
- **Parsing Validation** — header-based column mapping (survives table reordering), `>= 30` row minimum, `>= 50%` known-model overlap invariant, and non-negative price checks reject garbage/partial parses
- **Safe Number Parsing** — `safeParseInt()` / `safeParseFloat()` / `parseIntOrNull()` strip currency symbols (`$`) gracefully; comma-formatted prices (`$1,000.00`) parse correctly; "Free" parses to 0
- **Deal Price Parsing** — takes the last (discounted) price from `~~$0.60~~ $0.30` style cells so deals update correctly
- **Chart.js Guard** — checks `typeof Chart` before instantiation; shows a visible fallback message on CDN failure instead of a blank section
- **Browser Compatibility** — `AbortController` with `setTimeout` + `finally` cleanup (no `AbortSignal.timeout()` dependency). Works in Chrome 66+, Firefox 57+, Safari 12.1+

## Performance

- **DOM Caching** — `getElementById` results cached to avoid repeated queries
- **DocumentFragment** — batch DOM insertions reduce reflow in model/pricing tables
- **Index Map Sorting** — O(1) lookup instead of O(n) `indexOf()` for model index column
- **Dynamic Chart Height** — canvas height scales with bar count (`min(max(450, rows × 26), 650)`), clamped to the CSS max-height so the chart never lays out for a clipped canvas
- **Chart In-Place Updates** — theme toggle updates chart colors and legend labels without a destroy/recreate cycle; a cheap length+checksum hash avoids re-serializing labels on every render

## Accessibility

- `aria-sort` on sortable table headers (updates to ascending/descending on toggle)
- `role="button"` + descriptive `aria-label` on sortable headers; `tabindex="0"` + keyboard navigation (Enter/Space to sort)
- A visually hidden `aria-live="polite"` region announces sort changes ("Sorted by Context, ascending")
- `aria-live="polite"` on the status bar so sync state changes are announced
- `role="img"` + `aria-label` on SVG logo and canvas chart
- Canvas fallback content for screen readers
- Focus-visible ring on keyboard-focused elements

## Available Models

| Model | Provider | Tier | ID |
|-------|----------|------|-----|
| Laguna S 2.1 | Poolside | Free | `laguna-s-2.1` |
| Ling 3.0 Flash | InclusionAI | Free | `ling-3.0-flash` |
| Tencent Hy3 | Tencent | Open | `tencent-hy3` |
| Kimi K3 | Moonshot | Open | `kimi-k3` |
| Kimi K2.7 Code | Moonshot | Open | `kimi-k2.7-code` |
| Kimi K2.7 Code HighSpeed | Moonshot | Open | `kimi-k2.7-code-highspeed` |
| Kimi K2.6 | Moonshot | Open | `kimi-k2.6` |
| Kimi K2.5 | Moonshot | Open | `kimi-k2.5` |
| GLM-5.2 | Zhipu | Open | `glm-5.2` |
| GLM-5.2 Fast | Zhipu | Open | `glm-5.2-fast` |
| GLM-5.1 | Zhipu | Open | `glm-5.1` |
| GLM-5 | Zhipu | Open | `glm-5` |
| MiniMax M3 ⚡ | MiniMax | Open | `minimax-m3` |
| MiniMax M2.7 | MiniMax | Open | `minimax-m2.7` |
| MiniMax M2.5 | MiniMax | Open | `minimax-m2.5` |
| DeepSeek V4 Pro ⚡ | DeepSeek | Open | `deepseek-v4-pro` |
| DeepSeek V4 Flash | DeepSeek | Open | `deepseek-v4-flash` |
| Qwen 3.8 Max | Alibaba | Open | `qwen3.8-max` |
| Qwen 3.6 Max Preview | Alibaba | Open | `qwen3.6-max-preview` |
| Qwen 3.6 Plus | Alibaba | Open | `qwen3.6-plus` |
| Qwen 3.7 Max | Alibaba | Open | `qwen3.7-max` |
| Qwen 3.7 Plus | Alibaba | Open | `qwen3.7-plus` |
| Qwen 3.7 Flash | Alibaba | Open | `qwen3.7-flash` |
| Step 3.7 Flash | StepFun | Open | `step-3.7-flash` |
| Step 3.5 Flash | StepFun | Open | `step-3.5-flash` |
| MiMo V2.5 Pro ⚡ | Xiaomi | Open | `mimo-v2.5-pro` |
| MiMo V2.5 ⚡ | Xiaomi | Open | `mimo-v2.5` |
| Nemotron 3 Ultra | NVIDIA | Open | `nemotron-3-ultra` |
| Claude Fable 5 | Anthropic | Max | `claude-fable-5` |
| Claude Opus 5 | Anthropic | Max | `claude-opus-5` |
| Claude Opus 4.8 | Anthropic | Max | `claude-opus-4.8` |
| Claude Opus 4.7 | Anthropic | Max | `claude-opus-4.7` |
| Claude Opus 4.6 | Anthropic | Max | `claude-opus-4.6` |
| Claude Sonnet 5 | Anthropic | Pro | `claude-sonnet-5` |
| Claude Sonnet 4.6 | Anthropic | Pro | `claude-sonnet-4.6` |
| Claude Haiku 4.5 | Anthropic | Pro | `claude-haiku-4.5` |
| Claude Sonnet 4.5 | Anthropic | Pro | `claude-sonnet-4.5` |
| GPT-5.6 Sol | OpenAI | Pro | `gpt-5.6-sol` |
| GPT-5.6 Terra | OpenAI | Pro | `gpt-5.6-terra` |
| GPT-5.6 Luna | OpenAI | All | `gpt-5.6-luna` |
| GPT-5.5 | OpenAI | Pro | `gpt-5.5` |
| GPT-5.4 | OpenAI | Pro | `gpt-5.4` |
| GPT-5.4 Mini | OpenAI | Pro | `gpt-5.4-mini` |
| GPT-5.3 Codex | OpenAI | Pro | `gpt-5.3-codex` |
| Gemini 3.7 Flash ⚡ | Google | GOAT | `gemini-3.7-flash` |
| Gemini 3.6 Flash | Google | Pro | `gemini-3.6-flash` |
| Gemini 3.5 Flash | Google | Pro | `gemini-3.5-flash` |
| Gemini 3.5 Flash Lite | Google | Pro | `gemini-3.5-flash-lite` |
| Gemini 3.1 Flash Lite | Google | Pro | `gemini-3.1-flash-lite` |
| Fugu Ultra | Sakana | Max | `fugu-ultra` |
| Muse Spark 1.2 | Meta | GOAT | `muse-spark-1.2` |
| Muse Spark 1.2 Contributor | Meta | All | `muse-spark-1.2-contributor` |
| Muse Spark 1.1 | Meta | Pro | `muse-spark-1.1` |
| Grok 4.6 | xAI | GOAT | `grok-4.6` |
| Grok 4.5 | xAI | All | `grok-4.5` |
| Inkling | Thinking Machines | Open | `inkling` |
| Inkling Small | Thinking Machines | Open | `inkling-small` |

⚡ = active deal

## Plans

| Plan | Price/mo | Credits | Typical Requests | Effective (with Deals) | Models |
|------|----------|---------|------------------|------------------------|--------|
| Go | $1 | $10 | ~15K | Up to $40 | 32 |
| GOAT | $10 | $70 | ~75K | Up to $100 | 33 |
| Pro | $20 | $80 | ~100K | Up to $150 | 47 |
| Max 10× | $100 | $150 | ~219K | Up to $600 | 53 |
| Max 20× | $200 | $300 | ~437K | Up to $1,200 | 53 |
| Provider API | $15 | Pay as you go | Uncapped | No markup | 57 |
| Team Pro | $40 | $40 | ~35K | Pooled | 53 |

## Usage Limits

| Plan | Monthly Credits | 5-Hour Limit | Weekly Limit | % of Monthly |
|------|-----------------|--------------|--------------|--------------|
| Go | $10 | $3 | $6 | 30% / 60% |
| GOAT | $70 | $14 | $35 | 20% / 50% |
| Pro | $80 | $16 | $40 | 20% / 50% |
| Max 10× | $150 | $45 | $90 | 30% / 60% |
| Max 20× | $300 | $90 | $180 | 30% / 60% |
| Provider API | — | — | — | No windows |
| Team Pro | $40 | $12 | $24 | 30% / 60% |

Rolling windows open on first use and reset after one window-length (5h / 7 days). Top-up and pay-as-you-go credits are never throttled.

## Active Deals

- **DeepSeek V4 Pro** — 75% off · 4× usage · Permanent
- **Gemini 3.7 Flash** — 50% off · 2× usage · Ends Dec 31, 2026
- **MiniMax M3** — 50% off · 2× usage · Permanent
- **MiMo V2.5 Pro** — Up to 99% off · Permanent
- **MiMo V2.5** — Up to 98% off · Permanent
- **Laguna S 2.1** — 100% off (FREE) · While capacity lasts
- **Ling 3.0 Flash** — 100% off (FREE) · Through Aug 2, 2026

## Pricing (per 1M tokens, after deals)

| Model | Input | Output | Cache Read | Cache Write |
|-------|-------|--------|------------|-------------|
| Laguna S 2.1 | Free | Free | Free | — |
| Ling 3.0 Flash | Free | Free | Free | — |
| Tencent Hy3 | $0.14 | $0.58 | $0.035 | — |
| Kimi K3 | $3.00 | $15.00 | $0.30 | — |
| Kimi K2.7 Code | $0.95 | $4.00 | $0.19 | — |
| Kimi K2.7 Code HighSpeed | $1.90 | $8.00 | $0.38 | — |
| Kimi K2.6 | $0.95 | $4.00 | $0.16 | — |
| Kimi K2.5 | $0.60 | $3.00 | $0.10 | — |
| GLM-5.2 | $1.40 | $4.40 | $0.26 | — |
| GLM-5.2 Fast | $3.00 | $10.25 | $0.50 | — |
| GLM-5.1 | $1.40 | $4.40 | $0.26 | — |
| GLM-5 | $1.00 | $3.20 | $0.20 | — |
| MiniMax M3* | $0.30 | $1.20 | $0.06 | — |
| MiniMax M2.7 | $0.30 | $1.20 | $0.06 | — |
| MiniMax M2.5 | $0.30 | $1.20 | $0.03 | — |
| DeepSeek V4 Pro* | $0.435 | $0.87 | $0.003625 | — |
| DeepSeek V4 Flash | $0.14 | $0.28 | $0.0028 | — |
| Qwen 3.8 Max | $2.00 | $6.00 | $0.25 | $2.50 |
| Qwen 3.6 Max Preview | $1.30 | $7.80 | $0.26 | $1.63 |
| Qwen 3.6 Plus | $0.50 | $3.00 | $0.10 | — |
| Qwen 3.7 Max | $2.50 | $7.50 | $0.50 | $3.13 |
| Qwen 3.7 Plus | $0.40 | $1.60 | $0.08 | $0.50 |
| Qwen 3.7 Flash | $0.03 | $0.13 | $0.006 | $0.038 |
| Step 3.7 Flash | $0.20 | $1.15 | $0.04 | — |
| Step 3.5 Flash | $0.10 | $0.30 | $0.02 | — |
| MiMo V2.5 Pro* | $0.435 | $0.87 | $0.0036 | — |
| MiMo V2.5* | $0.14 | $0.28 | $0.0028 | — |
| Nemotron 3 Ultra | $0.60 | $2.40 | $0.12 | — |
| Claude Fable 5 | $10.00 | $50.00 | $1.00 | $12.50 |
| Claude Opus 5 | $5.00 | $25.00 | $0.50 | $6.25 |
| Claude Opus 4.8/4.7/4.6 | $5.00 | $25.00 | $0.50 | $6.25 |
| Claude Sonnet 5 | $2.00 | $10.00 | $0.20 | $2.50 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Sonnet 4.5 | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 | $1.25 |
| GPT-5.6 Sol | $5.00 | $30.00 | $0.50 | $6.25 |
| GPT-5.6 Terra | $2.00 | $12.00 | $0.20 | $2.50 |
| GPT-5.6 Luna | $0.20 | $1.20 | $0.02 | $0.25 |
| GPT-5.5 | $5.00 | $30.00 | $0.50 | — |
| GPT-5.4 | $2.50 | $15.00 | $0.25 | — |
| GPT-5.4 Mini | $0.75 | $4.50 | $0.075 | — |
| GPT-5.3 Codex | $2.00 | $8.00 | $0.50 | — |
| Gemini 3.6 Flash | $1.50 | $7.50 | $0.15 | — |
| Gemini 3.5 Flash | $1.50 | $9.00 | $0.15 | — |
| Gemini 3.5 Flash Lite | $0.30 | $2.50 | $0.03 | — |
| Gemini 3.1 Flash Lite | $0.25 | $1.50 | $0.03 | — |
| Fugu Ultra | $5.00 | $30.00 | $0.50 | — |
| Muse Spark 1.2 | $1.25 | $4.25 | $0.15 | — |
| Muse Spark 1.2 Contributor | $0.10 | $0.20 | $0.002 | — |
| Muse Spark 1.1 | $1.25 | $4.25 | $0.15 | — |
| Grok 4.6 | $2.00 | $6.00 | $0.50 | — |
| Grok 4.5 | $2.00 | $6.00 | $0.50 | — |
| Inkling | $1.00 | $4.05 | $0.17 | — |
| Inkling Small | $0.50 | $1.20 | $0.10 | — |

\* = active deal rate. Claude Sonnet 5 intro pricing reverts to $3.00/$15.00 on September 1, 2026.

## Syncing with Source

Everything syncs automatically on page load and refresh through a **fetch → parse → validate → transactional commit → render → cache** pipeline:

1. **Model pricing** — scraped from `commandcode.ai/docs/resources/pricing-limits` HTML via CORS proxy. Columns are mapped by header text (tolerates reordering), so the model name is never assumed to be column 0. Takes the last (discounted) price from deal cells
2. **Usage limits** — parsed from the limits table (same header-based mapping); the `% of Monthly` percentages are recomputed from the synced dollar limits
3. **Token patterns** — parsed from docs page text line-by-line (e.g. "Model Name — 1,100 input, 71,500 cached, 220 output tokens per request"), tolerant of CRLF line endings
4. **Dynamic model addition** — automatically creates entries via `slugify()` for any new model appearing in docs, with `Unknown` provider/tier rather than invented metadata
5. **Request estimates** — `req5h` / `reqWeek` / `reqMonth` are derived from current prices + a token profile (docs-parsed or the global `REQUEST_PROFILE`), recomputed with the freshly synced limits. A model that becomes free gets its estimates cleared
6. **Validation** — rejects a parse with fewer than 30 rows, less than 50% overlap with known models, or non-negative price violations; a failed or suspicious sync never mutates state
7. **Atomic commit** — models, estimates, and limits are built on clones and swapped together in one commit point
8. **Cache** — the normalized `modelData` / `usageLimits` / `tokenPatterns` are stored versioned (6h TTL, profile-versioned) and schema-validated on load; the page hydrates from cache before the first fetch completes
9. **Fallback** — if the live fetch and cache both fail, uses hardcoded values (kept in sync with source and verified)
10. **Data source badges** — section headers show green **Live**, **Cached**, **Stale cache**, or **Built-in** based on the actual data origin

The `SOURCE:` comments in `MODEL_DATA`, `PLAN_DATA`, `DEAL_DATA`, and `USAGE_LIMITS` mark where to manually update if the auto-sync breaks.

**CORS proxy note:** Command Code's docs do not send CORS headers, so the live fetch relies on third-party CORS proxies (`corsproxy.io`, `allorigins.win`). These are unreliable and often down or blocking (corsproxy.io returns 403 for commandcode.ai) — when they fail, the page falls back to the cached payload, then to hardcoded data. The hardcoded `MODEL_DATA` is kept in sync with the docs source and has been verified field-by-field against the official docs.

## Tech

Single HTML file. Chart.js (CDN, `defer`). IBM Plex Sans/Mono (Google Fonts, `display=swap`). Live docs scraping with CORS proxy fallback. Data source badges (Live / Cached / Stale / Built-in). Versioned + schema-validated localStorage cache. Sortable columns. Dark/light theme toggle. Three responsive breakpoints.

## Usage

```
start index.html    # Windows
open index.html     # macOS
xdg-open index.html # Linux
```
