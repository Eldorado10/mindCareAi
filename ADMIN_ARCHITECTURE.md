# Admin Panel Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     MindCare AI Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Frontend Layer (React Components)            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │         Admin Dashboard (/admin)                    │ │   │
│  │  │  ┌─────────────────────────────────────────────┐   │ │   │
│  │  │  │ Tabbed Navigation                           │   │ │   │
│  │  │  │ - Patients    - Psychiatrists               │   │ │   │
│  │  │  │ - Researchers - Data Scientists             │   │ │   │
│  │  │  └─────────────────────────────────────────────┘   │ │   │
│  │  │                      ↓                              │ │   │
│  │  │  ┌─────────────────────────────────────────────┐   │ │   │
│  │  │  │ UsersTable Component                        │   │ │   │
│  │  │  │ - Display users by role                     │   │ │   │
│  │  │  │ - Edit/Delete buttons                       │   │ │   │
│  │  │  └─────────────────────────────────────────────┘   │ │   │
│  │  │                      ↓                              │ │   │
│  │  │  ┌──────────────┬──────────────┬──────────────┐   │ │   │
│  │  │  │ UserFormModal│ ConfirmDialog│ Toast        │   │ │   │
│  │  │  │ Add/Edit     │ Delete       │ Notifications│   │ │   │
│  │  │  │              │              │              │   │ │   │
│  │  │  └──────────────┴──────────────┴──────────────┘   │ │   │
│  │  └─────────────────────────────────────────────────────┘   │ │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            API Client Layer (lib/api-client.js)          │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  fetchAllUsers()    createUser()    updateUser()         │   │
│  │  fetchUserById()    deleteUser()                          │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                ↓                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        Middleware (middleware.js)                        │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ - Check admin role in cookies                            │   │
│  │ - Protect /admin routes                                  │   │
│  │ - Redirect non-admin users                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                ↓                                  │
├─────────────────────────────────────────────────────────────────┤
│                   Backend Layer (API Routes)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  /api/admin/users (app/api/admin/users/route.js)        │   │
│  │                                                            │   │
│  │  GET     → Retrieve users (all or filtered)              │   │
│  │  POST    → Create new user                               │   │
│  │  PUT     → Update user information                       │   │
│  │  DELETE  → Soft delete user                              │   │
│  │                                                            │   │
│  │  Security:                                                │   │
│  │  ✓ Verify admin role from cookies                        │   │
│  │  ✓ Check database connection                             │   │
│  │  ✓ Validate input parameters                             │   │
│  │  ✓ Hash passwords with bcrypt                            │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Database Layer (MySQL)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │          Users Table (Sequelize Model)                │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │ id | firstName | lastName | email | role | isActive   │     │
│  │────┼──────────┼──────────┼───────┼──────┼────────────│     │
│  │ 1  │ John     │ Patient  │ ...   │ pat  │ true       │     │
│  │ 2  │ Dr. Sarah│Researcher│ ...   │ res  │ true       │     │
│  │ 3  │ Alex     │DataSci   │ ...   │ ds   │ true       │     │
│  │ 4  │ Admin    │ User     │ ...   │ adm  │ true       │     │
│  │ 5  │ (new)    │          │ ...   │      │ false      │     │
│  │                                                        │     │
│  │ Plus: phone, specialization, bio, password, etc.     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Management Flow

### Adding a New User

```
┌─────────────────────────────────────────────────────────────────┐
│                    Admin Dashboard Page                          │
│  (app/admin/page.jsx)                                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                 Click "Add Patient" button
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              UserFormModal Component Opens                       │
│  (app/components/Admin/UserFormModal.jsx)                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Form Fields:                                           │     │
│  │ [First Name] [Last Name]                              │     │
│  │ [Email]     [Password]                                │     │
│  │ [Phone]     [Specialization] (if needed)              │     │
│  │ [Bio]                                                  │     │
│  │                [Create Button]                         │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                  Validate Form Data
                  ├─ Check required fields
                  ├─ Validate email format
                  └─ Validate specialization
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              API Call: createUser()                              │
│  (lib/api-client.js → /api/admin/users)                        │
│                                                                   │
│  POST /api/admin/users                                           │
│  {                                                                │
│    firstName: "John",                                            │
│    lastName: "Doe",                                              │
│    email: "john@example.com",                                    │
│    password: "password123",                                      │
│    role: "patient",                                              │
│    phone: "+1 (555) 123-4567"                                    │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         Backend: /api/admin/users/route.js (POST)              │
│                                                                   │
│  1. Verify Admin Role                                            │
│     └─ Check user-data cookie for admin role                    │
│                                                                   │
│  2. Authenticate Database                                        │
│     └─ Connect to MySQL database                                │
│                                                                   │
│  3. Validate Input                                               │
│     ├─ Check all required fields present                         │
│     ├─ Validate email format                                     │
│     └─ Check email uniqueness                                    │
│                                                                   │
│  4. Hash Password                                                │
│     └─ bcrypt.hash(password, 10)                                 │
│                                                                   │
│  5. Create User in Database                                      │
│     └─ User.create({ ...userData })                              │
│                                                                   │
│  6. Return Response                                              │
│     └─ 201 Created with user data (without password)             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         Frontend: Admin Dashboard                                │
│                                                                   │
│  1. Receive Success Response (201)                               │
│                                                                   │
│  2. Show Toast Notification                                      │
│     "User created successfully"                                  │
│                                                                   │
│  3. Refresh User List                                            │
│     fetchAllUsers('patient')                                     │
│                                                                   │
│  4. Close Form Modal                                             │
│                                                                   │
│  5. Update Table Display                                         │
│     └─ Show new user in table                                    │
└─────────────────────────────────────────────────────────────────┘
                            ✓
                     User Created!
```

