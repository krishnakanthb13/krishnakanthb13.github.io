// scripts.js
function openPage(page) {
    const content = document.getElementById('content');
    let html = '';

    switch(page) {
        case 'about':
            html = '<h1>About Me</h1><p>This is the About Me section.</p>';
            break;
        case 'experience':
            html = '<h1>Experience</h1><p>This is the Experience section.</p>';
            break;
        case 'education':
            html = '<h1>Education</h1><p>This is the Education section.</p>';
            break;
        case 'skills':
            html = '<h1>Skills</h1><p>This is the Skills section.</p>';
            break;
    }

    content.innerHTML = html;
    content.classList.add('active');
}

document.getElementById('content').addEventListener('click', function() {
    this.classList.remove('active');
});
