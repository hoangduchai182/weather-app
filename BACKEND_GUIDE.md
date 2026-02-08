# Backend Implementation Guide

## Overview

Full-stack weather application with **Prisma ORM** + **SQLite database** for managing search history and favorite cities. Includes dark mode persistence and multi-language support (EN/VI).

---

## Database Architecture

### Technology Stack
- **ORM**: Prisma 7.3.0
- **Database**: SQLite (file-based, no server required)
- **Client**: @prisma/client with auto-generated types

### Database Schema

```prisma
// prisma/schema.prisma

model SearchHistory {
  id         Int      @id @default(autoincrement())
  city       String
  searchedAt DateTime @default(now())

  @@index([searchedAt])
}

model Favorites {
  id      Int      @id @default(autoincrement())
  city    String   @unique
  notes   String?
  addedAt DateTime @default(now())

  @@index([city])
}
```

**SearchHistory Model:**
- `id`: Auto-incrementing primary key
- `city`: City name (string)
- `searchedAt`: Timestamp (auto-generated)
- Index on `searchedAt` for efficient sorting

**Favorites Model:**
- `id`: Auto-incrementing primary key
- `city`: City name (unique constraint)
- `notes`: Optional notes (not currently used in UI)
- `addedAt`: Timestamp (auto-generated)
- Index on `city` for fast lookups

---

## API Routes

### 1. Search History API (`/api/history`)

#### GET - Fetch Recent Searches
```typescript
GET /api/history
```

**Response:**
```json
{
  "history": [
    {
      "id": 1,
      "city": "London",
      "searchedAt": "2026-02-03T08:00:00.000Z"
    }
  ]
}
```

**Features:**
- Returns last 10 unique cities
- Sorted by most recent first
- Uses `distinct` to avoid duplicates

#### POST - Add Search to History
```typescript
POST /api/history
Content-Type: application/json

{
  "city": "Paris"
}
```

**Response:**
```json
{
  "searchHistory": {
    "id": 2,
    "city": "Paris",
    "searchedAt": "2026-02-03T08:05:00.000Z"
  }
}
```

**Validation:**
- City name is required
- Trims whitespace

#### DELETE - Clear All History
```typescript
DELETE /api/history
```

**Response:**
```json
{
  "message": "Search history cleared"
}
```

---

### 2. Favorites API (`/api/favorites`)

#### GET - Fetch All Favorites
```typescript
GET /api/favorites
```

**Response:**
```json
{
  "favorites": [
    {
      "id": 1,
      "city": "Tokyo",
      "notes": null,
      "addedAt": "2026-02-03T08:10:00.000Z"
    }
  ]
}
```

**Features:**
- Returns all favorites
- Sorted by most recently added first

#### POST - Add City to Favorites
```typescript
POST /api/favorites
Content-Type: application/json

{
  "city": "New York",
  "notes": "My favorite city"
}
```

**Response (Success):**
```json
{
  "favorite": {
    "id": 2,
    "city": "New York",
    "notes": "My favorite city",
    "addedAt": "2026-02-03T08:15:00.000Z"
  }
}
```

**Response (Conflict - City Already Exists):**
```json
{
  "error": "City already in favorites"
}
```
Status Code: 409

**Validation:**
- City name is required
- Checks for duplicates before inserting
- Notes are optional

#### DELETE - Remove City from Favorites
```typescript
DELETE /api/favorites?city=Tokyo
```

**Response:**
```json
{
  "message": "Favorite removed"
}
```

**Validation:**
- City query parameter is required
- Returns 400 if city is missing

---

## Prisma Client Setup

### Singleton Pattern (`lib/prisma.ts`)

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma;
```

**Why Singleton?**
- Prevents multiple Prisma Client instances in development
- Next.js hot-reloading would create new instances otherwise
- Improves performance and prevents connection exhaustion

**Query Logging:**
- Enabled in development for debugging
- Shows SQL queries in terminal

---

## Frontend Integration

### 1. App Context (`contexts/AppContext.tsx`)

**Features:**
- **Dark Mode**: Persisted in localStorage, toggles `dark` class on `<html>`
- **Language**: EN ↔ VI toggle, persisted in localStorage
- **Translation Function**: `t(key)` for i18n

**Usage:**
```typescript
import { useApp } from '@/contexts/AppContext';

