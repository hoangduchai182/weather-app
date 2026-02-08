This file tests if the API routes are accessible.

Test the API endpoints:

1. Open browser console
2. Run these commands:

```javascript
// Test history API
fetch('/api/history').then(r => r.json()).then(console.log).catch(console.error)

// Test favorites API
fetch('/api/favorites').then(r => r.json()).then(console.log).catch(console.error)

// Add a favorite
fetch('/api/favorites', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({city: 'TestCity'})
}).then(r => r.json()).then(console.log).catch(console.error)
```

If you get HTML instead of JSON, the API routes aren't being loaded correctly.
