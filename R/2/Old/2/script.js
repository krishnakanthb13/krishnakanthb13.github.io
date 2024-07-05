document.addEventListener('DOMContentLoaded', (event) => {
    const content = document.getElementById('content');
    const backButton = document.querySelector('.back-button');

    let sections = [
        'Welcome to My Interactive Resume!',
        '1. About Me\n2. Experience\n3. Skills\n4. Education\n5. Contact',
    ];

    let currentSection = 0;

    function displaySection(index) {
        content.innerHTML = '';
        typeText(sections[index]);
    }

    function typeText(text) {
        let i = 0;
        let interval = setInterval(() => {
            if (i < text.length) {
                content.innerHTML += text[i];
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);
    }

    function navigate(e) {
        if (e.key === 'ArrowUp') {
            currentSection = (currentSection > 0) ? currentSection - 1 : sections.length - 1;
            displaySection(currentSection);
        } else if (e.key === 'ArrowDown') {
            currentSection = (currentSection < sections.length - 1) ? currentSection + 1 : 0;
            displaySection(currentSection);
        } else if (e.key === 'Enter') {
            // Handle enter key functionality here
            alert(`You selected section ${currentSection + 1}`);
        }
    }

    displaySection(currentSection);

    document.addEventListener('keydown', navigate);

    backButton.addEventListener('click', () => {
        if (currentSection > 0) {
            currentSection = 0;
            displaySection(currentSection);
        }
    });
});
