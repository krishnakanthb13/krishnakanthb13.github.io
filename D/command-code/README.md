# Command Code — Pricing & Limits Dashboard

A single-file, offline-first dashboard that visualizes Command Code's plans, usage limits, model catalog, and per-model pricing. Data is synced live from the official docs and cached locally.

**Source webpages:** [commandcode.ai/pricing](https://commandcode.ai/pricing) · [docs: Pricing & Limits](https://commandcode.ai/docs/resources/pricing-limits) · [docs: Go](https://commandcode.ai/docs/plans/go) · [docs: GOAT](https://commandcode.ai/docs/plans/goat) · [docs: Pro](https://commandcode.ai/docs/plans/pro) · [docs: Max](https://commandcode.ai/docs/plans/max)

**Synced:** Oct 11, 2026 (v1.79 era — 91 models, 10 active deals)

## ✨ Features

- **Plan Comparison** — every plan side by side (Go, GOAT, Pro, Max 10×/20×, Provider API, Team Pro) with price, monthly credits, typical request volume, effective usage with deals, and model counts
- **Usage Limits Table** — 5-hour and weekly rolling windows per plan, with percentage-of-pool indicators
- **Models Catalog** — all 91 models with provider, context window, capabilities, tier, and GOAT request estimates
- **Per-Model Pricing** — input, output, cache read, and cache write prices per 1M tokens, with deal badges
- **Request Estimates Chart** — GOAT-plan monthly request estimates per model (Chart.js horizontal bar chart)
- **Active Deals** — auto-expiring deal registry with countdowns (boosted credits, 2× usage, up to 99% off, free models)
- **Live Sync** — fetches and parses `commandcode.ai/docs/resources/pricing-limits` on load; falls back to hardcoded data offline
- **Info Cards** — usage beyond limits, geo model limits, and why some models have lower allowances
- **Starts at 91 hardcoded models** — model count is dynamic (grows as docs add models)

## 🔒 Security & Reliability

- No external API calls except the docs page itself
- localStorage caching with versioned schema (cache invalidates on format change)
- Graceful degradation: if the sync fails, the hardcoded dataset still renders
- No telemetry, no build step, no dependencies

## ⚡ Performance

- Single HTML file (~2,700 lines) — no build, no bundler, no framework
- Inline Chart.js from CDN (only external request)
- DOM element caching, batch rendering, passive scroll listeners
- 6-hour cache TTL with instant stale-while-revalidate rendering

## ♿ Accessibility

- Semantic HTML with proper heading hierarchy
- High-contrast color scheme tested for WCAG AA
- Keyboard-navigable tables with visible focus states
- Reduced-motion media query support

## 📦 Available Models

**91 models** across tiers: Free, Open, All (every plan), GOAT, Pro, Max.

| Model | Provider | Tier | ID |
|-------|----------|------|----|
| Laguna S 2.1 (FREE) | Poolside | Free | `laguna-s-2.1` |
| Ling 3.0 Flash (FREE) | InclusionAI | Free | `ling-3.0-flash` |
| Ling 3.0 Flash Sante (FREE) | InclusionAI | Free | `ling-3.0-flash-sante` |
| Ling 3.1 Flash (FREE) | InclusionAI | Free | `ling-3.1-flash` |
| Glyph Cluster (FREE) | Unknown (anonymous) | Free | `glyph-cluster` |
| Tencent Hy4 Preview | Tencent | Open | `tencent-hy4-preview` |
| Tencent Hy3 | Tencent | Open | `tencent-hy3` |
| Kimi K3 | Moonshot | Open | `kimi-k3` |
| Kimi K2.7 Code | Moonshot | Open | `kimi-k2.7-code` |
| Kimi K2.7 Code HighSpeed | Moonshot | Open | `kimi-k2.7-code-highspeed` |
| Kimi K2.6 | Moonshot | Open | `kimi-k2.6` |
| Kimi K2.5 | Moonshot | Open | `kimi-k2.5` |
| GLM-5.3 Flash ⚡ | Zhipu | Open | `glm-5.3-flash` |
| GLM-5.3 FlashX | Zhipu | Open | `glm-5.3-flashx` |
| GLM-5.3 | Zhipu | Open | `glm-5.3` |
| GLM-5.2 | Zhipu | Open | `glm-5.2` |
| GLM-5.2 Fast | Zhipu | Open | `glm-5.2-fast` |
| GLM-5.1 | Zhipu | Open | `glm-5.1` |
| GLM-5 | Zhipu | Open | `glm-5` |
| MiniMax M3 ⚡ | MiniMax | Open | `minimax-m3` |
| MiniMax M2.7 | MiniMax | Open | `minimax-m2.7` |
| MiniMax M2.5 | MiniMax | Open | `minimax-m2.5` |
| DeepSeek V4 Pro (latest) | DeepSeek | Open | `deepseek-v4-pro` |
| DeepSeek V4 Flash (latest) | DeepSeek | Open | `deepseek-v4-flash` |
| DeepSeek V4 Flash Vision (exp) | DeepSeek | Open | `deepseek-v4-flash-vision` |
| DeepSeek V4 Flash Fast | DeepSeek | Open | `deepseek-v4-flash-fast` |
| DeepSeek V4.1 Flash ⚡ | DeepSeek | Open | `deepseek-v4.1-flash` |
| DeepSeek V4.1 Flash Fast | DeepSeek | Open | `deepseek-v4.1-flash-fast` |
| Qwen 3.8 Omni Flash | Alibaba | Open | `qwen3.8-omni-flash` |
| Qwen 3.8 Max 0902 | Alibaba | Open | `qwen3.8-max-0902` |
| Qwen 3.8 Max | Alibaba | Open | `qwen3.8-max` |
| Qwen 3.8 27B | Alibaba | Open | `qwen3.8-27b` |
| Qwen 3.6 Max Preview | Alibaba | Open | `qwen3.6-max-preview` |
| Qwen 3.6 Plus | Alibaba | Open | `qwen3.6-plus` |
| Qwen 3.7 Max | Alibaba | Open | `qwen3.7-max` |
| Qwen 3.7 Plus | Alibaba | Open | `qwen3.7-plus` |
| Qwen 3.8 Flash | Alibaba | Open | `qwen3.8-flash` |
| Qwen 3.7 Flash | Alibaba | Open | `qwen3.7-flash` |
| LongCat 2.0 | Tencent | Open | `longcat-2.0` |
| Step 5 Preview | StepFun | Open | `step-5-preview` |
| Step 3.7 Flash | StepFun | Open | `step-3.7-flash` |
| Step 3.5 Flash | StepFun | Open | `step-3.5-flash` |
| MiMo V2.6 Pro | Xiaomi | Open | `mimo-v2.6-pro` |
| MiMo V2.6 Pro UltraSpeed | Xiaomi | Open | `mimo-v2.6-pro-ultraspeed` |
| MiMo V2.6 Flash | Xiaomi | Open | `mimo-v2.6-flash` |
| MiMo V2.5 Pro ⚡ | Xiaomi | Open | `mimo-v2.5-pro` |
| MiMo V2.5 ⚡ | Xiaomi | Open | `mimo-v2.5` |
| Nemotron 3 Ultra | NVIDIA | Open | `nemotron-3-ultra` |
| Claude Fable 5.1 | Anthropic | Max | `claude-fable-5.1` |
| Claude Fable 5 | Anthropic | Max | `claude-fable-5` |
| Claude Opus 5.5 | Anthropic | Max | `claude-opus-5.5` |
| Claude Opus 5 / 4.8 / 4.7 / 4.6 | Anthropic | Max | `claude-opus-5` … |
| Claude Sonnet 5.5 | Anthropic | GOAT | `claude-sonnet-5.5` |
| Claude Sonnet 5 | Anthropic | Pro | `claude-sonnet-5` |
| Claude Sonnet 4.6 | Anthropic | Pro | `claude-sonnet-4.6` |
| Claude Haiku 5.5 | Anthropic | GOAT | `claude-haiku-5.5` |
| Claude Haiku 4.5 | Anthropic | Pro | `claude-haiku-4.5` |
| GPT-6 Astra | OpenAI | Max | `gpt-6-astra` |
| GPT-6.1 Sol | OpenAI | Pro | `gpt-6.1-sol` |
| GPT-6 Sol | OpenAI | Pro | `gpt-6-sol` |
| GPT-6 Luna | OpenAI | All | `gpt-6-luna` |
| GPT-5.6 Sol | OpenAI | GOAT | `gpt-5.6-sol` |
| GPT-5.6 Terra | OpenAI | Pro | `gpt-5.6-terra` |
| GPT-5.6 Luna | OpenAI | All | `gpt-5.6-luna` |
| GPT-5.5 / 5.4 / 5.4 Mini / 5.3 Codex | OpenAI | Pro | `gpt-5.5` … |
| Gemini 3.8 Flash | Google | GOAT | `gemini-3.8-flash` |
| Gemini 3.7 Flash | Google | GOAT | `gemini-3.7-flash` |
| Gemini 3.6 / 3.5 Flash, 3.5 / 3.1 Flash Lite | Google | Pro | `gemini-3.6-flash` … |
| Fugu Ultra | Sakana | Max | `fugu-ultra` |
| Muse Spark 1.3 / 1.2 | Meta | GOAT | `muse-spark-1.3` … |
| Muse Spark 1.3 / 1.2 Contributor | Meta | All | `muse-spark-1.3-contributor` … |
| Muse Spark 1.1 | Meta | Pro | `muse-spark-1.1` |
| Grok 4.7 / 4.6 | xAI | GOAT | `grok-4.7` … |
| Grok 4.5 | xAI | All | `grok-4.5` |
| Mistral Large 4 ⚡ | Mistral | All | `mistral-large-4` |
| Inkling | Thinking Machines | Open | `inkling` |
| Inkling Small | Thinking Machines | Open | `inkling-small` |
| Jev (decision model) | TypeSafe | All | `jev` |
| Claude Sonnet 4.5 (deprecated) | Anthropic | Pro | `claude-sonnet-4.5` |

⚡ = active deal. Jev is a decision model — headless (`cmd -p`) and Provider API only, not in `/model`; input tokens only, output is free.

## 📊 Plans

| Plan | Price/mo | Credits/mo | Typical volume | Effective usage | Models |
|------|----------|------------|----------------|-----------------|--------|
| Go | $1 | $10 | ~9K requests | Up to $60 | 54 |
| GOAT | $10 | $70 | ~75K requests | Up to $100 | 65 |
| Pro | $20 | $80 | ~100K requests | Up to $150 | 79 |
| Max 10× | $100 | $150 | ~230K requests | Up to $750 | 89 |
| Max 20× | $200 | $300 | ~370K requests | Up to $1,500 | 89 |
| Provider | $15 setup | Pay as you go | Uncapped | No markup | 89 |
| Team Pro | $40/seat | $40 pooled | ~35K requests | Pooled | 79 |

## 🕐 Usage Limits (rolling windows)

| Plan | 5-hour limit | Weekly limit | % of pool |
|------|--------------|--------------|-----------|
| Go | $2 | $5 | 20% / 50% |
| GOAT | $14 | $35 | 20% / 50% |
| Pro | $16 | $40 | 20% / 50% |
| Max 10× | $45 | $90 | 30% / 60% |
| Max 20× | $90 | $180 | 30% / 60% |
| Team Pro | $12 | $24 | 30% / 60% |
| Provider | — | — | No windows |

Limits are measured in credit value, not request count. They roll from first use and reset on their own. Go, GOAT and Pro use 20% / 50% of their usage pool; Max and Team plans use 30% / 60%.

## 🎁 Active Deals

Applied automatically — no codes, no toggles. Stacks on top of your credit multiplier on every plan and even top-up credits.

| Deal | Model | Term | Details |
|------|-------|------|---------|
| Boosted credits | DeepSeek V4.1 Flash | No end date | $10 Go · $60 GOAT · $70 Pro |
| Boosted credits | GLM-5.3 Flash | While capacity lasts | $10 Go · $60 GOAT · $70 Pro |
| Boosted credits | Mistral Large 4 | Through Oct 20, 2026 | $10 Go · $40 GOAT · $50 Pro (was $6/$20/$30) |
| 50% off · 2× usage | MiniMax M3 | Permanent | $47 GOAT / $57 Pro allowance |
| Up to 99% off | MiMo V2.5 Pro | Permanent | Cache reads $0.0036/1M |
| Up to 98% off | MiMo V2.5 | Permanent | Cache reads $0.0028/1M |
| 100% off (FREE) | Laguna S 2.1 | While capacity lasts | All tokens $0.00 |
| 100% off (FREE) | Ling 3.0 Flash Sante | While it lasts | Up to 100 requests/day |
| 100% off (FREE) | Ling 3.1 Flash | While it lasts | No daily request limit |
| 100% off (FREE) | Glyph Cluster | While the stealth preview lasts | Up to 100 requests/day |

## 💰 Pricing (per 1M tokens)

| Model | Input | Output | Cache Read | Cache Write |
|-------|-------|--------|------------|-------------|
| Laguna S 2.1 | Free | Free | Free | — |
| Ling 3.0 Flash | Free | Free | Free | — |
| Ling 3.0 Flash Sante | Free | Free | Free | — |
| Ling 3.1 Flash | Free | Free | Free | — |
| Glyph Cluster | Free | Free | Free | — |
| Tencent Hy4 Preview | $0.834 | $2.501 | $0.042 | — |
| Tencent Hy3 | $0.14 | $0.58 | $0.035 | — |
| Kimi K3 | $3.00 | $15.00 | $0.30 | — |
| Kimi K2.7 Code | $0.95 | $4.00 | $0.19 | — |
| Kimi K2.7 Code HighSpeed | $1.90 | $8.00 | $0.38 | — |
| Kimi K2.6 | $0.95 | $4.00 | $0.16 | — |
| Kimi K2.5 | $0.60 | $3.00 | $0.10 | — |
| GLM-5.3 Flash | $0.15 | $0.50 | $0.03 | — |
| GLM-5.3 FlashX | $0.37 | $1.25 | $0.075 | — |
| GLM-5.3 | $1.40 | $4.40 | $0.26 | — |
| GLM-5.2 | $1.40 | $4.40 | $0.26 | — |
| GLM-5.2 Fast | $3.00 | $10.25 | $0.50 | — |
| GLM-5.1 | $1.40 | $4.40 | $0.26 | — |
| GLM-5 | $1.00 | $3.20 | $0.20 | — |
| MiniMax M3 ⚡ | ~~$0.60~~ **$0.30** | ~~$2.40~~ **$1.20** | ~~$0.12~~ **$0.06** | — |
| MiniMax M2.7 | $0.30 | $1.20 | $0.06 | — |
| MiniMax M2.5 | $0.30 | $1.20 | $0.03 | — |
| DeepSeek V4 Pro (latest) | $0.66 | $1.98 | $0.022 | — |
| DeepSeek V4 Flash (latest) | $0.15 | $0.60 | $0.003 | — |
| DeepSeek V4 Flash Vision (exp) | $0.15 | $0.60 | $0.003 | — |
| DeepSeek V4 Flash Fast | $0.28 | $0.56 | $0.07 | — |
| DeepSeek V4.1 Flash | $0.15 | $0.60 | $0.003 | — |
| DeepSeek V4.1 Flash Fast | $0.16 | $0.58 | $0.016 | — |
| Qwen 3.8 Omni Flash | $0.15 | $0.47 | $0.016 | — |
| Qwen 3.8 Max 0902 | $2.00 | $6.00 | $0.25 | — |
| Qwen 3.8 Max | $2.00 | $6.00 | $0.25 | $2.50 |
| Qwen 3.8 27B | $0.40 | $3.00 | $0.04 | — |
| Qwen 3.6 Max Preview | $1.30 | $7.80 | $0.26 | $1.63 |
| Qwen 3.6 Plus | $0.50 | $3.00 | $0.10 | — |
| Qwen 3.7 Max | $2.50 | $7.50 | $0.50 | $3.13 |
| Qwen 3.7 Plus | $0.40 | $1.60 | $0.08 | $0.50 |
| Qwen 3.8 Flash | $0.16 | $0.47 | $0.016 | — |
| Qwen 3.7 Flash | $0.03 | $0.13 | $0.006 | $0.038 |
| LongCat 2.0 | $0.30 | $1.20 | $0.006 | — |
| Step 5 Preview | $1.00 | $2.70 | $0.05 | — |
| Step 3.7 Flash | $0.20 | $1.15 | $0.04 | — |
| Step 3.5 Flash | $0.09 | $0.30 | $0.02 | — |
| MiMo V2.6 Pro | $0.435 | $0.87 | $0.0036 | — |
| MiMo V2.6 Pro UltraSpeed | $4.35 | $8.70 | $0.036 | — |
| MiMo V2.6 Flash | $0.14 | $0.28 | $0.0028 | — |
| MiMo V2.5 Pro ⚡ | ~~$2.00~~ **$0.435** | ~~$6.00~~ **$0.87** | ~~$0.40~~ **$0.0036** | — |
| MiMo V2.5 ⚡ | ~~$0.80~~ **$0.14** | ~~$4.00~~ **$0.28** | ~~$0.16~~ **$0.0028** | — |
| Nemotron 3 Ultra | $0.60 | $2.40 | $0.12 | — |
| Claude Fable 5.1 | $10.00 | $50.00 | $0.25 | $12.50 |
| Claude Fable 5 | $10.00 | $50.00 | $1.00 | $12.50 |
| Claude Opus 5.5 | $4.00 | $20.00 | $0.20 | $5.00 |
| Claude Opus 5 / 4.8 / 4.7 / 4.6 | $5.00 | $25.00 | $0.50 | $6.25 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | $0.10 | $2.50 |
| Claude Sonnet 5 | $2.00 | $10.00 | $0.20 | $2.50 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Haiku 5.5 | $0.10 | $0.50 | $0.01 | $0.125 |
| Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 | $1.25 |
| GPT-6 Astra | $10.00 | $50.00 | $1.00 | $12.50 |
| GPT-6.1 Sol | $2.00 | $10.00 | $0.10 | $2.50 |
| GPT-6 Sol | $2.00 | $10.00 | $0.20 | $2.50 |
| GPT-6 Luna | $0.10 | $0.50 | $0.01 | $0.125 |
| GPT-5.6 Sol | $5.00 | $30.00 | $0.50 | $6.25 |
| GPT-5.6 Terra | $2.00 | $12.00 | $0.20 | $2.50 |
| GPT-5.6 Luna | $0.20 | $1.20 | $0.02 | $0.25 |
| GPT-5.5 | $5.00 | $30.00 | $0.50 | — |
| GPT-5.4 | $2.50 | $15.00 | $0.25 | — |
| GPT-5.4 Mini | $0.75 | $4.50 | $0.075 | — |
| GPT-5.3 Codex | $2.00 | $8.00 | $0.50 | — |
| Gemini 3.8 Flash | $1.50 | $7.50 | $0.15 | — |
| Gemini 3.7 Flash | $1.50 | $7.50 | $0.15 | $0.08334 |
| Gemini 3.6 Flash | $1.50 | $7.50 | $0.15 | — |
| Gemini 3.5 Flash | $1.50 | $9.00 | $0.15 | — |
| Gemini 3.5 Flash Lite | $0.30 | $2.50 | $0.03 | — |
| Gemini 3.1 Flash Lite | $0.25 | $1.50 | $0.03 | — |
| Fugu Ultra | $5.00 | $30.00 | $0.50 | — |
| Muse Spark 1.3 / 1.2 / 1.1 | $1.25 | $4.25 | $0.15 | — |
| Muse Spark 1.3 / 1.2 Contributor | $0.10 | $0.20 | $0.002 | — |
| Grok 4.7 / 4.6 / 4.5 | $2.00 | $6.00 | $0.50 | — |
| Mistral Large 4 | $1.36 | $4.18 | $0.14 | — |
| Inkling | $1.00 | $4.05 | $0.17 | — |
| Inkling Small | $0.50 | $1.20 | $0.10 | — |
| Jev | $0.042 | $0.00 | $0.00 | — |
| Claude Sonnet 4.5 (deprecated) | $3.00 | $15.00 | $0.30 | $3.75 |

DeepSeek V4 models show off-peak rates (17h/day); peak rates apply 01:00–04:00 & 06:00–10:00 UTC, Mon–Fri (weekends fully off-peak).

## 🔄 Syncing with Source

The dashboard fetches `https://commandcode.ai/docs/resources/pricing-limits` on load and parses:

1. **Model pricing table** — name, context, input/output/cache prices, deal badges, free badges
2. **Usage limits table** — 5-hour and weekly windows per plan
3. **Token profile** — the docs now publish a single typical-request profile (~800 input tokens, ~50K cache reads, 125–200 output tokens depending on model family); per-model token patterns are no longer published, so estimates use the global `REQUEST_PROFILE`
4. **Deals section** — discount, term, and expiry per deal

Parsed data overrides the hardcoded fallback and is cached in localStorage for 6 hours (versioned cache key `cc-docs-cache`).

## 🛠 Tech

- Vanilla ES2020+ JavaScript (no framework)
- Chart.js 4.4.1 from CDN (UMD build)
- CSS custom properties with dark/light theme
- IBM Plex Mono + Inter fonts from Google Fonts
- Zero build step — open `index.html` directly

## 📖 Usage

```bash
# Open directly in a browser
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows

# Or serve locally
npx serve .
```

The dashboard works fully offline using the hardcoded dataset. When online, it syncs with the live docs page and shows a "Live" badge.
