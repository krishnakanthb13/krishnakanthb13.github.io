(function(){
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

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
