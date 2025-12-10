# User Dashboard Implementation - Complete Guide

## 🎯 Overview
A comprehensive user dashboard has been created for MindCare AI that displays personal health data, mood tracking with graphs, health conditions, and booked psychiatrist appointments. All data loads from MySQL database with Sequelize ORM.

## ✨ Features Implemented

### 1. **Health Data Models**
- **MoodEntry Model** (`lib/models/MoodEntry.js`)
  - Tracks daily mood levels (1-10)
  - Mood labels: terrible, bad, poor, okay, good, great, excellent
  - Captures problems, improvements, and notes
  - Timestamped entries for historical tracking

- **HealthData Model** (`lib/models/HealthData.js`)
  - Records health conditions with severity levels (mild, moderate, severe)
  - Status tracking (active, in-remission, resolved)
  - Treatment start date and last updated tracking
  - Detailed condition descriptions

### 2. **API Endpoints**

#### Mood Tracking API (`/app/api/mood/route.js`)
```
GET  /api/mood?userId={id}&limit=30          # Fetch mood entries
POST /api/mood                                # Create mood entry
PUT  /api/mood?id={id}                       # Update mood entry
DELETE /api/mood?id={id}                     # Delete mood entry
```

#### Health Data API (`/app/api/health/route.js`)
```
GET  /api/health?userId={id}                 # Fetch health data
POST /api/health                             # Create health record
PUT  /api/health?id={id}                    # Update health record
DELETE /api/health?id={id}                  # Delete health record
```

#### Enhanced Bookings API (`/app/api/bookings/route.js`)
- Now includes psychiatrist name and specialization
- Supports filtering by userEmail
- Returns sorted bookings by date

### 3. **API Client Functions** (`lib/api-client.js`)

**Mood Entry Functions:**
- `fetchMoodEntries(userId, limit)` - Get all mood entries
- `createMoodEntry(data)` - Log new mood
- `updateMoodEntry(id, data)` - Update mood entry
- `deleteMoodEntry(id)` - Remove mood entry

**Health Data Functions:**
- `fetchHealthData(userId)` - Get health conditions
- `createHealthData(data)` - Add health condition
- `updateHealthData(id, data)` - Update condition
- `deleteHealthData(id)` - Remove condition

### 4. **Interactive Dashboard** (`app/dashboard/page.jsx`)

#### Key Sections:

**Summary Cards (Top Section)**
- **Overall Mood Card**: Shows average mood (1-10) with trend indicator
  - Displays improving/declining/stable status
  - Shows improvement delta compared to recent period
  
- **Health Conditions Card**: Count of tracked conditions
  - Lists top 2 conditions with severity indicators
  - Color-coded severity (red=severe, yellow=moderate, green=mild)

- **Next Appointment Card**: Next booked psychiatrist
  - Shows psychiatrist name and date
  - Displays time slot and confirmation status
  - Quick "Book Now" button if no appointments

**Mood Trend Chart (14-Day Visualization)**
- Interactive bar chart showing last 14 days of mood data
- Color gradient from blue
- Hover tooltips showing exact day and mood value
- Responsive design with scrolling on mobile
- Displays encouraging message if no data yet

**Recent Mood Entries Panel**
- Shows last 5 mood entries in detail
- Color-coded mood level circles (green ≥8, yellow ≥5, red <5)
- Expandable sections for:
  - Problem descriptions (red background)
  - Improvements (green background)
  - Additional notes (blue background)
- Timestamps for each entry

**Health Conditions Panel**
- Detailed list of all tracked health conditions
- Shows condition name, status, and severity
- Displays treatment start date
- Full condition descriptions

**Quick Action Buttons**
- Chat with AI Support (blue)
- Browse Psychiatrists (purple)
- Wellness Resources (green)

## 🗄️ Database Initialization

Updated `lib/initDb.js` now seeds:
- 3 sample psychiatrists
- 3 wellness resources
- 4 demo users (patient, researcher, data scientist, admin)
- 10 sample mood entries for demo user
- 2 sample health conditions

**Run initialization:**
```bash
node lib/initDb.js
```

**Demo Credentials:**
- Patient: patient@example.com / password123
- Researcher: researcher@example.com / password123
- Data Scientist: datascientist@example.com / password123
- Admin: admin@example.com / password123

