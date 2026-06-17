(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================ DATA ============================ */
  const DATA = {
    name: "Krishna Kanth B",
    user: "krishna",
    host: "resume",
    headline: "Data & Insights Analyst — 8+ years turning complex data into decisions",
    tagline: "Ex-Amazon · Ex-Optum · Ex-Dell · Ex-J&J | SQL · Python · Tableau · Snowflake | M.Sc, VIT Vellore",
    about: "Analyst with 8+ years across data management, analysis, visualization and storytelling. Expert at extracting, transforming, analysing and reporting complex datasets into actionable insight using Excel, SQL, Python and Tableau — delivering major FTE savings and productivity gains. Strong communicator and presenter; thrives in fast-paced teams.",
    stats: [
      "8+ Years","95% KPI Automation (Amazon)","90% Latency Reduction (Optum)","~118 Hrs/Month Saved","8 Roles"
    ],
    contact: {
      email: "krishnakanthb13@gmail.com",
      phone: "+91 7667360114"
    },
    social: [
      ["LinkedIn",       "https://www.linkedin.com/in/bkrishnakanth/"],
      ["GitHub",         "https://github.com/krishnakanthb13/"],
      ["Projects",       "https://sites.google.com/view/krishnakanthb/home"],
      ["BioLink",        "https://bio.site/krishnakanthb13"],
      ["Digital Garden", "https://krishnakanthb13.vercel.app/"],
      ["Tableau Public", "https://public.tableau.com/app/profile/krishnakanthb13/vizzes"],
      ["WhatsApp",       "https://wa.me/917667360114"],
      ["Full résumé",    "../../BKK.html"]
    ],
    experience: [
      { id:"powerschool", role:"Technical Support Engineer Specialist", company:"PowerSchool (via GlowTouch)", dates:"Sep 2022 – Oct 2023",
        bullets:[
          "Enhanced ticketing & KB usage 40% across Salesforce, JIRA & Confluence.",
          "DB management with Aqua Data Studio, SSMS & Snowflake; secure remote admin via MobaXterm/SSH/Jump-box.",
          "Monitored PowerSchool Unified Insights builds; resolved data-structure issues with product/dev teams."
        ]},
      { id:"amazon", role:"Management Information Systems", company:"Amazon (3D India team)", dates:"Jul 2020 – Aug 2021",
        bullets:[
          "Automated 95% of manual KPI calculations for Stack Reports.",
          "Cut latency 99% via single-source data approach; ~118 hours/month ROI.",
          "Built 30 stored procedures + 20 events with an event/step log for troubleshooting."
        ]},
      { id:"optum", role:"Strategic Analyst", company:"Optum", dates:"May 2017 – Jan 2019",
        bullets:[
          "Automated GL Validation & Org Hierarchy via SQL stored procedures → 90% latency reduction, 50% reliability gain.",
          "Data mapping/integration for Health Quest & Atrium Health; multi-level classification + quality checks."
        ]},
      { id:"jnj", role:"Analyst I/II/III", company:"Johnson & Johnson (via GVW Technologies)", dates:"Mar 2015 – Feb 2017",
        bullets:[
          "Custom Excel macro → 70% review efficiency, 20% accuracy.",
          "LabWare LIMS V6 config for McNeil & Janssen; master data objects for Canada/Italy sites; GDP & CAPAs."
        ]},
      { id:"premier", role:"Content Analyst", company:"Premier Inc. (via Medusind)", dates:"Dec 2013 – Feb 2015",
        bullets:[
          "Healthcare master-data management; mapping/validation across vendors & catalogs.",
          "UNSPSC taxonomy; ANSI UOM validation; HIPAA; custom Excel interface tool."
        ]},
      { id:"dell", role:"Customer Care Voice Sr. Rep", company:"Dell", dates:"Jul 2013 – Dec 2013",
        bullets:[
          "Healthcare claims processing & eligibility (Conifer Health); Aetna/AARP/BCBS/Cigna; AAPC; Medicare/Medicaid; HIPAA."
        ]},
      { id:"symantec", role:"Product Support Analyst", company:"Symantec", dates:"Apr 2011 – Jul 2011",
        bullets:[
          "Norton security install/config/troubleshoot on Windows; malware removal via safe-mode; KB contributions."
        ]},
      { id:"sitel", role:"Customer Service Professional", company:"Sitel India", dates:"Sep 2010 – Mar 2011",
        bullets:[
          "Dell-On-Call tech support (laptops/desktops/networking/printers); \"Resolution Expert of the Month\" Jan 2011."
        ]}
    ],
    education: [
      { d:"M.Sc Biotechnology", s:"VIT Vellore", y:"2011–2013", g:"8.62 CGPA",
        extra:"Dissertation: CD36 Gene in Type-1 Diabetic Rat Kidneys; 3 international SET conference papers." },
      { d:"B.Sc Biotechnology", s:"D. G. Vaishnav College, University of Madras", y:"2007–2010", g:"62.80%", extra:"" },
      { d:"Schooling (PCB+Math)", s:"St. Mary's A.I.H.S.S.", y:"2007", g:"", extra:"" }
    ],
    skills: {
      "Domains": ["MIS/Org Hierarchy","SIS/EdTech","LIMS/Pharma","SCM/Healthcare"],
      "Tools":   ["SQL (SSMS, MySQL, Aqua Data, Snowflake)","Tableau","Spotfire","Looker","Power BI","Advanced Excel (Macros/Automation)","Python","LabWare LIMS"],
      "Soft":    ["communication","facilitation","presentation","conflict resolution","leadership","negotiation"]
    },
    projects: [
      ["H-1B Analysis 2025",          "https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-2025/"],
      ["H-1B Analysis Historical",    "https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-historical/"],
      ["Arattai Trend Analytics",     "https://krishnakanthb13.vercel.app/data-projects/arattai-trend-analytics/"],
      ["101 Data Projects",           "https://krishnakanthb13.vercel.app/data-projects/101-data-projects/"]
    ],
    certs: [
      ["Snowflake (multiple)",                    "https://achieve.snowflake.com/profile/krishnakanthb/wallet"],
      ["LinkedIn Licenses & Certifications",      "https://www.linkedin.com/in/bkrishnakanth/details/certifications/"],
      ["Full list",                              "../../BKK.html#certifications"]
    ],
    resumeUrl: "../../BKK.html"
  };

  /* Map "open <name>" aliases to experience ids */
  const OPEN_ALIASES = {
    powerschool:"powerschool", amazon:"amazon", optum:"optum",
    jnj:"jnj", "j&j":"jnj", johnson:"jnj", "johnson&johnson":"jnj",
    premier:"premier", dell:"dell", symantec:"symantec", sitel:"sitel",
    resume:"__resume__"
  };

  const COMMANDS = ["help","about","experience","skills","education","certs","contact","projects","social","clear","ls","whoami","sudo","open","theme","banner","date"];

  /* ============================ DOM ============================ */
  const output = document.getElementById("output");
  const screen = document.getElementById("screen");
  const form   = document.getElementById("form");
  const input  = document.getElementById("cmd");
  const caret  = document.getElementById("caret");
  const chipsEl= document.getElementById("chips");
  const themeBtn = document.getElementById("themeBtn");

  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const link = (text, href) => {
    const ext = /^https?:/i.test(href);
    return `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(text)}${ext ? ' ↗' : ''}</a>`;
  };

  /* ============================ Output / reveal ============================ */
  let lockInput = false;    // disable input while a block is revealing

  function scrollDown(){ screen.scrollTop = screen.scrollHeight; }

  // Render a chunk of HTML lines. If animate, reveal line-by-line quickly.
  function printBlock(html, {animate=true, cb=null} = {}){
    const wrapper = document.createElement("div");
    wrapper.className = "block";
    wrapper.innerHTML = html;
    output.appendChild(wrapper);

    if (reduceMotion || !animate){
      scrollDown();
      if (cb) cb();
      return;
    }
    const kids = Array.from(wrapper.children);
    kids.forEach(k => { k.style.opacity = "0"; });
    lockInput = true;
    let i = 0;
    const step = () => {
      if (i < kids.length){
        kids[i].style.transition = "opacity .12s ease";
        kids[i].style.opacity = "1";
        i++;
        scrollDown();
        setTimeout(step, 22);
      } else {
        lockInput = false;
        scrollDown();
        if (cb) cb();
      }
    };
    step();
  }

  // Typewriter for a single string of plain text (used by boot)
  function typeLine(text, el, speed, done){
    if (reduceMotion){ el.textContent = text; if(done) done(); return; }
    let i = 0;
    const t = () => {
      el.textContent = text.slice(0, i++);
      scrollDown();
      if (i <= text.length) setTimeout(t, speed);
      else if (done) done();
    };
    t();
  }

  /* ============================ Renderers ============================ */
  const HR = '<div class="line rule">────────────────────────────────────────────────────</div>';

  function bannerHTML(){
    const art =
`888  d8P  888    d8P  888888b.
888 d8P   888   d8P   888  "88b
888d8P    888  d8P    888  .88P
8888888k.  888d88K     8888888K.
888  Y88b  8888888b    888  "Y88b
888   Y88b 888  Y88b   888    888
888    Y88b888   Y88b  888   d88P
888     Y888888    Y88b8888888P"`;
    return (
      `<div class="ascii" aria-hidden="true">${esc(art)}</div>` +
      `<div class="line"><span class="bold">${esc(DATA.name)}</span> · <span class="accent">${esc(DATA.headline)}</span></div>` +
      `<div class="line muted">${esc(DATA.tagline)}</div>` +
      `<div class="line">&nbsp;</div>` +
      `<div class="line">${DATA.stats.map(s=>`<span class="stat">${esc(s)}</span>`).join("")}</div>` +
      `<div class="line muted">Type <span class="accent">help</span> to list commands. Try <span class="accent">about</span>, <span class="accent">experience</span> or <span class="accent">open amazon</span>.</div>`
    );
  }

  function helpHTML(){
    const rows = [
      ["about","Who I am — the short version"],
      ["experience","List roles. Then: experience 2 · open amazon"],
      ["skills","Tech stack, domains & soft skills"],
      ["education","Degrees & academics"],
      ["certs","Certifications & wallets"],
      ["projects","Selected data projects"],
      ["contact","Email & phone"],
      ["social","All links & profiles"],
      ["open resume","Open the full résumé ↗"],
      ["whoami","Identity"],
      ["ls","List sections"],
      ["theme","Toggle green / amber phosphor"],
      ["clear","Clear the screen"],
    ];
    let h = `<div class="line accent"># available commands</div>${HR}`;
    h += `<div class="kvs">`;
    rows.forEach(([c,d])=> h += `<span class="k">${esc(c)}</span><span class="v muted">${esc(d)}</span>`);
    h += `</div>`;
    h += `<div class="line">&nbsp;</div><div class="line muted">↑/↓ history · Tab autocomplete · or tap a chip below.</div>`;
    return h;
  }

  function aboutHTML(){
    return (
      `<div class="line accent"># about ${esc(DATA.name)}</div>${HR}` +
      `<div class="line">${esc(DATA.about)}</div>` +
      `<div class="line">&nbsp;</div>` +
      `<div class="line">${DATA.stats.map(s=>`<span class="stat">${esc(s)}</span>`).join("")}</div>`
    );
  }

  function expListHTML(){
    let h = `<div class="line accent"># experience — 8 roles (newest first)</div>${HR}`;
    DATA.experience.forEach((e,i)=>{
      h += `<div class="line"><span class="accent">[${i+1}]</span> <span class="role-h">${esc(e.role)}</span> <span class="muted">— ${esc(e.company)}</span></div>`;
      h += `<div class="line indent role-meta">${esc(e.dates)} · open with <span class="accent">experience ${i+1}</span> or <span class="accent">open ${esc(e.id)}</span></div>`;
    });
    return h;
  }

  function expOneHTML(e){
    let h = `<div class="line"><span class="role-h">${esc(e.role)}</span></div>`;
    h += `<div class="line role-meta">${esc(e.company)} · ${esc(e.dates)}</div>${HR}`;
    e.bullets.forEach(b => h += `<div class="line indent">— ${esc(b)}</div>`);
    return h;
  }

  function skillsHTML(){
    let h = `<div class="line accent"># skills</div>${HR}`;
    for (const [cat,list] of Object.entries(DATA.skills)){
      h += `<div class="line"><span class="accent">${esc(cat)}</span></div>`;
      h += `<div class="line indent">${list.map(s=>`<span class="badge">${esc(s)}</span>`).join("")}</div>`;
      h += `<div class="line">&nbsp;</div>`;
    }
    return h;
  }

  function eduHTML(){
    let h = `<div class="line accent"># education</div>${HR}`;
    DATA.education.forEach(e=>{
      h += `<div class="line"><span class="role-h">${esc(e.d)}</span>${e.g?` <span class="accent">· ${esc(e.g)}</span>`:""}</div>`;
      h += `<div class="line indent role-meta">${esc(e.s)} · ${esc(e.y)}</div>`;
      if (e.extra) h += `<div class="line indent muted">${esc(e.extra)}</div>`;
      h += `<div class="line">&nbsp;</div>`;
    });
    return h;
  }

  function certsHTML(){
    let h = `<div class="line accent"># certifications</div>${HR}`;
    DATA.certs.forEach(([t,u])=> h += `<div class="line">— ${link(t,u)}</div>`);
    return h;
  }

  function projectsHTML(){
    let h = `<div class="line accent"># selected projects</div>${HR}`;
    DATA.projects.forEach(([t,u])=> h += `<div class="line">— ${link(t,u)}</div>`);
    return h;
  }

  function contactHTML(){
    return (
      `<div class="line accent"># contact</div>${HR}` +
      `<div class="kvs">` +
        `<span class="k">email</span><span class="v">${link(DATA.contact.email,"mailto:"+DATA.contact.email)}</span>` +
        `<span class="k">phone</span><span class="v">${link(DATA.contact.phone,"tel:"+DATA.contact.phone.replace(/\s/g,""))}</span>` +
        `<span class="k">whatsapp</span><span class="v">${link("wa.me/917667360114","https://wa.me/917667360114")}</span>` +
      `</div>`
    );
  }

  function socialHTML(){
    let h = `<div class="line accent"># social & links</div>${HR}<div class="kvs">`;
    DATA.social.forEach(([t,u])=> h += `<span class="k">${esc(t.toLowerCase())}</span><span class="v">${link(u,u)}</span>`);
    h += `</div>`;
    return h;
  }

  function lsHTML(){
    const items = ["about","experience","skills","education","certs","projects","contact","social","resume.pdf"];
    return `<div class="line">${items.map(i=>`<span class="accent" style="margin-right:2ch">${esc(i)}</span>`).join("")}</div>`;
  }

  function whoamiHTML(){
    return (
      `<div class="line"><span class="accent">${esc(DATA.user)}@${esc(DATA.host)}</span></div>` +
      `<div class="line">${esc(DATA.name)} — ${esc(DATA.headline)}</div>` +
      `<div class="line muted">${esc(DATA.tagline)}</div>`
    );
  }

  function sudoHTML(){
    return (
      `<div class="line err">[sudo] password for ${esc(DATA.user)}: ********</div>` +
      `<div class="line warn">Nice try. 😄</div>` +
      `<div class="line">This visitor is not in the sudoers file. This incident will be reported... to my LinkedIn.</div>` +
      `<div class="line">&nbsp;</div>` +
      `<div class="line muted">Real talk: I don't need root to deliver impact — <span class="accent">95%</span> KPI automation, <span class="accent">90%</span> latency cuts and <span class="accent">~118 hrs/month</span> saved say enough.</div>` +
      `<div class="line">Hire me instead → ${link("LinkedIn","https://www.linkedin.com/in/bkrishnakanth/")} · ${link("email","mailto:"+DATA.contact.email)}</div>`
    );
  }

  /* ============================ Command processor ============================ */
  function echo(raw){
    const ps1 = `<span class="prompt-u">${DATA.user}</span><span class="prompt-c">@</span><span class="prompt-h">${DATA.host}</span><span class="prompt-c">:~$</span> `;
    const div = document.createElement("div");
    div.className = "line cmd-echo";
    div.innerHTML = ps1 + esc(raw);
    output.appendChild(div);
    scrollDown();
  }

  function unknown(cmd){
    return `<div class="line err">command not found: ${esc(cmd)}</div><div class="line muted">Type <span class="accent">help</span> to see what's available.</div>`;
  }

  function run(raw){
    const trimmed = raw.trim();
    if (trimmed !== "") { history.push(trimmed); histIdx = history.length; }
    echo(trimmed);
    if (trimmed === "") { return; }

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = (parts[1]||"").toLowerCase();
    const argFull = parts.slice(1).join(" ").toLowerCase();

    let html = null;

    switch(cmd){
      case "help": case "?": case "man": html = helpHTML(); break;
      case "about": case "bio": html = aboutHTML(); break;
      case "skills": case "stack": html = skillsHTML(); break;
      case "education": case "edu": html = eduHTML(); break;
      case "certs": case "certifications": case "cert": html = certsHTML(); break;
      case "projects": case "project": case "work": html = projectsHTML(); break;
      case "contact": html = contactHTML(); break;
      case "social": case "links": html = socialHTML(); break;
      case "ls": case "dir": html = lsHTML(); break;
      case "whoami": case "id": html = whoamiHTML(); break;
      case "sudo": case "su": html = sudoHTML(); break;
      case "banner": case "welcome": html = bannerHTML(); break;
      case "date": html = `<div class="line">${esc(new Date().toString())}</div>`; break;
      case "theme": case "color": toggleTheme(); html = `<div class="line ok">Phosphor set to <span class="accent">${document.body.classList.contains("amber")?"amber":"green"}</span>.</div>`; break;
      case "clear": case "cls": output.innerHTML = ""; return;

      case "experience": case "exp": case "jobs": {
        if (arg){
          const n = parseInt(arg,10);
          if (!isNaN(n) && DATA.experience[n-1]) { html = expOneHTML(DATA.experience[n-1]); }
          else {
            const id = OPEN_ALIASES[arg];
            const e = DATA.experience.find(x=>x.id===id);
            html = e ? expOneHTML(e) : `<div class="line err">No role #${esc(arg)}.</div>` + expListHTML();
          }
        } else { html = expListHTML(); }
        break;
      }

      case "open": case "cat": case "view": {
        if (!arg){ html = `<div class="line err">usage: open &lt;resume | company&gt;</div><div class="line muted">e.g. <span class="accent">open resume</span>, <span class="accent">open amazon</span></div>`; break; }
        const target = OPEN_ALIASES[argFull] || OPEN_ALIASES[arg];
        if (target === "__resume__"){
          html = `<div class="line ok">Opening full résumé → ${link(DATA.resumeUrl, DATA.resumeUrl)}</div>`;
          window.open(DATA.resumeUrl, "_self");
        } else if (target){
          const e = DATA.experience.find(x=>x.id===target);
          html = e ? expOneHTML(e) : unknown(arg);
        } else {
          html = `<div class="line err">cannot open: ${esc(arg)}</div><div class="line muted">Try <span class="accent">open resume</span> or a company like <span class="accent">open optum</span>.</div>`;
        }
        break;
      }

      case "exit": case "quit": case "logout":
        html = `<div class="line muted">There's no escape — but you can <span class="accent">open resume</span> or reach out via <span class="accent">contact</span>. 🙂</div>`;
        break;

      default:
        html = unknown(cmd);
    }

    if (html != null) printBlock(html);
  }

  /* ============================ Input handling ============================ */
  const history = [];
  let histIdx = 0;

  function updateCaret(){
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre";
    span.style.font = getComputedStyle(input).font;
    span.textContent = input.value || "";
    document.body.appendChild(span);
    const w = span.getBoundingClientRect().width;
    document.body.removeChild(span);
    const max = input.clientWidth - 9;
    caret.style.left = Math.min(w, max) + "px";
  }

  input.addEventListener("input", updateCaret);
  input.addEventListener("focus", ()=> caret.style.display="block");
  input.addEventListener("blur", ()=> caret.style.display="none");

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if (lockInput) return;
    const v = input.value;
    input.value = "";
    updateCaret();
    run(v);
  });

  input.addEventListener("keydown", (e)=>{
    if (e.key === "ArrowUp"){
      e.preventDefault();
      if (history.length){ histIdx = Math.max(0, histIdx-1); input.value = history[histIdx] || ""; setTimeout(updateCaret); moveCaretEnd(); }
    } else if (e.key === "ArrowDown"){
      e.preventDefault();
      if (history.length){ histIdx = Math.min(history.length, histIdx+1); input.value = history[histIdx] || ""; setTimeout(updateCaret); moveCaretEnd(); }
    } else if (e.key === "Tab"){
      e.preventDefault();
      autocomplete();
    } else if (e.key === "l" && e.ctrlKey){
      e.preventDefault(); output.innerHTML = "";
    }
  });

  function moveCaretEnd(){
    const len = input.value.length;
    requestAnimationFrame(()=> { try{ input.setSelectionRange(len, len); }catch(_){} });
  }

  function autocomplete(){
    const val = input.value.trim().toLowerCase();
    if (!val) { input.value = "help"; updateCaret(); return; }
    const parts = val.split(/\s+/);
    if (parts.length > 1 && (parts[0]==="open" || parts[0]==="experience" || parts[0]==="exp")){
      const pool = Object.keys(OPEN_ALIASES);
      const m = pool.filter(c=>c.startsWith(parts[1]));
      if (m.length===1){ input.value = parts[0]+" "+m[0]; updateCaret(); return; }
      if (m.length>1){ printBlock(`<div class="line muted">${m.join("   ")}</div>`); return; }
    }
    const matches = COMMANDS.filter(c=>c.startsWith(parts[0]));
    if (matches.length===1){ input.value = matches[0]+" "; updateCaret(); }
    else if (matches.length>1){ printBlock(`<div class="line muted">${matches.join("   ")}</div>`); }
  }

  /* Chips */
  const CHIP_CMDS = ["help","about","experience","skills","projects","education","certs","contact","social","open resume","sudo","clear"];
  CHIP_CMDS.forEach(c=>{
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = c;
    b.addEventListener("click", ()=>{
      if (lockInput) return;
      input.value = "";
      input.focus();
      run(c);
    });
    chipsEl.appendChild(b);
  });

  /* Focus input when tapping anywhere on the terminal (mobile-friendly) */
  document.getElementById("terminal").addEventListener("click", (e)=>{
    if (e.target.closest("a, button, input")) return;
    const sel = window.getSelection();
    if (sel && sel.toString().length) return;
    input.focus();
  });

  /* Theme toggle */
  function toggleTheme(){
    const amber = document.body.classList.toggle("amber");
    themeBtn.textContent = amber ? "green ◑" : "amber ◐";
    themeBtn.setAttribute("aria-pressed", String(amber));
  }
  themeBtn.addEventListener("click", toggleTheme);

  /* ============================ Boot sequence ============================ */
  const bootLines = [
    "krishna-os v8.0 — booting career kernel…",
    "[ ok ] mounting /experience (8 roles)",
    "[ ok ] loading skills: SQL · Python · Tableau · Snowflake",
    "[ ok ] initializing impact engine: 95% automation, 90% latency cut",
    "[ ok ] establishing secure shell to krishna@resume",
    "ready."
  ];

  function boot(){
    if (reduceMotion){
      bootLines.forEach(l=>{
        const d = document.createElement("div");
        d.className = "line " + (l.startsWith("[ ok ]") ? "ok" : "muted");
        d.textContent = l;
        output.appendChild(d);
      });
      printBlock(bannerHTML(), {animate:false});
      finishBoot();
      return;
    }
    lockInput = true;
    let i = 0;
    const next = () => {
      if (i < bootLines.length){
        const d = document.createElement("div");
        d.className = "line " + (bootLines[i].startsWith("[ ok ]") ? "ok" : "muted");
        output.appendChild(d);
        typeLine(bootLines[i], d, 8, ()=>{ i++; setTimeout(next, 90); });
      } else {
        setTimeout(()=>{
          printBlock(bannerHTML(), {animate:true, cb:finishBoot});
        }, 150);
      }
    };
    next();
  }

  function finishBoot(){
    lockInput = false;
    input.focus();
    updateCaret();
  }

  boot();
})();
