# Admin Panel System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Browser                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (React)                │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │      Admin Dashboard Page (/admin)          │   │  │
│  │  │  - Tabbed Navigation (4 user types)         │   │  │
│  │  │  - UserFormModal (Create/Edit)              │   │  │
│  │  │  - UsersTable (Display users)               │   │  │
│  │  │  - Toast Notifications                      │   │  │
│  │  │  - ConfirmDialog (Delete confirmation)      │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                         ↓                            │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │      api-client.js (API Functions)          │   │  │
│  │  │  - fetchAllUsers()                          │   │  │
│  │  │  - createUser()                             │   │  │
│  │  │  - updateUser()                             │   │  │
│  │  │  - deleteUser()                             │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  │                         ↓ (HTTP)                    │  │
│  │  ┌─────────────────────────────────────────────┐   │  │
│  │  │      Cookies (Authentication)               │   │  │
│  │  │  - user-data: {"id":1,"role":"admin"}       │   │  │
│  │  │  - next-auth.session-token: session         │   │  │
│  │  └─────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (HTTP/REST)
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Backend (Node.js)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Middleware (middleware.js)                │  │
│  │  - Route Protection                                 │  │
│  │  - Admin-only access enforcement                    │  │
│  │  - Cookie verification                              │  │
│  │  - Redirect unauthenticated users                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     API Route: /api/admin/users (route.js)           │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  GET Handler                                   │ │  │
│  │  │  - Verify admin role from cookie              │ │  │
│  │  │  - Query Sequelize User model                 │ │  │
│  │  │  - Filter by role (patients, researchers...)  │ │  │
│  │  │  - Return JSON array of users                 │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  POST Handler                                  │ │  │
│  │  │  - Verify admin role                          │ │  │
│  │  │  - Validate input (email, name, password)     │ │  │
│  │  │  - Check email uniqueness                     │ │  │
│  │  │  - Hash password with bcryptjs                │ │  │
│  │  │  - Create user in database                    │ │  │
│  │  │  - Return created user object                 │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  PUT Handler                                   │ │  │
│  │  │  - Verify admin role                          │ │  │
│  │  │  - Get user by ID                             │ │  │
│  │  │  - Validate updated fields                    │ │  │
│  │  │  - Hash password if provided                  │ │  │
│  │  │  - Update record in database                  │ │  │
│  │  │  - Return updated user object                 │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  DELETE Handler                                │ │  │
│  │  │  - Verify admin role                          │ │  │
│  │  │  - Get user by ID                             │ │  │
│  │  │  - Mark as inactive (soft delete)             │ │  │
│  │  │  - Return success message                     │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  All with error handling and logging:                │  │
│  │  - [API] - Request/response logs                    │  │
│  │  - Status codes: 200, 201, 400, 403, 404, 500      │  │
│  │  - Detailed error messages                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓ (Sequelize ORM)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Sequelize Models (lib/models/)               │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  User Model (User.js)                         │ │  │
│  │  │  - Lazy initialization pattern                │ │  │
│  │  │  - Columns: id, firstName, lastName, email,   │ │  │
│  │  │            password, role, phone,             │ │  │
│  │  │            specialization, bio, isActive,     │ │  │
│  │  │            lastLogin, timestamps              │ │  │
│  │  │  - Validations: email format, unique          │ │  │
│  │  │  - Soft delete via isActive flag              │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  Other Models:                                      │  │
│  │  - Psychiatrist.js                                  │  │
│  │  - Resource.js                                      │  │
│  │  - Booking.js                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓ (Database Queries)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Database Connection (lib/database.js)          │  │
│  │  - Sequelize instance creation                      │  │
│  │  - Connection pooling (max 2 connections)           │  │
│  │  - Error handling and logging                       │  │
│  │  - Lazy initialization (on-demand)                  │  │
│  │  - Config from environment variables                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (SQL Queries)
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Database: mindcare_db                              │  │
│  │  Host: localhost:3306                               │  │
│  │                                                       │  │
│  │  Tables:                                             │  │
│  │  ┌─────────────────────┐                             │  │
│  │  │ users (PRIMARY)     │                             │  │
│  │  ├─────────────────────┤                             │  │
│  │  │ id (PK)            │                             │  │
│  │  │ firstName          │                             │  │
│  │  │ lastName           │                             │  │
│  │  │ email (UNIQUE)     │                             │  │
│  │  │ password           │                             │  │
│  │  │ role (ENUM)        │  ← All user types here    │  │
│  │  │ phone              │    (admin, patient,        │  │
│  │  │ specialization     │     psychiatrist, etc.)    │  │
│  │  │ bio                │                             │  │
│  │  │ isActive           │  ← Soft delete flag        │  │
│  │  │ lastLogin          │                             │  │
│  │  │ createdAt          │                             │  │
│  │  │ updatedAt          │                             │  │
│  │  └─────────────────────┘                             │  │
│  │                                                       │  │
│  │  ┌─────────────────────┐   ┌─────────────────────┐  │  │
│  │  │ psychiatrists       │   │ resources           │  │  │
│  │  │ bookings            │   │ (other tables)      │  │  │
│  │  └─────────────────────┘   └─────────────────────┘  │  │
│  │                                                       │  │
│  │  Indices (for performance):                          │  │
│  │  - idx_role (role column)                            │  │
│  │  - idx_email (email column)                          │  │
│  │  - idx_isActive (isActive column)                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow - Complete CRUD Cycle

