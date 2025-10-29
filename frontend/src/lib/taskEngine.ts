/**
 * Task Engine - Core gamification system for SkillChain
 * Handles task creation, completion, XP/coin rewards, and progress tracking
 */

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skillTags: string[];
  xpReward: number;
  coinReward: number;
  estimatedTime: number; // in minutes
  requirements: string[];
  instructions: string[];
  verificationType: 'auto' | 'peer' | 'ai' | 'manual';
  isActive: boolean;
  isDaily: boolean;
  streakBonus: number;
  createdAt: string;
  expiresAt?: string;
  completedBy?: string[];
  completionRate: number;
}

export interface UserProgress {
  userId: string;
  currentLevel: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  completedTasks: string[];
  skillLevels: Record<string, number>;
  badges: string[];
  coins: number;
  dailyTasksCompleted: number;
  weeklyGoal: number;
  monthlyGoal: number;
}

export interface TaskCompletion {
  taskId: string;
  userId: string;
  completedAt: string;
  xpEarned: number;
  coinsEarned: number;
  streakBonus: number;
  timeSpent: number;
  verificationData?: any;
  rating?: number;
}

// Difficulty multipliers for rewards
const DIFFICULTY_MULTIPLIERS = {
  beginner: 1.0,
  intermediate: 1.5,
  advanced: 2.0,
  expert: 3.0
};

// Base rewards
const BASE_XP = 100;
const BASE_COINS = 50;

/**
 * Calculate XP and coin rewards based on task difficulty and user streak
 */
export function calculateRewards(
  task: Task, 
  userProgress: UserProgress, 
  timeSpent: number
): { xp: number; coins: number; streakBonus: number } {
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[task.difficulty];
  const streakMultiplier = Math.min(1 + (userProgress.currentStreak * 0.1), 2.0); // Max 2x multiplier
  const timeBonus = Math.min(timeSpent / task.estimatedTime, 1.5); // Bonus for spending more time
  
  const baseXP = BASE_XP * difficultyMultiplier;
  const baseCoins = BASE_COINS * difficultyMultiplier;
  
  const xp = Math.round(baseXP * streakMultiplier * timeBonus);
  const coins = Math.round(baseCoins * streakMultiplier * timeBonus);
  const streakBonus = Math.round((xp + coins) * 0.1 * userProgress.currentStreak);
  
  return { xp, coins, streakBonus };
}

/**
 * Update user progress after task completion
 */
export function updateUserProgress(
  userProgress: UserProgress,
  taskCompletion: TaskCompletion
): UserProgress {
  const newXP = userProgress.totalXP + taskCompletion.xpEarned;
  const newCoins = userProgress.coins + taskCompletion.coinsEarned + taskCompletion.streakBonus;
  const newLevel = calculateLevel(newXP);
  
  // Update streak
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = userProgress.lastActivityDate.split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  let newStreak = userProgress.currentStreak;
  if (lastActivity === yesterday) {
    newStreak += 1;
  } else if (lastActivity !== today) {
    newStreak = 1;
  }
  
  const newLongestStreak = Math.max(newStreak, userProgress.longestStreak);
  
  // Update skill levels
  const newSkillLevels = { ...userProgress.skillLevels };
  taskCompletion.taskId && (() => {
    // This would need task data to update specific skills
    // For now, we'll add a general skill point
  })();
  
  return {
    ...userProgress,
    currentLevel: newLevel,
    totalXP: newXP,
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    lastActivityDate: today,
    completedTasks: [...userProgress.completedTasks, taskCompletion.taskId],
    coins: newCoins,
    dailyTasksCompleted: userProgress.dailyTasksCompleted + 1
  };
}

/**
 * Calculate user level based on total XP
 */
export function calculateLevel(totalXP: number): number {
  // Level formula: Level = floor(sqrt(XP / 1000)) + 1
  return Math.floor(Math.sqrt(totalXP / 1000)) + 1;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 1000;
}

/**
 * Generate daily tasks for a user
 */
