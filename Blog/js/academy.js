fetch('https://debuilder.netlify.app/lessons.json')
  .then(response => response.json())
  .then(data => {
    // Assuming the first lesson
    const lesson = data[0]; // Access the first lesson
    const { title, content } = lesson;

    // Populate the lesson title and overview
    document.querySelector('.lesson-title').textContent = title;
    document.querySelector('.lesson-overview').textContent = content.overview;

    // Populate Learning Objectives
    const objectivesList = document.getElementById('objectives-list');
    objectivesList.innerHTML = ''; // Clear any existing content
    content.learningObjectives.forEach(objective => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = objective;
      objectivesList.appendChild(li);
    });

    // Populate Key Concepts
    const keyConceptsDiv = document.getElementById('key-concepts');
    keyConceptsDiv.innerHTML = ''; // Clear any existing content
    Object.entries(content.keyConcepts || {}).forEach(([key, concept]) => {
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
    activityDiv.innerHTML = ''; // Clear any existing content
    (content.activity || []).forEach(activity => {
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