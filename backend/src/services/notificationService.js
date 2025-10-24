/**
 * Notification Service
 * Handles email notifications and in-app notifications
 */

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.db = null;
    this.auth = null;
    this.transporter = null;
    this.initialized = false;
  }

  /**
   * Initialize the service (call this after Firebase Admin is initialized)
   */
  initialize() {
    if (this.initialized) return;
    
    this.db = admin.firestore();
    this.auth = admin.auth();
    
    // Email transporter configuration
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to your preferred email service
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });
    
    this.initialized = true;
    console.log('✅ NotificationService initialized');
  }

  /**
   * Ensure the service is initialized before use
   */
  ensureInitialized() {
    if (!this.initialized) {
      throw new Error('NotificationService not initialized. Call initialize() first.');
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(userEmail, displayName) {
    this.ensureInitialized();
    try {
      const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=verification-token`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@skillchain.com',
        to: userEmail,
        subject: 'Verify your SkillChain account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000; text-align: center;">Welcome to SkillChain!</h1>
            <p>Hi ${displayName},</p>
            <p>Thank you for joining SkillChain! Please verify your email address to complete your registration.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              If you didn't create an account with SkillChain, please ignore this email.
            </p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Email verification sent to:', userEmail);
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(userEmail, displayName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@skillchain.com',
        to: userEmail,
        subject: 'Welcome to SkillChain! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000; text-align: center;">Welcome to SkillChain!</h1>
            <p>Hi ${displayName},</p>
            <p>Congratulations! Your email has been verified and your SkillChain account is now active.</p>
            <p>You've received <strong>100 SkillCoins</strong> as a welcome bonus! 🪙</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">What's next?</h3>
              <ul>
                <li>Complete your profile to attract more opportunities</li>
                <li>Browse available skills in the Explore section</li>
                <li>Post your first skill offering</li>
                <li>Connect with other SkillChain members</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/dashboard" 
                 style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <p>Happy skill sharing!</p>
            <p>The SkillChain Team</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent to:', userEmail);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Create in-app notification
   */
  async createNotification(userId, message, type = 'info', data = {}) {
    this.ensureInitialized();
    try {
      await this.db.collection('notifications').add({
        userId,
        message,
        type,
        data,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        readAt: null
      });
      console.log('Notification created for user:', userId);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Send skill match notification
   */
  async sendSkillMatchNotification(userId, skillName, matchType) {
    const message = matchType === 'offer' 
      ? `Someone is interested in your "${skillName}" skill offering!`
      : `We found a match for your "${skillName}" skill request!`;
    
    await this.createNotification(userId, message, 'success', {
      skillName,
      matchType
    });
  }

  /**
   * Send payment notification
   */
  async sendPaymentNotification(userId, amount, type) {
    const message = type === 'received'
      ? `You received ${amount} SkillCoins!`
      : `Payment of ${amount} SkillCoins processed successfully.`;
    
    await this.createNotification(userId, message, 'success', {
      amount,
      type
    });
  }

  /**
   * Send system notification
   */
  async sendSystemNotification(userId, message, type = 'info') {
    await this.createNotification(userId, message, type);
  }

  /**
   * Send bulk notification to all users
   */
  async sendBulkNotification(message, type = 'info') {
    this.ensureInitialized();
    try {
      const usersSnapshot = await this.db.collection('users').get();
      const batch = this.db.batch();
      
      usersSnapshot.forEach((doc) => {
        const notificationRef = this.db.collection('notifications').doc();
        batch.set(notificationRef, {
          userId: doc.id,
          message,
          type,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          readAt: null
        });
      });
      
      await batch.commit();
      console.log('Bulk notification sent to', usersSnapshot.size, 'users');
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();