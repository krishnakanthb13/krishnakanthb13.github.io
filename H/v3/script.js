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

/* const video = document.getElementById('backgroundVideo');
let isPlayingForward = true; // Flag to track playback direction

video.addEventListener('playing', function() {
  setInterval(function() {
    if (isPlayingForward) {
      if (video.currentTime >= video.duration) {
        video.currentTime = 0;
        isPlayingForward = false;
      }
    } else {
      if (video.currentTime === 0) {
        isPlayingForward = true;
      } else {
        video.currentTime -= 0.0; // Adjust the speed of the "rewind" effect
      }
    }
  }, 10); // Adjust the interval for smoother playback (lower value = smoother)
}); */


/* const video = document.getElementById('backgroundVideo');
const videoDuration = video.duration; // Store video duration

video.addEventListener('playing', function() {
  let isPlayingForward = true; // Flag to track playback direction

  video.addEventListener('timeupdate', function() {
    const currentTime = video.currentTime;

    if (isPlayingForward) {
      if (currentTime >= videoDuration) {
        isPlayingForward = false;
        video.currentTime = videoDuration - 0.2; // Set to just before the end for smooth transition
      }
    } else {
      if (currentTime <= 0) {
        isPlayingForward = true;
        video.currentTime = 0.2; // Set to just after the beginning for smooth transition
      } else {
        video.currentTime -= 0.2; // Adjust the speed of the "rewind" effect (lower value = slower)
      }
    }
  });
}); */

/* const video = document.getElementById('backgroundVideo');

video.addEventListener('loadedmetadata', function() {
  const videoDuration = video.duration; // Store video duration

  let isPlayingForward = true; // Flag to track playback direction

  video.addEventListener('timeupdate', function() {
    const currentTime = video.currentTime;

    if (isPlayingForward) {
      if (currentTime >= videoDuration) {
        isPlayingForward = false;
        video.currentTime = videoDuration - 0.2; // Set to just before the end for smooth transition
      }
    } else {
      if (currentTime <= 0) {
        isPlayingForward = true;
        video.currentTime = 0.2; // Set to just after the beginning for smooth transition
      } else {
        video.currentTime -= 0.2; // Adjust the speed of the "rewind" effect (lower value = slower)
      }
    }
  });

  video.play(); // Start playing the video
}); */

/* const video = document.getElementById('backgroundVideo');

video.addEventListener('loadedmetadata', function() {
  const videoDuration = video.duration; // Store video duration
  let isPlayingForward = true; // Flag to track playback direction

  function updatePlayback() {
    const currentTime = video.currentTime;

    if (isPlayingForward) {
      if (currentTime >= videoDuration) {
        isPlayingForward = false;
        video.pause(); // Pause before reversing
        setTimeout(() => {
          video.playbackRate = -1; // Reverse playback
          video.currentTime = videoDuration - 0.1; // Ensure it stays at the end
          video.play(); // Play in reverse
        }, 100); // Delay to ensure smooth transition
      }
    } else {
      if (currentTime <= 0) {
        isPlayingForward = true;
        video.pause(); // Pause before reversing
        setTimeout(() => {
          video.playbackRate = 1; // Normal playback
          video.currentTime = 0.1; // Ensure it stays at the beginning
          video.play(); // Play forward
        }, 100); // Delay to ensure smooth transition
      }
    }
  }

  video.addEventListener('timeupdate', updatePlayback);

  // Start playing the video forward
  video.playbackRate = 1;
  video.play();
});
 */
 
/* const video = document.getElementById('backgroundVideo');

video.addEventListener('loadedmetadata', function() {
  const videoDuration = video.duration; // Store video duration
  let isPlayingForward = true; // Flag to track playback direction

  video.playbackRate = 1; // Start with normal playback rate

  function updatePlayback() {
    const currentTime = video.currentTime;

    if (isPlayingForward && currentTime >= videoDuration) {
      isPlayingForward = false;
      video.pause(); // Pause to switch direction
      setTimeout(() => {
        video.playbackRate = -1; // Reverse playback
        video.play(); // Play in reverse
      }, 100); // Short delay for smooth transition
    }

    if (!isPlayingForward && currentTime <= 0) {
      isPlayingForward = true;
      video.pause(); // Pause to switch direction
      setTimeout(() => {
        video.playbackRate = 1; // Normal playback
        video.play(); // Play forward
      }, 100); // Short delay for smooth transition
    }
  }

  video.addEventListener('timeupdate', updatePlayback);

  // Start playing the video
  video.play();
});

 */