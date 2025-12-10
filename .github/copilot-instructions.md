# MindCare AI - Copilot Instructions

AI agents working on this Next.js mental health platform should understand the following architecture, patterns, and workflows.

## Architecture Overview

**MindCare AI** is a Next.js 16 application providing AI-powered mental health support with psychiatrist booking, mood tracking, and mental health resources.

### Core Stack
- **Framework**: Next.js 16 (App Router with `'use client'` for interactive components)
- **Database**: MySQL with Sequelize ORM (configured in `lib/database.js`)
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: React 19 with Lucide React icons
- **Build**: React Compiler enabled in `next.config.mjs`

### Key Architectural Decisions
1. **Hybrid rendering**: Mix of Server Components (layouts, pages) and Client Components (`'use client'` in interactive UIs)
2. **Lazy database initialization**: Database singleton pattern in `lib/database.js` prevents connection pooling issues in dev
3. **Sequelize for ORM**: Models handle schema definition and are synced via `sequelize.sync({ alter: true })`
4. **API-first design**: All data access goes through `/app/api/*` routes, client uses `lib/api-client.js` helper functions

## Database & Models

### Setup Workflow
1. Create MySQL database: `CREATE DATABASE mindcare_db;`
2. Configure `.env.local`: `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `DATABASE_PORT`
3. Initialize: `node lib/initDb.js` (creates tables, seeds sample data)

### Model Structure
Models are defined in `lib/models/`:
- **Psychiatrist**: id, name, specialization, experience, rating, consultationFee, bio, imageUrl, availability
- **Resource**: id, title, description, category, icon, color, features (JSON)
- **Booking**: id, psychiatristId, userName, userEmail, phoneNumber, bookingDate, timeSlot, notes, status

Models use lazy initialization pattern (see `Psychiatrist.js`) - they check if database exists before defining:
```javascript
const getPsychiatrist = () => {
  if (Psychiatrist) return Psychiatrist;
  const sequelize = getDatabase();
  if (!sequelize) return null;
  // Define model...
};
export default getPsychiatrist();
```

## API Routes Pattern

All API routes follow this pattern:
- Located in `app/api/{resource}/route.js`
- Import database and models
- Call `getDatabase().authenticate()` before queries
- Return early if database is null (status 503)
- Catch errors and return detailed messages for debugging

Example (from `api/psychiatrists/route.js`):
```javascript
import { getDatabase } from '@/lib/database.js';
import Psychiatrist from '@/lib/models/Psychiatrist.js';

export async function GET(request) {
  const sequelize = getDatabase();
  if (!sequelize) return Response.json({ error: 'Database not initialized' }, { status: 503 });
  await sequelize.authenticate();
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  // Handle query...
  return Response.json(data);
}
```

## Component Patterns

### Client Components (`'use client'`)
Interactive components in `app/components/` use hooks and state management:
- **BookingForm**: Form submission via `createBooking()` from `lib/api-client.js`
- **ChatBot**: Local state for messages, simulated AI responses
- **MoodTracker**: User mood logging interface

All client components import API helpers from `lib/api-client.js` rather than calling endpoints directly.

### Server Components
Pages and layouts in `app/` don't use `'use client'`:
- `app/layout.jsx`: Root layout with Header, Footer, children
- `app/page.jsx`: Homepage
- `app/psychiatrists/page.jsx`: Psychiatrists list (server-rendered, hydrated with client component filters)

### Common Utilities
- `lib/api-client.js`: Wrapper functions for all API calls (fetchPsychiatrists, createBooking, etc.)
- `lib/auth.js`: Authentication logic
- `lib/psychiatrists.js`: Data transformation helpers

## Development Workflows

### Local Development
```bash
# Install dependencies
npm install

# Initialize database (creates tables, seeds data)
node lib/initDb.js

# Start dev server
npm run dev
# App runs on http://localhost:3000
```

### Testing APIs Manually
```bash
# Fetch all psychiatrists
curl http://localhost:3000/api/psychiatrists

# Fetch specific psychiatrist
curl "http://localhost:3000/api/psychiatrists?id=1"

# Create psychiatrist
curl -X POST http://localhost:3000/api/psychiatrists \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Test","specialization":"Test","experience":5,"rating":4.5,"consultationFee":150}'
```

### Build & Deploy
```bash
npm run build  # Builds Next.js (react-compiler enabled)
npm start      # Runs production server
npm run lint   # ESLint check
```

## Critical Conventions

### Imports
- Use `@/` alias for absolute imports (configured in `jsconfig.json`)
- API client functions: `import { fetchPsychiatrists } from '@/lib/api-client'`
- Components: `import BookingForm from '@/app/components/BookingForm'`

### Environment Variables
Required in `.env.local`:
```
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=mindcare_db
DATABASE_PORT=3306
NEXT_PUBLIC_API_URL=http://localhost:3001/api  # Optional, defaults to localhost:3001
```

### Error Handling
- API routes catch errors and return `{ error: message, debug: details }` with appropriate HTTP status
- Frontend wraps API calls in try-catch, handles empty/null responses
- Console logging uses prefixes: `[API]`, `[DB]`, `[UI]` for clarity

### File Naming
- Components: PascalCase (BookingForm, ChatBot)
- API routes: lowercase with underscores (psychiatrists, resources)
- Utilities/helpers: lowercase with underscores (api-client, database)

## Common Tasks

### Adding a New Feature
1. Create Sequelize model in `lib/models/NewModel.js` (lazy-initialized)
2. Create API route in `app/api/newmodel/route.js` with GET/POST/PUT/DELETE
3. Add helper functions to `lib/api-client.js`
4. Create client component in `app/components/NewComponent/` with `'use client'`
5. Wire into pages and layout as needed
6. Test via `npm run dev` and `curl` requests

### Debugging Database Issues
- Verify MySQL is running and accessible
- Check `.env.local` credentials match MySQL setup
- Run `node lib/initDb.js` to reinitialize tables and seed data
- Check `app/api/psychiatrists/route.js` for error logging pattern
- Use phpMyAdmin or `mysql` CLI to inspect tables directly

### Working with Middleware
`middleware.js` protects routes by checking session cookies:
- Public paths: `/`, `/auth/signin`, `/emergency`, `/about`, `/contact`, `/api/auth`
- Protected paths: `/dashboard`, `/profile`, `/chat`, `/psychiatrists`, `/appointments`
- Redirects unauthenticated requests to `/auth/signin`

## Data Flow Example: Booking a Psychiatrist

1. User fills `BookingForm` component (client-side form state)
2. Form calls `createBooking()` from `lib/api-client.js`
3. API client POST to `/api/bookings` endpoint
4. `/api/bookings/route.js` imports Booking model and calls `Booking.create()`
5. Sequelize executes INSERT query against MySQL
6. Response returned with booking ID and status
7. Component shows success message or error

## When in Doubt
- Check `DATABASE_SETUP.md` for database troubleshooting and initialization
- API routes in `app/api/` exemplify the correct pattern for database access
- `lib/api-client.js` shows all available backend endpoints
- Models in `lib/models/` define schema and available fields
