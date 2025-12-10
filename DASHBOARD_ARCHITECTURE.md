# Dashboard Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        MINDCARE AI DASHBOARD                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    USER AUTHENTICATION                   │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Login: patient@example.com / password123         │  │  │
│  │  │  User stored in: localStorage.getItem('user')    │  │  │
│  │  │  Contains: id, firstName, email, role, phone     │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              DASHBOARD UI COMPONENTS                     │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ useEffect Hook (Runs on Mount)                    │  │  │
│  │  │  ├─ Get user from localStorage                   │  │  │
│  │  │  ├─ Fetch mood entries                           │  │  │
│  │  │  ├─ Fetch health data                            │  │  │
│  │  │  └─ Fetch psychiatrist bookings                  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ State Management (useState)                       │  │  │
│  │  │  ├─ user: User object                             │  │  │
│  │  │  ├─ moodEntries: Array[MoodEntry]               │  │  │
│  │  │  ├─ healthData: Array[HealthData]               │  │  │
│  │  │  ├─ bookings: Array[Booking]                    │  │  │
│  │  │  ├─ moodStats: { average, trend, improvement }  │  │  │
│  │  │  └─ loading: boolean                            │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ UI Sections                                       │  │  │
│  │  │  ├─ Header with welcome message                 │  │  │
│  │  │  ├─ Summary Cards (3 columns)                   │  │  │
│  │  │  │   ├─ Overall Mood Card                       │  │  │
│  │  │  │   ├─ Health Conditions Card                  │  │  │
│  │  │  │   └─ Next Appointment Card                   │  │  │
│  │  │  ├─ Mood Trend Chart (14-day bar chart)        │  │  │
│  │  │  ├─ Recent Mood Entries Panel                   │  │  │
│  │  │  ├─ Health Conditions Panel                     │  │  │
│  │  │  └─ Quick Action Buttons                        │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                 API LAYER & DATABASE
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Dashboard)                       │
│                                                                  │
│  const user = localStorage.getItem('user')  // User ID=1       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
    (API Call 1)       (API Call 2)       (API Call 3)
fetchMoodEntries(1)  fetchHealthData(1)  fetchBookings()
        ↓                   ↓                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API ROUTES (Backend)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GET /api/mood?userId=1                                        │
│  ├─ getDatabase().authenticate()                               │
│  ├─ MoodEntry.findAll({ where: { userId: 1 } })              │
│  └─ Return: [MoodEntry, MoodEntry, ...]                       │
│                                                                  │
│  GET /api/health?userId=1                                      │
│  ├─ getDatabase().authenticate()                               │
│  ├─ HealthData.findAll({ where: { userId: 1 } })             │
│  └─ Return: [HealthData, HealthData, ...]                     │
│                                                                  │
│  GET /api/bookings                                             │
│  ├─ getDatabase().authenticate()                               │
│  ├─ Booking.findAll()                                          │
│  ├─ Enrich with psychiatrist data                              │
│  └─ Return: [Booking, Booking, ...]                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SEQUELIZE ORM (Models)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MoodEntry.findAll()  → Query mood_entries table              │
│  HealthData.findAll() → Query health_data table               │
│  Booking.findAll()    → Query bookings table                  │
│  Psychiatrist.findByPk() → Query psychiatrists table          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      MYSQL DATABASE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tables:                                                         │
│  ├─ mood_entries      (userId, moodLevel, moodLabel, ...)     │
│  ├─ health_data       (userId, condition, severity, ...)      │
│  ├─ bookings          (psychiatristId, userName, bookingDate) │
│  ├─ psychiatrists     (name, specialization, rating, ...)     │
│  ├─ users             (firstName, email, password, ...)       │
│  ├─ resources         (title, description, category, ...)     │
│  └─ sequelize_metadata (schema version tracking)              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                      JSON Response
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Dashboard)                         │
│                                                                  │
│  State Update:                                                   │
│  setMoodEntries(moods)      // Store mood array                │
│  setHealthData(health)      // Store health array              │
│  setBookings(userBookings)  // Filter & store bookings         │
│  setMoodStats({ ... })      // Calculate statistics            │
│                                                                  │
│  Render:                                                         │
│  ├─ Summary Cards (display mood, conditions, appointment)     │
│  ├─ Mood Chart (visualize 14-day trend)                       │
│  ├─ Recent Entries (list last 5 moods)                        │
│  └─ Health Conditions (display all conditions)                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌──────────────────────────────────────────────────────────────┐
│                         USERS TABLE                          │
├──────────┬───────────┬──────────┬────────────────────────────┤
│ id (PK)  │ firstName │ email    │ password (bcrypt hashed)   │
├──────────┼───────────┼──────────┼────────────────────────────┤
│ 1        │ John      │ patient@.│ $2a$10$...                 │
│ 2        │ Dr. Sarah │ research │ $2a$10$...                 │
└──────────┴───────────┴──────────┴────────────────────────────┘
           ↓                                ↓
    ┌──────────────────────────────┐  ┌──────────────────┐
    │   MOOD_ENTRIES TABLE         │  │ HEALTH_DATA TAB  │
    ├────────┬───────┬──────────────┤  ├────┬──────────┐  │
    │userId  │mood   │moodLabel     │  │usr │condition │  │
    │(FK)    │Level  │              │  │(FK)│          │  │
    ├────────┼───────┼──────────────┤  ├────┼──────────┤  │
    │1       │7      │good          │  │1   │Anxiety   │  │
    │1       │8      │great         │  │1   │Sleep     │  │
    │1       │6      │okay          │  └────┴──────────┘  │
    └────────┴───────┴──────────────┘
           ↓
    ┌──────────────────────────────┐
    │   BOOKINGS TABLE             │
    ├────────┬──────┬──────────────┤
    │psychiat│user  │bookingDate   │
    │istId   │Email │              │
    │(FK)    │      │              │
    ├────────┼──────┼──────────────┤
    │1       │pat...│2024-12-15    │
    └────────┴──────┴──────────────┘
           ↓
    ┌──────────────────────────────┐
    │   PSYCHIATRISTS TABLE        │
    ├────────┬───────┬──────────────┤
    │id (PK) │name   │specialization│
    ├────────┼───────┼──────────────┤
    │1       │Dr. S. │Anxiety       │
    │2       │Dr. M. │Depression    │
    └────────┴───────┴──────────────┘
