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
    {role:'Project Lead Developer',co:'Amplenote',client:'Freelance · Plugins',date:'Jan 2024 – Present',badge:'AN',
     link:{label:'amplenote.com',href:'https://www.amplenote.com/'},
     desc:'Working on my own portfolio — open-source plugins, an online résumé and a public digital garden I can refer to over a lifetime.',
     points:[
       'Plugin Web Development — built &amp; published 20+ open-source plugins for a note-taking app using the inbuilt API, JavaScript, HTML, CSS and AI. Currently used by 500+ active users.',
       'Personal Branding — designed a professional online résumé hosted on GitHub &amp; Google Sites, mimicking LinkedIn-style features.',
       'Digital Garden — built and maintain a public, evolving knowledge base in Obsidian, versioned in GitHub and hosted on Vercel.'
     ],
     tags:['API','JavaScript','HTML','CSS','Unit Testing','AI Tools','Project Planning','Code Documentation','SQL','Snowflake','Data Analytics','Data Visualization']},
    {role:'Technical Support Engineer Specialist',co:'PowerSchool',client:'via GlowTouch',date:'Sep 2022 – Oct 2023',badge:'PS',
     link:{label:'powerschool.com',href:'https://www.powerschool.com/'},
     desc:'Cloud-based K-12 education software — supporting Unified Insights builds and database operations.',
     points:[
       'Lifted ticketing &amp; knowledge-base usage by +40% across Salesforce, JIRA and Confluence by streamlining processes and collaboration.',
       'Managed databases with Aqua Data Studio, SSMS and Snowflake; secured remote admin via MobaXterm, SSH Putty and Jump-box.',
       'Monitored Unified Insights build processes and resolved data-structure issues, partnering with product, Cloud Ops and Hosting teams.'
     ],
     tags:['SQL','SSMS','Aqua Data Studio','Snowflake','Data Analytics','Microsoft Excel','Atlassian Suite','Salesforce','Quality Assurance']},
    {role:'Management Information Systems',co:'Amazon',client:'3D India',date:'Jul 2020 – Aug 2021',badge:'AZ',
     link:{label:'amazon.in',href:'https://www.amazon.in/'},
     accolade:'Bravo for Ownership (Mar 2021) — automating the 3D Operations stack &amp; weekly KPI reports.',
     desc:'3D Support Coordinator (MIS) — re-engineered KPI reporting for the Operations &amp; Support teams.',
     points:[
       'Automated 95% of manual KPI calculations, revolutionising how Stack Reports are published.',
       'Reduced latency by 99% and added flexibility via a single-data-source approach — ~118 hrs/month ROI.',
       'Built 30 stored procedures and 20 events plus an event/step log table to simplify troubleshooting.'
     ],
     tags:['SQL','SSMS','Snowflake','Informatica','SSIS','Tableau','Data Warehousing','Advanced Excel','Project Management','Agile']},
    {role:'Strategic Analyst',co:'Optum',client:'',date:'May 2017 – Jan 2019',badge:'OP',
     link:{label:'optum.com',href:'https://www.optum.com/en/'},
     accolade:'Best Hackathon Project (Mar 2018) — General Ledger Validation automation.',
     desc:'Data integration &amp; automation for healthcare systems (Health Quest, Atrium Health).',
     points:[
       'Streamlined insurance proficiency by 20% through deep knowledge of U.S. insurance patterns.',
       'Automated GL Validation &amp; built an Organization Hierarchy with SQL stored procedures — latency −90%, reliability +50%.',
       'Built a multi-level Type/Group/Category classification and quality checks; cut manual validation time by 60%.'
     ],
     tags:['SQL','SSMS','Tableau','Elasticsearch','Data Warehousing','Financial Analysis','Risk Management','Life Sciences','Quality Assurance']},
    {role:'Analyst I / II / III',co:'Johnson &amp; Johnson',client:'via GVW Technologies',date:'Mar 2015 – Feb 2017',badge:'JJ',
     link:{label:'jnj.com',href:'https://www.jnj.com/'},
     accolade:'Best Beginner Award (Apr 2015) — Visual Basic / Excel macro for report processing.',
     desc:'LabWare LIMS V6 master-data configuration for McNeil Consumer Healthcare &amp; Janssen Pharmaceutical.',
     points:[
       'Boosted review efficiency by +70% and accuracy by +20% with a custom MS Excel macro.',
       'Curated a 75+ reference library of data-visualization charts &amp; analytics tools for Health Informatics.',
       'Configured, tested and reviewed LIMS master-data objects for sites in Canada and Italy; ensured GDP compliance and ran CAPA / root-cause analysis.'
     ],
     tags:['LabWare LIMS','Quality Assurance','Microsoft Excel','Hadoop','SQL','Tableau','Spotfire','Minitab','Informatica','SSIS','Life Sciences']},
    {role:'Content Analyst',co:'Premier Inc.',client:'via Medusind',date:'Dec 2013 – Feb 2015',badge:'PR',
     link:{label:'premierinc.com',href:'https://premierinc.com/'},
     desc:'Healthcare master-data management — data mapping &amp; validation across manufacturers, vendors, sites and catalogs.',
     points:[
       'Streamlined search &amp; validation with Excel (VLOOKUP, Query) and a custom tool linking Excel columns to client software.',
       'Enriched product data across 46 &amp; 210 fields and classified items by UNSPSC codes for better searchability.',
       'Validated packaging strings and UOMs to ANSI standards while ensuring HIPAA compliance.'
     ],
     tags:['Data Mapping','Data Enrichment','Data Classification','Microsoft Excel','UNSPSC','HIPAA','Life Sciences','Data Warehousing']},
    {role:'Customer Care Voice Sr. Rep',co:'Dell',client:'',date:'Jul 2013 – Dec 2013',badge:'DL',
     link:{label:'dell.com',href:'https://www.dell.com/en-in'},
     accolade:'Best Employee of the Month (Sep 2013) — best performance rating.',
     desc:'Healthcare claims processing &amp; eligibility verification (Conifer Health Solutions).',
     points:[
       'Implemented a classification system to prioritise inquiries by urgency in single mail/call interactions.',
       'Verified eligibility with Aetna, AARP, BCBS, Cigna etc. and interpreted AAPC medical codes.',
       'Processed Medicare &amp; Medicaid claims; calculated deductibles, co-insurance and co-pays in real time under full HIPAA compliance.'
     ],
     tags:['Technical Support','Quality Assurance','Customer Service','Problem-Solving','CRM Software','Process Adherence','Communication']},
    {role:'Product Support Analyst',co:'Symantec',client:'',date:'Apr 2011 – Jul 2011',badge:'SY',
     link:{label:'broadcom.com',href:'https://www.broadcom.com/products/cybersecurity'},
     desc:'Technical support for Norton security products on Windows platforms.',
     points:[
       'Resolved antivirus issues and performed advanced threat mitigation — virus, spyware and malware removal via safe-mode techniques.',
       'Provided remote assistance via phone and remote-access tools; resolved installation, configuration and update errors.',
       'Contributed to knowledge-base documentation and resolved software-compatibility issues.'
     ],
     tags:['Troubleshooting','Technical Knowledge','Customer Service','Documentation','Remote Desktop','Ticketing Systems','Visual Studio 2003']},
    {role:'Customer Service Professional',co:'Sitel India',client:'',date:'Sep 2010 – Mar 2011',badge:'SI',
     link:{label:'foundever.com',href:'https://foundever.com/'},
     accolade:'Resolution Expert of the Month (Jan 2011) — most first-attempt resolutions.',
     desc:'Technical &amp; customer support for Dell and non-Dell customers (Dell-On-Call Services).',
     points:[
       'Troubleshot hardware &amp; software across laptops, desktops, routers, LANs, printers and gaming consoles with a high first-call resolution rate.',
       'Managed escalations and irate clients while ensuring customer satisfaction.',
       'Increased customer lifetime value by recommending warranty extensions, upgrades and add-ons.'
     ],
     tags:['Communication','Customer Service','Problem-Solving','Empathy','Conflict Resolution','Technical Knowledge','CRM Software','Phone System']}
  ];
  var skillBars=[['SQL · SSMS / MySQL / Aqua Data / Snowflake',95],['Microsoft Excel · Macros &amp; Automation',95],['Snowflake Cloud',85],['Data Visualization · Tableau / Spotfire',80],['Python',75],['LabWare LIMS',55]];
  var skillChips=['SSMS','MySQL','Aqua Data','Snowflake','Tableau','Spotfire','Looker','Power BI','Excel Macros','Python','Informatica','SSIS','LabWare LIMS','Elasticsearch'];
  var domains=[['MIS','Organization Hierarchy'],['SIS','Education Technology'],['LIMS','Pharmaceuticals'],['SCM','Hospitals / Health Care']];
  var softSkills=['Leadership','Critical Thinking','Problem-solving','Presentation','Facilitation','Negotiation','Adaptability','Decision Making','Prioritization','Creativity','Conflict Resolution','Team Building'];
  var skillLinks=[
    {t:'Snowflake Certificates Archive',s:'achieve.snowflake.com/profile/krishnakanthb',href:'https://achieve.snowflake.com/profile/krishnakanthb/wallet',cls:'b-cert',ic:'cert',ext:true},
    {t:'Tableau Public Visualizations',s:'public.tableau.com/krishnakanthb13',href:'https://public.tableau.com/app/profile/krishnakanthb13/vizzes',cls:'b-tab',ic:'tab',ext:true}
  ];
  var education=[
    {deg:'M.Sc Biotechnology',co:'Vellore Institute of Technology',date:'2011 – 2013 · 8.62 CGPA',
     detail:'<b>Dissertation (Mar 2013):</b> Expression of CD36 Gene in Type-1 Diabetic Rat Kidneys.',
     extra:[
       'Research paper — 5th Intl. Conference on Science, Engineering &amp; Technology (SET): phytocompounds from Indian Pomegranate.',
       'Research paper — 4th Intl. SET Conference: Role of flavonoids on cancer.',
       'Research paper — 3rd Intl. SET Conference: Siderophore produced by rhizosphere bacteria of Opuntia sp.'
     ],
     pub:{label:'Publication · Asian Journal of Microbiology, Biotechnology &amp; Environmental Sciences',href:'http://www.envirobiotechjournals.com/article_abstract.php?aid=4477&iid=157&jid=1'}},
    {deg:'B.Sc Biotechnology',co:'D. G. Vaishnav College · University of Madras',date:'2007 – 2010 · 62.80%',detail:''},
    {deg:'Schooling (PCMB)',co:"St. Mary's Anglo Indian Hr. Sec. School",date:'2007',detail:''}
  ];
  var certs=[
    {t:'Snowflake Certificates Archive',s:'Data wallet · 6 Hands-On Essentials',href:'https://achieve.snowflake.com/profile/krishnakanthb/wallet',cls:'b-cert',ic:'cert',ext:true},
    {t:'LinkedIn Licenses &amp; Certs',s:'linkedin.com/in/bkrishnakanth',href:'https://www.linkedin.com/in/bkrishnakanth/details/certifications/',cls:'b-in',ic:'in',ext:true},
    {t:'Data Analytics Certificate',s:'Pro5.AI · 2024',href:'https://drive.google.com/file/d/1ekt9RT_Z5h1sw2Tu5ZzeHrKV9q6D-cwR/view?usp=drive_link',cls:'b-doc',ic:'cert',ext:true},
    {t:'Docker &amp; Kubernetes Fundamentals',s:'Scaler Masterclass · 2025',href:'https://moonshot.scaler.com/s/sl/bEjI_azO_N',cls:'b-doc',ic:'cert',ext:true},
    {t:'SQL using AI Workshop',s:'be10x.in · 2025',href:'https://certx.in/certificate/a3ae0c0d-1f62-4e3f-bede-17ff37c364a7688515',cls:'b-doc',ic:'cert',ext:true},
    {t:'All 52 credentials',s:'BKK.html · full certifications list',href:RESUME+'#certifications',cls:'b-doc',ic:'resume'}
  ];
  var projectGroups=[
    {h:'Data Quests · Digital Garden',items:[
      {t:'H-1B Analysis 2025',s:'Data project · Oct 2025',href:'https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-2025/'},
      {t:'H-1B Analysis Historical',s:'Data project · Oct 2025',href:'https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-historical/'},
      {t:'Arattai Trend Analytics',s:'Data project · Oct 2025',href:'https://krishnakanthb13.vercel.app/data-projects/arattai-trend-analytics/'},
      {t:'101 Data Projects',s:'Digital Garden hub',href:'https://krishnakanthb13.vercel.app/data-projects/101-data-projects/'},
      {t:'Digital Garden home',s:'krishnakanthb13.vercel.app',href:'https://krishnakanthb13.vercel.app/'}
    ]},
    {h:'Amplenote Plugins · 20+ published',items:[
      {t:'Krishna Plugins (Public List)',s:'public.amplenote.com',href:'https://public.amplenote.com/Y3dy91/krishna-plugins'},
      {t:'Amplenote Plugins · GitHub Repo',s:'github.com/krishnakanthb13',href:'https://github.com/krishnakanthb13/amplenote-plugins'},
      {t:'Amplenote Public Profile',s:'amplenote.com/user_profiles',href:'https://www.amplenote.com/user_profiles/2030-krishna-kanth-b'}
    ]},
    {h:'Anki Flashcards &amp; Web Tools',items:[
      {t:'Krishna’s Anki Flashcards',s:'krishnakanthb13.github.io/F',href:'https://krishnakanthb13.github.io/F/'},
      {t:'VTT Text Extractor',s:'Simple VTT extractor',href:'https://krishnakanthb13.github.io/O/VTT/WEBVTT%20v1.html'},
      {t:'VTT Text Extractor Pro',s:'VTT + Gemini AI',href:'https://krishnakanthb13.github.io/O/VTT/WEBVTT%20v2.html'}
    ]}
  ];
  var notifications=[
    {ic:'AN',cls:'b-proj',app:'Amplenote',time:'now',msg:'500+ users are now using your plugins ✦'},
    {ic:'in',cls:'b-in',app:'LinkedIn',time:'2m',msg:'You have a new endorsement for SQL.'},
    {ic:'cert',cls:'b-cert',app:'Snowflake',time:'9m',msg:'Certificate earned — Data Engineering Workshop ✓'},
    {ic:'proj',cls:'b-proj',app:'Digital Garden',time:'1h',msg:'New data project published: H-1B Analysis 2025.'},
    {ic:'mail',cls:'b-mail',app:'Recruiter',time:'3h',msg:'Are you open to full-time Data Analyst roles?'},
    {ic:'gh',cls:'b-gh',app:'GitHub',time:'5h',msg:'krishnakanthb13 pushed v0.0.40 to master.'}
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
    var stats=[['8+','Years experience'],['95%','KPI automation'],['90%','Latency reduction'],['~118','Hrs/month saved'],['9','Career roles'],['M.Sc','VIT Vellore']];
    var langs=[['English','Native / bilingual'],['Telugu','Native / bilingual'],['Tamil','Elementary'],['Hindi','Elementary'],['French','Elementary']];
    var hobbies=['Basketball','Carrom','Online Games','Painting','Cooking','Movies'];
    var s='<div class="page-head"><h2 tabindex="-1">About</h2><p>Data &amp; Insights Analyst</p></div>';
    s+='<div class="card"><p>Data Analyst with excellent proficiency in Excel, SQL, Python, Tableau, Looker and PowerBI, bringing broad knowledge across IT, Healthcare (Life Science) and Education Technology. I excel at applying data-driven solutions to critical problems — making complex data understandable and actionable.</p></div>';
    s+='<div class="stats">';
    stats.forEach(function(x){s+='<div class="stat"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';});
    s+='</div>';
    s+='<p class="tagline">Ex-Amazon · Ex-Optum · Ex-Dell · Ex-J&amp;J</p>';
    s+='<div class="sub-h">Volunteering</div><div class="card"><p><b>Content Coordinator (Volunteer)</b> · Bhumi NGO · Jun 2016 – Jul 2018 · 2 yrs 2 mos. Helping classes 9 &amp; 10 build their own robots through weekend workshops, organising content and assigning volunteers.</p><a class="xp-link" style="margin-top:8px" href="https://bhumi.ngo/" target="_blank" rel="noopener">'+I.bio+'bhumi.ngo</a></div>';
    s+='<div class="sub-h">Languages</div><div class="card"><div class="langgrid">';
    langs.forEach(function(l){s+='<div class="lang"><b>'+l[0]+'</b><span>'+l[1]+'</span></div>';});
    s+='</div></div>';
    s+='<div class="sub-h">Hobbies</div><div class="chips">';
    hobbies.forEach(function(h){s+='<span class="chip">'+h+'</span>';});
    s+='</div>';
    s+='<p class="about-foot">© 2026 Krishna Kanth B (BKK)</p>';
    return s;
  }
  function buildExperience(){
    var s='<div class="page-head"><h2 tabindex="-1">Experience</h2><p>9 roles · tap to expand details</p></div>';
    experience.forEach(function(x,i){
      var body='<div class="inner">';
      if(x.link)body+='<a class="xp-link" href="'+x.link.href+'" target="_blank" rel="noopener">'+I.bio+x.link.label+'</a>';
      if(x.accolade)body+='<div class="xp-accolade">★ '+x.accolade+'</div>';
      if(x.desc)body+='<p class="desc">'+x.desc+'</p>';
      if(x.points){body+='<ul>';x.points.forEach(function(p){body+='<li>'+p+'</li>';});body+='</ul>';}
      if(x.tags){body+='<div class="xp-tags">';x.tags.forEach(function(t){body+='<span>'+t+'</span>';});body+='</div>';}
      body+='</div>';
      s+='<div class="xp" data-xp="'+i+'"><button class="xp-btn" type="button" aria-expanded="false" aria-controls="xpb'+i+'">'+
        '<span class="xp-logo" aria-hidden="true">'+x.badge+'</span>'+
        '<span class="xp-meta"><h3>'+x.role+'</h3><span class="co">'+x.co+(x.client?' · '+x.client:'')+'</span><span class="date">'+x.date+'</span></span>'+
        '<span class="chev" aria-hidden="true">'+I.chev+'</span></button>'+
        '<div class="xp-body" id="xpb'+i+'">'+body+'</div></div>';
    });
    return s;
  }
  function buildEducation(){
    var s='<div class="page-head"><h2 tabindex="-1">Education</h2><p>Academic background</p></div><div class="card">';
    education.forEach(function(x){
      s+='<div class="edu"><span class="dot" aria-hidden="true"><i></i><span class="ln"></span></span>'+
        '<span class="body"><h3>'+x.deg+'</h3><span class="co">'+x.co+'</span><div class="date">'+x.date+'</div>'+
        (x.detail?'<p>'+x.detail+'</p>':'');
      if(x.extra){s+='<ul style="list-style:none;margin:8px 0 0;padding:0">';
        x.extra.forEach(function(e){s+='<li style="position:relative;padding-left:14px;font-size:12px;line-height:1.45;color:var(--ink-soft);margin-bottom:5px"><span style="position:absolute;left:0;top:7px;width:5px;height:5px;border-radius:50%;background:var(--accent)"></span>'+e+'</li>';});
        s+='</ul>';}
      if(x.pub)s+='<a class="xp-link" style="margin-top:8px" href="'+x.pub.href+'" target="_blank" rel="noopener">'+I.bio+x.pub.label+'</a>';
      s+='</span></div>';
    });
    s+='</div>';
    s+='<a class="lrow" href="https://vit.ac.in/" target="_blank" rel="noopener" aria-label="Vellore Institute of Technology"><span class="li b-doc" aria-hidden="true">'+I.edu+'</span><span class="t"><b>Vellore Institute of Technology</b><span>vit.ac.in</span></span><span class="go" aria-hidden="true">'+I.go+'</span></a>';
    s+='<a class="lrow" href="https://www.linkedin.com/in/bkrishnakanth/details/projects/" target="_blank" rel="noopener" aria-label="Academic projects on LinkedIn"><span class="li b-in" aria-hidden="true">'+I.in+'</span><span class="t"><b>Academic Projects</b><span>LinkedIn · details/projects</span></span><span class="go" aria-hidden="true">'+I.go+'</span></a>';
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
    s+='</div><div class="sub-h">Domains of expertise</div><div class="chips">';
    domains.forEach(function(c){s+='<span class="chip">'+c[0]+' · '+c[1]+'</span>';});
    s+='</div><div class="sub-h">Soft skills</div><div class="chips">';
    softSkills.forEach(function(c){s+='<span class="chip">'+c+'</span>';});
    s+='</div><div class="sub-h">Profiles</div>';
    skillLinks.forEach(function(c){s+=linkRow(c);});
    return s;
  }
  function buildCerts(){
    var s='<div class="page-head"><h2 tabindex="-1">Certifications</h2><p>52 credentials · verified</p></div>';
    s+='<div class="stats"><div class="stat"><b>52</b><span>Credentials</span></div><div class="stat"><b>6</b><span>Snowflake workshops</span></div></div>';
    certs.forEach(function(c){s+=linkRow(c);});
    return s;
  }
  function buildProjects(){
    var s='<div class="page-head"><h2 tabindex="-1">Projects</h2><p>Spare-time &amp; data work</p></div>';
    s+='<p class="tagline">Data → Analysis → Visualization → Storytelling</p>';
    projectGroups.forEach(function(g){
      s+='<div class="group-h">'+g.h+'</div>';
      g.items.forEach(function(p){s+=linkRow({t:p.t,s:p.s,href:p.href,cls:'b-proj',ic:'proj',ext:true});});
    });
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
  var screenEl=document.querySelector('.screen');
  var statusbar=document.getElementById('statusbar');
  var homeInd=document.querySelector('.home-ind');
  var animating=false;

  function pageEl(id){return document.getElementById('page-'+id);}

  // Static dispatch: the markup builder is chosen by an explicit switch on
  // the page id, never by indexing builders[] with a DOM-derived value, so
  // there is no dynamic method call that a crafted id could mis-target.
  function buildContent(id){
    switch(id){
      case 'about':          return buildAbout();
      case 'experience':     return buildExperience();
      case 'education':      return buildEducation();
      case 'skills':         return buildSkills();
      case 'certifications': return buildCerts();
      case 'projects':       return buildProjects();
      case 'contact':        return buildContact();
      default:               return '';
    }
  }
  function ensureBuilt(id){
    if(built[id])return;
    var el=pageEl(id);
    if(!el)return;
    el.innerHTML=navbar(id)+'<div class="page-scroll">'+buildContent(id)+'</div>';
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
    /* Tab bar is hidden on home (CSS .is-home .tabbar{display:none}) so it can
       never overlap the app-icon grid / dock. */
    screenEl.classList.toggle('is-home',onHome);
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
  var notiTimeEl=document.getElementById('notiTime');
  var notiDateEl=document.getElementById('notiDate');
  var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function tick(){
    var d=new Date(),h=d.getHours(),m=d.getMinutes();
    var t=((h%12)||12)+':'+(m<10?'0'+m:m);
    document.getElementById('clock').textContent=t;
    if(notiTimeEl)notiTimeEl.textContent=t;
    if(notiDateEl)notiDateEl.textContent=DAYS[d.getDay()]+', '+MON[d.getMonth()]+' '+d.getDate();
  }
  tick();setInterval(tick,15000);

  /* ---------- NOTIFICATION CENTER ---------- */
  var noti=document.getElementById('noti');
  var notiList=document.getElementById('notiList');
  var notiOpen=false, lastFocus=null;

  notiList.innerHTML=notifications.map(function(n){
    var icon=I[n.ic]?I[n.ic]:n.ic;
    return '<div class="noti-card"><span class="nic '+n.cls+'" aria-hidden="true">'+icon+'</span>'+
      '<span class="nbody"><span class="nt"><span>'+n.app+'</span><time>'+n.time+'</time></span>'+
      '<span class="nm">'+n.msg+'</span></span></div>';
  }).join('');

  function openNoti(){
    if(notiOpen)return;
    notiOpen=true;lastFocus=document.activeElement;
    noti.classList.remove('dragging');noti.style.transform='';
    noti.classList.add('open');noti.setAttribute('aria-hidden','false');
    statusbar.setAttribute('aria-expanded','true');
    try{noti.focus({preventScroll:true});}catch(e){}
  }
  function closeNoti(){
    if(!notiOpen)return;
    notiOpen=false;
    noti.classList.remove('dragging');noti.style.transform='';
    noti.classList.remove('open');noti.setAttribute('aria-hidden','true');
    statusbar.setAttribute('aria-expanded','false');
    if(lastFocus&&lastFocus.focus){try{lastFocus.focus({preventScroll:true});}catch(e){}}
  }
  statusbar.setAttribute('aria-expanded','false');
  statusbar.addEventListener('click',function(){notiOpen?closeNoti():openNoti();});
  statusbar.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();notiOpen?closeNoti():openNoti();}
  });
  noti.addEventListener('click',function(e){ if(!e.target.closest('.noti-card'))closeNoti(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&notiOpen)closeNoti(); });

  /* swipe: down from top edge to open, up on panel to close */
  var dStart=null, dragging=false, fromTop=false, scrH=0;
  function onDown(e){
    if(animating)return;
    var rect=screenEl.getBoundingClientRect();
    scrH=rect.height;
    if(notiOpen){
      var list=e.target.closest('.noti-list');
      if(list&&list.scrollTop>0){dStart=null;return;}
      fromTop=false;dStart=e.clientY;dragging=false;
    }else{
      if(e.clientY-rect.top>70){dStart=null;return;}
      fromTop=true;dStart=e.clientY;dragging=false;
    }
  }
  function onMove(e){
    if(dStart===null)return;
    var dy=e.clientY-dStart;
    if(!dragging){
      if(Math.abs(dy)<6)return;
      if(fromTop&&dy<=0){dStart=null;return;}
      if(!fromTop&&dy>=0){dStart=null;return;}
      dragging=true;
      if(!reduce){
        noti.classList.add('dragging');
        if(fromTop){noti.classList.add('open');noti.setAttribute('aria-hidden','false');}
      }
    }
    if(reduce)return;
    if(fromTop)noti.style.transform='translateY('+Math.min(0,-scrH+Math.max(0,dy))+'px)';
    else noti.style.transform='translateY('+Math.max(-scrH,dy)+'px)';
  }
  function onUp(e){
    if(dStart===null)return;
    var dy=e.clientY-dStart;dStart=null;
    if(!dragging)return;
    dragging=false;noti.classList.remove('dragging');noti.style.transform='';
    if(fromTop){ if(dy>90){notiOpen=false;openNoti();} else {notiOpen=true;closeNoti();} }
    else { if(dy<-70){notiOpen=true;closeNoti();} else {noti.classList.add('open');} }
  }
  if(window.PointerEvent){
    screenEl.addEventListener('pointerdown',onDown);
    document.addEventListener('pointermove',onMove);
    document.addEventListener('pointerup',onUp);
    document.addEventListener('pointercancel',onUp);
  }else{
    screenEl.addEventListener('touchstart',function(e){onDown(e.touches[0]);},{passive:true});
    document.addEventListener('touchmove',function(e){onMove(e.touches[0]);},{passive:true});
    document.addEventListener('touchend',function(e){onUp(e.changedTouches[0]);});
  }

  /* ---------- SPLASH ---------- */
  var splash=document.getElementById('splash');
  setTimeout(function(){splash.classList.add('hide');},reduce?300:1300);
  setTimeout(function(){if(splash.parentNode)splash.parentNode.removeChild(splash);},reduce?700:2100);

  /* ---------- INITIAL ROUTE ---------- */
  if(location.hash&&builders[(location.hash||'').replace('#','')]) fromHash();
  else { setChrome(true); updateTabs(); }
})();
