# Work-Status-Portal

## 📌 Project Overview

**Work-Status-Portal** is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed to manage staff details, task assignments, and attendance tracking through a centralized dashboard. The application helps admins or managers monitor work progress efficiently using visual dashboards and structured data management.

---

## 🛠️ Technology Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Axios
* Chart.js & react-chartjs-2
* React Hook Form + Zod
* Framer Motion
* Lucide React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose ODM
* dotenv
* CORS

### Deployment

* Frontend: Vercel
* Backend: Node.js hosting (e.g., Render)

---

## 🏗️ Project Architecture

The project follows a MERN-based monolithic architecture with clear separation between frontend and backend.

```
React (Frontend)
   ↓ Axios
Express.js (REST API)
   ↓ Mongoose
MongoDB (Database)
```

* Frontend communicates with backend using REST APIs
* Backend handles business logic and database operations
* MongoDB stores application data in collections

---

## 🗂️ Database Design

### Collections

**Staff**

* name
* email
* phone
* staffId
* designation
* skills
* status

**Task**

* title
* description
* assignedTo (staff reference)
* status
* priority

**Attendance**

* staffId
* date
* attendanceStatus

All schemas are created using Mongoose with timestamps enabled.

---

## ✨ Key Features

### 📊 Dashboard

* Overview cards for quick statistics
* Task and staff status visualization using charts

### 👥 Staff Management

* Add, view, and edit staff details
* Manage staff designation and skills

### 📝 Task Management

* Create tasks
* Assign tasks to staff
* Track task status

### 🕒 Attendance Tracking

* Mark daily attendance
* View staff-wise attendance history

### 🔐 Authentication (Basic)

* Login and logout functionality
* Route protection using `isAuthenticated` stored in localStorage

---

## 🔐 Authentication Flow

1. User logs in through the login page
2. On successful login, authentication status is stored in localStorage
3. Protected routes check authentication status
4. Logout clears stored authentication data

> ⚠️ Note: This is a basic authentication mechanism. JWT-based authentication is recommended for production use.

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js
* MongoDB

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 📈 Future Improvements

* JWT-based authentication
* Role-based access control (Admin / Staff)
* Backend input validation
* Improved error handling
* Loading states and error boundaries in frontend
* Unit and integration testing
* Dockerization and CI/CD pipeline

---

## 🎯 Learning Outcomes

* Hands-on experience with MERN stack
* REST API design and integration
* Database schema design using MongoDB
* Dashboard creation with charts
* Frontend and backend deployment

---

## 📄 License

This project is developed for educational purposes.

---

## 🙌 Author

**Kapil D**

---

If you want to understand any module in detail, feel free to explore the codebase.
