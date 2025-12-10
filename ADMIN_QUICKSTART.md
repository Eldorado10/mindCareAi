# Admin Panel Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Start Your App (30 seconds)
```bash
npm run dev
```
Your app will be running at http://localhost:3000

### Step 2: Log In as Admin (1 minute)
1. Go to http://localhost:3000/auth/signin
2. Enter credentials:
   - **Email:** `admin@example.com`
   - **Password:** `password123`
3. Click "Sign In"

### Step 3: Explore Admin Dashboard (1 minute)
✓ You'll be automatically redirected to `/admin`  
✓ You should see 4 tabs: Patients, Psychiatrists, Researchers, Data Scientists  
✓ See demo users in each category

### Step 4: Try Managing Users (2 minutes)

#### Add a New Patient
1. Click on "Patients" tab
2. Click "Add Patient" button
3. Fill in the form:
   - First Name: `Sarah`
   - Last Name: `Johnson`
   - Email: `sarah.j@example.com`
   - Password: `password123`
   - Phone: `+1 (555) 111-2222`
4. Click "Create"
5. ✅ Success! New patient appears in table

#### Edit a Patient
1. Find a patient in the table
2. Click the **Edit** (pencil) button
3. Change any field (except email)
4. Click "Update"
5. ✅ Changes are saved!

#### Delete a Patient
1. Find a patient in the table
2. Click the **Delete** (trash) button
3. Confirm in the dialog
4. ✅ User marked as inactive!

---

## 📊 Understanding the Dashboard

```
┌──────────────────────────────────────────────┐
│  🎯 MindCare AI Admin Dashboard              │
├──────────────────────────────────────────────┤
│                                              │
│  👥 Patients | 👨‍⚕️ Psychiatrists | 🔬 Researchers │
│
│  👤 Patients                    [+ Add Patient]
│  3 patients found
│
│  ┌────────────────────────────────────────┐
│  │ Name          │ Email │ Role  │ Actions│
│  ├────────────────────────────────────────┤
│  │ John Patient  │ ...   │ 👥    │ ✏️ 🗑️ │
│  │ Sarah Johnson │ ...   │ 👥    │ ✏️ 🗑️ │
│  │ Mike Davis    │ ...   │ 👥    │ ✏️ 🗑️ │
│  └────────────────────────────────────────┘
│
└──────────────────────────────────────────────┘
```

---

## 🎯 Common Tasks

### Create Different User Types

#### Add a Researcher
```
1. Click "Researchers" tab
2. Click "Add Researcher"
3. Fill form (IMPORTANT: specialization required!)
   - First Name: Dr. Michael
   - Last Name: Smith
   - Email: michael.s@example.com
   - Password: password123
   - Specialization: Psychology & Neuroscience
4. Click "Create"
```

#### Add a Data Scientist
```
1. Click "Data Scientists" tab
2. Click "Add Data Scientist"
3. Fill form (IMPORTANT: specialization required!)
   - First Name: Emily
   - Last Name: Chen
   - Email: emily.c@example.com
   - Password: password123
   - Specialization: Machine Learning
4. Click "Create"
```

#### Add a Psychiatrist
```
1. Click "Psychiatrists" tab
2. Click "Add Psychiatrist"
3. Fill form:
   - First Name: Dr. Sarah
   - Last Name: Williams
   - Email: sarah.w@example.com
   - Password: password123
   - Phone: +1 (555) 222-3333
4. Click "Create"
```

### Change User Phone or Bio
```
1. Find user in table
2. Click Edit button
3. Change phone or bio
4. Click Update
5. Done!
```

### Deactivate a User
```
1. Find user in table
2. Click Delete button (trash icon)
3. Click "Delete" in confirmation dialog
4. User is now inactive (can't login)
5. Data is preserved in database
```

---

## 🎓 Understanding User Roles

