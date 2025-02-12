const BACKEND_URL = 'https://debuilder.fly.dev';

// Authentication Check
const token = localStorage.getItem('token');
//const myElement = document.getElementById("myElement"); 
//myElement.innerHTML = token; 

if (!token) {
    alert('Unauthorized access. Please log in as an admin.');
    window.location.href = 'login.html';
}

// Dashboard Elements
const totalBlogs = document.getElementById('totalBlogs');
const totalComments = document.getElementById('totalComments');
const totalLikes = document.getElementById('totalLikes');
const blogsTable = document.getElementById('blogsTable');
const blogForm = document.getElementById('blogForm');
const blogModal = new bootstrap.Modal(document.getElementById('blogModal'));
const commentsTable = document.getElementById('commentsTable');

// Fetch Analytics Overview
async function fetchDashboardStats() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            totalBlogs.textContent = data.totalBlogs;
            totalComments.textContent = data.totalComments;
            totalLikes.textContent = data.totalLikes;
        } else {
            alert('Failed to load dashboard stats');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchBlogs() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/blogs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Assuming API returns { blogs: [...] }
    const blogs = Array.isArray(data.blogs) ? data.blogs : [];

    if (blogs.length > 0) {
    blogsTable.innerHTML = blogs.map(blog => `
    <tr>
        <td>${blog._id}</td>
        <td>${blog.title}</td>
        <td>
            <button class="btn btn-sm btn-warning" onclick="editBlog('${blog._id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteBlog('${blog._id}')">Delete</button>
        </td>
    </tr>
`).join('');
} else {
    blogsTable.innerHTML = '<tr><td colspan="3">No blogs found.</td></tr>';
}
  } catch (error) {
    console.error("Error fetching blogs:", error);
    blogsTable.innerHTML = '<tr><td colspan="3">Failed to load blogs. Please try again later.</td></tr>';
  }
}


// Create or Edit Blog
async function editBlog(blogId) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/blogs/${blogId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const blog = await response.json();

        if (response.ok) {
            // Populate form fields with blog data
            document.getElementById('blogId').value = blog._id;
            document.getElementById('title').value = blog.title;
            document.getElementById('content').value = blog.content;

            // Show the modal
            blogModal.show();
        } else {
            alert(blog.message || 'Failed to fetch blog details.');
        }
    } catch (error) {
        console.error(`Failed to fetch blog with ID: ${blogId}`, error);
    }
}

blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('blogId').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${BACKEND_URL}/api/blogs/${id}` : `${BACKEND_URL}/api/blogs`;

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content })
    });

    blogModal.hide();
    fetchBlogs();
});

// Delete Blog
async function deleteBlog(blogId) {
    if (!confirm('Are you sure you want to delete this blog?')) return; // Confirmation dialog

    try {
        const response = await fetch(`${BACKEND_URL}/api/blogs/${blogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Blog deleted successfully!');
            fetchBlogs(); // Reload the blogs list
        } else {
            const result = await response.json();
            alert(result.message || 'Failed to delete blog.');
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        alert('An error occurred while deleting the blog. Please try again.');
    }
}

// Fetch Comments
async function fetchComments() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/comments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const comments = await response.json();

        if (response.ok) {
            if (Array.isArray(comments) && comments.length > 0) {
                commentsTable.innerHTML = comments.map(comment => `
                    <tr>
                        <td>${comment.id}</td>
                        <td>${comment.blogTitle}</td>
                        <td>${comment.user}</td>
                        <td>${comment.comment}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                commentsTable.innerHTML = '<tr><td colspan="5">No comments found.</td></tr>';
            }
        } else {
            commentsTable.innerHTML = '<tr><td colspan="5">Failed to load comments.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Delete Comment
async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();

        if (response.ok) {
            alert('Comment deleted successfully!');
            fetchComments();
        } else {
            alert(result.message || 'Failed to delete comment.');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
}

// Initialize Dashboard
fetchDashboardStats();
fetchBlogs();
fetchComments();