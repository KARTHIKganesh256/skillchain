import { createClient } from '@supabase/supabase-js';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// MongoDB configuration
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillchain';

export const connectDatabase = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
    
    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection error:', error);
    } else {
      console.log('✅ Supabase connected successfully');
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};

// MongoDB schemas
export const connectMongoDB = async (): Promise<MongoClient> => {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ MongoDB client connected');
    return client;
  } catch (error) {
    console.error('❌ MongoDB client connection error:', error);
    throw error;
  }
};

// Database models
import { Schema, model } from 'mongoose';

// User schema for MongoDB
const userSchema = new Schema({
  supabaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  avatarUrl: { type: String },
  bio: { type: String },
  location: { type: String },
  timezone: { type: String },
  language: { type: String, default: 'en' },
  isVerified: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  preferences: {
    notifications: { type: Boolean, default: true },
    privacy: { type: String, default: 'public' },
    theme: { type: String, default: 'light' }
  },
  stats: {
    skillcoins: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    skillsLearned: { type: Number, default: 0 },
    skillsTaught: { type: Number, default: 0 },
    hoursLearned: { type: Number, default: 0 },
    hoursTaught: { type: Number, default: 0 }
  },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Skill schema
const skillSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String },
  difficultyLevel: { type: Number, min: 1, max: 10 },
  estimatedHours: { type: Number },
  prerequisites: [{ type: String }],
  tags: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  marketValue: { type: Number },
  demandScore: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// User Skill schema
const userSkillSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  proficiencyLevel: { type: Number, min: 1, max: 10, required: true },
  experienceHours: { type: Number, default: 0 },
  isTeaching: { type: Boolean, default: false },
  hourlyRate: { type: Number },
  availabilitySchedule: { type: Schema.Types.Mixed },
  certifications: [{ type: String }],
  portfolio: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Learning Session schema
const learningSessionSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  sessionType: { 
    type: String, 
    enum: ['live', 'recorded', 'ai_assisted'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  durationMinutes: { type: Number },
  skillcoinsCost: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  scheduledAt: { type: Date },
  startedAt: { type: Date },
  completedAt: { type: Date },
  meetingUrl: { type: String },
  recordingUrl: { type: String },
  notes: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Challenge schema
const challengeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
  difficultyLevel: { type: Number, min: 1, max: 10 },
  skillcoinsReward: { type: Number, required: true },
  xpReward: { type: Number, required: true },
  requirements: { type: Schema.Types.Mixed },
  deadline: { type: Date },
  maxParticipants: { type: Number },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  submissions: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    submissionUrl: { type: String },
    submissionText: { type: String },
    submittedAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    }
  }],
  createdAt: { type: Date, default: Date.now }
});

// SkillCoin Transaction schema
const skillcoinTransactionSchema = new Schema({
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  transactionType: { 
    type: String, 
    enum: ['earning', 'spending', 'transfer', 'reward'], 
    required: true 
  },
  skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
  sessionId: { type: Schema.Types.ObjectId, ref: 'LearningSession' },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// Review schema
const reviewSchema = new Schema({
  reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: Schema.Types.ObjectId, ref: 'LearningSession' },
  skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String },
  content: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  notHelpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Export models
export const User = model('User', userSchema);
export const Skill = model('Skill', skillSchema);
export const UserSkill = model('UserSkill', userSkillSchema);
export const LearningSession = model('LearningSession', learningSessionSchema);
export const Challenge = model('Challenge', challengeSchema);
export const SkillcoinTransaction = model('SkillcoinTransaction', skillcoinTransactionSchema);
export const Review = model('Review', reviewSchema);

// Database indexes
export const createIndexes = async (): Promise<void> => {
  try {
    // User indexes
    await User.createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true },
      { key: { supabaseId: 1 }, unique: true }
    ]);

    // Skill indexes
    await Skill.createIndexes([
      { key: { name: 1 } },
      { key: { category: 1 } },
      { key: { tags: 1 } }
    ]);

    // UserSkill indexes
    await UserSkill.createIndexes([
      { key: { userId: 1, skillId: 1 }, unique: true },
      { key: { userId: 1 } },
      { key: { skillId: 1 } }
    ]);

    // LearningSession indexes
    await LearningSession.createIndexes([
      { key: { studentId: 1 } },
      { key: { teacherId: 1 } },
      { key: { skillId: 1 } },
      { key: { status: 1 } }
    ]);

    // Challenge indexes
    await Challenge.createIndexes([
      { key: { createdBy: 1 } },
      { key: { skillId: 1 } },
      { key: { status: 1 } },
      { key: { deadline: 1 } }
    ]);

    // Transaction indexes
    await SkillcoinTransaction.createIndexes([
      { key: { fromUserId: 1 } },
      { key: { toUserId: 1 } },
      { key: { transactionType: 1 } },
      { key: { status: 1 } }
    ]);

    // Review indexes
    await Review.createIndexes([
      { key: { reviewerId: 1 } },
      { key: { revieweeId: 1 } },
      { key: { sessionId: 1 } },
      { key: { skillId: 1 } }
    ]);

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating database indexes:', error);
    throw error;
  }
};

