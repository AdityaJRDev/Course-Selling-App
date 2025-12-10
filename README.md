# Course Selling Platform - Backend API

A robust REST API backend for an online course-selling platform built with Node.js, Express, and MongoDB. This application handles user authentication, course management, and purchase workflows.

##  Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Secure password hashing
  - Role-based access control (Admin/User)
  
- **Course Management**
  - Create, read, update, and delete courses
  - Course categorization and filtering
  - Course purchase functionality

- **User Management**
  - User registration and login
  - Profile management
  - Purchase history tracking

- **Security**
  - Password encryption using bcrypt
  - JWT token-based authentication
  - Protected routes with middleware
  - Input validation and sanitization

##  Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt

##  Project Structure

```
Course-Selling-App/
├── middleware/          # Authentication and validation middleware
├── routes/             # API route handlers
├── db.js              # Database connection and schemas
├── index.js           # Main application entry point
├── package.json       # Project dependencies
└── .gitignore        # Git ignore rules
```

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdityaJRDev/Course-Selling-App.git
   cd Course-Selling-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

## 📚 API Endpoints

### Authentication Routes

#### User Routes
- `POST /api/user/signup` - Register a new user
- `POST /api/user/login` - User login
- `GET /api/user/courses` - Get all available courses
- `POST /api/user/courses/:courseId` - Purchase a course
- `GET /api/user/purchasedCourses` - Get purchased courses

#### Admin Routes
- `POST /api/admin/signup` - Register a new admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/courses` - Create a new course
- `PUT /api/admin/courses/:courseId` - Update a course
- `GET /api/admin/courses` - Get all courses (admin view)

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

## 💾 Database Schema

### User Schema
```javascript
{
  username: String,
  password: String (hashed),
  purchasedCourses: [CourseId]
}
```

### Admin Schema
```javascript
{
  username: String,
  password: String (hashed)
}
```

### Course Schema
```javascript
{
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
}
```

##  Testing

You can test the API endpoints using tools like:
- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/)
- [Insomnia](https://insomnia.rest/)

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  Author

**Aditya JR**
- GitHub: [@AdityaJRDev](https://github.com/AdityaJRDev)

- Built as a learning project to understand backend development
- Inspired by modern e-learning platforms

---

⭐ If you found this project helpful, please consider giving it a star!
