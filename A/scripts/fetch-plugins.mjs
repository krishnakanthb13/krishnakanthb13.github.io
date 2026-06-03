// ============================================================
//  Builds plugins.yaml from the public Amplenote note that is the
//  single source of truth for the dashboard:
//
//    https://public.amplenote.com/Y3dy91/krishna-plugins
//
//  The page is server-rendered HTML, so this runs with no API key
//  and no dependencies (Node 20+, like A/aa/scripts/fetch-videos.mjs).
//  It scrapes:
//    • the "Chronological Timeline" table  -> id, name, category,
//      published, last-updated, future plans
//    • the "Custom URL's" table            -> public link + install link
//    • the "Grouped by Dimensionality"     -> the 4 category buckets
//      cards and the 🔴/🟢/🟡 status badges
//    • the "Milestones" block              -> dated milestone list
//
//  Everything is joined on the plugin id (the token in
//  amplenote.com/plugins/<id>). The few purely-visual strings the
//  dashboard needs but the note does not carry (hero subtitle, the
//  card icons) live in PRESENTATION below and are easy to tweak.
// ============================================================

import { writeFile } from "node:fs/promises";

const SOURCE_URL = "https://public.amplenote.com/Y3dy91/krishna-plugins";
const OUT_FILE = "plugins.yaml";
const UA =
  "Mozilla/5.0 (compatible; KrishnaPluginsBot/1.0; +https://krishnakanthb13.github.io/)";

// Presentation-only chrome (not stored in the note). Tweak freely.
const PRESENTATION = {
  page_title: "Future Plan - Amplenote Plugins!",
  hero_subtitle:
    "My collection of tools designed to streamline your workflow and expand the power of Amplenote.",
  referral_link: "https://www.amplenote.com/signup?ref=7JGSMI4H0",
  support: {
    text: "Enjoying the plugins? Upvote it right from the install link!",
    link: "https://krishnakanthb13.github.io/S/PLP",
    link_label: "Support Original Work (Secured!)",
  },
};

// Maps a scraped category-card title to a Material Symbols icon.
function iconFor(title) {
  const t = title.toLowerCase();
  if (t.includes("filtering")) return "filter_list";
  if (t.includes("object")) return "grid_view";
  if (t.includes("review") || t.includes("modify")) return "edit_note";
  if (t.includes("independent")) return "construction";
  return "extension";
}

// Emoji marker on the page -> the badge label the dashboard renders.
const BADGES = {
  "🔴": "🔴 Updated", // Recently updated
  "🟢": "🟢 Latest", // Latest release
  "🟡": "🟡 Trending", // Trending
};

// ---- tiny HTML helpers (no DOM, no deps) ---------------------------------

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

