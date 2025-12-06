# Auth Site - Login & Registration with SQLite Database

A full-stack authentication website with user registration, login, and SQLite3 database integration.

## Features

✅ **User Registration** - Create new accounts with email and password
✅ **User Login** - Secure authentication with password hashing
✅ **SQLite Database** - All user data stored in local database
✅ **Password Encryption** - Using bcryptjs for secure password storage
✅ **Responsive Design** - Beautiful UI with gradient background
✅ **Session Management** - User sessions stored in browser
✅ **Admin API** - Get all users or specific user information

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Security**: bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup Steps

1. **Navigate to project directory**
   ```bash
   cd auth-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5000`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    join_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### Register User
- **POST** `/api/register`
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

### Login User
- **POST** `/api/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Get All Users
- **GET** `/api/users`
- **Response**:
  ```json
  {
    "success": true,
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "join_date": "12/6/2025",
        "created_at": "2025-12-06T10:30:00Z"
      }
    ]
  }
  ```

### Get User by ID
- **GET** `/api/users/:id`
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "join_date": "12/6/2025",
      "created_at": "2025-12-06T10:30:00Z"
    }
  }
  ```

### Delete User
- **DELETE** `/api/users/:id`
- **Response**:
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

## File Structure

```
auth-site/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # Frontend JavaScript
├── server.js           # Express server
├── package.json        # Dependencies
├── .gitignore          # Git ignore file
├── users.db            # SQLite database (created after first run)
└── README.md           # This file
```

## How It Works

1. **Registration**: User submits form → Server validates → Password is hashed with bcryptjs → User saved to SQLite database
2. **Login**: User submits credentials → Server queries database → Password compared with hash → Session created
3. **Dashboard**: After login, user sees personalized dashboard with their information

## Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Email validation
- ✅ Password confirmation matching
- ✅ Duplicate email prevention
- ✅ CORS enabled for security
- ✅ Input sanitization

## Notes

- All user information is stored in `users.db` SQLite database
- Session data is stored in browser sessionStorage
- Passwords are hashed before storage (not plain text)
- The database file is created automatically on first run

## Future Enhancements

- Email verification
- Password reset functionality
- JWT tokens for better session management
- User profile editing
- Admin panel
- Rate limiting for login attempts