### CREATE - Adding New Patient

```
1. User clicks "+ Add Patient" button
   ↓
2. UserFormModal opens
   ↓
3. User fills form and clicks "Create"
   ↓
4. Form validation in modal (client-side)
   ├─ Check required fields
   ├─ Validate email format
   └─ Validate role selection
   ↓
5. Form data sent via: createUser(formData)
   ├─ Call: fetch('/api/admin/users', { method: 'POST', body: JSON.stringify(formData) })
   └─ Include cookie header automatically
   ↓
6. API Route Handler (/api/admin/users)
   ├─ Log: "[API] Admin Users POST - Verifying access..."
   ├─ Extract and verify admin role from cookie
   ├─ Initialize database connection
   ├─ Authenticate database
   ├─ Parse request body
   ├─ Validate all fields
   ├─ Check email uniqueness: User.findOne({where: {email}})
   ├─ Hash password: bcrypt.hash(password, 10)
   ├─ Create user: User.create({...data})
   ├─ Log: "[API] User created successfully with ID: 5"
   └─ Return: 201 Created with user object
   ↓
7. Database Operation
   ├─ Sequelize generates SQL:
   │  INSERT INTO users (firstName, lastName, email, password, role, phone, bio, isActive, createdAt, updatedAt)
   │  VALUES ('John', 'Doe', 'john@example.com', '$2b$10$...hashed...', 'patient', '+1(555)123-4567', 'Bio...', 1, NOW(), NOW())
   ├─ MySQL executes INSERT
   ├─ Returns inserted row with auto-increment ID
   └─ Data persisted to disk
   ↓
8. Response received by frontend
   ├─ Parse response JSON
   ├─ Show toast: "✅ User created successfully"
   ├─ Call fetchUsers() to refresh table
   └─ UserFormModal closes
   ↓
9. Refresh User List
   ├─ Call: fetchAllUsers('patient')
   ├─ GET /api/admin/users?role=patient
   ├─ Database returns all active patients
   ├─ Update state: setUsers(newUsers)
   └─ Table re-renders with new user
   ↓
10. User sees new patient in table
    ├─ New row appears in UsersTable
    ├─ Patient count increases by 1
    ├─ All details visible: name, email, role, status, phone
    └─ Edit/Delete buttons available
```

### READ - Fetching Users

```
1. Admin opens dashboard or switches tab
   ↓
2. useEffect hook triggers: useEffect(() => { fetchUsers() }, [activeTab])
   ↓
3. Call: fetchAllUsers('patient')
   ├─ URL: GET /api/admin/users?role=patient
   ├─ Includes credentials: true (sends cookies)
   └─ Headers: Content-Type: application/json
   ↓
4. API Route Handler
   ├─ Verify admin role from cookie
   ├─ Parse query parameter: role='patient'
   ├─ Build WHERE clause: {role: 'patient'}
   ├─ Execute: User.findAll({ where: {role: 'patient'}, attributes: {exclude: ['password']} })
   ├─ SQL generated: SELECT * FROM users WHERE role='patient' AND isActive=1
   ├─ Return array of users (password excluded)
   └─ Status: 200 OK
   ↓
5. Frontend receives response
   ├─ Parse JSON array
   ├─ Update state: setUsers(users)
   ├─ Set loading: false
   └─ Component re-renders
   ↓
6. UsersTable component displays
   ├─ Render table header
   ├─ Map over users array
   ├─ Render each user as table row
   │  ├─ Name (firstName + lastName)
   │  ├─ Email
   │  ├─ Role with color badge
   │  ├─ Status: Active/Inactive
   │  ├─ Phone number
   │  └─ Action buttons (Edit, Delete)
   └─ Display user count
```

