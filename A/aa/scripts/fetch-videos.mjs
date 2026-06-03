// ============================================================
//  Builds videos.json from your channels (channels.txt) and any
//  manual one-off links (videos.txt). Runs in GitHub Actions
//  (Node 20+, no dependencies). YouTube blocks this from the
//  browser, but server-side in the Action it works with no API key.
// ============================================================

import { readFile, writeFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (compatible; KrishnaVideoSiteBot/1.0; +https://krishnakanthb13.github.io/)";

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    // Guard against out-of-range code points (String.fromCodePoint throws on
    // e.g. &#999999999999;) so one malformed entity can't drop a whole feed.
    .replace(/&#(\d+);/g, (m, n) => { const c = Number(n); return c <= 0x10ffff ? String.fromCodePoint(c) : m; })
    .replace(/&#x([0-9a-fA-F]+);/g, (m, n) => { const c = parseInt(n, 16); return c <= 0x10ffff ? String.fromCodePoint(c) : m; })
    .replace(/&amp;/g, "&");
}

async function readLines(path) {
  try {
    const txt = await readFile(path, "utf8");
    return txt
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));
  } catch {
    return [];
  }
}

function getVideoId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

async function resolveChannelId(handleOrUrl) {
  let url = handleOrUrl;
  if (!/^https?:/i.test(url)) {
    const h = url.startsWith("@") ? url : "@" + url;
    url = "https://www.youtube.com/" + h;
  }
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
  });
  if (!res.ok) {
    // Distinguish a transient/rate-limit failure from a genuinely bad handle.
    console.warn(`⚠️  HTTP ${res.status} resolving ${handleOrUrl}`);
    return null;
  }
  const html = await res.text();
  const patterns = [
    /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})">/,
    /"channelId":"(UC[\w-]{22})"/,
    /"externalId":"(UC[\w-]{22})"/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return null;
}

function parseFeed(xml) {
  const out = [];
  const blocks = xml.split("<entry>").slice(1);
  for (const b of blocks) {
    const body = b.split("</entry>")[0];
    const pick = (re) => {
      const m = body.match(re);
      return m ? decodeEntities(m[1].trim()) : "";
    };
    const id = pick(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    if (!id) continue;
    out.push({
      id,
      title: pick(/<title>([\s\S]*?)<\/title>/),
      channel: pick(/<author>\s*<name>([\s\S]*?)<\/name>/),
      published: pick(/<published>([^<]+)<\/published>/),
      desc: pick(/<media:description>([\s\S]*?)<\/media:description>/),
      url: "https://www.youtube.com/watch?v=" + id,
    });
  }
  return out;
}

async function fetchChannelVideos(channelId) {
  const res = await fetch(
    "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId,
    { headers: { "User-Agent": UA } }
  );
  if (!res.ok) return [];
  return parseFeed(await res.text());
}

async function main() {
  const channels = await readLines("channels.txt");
  const manual = await readLines("videos.txt");
  const all = new Map(); // id -> video (first occurrence wins, dedupes overlap)

  // Resolve + fetch channels concurrently (bounded pool), but merge the results
  // in the original channels order so "first occurrence wins" stays deterministic
  // no matter which network response arrives first.
  const CONCURRENCY = 6;
  const perChannel = new Array(channels.length);
  let next = 0;
  async function worker() {
    while (next < channels.length) {
      const idx = next++;
      const ch = channels[idx];
      try {
        const cid = await resolveChannelId(ch);
        if (!cid) {
          console.warn("⚠️  Could not resolve channel:", ch);
          perChannel[idx] = [];
          continue;
        }
        const vids = await fetchChannelVideos(cid);
        console.log(`✓ ${ch} -> ${cid}  (${vids.length} videos)`);
        perChannel[idx] = vids;
      } catch (e) {
        console.warn("⚠️  Error for", ch, "-", e.message);
        perChannel[idx] = [];
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, channels.length) }, worker)
  );
  for (const vids of perChannel) {
    for (const v of vids) if (!all.has(v.id)) all.set(v.id, v);
  }

  // Manual one-off links. "url | description" — manual desc wins if provided.
  for (const line of manual) {
    const [rawUrl, ...d] = line.split("|");
    const id = getVideoId(rawUrl.trim());
    if (!id) continue;
    const desc = d.join("|").trim();
    if (all.has(id)) {
      if (desc) all.get(id).desc = desc;
    } else {
      all.set(id, {
        id,
        title: "",
        channel: "",
        published: "",
        desc,
        url: "https://www.youtube.com/watch?v=" + id,
      });
    }
  }

  const videos = [...all.values()].sort((a, b) =>
    (b.published || "").localeCompare(a.published || "")
  );

  const payload = {
    updated: new Date().toISOString(),
    count: videos.length,
    videos,
  };
  await writeFile("videos.json", JSON.stringify(payload, null, 2) + "\n");
  console.log(`\nWrote videos.json with ${videos.length} videos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
