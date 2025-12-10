# Dashboard Visual Guide

## 🎨 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Welcome back, John                                              │
│  Track your mental health progress and connect with professionals
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  │ ❤️ OVERALL MOOD  │  │💊 HEALTH CONDS  │  │📅 APPOINTMENT   │
│  │                  │  │                  │  │                  │
│  │ 7/10             │  │ 2 conditions     │  │ Dr. Michael Chen │
│  │                  │  │                  │  │                  │
│  │ Stable ➡️        │  │ Anxiety (mod)    │  │ Dec 20, 2024     │
│  │ No change        │  │ Sleep (mild)     │  │ 2:00 PM - 3:00PM │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 MOOD TREND (LAST 14 DAYS)                                   │
│                                                                  │
│   10 │                                                           │
│       │                                    ▄▄                   │
│    8  │         ▄▄           ▄▄ ▄▄ ▄▄ ▄▄ █                      │
│       │    ▄▄  █  ▄▄  ▄▄     █  █  █  █  █                      │
│    6  │   █    █  █   █  ▄▄ █   █  █  █  █ ▄▄                  │
│       │   █    █  █   █  █  █   █  █  █  █ █                   │
│    4  │   █    █  █   █  █  █   █  █  █  █ █                   │
│       │                                    █                     │
│    2  │                                                           │
│  ────┼──────────────────────────────────────────────────────────│
│    0   D1  D2  D3 D4  D5 D6  D7 D8 D9 D10 D11D12D13D14          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐
│  │ 😊 RECENT MOOD ENTRIES      │  │ 💊 HEALTH CONDITIONS        │
│  │                             │  │                             │
│  │ [9] GREAT - Dec 10          │  │ • Anxiety Disorder          │
│  │      ✓ Felt energetic       │  │   Severity: Moderate        │
│  │      ✓ Great day            │  │   Status: Active            │
│  │                             │  │   Since: Jan 15, 2024       │
│  │ [8] GREAT - Dec 9           │  │                             │
│  │      ✓ Good mood            │  │ • Sleep Issues              │
│  │      ✓ Productive work      │  │   Severity: Mild            │
│  │                             │  │   Status: Active            │
│  │ [7] GOOD - Dec 8            │  │   Since: Feb 1, 2024        │
│  │      ? Work stress          │  │                             │
│  │      ✓ Exercise helped      │  │                             │
│  │                             │  │                             │
│  │ [6] OKAY - Dec 7            │  │                             │
│  │      ? Tired today          │  │                             │
│  │      • Notes: Work stress   │  │                             │
│  │                             │  │                             │
│  │ [5] POOR - Dec 6            │  │                             │
│  │      ? Anxiety              │  │                             │
│  │      • Notes: Panic attack  │  │                             │
│  └─────────────────────────────┘  └─────────────────────────────┘
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  QUICK ACTIONS                                                  │
│                                                                  │
│  [💬 Chat with AI Support]  [👨‍⚕️ Browse Psychiatrists]  [📚 Resources] │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Each Section Explained

### 1. Header Section
```
Welcome back, John
Track your mental health progress and connect with professionals

→ Shows user's first name from login
→ Motivational message
```

### 2. Summary Cards Row

#### Overall Mood Card
```
┌──────────────────────┐
│ ❤️ OVERALL MOOD      │
├──────────────────────┤
│ 7/10                 │ ← Average of all mood entries
│                      │
│ Stable ➡️            │ ← Improving/Declining/Stable
│ No change            │ ← Improvement delta (-2, +1, 0, etc)
└──────────────────────┘

Color: Blue border
Usage: At-a-glance mood overview
```

#### Health Conditions Card
```
┌──────────────────────┐
│ 💊 HEALTH CONDITIONS │
├──────────────────────┤
│ 2                    │ ← Total count
│                      │
│ Anxiety (moderate)   │ ← Top 2 conditions
│ Sleep (mild)         │ ← with severity badges
└──────────────────────┘

Color: Purple border
Badge colors: Red=severe, Yellow=moderate, Green=mild
Usage: Condition count and severity at a glance
```

#### Appointment Card
```
┌──────────────────────┐
│ 📅 NEXT APPOINTMENT  │
├──────────────────────┤
│ Dr. Michael Chen     │ ← Psychiatrist name
│                      │
│ Dec 20, 2024         │ ← Date
│ 2:00 PM - 3:00 PM    │ ← Time slot
│ [Confirmed]          │ ← Status badge
└──────────────────────┘

Color: Green border
Status colors: Green=confirmed, Yellow=pending
No booking? Shows "Book Now" button
Usage: Next appointment reference
```

