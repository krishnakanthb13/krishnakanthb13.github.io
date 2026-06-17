(function(){
  "use strict";
  var root=document.documentElement;
  var btn=document.getElementById('themeBtn');
  var KEY='kkb-theme';
  var media=window.matchMedia('(prefers-color-scheme: dark)');

  function apply(t){
    root.setAttribute('data-theme',t);
    var dark=t==='dark';
    btn.setAttribute('aria-pressed',String(dark));
    btn.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
  }
  var saved=null;
  try{saved=localStorage.getItem(KEY);}catch(e){}
  apply(saved||(media.matches?'dark':'light'));

  btn.addEventListener('click',function(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    apply(next);
    try{localStorage.setItem(KEY,next);}catch(e){}
  });
  media.addEventListener('change',function(e){
    var hasSaved=false;
    try{hasSaved=!!localStorage.getItem(KEY);}catch(err){}
    if(!hasSaved)apply(e.matches?'dark':'light');
  });

  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el){
    var to=parseFloat(el.getAttribute('data-to'))||0;
    var suf=el.getAttribute('data-suffix')||'';
    if(reduce){
      el.textContent=to+'';
      if(suf){el.insertAdjacentHTML('beforeend','<span class="suf">'+suf+'</span>');}
      return;
    }
    var dur=1200,start=null;
    function step(ts){
      if(!start)start=ts;
      var p=Math.min((ts-start)/dur,1);
      var eased=1-Math.pow(1-p,3);
      el.textContent=Math.round(to*eased);
      if(p<1){requestAnimationFrame(step);}
      else if(suf){el.insertAdjacentHTML('beforeend','<span class="suf">'+suf+'</span>');}
    }
    requestAnimationFrame(step);
  }

  function fillSkills(scope){
    var bars=scope.querySelectorAll('.skill');
    bars.forEach(function(s){
      var pct=s.getAttribute('data-pct');
      var i=s.querySelector('.bar i');
      if(i)i.style.width=pct+'%';
    });
  }

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting)return;
        var t=en.target;
        t.classList.add('in');
        t.querySelectorAll('.cu').forEach(countUp);
        if(t.querySelector('.skill'))fillSkills(t);
        io.unobserve(t);
      });
    },{threshold:.18,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
    document.querySelectorAll('.cu').forEach(countUp);
    var sw=document.getElementById('skillWrap');
    if(sw)fillSkills(sw);
  }
})();
