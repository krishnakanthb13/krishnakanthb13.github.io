/**
 * Cloudflare Worker: Secure API Proxy & Rate Limiter for Gemini & Groq APIs
 * 
 * Securely forwards chat requests to Groq or Gemini without exposing keys to the client.
 * Enforces rate limits (e.g., 5 requests per minute, 50 requests per day per IP) using Cloudflare KV.
 */

const memoryCache = new Map();
let lastCacheCleanup = Date.now();

function cleanupMemoryCache() {
    const now = Date.now();
    if (now - lastCacheCleanup < 60000) return;
    lastCacheCleanup = now;
    const cutoff = now - 86400000;
    for (const [key, data] of memoryCache) {
        if (data.reset < cutoff) memoryCache.delete(key);
    }
}

const SYSTEM_INSTRUCTION = `You are Krishna Kanth B's AI Consultation Agent. Help classify tasks & estimate costs.
Rates: Workflow Optimization (₹1400/hr), AI Assistants (₹1500/hr), Business Process Automation (₹1600/hr), AI Automation (₹1800/hr), Custom AI Applications (₹2000/hr), AI Consulting (₹2000/hr).

CRITICAL CONSTRAINTS:
1. Do NOT answer any questions outside the scope of Krishna Kanth B's AI Consulting, task cost estimation, or classification services. Exception: You are allowed to respond friendly and normally to greetings and pleasantries (e.g., 'Hi', 'Hello', 'How are you?', etc.). If a user asks anything else unrelated (e.g. general knowledge, coding help, creative writing, or unrelated queries), politely decline by stating: "I am only programmed to assist with Krishna's AI consulting services and task calculations."
2. Keep ALL responses short, simple, and clean. Use small bullet points. No verbose paragraphs.
3. Ask for missing details: Project Name, Plan Choice (Client-Bare 1x, Work+Consulting 1.3x, Consulting Only 1.8x), Hours, Extra Expenses, Add-ons (Discovery session: +₹2000, GST 18%, Rush fee).
4. If parameters are neglected, state defaults (Work+Consulting 1.3x) and append the neglected terms footer verbatim:
---
### ⚠️ Important Notice: Additional Terms & Conditions
* **Taxation**: Prices do not include GST (18%) which may apply depending on billing location.
* **Discovery Session Note**: The flat ₹2,000 Discovery pricing is valid for first-time clients only and covers up to 2 hours. Additional workshop/consulting time falls back to standard Consulting Skill Rates.
* **Plan Multipliers**: Pricing is subject to change if the engagement mode transitions from Execution-Only (1.0x) to Full-Service/Strategy (1.3x - 1.8x).
* **Rush/Expedited Delivery**: A premium charge may apply if tight deadlines require overtime or weekend work.
5. Calculate pricing carefully: Map task->category->hours->subtotal. Apply multiplier & add-ons. 
6. State the final total estimate clearly using this exact format: "Total: ~₹XXXX (approximate, subject to final complexity)" so UI parsers sync.`;

export default {

  async fetch(request, env, ctx) {
    cleanupMemoryCache();

    const ALLOWED_ORIGINS = ["https://krishnakanthb13.github.io", "http://localhost:5500", "http://127.0.0.1:5500"];
    const reqOrigin = request.headers.get("Origin") || "";
    const allowOrigin = ALLOWED_ORIGINS.includes(reqOrigin) ? reqOrigin : ALLOWED_ORIGINS[0];

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: { "Access-Control-Allow-Origin": allowOrigin } });
    }

    try {
      // 1. Get Client IP for Rate Limiting
      const ip = request.headers.get("CF-Connecting-IP") || "anonymous";
      
      // Get current timestamps
      const now = new Date();
      const dateKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
      const minuteKey = Math.floor(now.getTime() / 60000); // 1-minute window

      const dailyKVKey = `limit:${ip}:${dateKey}`;
      const minuteKVKey = `limit:${ip}:min:${minuteKey}`;

      // 2. Enforce Rate Limits (Default: 5/min, 25/day per IP)
      const LIMIT_MIN = 5;
      const LIMIT_DAY = 25;

      let minCount = 0;
      let dayCount = 0;

      if (env.LIMITS_KV) {
        const [storedMin, storedDay] = await Promise.all([
          env.LIMITS_KV.get(minuteKVKey),
          env.LIMITS_KV.get(dailyKVKey)
        ]);

        minCount = storedMin ? parseInt(storedMin, 10) : 0;
        dayCount = storedDay ? parseInt(storedDay, 10) : 0;

        if (minCount >= LIMIT_MIN) {
          return new Response(JSON.stringify({ error: "Rate limit: Max 5 requests/minute. Please wait." }), {
            status: 429,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin }
          });
        }

        if (dayCount >= LIMIT_DAY) {
          return new Response(JSON.stringify({ error: "Daily limit reached: Max 25 requests/day. Reset at midnight UTC." }), {
            status: 429,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin }
          });
        }

        // Increment counts
        await Promise.all([
          env.LIMITS_KV.put(minuteKVKey, (minCount + 1).toString(), { expirationTtl: 120 }),
          env.LIMITS_KV.put(dailyKVKey, (dayCount + 1).toString(), { expirationTtl: 86400 * 2 })
        ]);
      } else {
        // --- In-Memory Fallback Rate Limiting ---
        const nowMs = now.getTime();

        // 1-minute tracking
        let minData = memoryCache.get(`${ip}:min`);
        if (!minData || nowMs > minData.reset) {
          minData = { count: 0, reset: nowMs + 60000 };
        }
        minCount = minData.count;

        // Daily tracking
        let dayData = memoryCache.get(`${ip}:day`);
        if (!dayData || nowMs > dayData.reset) {
          dayData = { count: 0, reset: nowMs + 86400000 };
        }
        dayCount = dayData.count;

        if (minCount >= LIMIT_MIN) {
          return new Response(JSON.stringify({ error: "Rate limit: Max 5 requests/minute. Please wait." }), {
            status: 429,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin }
          });
        }

        if (dayCount >= LIMIT_DAY) {
          return new Response(JSON.stringify({ error: "Daily limit reached: Max 25 requests/day. Reset in a few hours." }), {
            status: 429,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin }
          });
        }

        // Increment memory counters
        minData.count++;
        dayData.count++;
        memoryCache.set(`${ip}:min`, minData);
        memoryCache.set(`${ip}:day`, dayData);
      }

      // 3. Process the Request
      const body = await request.json();
      const { messages } = body;

      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: "Invalid request. 'messages' array is required." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin }
        });
      }

      const apiKey = env.GROQ_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Server Configuration Error: GROQ_API_KEY is missing in Worker environment." }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin }
        });
      }

      const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
      const payload = {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          ...messages
            .filter(m => ["user", "assistant"].includes(m.role) && typeof m.content === "string")
            .map(m => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.3,
        max_tokens: 1500
      };

      const res = await fetch(groqUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        return new Response(JSON.stringify({ error: "Groq API Error", details: errText }), {
          status: res.status,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin }
        });
      }

      const data = await res.json();
      const text = data.choices[0].message.content;

      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Internal Server Error", message: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin }
      });
    }
  }
};