| Role | Purpose | Special Fields |
|------|---------|-----------------|
| **Patient** | Users seeking mental health support | None |
| **Psychiatrist** | Licensed medical professionals | None (optional bio) |
| **Researcher** | Research professionals | ⭐ Specialization required |
| **Data Scientist** | Data specialists | ⭐ Specialization required |

⭐ = Required field for this role

---

## 🔑 Demo Accounts

All demo accounts use password: `password123`

| Email | Role | Password |
|-------|------|----------|
| `admin@example.com` | Admin | password123 |
| `patient@example.com` | Patient | password123 |
| `researcher@example.com` | Researcher | password123 |
| `datascientist@example.com` | Data Scientist | password123 |

---

## ⚠️ Important Notes

### Email is Unique
- Each user must have a unique email
- You cannot change email once created
- The system will reject duplicate emails

### Passwords are Hashed
- Passwords are securely hashed with bcrypt
- Only you (admin) can reset forgotten passwords
- Users enter their password at login

### Deletion is Soft
- When you delete a user, they're marked as "inactive"
- The data stays in the database
- The user can't login but can be reactivated
- Historical data is preserved

### Form Validation
- All required fields must be filled
- Email must contain "@"
- Researchers and Data Scientists must have specialization
- Phone is optional for everyone

---

## 🚨 Troubleshooting

### Can't Access Admin Panel?
- ✅ Verify you logged in with admin account
- ✅ Check you're at http://localhost:3000/admin
- ✅ Try logging out and back in

### Form Won't Submit?
- ✅ Check all required fields are filled (red *asterisk)
- ✅ Verify email contains "@" symbol
- ✅ Check email isn't already used
- ✅ For Researcher/Data Scientist, fill specialization

### User Not Showing in Table?
- ✅ Refresh the page
- ✅ Check you're on the correct tab
- ✅ Check the API response in browser console

### Form Has an Error?
- ✅ Read the error message below the field
- ✅ Fix the field as indicated
- ✅ Try submitting again

---

## 💡 Pro Tips

### Batch Operations
You can quickly add multiple users by:
1. Click "Add [Type]" → Fill form → Click Create
2. Form stays open, ready for next user
3. Repeat until done
4. Close form when finished

### Search & Filter
Use browser's table search (Ctrl+F) to find users by:
- Name
- Email
- Phone

### Email Pattern Ideas
For testing, try:
- `user+timestamp@example.com`
- `firstname.lastname@example.com`
- `department.name@example.com`

### Password Requirements
For testing passwords, use:
- `password123` (simple)
- `Test@Password123` (complex)
- `12345678` (numbers only)

---

## 📱 Mobile Access

The admin panel is fully responsive!

- ✓ Works on tablets
- ✓ Works on phones
- ✓ Touch-friendly buttons
- ✓ Responsive tables
- ✓ Mobile forms

Just access from your mobile: `http://your-ip:3000/admin`

---

## 🔗 Related Documentation

For more detailed information, see:

1. **ADMIN_PANEL.md** - Complete admin panel features
2. **ADMIN_API_TESTING.md** - API endpoint testing guide
3. **ADMIN_ARCHITECTURE.md** - Technical architecture diagrams
4. **ADMIN_PANEL_SETUP.md** - Full setup and deployment guide

---

## ✨ You're Ready!

You now have a fully functional admin panel. Start by:

1. ✅ Log in as admin
2. ✅ Try adding a patient
3. ✅ Try editing their information
4. ✅ Try each tab (Patients, Psychiatrists, etc.)
5. ✅ Explore all features!

---

## 🎓 What's Next?

After getting comfortable with the basics:

- Learn about soft deletes and data preservation
- Explore the API endpoints for automation
- Set up role-based permissions for different admins
- Create automated user provisioning scripts
- Integrate with your user onboarding system

---

**Questions?** Check the detailed documentation files or review the code:
- Frontend: `/app/admin/page.jsx`
- Components: `/app/components/Admin/*`
- Backend: `/app/api/admin/users/route.js`

**Happy managing!** 🎉
