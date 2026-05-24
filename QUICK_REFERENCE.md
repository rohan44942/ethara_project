# 🚀 Quick Reference - Development Workflow

## 📦 Installation (One-time setup)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start server
npm run dev
```

## 🔄 Daily Development Workflow

```bash
# Start backend server
cd backend
npm run dev

# In another terminal - Start frontend (when ready)
cd frontend
npm run dev
```

## 🗄️ Database Commands

```bash
# Open database GUI
npm run prisma:studio

# Create new migration after schema changes
npm run prisma:migrate

# Reset database (deletes all data!)
npx prisma migrate reset

# Push schema without migration (dev only)
npm run prisma:push
```

## 🧪 Testing Endpoints

### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (replace TOKEN)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Thunder Client / Postman

1. Install Thunder Client extension in VS Code
2. Create new request
3. Set method (GET, POST, etc.)
4. Set URL: `http://localhost:5000/api/...`
5. Add headers: `Authorization: Bearer <token>`
6. Add body (for POST/PUT): JSON format

## 📁 File Locations

```
Backend:
- Routes: backend/src/routes/
- Controllers: backend/src/controllers/
- Services: backend/src/services/
- Middleware: backend/src/middleware/
- Validators: backend/src/validators/
- Database: backend/prisma/schema.prisma
- Config: backend/.env

Frontend (when created):
- Components: frontend/src/components/
- Pages: frontend/src/pages/
- Store: frontend/src/store/
- Styles: frontend/src/styles/
```

## 🔑 Environment Variables

```env
# Backend (.env)
DATABASE_URL="postgresql://..."
JWT_SECRET="random-secret-key"
JWT_EXPIRES_IN="1h"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

# Frontend (.env)
VITE_API_URL="http://localhost:5000/api"
```

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in .env or kill process |
| Cannot find @prisma/client | Run `npm run prisma:generate` |
| Database connection failed | Check DATABASE_URL in .env |
| Migration failed | Run `npx prisma migrate reset` |
| Module not found | Run `npm install` |
| CORS error | Check FRONTEND_URL in backend .env |

## 📊 Project Status Tracking

### Phase 1: Setup ✅
- [x] Project structure
- [x] Dependencies
- [x] Database schema
- [x] Middleware
- [x] Basic server setup

### Phase 2: Authentication (Next)
- [ ] Signup endpoint
- [ ] Login endpoint
- [ ] JWT implementation
- [ ] Auth validators

### Phase 3: Projects
- [ ] CRUD operations
- [ ] Access control
- [ ] Soft delete

### Phase 4: Teams
- [ ] Add/remove members
- [ ] Role management
- [ ] RBAC

### Phase 5: Tasks
- [ ] CRUD operations
- [ ] Assignment
- [ ] Status updates
- [ ] Soft delete

### Phase 6: Dashboard
- [ ] Statistics
- [ ] Overdue tasks
- [ ] Aggregations

### Phase 7: Frontend
- [ ] React setup
- [ ] Redux store
- [ ] Components
- [ ] Pages

### Phase 8: Deployment
- [ ] Railway setup
- [ ] CI/CD pipeline
- [ ] Environment config

## 🎯 Current Focus

**Step 2: Authentication Module**

Files to create:
1. `backend/src/validators/authValidator.js`
2. `backend/src/services/authService.js`
3. `backend/src/controllers/authController.js`
4. Update `backend/src/routes/authRoutes.js`

## 💡 Tips

- Always run `npm run prisma:generate` after schema changes
- Use Prisma Studio to view/edit database data
- Test endpoints with Thunder Client or Postman
- Check server logs for errors
- Use `console.log()` for debugging
- Commit code frequently to Git

## 🔗 Useful Links

- Prisma Docs: https://www.prisma.io/docs
- Express Docs: https://expressjs.com
- Zod Docs: https://zod.dev
- JWT.io: https://jwt.io
- Railway Docs: https://docs.railway.app

## 📞 Next Steps

Ready to implement authentication? Run:
```bash
cd backend
npm run dev
```

Then let me know to proceed with Step 3: Authentication Implementation!
