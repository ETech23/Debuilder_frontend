/** // Array of Lessons
const lessons = [
  "Introduction to HTML",
  "Introduction to CSS",
  "Introduction to JavaScript",
  "DOM Manipulation",
  "Advanced JavaScript",
  "Introduction to Bootstrap",
  "Responsive Design",
  "Version Control with Git",
  "Debugging Techniques",
  "Project Deployment"
];

let currentLesson = 0;

// Update Lesson Content
function updateLesson() {
  document.querySelector('.lesson-title').textContent = `Lesson ${currentLesson + 1}: ${lessons[currentLesson]}`;
  document.getElementById('lesson-number').textContent = currentLesson + 1;
  document.getElementById('progress-bar').style.width = `${((currentLesson + 1) / lessons.length) * 100}%`;

  document.getElementById('prev-btn').disabled = currentLesson === 0;
  document.getElementById('next-btn').disabled = currentLesson === lessons.length - 1;
}

// Event Listeners for Navigation
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentLesson < lessons.length - 1) {
    currentLesson++;
    updateLesson();
  }
});

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentLesson > 0) {
    currentLesson--;
    updateLesson();
  }
});

// Initialize Content
updateLesson();**/

fetch('https://debuilder.netlify.app') // Adjust the path if necessary
  .then(response => response.json())
  .then(data => {
    // Assuming the first lesson
    const lesson = data[0];
    const { title, content } = lesson;

    // Populate the lesson title and overview
    document.querySelector('.lesson-title').textContent = title;
    document.querySelector('.lesson-overview').textContent = content.overview;

    // Populate Learning Objectives
    const objectivesList = document.getElementById('objectives-list');
    content.learningObjectives.forEach(objective => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = objective;
      objectivesList.appendChild(li);
    });

    // Populate Key Concepts
    const keyConceptsDiv = document.getElementById('key-concepts');
    Object.entries(content.keyConcepts).forEach(([key, concept]) => {
      const conceptBlock = document.createElement('div');
      if (typeof concept === 'object') {
        conceptBlock.innerHTML = `
          <h4 class="text-dark mt-3">${key.replace(/([A-Z])/g, ' $1')}</h4>
          <p class="text-secondary">${concept.description}</p>
          <pre class="bg-light p-3 rounded">
            <code>${concept.example}</code>
          </pre>
          <button class="btn btn-primary mt-2 copy-btn" data-code="${concept.example}">Copy Code</button>
        `;
      } else {
        conceptBlock.innerHTML = `
          <h4 class="text-dark mt-3">${key.replace(/([A-Z])/g, ' $1')}</h4>
          <p class="text-secondary">${concept}</p>
        `;
      }
      keyConceptsDiv.appendChild(conceptBlock);
    });

    // Populate Activity
    const activityDiv = document.getElementById('activity');
    content.activity.forEach(activity => {
      const activityBlock = document.createElement('div');
      activityBlock.innerHTML = `
        <h4 class="text-dark mt-3">${activity.task}</h4>
        <ul class="list-group list-group-flush">
          ${activity.steps.map(step => `<li class="list-group-item">${step}</li>`).join('')}
        </ul>
        <pre class="bg-light p-3 rounded">
          <code>${activity.code}</code>
        </pre>
        <button class="btn btn-primary mt-2 copy-btn" data-code="${activity.code}">Copy Code</button>
      `;
      activityDiv.appendChild(activityBlock);
    });

    // Copy Button Functionality
    document.querySelectorAll('.copy-btn').forEach(button => {
      button.addEventListener('click', event => {
        const code = event.target.getAttribute('data-code');
        navigator.clipboard.writeText(code).then(() => {
          alert('Code copied to clipboard!');
        });
      });
    });
  })
  .catch(error => console.error('Error fetching lessons:', error));

/** //fetch
let lessons = [];
let currentLessonIndex = 0;

// Fetch lessons from JSON https://debuilder.netlify.app
fetch('http://localhost:8000/lessons.json')
  .then(response => response.json())
  .then(data => {
    lessons = data;
    displayLesson(currentLessonIndex);
  });

// Display current lesson
function displayLesson(index) {
  const lesson = lessons[index];
  document.querySelector('.lesson-title').textContent = `Lesson ${index + 1}: ${lesson.title}`;
  document.querySelector('#lesson-content p').textContent = lesson.content;
  document.getElementById('lesson-number').textContent = index + 1;

  // Update button states
  document.getElementById('prev-btn').disabled = index === 0;
  document.getElementById('next-btn').disabled = index === lessons.length - 1;

  // Update progress bar
  document.getElementById('progress-bar').style.width = `${((index + 1) / lessons.length) * 100}%`;
}

// Navigation buttons
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentLessonIndex > 0) {
    currentLessonIndex--;
    displayLesson(currentLessonIndex);
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentLessonIndex < lessons.length - 1) {
    currentLessonIndex++;
    displayLesson(currentLessonIndex);
  }
});

// JavaScript for scroll detection
let lastScrollTop = 0;
const footer = document.getElementById('dynamicFooter');

window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop) {
        // Scrolling down - hide footer
        footer.classList.add('hidden');
    } else {
        // Scrolling up - show footer
        footer.classList.remove('hidden');
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Prevent negative scrolling
});

        const token = localStorage.getItem('token');

if (!token) {
  alert("You are not logged in!\nPlease log in for a better user experience.");

  // Get all elements with the class "hidden"
  const hiddenElements = document.querySelectorAll('.hidden');

  // Remove the "hidden" class from each element
  hiddenElements.forEach(element => {
    element.classList.remove('hidden');
  });
}
**/
