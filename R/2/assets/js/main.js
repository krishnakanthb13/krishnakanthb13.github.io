(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================ DATA ============================ */
  const DATA = {
    name: "Krishna Kanth B",
    user: "krishna",
    host: "resume",
    headline: "Data Specialist — 8+ years turning complex data into decisions",
    tagline: "Ex-Amazon · Ex-Optum · Ex-Dell · Ex-J&J | SQL · Python · Tableau · Looker · Power BI · Snowflake | M.Sc, VIT Vellore",
    status: "Actively looking for full-time opportunities · open to freelance / consulting.",
    about: "Data Specialist with 8+ years across data management, analysis, visualization and storytelling — spanning IT, Healthcare (Life Sciences) and Education Technology. Expert at extracting, transforming, analysing and reporting complex datasets into actionable insight using Excel, SQL, Python, Tableau, Looker and Power BI — delivering major FTE savings and productivity gains. A strong communicator who closes the gap between technical and non-technical stakeholders.",
    stats: [
      "8+ Years","95% KPI Automation","99% Latency Cut","~118 Hrs/Month Saved","20+ Plugins · 500+ Users","9 Roles"
    ],
    contact: {
      email: "krishnakanthb13@gmail.com",
      phone: "+91 7667360114"
    },
    social: [
      ["LinkedIn",        "https://www.linkedin.com/in/bkrishnakanth/"],
      ["GitHub",          "https://github.com/krishnakanthb13/"],
      ["Digital Garden",  "https://krishnakanthb13.vercel.app/"],
      ["Data Projects",   "https://krishnakanthb13.vercel.app/data-projects/101-data-projects/"],
      ["Tableau Public",  "https://public.tableau.com/app/profile/krishnakanthb13/vizzes"],
      ["Snowflake Wallet","https://achieve.snowflake.com/profile/krishnakanthb/wallet"],
      ["Amplenote",       "https://www.amplenote.com/"],
      ["Plugins List",    "https://public.amplenote.com/Y3dy91/krishna-plugins"],
      ["WhatsApp",        "https://wa.me/917667360114"],
      ["Email",           "mailto:krishnakanthb13@gmail.com"],
      ["Full résumé",     "../../BKK.html"]
    ],

    /* headline metrics for `highlights` */
    highlights: [
      ["95%",  "KPI automation — Amazon Stack Reports"],
      ["99%",  "latency cut via single data source — Amazon"],
      ["~118", "hours / month saved as ROI — Amazon"],
      ["90%",  "latency reduction, GL Validation — Optum"],
      ["60%",  "manual validation time cut — Optum"],
      ["70%",  "review efficiency + 20% accuracy — J&J"],
      ["40%",  "ticketing & KB usage lift — PowerSchool"],
      ["20+",  "open-source plugins · 500+ active users — Amplenote"]
    ],

    /* ---- FULL experience (newest first) ---- */
    experience: [
      {
        num:1, id:"amplenote", role:"Project Lead Developer", company:"Amplenote (Freelance)",
        dates:"Jan 2024 – Present", current:true,
        summary:"Building 20+ open-source plugins (500+ users), a personal portfolio and a public Digital Garden.",
        links:[
          ["Amplenote","https://www.amplenote.com/"],
          ["Amplenote Plugins","https://public.amplenote.com/Y3dy91/krishna-plugins"],
          ["Online Résumé","https://krishnakanthb13.github.io/BKK.html"],
          ["Digital Garden","https://krishnakanthb13.vercel.app/"],
          ["Data Projects","https://krishnakanthb13.vercel.app/data-projects/101-data-projects/"]
        ],
        desc:"I started working on myself and build my own profolio, which I can see and refer to over the course of life time, without losing its Value or Recognition or Sight for future developement.",
        highlights:[
          "Developed & published 20+ open-source plugins for a note-taking app — now used by 500+ active users.",
          "Designed & published a professional online portfolio (GitHub + Google Sites) that mimics LinkedIn.",
          "Built & maintain a public Digital Garden — an evolving knowledge base (Obsidian → GitHub → Vercel)."
        ],
        breakdown:[
          { h:"Plugin Web Development", items:[
            "Developed and published 20+ open-source plugins for a note-taking application, leveraging Inbuilt API Services, JavaScript, HTML, CSS, and AI — benefiting all digital note takers and journalists.",
            "Actively contributed to development, ensured maintainability, and created detailed documentation for community use. Currently used by more than 500 active users."
          ]},
          { h:"Personal Branding & Web Presence", items:[
            "Designed and published a professional online portfolio, hosted on GitHub and Google Sites using JavaScript, HTML, CSS, and AI — a simple online résumé that mimics features from LinkedIn.",
            "Demonstrated initiative in personal branding, digital presence, and showcasing technical expertise."
          ]},
          { h:"Digital Garden", items:[
            "Built and maintaining a digital garden — a public, evolving collection of personal notes, ideas, and resources using the Digital Garden Plugin in Obsidian, versioned in GitHub, and hosted using Vercel.",
            "Created as a long-term knowledge base for continuous learning and sharing with the community."
          ]}
        ],
        topSkills:["API","JavaScript","HTML","CSS","Scripting & Programming","Unit Testing","Critical Thinking","Project Planning","Project Execution","Code Documentation","AI Tools","Note Taking Methodologies","Quality Assurance","Problem-solving","MySQL","SQL","Snowflake Certifications","Data Analytics","Data Visualization","Teamwork + Individual Contribution"]
      },

      {
        num:2, id:"powerschool", role:"Technical Support Engineer Specialist", company:"PowerSchool (via GlowTouch)",
        dates:"Sep 2022 – Oct 2023",
        summary:"Lifted ticketing & KB usage 40%; DB + secure remote admin across Snowflake, SSMS, MobaXterm.",
        links:[
          ["PowerSchool","https://www.powerschool.com/"],
          ["GlowTouch","https://www.glowtouch.com/"]
        ],
        desc:"PowerSchool is a leading provider of cloud-based K-12 education software, helping schools manage grades, attendance, communication, and more. Founded in 1997, it offers a comprehensive suite used by educators, administrators, parents, and students.",
        highlights:[
          "Proficient in database management using Aqua Data Studio, SSMS, Snowflake, and in secure remote access / system administration with MobaXterm, SSH Putty, and Jump-box.",
          "Improved ticketing & knowledge-base usage by 40% in Salesforce, JIRA, and Confluence by streamlining processes and enhancing team collaboration."
        ],
        breakdown:[
          { h:"Technical Support Engineer (Specialist)", items:[
            "Streamlined ticketing and knowledge base processes in Salesforce, JIRA, and Confluence to improve efficiency and collaboration across teams.",
            "Utilized a wide range of tools (Aqua Data Studio, SSMS, Snowflake, MobaXterm, SSH Putty, Jump-box) to support software development, system administration, and database management.",
            "Monitored PowerSchool Unified Insights build processes and resolved data-structure issues via JIRA.",
            "Partnered with product and development teams to ensure fast, effective issue resolution.",
            "Managed customization, storage, and connection issues by creating JIRA tickets and coordinating with Services, Cloud Ops, and Hosting teams, aligning solutions with customer needs.",
            "Delivered exceptional customer support, addressing concerns directly and collaborating with internal teams to maintain high satisfaction levels."
          ]},
          { h:"Professional Profile", items:[
            "Experienced Technical Support Engineer Specialist with strong expertise in SQL, troubleshooting, and cross-team collaboration.",
            "Skilled in navigating fast-paced environments, applying analytical thinking and problem-solving to deliver quick, effective solutions.",
            "Passionate about exceeding expectations through teamwork and direct client engagement.",
            "Eager to leverage technical expertise to enhance operations and tackle new challenges."
          ]}
        ],
        topSkills:["MySQL","SQL","SSIS/SSMS","Aqua Data Studio","Snowflake Cloud","Data Analytics","Data Visualization","Statistical Data Analysis","Data Reporting","Microsoft Excel","Atlassian Suite","Requirements Gathering","Salesforce","Microsoft Office","Quality Assurance","Problem-solving","Teamwork","Scripting & Programming","Unit Testing"]
      },

      {
        num:3, id:"amazon", role:"Management Information Systems", company:"Amazon (3D India team)",
        dates:"Jul 2020 – Aug 2021",
        summary:"Automated 95% of KPI calculations; 99% latency cut; ~118 hrs/month ROI; 30 procs + 20 events.",
        links:[["Amazon","https://www.amazon.in/"]],
        desc:"E-commerce leader selling a vast selection of products and offering cloud computing (AWS). Focuses on innovation with services like Prime, Alexa, and Kindle.",
        accolade:["Bravo for Ownership — Mar 2021","Automating the 3D Operations stack report, weekly KPI reports & monthly stack reports."],
        highlights:[
          "Automated 95% of manual KPI metric calculations, transforming the Stack Reports publishing process.",
          "Reduced latency by 99% and increased reporting flexibility by introducing a streamlined Single Data Source.",
          "Improved accuracy and delivered an ROI of ~118 hours saved per month."
        ],
        breakdown:[
          { h:"Automating KPI Reporting (3D India Team — Operations & Support)", items:[
            "Role: 3D Support Coordinator (MIS).",
            "Challenge: Before July 2020, the 3D India team relied on manual processes using Excel, Quip, Data Extracts, and Emails for KPI tracking across users, artists, leads, and managers — creating high latency, low accuracy, and limited troubleshooting capabilities.",
            { t:"Solution:", sub:[
              "Designed and implemented an automated KPI reporting system using SQL queries, stored procedures, events, advanced Excel formulas, and macros.",
              "Re-engineered workflows to streamline reporting, reduce redundancy, and improve overall efficiency."
            ]},
            { t:"Impact:", sub:[
              "Automated reports went live for Operations (Week Y-34, 2020), saving 6+ manager/lead hours per week; expanded to Support-QA (Week Y-38, 2020), saving an additional 5+ hours per week.",
              "Developed 30 stored procedures and 20 events to handle reporting and automation tasks.",
              "Created an event/step log table to simplify troubleshooting and isolate code segments requiring adjustments."
            ]}
          ]}
        ],
        topSkills:["MySQL","SQL","SQL Server Management Studio","Snowflake Cloud","Informatica","SSIS/SSMS","Data Analytics","Data Visualization","Tableau","Statistical Data Analysis","Data Reporting","Microsoft Office","Microsoft Excel","Data Warehousing","Agile & Waterfall","Requirements Gathering","Quality Assurance","Unit Testing","Systems Analysis","Project Management","Database Management"]
      },

      {
        num:4, id:"optum", role:"Strategic Analyst", company:"Optum",
        dates:"May 2017 – Jan 2019",
        summary:"Automated GL Validation & Org Hierarchy → 90% latency cut, 50% reliability gain, 60% less manual validation.",
        links:[["Optum","https://www.optum.com/en/"]],
        desc:"Leading health services company providing data-driven care coordination, pharmacy services, and population health management — improving outcomes and reducing costs through advanced analytics and technology.",
        accolade:["Best Hackathon Project — Mar 2018","General Ledger Validation Automation (across various internal layers of the product)."],
        highlights:[
          "Streamlined insurance proficiency by 20% through in-depth knowledge of U.S. insurance patterns.",
          "Automated General Ledger Validation and built an Organization Hierarchy using SQL stored procedures, achieving a 90% reduction in latency and 50% improvement in reliability."
        ],
        breakdown:[
          { h:"Project: Data Integration & Automation for Healthcare Systems", items:[
            "Healthcare Clients: Health Quest Systems & Atrium Health (Carolinas HealthCare System).",
            "Overview: Designed and implemented data integration, mapping, and automation solutions across General Ledger, Payroll, Billing, Personnel Specialty, and Department Specialty datasets.",
            { t:"Key Contributions:", sub:[
              "Performed comprehensive data mapping across multiple financial and operational domains to improve consistency and reporting accuracy.",
              "Built a multi-level classification system (Type, Group, Category) to enhance data organization and analytics.",
              "Implemented robust quality checks across the data flow to ensure high accuracy in reporting and financial tracking.",
              { t:"Leveraged SQL (queries, stored procedures) to automate:", sub:[
                "General Ledger Validation (across internal layers).",
                "Organization Hierarchy automation (for predefined structures).",
                "Initial error checks (to quickly detect potential data issues)."
              ]}
            ]},
            { t:"Impact:", sub:[
              "Reduced manual validation time by 60%.",
              "Improved data accuracy and reliability across reporting systems.",
              "Enabled faster financial decision-making by reducing delays and errors in critical data flows."
            ]}
          ]}
        ],
        topSkills:["Life Sciences","Quality Assurance","Microsoft Office","MySQL","SQL","SQL Server Management Studio","Data Analytics","Data Visualization","Tableau","Elasticsearch","Statistical Data Analysis","Data Reporting","Microsoft Excel","Data Warehousing","Strategic Thinking","Financial Analysis","Market Research","Competitive Analysis","Scenario Planning","Risk Management"]
      },

      {
        num:5, id:"jnj", role:"Analyst Level I / II / III", company:"Johnson & Johnson (via GVW Technologies)",
        dates:"Mar 2015 – Feb 2017",
        summary:"Custom Excel macro → 70% review efficiency + 20% accuracy; LabWare LIMS V6 for McNeil & Janssen.",
        links:[
          ["Johnson & Johnson","https://www.jnj.com/"],
          ["GVW Technologies","https://global-value-web.com/"]
        ],
        desc:"Global healthcare giant developing a wide range of medical products, from pharmaceuticals to medical devices. Committed to innovation for improving health outcomes worldwide.",
        accolade:["Best Beginner Award — Apr 2015","Wrote Visual Basic Macro (Excel) for processing final report data to increase efficiency."],
        highlights:[
          "Boosted review efficiency by 70% and accuracy by 20% by developing a custom MS Excel macro.",
          "Curated a reference library of 75+ data visualization charts and analytics software tailored for Health Informatics."
        ],
        breakdown:[
          { h:"Research & Development", items:[
            "Built a strong foundation in data analytics, visualization, and reporting, with hands-on experience in Spotfire (Desktop/Cloud), Tableau, and Minitab.",
            { t:"Completed a project on HPLC-CDS data consolidation and analysis:", sub:[
              "Standardized multiple HPLC-CDS reports into a unified format.",
              "Applied Spotfire, Tableau, and Minitab to identify trends in pharmaceutical data."
            ]},
            "Explored statistical methods, regression analysis, and big data concepts, including Hadoop installation and algorithms."
          ]},
          { h:"Process & Quality Management", items:[
            "Mastered LabWare LIMS V6 data configuration for McNeil Consumer Healthcare and Janssen Pharmaceutical.",
            "Improved LIMS deployments by configuring, testing, and reviewing master data objects (specifications, analyses, batch templates) for sites in Canada and Italy.",
            "Supported quality control by using Lot Manager to verify batches against product specifications.",
            "Ensured Good Documentation Practices (GDP) compliance by generating, filing, scanning, and archiving QC documentation.",
            "Enhanced process quality through root cause analysis and CAPA implementation, preventing issue recurrence.",
            "Partnered with cross-functional teams to resolve quality issues and collaborated directly with clients to align deliverables with expectations."
          ]}
        ],
        topSkills:["Quality Assurance","LabWare LIMS","Life Sciences","Microsoft Excel","Data Warehousing","Hadoop","SQL","Data Visualization","Tableau","Spotfire","Statistical Data Analysis","Data Analytics","Informatica","SSIS","Analytical Thinking","Problem-Solving","Communication","Attention to Detail"]
      },

      {
        num:6, id:"premier", role:"Content Analyst", company:"Premier Inc. (via Medusind Solutions)",
        dates:"Dec 2013 – Feb 2015",
        summary:"Healthcare master-data management; UNSPSC taxonomy; ANSI UOM validation; custom Excel interface tool.",
        links:[
          ["Premier Inc.","https://premierinc.com/"],
          ["Medusind Solutions","https://www.medusind.com/"]
        ],
        desc:"Medical and dental revenue cycle management (RCM) provider — billing, insurance verification, and practice management software — helping healthcare organizations improve financial performance and streamline operations.",
        highlights:[
          "Streamlined data search and validation with Excel (VLOOKUP, Query) and automation, creating a custom tool that linked Excel columns to client software for tailored workflows.",
          "Enriched and attributed product data across 46 & 210 fields, and improved searchability by classifying products using UNSPSC codes."
        ],
        breakdown:[
          { h:"Premier Inc. | Healthcare Master Data Management", items:[
            "Enhanced product data accuracy and completeness for healthcare systems by performing data mapping and validation across manufacturers, vendors, sites, and catalogs.",
            "Ensured data integrity by validating packaging strings and units of measure (UOMs) for both inner and exterior packaging, adhering to ANSI standards.",
            "Applied custom extraction, enrichment, and cataloging methods to improve product datasets, including multi-field attribution.",
            "Developed and applied taxonomy classification (UNSPSC codes) to improve product organization and searchability.",
            "Maintained high data quality standards with rigorous QA and data cleansing practices.",
            "Ensured compliance with HIPAA regulations, safeguarding sensitive healthcare data and maintaining confidentiality."
          ]}
        ],
        topSkills:["Data Mapping","Data Enrichment","Data Classification","Microsoft Excel","Requirements Gathering","Life Sciences","Data Warehousing"]
      },

      {
        num:7, id:"dell", role:"Customer Care Voice Sr. Rep", company:"Dell",
        dates:"Jul 2013 – Dec 2013",
        summary:"Healthcare claims & eligibility (Conifer Health); Aetna/BCBS/Cigna; AAPC codes; Medicare/Medicaid; HIPAA.",
        links:[["Dell","https://www.dell.com/en-in"]],
        desc:"Tech leader in PCs and beyond — desktops, laptops, servers, storage and other technology solutions — renowned for supply-chain expertise and customized, direct-to-customer solutions.",
        accolade:["Best Employee of the Month — Sep 2013","Best Rating on Performance."],
        highlights:[
          "Streamlined Customer Intake by creating a classification system to prioritize inquiries by urgency and ensure comprehensive information collection in a single mail/call interaction.",
          "Gained broad insurance expertise, working with multiple U.S. healthcare insurance providers and their policy structures."
        ],
        breakdown:[
          { h:"Healthcare Claims Processing & Eligibility Verification | Conifer Health Solutions", items:[
            "Processed professional and facility claims for U.S. healthcare patients while ensuring full HIPAA compliance (privacy, security, and breach notification).",
            "Verified patient eligibility and benefits by coordinating with leading insurance companies (Aetna, AARP, BCBS, Cigna, etc.) and interpreting AAPC medical codes.",
            "Processed Medicare and Medicaid claims, ensuring accurate handling and timely submissions.",
            "Calculated deductibles, co-insurance, and co-pays in real time to confirm eligibility and authorization requirements.",
            "Enhanced data organization and searchability through taxonomy development (UNSPSC codes) and classification methodologies."
          ]}
        ],
        topSkills:["Microsoft Office","Technical Support","Quality Assurance","Communication","Problem-Solving","Customer Service","Technical Knowledge","Conflict Resolution","Process Adherence","Time Management","CRM Software","Email Communication"]
      },

      {
        num:8, id:"symantec", role:"Product Support Analyst", company:"Symantec",
        dates:"Apr 2011 – Jul 2011",
        summary:"Norton security install/config/troubleshoot on Windows; malware removal via safe-mode; KB contributions.",
        links:[["Symantec","https://www.broadcom.com/products/cybersecurity"]],
        desc:"Provides cybersecurity solutions, including industry-leading endpoint protection and email security software, protecting businesses and individuals from evolving cyber threats.",
        highlights:[
          "Troubleshot antivirus issues using Symantec products, resolving complex problems efficiently.",
          "Provided remote technical support, assisting users via phone and remote access tools to ensure quick resolution."
        ],
        breakdown:[
          { h:"Technical Support Specialist | Norton Security Products", items:[
            "Guided customers in securing their online environments by providing comprehensive support for Norton security solutions.",
            "Assisted with installation, configuration, and updates of Norton products on Windows platforms, resolving installation errors and ensuring seamless setup.",
            "Conducted advanced troubleshooting and threat mitigation, including removal of viruses, spyware, and malware using safe-mode techniques.",
            "Contributed to knowledge base documentation, updating solutions for new scenarios to improve team efficiency.",
            "Identified and resolved software compatibility issues, ensuring Norton products worked smoothly alongside other applications and OS configurations."
          ]}
        ],
        topSkills:["Troubleshooting","Problem-Solving","Technical Knowledge","Communication","Customer Service","Documentation","Attention to Detail","Ticketing Systems","Knowledge Base Software","Remote Desktop Software","Diagnostic Tools","Visual Studio 2003"]
      },

      {
        num:9, id:"sitel", role:"Customer Service Professional", company:"Sitel India",
        dates:"Sep 2010 – Mar 2011",
        summary:"Dell-On-Call tech support across laptops/desktops/networking/printers; \"Resolution Expert of the Month\".",
        links:[["Sitel India","https://foundever.com/"]],
        desc:"Customer experience (CX) management company providing contact-center operations, digital support, and social-media engagement — helping businesses build loyalty, increase sales, and improve efficiency.",
        accolade:["Resolution Expert of the Month — Jan 2011","Most number of successful resolutions on the first attempt."],
        highlights:[
          "Adept Problem Solver: troubleshot a wide range of technical issues (operating systems, applications, hardware), achieving a high first-call resolution rate. Recognized as \"Resolution Expert of the Month\" (Jan 2011).",
          "Exceptional Communication Skills: explained technical solutions clearly and concisely, ensuring customer understanding and satisfaction."
        ],
        breakdown:[
          { h:"Technical & Customer Support Specialist | Dell-On-Call Services", items:[
            "Delivered comprehensive technical and customer support for Dell and non-Dell customers through inbound and outbound channels.",
            "Troubleshot hardware and software issues across laptops, desktops, system software, routers, LANs, docking stations, printers, and gaming consoles.",
            "Resolved complex problems related to installation, configuration, customization, performance, and product usage.",
            "Managed escalated issues, ensuring customer satisfaction and effectively handling irate clients.",
            "Provided clear technical guidance via phone and remote diagnostics, enhancing resolution efficiency.",
            "Increased customer lifetime value by recommending warranty extensions, upgrades, and additional products.",
            "Improved overall customer experience by following up with clients and routing unsupported issues to the appropriate teams."
          ]}
        ],
        topSkills:["Communication","Customer Service","Problem-Solving","Empathy","Patience","Conflict Resolution","Process Adherence","Technical Knowledge","Sales Techniques","CRM Proficiency","Live Chat Software","Internal Knowledge Base"]
      }
    ],

    education: [
      { d:"M.Sc Biotechnology", s:"Vellore Institute of Technology (VIT Vellore)", y:"2011–2013", g:"8.62 CGPA",
        extra:"Dissertation: Expression of CD36 Gene in Type-1 Diabetic Rat Kidneys. Presented 3 papers at international SET conferences; publication in Asian Journal of Microbiology, Biotechnology & Environmental Sciences." },
      { d:"B.Sc Biotechnology", s:"D. G. Vaishnav College · University of Madras", y:"2007–2010", g:"62.80%", extra:"" },
      { d:"Schooling (Physics · Chemistry · Biology · Math)", s:"St. Mary's A.I. Higher Secondary School", y:"2007", g:"", extra:"" }
    ],

    skills: {
      "Domains":   ["MIS / Org Hierarchy","SIS / EdTech","LIMS / Pharma","SCM / Healthcare"],
      "Data & SQL":["SQL (SSMS, MySQL, Aqua Data, Snowflake)","Stored Procedures","Data Warehousing","ETL / Informatica / SSIS"],
      "Viz & BI":  ["Tableau","Spotfire","Looker","Power BI","Excel Dashboards"],
      "Languages & Tools":["Python","Advanced Excel (Macros / Automation)","JavaScript · HTML · CSS","LabWare LIMS","AI Tools"],
      "Soft":      ["communication","facilitation","presentation","conflict resolution","leadership","negotiation","critical thinking"]
    },

    /* compact stack view for `tools`/`stack` */
    stack: ["SQL","Snowflake","MySQL","SSMS","Aqua Data","Python","Tableau","Spotfire","Looker","Power BI","Advanced Excel","Informatica / SSIS","LabWare LIMS","JavaScript","HTML","CSS","AI Tools","Salesforce","JIRA / Confluence"],

    projects: [
      ["H-1B Analysis — 2025",       "https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-2025/"],
      ["H-1B Analysis — Historical", "https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-historical/"],
      ["Arattai Trend Analytics",    "https://krishnakanthb13.vercel.app/data-projects/arattai-trend-analytics/"],
      ["101 Data Projects (hub)",    "https://krishnakanthb13.vercel.app/data-projects/101-data-projects/"],
      ["Tableau Public — Vizzes",    "https://public.tableau.com/app/profile/krishnakanthb13/vizzes"]
    ],

    spare: {
      plugins:[
        ["Amplenote Plugins (20+)","https://public.amplenote.com/Y3dy91/krishna-plugins"],
        ["Plugin GitHub Repo","https://github.com/krishnakanthb13/amplenote-plugins"],
        ["Amplenote Public Profile","https://www.amplenote.com/user_profiles/2030-krishna-kanth-b"]
      ],
      quests:[
        ["H-1B Analysis 2025","https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-2025/"],
        ["H-1B Analysis Historical","https://krishnakanthb13.vercel.app/data-projects/h-1-b-analysis-historical/"],
        ["Arattai Trend Analytics","https://krishnakanthb13.vercel.app/data-projects/arattai-trend-analytics/"]
      ],
      web:[
        ["Anki Flashcards","https://krishnakanthb13.github.io/F/"],
        ["VTT Text Extractor","https://krishnakanthb13.github.io/O/VTT/WEBVTT%20v1.html"],
        ["Transcript Converter","https://krishnakanthb13.github.io/O/VTT/"]
      ],
      hobbies:["Basketball","Carrom","Online Games","Painting","Cooking","Movies"],
      languages:["English (native/bilingual)","Telugu (native/bilingual)","Tamil (elementary)","Hindi (elementary)","French (elementary)"]
    },

    certs: [
      ["Snowflake — Certificates Archive (wallet)", "https://achieve.snowflake.com/profile/krishnakanthb/wallet"],
      ["LinkedIn — Licenses & Certifications",      "https://www.linkedin.com/in/bkrishnakanth/details/certifications/"],
      ["Full list (52 certs) in main résumé",       "../../BKK.html#certifications"]
    ],

    resumeUrl: "../../BKK.html"
  };

  /* Map "open <name>" aliases to experience ids */
  const OPEN_ALIASES = {
    amplenote:"amplenote", plugins:"amplenote",
    powerschool:"powerschool", glowtouch:"powerschool",
    amazon:"amazon",
    optum:"optum",
    jnj:"jnj", "j&j":"jnj", johnson:"jnj", "johnson&johnson":"jnj", gvw:"jnj",
    premier:"premier", medusind:"premier",
    dell:"dell", symantec:"symantec", norton:"symantec",
    sitel:"sitel",
    resume:"__resume__"
  };

  const COMMANDS = [
    "help","about","experience","skills","stack","tools","education","certs","projects",
    "spare","interests","now","highlights","social","contact","resume","theme",
    "history","banner","whoami","ls","date","clear","open","matrix","coffee","sudo"
  ];

  /* ============================ THEMES ============================ */
  const THEMES = ["green","amber","ice","synthwave","ultraviolet","paper"];
  const THEME_LABELS = { green:"green", amber:"amber", ice:"ice", synthwave:"synth", ultraviolet:"violet", paper:"paper" };
  const THEME_KEY = "kkb-terminal-theme";

  /* ============================ DOM ============================ */
  const output   = document.getElementById("output");
  const screen   = document.getElementById("screen");
  const form     = document.getElementById("form");
  const input    = document.getElementById("cmd");
  const caret    = document.getElementById("caret");
  const chipsEl  = document.getElementById("chips");
  const themeBtn = document.getElementById("themeBtn");
  const themeName= document.getElementById("themeName");

  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const link = (text, href) => {
    const isAnchor = /^#/.test(href);
    const showArrow = /^(https?:|mailto:|tel:|\.\.)/i.test(href);
    const attrs = isAnchor ? "" : ' target="_blank" rel="noopener"';
    return `<a href="${esc(href)}"${attrs}>${esc(text)}${showArrow ? ' ↗' : ''}</a>`;
  };

  /* ============================ Output / reveal ============================ */
  let lockInput = false;

  function scrollDown(){ screen.scrollTop = screen.scrollHeight; }

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
        setTimeout(step, 16);
      } else {
        lockInput = false;
        scrollDown();
        if (cb) cb();
      }
    };
    step();
  }

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
      `<div class="line warn">▸ ${esc(DATA.status)}</div>` +
      `<div class="line">&nbsp;</div>` +
      `<div class="line">${DATA.stats.map(s=>`<span class="stat">${esc(s)}</span>`).join("")}</div>` +
      `<div class="line muted">Type <span class="accent">help</span> for commands. Try <span class="accent">experience</span>, <span class="accent">highlights</span>, <span class="accent">open amplenote</span> or <span class="accent">theme</span>.</div>`
    );
  }

  function helpHTML(){
    const rows = [
      ["about","Who I am — the short version"],
      ["now","What I'm doing right now"],
      ["experience","List 9 roles. Then: experience 1 · open amazon"],
      ["highlights","Headline impact metrics"],
      ["skills","Domains, data, BI & soft skills"],
      ["stack / tools","Compact tech-stack view"],
      ["education","Degrees & academics"],
      ["certs","Certifications & wallets"],
      ["projects","Selected data projects"],
      ["spare / interests","Plugins, data quests & hobbies"],
      ["social / links","All profiles & links ↗"],
      ["contact","Email, phone & WhatsApp"],
      ["resume","Open the full résumé ↗"],
      ["theme [name]","Cycle / set phosphor color"],
      ["history","Show command history"],
      ["banner","Reprint the welcome banner"],
      ["clear","Clear the screen"]
    ];
    let h = `<div class="line accent"># available commands</div>${HR}`;
    h += `<div class="kvs">`;
    rows.forEach(([c,d])=> h += `<span class="k">${esc(c)}</span><span class="v muted">${esc(d)}</span>`);
    h += `</div>`;
    h += `<div class="line">&nbsp;</div><div class="line muted">themes: ${THEMES.map(t=>`<span class="accent">${esc(t)}</span>`).join(" · ")}  ·  also: whoami · ls · date · matrix · coffee · sudo</div>`;
    h += `<div class="line muted">↑/↓ history · Tab autocomplete · tap a chip · links open in a new tab.</div>`;
    return h;
  }

  function aboutHTML(){
    return (
      `<div class="line accent"># about ${esc(DATA.name)}</div>${HR}` +
      `<div class="line">${esc(DATA.about)}</div>` +
      `<div class="line">&nbsp;</div>` +
      `<div class="line warn">▸ ${esc(DATA.status)}</div>` +
      `<div class="line">&nbsp;</div>` +
      `<div class="line">${DATA.stats.map(s=>`<span class="stat">${esc(s)}</span>`).join("")}</div>`
    );
  }

  function nowHTML(){
    const e = DATA.experience[0];
    let h = `<div class="line accent"># now</div>${HR}`;
    h += `<div class="line warn">▸ ${esc(DATA.status)}</div>`;
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line"><span class="muted">current ·</span> <span class="role-h">${esc(e.role)}</span> <span class="muted">— ${esc(e.company)}</span> <span class="role-meta">(${esc(e.dates)})</span></div>`;
    e.highlights.forEach(b => h += `<div class="line indent">— ${esc(b)}</div>`);
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line muted">Full detail → <span class="accent">open amplenote</span> · reach me → <span class="accent">contact</span></div>`;
    return h;
  }

  function highlightsHTML(){
    let h = `<div class="line accent"># highlights — headline impact</div>${HR}`;
    h += `<div class="line">`;
    DATA.highlights.forEach(([big,lbl]) => {
      h += `<span class="metric"><span class="big">${esc(big)}</span><span class="lbl">${esc(lbl)}</span></span>`;
    });
    h += `</div>`;
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line muted">Dig into any role → <span class="accent">experience</span>, e.g. <span class="accent">open optum</span>.</div>`;
    return h;
  }

  function expListHTML(){
    let h = `<div class="line accent"># experience — ${DATA.experience.length} roles (newest first)</div>${HR}`;
    DATA.experience.forEach((e)=>{
      const cur = e.current ? ` <span class="warn">●</span>` : "";
      h += `<div class="line"><span class="accent">[${e.num}]</span> <span class="role-h">${esc(e.role)}</span>${cur} <span class="muted">— ${esc(e.company)}</span></div>`;
      h += `<div class="line indent role-meta">${esc(e.dates)}</div>`;
      h += `<div class="line indent muted">${esc(e.summary)}</div>`;
    });
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line muted">Full detail → <span class="accent">experience &lt;n&gt;</span> or <span class="accent">open &lt;company&gt;</span> (e.g. <span class="accent">open amplenote</span>).</div>`;
    return h;
  }

  /* recursively render nested bullet items */
  function renderItems(items, depth){
    const cls = depth <= 0 ? "indent" : (depth === 1 ? "indent2" : "indent3");
    const mark = depth <= 0 ? "—" : (depth === 1 ? "·" : "‣");
    let h = "";
    items.forEach(it => {
      if (typeof it === "string"){
        h += `<div class="line ${cls}">${mark} ${esc(it)}</div>`;
      } else if (it && it.t){
        h += `<div class="line ${cls}"><span class="lead">${mark} ${esc(it.t)}</span></div>`;
        if (it.sub) h += renderItems(it.sub, depth+1);
      }
    });
    return h;
  }

  function expOneHTML(e){
    const cur = e.current ? ` <span class="warn">● current</span>` : "";
    let h = `<div class="line"><span class="accent">[${e.num}]</span> <span class="role-h">${esc(e.role)}</span>${cur}</div>`;
    h += `<div class="line role-meta">${esc(e.company)} · ${esc(e.dates)}</div>`;
    if (e.links && e.links.length){
      h += `<div class="line">${e.links.map(([t,u])=>link(t,u)).join(' <span class="muted">·</span> ')}</div>`;
    }
    h += HR;
    if (e.desc) h += `<div class="line muted">${esc(e.desc)}</div><div class="line">&nbsp;</div>`;
    if (e.accolade){
      h += `<div class="line accolade">★ ${esc(e.accolade[0])}</div>`;
      h += `<div class="line indent muted">${esc(e.accolade[1])}</div><div class="line">&nbsp;</div>`;
    }
    if (e.highlights && e.highlights.length){
      h += `<div class="line sec-h">Highlights</div>`;
      e.highlights.forEach(b => h += `<div class="line indent">— ${esc(b)}</div>`);
      h += `<div class="line">&nbsp;</div>`;
    }
    if (e.breakdown){
      e.breakdown.forEach(sec => {
        h += `<div class="line sec-h">${esc(sec.h)}</div>`;
        h += renderItems(sec.items, 0);
        h += `<div class="line">&nbsp;</div>`;
      });
    }
    if (e.topSkills && e.topSkills.length){
      h += `<div class="line sec-h">Top Skills Utilized</div>`;
      h += `<div class="line indent">${e.topSkills.map(s=>`<span class="badge">${esc(s)}</span>`).join("")}</div>`;
    }
    return h;
  }

  function skillsHTML(){
    let h = `<div class="line accent"># skills</div>${HR}`;
    for (const [cat,list] of Object.entries(DATA.skills)){
      h += `<div class="line sec-h">${esc(cat)}</div>`;
      h += `<div class="line indent">${list.map(s=>`<span class="badge">${esc(s)}</span>`).join("")}</div>`;
      h += `<div class="line">&nbsp;</div>`;
    }
    h += `<div class="line muted">Compact view → <span class="accent">stack</span> · certs → <span class="accent">certs</span></div>`;
    return h;
  }

  function stackHTML(){
    let h = `<div class="line accent"># stack / tools</div>${HR}`;
    h += `<div class="line indent">${DATA.stack.map(s=>`<span class="badge">${esc(s)}</span>`).join("")}</div>`;
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line muted">Full breakdown → <span class="accent">skills</span></div>`;
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
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line muted">52 certifications in total — Snowflake, VIT, DGVC & more in the full résumé.</div>`;
    return h;
  }

  function projectsHTML(){
    let h = `<div class="line accent"># selected projects — Data → Analysis → Visualization → Storytelling</div>${HR}`;
    DATA.projects.forEach(([t,u])=> h += `<div class="line">— ${link(t,u)}</div>`);
    return h;
  }

  function spareHTML(){
    const s = DATA.spare;
    let h = `<div class="line accent"># spare time — personal projects & interests</div>${HR}`;
    h += `<div class="line sec-h">Amplenote Plugins</div>`;
    s.plugins.forEach(([t,u])=> h += `<div class="line indent">— ${link(t,u)}</div>`);
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line sec-h">Data Quests</div>`;
    s.quests.forEach(([t,u])=> h += `<div class="line indent">— ${link(t,u)}</div>`);
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line sec-h">Web Softwares & Flashcards</div>`;
    s.web.forEach(([t,u])=> h += `<div class="line indent">— ${link(t,u)}</div>`);
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line sec-h">Hobbies</div>`;
    h += `<div class="line indent">${s.hobbies.map(x=>`<span class="badge">${esc(x)}</span>`).join("")}</div>`;
    h += `<div class="line">&nbsp;</div>`;
    h += `<div class="line sec-h">Languages</div>`;
    h += `<div class="line indent">${s.languages.map(x=>`<span class="badge">${esc(x)}</span>`).join("")}</div>`;
    return h;
  }

  function contactHTML(){
    return (
      `<div class="line accent"># contact</div>${HR}` +
      `<div class="kvs">` +
        `<span class="k">email</span><span class="v">${link(DATA.contact.email,"mailto:"+DATA.contact.email)}</span>` +
        `<span class="k">phone</span><span class="v">${link(DATA.contact.phone,"tel:"+DATA.contact.phone.replace(/\s/g,""))}</span>` +
        `<span class="k">whatsapp</span><span class="v">${link("wa.me/917667360114","https://wa.me/917667360114")}</span>` +
        `<span class="k">linkedin</span><span class="v">${link("in/bkrishnakanth","https://www.linkedin.com/in/bkrishnakanth/")}</span>` +
      `</div>` +
      `<div class="line">&nbsp;</div>` +
      `<div class="line warn">▸ ${esc(DATA.status)}</div>`
    );
  }

  function socialHTML(){
    let h = `<div class="line accent"># social & links</div>${HR}<div class="kvs">`;
    DATA.social.forEach(([t,u])=> h += `<span class="k">${esc(t.toLowerCase())}</span><span class="v">${link(u,u)}</span>`);
    h += `</div>`;
    return h;
  }

  function lsHTML(){
    const items = ["about","now","experience","highlights","skills","education","certs","projects","spare","contact","social","resume.pdf"];
    return `<div class="line">${items.map(i=>`<span class="accent" style="margin-right:2ch">${esc(i)}</span>`).join("")}</div>`;
  }

  function whoamiHTML(){
    return (
      `<div class="line"><span class="accent">${esc(DATA.user)}@${esc(DATA.host)}</span></div>` +
      `<div class="line">${esc(DATA.name)} — ${esc(DATA.headline)}</div>` +
      `<div class="line muted">${esc(DATA.tagline)}</div>`
    );
  }

  function historyHTML(){
    if (!history.length) return `<div class="line muted">No history yet — start typing commands.</div>`;
    let h = `<div class="line accent"># history</div>${HR}`;
    history.forEach((c,i)=> h += `<div class="line"><span class="muted">${String(i+1).padStart(3," ")}</span>  ${esc(c)}</div>`);
    return h;
  }

  function sudoHTML(){
    return (
      `<div class="line err">[sudo] password for ${esc(DATA.user)}: ********</div>` +
      `<div class="line warn">Nice try. 😄</div>` +
      `<div class="line">This visitor is not in the sudoers file. This incident will be reported... to my LinkedIn.</div>` +
      `<div class="line">&nbsp;</div>` +
      `<div class="line muted">Real talk: I don't need root to deliver impact — <span class="accent">95%</span> KPI automation, <span class="accent">99%</span> latency cuts and <span class="accent">~118 hrs/month</span> saved say enough.</div>` +
      `<div class="line">Hire me instead → ${link("LinkedIn","https://www.linkedin.com/in/bkrishnakanth/")} · ${link("email","mailto:"+DATA.contact.email)}</div>`
    );
  }

  function coffeeHTML(){
    const cup =
`      ( (
       ) )
    ........
    |      |]
    \\      /
     \`----'`;
    return (
      `<div class="ascii" aria-hidden="true">${esc(cup)}</div>` +
      `<div class="line ok">☕ Brewing... data runs on coffee and curiosity.</div>` +
      `<div class="line muted">HTTP 418 — I'm a teapot. Refill complete. Back to the queries.</div>`
    );
  }

  function matrixRain(){
    const cols = 46, rows = 14;
    const glyphs = "01ｱｲｳｴｵｶｷｸ日ﾊﾐﾋｰｳ010110SQLKKB$#@";
    let h = `<div class="line accent"># wake up, Neo...</div>`;
    for (let r=0;r<rows;r++){
      let s = "";
      for (let c=0;c<cols;c++){ s += glyphs[Math.floor(Math.random()*glyphs.length)]; }
      h += `<div class="line ok" style="opacity:${(0.35+0.6*(r/rows)).toFixed(2)}">${esc(s)}</div>`;
    }
    h += `<div class="line muted">There is no spoon — only clean data. Type <span class="accent">help</span> to return.</div>`;
    return h;
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
      case "now": case "status": html = nowHTML(); break;
      case "highlights": case "impact": case "metrics": html = highlightsHTML(); break;
      case "skills": html = skillsHTML(); break;
      case "stack": case "tools": case "tech": html = stackHTML(); break;
      case "education": case "edu": html = eduHTML(); break;
      case "certs": case "certifications": case "cert": html = certsHTML(); break;
      case "projects": case "project": case "work": html = projectsHTML(); break;
      case "spare": case "interests": case "hobbies": case "fun": html = spareHTML(); break;
      case "contact": html = contactHTML(); break;
      case "social": case "links": html = socialHTML(); break;
      case "ls": case "dir": html = lsHTML(); break;
      case "whoami": case "id": html = whoamiHTML(); break;
      case "history": case "hist": html = historyHTML(); break;
      case "sudo": case "su": html = sudoHTML(); break;
      case "matrix": html = matrixRain(); break;
      case "coffee": case "brew": html = coffeeHTML(); break;
      case "banner": case "welcome": html = bannerHTML(); break;
      case "date": html = `<div class="line">${esc(new Date().toString())}</div>`; break;
      case "clear": case "cls": output.innerHTML = ""; return;

      case "resume": case "cv":
        html = `<div class="line ok">Opening full résumé in a new tab → ${link("BKK.html", DATA.resumeUrl)}</div>`;
        window.open(DATA.resumeUrl, "_blank", "noopener");
        break;

      case "theme": case "color": case "colour": {
        if (arg){
          const found = THEMES.find(t => t === arg || THEME_LABELS[t] === arg);
          if (found){ applyTheme(found); html = `<div class="line ok">Phosphor set to <span class="accent">${esc(found)}</span>.</div>`; }
          else { html = `<div class="line err">unknown theme: ${esc(arg)}</div><div class="line muted">available: ${THEMES.map(t=>`<span class="accent">${esc(t)}</span>`).join(" · ")}</div>`; }
        } else {
          const next = cycleTheme();
          html = `<div class="line ok">Phosphor set to <span class="accent">${esc(next)}</span>. <span class="muted">(theme &lt;name&gt; to pick · ${THEMES.map(t=>esc(t)).join(" · ")})</span></div>`;
        }
        break;
      }

      case "experience": case "exp": case "jobs": {
        if (arg){
          const n = parseInt(arg,10);
          if (!isNaN(n) && DATA.experience[n-1]) { html = expOneHTML(DATA.experience[n-1]); }
          else {
            const id = OPEN_ALIASES[argFull] || OPEN_ALIASES[arg];
            const e = DATA.experience.find(x=>x.id===id);
            html = e ? expOneHTML(e) : `<div class="line err">No role "${esc(arg)}".</div>` + expListHTML();
          }
        } else { html = expListHTML(); }
        break;
      }

      case "open": case "cat": case "view": {
        if (!arg){ html = `<div class="line err">usage: open &lt;resume | company&gt;</div><div class="line muted">e.g. <span class="accent">open resume</span>, <span class="accent">open amplenote</span></div>`; break; }
        const target = OPEN_ALIASES[argFull] || OPEN_ALIASES[arg];
        if (target === "__resume__"){
          html = `<div class="line ok">Opening full résumé in a new tab → ${link("BKK.html", DATA.resumeUrl)}</div>`;
          window.open(DATA.resumeUrl, "_blank", "noopener");
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
    if (parts.length > 1 && (parts[0]==="theme" || parts[0]==="color")){
      const m = THEMES.filter(c=>c.startsWith(parts[1]));
      if (m.length===1){ input.value = parts[0]+" "+m[0]; updateCaret(); return; }
      if (m.length>1){ printBlock(`<div class="line muted">${m.join("   ")}</div>`); return; }
    }
    const matches = COMMANDS.filter(c=>c.startsWith(parts[0]));
    if (matches.length===1){ input.value = matches[0]+" "; updateCaret(); }
    else if (matches.length>1){ printBlock(`<div class="line muted">${matches.join("   ")}</div>`); }
  }

  /* Chips */
  const CHIP_CMDS = ["help","about","now","experience","highlights","skills","stack","projects","spare","certs","education","social","contact","resume","theme","matrix"];
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

  /* ============================ Theme control ============================ */
  function setThemeBtn(name){
    if (themeName) themeName.textContent = THEME_LABELS[name] || name;
    const idx = THEMES.indexOf(name);
    const next = THEMES[(idx+1) % THEMES.length];
    themeBtn.title = `Theme: ${name} — click for ${next}`;
  }
  function applyTheme(name){
    if (!THEMES.includes(name)) name = "green";
    document.body.setAttribute("data-theme", name);
    try { localStorage.setItem(THEME_KEY, name); } catch(_){}
    setThemeBtn(name);
    return name;
  }
  function cycleTheme(){
    const cur = document.body.getAttribute("data-theme") || "green";
    const idx = THEMES.indexOf(cur);
    return applyTheme(THEMES[(idx+1) % THEMES.length]);
  }
  themeBtn.addEventListener("click", cycleTheme);

  (function initTheme(){
    let saved = "green";
    try { saved = localStorage.getItem(THEME_KEY) || "green"; } catch(_){}
    applyTheme(saved);
  })();

  /* ============================ Boot sequence ============================ */
  const bootLines = [
    "krishna-os v9.0 — booting career kernel…",
    "[ ok ] mounting /experience (9 roles)",
    "[ ok ] loading skills: SQL · Python · Tableau · Looker · Power BI · Snowflake",
    "[ ok ] initializing impact engine: 95% automation, 99% latency cut",
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
        typeLine(bootLines[i], d, 8, ()=>{ i++; setTimeout(next, 80); });
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
