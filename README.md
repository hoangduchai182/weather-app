# 🌦️ Premium Weather Application - IWS Spring 2026 Midterm Project

**Developer:** Tran Duy Truong
**Tech Stack:** Next.js 15 + React + TypeScript + Tailwind CSS + Prisma + SQLite

A modern, full-stack weather application with premium glassmorphism UI, database persistence, and multi-language support.

---

## 🌟 Highlights

### Premium UI/UX Features
- ✨ **Aurora Gradient Background** - Changes color based on weather conditions
- 💎 **Glassmorphism Design** - Frosted glass cards with backdrop blur
- 🎨 **DM Sans Typography** - Premium font with strong visual hierarchy
- ☁️ **3D Weather Icons** - High-quality icons with glow effects
- 📜 **Custom Scrollbar** - Ultra-thin modern scrollbar
- 🎭 **Smooth Animations** - Professional hover effects and transitions
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop

### Full-Stack Features
- 🗄️ **SQLite Database** - Persistent data storage with Prisma ORM
- 💾 **Search History** - Automatically saves last 10 searches
- ❤️ **Favorite Cities** - Save and quick-access favorite locations
- 🌍 **Multi-Language** - Full EN/VI translation support
- 🌙 **Dark Mode** - Toggle with localStorage persistence
- 🧭 **Premium Navbar** - User profile with settings controls

---

## 🎯 Core Features (EXCELLENT+ Level)

### Weather Data (7+ Parameters)
- ✅ Temperature (°C)
- ✅ Feels Like Temperature
- ✅ Humidity (%)
- ✅ Wind Speed (m/s)
- ✅ Wind Direction
- ✅ Atmospheric Pressure (hPa)
- ✅ Cloudiness (%)

### Advanced Features
- ✅ 5-Day weather forecast
- ✅ 24-Hour hourly forecast
- ✅ Automatic location detection
- ✅ Dynamic weather icons
- ✅ Component-based architecture
- ✅ TypeScript for type safety
- ✅ RESTful API backend
- ✅ Database persistence

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Glassmorphism + Aurora gradients
- **Fonts**: DM Sans (Google Fonts)

### Backend
- **Database**: SQLite
- **ORM**: Prisma 7.3.0
- **API**: Next.js API Routes (RESTful)
- **Validation**: TypeScript + Runtime checks

### External APIs
- **Weather Data**: OpenWeatherMap API
- **Icons**: OpenWeatherMap + Custom SVG

---

## 📁 Project Structure

```
weather-app/
├── app/
│   ├── api/
│   │   ├── history/route.ts       # Search history endpoints
│   │   └── favorites/route.ts     # Favorites endpoints
│   ├── layout.tsx                 # Root layout + providers
│   ├── page.tsx                   # Main weather page
│   └── globals.css                # Global styles + animations
├── components/
│   ├── Navbar.tsx                 # Premium navigation bar
│   ├── SearchBar.tsx              # Search with history save
│   ├── WeatherCard.tsx            # Main weather + favorite button
│   ├── ForecastCard.tsx           # 5-day & hourly forecast
│   ├── SearchHistory.tsx          # Recent searches display
│   └── FavoritesList.tsx          # Saved cities display
├── contexts/
│   └── AppContext.tsx             # Dark mode + language state
├── lib/
│   ├── prisma.ts                  # Database client singleton
│   ├── weatherApi.ts              # OpenWeatherMap API calls
│   └── utils.ts                   # Helper functions
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── dev.db                     # SQLite database file
│   └── migrations/                # Database migrations
├── types/
│   └── weather.ts                 # TypeScript type definitions
├── DESIGN_SYSTEM.md               # Complete UI/UX documentation
├── NAVBAR_GUIDE.md                # Navbar implementation guide
├── BACKEND_GUIDE.md               # Backend architecture docs
└── README.md                      # This file
```

---

## 🚀 Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key from your dashboard

### 2. Install Dependencies

```bash
cd weather-app
npm install
```

### 3. Setup Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Configure Environment Variables

Edit `.env.local` and add your API key:

