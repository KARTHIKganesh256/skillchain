-- SkillChain Supabase Database Setup - FIXED VERSION
-- This version fixes all PostgreSQL syntax issues

-- SkillChain user roles for admin permissions
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','user')) default 'user',
  created_at timestamp with time zone default now()
);

-- Drop policy if it exists first, then create it
drop policy if exists "Users can read their role" on public.user_roles;
create policy "Users can read their role"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

-- Only service role (server) may insert/update roles; disable by default
alter table public.user_roles enable row level security;

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

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(50),
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 10),
  estimated_hours INTEGER,
  prerequisites TEXT[],
  tags TEXT[],
  is_verified BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 10),
  experience_hours INTEGER DEFAULT 0,
  is_teaching BOOLEAN DEFAULT false,
  hourly_rate DECIMAL(10,2),
  availability_schedule JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- SkillCoin Ledger
CREATE TABLE IF NOT EXISTS skillcoin_ledger (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  amount DECIMAL(18,8) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  skill_id UUID REFERENCES skills(id),
  session_id UUID,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Learning Sessions
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES users(id),
  teacher_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  session_type VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  skillcoins_cost DECIMAL(18,8),
  status VARCHAR(20) DEFAULT 'scheduled',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  meeting_url TEXT,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  session_id UUID REFERENCES learning_sessions(id),
  skill_id UUID REFERENCES skills(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  content TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_is_active ON posts(is_active);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_skillcoin_ledger_from_user ON skillcoin_ledger(from_user_id);
CREATE INDEX IF NOT EXISTS idx_skillcoin_ledger_to_user ON skillcoin_ledger(to_user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_student ON learning_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_teacher ON learning_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at 
  BEFORE UPDATE ON matches 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chats_updated_at ON chats;
CREATE TRIGGER update_chats_updated_at 
  BEFORE UPDATE ON chats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at 
  BEFORE UPDATE ON skills 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_skills_updated_at ON user_skills;
CREATE TRIGGER update_user_skills_updated_at 
  BEFORE UPDATE ON user_skills 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at 
  BEFORE UPDATE ON reviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillcoin_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create basic RLS policies for posts table
DROP POLICY IF EXISTS "Anyone can view active posts" ON posts;
CREATE POLICY "Anyone can view active posts" ON posts
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can view own posts" ON posts;
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own posts" ON posts;
CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create basic RLS policies for messages table
DROP POLICY IF EXISTS "Users can view messages in their chats" ON messages;
CREATE POLICY "Users can view messages in their chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert messages in their chats" ON messages;
CREATE POLICY "Users can insert messages in their chats" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

-- Create basic RLS policies for notifications table
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create basic RLS policies for skills table
DROP POLICY IF EXISTS "Anyone can view skills" ON skills;
CREATE POLICY "Anyone can view skills" ON skills
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert skills" ON skills;
CREATE POLICY "Users can insert skills" ON skills
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create basic RLS policies for user_skills table
DROP POLICY IF EXISTS "Users can view own skills" ON user_skills;
CREATE POLICY "Users can view own skills" ON user_skills
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;
CREATE POLICY "Users can manage own skills" ON user_skills
  FOR ALL USING (auth.uid() = user_id);

-- Create basic RLS policies for skillcoin_ledger table
DROP POLICY IF EXISTS "Users can view own transactions" ON skillcoin_ledger;
CREATE POLICY "Users can view own transactions" ON skillcoin_ledger
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Create basic RLS policies for learning_sessions table
DROP POLICY IF EXISTS "Users can view own sessions" ON learning_sessions;
CREATE POLICY "Users can view own sessions" ON learning_sessions
  FOR SELECT USING (auth.uid() = student_id OR auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Users can create sessions" ON learning_sessions;
CREATE POLICY "Users can create sessions" ON learning_sessions
  FOR INSERT WITH CHECK (auth.uid() = student_id OR auth.uid() = teacher_id);

-- Create basic RLS policies for reviews table
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Success message
SELECT 'SkillChain database schema created successfully!' as message;
