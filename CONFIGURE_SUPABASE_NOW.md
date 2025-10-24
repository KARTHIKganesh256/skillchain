# 🔧 Configure Supabase - Your Credentials

## 📋 **Your Supabase Information**

Based on your ANON_KEY, here's your Supabase project information:

- **Project Reference**: `ekabgxlqhctyqgubvwir`
- **Project URL**: `https://ekabgxlqhctyqgubvwir.supabase.co`
- **ANON Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYWJneGxxaGN0eWdxdWJ2d2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDM0MjksImV4cCI6MjA3NjMxOTQyOX0.9bippEr7GzWSb_ryVtmQc8J46YwWw8YuTGuzecjEUPY`

## ⚠️ **You Still Need:**

1. **SERVICE_ROLE_KEY** - Go to your Supabase Dashboard:
   - Visit: https://supabase.com/dashboard/project/ekabgxlqhctyqgubvwir/settings/api
   - Copy the `service_role` key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - ⚠️ **IMPORTANT**: This key bypasses Row Level Security. Keep it secret!

2. **Database Password** (optional, for direct connection):
   - Go to: https://supabase.com/dashboard/project/ekabgxlqhctyqgubvwir/settings/database
   - You set this when you created the project

## 🚀 **Quick Setup Steps**

### **Step 1: Update Backend Environment**

Edit `backend/.env` and replace the Supabase section with:

```env
# Supabase Configuration
SUPABASE_URL=https://ekabgxlqhctyqgubvwir.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYWJneGxxaGN0eWdxdWJ2d2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDM0MjksImV4cCI6MjA3NjMxOTQyOX0.9bippEr7GzWSb_ryVtmQc8J46YwWw8YuTGuzecjEUPY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Keep all other existing variables below...
```

### **Step 2: Update Frontend Environment**

Edit `frontend-web/.env.local` and replace the Supabase section with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ekabgxlqhctyqgubvwir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYWJneGxxaGN0eWdxdWJ2d2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDM0MjksImV4cCI6MjA3NjMxOTQyOX0.9bippEr7GzWSb_ryVtmQc8J46YwWw8YuTGuzecjEUPY

# Keep all other existing variables below...
```

### **Step 3: Create Database Tables**

1. **Go to SQL Editor**: https://supabase.com/dashboard/project/ekabgxlqhctyqgubvwir/sql/new
2. **Copy and paste this SQL**:

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

3. **Click "Run"** at the bottom right

### **Step 4: Restart Your Servers**

The backend should automatically restart when you save the `.env` file. The frontend will need a manual restart.

### **Step 5: Test It**

Run this in your terminal:
```bash
curl http://localhost:5000/test-supabase
```

You should see:
```json
{
  "success": true,
  "message": "Supabase connection successful",
  "timestamp": "2024-..."
}
```

## ✅ **Expected Results**

After configuration:
- ✅ Backend will connect to Supabase successfully
- ✅ No more "5 NOT_FOUND" Firebase errors
- ✅ Faster database queries
- ✅ Application will work smoothly

## 🆘 **Need Help?**

If you can't find your SERVICE_ROLE_KEY:
1. Go to: https://supabase.com/dashboard/project/ekabgxlqhctyqgubvwir/settings/api
2. Scroll down to "Project API keys"
3. Copy the `service_role` key (the longer one, marked as "secret")
4. Paste it in your `backend/.env` file

**Your SkillChain app is almost ready! Just add the SERVICE_ROLE_KEY and run the SQL to create tables.**
