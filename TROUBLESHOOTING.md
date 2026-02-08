# Fixing API Issues - Quick Guide

## The Error
`Unexpected token '<', "<!DOCTYPE "...` means the API returned HTML instead of JSON.

## Quick Fix (Try This First!)

1. **Stop the dev server** (Ctrl+C)
2. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```
3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## Test if APIs Work

Open browser console (F12) and run:

```javascript
fetch('/api/favorites').then(r => r.text()).then(console.log)
```

**Good**: See `{"favorites":[]}`
**Bad**: See `<!DOCTYPE html>`

## If Still Broken

Check Network tab in DevTools:
- Search for a city
- Look for `/api/history` request
- Check if status is 200 or 404
- Click it and see the response

## Database Check

```bash
npx prisma studio
```

Opens GUI to view SearchHistory and Favorites tables.
