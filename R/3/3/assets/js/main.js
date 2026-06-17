(function(){
  "use strict";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ICONS ---------- */
  var I = {
    about:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/></svg>',
    exp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    edu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9 12 4l10 5-10 5L2 9Z"/><path d="M6 11v5c0 1 2.5 3 6 3s6-2 6-3v-5"/></svg>',
    skill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5"/><path d="M4 19h16"/><rect x="7" y="11" width="3" height="5"/><rect x="12" y="7" width="3" height="9"/><rect x="17" y="13" width="3" height="3"/></svg>',
    cert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/></svg>',
    proj:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
    contact:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="m4 7 8 6 8-6"/></svg>',
    resume:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4"/><path d="M9 13h6M9 17h6"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.2 2.2Z"/></svg>',
    wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-4-4.6-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.7-.1 1.2Z"/></svg>',
    in:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.1c0-1.22-.02-2.8-1.7-2.8s-1.97 1.32-1.97 2.7V21H9z"/></svg>',
    gh:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
    bio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1"/></svg>',
    tab:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M8 13h13"/></svg>',
    go:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    backchev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    resumeMini:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4"/></svg>'
  };
  var RESUME='../../../BKK.html';

  /* ---------- DATA ---------- */
  var apps=[
    {id:'about',label:'About',ic:'about',cls:'g-about'},
    {id:'experience',label:'Experience',ic:'exp',cls:'g-exp'},
    {id:'education',label:'Education',ic:'edu',cls:'g-edu'},
    {id:'skills',label:'Skills',ic:'skill',cls:'g-skill'},
    {id:'certifications',label:'Certs',ic:'cert',cls:'g-cert'},
    {id:'projects',label:'Projects',ic:'proj',cls:'g-proj'},
    {id:'contact',label:'Contact',ic:'contact',cls:'g-contact'},
    {id:'_resume',label:'Résumé',ic:'resume',cls:'g-resume',href:RESUME,ext:true}
  ];
  var dockApps=['about','experience','skills','contact'];

  var experience=[
    {role:'Technical Support Engineer Specialist',co:'PowerSchool',client:'via GlowTouch',date:'Sep 2022 – Oct 2023',badge:'PS',
     detail:'Lifted ticketing &amp; KB usage by +40% across Salesforce, JIRA and Confluence; handled database management via Aqua Data Studio, SSMS and Snowflake.'},
    {role:'Management Information Systems',co:'Amazon',client:'3D India',date:'Jul 2020 – Aug 2021',badge:'AZ',
     detail:'Automated 95% of KPI calculations and cut report latency by 99%, delivering ~118 hrs/month in ROI.'},
    {role:'Strategic Analyst',co:'Optum',client:'',date:'May 2017 – Jan 2019',badge:'OP',
     detail:'Automated GL Validation &amp; Org Hierarchy with SQL — latency down 90% and reliability up 50%.'},
    {role:'Analyst I / II / III',co:'Johnson &amp; Johnson',client:'via GVW Technologies',date:'Mar 2015 – Feb 2017',badge:'JJ',
     detail:'Built an Excel macro that sped review by +70% and lifted accuracy +20%; worked extensively in LabWare LIMS V6.'},
    {role:'Content Analyst',co:'Premier Inc.',client:'via Medusind',date:'Dec 2013 – Feb 2015',badge:'PR',
     detail:'Healthcare master-data management across UNSPSC taxonomy with HIPAA compliance.'},
    {role:'Customer Care Voice Sr. Rep',co:'Dell',client:'',date:'Jul 2013 – Dec 2013',badge:'DL',
     detail:'Processed healthcare claims &amp; eligibility (Conifer) across Medicare and Medicaid.'},
    {role:'Product Support Analyst',co:'Symantec',client:'',date:'Apr 2011 – Jul 2011',badge:'SY',
     detail:'Norton support — malware removal and knowledge-base contributions.'},
    {role:'Customer Service Professional',co:'Sitel India',client:'',date:'Sep 2010 – Mar 2011',badge:'SI',
     detail:'Dell-On-Call support; named “Resolution Expert of the Month”, Jan 2011.'}
  ];
  var skillBars=[['SQL',95],['Tableau',90],['Advanced Excel',95],['Snowflake',85],['Python',75]];
  var skillChips=['SSMS','MySQL','Aqua Data','Snowflake','Spotfire','Looker','Power BI','Excel Macros','Python','LabWare LIMS'];
  var domains=['MIS / Org Hierarchy','SIS / EdTech','LIMS / Pharma','SCM / Healthcare'];
  var education=[
    {deg:'M.Sc Biotechnology',co:'VIT Vellore',date:'2011 – 2013 · 8.62 CGPA',
     detail:'Dissertation: CD36 Gene in Type-1 Diabetic Rat Kidneys · 3 international SET papers.'},
    {deg:'B.Sc Biotechnology',co:'D. G. Vaishnav College, Univ. of Madras',date:'2007 – 2010 · 62.80%',detail:''},
    {deg:'Schooling',co:"St. Mary's A.I.H.S.S.",date:'2007',detail:''}
  ];
  var certs=[
    {t:'Snowflake Certifications',s:'achieve.snowflake.com',href:'https://achieve.snowflake.com/profile/krishnakanthb/wallet',cls:'b-cert',ic:'cert',ext:true},
    {t:'LinkedIn Licenses &amp; Certs',s:'linkedin.com/in/bkrishnakanth',href:'https://www.linkedin.com/in/bkrishnakanth/details/certifications/',cls:'b-in',ic:'in',ext:true},
    {t:'Full certification list',s:'BKK.html#certifications',href:RESUME+'#certifications',cls:'b-doc',ic:'resume'}
  ];
  var projects=[
    {t:'H-1B Analysis 2025',s:'Visa trend deep-dive',href:'https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-2025/'},
    {t:'H-1B Analysis Historical',s:'Longitudinal study',href:'https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-historical/'},
    {t:'Arattai Trend Analytics',s:'Social trend analytics',href:'https://krishnakanthb13.vercel.app/data-projects/arattai-trend-analytics/'},
    {t:'101 Data Projects',s:'Portfolio collection',href:'https://krishnakanthb13.vercel.app/data-projects/101-data-projects/'}
  ];
  var contacts=[
    {t:'Email',s:'krishnakanthb13@gmail.com',href:'mailto:krishnakanthb13@gmail.com',cls:'b-mail',ic:'mail'},
    {t:'Call',s:'+91 7667360114',href:'tel:+917667360114',cls:'b-phone',ic:'phone'},
    {t:'WhatsApp',s:'+91 7667360114',href:'https://wa.me/917667360114',cls:'b-wa',ic:'wa',ext:true},
    {t:'LinkedIn',s:'in/bkrishnakanth',href:'https://www.linkedin.com/in/bkrishnakanth/',cls:'b-in',ic:'in',ext:true},
    {t:'GitHub',s:'github.com/krishnakanthb13',href:'https://github.com/krishnakanthb13/',cls:'b-gh',ic:'gh',ext:true},
    {t:'BioLink',s:'bio.site/krishnakanthb13',href:'https://bio.site/krishnakanthb13',cls:'b-bio',ic:'bio',ext:true},
    {t:'Projects Site',s:'sites.google.com/view/krishnakanthb',href:'https://sites.google.com/view/krishnakanthb/home',cls:'b-proj',ic:'proj',ext:true},
    {t:'Digital Garden',s:'krishnakanthb13.vercel.app',href:'https://krishnakanthb13.vercel.app/',cls:'b-bio',ic:'bio',ext:true},
    {t:'Tableau Public',s:'public.tableau.com',href:'https://public.tableau.com/app/profile/krishnakanthb13/vizzes',cls:'b-tab',ic:'tab',ext:true}
  ];
  var titles={about:'About',experience:'Experience',education:'Education',skills:'Skills',certifications:'Certifications',projects:'Projects',contact:'Contact'};

  /* ---------- HELPERS ---------- */
  function navbar(id){
    return '<div class="navbar"><button class="back" type="button" aria-label="Back to home">'+I.backchev+'Home</button>'+
      '<span class="nav-title">'+titles[id]+'</span>'+
      '<a class="nav-ext nav-spacer" href="'+RESUME+'" aria-label="Open full résumé">CV</a></div>';
  }
  function linkRow(c){
    var ext = c.ext ? ' target="_blank" rel="noopener"' : '';
    return '<a class="lrow" href="'+c.href+'"'+ext+' aria-label="'+c.t.replace(/&amp;/g,'and')+'">'+
      '<span class="li '+c.cls+'" aria-hidden="true">'+I[c.ic]+'</span>'+
      '<span class="t"><b>'+c.t+'</b><span>'+c.s+'</span></span>'+
      '<span class="go" aria-hidden="true">'+I.go+'</span></a>';
  }

  /* ---------- PAGE BUILDERS ---------- */
  function buildAbout(){
    var stats=[['8+','Years experience'],['95%','KPI automation'],['90%','Latency reduction'],['~118','Hrs/month saved'],['8','Career roles'],['M.Sc','VIT Vellore']];
    var s='<div class="page-head"><h2 tabindex="-1">About</h2><p>Data &amp; Insights Analyst</p></div>';
    s+='<div class="card"><p>Analyst with 8+ years across data management, analysis, visualization and storytelling — turning complex datasets into actionable insight with Excel, SQL, Python and Tableau, delivering major FTE savings and productivity gains.</p></div>';
    s+='<div class="stats">';
    stats.forEach(function(x){s+='<div class="stat"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';});
    s+='</div>';
    s+='<p class="tagline">Ex-Amazon · Ex-Optum · Ex-Dell · Ex-J&amp;J</p>';
    return s;
  }
  function buildExperience(){
    var s='<div class="page-head"><h2 tabindex="-1">Experience</h2><p>Tap a role to expand details</p></div>';
    experience.forEach(function(x,i){
      s+='<div class="xp" data-xp="'+i+'"><button class="xp-btn" type="button" aria-expanded="false" aria-controls="xpb'+i+'">'+
        '<span class="xp-logo" aria-hidden="true">'+x.badge+'</span>'+
        '<span class="xp-meta"><h3>'+x.role+'</h3><span class="co">'+x.co+(x.client?' · '+x.client:'')+'</span><span class="date">'+x.date+'</span></span>'+
        '<span class="chev" aria-hidden="true">'+I.chev+'</span></button>'+
        '<div class="xp-body" id="xpb'+i+'"><p>'+x.detail+'</p></div></div>';
    });
    return s;
  }
  function buildEducation(){
    var s='<div class="page-head"><h2 tabindex="-1">Education</h2><p>Academic background</p></div><div class="card">';
    education.forEach(function(x){
      s+='<div class="edu"><span class="dot" aria-hidden="true"><i></i><span class="ln"></span></span>'+
        '<span class="body"><h3>'+x.deg+'</h3><span class="co">'+x.co+'</span><div class="date">'+x.date+'</div>'+
        (x.detail?'<p>'+x.detail+'</p>':'')+'</span></div>';
    });
    s+='</div>';
    return s;
  }
  function buildSkills(){
    var s='<div class="page-head"><h2 tabindex="-1">Skills</h2><p>Tools, languages &amp; domains</p></div><div class="card">';
    skillBars.forEach(function(x){
      s+='<div class="skill-row"><div class="top"><span>'+x[0]+'</span><span>'+x[1]+'%</span></div>'+
        '<div class="bar"><i data-w="'+x[1]+'"></i></div></div>';
    });
    s+='</div>';
    s+='<div class="sub-h">Toolbox</div><div class="chips">';
    skillChips.forEach(function(c){s+='<span class="chip">'+c+'</span>';});
    s+='</div><div class="sub-h">Domains</div><div class="chips">';
    domains.forEach(function(c){s+='<span class="chip">'+c+'</span>';});
    s+='</div>';
    return s;
  }
  function buildCerts(){
    var s='<div class="page-head"><h2 tabindex="-1">Certifications</h2><p>Verified credentials</p></div>';
    certs.forEach(function(c){s+=linkRow(c);});
    return s;
  }
  function buildProjects(){
    var s='<div class="page-head"><h2 tabindex="-1">Projects</h2><p>Selected data work</p></div>';
    projects.forEach(function(p){s+=linkRow({t:p.t,s:p.s,href:p.href,cls:'b-proj',ic:'proj',ext:true});});
    return s;
  }
  function buildContact(){
    var s='<div class="page-head"><h2 tabindex="-1">Contact</h2><p>Let’s connect</p></div>';
    contacts.forEach(function(c){s+=linkRow(c);});
    s+='<a class="cta" href="'+RESUME+'">'+I.resumeMini+' View full résumé</a>';
    return s;
  }
  var builders={about:buildAbout,experience:buildExperience,education:buildEducation,skills:buildSkills,certifications:buildCerts,projects:buildProjects,contact:buildContact};

  /* ---------- RENDER HOME ICONS ---------- */
  function iconBtn(a){
    var inner='<span class="ic '+a.cls+'" aria-hidden="true">'+I[a.ic]+'</span><span class="lbl">'+a.label+'</span>';
    if(a.href){
      var ext=a.ext?' target="_blank" rel="noopener"':'';
      return '<a class="app" href="'+a.href+'"'+ext+' aria-label="'+a.label+' (opens full résumé)">'+inner+'</a>';
    }
    return '<button class="app" type="button" data-open="'+a.id+'" aria-label="Open '+a.label+'">'+inner+'</button>';
  }
  document.getElementById('appgrid').innerHTML=apps.map(iconBtn).join('');
  document.getElementById('dock').innerHTML=apps.filter(function(a){return dockApps.indexOf(a.id)>-1;}).map(iconBtn).join('');

  /* ---------- NAVIGATION ---------- */
  var home=document.getElementById('home');
  var current='home';
  var built={};
  var statusbar=document.getElementById('statusbar');
  var homeInd=document.querySelector('.home-ind');
  var animating=false;

  function pageEl(id){return document.getElementById('page-'+id);}

  function ensureBuilt(id){
    if(built[id])return;
    var el=pageEl(id);
    el.innerHTML=navbar(id)+'<div class="page-scroll">'+builders[id]()+'</div>';
    el.querySelector('.back').addEventListener('click',goHome);
    if(id==='experience'){
      el.querySelectorAll('.xp-btn').forEach(function(b){
        b.addEventListener('click',function(){
          var xp=b.parentNode, body=xp.querySelector('.xp-body');
          var open=xp.classList.toggle('open');
          b.setAttribute('aria-expanded',open?'true':'false');
          body.style.maxHeight=open?(body.scrollHeight+'px'):'0px';
        });
      });
    }
    built[id]=true;
  }

  function animateBars(id){
    if(id!=='skills')return;
    var bars=pageEl('skills').querySelectorAll('.bar i');
    setTimeout(function(){bars.forEach(function(b){b.style.width=b.getAttribute('data-w')+'%';});},reduce?0:140);
  }

  function setChrome(onHome){
    statusbar.classList.toggle('dark',onHome);
    homeInd.classList.toggle('light',onHome);
  }

  function focusView(el){
    var h=el.querySelector('h2,.nav-title');
    if(h){try{h.focus({preventScroll:true});}catch(e){h.focus();}}
  }

  function navigate(id,back){
    if(id===current)return;
    var to = id==='home'?home:pageEl(id);
    var from = current==='home'?home:pageEl(current);
    if(id!=='home')ensureBuilt(id);

    setChrome(id==='home');
    to.hidden=false;
    var scroller=to.querySelector('.page-scroll,.home-scroll');
    if(scroller)scroller.scrollTop=0;

    if(reduce||animating){
      to.classList.remove('enter','leave','enter-back','leave-back');
      from.classList.remove('enter','leave','enter-back','leave-back');
      from.hidden=true;
      current=id;updateTabs();animateBars(id);if(id!=='home')focusView(to);
      animating=false;
      return;
    }
    animating=true;
    var enterCls=back?'enter-back':'enter';
    var leaveCls=back?'leave-back':'leave';
    to.classList.add(enterCls);
    from.classList.add(leaveCls);
    var finished=function(){
      to.classList.remove(enterCls);
      from.classList.remove(leaveCls);
      from.hidden=true;
      animating=false;
    };
    var ended=false;
    var onEnd=function(){if(ended)return;ended=true;to.removeEventListener('animationend',onEnd);finished();};
    to.addEventListener('animationend',onEnd);
    setTimeout(onEnd,520);
    current=id;
    updateTabs();
    animateBars(id);
    if(id!=='home')focusView(to);
  }

  function openPage(id){ if(id!==current) location.hash=id; }
  function goHome(){ if(location.hash) location.hash=''; else navigate('home',true); }

  /* tab bar */
  var tabIds={home:1,experience:1,skills:1,contact:1};
  function updateTabs(){
    document.querySelectorAll('.tab').forEach(function(t){
      t.setAttribute('aria-selected', t.dataset.tab===current ? 'true':'false');
    });
  }

  /* ---------- EVENTS ---------- */
  document.body.addEventListener('click',function(e){
    var b=e.target.closest('[data-open]');
    if(b)openPage(b.getAttribute('data-open'));
  });
  document.querySelectorAll('.tab').forEach(function(t){
    t.addEventListener('click',function(){
      var id=t.dataset.tab;
      if(id==='home')goHome();else openPage(id);
    });
  });

  function fromHash(){
    var h=(location.hash||'').replace('#','');
    if(builders[h])navigate(h,false);
    else navigate('home',true);
  }
  window.addEventListener('hashchange',fromHash);

  /* ---------- CLOCK ---------- */
  function tick(){
    var d=new Date(),h=d.getHours(),m=d.getMinutes();
    document.getElementById('clock').textContent=((h%12)||12)+':'+(m<10?'0'+m:m);
  }
  tick();setInterval(tick,15000);

  /* ---------- SPLASH ---------- */
  var splash=document.getElementById('splash');
  setTimeout(function(){splash.classList.add('hide');},reduce?300:1300);
  setTimeout(function(){if(splash.parentNode)splash.parentNode.removeChild(splash);},reduce?700:2100);

  /* ---------- INITIAL ROUTE ---------- */
  if(location.hash&&builders[(location.hash||'').replace('#','')]) fromHash();
  else { setChrome(true); updateTabs(); }
})();