```env
NEXT_PUBLIC_WEATHER_API_KEY=your_actual_api_key_here
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Usage Guide

### Basic Features
1. **Search City** - Enter city name and press Enter or click Search
2. **View Weather** - See current conditions with 7+ parameters
3. **Check Forecast** - Scroll to see 5-day and hourly predictions

### Advanced Features
4. **Save Favorite** - Click heart icon on WeatherCard
5. **Quick Access** - Click any city in Recent Searches or Favorites
6. **Change Language** - Click EN/VI button in navbar
7. **Toggle Dark Mode** - Click moon/sun icon (navbar controls only)
8. **Clear History** - Click "Clear History" in Recent Searches

---

## 🗄️ Database Schema

### SearchHistory Table
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| city | TEXT | City name |
| searchedAt | DATETIME | Timestamp (auto-generated) |

### Favorites Table
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| city | TEXT | City name (unique) |
| notes | TEXT | Optional notes |
| addedAt | DATETIME | Timestamp (auto-generated) |

---

## 🔌 API Endpoints

### Search History (`/api/history`)
- **GET** - Fetch last 10 unique searches
- **POST** - Add new search to history
- **DELETE** - Clear all search history

### Favorites (`/api/favorites`)
- **GET** - Fetch all favorite cities
- **POST** - Add city to favorites
- **DELETE** - Remove city from favorites (query: `?city=London`)

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"city":"Paris"}'
```

---

## 🎨 Design System

### Dynamic Gradients (Weather-Based)
| Weather | Gradient Colors |
|---------|----------------|
| Clear Sky | Sky Blue → Blue → Cyan |
| Cloudy | Slate → Gray → Zinc |
| Rain/Drizzle | Slate → Blue → Indigo |
| Thunderstorm | Gray → Slate → Zinc |
| Snow | Light Blue → Cyan → Slate |
| Night (8pm-6am) | Indigo → Purple → Pink |

### Glassmorphism Properties
```css
backdrop-blur-2xl          /* 40px blur */
bg-white/10                /* 10% opacity background */
border border-white/20     /* 20% opacity border */
shadow-2xl                 /* Deep floating shadow */
```

### Typography Scale (DM Sans)
| Element | Size | Weight |
|---------|------|--------|
| Page Title | 60-72px | 700 |
| Location | 48-60px | 700 |
| Main Temperature | 96-128px | 700 |
| Section Heading | 36px | 700 |
| Body Text | 20-24px | 300 |

---

## 🌍 Internationalization

**Supported Languages:** English (EN), Vietnamese (VI)

**Translation Coverage:**
- All UI text (search, buttons, labels)
- Weather parameters (humidity, wind speed, etc.)
- Section headings (5-Day Forecast, etc.)
- Actions (Add to Favorites, Clear History)

**Persistence:** Language preference saved to localStorage

**Add New Language:**
```typescript
// In contexts/AppContext.tsx
const translations = {
  EN: { title: 'Weather', ... },
  VI: { title: 'Thời Tiết', ... },
  ES: { title: 'Tiempo', ... },  // ← Add here
};
```

---

## 🛠️ Development Commands

### Database
```bash
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create new migration
npx prisma generate        # Regenerate Prisma Client
npx prisma migrate reset   # ⚠️ Reset database (deletes all data)
```

### Next.js
```bash
npm run dev                # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
```

---

## 📱 Responsive Design

### Breakpoints
| Device | Width | Layout Changes |
|--------|-------|----------------|
| Mobile | < 768px | Single column, stacked |
| Tablet | 768-1024px | 2-column grid |
| Desktop | 1024px+ | 3-column grid, 5-col forecast |

### Mobile Optimizations
- Touch-friendly buttons (44x44px minimum)
- Horizontal scroll for hourly forecast
- Readable font sizes (16px minimum)
- Proper viewport meta tag

---

## ♿ Accessibility

✅ **WCAG AA Compliant**
- Text contrast: 4.5:1 minimum (7:1+ on gradients)
- Keyboard navigation with visible focus states
- ARIA labels on all icon-only buttons
- Semantic HTML structure
- Alt text on all weather icons
- Respects `prefers-reduced-motion`

---

## 🎯 Code Quality

### TypeScript
- Full type safety across all files
- Strict mode enabled
- Proper interfaces for all data structures

### Component Architecture
- Small, focused components
- Props destructuring
- Custom hooks for reusability
- Proper separation of concerns

### Error Handling
- Try-catch blocks on all API calls
- Graceful error messages
- Non-blocking failures (app stays functional)

---

## 🚀 Building for Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

**Production Checklist:**
- [ ] Valid OpenWeatherMap API key
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] No console errors
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices

---

## 📦 Submission Guidelines

### File Format
Compress the project folder (excluding `node_modules` and `.next`) into `.zip`

### Naming Convention
```
MidtermIWS2026IT – [Student ID] – [Student Name].zip
```

