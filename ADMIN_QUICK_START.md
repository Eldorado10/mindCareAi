# Admin Panel - Quick Start Guide

## Getting Started in 5 Minutes

### Prerequisites
- MySQL Server running on `localhost:3306`
- Node.js and npm installed
- Project dependencies installed (`npm install`)

### Step 1: Setup Database (2 minutes)

```bash
# Create MySQL database
mysql -u root -e "CREATE DATABASE mindcare_db;"

# Initialize tables and seed demo data
node lib/initDb.js
```

**Expected Output:**
```
✅ Database connection successful!
✅ Models synced successfully!
✅ Sample psychiatrists created!
✅ Sample resources created!
✅ Sample users created!
📧 Demo credentials:
   Patient: patient@example.com / password123
   Researcher: researcher@example.com / password123
   Data Scientist: datascientist@example.com / password123
   Admin: admin@example.com / password123
```

### Step 2: Start Application (1 minute)

```bash
npm run dev
```

Navigate to: `http://localhost:3000`

### Step 3: Login as Admin (1 minute)

1. Go to: `http://localhost:3000/auth/signin`
2. Enter credentials:
   - **Email:** `admin@example.com`
   - **Password:** `password123`
3. Click "Sign In"
4. You'll be redirected to: `http://localhost:3000/admin`

### Step 4: Explore Admin Dashboard (1 minute)

The admin dashboard has 4 tabs:

#### 👥 Patients Tab
- View all patients in the system
- Add new patients
- Edit patient details
- Delete patients (soft delete)

#### 👨‍⚕️ Psychiatrists Tab
- Manage psychiatrist profiles
- Add new psychiatrists
- Update credentials and specialization
- Remove psychiatrists

#### 🔬 Researchers Tab
- Manage researcher accounts
- Track research specializations
- Control researcher access

#### 📊 Data Scientists Tab
- Manage data scientist accounts
- Track analytics specializations
- Control data scientist access

---

## Common Tasks

### Add a New Patient

1. Click **Patients** tab
2. Click **+ Add Patient** button
3. Fill in form:
   ```
   First Name:  John
   Last Name:   Doe
   Email:       john.doe@example.com
   Password:    SecurePass123
   Phone:       +1 (555) 123-4567
   Role:        Patient (auto-selected)
   Bio:         Optional patient information
   ```
4. Click **Create**
5. Check database in PhpMyAdmin: `http://localhost:3001/phpmyadmin`

### Edit Patient Information

1. Click **Patients** tab
2. Find patient in table
3. Click **Edit** (pencil icon)
4. Modify any fields
5. Click **Update**

### Delete Patient

1. Click **Patients** tab
2. Find patient in table
3. Click **Delete** (trash icon)
4. Confirm deletion
5. Patient marked as inactive in database

### Add Psychiatrist with Specialization

1. Click **Psychiatrists** tab
2. Click **+ Add Psychiatrist**
3. Fill form:
   ```
   First Name:      Dr. Sarah
   Last Name:       Johnson
   Email:           sarah.johnson@example.com
   Password:        DoctorPass123
   Phone:           +1 (555) 234-5678
   Role:            Psychiatrist
   Specialization:  Anxiety Disorders (optional)
   Bio:             15 years experience...
   ```
4. Click **Create**

### Add Researcher

1. Click **Researchers** tab
2. Click **+ Add Researcher**
3. Fill form:
   ```
   First Name:      Dr. Michael
   Last Name:       Chen
   Email:           michael.chen@example.com
   Password:        ResearchPass123
   Phone:           +1 (555) 345-6789
   Role:            Researcher
   Specialization:  Psychology & Neuroscience (required)
   Bio:             Mental health research focus
   ```
4. Click **Create**

---

## Database Verification

### View in PhpMyAdmin

**URL:** `http://localhost:3001/phpmyadmin/index.php?route=/database/structure&db=mindcare_db`

**Check these tables:**
- `users` - All users (patients, psychiatrists, researchers, etc.)
- `psychiatrists` - Psychiatrist profiles
- `resources` - Mental health resources
- `bookings` - Appointment bookings

### Check User Count by Role

