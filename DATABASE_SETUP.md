# MySQL Database Setup Guide

This guide explains how to set up and use the MySQL database integration with your MindCare AI application.

## Prerequisites

- MySQL Server installed and running (version 5.7+)
- Node.js and npm installed
- Sequelize and mysql2 (already installed in your project)

## Step 1: Create MySQL Database

### Option A: Using MySQL Command Line

```bash
mysql -u root -p
```

Then run:

```sql
CREATE DATABASE mindcare_db;
USE mindcare_db;
```

### Option B: Using phpMyAdmin

1. Open phpMyAdmin in your browser (usually `http://localhost/phpmyadmin`)
2. Click "New" on the left sidebar
3. Enter database name: `mindcare_db`
4. Click "Create"

## Step 2: Configure Environment Variables

Edit `.env.local` in your project root:

```
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=mindcare_db
DATABASE_PORT=3306
NODE_ENV=development
```

**Important:** If your MySQL has no password (default), leave `DATABASE_PASSWORD` empty.

## Step 3: Initialize the Database

Run the initialization script to create tables and seed sample data:

```bash
node lib/initDb.js
```

You should see output like:
```
✅ Database connection successful!
✅ Models synced successfully!
✅ Sample psychiatrists created!
✅ Sample resources created!
✨ Database initialization complete!
```

## Step 4: Start Your Application

```bash
npm run dev
```

Your app will now use the MySQL database!

## API Endpoints

### Psychiatrists
- `GET /api/psychiatrists` - Get all psychiatrists
- `GET /api/psychiatrists?id=1` - Get specific psychiatrist
- `POST /api/psychiatrists` - Create new psychiatrist
- `PUT /api/psychiatrists?id=1` - Update psychiatrist
- `DELETE /api/psychiatrists?id=1` - Delete psychiatrist

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources?id=1` - Get specific resource
- `POST /api/resources` - Create new resource
- `PUT /api/resources?id=1` - Update resource
- `DELETE /api/resources?id=1` - Delete resource

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings?id=1` - Update booking status

## Example: Adding New Data via API

```javascript
// Add a new psychiatrist
const response = await fetch('/api/psychiatrists', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Dr. John Doe',
    specialization: 'ADHD Specialist',
    experience: 15,
    rating: 4.8,
    consultationFee: 150,
    bio: 'Experienced ADHD specialist...'
  })
});

const newPsychiatrist = await response.json();
console.log(newPsychiatrist);
```

## Using API Client Helper

Use the provided helper functions in `lib/api-client.js`:

```javascript
import { fetchPsychiatrists, createBooking } from '@/lib/api-client';

// Fetch all psychiatrists
const psychiatrists = await fetchPsychiatrists();

// Create a booking
const booking = await createBooking({
  psychiatristId: 1,
  userEmail: 'user@example.com',
  userName: 'John Doe',
  bookingDate: new Date(),
  timeSlot: '10:00 AM',
});
```

## Viewing Data in phpMyAdmin

1. Open phpMyAdmin (`http://localhost/phpmyadmin`)
2. Click on `mindcare_db` database
3. You'll see three tables:
   - `psychiatrists` - All doctor profiles
   - `resources` - Mental health resources
   - `bookings` - Patient bookings

## Troubleshooting

### Connection Error: "Access denied for user 'root'@'localhost'"

**Solution:** Check your MySQL password in `.env.local`

```bash
# Test connection
mysql -u root -p mindcare_db
```

### Connection Error: "ER_BAD_DB_ERROR: Unknown database"

**Solution:** Create the database first:

```bash
mysql -u root -p -e "CREATE DATABASE mindcare_db;"
```

### Tables not created after running initDb.js

**Solution:** Check MySQL is running:

```bash
# On Windows
mysql -u root -p

# On Mac/Linux
sudo systemctl status mysql
```

### "Cannot find module" errors

**Solution:** Install dependencies:

```bash
npm install
```

## Backing Up Your Database

```bash
mysqldump -u root -p mindcare_db > backup.sql
```

## Restoring from Backup

```bash
mysql -u root -p mindcare_db < backup.sql
```

## Next Steps

- Update your frontend pages to fetch data from `/api` endpoints
- Add more models as needed
- Implement user authentication with the database
- Create admin dashboard to manage data

For help, check the API routes in `app/api/` and models in `lib/models/`
