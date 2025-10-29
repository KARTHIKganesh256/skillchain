# SkillChain Email Authentication Templates

## 📧 **Supabase Email Configuration**

### **1. Confirm Sign Up Email**

**Subject:** `Welcome to SkillChain - Confirm Your Account`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SkillChain</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .header p { color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .content h2 { color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; }
        .content p { color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .button:hover { background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%); }
        .features { background-color: #f7fafc; padding: 30px; margin: 30px 0; border-radius: 8px; }
        .features h3 { color: #2d3748; margin: 0 0 20px 0; font-size: 20px; }
        .features ul { margin: 0; padding-left: 20px; }
        .features li { color: #4a5568; margin: 8px 0; }
        .footer { background-color: #2d3748; padding: 30px; text-align: center; }
        .footer p { color: #a0aec0; margin: 0; font-size: 14px; }
        .logo { width: 60px; height: 60px; margin: 0 auto 20px; background: #ffffff; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SC</div>
            <h1>Welcome to SkillChain!</h1>
            <p>Your AI-Powered Skill Ecosystem</p>
        </div>
        
        <div class="content">
            <h2>Confirm Your Account</h2>
            <p>Hi there! 👋</p>
            <p>Welcome to SkillChain, where you can teach, learn, and exchange skills using our innovative SkillCoin system. We're excited to have you join our community of learners and educators!</p>
            
            <p>To get started, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm My Account</a>
            </div>
            
            <div class="features">
                <h3>🚀 What you can do on SkillChain:</h3>
                <ul>
                    <li><strong>Learn New Skills:</strong> Access thousands of courses taught by experts</li>
                    <li><strong>Teach Others:</strong> Share your knowledge and earn SkillCoins</li>
                    <li><strong>AI-Powered Learning:</strong> Get personalized recommendations and assistance</li>
                    <li><strong>Connect Globally:</strong> Learn from and teach people worldwide</li>
                    <li><strong>Build Your Portfolio:</strong> Showcase your skills and achievements</li>
                </ul>
            </div>
            
            <p>If you didn't create an account with SkillChain, you can safely ignore this email.</p>
            
            <p>Welcome aboard!<br>
            The SkillChain Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 SkillChain. All rights reserved.</p>
            <p>This email was sent to {{ .Email }}. If you have any questions, contact us at support@skillchain.com</p>
        </div>
    </div>
</body>
</html>
```

### **2. Magic Link Email**

**Subject:** `Your SkillChain Login Link`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your SkillChain Login Link</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .content h2 { color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; }
        .content p { color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .security-notice { background-color: #fef5e7; border: 1px solid #f6ad55; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .security-notice h4 { color: #c05621; margin: 0 0 10px 0; }
        .security-notice p { color: #744210; margin: 0; font-size: 14px; }
        .footer { background-color: #2d3748; padding: 30px; text-align: center; }
        .footer p { color: #a0aec0; margin: 0; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Your Login Link</h1>
        </div>
        
        <div class="content">
            <h2>Sign in to SkillChain</h2>
            <p>Hi there!</p>
            <p>You requested a magic link to sign in to your SkillChain account. Click the button below to access your account securely:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Sign In to SkillChain</a>
            </div>
            
            <div class="security-notice">
                <h4>🛡️ Security Notice</h4>
                <p>This link will expire in 1 hour for your security. If you didn't request this login link, please ignore this email and consider changing your password.</p>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f7fafc; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">{{ .ConfirmationURL }}</p>
            
            <p>Happy learning!<br>
            The SkillChain Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 SkillChain. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### **3. Reset Password Email**

**Subject:** `Reset Your SkillChain Password`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your SkillChain Password</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .content h2 { color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; }
        .content p { color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px; }
        .button { display: inline-block; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .security-notice { background-color: #fed7d7; border: 1px solid #feb2b2; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .security-notice h4 { color: #c53030; margin: 0 0 10px 0; }
        .security-notice p { color: #742a2a; margin: 0; font-size: 14px; }
        .footer { background-color: #2d3748; padding: 30px; text-align: center; }
        .footer p { color: #a0aec0; margin: 0; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Password Reset</h1>
        </div>
        
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hi there!</p>
            <p>We received a request to reset your SkillChain account password. If you made this request, click the button below to create a new password:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Reset My Password</a>
            </div>
            
            <div class="security-notice">
                <h4>⚠️ Important Security Information</h4>
                <p>This password reset link will expire in 1 hour for your security. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f7fafc; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">{{ .ConfirmationURL }}</p>
            
            <p>If you have any questions or concerns, please contact our support team at support@skillchain.com</p>
            
            <p>Best regards,<br>
            The SkillChain Security Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 SkillChain. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### **4. Change Email Address Email**

**Subject:** `Confirm Your New Email Address`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your New Email Address</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #38b2ac 0%, #319795 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .content h2 { color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; }
        .content p { color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px; }
        .button { display: inline-block; background: linear-gradient(135deg, #38b2ac 0%, #319795 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .info-box { background-color: #e6fffa; border: 1px solid #81e6d9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .info-box h4 { color: #234e52; margin: 0 0 10px 0; }
        .info-box p { color: #234e52; margin: 0; font-size: 14px; }
        .footer { background-color: #2d3748; padding: 30px; text-align: center; }
        .footer p { color: #a0aec0; margin: 0; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Email Change Confirmation</h1>
        </div>
        
        <div class="content">
            <h2>Confirm Your New Email Address</h2>
            <p>Hi there!</p>
            <p>You recently requested to change your SkillChain account email address. To complete this change, please confirm your new email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm New Email</a>
            </div>
            
            <div class="info-box">
                <h4>ℹ️ What happens next?</h4>
                <p>Once you confirm this email address, it will become your new login email for SkillChain. Your old email address will no longer be associated with your account.</p>
            </div>
            
            <p>If you didn't request this email change, please contact our support team immediately at support@skillchain.com</p>
            
            <p>This confirmation link will expire in 24 hours for security reasons.</p>
            
            <p>Best regards,<br>
            The SkillChain Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 SkillChain. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### **5. Invite User Email**

**Subject:** `You're Invited to Join SkillChain!`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're Invited to SkillChain</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%); padding: 40px 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .content h2 { color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; }
        .content p { color: #4a5568; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px; }
        .button { display: inline-block; background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .invitation-box { background-color: #faf5ff; border: 1px solid #d6bcfa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .invitation-box h4 { color: #553c9a; margin: 0 0 10px 0; }
        .invitation-box p { color: #553c9a; margin: 0; font-size: 14px; }
        .features { background-color: #f7fafc; padding: 30px; margin: 30px 0; border-radius: 8px; }
        .features h3 { color: #2d3748; margin: 0 0 20px 0; font-size: 20px; }
        .features ul { margin: 0; padding-left: 20px; }
        .features li { color: #4a5568; margin: 8px 0; }
        .footer { background-color: #2d3748; padding: 30px; text-align: center; }
        .footer p { color: #a0aec0; margin: 0; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 You're Invited!</h1>
        </div>
        
        <div class="content">
            <h2>Join SkillChain Today</h2>
            <p>Hi there!</p>
            <p>You've been invited to join SkillChain, the AI-powered skill ecosystem where you can teach, learn, and exchange skills with people worldwide!</p>
            
            <div class="invitation-box">
                <h4>🎁 Special Invitation Bonus</h4>
                <p>As an invited user, you'll receive 150 SkillCoins (worth $15) to get started on your learning journey!</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Accept Invitation & Join SkillChain</a>
            </div>
            
            <div class="features">
                <h3>🌟 What makes SkillChain special:</h3>
                <ul>
                    <li><strong>AI-Powered Learning:</strong> Get personalized recommendations and AI assistance</li>
                    <li><strong>SkillCoin Economy:</strong> Earn and spend SkillCoins for learning and teaching</li>
                    <li><strong>Global Community:</strong> Connect with learners and teachers worldwide</li>
                    <li><strong>Verified Skills:</strong> Learn from verified experts in their fields</li>
                    <li><strong>Flexible Learning:</strong> Choose from live sessions, recorded courses, or AI-assisted learning</li>
                </ul>
            </div>
            
            <p>Ready to start your skill development journey? Click the button above to create your account and claim your welcome bonus!</p>
            
            <p>Welcome to the future of learning!<br>
            The SkillChain Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 SkillChain. All rights reserved.</p>
            <p>This invitation was sent to {{ .Email }}. If you have any questions, contact us at support@skillchain.com</p>
        </div>
    </div>
</body>
</html>
```

## 🔧 **How to Configure in Supabase**

### **Step 1: Access Email Templates**
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Emails**
3. Click on the **Templates** tab

### **Step 2: Update Each Template**
1. **Confirm Sign Up**: Replace the default template with the "Confirm Sign Up" template above
2. **Magic Link**: Replace with the "Magic Link" template
3. **Reset Password**: Replace with the "Reset Password" template
4. **Change Email Address**: Replace with the "Change Email Address" template
5. **Invite User**: Replace with the "Invite User" template

### **Step 3: Configure SMTP (Recommended)**
1. Click on **SMTP Settings** tab
2. Set up a custom SMTP provider (SendGrid, Mailgun, etc.)
3. Configure your SMTP credentials

### **Step 4: Test Email Templates**
1. Use the **Preview** tab to see how emails will look
2. Send test emails to verify everything works correctly

## 📧 **Email Variables Available**

- `{{ .ConfirmationURL }}` - The confirmation/action URL
- `{{ .Email }}` - The user's email address
- `{{ .SiteURL }}` - Your site URL
- `{{ .Token }}` - The confirmation token (if needed)

## 🎨 **Customization Tips**

1. **Colors**: Update the gradient colors in the CSS to match your brand
2. **Logo**: Replace the "SC" logo with your actual SkillChain logo
3. **Content**: Modify the text to match your specific messaging
4. **Features**: Update the feature lists to highlight your unique value propositions

These templates are designed to be professional, mobile-responsive, and aligned with SkillChain's modern, AI-powered learning platform branding!
