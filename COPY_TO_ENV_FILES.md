# 🎉 Complete Supabase Configuration - Ready to Copy!

## ✅ **All Credentials Are Ready!**

I have all your Supabase credentials. Just copy the content below into your environment files.

---

## 📁 **Backend Configuration**

**Copy this ENTIRE content into `backend/.env` file:**

```env
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://ekabgxlqhctyqgubvwir.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYWJneGxxaGN0eWdxdWJ2d2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDM0MjksImV4cCI6MjA3NjMxOTQyOX0.9bippEr7GzWSb_ryVtmQc8J46YwWw8YuTGuzecjEUPY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYWJneGxxaGN0eWdxdWJ2d2lyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc0MzQyOSwiZXhwIjoyMDc2MzE5NDI5fQ.mzqN1xmtgCpjV72V5rJOlVjX9pH-zwUm_P_82nhIDrs

# Stripe Configuration (Optional - can add later)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_BOOST_POST_PRICE_ID=price_your_boost_price_id
STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-32-chars
JWT_EXPIRES_IN=7d

# SkillCoin Configuration
SKILLCOIN_CASHOUT_FEE_PERCENT=5
SKILLCOIN_INITIAL_BALANCE=100
SKILLCOIN_POST_REWARD=10
SKILLCOIN_COMPLETE_TASK_REWARD=50

# App Configuration
CLIENT_URL=http://localhost:3000
ADMIN_EMAIL=admin@skillchain.com

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 📁 **Frontend Configuration**

**Copy this ENTIRE content into `frontend-web/.env.local` file:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ekabgxlqhctyqgubvwir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYWJneGxxaGN0eWdxdWJ2d2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDM0MjksImV4cCI6MjA3NjMxOTQyOX0.9bippEr7GzWSb_ryVtmQc8J46YwWw8YuTGuzecjEUPY

# Stripe Configuration (Optional - can add later)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🚀 **Next Steps (Do These Now):**

### **1. Update Environment Files**
Open these files and paste the content:
- `backend/.env` - Paste backend configuration from above
- `frontend-web/.env.local` - Paste frontend configuration from above

### **2. Create Database Tables**
Go to: https://supabase.com/dashboard/project/ekabgxlqhctyqgubvwir/sql/new

Paste this SQL and click "Run":

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS posts (
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
CREATE TABLE IF NOT EXISTS matches (
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
CREATE TABLE IF NOT EXISTS chats (
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
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_is_active ON posts(is_active);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chats_updated_at ON chats;
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **3. Test Your Setup**
After saving the `.env` files, your backend should auto-restart. Then test:

```bash
curl http://localhost:5000/test-supabase
```

**Expected result:**
```json
{
  "success": true,
  "message": "Supabase connection successful",
  "timestamp": "2024-..."
}
```

---

## 🎉 **What Happens Next:**

1. ✅ **Backend restarts automatically** (nodemon will detect `.env` change)
2. ✅ **"Supabase initialized successfully"** message appears
3. ✅ **All Firebase errors disappear** (no more "5 NOT_FOUND")
4. ✅ **App becomes much faster**
5. ✅ **Database operations work smoothly**

---

## 📝 **Quick Copy Instructions:**

1. Open `backend/.env` in your editor
2. **Delete all content** in the file
3. **Paste** the backend configuration from above
4. **Save** the file
5. Open `frontend-web/.env.local` in your editor
6. **Delete all content** in the file
7. **Paste** the frontend configuration from above
8. **Save** the file
9. Go to Supabase SQL Editor and run the SQL
10. Watch your backend restart automatically!

**Your SkillChain app will be ready to use!** 🚀
