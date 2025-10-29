# Supabase Setup for SkillChain Auth and Admin Roles

1) Create a Supabase project and grab the URL and `anon` key.

2) In `frontend/.env` (or your React env), set:

```
REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

3) In Supabase SQL editor, run the SQL in `SUPABASE_DATABASE_SETUP.sql` to create the `user_roles` table with RLS.

4) Mark admins by inserting rows (use the SQL editor with service role context):

```
insert into public.user_roles (user_id, role)
values ('<auth.users.id for the admin>', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

5) In the app, users sign in with email/password. After login, the app reads `user_roles` to set role `admin` or `user` and stores it in localStorage under `role`.

# 🚀 Supabase Setup Guide for SkillChain

## 📋 **Overview**
This guide will help you set up Supabase as your database for the SkillChain application, replacing Firebase Firestore.

## 🎯 **Why Supabase?**
- ✅ **PostgreSQL Database** - More powerful than Firestore
- ✅ **Real-time subscriptions** - Built-in real-time features
- ✅ **REST API** - Auto-generated API endpoints
- ✅ **Authentication** - Built-in auth system
- ✅ **Better Performance** - Faster queries and responses
- ✅ **SQL Support** - Full SQL capabilities

## 🔧 **Step 1: Create Supabase Project**

1. **Go to Supabase Console**
   - Visit: https://supabase.com/dashboard
   - Sign up/Login with your account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Project name: `skillchain`
   - Database password: Generate a strong password (save it!)
   - Region: Choose closest to your location
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see a progress indicator

## 🔑 **Step 2: Get Project Credentials**

1. **Go to Project Settings**
   - Click the gear icon (⚙️) in the left sidebar
   - Select "API"

2. **Copy These Values**
   ```
   Project URL: https://your-project-id.supabase.co
   API Key (anon public): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   API Key (service_role): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Database Connection String**
   - Go to "Database" in settings
   - Copy the connection string (starts with `postgresql://`)

## 🗄️ **Step 3: Create Database Schema**

1. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run This SQL Script**
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
     type VARCHAR(50) NOT NULL, -- 'offer' or 'request'
     price INTEGER, -- in SkillCoins
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
     status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'completed'
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
     type VARCHAR(50) NOT NULL, -- 'match', 'message', 'system'
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

3. **Click "Run" to execute the script**

## 🔐 **Step 4: Set Up Row Level Security (RLS)**

1. **Enable RLS on all tables**
   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
   ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
   ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

   -- Users can read and update their own data
   CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

   -- Posts are public for reading, users can manage their own
   CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
   CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

   -- Matches policies
   CREATE POLICY "Users can view own matches" ON matches FOR SELECT USING (auth.uid() = user_id OR auth.uid() = matched_user_id);
   CREATE POLICY "Users can create matches" ON matches FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own matches" ON matches FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

   -- Chat policies
   CREATE POLICY "Users can view own chats" ON chats FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
   CREATE POLICY "Users can create chats" ON chats FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

   -- Message policies
   CREATE POLICY "Users can view messages in their chats" ON messages FOR SELECT USING (
     EXISTS (
       SELECT 1 FROM chats 
       WHERE chats.id = messages.chat_id 
       AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
     )
   );
   CREATE POLICY "Users can send messages in their chats" ON messages FOR INSERT WITH CHECK (
     EXISTS (
       SELECT 1 FROM chats 
       WHERE chats.id = messages.chat_id 
       AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
     )
   );

   -- Notification policies
   CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
   ```

## 🔧 **Step 5: Configure Environment Variables**

1. **Backend Environment (.env)**
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_DB_URL=postgresql://postgres:password@db.your-project-id.supabase.co:5432/postgres

   # Remove Firebase config (keep other settings)
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-32-chars
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```

2. **Frontend Environment (.env.local)**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Remove Firebase config (keep other settings)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

## 📦 **Step 6: Install Supabase Dependencies**

1. **Backend Dependencies**
   ```bash
   cd backend
   npm install @supabase/supabase-js
   ```

2. **Frontend Dependencies**
   ```bash
   cd frontend-web
   npm install @supabase/supabase-js
   ```

## ✅ **Step 7: Test Connection**

1. **Test Database Connection**
   - Go to Supabase Dashboard
   - Click "Table Editor"
   - You should see all your tables created

2. **Test API**
   - Go to "API" in settings
   - Try the auto-generated endpoints

## 🎉 **You're Ready!**

Your Supabase database is now configured and ready to use with SkillChain!

## 📚 **Next Steps**

1. Update backend code to use Supabase
2. Update frontend code to use Supabase
3. Test all functionality
4. Deploy your application

## 🆘 **Need Help?**

- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions
- **Discord**: https://discord.supabase.com/
