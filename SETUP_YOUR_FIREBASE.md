# 🔥 Firebase Setup for skillchain-fe362

## ✅ Your Firebase Config (Already Done!)

Great! You already have your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAxHACyjqOqidlx7CJNFGEfHHza_eUW9z4",
  authDomain: "skillchain-fe362.firebaseapp.com",
  projectId: "skillchain-fe362",
  storageBucket: "skillchain-fe362.firebasestorage.app",
  messagingSenderId: "841962814239",
  appId: "1:841962814239:web:3dd6ddf3477becc63f0e2a",
  measurementId: "G-5DDN7979WW"
};
```

## 🛠️ Next Steps

### 1. Install Firebase CLI (if not done)

```bash
npm install -g firebase-tools
```

### 2. Get Service Account Key

**Go to:** https://console.firebase.google.com/project/skillchain-fe362/settings/serviceaccounts/adminsdk

1. Click **"Generate new private key"**
2. Click **"Generate key"** in popup
3. Save downloaded file as: `backend/serviceAccountKey.json`

### 3. Create Environment Files

You need to create these 3 files manually:

---

## 📝 File 1: `backend/.env`

Create this file in the `backend/` folder:

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=skillchain-fe362
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Stripe Configuration (Optional - can add later)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_BOOST_POST_PRICE_ID=price_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx

# JWT Configuration
JWT_SECRET=generate-a-random-32-character-string-here
JWT_EXPIRES_IN=7d

# SkillCoin Configuration
SKILLCOIN_CASHOUT_FEE_PERCENT=5
SKILLCOIN_INITIAL_BALANCE=100
SKILLCOIN_POST_REWARD=10
SKILLCOIN_COMPLETE_TASK_REWARD=50

# App Configuration
CLIENT_URL=http://localhost:3000
ADMIN_EMAIL=your-email@example.com
```

---

## 📝 File 2: `frontend-web/.env.local`

Create this file in the `frontend-web/` folder:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAxHACyjqOqidlx7CJNFGEfHHza_eUW9z4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skillchain-fe362.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skillchain-fe362
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skillchain-fe362.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=841962814239
NEXT_PUBLIC_FIREBASE_APP_ID=1:841962814239:web:3dd6ddf3477becc63f0e2a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-5DDN7979WW

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📝 File 3: `mobile/.env`

Create this file in the `mobile/` folder:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAxHACyjqOqidlx7CJNFGEfHHza_eUW9z4
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=skillchain-fe362.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=skillchain-fe362
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=skillchain-fe362.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=841962814239
EXPO_PUBLIC_FIREBASE_APP_ID=1:841962814239:web:3dd6ddf3477becc63f0e2a

EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🚀 Deploy Firebase Rules

After creating the .env files, deploy the security rules:

```bash
# Login to Firebase
firebase login

# Initialize Firebase (in your project root)
firebase init

# Select:
# - Firestore
# - Storage
# Choose existing project: skillchain-fe362
# Use existing files (don't overwrite)

# Deploy rules
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

---

## 🧪 Test Your Setup

### Start Backend:
```bash
cd backend
npm install
npm run dev
```

You should see:
```
🚀 SkillChain API Server running on port 5000
✅ Firebase Admin SDK initialized successfully
```

### Start Frontend:
```bash
cd frontend-web
npm install
npm run dev
```

Open http://localhost:3000 and test:
1. Click "Register"
2. Create account with your email
3. You should be logged in! ✅

---

## 📋 Quick Checklist

- [ ] `npm install -g firebase-tools` ✅ (Done)
- [ ] Download serviceAccountKey.json to backend/ folder
- [ ] Create `backend/.env` with your values
- [ ] Create `frontend-web/.env.local` with your values
- [ ] Create `mobile/.env` with your values
- [ ] `firebase login`
- [ ] `firebase init`
- [ ] `firebase deploy --only firestore:rules,storage:rules`
- [ ] Test backend: `cd backend && npm run dev`
- [ ] Test frontend: `cd frontend-web && npm run dev`
- [ ] Register test account at http://localhost:3000

---

## 🎉 You're Almost Ready!

Once you complete these steps:
1. Your Firebase project will be fully connected
2. You can register users and create posts
3. Real-time chat will work
4. All features will be functional

**Next:** Follow the `GETTING_STARTED.md` guide for the full app experience!

---

## 🆘 Need Help?

If you get errors:
1. Check browser console (F12) for errors
2. Check terminal for backend errors
3. Verify all .env values are correct
4. Make sure no extra spaces in .env files
5. Restart servers after creating .env files

---

**🚀 Your Firebase setup is almost complete! Just create those 3 .env files and you're ready to go!**

