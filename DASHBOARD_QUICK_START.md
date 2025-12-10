# Dashboard Quick Start

## 🚀 3-Step Setup

### Step 1: Initialize Database
```bash
node lib/initDb.js
```
This creates tables and seeds demo data including:
- 3 psychiatrists
- 4 demo users  
- 10 sample mood entries
- 2 health conditions

### Step 2: Start Development Server
```bash
npm run dev
```
App will be available at `http://localhost:3000`

### Step 3: Login and View Dashboard
1. Go to `http://localhost:3000/auth/signin`
2. Use demo credentials:
   - **Email:** patient@example.com
   - **Password:** password123
3. You'll be redirected to personalized dashboard

## 📊 Dashboard Features at a Glance

| Feature | Location | What It Shows |
|---------|----------|---------------|
| Overall Mood | Top Left Card | Average mood (1-10) + trend |
| Health Conditions | Top Middle Card | Number of tracked conditions |
| Next Appointment | Top Right Card | Booked psychiatrist details |
| Mood Trend | Large Chart | 14-day mood visualization |
| Recent Moods | Bottom Left | Last 5 mood entries |
| Conditions List | Bottom Right | All health conditions |

## 🎯 Key Features

✅ **Mood Tracking**
- Log daily mood (1-10 scale)
- Track problems and improvements
- View 14-day trend chart
- Historical entries list

✅ **Health Conditions**
- Track multiple conditions
- Severity levels (mild/moderate/severe)
- Status tracking (active/in-remission/resolved)
- Treatment timeline

✅ **Psychiatrist Integration**
- View booked appointments
- See psychiatrist details
- Quick booking button if needed
- Appointment status tracking

✅ **Data Visualization**
- Interactive mood trend chart
- Color-coded severity indicators
- Responsive mobile design
- Real-time data updates

## 🔌 API Endpoints

### Mood Entries
```javascript
// Get mood entries
GET /api/mood?userId=1&limit=30

// Create mood entry
POST /api/mood
{
  "userId": 1,
  "moodLevel": 7,
  "moodLabel": "good",
  "problem": "work stress",
  "improvement": "exercise helped"
}

// Update mood entry
PUT /api/mood?id=1
{ "moodLevel": 8 }

// Delete mood entry
DELETE /api/mood?id=1
```

### Health Data
```javascript
// Get health data
GET /api/health?userId=1

// Create health condition
POST /api/health
{
  "userId": 1,
  "condition": "anxiety",
  "severity": "moderate",
  "description": "General anxiety",
  "treatmentStartDate": "2024-01-15",
  "status": "active"
}

// Update condition
PUT /api/health?id=1
{ "severity": "mild", "status": "improving" }

// Delete condition
DELETE /api/health?id=1
```

## 📱 Responsive Design

- **Desktop**: 3-column layout with full charts
- **Tablet**: 2-column layout
- **Mobile**: Stacked single-column layout

## 🎨 Theme Colors

- **Blue**: Mood & overall health
- **Purple**: Health conditions
- **Green**: Appointments & positive progress
- **Red**: Severe conditions/problems
- **Yellow**: Moderate severity/caution

## 💾 Data Persistence

All data stored in MySQL:
- User mood entries
- Health conditions
- Psychiatrist bookings
- User profiles
- Timestamps and history

## 🔄 Automatic Loading

Dashboard automatically loads on page load:
```javascript
useEffect(() => {
  // Loads mood entries, health data, and bookings
  // Calculates statistics
  // Updates UI with data
}, [])
```

## 📈 Statistics Calculated

- **Average Mood**: Mean of all entries
- **Trend**: Improving/Declining/Stable
- **Improvement Delta**: Recent vs overall comparison
- **Condition Count**: Total health conditions
- **Appointment Status**: Upcoming/Past/Confirmed

## 🛠️ Customization

### Add More Mood Labels
Edit `lib/models/MoodEntry.js`:
```javascript
moodLabel: {
  type: DataTypes.ENUM('terrible', 'bad', 'poor', 'okay', 'good', 'great', 'excellent'),
}
```

### Change Chart Display Days
Edit `app/dashboard/page.jsx`:
```javascript
// Change from 14 to your preferred number
moodEntries.slice(0, 14).reverse()
```

### Add New Health Fields
Edit `lib/models/HealthData.js`:
```javascript
// Add new field
newField: {
  type: DataTypes.STRING,
  allowNull: true,
}
```

## 🐛 Common Issues

**"Database not initialized"**
- Run: `node lib/initDb.js`

**No mood data showing**
- Add entries via API or use demo data
- Check userId in localStorage matches database

**Psychiatrist name not showing**
- Ensure psychiatrist ID exists in database
- Check `lib/initDb.js` for seeding

**Build errors**
- Run: `npm install`
- Run: `npm run build`

## 📞 Support

Check logs for debugging:
- Frontend: Browser DevTools (F12)
- Backend: Terminal console output
- Database: MySQL error logs

---

**Happy tracking! 🎉**
