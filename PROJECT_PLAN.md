# Team Task Manager - MVP Implementation Plan

## 🎯 Project Overview
A full-stack web application for team collaboration with project management, task assignment, and role-based access control.

---

## 📋 Core Requirements (MVP - Phase 1)

### ✅ Features to Implement
1. **Authentication System**
   - User signup with email/password
   - User login with JWT tokens
   - Password hashing (bcrypt)
   - Protected routes with JWT middleware

2. **Project Management**
   - Create projects (authenticated users)
   - View all projects (user is member of)
   - Update project details (Admin only)
   - Delete projects (Admin only)

3. **Team Management**
   - Add members to projects
   - Remove members from projects
   - Assign roles (Admin/Member) per project
   - View team members list

4. **Task Management**
   - Create tasks within projects
   - Assign tasks to team members
   - Update task status (TODO, IN_PROGRESS, DONE)
   - Set priority and due dates
   - Delete tasks

5. **Dashboard**
   - Overview of user's tasks
   - Task statistics (total, completed, pending)
   - Overdue tasks list
   - Tasks grouped by status

6. **Role-Based Access Control (RBAC)**
   - Project-level roles (Admin/Member)
   - Admin: Full CRUD on projects, tasks, team
   - Member: View projects, create/update own tasks

---

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken + bcrypt)
- **Validation:** Zod
- **Environment:** dotenv

### Frontend
- **Framework:** React + Vite
- **HTTP Client:** Axios
- **State Management:** Redux Toolkit + RTK Query
- **UI Library:** shadcn/ui (Radix UI + Tailwind CSS)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Form Handling:** React Hook Form + Zod
- **Styling:** Tailwind CSS with custom design tokens or also we can use redux if you think

### Deployment
- **Platform:** Railway
- **Database:** Railway Managed PostgreSQL
- **CI/CD:** GitHub Actions (automated testing & deployment) -> we will surely do it 

---

## 🗄️ Database Schema

### Tables

#### 1. users
```sql
id              UUID PRIMARY KEY
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
name            VARCHAR(255) NOT NULL
status          ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE'
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

#### 2. projects
```sql
id              UUID PRIMARY KEY
name            VARCHAR(255) NOT NULL
description     TEXT
created_by      UUID REFERENCES users(id)
status          ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE'
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

#### 3. team_memberships
```sql
id              UUID PRIMARY KEY
project_id      UUID REFERENCES projects(id) ON DELETE CASCADE
user_id         UUID REFERENCES users(id) ON DELETE CASCADE
role            ENUM('ADMIN', 'MEMBER') DEFAULT 'MEMBER'
status          ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE'
joined_at       TIMESTAMP DEFAULT NOW()
removed_at      TIMESTAMP NULL

UNIQUE(project_id, user_id)
```

