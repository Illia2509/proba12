// Store users data in localStorage (simulating a database)
const USERS_KEY = 'registered_users';
const CURRENT_USER_KEY = 'current_user';

// Initialize localStorage with sample data if empty
function initializeStorage() {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
}

// Get all registered users
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current logged-in user
function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Set current user
function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Clear current user (logout)
function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
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

// Check if email already exists
function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
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
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const messageDiv = document.getElementById('registrationMessage');

    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    // Validation
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

    if (emailExists(email)) {
        showMessage(messageDiv, 'This email is already registered', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: btoa(password), // Simple encoding (not secure for production)
        joinDate: new Date().toLocaleDateString()
    };

    // Save user to localStorage
    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    // Show success message and redirect to login
    showMessage(messageDiv, 'Registration successful! Redirecting to login...', 'success');
    
    setTimeout(() => {
        document.getElementById('registrationForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.querySelector('#loginForm form').reset();
        document.getElementById('loginMessage').textContent = '';
    }, 1500);
}

// Handle login
function handleLogin(event) {
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

    // Find user
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === btoa(password));

    if (!user) {
        showMessage(messageDiv, 'Invalid email or password', 'error');
        return;
    }

    // Successful login
    setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate
    });

    showMessage(messageDiv, 'Login successful! Redirecting...', 'success');

    setTimeout(() => {
        showDashboard();
    }, 800);
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
    initializeStorage();
    const currentUser = getCurrentUser();
    if (currentUser) {
        showDashboard();
    }
});