```

## Component Interaction

```
┌────────────────────────────────────────────────┐
│        DashboardPage (Client Component)        │
│  'use client' - Runs in browser                │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  useEffect(() => {                       │ │
│  │    // 1. Get user from localStorage     │ │
│  │    // 2. Call API functions             │ │
│  │    // 3. Update state                   │ │
│  │    // 4. Calculate statistics           │ │
│  │  }, [])                                 │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  State Variables (useState)              │ │
│  │  • user: User object                     │ │
│  │  • moodEntries: Mood[]                   │ │
│  │  • healthData: Health[]                  │ │
│  │  • bookings: Booking[]                   │ │
│  │  • loading: boolean                      │ │
│  │  • moodStats: { ... }                    │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  Render Function                         │ │
│  │  ├─ If loading → Show spinner           │ │
│  │  └─ Else → Render:                      │ │
│  │      ├─ Header                          │ │
│  │      ├─ Summary Cards                   │ │
│  │      │   ├─ OverallMoodCard             │ │
│  │      │   ├─ HealthCard                  │ │
│  │      │   └─ AppointmentCard             │ │
│  │      ├─ MoodTrendChart                  │ │
│  │      │   └─ Bar visualization           │ │
│  │      ├─ RecentMoodEntries               │ │
│  │      ├─ HealthConditionsList            │ │
│  │      └─ QuickActions                    │ │
│  └──────────────────────────────────────────┘ │
│                                                │
└────────────────────────────────────────────────┘
```

## API Function Flow

```
Dashboard Component
        ↓
useEffect Hook
        ↓
┌─────────────────────────────────────────────┐
│  Parallel API Calls (Promise.all)          │
│                                             │
│  ├─ fetchMoodEntries(userId, 30)           │
│  │   └─ fetch('/api/mood?userId=1&...')    │
│  │       └─ Returns: MoodEntry[]           │
│  │                                         │
│  ├─ fetchHealthData(userId)                │
│  │   └─ fetch('/api/health?userId=1')      │
│  │       └─ Returns: HealthData[]          │
│  │                                         │
│  └─ fetchBookings()                        │
│      └─ fetch('/api/bookings')             │
│          └─ Returns: Booking[] (enriched)  │
│                                             │
└─────────────────────────────────────────────┘
        ↓
Data Processing
        ├─ Filter bookings by user
        ├─ Calculate mood average
        ├─ Determine trend
        └─ Calculate improvement delta
        ↓
State Updates (setState calls)
        ↓
Component Re-renders with data
```

## Statistics Calculation

```
Mood Data: [9, 8, 7, 8, 6, 5, 4, 8, 7, 9]
           
Step 1: Calculate Average
├─ Sum: 9+8+7+8+6+5+4+8+7+9 = 71
├─ Count: 10
└─ Average: 71 ÷ 10 = 7.1 → Rounded to 7

Step 2: Separate into periods
├─ Recent 7 days: [9, 8, 7, 8, 6, 5, 4] → Avg = 6.7 → 7
└─ Overall avg: 7

Step 3: Determine trend
├─ Recent avg (7) > Overall avg (7)? No
├─ Recent avg (7) < Overall avg (7)? No
└─ Result: STABLE

Step 4: Calculate improvement
├─ Improvement = Recent avg - Overall avg
└─ Result: 0 (stable, no change)

Step 5: Display
├─ Card shows: "7/10"
├─ Trend badge: "Stable"
└─ Delta: "0" (no change)
```

## Psychiatrist Data Enrichment

```
Booking in database:
{
  id: 1,
  psychiatristId: 2,
  userEmail: 'patient@example.com',
  bookingDate: '2024-12-20',
  status: 'confirmed'
}
        ↓
API enrichment logic:
1. Check if psychiatristId exists
2. Query: Psychiatrist.findByPk(2)
3. Get psychiatrist data:
   {
     id: 2,
     name: 'Dr. Michael Chen',
     specialization: 'Depression & Mood'
   }
        ↓
4. Add to booking object:
   booking.dataValues.psychiatristName = 'Dr. Michael Chen'
   booking.dataValues.psychiatristSpecialization = 'Depression & Mood'
        ↓
Enriched response:
{
  id: 1,
  psychiatristId: 2,
  psychiatristName: 'Dr. Michael Chen',        ← NEW
  psychiatristSpecialization: 'Depression & Mood', ← NEW
  userEmail: 'patient@example.com',
  bookingDate: '2024-12-20',
  status: 'confirmed'
}
```

---

This architecture ensures:
- ✅ Clear separation of concerns
- ✅ Efficient data loading
- ✅ Real-time state management
- ✅ Responsive user interface
- ✅ Scalable database design
