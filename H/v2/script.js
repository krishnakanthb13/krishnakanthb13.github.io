// Add interactivity

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.addEventListener('click', function() {
            this.classList.toggle('open');
        });
    });
});

function toggleSection(element) {
    const content = element.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}
