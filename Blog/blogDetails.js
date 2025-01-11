const BACKEND_URL = 'https://debuilder.fly.dev';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const blogId = params.get('id'); // Get the blog ID from the URL

  if (blogId) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/blogs/${blogId}`);
      if (!response.ok) throw new Error('Failed to fetch blog details');
      const blog = await response.json();

      const blogDetailsContainer = document.getElementById('blogDetails');
      if (blogDetailsContainer) {
        blogDetailsContainer.innerHTML = `
          <h2>${blog.title}</h2>
          <p>${blog.content}</p>
          ${
            blog.image
              ? `<img src="${BACKEND_URL}${blog.image}" alt="${blog.title} Image" style="max-width: 100%; height: auto;">`
              : ''
          }
        `;
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
    }
  } else {
    console.error('No blog ID found in the URL');
  }
});