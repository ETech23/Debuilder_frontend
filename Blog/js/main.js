const BACKEND_URL = 'https://debuilder.fly.dev'; // Backend URL

document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1; // Default to the first page
  let blogsPerPage = 6; // Number of blogs per page
  let allBlogs = []; // To store all fetched blogs
  let displayedBlogs = []; // Blogs currently displayed after filtering

  // Fetch and display all blog posts
  async function fetchBlogs() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/blogs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allBlogs = data.blogs; // Store all fetched blogs
      displayedBlogs = [...allBlogs]; // Initialize displayed blogs
      displayBlogs(1); // Display the first page of blogs
      setupPagination();
    } catch (error) {
      console.error('Error fetching blogs:', error);
      displayErrorMessage('Failed to fetch blogs. Please try again later.');
    }
  }

  // Display an error message in the blog container
  function displayErrorMessage(message) {
    const blogContainer = document.getElementById('blogPosts');
    if (blogContainer) {
      blogContainer.innerHTML = `<p class="text-danger">${message}</p>`;
    } else {
      console.error("Element with ID 'blogPosts' not found.");
    }
  }

  // Display blog posts for the current page
  function displayBlogs(page) {
    const blogContainer = document.getElementById('blogPosts');
    if (!blogContainer) {
      console.error("Element with ID 'blogPosts' not found.");
      return;
    }

    if (!displayedBlogs || displayedBlogs.length === 0) {
      blogContainer.innerHTML = '<p>No blogs found.</p>';
      return;
    }

    const startIndex = (page - 1) * blogsPerPage;
    const endIndex = Math.min(startIndex + blogsPerPage, displayedBlogs.length);
    const blogsToDisplay = displayedBlogs.slice(startIndex, endIndex);

    blogContainer.innerHTML = blogsToDisplay
      .map(
        (blog) => `
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">${blog.title}</h5>
              <p class="card-text">${blog.content.substring(0, 100)}...</p>
              <a href="blogDetails.html?id=${blog._id}" class="btn btn-primary">Read More</a>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  }

  // Setup pagination controls
  function setupPagination() {
    const totalPages = Math.ceil(displayedBlogs.length / blogsPerPage);
    const paginationControls = document.getElementById('paginationControls');
    if (!paginationControls) {
      console.error("Element with ID 'paginationControls' not found.");
      return;
    }

    let paginationHTML = '';
    if (currentPage > 1) {
      paginationHTML += `<button class="btn btn-sm btn-secondary" onclick="changePage(${currentPage - 1})">Previous</button>`;
    }
    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
        <button class="btn btn-sm ${
          i === currentPage ? 'btn-primary' : 'btn-outline-secondary'
        }" onclick="changePage(${i})">${i}</button>
      `;
    }
    if (currentPage < totalPages) {
      paginationHTML += `<button class="btn btn-sm btn-secondary" onclick="changePage(${currentPage + 1})">Next</button>`;
    }

    paginationControls.innerHTML = paginationHTML;
  }

  // Handle page change for pagination
  function changePage(page) {
    currentPage = page;
    displayBlogs(currentPage);
  }

  // Filter blogs based on search query
  function searchBlogs() {
    const searchBar = document.getElementById('searchBar');
    if (!searchBar) {
      console.error("Element with ID 'searchBar' not found.");
      return;
    }

    const query = searchBar.value.trim().toLowerCase();
    if (query) {
      displayedBlogs = allBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(query)
      );
    } else {
      displayedBlogs = [...allBlogs]; // Reset to all blogs if query is empty
    }

    currentPage = 1; // Reset to the first page
    displayBlogs(currentPage);
    setupPagination(); // Update pagination controls
  }

  // Attach event listener to search bar
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', searchBlogs);
  } else {
    console.error("Element with ID 'searchBar' not found.");
  }

  // Fetch blogs on page load
  fetchBlogs();
});