---

## Editing a User

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Table Display                            │
│  (UsersTable Component)                                         │
│                                                                   │
│  User: John Doe                                                  │
│  Email: john@example.com                                         │
│  Role: Patient                                                   │
│  [Edit] [Delete]  ← Click Edit                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│           UserFormModal Opens in Edit Mode                       │
│                                                                   │
│  Form Fields Pre-filled:                                         │
│  [John]              [Doe]                                       │
│  [john@example.com]  [DISABLED - can't change email]            │
│  [+1 (555) 123...]   [patient]                                  │
│  [Bio...]                                                        │
│  [Password] - leave empty to keep current                        │
│                                                                   │
│                    [Update Button]                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                   Admin Updates Fields
                   and Clicks "Update"
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              API Call: updateUser(id, data)                      │
│                                                                   │
│  PUT /api/admin/users?id=1                                       │
│  {                                                                │
│    firstName: "John",                                            │
│    phone: "+1 (555) 999-8888",     ← Changed                     │
│    bio: "Updated bio..."            ← Changed                    │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│    Backend: /api/admin/users/route.js (PUT)                    │
│                                                                   │
│  1. Verify Admin Role ✓                                          │
│  2. Authenticate Database ✓                                      │
│  3. Find User by ID ✓                                            │
│  4. Validate Changes                                             │
│     └─ Check if email changed (prevent if yes)                   │
│  5. Hash password if included                                    │
│  6. Update User: user.update(data)                               │
│  7. Return 200 OK with updated user                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                     User Updated!
               Toast: "User updated successfully"
```

---

## Deleting a User

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Table                                │
│                                                                   │
│  John Doe  │ john@example.com │ Patient  │ [Edit] [Delete] ← Click
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         ConfirmDialog Component Appears                          │
│                                                                   │
│  ⚠️  Delete User?                                                │
│                                                                   │
│  Are you sure you want to delete John Doe?                       │
│  This action cannot be undone.                                   │
│                                                                   │
│              [Cancel]        [Delete]                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
            Admin Reviews and Clicks "Delete"
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│          API Call: deleteUser(userId)                            │
│                                                                   │
│  DELETE /api/admin/users?id=1                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│    Backend: /api/admin/users/route.js (DELETE)                 │
│                                                                   │
│  1. Verify Admin Role ✓                                          │
│  2. Authenticate Database ✓                                      │
│  3. Find User by ID ✓                                            │
│  4. Mark as Inactive (Soft Delete)                               │
│     user.update({ isActive: false })                             │
│     └─ Data preserved in database                                │
│  5. Return 200 OK message                                        │
│                                                                   │
│  Important: User record remains in database!                     │
│  This preserves audit trails and historical data.                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                   User Marked Inactive
              Toast: "User deleted successfully"
                            ↓
                   User List Refreshes
             User no longer appears in active list
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│            Sign In Page (/auth/signin)                           │
│                                                                   │
│  Email:    [admin@example.com     ]                              │
│  Password: [••••••••••••••••••••]                                │
│  
│            [Sign In]                                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│            LoginForm Component                                   │
│  (app/components/LoginForm/index.jsx)                           │
│                                                                   │
│  1. Validate email and password                                  │
│  2. Call: login(email, password)                                │
│     └─ Send to /api/auth/login                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         Backend: /api/auth/login                                 │
│  (app/api/auth/login/route.js)                                  │
│                                                                   │
│  1. Find user by email                                           │
│  2. Check if user is active (isActive === true)                  │
│  3. Verify password with bcrypt.compare()                        │
│  4. Update lastLogin timestamp                                   │
│  5. Return user data (exclude password)                          │
│                                                                   │
│  Response:                                                        │
│  {                                                                │
│    id: 4,                                                         │
│    email: "admin@example.com",                                   │
│    role: "admin",                    ← KEY!                      │
│    firstName: "Admin",                                            │
│    lastName: "User",                                              │
│    ...                                                            │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         Frontend: Store Session Data                             │
│                                                                   │
│  1. localStorage.setItem('user', JSON.stringify(user))           │
│  2. localStorage.setItem('userRole', 'admin')                    │
│  3. document.cookie = 'user-data={id, role}'                     │
│  4. document.cookie = 'next-auth.session-token=session'          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         Router Redirect Based on Role                            │
│                                                                   │
│  if (role === 'admin')      → /admin                             │
│  if (role === 'patient')    → /dashboard?role=patient            │
│  if (role === 'researcher') → /dashboard?role=researcher         │
│  else                       → /dashboard                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    ✓ Admin Logged In!
                     Redirect to /admin
```

---

## Admin Route Protection

```
┌─────────────────────────────────────────────────────────────────┐
│           User Requests /admin Route                             │
│                                                                   │
│  Browser: GET /admin                                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         Middleware (middleware.js) Intercepts                    │
│                                                                   │
│  1. Check if route is admin path (/admin)                        │
│     └─ Yes, this is an admin path                                │
│                                                                   │
│  2. Get user cookies:                                            │
│     - next-auth.session-token                                    │
│     - user-data (contains role)                                  │
│                                                                   │
│  3. Parse user-data cookie                                       │
│     └─ Extract role from JSON                                    │
│                                                                   │
│  4. Check Admin Conditions:                                      │
│     if (!hasSession || role !== 'admin') {                       │
│       Redirect to /auth/signin                                   │
│     }                                                             │
│                                                                   │
│  5. Decision:                                                     │
│     ├─ Admin user: NextResponse.next() → Continue                │
│     └─ Non-admin: NextResponse.redirect('/auth/signin')          │
└─────────────────────────────────────────────────────────────────┘
                         ↙       ↘
                    ✓ ADMIN       ✗ NON-ADMIN
                        ↓              ↓
            ┌──────────────────┐  Redirect to
            │ /admin loads     │  /auth/signin
            │ Dashboard shows  │
            │ User table       │
            └──────────────────┘
```

---

## API Security Verification

```
Admin Makes API Request
        ↓
POST /api/admin/users
Host: localhost:3000
Cookie: user-data={"id":4,"role":"admin"}
Cookie: next-auth.session-token=session
        ↓
┌─────────────────────────────────────────────────────────────────┐
│    API Route Handler (app/api/admin/users/route.js)             │
│                                                                   │
│    function verifyAdminRole(request) {                           │
│      1. Extract cookies from request headers                     │
│      2. Find 'user-data' cookie                                  │
│      3. Parse JSON: { id, role }                                 │
│      4. Check if role === 'admin'                                │
│      5. Return true/false                                        │
│    }                                                              │
│                                                                   │
│    In each API handler:                                          │
│    if (!verifyAdminRole(request)) {                              │
│      return Response.json(                                       │
│        { error: 'Unauthorized' },                                │
│        { status: 403 }                                           │
│      );                                                           │
│    }                                                              │
└─────────────────────────────────────────────────────────────────┘
        ↓
    ✓ Authorized! Process request
    ✗ Forbidden! Return 403 error
```

---

## Component Tree

```
AdminDashboard (page.jsx)
├── State Management
│   ├── activeTab
│   ├── users[]
│   ├── selectedUser
│   ├── toast
│   └── confirmDialog
│
├── Header
│   ├── Dashboard Title
│   └── Logout Button
│
├── Tab Navigation
│   ├── Patients Tab
│   ├── Psychiatrists Tab
│   ├── Researchers Tab
│   └── Data Scientists Tab
│
├── Control Bar
│   ├── User Count
│   └── "Add User" Button
│
├── UsersTable Component
│   ├── Table Header
│   │   ├── Name
│   │   ├── Email
│   │   ├── Role
│   │   ├── Status
│   │   ├── Phone
│   │   └── Actions
│   │
│   └── Table Body
│       └── User Rows (map)
│           └── Edit/Delete Buttons
│
├── UserFormModal Component
│   ├── Form Title
│   ├── Form Fields
│   │   ├── FirstName Input
│   │   ├── LastName Input
│   │   ├── Email Input
│   │   ├── Password Input
│   │   ├── Phone Input
│   │   ├── Role Select
│   │   ├── Specialization Input (conditional)
│   │   └── Bio Textarea
│   │
│   ├── Validation Messages
│   └── Action Buttons (Cancel/Submit)
│
├── ConfirmDialog Component
│   ├── Warning Icon
│   ├── Title
│   ├── Message
│   └── Buttons (Cancel/Delete)
│
└── Toast Component
    ├── Icon (Success/Error)
    ├── Message
    └── Close Button
```

---

## Data Flow Diagram

```
┌──────────────────┐
│   Admin User     │
│  at /admin       │
└────────┬─────────┘
         │
         ├─────────────────────────────────────────┐
         │                                         │
    [See Users]              [Manage Users]
         │                       │
         ↓                       │
  GET /api/admin/users       ├─────────────────────┤
         │                   │
         ├─────────────────┐ ├──[Add User]
         │                 │ │   ↓
         ↓                 │ │   POST /api/admin/users
    [Database Query]       │ │   ├─ Hash Password
    SELECT * FROM users    │ │   ├─ Create Record
         │                 │ │   └─ Return User
         │                 │ │
         ↓                 │ ├──[Edit User]
    [Return User List]     │ │   ↓
         │                 │ │   PUT /api/admin/users?id=X
         │                 │ │   ├─ Update Fields
         │                 │ │   ├─ Validate Email
         ↓                 │ │   └─ Return User
    [Display in Table]     │ │
         │                 │ ├──[Delete User]
         │                 │ │   ↓
         │                 │ │   DELETE /api/admin/users?id=X
         │                 │ │   ├─ Mark isActive = false
         │                 │ │   └─ Return Message
         │                 │ │
         └─────────────────┴─┘
                 │
                 ↓
        [Show Toast & Refresh]
```

---

## User Lifecycle in Database

```
┌─────────────────────────────────────────────────────────────────┐
│               User Status Timeline                               │
│                                                                   │
│  1. CREATION                                                      │
│     └─ Admin creates user via form                               │
│        - Password hashed with bcrypt                             │
│        - isActive = true                                         │
│        - createdAt = current timestamp                           │
│                                                                   │
│  2. ACTIVE STATE                                                  │
│     └─ User can login and use platform                           │
│        - lastLogin updated on each login                         │
│        - Can be edited by admin                                  │
│        - Can participate in all features                         │
│                                                                   │
│  3. EDITED                                                        │
│     └─ Admin updates user information                            │
│        - Phone, bio, name can change                             │
│        - Email cannot change (prevent duplicates)                │
│        - Password can be reset by admin                          │
│        - updatedAt timestamp changes                             │
│                                                                   │
│  4. DELETION (Soft Delete)                                        │
│     └─ Admin marks user for deletion                             │
│        - isActive = false (not deleted!)                         │
│        - User cannot login anymore                               │
│        - Data preserved in database                              │
│        - Can be reactivated by updating isActive=true            │
│        - Maintains referential integrity                         │
│                                                                   │
│  Database Record:                                                 │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ id │ name  │ email │ role  │ isActive │ created   │ │ updated │
│  ├──────────────────────────────────────────────────────┤        │
│  │ 1  │ John  │ ...   │ pat   │ true     │ 2024-01   │        │
│  │ 2  │ Jane  │ ...   │ doc   │ false    │ 2024-01   │ 2024-01│
│  │ 3  │ Mike  │ ...   │ res   │ true     │ 2024-01   │        │
│  └──────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Layers                               │
└─────────────────────────────────────────────────────────────────┘

Layer 1: ROUTE PROTECTION
    ↓
    Admin Route (/admin)
    ├─ Middleware checks
    ├─ Session required
    ├─ Admin role required
    └─ Redirect if unauthorized

Layer 2: API AUTHENTICATION
    ↓
    /api/admin/* endpoints
    ├─ verifyAdminRole() function
    ├─ Cookie validation
    ├─ Role verification
    └─ 403 Forbidden if unauthorized

Layer 3: DATA VALIDATION
    ↓
    Input Validation
    ├─ Required fields check
    ├─ Email format validation
    ├─ Email uniqueness check
    ├─ Field length validation
    └─ Type checking

Layer 4: PASSWORD SECURITY
    ↓
    Password Hashing
    ├─ bcrypt.hash(password, 10)
    ├─ Never stored in plain text
    ├─ Hashed on creation
    ├─ Hashed on update
    └─ Never sent in API responses

Layer 5: DATABASE PROTECTION
    ↓
    Data Integrity
    ├─ Foreign key constraints
    ├─ Unique email constraint
    ├─ Soft deletes (preserve history)
    ├─ Timestamps (audit trail)
    └─ Transaction safety

Layer 6: SOFT DELETES
    ↓
    Data Preservation
    ├─ Mark inactive instead of deleting
    ├─ Preserve audit trail
    ├─ Allow data recovery
    ├─ Maintain referential integrity
    └─ Support compliance/legal holds
```

---

This documentation provides complete visibility into the admin panel architecture, data flows, and security mechanisms.
