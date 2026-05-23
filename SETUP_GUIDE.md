# 🚀 Setup Instructions - Phase 1 Complete

## ✅ What's Been Created

### Backend Structure
```
backend/
├── prisma/
│   └── schema.prisma          ✅ Database schema with soft delete
├── src/
│   ├── config/
│   │   └── database.js        ✅ Prisma client configuration
│   ├── middleware/
│   │   ├── authMiddleware.js  ✅ JWT authentication
│   │   ├── rbacMiddleware.js  ✅ Role-based access control
│   │   └── validationMiddleware.js ✅ Zod validation
│   ├── routes/
│   │   ├── authRoutes.js      ✅ Placeholder
│   │   ├── projectRoutes.js   ✅ Placeholder
│   │   ├── teamRoutes.js      ✅ Placeholder
│   │   ├── taskRoutes.js      ✅ Placeholder
│   │   └── dashboardRoutes.js ✅ Placeholder
│   ├── utils/
│   │   ├── jwtUtils.js        ✅ JWT helper functions
│   │   └── errorHandler.js    ✅ Error handling
│   ├── app.js                 ✅ Express app setup
│   └── server.js              ✅ Server entry point
├── .env                       ✅ Environment variables
├── .env.example               ✅ Environment template
├── .gitignore                 ✅ Git ignore rules
├── package.json               ✅ Dependencies
└── README.md                  ✅ Documentation
```

## 📦 Next Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- express (Web framework)
- @prisma/client (Database ORM)
- prisma (Dev dependency)
- bcrypt (Password hashing)
- jsonwebtoken (JWT auth)
- zod (Validation)
- cors (CORS middleware)
- dotenv (Environment variables)
- nodemon (Dev server)

### Step 2: Setup PostgreSQL Database

**Option A: Local PostgreSQL**
1. Install PostgreSQL on your machine
2. Create database:
```sql
CREATE DATABASE team_task_manager;
```
3. Update `.env` file with your credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/team_task_manager?schema=public"
```

**Option B: Railway (Recommended for deployment)**
1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL database
4. Copy connection string to `.env`

**Option C: Free PostgreSQL Services**
- Supabase: https://supabase.com
- Neon: https://neon.tech
- ElephantSQL: https://www.elephantsql.com

### Step 3: Generate Prisma Client & Run Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migration
npm run prisma:migrate

# When prompted, name your migration (e.g., "init")
```

### Step 4: Update JWT Secret

Edit `.env` file and change JWT_SECRET to a secure random string:
```env
JWT_SECRET="your-super-secret-random-string-here-change-this"
```

Generate a secure secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Start Development Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
📝 Environment: development
🌐 API: http://localhost:5000/api
```

### Step 6: Test Health Check

Open browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🎯 What's Next?

Now we'll implement the actual functionality in this order:

1. **Authentication Module** (Step 3)
   - Signup endpoint
   - Login endpoint
   - Get current user endpoint
   - Validators

2. **Projects Module** (Step 4)
   - CRUD operations
   - Soft delete
   - Access control

3. **Team Management** (Step 5)
   - Add/remove members
   - Role management
   - RBAC implementation

4. **Tasks Module** (Step 6)
   - CRUD operations
   - Assignment logic
   - Status updates
   - Soft delete with confirmation

5. **Dashboard** (Step 7)
   - Statistics
   - Overdue tasks
   - Aggregations

## 🔍 Verify Setup

Run these checks:

### 1. Check Node.js version
```bash
node --version
# Should be v18 or higher
```

### 2. Check PostgreSQL connection
```bash
npm run prisma:studio
# Should open Prisma Studio in browser
```

### 3. Check environment variables
```bash
# Make sure .env file exists and has all required variables
cat .env
```

### 4. Check Prisma Client
```bash
npm run prisma:generate
# Should generate client without errors
```

## 🐛 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```bash
npm run prisma:generate
```

### Issue: "Database connection failed"
**Solution:**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Test connection with Prisma Studio

### Issue: "Port 5000 already in use"
**Solution:**
- Change PORT in .env to another port (e.g., 5001)
- Or kill the process using port 5000

### Issue: Migration fails
**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema without migration
npm run prisma:push
```

## 📚 Useful Commands

```bash
# View database in GUI
npm run prisma:studio

# Format Prisma schema
npx prisma format

# Check Prisma schema for errors
npx prisma validate

# View migration status
npx prisma migrate status

# Create migration without applying
npx prisma migrate dev --create-only

# Apply pending migrations
npx prisma migrate deploy
```

## ✅ Checklist

Before moving to next phase:

- [ ] Dependencies installed successfully
- [ ] PostgreSQL database created
- [ ] .env file configured
- [ ] Prisma Client generated
- [ ] Migrations run successfully
- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] Prisma Studio opens successfully

## 🎉 Ready!

Once all checks pass, you're ready to implement the authentication module!

Let me know when you're ready to proceed with **Step 3: Authentication Implementation**.