### UPDATE - Editing Patient

```
1. User clicks Edit (pencil icon) on patient row
   ↓
2. UserFormModal opens with existing user data
   ├─ Form populated from selectedUser state
   ├─ All fields pre-filled
   ├─ Password field empty (not shown in edit)
   └─ Role dropdown shows current role
   ↓
3. User modifies fields and clicks "Update"
   ├─ Form validation (same as create)
   └─ All required fields checked
   ↓
4. Call: updateUser(userId, formData)
   ├─ URL: PUT /api/admin/users?id=1
   ├─ Body: {firstName: 'Jane', phone: '+1 (555) 987-6543'}
   └─ Include admin cookie
   ↓
5. API Route Handler
   ├─ Verify admin role
   ├─ Get user ID from query: id=1
   ├─ Find user: User.findByPk(1)
   ├─ Validate updated fields
   ├─ If email changed: check uniqueness
   ├─ If password provided: hash it
   ├─ Execute: user.update(updateData)
   ├─ SQL: UPDATE users SET firstName='Jane', phone='+1 (555) 987-6543', updatedAt=NOW() WHERE id=1
   └─ Return updated user object
   ↓
6. Frontend receives updated user
   ├─ Show toast: "✅ User updated successfully"
   ├─ Call fetchUsers() to refresh
   └─ UserFormModal closes
   ↓
7. Table refreshes
   ├─ New data from database
   ├─ User sees updated values
   └─ Timestamps updated (updatedAt)
```

### DELETE - Removing Patient (Soft Delete)

```
1. User clicks Delete (trash icon) on patient row
   ↓
2. ConfirmDialog shows with message
   ├─ Title: "Delete User"
   ├─ Message: "Are you sure you want to delete Jane Smith?"
   └─ Buttons: Cancel, Delete
   ↓
3. User clicks "Delete" to confirm
   ↓
4. Call: deleteUser(userId)
   ├─ URL: DELETE /api/admin/users?id=1
   └─ Include admin cookie
   ↓
5. API Route Handler
   ├─ Verify admin role
   ├─ Get user ID: id=1
   ├─ Find user: User.findByPk(1)
   ├─ Check if exists (404 if not)
   ├─ Mark as inactive: user.update({isActive: false})
   ├─ SQL: UPDATE users SET isActive=0, updatedAt=NOW() WHERE id=1
   ├─ Note: Row NOT deleted from database (soft delete)
   └─ Return: {message: "User deleted successfully", userId: 1}
   ↓
6. Frontend receives success response
   ├─ Show toast: "✅ Jane Smith has been deleted"
   ├─ ConfirmDialog closes
   ├─ Call fetchUsers() to refresh
   └─ Set loading state
   ↓
7. Table refreshes
   ├─ GET /api/admin/users?role=patient again
   ├─ Database query: SELECT * FROM users WHERE role='patient' AND isActive=1
   ├─ Deleted user NOT included (isActive=0 filtered out)
   ├─ User removed from visible table
   ├─ Count decreases by 1
   └─ Database still has the data (recovery possible)
   ↓
8. Database state
   ├─ Row still exists: SELECT * FROM users WHERE id=1
   ├─ isActive = 0 (inactive)
   ├─ Can be recovered: UPDATE users SET isActive=1 WHERE id=1
   └─ Preserves audit trail and referential integrity
```

---

## Component Hierarchy

```
/admin (page.jsx - Admin Dashboard)
│
├── Header
│   ├── Admin Dashboard Title
│   ├── Database Status Indicator
│   └── Logout Button
│
├── Tabs Navigation
│   ├── Patients Tab
│   ├── Psychiatrists Tab
│   ├── Researchers Tab
│   └── Data Scientists Tab
│
├── Tab Content (Dynamic)
│   ├── Controls Section
│   │   ├── Tab Title & Count
│   │   └── Add User Button
│   │
│   └── UsersTable Component
│       ├── Loading Spinner (conditional)
│       ├── Empty State (conditional)
│       └── Table
│           ├── Header Row
│           └── Data Rows (map over users)
│               ├── Name Column
│               ├── Email Column
│               ├── Role Badge Column
│               ├── Status Column
│               ├── Phone Column
│               └── Actions Column
│                   ├── Edit Button
│                   └── Delete Button
│
├── UserFormModal Component
│   ├── Header
│   ├── Form Fields
│   │   ├── First Name Input
│   │   ├── Last Name Input
│   │   ├── Email Input
│   │   ├── Password Input (create only)
│   │   ├── Phone Input
│   │   ├── Role Dropdown
│   │   ├── Specialization Input (conditional)
│   │   └── Bio Textarea
│   ├── Error Display
│   └── Buttons
│       ├── Cancel
│       └── Create/Update
│
├── ConfirmDialog Component
│   ├── Icon
│   ├── Title
│   ├── Message
│   └── Buttons
│       ├── Cancel
│       └── Delete (with loading state)
│
└── Toast Component
    ├── Icon (success/error/info)
    ├── Message
    └── Close Button
```