#### 4. tasks
```sql
id              UUID PRIMARY KEY
project_id      UUID REFERENCES projects(id) ON DELETE CASCADE
title           VARCHAR(255) NOT NULL
description     TEXT
status          ENUM('TODO', 'IN_PROGRESS', 'DONE') DEFAULT 'TODO'
priority        ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM'
due_date        TIMESTAMP
assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL
created_by      UUID REFERENCES users(id)
is_deleted      BOOLEAN DEFAULT FALSE
deleted_at      TIMESTAMP NULL
deleted_by      UUID REFERENCES users(id) NULL
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### Relationships
- User → Projects (1:N via created_by)
- User → Projects (M:N via team_memberships)
- Project → Tasks (1:N)
- User → Tasks (1:N via assigned_to)
- User → Tasks (1:N via created_by)

---

## 🛣️ API Endpoints

### Authentication
```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - Login user (returns JWT)
GET    /api/auth/me              - Get current user info (protected)
```

### Projects
```
GET    /api/projects             - Get all user's projects (protected)
POST   /api/projects             - Create new project (protected)
GET    /api/projects/:id         - Get project details (protected, member only)
PUT    /api/projects/:id         - Update project (protected, admin only)
DELETE /api/projects/:id         - Soft delete project (protected, admin only)
```

### Team Management
```
GET    /api/projects/:id/members           - Get project members (protected)
POST   /api/projects/:id/members           - Add member to project (protected, admin only)
PATCH  /api/projects/:id/members/:userId   - Deactivate member (protected, admin only)
PUT    /api/projects/:id/members/:userId   - Update member role (protected, admin only)
```

### Tasks
```
GET    /api/projects/:id/tasks             - Get all tasks in project (protected)
POST   /api/projects/:id/tasks             - Create task (protected)
GET    /api/tasks/:id                      - Get task details (protected)
PUT    /api/tasks/:id                      - Update task (protected)
DELETE /api/tasks/:id                      - Soft delete task (protected, admin or creator)
PATCH  /api/tasks/:id/status               - Update task status (protected, assignee)
```

### Dashboard
```
GET    /api/dashboard                      - Get user dashboard data (protected)
GET    /api/dashboard/stats                - Get task statistics (protected)
GET    /api/dashboard/overdue              - Get overdue tasks (protected)
```

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── teamController.js
│   │   │   ├── taskController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── rbacMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── teamRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── projectService.js
│   │   │   ├── teamService.js
│   │   │   ├── taskService.js
│   │   │   └── dashboardService.js
│   │   ├── utils/
│   │   │   ├── jwtUtils.js
│   │   │   └── errorHandler.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── projectValidator.js
│   │   │   ├── taskValidator.js
│   │   │   └── teamValidator.js
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ConfirmDialog.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── SignupForm.jsx
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   ├── ProjectList.jsx
│   │   │   │   └── CreateProjectModal.jsx
│   │   │   ├── tasks/
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   ├── TaskList.jsx
│   │   │   │   ├── CreateTaskModal.jsx
│   │   │   │   └── TaskStatusBadge.jsx
│   │   │   └── dashboard/
│   │   │       ├── StatsCard.jsx
│   │   │       ├── TaskChart.jsx
│   │   │       └── OverdueTasksList.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── NotFound.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── projectSlice.js
│   │   │   │   ├── taskSlice.js
│   │   │   │   └── uiSlice.js
│   │   │   └── api/
│   │   │       └── apiSlice.js (RTK Query)
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useConfirm.js
│   │   │   └── useToast.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── theme.css (CSS variables for colors)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .gitignore
└── README.md
```

---

## 🔐 Security Implementation

### 1. Password Security
- Hash passwords using bcrypt (salt rounds: 10)
- Never store plain text passwords
- Validate password strength (min 8 chars)

### 2. JWT Authentication
- Access token expiry: 1 hour
- Store JWT in HTTP-only cookies (or Authorization header)
- Verify token on every protected route

### 3. Authorization
- Check user membership in project before access
- Verify role (Admin/Member) for sensitive operations
- Validate user owns resource before modification

### 4. Input Validation
- Validate all inputs using Zod schemas
- Sanitize user inputs
- Prevent SQL injection (Prisma handles this)

### 5. Error Handling
- Don't expose sensitive error details
- Use generic error messages for auth failures
- Log errors server-side only

---

## 🚀 Implementation Steps

### Step 1: Project Setup (30 mins)
1. Initialize Node.js project
2. Install dependencies (express, prisma, bcrypt, jsonwebtoken, zod)
3. Setup Prisma with PostgreSQL
4. Create .env file with DATABASE_URL and JWT_SECRET
5. Initialize Git repository

### Step 2: Database Setup (30 mins)
1. Define Prisma schema
2. Run migrations
3. Test database connection
4. Seed initial data (optional)

### Step 3: Authentication (2 hours)
1. Create User model
2. Implement signup endpoint
3. Implement login endpoint
4. Create JWT utilities
5. Create auth middleware
6. Test auth flow

### Step 4: Projects Module (2 hours)
1. Create Project model
2. Implement CRUD endpoints
3. Add project ownership validation
4. Test all endpoints

### Step 5: Team Management (1.5 hours)
1. Create TeamMembership model
2. Implement add/remove member endpoints
3. Create RBAC middleware
4. Test role-based access

### Step 6: Tasks Module (2 hours)
1. Create Task model
2. Implement CRUD endpoints
3. Add task assignment logic
4. Implement status updates
5. Test all endpoints

### Step 7: Dashboard (1 hour)
1. Create dashboard service
2. Implement aggregation queries
3. Add overdue task detection
4. Test dashboard endpoints

### Step 8: Testing & Bug Fixes (2 hours)
1. Test all API endpoints with Postman/Thunder Client
2. Fix bugs and edge cases
3. Add error handling
4. Validate all business logic

### Step 9: Deployment (1 hour)
1. Create Railway account
2. Setup PostgreSQL database on Railway
3. Deploy backend service
4. Configure environment variables
5. Test live deployment

### Step 10: Frontend Development (6-8 hours)
1. Setup React + Vite + Tailwind
2. Configure Redux Toolkit
3. Create design system (colors, components)
4. Build authentication pages
5. Build dashboard
6. Build projects and tasks pages
7. Implement error handling and confirmations
8. Add animations and polish