## 🔧 User Authentication Integration

Dashboard retrieves user from localStorage:
```javascript
const user = JSON.parse(localStorage.getItem('user'))
```

User data is set during login/registration and contains:
- id, firstName, lastName, email, role, etc.

## 📊 Mood Statistics Calculation

The dashboard automatically calculates:
- **Average Mood**: Mean of all mood entries
- **Trend Analysis**: Compares recent 7 days vs overall average
  - Improving: recent avg > overall avg
  - Declining: recent avg < overall avg
  - Stable: recent avg = overall avg
- **Improvement Delta**: Numeric difference shown in trend display

## 🎨 UI/UX Features

### Design Elements
- Gradient backgrounds (blue to white)
- Card-based layout with shadows and hover effects
- Color-coded severity indicators
- Responsive grid system (1-3 columns based on screen size)
- Loading spinner animation
- Smooth transitions and hover states

### Data Visualization
- Bar chart for mood trends
- Color-coded mood levels
- Status badges with appropriate colors
- Icon-based section headers (Lucide React)

### User Experience
- Loading state while data fetches
- Redirects to signin if not authenticated
- Empty state messages with action buttons
- Hover tooltips on chart
- Accessible semantic HTML

## 🚀 Getting Started

### 1. Initialize Database
```bash
node lib/initDb.js
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Login to Dashboard
- Navigate to `/auth/signin`
- Use demo credentials: patient@example.com / password123
- Redirects to personalized dashboard

### 4. Add Health Data (Optional)
Use the API to add real data:
```bash
# Log mood entry
curl -X POST http://localhost:3000/api/mood \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "moodLevel": 7,
    "moodLabel": "good",
    "problem": "Work stress",
    "improvement": "Talked to friend"
  }'

# Add health condition
curl -X POST http://localhost:3000/api/health \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "condition": "Anxiety",
    "severity": "moderate",
    "description": "General anxiety with triggers"
  }'
```

## 📁 File Structure

```
lib/
├── models/
│   ├── MoodEntry.js        (NEW)
│   ├── HealthData.js       (NEW)
│   ├── User.js
│   ├── Psychiatrist.js
│   ├── Booking.js
│   └── Resource.js
├── api-client.js           (ENHANCED)
├── initDb.js              (ENHANCED)
└── database.js

app/
├── api/
│   ├── mood/
│   │   └── route.js       (NEW)
│   ├── health/
│   │   └── route.js       (NEW)
│   └── bookings/
│       └── route.js       (ENHANCED)
└── dashboard/
    └── page.jsx           (COMPLETELY REDESIGNED)
```

## 🔐 Data Privacy & Security

- All patient data associated with userId
- Bookings filtered by userEmail for privacy
- Password hashing with bcryptjs
- User authentication required for dashboard access
- No sensitive data in localStorage beyond user metadata

## 🐛 Troubleshooting

### Data Not Loading?
1. Verify MySQL database is running
2. Check .env.local credentials
3. Run `node lib/initDb.js` to reinitialize
4. Check browser console for error messages

### Build Errors?
```bash
npm run build
```

### Database Connection Issues?
Check these environment variables in `.env.local`:
```
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=mindcare_db
DATABASE_PORT=3306
```

## 📈 Future Enhancements

Potential additions:
- Export mood/health data to PDF/CSV
- Goal setting and progress tracking
- Medication/treatment timeline
- Therapist notes integration
- Advanced analytics dashboard
- Mobile app notifications
- Mood prediction using ML
- Social support features
- Integration with wearable devices

## ✅ Verification Checklist

- ✅ Models created and synced to MySQL
- ✅ API routes functioning with proper error handling
- ✅ API client functions integrated
- ✅ Dashboard loads data on mount
- ✅ Mood chart displays 14-day data
- ✅ Health conditions listed with severity
- ✅ Psychiatrist appointments shown
- ✅ Responsive design verified
- ✅ Empty states handled gracefully
- ✅ Authentication integration working
- ✅ Database initialization with seed data
- ✅ Build passes without errors

---

**Version:** 1.0.0  
**Last Updated:** December 10, 2025  
**Status:** ✨ Complete and Tested
