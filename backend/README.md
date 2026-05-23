# Team Task Manager - Backend

Backend API for Team Task Manager application built with Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Setup database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

4. Start development server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client setup
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Auth, RBAC, validation
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Helper functions
│   ├── validators/            # Zod schemas
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── .env                       # Environment variables
├── .env.example               # Environment template
└── package.json
```

## 🔑 Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/team_task_manager"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all user's projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Soft delete project

### Teams
- `GET /api/projects/:id/members` - Get project members
- `POST /api/projects/:id/members` - Add member
- `PATCH /api/projects/:id/members/:userId` - Deactivate member
- `PUT /api/projects/:id/members/:userId` - Update member role

### Tasks
- `GET /api/projects/:id/tasks` - Get project tasks
- `POST /api/projects/:id/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Soft delete task
- `PATCH /api/tasks/:id/status` - Update task status

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/overdue` - Get overdue tasks

## 🛠️ Scripts

```bash
npm run dev              # Start development server with nodemon
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:push      # Push schema to database (no migration)
```

## 🔐 Authentication

API uses JWT (JSON Web Tokens) for authentication.

Include token in requests:
```
Authorization: Bearer <your-token>
```

## 📝 Database Schema

- **users** - User accounts with status (ACTIVE/INACTIVE)
- **projects** - Projects with soft delete support
- **team_memberships** - Project members with roles (ADMIN/MEMBER)
- **tasks** - Tasks with soft delete and assignment tracking

## 🚨 Error Handling

All errors return JSON:
```json
{
  "success": false,
  "error": "Error message"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## 📦 Dependencies

- **express** - Web framework
- **@prisma/client** - Database ORM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **zod** - Schema validation
- **cors** - CORS middleware
- **dotenv** - Environment variables

## 🧪 Testing

(To be implemented)

## 🚀 Deployment

See main README for Railway deployment instructions.

## 📄 License

MIT