### Step 11: CI/CD Setup (1 hour)
1. Create GitHub Actions workflow
2. Setup automated tests
3. Configure Railway deployment
4. Test automated deployment

### Step 12: Documentation (1 hour)
1. Write comprehensive README
2. Document API endpoints
3. Add setup instructions
4. Create demo video (2-5 mins)

**Total Estimated Time: 21-24 hours**

---

## 📝 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="1h"

# Server
PORT=5000
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

### Frontend (.env)
```env
# API URL
VITE_API_URL="http://localhost:5000/api"

# App Config
VITE_APP_NAME="Team Task Manager"
VITE_APP_VERSION="1.0.0"
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] User can signup with valid email/password
- [ ] User cannot signup with duplicate email
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong password
- [ ] JWT token is returned on successful login
- [ ] Protected routes reject requests without token

### Projects
- [ ] User can create a project
- [ ] User can view their projects
- [ ] User cannot view projects they're not member of
- [ ] Admin can update project details
- [ ] Member cannot update project details
- [ ] Admin can delete project

### Teams
- [ ] Admin can add members to project
- [ ] Member cannot add members
- [ ] Admin can remove members
- [ ] Admin can change member roles
- [ ] User can view team members

### Tasks
- [ ] User can create task in their project
- [ ] User can assign task to team member
- [ ] User can update task status
- [ ] User can set due date and priority
- [ ] User can view all project tasks
- [ ] Admin can delete any task
- [ ] Member can delete own tasks only

### Dashboard
- [ ] Dashboard shows user's tasks
- [ ] Statistics are calculated correctly
- [ ] Overdue tasks are identified
- [ ] Tasks are grouped by status

---

## 📦 Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] All API endpoints tested
- [ ] Error handling implemented
- [ ] CORS configured for frontend

### Railway Deployment
- [ ] Create Railway project
- [ ] Add PostgreSQL database
- [ ] Deploy backend service
- [ ] Set environment variables
- [ ] Run database migrations
- [ ] Test live API endpoints
- [ ] Verify HTTPS is working

### Post-deployment
- [ ] Test all features on live URL
- [ ] Check database connections
- [ ] Verify authentication works
- [ ] Test RBAC permissions
- [ ] Monitor for errors

---

## 📚 Submission Requirements

### 1. Live URL
- Deployed application on Railway
- Fully functional API
- All endpoints accessible

### 2. GitHub Repository
- Clean, organized code
- Proper .gitignore (exclude .env, node_modules)
- Meaningful commit messages
- Branch strategy (optional)

### 3. README.md
- Project description
- Features list
- Tech stack
- Setup instructions
- API documentation
- Environment variables guide
- Deployment guide
- Screenshots (optional)

### 4. Demo Video (2-5 mins)
- Show signup/login flow
- Create project and add members
- Create and assign tasks
- Show dashboard
- Demonstrate RBAC (admin vs member)
- Show overdue tasks
- Explain architecture briefly

---

## 🎯 Success Criteria

✅ **Functionality**
- All core features working
- No critical bugs
- Proper error handling

✅ **Code Quality**
- Clean, readable code
- Proper separation of concerns
- Consistent naming conventions

✅ **Security**
- Passwords hashed
- JWT authentication working
- RBAC implemented correctly

✅ **Database**
- Proper relationships
- Data integrity maintained
- Migrations working

✅ **Deployment**
- App is live and accessible
- Database connected
- Environment variables secure

✅ **Documentation**
- Clear README
- API endpoints documented
- Setup instructions complete

---

## 🎨 UI/UX Design System

### Color Palette (CSS Variables)
```css
:root {
  /* Primary Colors */
  --color-primary: #3b82f6;        /* Blue */
  --color-primary-dark: #2563eb;
  --color-primary-light: #60a5fa;
  
  /* Secondary Colors */
  --color-secondary: #8b5cf6;      /* Purple */
  --color-secondary-dark: #7c3aed;
  --color-secondary-light: #a78bfa;
  
  /* Status Colors */
  --color-success: #10b981;        /* Green */
  --color-warning: #f59e0b;        /* Orange */
  --color-error: #ef4444;          /* Red */
  --color-info: #06b6d4;           /* Cyan */
  
  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* Background */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  
  /* Text */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  
  /* Borders */
  --border-color: #e5e7eb;
  --border-radius: 0.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}

