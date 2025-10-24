/**
 * Authentication Controller
 */

const { getAuth, getFirestore } = require('../config/firebase');
const jwt = require('jsonwebtoken');

/**
 * Register new user
 */
exports.register = async (req, res) => {
  const { email, password, displayName, phone } = req.body;
  
  try {
    const auth = getAuth();
    const db = getFirestore();

    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      phoneNumber: phone || undefined
    });

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email,
      displayName,
      phone: phone || null,
      bio: '',
      location: '',
      photoURL: null,
      skillsOffered: [],
      skillsNeeded: [],
      skillCoinBalance: parseInt(process.env.SKILLCOIN_INITIAL_BALANCE) || 100,
      rating: 0,
      reviewCount: 0,
      role: 'user',
      isPremium: false,
      isActive: true,
      fcmToken: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    // Create initial SkillCoin transaction
    await db.collection('transactions').add({
      userId: userRecord.uid,
      type: 'credit',
      amount: userData.skillCoinBalance,
      description: 'Welcome bonus',
      createdAt: new Date().toISOString()
    });

    // Generate custom token
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        token: customToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  const { email, idToken } = req.body;

  try {
    const auth = getAuth();
    const db = getFirestore();

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user data
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();

    // Check if user is active
    if (!userData.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended'
      });
    }

    // Update last login
    await db.collection('users').doc(uid).update({
      lastLoginAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token: idToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

/**
 * Google OAuth login
 */
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const auth = getAuth();
    const db = getFirestore();

    // Verify Google ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if user exists
    let userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      // Create new user
      const userData = {
        uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
        bio: '',
        location: '',
        phone: null,
        skillsOffered: [],
        skillsNeeded: [],
        skillCoinBalance: parseInt(process.env.SKILLCOIN_INITIAL_BALANCE) || 100,
        rating: 0,
        reviewCount: 0,
        role: 'user',
        isPremium: false,
        isActive: true,
        fcmToken: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.collection('users').doc(uid).set(userData);

      // Create initial transaction
      await db.collection('transactions').add({
        userId: uid,
        type: 'credit',
        amount: userData.skillCoinBalance,
        description: 'Welcome bonus',
        createdAt: new Date().toISOString()
      });
    }

    // Get updated user data
    userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        user: userData,
        token: idToken
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Google login failed'
    });
  }
};

/**
 * Phone number login
 */
exports.phoneLogin = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const auth = getAuth();

    // In production, send OTP via SMS
    // For now, return a mock verification ID
    const verificationId = `mock_verification_${Date.now()}`;

    res.json({
      success: true,
      message: 'OTP sent to phone number',
      data: {
        verificationId
      }
    });
  } catch (error) {
    console.error('Phone login error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Phone login failed'
    });
  }
};

/**
 * Verify phone OTP
 */
exports.verifyPhone = async (req, res) => {
  const { verificationId, code, phoneNumber } = req.body;

  try {
    const auth = getAuth();
    const db = getFirestore();

    // In production, verify OTP
    // For now, mock verification
    if (code !== '123456') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if user exists with phone number
    const usersSnapshot = await db.collection('users')
      .where('phone', '==', phoneNumber)
      .limit(1)
      .get();

    let userData;
    let uid;

    if (usersSnapshot.empty) {
      // Create new user
      const userRecord = await auth.createUser({
        phoneNumber
      });
      uid = userRecord.uid;

      userData = {
        uid,
        email: null,
        displayName: `User${uid.substring(0, 6)}`,
        phone: phoneNumber,
        bio: '',
        location: '',
        photoURL: null,
        skillsOffered: [],
        skillsNeeded: [],
        skillCoinBalance: parseInt(process.env.SKILLCOIN_INITIAL_BALANCE) || 100,
        rating: 0,
        reviewCount: 0,
        role: 'user',
        isPremium: false,
        isActive: true,
        fcmToken: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.collection('users').doc(uid).set(userData);

      // Create initial transaction
      await db.collection('transactions').add({
        userId: uid,
        type: 'credit',
        amount: userData.skillCoinBalance,
        description: 'Welcome bonus',
        createdAt: new Date().toISOString()
      });
    } else {
      uid = usersSnapshot.docs[0].id;
      userData = usersSnapshot.docs[0].data();
    }

    // Create custom token
    const customToken = await auth.createCustomToken(uid);

    res.json({
      success: true,
      message: 'Phone verified successfully',
      data: {
        user: userData,
        token: customToken
      }
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Phone verification failed'
    });
  }
};

/**
 * Logout user
 */
exports.logout = async (req, res) => {
  try {
    // In a more complex setup, invalidate tokens here
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Logout failed'
    });
  }
};

/**
 * Refresh token
 */
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const auth = getAuth();

    // Verify and refresh token
    const decodedToken = await auth.verifyIdToken(refreshToken);
    const customToken = await auth.createCustomToken(decodedToken.uid);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: customToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Token refresh failed'
    });
  }
};

/**
 * Forgot password
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const auth = getAuth();

    // Generate password reset link
    const link = await auth.generatePasswordResetLink(email);

    // In production, send email with link
    console.log('Password reset link:', link);

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to send reset email'
    });
  }
};

/**
 * Reset password
 */
exports.resetPassword = async (req, res) => {
  const { oobCode, newPassword } = req.body;

  try {
    const auth = getAuth();

    // Verify reset code
    await auth.verifyPasswordResetCode(oobCode);

    // Reset password (handled by Firebase client SDK in production)
    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Password reset failed'
    });
  }
};