// Visible text of an HTML fragment, whitespace-collapsed.
function textOf(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

// The plugin id is the token after /plugins/ in an install link.
function pluginIdFrom(html) {
  const m = html.match(/amplenote\.com\/plugins\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}
// A public note link is public.amplenote.com/<longId> (no slug). In the current
// note the long token equals the /plugins/<id> token, so it joins the tables —
// but that is not guaranteed for every link form, so timeline ids are also routed
// through an alias map (built from the Custom-URL table) before being used as keys.
function longIdFrom(html) {
  const m = html.match(/public\.amplenote\.com\/([A-Za-z0-9]{20,})/);
  return m ? m[1] : null;
}
function idFrom(html) {
  return pluginIdFrom(html) || longIdFrom(html);
}

function tables(html) {
  return [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map((m) => m[0]);
}
function rows(table) {
  return [...table.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((m) => m[0]);
}
// One shared (stateful) matcher for table cells, reused in both call sites.
// Reset lastIndex before each fresh scan since it carries the /g flag.
const CELL_RE = /<t[dh][^>]*data-column-index="(\d+)"[\s\S]*?<\/t[dh]>/g;
// Cells of a row keyed by their data-column-index (robust to layout).
function cellsByColumn(row) {
  const out = {};
  CELL_RE.lastIndex = 0;
  let m;
  while ((m = CELL_RE.exec(row))) out[Number(m[1])] = m[0];
  return out;
}
function rowIndexOf(cellOrRow) {
  const m = cellOrRow.match(/data-row-index="(\d+)"/);
  return m ? Number(m[1]) : -1;
}
function firstHref(html) {
  const m = html.match(/href="([^"]+)"/);
  return m ? m[1] : "";
}

// Pull the future-plan bullets out of the rich-text JSON that Amplenote
// stashes in the description="..." attribute of each "Plans" link.
function plansFrom(cellHtml) {
  const m = cellHtml.match(/description="([^"]*)"/);
  if (!m || !m[1]) return [];
  let json;
  try {
    json = JSON.parse(decodeEntities(m[1]));
  } catch {
    return [];
  }
  // Block-level nodes get a trailing space so multi-paragraph / hard-break
  // bullets don't collapse into "word.Nextword".
  const BLOCK = new Set([
    "paragraph", "heading", "hard_break",
    "bullet_list_item", "number_list_item", "check_list_item",
  ]);
  const collect = (node) => {
    let s = "";
    if (typeof node?.text === "string") s += node.text;
    if (Array.isArray(node?.content)) for (const c of node.content) s += collect(c);
    if (BLOCK.has(node?.type)) s += " ";
    return s;
  };
  // Each top-level list item becomes one plan line.
  return (Array.isArray(json) ? json : [])
    .map((item) => collect(item).replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

// ---- the scrape ----------------------------------------------------------

async function main() {
  const res = await fetch(SOURCE_URL, {
    headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
    signal: AbortSignal.timeout(20000), // never let a stalled connection hang CI
  });
  if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status}`);
  const html = await res.text();

  const tbls = tables(html);
  // Identify tables by their header text rather than fixed positions.
  const timelineTable = tbls.find((t) => /Last Updated On/i.test(t));
  const customTable = tbls.find((t) => /Custom URL/i.test(t));
  const groupedTable = tbls.find(
    (t) => /Managing|Independent Tools/i.test(t) && !/Last Updated On/i.test(t)
  );
  if (!timelineTable || !customTable) {
    throw new Error("Could not locate the timeline / custom-URL tables (page layout changed?)");
  }

  // master: pluginId -> aggregated record
  const byId = new Map();
  const get = (id) =>
    byId.get(id) ||
    byId.set(id, { id: null, name: "", category: "", published: "", last_updated: "", custom_url: "", install: "", plans: [], badge: "" }).get(id);
  // Any note-link token -> canonical plugin id, so the timeline always joins the
  // same record the Custom-URL table created, regardless of which link form it uses.
  const alias = new Map();

  // --- Custom URL's table: name, public custom link, install link ---
  for (const row of rows(customTable).slice(1)) {
    const c = cellsByColumn(row);
    if (!c[1] || !c[3]) continue;
    const install = firstHref(c[3]);
    const id = pluginIdFrom(install) || idFrom(c[1]);
    if (!id) continue;
    const rec = get(id);
    rec.name = textOf(c[1]);
    rec.custom_url = firstHref(c[2]) || textOf(c[2]);
    rec.install = install;
    // Register every token that points at this plugin as an alias of its id.
    alias.set(id, id);
    const lid = longIdFrom(c[1]);
    if (lid) alias.set(lid, id);
    const sm = (rec.custom_url || "").match(/public\.amplenote\.com\/([A-Za-z0-9]+)/);
    if (sm) alias.set(sm[1], id);
  }

  // --- Chronological Timeline table: id, category, dates, plans ---
  for (const row of rows(timelineTable).slice(1)) {
    const c = cellsByColumn(row);
    if (!c[1]) continue;
    const raw = idFrom(c[1]);
    if (!raw) continue;
    const id = alias.get(raw) || raw; // canonicalize to the Custom-URL table's id
    const rec = get(id);
    const num = parseInt(textOf(c[0]), 10);
    rec.id = Number.isFinite(num) ? num : rec.id;
    if (!rec.name) rec.name = textOf(c[1]);
    rec.plans = plansFrom(c[2]);
    rec.category = textOf(c[3]);
    rec.published = textOf(c[4]);
    rec.last_updated = c[5] ? textOf(c[5]) : "";
  }

  // --- Grouped by Dimensionality: 4 category cards + status badges ---
  const categories = [];
  if (groupedTable) {
    const allRows = rows(groupedTable);
    // Classify every cell: a "header" names a bucket; a "list" holds plugins.
    const headerCells = [];
    const listCells = [];
    for (const row of allRows) {
      CELL_RE.lastIndex = 0;
      let m;
      while ((m = CELL_RE.exec(row))) {
        const cell = m[0];
        const col = Number(m[1]);
        const rIdx = rowIndexOf(cell);
        // Plugin-id positions in this cell, computed once and reused below.
        const idPos = [...cell.matchAll(/amplenote\.com\/plugins\/([A-Za-z0-9]+)/g)]
          .map((x) => ({ at: x.index, id: x[1] }));
        const ids = idPos.map((p) => p.id);
        const txt = textOf(cell);
        if (ids.length >= 1) {
          listCells.push({ col, rIdx, ids, cell });
          // Badge: an emoji sitting right after a plugin's install link →
          // attribute to the nearest preceding plugin id (no re-scan per emoji).
          for (const emoji of Object.keys(BADGES)) {
            let i = cell.indexOf(emoji);
            while (i !== -1) {
              let pid = null;
              for (const p of idPos) {
                if (p.at < i) pid = p.id;
                else break;
              }
              if (pid && byId.has(pid)) byId.get(pid).badge = BADGES[emoji];
              i = cell.indexOf(emoji, i + emoji.length);
            }
          }
        } else if (/Managing|Modify|Review|Independent|Filtering|Object/i.test(txt) && txt.length < 60) {
          // Strip the heading-anchor icon's alt text ("link ") and trailing quote.
          const title = txt.replace(/^link\s+/i, "").replace(/[’'`]+$/, "").trim();
          headerCells.push({ col, rIdx, title });
        }
      }
    }
    // Pair each header with the plugin list directly below it (same column).
    for (const h of headerCells) {
      const below = listCells
        .filter((l) => l.col === h.col && l.rIdx > h.rIdx)
        .sort((a, b) => a.rIdx - b.rIdx)[0];
      if (!below) continue;
      const seen = new Set();
      const plugins = [];
      for (const pid of below.ids) {
        if (seen.has(pid) || !byId.has(pid)) continue;
        seen.add(pid);
        const rec = byId.get(pid);
        const p = { name: rec.name, link: rec.custom_url, install: rec.install };
        if (rec.badge) p.badge = rec.badge;
        plugins.push(p);
      }
      categories.push({
        id: h.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        name: h.title,
        icon: iconFor(h.title),
        plugins,
      });
    }
  }

  // --- Milestones block ---
  const milestones = [];
  const msMatch = html.match(/Milestones[:：]?\s*<\/[^>]+>([\s\S]*?)(?:<hr|<\/blockquote>)/i);
  const msText = textOf(msMatch ? msMatch[1] : "");
  const msRe = /([A-Z][a-z]+ \d+(?:st|nd|rd|th)?,? \d{4})\s*[-–]\s*([^]*?)(?=[A-Z][a-z]+ \d+(?:st|nd|rd|th)?,? \d{4}\s*[-–]|$)/g;
  let mm;
  while ((mm = msRe.exec(msText))) {
    const date = mm[1].trim();
    let event = mm[2].trim().replace(/\s+/g, " ");
    if (event) {
      // Capitalise the first letter for consistency with the dashboard.
      event = event.charAt(0).toUpperCase() + event.slice(1);
      milestones.push({ date, event });
    }
  }
  if (!milestones.length && /Milestones[:：]/i.test(html)) {
    console.warn("⚠️  'Milestones' heading is present but 0 milestones parsed — note layout may have changed.");
  }

  // --- assemble timeline (sorted by id) ---
  const timeline = [...byId.values()]
    .filter((r) => r.id != null)
    .sort((a, b) => a.id - b.id)
    .map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      published: r.published,
      last_updated: r.last_updated,
      custom_url: r.custom_url,
      install: r.install,
      plans: r.plans,
    }));

  if (!timeline.length) throw new Error("Scraped 0 plugins — aborting so we never blank the page.");

  // Categories are optional to the abort guard above, so surface a silent
  // regression (e.g. the grouped table moved/renamed) rather than shipping
  // a dashboard with zero category cards.
  if (!groupedTable) {
    console.warn("⚠️  Grouped-by-Dimensionality table not found — category cards will be empty.");
  } else if (!categories.length) {
    console.warn("⚠️  Parsed 0 categories despite a grouped table — note layout may have changed.");
  }

  const data = {
    page_title: PRESENTATION.page_title,
    hero_subtitle: PRESENTATION.hero_subtitle,
    referral_link: PRESENTATION.referral_link,
    source_url: SOURCE_URL,
    updated: new Date().toISOString(),
    categories,
    timeline,
    milestones,
    support: PRESENTATION.support,
  };

  await writeFile(OUT_FILE, toYaml(data));
  // Companion JS copy so the dashboard also renders when index.html is opened
  // directly from disk (file://), where fetch() of plugins.yaml is blocked.
  // A <script src> tag is NOT subject to that restriction, so this loads fine.
  await writeFile(
    "plugins.js",
    "// AUTO-GENERATED by scripts/fetch-plugins.mjs alongside plugins.yaml.\n" +
      "// Lets index.html work from file:// (double-click). Do not hand-edit.\n" +
      "window.__PLUGINS__ = " + JSON.stringify(data, null, 2) + ";\n"
  );
  console.log(
    `✓ Wrote ${OUT_FILE}: ${timeline.length} plugins, ${categories.length} categories, ` +
      `${milestones.length} milestones, ${timeline.filter((t) => t.last_updated).length} with updates, ` +
      `${[...byId.values()].filter((r) => r.badge).length} badged.`
  );
}

