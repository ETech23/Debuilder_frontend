// Backend URL Constant
const BACKEND_URL = 'https://debuilder.fly.dev';

// Global variables
let currentCommentPage = 1; // Tracks the current comment page
const commentsPerPage = 5; // Number of comments per page
let commentSearchQuery = ''; // Tracks the search query

document.addEventListener('DOMContentLoaded', async () => {
    initializeNavbar();
    await initializeBlogDetails(); // Ensure this completes before moving on
    initializeComments();
});

// Initialize Navbar
function initializeNavbar() {
    const navbarToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');

    if (navbarToggle && navbarCollapse) {
        // Ensure Bootstrap's default behavior is preserved
        navbarToggle.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
    } else {
        console.error('Navbar toggle or collapse elements missing.');
    }
}

// Fetch and display blog details
async function initializeBlogDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!blogId) {
        alert('No blog ID provided');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/blogs/${blogId}`);
        const blog = await response.json();

        if (response.ok) {
            const blogDetails = document.getElementById('blogDetails');
            const likeCount = document.getElementById('likeCount');

            blogDetails.innerHTML = `
                <h1>${blog.title}</h1>
                <p>by <strong>${blog.author?.username || 'Unknown Author'}</strong></p>
                <p>${blog.content}</p>
            `;
            likeCount.textContent = `${blog.likes} Likes`;

            initializeLikeButton(blogId);
        } else {
            alert(blog.message || 'Failed to load blog details');
        }
    } catch (error) {
        console.error('Error fetching blog details:', error);
    }
}

// Initialize Like Button
function initializeLikeButton(blogId) {
    const likeButton = document.getElementById('likeButton');
    const likeCount = document.getElementById('likeCount');

    likeButton.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to like this blog.');
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/blogs/${blogId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (response.ok) {
                likeCount.textContent = `${result.likes} Likes`;
                alert('Blog liked successfully!');
            } else {
                alert(result.message || 'Failed to like blog');
            }
        } catch (error) {
            console.error('Error liking blog:', error);
        }
    });
}

// Fetch, display, and handle comments
function initializeComments() {
    const commentForm = document.getElementById('commentForm');
    const commentSearchBar = document.getElementById('commentSearchBar');

    // Initial load of comments
    fetchComments(currentCommentPage, commentSearchQuery);

    // Add comment submission
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to add a comment.');
            return;
        }

        const comment = document.getElementById('comment').value;

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const blogId = urlParams.get('id');

            const response = await fetch(`${BACKEND_URL}/comments/${blogId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ comment }),
            });

            const result = await response.json();

            if (response.ok) {
                fetchComments(currentCommentPage, commentSearchQuery); // Reload comments
                commentForm.reset();
                alert('Comment added successfully!');
            } else {
                alert(result.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    });

    // Handle comment search
    commentSearchBar.addEventListener('input', () => {
        commentSearchQuery = commentSearchBar.value.trim();
        currentCommentPage = 1;
        fetchComments(currentCommentPage, commentSearchQuery);
    });
}

// Fetch comments from the backend
async function fetchComments(page, search) {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    const commentsList = document.getElementById('commentsList');
    const commentPaginationControls = document.getElementById('commentPaginationControls');

    try {
        const response = await fetch(
            `${BACKEND_URL}/api/comments/${blogId}?page=${page}&limit=${commentsPerPage}&search=${search}`
        );
        const data = await response.json();

        if (response.ok) {
            displayComments(data.comments);
            setupCommentPagination(data.totalComments, page);
        } else {
            commentsList.innerHTML = '<p>No comments available.</p>';
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        commentsList.innerHTML = '<p>Error loading comments. Please try again later.</p>';
    }
}

// Display comments
function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = comments
        .map(
            (comment) => `
        <div class="mb-2">
            <strong>${comment.user?.username || 'Anonymous'}</strong>: ${comment.comment}
        </div>
    `
        )
        .join('');
}

// Setup pagination controls
function setupCommentPagination(totalComments, currentPage) {
    const totalPages = Math.ceil(totalComments / commentsPerPage);
    const commentPaginationControls = document.getElementById('commentPaginationControls');
    let paginationHTML = '';

    if (currentPage > 1) {
        paginationHTML += `<button class="btn btn-sm btn-secondary" onclick="changeCommentPage(${currentPage - 1})">Previous</button>`;
    }
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-secondary'}"
                    onclick="changeCommentPage(${i})">${i}</button>
        `;
    }
    if (currentPage < totalPages) {
        paginationHTML += `<button class="btn btn-sm btn-secondary" onclick="changeCommentPage(${currentPage + 1})">Next</button>`;
    }

    commentPaginationControls.innerHTML = paginationHTML;
}

// Change comment page
window.changeCommentPage = (page) => {
    currentCommentPage = page;
    fetchComments(currentCommentPage, commentSearchQuery);
};