/* Dark Mode Support (Optional) */
[data-theme="dark"] {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-tertiary: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-tertiary: #9ca3af;
  --border-color: #374151;
}
```

### Reusable CSS Classes
```css
/* Buttons */
.btn-primary { background: var(--color-primary); }
.btn-secondary { background: var(--color-secondary); }
.btn-success { background: var(--color-success); }
.btn-danger { background: var(--color-error); }

/* Cards */
.card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

/* Animations */
.fade-in { animation: fadeIn var(--transition-normal); }
.slide-up { animation: slideUp var(--transition-normal); }
.scale-in { animation: scaleIn var(--transition-fast); }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### Component Guidelines

#### 1. Error Message Component
```jsx
// Generic reusable error component
<ErrorMessage 
  type="error" // error, warning, info, success
  title="Operation Failed"
  message="Unable to delete task. Please try again."
  action={<Button>Retry</Button>}
/>
```

#### 2. Confirmation Dialog
```jsx
// With "Don't ask again" option
<ConfirmDialog
  title="Delete Task?"
  message="This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  showDontAskAgain={true}
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

#### 3. Icons Library
- Use **Lucide React** for consistent icons
- Common icons: Trash2, Edit, Plus, Check, X, AlertCircle, Info, User, Settings

#### 4. Animations
- Page transitions: Fade in
- Modal open/close: Scale in/out
- List items: Slide up
- Hover effects: Scale 1.05
- Loading states: Pulse/Spin

---

## 🗑️ Soft Delete Strategy

### Implementation Rules

#### 1. Projects
- Set `status = 'INACTIVE'` instead of deleting
- Keep all related data intact
- Filter out inactive projects in queries
- Admin can reactivate if needed

#### 2. Team Members
- Set `status = 'INACTIVE'` in team_memberships
- Record `removed_at` timestamp
- Member loses access but history preserved
- Can be re-added later

#### 3. Tasks
- Set `is_deleted = true`
- Record `deleted_at` and `deleted_by`
- Show confirmation dialog before deletion
- Option: "Don't ask me again" (store in localStorage)
- Deleted tasks hidden from normal views
- Admin can view deleted tasks in archive

#### 4. Users
- Set `status = 'INACTIVE'` for deactivated accounts
- User cannot login but data preserved
- All user's projects/tasks remain accessible to team

### Confirmation Dialog Settings
```javascript
// Store user preference in localStorage
const deletePreferences = {
  tasks: { skipConfirm: false },
  projects: { skipConfirm: false },
  members: { skipConfirm: false }
};

// Check before showing dialog
if (!deletePreferences.tasks.skipConfirm) {
  showConfirmDialog();
} else {
  performDelete();
}
```

### Query Filters
```javascript
// Always filter out soft-deleted items
const activeTasks = await prisma.task.findMany({
  where: {
    is_deleted: false,
    project: { status: 'ACTIVE' }
  }
});

const activeMembers = await prisma.teamMembership.findMany({
  where: {
    status: 'ACTIVE',
    project: { status: 'ACTIVE' },
    user: { status: 'ACTIVE' }
  }
});
```

---

## 🚨 Common Pitfalls to Avoid

1. **Don't skip validation** - Always validate inputs
2. **Don't expose sensitive data** - Never send password_hash in responses
3. **Don't forget error handling** - Handle all edge cases
4. **Don't hardcode secrets** - Use environment variables
5. **Don't skip RBAC checks** - Always verify permissions
6. **Don't forget CORS** - Configure for frontend access
7. **Don't skip database indexes** - Add indexes for foreign keys
8. **Don't forget migrations** - Always run migrations on deployment
9. **Don't hard delete data** - Always use soft delete strategy
10. **Don't forget to filter inactive records** - Always check status fields

---

## 📞 Quick Reference

### Prisma Commands
```bash
npx prisma init                 # Initialize Prisma
npx prisma migrate dev          # Create and run migration
npx prisma generate             # Generate Prisma Client
npx prisma studio               # Open Prisma Studio (DB GUI)
```

### Git Commands
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

### Railway CLI
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

---

## 🎓 Learning Resources

- **Prisma Docs:** https://www.prisma.io/docs
- **Express.js Guide:** https://expressjs.com/en/guide/routing.html
- **JWT.io:** https://jwt.io/introduction
- **Railway Docs:** https://docs.railway.app
- **REST API Best Practices:** https://restfulapi.net

---

## ✅ Ready to Start!

Follow the implementation steps in order. Start with Step 1 and work your way through. Good luck! 🚀

**Next Action:** Run `npm init` and start setting up the project structure.
