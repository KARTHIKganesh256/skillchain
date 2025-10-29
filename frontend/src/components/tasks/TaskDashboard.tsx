import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Target, 
  Flame, 
  Trophy, 
  Star, 
  Zap, 
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';
import TaskCard from './TaskCard.tsx';
import { 
  Task, 
  UserProgress, 
  SAMPLE_TASKS, 
  calculateRewards,
  updateUserProgress,
  generateDailyTasks,
  hasCompletedDailyGoal,
  getMotivationalMessage
} from '../../lib/taskEngine.ts';

interface TaskDashboardProps {
  userProgress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({
  userProgress,
  onProgressUpdate
}) => {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'daily' | 'all' | 'completed'>('daily');
  const [inProgressTasks, setInProgressTasks] = useState<Set<string>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Generate daily tasks on component mount
  useEffect(() => {
    const daily = generateDailyTasks(userProgress, tasks);
    setDailyTasks(daily);
  }, [userProgress, tasks]);

  // Filter tasks based on search and filters
  useEffect(() => {
    let filtered = activeTab === 'daily' ? dailyTasks : tasks;
    
    if (activeTab === 'completed') {
      filtered = tasks.filter(task => completedTasks.has(task.id));
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(task => task.difficulty === selectedDifficulty);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.skillTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredTasks(filtered);
  }, [activeTab, dailyTasks, tasks, selectedCategory, selectedDifficulty, searchQuery, completedTasks]);

  const handleStartTask = (taskId: string) => {
    setInProgressTasks(prev => new Set([...prev, taskId]));
    // Here you would typically navigate to the task detail page or open a modal
    console.log('Starting task:', taskId);
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Calculate rewards
    const timeSpent = task.estimatedTime; // In a real app, this would be actual time spent
    const rewards = calculateRewards(task, userProgress, timeSpent);
    
    // Create completion record
    const completion = {
      taskId,
      userId: userProgress.userId,
      completedAt: new Date().toISOString(),
      xpEarned: rewards.xp,
      coinsEarned: rewards.coins,
      streakBonus: rewards.streakBonus,
      timeSpent,
      verificationData: { verified: true }
    };

    // Update user progress
    const newProgress = updateUserProgress(userProgress, completion);
    onProgressUpdate(newProgress);

    // Update UI state
    setInProgressTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
    setCompletedTasks(prev => new Set([...prev, taskId]));

    // Show success message
    alert(`Task completed! Earned ${rewards.xp} XP and ${rewards.coins + rewards.streakBonus} coins!`);
  };

  const categories = ['all', ...Array.from(new Set(tasks.map(t => t.category)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];

  const dailyGoalCompleted = hasCompletedDailyGoal(userProgress);
  const motivationalMessage = getMotivationalMessage(userProgress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Task Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {motivationalMessage}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Level {userProgress.currentLevel}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {userProgress.totalXP} XP
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Coins</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userProgress.coins.toLocaleString()}
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userProgress.currentStreak} days
                    </p>
                  </div>
                  <Flame className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily Goal</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userProgress.dailyTasksCompleted}/3
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {userProgress.completedTasks.length}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Goal Progress */}
          {!dailyGoalCompleted && (
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Daily Goal Progress
                    </h3>
                    <div className="flex items-center space-x-4">
                      <Progress 
                        value={(userProgress.dailyTasksCompleted / 3) * 100} 
                        className="flex-1 h-3"
                      />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {userProgress.dailyTasksCompleted}/3 tasks
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {3 - userProgress.dailyTasksCompleted}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      more to go!
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Goal Completed Celebration */}
          {dailyGoalCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-3">
                    <Trophy className="w-8 h-8 text-green-600" />
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-green-800 dark:text-green-200">
                        Daily Goal Completed! 🎉
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        You've completed your daily tasks. Keep up the great work!
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Filters and Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {[
                  { id: 'daily', label: 'Daily Tasks', icon: Calendar },
                  { id: 'all', label: 'All Tasks', icon: BookOpen },
                  { id: 'completed', label: 'Completed', icon: Award }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  {difficulties.slice(1).map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tasks Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  No tasks found matching your criteria.
                </div>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    userProgress={userProgress}
                    onStart={handleStartTask}
                    onComplete={handleCompleteTask}
                    isCompleted={completedTasks.has(task.id)}
                    isInProgress={inProgressTasks.has(task.id)}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default TaskDashboard;
