# SkillChain Mobile App - Expo Setup Guide

## 🚀 Quick Start

Your SkillChain mobile app is now ready to run with Expo! Here's how to get started:

### 1. Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Expo CLI** - Run: `npm install -g @expo/cli`
- **Expo Go app** on your phone - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. Environment Setup

The app is already configured with:
- ✅ Latest Expo SDK 51
- ✅ Updated dependencies
- ✅ Proper app.json configuration
- ✅ Firebase integration ready
- ✅ Navigation setup
- ✅ All screens implemented

### 3. Running the App

#### Option A: Using the Batch Script (Windows)
```bash
# Double-click start-mobile.bat or run:
start-mobile.bat
```

#### Option B: Manual Commands
```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Testing the App

Once the Expo development server starts:

1. **On Physical Device:**
   - Open Expo Go app
   - Scan the QR code displayed in your terminal
   - The app will load on your device

2. **On iOS Simulator:**
   - Press `i` in the terminal
   - iOS Simulator will open with your app

3. **On Android Emulator:**
   - Press `a` in the terminal
   - Android emulator will open with your app

4. **On Web Browser:**
   - Press `w` in the terminal
   - App will open in your default browser

### 5. App Features

Your mobile app includes:

- **Authentication:** Login and registration with Firebase
- **Home Dashboard:** User stats and quick actions
- **Explore:** Browse skill posts and requests
- **Messages:** Chat interface (mock data)
- **Profile:** User profile and settings
- **Create Post:** Post skills or requests

### 6. Configuration

#### Firebase Setup
The app is configured to use Firebase. Make sure your Firebase project is set up with:
- Authentication enabled
- Firestore database
- Proper security rules

#### Environment Variables
The app uses environment variables from `env-mobile.txt`. Make sure to:
1. Copy `env-mobile.txt` to `.env` in the mobile directory
2. Update Firebase configuration with your project details

### 7. Building for Production

#### Android APK
```bash
cd mobile
npm run build:android
```

#### iOS App
```bash
cd mobile
npm run build:ios
```

#### Web App
```bash
cd mobile
npm run build:web
```

### 8. Troubleshooting

#### Common Issues:

1. **Metro bundler issues:**
   ```bash
   cd mobile
   npx expo start --clear
   ```

2. **Dependencies issues:**
   ```bash
   cd mobile
   rm -rf node_modules
   npm install
   ```

3. **Firebase connection issues:**
   - Check your Firebase configuration
   - Ensure internet connection
   - Verify API keys in environment variables

### 9. Development Tips

- Use `expo start --tunnel` for testing on devices outside your network
- Use `expo start --dev-client` for custom development builds
- Check Expo documentation: https://docs.expo.dev/

### 10. Next Steps

1. Add your app icons and splash screens to the `assets/` directory
2. Customize the UI/UX to match your brand
3. Implement real backend integration
4. Add push notifications
5. Test on multiple devices
6. Deploy to app stores

## 📱 App Structure

```
mobile/
├── src/
│   ├── contexts/
│   │   └── AuthContext.js      # Firebase authentication
│   └── screens/
│       ├── LoginScreen.js      # User login
│       ├── RegisterScreen.js   # User registration
│       ├── HomeScreen.js       # Dashboard
│       ├── ExploreScreen.js    # Browse skills
│       ├── MessagesScreen.js   # Chat interface
│       ├── ProfileScreen.js    # User profile
│       └── CreatePostScreen.js # Create skill posts
├── assets/                     # App icons and images
├── App.js                     # Main app component
├── app.json                   # Expo configuration
├── package.json               # Dependencies
└── README.md                  # Mobile app documentation
```

## 🎉 You're Ready!

Your SkillChain mobile app is now fully configured and ready to run with Expo. Simply follow the steps above to start developing and testing your app!





