// SkillChain MongoDB Collections Schema
// Document-based collections for flexible data storage

// Reels Collection - Video-based learning content
const reelsSchema = {
  _id: ObjectId,
  title: String,
  description: String,
  creator_id: ObjectId, // Reference to users collection
  skill_id: ObjectId, // Reference to skills collection
  video_url: String,
  thumbnail_url: String,
  duration_seconds: Number,
  difficulty_level: Number, // 1-10
  tags: [String],
  likes_count: Number,
  views_count: Number,
  comments_count: Number,
  skillcoins_cost: Number,
  is_verified: Boolean,
  is_featured: Boolean,
  created_at: Date,
  updated_at: Date,
  metadata: {
    resolution: String,
    file_size: Number,
    encoding: String,
    language: String
  }
};

// AI Learning Sessions - Voice Q&A interactions
const aiLearningSessionsSchema = {
  _id: ObjectId,
  user_id: ObjectId,
  skill_id: ObjectId,
  session_type: String, // 'voice_qa', 'text_qa', 'practice'
  questions: [{
    question: String,
    answer: String,
    confidence_score: Number,
    timestamp: Date,
    language: String
  }],
  voice_data: {
    audio_url: String,
    transcription: String,
    language_detected: String,
    sentiment: String
  },
  ai_insights: {
    learning_progress: Number,
    weak_areas: [String],
    recommendations: [String],
    next_steps: [String]
  },
  duration_minutes: Number,
  skillcoins_earned: Number,
  created_at: Date,
  completed_at: Date
};

// SkillGraph Network Data
const skillGraphSchema = {
  _id: ObjectId,
  user_id: ObjectId,
  skill_connections: [{
    from_skill: ObjectId,
    to_skill: ObjectId,
    connection_strength: Number, // 0-1
    connection_type: String, // 'prerequisite', 'related', 'advanced'
    user_proficiency: Number // 1-10
  }],
  learning_paths: [{
    path_id: ObjectId,
    skills_sequence: [ObjectId],
    estimated_duration: Number,
    difficulty_progression: [Number],
    is_completed: Boolean
  }],
  network_metrics: {
    centrality_score: Number,
    influence_score: Number,
    learning_velocity: Number,
    teaching_impact: Number
  },
  updated_at: Date
};

// Real-world Skill Map Data
const skillMapSchema = {
  _id: ObjectId,
  location: {
    type: String, // 'Point'
    coordinates: [Number] // [longitude, latitude]
  },
  skill_id: ObjectId,
  user_id: ObjectId,
  availability: {
    start_time: String,
    end_time: String,
    days: [String],
    timezone: String
  },
  meeting_preferences: {
    online: Boolean,
    in_person: Boolean,
    hybrid: Boolean,
    max_distance_km: Number
  },
  rating: Number,
  reviews_count: Number,
  created_at: Date,
  updated_at: Date
};

// Gamification Data
const gamificationSchema = {
  _id: ObjectId,
  user_id: ObjectId,
  xp_total: Number,
  level: Number,
  achievements: [{
    achievement_id: ObjectId,
    name: String,
    description: String,
    earned_at: Date,
    rarity: String
  }],
  leaderboard_positions: [{
    category: String,
    position: Number,
    score: Number,
    period: String // 'daily', 'weekly', 'monthly', 'all_time'
  }],
  streaks: {
    learning_streak: Number,
    teaching_streak: Number,
    longest_learning_streak: Number,
    longest_teaching_streak: Number
  },
  challenges_completed: [ObjectId],
  badges_earned: [ObjectId],
  last_activity: Date,
  updated_at: Date
};

// AI Recommendations Cache
const aiRecommendationsSchema = {
  _id: ObjectId,
  user_id: ObjectId,
  recommendations: [{
    type: String, // 'skill_to_learn', 'skill_to_teach', 'person_to_connect', 'challenge_to_take'
    target_id: ObjectId, // skill_id, user_id, or challenge_id
    confidence_score: Number,
    reason: String,
    generated_at: Date,
    expires_at: Date
  }],
  user_preferences: {
    learning_style: String,
    time_availability: String,
    difficulty_preference: String,
    interests: [String]
  },
  ai_model_version: String,
  last_updated: Date
};

// Multilingual Content
const multilingualContentSchema = {
  _id: ObjectId,
  content_type: String, // 'skill_description', 'reel_title', 'challenge_description'
  content_id: ObjectId,
  translations: [{
    language: String,
    content: String,
    translated_at: Date,
    translator: String, // 'ai' or 'human'
    confidence_score: Number
  }],
  original_language: String,
  created_at: Date
};

// Voice Bot Interactions
const voiceBotSchema = {
  _id: ObjectId,
  user_id: ObjectId,
  session_id: String,
  interactions: [{
    timestamp: Date,
    user_input: String,
    bot_response: String,
    intent: String,
    entities: [String],
    confidence: Number,
    language: String,
    sentiment: String
  }],
  session_metadata: {
    duration: Number,
    language: String,
    skill_focus: String,
    learning_objective: String
  },
  created_at: Date,
  ended_at: Date
};

// Analytics and Metrics
const analyticsSchema = {
  _id: ObjectId,
  user_id: ObjectId,
  date: Date,
  metrics: {
    learning_time_minutes: Number,
    teaching_time_minutes: Number,
    skills_practiced: Number,
    skills_taught: Number,
    skillcoins_earned: Number,
    skillcoins_spent: Number,
    sessions_completed: Number,
    challenges_completed: Number,
    social_interactions: Number
  },
  learning_insights: {
    most_productive_hours: [Number],
    preferred_learning_style: String,
    skill_improvement_rate: Number,
    engagement_score: Number
  },
  created_at: Date
};

// Export schemas for use in application
module.exports = {
  reelsSchema,
  aiLearningSessionsSchema,
  skillGraphSchema,
  skillMapSchema,
  gamificationSchema,
  aiRecommendationsSchema,
  multilingualContentSchema,
  voiceBotSchema,
  analyticsSchema
};

