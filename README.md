# Task Management System

A full-stack task management application built with Node.js, Express, MongoDB, and React.

## Features

### 🔐 Authentication & Authorization
- User registration and login with JWT tokens
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt
- Token refresh mechanism
- Protected routes and middleware

### 📋 Task Management
- Create, read, update, and delete tasks
- Task properties: title, description, status, priority, due date, tags
- Task status: Pending, In Progress, Completed
- Priority levels: Low, Medium, High
- Task filtering and sorting
- Task statistics and analytics

### 👥 User Management
- User profile management
- Admin panel for user management
- User activity tracking
- Account activation/deactivation

### 🛡️ Security Features
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- MongoDB injection protection
- XSS protection

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **morgan** - HTTP request logger

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **JavaScript (ES6+)** - Programming language

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://localhost:27017/taskmanagement
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:5175
```

5. Generate JWT secrets (optional):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

6. Start the development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
VITE_API_URL=http://localhost:3001/api/v1
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5175`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer your-access-token
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/v1/tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer your-access-token
```

#### Get Single Task
```http
GET /api/v1/tasks/:id
Authorization: Bearer your-access-token
```

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management system",
  "priority": "high",
  "status": "pending",
  "dueDate": "2024-12-31",
  "tags": ["project", "urgent"]
}
```

#### Update Task
```http
PUT /api/v1/tasks/:id
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer your-access-token
```

#### Get Task Statistics
```http
GET /api/v1/tasks/stats
Authorization: Bearer your-access-token
```

### User Endpoints

#### Get User Profile
```http
GET /api/v1/users/profile
Authorization: Bearer your-access-token
```

#### Update User Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "name": "Updated Name"
}
```

## Project Structure

```
Task-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── taskController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validators.js
│   │   ├── models/
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── v1/
│   │   │       ├── authRoutes.js
│   │   │       ├── taskRoutes.js
│   │   │       └── userRoutes.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Usage

### User Registration & Login
1. Open the application in your browser
2. Click "Register" to create a new account
3. Fill in your details (password must contain uppercase, lowercase, and number)
4. Login with your credentials

### Task Management
1. After logging in, you'll see the dashboard
2. Click "+" to create a new task
3. Fill in task details (title is required)
4. Use the filter buttons to view tasks by status
5. Click edit/delete icons on tasks to modify them

### User Roles
- **Regular User**: Can manage their own tasks
- **Admin**: Can manage all users and tasks (set role to 'admin' during registration)

## Environment Variables

### Backend (.env)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `MONGO_URI`: MongoDB connection string
- `JWT_ACCESS_SECRET`: Secret for access tokens
- `JWT_REFRESH_SECRET`: Secret for refresh tokens
- `JWT_ACCESS_EXPIRE`: Access token expiration (default: 15m)
- `JWT_REFRESH_EXPIRE`: Refresh token expiration (default: 7d)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window
- `CORS_ORIGIN`: Allowed CORS origin

### Frontend (.env)
- `VITE_API_URL`: Backend API URL

## Scripts

### Backend
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

- Built with modern web technologies
- Follows REST API best practices
- Implements security best practices
- Responsive design with Tailwind CSS