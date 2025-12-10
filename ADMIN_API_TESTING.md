# Admin API Testing Guide

This guide shows how to test the admin API endpoints using curl or Postman.

## Prerequisites

1. Your MindCare AI app is running on `http://localhost:3000`
2. You have admin credentials (email & password)
3. You're authenticated as an admin user

## Authentication

First, log in to get the admin session:

```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

This will return:
```json
{
  "id": 4,
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "role": "admin",
  "phone": "+1 (555) 456-7890",
  "specialization": null,
  "bio": null,
  "isActive": true,
  "lastLogin": "2024-01-20T15:30:00Z",
  "createdAt": "2024-01-01T08:00:00Z",
  "updatedAt": "2024-01-20T15:30:00Z"
}
```

Then ensure you have the session cookie set when making admin API calls.

## API Endpoints

### 1. Get All Users

```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Cookie: user-data={...}; next-auth.session-token=session"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Patient",
    "email": "patient@example.com",
    "role": "patient",
    "phone": "+1 (555) 123-4567",
    "specialization": null,
    "bio": null,
    "isActive": true,
    "createdAt": "2024-01-01T08:00:00Z",
    "updatedAt": "2024-01-01T08:00:00Z"
  },
  {
    "id": 2,
    "firstName": "Dr. Sarah",
    "lastName": "Researcher",
    "email": "researcher@example.com",
    "role": "researcher",
    "phone": "+1 (555) 234-5678",
    "specialization": "Psychology & Neuroscience",
    "bio": null,
    "isActive": true,
    "createdAt": "2024-01-01T08:00:00Z",
    "updatedAt": "2024-01-01T08:00:00Z"
  }
]
```

### 2. Get Users by Role

```bash
# Get all patients
curl -X GET "http://localhost:3000/api/admin/users?role=patient" \
  -H "Cookie: user-data={...}; next-auth.session-token=session"

# Get all researchers
curl -X GET "http://localhost:3000/api/admin/users?role=researcher" \
  -H "Cookie: user-data={...}; next-auth.session-token=session"

# Get all data scientists
curl -X GET "http://localhost:3000/api/admin/users?role=data-scientist" \
  -H "Cookie: user-data={...}; next-auth.session-token=session"

# Get all psychiatrists
curl -X GET "http://localhost:3000/api/admin/users?role=psychiatrist" \
  -H "Cookie: user-data={...}; next-auth.session-token=session"
```

### 3. Get Specific User by ID

```bash
curl -X GET "http://localhost:3000/api/admin/users?id=1" \
  -H "Cookie: user-data={...}; next-auth.session-token=session"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Patient",
    "email": "patient@example.com",
    "role": "patient",
    "phone": "+1 (555) 123-4567",
    "specialization": null,
    "bio": null,
    "isActive": true,
    "createdAt": "2024-01-01T08:00:00Z",
    "updatedAt": "2024-01-01T08:00:00Z"
  }
]
```

### 4. Create New Patient

```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: user-data={...}; next-auth.session-token=session" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@example.com",
    "password": "securePassword123",
    "role": "patient",
    "phone": "+1 (555) 111-2222",
    "bio": "New patient from admin panel"
  }'
```

**Response (201 Created):**
```json
{
  "id": 5,
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@example.com",
  "role": "patient",
  "phone": "+1 (555) 111-2222",
  "specialization": null,
  "bio": "New patient from admin panel",
  "isActive": true,
  "createdAt": "2024-01-20T16:45:30Z",
  "updatedAt": "2024-01-20T16:45:30Z"
}
```

### 5. Create New Researcher

```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: user-data={...}; next-auth.session-token=session" \
  -d '{
    "firstName": "Dr. Michael",
    "lastName": "Davis",
    "email": "michael.davis@example.com",
    "password": "securePassword123",
    "role": "researcher",
    "phone": "+1 (555) 222-3333",
    "specialization": "Behavioral Psychology",
    "bio": "Senior researcher in behavioral studies"
  }'
```

### 6. Create New Data Scientist

```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: user-data={...}; next-auth.session-token=session" \
  -d '{
    "firstName": "Emily",
    "lastName": "Chen",
    "email": "emily.chen@example.com",
    "password": "securePassword123",
    "role": "data-scientist",
    "phone": "+1 (555) 333-4444",
    "specialization": "Machine Learning & Analytics",
    "bio": "ML specialist for mental health insights"
  }'
