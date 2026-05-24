# Authentication API Tests

## Base URL
```
http://localhost:5000/api
```

## 1. Signup (Register New User)

### Request
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### cURL Command
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Expected Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john@example.com",
      "name": "John Doe",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Cases

**Duplicate Email (400)**
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

**Validation Error (400)**
```json
{
  "success": false,
  "error": "body.email: Invalid email format"
}
```

---

## 2. Login

### Request
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### cURL Command
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john@example.com",
      "name": "John Doe",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Cases

**Invalid Credentials (401)**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Inactive Account (401)**
```json
{
  "success": false,
  "error": "Account is inactive. Please contact support"
}
```

---

## 3. Get Current User (Protected)

### Request
```bash
GET /api/auth/me
Authorization: Bearer <your-token-here>
```

### cURL Command
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john@example.com",
      "name": "John Doe",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Error Cases

**No Token (401)**
```json
{
  "success": false,
  "error": "No token provided"
}
```

**Invalid Token (401)**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**User Not Found (401)**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

## Testing Workflow

### Step 1: Signup
1. Send POST request to `/api/auth/signup`
2. Save the returned `token`

### Step 2: Login
1. Send POST request to `/api/auth/login`
2. Verify you get the same user data
3. Save the new `token`

### Step 3: Get Current User
1. Send GET request to `/api/auth/me`
2. Include token in Authorization header
3. Verify user data is returned

---

## Thunder Client / Postman Collection

### 1. Create New Request - Signup
- Method: POST
- URL: `http://localhost:5000/api/auth/signup`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

### 2. Create New Request - Login
- Method: POST
- URL: `http://localhost:5000/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Create New Request - Get Me
- Method: GET
- URL: `http://localhost:5000/api/auth/me`
- Headers: 
  - `Authorization: Bearer <paste-token-here>`

---

## Validation Rules

### Email
- Required
- Must be valid email format
- Converted to lowercase
- Must be unique

### Password
- Required
- Minimum 8 characters
- Maximum 100 characters
- Hashed with bcrypt (10 salt rounds)

### Name
- Required
- Minimum 2 characters
- Maximum 100 characters
- Trimmed of whitespace

---

## Security Features

✅ Passwords are hashed with bcrypt
✅ JWT tokens expire in 1 hour
✅ Email is case-insensitive
✅ User status checked on login
✅ Token verified on protected routes
✅ Password never returned in responses

---

## Next Steps

After testing authentication:
1. ✅ Verify signup creates user in database
2. ✅ Verify login returns valid token
3. ✅ Verify protected route requires token
4. ✅ Check Prisma Studio to see created users

Then we'll move to **Projects Module**!
