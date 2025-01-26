// Add this to your blogDetails.js file

document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile menu
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navbarToggler.addEventListener('click', function() {
        navbarCollapse.classList.toggle('show');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
    
    // Close mobile menu when window resizes to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
});

// Add this to your blogDetails.js file

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle element modifications
    const observeElement = () => {
        const targetNode = document.querySelector('section.hero');
        
        if (!targetNode) return;

        // Create a MutationObserver instance
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
                    const section = mutation.target;
                    
                    // Check if the id is 'blogDetails'
                    if (section.id === 'blogDetails') {
                        section.style.background = 'white';
                        
                        // Update text colors
                        const paragraphs = section.getElementsByTagName('p');
                        const headings = section.getElementsByTagName('h1');
                        
                        Array.from(paragraphs).forEach(p => {
                            p.style.color = '#1f2937'; // var(--text-color)
                            p.style.backgroundColor = 'white';
                        });
                        
                        Array.from(headings).forEach(h => {
                            h.style.color = '#1f2937'; // var(--text-color)
                        });
                    }
                }
            });
        });

        // Start observing the target node for attribute changes
        observer.observe(targetNode, {
            attributes: true,
            attributeFilter: ['id'] // only watch for id changes
        });
    };

    // Initialize the observer
    observeElement();
});

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