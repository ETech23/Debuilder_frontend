 const BACKEND_URL = 'https://debuilder.fly.dev'; // Backend URL
const token = localStorage.getItem('token'); // Retrieve the token for authentication

// Redirect to login if not authenticated
if (!token) {
    alert('You need to log in first.');
    window.location.href = 'login.html';
}

// Fetch and display user profile and blogs
document.addEventListener('DOMContentLoaded', async () => {
    await fetchProfile();
    await fetchUserBlogs();
});

// Fetch user profile
async function fetchProfile() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        document.getElementById('username').value = data.username;
        document.getElementById('email').value = data.email;
    } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile. Please try again later.');
    }
}

// Update user profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        alert('Profile updated successfully!');
        document.getElementById('password').value = ''; // Clear password field
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again later.');
    }
});

// Delete user account
document.getElementById('deleteAccount').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete account');
        }

        alert('Account deleted successfully.');
        localStorage.removeItem('token');
        window.location.href = 'register.html';
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again later.');
    }
});

// Fetch user blogs
async function fetchUserBlogs() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/blog/users-blogs`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }

        const blogs = await response.json();
        displayUserBlogs(blogs);
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        alert('Failed to load your blogs. Please try again later.');
    }
}

// Display user blogs in the table
function displayUserBlogs(blogs) {
    const tableBody = document.getElementById('userBlogsTable');
    tableBody.innerHTML = blogs.map(blog => `
        <tr>
            <td>${blog._id}</td>
            <td>${blog.title}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editBlog('${blog._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteBlog('${blog._id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Edit blog (redirect to blog editing page)
function editBlog(blogId) {
    window.location.href = `editBlog.html?id=${blogId}`;
}

// Delete a blog
async function deleteBlog(blogId) {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/blogs/${blogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete blog');
        }

        alert('Blog deleted successfully.');
        fetchUserBlogs(); // Refresh the blogs table
    } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog. Please try again later.');
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}
