const BACKEND_URL = 'https://debuilder.fly.dev';

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize TinyMCE
    tinymce.init({
        selector: '#content', // Apply TinyMCE to the textarea with id="content"
        height: 400,
        plugins: 'lists link image textcolor code',
        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | outdent indent | link image | forecolor backcolor | code',
        setup: (editor) => {
            console.log('TinyMCE initialized:', editor.id); // Log the editor instance
        },
    });

    // Add event listener for form submission
    const form = document.getElementById('uploadBlogForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Ensure TinyMCE content is saved to the textarea
        tinymce.triggerSave();

        // Get form input values
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim(); // Get TinyMCE content
        const imageFile = document.getElementById('image').files[0]; // Get uploaded image file

        // Validate input fields
        if (!title || !content) {
            alert('Please fill in all fields.');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            // Send the blog data to the backend API
            const response = await fetch(`${BACKEND_URL}/blogs`, {
                method: 'POST',
                body: formData, // Send form data as multipart/form-data
            });

            const data = await response.json();

            if (response.ok) {
                // Success message
                document.getElementById('message').innerHTML = `<div class="alert alert-success">Blog successfully uploaded!</div>`;
                form.reset(); // Reset the form
                tinymce.get('content').setContent(''); // Clear the TinyMCE editor
            } else {
                // Error message from the server
                document.getElementById('message').innerHTML = `<div class="alert alert-danger">${data.message || 'Error uploading blog'}</div>`;
            }
        } catch (error) {
            console.error('Error uploading blog:', error);
            document.getElementById('message').innerHTML = `<div class="alert alert-danger">An error occurred. Please try again later.</div>`;
        }
    });
});