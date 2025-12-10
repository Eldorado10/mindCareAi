# Admin Panel Documentation

## Overview

The Admin Panel is a secure, role-based dashboard that allows administrators to manage all users in the MindCare AI platform. Only users with the `admin` role can access the admin panel.

## Features

✅ **Complete User Management**
- View all users by role (Patients, Psychiatrists, Researchers, Data Scientists)
- Add new users with specific roles
- Edit user information
- Delete (deactivate) users
- Search and filter users by role

✅ **User Types Supported**
- **Patients** - Regular platform users seeking mental health support
- **Psychiatrists** - Medical professionals providing consultations
- **Researchers** - Research professionals with specialization fields
- **Data Scientists** - Data specialists with domain expertise

✅ **Security Features**
- Admin-only access (role-based authentication)
- Middleware-protected admin routes
- Password hashing with bcrypt
- Soft deletes (users marked as inactive instead of deletion)
- Admin role verification on every API call

✅ **User Interface**
- Clean, modern dashboard with tabbed navigation
- Real-time user table with sortable columns
- Modal form for adding/editing users
- Confirmation dialogs for destructive actions
- Toast notifications for user feedback
- Responsive design for mobile and desktop

## Access & Authentication

### Who Can Access?
Only users with the `admin` role can access the admin panel.

### Demo Admin Credentials
```
Email: admin@example.com
Password: password123
```

### Access URL
After logging in as admin, you'll be redirected to:
```
http://localhost:3000/admin
```

## User Management Workflows

### Adding a New User

1. Go to the Admin Dashboard (`/admin`)
2. Select the user type tab (Patients, Psychiatrists, Researchers, or Data Scientists)
3. Click "Add [User Type]" button
4. Fill in the form:
   - **First Name** (required)
   - **Last Name** (required)
   - **Email** (required, must be unique)
   - **Password** (required for new users)
   - **Phone** (optional)
   - **Role** (auto-selected based on tab)
   - **Specialization** (required for Researchers and Data Scientists)
   - **Bio** (optional)
5. Click "Create" button
6. Success toast notification will appear

### Editing a User

1. Locate the user in the appropriate tab
2. Click the **Edit** button (pencil icon)
3. Update the desired fields
4. Note: Email cannot be changed (to prevent duplication issues)
5. You can optionally update the password
6. Click "Update" button
7. Success notification will confirm the changes

### Deleting a User

1. Find the user to delete
2. Click the **Delete** button (trash icon)
3. Confirm the deletion in the dialog
4. The user will be marked as inactive (soft delete)
5. User data is preserved in the database for audit purposes

### Viewing Users

All users are displayed in a sortable table showing:
- Name (with specialization if applicable)
- Email address
- Role (color-coded badges)
- Active/Inactive status
- Phone number
- Action buttons

## API Endpoints

All admin endpoints require admin authentication and are located at `/api/admin/`.

### Get All Users
```bash
GET /api/admin/users
GET /api/admin/users?role=patient
GET /api/admin/users?id=1
```

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "patient",
    "phone": "+1 (555) 123-4567",
    "specialization": null,
    "bio": null,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Create User
```bash
POST /api/admin/users
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "role": "psychiatrist",
  "phone": "+1 (555) 234-5678",
  "specialization": null,
  "bio": "Brief bio..."
}
```

### Update User
```bash
PUT /api/admin/users?id=1
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1 (555) 987-6543",
  "bio": "Updated bio..."
}
```

### Delete User
```bash
DELETE /api/admin/users?id=1
```

## File Structure

```
app/
├── admin/
│   └── page.jsx                    # Main admin dashboard page
├── api/
│   └── admin/
│       └── users/
│           └── route.js            # User CRUD API endpoints
├── components/
│   └── Admin/
│       ├── UserFormModal.jsx       # Add/Edit user form modal
│       ├── UsersTable.jsx          # Users table display
│       ├── Toast.jsx               # Toast notifications
│       └── ConfirmDialog.jsx       # Delete confirmation dialog

lib/
├── api-client.js                   # Frontend API helper functions
└── models/
    └── User.js                     # User Sequelize model

middleware.js                       # Admin route protection
```