### 3. Mood Trend Chart
```
Features:
  • 14-day bar chart
  • Each bar = 1 day of mood data
  • Bar height = mood level (1-10)
  • Blue gradient coloring
  • Hover shows: "Day X: Y" (e.g., "Day 5: 8")
  • Responsive: Scrolls on mobile
  • Empty state: "No mood data yet" message

Interpretation:
  • Taller bars = Better mood
  • Pattern = Trend over time
  • Upward trend = Improving
  • Downward trend = Declining
```

### 4. Recent Mood Entries Panel
```
Each entry shows:
  ┌─────────────────────────┐
  │ [7] GOOD - Dec 8, 2024  │ ← Mood level, label, date
  │                         │
  │ ? Work stress           │ ← Problem (if provided)
  │ ✓ Exercise helped       │ ← Improvement (if provided)
  │ • Additional notes      │ ← Notes (if provided)
  └─────────────────────────┘

Color coding:
  • Red background = Problem section
  • Green background = Improvement section
  • Blue background = Notes section
  • Red circle [7] = Poor mood
  • Yellow circle [7] = Okay mood
  • Green circle [9] = Great mood

Shows: Last 5 entries (most recent first)
```

### 5. Health Conditions List
```
Each condition shows:
  ┌──────────────────────────────────┐
  │ Anxiety Disorder                 │ ← Condition name
  │ Status: Active      [Moderate]   │ ← Status & severity badge
  │                                  │
  │ Generalized anxiety with panic   │ ← Description
  │ episodes                         │
  │ Started: Jan 15, 2024            │ ← Treatment start date
  └──────────────────────────────────┘

Badge colors:
  • Green = Mild
  • Yellow = Moderate
  • Red = Severe

Shows: All tracked conditions
```

### 6. Quick Action Buttons
```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 💬 CHAT WITH AI     │  │ 👨‍⚕️ BROWSE PSYCH    │  │ 📚 WELLNESS         │
│                     │  │                     │  │ RESOURCES           │
│ Get instant support │  │ Connect with experts│  │ Explore mental      │
│ and guidance        │  │ and health experts  │  │ health tools        │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

Colors: Blue, Purple, Green (gradient backgrounds)
Usage: Quick navigation to other features
```

---

## 📊 Data Color Legend

### Mood Level Colors
```
🟢 GREEN (≥8)     Excellent/Great mood
🟡 YELLOW (5-7)   Okay/Good mood  
🔴 RED (<5)       Poor/Bad/Terrible mood
```

### Severity Colors
```
🟢 GREEN    Mild condition
🟡 YELLOW   Moderate condition
🔴 RED      Severe condition
```

### Status Colors
```
🟢 GREEN    Confirmed/Active/Resolved
🟡 YELLOW   Pending/In-remission
⚫ GRAY     Cancelled/Other
```

### Trend Colors
```
🟢 GREEN    Improving (recent > overall)
🟡 YELLOW   Stable (recent = overall)
🔴 RED      Declining (recent < overall)
```

---

## 📱 Responsive Breakpoints

### Desktop (1200px+)
```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                              │
├─────────────────────────────────────────────────────────────┤
│  [Card 1]      [Card 2]      [Card 3]                       │
├─────────────────────────────────────────────────────────────┤
│                    MOOD CHART                               │
├─────────────────────────────────────────────────────────────┤
│ [Panel 1: Moods]           [Panel 2: Conditions]            │
├─────────────────────────────────────────────────────────────┤
│  [Button 1]    [Button 2]    [Button 3]                    │
└─────────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1199px)
```
┌──────────────────────────────────────┐
│         HEADER                       │
├──────────────────────────────────────┤
│ [Card 1]    [Card 2]                 │
├──────────────────────────────────────┤
│ [Card 3]                             │
├──────────────────────────────────────┤
│      MOOD CHART                      │
├──────────────────────────────────────┤
│ [Panel 1: Moods]                     │
├──────────────────────────────────────┤
│ [Panel 2: Conditions]                │
├──────────────────────────────────────┤
│ [Button 1] [Button 2] [Button 3]    │
└──────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────┐
│     HEADER       │
├──────────────────┤
│    [Card 1]      │
├──────────────────┤
│    [Card 2]      │
├──────────────────┤
│    [Card 3]      │
├──────────────────┤
│  MOOD CHART      │
│  (Scrollable)    │
├──────────────────┤
│   [Panel 1]      │
├──────────────────┤
│   [Panel 2]      │
├──────────────────┤
│  [Button 1]      │
├──────────────────┤
│  [Button 2]      │
├──────────────────┤
│  [Button 3]      │
└──────────────────┘
```

---

## 🎯 User Journey

### 1. Login
```
User goes to: /auth/signin
Enters: patient@example.com / password123
System: Authenticates & stores user in localStorage
Redirect: /dashboard
```

### 2. Dashboard Loads
```
Component: useEffect hook triggers
Action 1: Fetches mood entries from /api/mood?userId=1
Action 2: Fetches health data from /api/health?userId=1
Action 3: Fetches bookings from /api/bookings
Action 4: Calculates mood statistics
Action 5: Renders dashboard with all data
```

### 3. View Dashboard
```
User sees:
  • Summary cards with overview
  • 14-day mood trend chart
  • Recent mood entries
  • Health conditions
  • Quick action buttons
