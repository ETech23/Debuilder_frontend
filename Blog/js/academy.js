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

let lessons = [];
let currentLessonIndex = 0;

// Fetch lessons from JSON
fetch('js/lessons.json')
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

