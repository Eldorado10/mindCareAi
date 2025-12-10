# Admin Panel Database Integration Guide

## Overview
The Admin Panel is fully integrated with MySQL database using Sequelize ORM. This guide provides detailed instructions for setting up and testing the database integration.

## Database Configuration

### Current Setup
- **Database Engine**: MySQL
- **ORM**: Sequelize
- **Connection Pool**: Limited to prevent dev connection issues
- **Soft Deletes**: Users are marked inactive instead of deleted

### Environment Variables (.env.local)
```
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=mindcare_db
DATABASE_PORT=3306
```

## Database Initialization

### Step 1: Create Database
```bash
# Open MySQL client
mysql -u root

# Create database
CREATE DATABASE mindcare_db;
```

### Step 2: Initialize Tables
```bash
# Run from project root
node lib/initDb.js
```

This creates:
- `users` table with all user types (admin, patient, researcher, data-scientist, psychiatrist)
- `psychiatrists` table
- `resources` table
- `bookings` table

### Step 3: Verify in PhpMyAdmin
Visit: http://localhost:3001/phpmyadmin/index.php?route=/database/structure&db=mindcare_db

You should see:
- `users` table with columns: id, firstName, lastName, email, password, role, phone, specialization, bio, isActive, lastLogin, createdAt, updatedAt
- Other related tables

## API Endpoints

### Authentication Required
All admin endpoints require admin role verified from cookies.

### GET - Fetch Users
```bash
# Get all users of a specific role
curl -b "user-data={\"id\":1,\"role\":\"admin\"}" \
  http://localhost:3000/api/admin/users?role=patient

# Get specific user by ID
curl -b "user-data={\"id\":1,\"role\":\"admin\"}" \
  http://localhost:3000/api/admin/users?id=1

# Get all users
curl -b "user-data={\"id\":1,\"role\":\"admin\"}" \
  http://localhost:3000/api/admin/users
```

### POST - Create User
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -b "user-data={\"id\":1,\"role\":\"admin\"}" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "role": "patient",
    "phone": "+1 (555) 123-4567",
    "bio": "Patient bio"
  }'
```

### PUT - Update User
```bash
curl -X PUT "http://localhost:3000/api/admin/users?id=1" \
  -H "Content-Type: application/json" \
  -b "user-data={\"id\":1,\"role\":\"admin\"}" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1 (555) 987-6543"
  }'
```

### DELETE - Delete User (Soft Delete)
```bash
curl -X DELETE "http://localhost:3000/api/admin/users?id=1" \
  -b "user-data={\"id\":1,\"role\":\"admin\"}"
```

## Testing Workflow

### 1. Start Application
```bash
npm run dev
```

### 2. Login as Admin
- Email: `admin@example.com`
- Password: `password123`
- Redirects to: `http://localhost:3000/admin`

### 3. Test Patient Management
1. Click "Patients" tab
2. Click "Add Patient"
3. Fill form:
   - First Name: John
   - Last Name: Patient
   - Email: john.patient@example.com
   - Password: Test123456
   - Role: Patient
4. Click "Create"
5. Check response in browser console
6. Verify in PhpMyAdmin: http://localhost:3001/phpmyadmin/

### 4. Test Edit Patient
1. Click edit icon (pencil) on patient row
2. Modify fields (e.g., phone number)
3. Click "Update"
4. Verify in database

### 5. Test Delete Patient
1. Click delete icon (trash) on patient row
2. Confirm deletion
3. Verify user is marked inactive in database (isActive = 0)

## Database Queries for Verification

### View All Users
```sql
SELECT id, firstName, lastName, email, role, isActive, createdAt FROM users;
```

### View Patients Only
```sql
SELECT id, firstName, lastName, email, phone, isActive FROM users WHERE role = 'patient';
```

### View Psychiatrists
```sql
SELECT id, firstName, lastName, email, specialization, isActive FROM users WHERE role = 'psychiatrist';
```

### View Researchers
```sql
SELECT id, firstName, lastName, email, specialization, isActive FROM users WHERE role = 'researcher';
```

### Count Users by Role
```sql
SELECT role, COUNT(*) as count FROM users GROUP BY role;
```

### View Soft Deleted Users
```sql
SELECT id, firstName, lastName, email, role, isActive FROM users WHERE isActive = 0;
```

## Data Flow Diagram

```
Frontend (React)
     ↓
UserFormModal (collects data)
     ↓
api-client.js (createUser/updateUser/deleteUser)
     ↓
POST/PUT/DELETE /api/admin/users
     ↓
API Route Handler (verifyAdminRole)
     ↓
Sequelize Model (User.create/update)
     ↓
MySQL Database
     ↓
Response → Toast Notification → Refresh Table
```

## Common Issues & Solutions

### Issue: "Database not initialized" Error
**Solution:**
```bash
# Check MySQL is running
mysql -u root

# If not running, start it:
# Windows: Start MySQL service or run mysql server
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql

# Re-initialize database
node lib/initDb.js
```

### Issue: "Admin access required" Error
**Solution:**
- Login with admin credentials first
- Ensure cookies are enabled in browser
- Clear browser cookies and login again
- Check user has admin role in database

### Issue: "Email already exists" Error
**Solution:**
- Use unique email addresses
- Query database to check existing emails:
  ```sql
  SELECT email FROM users WHERE email = 'test@example.com';
  ```

### Issue: Connection Timeout
**Solution:**
- Reduce number of parallel requests
- Increase connection pool in database.js:
  ```javascript
  pool: {
    max: 5,
    min: 0,
    acquire: 20000,
    idle: 10000,
  }
  ```

## Browser DevTools Debugging

### Console Logs to Watch
- `[API]` - API route logs
- `[DB]` - Database connection logs
- `[UI]` - Frontend logs

### Example Console Output
```
[API] Admin Users POST - Verifying access...
[API] Database authenticated successfully
[API] Creating user: john@example.com with role: patient
[API] User created successfully with ID: 5
```

### Network Tab
- Monitor XHR requests to `/api/admin/users`
- Check response status and body
- Verify cookies are sent with requests

## Performance Tips

1. **Pagination**: For large datasets, implement pagination
2. **Caching**: Cache user lists on client side
3. **Batch Operations**: Create bulk user import feature
4. **Indexing**: Add database indexes on frequently queried fields

```sql
-- Add useful indexes
ALTER TABLE users ADD INDEX idx_role (role);
ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE users ADD INDEX idx_isActive (isActive);
```

## Security Considerations

1. ✅ Admin role verification on every endpoint
2. ✅ Password hashing with bcryptjs
3. ✅ Soft deletes (no permanent data loss)
4. ✅ Input validation and sanitization
5. ✅ SQL injection protection via Sequelize ORM
6. ⚠️ TODO: Implement rate limiting
7. ⚠️ TODO: Add audit logging for admin actions

## Next Steps

1. Test all CRUD operations
2. Monitor database performance
3. Implement advanced features:
   - User search and filtering
   - Bulk user import (CSV)
   - User activity logs
   - Role-based permissions
   - Two-factor authentication
