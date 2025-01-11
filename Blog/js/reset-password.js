const BACKEND_URL = 'https://debuilder.fly.dev';

// Reset Password Logic
document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();

    if (!email) {
        alert('Please enter your email.');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/users/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        alert(result.message || 'Password reset email sent.');
    } catch (error) {
        console.error('Error resetting password:', error);
        alert('An error occurred. Please try again later.');
    }
});
