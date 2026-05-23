# 🚀 Team Task Manager

A full-stack web application for team collaboration with project management, task assignment, and role-based access control.

## 📋 Features

- ✅ **Authentication** - Secure signup/login with JWT
- ✅ **Project Management** - Create and manage projects
- ✅ **Team Collaboration** - Add members with role-based access (Admin/Member)
- ✅ **Task Management** - Create, assign, and track tasks
- ✅ **Dashboard** - Overview of tasks, statistics, and overdue items
- ✅ **Soft Delete** - Safe deletion with recovery options
- ✅ **Role-Based Access Control** - Project-level permissions

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Validation:** Zod

### Frontend
- **Framework:** React + Vite
- **State Management:** Redux Toolkit + RTK Query
- **UI Library:** shadcn/ui + Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Deployment
- **Platform:** Railway
- **CI/CD:** GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm or yarn

### Installation

1. **Clone repository**
```bash
git clone <your-repo-url>
cd assignment
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

3. **Setup Frontend** (Coming soon)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📁 Project Structure

```
team-task-manager/
├── backend/                    # Node.js + Express API
│   ├── prisma/                # Database schema
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, RBAC, validation
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   └── validators/        # Zod schemas
│   └── package.json
├── frontend/                   # React + Vite (Coming soon)
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store
│   │   └── styles/            # CSS & themes
│   └── package.json
├── .github/workflows/          # CI/CD pipelines
├── PROJECT_PLAN.md            # Detailed implementation plan
├── SETUP_GUIDE.md             # Setup instructions
└── README.md                  # This file
```

## 🗄️ Database Schema

### Users
- Email/password authentication
- Status: ACTIVE/INACTIVE
- Soft delete support

### Projects
- Name, description
- Created by user
- Status: ACTIVE/INACTIVE

### Team Memberships
- User-Project relationship
- Roles: ADMIN/MEMBER
- Status: ACTIVE/INACTIVE

### Tasks
- Title, description, status, priority
- Assigned to user
- Due date tracking
- Soft delete with audit trail

## 🛣️ API Endpoints

### Authentication
```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user
```

### Projects
```
GET    /api/projects             - Get all user's projects
POST   /api/projects             - Create project
GET    /api/projects/:id         - Get project details
PUT    /api/projects/:id         - Update project
DELETE /api/projects/:id         - Soft delete project
```

### Teams
```
GET    /api/projects/:id/members           - Get members
POST   /api/projects/:id/members           - Add member
PATCH  /api/projects/:id/members/:userId   - Deactivate member
PUT    /api/projects/:id/members/:userId   - Update role
```

### Tasks
```
GET    /api/projects/:id/tasks   - Get project tasks
POST   /api/projects/:id/tasks   - Create task
GET    /api/tasks/:id            - Get task details
PUT    /api/tasks/:id            - Update task
DELETE /api/tasks/:id            - Soft delete task
PATCH  /api/tasks/:id/status     - Update status
```

### Dashboard
```
GET    /api/dashboard            - Get dashboard data
GET    /api/dashboard/stats      - Get statistics
GET    /api/dashboard/overdue    - Get overdue tasks
```

## 🔐 Authentication

API uses JWT (JSON Web Tokens). Include token in requests:

```
Authorization: Bearer <your-token>
```

## 🎨 Design System

### Color Palette
- **Primary:** Blue (#3b82f6)
- **Secondary:** Purple (#8b5cf6)
- **Success:** Green (#10b981)
- **Warning:** Orange (#f59e0b)
- **Error:** Red (#ef4444)

### Components
- Reusable UI components
- Consistent styling with CSS variables
- Smooth animations with Framer Motion
- Responsive design

## 🧪 Testing

```bash
# Backend tests (Coming soon)
cd backend
npm test

# Frontend tests (Coming soon)
cd frontend
npm test
```

## 🚀 Deployment

### Railway Deployment

1. **Create Railway account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Setup Database**
   - Create new project
   - Add PostgreSQL database
   - Copy DATABASE_URL

3. **Deploy Backend**
   - Connect GitHub repository
   - Set environment variables
   - Deploy service

4. **Deploy Frontend**
   - Add new service
   - Set VITE_API_URL
   - Deploy

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

## 📝 Environment Variables

### Backend
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"
PORT=5000
NODE_ENV="production"
FRONTEND_URL="https://your-frontend-url.com"
```

### Frontend
```env
VITE_API_URL="https://your-api-url.com/api"
```

## 📚 Documentation

- [PROJECT_PLAN.md](PROJECT_PLAN.md) - Complete implementation plan
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick command reference
- [backend/README.md](backend/README.md) - Backend documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- Prisma for excellent ORM
- Express.js for robust backend framework
- React team for amazing frontend library
- Railway for easy deployment

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: your-email@example.com

## 🎯 Project Status

### ✅ Completed
- [x] Project structure setup
- [x] Database schema design
- [x] Middleware implementation
- [x] Basic server configuration

### 🚧 In Progress
- [ ] Authentication module
- [ ] Projects CRUD
- [ ] Team management
- [ ] Tasks module
- [ ] Dashboard
- [ ] Frontend development

### 📅 Planned
- [ ] CI/CD pipeline
- [ ] Automated tests
- [ ] Railway deployment
- [ ] Demo video
- [ ] Documentation

## 🔗 Links

- **Live Demo:** Coming soon
- **API Documentation:** Coming soon
- **GitHub Repository:** Your repo URL
- **Demo Video:** Coming soon

---

Made with ❤️ for team collaboration