## Frontend Components

### AdminDashboard (`/app/admin/page.jsx`)
Main dashboard component with:
- Tab navigation for user types
- User list display
- User management state
- API integration
- Toast and dialog management

### UserFormModal (`/app/components/Admin/UserFormModal.jsx`)
Modal form component for adding/editing users:
- Form validation
- Role-specific fields
- Error handling
- Loading states

### UsersTable (`/app/components/Admin/UsersTable.jsx`)
Displays users in a sortable table:
- Role color-coding
- Status indicators
- Action buttons
- Empty state handling

### Toast (`/app/components/Admin/Toast.jsx`)
Success/error notification component

### ConfirmDialog (`/app/components/Admin/ConfirmDialog.jsx`)
Confirmation modal for deletion actions

## API Client Functions

Available in `/lib/api-client.js`:

```javascript
// Fetch users
fetchAllUsers(role)              // Get users by role
fetchUserById(id)                // Get specific user

// Create/Update/Delete
createUser(userData)             // Create new user
updateUser(id, userData)         // Update user info
deleteUser(id)                   // Soft delete user
```

## Security Considerations

1. **Role Verification** - All admin API routes verify admin role
2. **Password Hashing** - Passwords are hashed with bcrypt (10 rounds)
3. **Soft Deletes** - Users are marked inactive rather than deleted
4. **Email Uniqueness** - Emails are enforced as unique in the database
5. **Admin-Only Routes** - Middleware protects `/admin` routes
6. **Cookie Storage** - User role is stored in cookies for middleware verification

## Middleware Protection

The admin panel is protected by middleware in `middleware.js`:
- Checks for admin role in user cookies
- Redirects non-admin users to login
- Protects the `/admin` route prefix

## Database Schema

### Users Table

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | INTEGER | Yes | Primary key, auto-increment |
| firstName | STRING | Yes | |
| lastName | STRING | Yes | |
| email | STRING | Yes | Unique |
| password | STRING | Yes | Hashed with bcrypt |
| role | ENUM | Yes | admin, patient, psychiatrist, researcher, data-scientist |
| phone | STRING | No | |
| specialization | STRING | No | For researchers and data scientists |
| bio | TEXT | No | |
| isActive | BOOLEAN | Yes | Default: true |
| lastLogin | DATETIME | No | |
| createdAt | DATETIME | Yes | Auto-set by Sequelize |
| updatedAt | DATETIME | Yes | Auto-set by Sequelize |

## Troubleshooting

### Cannot Access Admin Panel
- ✅ Verify you're logged in with an admin account
- ✅ Check browser cookies for `user-data` and role
- ✅ Try logging out and back in

### User Form Validation Errors
- ✅ Ensure all required fields are filled
- ✅ Use a valid email format (contains @)
- ✅ Password must be at least 1 character for new users
- ✅ Researchers/Data Scientists must have specialization

### Database Connection Issues
- ✅ Ensure MySQL is running
- ✅ Verify `.env.local` credentials
- ✅ Run `node lib/initDb.js` to initialize database
- ✅ Check database user has proper permissions

### Changes Not Showing
- ✅ Refresh the page
- ✅ Check browser console for API errors
- ✅ Verify API response status codes

## Demo Data

When you initialize the database with `node lib/initDb.js`, the following demo users are created:

| Name | Email | Password | Role |
|------|-------|----------|------|
| John Patient | patient@example.com | password123 | patient |
| Dr. Sarah Researcher | researcher@example.com | password123 | researcher |
| Alex DataScientist | datascientist@example.com | password123 | data-scientist |
| Admin User | admin@example.com | password123 | admin |

## Development Notes

- Admin components use `'use client'` directive for interactivity
- API routes validate admin role server-side
- Forms include comprehensive validation
- All API calls include error handling
- Toast notifications provide user feedback
- Soft deletes preserve data integrity

## Future Enhancements

Potential features to add:
- [ ] Bulk user import/export
- [ ] User activity logs
- [ ] Role permissions editor
- [ ] User profile details view
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Audit trail for admin actions
- [ ] Advanced user filtering and search
- [ ] User statistics and analytics dashboard