export function generateDailyTasks(
  userProgress: UserProgress,
  availableTasks: Task[]
): Task[] {
  const userSkills = Object.keys(userProgress.skillLevels);
  const userLevel = userProgress.currentLevel;
  
  // Filter tasks based on user level and skills
  const suitableTasks = availableTasks.filter(task => {
    const taskLevel = getTaskLevel(task.difficulty);
    return taskLevel <= userLevel + 1 && // Allow one level above current
           task.skillTags.some(skill => userSkills.includes(skill)) &&
           task.isActive &&
           task.isDaily;
  });
  
  // Select 3-5 daily tasks
  const dailyCount = Math.min(5, Math.max(3, Math.floor(userLevel / 3) + 2));
  return shuffleArray(suitableTasks).slice(0, dailyCount);
}

/**
 * Get task level from difficulty
 */
function getTaskLevel(difficulty: string): number {
  const levels = { beginner: 1, intermediate: 3, advanced: 6, expert: 10 };
  return levels[difficulty as keyof typeof levels] || 1;
}

/**
 * Shuffle array utility
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Check if user has completed daily goal
 */
export function hasCompletedDailyGoal(userProgress: UserProgress): boolean {
  return userProgress.dailyTasksCompleted >= 3; // Minimum 3 tasks per day
}

/**
 * Get streak bonus multiplier
 */
export function getStreakBonusMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.2;
  return 1.0;
}

/**
 * Generate motivational messages based on progress
 */
export function getMotivationalMessage(userProgress: UserProgress): string {
  const messages = [
    "Keep up the great work! 🔥",
    "You're on fire! Don't stop now! 💪",
    "Every task completed is a step closer to mastery! 🎯",
    "Your dedication is inspiring! ⭐",
    "Consistency is key - you've got this! 🚀"
  ];
  
  if (userProgress.currentStreak >= 7) {
    return "Amazing streak! You're building incredible momentum! 🏆";
  }
  
  if (userProgress.currentLevel > 10) {
    return "You're becoming a true skill master! 🌟";
  }
  
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Sample task data for development
 */
export const SAMPLE_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Build a Todo App',
    description: 'Create a simple todo application using React and TypeScript',
    category: 'Frontend Development',
    difficulty: 'beginner',
    skillTags: ['React', 'TypeScript', 'JavaScript'],
    xpReward: 100,
    coinReward: 50,
    estimatedTime: 120,
    requirements: ['Basic React knowledge', 'TypeScript basics'],
    instructions: [
      'Set up a new React project with TypeScript',
      'Create a TodoItem component',
      'Implement add, edit, and delete functionality',
      'Add local storage persistence',
      'Style with CSS or Tailwind'
    ],
    verificationType: 'auto',
    isActive: true,
    isDaily: true,
    streakBonus: 0,
    createdAt: new Date().toISOString(),
    completedBy: [],
    completionRate: 0.75
  },
  {
    id: 'task-2',
    title: 'Implement Authentication',
    description: 'Add user authentication to a web application',
    category: 'Backend Development',
    difficulty: 'intermediate',
    skillTags: ['Node.js', 'JWT', 'Authentication'],
    xpReward: 200,
    coinReward: 100,
    estimatedTime: 180,
    requirements: ['Node.js experience', 'Database knowledge'],
    instructions: [
      'Set up JWT token generation',
      'Create login and register endpoints',
      'Implement password hashing',
      'Add middleware for protected routes',
      'Test authentication flow'
    ],
    verificationType: 'peer',
    isActive: true,
    isDaily: true,
    streakBonus: 0,
    createdAt: new Date().toISOString(),
    completedBy: [],
    completionRate: 0.60
  },
  {
    id: 'task-3',
    title: 'Machine Learning Model',
    description: 'Build and train a machine learning model for image classification',
    category: 'Data Science',
    difficulty: 'expert',
    skillTags: ['Python', 'TensorFlow', 'Machine Learning'],
    xpReward: 500,
    coinReward: 250,
    estimatedTime: 480,
    requirements: ['Advanced Python', 'ML frameworks knowledge'],
    instructions: [
      'Collect and preprocess image dataset',
      'Design neural network architecture',
      'Train the model with proper validation',
      'Implement data augmentation',
      'Evaluate and optimize performance'
    ],
    verificationType: 'ai',
    isActive: true,
    isDaily: false,
    streakBonus: 0,
    createdAt: new Date().toISOString(),
    completedBy: [],
    completionRate: 0.30
  }
];

