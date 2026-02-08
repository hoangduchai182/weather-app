# Navbar Component - Implementation Guide

## Overview

Premium glassmorphism navbar with user profile, language selector, and dark mode toggle.

---

## Features

### 1. **User Profile Section (Left)**
- Avatar circle with gradient background (blue → purple)
- Initial letter "T" for "Tran Duy Truong"
- Full name display (hidden on mobile, visible on tablet+)

### 2. **Controls (Right)**

#### Language Switcher
- Toggle between EN ↔ VI
- Globe icon (SVG)
- Language code visible on larger screens

#### Dark Mode Toggle
- Moon icon (light mode)
- Sun icon (dark mode)
- Toggles `dark` class on `<html>` element

#### Profile Button
- User icon (SVG)
- "Profile" text (visible on desktop)
- Click to access user settings

---

## Design Properties

### Navbar Container
```css
- Fixed position: top-4, left-4, right-4
- Z-index: 50 (above content)
- Max width: 7xl (1280px)
- Centered with mx-auto
```

### Glass Effect
```css
backdrop-blur-2xl     /* 40px blur */
bg-white/10           /* 10% white background */
border-white/20       /* 20% white border */
shadow-2xl            /* Deep shadow */
rounded-2xl           /* 16px border radius */
px-6 py-4             /* 24px horizontal, 16px vertical padding */
```

### Button Styles
```css
backdrop-blur-xl      /* 24px blur */
bg-white/10           /* Base: 10% white */
hover:bg-white/20     /* Hover: 20% white */
border-white/20       /* Border */
hover:scale-105       /* Slight lift on hover */
transition-all        /* Smooth 200ms transition */
```

---

## Responsive Behavior

| Breakpoint | User Name | Language Text | Profile Text |
|------------|-----------|---------------|--------------|
| Mobile (< 640px) | Hidden | Hidden (icon only) | Hidden (icon only) |
| Tablet (640px+) | Visible | Visible | Hidden |
| Desktop (768px+) | Visible | Visible | Visible |

---

## Accessibility

✓ Focus rings on all buttons (2px white/50)
✓ ARIA labels for icon-only buttons
✓ Keyboard navigation support
✓ Cursor pointer on all interactive elements
✓ Smooth transitions (200ms)

---

## Dark Mode Implementation

The navbar includes a dark mode toggle that adds/removes the `dark` class on the `<html>` element.

### To Complete Dark Mode Support:

1. **Update Tailwind Config** (if needed):
```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  // ... rest of config
}
```

2. **Add Dark Mode Styles** to components:
```tsx
// Example: Update background gradient
className={`bg-gradient-to-br ${
  isDark
    ? 'from-gray-900 via-slate-900 to-zinc-900'
    : getWeatherGradient()
}`}
```

3. **Persist Dark Mode Preference**:
```tsx
// Save to localStorage
useEffect(() => {
  const savedMode = localStorage.getItem('darkMode') === 'true';
  setIsDark(savedMode);
  if (savedMode) {
    document.documentElement.classList.add('dark');
  }
}, []);

const toggleDarkMode = () => {
  const newMode = !isDark;
  setIsDark(newMode);
  localStorage.setItem('darkMode', String(newMode));
  document.documentElement.classList.toggle('dark');
};
```

---

## Language Switching Implementation

Currently toggles between EN ↔ VI. To implement full i18n:

### Option 1: next-intl (Recommended)
```bash
npm install next-intl
```

### Option 2: React Context
```tsx
// Create LanguageContext
const LanguageContext = createContext();

// Provide translations
const translations = {
  EN: { title: 'Weather', search: 'Search for a city...' },
  VI: { title: 'Thời tiết', search: 'Tìm kiếm thành phố...' }
};
```

---

## Customization Options

### Change User Name
```tsx
// In Navbar.tsx, line ~27
<h2 className="text-white font-bold text-xl hidden sm:block">
  Your Name Here
</h2>

// Update avatar initial (line ~23)
<div className="...">
  Y  {/* First letter of your name */}
</div>
```

### Change Avatar Gradient
```tsx
// Line ~22
className="... bg-gradient-to-br from-blue-400 to-purple-500"
// Change to:
className="... bg-gradient-to-br from-green-400 to-teal-500"
// or any other gradient
```

### Add More Buttons
```tsx
<button
  className="backdrop-blur-xl bg-white/10 hover:bg-white/20
             px-4 py-2 rounded-xl border border-white/20
             text-white font-semibold transition-all duration-200
             hover:scale-105 cursor-pointer
             focus:outline-none focus:ring-2 focus:ring-white/50"
>
  <svg className="w-5 h-5">...</svg>
</button>
```

---

## Integration Notes

1. **Navbar is fixed** at the top, so content needs top padding
   - Added `pt-20` to main container in `page.tsx`

2. **Z-index hierarchy**:
   - Navbar: `z-50`
   - Content: `z-10`
   - Background: `z-0`

3. **Mobile considerations**:
   - Avatar and icons always visible
   - Text labels hide on small screens
   - Navbar remains readable on all devices

---

## Future Enhancements

1. **Dropdown Menu** for Profile button:
   - Settings
   - Account info
   - Logout

2. **Language Dropdown** instead of toggle:
   - Support more languages (ES, FR, DE, etc.)
   - Flag icons

3. **Notifications**:
   - Bell icon with badge
   - Weather alerts

4. **Search Integration**:
   - Quick search in navbar
   - Recently searched cities

---

## Browser Compatibility

✓ Chrome/Edge (Chromium)
✓ Firefox
✓ Safari
✓ Mobile browsers

**Note:** `backdrop-filter` requires:
- Chrome 76+
- Firefox 103+
- Safari 9+

For older browsers, add fallback:
```css
@supports not (backdrop-filter: blur(40px)) {
  .navbar {
    background: rgba(255, 255, 255, 0.8);
  }
}
```
