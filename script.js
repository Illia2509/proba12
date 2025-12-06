const API_URL = 'http://localhost:5000/api';
const CURRENT_USER_KEY = 'current_user';

// Get current logged-in user from sessionStorage
function getCurrentUser() {
    const user = sessionStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Set current user in sessionStorage
function setCurrentUser(user) {
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Clear current user (logout)
function clearCurrentUser() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
    return password.length >= 6;
}

// Toggle between login and registration forms
function toggleForms() {
    event.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');

    loginForm.classList.toggle('hidden');
    registrationForm.classList.toggle('hidden');

    // Clear messages and forms
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('loginMessage').className = 'message';
    document.getElementById('registrationMessage').textContent = '';
    document.getElementById('registrationMessage').className = 'message';

    // Reset form inputs
    document.querySelector('#loginForm form').reset();
    document.querySelector('#registrationForm form').reset();
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const messageDiv = document.getElementById('registrationMessage');

    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    // Client-side validation
    if (!name) {
        showMessage(messageDiv, 'Please enter your full name', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showMessage(messageDiv, 'Please enter a valid email address', 'error');
        return;
    }

    if (!validatePassword(password)) {
        showMessage(messageDiv, 'Password must be at least 6 characters long', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage(messageDiv, 'Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirmPassword
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage(messageDiv, 'Registration successful! Redirecting to login...', 'success');
            
            setTimeout(() => {
                document.getElementById('registrationForm').classList.add('hidden');
                document.getElementById('loginForm').classList.remove('hidden');
                document.querySelector('#loginForm form').reset();
                document.getElementById('loginMessage').textContent = '';
            }, 1500);
        } else {
            showMessage(messageDiv, data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Error connecting to server. Make sure the server is running.', 'error');
        console.error('Registration error:', error);
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');

    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    // Validation
    if (!validateEmail(email)) {
        showMessage(messageDiv, 'Please enter a valid email address', 'error');
        return;
    }

    if (!password) {
        showMessage(messageDiv, 'Please enter your password', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Save user to sessionStorage
            setCurrentUser(data.user);
            
            showMessage(messageDiv, 'Login successful! Redirecting...', 'success');

            setTimeout(() => {
                showDashboard();
            }, 800);
        } else {
            showMessage(messageDiv, data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Error connecting to server. Make sure the server is running on port 5000.', 'error');
        console.error('Login error:', error);
    }
}

// Show dashboard
function showDashboard() {
    const loginForm = document.getElementById('loginForm');
    const dashboard = document.getElementById('dashboard');
    const currentUser = getCurrentUser();

    if (currentUser) {
        loginForm.classList.add('hidden');
        dashboard.classList.remove('hidden');

        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('joinDate').textContent = currentUser.joinDate;

        document.querySelector('#loginForm form').reset();
    }
}

// Handle logout
function handleLogout() {
    clearCurrentUser();
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('loginForm');

    dashboard.classList.add('hidden');
    loginForm.classList.remove('hidden');

    document.querySelector('#loginForm form').reset();
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('loginMessage').className = 'message';
}

// Display message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
}

// Check if user is already logged in when page loads
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        showDashboard();
    }
});
