# 🚀 Supabase Quick Start for SkillChain

## 📋 **Current Status**
Your SkillChain application is now configured to use Supabase instead of Firebase. The backend will start without Supabase credentials, but you'll need to set up Supabase to use database features.

## ⚡ **Quick Setup (5 minutes)**

### **Step 1: Create Supabase Project**

1. **Go to Supabase**: https://supabase.com/dashboard
2. **Sign up/Login** with your account
3. **Click "New Project"**
4. **Fill in details**:
   - Project name: `skillchain`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to you
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for setup to complete

### **Step 2: Get Your Credentials**

1. **Go to Settings** → **API** in your Supabase dashboard
2. **Copy these values**:
   ```
   Project URL: https://your-project-id.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **Step 3: Create Database Schema**

1. **Go to SQL Editor** in your Supabase dashboard
2. **Click "New query"**
3. **Copy and paste this SQL**:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  bio TEXT,
  location VARCHAR(255),
  phone VARCHAR(20),
  photo_url TEXT,
  skill_coin_balance INTEGER DEFAULT 100,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  role VARCHAR(50) DEFAULT 'user',
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  price INTEGER,
  location VARCHAR(255),
  skills_required TEXT[],
  skills_offered TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_boosted BOOLEAN DEFAULT false,
  boost_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  matched_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats table
CREATE TABLE chats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_is_active ON posts(is_active);
CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. **Click "Run"** to execute the script

### **Step 4: Configure Environment Variables**

1. **Backend Environment** (`backend/.env`):
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_DB_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres

   # Keep other existing variables
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-32-chars
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ADMIN_EMAIL=admin@skillchain.com
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

2. **Frontend Environment** (`frontend-web/.env.local`):
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Keep other existing variables
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

### **Step 5: Test Your Setup**

1. **Restart your backend**:
   ```bash
   # Stop current backend (Ctrl+C)
   npm run dev:backend
   ```

2. **Test Supabase connection**:
   ```bash
   curl http://localhost:5000/test-supabase
   ```

3. **You should see**:
   ```json
   {
     "success": true,
     "message": "Supabase connection successful",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

## 🎉 **You're Done!**

Your SkillChain application is now using Supabase! The benefits you'll get:

- ✅ **No more Firebase errors**
- ✅ **Faster database queries**
- ✅ **Real-time features**
- ✅ **Better performance**
- ✅ **SQL support**

## 🆘 **Need Help?**

- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions
- **Discord**: https://discord.supabase.com/

## 📝 **Next Steps**

1. Test user registration and login
2. Create some posts
3. Test the matching system
4. Verify real-time notifications work

Your application should now be much faster and more reliable!
