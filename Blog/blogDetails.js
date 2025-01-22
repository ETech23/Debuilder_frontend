document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const blogId = params.get('id'); // Get the blog ID from the URL

  if (blogId) {
    try {
      const response = await fetch(`https://debuilder.fly.dev/api/blogs/${blogId}`);
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

/** // JavaScript for scroll detection
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
});**/