function Component() {
  const { isDark, toggleDarkMode, language, toggleLanguage, t } = useApp();

  return <h1>{t('title')}</h1>; // "Weather" or "Thời Tiết"
}
```

**Translations Available:**
- `title`, `subtitle`, `search`, `searchButton`
- `loading`, `feelsLike`, `humidity`, `windSpeed`
- `windDirection`, `pressure`, `cloudiness`
- `forecast5Day`, `forecastHourly`
- `recentSearches`, `favorites`
- `addToFavorites`, `removeFromFavorites`
- `clearHistory`, `noSearches`, `noFavorites`
- `profile`

---

### 2. SearchBar Component

**API Integration:**
- Calls `/api/history` POST when user searches
- Fire-and-forget (doesn't block search)
- Uses `useApp()` for translations

**Code:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (city.trim()) {
    onSearch(city.trim());

    // Save to history (non-blocking)
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: city.trim() }),
      });
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }
};
```

---

### 3. WeatherCard Component

**Favorite Button:**
- Heart icon in top-right corner
- Filled red when favorited, outline when not
- Calls `/api/favorites` POST/DELETE
- Checks favorite status on mount

**Code:**
```typescript
const toggleFavorite = async () => {
  setLoading(true);
  try {
    if (isFavorite) {
      await fetch(`/api/favorites?city=${encodeURIComponent(weather.name)}`, {
        method: 'DELETE',
      });
      setIsFavorite(false);
    } else {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: weather.name }),
      });
      if (res.ok) setIsFavorite(true);
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  } finally {
    setLoading(false);
  }
};
```

---

### 4. SearchHistory Component

**Features:**
- Fetches `/api/history` on mount
- Displays last 10 unique cities as clickable pills
- "Clear History" button calls DELETE endpoint
- Auto-hides when empty

**UI:**
- Glassmorphism container
- Horizontal flex wrap of city pills
- Hover scale effect on pills

---

### 5. FavoritesList Component

**Features:**
- Fetches `/api/favorites` on mount
- Displays all favorite cities
- Click city to search for it
- Hover to show delete (X) button
- Auto-hides when empty

**UI:**
- Glassmorphism container with heart icon
- Vertical list of favorites
- Delete button appears on hover

---

## Database Management

### Useful Prisma Commands

```bash
# View database in Prisma Studio (GUI)
npx prisma studio

# Create new migration after schema changes
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client after schema changes
npx prisma generate

# Check database and schema are in sync
npx prisma migrate status
```

### Database Location
```
/prisma/dev.db
```

This is a SQLite file. You can:
- Copy it for backups
- Delete it to reset all data
- Open it with SQLite browser tools

---

## Error Handling

### API Error Responses

**400 Bad Request:**
```json
{ "error": "City name is required" }
```

**409 Conflict:**
```json
{ "error": "City already in favorites" }
```

**500 Internal Server Error:**
```json
{ "error": "Failed to fetch favorites" }
```

### Frontend Error Handling

All API calls use try-catch blocks:
```typescript
try {
  const res = await fetch('/api/favorites');
  const data = await res.json();
  // handle success
} catch (error) {
  console.error('Failed to fetch favorites:', error);
  // UI continues to work even if API fails
}
```

**Strategy:**
- Non-blocking failures (app stays functional)
- Console logging for debugging
- No error toasts/alerts (keeps UI clean)

---

## Data Flow Diagram

```
User Action → Component → API Route → Prisma Client → SQLite Database
                ↓                          ↓
            UI Update ← JSON Response ← Query Result
```

### Example: Adding a Favorite

1. User clicks heart icon in WeatherCard
2. `toggleFavorite()` calls `POST /api/favorites`
3. API route validates city name
4. Checks for duplicates with `prisma.favorites.findUnique()`
5. Creates new record with `prisma.favorites.create()`
6. Returns favorite object as JSON
7. Component updates `isFavorite` state
8. Heart icon fills with red color

---

## Performance Optimizations

### Database Indexes
```prisma
@@index([searchedAt])  // Fast sorting for recent searches
@@index([city])        // Fast lookups for favorites
```

### Prisma Query Optimization
```typescript
// Use distinct to avoid duplicate cities in history
const history = await prisma.searchHistory.findMany({
  orderBy: { searchedAt: 'desc' },
  take: 10,
  distinct: ['city'],  // ← Prevents duplicates
});
```

### Frontend Caching
- Dark mode and language stored in localStorage
- Component state persists during re-renders
- API calls only on user actions (not on every render)

---

## Testing the Backend

