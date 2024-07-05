document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const cursor = document.getElementById('cursor');
    
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

    function displayMenu() {
        content.innerHTML = currentMenu.map((item, index) => 
            `<div class="menu-item ${index === currentIndex ? 'highlight' : ''}">${item.title}</div>`
        ).join('');
        content.appendChild(cursor);
        positionCursor();
    }

    function displayDetails(index) {
        content.innerHTML = `<div class="details">${currentMenu[index].details}</div>`;
    }

    function positionCursor() {
        const highlightElement = document.querySelector('.highlight');
        if (highlightElement) {
            cursor.style.top = `${highlightElement.offsetTop}px`;
        }
    }

    function navigate(e) {
        if (e.key === 'ArrowUp') {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentMenu.length - 1;
            displayMenu();
        } else if (e.key === 'ArrowDown') {
            currentIndex = (currentIndex < currentMenu.length - 1) ? currentIndex + 1 : 0;
            displayMenu();
        } else if (e.key === 'Enter') {
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
