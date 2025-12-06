const API_URL = 'http://localhost:5000/api';
let currentUserId = null;

// Load all users from database
async function loadUsers() {
    const usersBody = document.getElementById('usersBody');
    const loadingMessage = document.getElementById('loadingMessage');
    const messageDiv = document.getElementById('message');

    // Show loading message
    loadingMessage.style.display = 'block';
    usersBody.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();

        loadingMessage.style.display = 'none';

        if (data.success && data.users.length > 0) {
            // Update total users count
            document.getElementById('totalUsers').textContent = data.users.length;

            // Populate table
            usersBody.innerHTML = '';
            data.users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.join_date}</td>
                    <td>${formatDate(user.created_at)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-view" onclick="viewUser(${user.id})">View</button>
                            <button class="btn btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                        </div>
                    </td>
                `;
                usersBody.appendChild(row);
            });

            showMessage(messageDiv, `Loaded ${data.users.length} users successfully`, 'success');
        } else {
            document.getElementById('totalUsers').textContent = '0';
            usersBody.innerHTML = '<tr><td colspan="6" class="text-center">No users found in database</td></tr>';
            showMessage(messageDiv, 'No users registered yet', 'info');
        }
    } catch (error) {
        loadingMessage.style.display = 'none';
        document.getElementById('totalUsers').textContent = '0';
        usersBody.innerHTML = '<tr><td colspan="6" class="text-center">Error loading users</td></tr>';
        showMessage(messageDiv, 'Error connecting to server. Make sure it\'s running on port 5000.', 'error');
        console.error('Error:', error);
    }
}

// View user details in modal
async function viewUser(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        const data = await response.json();

        if (data.success) {
            currentUserId = userId;
            const user = data.user;
            const userDetails = document.getElementById('userDetails');

            userDetails.innerHTML = `
                <div class="user-detail-item">
                    <div class="detail-label">User ID</div>
                    <div class="detail-value">${user.id}</div>
                </div>
                <div class="user-detail-item">
                    <div class="detail-label">Full Name</div>
                    <div class="detail-value">${user.name}</div>
                </div>
                <div class="user-detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${user.email}</div>
                </div>
                <div class="user-detail-item">
                    <div class="detail-label">Join Date</div>
                    <div class="detail-value">${user.join_date}</div>
                </div>
                <div class="user-detail-item">
                    <div class="detail-label">Account Created</div>
                    <div class="detail-value">${formatDate(user.created_at)}</div>
                </div>
            `;

            openModal();
        }
    } catch (error) {
        showMessage(document.getElementById('message'), 'Error loading user details', 'error');
        console.error('Error:', error);
    }
}

// Delete user
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        deleteUserConfirm(userId);
    }
}

// Confirm delete user
async function deleteUserConfirm(userId = null) {
    const userToDelete = userId || currentUserId;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch(`${API_URL}/users/${userToDelete}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            closeModal();
            showMessage(messageDiv, 'User deleted successfully', 'success');
            setTimeout(() => {
                loadUsers();
            }, 1000);
        } else {
            showMessage(messageDiv, data.message || 'Error deleting user', 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Error connecting to server', 'error');
        console.error('Error:', error);
    }
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';

    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

// Open modal
function openModal() {
    document.getElementById('userModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('userModal').classList.remove('show');
    currentUserId = null;
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('userModal');
    if (event.target == modal) {
        closeModal();
    }
});

// Load users when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});