// ---- minimal YAML serializer (only what this schema needs) ---------------

function yStr(s) {
  // Double-quoted YAML scalar: escape backslash/quote, turn the common control
  // chars into their YAML escapes, and drop any other stray C0/DEL control char.
  return '"' + String(s)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/[\x00-\x1F\x7F]/g, "") + '"';
}
function toYaml(d) {
  const L = [];
  L.push("# Amplenote Plugins Data Source");
  L.push("# =========================================================================");
  L.push("# AUTO-GENERATED by scripts/fetch-plugins.mjs from the public note:");
  L.push(`#   ${d.source_url}`);
  L.push("# Do not hand-edit plugin data here — edit the Amplenote note and re-sync.");
  L.push("# (Visual chrome like hero_subtitle lives in fetch-plugins.mjs > PRESENTATION.)");
  L.push("");
  L.push(`page_title: ${yStr(d.page_title)}`);
  L.push(`hero_subtitle: ${yStr(d.hero_subtitle)}`);
  L.push(`referral_link: ${yStr(d.referral_link)}`);
  L.push(`source_url: ${yStr(d.source_url)}`);
  L.push(`updated: ${yStr(d.updated)}`);
  L.push("");
  L.push("categories:");
  for (const c of d.categories) {
    L.push(`  - id: ${yStr(c.id)}`);
    L.push(`    name: ${yStr(c.name)}`);
    L.push(`    icon: ${yStr(c.icon)}`);
    L.push("    plugins:");
    for (const p of c.plugins) {
      L.push(`      - name: ${yStr(p.name)}`);
      L.push(`        link: ${yStr(p.link)}`);
      L.push(`        install: ${yStr(p.install)}`);
      if (p.badge) L.push(`        badge: ${yStr(p.badge)}`);
    }
  }
  L.push("");
  L.push("timeline:");
  for (const t of d.timeline) {
    L.push(`  - id: ${t.id}`);
    L.push(`    name: ${yStr(t.name)}`);
    L.push(`    category: ${yStr(t.category)}`);
    L.push(`    published: ${yStr(t.published)}`);
    L.push(`    last_updated: ${yStr(t.last_updated)}`);
    L.push(`    custom_url: ${yStr(t.custom_url)}`);
    L.push(`    install: ${yStr(t.install)}`);
    if (t.plans.length) {
      L.push("    plans:");
      for (const p of t.plans) L.push(`      - ${yStr(p)}`);
    } else {
      L.push("    plans: []");
    }
  }
  L.push("");
  L.push("milestones:");
  for (const m of d.milestones) {
    L.push(`  - date: ${yStr(m.date)}`);
    L.push(`    event: ${yStr(m.event)}`);
  }
  L.push("");
  L.push("support:");
  L.push(`  text: ${yStr(d.support.text)}`);
  L.push(`  link: ${yStr(d.support.link)}`);
  L.push(`  link_label: ${yStr(d.support.link_label)}`);
  L.push("");
  return L.join("\n");
}

main().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
