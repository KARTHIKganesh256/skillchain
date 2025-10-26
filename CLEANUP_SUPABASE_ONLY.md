# 🧹 Cleanup Guide: Supabase-Only Configuration

This guide will help you remove all Firebase dependencies and configure your SkillChain application to use only Supabase.

## 📋 What Will Be Removed

### Files to Delete:
1. **Firebase-related files:**
   - `backend/src/config/firebase.js`
   - `backend/src/services/notificationService.js` (if it uses Firebase)
   - `backend/serviceAccountKey.json` (if exists)
   - `backend/firebase/` directory (if exists)
   - `mobile/src/contexts/AuthContext.js` (uses Firebase)
   - All Firebase setup documentation files

2. **Documentation files to delete:**
   - `FIREBASE_SETUP_COMPLETE.md`
   - `FIREBASE_SETUP_GUIDE.md`
   - `FIREBASE_QUICK_FIX.md`
   - `FIREBASE_TROUBLESHOOTING.md`
   - `SETUP_YOUR_FIREBASE.md`
   - `DEPLOYMENT.md` (uses Firebase)
   - `PROJECT_SUMMARY.md` (mentions Firebase)

### Code to Update:

1. **Backend Controllers** - Replace Firebase with Supabase:
   - `backend/src/controllers/userController.js`
   - `backend/src/controllers/postController.js`
   - `backend/src/controllers/paymentController.js`
   - `backend/src/controllers/notificationController.js`
   - `backend/src/controllers/matchController.js`
   - `backend/src/controllers/chatController.js`
   - `backend/src/controllers/authController.js`

2. **Middleware** - Update auth middleware:
   - `backend/src/middleware/auth.js` (replace verifyFirebaseToken)

3. **Routes** - Remove Firebase auth:
   - All route files that use `verifyFirebaseToken`

### Dependencies to Remove:

#### Backend (`backend/package.json`):
```json
Remove:
- "firebase-admin" (if exists)

Keep:
- "@supabase/supabase-js"
```

#### Mobile (`mobile/package.json`):
```json
Remove:
- "firebase"

Add:
- "@supabase/supabase-js"
- "@supabase/supabase-js" for React Native
```

## 🔧 Implementation Steps

### Step 1: Create Updated Auth Middleware

Replace Firebase auth with Supabase JWT verification.

### Step 2: Update All Controllers

Replace all Firebase operations with Supabase equivalents:
- Firestore → Supabase PostgreSQL
- Firebase Auth → Supabase Auth
- Firebase Storage → Supabase Storage

### Step 3: Update Mobile App

Replace Firebase SDK with Supabase client.

### Step 4: Clean Up Files

Delete all Firebase-related files and documentation.

### Step 5: Update Environment Variables

Remove Firebase credentials, keep only Supabase.

## 🎯 Expected Result

After cleanup:
- ✅ Only Supabase for database and auth
- ✅ Faster queries with PostgreSQL
- ✅ Better real-time features
- ✅ Simpler architecture
- ✅ Reduced dependencies
- ✅ Lower costs

## 📝 Next Steps

Run the cleanup script to automatically perform these changes:
```bash
node cleanup-firebase.js
```
