(function(){
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* THEME SWITCHER — System / Light / Dark */
  (function(){
    var root = document.documentElement;
    var group = document.getElementById("theme");
    if (!group) return;
    var btns = Array.prototype.slice.call(group.querySelectorAll(".theme__btn"));
    var media = window.matchMedia("(prefers-color-scheme: dark)");
    var STORE = "kkb-theme";

    function currentChoice(){
      try { return localStorage.getItem(STORE) || "system"; } catch(e){ return "system"; }
    }
    function apply(choice){
      var dark = choice === "dark" || (choice === "system" && media.matches);
      root.setAttribute("data-theme", dark ? "dark" : "light");
      root.setAttribute("data-theme-choice", choice);
      btns.forEach(function(b){
        b.setAttribute("aria-checked", b.getAttribute("data-theme-val") === choice ? "true" : "false");
      });
    }
    function set(choice){
      try { localStorage.setItem(STORE, choice); } catch(e){}
      apply(choice);
    }

    apply(currentChoice());

    btns.forEach(function(b, i){
      b.addEventListener("click", function(){ set(b.getAttribute("data-theme-val")); });
      // arrow-key navigation within the radiogroup
      b.addEventListener("keydown", function(e){
        var k = e.key, n = null;
        if (k === "ArrowRight" || k === "ArrowDown") n = (i + 1) % btns.length;
        else if (k === "ArrowLeft" || k === "ArrowUp") n = (i - 1 + btns.length) % btns.length;
        else return;
        e.preventDefault();
        btns[n].focus();
        set(btns[n].getAttribute("data-theme-val"));
      });
    });

    // react to OS changes only while in "system" mode
    var onMedia = function(){ if (currentChoice() === "system") apply("system"); };
    if (media.addEventListener) media.addEventListener("change", onMedia);
    else if (media.addListener) media.addListener(onMedia);
  })();

  /* BACK TO TOP */
  (function(){
    var btn = document.getElementById("toTop");
    if (!btn) return;
    var shown = false;
    function check(){
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var want = y > 600;
      if (want !== shown){ shown = want; btn.classList.toggle("is-visible", want); }
    }
    window.addEventListener("scroll", check, {passive:true});
    check();
    btn.addEventListener("click", function(){
      window.scrollTo({ top:0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  })();

  var bar = document.getElementById("bar");
  var ticking = false;
  function updateProgress(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var top = h.scrollTop || document.body.scrollTop;
    var pct = max > 0 ? (top / max) * 100 : 0;
    if (bar) bar.style.width = pct.toFixed(2) + "%";
    ticking = false;
  }
  window.addEventListener("scroll", function(){
    if (!ticking){ window.requestAnimationFrame(updateProgress); ticking = true; }
  }, {passive:true});
  window.addEventListener("resize", updateProgress, {passive:true});
  updateProgress();

  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)){
    revealEls.forEach(function(el){ el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.14, rootMargin:"0px 0px -8% 0px"});
    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* Graceful logo fallback — if an image fails, show the company initial */
  Array.prototype.forEach.call(document.querySelectorAll(".logo-chip img"), function(img){
    img.addEventListener("error", function(){
      var chip = img.parentNode;
      if (chip && chip.className === "logo-chip"){
        chip.style.background = "var(--accent)";
        chip.style.padding = "0";
        var t = document.createElement("span");
        t.textContent = (img.alt || "?").trim().charAt(0).toUpperCase();
        t.style.cssText = "font-family:var(--serif);color:#fff;font-size:1.6rem;font-weight:600;";
        chip.innerHTML = "";
        chip.appendChild(t);
      }
    });
  });
})();
