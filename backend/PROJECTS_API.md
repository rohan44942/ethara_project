# Projects API Documentation

## Base URL
```
http://localhost:5000/api/projects
```

**Note:** All endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <your-token>
```

---

## 1. Create Project

### Request
```bash
POST /api/projects
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "My Project",
  "description": "Project description (optional)"
}
```

### cURL Command
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

### Response (201 Created)
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "project": {
      "id": "uuid",
      "name": "My Project",
      "description": "Project description",
      "status": "ACTIVE",
      "createdBy": "user-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "creator": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

### Features
- ✅ Automatically adds creator as ADMIN member
- ✅ Validates name (3-100 characters)
- ✅ Description is optional (max 500 characters)

---

## 2. Get All Projects

### Request
```bash
GET /api/projects
Authorization: Bearer <token>
```

### cURL Command
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "My Project",
        "description": "Project description",
        "status": "ACTIVE",
        "createdBy": "user-uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "creator": {
          "id": "user-uuid",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "members": [
          {
            "id": "membership-uuid",
            "role": "ADMIN",
            "user": {
              "id": "user-uuid",
              "name": "John Doe",
              "email": "john@example.com"
            }
          }
        ],
        "_count": {
          "tasks": 5,
          "members": 3
        }
      }
    ],
    "count": 1
  }
}
```

### Features
- ✅ Returns only ACTIVE projects
- ✅ Only projects where user is ACTIVE member
- ✅ Includes member count and task count
- ✅ Ordered by creation date (newest first)

---

## 3. Get Project By ID

### Request
```bash
GET /api/projects/:id
Authorization: Bearer <token>
```

### cURL Command
```bash
curl -X GET http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "uuid",
      "name": "My Project",
      "description": "Project description",
      "status": "ACTIVE",
      "createdBy": "user-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "creator": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "members": [
        {
          "id": "membership-uuid",
          "projectId": "project-uuid",
          "userId": "user-uuid",
          "role": "ADMIN",
          "status": "ACTIVE",
          "joinedAt": "2024-01-01T00:00:00.000Z",
          "user": {
            "id": "user-uuid",
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
      ],
      "tasks": [
        {
          "id": "task-uuid",
          "title": "Task 1",
          "description": "Task description",
          "status": "TODO",
          "priority": "MEDIUM",
          "dueDate": "2024-01-10T00:00:00.000Z",
          "assignee": {
            "id": "user-uuid",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "creator": {
            "id": "user-uuid",
            "name": "John Doe"
          }
        }
      ]
    },
    "userRole": "ADMIN"
  }
}
```

### Features
- ✅ Returns full project details with members and tasks
- ✅ Includes user's role in the project
- ✅ Only accessible to project members
- ✅ Excludes deleted tasks

### Error Cases

**Not a Member (403)**
```json
{
  "success": false,
  "error": "Access denied. You are not a member of this project"
}
```

**Project Not Found (404)**
```json
{
  "success": false,
  "error": "Project not found"
}
```

**Inactive Project (403)**
```json
{
  "success": false,
  "error": "Project is inactive"
}
```

---

## 4. Update Project

### Request
```bash
PUT /api/projects/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "ACTIVE"
}
```

### cURL Command
```bash
curl -X PUT http://localhost:5000/api/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description"
  }'
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "project": {
      "id": "uuid",
      "name": "Updated Project Name",
      "description": "Updated description",
      "status": "ACTIVE",
      "createdBy": "user-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z",
      "creator": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "_count": {
        "tasks": 5,
        "members": 3
      }
    }
  }
}
```

### Features
- ✅ **Admin only** - Requires ADMIN role
- ✅ All fields are optional
- ✅ Can update name, description, or status
- ✅ Validates input data

### Error Cases

**Not Admin (403)**
```json
{
  "success": false,
  "error": "Access denied. Admin privileges required"
}
```

---

## 5. Delete Project (Soft Delete)

### Request
```bash
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### cURL Command
```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {
    "project": {
      "id": "uuid",
      "name": "My Project",
      "description": "Project description",
      "status": "INACTIVE",
      "createdBy": "user-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z",
      "creator": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

### Features
- ✅ **Soft delete** - Sets status to INACTIVE
- ✅ **Admin only** - Requires ADMIN role
- ✅ Data is preserved, not permanently deleted
- ✅ Project won't appear in user's project list

### Error Cases

**Not Admin (403)**
```json
{
  "success": false,
  "error": "Access denied. Admin privileges required"
}
```

---

## Validation Rules

### Project Name
- Required for creation
- 3-100 characters
- Trimmed of whitespace

### Description
- Optional
- Max 500 characters
- Trimmed of whitespace
- Can be null

### Status
- Must be "ACTIVE" or "INACTIVE"
- Only updatable by admin

---

## Access Control

### Public (Authenticated)
- Create project
- Get all user's projects

### Member Access
- View project details
- View tasks and members

### Admin Access
- Update project
- Delete project (soft delete)
- Add/remove members
- Change member roles

---

## Testing Workflow

### 1. Login
```bash
POST /api/auth/login
# Save the token
```

### 2. Create Project
```bash
POST /api/projects
# You become ADMIN automatically
# Save project ID
```

### 3. Get All Projects
```bash
GET /api/projects
# Should see your created project
```

### 4. Get Project Details
```bash
GET /api/projects/:id
# See full details with members and tasks
```

### 5. Update Project
```bash
PUT /api/projects/:id
# Update name or description
```

### 6. Delete Project
```bash
DELETE /api/projects/:id
# Soft delete (status = INACTIVE)
```

### 7. Verify Deletion
```bash
GET /api/projects
# Deleted project won't appear
```

---

## Next Steps

After testing projects:
1. ✅ Create a project
2. ✅ View project details
3. ✅ Update project
4. ✅ Soft delete project

Then we'll move to **Team Management Module**!
