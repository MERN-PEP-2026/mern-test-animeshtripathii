# TaskMaster - Advanced Task Management System

TaskMaster is a modern, responsive full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to manage their daily tasks with advanced features like server-side pagination, status filtering, priority tagging, and secure authentication.

## 🚀 Features

### Frontend (React + Tailwind CSS)
- **Modern UI/UX**: Clean, responsive design inspired by premium dashboards, featuring a custom dark-green and mint-green color palette (`#0B2B26`, `#2DFF81`).
- **Secure Authentication**: Protected routes with JWT tokens stored securely. Includes custom Login and Registration pages with robust validation.
- **Paginated Dashboard**: Server-side pagination (4 tasks per page) with advanced navigation controls (first, last, ellipsis for large data sets).
- **Task Filtering & Search**: Instant client-side search across task titles and descriptions. Server-side filtering by "Pending" or "Completed" statuses.
- **Advanced Task Creation**: Detailed Create/Edit modal supporting:
  - Task Title & Description
  - Status (Pending/Done)
  - Options for Priority Level (Low, Medium, High, Critical)
  - Due Dates
- **Three-dot Action Menu**: Clean table interface featuring an action menu for quick edits, status toggling, and deletion.
- **Smart Date Display**: Custom date renderer showing intuitive labels like "Today", "Tomorrow", "Overdue", or standard date formats.
- **Stats Dashboard**: Dynamic summary cards showing total, pending, and completed task counts.
- **User Settings**: Dedicated Settings modal allowing users to safely update their name, email, and password.

### Backend (Node.js + Express + MongoDB)
- **MVC Architecture**: Codebase is strictly organized into Models, Controllers, Services, and Routes to ensure maintainability and separation of concerns.
- **Advanced Mongoose Models**:
  - `User`: Uses bcrypt for password hashing, regex for email validation, and strict length requirements.
  - `Task`: Uses strict enums for `priority` and `status`, compound indexing for faster queries, and ties every task to a `createdBy` user reference.
- **Server-Side Pagination**: Implemented `skip` and `limit` logic coupled with `countDocuments` to handle scaling smoothly.
- **Robust Error Handling**: Standardized JSON error response format containing unified success fields, status codes, and clear messages across all controllers.
- **Security**: Advanced JWT middleware pattern utilizing explicit verification and database user lookups for hardened Route protection.

---

## 🛣️ API Routes

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|----------|----------|
| `POST` | `/register` | Register a new user account | Public |
| `POST` | `/login` | Authenticate user and return JWT | Public |
| `PUT` | `/profile` | Update user details (Name, Email, Password) | Private |

### Task Routes (`/api/tasks`)
| Method | Endpoint | Description | Access |
|--------|----------|----------|----------|
| `GET` | `/` | Fetch tasks (Supports `?page=`, `?limit=`, `?status=`) | Private |
| `POST` | `/` | Create a new task | Private |
| `GET` | `/:id` | Fetch a single task by ID | Private |
| `PUT` | `/:id` | Update an existing task by ID | Private |
| `DELETE` | `/:id` | Permanently delete a task by ID | Private |

---

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios (with request/response interceptors)
- React Router DOM
- Google Material Symbols

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs
- CORS & dotenv

---

## ⚙️ Local Development Setup

### 1. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend root based on the following pattern:
   ```env
   PORT=8080
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/TaskManager?retryWrites=true&w=majority
   JWT_Secret_Key=your_super_secret_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   # Server will run on http://localhost:8080
   ```

### 2. Frontend Setup
1. Navigate to the `frontend/` directory (in a separate terminal):
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   # Frontend will be available at http://localhost:5173
   ```

*Note: The frontend `vite.config.js` is automatically configured to proxy `/api` requests to `http://localhost:8080`.*