```

### 4. Optional: Add Data
```
Option 1: Log mood (via API or form)
  → POST to /api/mood
  → Data stored in database
  → Refreshing shows new entry

Option 2: Add condition (via API or form)
  → POST to /api/health
  → Data stored in database
  → Appears in conditions list
```

---

## 📊 Statistics Calculation Example

### Given Data
```
Mood entries: [9, 8, 7, 8, 6, 5, 4, 8, 7, 9]
Last 7 days: [9, 8, 7, 8, 6, 5, 4]
```

### Calculations
```
Overall Average = (9+8+7+8+6+5+4+8+7+9) ÷ 10 = 7.1 → rounds to 7
Recent Average = (9+8+7+8+6+5+4) ÷ 7 = 6.7 → rounds to 7
Trend = Recent (7) vs Overall (7) = STABLE
Improvement = 7 - 7 = 0
```

### Display
```
┌──────────────────┐
│ ❤️ OVERALL MOOD  │
│ 7/10             │
│ Stable ➡️        │
│ No change        │
└──────────────────┘
```

---

## 🔄 Data Update Flow

### When Adding New Mood Entry
```
┌─────────────────┐
│ User submits    │
│ mood form       │
└────────┬────────┘
         ↓
┌─────────────────────────────┐
│ POST /api/mood              │
│ {userId, level, label, ...} │
└────────┬────────────────────┘
         ↓
┌────────────────────────┐
│ Save to mood_entries   │
│ table in MySQL         │
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│ Return new mood entry  │
│ with ID and timestamp  │
└────────┬───────────────┘
         ↓
┌──────────────────────────┐
│ Update component state   │
│ Add new entry to array   │
└────────┬─────────────────┘
         ↓
┌──────────────────────────┐
│ Re-calculate statistics  │
│ • New average           │
│ • New trend             │
│ • New improvement delta │
└────────┬─────────────────┘
         ↓
┌──────────────────────────┐
│ Re-render dashboard      │
│ • Chart updates         │
│ • Cards update          │
│ • List updates          │
└──────────────────────────┘
```

---

## ✨ Interactive Elements

### Hover Effects
```
Chart bars:
  • Color deepens on hover
  • Tooltip shows: "Day X: Y"
  
Cards:
  • Shadow increases on hover
  • Subtle lift animation
  
Panels:
  • Shadow increases on hover
  • Entries highlight on hover
  
Buttons:
  • Color transitions on hover
  • Text translation animation
```

### Loading States
```
On first load:
  • Spinner animation
  • "Loading your dashboard..." message
  • Data fetching in progress

After load:
  • Spinner disappears
  • Dashboard fully rendered
  • All data visible
```

### Empty States
```
No mood data:
  • "No mood data yet"
  • "Start tracking to see your trend!"
  • "Log Your Mood" button

No appointments:
  • "No appointments scheduled"
  • "Book Now" button

No conditions:
  • "No health conditions recorded"
  • "Add Condition" button
```

---

## 🎨 Component Tree

```
DashboardPage
├── Header
│   └── Welcome message
├── Summary Cards Row
│   ├── OverallMoodCard
│   ├── HealthConditionsCard
│   └── AppointmentCard
├── Mood Trend Chart
│   ├── Chart Container
│   └── Bar Chart Visualization
├── Two-Column Layout
│   ├── Recent Mood Entries Panel
│   │   └── Mood Entry Items (max 5)
│   └── Health Conditions Panel
│       └── Condition Items
└── Quick Action Buttons
    ├── Chat Button
    ├── Psychiatrists Button
    └── Resources Button
```

---

This visual guide helps understand exactly what users see and how to interpret the dashboard display!
