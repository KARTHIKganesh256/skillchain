# 🔥 Firebase Setup - Complete Guide

## ✅ Checklist

- [ ] Step 1: Create Firebase Project
- [ ] Step 2: Enable Authentication
- [ ] Step 3: Create Firestore Database
- [ ] Step 4: Enable Storage
- [ ] Step 5: Get Configuration Values
- [ ] Step 6: Create .env Files
- [ ] Step 7: Deploy Security Rules
- [ ] Step 8: Test Connection

---

## 📋 Step 1: Create Firebase Project

1. Go to: **https://console.firebase.google.com**
2. Click **"Add project"**
3. Project name: `SkillChain` (or your choice)
4. Enable/disable Google Analytics (your choice)
5. Click **"Create project"**
6. Wait 30-60 seconds
7. Click **"Continue"**

✅ **Done!** Your Firebase project is created.

---

## 🔐 Step 2: Enable Authentication

1. **In Firebase Console**, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Click **"Sign-in method"** tab

### Enable Email/Password:
4. Click **"Email/Password"**
5. Toggle **"Enable"** ON
6. Click **"Save"**

### Enable Google Sign-In:
7. Click **"Google"**
8. Toggle **"Enable"** ON
9. Select support email (your email)
10. Click **"Save"**

### Enable Phone (Optional):
11. Click **"Phone"**
12. Toggle **"Enable"** ON
13. Click **"Save"**

✅ **Done!** Authentication is configured.

---

## 💾 Step 3: Create Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules later)
4. Click **"Next"**
5. Choose location closest to your users:
   - `us-central1` (USA)
   - `europe-west1` (Europe)
   - `asia-northeast1` (Asia)
6. Click **"Enable"**
7. Wait 1-2 minutes

✅ **Done!** Firestore is ready.

---

## 📦 Step 4: Enable Storage

1. Click **"Storage"** in left sidebar
2. Click **"Get started"**
3. Select **"Start in production mode"**
4. Click **"Next"**
5. Use same location as Firestore
6. Click **"Done"**

✅ **Done!** Storage is enabled.

---

## 🔑 Step 5: Get Configuration Values

### A. Get Web App Config

1. Click **⚙️ Settings icon** → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click **Web icon** `</>`
4. App nickname: `SkillChain Web`
5. Click **"Register app"**
6. **COPY THIS CONFIG** - you'll need it:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // ← Copy this
  authDomain: "your-app.firebaseapp.com",  // ← Copy this
  projectId: "your-project-id",   // ← Copy this
  storageBucket: "your-app.appspot.com",  // ← Copy this
  messagingSenderId: "123456",    // ← Copy this
  appId: "1:123:web:abc",         // ← Copy this
  measurementId: "G-ABC123"       // ← Copy this
};
```

### B. Get Service Account Key (for Backend)

1. Still in **"Project settings"**
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in popup
5. Save the downloaded JSON file as:
   ```
   backend/serviceAccountKey.json
   ```

---

## 📝 Step 6: Create Environment Files

You need to create 3 environment files. Copy the examples below and replace with YOUR values.

### **File 1: `backend/.env`**

Create this file in the `backend/` folder:

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration
# Replace with YOUR project ID from Step 5A
FIREBASE_PROJECT_ID=your-project-id
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

**How to fill it:**
- `FIREBASE_PROJECT_ID`: From Step 5A config
- `JWT_SECRET`: Generate random 32+ characters
- `ADMIN_EMAIL`: Your email address
- Stripe keys: Skip for now, add later when testing payments

---

### **File 2: `frontend-web/.env.local`**

Create this file in the `frontend-web/` folder:

```env
# Firebase Configuration
# Copy ALL values from Step 5A firebaseConfig

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123

# Stripe Configuration (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**How to fill it:**
- Copy EXACT values from Step 5A firebaseConfig
- Make sure each value matches exactly!

---

### **File 3: `mobile/.env`**

Create this file in the `mobile/` folder:

```env
# Firebase Configuration
# Copy values from Step 5A firebaseConfig

EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123

# API URL
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

**How to fill it:**
- Same values as frontend, but with `EXPO_PUBLIC_` prefix

---

## 🛡️ Step 7: Deploy Security Rules

Now deploy the Firebase security rules:

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
cd firebase
firebase init

# Select:
# - Firestore
# - Storage
# Choose existing project: SkillChain
# Use existing files (don't overwrite)

# Deploy rules
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

✅ **Done!** Security rules are deployed.

---

## 🧪 Step 8: Test Your Setup

### Test Backend Connection:

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

### Test Frontend Connection:

```bash
cd frontend-web
npm install
npm run dev
```

Open http://localhost:3000 and try to:
1. Click "Register"
2. Create an account
3. If successful, you'll be logged in! ✅

---

## ⚠️ Common Issues

### Issue: "Firebase project not found"
**Solution:** Double-check your `FIREBASE_PROJECT_ID` matches exactly

### Issue: "Permission denied" on Firestore
**Solution:** Deploy security rules (Step 7)

### Issue: "Invalid API key"
**Solution:** Make sure you copied the ENTIRE API key from Firebase

### Issue: Backend won't start
**Solution:** 
1. Check `serviceAccountKey.json` is in `backend/` folder
2. Verify the path in `.env` is `./serviceAccountKey.json`

---

## 📋 Quick Reference

### Firebase Console URLs:
- **Main Console:** https://console.firebase.google.com
- **Authentication:** https://console.firebase.google.com/project/YOUR-PROJECT/authentication
- **Firestore:** https://console.firebase.google.com/project/YOUR-PROJECT/firestore
- **Storage:** https://console.firebase.google.com/project/YOUR-PROJECT/storage

### What Each File Does:
- `backend/.env` → Backend API configuration
- `frontend-web/.env.local` → Web app configuration
- `mobile/.env` → Mobile app configuration
- `backend/serviceAccountKey.json` → Backend Firebase authentication

---

## ✅ Verification Checklist

Before moving on, verify:

- [ ] Firebase project created
- [ ] Authentication enabled (Email + Google)
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Web app registered in Firebase
- [ ] `serviceAccountKey.json` downloaded to `backend/`
- [ ] `backend/.env` created with YOUR values
- [ ] `frontend-web/.env.local` created with YOUR values
- [ ] `mobile/.env` created with YOUR values
- [ ] Security rules deployed
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register a test account

---

## 🎉 Next Steps

Once everything is working:

1. **Create your first account** at http://localhost:3000/register
2. **Explore the dashboard** and create a post
3. **Test the chat** by creating a second account
4. **Customize the app** to your needs
5. **Deploy to production** when ready

---

## 🆘 Still Having Issues?

1. **Check the console** in browser (F12) for error messages
2. **Check terminal** for backend errors
3. **Verify all values** in .env files are correct
4. **Ensure no extra spaces** in .env values
5. **Restart both servers** after changing .env files

---

**🎊 Congratulations! Firebase is now set up for SkillChain!**

You can now run the full application locally. 🚀


