document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const keySound = document.getElementById('keySound');

    const sections = [
        { title: '../', type: 'back' },
        { title: 'About Me', details: 'Details about me...', type: 'section' },
        { title: 'Experience', type: 'menu', children: [
            { title: '../', type: 'back' },
            { title: 'Company A', details: 'Details about Company A...', type: 'section' },
            { title: 'Company B', details: 'Details about Company B...', type: 'section' }
        ] },
        { title: 'Skills', details: 'Details about my skills...', type: 'section' },
        { title: 'Education', details: 'Details about my education...', type: 'section' },
        { title: 'Contact', details: 'Details about my contact...', type: 'section' }
    ];

    let currentMenu = sections;
    let menuStack = [];
    let currentIndex = 1; // Start after '../' back option
    let typingInterval;
    const typingSpeed = 50; // ms per character

    function playSound() {
        keySound.currentTime = 0;
        keySound.play();
    }

    function displayMenu() {
        clearInterval(typingInterval);
        content.innerHTML = '';
        const menuItems = currentMenu.map(item => `<div class="menu-item">${item.title}</div>`).join('');
        typeText(menuItems, () => {
            addHighlighting();
            addCursor();
        });
    }

    function displayDetails(index) {
        clearInterval(typingInterval);
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

    function typeText(text, callback) {
        let i = 0;
        typingInterval = setInterval(() => {
            if (i < text.length) {
                content.innerHTML += text[i];
                i++;
            } else {
                clearInterval(typingInterval);
                if (callback) callback();
            }
        }, typingSpeed);
    }

    function navigate(e) {
        if (e.key === 'ArrowUp') {
            playSound();
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentMenu.length - 1;
            displayMenu();
        } else if (e.key === 'ArrowDown') {
            playSound();
            currentIndex = (currentIndex < currentMenu.length - 1) ? currentIndex + 1 : 0;
            displayMenu();
        } else if (e.key === 'Enter') {
            playSound();
            const selectedItem = currentMenu[currentIndex];
            if (selectedItem.type === 'section') {
                displayDetails(currentIndex);
            } else if (selectedItem.type === 'menu') {
                menuStack.push(currentMenu);
                currentMenu = selectedItem.children;
                currentIndex = 1; // Start after '../' back option
                displayMenu();
            } else if (selectedItem.type === 'back') {
                currentMenu = menuStack.pop() || sections;
                currentIndex = 1;
                displayMenu();
            }
        }
    }

    displayMenu();
    document.addEventListener('keydown', navigate);
});