### Manual API Testing with curl

**Add Search History:**
```bash
curl -X POST http://localhost:3000/api/history \
  -H "Content-Type: application/json" \
  -d '{"city":"London"}'
```

**Get History:**
```bash
curl http://localhost:3000/api/history
```

**Add Favorite:**
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"city":"Paris"}'
```

**Get Favorites:**
```bash
curl http://localhost:3000/api/favorites
```

**Remove Favorite:**
```bash
curl -X DELETE "http://localhost:3000/api/favorites?city=Paris"
```

---

## Security Considerations

### Current Implementation (Development)
- No authentication (all data is public)
- No rate limiting
- No input sanitization beyond basic validation

### Production Recommendations
1. **Authentication**: Add user sessions/JWT
2. **Authorization**: Link favorites/history to user ID
3. **Rate Limiting**: Prevent API abuse
4. **Input Validation**: Use Zod or similar library
5. **SQL Injection**: Prisma already prevents this
6. **XSS Protection**: Next.js auto-escapes by default

### Example: Adding User Auth
```prisma
model User {
  id       Int         @id @default(autoincrement())
  email    String      @unique
  favorites Favorites[]
  history   SearchHistory[]
}

model Favorites {
  id     Int    @id @default(autoincrement())
  city   String
  userId Int
  user   User   @relation(fields: [userId], references: [id])
}
```

---

## Troubleshooting

### Issue: "PrismaClient is unable to run in the browser"
**Solution:** Make sure API routes are in `app/api/` directory and components use `'use client'` directive.

### Issue: "Database locked" error
**Solution:** Close Prisma Studio or any other app accessing the database.

### Issue: Changes to schema not reflected
**Solution:**
```bash
npx prisma migrate dev
npx prisma generate
```

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```bash
npm install @prisma/client
npx prisma generate
```

---

## Future Enhancements

1. **User Accounts**
   - Email/password auth
   - Google/GitHub OAuth
   - User-specific favorites and history

2. **Notes on Favorites**
   - Add textarea to edit notes
   - Display notes in favorites list

3. **Weather Alerts**
   - Save preferred cities for alerts
   - Push notifications for severe weather

4. **Statistics**
   - Most searched cities
   - Search frequency graphs
   - Favorite city weather trends

5. **Export/Import**
   - Export favorites to JSON
   - Import favorites from file
   - Share favorites with friends

6. **Advanced Search**
   - Search by coordinates
   - Nearby cities suggestions
   - Autocomplete city names

---

## File Structure

```
weather-app/
├── app/
│   ├── api/
│   │   ├── history/
│   │   │   └── route.ts          # Search history endpoints
│   │   └── favorites/
│   │       └── route.ts          # Favorites endpoints
│   ├── layout.tsx                # Root layout with AppProvider
│   ├── page.tsx                  # Main page with weather UI
│   └── globals.css               # Global styles
├── components/
│   ├── Navbar.tsx                # Top navigation bar
│   ├── SearchBar.tsx             # Search input with history save
│   ├── WeatherCard.tsx           # Main weather display + favorite button
│   ├── ForecastCard.tsx          # 5-day and hourly forecast
│   ├── SearchHistory.tsx         # Recent searches list
│   └── FavoritesList.tsx         # Favorite cities list
├── contexts/
│   └── AppContext.tsx            # Dark mode + language context
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── weatherApi.ts             # OpenWeatherMap API calls
│   └── utils.ts                  # Helper functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── dev.db                    # SQLite database file
│   └── migrations/               # Database migrations
├── types/
│   └── weather.ts                # TypeScript types
├── prisma.config.ts              # Prisma configuration
└── package.json                  # Dependencies
```

---

## Dependencies

**Production:**
- `@prisma/client` - Database client
- `next` - React framework
- `react`, `react-dom` - UI library

**Development:**
- `prisma` - Database toolkit
- `dotenv` - Environment variables
- `typescript` - Type safety
- `tailwindcss` - Styling

---

## Summary

✅ **Database**: SQLite with Prisma ORM
✅ **API Routes**: RESTful endpoints for history and favorites
✅ **Context**: Dark mode + language switching with localStorage
✅ **Components**: Search history and favorites lists
✅ **Integration**: All features connected and working
✅ **Translations**: Full EN/VI language support
✅ **Persistence**: Data saved between sessions

Your weather app now has a **fully functional backend** with database persistence, user preferences, and a premium UI!
