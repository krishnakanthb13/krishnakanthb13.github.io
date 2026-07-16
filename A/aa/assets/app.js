// ============================================================
//  Krishna Kanth B — video hub
//  Prefers the auto-generated videos.json (built by the GitHub
//  Action from your channels' RSS feeds). Falls back to
//  videos.txt if videos.json isn't there yet (e.g. local preview
//  before the Action has run). You normally never edit this file.
// ============================================================

const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");
const updatedEl = document.getElementById("updated");
const countEl = document.getElementById("count");
const navbar = document.getElementById("navbar");
document.getElementById("year").textContent = new Date().getFullYear();

// --- Navbar: solidify on scroll -----------------------------------
function onScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// --- Scroll-reveal for cards --------------------------------------
const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, obs) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              obs.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
      )
    : null;

// --- Helpers ------------------------------------------------------
function getVideoId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// --- Data sources -------------------------------------------------
async function loadFromJson() {
  const res = await fetch("videos.json?ts=" + Date.now());
  if (!res.ok) throw new Error("no json");
  const data = await res.json();
  if (!data.videos || !data.videos.length) throw new Error("empty json");
  if (updatedEl && data.updated) {
    const d = new Date(data.updated);
    if (!isNaN(d)) updatedEl.textContent = "Last synced: " + d.toLocaleString();
  }
  return data.videos;
}

async function loadFromTxt() {
  const res = await fetch("videos.txt?ts=" + Date.now());
  if (!res.ok) throw new Error("no txt");
  const text = await res.text();
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((line) => {
      const [rawUrl, ...d] = line.split("|");
      const url = rawUrl.trim();
      const id = getVideoId(url);
      return id ? { id, url, title: "", channel: "", desc: d.join("|").trim() } : null;
    })
    .filter(Boolean);
}

// Fetch a title from YouTube without an API key (used only in txt fallback).
async function fetchTitle(id) {
  try {
    const url = "https://www.youtube.com/watch?v=" + id;
    const res = await fetch(
      "https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(url)
    );
    if (!res.ok) return null;
    return (await res.json()).title || null;
  } catch {
    return null;
  }
}

// --- Rendering ----------------------------------------------------
function renderSkeletons(n) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton";
    sk.innerHTML =
      '<div class="sk-thumb"></div><div class="sk-line"></div><div class="sk-line short"></div><div style="height:14px"></div>';
    frag.appendChild(sk);
  }
  grid.appendChild(frag);
}

function buildCard(video) {
  const card = document.createElement("article");
  card.className = "card";

  const thumb = document.createElement("div");
  thumb.className = "thumb";
  thumb.setAttribute("role", "button");
  thumb.setAttribute("tabindex", "0");
  thumb.setAttribute("aria-label", "Play video");

  const img = document.createElement("img");
  img.className = "thumb-img";
  img.loading = "lazy";
  img.alt = "";
  img.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  // If the hq thumbnail is missing, fall back to the standard one.
  img.addEventListener("error", () => {
    img.src = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;
  }, { once: true });

  const play = document.createElement("span");
  play.className = "play-btn";
  thumb.append(img, play);

  const playVideo = () => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`;
    iframe.title = video.title || "YouTube video";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    thumb.replaceWith(iframe);
    // Keep keyboard focus on the activated control instead of resetting to <body>.
    iframe.setAttribute("tabindex", "-1");
    iframe.focus();
  };
  thumb.addEventListener("click", playVideo);
  thumb.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playVideo();
    }
  });

  const body = document.createElement("div");
  body.className = "card-body";

  if (video.channel) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = video.channel;
    body.appendChild(badge);
  }

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = video.title || "Loading title…";
  body.appendChild(title);

  if (video.desc) {
    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = video.desc;
    body.appendChild(desc);

    const more = document.createElement("button");
    more.className = "more-btn";
    more.textContent = "Show more";
    more.addEventListener("click", () => {
      const expanded = desc.classList.toggle("expanded");
      more.textContent = expanded ? "Show less" : "Show more";
    });
    // Decide if the description overflows its 3-line clamp. Measure on the next
    // frame, then re-check once web fonts have loaded (their metrics differ from
    // the fallback font and can change whether the clamp overflows).
    const measureOverflow = () => {
      if (!more.isConnected && desc.scrollHeight > desc.clientHeight + 4) body.appendChild(more);
    };
    requestAnimationFrame(measureOverflow);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureOverflow);
  }

  card.append(thumb, body);

  if (!video.title) {
    fetchTitle(video.id).then((t) => {
      title.textContent = t || "Watch on YouTube";
    });
  }

  return card;
}

// --- Boot ---------------------------------------------------------
async function init() {
  statusEl.textContent = "";
  renderSkeletons(6);

  let videos;
  try {
    videos = await loadFromJson();
  } catch {
    try {
      videos = await loadFromTxt();
    } catch {
      grid.innerHTML = "";
      statusEl.className = "error";
      statusEl.textContent =
        "Couldn't load videos. The site auto-fills once the GitHub Action runs.";
      return;
    }
  }

  grid.innerHTML = "";
  statusEl.remove();

  if (!videos.length) {
    // Use innerHTML (not outerHTML) so #grid and its aria-live region survive,
    // letting screen readers announce the empty-state message.
    grid.innerHTML =
      '<p class="empty">No videos yet. Add a channel to <code>channels.txt</code> or a link to <code>videos.txt</code>.</p>';
    return;
  }

  if (countEl) {
    countEl.textContent = videos.length + (videos.length === 1 ? " video" : " videos");
    countEl.hidden = false;
  }

  for (const v of videos) {
    const card = buildCard(v);
    grid.appendChild(card);
    if (revealObserver) revealObserver.observe(card);
    else card.classList.add("in");
  }
}

init();
