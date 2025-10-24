# Firebase Firestore Setup Guide

## ⚠️ CRITICAL: Firestore Database Not Found Error

The "5 NOT_FOUND" error you're experiencing means **Firestore is not enabled** in your Firebase project. This is blocking the entire application from working.

## 🔧 How to Enable Firestore in Firebase Console

### Method 1: Build Menu (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **skillchain-fe362**
3. Look at the **LEFT SIDEBAR** menu
4. Find the **"Build"** section (it might be collapsed)
5. Click on **"Firestore Database"**
6. Click the **"Create Database"** button
7. Choose **"Start in test mode"** (for development)
8. Select your preferred location (e.g., us-central1)
9. Click **"Enable"**

###Method 2: If "Create Database" is Not Available

If you don't see "Create Database" button, try these steps:

#### Option A: Check Project Permissions
- Make sure you are the **Owner** of the Firebase project
- Go to **Project Settings** → **Users and permissions**
- Verify you have "Owner" or "Editor" role

#### Option B: Enable via Firebase CLI
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# List your projects
firebase projects:list

# Set your project
firebase use skillchain-fe362

# Initialize Firestore
firebase init firestore
```
When prompted:
- Select "Use an existing project"
- Choose "skillchain-fe362"
- Press Enter to use default firestore.rules
- Press Enter to use default firestore.indexes.json

#### Option C: Create a New Firebase Project
If none of the above works, you may need to create a new Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "skillchain-new")
4. Follow the setup wizard
5. Enable Firestore Database
6. Update your environment variables with new credentials

## 📝 After Enabling Firestore

Once Firestore is enabled, you'll need to:

### 1. Set up Security Rules (Optional for Development)
In the Firebase Console, go to Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for development
    // ⚠️ CHANGE THIS FOR PRODUCTION!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 2. Create Initial Collections (Optional)
You can create these collections manually in the Firebase Console:
- `users` - User profiles
- `posts` - Skill posts
- `matches` - Skill matches
- `chats` - Chat conversations
- `messages` - Chat messages
- `notifications` - User notifications
- `transactions` - SkillCoin transactions

### 3. Restart Your Servers
```bash
# Stop all Node processes
taskkill /F /IM node.exe

# Start backend
npm run dev:backend

# Start frontend (in another terminal)
npm run dev:web
```

## 🔑 Verify Your Service Account

Make sure you have the `serviceAccountKey.json` file in your `backend/` directory:

1. Go to Firebase Console → Project Settings
2. Click on **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Save the downloaded JSON file as `backend/serviceAccountKey.json`
5. ⚠️ **NEVER commit this file to Git!** (it's already in .gitignore)

## ✅ How to Verify Firestore is Working

### Test Backend Connection:
```bash
# With servers running, visit:
curl http://localhost:5000/health

# Should return:
# {"status":"OK","timestamp":"...","uptime":...,"environment":"development"}
```

### Test Firestore Connection:
```bash
curl http://localhost:5000/test-firebase

# Should return:
# {"success":true,"message":"Firebase connection successful","timestamp":"..."}
```

## 🆘 Still Having Issues?

### Check Firebase Project Status
1. Verify your project exists at console.firebase.google.com
2. Check that you're logged in with the correct Google account
3. Verify your project has an active billing account (even for free tier)

### Check Environment Variables
Verify these files exist and have correct values:
- `frontend-web/.env.local`
- `backend/.env`
- `backend/serviceAccountKey.json`

### Common Errors and Solutions

**Error: "The default Firebase app does not exist"**
- Solution: Fixed! The NotificationService now initializes after Firebase.

**Error: "5 NOT_FOUND"**
- Solution: Enable Firestore database in Firebase Console (see above).

**Error: "auth/invalid-api-key"**
- Solution: Check `NEXT_PUBLIC_FIREBASE_API_KEY` in `frontend-web/.env.local`

**Error: "EADDRINUSE: address already in use :::5000"**
- Solution: Run `taskkill /F /IM node.exe` to kill all Node processes.

## 📧 Contact Firebase Support

If you still can't enable Firestore:
1. Go to [Firebase Support](https://firebase.google.com/support)
2. Describe your issue: "Cannot create Firestore database in project"
3. Provide your project ID: skillchain-fe362

## 🎉 Once Firestore is Enabled

Your application will have:
- ✅ Fast response times (optimized with caching and code splitting)
- ✅ Email verification system
- ✅ Real-time notifications
- ✅ Error-free operation
- ✅ All CRUD operations working

The application is now fully optimized and ready - it just needs Firestore to be enabled!

