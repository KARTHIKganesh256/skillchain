-- SkillChain PostgreSQL Database Schema
-- Core tables for user management, skills, and transactions

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(100),
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 10),
    estimated_hours INTEGER,
    prerequisites TEXT[],
    tags TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Skills (many-to-many relationship)
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 10),
    experience_hours INTEGER DEFAULT 0,
    is_teaching BOOLEAN DEFAULT FALSE,
    hourly_rate DECIMAL(10,2),
    availability_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- SkillCoin Ledger
CREATE TABLE skillcoin_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    amount DECIMAL(18,8) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'earning', 'spending', 'transfer', 'reward'
    skill_id UUID REFERENCES skills(id),
    session_id UUID,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Learning Sessions
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id),
    teacher_id UUID REFERENCES users(id),
    skill_id UUID REFERENCES skills(id),
    session_type VARCHAR(20) NOT NULL, -- 'live', 'recorded', 'ai_assisted'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    skillcoins_cost DECIMAL(18,8),
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    meeting_url TEXT,
    recording_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and Ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID REFERENCES users(id),
    reviewee_id UUID REFERENCES users(id),
    session_id UUID REFERENCES learning_sessions(id),
    skill_id UUID REFERENCES skills(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    content TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenges
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    skill_id UUID REFERENCES skills(id),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 10),
    skillcoins_reward DECIMAL(18,8),
    xp_reward INTEGER,
    requirements JSONB,
    deadline TIMESTAMP WITH TIME ZONE,
    max_participants INTEGER,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge Participants
CREATE TABLE challenge_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'participating', -- 'participating', 'completed', 'failed'
    submission_url TEXT,
    submission_text TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(challenge_id, user_id)
);

-- Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    category VARCHAR(50),
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    skillcoins_cost DECIMAL(18,8),
    requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'workshop', 'webinar', 'meetup', 'competition'
    skill_id UUID REFERENCES skills(id),
    host_id UUID REFERENCES users(id),
    max_participants INTEGER,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(200),
    online_url TEXT,
    skillcoins_cost DECIMAL(18,8),
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Participants
CREATE TABLE event_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'registered', -- 'registered', 'attended', 'no_show'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Disputes
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES learning_sessions(id),
    complainant_id UUID REFERENCES users(id),
    respondent_id UUID REFERENCES users(id),
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_review', 'resolved', 'closed'
    resolution TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Recommendations
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id),
    recommendation_type VARCHAR(50) NOT NULL, -- 'learn', 'teach', 'connect', 'challenge'
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    reason TEXT,
    is_viewed BOOLEAN DEFAULT FALSE,
    is_accepted BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_skillcoin_ledger_user_id ON skillcoin_ledger(from_user_id);
CREATE INDEX idx_skillcoin_ledger_to_user_id ON skillcoin_ledger(to_user_id);
CREATE INDEX idx_learning_sessions_student_id ON learning_sessions(student_id);
CREATE INDEX idx_learning_sessions_teacher_id ON learning_sessions(teacher_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_challenges_skill_id ON challenges(skill_id);
CREATE INDEX idx_events_skill_id ON events(skill_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON user_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

