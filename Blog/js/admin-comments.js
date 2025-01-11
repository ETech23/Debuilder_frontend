const BACKEND_URL = 'https://debuilder.fly.dev';
let currentCommentPage = 1;
const commentsPerPage = 10;
let commentSearchQuery = '';

// Fetch comments for moderation
async function fetchAdminComments(page = 1, search = '') {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login as an admin to access this page.');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${BACKEND_URL}/api/comments/admin?page=${page}&limit=${commentsPerPage}&search=${search}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            displayComments(data.comments);
            setupPagination(data.totalComments, page);
        } else {
            alert(data.message || 'Failed to fetch comments');
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Display comments in the table
function displayComments(comments) {
    const table = document.getElementById('commentsTable');
    table.innerHTML = comments.map(comment => `
        <tr>
            <td>${comment._id}</td>
            <td>${comment.user?.username || 'Unknown'}</td>
            <td>${comment.blog?.title || 'Unknown'}</td>
            <td>${comment.comment}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteComment('${comment._id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Setup pagination controls
function setupPagination(totalComments, currentPage) {
    const totalPages = Math.ceil(totalComments / commentsPerPage);
    const paginationControls = document.getElementById('commentPaginationControls');

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-secondary'}"
                    onclick="changePage(${i})">${i}</button>
        `;
    }

    paginationControls.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentCommentPage = page;
    fetchAdminComments(page, commentSearchQuery);
}

// Delete comment
async function deleteComment(commentId) {
    const token = localStorage.getItem('token');
    await fetch(`${BACKEND_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchAdminComments(currentCommentPage, commentSearchQuery);
}

// Search comments
document.getElementById('commentSearchBar').addEventListener('input', (e) => {
    commentSearchQuery = e.target.value.trim();
    currentCommentPage = 1;
    fetchAdminComments(currentCommentPage, commentSearchQuery);
});

// Initialize
fetchAdminComments(currentCommentPage);