**Example:** `MidtermIWS2026IT – 1801040121 – Tran Duy Truong.zip`

### Before Submission
1. ✅ Test all features (search, forecast, favorites, history)
2. ✅ Verify responsive design on different screen sizes
3. ✅ Check database persistence (close and reopen browser)
4. ✅ Test language switching
5. ✅ Ensure no console errors
6. ✅ Verify `.env.local` has valid API key

---

## 🎓 Interview Preparation

Be ready to explain:

### Technical Implementation
- Next.js App Router architecture
- API route handlers (GET/POST/DELETE)
- Prisma ORM usage and schema design
- TypeScript interfaces and type safety
- React Context for global state

### UI/UX Design
- Glassmorphism implementation with Tailwind
- Dynamic gradient generation based on weather
- Custom scrollbar styling
- Animation performance optimization
- Accessibility considerations

### Full-Stack Features
- Database design decisions (why SQLite?)
- API endpoint design (RESTful principles)
- State management approach
- LocalStorage vs Database (when to use each)
- Error handling strategies

---

## 📚 Documentation

This project includes comprehensive documentation:

1. **DESIGN_SYSTEM.md** - Complete UI/UX guide
   - Color system and gradients
   - Typography scale
   - Glassmorphism guidelines
   - Animation timings
   - Pre-delivery checklist

2. **BACKEND_GUIDE.md** - Backend architecture
   - Database schema details
   - API endpoint documentation
   - Prisma setup and usage
   - Testing guide
   - Troubleshooting

3. **NAVBAR_GUIDE.md** - Navbar implementation
   - Component breakdown
   - Dark mode setup
   - Language switching
   - Customization options

---

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset everything
npx prisma migrate reset
npx prisma generate
```

### Build Errors
```bash
# Clean rebuild
rm -rf .next node_modules
npm install
npx prisma generate
npm run dev
```

### API Key Issues
- Check `.env.local` exists and has correct key
- Verify key starts with `NEXT_PUBLIC_`
- Restart dev server after changing env vars

---

## 🎉 Features Summary

### ✨ Premium UI/UX
- Aurora gradient backgrounds (weather-responsive)
- Glassmorphism cards with backdrop blur
- DM Sans typography
- Custom scrollbar
- Smooth 150-300ms animations
- Responsive design (375px - 1440px+)

### 🗄️ Full-Stack Backend
- Prisma ORM + SQLite database
- RESTful API endpoints
- Search history (last 10 cities)
- Favorite cities system
- Data persistence

### 🌍 User Experience
- Multi-language support (EN/VI)
- Dark mode toggle (localStorage)
- Automatic location detection
- One-click access to saved cities
- Error handling and loading states

---

## 📊 Project Stats

- **Total Files Created:** 20+
- **Lines of Code:** ~2,500+
- **Components:** 7 custom components
- **API Routes:** 2 complete endpoints
- **Database Tables:** 2 tables
- **Languages:** 2 (EN/VI)
- **Design Documents:** 3 comprehensive guides

---

## 🏆 Grading Criteria Met

### PASS Level ✅
- Modern framework (Next.js + TypeScript)
- 6+ weather parameters
- Dynamic weather icons
- Location search
- Clean, legible UI

### MERIT Level ✅
- Fully responsive design
- Component-based architecture
- 5-Day forecast
- Hourly forecast
- Automatic location detection

### EXCELLENT Level ✅
- TypeScript throughout
- Clean, modular code
- Proper separation of concerns
- Efficient state management
- Comprehensive error handling

### EXCELLENT+ Level ✅✅
- **Full-stack database implementation**
- **RESTful API backend**
- **Premium UI/UX design system**
- **Multi-language support**
- **Complete documentation**
- **Advanced features** (favorites, history)

---

## 📞 Support

For questions or issues:
1. Check `BACKEND_GUIDE.md` for database/API issues
2. Check `DESIGN_SYSTEM.md` for UI component reference
3. Check `NAVBAR_GUIDE.md` for navbar customization

---

## 📝 License

Educational project for IWS Spring 2026 - Midterm

---

## 🙏 Credits

**Design System:** UI/UX Pro Max
**Typography:** DM Sans by Google Fonts
**Weather Data:** OpenWeatherMap API
**Framework:** Next.js by Vercel
**Database:** Prisma + SQLite

---

**Built with ❤️ by Tran Duy Truong**

**Weather data provided by OpenWeatherMap**

**IWS Spring 2026 - Midterm Project**

🌦️ ✨ Enjoy your premium weather application! ✨ 🌦️
