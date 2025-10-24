# 🚀 SkillChain Deployment Guide

Complete guide to deploy SkillChain platform to production.

## 📋 Prerequisites

- Firebase account and project
- Stripe account (for payments)
- GitHub account (for hosting)
- Node.js 18+ installed
- Domain name (optional)

## 🔧 Setup Steps

### 1. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password, Google, Phone

3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy security rules from `firebase/firestore.rules`

4. Enable Storage:
   - Go to Storage
   - Get started
   - Deploy rules from `firebase/storage.rules`

5. Enable Cloud Messaging:
   - Go to Cloud Messaging
   - Get server key for notifications

6. Download service account key:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Save as `backend/serviceAccountKey.json`

### 2. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)

2. Get API keys:
   - Go to Developers > API keys
   - Copy Publishable key and Secret key

3. Create products and prices:
   - Boost Post 7 days: $5
   - Boost Post 14 days: $9
   - Boost Post 30 days: $15
   - Premium Monthly: $9.99
   - Premium Yearly: $99.99

4. Set up webhooks:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/payments/webhook`
   - Select events: payment_intent.*, customer.subscription.*

### 3. Backend Deployment

#### Option A: Firebase Cloud Functions

```bash
cd backend
npm install -g firebase-tools
firebase login
firebase init functions
npm run deploy
```

#### Option B: Vercel

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

#### Option C: Heroku

```bash
cd backend
heroku login
heroku create skillchain-api
git push heroku main
```

### 4. Frontend Web Deployment

#### Option A: Vercel (Recommended)

```bash
cd frontend-web
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: GitHub Pages

```bash
cd frontend-web
npm run build
npm run deploy
```

#### Option C: Firebase Hosting

```bash
cd frontend-web
npm run build
firebase deploy --only hosting
```

### 5. Mobile App Deployment

#### iOS App Store

```bash
cd mobile
eas build --platform ios
eas submit --platform ios
```

Requirements:
- Apple Developer account ($99/year)
- App Store Connect setup
- Certificates and provisioning profiles

#### Google Play Store

```bash
cd mobile
eas build --platform android
eas submit --platform android
```

Requirements:
- Google Play Developer account ($25 one-time)
- Play Console setup
- Signing key

## 🔒 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=production

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BOOST_POST_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

SKILLCOIN_CASHOUT_FEE_PERCENT=5
SKILLCOIN_INITIAL_BALANCE=100

CLIENT_URL=https://your-domain.com
```

### Frontend Web (.env.local)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Mobile (.env)

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...

EXPO_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 🗄️ Database Setup

Deploy Firestore indexes:

```bash
firebase deploy --only firestore:indexes
```

Deploy security rules:

```bash
firebase deploy --only firestore:rules,storage:rules
```

## 📊 Monitoring & Analytics

1. **Firebase Analytics**:
   - Automatic event tracking
   - User engagement metrics

2. **Sentry** (optional):
   ```bash
   npm install @sentry/node @sentry/react
   ```

3. **Google Analytics**:
   - Add tracking ID to Next.js
   - Configure in `lib/analytics.js`

## 🔐 Security Checklist

- [ ] Enable Firebase App Check
- [ ] Set up CORS properly
- [ ] Use HTTPS everywhere
- [ ] Secure API keys
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security audits
- [ ] Backup strategy

## 🚦 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd backend && npm install
      - run: cd backend && npm test
      - run: cd backend && npm run deploy

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend-web && npm install
      - run: cd frontend-web && npm run build
      - run: cd frontend-web && npm run deploy
```

## 📱 App Store Optimization

### iOS
- App name: SkillChain
- Subtitle: Skills Become Currency
- Keywords: skills, exchange, learning, marketplace
- Categories: Social Networking, Business

### Android
- Title: SkillChain - Skill Exchange
- Short description: Connect, learn, and earn with your skills
- Full description: Include features and benefits
- Category: Social, Business

## 🌐 Domain Setup

1. Purchase domain (e.g., skillchain.com)
2. Configure DNS:
   ```
   A    @    -> Your server IP
   CNAME www  -> yourdomain.com
   ```
3. Set up SSL certificate (Let's Encrypt)
4. Configure CDN (Cloudflare recommended)

## 📈 Post-Deployment

1. **Testing**:
   - Test all authentication flows
   - Test payment integration
   - Test real-time features
   - Load testing

2. **Monitoring**:
   - Set up uptime monitoring
   - Configure error alerts
   - Monitor API performance
   - Track user analytics

3. **Maintenance**:
   - Regular backups
   - Security updates
   - Performance optimization
   - Feature updates

## 🆘 Troubleshooting

### Common Issues

1. **CORS errors**: Check backend CORS configuration
2. **Firebase Auth fails**: Verify API keys and domain whitelist
3. **Stripe webhook fails**: Check webhook secret and endpoint URL
4. **Build errors**: Clear node_modules and reinstall

### Support

- GitHub Issues: [github.com/yourusername/skillchain/issues](https://github.com/yourusername/skillchain/issues)
- Email: support@skillchain.com
- Discord: [discord.gg/skillchain](https://discord.gg/skillchain)

---

**🎉 Congratulations! Your SkillChain platform is now live!**


