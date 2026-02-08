# Quick Setup Guide

Follow these steps to get your weather application running:

## Step 1: Get API Key

1. Visit [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. After login, go to "API keys" section in your account
4. Copy your default API key (or generate a new one)

**Note**: New API keys may take a few minutes to activate.

## Step 2: Configure Your Project

1. Open the `.env.local` file in the project root
2. Replace `your_openweathermap_api_key_here` with your actual API key:
   ```
   NEXT_PUBLIC_WEATHER_API_KEY=abc123your_actual_key_here
   ```
3. Save the file

## Step 3: Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Step 4: View Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Step 5: Test Features

1. Allow location access when prompted (optional)
2. Try searching for different cities:
   - London
   - Tokyo
   - New York
   - Ho Chi Minh City
3. Check responsive design by resizing your browser
4. Verify all weather data is displayed correctly

## Common Issues

### "City not found" error
- Check that your API key is correctly set in `.env.local`
- Wait a few minutes if you just created your API key
- Verify the city name spelling

### Images not loading
- Check your internet connection
- Ensure `next.config.ts` has the correct image configuration
- Clear browser cache and reload

### API key not working
- New API keys can take 10-60 minutes to activate
- Verify you copied the entire key without extra spaces
- Make sure the environment variable starts with `NEXT_PUBLIC_`

## Ready for Submission?

Before zipping your project:

1. ✅ Test on different browsers (Chrome, Firefox, Safari)
2. ✅ Test responsive design on different screen sizes
3. ✅ Ensure no console errors
4. ✅ Make sure `.env.local` has a valid API key
5. ✅ Delete `node_modules` and `.next` folders (to reduce file size)
6. ✅ Review your code for any personal comments
7. ✅ Follow the naming convention:
   ```
   MidtermIWS2026IT – [StudentID] – [YourName].zip
   ```

## Need Help?

Refer to the full README.md file for detailed documentation.

Good luck with your project! 🌤️
