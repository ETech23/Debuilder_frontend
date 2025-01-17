// Function to enable copy functionality
function enableCopyFunctionality() {
  document.querySelectorAll('.copy-text').forEach(copyElement => {
    copyElement.addEventListener('click', event => {
      const codeToCopy = event.target.getAttribute('data-code');
      navigator.clipboard
        .writeText(codeToCopy)
        .then(() => alert('Code copied to clipboard!'))
        .catch(err => console.error('Failed to copy text: ', err));
    });
  });
}

// Function to enable run functionality
function enableRunFunctionality() {
  document.querySelectorAll('.run-code').forEach(runElement => {
    runElement.addEventListener('click', event => {
      const codeToRun = event.target.getAttribute('data-code');
      const codeBlock = event.target.closest('.code-container');
      showIframe(codeToRun, codeBlock);
    });
  });
}

// Function to show iframe directly below the clicked "Run" button
function showIframe(code, codeBlock) {
  // Remove any existing iframe in the same section
  const existingIframe = codeBlock.querySelector('.code-iframe-container');
  if (existingIframe) {
    existingIframe.remove();
  }

  // Create new iframe container
  const iframeContainer = document.createElement('div');
  iframeContainer.className = 'code-iframe-container';
  iframeContainer.innerHTML = `
    <button class="btn btn-danger close-iframe">Close</button>
    <iframe class="code-iframe" style="width: 100%; height: 300px; border: 1px solid #ccc;"></iframe>
  `;

  codeBlock.appendChild(iframeContainer);

  // Write the code into the iframe
  const iframe = iframeContainer.querySelector('.code-iframe');
  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(code);
  iframeDocument.close();

  // Add event listener to close button
  iframeContainer.querySelector('.close-iframe').addEventListener('click', () => {
    iframeContainer.remove();
  });
}

// Fetch lessons and initialize
fetch('https://debuilder.netlify.app/lessons.json')
  .then(response => response.json())
  .then(lessons => {
    loadProgress();

    function loadLesson(index) {
      const lesson = lessons[index];
      const { title, content } = lesson;

      // Update lesson title and overview
      document.querySelector('.lesson-title').textContent = title;
      document.querySelector('.lesson-overview').textContent = content.overview;

      // Update Learning Objectives
      const objectivesList = document.getElementById('objectives-list');
      objectivesList.innerHTML = '';
      (content.learningObjectives || []).forEach(objective => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = objective;
        objectivesList.appendChild(li);
      });

      // Update Key Concepts
      const keyConceptsDiv = document.getElementById('key-concepts');
      keyConceptsDiv.innerHTML = '';
      Object.entries(content.keyConcepts || {}).forEach(([key, concept]) => {
        if (typeof concept === 'object' && concept.example) {
          const conceptBlock = document.createElement('div');
          conceptBlock.className = 'code-container';
          conceptBlock.innerHTML = `
            <h4 class="text-dark mt-3">${key.replace(/([A-Z])/g, ' $1')}</h4>
            <p class="text-secondary">${concept.description}</p>
            <p class="text-primary copy-text" data-code="${escapeHtml(concept.example.code)}">Copy</p>
            ${concept.example.run ? `<p class="text-success run-code" data-code="${escapeHtml(concept.example.code)}">Run</p>` : ''}
            <pre class="bg-light p-3 rounded text-start" style="white-space: pre-wrap;">
              <code>${escapeHtml(concept.example.code)}</code>
            </pre>
          `;
          keyConceptsDiv.appendChild(conceptBlock);
        } else if (typeof concept === 'string') {
          const textBlock = document.createElement('p');
          textBlock.className = 'text-dark mt-2';
          textBlock.textContent = `${key}: ${concept}`;
          keyConceptsDiv.appendChild(textBlock);
        }
      });

      // Update Common Tags (for Lesson 1)
      if (content.keyConcepts && content.keyConcepts.CommonTags) {
        content.keyConcepts.CommonTags.forEach(tagInfo => {
          const tagBlock = document.createElement('div');
          tagBlock.className = 'code-container';
          tagBlock.innerHTML = `
            <h4 class="text-dark mt-3">${tagInfo.tag}</h4>
            <p class="text-secondary">${tagInfo.description}</p>
            <p class="text-primary copy-text" data-code="${escapeHtml(tagInfo.example)}">Copy</p>
            <pre class="bg-light p-3 rounded text-start" style="white-space: pre-wrap;">
              <code>${escapeHtml(tagInfo.example)}</code>
            </pre>
          `;
          keyConceptsDiv.appendChild(tagBlock);
        });
      }

      // Update Activity
      const activityDiv = document.getElementById('activity');
      activityDiv.innerHTML = '';
      (content.activity || []).forEach(activity => {
        const activityBlock = document.createElement('div');
        activityBlock.className = 'code-container';
        activityBlock.innerHTML = `
          <h4 class="text-dark mt-3">${activity.task}</h4>
          <ul class="list-group list-group-flush">
            ${activity.steps.map(step => `<li class="list-group-item">${escapeHtml(step)}</li>`).join('')}
          </ul>
          <p class="text-primary copy-text" data-code="${escapeHtml(activity.code)}">Copy</p>
          ${activity.run ? `<p class="text-success run-code" data-code="${escapeHtml(activity.code)}">Run</p>` : ''}
          <pre class="bg-light p-3 rounded text-start" style="white-space: pre-wrap;">
            <code>${escapeHtml(activity.code)}</code>
          </pre>
        `;
        activityDiv.appendChild(activityBlock);
      });

      // Update Lesson Number
      document.getElementById('lesson-number').textContent = index + 1;

      // Update Progress Bar
      const progressBar = document.getElementById('progress-bar');
      const progressPercent = ((index + 1) / lessons.length) * 100;
      progressBar.style.width = `${progressPercent}%`;

      // Update Navigation Buttons
      document.getElementById('prev-btn').disabled = index === 0;
      document.getElementById('next-btn').disabled = index === lessons.length - 1;

      // Save progress
      saveProgress();

      // Enable Copy and Run functionality for the current lesson
      enableCopyFunctionality();
      enableRunFunctionality();
    }

    // Event Listeners for Navigation
    document.getElementById('prev-btn').addEventListener('click', () => {
      if (currentLessonIndex > 0) {
        currentLessonIndex--;
        loadLesson(currentLessonIndex);
      }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      if (currentLessonIndex < lessons.length - 1) {
        currentLessonIndex++;
        loadLesson(currentLessonIndex);
      }
    });

    // Initial Load
    loadLesson(currentLessonIndex);
  })
  .catch(error => console.error('Error fetching lessons:', error));

// Function to escape HTML
function escapeHtml(html) {
  if (!html) return '';
  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Save and Load Progress Functions
function saveProgress() {
  localStorage.setItem('currentLessonIndex', currentLessonIndex);
}

function loadProgress() {
  const savedIndex = localStorage.getItem('currentLessonIndex');
  currentLessonIndex = savedIndex ? parseInt(savedIndex, 10) : 0;
}