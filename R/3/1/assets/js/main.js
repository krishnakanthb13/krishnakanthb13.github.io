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

  /* ---------------- helpers ---------------- */
  var L = function(t,u,m,copy){return {title:t,url:u,meta:m||'',copy:copy||null};};
  var WA = 'https://wa.me/917667360114?text=Hi%2C%20I%20am%20reaching%20out%20to%20you%20after%20checking%20your%20Git-Hub%20Online%20Resume.';

  /* ---------------- DATA ---------------- */
  var nodes = [];
  var links = [];
  function add(n){ nodes.push(n); if(n.parent){ links.push({source:n.parent, target:n.id}); } return n; }

  // ROOT / ABOUT
  add({
    id:'root', label:'Krishna Kanth B', cat:'root', level:0,
    tip:{title:'Krishna Kanth B', sub:'Data & Insights Analyst — start here'},
    detail:{
      kicker:'About',
      heading:'Krishna Kanth B',
      meta:'Data Specialist · Data & Insights Analyst',
      lead:'Actively looking for full-time opportunities · Ex-Amazon · Ex-Optum · Ex-Dell · Ex-J&J | Excel · SQL · Python · Tableau · Looker · PowerBI | VIT Vellore graduate',
      body:[
        'As a Data Analyst with excellent proficiency in Excel, SQL, Python, Tableau, Looker and PowerBI, I bring a wide background across Information Technology (IT), Healthcare (Life Science) and Education Technology (EdTech) domains. This multidimensional experience strengthens my abilities in data collection and analysis, supported by communication, critical thinking and relationship building.',
        'My zeal for knowledge has guided me to Data Analytics, Reporting, Visualization and Storytelling. I excel at applying data-driven solutions to solve critical, pressing problems — making complex data understandable and actionable.'
      ],
      stats:[['8+','Years experience'],['95%','KPI automation (Amazon)'],['90%','Latency reduction (Optum)'],['~118','Hours/month saved'],['9','Career roles'],['M.Sc','VIT Vellore']],
      sections:[{label:'In my career', bullets:[
        'Develop and automate elaborate data reports and dashboards, enhancing data accessibility and usability.',
        'Perform in-depth data analysis to identify trends, patterns and actionable insights.',
        'Collaborate cross-functionally to implement data-driven strategies that improve operational efficiency and outcomes.'
      ]}],
      tags:['Data Analysis & Reporting','Data Visualization & Storytelling','Data Collection & Management','Communication & Critical Thinking','Relationship Building','SQL · Python · Excel','Tableau · Looker · PowerBI'],
      tagsLabel:'Skills & Expertise', tagsAccent:true,
      links:[
        L('Full résumé (BKK.html)','../../../BKK.html','krishnakanthb13.github.io/BKK.html'),
        L('LinkedIn','https://www.linkedin.com/in/bkrishnakanth/','in/bkrishnakanth'),
        L('Digital Garden','https://krishnakanthb13.vercel.app/','krishnakanthb13.vercel.app')
      ],
      hintChildren:'Explore the six branches around me — or click any of them in the graph. Curious? Try typing a name…'
    }
  });

  // BRANCHES
  var branches = [
    {id:'exp', label:'Experience', cat:'exp', sub:'9 roles · 2010 → Present'},
    {id:'skill', label:'Skills', cat:'skill', sub:'5 capability groups'},
    {id:'edu', label:'Education', cat:'edu', sub:'M.Sc · B.Sc · Schooling'},
    {id:'cert', label:'Certifications', cat:'cert', sub:'50+ credentials'},
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
    {id:'e0',label:'Amplenote',role:'Project Lead Developer',co:'Amplenote · Freelancing',dates:'Jan 2024 – Present',
      lead:'I started working on myself and build my own profolio, which I can see and refer to over the course of life time, without losing its Value or Recognition or Sight for future developement.',
      desc:'Current freelancing role — building an open-source plugin ecosystem and a personal knowledge platform around the Amplenote note-taking app.',
      highlights:[
        {text:'Plugin Web Development — developed and published 20+ open-source plugins for a note-taking application using inbuilt API services, JavaScript, HTML, CSS and AI.', sub:['Actively maintained with detailed documentation for community use.','Currently used by more than 500 active users.']},
        {text:'Personal Branding & Web Presence — designed and published a professional online portfolio hosted on GitHub and Google Sites using JavaScript, HTML, CSS and AI.', sub:['A simple online résumé that mimics features from LinkedIn.','Demonstrated initiative in personal branding and showcasing technical expertise.']},
        {text:'Digital Garden — built and maintain a public, evolving collection of personal notes, ideas and resources.', sub:['Uses the Digital Garden plugin in Obsidian, versioned in GitHub and hosted on Vercel.','A long-term knowledge base for continuous learning and community sharing.']}
      ],
      tags:['API','JavaScript','HTML','CSS','Scripting & Programming','Unit Testing','Critical Thinking','Project Planning','Project Execution','Code Documentation','AI Tools','Note-Taking Methodologies','Quality Assurance','Problem-solving','MySQL','SQL','Snowflake Certifications','Data Analytics','Data Visualization','Teamwork + Individual Contribution'],
      links:[
        L('Amplenote','https://www.amplenote.com/','amplenote.com'),
        L('Amplenote Plugins (Plugins List)','https://public.amplenote.com/Y3dy91/krishna-plugins','public.amplenote.com'),
        L('Online Résumé','https://krishnakanthb13.github.io/BKK.html','krishnakanthb13.github.io/BKK.html'),
        L('Digital Garden','https://krishnakanthb13.vercel.app/','krishnakanthb13.vercel.app'),
        L('Data Projects','https://krishnakanthb13.vercel.app/data-projects/101-data-projects/','vercel.app/data-projects')
      ]},
    {id:'e1',label:'PowerSchool',role:'Technical Support Engineer Specialist',co:'PowerSchool (via GlowTouch)',dates:'Sep 2022 – Oct 2023',
      desc:'PowerSchool is a leading provider of cloud-based K-12 education software, helping schools manage grades, attendance, communication and more. Founded in 1997, it offers a comprehensive suite used by educators, administrators, parents and students.',
      highlights:[
        'Proficient in database management using Aqua Data Studio, SSMS and Snowflake, and in secure remote access / system administration with MobaXterm, SSH Putty and Jump-box.',
        'Improved ticketing & knowledge-base usage by 40% in Salesforce, JIRA and Confluence by streamlining processes and enhancing team collaboration.'
      ],
      breakdown:[
        {label:'Technical Support Engineer (Specialist)', bullets:[
          'Streamlined ticketing and knowledge-base processes in Salesforce, JIRA and Confluence to improve efficiency and collaboration across teams.',
          'Used a wide range of tools (Aqua Data Studio, SSMS, Snowflake, MobaXterm, SSH Putty, Jump-box) to support software development, system administration and database management.',
          'Monitored PowerSchool Unified Insights build processes and resolved data-structure issues via JIRA.',
          'Partnered with product and development teams to ensure fast, effective issue resolution.',
          'Managed customization, storage and connection issues by creating JIRA tickets and coordinating with Services, Cloud Ops and Hosting teams.',
          'Delivered exceptional customer support, maintaining high satisfaction levels.'
        ]},
        {label:'Professional Profile', bullets:[
          'Strong expertise in SQL, troubleshooting and cross-team collaboration.',
          'Skilled in fast-paced environments, applying analytical thinking and problem-solving.',
          'Passionate about exceeding expectations through teamwork and direct client engagement.'
        ]}
      ],
      tags:['MySQL','SQL','SSIS/SSMS','Aqua Data Studio','Snowflake Cloud','Data Analytics','Data Visualization','Statistical Data Analysis','Data Reporting','Microsoft Excel','Atlassian Suite','Requirements Gathering','Salesforce','Quality Assurance','Problem-solving','Teamwork','Unit Testing'],
      links:[ L('PowerSchool','https://www.powerschool.com/','powerschool.com'), L('GlowTouch','https://www.glowtouch.com/','glowtouch.com') ]},
    {id:'e2',label:'Amazon',role:'Management Information Systems',co:'Amazon (3D India)',dates:'Jul 2020 – Aug 2021',
      desc:'E-commerce leader selling a vast selection of products and offering cloud computing (AWS). Focused on innovation, with services like Prime, Alexa and Kindle.',
      accolade:{title:'Accolade — Bravo for Ownership (Mar 2021)', text:'Automating the 3D Operations stack report, weekly KPI reports & monthly stack reports.'},
      highlights:[
        'Automated 95% of manual KPI metric calculations, transforming the Stack Reports publishing process.',
        'Reduced latency by 99% and increased reporting flexibility with a streamlined Single Data Source.',
        'Improved accuracy and delivered an ROI of ~118 hours saved per month.'
      ],
      breakdown:[
        {label:'Automating KPI Reporting — 3D India (Operations & Support)', bullets:[
          'Role: 3D Support Coordinator (MIS).',
          'Challenge: before Jul 2020 the team relied on manual Excel, Quip, data extracts and emails — high latency, low accuracy, limited troubleshooting.',
          {text:'Solution', sub:[
            'Designed an automated KPI reporting system using SQL queries, stored procedures, events, advanced Excel formulas and macros.',
            'Re-engineered workflows to reduce redundancy and improve efficiency.'
          ]},
          {text:'Impact', sub:[
            'Live for Operations (Wk Y-34, 2020) saving 6+ manager/lead hours per week; expanded to Support-QA (Wk Y-38, 2020) saving 5+ more.',
            'Developed 30 stored procedures and 20 events for reporting and automation.',
            'Created an event/step log table to simplify troubleshooting.'
          ]}
        ]}
      ],
      tags:['MySQL','SQL','SSMS','Snowflake Cloud','Informatica','SSIS','Data Analytics','Tableau','Statistical Data Analysis','Data Reporting','Microsoft Excel','Data Warehousing','Agile & Waterfall','Requirements Gathering','Quality Assurance','Unit Testing','Systems Analysis','Project Management','Database Management'],
      links:[ L('Amazon','https://www.amazon.in/','amazon.in') ]},
    {id:'e3',label:'Optum',role:'Strategic Analyst',co:'Optum',dates:'May 2017 – Jan 2019',
      desc:'Leading health services company providing data-driven care coordination, pharmacy services and population-health management — improving outcomes and reducing costs with advanced analytics.',
      accolade:{title:'Best Hackathon Project (Mar 2018)', text:'General Ledger Validation Automation across various internal layers of the product.'},
      highlights:[
        'Streamlined insurance proficiency by 20% through in-depth knowledge of U.S. insurance patterns.',
        'Automated General Ledger Validation and built an Organization Hierarchy using SQL stored procedures — 90% latency reduction and 50% reliability improvement.'
      ],
      breakdown:[
        {label:'Data Integration & Automation for Healthcare Systems', bullets:[
          'Clients: Health Quest Systems & Atrium Health (Carolinas HealthCare System).',
          'Designed data integration, mapping and automation across General Ledger, Payroll, Billing, Personnel Specialty and Department Specialty datasets.',
          {text:'Key Contributions', sub:[
            'Comprehensive data mapping across financial and operational domains for consistency.',
            'Built a multi-level classification system (Type, Group, Category).',
            'Implemented robust quality checks across the data flow.',
            'Used SQL to automate GL Validation, Organization Hierarchy and initial error checks.'
          ]},
          {text:'Impact', sub:[
            'Reduced manual validation time by 60%.',
            'Improved data accuracy and reliability across reporting systems.',
            'Enabled faster financial decision-making.'
          ]}
        ]}
      ],
      tags:['Life Sciences','Quality Assurance','MySQL','SQL','SSMS','Data Analytics','Tableau','Elasticsearch','Statistical Data Analysis','Data Reporting','Microsoft Excel','Data Warehousing','Strategic Thinking','Financial Analysis','Market Research','Competitive Analysis','Scenario Planning','Risk Management'],
      links:[ L('Optum','https://www.optum.com/en/','optum.com') ]},
    {id:'e4',label:'Johnson & Johnson',role:'Analyst I / II / III',co:'Johnson & Johnson (via GVW Technologies)',dates:'Mar 2015 – Feb 2017',
      desc:'Global healthcare giant developing pharmaceuticals to medical devices, committed to innovation for improving health outcomes worldwide.',
      accolade:{title:'Best Beginner Award (Apr 2015)', text:'Wrote a Visual Basic / Excel macro for processing final report data to increase efficiency.'},
      highlights:[
        'Boosted review efficiency by 70% and accuracy by 20% by developing a custom MS Excel macro.',
        'Curated a reference library of 75+ data-visualization charts and analytics software for Health Informatics.'
      ],
      breakdown:[
        {label:'Research & Development', bullets:[
          'Hands-on with Spotfire (Desktop/Cloud), Tableau and Minitab for analytics, visualization and reporting.',
          'HPLC-CDS data consolidation: standardized multiple reports and identified pharmaceutical trends.',
          'Explored statistical methods, regression analysis and big-data concepts incl. Hadoop.'
        ]},
        {label:'Process & Quality Management', bullets:[
          'Mastered LabWare LIMS V6 data configuration for McNeil Consumer Healthcare and Janssen Pharmaceutical.',
          'Configured, tested and reviewed master-data objects (specifications, analyses, batch templates) for sites in Canada and Italy.',
          'Supported QC using Lot Manager to verify batches against product specifications.',
          'Ensured Good Documentation Practices (GDP) compliance.',
          'Drove root-cause analysis and CAPA implementation to prevent recurrence.'
        ]}
      ],
      tags:['Quality Assurance','LabWare LIMS','Life Sciences','Microsoft Excel','Data Warehousing','Hadoop','SQL','Tableau','Spotfire','Statistical Data Analysis','Data Analytics','Informatica','SSIS','Analytical Thinking','Problem-Solving','Attention to Detail'],
      links:[ L('Johnson & Johnson','https://www.jnj.com/','jnj.com'), L('GVW Technologies','https://global-value-web.com/','global-value-web.com') ]},
    {id:'e5',label:'Premier Inc.',role:'Content Analyst',co:'Premier Inc. (via Medusind Solutions)',dates:'Dec 2013 – Feb 2015',
      desc:'Medical and dental revenue-cycle management (RCM) provider — billing, insurance verification and practice-management software helping healthcare organizations improve financial performance.',
      highlights:[
        'Streamlined data search and validation with Excel (VLOOKUP, Query) and automation, building a custom tool linking Excel columns to client software.',
        'Enriched and attributed product data across 46 & 210 fields and improved searchability by classifying products with UNSPSC codes.'
      ],
      breakdown:[
        {label:'Healthcare Master Data Management', bullets:[
          'Performed data mapping and validation across manufacturers, vendors, sites and catalogs.',
          'Validated packaging strings and units of measure (UOMs) per ANSI standards.',
          'Applied custom extraction, enrichment and cataloging with multi-field attribution.',
          'Developed taxonomy classification (UNSPSC) to improve organization and searchability.',
          'Maintained high data quality with rigorous QA and cleansing.',
          'Ensured HIPAA compliance, safeguarding sensitive healthcare data.'
        ]}
      ],
      tags:['Data Mapping','Data Enrichment','Data Classification','Microsoft Excel','Requirements Gathering','Life Sciences','Data Warehousing','UNSPSC','HIPAA','ANSI UOM'],
      links:[ L('Premier Inc.','https://premierinc.com/','premierinc.com'), L('Medusind Solutions','https://www.medusind.com/','medusind.com') ]},
    {id:'e6',label:'Dell',role:'Customer Care Voice Sr. Rep',co:'Dell',dates:'Jul 2013 – Dec 2013',
      desc:'Tech leader in PCs and beyond — desktops, laptops, servers and storage — renowned for supply-chain expertise and directly connecting with customers.',
      accolade:{title:'Best Employee of the Month (Sep 2013)', text:'Best rating on performance.'},
      highlights:[
        'Streamlined customer intake with a classification system prioritizing inquiries by urgency in a single mail/call interaction.',
        'Gained broad insurance expertise across multiple U.S. healthcare providers and policy structures.'
      ],
      breakdown:[
        {label:'Healthcare Claims Processing & Eligibility — Conifer Health Solutions', bullets:[
          'Processed professional and facility claims with full HIPAA compliance.',
          'Verified eligibility and benefits with Aetna, AARP, BCBS, Cigna etc., interpreting AAPC medical codes.',
          'Processed Medicare and Medicaid claims accurately and on time.',
          'Calculated deductibles, co-insurance and co-pays in real time.'
        ]}
      ],
      tags:['Microsoft Office','Technical Support','Quality Assurance','Communication','Problem-Solving','Customer Service','Conflict Resolution','Process Adherence','Time Management','CRM Software','Email Communication'],
      links:[ L('Dell','https://www.dell.com/en-in','dell.com') ]},
    {id:'e7',label:'Symantec',role:'Product Support Analyst',co:'Symantec',dates:'Apr 2011 – Jul 2011',
      desc:'Provides cybersecurity solutions including industry-leading endpoint protection and email security, protecting businesses and individuals from evolving cyber threats.',
      highlights:[
        'Troubleshot antivirus issues using Symantec products, resolving complex problems efficiently.',
        'Provided remote technical support via phone and remote-access tools for quick resolution.'
      ],
      breakdown:[
        {label:'Technical Support Specialist — Norton Security Products', bullets:[
          'Guided customers in securing their online environments with Norton security solutions.',
          'Assisted with installation, configuration and updates on Windows, resolving install errors.',
          'Advanced troubleshooting and threat mitigation — virus, spyware and malware removal via safe-mode.',
          'Contributed to knowledge-base documentation for new scenarios.',
          'Resolved software compatibility issues across applications and OS configurations.'
        ]}
      ],
      tags:['Troubleshooting','Problem-Solving','Technical Knowledge','Communication','Customer Service','Documentation','Attention to Detail','Ticketing Systems','Remote Desktop Software','Diagnostic Tools','Visual Studio 2003'],
      links:[ L('Symantec','https://www.broadcom.com/products/cybersecurity','broadcom.com') ]},
    {id:'e8',label:'Sitel India',role:'Customer Service Professional',co:'Sitel India',dates:'Sep 2010 – Mar 2011',
      desc:'Customer-experience (CX) management company providing contact-center operations, digital support and social-media engagement to build loyalty and improve efficiency.',
      accolade:{title:'Resolution Expert of the Month (Jan 2011)', text:'Most successful resolutions on the first attempt.'},
      highlights:[
        'Adept problem solver — troubleshot OS, application and hardware issues with a high first-call resolution rate.',
        'Exceptional communication — explained technical solutions clearly, ensuring understanding and satisfaction.'
      ],
      breakdown:[
        {label:'Technical & Customer Support — Dell-On-Call Services', bullets:[
          'Delivered support for Dell and non-Dell customers via inbound and outbound channels.',
          'Troubleshot laptops, desktops, system software, routers, LANs, docking stations, printers and gaming consoles.',
          'Resolved installation, configuration, customization and performance problems.',
          'Managed escalations and handled irate clients while ensuring satisfaction.',
          'Increased customer lifetime value via warranty extensions, upgrades and add-ons.'
        ]}
      ],
      tags:['Communication','Customer Service','Problem-Solving','Empathy','Patience','Conflict Resolution','Process Adherence','Technical Knowledge','Sales Techniques','CRM Proficiency','Live Chat Software','Knowledge Base'],
      links:[ L('Sitel India','https://foundever.com/','foundever.com') ]}
  ];
  exp.forEach(function(e){
    var secs=[{label:'Highlights', bullets:e.highlights}];
    if(e.breakdown) secs=secs.concat(e.breakdown);
    var det={ kicker:'Experience', heading:e.role, meta:e.co, metaMono:e.dates,
      desc:e.desc, accolade:e.accolade, sections:secs,
      tags:e.tags, tagsLabel:'Top Skills Utilized', links:e.links };
    if(e.lead) det.lead=e.lead;
    add({ id:e.id, label:e.label, cat:'exp', level:2, parent:'exp',
      tip:{title:e.role, sub:e.co+' · '+e.dates}, detail:det });
  });

  /* ---- SKILLS leaves ---- */
  var skill = [
    {id:'s1',label:'Databases',items:['SQL','SSMS','MySQL','Aqua Data Studio','Snowflake','Stored Procedures','Database Functions','SSIS'],
      body:'SQL (SSMS · MySQL · Aqua Data · Snowflake) — Querying · Stored Procedures · Database Functions. Proficiency ★★★.',
      links:[L('Snowflake — Certificates Archive','https://achieve.snowflake.com/profile/krishnakanthb/wallet','achieve.snowflake.com')]},
    {id:'s2',label:'Visualization',items:['Tableau','Spotfire','Looker','Power BI','Excel Dashboards'],
      body:'Data Visualization & Reporting — Tableau · Spotfire · Excel Dashboards. Proficiency ★★.',
      links:[L('Tableau Public Visualizations','https://public.tableau.com/app/profile/krishnakanthb13/vizzes','public.tableau.com')]},
    {id:'s3',label:'Automation',items:['Advanced Excel','Pivot Tables','Macros','Python','VLOOKUP / Query','Automation'],
      body:'Microsoft Excel — Advanced Formulas · Pivot Tables · Macros · Automation. Proficiency ★★★.'},
    {id:'s4',label:'Domains',items:['MIS — Org Hierarchy','SIS — EdTech','LIMS — Pharma','SCM — Hospitals / Healthcare'],
      body:'Domain expertise across Management, Student & Laboratory Information Systems and Supply Chain Management.'},
    {id:'s5',label:'Quality & Compliance',items:['LabWare LIMS','Master Data Objects','GDP','LOT Run & Audit','CAPA','HIPAA','UNSPSC','ANSI'],
      body:'LabWare LIMS — Master Data Objects · GDP · LOT Run & Audit · Regulatory Compliance. Proficiency ★.'}
  ];
  skill.forEach(function(s){
    add({ id:s.id, label:s.label, cat:'skill', level:2, parent:'skill',
      tip:{title:s.label, sub:s.items.length+' skills'},
      detail:{ kicker:'Skill group', heading:s.label, meta:s.items.length+' technologies & competencies',
        body:s.body?[s.body]:null, tags:s.items, tagsAccent:true, tagsLabel:'Stack', links:s.links||null }});
  });
  // enrich the Skills branch with domain + soft skills
  (function(){
    var sb=nodes.find(function(n){return n.id==='skill';});
    sb.detail.body=['Specialized in Data Validation, Integration and Enrichment across diverse projects — consistently driving optimal outcomes.'];
    sb.detail.sections=[{label:'Domain of Expertise', bullets:[
      'Management Information System (MIS) — Organization Hierarchy',
      'Student Information System (SIS) — Education Technology',
      'Laboratory Information Management System (LIMS) — Pharmaceuticals',
      'Supply Chain Management (SCM) — Hospitals / Health Care'
    ]}];
    sb.detail.tags=['Telephonic Communication','E-mail Etiquette','Facilitation','Presentation','Conflict Resolution','Decision Making','Adaptability','Team Building','Reliability','Delegation','Rapport Building','Creativity','Innovation','Analysis & Research','Questioning','Prioritization','Detail Oriented','Planning','Problem-solving','Critical Thinking','Leadership','Negotiation','Type-writing (English)'];
    sb.detail.tagsLabel='Soft Skills';
  })();

  /* ---- EDUCATION leaves ---- */
  var edu = [
    {id:'d1',label:'M.Sc Biotechnology',inst:'VIT Vellore',dates:'06/2011 – 03/2013',
      body:'M.Sc Biotechnology · Vellore Institute of Technology · 8.62 CGPA.',
      sections:[
        {label:'Dissertation (Mar 2013)', bullets:['Expression of CD36 Gene in Type 1 Diabetic Rat Kidneys']},
        {label:'International SET Conference papers', bullets:[
          '5th Intl. Conf. on Science, Engineering & Technology (Dec 2012) — Extraction, characterization and screening of phytocompounds from Indian Pomegranate (hybrid variety).',
          '4th Intl. Conf. on Science, Engineering & Technology (Mar 2012) — Role of flavonoids on cancer.',
          '3rd Intl. Conf. on Science, Engineering & Technology (Dec 2012) — Isolation, Characterization and Quantification of Siderophore produced by Rhizosphere bacteria of Opuntia sp.'
        ]}
      ],
      tags:['8.62 CGPA','Dissertation','3 SET papers','Biotechnology'],
      links:[
        L('Vellore Institute of Technology','https://vit.ac.in/','vit.ac.in'),
        L('Detailed View on Projects — LinkedIn','https://www.linkedin.com/in/bkrishnakanth/details/projects/','linkedin.com'),
        L('Publication — Asian Journal of Microbiology, Biotech. & Env. Sci.','http://www.envirobiotechjournals.com/article_abstract.php?aid=4477&iid=157&jid=1','envirobiotechjournals.com')
      ]},
    {id:'d2',label:'B.Sc Biotechnology',inst:'D. G. Vaishnav College · Univ. of Madras',dates:'06/2007 – 03/2010',
      body:'B.Sc Biotechnology · D. G. Vaishnav College (University of Madras) · 62.80%.',
      tags:['62.80%','Biotechnology'],
      links:[L('D. G. Vaishnav College','https://www.dgvaishnavcollege.edu.in/','dgvaishnavcollege.edu.in')]},
    {id:'d3',label:'Schooling (PCB + Math)',inst:"St. Mary's A.I.H.S.S.",dates:'2007',
      body:'Higher secondary schooling — Physics, Chemistry, Biology and Mathematics.',
      tags:['PCB + Math'],
      links:[L("St. Mary's Anglo India Higher Secondary School",'https://stmarysaihss.com/','stmarysaihss.com')]}
  ];
  edu.forEach(function(e){
    add({ id:e.id, label:e.label, cat:'edu', level:2, parent:'edu',
      tip:{title:e.label, sub:e.inst+' · '+e.dates},
      detail:{ kicker:'Education', heading:e.label, meta:e.inst, metaMono:e.dates,
        body:e.body?[e.body]:null, sections:e.sections||null, tags:e.tags, links:e.links }});
  });

  /* ---- CERTIFICATIONS leaves ---- */
  var cert = [
    {id:'c1',label:'Snowflake',title:'Snowflake — Hands-On Essentials',meta:'achieve.snowflake.com',
      body:'A series of Snowflake hands-on workshop credentials (2024) plus the full certificate wallet.',
      links:[
        L('Snowflake — Certificate Wallet','https://achieve.snowflake.com/profile/krishnakanthb/wallet','achieve.snowflake.com'),
        L('Data Warehousing Workshop','https://achieve.snowflake.com/bb0fe1c3-8076-4f22-9a48-ada4cad28c63#gs.8p6uqy','achieve.snowflake.com'),
        L('Data Engineering Workshop','https://achieve.snowflake.com/aee9c501-4765-48b0-9fe2-7df7dc8bea2c#gs.8p6vck','achieve.snowflake.com'),
        L('Data Lake Workshop','https://achieve.snowflake.com/df134f93-d945-4fe1-b535-01a11500dd02#gs.8p6vcl','achieve.snowflake.com'),
        L('Data Cloud Deployment Framework','https://achieve.snowflake.com/0f6d5c09-7807-45df-9759-f32c76828c64#gs.8p6vcn','achieve.snowflake.com')
      ]},
    {id:'c2',label:'LinkedIn',title:'LinkedIn — Licenses & Certifications',meta:'linkedin.com',
      body:'All licenses & certifications, maintained on LinkedIn.',
      links:[L('Licenses & Certifications — LinkedIn','https://www.linkedin.com/in/bkrishnakanth/details/certifications/','linkedin.com')]},
    {id:'c3',label:'More',title:'Notable credentials',meta:'A few highlights',
      body:'Beyond Snowflake — analytics, AI tooling and programming credentials. See the full list of 50+ on the résumé.',
      links:[
        L('Data Analytics Certificate — Pro5.AI','https://drive.google.com/file/d/1ekt9RT_Z5h1sw2Tu5ZzeHrKV9q6D-cwR/view?usp=drive_link','drive.google.com'),
        L('SQL using AI Workshop — be10x','https://certx.in/certificate/a3ae0c0d-1f62-4e3f-bede-17ff37c364a7688515','certx.in'),
        L('Fundamentals of Docker & Kubernetes — Scaler','https://moonshot.scaler.com/s/sl/bEjI_azO_N','moonshot.scaler.com'),
        L('Full certifications list','../../../BKK.html#certifications','BKK.html#certifications')
      ]}
  ];
  cert.forEach(function(c){
    add({ id:c.id, label:c.label, cat:'cert', level:2, parent:'cert',
      tip:{title:c.title, sub:c.meta},
      detail:{ kicker:'Certifications', heading:c.title, meta:c.meta, body:c.body?[c.body]:null, links:c.links }});
  });
  // enrich the Certifications branch
  (function(){
    var cb=nodes.find(function(n){return n.id==='cert';});
    cb.detail.body=['A portfolio spanning 50+ credentials — Snowflake hands-on workshops, data analytics, AI tooling, programming and academic honours.'];
    cb.detail.links=[
      L('Snowflake — Certificate Wallet','https://achieve.snowflake.com/profile/krishnakanthb/wallet','achieve.snowflake.com'),
      L('Licenses & Certifications — LinkedIn','https://www.linkedin.com/in/bkrishnakanth/details/certifications/','linkedin.com'),
      L('Full certifications list (50+)','../../../BKK.html#certifications','BKK.html#certifications')
    ];
  })();

  /* ---- PROJECTS leaves ---- */
  var proj = [
    {id:'p1',label:'H-1B 2025',title:'H-1B Analysis — 2025',meta:'Data Project · Oct 2025',
      url:'https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-2025/'},
    {id:'p2',label:'H-1B Historical',title:'H-1B Analysis — Historical',meta:'Data Project · Oct 2025',
      url:'https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-historical/'},
    {id:'p3',label:'Arattai Trends',title:'Arattai Trend Analytics',meta:'Data Project · Oct 2025',
      url:'https://krishnakanthb13.vercel.app/data-projects/arattai-trend-analytics/'},
    {id:'p4',label:'101 Projects',title:'Data Projects — 101',meta:'Digital Garden hub',
      url:'https://krishnakanthb13.vercel.app/data-projects/101-data-projects/'},
    {id:'p5',label:'Digital Garden',title:'Digital Garden',meta:'Public knowledge base',
      url:'https://krishnakanthb13.vercel.app/'}
  ];
  proj.forEach(function(p){
    add({ id:p.id, label:p.label, cat:'proj', level:2, parent:'proj',
      tip:{title:p.title, sub:p.meta},
      detail:{ kicker:'Project', heading:p.title, meta:p.meta,
        body:['Data → Analysis → Visualization → Storytelling.'],
        links:[L('Open project →',p.url,'krishnakanthb13.vercel.app')] }});
  });
  // enrich Projects branch
  (function(){
    var pb=nodes.find(function(n){return n.id==='proj';});
    pb.detail.body=['Data Quests — Data → Analysis → Visualization → Storytelling.'];
    pb.detail.links=[
      L('H-1B Analysis — 2025','https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-2025/','vercel.app'),
      L('H-1B Analysis — Historical','https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-historical/','vercel.app'),
      L('Arattai Trend Analytics','https://krishnakanthb13.vercel.app/data-projects/arattai-trend-analytics/','vercel.app'),
      L('Data Projects — 101','https://krishnakanthb13.vercel.app/data-projects/101-data-projects/','vercel.app'),
      L('Digital Garden','https://krishnakanthb13.vercel.app/','vercel.app')
    ];
  })();

  /* ---- CONTACT leaves ---- */
  var contact = [
    {id:'k1',label:'Email',title:'Email',url:'mailto:krishnakanthb13@gmail.com',meta:'krishnakanthb13@gmail.com',copy:'krishnakanthb13@gmail.com'},
    {id:'k2',label:'Phone',title:'Phone / WhatsApp',url:'tel:+917667360114',meta:'+91 7667360114',copy:'+917667360114'},
    {id:'k3',label:'LinkedIn',title:'LinkedIn',url:'https://www.linkedin.com/in/bkrishnakanth/',meta:'in/bkrishnakanth'},
    {id:'k4',label:'GitHub',title:'GitHub',url:'https://github.com/krishnakanthb13/',meta:'github.com/krishnakanthb13'},
    {id:'k5',label:'BioLink',title:'BioLink',url:'https://bio.site/krishnakanthb13',meta:'bio.site/krishnakanthb13'},
    {id:'k6',label:'Tableau',title:'Tableau Public',url:'https://public.tableau.com/app/profile/krishnakanthb13/vizzes',meta:'public.tableau.com'}
  ];
  contact.forEach(function(k){
    add({ id:k.id, label:k.label, cat:'contact', level:2, parent:'contact',
      tip:{title:k.title, sub:k.meta},
      detail:{ kicker:'Contact', heading:k.title, meta:k.meta, links:[L(k.title,k.url,k.meta,k.copy)] }});
  });
  // contact branch: full link list with copy affordances
  (function(){
    var cb=nodes.find(function(n){return n.id==='contact';});
    cb.detail.links=[
      L('Email','mailto:krishnakanthb13@gmail.com','krishnakanthb13@gmail.com','krishnakanthb13@gmail.com'),
      L('Phone','tel:+917667360114','+91 7667360114','+917667360114'),
      L('WhatsApp','https://wa.me/917667360114','wa.me/917667360114'),
      L('LinkedIn','https://www.linkedin.com/in/bkrishnakanth/','in/bkrishnakanth'),
      L('GitHub','https://github.com/krishnakanthb13/','github.com/krishnakanthb13'),
      L('BioLink','https://bio.site/krishnakanthb13','bio.site/krishnakanthb13'),
      L('Digital Garden','https://krishnakanthb13.vercel.app/','krishnakanthb13.vercel.app'),
      L('Tableau Public','https://public.tableau.com/app/profile/krishnakanthb13/vizzes','public.tableau.com')
    ];
  })();

  /* ---- SECRET node (easter egg) ---- */
  add({
    id:'egg', label:'✨ Always Learning', cat:'root', level:2, parent:'root', secret:true,
    tip:{title:'You found the secret node!', sub:'Curiosity unlocked'},
    detail:{
      kicker:'✨ Easter Egg',
      heading:'You found the secret node!',
      meta:'Curiosity unlocked',
      body:[
        'Nicely done — you typed the magic word. Krishna believes the best analysts are the curious ones who keep poking at things until they reveal their story.',
        'Thanks for exploring the graph. Now go connect — or hire a relentlessly curious data person.'
      ],
      tags:['Curiosity','Data Storytelling','Always Learning'],
      links:[
        L('Email me','mailto:krishnakanthb13@gmail.com','krishnakanthb13@gmail.com','krishnakanthb13@gmail.com'),
        L('Full résumé','../../../BKK.html','BKK.html')
      ],
      hintChildren:'Type it again any time for another burst. Press Reset to tidy up.'
    }
  });

  // index for quick lookup
  var byId = {}; nodes.forEach(function(n){ byId[n.id]=n; });

  /* ---------------- Expansion state ---------------- */
  var expanded = {}; // id -> bool
  var eggOn = false;
  var layoutMode = 'force'; // force | radial | grid | circle
  branches.forEach(function(b){ expanded[b.id]=false; });

  function childrenOf(id){ return nodes.filter(function(n){return n.parent===id && !n.secret;}); }
  function isVisible(n){
    if(n.secret) return eggOn;
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

  var BASE_ALPHA_DECAY = prefersReduced?.15:.0228;
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
      .attr('class',function(d){return 'node node-'+d.cat+(d.secret?' node-secret':'');})
      .attr('tabindex',0)
      .attr('role','button')
      .attr('aria-label',function(d){return d.tip.title+'. '+d.tip.sub;})
      .call(drag(sim))
      .on('click', function(ev,d){ ev.stopPropagation(); activate(d); })
      .on('dblclick', function(ev,d){ ev.stopPropagation(); togglePin(d); })
      .on('keydown', function(ev,d){
        if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); activate(d); }
        else if(ev.key==='p'||ev.key==='P'){ ev.preventDefault(); togglePin(d); }
      })
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

    // update badge text + pinned state on existing
    nodeSel.select('text.expand-badge').text(function(d){return expanded[d.id]?'−':'+';});
    nodeSel.classed('pinned',function(d){return !!d.__pinned;});

    sim.nodes(vN);
    sim.force('link').links(vL);
    // keep non-force layouts coherent as the visible set changes
    if(layoutMode!=='force'){ computeTargets(layoutMode); }
    sim.alpha(animate===false?.2:.85).restart();

    applySearch();
    updateStats();
  }

  function ticked(){
    linkSel
      .attr('x1',function(d){return d.source.x;})
      .attr('y1',function(d){return d.source.y;})
      .attr('x2',function(d){return d.target.x;})
      .attr('y2',function(d){return d.target.y;});
    nodeSel.attr('transform',function(d){return 'translate('+d.x+','+d.y+')';});
  }
  sim.on('tick', ticked);

  /* ---------------- Drag ---------------- */
  function drag(simulation){
    function started(ev,d){ if(!ev.active) simulation.alphaTarget(.3).restart(); d.fx=d.x; d.fy=d.y; }
    function dragged(ev,d){ d.fx=ev.x; d.fy=ev.y; }
    function ended(ev,d){ if(!ev.active) simulation.alphaTarget(0); if(d.level!==0 && !d.__pinned){ d.fx=null; d.fy=null; } }
    return d3.drag().on('start',started).on('drag',dragged).on('end',ended);
  }

  /* ---------------- Pinning ---------------- */
  function togglePin(d){
    if(d.level===0) return; // root stays put
    d.__pinned = !d.__pinned;
    if(d.__pinned){ d.fx=d.x; d.fy=d.y; }
    else { d.fx=null; d.fy=null; sim.alpha(.3).restart(); }
    nodeSel.classed('pinned',function(n){return !!n.__pinned;});
    flash(d.__pinned ? ('Pinned “'+d.tip.title+'”') : ('Unpinned “'+d.tip.title+'”'));
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
      (d.tip.sub?'<div class="tt-sub">'+esc(d.tip.sub)+'</div>':'')+
      (d.__pinned?'<div class="tt-sub" style="color:'+CAT.proj.color+'">📌 pinned</div>':'');
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

  function renderBullets(bullets){
    var h='<ul class="d-list">';
    bullets.forEach(function(b){
      if(typeof b==='string'){ h+='<li>'+esc(b)+'</li>'; }
      else { h+='<li>'+esc(b.text)+(b.sub?renderBullets(b.sub):'')+'</li>'; }
    });
    return h+'</ul>';
  }

  function openDrawer(d){
    var c=CAT[d.cat].color, det=d.detail||{};
    lastFocus=document.activeElement;
    dAccent.style.background=c;
    var dot=dCat.querySelector('.dot');
    dot.style.color=c; dot.style.background=c;
    dCat.style.color=c;
    dCat.querySelector('.catname').textContent=det.kicker||CAT[d.cat].label;
    dTitle.textContent=det.heading||d.label;

    // meta (plain text + optional mono dates)
    var metaHtml='';
    if(det.meta) metaHtml+=esc(det.meta);
    if(det.metaMono) metaHtml+=(metaHtml?'&nbsp;&nbsp;·&nbsp;&nbsp;':'')+'<span class="mono">'+esc(det.metaMono)+'</span>';
    dMeta.innerHTML=metaHtml;

    // body
    var html='';
    if(det.lead) html+='<p class="lead">'+esc(det.lead)+'</p>';
    if(det.desc) html+='<p class="company-desc">'+esc(det.desc)+'</p>';
    if(det.body) det.body.forEach(function(p){ html+='<p>'+esc(p)+'</p>'; });

    if(det.accolade){
      html+='<div class="accolade"><span class="acc-icon" aria-hidden="true">🏆</span><div>'+
        '<div class="acc-title">'+esc(det.accolade.title)+'</div>'+
        '<div class="acc-text">'+esc(det.accolade.text)+'</div></div></div>';
    }

    if(det.stats){
      html+='<div class="stat-grid">';
      det.stats.forEach(function(s){ html+='<div class="stat"><div class="n">'+esc(s[0])+'</div><div class="l">'+esc(s[1])+'</div></div>'; });
      html+='</div>';
    }

    if(det.sections){
      det.sections.forEach(function(sec){
        html+='<div class="sec-label">'+esc(sec.label)+'</div>'+renderBullets(sec.bullets);
      });
    }

    if(det.tags){
      var tlabel = det.tagsLabel || (d.cat==='skill'?'Stack':'Highlights');
      html+='<div class="sec-label">'+esc(tlabel)+'</div><div class="chip-row">';
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
        var ext=!/^(mailto:|tel:|\.\.\/|#)/.test(lk.url);
        var attrs=ext?' target="_blank" rel="noopener"':'';
        html+='<div class="link-row"><a href="'+esc(lk.url)+'"'+attrs+'><span><span>'+esc(lk.title)+'</span>'+
          (lk.meta?'<span class="meta">'+esc(lk.meta)+'</span>':'')+'</span>'+
          '<span class="arrow"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg></span></a>';
        if(lk.copy){
          html+='<button class="copy-btn" type="button" data-copy="'+esc(lk.copy)+'" aria-label="Copy '+esc(lk.title)+'" title="Copy">'+
            '<svg viewBox="0 0 24 24" class="ic-copy"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'+
            '<svg viewBox="0 0 24 24" class="ic-ok"><path d="M20 6 9 17l-5-5"/></svg></button>';
        }
        html+='</div>';
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
    // wire copy buttons
    dBody.querySelectorAll('.copy-btn').forEach(function(b){
      b.addEventListener('click',function(){ copyText(b.getAttribute('data-copy'), b); });
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

  /* ---------------- Copy to clipboard ---------------- */
  function copyText(text, btn){
    function ok(){
      if(!btn) return;
      btn.classList.add('copied');
      var old=btn.getAttribute('aria-label');
      btn.setAttribute('aria-label','Copied');
      flash('Copied: '+text);
      setTimeout(function(){ btn.classList.remove('copied'); btn.setAttribute('aria-label',old); },1500);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(ok).catch(function(){ fallbackCopy(text,ok); });
    } else { fallbackCopy(text,ok); }
  }
  function fallbackCopy(text,ok){
    try{
      var ta=document.createElement('textarea');
      ta.value=text; ta.setAttribute('readonly','');
      ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta); ok();
    }catch(e){}
  }

  /* ---------------- Toast / flash ---------------- */
  var toast=document.createElement('div'); toast.className='toast'; toast.setAttribute('role','status'); toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);
  var toastTimer;
  function flash(msg){
    toast.textContent=msg; toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){ toast.classList.remove('on'); },1600);
  }

  /* ---------------- Legend + live stats + controls ---------------- */
  var legendEl=document.querySelector('.legend');
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
  // footer: expand/collapse-all, live counter, subtle egg hint
  var foot=document.createElement('div'); foot.className='legend-foot';
  foot.innerHTML='<button type="button" id="toggle-all" class="legend-btn">Expand all</button>'+
    '<div class="legend-stat" id="legend-stat"></div>'+
    '<div class="egg-hint" aria-hidden="true">⌨ the curious type names…</div>';
  legendEl.appendChild(foot);
  var statEl=document.getElementById('legend-stat');
  var toggleAllBtn=document.getElementById('toggle-all');
  toggleAllBtn.addEventListener('click',function(){
    var anyClosed=branches.some(function(b){return !expanded[b.id];});
    branches.forEach(function(b){ expanded[b.id]=anyClosed; });
    restart();
  });
  function updateStats(){
    var vis=visibleNodes().length;
    var tot=nodes.length-1+(eggOn?1:0); // minus the secret node unless revealed
    var openB=branches.filter(function(b){return expanded[b.id];}).length;
    if(statEl) statEl.textContent=vis+' / '+tot+' nodes · '+openB+'/'+branches.length+' branches';
    var allOpen=branches.every(function(b){return expanded[b.id];});
    if(toggleAllBtn) toggleAllBtn.textContent=allOpen?'Collapse all':'Expand all';
  }

  /* ---------------- Layout modes ---------------- */
  var lcBtns=[].slice.call(document.querySelectorAll('.lc-btn'));
  function updateLayoutButtons(active){
    lcBtns.forEach(function(b){
      var on=b.getAttribute('data-layout')===active;
      b.classList.toggle('is-active',on);
      b.setAttribute('aria-pressed',on?'true':'false');
    });
  }

  // Per-node target positions (n._tx,n._ty) used by forceX/forceY in non-force modes.
  function computeTargets(mode){
    var cx=W/2, cy=H/2, vis=visibleNodes();
    if(mode==='radial'){
      var order=['exp','skill','edu','cert','proj','contact'];
      var R1=Math.min(W,H)*0.19, R2=Math.min(W,H)*0.38;
      byId.root._tx=cx; byId.root._ty=cy;
      order.forEach(function(bid,i){
        var ang=(i/order.length)*2*Math.PI - Math.PI/2;
        var b=byId[bid];
        if(b){ b._tx=cx+Math.cos(ang)*R1; b._ty=cy+Math.sin(ang)*R1; }
        var kids=childrenOf(bid).filter(isVisible);
        var spread=(Math.PI/order.length)*1.1;
        kids.forEach(function(k,j){
          var t=kids.length===1?0:(j/(kids.length-1)-0.5);
          var a=ang+t*spread;
          k._tx=cx+Math.cos(a)*R2; k._ty=cy+Math.sin(a)*R2;
        });
      });
      if(byId.egg && isVisible(byId.egg)){ byId.egg._tx=cx; byId.egg._ty=cy-R1*0.6; }
    } else if(mode==='circle'){
      var R=Math.min(W,H)*0.40;
      byId.root._tx=cx; byId.root._ty=cy;
      var others=vis.filter(function(n){return n.id!=='root';});
      others.forEach(function(n,i){
        var a=(i/Math.max(1,others.length))*2*Math.PI - Math.PI/2;
        n._tx=cx+Math.cos(a)*R; n._ty=cy+Math.sin(a)*R;
      });
    } else if(mode==='grid'){
      var arr=vis.slice().sort(function(a,b){
        var oa=legendOrder.indexOf(a.cat), ob=legendOrder.indexOf(b.cat);
        if(oa!==ob) return oa-ob;
        if(a.level!==b.level) return a.level-b.level;
        return a.id<b.id?-1:1;
      });
      var n=arr.length;
      var cols=Math.max(1,Math.round(Math.sqrt(n*(W/Math.max(1,H)))));
      var rows=Math.ceil(n/cols);
      var gapX=Math.min((W*0.82)/Math.max(1,cols),150);
      var gapY=Math.min((H*0.74)/Math.max(1,rows),120);
      var startX=cx-(cols-1)*gapX/2, startY=cy-(rows-1)*gapY/2;
      arr.forEach(function(node,i){
        var r=Math.floor(i/cols), c=i%cols;
        node._tx=startX+c*gapX; node._ty=startY+r*gapY;
      });
    } else { // force
      vis.forEach(function(node){ node._tx=cx; node._ty=cy; });
    }
  }

  function forceModeForces(){
    sim.force('center', d3.forceCenter(W/2,H/2));
    sim.force('charge').strength(function(d){return charge(d);});
    sim.force('link').strength(.65);
    sim.force('collide').radius(function(d){return radius(d)+14;});
    sim.force('x', d3.forceX(W/2).strength(.04));
    sim.force('y', d3.forceY(H/2).strength(.04));
  }

  function releaseFixed(){
    nodes.forEach(function(n){ if(!n.__pinned){ n.fx=null; n.fy=null; } });
  }

  function setLayout(mode, reseed){
    var isShuffle=(mode==='shuffle');
    if(isShuffle) mode='force';
    layoutMode=mode;
    updateLayoutButtons(mode);
    releaseFixed();                       // let nodes flow to new targets (pinned stay put)
    computeTargets(mode);

    if(reseed){
      visibleNodes().forEach(function(n){
        if(n.__pinned) return;
        n.x=W*0.12+Math.random()*W*0.76;
        n.y=H*0.12+Math.random()*H*0.76;
        n.vx=(Math.random()-.5)*40; n.vy=(Math.random()-.5)*40;
      });
    }

    if(mode==='force'){
      forceModeForces();
    } else {
      sim.force('center', null);
      sim.force('charge').strength(function(d){ return mode==='radial'? charge(d)*0.12 : 0; });
      sim.force('link').strength(mode==='radial'?0.18:0.03);
      sim.force('collide').radius(function(d){ return radius(d)+(mode==='grid'?7:9); });
      var sx = mode==='grid'?0.55:(mode==='circle'?0.5:0.42);
      sim.force('x', d3.forceX(function(d){return d._tx;}).strength(sx));
      sim.force('y', d3.forceY(function(d){return d._ty;}).strength(sx));
    }

    if(prefersReduced){
      if(mode!=='force'){
        visibleNodes().forEach(function(n){
          if(n.__pinned) return;
          if(n._tx!=null){ n.x=n._tx; n.y=n._ty; }
          n.vx=0; n.vy=0;
        });
        ticked();
        sim.alpha(.05).restart();         // tiny settle for collide only
      } else {
        sim.alpha(.5).restart();          // settles fast (reduced alphaDecay is high)
      }
    } else {
      sim.alpha(.9).alphaDecay(BASE_ALPHA_DECAY).restart();
    }
  }

  lcBtns.forEach(function(b){
    b.addEventListener('click',function(){
      var m=b.getAttribute('data-layout');
      if(m==='shuffle'){ setLayout('shuffle', true); flash('🔀 Shuffled the graph'); }
      else { setLayout(m, false); flash('Layout: '+b.textContent.trim()); }
    });
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
      var extra='';
      if(n.detail){
        if(n.detail.tags) extra+=' '+n.detail.tags.join(' ');
        if(n.detail.body) extra+=' '+n.detail.body.join(' ');
      }
      var hay=(n.label+' '+(n.tip.title||'')+' '+(n.tip.sub||'')+extra).toLowerCase();
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
      restart(false);
      applySearch();
    },140);
  });

  /* ---------------- Reset / recenter ---------------- */
  document.getElementById('recenter').addEventListener('click',function(){
    branches.forEach(function(b){ expanded[b.id]=false; });
    eggOn=false;
    searchInput.value=''; filterCat=null;
    legendList.querySelectorAll('li').forEach(function(li){li.classList.remove('dim');});
    closeDrawer();
    nodes.forEach(function(n){ n.__pinned=false; if(n.level!==0){ n.fx=null; n.fy=null; } });
    // restore the default Force layout
    layoutMode='force'; updateLayoutButtons('force'); forceModeForces();
    byId.root.fx=W/2; byId.root.fy=H/2;
    restart();
    svg.transition().duration(prefersReduced?0:600).call(zoom.transform, d3.zoomIdentity);
    setTimeout(function(){ byId.root.fx=null; byId.root.fy=null; },1200);
  });

  /* ---------------- Easter egg: type "krishna" ---------------- */
  var nova=document.createElement('div'); nova.className='nova'; nova.setAttribute('aria-hidden','true');
  document.body.appendChild(nova);
  var keyBuf='';
  document.addEventListener('keydown',function(e){
    var el=document.activeElement;
    if(el&&(el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.isContentEditable)) return;
    if(e.key&&e.key.length===1&&/[a-z]/i.test(e.key)){
      keyBuf=(keyBuf+e.key.toLowerCase()).slice(-7);
      if(keyBuf==='krishna'){ keyBuf=''; triggerEgg(); }
    }
  });
  function triggerEgg(){
    var firstTime=!eggOn;
    eggOn=true;
    // the supernova needs the organic force layout to fling nodes outward
    if(layoutMode!=='force'){ layoutMode='force'; updateLayoutButtons('force'); forceModeForces(); }
    branches.forEach(function(b){ expanded[b.id]=true; });
    restart();
    if(!prefersReduced){
      // supernova: kick every non-root node outward, then let it settle
      var cx=W/2, cy=H/2;
      visibleNodes().forEach(function(n){
        if(n.level===0) return;
        var dx=(n.x||cx)-cx, dy=(n.y||cy)-cy, m=Math.sqrt(dx*dx+dy*dy)||1;
        var s=16+Math.random()*20;
        n.vx=(dx/m)*s + (Math.random()-.5)*6;
        n.vy=(dy/m)*s + (Math.random()-.5)*6;
      });
      sim.alpha(1).alphaDecay(.045).restart();
      nova.classList.remove('fire'); void nova.offsetWidth; nova.classList.add('fire');
      setTimeout(function(){ sim.alphaDecay(BASE_ALPHA_DECAY); },1600);
    }
    flash('✨ Supernova! A secret node appeared.');
    var eggNode=byId.egg;
    setTimeout(function(){ setActive(eggNode); openDrawer(eggNode); focusNode(eggNode); }, prefersReduced?0:80);
  }

  /* ---------------- Resize ---------------- */
  function onResize(){
    W=app.clientWidth; H=app.clientHeight;
    svg.attr('width',W).attr('height',H).attr('viewBox',[0,0,W,H]);
    if(byId.root.fx!=null){ byId.root.fx=W/2; byId.root.fy=H/2; }
    if(layoutMode==='force'){
      sim.force('center', d3.forceCenter(W/2,H/2));
      sim.force('x', d3.forceX(W/2).strength(.04));
      sim.force('y', d3.forceY(H/2).strength(.04));
    } else {
      computeTargets(layoutMode);
    }
    sim.alpha(.4).restart();
  }
  var rT; window.addEventListener('resize',function(){ clearTimeout(rT); rT=setTimeout(function(){ syncChrome(); onResize(); },160); });

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

  /* ---------------- Docked how-to footer (dismiss + reserve space) ---------------- */
  var howtoEl=document.getElementById('howto');
  // Measure the docked footer and reserve that height under the graph so it never covers it.
  function syncChrome(){
    var h=0;
    if(howtoEl && !howtoEl.classList.contains('dismissed')){ h=howtoEl.offsetHeight||0; }
    document.documentElement.style.setProperty('--howto-h', h+'px');
  }
  (function(){
    var dismiss=document.getElementById('howto-dismiss');
    if(howtoEl&&dismiss){
      dismiss.addEventListener('click',function(){
        howtoEl.classList.add('dismissed');
        syncChrome(); onResize();   // reclaim the space for the graph
      });
    }
  })();

  /* ---------------- Boot ---------------- */
  restart();
  syncChrome(); onResize();                 // reserve the docked-footer height before settling
  window.addEventListener('load', function(){ syncChrome(); onResize(); }); // re-sync after fonts/layout
  // expand all branches gently on first load for a richer first impression, then release root
  setTimeout(function(){
    branches.forEach(function(b){ expanded[b.id]=true; });
    restart();
    setTimeout(function(){ byId.root.fx=null; byId.root.fy=null; sim.alpha(.3).restart(); }, prefersReduced?0:900);
  }, prefersReduced?0:650);

})();
