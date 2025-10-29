import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  Star, 
  Zap, 
  Shield, 
  Crown,
  Code,
  Globe,
  Database,
  Brain,
  ShieldCheck,
  Cloud,
  Sparkles,
  Play,
  Award,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface SkillRealm {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  position: { x: number; y: number };
  level: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    xp: number;
    coins: number;
    isCompleted: boolean;
  }>;
  rewards: {
    coins: number;
    xp: number;
    badge: string;
    title: string;
  };
  requirements: string[];
}

const SkillMap: React.FC = () => {
  const [selectedRealm, setSelectedRealm] = useState<SkillRealm | null>(null);
  const [hoveredRealm, setHoveredRealm] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState({
    level: 3,
    totalXP: 2500,
    coins: 1200,
    completedRealms: ['logic-arena', 'web-valley']
  });

  const realms: SkillRealm[] = [
    {
      id: 'logic-arena',
      name: 'Logic Arena',
      description: 'Master the fundamentals of programming logic with C and C++',
      icon: Code,
      color: 'from-red-500 to-orange-500',
      position: { x: 20, y: 20 },
      level: 1,
      isUnlocked: true,
      isCompleted: true,
      progress: 100,
      tasks: [
        { id: 't1', title: 'Hello World in C', description: 'Write your first C program', xp: 100, coins: 50, isCompleted: true },
        { id: 't2', title: 'Data Structures', description: 'Implement arrays and linked lists', xp: 150, coins: 75, isCompleted: true },
        { id: 't3', title: 'Algorithm Mastery', description: 'Solve 10 coding challenges', xp: 200, coins: 100, isCompleted: true }
      ],
      rewards: { coins: 225, xp: 450, badge: 'Logic Warrior', title: 'C++ Master' },
      requirements: []
    },
    {
      id: 'web-valley',
      name: 'Web Valley',
      description: 'Build responsive websites and master the art of web development',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      position: { x: 50, y: 15 },
      level: 2,
      isUnlocked: true,
      isCompleted: true,
      progress: 100,
      tasks: [
        { id: 't4', title: 'HTML Structure', description: 'Create semantic HTML layouts', xp: 120, coins: 60, isCompleted: true },
        { id: 't5', title: 'CSS Styling', description: 'Design beautiful responsive pages', xp: 150, coins: 75, isCompleted: true },
        { id: 't6', title: 'JavaScript Magic', description: 'Add interactivity to your sites', xp: 180, coins: 90, isCompleted: true }
      ],
      rewards: { coins: 225, xp: 450, badge: 'Web Weaver', title: 'Frontend Master' },
      requirements: ['logic-arena']
    },
    {
      id: 'data-abyss',
      name: 'Data Abyss',
      description: 'Dive deep into data science and analytics with Python and SQL',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      position: { x: 80, y: 25 },
      level: 3,
      isUnlocked: true,
      isCompleted: false,
      progress: 60,
      tasks: [
        { id: 't7', title: 'Python Basics', description: 'Master Python fundamentals', xp: 140, coins: 70, isCompleted: true },
        { id: 't8', title: 'Data Analysis', description: 'Analyze datasets with pandas', xp: 160, coins: 80, isCompleted: true },
        { id: 't9', title: 'SQL Queries', description: 'Master database operations', xp: 180, coins: 90, isCompleted: false }
      ],
      rewards: { coins: 240, xp: 480, badge: 'Data Sage', title: 'Analytics Expert' },
      requirements: ['web-valley']
    },
    {
      id: 'ai-mountain',
      name: 'AI Mountain',
      description: 'Climb the peaks of artificial intelligence and machine learning',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      position: { x: 20, y: 60 },
      level: 4,
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      tasks: [
        { id: 't10', title: 'ML Fundamentals', description: 'Learn machine learning basics', xp: 200, coins: 100, isCompleted: false },
        { id: 't11', title: 'Neural Networks', description: 'Build your first neural network', xp: 250, coins: 125, isCompleted: false },
        { id: 't12', title: 'Deep Learning', description: 'Master advanced AI techniques', xp: 300, coins: 150, isCompleted: false }
      ],
      rewards: { coins: 375, xp: 750, badge: 'AI Sage', title: 'Machine Learning Master' },
      requirements: ['data-abyss']
    },
    {
      id: 'cyber-fortress',
      name: 'Cyber Fortress',
      description: 'Defend the digital realm with ethical hacking and cybersecurity',
      icon: ShieldCheck,
      color: 'from-yellow-500 to-orange-500',
      position: { x: 50, y: 70 },
      level: 5,
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      tasks: [
        { id: 't13', title: 'Security Basics', description: 'Learn cybersecurity fundamentals', xp: 180, coins: 90, isCompleted: false },
        { id: 't14', title: 'Penetration Testing', description: 'Master ethical hacking techniques', xp: 220, coins: 110, isCompleted: false },
        { id: 't15', title: 'Defense Strategies', description: 'Build secure systems', xp: 260, coins: 130, isCompleted: false }
      ],
      rewards: { coins: 330, xp: 660, badge: 'Cyber Guardian', title: 'Security Expert' },
      requirements: ['ai-mountain']
    },
    {
      id: 'cloud-horizon',
      name: 'Cloud Horizon',
      description: 'Scale applications to the clouds with deployment and DevOps',
      icon: Cloud,
      color: 'from-cyan-500 to-blue-500',
      position: { x: 80, y: 60 },
      level: 6,
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      tasks: [
        { id: 't16', title: 'Cloud Basics', description: 'Master cloud computing concepts', xp: 200, coins: 100, isCompleted: false },
        { id: 't17', title: 'DevOps Pipeline', description: 'Build CI/CD pipelines', xp: 250, coins: 125, isCompleted: false },
        { id: 't18', title: 'Microservices', description: 'Design scalable architectures', xp: 300, coins: 150, isCompleted: false }
      ],
      rewards: { coins: 375, xp: 750, badge: 'Cloud Master', title: 'DevOps Expert' },
      requirements: ['cyber-fortress']
    },
    {
      id: 'innovation-temple',
      name: 'Innovation Temple',
      description: 'Fuse all knowledge to create groundbreaking projects',
      icon: Sparkles,
      color: 'from-pink-500 to-purple-500',
      position: { x: 50, y: 90 },
      level: 7,
      isUnlocked: false,
      isCompleted: false,
      progress: 0,
      tasks: [
        { id: 't19', title: 'Capstone Project', description: 'Build a revolutionary application', xp: 500, coins: 250, isCompleted: false },
        { id: 't20', title: 'Mentor Others', description: 'Guide new learners', xp: 300, coins: 150, isCompleted: false },
        { id: 't21', title: 'Innovation Challenge', description: 'Solve real-world problems', xp: 400, coins: 200, isCompleted: false }
      ],
      rewards: { coins: 600, xp: 1200, badge: 'Skill Guardian', title: 'Innovation Master' },
      requirements: ['cloud-horizon']
    }
  ];

  const handleRealmClick = (realm: SkillRealm) => {
    if (realm.isUnlocked) {
      setSelectedRealm(realm);
    }
  };

  const handleTaskComplete = (realmId: string, taskId: string) => {
    setUserProgress(prev => ({
      ...prev,
      coins: prev.coins + 50,
      totalXP: prev.totalXP + 100
    }));
    
    // Mark task as completed
    const updatedRealms = realms.map(realm => {
      if (realm.id === realmId) {
        const updatedTasks = realm.tasks.map(task => 
          task.id === taskId ? { ...task, isCompleted: true } : task
        );
        const progress = (updatedTasks.filter(t => t.isCompleted).length / updatedTasks.length) * 100;
        return { ...realm, tasks: updatedTasks, progress };
      }
      return realm;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-cyan-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Skill Realms
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Journey through seven realms of knowledge. Each realm unlocked forges a new link in your SkillChain.
          </p>
        </motion.div>

        {/* Interactive Map */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative w-full h-[600px] bg-black/20 backdrop-blur-sm rounded-3xl border border-cyan-500/30 overflow-hidden">
            {/* Energy Connections */}
            <svg className="absolute inset-0 w-full h-full">
              {realms.map((realm, index) => {
                if (index === 0) return null;
                const prevRealm = realms[index - 1];
                return (
                  <motion.line
                    key={`connection-${index}`}
                    x1={`${prevRealm.position.x}%`}
                    y1={`${prevRealm.position.y}%`}
                    x2={`${realm.position.x}%`}
                    y2={`${realm.position.y}%`}
                    stroke="url(#energyGradient)"
                    strokeWidth="2"
                    opacity={realm.isUnlocked ? 0.8 : 0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: index * 0.2 }}
                  />
                );
              })}
              <defs>
                <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ffff" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Realm Gates */}
            {realms.map((realm, index) => (
              <motion.div
                key={realm.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${realm.position.x}%`,
                  top: `${realm.position.y}%`
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 20,
                  delay: index * 0.3 
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${realm.color} flex items-center justify-center cursor-pointer shadow-2xl ${
                    realm.isUnlocked ? 'ring-4 ring-cyan-400/50' : 'ring-4 ring-gray-600/50'
                  }`}
                  onClick={() => handleRealmClick(realm)}
                  onMouseEnter={() => setHoveredRealm(realm.id)}
                  onMouseLeave={() => setHoveredRealm(null)}
                  animate={{
                    boxShadow: realm.isUnlocked ? [
                      "0 0 20px rgba(0, 255, 255, 0.5)",
                      "0 0 40px rgba(0, 255, 255, 0.8)",
                      "0 0 20px rgba(0, 255, 255, 0.5)"
                    ] : [],
                    rotate: realm.isCompleted ? 360 : 0
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity },
                    rotate: { duration: 1 }
                  }}
                >
                  {realm.isUnlocked ? (
                    <Unlock className="w-8 h-8 text-white" />
                  ) : (
                    <Lock className="w-8 h-8 text-gray-400" />
                  )}
                </motion.div>

                {/* Realm Info */}
                <motion.div
                  className="absolute top-24 left-1/2 transform -translate-x-1/2 w-48 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ 
                    opacity: hoveredRealm === realm.id ? 1 : 0,
                    y: hoveredRealm === realm.id ? 0 : -10
                  }}
                >
                  <Card className="bg-black/80 backdrop-blur-md border-cyan-500/30">
                    <CardContent className="p-3">
                      <h3 className="font-bold text-white text-sm mb-1">
                        {realm.name}
                      </h3>
                      <p className="text-xs text-gray-300 mb-2">
                        Level {realm.level}
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
                        <div 
                          className={`h-1 rounded-full bg-gradient-to-r ${realm.color}`}
                          style={{ width: `${realm.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-cyan-400">
                        {realm.progress}% Complete
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Completion Badge */}
                {realm.isCompleted && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Crown className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* User Progress */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <Card className="bg-black/50 backdrop-blur-md border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Your Progress</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{userProgress.level}</div>
                    <div className="text-sm text-gray-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{userProgress.coins}</div>
                    <div className="text-sm text-gray-400">Coins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{userProgress.totalXP}</div>
                    <div className="text-sm text-gray-400">XP</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div 
                  className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(userProgress.totalXP / 10000) * 100}%` }}
                  transition={{ duration: 2, delay: 1.5 }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {userProgress.totalXP} / 10,000 XP to next level
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Realm Detail Modal */}
      <AnimatePresence>
        {selectedRealm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRealm(null)}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl border border-cyan-500/30 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedRealm.color} flex items-center justify-center`}>
                    <selectedRealm.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">
                      {selectedRealm.name}
                    </CardTitle>
                    <p className="text-gray-300">
                      {selectedRealm.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Progress</span>
                    <span className="text-cyan-400">{selectedRealm.progress}%</span>
                  </div>
                  <Progress value={selectedRealm.progress} className="h-3" />
                </div>

                {/* Tasks */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Realm Tasks</h4>
                  <div className="space-y-3">
                    {selectedRealm.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            task.isCompleted ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {task.isCompleted ? (
                              <Award className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <h5 className="text-white font-medium">{task.title}</h5>
                            <p className="text-gray-400 text-sm">{task.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-purple-400">+{task.xp} XP</span>
                            <span className="text-yellow-400">+{task.coins} Coins</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewards */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Realm Rewards</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-medium">Coins</span>
                      </div>
                      <span className="text-2xl font-bold text-yellow-400">
                        {selectedRealm.rewards.coins}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-medium">XP</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-400">
                        {selectedRealm.rewards.xp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600"
                    onClick={() => {
                      // Navigate to realm tasks
                      window.location.href = '/tasks';
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Realm
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedRealm(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillMap;

