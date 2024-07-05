document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const keySound1 = document.getElementById('keySound1');
    const keySound2 = document.getElementById('keySound2');

    const sections = [
        { title: 'Welcome Note', details: 'Details about my contact...', type: 'section' },
        { title: 'Access Krishna Kanth B\'s Resume!', type: 'menu', children: [
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
        ]},
        { title: 'How to Navigate', details: 'Use Arrow Keys to navigate, Enter to select, ../ to go back', type: 'section' }
    ];

    let currentMenu = sections;
    let menuStack = [];
    let currentIndex = 1; // Start after '../' back option
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
        if (e.key === 'ArrowUp') {
            playSound(keySound1);
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentMenu.length - 1;
            displayMenu();
        } else if (e.key === 'ArrowDown') {
            playSound(keySound1);
            currentIndex = (currentIndex < currentMenu.length - 1) ? currentIndex + 1 : 0;
            displayMenu();
        } else if (e.key === 'Enter') {
            playSound(keySound2);
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
