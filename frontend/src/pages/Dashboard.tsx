import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Zap, 
  Target, 
  BookOpen,
  Trophy,
  Clock,
  ArrowUpRight,
  Plus,
  Play,
  Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    skillcoins: 2500,
    level: 12,
    xp: 8500,
    nextLevelXp: 10000
  });

  const [stats, setStats] = useState({
    skillsLearned: 8,
    skillsTaught: 3,
    hoursLearned: 45,
    hoursTaught: 12,
    connections: 25,
    challengesCompleted: 5
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'learning',
      title: 'Completed Python Basics',
      time: '2 hours ago',
      skillcoins: 150,
      icon: BookOpen
    },
    {
      id: 2,
      type: 'teaching',
      title: 'Taught JavaScript Fundamentals',
      time: '1 day ago',
      skillcoins: 300,
      icon: Users
    },
    {
      id: 3,
      type: 'challenge',
      title: 'Completed Data Science Challenge',
      time: '2 days ago',
      skillcoins: 500,
      icon: Trophy
    }
  ]);

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      type: 'skill',
      title: 'Machine Learning',
      description: 'Based on your Python skills',
      difficulty: 'Intermediate',
      estimatedHours: 40,
      marketValue: 85000
    },
    {
      id: 2,
      type: 'connection',
      title: 'Connect with Sarah Chen',
      description: 'Data Scientist with 5+ years experience',
      mutualSkills: ['Python', 'Data Analysis'],
      compatibility: 0.85
    },
    {
      id: 3,
      type: 'challenge',
      title: 'Build a Full-Stack App',
      description: 'Create a complete web application',
      reward: 1000,
      deadline: '7 days',
      participants: 45
    }
  ]);

  const [skillProgress, setSkillProgress] = useState([
    { name: 'Python', level: 8, progress: 80, nextLevel: 9 },
    { name: 'JavaScript', level: 6, progress: 60, nextLevel: 7 },
    { name: 'React', level: 5, progress: 50, nextLevel: 6 },
    { name: 'Data Science', level: 4, progress: 40, nextLevel: 5 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and discover new opportunities.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SkillCoins</p>
                <p className="text-2xl font-bold text-gray-900">{user.skillcoins.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-2xl font-bold text-gray-900">{user.level}</p>
                <p className="text-xs text-gray-500">{user.xp}/{user.nextLevelXp} XP</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Skills Learned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.skillsLearned}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.connections}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skill Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Skill Progress</h2>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {skillProgress.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                        <span className="text-sm text-gray-500">Level {skill.level}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {skill.progress}% to Level {skill.nextLevel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <activity.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">+{activity.skillcoins} SC</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
                <Brain className="w-5 h-5 text-primary-600" />
              </div>
              
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{rec.title}</h3>
                      <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                    {rec.type === 'skill' && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{rec.difficulty}</span>
                        <span className="text-green-600 font-medium">${rec.marketValue.toLocaleString()}</span>
                      </div>
                    )}
                    {rec.type === 'connection' && (
                      <div className="text-xs text-gray-500">
                        Compatibility: {Math.round(rec.compatibility * 100)}%
                      </div>
                    )}
                    {rec.type === 'challenge' && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{rec.participants} participants</span>
                        <span className="text-yellow-600 font-medium">{rec.reward} SC</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Skill
                </button>
                <button className="w-full btn-outline flex items-center justify-center">
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </button>
                <button className="w-full btn-outline flex items-center justify-center">
                  <Users className="w-4 h-4 mr-2" />
                  Find Teachers
                </button>
                <button className="w-full btn-outline flex items-center justify-center">
                  <Target className="w-4 h-4 mr-2" />
                  Take Challenge
                </button>
              </div>
            </motion.div>

            {/* Learning Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Learning Streak</h2>
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">7 days</div>
                <p className="text-sm text-gray-600 mb-4">Keep it up! 🔥</p>
                
                <div className="flex justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < 7 ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

