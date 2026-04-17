# Quick Start Guide - Veterinary Clinic Locator

## 🚀 Getting Started

### Step 1: Access the Feature
1. Navigate to your Buyer Dashboard
2. Click the **"Locate Now"** button under "Find nearby Vet Clinic"
3. Or directly visit: `http://localhost:3000/vet-clinic`

### Step 2: Allow Location Access
When prompted by your browser:
- Click **"Allow"** to share your location
- This is required for the feature to work
- Your location is only used to find nearby clinics

### Step 3: View Nearby Clinics
- Clinics appear in the left sidebar, sorted by distance
- Each clinic shows:
  - ✅ Name
  - 📍 Address
  - 📞 Phone number
  - 🕐 Opening hours (if available)
  - 📏 Distance from your location

### Step 4: Select a Clinic
Click on any clinic in the list to:
- Highlight it on the map
- Draw a route from your location
- See distance and travel time
- View detailed information

### Step 5: Navigate
- Use the interactive map to zoom in/out
- Click clinic markers for quick details
- Click "Clear" to reset selection

## 🎯 Key Features

### Map Controls
- **Zoom**: Use +/- buttons or scroll wheel
- **Pan**: Click and drag the map
- **Click Markers**: View popup information

### Sidebar Features
- **Scroll**: Browse through all nearby clinics
- **Distance Badge**: See how far each clinic is
- **Selection**: Click to highlight and show route
- **Clear Button**: Remove route and reset view

### Route Information
When a clinic is selected:
- 📏 **Distance**: Total distance in kilometers
- ⏱️ **Duration**: Estimated travel time
- 🗺️ **Visual Route**: Blue line on map

## 📱 Mobile Usage

Works great on mobile devices:
- Touch to pan the map
- Pinch to zoom
- Tap markers for details
- Scroll sidebar for clinic list

## ⚙️ Optional: OpenRouteService API Key

For better routing reliability, add an API key:

1. **Sign up** (Free):
   - Visit: https://openrouteservice.org/dev/#/signup
   - Create a free account
   - Free tier: 2000 requests/day

2. **Get your API key**:
   - Go to: https://openrouteservice.org/dev/#/home
   - Copy your API key

3. **Add to project**:
   - Open: `src/pages/Buyer/FindVetClinic.jsx`
   - Find line: `const OPENROUTESERVICE_API_KEY = null;`
   - Replace with: `const OPENROUTESERVICE_API_KEY = 'your-key-here';`

**Note**: The feature works without this key using OSRM, but adding it provides a backup.

## 🔍 What You'll See

### Loading States
- **Getting Location**: "Getting your location..."
- **Searching Clinics**: "Searching for clinics..."
- **Calculating Route**: "Calculating route..."

### Success States
- **Clinics Found**: List appears in sidebar
- **Route Drawn**: Blue line shows path on map
- **Distance Info**: Shows in route information box

### Error States
- **Location Denied**: Instructions to enable location
- **No Clinics**: Message if none found within 5km
- **Route Error**: Falls back to OSRM or shows warning

## 🐛 Troubleshooting

### "Location Error"
**Problem**: Browser can't access your location  
**Solution**:
1. Check browser settings for location permissions
2. Ensure you're using HTTPS (or localhost)
3. Try a different browser
4. Disable VPN if enabled

### "No clinics found nearby"
**Problem**: No veterinary clinics in database within 5km  
**Solution**:
1. Try from a different location
2. The data comes from OpenStreetMap
3. Urban areas typically have more results

### "Route calculation unavailable"
**Problem**: Routing service is temporarily unavailable  
**Solution**:
1. The clinic location is still visible on map
2. You can navigate manually
3. Try again in a few minutes
4. Consider adding OpenRouteService API key

### Map doesn't load
**Problem**: Tiles not displaying  
**Solution**:
1. Check internet connection
2. Refresh the page
3. Clear browser cache
4. Check if OpenStreetMap is accessible

## 💡 Tips & Tricks

1. **Better Results**: Use in populated areas for more clinic options
2. **Accurate Location**: Enable high accuracy in browser settings
3. **Save Clinics**: Take note of clinic details you like
4. **Check Hours**: Verify opening hours before visiting
5. **Call Ahead**: Use phone numbers to confirm availability

## 📊 What Data Is Collected?

**Your Privacy**:
- ✅ Location used only in browser (not stored)
- ✅ No personal data sent to servers
- ✅ Clinic data from OpenStreetMap (public)
- ✅ No tracking or analytics

## 🌟 Best Practices

### For Best Experience:
1. Use on a stable internet connection
2. Allow location access when prompted
3. Ensure GPS is enabled (mobile devices)
4. Use modern browser (Chrome, Firefox, Safari)
5. Check opening hours before visiting

### For Developers:
1. Monitor API rate limits
2. Consider self-hosting OSRM for production
3. Cache results when appropriate
4. Handle errors gracefully
5. Test across different locations

## 📞 Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify internet connection
3. Try different browser
4. Clear cache and cookies
5. Refer to detailed documentation in VET_CLINIC_LOCATOR_README.md

## 🎉 Enjoy!

Your pets deserve the best care, and now finding nearby veterinary clinics is easier than ever!

---
**Note**: This feature requires:
- Modern web browser with Geolocation API support
- Active internet connection
- Location permissions enabled
- JavaScript enabled
