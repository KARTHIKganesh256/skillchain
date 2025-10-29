# SkillChain Environment Configuration

## 🔧 **Complete Environment Setup with Real Values**

### **1. Backend Environment (.env)**

```bash
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration
# Supabase (Primary Database)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# MongoDB (Secondary Database for Analytics)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillchain?retryWrites=true&w=majority

# Firebase (Real-time Features)
FIREBASE_PROJECT_ID=skillchain-app
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@skillchain-app.iam.gserviceaccount.com

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# SkillCoin Configuration
SKILLCOIN_INITIAL_BALANCE=100
SKILLCOIN_EXCHANGE_RATE=0.01
SKILLCOIN_MIN_TRANSACTION=1
SKILLCOIN_MAX_TRANSACTION=10000

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs for Subscriptions
STRIPE_AI_ASSISTANT_PRICE_ID=price_ai_assistant_monthly
STRIPE_SKILLPRO_BASIC_PRICE_ID=price_skillpro_basic
STRIPE_SKILLPRO_PREMIUM_PRICE_ID=price_skillpro_premium

# AI API Configuration
AI_API_URL=https://your-ai-api.railway.app
AI_API_KEY=your-ai-api-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# Email Configuration (SendGrid)
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
FROM_EMAIL=noreply@skillchain.com
FROM_NAME=SkillChain

# Redis Configuration (Caching)
REDIS_URL=redis://username:password@your-redis-host:6379
REDIS_PASSWORD=your-redis-password

# File Upload Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Security Configuration
CORS_ORIGIN=https://skillchain.vercel.app,https://www.skillchain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring & Analytics
SENTRY_DSN=https://your-sentry-dsn-here
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX-X

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_PREMIUM_FEATURES=true
ENABLE_MOBILE_APP=true
ENABLE_ANALYTICS=true

# Development/Testing
DEBUG=false
LOG_LEVEL=info
```

### **2. Frontend Environment (.env)**

```bash
# API Configuration
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_AI_API_URL=https://your-ai-api.railway.app

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=skillchain-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=skillchain-app
REACT_APP_FIREBASE_STORAGE_BUCKET=skillchain-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Social Login Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
REACT_APP_LINKEDIN_CLIENT_ID=your-linkedin-client-id

# Map Configuration
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX-X
REACT_APP_MIXPANEL_TOKEN=your-mixpanel-token

# Feature Flags
REACT_APP_ENABLE_AI_FEATURES=true
REACT_APP_ENABLE_PREMIUM_FEATURES=true
REACT_APP_ENABLE_MOBILE_APP=true
REACT_APP_ENABLE_ANALYTICS=true

# App Configuration
REACT_APP_APP_NAME=SkillChain
REACT_APP_APP_VERSION=2.0.0
REACT_APP_APP_DESCRIPTION=AI-Powered Skill Ecosystem
REACT_APP_APP_URL=https://skillchain.com

# Development
REACT_APP_DEBUG=false
REACT_APP_LOG_LEVEL=info
```

### **3. AI API Environment (.env)**

```bash
# Server Configuration
NODE_ENV=production
PORT=8000
HOST=0.0.0.0

# AI API Keys
OPENAI_API_KEY=sk-your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillchain-ai?retryWrites=true&w=majority

# Redis Configuration
REDIS_URL=redis://username:password@your-redis-host:6379

# SkillChain Backend API
SKILLCHAIN_API_URL=https://your-backend.railway.app
SKILLCHAIN_API_KEY=your-backend-api-key

# AI Model Configuration
DEFAULT_AI_MODEL=gpt-4
FALLBACK_AI_MODEL=gpt-3.5-turbo
EMBEDDING_MODEL=text-embedding-ada-002

# Rate Limiting
AI_RATE_LIMIT_PER_MINUTE=60
AI_RATE_LIMIT_PER_HOUR=1000

# Feature Configuration
ENABLE_VOICE_PROCESSING=true
ENABLE_TRANSLATION=true
ENABLE_SENTIMENT_ANALYSIS=true
ENABLE_SKILL_RECOMMENDATIONS=true

# Monitoring
SENTRY_DSN=https://your-sentry-dsn-here
LOG_LEVEL=info
```

### **4. Mobile App Environment (.env)**

```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://your-backend.railway.app
EXPO_PUBLIC_AI_API_URL=https://your-ai-api.railway.app

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=skillchain-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=skillchain-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=skillchain-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Social Login
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=your-google-client-id-ios.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=your-google-client-id-android.apps.googleusercontent.com

# App Configuration
EXPO_PUBLIC_APP_NAME=SkillChain
EXPO_PUBLIC_APP_VERSION=2.0.0
EXPO_PUBLIC_APP_SCHEME=skillchain

# Feature Flags
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_PREMIUM_FEATURES=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true

# Development
EXPO_PUBLIC_DEBUG=false
```

## 🔐 **Security Configuration**

### **JWT Secret Generation**
```bash
# Generate a secure JWT secret (32+ characters)
openssl rand -base64 32
```

### **API Key Generation**
```bash
# Generate secure API keys
openssl rand -hex 32
```

## 📊 **Database Connection Strings**

### **Supabase Configuration**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and API keys

### **MongoDB Atlas Configuration**
1. Create a cluster on MongoDB Atlas
2. Create a database user
3. Whitelist your IP addresses
4. Get the connection string

### **Redis Configuration**
1. Use Redis Cloud or set up your own Redis instance
2. Get the connection URL with credentials

## 🚀 **Deployment Configuration**

### **Railway Backend Deployment**
```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Vercel Frontend Deployment**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url",
    "REACT_APP_SUPABASE_URL": "@react_app_supabase_url"
  }
}
```

## 🔧 **Environment Setup Script**

Create a setup script to automatically configure environments:

```bash
#!/bin/bash
# setup-env.sh

echo "🚀 Setting up SkillChain environment..."

# Create .env files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp ai-api/.env.example ai-api/.env
cp mobile/.env.example mobile/.env

# Generate secure keys
JWT_SECRET=$(openssl rand -base64 32)
API_KEY=$(openssl rand -hex 32)

# Update .env files with generated keys
sed -i "s/your-jwt-secret-here/$JWT_SECRET/g" .env
sed -i "s/your-api-key-here/$API_KEY/g" .env

echo "✅ Environment files created successfully!"
echo "📝 Please update the .env files with your actual API keys and credentials."
```

## 📋 **Required API Keys & Services**

### **Essential Services**
- [ ] Supabase (Database & Auth)
- [ ] MongoDB Atlas (Analytics)
- [ ] Stripe (Payments)
- [ ] OpenAI (AI Features)
- [ ] Google Maps (Location Features)
- [ ] SendGrid (Email)

### **Optional Services**
- [ ] Redis (Caching)
- [ ] Cloudinary (File Upload)
- [ ] Sentry (Error Monitoring)
- [ ] Google Analytics (Analytics)
- [ ] Mixpanel (User Analytics)

## 🎯 **Next Steps**

1. **Set up Supabase project** and get API keys
2. **Configure Stripe** for payments
3. **Set up MongoDB Atlas** for analytics
4. **Get OpenAI API key** for AI features
5. **Configure email service** (SendGrid recommended)
6. **Set up monitoring** (Sentry, Analytics)
7. **Deploy to production** platforms

This configuration provides a complete, production-ready setup for SkillChain with all necessary environment variables and security measures!
