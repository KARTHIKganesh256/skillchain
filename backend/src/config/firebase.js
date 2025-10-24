/**
 * Firebase Admin SDK Configuration
 */

const admin = require('firebase-admin');
const path = require('path');

let db;
let auth;
let messaging;

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebase = () => {
  try {
    let serviceAccount;
    
    // Try to load service account from file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
    }

    // Initialize with service account or default credentials
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
      });
    } else {
      admin.initializeApp();
    }

    // Initialize Firestore
    db = admin.firestore();
    db.settings({ ignoreUndefinedProperties: true });

    // Initialize Auth
    auth = admin.auth();

    // Initialize Messaging
    messaging = admin.messaging();

    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    throw error;
  }
};

/**
 * Get Firestore instance
 */
const getFirestore = () => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirebase first.');
  }
  return db;
};

/**
 * Get Auth instance
 */
const getAuth = () => {
  if (!auth) {
    throw new Error('Auth not initialized. Call initializeFirebase first.');
  }
  return auth;
};

/**
 * Get Messaging instance
 */
const getMessaging = () => {
  if (!messaging) {
    throw new Error('Messaging not initialized. Call initializeFirebase first.');
  }
  return messaging;
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getAuth,
  getMessaging,
  admin
};