---

## State Management

### Admin Dashboard State

```javascript
const [activeTab, setActiveTab] = useState('patient');
// Current selected tab: 'patient', 'psychiatrist', 'researcher', 'data-scientist'

const [users, setUsers] = useState([]);
// Array of users for current tab

const [loading, setLoading] = useState(false);
// Loading indicator for table

const [isFormOpen, setIsFormOpen] = useState(false);
// UserFormModal visibility

const [selectedUser, setSelectedUser] = useState(null);
// User being edited (null if creating new)

const [toast, setToast] = useState(null);
// Toast notification: {message, type}

const [confirmDialog, setConfirmDialog] = useState({
  isOpen: false,
  userId: null,
  userName: ''
});
// Delete confirmation dialog state

const [confirmLoading, setConfirmLoading] = useState(false);
// Delete operation loading state

const [dbStatus, setDbStatus] = useState('checking');
// Database connection status: 'checking', 'connected', 'error'
```

---

## Authentication & Authorization Flow

### Login Flow
```
1. User enters credentials on /auth/signin
2. LoginForm calls: login(email, password)
3. POST /api/auth/login
4. Backend verifies password (bcryptjs.compare)
5. Returns user object with role
6. Frontend stores cookies:
   - user-data: {id, role} (used by middleware)
   - next-auth.session-token: session
7. Redirect based on role:
   - role='admin' → /admin
   - role='patient' → /dashboard
   - role='researcher' → /dashboard
   - role='data-scientist' → /dashboard
```

### Admin Access Control
```
Request to /admin
    ↓
Middleware (middleware.js)
    ├─ Check if route is /admin
    ├─ Read 'user-data' cookie
    ├─ Parse JSON: {id, role}
    ├─ Verify role === 'admin'
    ├─ If yes: Allow access
    └─ If no: Redirect to /auth/signin
    ↓
Admin Dashboard loads
    ├─ Check database connection
    ├─ Fetch users for current tab
    └─ Display admin panel
```

### API Authorization
```
GET/POST/PUT/DELETE /api/admin/users
    ↓
API Handler
    ├─ Call verifyAdminRole(request)
    ├─ Extract 'user-data' cookie
    ├─ Parse cookie value
    ├─ Check: userData.role === 'admin'
    ├─ If yes: Process request
    └─ If no: Return 403 Forbidden
```

---

## Database Integration Points

### Connection Pool
```javascript
const sequelize = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  pool: {
    max: 2,        // Max 2 connections
    min: 0,        // Min 0 connections
    acquire: 15000, // Wait max 15s to get connection
    idle: 5000,    // Close idle connections after 5s
  }
});
```

### Query Examples
```sql
-- GET all patients (active only)
SELECT * FROM users 
WHERE role = 'patient' AND isActive = 1 
ORDER BY createdAt DESC;

-- POST create new user
INSERT INTO users 
(firstName, lastName, email, password, role, phone, bio, isActive, createdAt, updatedAt)
VALUES ('John', 'Doe', 'john@example.com', '$2b$10$...', 'patient', '+1555', 'bio', 1, NOW(), NOW());

-- PUT update user
UPDATE users 
SET firstName = 'Jane', phone = '+15559876543', updatedAt = NOW()
WHERE id = 1;

-- DELETE user (soft)
UPDATE users 
SET isActive = 0, updatedAt = NOW()
WHERE id = 1;
```

---

## Error Handling Strategy

### Frontend (Client-Side)
```
Try-Catch in API calls
    ├─ Catch network errors
    ├─ Catch JSON parse errors
    └─ Show error toast
    
Form validation
    ├─ Required field check
    ├─ Email format check
    ├─ Display inline errors
    └─ Prevent submission

API response checking
    ├─ Check response.ok
    ├─ Parse error from response.json()
    └─ Display meaningful error message
```

