(function(){
  "use strict";
  if(typeof d3==="undefined"){return;} // graceful: text resume already in DOM

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Category colors ---------------- */
  var CAT = {
    root:    {color:'#84cc16', label:'Krishna Kanth B'},
    exp:     {color:'#38bdf8', label:'Experience'},
    skill:   {color:'#a78bfa', label:'Skills'},
    edu:     {color:'#fb923c', label:'Education'},
    cert:    {color:'#f472b6', label:'Certifications'},
    proj:    {color:'#facc15', label:'Projects'},
    contact: {color:'#2dd4bf', label:'Contact'}
  };

  /* ---------------- DATA ---------------- */
  var L = function(t,u,m){return {title:t,url:u,meta:m||''};};

  var nodes = [];
  var links = [];
  function add(n){ nodes.push(n); if(n.parent){ links.push({source:n.parent, target:n.id}); } return n; }

  // ROOT
  add({
    id:'root', label:'Krishna Kanth B', cat:'root', level:0,
    tip:{title:'Krishna Kanth B', sub:'Data & Insights Analyst — start here'},
    detail:{
      kicker:'About',
      heading:'Krishna Kanth B',
      meta:'Data & Insights Analyst · 8+ years turning complex data into decisions',
      lead:'Ex-Amazon · Ex-Optum · Ex-Dell · Ex-J&J | SQL · Python · Tableau · Snowflake | M.Sc, VIT Vellore',
      body:['Analyst with 8+ years across data management, analysis, visualization and storytelling. Expert at extracting, transforming, analysing and reporting complex datasets into actionable insight using Excel, SQL, Python and Tableau — delivering major FTE savings and productivity gains.'],
      stats:[['8+','Years experience'],['95%','KPI automation (Amazon)'],['90%','Latency reduction (Optum)'],['~118','Hours/month saved'],['8','Career roles'],['M.Sc','VIT Vellore']],
      hintChildren:'Explore the six branches around me — or click any of them in the graph.'
    }
  });

  // BRANCHES
  var branches = [
    {id:'exp', label:'Experience', cat:'exp', sub:'8 roles · 2010 → 2023'},
    {id:'skill', label:'Skills', cat:'skill', sub:'5 capability groups'},
    {id:'edu', label:'Education', cat:'edu', sub:'M.Sc · B.Sc · Schooling'},
    {id:'cert', label:'Certifications', cat:'cert', sub:'Snowflake & LinkedIn'},
    {id:'proj', label:'Projects', cat:'proj', sub:'Data viz case studies'},
    {id:'contact', label:'Contact', cat:'contact', sub:'Reach out'}
  ];
  branches.forEach(function(b){
    add({
      id:b.id, label:b.label, cat:b.cat, level:1, parent:'root',
      tip:{title:b.label, sub:b.sub},
      detail:{ kicker:CAT[b.cat].label, heading:b.label, meta:b.sub, isBranch:true }
    });
  });

  /* ---- EXPERIENCE leaves ---- */
  var exp = [
    {id:'e1',label:'PowerSchool',role:'Technical Support Engineer Specialist',co:'PowerSchool (via GlowTouch)',dates:'Sep 2022 – Oct 2023',
      body:'Ticketing/KB usage +40% (Salesforce / JIRA / Confluence); database management via Aqua Data Studio, SSMS & Snowflake; monitored Unified Insights builds.',
      tags:['Salesforce','JIRA','Confluence','Snowflake','SSMS']},
    {id:'e2',label:'Amazon',role:'Management Information Systems',co:'Amazon (3D India)',dates:'Jul 2020 – Aug 2021',
      body:'Automated 95% of KPI calculations; latency −99%; delivered ~118 hrs/month ROI; built 30 stored procedures + 20 events.',
      tags:['SQL','Stored Procedures','KPI Automation','MIS']},
    {id:'e3',label:'Optum',role:'Strategic Analyst',co:'Optum',dates:'May 2017 – Jan 2019',
      body:'Automated GL Validation & Org Hierarchy via SQL → latency −90%, reliability +50%; data mapping for Health Quest & Atrium Health.',
      tags:['SQL','GL Validation','Org Hierarchy','Healthcare']},
    {id:'e4',label:'Johnson & Johnson',role:'Analyst I / II / III',co:'Johnson & Johnson (via GVW Technologies)',dates:'Mar 2015 – Feb 2017',
      body:'Excel macro → review speed +70%, accuracy +20%; LabWare LIMS V6 for McNeil & Janssen; GDP & CAPAs.',
      tags:['Excel Macros','LabWare LIMS','GDP','CAPAs','Pharma']},
    {id:'e5',label:'Premier Inc.',role:'Content Analyst',co:'Premier Inc. (via Medusind)',dates:'Dec 2013 – Feb 2015',
      body:'Healthcare master-data management; UNSPSC taxonomy; ANSI UOM; HIPAA; built a custom Excel interface tool.',
      tags:['Master Data','UNSPSC','HIPAA','ANSI UOM']},
    {id:'e6',label:'Dell',role:'Customer Care Voice Sr. Rep',co:'Dell',dates:'Jul 2013 – Dec 2013',
      body:'Healthcare claims & eligibility (Conifer); Aetna / AARP / BCBS / Cigna; AAPC; Medicare / Medicaid.',
      tags:['Claims','Eligibility','AAPC','Medicare']},
    {id:'e7',label:'Symantec',role:'Product Support Analyst',co:'Symantec',dates:'Apr 2011 – Jul 2011',
      body:'Norton install / config / troubleshoot; malware removal via safe-mode; knowledge-base contributions.',
      tags:['Norton','Troubleshooting','Malware Removal']},
    {id:'e8',label:'Sitel India',role:'Customer Service Professional',co:'Sitel India',dates:'Sep 2010 – Mar 2011',
      body:'Dell-On-Call tech support; awarded "Resolution Expert of the Month" — Jan 2011.',
      tags:['Tech Support','Dell-On-Call','Award']}
  ];
  exp.forEach(function(e){
    add({ id:e.id, label:e.label, cat:'exp', level:2, parent:'exp',
      tip:{title:e.role, sub:e.co+' · '+e.dates},
      detail:{ kicker:'Experience', heading:e.role, meta:e.co+'  ·  '+e.dates, mono:e.dates, body:[e.body], tags:e.tags }});
  });

  /* ---- SKILLS leaves ---- */
  var skill = [
    {id:'s1',label:'Databases',items:['SQL','SSMS','MySQL','Aqua Data Studio','Snowflake','Stored Procedures']},
    {id:'s2',label:'Visualization',items:['Tableau','Spotfire','Looker','Power BI','Excel Dashboards']},
    {id:'s3',label:'Automation',items:['Advanced Excel','Macros','Python','VLOOKUP / Query']},
    {id:'s4',label:'Domains',items:['MIS / Org Hierarchy','SIS / EdTech','LIMS / Pharma','SCM / Healthcare']},
    {id:'s5',label:'Quality & Compliance',items:['LabWare LIMS','GDP','CAPAs','HIPAA','UNSPSC']}
  ];
  skill.forEach(function(s){
    add({ id:s.id, label:s.label, cat:'skill', level:2, parent:'skill',
      tip:{title:s.label, sub:s.items.length+' skills'},
      detail:{ kicker:'Skill group', heading:s.label, meta:s.items.length+' technologies & competencies', tags:s.items, tagsAccent:true }});
  });

  /* ---- EDUCATION leaves ---- */
  var edu = [
    {id:'d1',label:'M.Sc Biotechnology',inst:'VIT Vellore',dates:'2011 – 2013',
      body:'8.62 CGPA. Dissertation: "CD36 Gene in Type-1 Diabetic Rat Kidneys". Authored 3 international SET papers.',
      tags:['8.62 CGPA','Dissertation','3 SET papers']},
    {id:'d2',label:'B.Sc Biotechnology',inst:'D. G. Vaishnav College · Univ. of Madras',dates:'2007 – 2010',
      body:'Bachelor of Science in Biotechnology — 62.80%.',
      tags:['62.80%']},
    {id:'d3',label:'Schooling (PCB + Math)',inst:"St. Mary's A.I.H.S.S.",dates:'2007',
      body:'Higher secondary schooling with Physics, Chemistry, Biology and Mathematics.',
      tags:['PCB + Math']}
  ];
  edu.forEach(function(e){
    add({ id:e.id, label:e.label, cat:'edu', level:2, parent:'edu',
      tip:{title:e.label, sub:e.inst+' · '+e.dates},
      detail:{ kicker:'Education', heading:e.label, meta:e.inst+'  ·  '+e.dates, mono:e.dates, body:[e.body], tags:e.tags }});
  });

  /* ---- CERTIFICATIONS leaves ---- */
  var cert = [
    {id:'c1',label:'Snowflake',title:'Snowflake (multiple)',url:'https://achieve.snowflake.com/profile/krishnakanthb/wallet',meta:'achieve.snowflake.com'},
    {id:'c2',label:'LinkedIn',title:'LinkedIn Licenses & Certifications',url:'https://www.linkedin.com/in/bkrishnakanth/details/certifications/',meta:'linkedin.com'},
    {id:'c3',label:'Full list',title:'Full certifications list',url:'../../../BKK.html#certifications',meta:'On the full résumé',internal:true}
  ];
  cert.forEach(function(c){
    add({ id:c.id, label:c.label, cat:'cert', level:2, parent:'cert',
      tip:{title:c.title, sub:c.meta},
      detail:{ kicker:'Certification', heading:c.title, meta:c.meta, links:[L(c.title,c.url,c.meta)] }});
  });

  /* ---- PROJECTS leaves ---- */
  var proj = [
    {id:'p1',label:'H-1B 2025',title:'H-1B Analysis 2025',url:'https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-2025/'},
    {id:'p2',label:'H-1B Historical',title:'H-1B Analysis Historical',url:'https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-historical/'},
    {id:'p3',label:'Arattai Trends',title:'Arattai Trend Analytics',url:'https://krishnakanthb13.vercel.app/data-projects/arattai-trend-analytics/'},
    {id:'p4',label:'101 Projects',title:'101 Data Projects',url:'https://krishnakanthb13.vercel.app/data-projects/101-data-projects/'}
  ];
  proj.forEach(function(p){
    add({ id:p.id, label:p.label, cat:'proj', level:2, parent:'proj',
      tip:{title:p.title, sub:'krishnakanthb13.vercel.app'},
      detail:{ kicker:'Project', heading:p.title, meta:'Data visualization case study', links:[L('Open project →',p.url,'krishnakanthb13.vercel.app')] }});
  });

  /* ---- CONTACT leaves ---- */
  var contact = [
    {id:'k1',label:'Email',title:'Email',url:'mailto:krishnakanthb13@gmail.com',meta:'krishnakanthb13@gmail.com'},
    {id:'k2',label:'Phone',title:'Phone',url:'tel:+917667360114',meta:'+91 7667360114'},
    {id:'k3',label:'LinkedIn',title:'LinkedIn',url:'https://www.linkedin.com/in/bkrishnakanth/',meta:'in/bkrishnakanth'},
    {id:'k4',label:'GitHub',title:'GitHub',url:'https://github.com/krishnakanthb13/',meta:'github.com/krishnakanthb13'},
    {id:'k5',label:'WhatsApp',title:'WhatsApp',url:'https://wa.me/917667360114',meta:'wa.me/917667360114'}
  ];
  contact.forEach(function(k){
    add({ id:k.id, label:k.label, cat:'contact', level:2, parent:'contact',
      tip:{title:k.title, sub:k.meta},
      detail:{ kicker:'Contact', heading:k.title, meta:k.meta, links:[L(k.title,k.url,k.meta)] }});
  });

  // extra global links on the contact branch detail
  var contactBranch = nodes.find(function(n){return n.id==='contact';});
  contactBranch.detail.links = [
    L('Email','mailto:krishnakanthb13@gmail.com','krishnakanthb13@gmail.com'),
    L('Phone','tel:+917667360114','+91 7667360114'),
    L('LinkedIn','https://www.linkedin.com/in/bkrishnakanth/','in/bkrishnakanth'),
    L('GitHub','https://github.com/krishnakanthb13/','github.com/krishnakanthb13'),
    L('Projects (Google Sites)','https://sites.google.com/view/krishnakanthb/home','sites.google.com/view/krishnakanthb'),
    L('BioLink','https://bio.site/krishnakanthb13','bio.site/krishnakanthb13'),
    L('Digital Garden','https://krishnakanthb13.vercel.app/','krishnakanthb13.vercel.app'),
    L('Tableau Public','https://public.tableau.com/app/profile/krishnakanthb13/vizzes','public.tableau.com'),
    L('WhatsApp','https://wa.me/917667360114','wa.me/917667360114')
  ];

  // index for quick lookup
  var byId = {}; nodes.forEach(function(n){ byId[n.id]=n; });

  /* ---------------- Expansion state ---------------- */
  var expanded = {}; // id -> bool
  branches.forEach(function(b){ expanded[b.id]=false; });

  function childrenOf(id){ return nodes.filter(function(n){return n.parent===id;}); }
  function isVisible(n){
    if(n.level<=1) return true;
    return !!expanded[n.parent];
  }
  function visibleNodes(){ return nodes.filter(isVisible); }
  function visibleLinks(){
    return links.filter(function(l){
      var s = typeof l.source==='object'?l.source:byId[l.source];
      var t = typeof l.target==='object'?l.target:byId[l.target];
      return isVisible(s)&&isVisible(t);
    });
  }

  /* ---------------- SVG setup ---------------- */
  var app = document.getElementById('app');
  var W = app.clientWidth, H = app.clientHeight;

  var svg = d3.select('#app').append('svg')
    .attr('class','graph')
    .attr('width',W).attr('height',H)
    .attr('viewBox',[0,0,W,H])
    .attr('role','application')
    .attr('aria-label','Force-directed career graph. A full text résumé is available below for screen readers.');

  // defs: glow filter + radial gradients per category
  var defs = svg.append('defs');
  var glow = defs.append('filter').attr('id','glow').attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
  glow.append('feGaussianBlur').attr('stdDeviation','3.4').attr('result','b');
  var fm = glow.append('feMerge'); fm.append('feMergeNode').attr('in','b'); fm.append('feMergeNode').attr('in','SourceGraphic');

  Object.keys(CAT).forEach(function(key){
    var g = defs.append('radialGradient').attr('id','grad-'+key).attr('cx','35%').attr('cy','32%').attr('r','75%');
    g.append('stop').attr('offset','0%').attr('stop-color', lighten(CAT[key].color,.45));
    g.append('stop').attr('offset','60%').attr('stop-color', CAT[key].color);
    g.append('stop').attr('offset','100%').attr('stop-color', darken(CAT[key].color,.4));
  });

  var zoomLayer = svg.append('g').attr('class','zoom-layer');
  var linkLayer = zoomLayer.append('g').attr('class','links');
  var nodeLayer = zoomLayer.append('g').attr('class','nodes');

  var zoom = d3.zoom().scaleExtent([0.35,3.2]).on('zoom', function(ev){ zoomLayer.attr('transform', ev.transform); });
  svg.call(zoom);
  svg.on('dblclick.zoom', null);

  /* ---------------- Simulation params ---------------- */
  function radius(n){ return n.level===0?34 : n.level===1?20 : 11; }
  function charge(n){ return n.level===0?-1400 : n.level===1?-680 : -230; }
  function linkDist(l){
    var s = typeof l.source==='object'?l.source:byId[l.source];
    return s.level===0?170:90;
  }

  var sim = d3.forceSimulation()
    .force('link', d3.forceLink().id(function(d){return d.id;}).distance(linkDist).strength(.65))
    .force('charge', d3.forceManyBody().strength(function(d){return charge(d);}))
    .force('center', d3.forceCenter(W/2, H/2))
    .force('collide', d3.forceCollide().radius(function(d){return radius(d)+14;}).iterations(2))
    .force('x', d3.forceX(W/2).strength(.04))
    .force('y', d3.forceY(H/2).strength(.04));

  if(prefersReduced){ sim.velocityDecay(.6).alphaDecay(.15); }

  var linkSel = linkLayer.selectAll('line');
  var nodeSel = nodeLayer.selectAll('g.node');

  // fix root near center initially
  byId.root.fx = W/2; byId.root.fy = H/2;

  function restart(animate){
    var vN = visibleNodes();
    var vL = visibleLinks();

    // LINKS
    linkSel = linkSel.data(vL, function(d){
      var s=typeof d.source==='object'?d.source.id:d.source;
      var t=typeof d.target==='object'?d.target.id:d.target;
      return s+'->'+t;
    });
    linkSel.exit().remove();
    linkSel = linkSel.enter().append('line')
      .attr('class','link')
      .attr('stroke-width',function(d){
        var s=typeof d.source==='object'?d.source:byId[d.source];
        return s.level===0?2:1.3;
      })
      .merge(linkSel);

    // NODES
    nodeSel = nodeSel.data(vN, function(d){return d.id;});
    nodeSel.exit()
      .transition().duration(prefersReduced?0:220).style('opacity',0).remove();

    var enter = nodeSel.enter().append('g')
      .attr('class',function(d){return 'node node-'+d.cat;})
      .attr('tabindex',0)
      .attr('role','button')
      .attr('aria-label',function(d){return d.tip.title+'. '+d.tip.sub;})
      .call(drag(sim))
      .on('click', function(ev,d){ ev.stopPropagation(); activate(d); })
      .on('keydown', function(ev,d){ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); activate(d); } })
      .on('mouseenter', function(ev,d){ showTip(ev,d); highlightNeighbors(d,true); })
      .on('mousemove', moveTip)
      .on('mouseleave', function(ev,d){ hideTip(); if(!d.__active) highlightNeighbors(d,false); })
      .on('focus', function(ev,d){ showTipAtNode(d); })
      .on('blur', hideTip);

    // halo
    enter.append('circle').attr('class','halo')
      .attr('r',function(d){return radius(d)+10;})
      .attr('stroke',function(d){return CAT[d.cat].color;})
      .attr('stroke-width',function(d){return d.level===0?6:4;})
      .attr('filter','url(#glow)');
    // body
    enter.append('circle').attr('class','body')
      .attr('r',function(d){return radius(d);})
      .attr('fill',function(d){return 'url(#grad-'+d.cat+')';})
      .attr('filter','url(#glow)');
    // expand badge (+/-) for branch nodes
    enter.filter(function(d){return d.level===1;})
      .append('text').attr('class','expand-badge')
      .attr('text-anchor','middle').attr('dy','0.34em')
      .text('+');
    // label
    enter.append('text').attr('class','lbl')
      .attr('text-anchor','middle')
      .attr('dy',function(d){return radius(d)+14;})
      .text(function(d){return d.label;});

    nodeSel = enter.merge(nodeSel);

    // update badge text on existing
    nodeSel.select('text.expand-badge').text(function(d){return expanded[d.id]?'−':'+';});

    sim.nodes(vN);
    sim.force('link').links(vL);
    sim.alpha(animate===false?.2:.85).restart();

    applySearch();
  }

  sim.on('tick', function(){
    linkSel
      .attr('x1',function(d){return d.source.x;})
      .attr('y1',function(d){return d.source.y;})
      .attr('x2',function(d){return d.target.x;})
      .attr('y2',function(d){return d.target.y;});
    nodeSel.attr('transform',function(d){return 'translate('+d.x+','+d.y+')';});
  });

  /* ---------------- Drag ---------------- */
  function drag(simulation){
    function started(ev,d){ if(!ev.active) simulation.alphaTarget(.3).restart(); d.fx=d.x; d.fy=d.y; }
    function dragged(ev,d){ d.fx=ev.x; d.fy=ev.y; }
    function ended(ev,d){ if(!ev.active) simulation.alphaTarget(0); if(d.level!==0){ d.fx=null; d.fy=null; } }
    return d3.drag().on('start',started).on('drag',dragged).on('end',ended);
  }

  /* ---------------- Activate node (expand + detail) ---------------- */
  var activeId = null;
  function activate(d){
    if(d.level===1){ expanded[d.id]=!expanded[d.id]; restart(); }
    if(d.level===0){
      var anyClosed = branches.some(function(b){return !expanded[b.id];});
      branches.forEach(function(b){ expanded[b.id]=anyClosed; });
      restart();
    }
    setActive(d);
    openDrawer(d);
  }

  function setActive(d){
    activeId = d.id;
    nodeSel.classed('active',function(n){ n.__active=(n.id===d.id); return n.__active; });
    highlightNeighbors(d,true,true);
  }

  function highlightNeighbors(d, on, sticky){
    if(!on && !sticky){
      if(activeId){ var a=byId[activeId]; if(a){ highlightNeighbors(a,true,true); return; } }
      if(filterCat){ applyFilterDim(); return; }
      nodeSel.classed('dimmed',false);
      linkSel.classed('dimmed',false).classed('hot',false);
      return;
    }
    var neigh = {}; neigh[d.id]=true;
    visibleLinks().forEach(function(l){
      var s=l.source.id||l.source, t=l.target.id||l.target;
      if(s===d.id) neigh[t]=true;
      if(t===d.id) neigh[s]=true;
    });
    nodeSel.classed('dimmed',function(n){return !neigh[n.id];});
    linkSel.classed('hot',function(l){var s=l.source.id||l.source,t=l.target.id||l.target;return s===d.id||t===d.id;})
           .classed('dimmed',function(l){var s=l.source.id||l.source,t=l.target.id||l.target;return !(s===d.id||t===d.id);});
  }

  function clearActive(){
    activeId=null;
    nodeSel.classed('active',false);
    nodeSel.each(function(n){n.__active=false;});
    nodeSel.classed('dimmed',false);
    linkSel.classed('dimmed',false).classed('hot',false);
    if(filterCat) applyFilterDim(); else applySearch();
  }

  /* ---------------- Tooltip ---------------- */
  var tip = document.getElementById('tooltip');
  function showTip(ev,d){
    tip.innerHTML =
      '<div class="tt-cat" style="color:'+CAT[d.cat].color+'">'+esc(CAT[d.cat].label)+'</div>'+
      '<div class="tt-title">'+esc(d.tip.title)+'</div>'+
      (d.tip.sub?'<div class="tt-sub">'+esc(d.tip.sub)+'</div>':'');
    tip.classList.add('on');
    moveTip(ev);
  }
  function showTipAtNode(d){
    var r=svg.node().getBoundingClientRect();
    var t=d3.zoomTransform(svg.node());
    var x=r.left + t.applyX(d.x), y=r.top + t.applyY(d.y);
    showTip({clientX:x, clientY:y-12}, d);
  }
  function moveTip(ev){
    if(!ev||ev.clientX==null) return;
    var pad=14, tw=tip.offsetWidth, th=tip.offsetHeight;
    var x=ev.clientX+16, y=ev.clientY+16;
    if(x+tw+pad>window.innerWidth) x=ev.clientX-tw-16;
    if(y+th+pad>window.innerHeight) y=ev.clientY-th-16;
    tip.style.left=Math.max(pad,x)+'px';
    tip.style.top=Math.max(pad,y)+'px';
  }
  function hideTip(){ tip.classList.remove('on'); }

  /* ---------------- Drawer ---------------- */
  var drawer=document.getElementById('drawer');
  var scrim=document.getElementById('scrim');
  var dCat=document.getElementById('drawer-cat');
  var dTitle=document.getElementById('drawer-title');
  var dMeta=document.getElementById('drawer-meta');
  var dBody=document.getElementById('drawer-body');
  var dAccent=document.getElementById('drawer-accent');
  var lastFocus=null;

  function openDrawer(d){
    var c=CAT[d.cat].color, det=d.detail||{};
    lastFocus=document.activeElement;
    dAccent.style.background=c;
    var dot=dCat.querySelector('.dot');
    dot.style.color=c; dot.style.background=c;
    dCat.style.color=c;
    dCat.querySelector('.catname').textContent=det.kicker||CAT[d.cat].label;
    dTitle.textContent=det.heading||d.label;

    // meta
    dMeta.innerHTML = det.meta ? (det.mono? '<span class="mono">'+esc(det.meta)+'</span>' : esc(det.meta)) : '';

    // body
    var html='';
    if(det.lead) html+='<p class="lead">'+esc(det.lead)+'</p>';
    if(det.body) det.body.forEach(function(p){ html+='<p>'+esc(p)+'</p>'; });

    if(det.stats){
      html+='<div class="stat-grid">';
      det.stats.forEach(function(s){ html+='<div class="stat"><div class="n">'+esc(s[0])+'</div><div class="l">'+esc(s[1])+'</div></div>'; });
      html+='</div>';
    }

    if(det.tags){
      html+='<div class="sec-label">'+(d.cat==='skill'?'Stack':'Highlights')+'</div><div class="chip-row">';
      det.tags.forEach(function(t){ html+='<span class="chip'+(det.tagsAccent?' accent':'')+'">'+esc(t)+'</span>'; });
      html+='</div>';
    }

    // branch: list children as buttons
    if(det.isBranch){
      var kids=childrenOf(d.id);
      html+='<div class="sec-label">'+kids.length+' items — click to focus</div><div class="child-list">';
      kids.forEach(function(k){
        html+='<button class="child-btn" data-id="'+k.id+'">'+
          '<span class="cdot" style="color:'+CAT[k.cat].color+';background:'+CAT[k.cat].color+'"></span>'+
          '<span><span class="ct">'+esc(k.tip.title)+'</span>'+(k.tip.sub?'<span class="cs">'+esc(k.tip.sub)+'</span>':'')+'</span></button>';
      });
      html+='</div>';
    }

    if(det.links){
      html+='<div class="sec-label">Links</div><div class="link-list">';
      det.links.forEach(function(lk){
        var ext=!/^(mailto:|tel:|\.\.\/)/.test(lk.url);
        var attrs=ext?' target="_blank" rel="noopener"':'';
        html+='<a href="'+esc(lk.url)+'"'+attrs+'><span><span>'+esc(lk.title)+'</span>'+(lk.meta?'<span class="meta">'+esc(lk.meta)+'</span>':'')+'</span>'+
          '<span class="arrow"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg></span></a>';
      });
      html+='</div>';
    }

    if(det.hintChildren){ html+='<p class="lead" style="margin-top:18px">'+esc(det.hintChildren)+'</p>'; }

    dBody.innerHTML=html;
    dBody.scrollTop=0;

    // wire child buttons
    dBody.querySelectorAll('.child-btn').forEach(function(b){
      b.addEventListener('click',function(){ var k=byId[b.getAttribute('data-id')]; activate(k); focusNode(k); });
    });

    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    if(window.innerWidth<=760){ scrim.classList.add('on'); }
    document.getElementById('drawer-close').focus();
  }

  function closeDrawer(){
    if(!drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    scrim.classList.remove('on');
    clearActive();
    if(lastFocus&&lastFocus.focus){ try{lastFocus.focus();}catch(e){} }
  }

  function focusNode(d){
    var t=d3.zoomTransform(svg.node());
    var scale=Math.max(t.k, .9);
    var tx=W/2 - d.x*scale, ty=H/2 - d.y*scale;
    svg.transition().duration(prefersReduced?0:600)
       .call(zoom.transform, d3.zoomIdentity.translate(tx,ty).scale(scale));
  }

  document.getElementById('drawer-close').addEventListener('click',closeDrawer);
  scrim.addEventListener('click',closeDrawer);
  svg.on('click',function(){ closeDrawer(); hideTip(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeDrawer(); hideTip(); } });

  /* ---------------- Legend ---------------- */
  var legendList=document.getElementById('legend-list');
  var legendOrder=['root','exp','skill','edu','cert','proj','contact'];
  var filterCat=null;
  legendOrder.forEach(function(key){
    var li=document.createElement('li');
    li.setAttribute('data-cat',key);
    li.innerHTML='<span class="dot" style="color:'+CAT[key].color+';background:'+CAT[key].color+'"></span>'+esc(CAT[key].label);
    li.addEventListener('click',function(){ toggleFilter(key); });
    legendList.appendChild(li);
  });
  function applyFilterDim(){
    nodeSel.classed('dimmed',function(n){return n.cat!==filterCat;});
    linkSel.classed('dimmed',true).classed('hot',false);
  }
  function toggleFilter(key){
    filterCat = (filterCat===key)?null:key;
    legendList.querySelectorAll('li').forEach(function(li){
      li.classList.toggle('dim', !!filterCat && li.getAttribute('data-cat')!==filterCat);
    });
    if(filterCat){
      // ensure the category's nodes are visible
      branches.forEach(function(b){ if(b.cat===filterCat) expanded[b.id]=true; });
      restart(false);
      applyFilterDim();
    } else {
      nodeSel.classed('dimmed',false);
      linkSel.classed('dimmed',false);
      applySearch();
    }
  }

  /* ---------------- Search ---------------- */
  var searchInput=document.getElementById('search');
  function applySearch(){
    var q=(searchInput.value||'').trim().toLowerCase();
    if(!q){ nodeSel.classed('searchhit',false); if(!activeId&&!filterCat) nodeSel.classed('dimmed',false); return; }
    var hit={};
    nodes.forEach(function(n){
      var hay=(n.label+' '+(n.tip.title||'')+' '+(n.tip.sub||'')+' '+((n.detail&&n.detail.tags)?n.detail.tags.join(' '):'')+' '+((n.detail&&n.detail.body)?n.detail.body.join(' '):'')).toLowerCase();
      if(hay.indexOf(q)>=0) hit[n.id]=true;
    });
    branches.forEach(function(b){
      if(childrenOf(b.id).some(function(k){return hit[k.id];})){ expanded[b.id]=true; }
    });
    nodeSel.classed('searchhit',function(n){return hit[n.id];});
    nodeSel.classed('dimmed',function(n){return !hit[n.id];});
    linkSel.classed('dimmed',true);
  }
  var searchTimer;
  searchInput.addEventListener('input',function(){
    clearTimeout(searchTimer);
    searchTimer=setTimeout(function(){
      var q=(searchInput.value||'').trim();
      if(q){ restart(false); } else { restart(false); }
      applySearch();
    },140);
  });

  /* ---------------- Reset / recenter ---------------- */
  document.getElementById('recenter').addEventListener('click',function(){
    branches.forEach(function(b){ expanded[b.id]=false; });
    searchInput.value=''; filterCat=null;
    legendList.querySelectorAll('li').forEach(function(li){li.classList.remove('dim');});
    closeDrawer();
    nodes.forEach(function(n){ if(n.level!==0){ n.fx=null; n.fy=null; } });
    byId.root.fx=W/2; byId.root.fy=H/2;
    restart();
    svg.transition().duration(prefersReduced?0:600).call(zoom.transform, d3.zoomIdentity);
    setTimeout(function(){ byId.root.fx=null; byId.root.fy=null; },1200);
  });

  /* ---------------- Resize ---------------- */
  function onResize(){
    W=app.clientWidth; H=app.clientHeight;
    svg.attr('width',W).attr('height',H).attr('viewBox',[0,0,W,H]);
    sim.force('center', d3.forceCenter(W/2,H/2));
    sim.force('x', d3.forceX(W/2).strength(.04));
    sim.force('y', d3.forceY(H/2).strength(.04));
    sim.alpha(.4).restart();
  }
  var rT; window.addEventListener('resize',function(){ clearTimeout(rT); rT=setTimeout(onResize,160); });

  /* ---------------- color helpers ---------------- */
  function lighten(hex,amt){ return mix(hex,'#ffffff',amt); }
  function darken(hex,amt){ return mix(hex,'#000000',amt); }
  function mix(a,b,t){
    var ca=hx(a), cb=hx(b);
    var r=Math.round(ca[0]+(cb[0]-ca[0])*t);
    var g=Math.round(ca[1]+(cb[1]-ca[1])*t);
    var bl=Math.round(ca[2]+(cb[2]-ca[2])*t);
    return 'rgb('+r+','+g+','+bl+')';
  }
  function hx(h){ h=h.replace('#',''); if(h.length===3){h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];} return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]; }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

  /* ---------------- Boot ---------------- */
  restart();
  // expand all branches gently on first load for a richer first impression, then release root
  setTimeout(function(){
    branches.forEach(function(b){ expanded[b.id]=true; });
    restart();
    setTimeout(function(){ byId.root.fx=null; byId.root.fy=null; sim.alpha(.3).restart(); }, prefersReduced?0:900);
  }, prefersReduced?0:650);

})();