```

### 7. Create New Psychiatrist

```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: user-data={...}; next-auth.session-token=session" \
  -d '{
    "firstName": "Dr. James",
    "lastName": "Wilson",
    "email": "james.wilson@example.com",
    "password": "securePassword123",
    "role": "psychiatrist",
    "phone": "+1 (555) 444-5555",
    "bio": "Licensed psychiatrist with 15 years experience"
  }'
```

### 8. Update User Information

```bash
# Update patient profile
curl -X PUT "http://localhost:3000/api/admin/users?id=1" \
  -H "Content-Type: application/json" \
  -H "Cookie: user-data={...}; next-auth.session-token=session" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1 (555) 999-8888",
    "bio": "Updated bio information"
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Smith",
  "email": "patient@example.com",
  "role": "patient",
  "phone": "+1 (555) 999-8888",
  "specialization": null,
  "bio": "Updated bio information",
  "isActive": true,
  "createdAt": "2024-01-01T08:00:00Z",
  "updatedAt": "2024-01-20T17:00:00Z"
}
```

### 9. Update User Password

```bash
curl -X PUT "http://localhost:3000/api/admin/users?id=1" \
  -H "Content-Type: application/json" \
  -H "Cookie: user-data={...}; next-auth.session-token=session" \
  -d '{
    "password": "newSecurePassword456"
  }'
```

### 10. Delete User (Soft Delete)

```bash
curl -X DELETE "http://localhost:3000/api/admin/users?id=5" \
  -H "Content-Type: application/json" \
  -H "Cookie: user-data={...}; next-auth.session-token=session"
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

## Error Responses

### Unauthorized (Not Admin)
```
Status: 403 Forbidden

{
  "error": "Unauthorized: Admin access required"
}
```

### User Not Found
```
Status: 404 Not Found

{
  "error": "User not found"
}
```

### Email Already Exists
```
Status: 400 Bad Request

{
  "error": "Email already exists"
}
```

### Missing Required Fields
```
Status: 400 Bad Request

{
  "error": "firstName, lastName, email, password, and role are required"
}
```

### Database Connection Error
```
Status: 503 Service Unavailable

{
  "error": "Database not initialized"
}
```

## Testing with Postman

1. **Create a new Postman Collection** named "Admin API"

2. **Add Login Request:**
   - Method: POST
   - URL: http://localhost:3000/api/auth/login
   - Body (JSON):
     ```json
     {
       "email": "admin@example.com",
       "password": "password123"
     }
     ```
   - Save the response token in an environment variable

3. **Add Get Users Request:**
   - Method: GET
   - URL: http://localhost:3000/api/admin/users
   - Add session cookies in Headers

4. **Add Create User Request:**
   - Method: POST
   - URL: http://localhost:3000/api/admin/users
   - Headers: Content-Type: application/json
   - Body: (see examples above)

5. **Add Update User Request:**
   - Method: PUT
   - URL: http://localhost:3000/api/admin/users?id=1
   - Headers: Content-Type: application/json
   - Body: (see examples above)

6. **Add Delete User Request:**
   - Method: DELETE
   - URL: http://localhost:3000/api/admin/users?id=5
   - Headers: Content-Type: application/json

## Sample cURL Script for Batch Testing

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

echo "🔐 Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "admin@example.com"; then
  echo -e "${GREEN}✓ Login successful${NC}"
else
  echo -e "${RED}✗ Login failed${NC}"
  exit 1
fi

echo -e "\n👥 Fetching all users..."
curl -s -X GET $BASE_URL/admin/users | jq '.'

echo -e "\n👨 Creating new patient..."
curl -s -X POST $BASE_URL/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Patient",
    "email": "test.patient@example.com",
    "password": "password123",
    "role": "patient"
  }' | jq '.'

echo -e "\n✨ Admin API testing complete!"
```

## Notes

- Replace `{...}` in Cookie headers with your actual session token
- All passwords are hashed with bcrypt before storage
- Email addresses must be unique in the system
- Deleted users are marked as `isActive: false` (soft delete)
- All timestamps are in ISO 8601 format (UTC)
- Responses exclude the password field for security