### Backend (Server-Side)
```
Try-Catch in route handlers
    ├─ Database errors
    ├─ Validation errors
    ├─ Auth errors
    └─ Return appropriate HTTP status
    
Detailed logging
    ├─ [API] prefix for clarity
    ├─ Log request type and data
    ├─ Log database operations
    ├─ Log errors with full stack trace
    └─ Include timestamps

Response format
    ├─ Success: {data} with status 200/201
    ├─ Error: {error, debug} with status 4xx/5xx
    └─ All wrapped in JSON
```

### Database Level
```
Sequelize validations
    ├─ Email format validation
    ├─ Unique constraint on email
    ├─ Not null constraints
    └─ Enum validation for role

MySQL constraints
    ├─ PRIMARY KEY (id)
    ├─ UNIQUE (email)
    ├─ NOT NULL (firstName, lastName, email, password, role)
    ├─ ENUM (role)
    └─ FOREIGN KEY (if relationships added)
```

---

## Performance Considerations

### Database Optimization
```
Current (works fine for < 10,000 users):
- No pagination
- Load all users of a role at once
- Memory: ~1MB per 100 users

Recommended for production:
- Implement pagination: 50 users per page
- Add SQL indices on frequently queried columns
- Cache user lists (Redis)
- Lazy load additional details
```

### Frontend Optimization
```
Already implemented:
- Server-side rendering of layout
- Client-side state management
- Memoization of components

Potential improvements:
- Implement React.memo for table rows
- Virtual scrolling for large lists
- Debounce search input
- Cache user data locally
```

### Network Optimization
```
Current:
- Uncompressed JSON responses
- No caching headers

Improvements:
- Enable gzip compression
- Add Cache-Control headers
- Implement pagination (smaller responses)
- Use WebSocket for real-time updates
```

---

## Security Implementation

### Authentication
```
✅ Password Hashing: bcryptjs (10 rounds)
✅ Session Tokens: HTTP-only cookies
✅ CSRF Protection: Next.js built-in
✅ Rate Limiting: TODO

```

### Authorization
```
✅ Role-based access control
✅ Admin-only middleware
✅ API endpoint verification
✅ Cookie-based auth checks

TODO:
- Two-factor authentication
- Audit logging
- Permission matrix for fine-grained control
```

### Data Protection
```
✅ SQL injection prevention: Sequelize ORM
✅ Input validation: Frontend + Backend
✅ Password hashing: Bcryptjs
✅ Soft deletes: Data preservation

TODO:
- Encryption at rest
- SSL/TLS in production
- Data anonymization
- GDPR compliance
```

---

## Deployment Checklist

- [ ] Database backup before deployment
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Rate limiting enabled
- [ ] Monitoring setup
- [ ] Logging configured
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Regular security audits
- [ ] Database indices created
- [ ] Connection pool tuned
- [ ] Load testing completed

---

## Future Enhancements

1. **Advanced Search**
   - Full-text search on user names
   - Filter by date range
   - Advanced filter panel

2. **Bulk Operations**
   - Import users from CSV
   - Bulk email users
   - Bulk role change
   - Batch deletion

3. **Audit Logging**
   - Track all admin actions
   - User activity logs
   - Change history
   - Export audit logs

4. **Advanced Permissions**
   - Sub-admin roles
   - Permission matrix
   - Role management UI
   - Delegated administration

5. **Analytics**
   - User statistics dashboard
   - Activity heatmaps
   - Trend analysis
   - Export reports

6. **Integration**
   - API keys for 3rd party
   - Webhook support
   - Single Sign-On (SSO)
   - Active Directory sync

---

## Monitoring & Logging

### Key Metrics to Monitor
```
- API response time (target: < 100ms)
- Database query time (target: < 50ms)
- Error rate (target: < 0.1%)
- User count per role (trend analysis)
- Database disk space usage
- Connection pool utilization
```

### Log Locations
```
Frontend: Browser DevTools → Console
Backend: Next.js server output (terminal)
Database: MySQL error log
Errors: Check console for [API], [DB], [UI] prefixes
```

---

This architecture provides:
✅ Scalable design
✅ Clear separation of concerns
✅ Comprehensive error handling
✅ Security best practices
✅ Performance optimization
✅ Extensibility for future features
