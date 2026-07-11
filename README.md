# College Placement Portal

A complete, production-ready **MERN Stack** web application that connects students, company recruiters, and placement officers on a single secure platform. Built with a clean MVC architecture, role-based access control, modern responsive UI, dashboards with analytics, and full CRUD for students, companies, jobs, applications, and notifications.

> Suitable for a final-year college project and as a portfolio piece for software developer interviews.

---

## 🚀 Tech Stack

| Layer     | Technologies |
|-----------|--------------|
| Frontend  | React 18, React Router v6, Axios, Context API, Bootstrap 5, React Icons, React Toastify, Chart.js, jsPDF, xlsx |
| Backend   | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer, Helmet, express-rate-limit, express-mongo-sanitize, express-validator |
| Database  | MongoDB Atlas / Local MongoDB |

---

## 🎯 Features

### Authentication & Authorization
- Signup / Login / Logout (JWT in httpOnly cookie + Bearer token)
- Password hashing with **bcrypt**
- **Auto login** (profile fetch on load) & **auto logout** on token expiry
- **Remember me**, **Forgot / Reset password**
- **Role-based** protected routes for Student, Recruiter, Placement Officer

### Student
- Profile, edit profile, upload resume (PDF) & profile picture
- Browse / search / filter jobs, apply & withdraw
- Track application status, download **offer letter (PDF)**
- Notifications, profile completion %, settings (dark mode, change password)

### Company Recruiter
- Company profile + logo, post / edit / delete jobs
- View applicants, accept / reject, schedule interviews
- Company dashboard with charts

### Placement Officer (Admin)
- Dashboards & analytics (line / doughnut / bar charts)
- Manage students, companies, jobs, applications
- Approve / reject companies & jobs, delete users
- Export students to **Excel**, generate **PDF reports**, send notifications

### Cross-cutting
- Responsive UI, **dark mode**, pagination, sorting, search
- Loading spinners, skeleton loaders, toasts, modals
- Security: Helmet, rate limiting, NoSQL injection sanitization, input validation, central error handling

---

## 📁 Project Structure

```
college-placement-portal/
├── backend/                # Express + MongoDB API
│   ├── config/             # db connection
│   ├── controllers/        # auth, student, company, job, application, notification, admin
│   ├── middleware/         # auth, role, validate, upload, error
│   ├── models/             # User, Company, Job, Application, Notification
│   ├── routes/             # REST route definitions
│   ├── uploads/            # uploaded resumes / images / logos
│   ├── utils/              # apiError, sendToken, notify, seed
│   ├── app.js              # express app
│   └── server.js           # entry point
└── frontend/               # React SPA
    └── src/
        ├── components/     # Navbar, Sidebar, Cards, Charts, Modals...
        ├── context/        # AuthContext
        ├── hooks/          # useFetch
        ├── pages/          # public / student / admin / company
        ├── services/       # axios instances & API calls
        └── utils/          # formatters & constants
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local install or MongoDB Atlas connection string)

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Environment variables

**Backend** — create `backend/.env` (use `.env.example` as template):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/college_placement_portal
JWT_SECRET=your_strong_secret
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5
```

**Frontend** — create `frontend/.env`:

```env
VITE_API_URL=/api
VITE_UPLOADS_URL=/uploads
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates: **1 admin**, **5 companies**, **5 recruiters**, **20 students**, **30 jobs**, and **~50 applications**.

### 4. Run the app

```bash
# Terminal 1 - backend
cd backend && npm run dev

# Terminal 2 - frontend
cd frontend && npm run dev
```

Open **http://localhost:5173**

---

## 🔑 Default Logins

| Role              | Email               | Password     |
|-------------------|---------------------|--------------|
| Placement Officer | admin@gmail.com     | Admin@123    |
| Company Recruiter | company@gmail.com   | Company@123  |
| Student           | student@gmail.com   | Student@123  |

---

## 📡 REST API Summary

| Resource       | Endpoints |
|----------------|-----------|
| Auth           | `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/profile`, `PUT /api/auth/profile`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |
| Students       | `GET /api/students`, `GET /api/students/:id`, `PUT /api/students/:id`, `DELETE /api/students/:id` |
| Companies      | `GET /api/companies`, `POST /api/companies`, `PUT /api/companies/:id`, `DELETE /api/companies/:id`, `PUT /api/companies/:id/approval` |
| Jobs           | `GET /api/jobs`, `GET /api/jobs/:id`, `POST /api/jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id`, `PUT /api/jobs/:id/approval` |
| Applications   | `POST /api/applications`, `GET /api/applications`, `PUT /api/applications/:id`, `DELETE /api/applications/:id` |
| Notifications  | `GET /api/notifications`, `POST /api/notifications`, `DELETE /api/notifications/:id` |
| Admin          | `GET /api/admin/dashboard`, `/pending`, `/recruiters`, `/users`, `/report`, `DELETE /api/admin/users/:id` |

---

## 🚢 Deployment

- **Frontend → Vercel**: Import the `frontend` folder. Build command `npm run build`, output `dist`. Set `VITE_API_URL` to your deployed backend URL. Add a rewrite for SPA (`/*` → `/index.html`).
- **Backend → Render**: Create a Web Service for `backend`, build `npm install`, start `npm start`. Add the same environment variables (use MongoDB Atlas URI). Allow CORS for the Vercel URL.
- **Database → MongoDB Atlas**: Create a free cluster and use its connection string in `MONGODB_URI`.

---

## 📄 License

MIT — free to use for learning and portfolio purposes.
