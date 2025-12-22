# MindCare AI

MindCare AI is a mental health support platform built with Next.js. It combines an AI companion, curated resources, and psychiatrist booking with a patient dashboard and admin tools.

![Dashboard preview](public/images/dashboard-preview.jpg)

## Features
- AI chat assistant with crisis-aware responses, OpenRouter support, and safe fallbacks.
- Psychiatrist directory with filters, profiles, and booking flow.
- Mood tracking and analytics dashboard (trends, risk summaries, and notes).
- Resource library with categories and feature lists.
- Role-based access for admin, patients, researchers, and data scientists.
- Admin console for user and psychiatrist management plus emergency alert review.
- Email-based password reset (SMTP optional).
- Emergency and crisis resources configurable by region.

## Tech stack
- Next.js 16 (App Router) and React 19
- Tailwind CSS 4
- Sequelize and MySQL
- NextAuth (OAuth) and custom credentials auth
- Recharts, Lucide icons, Nodemailer

## Project structure
```
app/
  api/                # Route handlers (auth, chatbot, bookings, admin, etc.)
  components/         # UI components
  auth/               # Auth pages
  admin/              # Admin dashboards
  chatbot/            # AI chat page
  dashboard/          # Patient dashboard
  psychiatrists/      # Directory and booking pages
  resources/          # Resource library
lib/
  models/             # Sequelize models
  api-client.js       # Frontend API helpers
  database.js         # Sequelize connection
  initDb.js           # Reset and seed script
public/
  images/
```

## Getting started
### Prerequisites
- Node.js 18+ recommended
- MySQL 8+ running locally or remotely

### Install
```
npm install
```

### Configure environment variables
Create `.env.local`:

```
# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_CLINIC_NAME=MindCare

# Database (MySQL)
DATABASE_NAME=mindcare_db
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_HOST=localhost
DATABASE_PORT=3306

# AI (OpenRouter or OpenAI compatible)
OPENROUTER_API_KEY=
OPENAI_API_KEY=
OPENROUTER_MODEL=openrouter/auto
CHATBOT_REGION=BD
CHATBOT_TEMPERATURE=0.7
CHATBOT_TOP_P=0.9
CHATBOT_MAX_TOKENS=550

# Emergency team
EMERGENCY_TEAM_NAME=MindCare Emergency Team
EMERGENCY_TEAM_EMAIL=support@example.com
EMERGENCY_TEAM_PHONE=+880123456789
EMERGENCY_TEAM_CONTACT=
EMERGENCY_TEAM_REGION=Bangladesh

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# SMTP (optional, for password reset emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM="MindCare <no-reply@example.com>"
```

### Initialize database (destructive)
The seed script drops and recreates tables. Use only for local development.

```
node lib/initDb.js
```

This seeds sample users and data. Demo credentials (from the seed script):
- patient@example.com / password123
- researcher@example.com / password123
- datascientist@example.com / password123
- admin@example.com / password123

### Run the app
```
npm run dev
```

Visit http://localhost:3000.

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - serve production build
- `npm run lint` - lint

## Safety note
MindCare AI provides supportive guidance and resources but is not a substitute for professional medical care. If you are in immediate danger, call your local emergency number.
