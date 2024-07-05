document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const cursor = document.getElementById('cursor');
    const backButton = document.getElementById('backButton');
    
    const sections = [
        { title: 'About Me', details: 'Details about me...' },
        { title: 'Experience', details: 'Details about my experience...' },
        { title: 'Skills', details: 'Details about my skills...' },
        { title: 'Education', details: 'Details about my education...' },
        { title: 'Contact', details: 'Details about my contact...' }
    ];

    let currentIndex = 0;
    let inDetailsView = false;

    function displayMenu() {
        content.innerHTML = sections.map((section, index) => 
            `<div class="menu-item ${index === currentIndex ? 'highlight' : ''}">${section.title}</div>`
        ).join('');
        content.appendChild(cursor);
        positionCursor();
    }

    function displayDetails(index) {
        content.innerHTML = `<div class="details">${sections[index].details}</div>`;
    }

    function positionCursor() {
        const highlightElement = document.querySelector('.highlight');
        if (highlightElement) {
            cursor.style.top = `${highlightElement.offsetTop}px`;
        }
    }

    function navigate(e) {
        if (inDetailsView) return;

        if (e.key === 'ArrowUp') {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : sections.length - 1;
            displayMenu();
        } else if (e.key === 'ArrowDown') {
            currentIndex = (currentIndex < sections.length - 1) ? currentIndex + 1 : 0;
            displayMenu();
        } else if (e.key === 'Enter') {
            inDetailsView = true;
            displayDetails(currentIndex);
        }
    }

    displayMenu();

    document.addEventListener('keydown', navigate);

    backButton.addEventListener('click', () => {
        if (inDetailsView) {
            inDetailsView = false;
            displayMenu();
        }
    });
});
