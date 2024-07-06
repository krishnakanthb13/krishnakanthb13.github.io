document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const keySound1 = document.getElementById('keySound1');
    const keySound2 = document.getElementById('keySound2');

    const upButton = document.getElementById('upButton');
    const downButton = document.getElementById('downButton');
    const enterButton = document.getElementById('enterButton');

    const sections = [
        { title: 'Welcome Note', details: '<h2>$ Welcome to my resume!</h2><br><h3>Hello there! I hope you are doing Great.<br><br>And you have a nice time Navigating my career path.<h3>', type: 'section' },
        { title: 'Access Krishna Kanth B\'s Resume!', type: 'menu', children: [
            { title: '../', type: 'back' },
            { title: 'About Me', details: '<p>With my extensive background in data analysis and my zeal for discovering insights from challenging datasets, I am certain that I would be a significant asset to your team.<br><br>As an Analyst with over eight years of experience, I’ve developed a deep understanding of data management, analysis, visualization, and storytelling methodologies and technologies. I am highly competent in extracting, transforming, analysing, reporting, and inferring complex datasets to produce actionable insights. I have successfully implemented data-driven initiatives, leveraging my knowledge in Excel, SQL, Python, and Tableau, resulting in considerable FTE savings and productivity growth for my prior employers.<br><br>One of the most remarkable achievements would be for Optum was the creation of a fully independent layer in the data model that was fully Automated End to End. The “Validation method using Stored Procedures” project resulted in a 90% time saving and a 50% increase in accuracy.<br><br>I am certain that my analytical skills, attention to detail, and ability to document and present complicated findings in a clear and simple manner will make me an asset to your team. I thrive in fast-paced workplaces (with adequate unwinding and intentional defocusing period) and enjoy collaborating with variety of stakeholders to implement data-informed plan and strategies.<br><br>Not only I excel in Hard Skill, but I have also developed and upskilled my Soft Skills as well. I have presented multiple findings through various Rollouts, Reviews and Sprint Retrospective Meetings. I have also trained myself in handling and conflict resolutions, negotiation skills.<br><br>Thank you for making it till here and considering my application. I am confident that my skills and passion makes me qualify for this position. I would appreciate the opportunity to further discuss how my qualifications connect with your needs.</p>', type: 'section' },
            { title: 'Experience', type: 'menu', children: [
                { title: '../', type: 'back' },
                { title: 'Sep 2022 - Oct 2023 - [Technical Support Engineer Specialist] @PowerSchool (GlowTouch)', details: '<p>PowerSchool is a leading provider of cloud-based K-12 education software, helping schools manage grades, attendance, communication, and more. Founded in 1997, PowerSchool offers a comprehensive suite of solutions used by educators, administrators, parents, and students.<br><br><b>1. Proficient in utilizing Aqua Data Studio, SSMS, SnowFlake for database management, and MobaXterm, SSH Putty, and Jump-box for secure remote access and system administration.<br><br>2. Enhanced 40% Ticketing & Articles usage in Salesforce, JIRA, and Atlassian Confluence using streamlined processes and improved team collaboration.</b></p><li><b>Technical Support Engineer (Specialist)</b></li><ul><li>Streamlined ticketing and knowledge base processes using Salesforce, JIRA, and Confluence for improved team collaboration and efficiency.</li><li>Utilized a variety of tools (mentioned above) for effective software development and system management.</li><li>Monitored PowerSchool Unified Insights build processes and addressed data structure issues through JIRA. Collaborated with product and development teams for prompt resolutions.</li><li>Managed customization and connection/storage issues by creating JIRA tickets, liaising with relevant teams (Services, Cloud Ops, Hosting), and ensuring adherence to customer requests.</li><li>Provided exceptional support to customers by collaborating with internal teams and directly addressing their concerns.</li><p> - Highly skilled Technical Support Engineer Specialist with expertise in troubleshooting complex technical issues and a strong background in SQL. Thrive in dynamic environments utilizing analytical skills and excellent problem-solving to make quick decisions. Passionate about exceeding expectations through collaboration with cross-functional teams and providing direct client assistance. Eager to leverage expertise to elevate technical operations and take on new challenges. -</p></ul>', type: 'section' },
                { title: 'Jul 2020 - Aug 2021 - [Management Information Systems] @Amazon', details: '<p>E-commerce leader selling a vast selection of products, from books to electronics to groceries (and much more). They also offer cloud computing services (AWS) to businesses. Focuses on innovation and has created popular services like Prime, Alexa, and Kindle devices.<br><br><b>1. Automated 95% of manual KPI metric calculations, revolutionizing the process of publishing Stack Reports.<br><br>2. Reduced latency by 99% and increased flexibility through a streamlined Single Data Source approach.<br><br>3. Improved accuracy, saving approximately [~118 Hours/Month] as ROI.</b></p><li><b>Challenge:</b> Prior to July 2020, the 3D India team (Operations & Support) relied on manual processes and multiple tools (Excel, Quip, Data Extracts, Emails) to track and analyze KPIs for users, artists, leads, and managers. This resulted in high latency, decreased accuracy, and limited troubleshooting capabilities.</li> <li><b>Solution:</b> Upon joining as a 3D Support Coordinator (MIS) in July 2020, I led the automation of the KPI reporting process. Leveraging SQL queries, stored procedures, events, advanced Excel formulas, and macros, I streamlined the workflow and re-structured reports for enhanced efficiency and accuracy.</li> <li><b>Impact:</b></li><ul><li>Automated reports went live for the Operations team in Week Y-34 of 2020, saving an estimated 6+ manager/lead hours per week.</li><li>Support-QA team reports were automated in Week Y-38 of 2020, further saving 5+ manager/lead hours per week.</li><li>Developed custom automation scripts including 30 stored procedures and 20 events to handle various tasks and functionalities for the 3D India teams.</li><li>Implemented an event/step log table to facilitate troubleshooting and pinpoint specific code segments requiring adjustments.</li></ul>', type: 'section' },
                { title: 'May 2017 - Jan 2019 - [Strategic Analyst] @Optum', details: '<p>Leading health services company providing data-driven care coordination, pharmacy services, and population health management solutions. Works to improve health outcomes and reduce costs by using advanced analytics and technology.<br><br><b>1. Leveraged in-depth knowledge of USA Insurance Patterns to streamline insurance Proficiency by 20%.<br><br>2. Implemented automation for General Ledger Validation and built an Organization Hierarchy using SQL stored procedures, resulting in a 90% reduction in latency and a 50% improvement in reliability.</b></p><li><b>Data Integration and Automation for Healthcare Systems</b></li><ul><li>Performed data mapping and integration for Health Quest Systems and Atrium Health (Carolinas HealthCare System). This involved mapping various data points across General Ledger, Payroll, Billing, Personnel Specialty,and Department Specialty.</li><li>Developed a multi-level classification system (Type, Group, Category) for enhanced data organization and analysis.</li><li>Implemented robust quality checks throughout the data flow, ensuring accurate data mapping and reporting. </li><li>Leveraged SQL expertise (queries, stored procedures) to automate key processes, including:</li><ul><li>General Ledger Validation (across internal layers)</li><li>Organization Hierarchy Automation (for predefined structures)</li><li>Initial Error Checks (to identify potential data issues)</li></ul><li>This automation significantly reduced manual effort, reduced validation time by 60%, improved data accuracy, and facilitated faster financial decision-making.</li></ul><li><b>Top Skills Utilized:</b></li><ul><li>SQL (Queries, Stored Procedures)</li><li>Data Mapping and Integration</li><li>Data Quality Assurance</li><li>Excellent analytical and problem-solving skills</li></ul>', type: 'section' },
                { title: 'Mar 2015 - Feb 2017 - [Analyst Level I & II & III] @Johnson & Johnson (GVW Technologies)', details: '<p>Global healthcare giant developing a wide range of medical products, from pharmaceuticals to medical devices. Committed to innovation for improving health outcomes across the world.<br><br><b>1. Increased review efficiency by 70% and accuracy by 20% through a custom MS Excel macro.<br><br>2. Curated a comprehensive reference list of 75+ data visualization charts and data analytics software for Health Informatics.</b></p><li><b>Research & Development</b></li><ul><li>Developed foundational knowledge of data analytics, data visualization, and data reporting.</li><li>Gained hands-on experience with data visualization tools like Spotfire (Desktop/Cloud), Tableau, and Minitab.</li><li>Completed a project on HPLC-CDS data consolidation and analysis: </li><ul><li>Consolidated various HPLC-CDS reports into a single format.</li><li>Utilized Spotfire, Tableau, and Minitab to identify patterns in pharmaceutical data.</li></ul><li>Explored basic statistical methods and regression analysis in big data, including fundamental knowledge of Hadoop installation and algorithms.</li></ul><li><b>Process & Quality Management</b></li><ul><li>Mastered LabWare LIMS V6 data configuration for McNeil Consumer Healthcare and Janssen Pharmaceutical.</li><li>Streamlined LIMS deployments by building, configuring, testing, and reviewing master data objects (specifications, analyses, batch templates, etc.) for sites in Canada and Italy.</li><li>Facilitated quality control by using Lot Manager to verify batches against specifications.</li><li>Ensured Good Documentation Practices (GDP) compliance by generating, filing, scanning, and maintaining an archive of QC documentation for manufactured products.</li><li>Maintained process quality by identifying root causes of deviations and implementing corrective and preventive actions (CAPAs) to prevent recurrence.</li><li>Collaborated with cross-functional teams to address quality issues.</li><li>Effectively communicated with clients daily through emails and calls to meet their requirements.</li></ul>', type: 'section' },
                { title: 'Dec 2013 - Feb 2015 - [Content Analyst] @Premier Inc. (Medusind Solutions)', details: '<p>Medical and dental revenue cycle management (RCM) provider, offering services like billing, insurance verification, and practice management software. Helps healthcare organizations improve financial performance and streamline operations.<br><br><b>1. Streamlined data search and validation using Excel (VLOOKUP, Query) and automation. Developed a custom interface tool linking Excel columns to client software based on specific needs.<br><br>2. Enriched and attributed product data using established methodologies (46 & 210 fields) and classified them based on UNSPSC codes for improved organization and search-ability.</b></p><li><b>Premier Inc. | Healthcare Master Data Management</b></li><ul><li>Enhanced product data accuracy and completeness for various healthcare systems by performing data mapping and validation across products from manufacturers/vendors and their respective sites and catalogs.</li><li>Ensured data integrity by validating packaging strings, units of measure (UOM) for both inner and exterior packaging, adhering to ANSI (American National Standards Institute) UOMs.</li><li>Enriched product data through customized extraction, enrichment, and cataloging methods, including multi-field attribution.</li><li>Improved data organization and search-ability by implementing data classification and taxonomy development using UNSPSC codes.</li><li>Maintained high data quality through rigorous quality assurance (QA) processes and data cleansing practices.</li><li>Adhered to HIPAA compliance regulations by implementing and ensuring compliance with the Health Insurance Portability and Accountability Act of 1996.</li></ul>', type: 'section' },
                { title: 'Jul 2013 - Dec 2013 - [Customer Care Voice Sr. Rep] @Dell', details: '<p>Tech leader in PCs and beyond, providing desktops, laptops, servers, data storage, and other technology solutions. Renowned for their supply chain expertise, offering customized solutions and directly connecting with customers.<br><br><b>1. Streamlined Customer Intake: Implemented a classification system to prioritize incoming inquiries based on urgency and efficiently collected comprehensive information through single mail/call interactions.<br><br>2. Insurance Expertise: Familiar with various insurance companies and their policies.</b></p><li><b>Healthcare Claims Processing & Eligibility Verification</b></li><ul><li>Processed professional and facility claims for US healthcare patients at Conifer Health Solutions.</li><li>Ensured HIPAA compliance by adhering to privacy, security, and breach notification regulations.</li><li>Verified patient eligibility and benefits by directly contacting various US health insurance companies (Aetna, AARP, BCBS, Cigna, etc.) and interpreting AAPC medical codes.</li><li>Improved data organization and search-ability by implementing data classification and taxonomy development using UNSPSC codes.</li><li>Processed Medicare and Medicaid claims.</li><li>Calculated deductibles, co-insurance, and co-pays on the spot to determine patient insurance eligibility and authorization requirements.</li></ul>', type: 'section' },
                { title: 'Apr 2011 - Jul 2011 - [Product Support Analyst] @Symantec', details: '<p>Provides cyber-security solutions, including industry-leading endpoint protection and email security software. Protects businesses and individuals from ever-evolving cyber threats.<br><br><b>Troubleshoot Antivirus Issues: Provided expert technical support to resolve antivirus-related problems using Symantec products.<br><br>Remote Customer Assistance: Resolved user queries and technical issues efficiently via phone and remote access tools.</b></p><li><b>Technical Support Specialist (Norton Security Products)</b></li><ul><li><b>Guided customers in securing their online environment:</b> Provided comprehensive support to help customers protect their infrastructure, information, and online interactions using Norton security solutions.</li><li><b>Installation & Configuration Expertise:</b> Assisted with seamless downloads, installations, and configuration of Norton products on Windows platforms. Resolved various error messages encountered during these processes.</li><li><b>Advanced Troubleshooting & Threat Mitigation:</b> Effectively troubleshooted a wide range of issues using error logs and knowledge base articles. Contributed to knowledge base updates by documenting solutions for new scenarios. Identified and manually removed diverse threats like viruses, spyware, and malware using advanced safe mode techniques.</li><li><b>Software Compatibility Specialist:</b> Proactively identified and resolved potential software conflicts between Norton products and other applications or operating system settings.</li>', type: 'section' },
                { title: 'Sep 2010 - Mar 2011 - [Customer Service Professional] @Sitel India', details: '<p>Customer experience (CX) management company, providing contact center operations, digital support, and social media engagement solutions. Helps businesses build customer loyalty, increase sales, and improve efficiency.<br><br><b>1. Adept Problem Solver: Troubleshooted a wide range of basic and complex issues related to operating systems and applications, achieving a high rate of first-call resolutions. Recognized as "Resolution Expert of the Month" (Jan 2011).<br><br>2. Exceptional Communication Skills: Effectively communicated technical solutions to customers in a clear, concise, and easy-to-understand manner.</b></p><li><b>Technical & Customer Support Specialist (Dell-On-Call Services)</b></li><ul><li>Provided comprehensive technical and customer support to both Dell and non-Dell customers (warranty-based) through inbound and outbound channels.</li><li>Troubleshooted a wide range of issues on laptops, desktops, system software, routers, LANs, docking stations, printers, and gaming consoles.</li><li>Resolved complex technical problems related to installation, operation, configuration, customization, performance, and usage of assigned products.</li><li>Offered exceptional customer service by managing escalated issues, focusing on customer satisfaction, and effectively handling irate customers.</li><li>Leveraged strong communication skills to provide clear and concise technical guidance via phone and remote diagnostics.</li><li>Increased customer lifetime value by pitching warranty support, extensions, and suggesting relevant product upgrades and additional electronics.</li><li>Enhanced customer experience by following up with recent customers and efficiently routing unsupported issues to appropriate support queues.</li></ul>', type: 'section' }
            ] },
            { title: 'Skills', details: '<p><b>Domain Of Expertise</b><br>Specialized in the below areas, contributing to a Data Validation, Integration and Enrichment in a diverse range of projects and consistently driving optimal outcomes.<br><br>Management Information System (MIS)- Organization Hierarchy<br>Student Information System (SIS)- Education Technology<br>Laboratory Information Management System (LIMS)- Pharmaceuticals<br>Supply Chain Management (SCM)- Hospitals / Health Care<br><br><b>Software Skills</b><br>1. SQL (SSMS, MySQL, Aqua Data, SnowFlake)<br>   Querying- Stored Procedures- Database Functions<br>   SnowFlake - Certificates Archive [Krishna Kanth B]<br>2. Data Visualization & Reporting<br>   Tableau- Spotfire- Excel Dashboards<br>   Tableau Public Visualizations [Krishna Kanth B]<br>3. Microsoft Excel<br>   Advanced Formulas- Pivot Tables- Macro- Automation<br>4. Labware LIMS<br>   Master Data Objects- GDP- LOT Run & Audit- Regulatory Compliance<br><br><b>Soft Skills</b><br>The secret weapon that unlocks your hard work. (This emphasizes the power of softskills to amplify your technical abilities)<br><br><i>Telephonic Communication- E-mail Etiquette- Facilitation- Presentation- Conflict Resolution- Decision Making- Adaptability- Team Building- Reliability- Delegation- Rapport Building- Creativity- Innovation- Analysis and Research- Questioning- Prioritization- Detailed Oriented- Planning- Problem-solving- Critical thinking- Leadership- Negotiation- Type-writing (English)</i></p>', type: 'section' },
            { title: 'Education', details: '<p>2013 - <b>Master&apos;s degree (M.Sc Biotechnology)</b><br>Major : Biotechnology at Vellore Institute of Technology<br>| VIT Vellore | 06/2011 - 03/2013 | 8.62 CGPA |</p><ul><li><b>Mar 2013</b><br> Dissertation - Expression of CD36 Gene in Type 1 Diabetic Rat Kidneys</li><li><b>Dec 2012 - 5th International Conference on “Science, Engineering and Technology (SET)"</b><br> Research Papers Presented - Extraction, characterization and screening of phytocompounds from Indian Pomegranate (hybrid variety)</li><li><b>Mar 2012 - 4th International Conference on “Science, Engineering and Technology (SET)”</b><br> Research Papers Presented - Role of flavonoids on cancer</li><li><b>Dec 2012 - 3rd International Conference on “Science, Engineering and Technology (SET)”</b><br> Research Papers Presented - Isolation, Characterization and Quantification of Siderophore Produced by Rhizosphere bacteria of Opuntia sp.</li><p></p></ul><p>2010 - <b>Bachelor&apos;s degree (B.Sc Biotechnology)</b><br>Major : Biotechnology at D. G. Vaishnav College<br>| University Of Madras | 06/2007 - 03/2010 | 62.80% |<br>D. G. Vaishnav College<br><br>2007 - <b>Schooling</b><br>Major : Physics Chemistry Biology Math at St. Mary&apos;s A I H S S<br>St. Mary&apos;s Anglo India Higher Secondary School </p>', type: 'section' },
            { title: 'Contact', details: '<p>Email: krishnakanthb13@gmail.com<br>Phone: +91 7667360114<br><br>Clickable Links:<h4><a href="https://www.linkedin.com/in/bkrishnakanth/" target="_blank"><b>| LinkedIn |</b></a><br><a href="https://sites.google.com/view/krishnakanthb/home" target="_blank"><b>| Projects |</b><br></a><a href="https://github.com/krishnakanthb13/" target="_blank"><b>| GitHub |</b></a><br><a href="https://bio.site/krishnakanthb13" target="_blank"><b>| BioLink |</b></a><br><br><a class="email" href="https://wa.me/7667360114?text=Hi%2C%20I%20am%20reaching%20out%20to%20you%20after%20checking%20your%20Git-Hub%20Online%20Resume.">WhatsApp Me</a><br><a class="email" href="mailto:krishnakanthb13@gmail.com">E-mail Me</a></h4></p>', type: 'section' }
        ]},
        { title: 'How to Navigate', details: 'Use ArrowUp, ArrowDown to navigate, Enter or ArrowRight to select, ../ to go back in selection page', type: 'section' }
    ];

    let currentMenu = sections;
    let menuStack = [];
    let currentIndex = 0; // Start after '../' back option
    const typingSpeed = 50; // ms per character

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    function displayMenu() {
        content.innerHTML = '';
        const menuItems = currentMenu.map((item, index) => `<div class="menu-item">${item.title}</div>`).join('');
        typeText(menuItems, () => {
            addHighlighting();
            addCursor();
        });
    }

    function displayDetails(index) {
        content.innerHTML = '';
        const details = `<div class="details">${currentMenu[index].details}</div>`;
        typeText(details);
    }

    function addHighlighting() {
        const menuItems = content.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('highlight');
            } else {
                item.classList.remove('highlight');
            }
        });
    }

    function addCursor() {
        const highlightElement = document.querySelector('.highlight');
        if (highlightElement) {
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.textContent = ' ';
            highlightElement.appendChild(cursor);
        }
    }

    function typeText(htmlContent, callback) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const nodes = Array.from(tempDiv.childNodes);
        let i = 0;

        function typeNode() {
            if (i < nodes.length) {
                content.appendChild(nodes[i]);
                typeNodeContent(nodes[i], () => {
                    i++;
                    typeNode();
                });
            } else if (callback) {
                callback();
            }
        }

        function typeNodeContent(node, nodeCallback) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.textContent;
                node.textContent = '';
                let j = 0;
                const interval = setInterval(() => {
                    if (j < text.length) {
                        node.textContent += text[j];
                        j++;
                    } else {
                        clearInterval(interval);
                        nodeCallback();
                    }
                }, typingSpeed);
            } else {
                nodeCallback();
            }
        }

        typeNode();
    }

    function navigate(e) {
        if (e.key === 'ArrowUp' || e.target === upButton) {
            playSound(keySound1);
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentMenu.length - 1;
            displayMenu();
        } else if (e.key === 'ArrowDown' || e.target === downButton) {
            playSound(keySound1);
            currentIndex = (currentIndex < currentMenu.length - 1) ? currentIndex + 1 : 0;
            displayMenu();
        } else if (e.key === 'Enter' || e.key === 'ArrowRight' || e.target === enterButton) {
            playSound(keySound2);
            const selectedItem = currentMenu[currentIndex];
            if (selectedItem.type === 'section') {
                displayDetails(currentIndex);
            } else if (selectedItem.type === 'menu') {
                menuStack.push(currentMenu);
                currentMenu = selectedItem.children;
                currentIndex = 0; // Start after '../' back option
                displayMenu();
            } else if (selectedItem.type === 'back') {
                currentMenu = menuStack.pop() || sections;
                currentIndex = 0;
                displayMenu();
            }
        }
    }

    displayMenu();
    document.addEventListener('keydown', navigate);
	upButton.addEventListener('click', navigate);
    downButton.addEventListener('click', navigate);
    enterButton.addEventListener('click', navigate);
});
