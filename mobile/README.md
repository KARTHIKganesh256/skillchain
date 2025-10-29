# SkillChain Mobile App

A React Native mobile app built with Expo for the SkillChain platform.

## Features

- User authentication with Firebase
- Skill posting and browsing
- Real-time messaging
- User profiles and statistics
- SkillCoin balance management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `env-mobile.txt` to `.env`
   - Update the Firebase configuration with your project details

3. Start the development server:
```bash
npm start
```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser

### Building for Production

- `npm run build:android` - Build Android APK
- `npm run build:ios` - Build iOS app
- `npm run build:web` - Build web version

## Project Structure

```
mobile/
├── src/
│   ├── contexts/          # React contexts (Auth, etc.)
│   └── screens/           # App screens
├── assets/               # Images, icons, etc.
├── App.js               # Main app component
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## Technologies Used

- React Native
- Expo SDK 51
- React Navigation
- Firebase Authentication
- Firebase Firestore
- React Native Vector Icons
- AsyncStorage