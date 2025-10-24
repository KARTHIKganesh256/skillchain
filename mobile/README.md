# SkillChain Mobile App

React Native mobile application for SkillChain built with Expo.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Studio

### Installation

1. Navigate to mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   EXPO_PUBLIC_API_URL=http://localhost:5000/api
   ```

### Running the App

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📱 Features

- User authentication (Email, Google)
- Browse and search skills
- Create skill posts
- Real-time messaging
- SkillCoin balance tracking
- User profiles
- Push notifications

## 🏗️ Project Structure

```
mobile/
├── src/
│   ├── screens/       # App screens
│   ├── components/    # Reusable components
│   ├── contexts/      # React contexts
│   ├── navigation/    # Navigation setup
│   └── utils/         # Utilities
├── assets/           # Images and assets
├── App.js           # Main app component
└── app.json         # Expo configuration
```

## 📦 Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## 🔧 Configuration

Update `app.json` with your app details:
- App name
- Bundle identifier
- Version
- Icons and splash screens

## 📄 License

MIT