Open MySQL client and run:

```sql
SELECT role, COUNT(*) as count FROM users GROUP BY role;
```

Expected output after seeding:
```
| role           | count |
|----------------|-------|
| admin          | 1     |
| patient        | 1     |
| researcher     | 1     |
| data-scientist | 1     |
```

---

## API Endpoints Reference

All endpoints require **admin authentication**.

### Get Users
```bash
# All users
GET /api/admin/users

# By role
GET /api/admin/users?role=patient

# By ID
GET /api/admin/users?id=1
```

### Create User
```bash
POST /api/admin/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "patient",
  "phone": "+1 (555) 123-4567"
}
```

### Update User
```bash
PUT /api/admin/users?id=1
Content-Type: application/json

{
  "firstName": "Jane",
  "phone": "+1 (555) 987-6543"
}
```

### Delete User (Soft Delete)
```bash
DELETE /api/admin/users?id=1
```

---

## Troubleshooting

### Problem: "Database not initialized"
```bash
# Make sure MySQL is running
mysql -u root

# If not, restart MySQL:
# Windows: Start MySQL service
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql

# Reinitialize
node lib/initDb.js
```

### Problem: Admin button not showing after login
- Clear browser cache and cookies
- Login again with admin credentials
- Check user role in database: `SELECT role FROM users WHERE email='admin@example.com';`

### Problem: Can't add user - "Email already exists"
- Check if email is unique: `SELECT email FROM users WHERE email='test@example.com';`
- Use a different email address

### Problem: Slow database queries
- Add indexes:
```sql
ALTER TABLE users ADD INDEX idx_role (role);
ALTER TABLE users ADD INDEX idx_email (email);
```

---

## Key Features

✅ **Full CRUD Operations** - Create, Read, Update, Delete users
✅ **Role-Based Access** - Admin panel only accessible to admins
✅ **Soft Deletes** - Users marked inactive instead of permanently deleted
✅ **Real-time Database Sync** - All changes immediately reflected in MySQL
✅ **Data Validation** - Email format, required fields, unique constraints
✅ **Error Handling** - Detailed error messages for debugging
✅ **Responsive UI** - Works on desktop and mobile
✅ **Toast Notifications** - Visual feedback for all actions

---

## Architecture Overview

```
Login Page
    ↓
    ├─→ (Non-admin) → Dashboard (limited access)
    └─→ (Admin) → /admin
         ↓
    Admin Dashboard
         ↓
    ├─→ Patients Tab
    ├─→ Psychiatrists Tab
    ├─→ Researchers Tab
    └─→ Data Scientists Tab
         ↓
    UserFormModal (Add/Edit)
         ↓
    POST/PUT/DELETE /api/admin/users
         ↓
    Sequelize ORM
         ↓
    MySQL Database
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','patient','psychiatrist','researcher','data-scientist'),
  phone VARCHAR(20),
  specialization VARCHAR(255),
  bio TEXT,
  isActive BOOLEAN DEFAULT true,
  lastLogin DATETIME,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

---

## Security Features

🔒 **Admin-Only Access** - Middleware checks role before allowing access
🔒 **Password Hashing** - bcryptjs with 10 salt rounds
🔒 **Input Validation** - All fields validated before database insert
🔒 **SQL Injection Protection** - Sequelize ORM prevents SQL injection
🔒 **Soft Deletes** - No permanent data loss
🔒 **Activity Logging** - Timestamp all changes

---

## Next Steps

1. ✅ Setup database and login as admin
2. ✅ Add test users to all roles
3. ✅ Verify data in PhpMyAdmin
4. ⏭️ Implement user search and filters
5. ⏭️ Add bulk user import (CSV)
6. ⏭️ Create audit logs
7. ⏭️ Setup 2FA for admin accounts

---

## Support & Documentation

- **Database Setup:** See `DATABASE_SETUP.md`
- **API Testing:** See `ADMIN_DATABASE_INTEGRATION.md`
- **API Client:** See `lib/api-client.js`
- **Admin Route:** See `app/api/admin/users/route.js`
- **Components:** See `app/components/Admin/`

For issues, check browser console (F12) and server logs.
