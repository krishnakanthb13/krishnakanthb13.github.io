document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const keySound1 = document.getElementById('keySound1');
    const keySound2 = document.getElementById('keySound2');

    const sections = [
        { title: 'Welcome Note', details: '<p>$ Welcome to my resume!<br><br>Hello there! I hope you are doing Great.<br><br>And you have a nice time Navigating my career path.</p>', type: 'section' },
        { title: 'Access Krishna Kanth B\'s Resume!', type: 'menu', children: [
            { title: '../', type: 'back' },
            { title: 'About Me', details: '<p>With my extensive background in data analysis and my zeal for discovering insights from challenging datasets, I am certain that I would be a significant asset to your team.<br><br>As an Analyst with over eight years of experience, I’ve developed a deep understanding of data management, analysis, visualization, and storytelling methodologies and technologies...</p>', type: 'section' },
            { title: 'Experience', type: 'menu', children: [
                { title: '../', type: 'back' },
                { title: 'Sep 2022 - Oct 2023 - [Technical Support Engineer Specialist] @PowerSchool (GlowTouch)', details: '<p>PowerSchool is a leading provider of cloud-based K-12 education software, helping schools manage grades, attendance, communication, and more...</p>', type: 'section' },
                // Add more experience sections as needed
            ] },
            { title: 'Skills', details: '<p><b>Domain Of Expertise</b><br>Specialized in the below areas, contributing to a Data Validation, Integration and Enrichment in a diverse range of projects and consistently driving optimal outcomes...</p>', type: 'section' },
            { title: 'Education', details: '<p>2013 - <b>Master\'s degree (M.Sc Biotechnology)</b><br>Major : Biotechnology at Vellore Institute of Technology<br>| VIT Vellore | 06/2011 - 03/2013 | 8.62 CGPA |</p>', type: 'section' },
            { title: 'Contact', details: '<p>Email: krishnakanthb13@gmail.com<br>Phone: +91 7667360114<br><br>Clickable Links:<h4><a href="https://www.linkedin.com/in/bkrishnakanth/" target="_blank"><b>| LinkedIn |</b></a><br><a href="https://sites.google.com/view/krishnakanthb/home" target="_blank"><b>| Projects |</b><br></a><a href="https://github.com/krishnakanthb13/" target="_blank"><b>| GitHub |</b></a><br><a href="https://bio.site/krishnakanthb13" target="_blank"><b>| BioLink |</b></a><br><br><a class="email" href="https://wa.me/7667360114?text=Hi%2C%20I%20am%20reaching%20out%20to%20you%20after%20checking%20your%20Git-Hub%20Online%20Resume.">WhatsApp Me</a><br><a class="email" href="mailto:krishnakanthb13@gmail.com">E-mail Me</a></h4></p>', type: 'section' }
        ]}
    ];

    let currentMenu = sections;
    let menuStack = [];
    let currentIndex = 0;
    const typingSpeed = 50; // ms per character

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    function displayMenu() {
        content.innerHTML = '';
        currentMenu.forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');
            if (index === currentIndex) menuItem.classList.add('highlight');
            menuItem.textContent = item.title;
            content.appendChild(menuItem);
        });
    }

    function displayDetails(index) {
        content.innerHTML = currentMenu[index].details;
    }

    function navigate(e) {
        if (e.key === 'ArrowUp') {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentMenu.length - 1;
            playSound(keySound1);
        } else if (e.key === 'ArrowDown') {
            currentIndex = (currentIndex < currentMenu.length - 1) ? currentIndex + 1 : 0;
            playSound(keySound1);
        } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
            const selectedItem = currentMenu[currentIndex];
            if (selectedItem.type === 'menu') {
                menuStack.push(currentMenu);
                currentMenu = selectedItem.children;
                currentIndex = 0;
            } else if (selectedItem.type === 'back') {
                currentMenu = menuStack.pop();
                currentIndex = 0;
            } else {
                displayDetails(currentIndex);
                return; // Skip re-rendering the menu
            }
            playSound(keySound2);
        } else if (e.key === 'ArrowLeft') {
            if (menuStack.length > 0) {
                currentMenu = menuStack.pop();
                currentIndex = 0;
                playSound(keySound2);
            }
        }
        displayMenu();
    }

    displayMenu();
    document.addEventListener('keydown', navigate);
});

