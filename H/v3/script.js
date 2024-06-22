/* // Add interactivity

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
} */

// Add interactivity
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section');
  const toggleAllButton = document.getElementById('toggle-all'); // Assuming button has ID "toggle-all"

  // Add click event listener to toggle all sections
  toggleAllButton.addEventListener('click', function() {
    const isExpanded = sections[0].classList.contains('open'); // Check if any section is open
    sections.forEach(section => section.classList.toggle('open', !isExpanded));
  });

  sections.forEach(section => {
    section.addEventListener('click', function() {
      this.classList.toggle('open');
    });
  });
});


function calculateAge() {
  // Pre-defined DOB (replace with your actual logic if needed)
  var dobString = "1989-12-13";
  var dobDate = new Date(dobString);
  var today = new Date();
  
  var ageDiffInMs = today.getTime() - dobDate.getTime();
  var ageInYears = Math.floor(ageDiffInMs / (1000 * 60 * 60 * 24 * 365));
  
  var message = "Age: " + ageInYears + " years | Height: 177 cms";
  document.getElementById("ageDisplay").innerHTML = message;
  
  var message2 = ageInYears + " years";
  document.getElementById("ageDisplay2").innerHTML = message2;
}

calculateAge();