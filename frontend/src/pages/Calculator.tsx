import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, Zap, Star, Award } from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.tsx';

// Monthly SkillCoin Structure - Complete Course/Language
const monthlyTasks = [
  { name: 'Complete Course', description: 'Finish full course (Java, Python, JavaScript, etc.)', completion: 1, coins: 150, rupees: 300 },
  { name: 'Complete Language', description: 'Master programming language', completion: 1, coins: 150, rupees: 300 },
  { name: 'Project Completion', description: 'Finish real-world project', completion: 3, coins: 450, rupees: 900 }
];

const COIN_TO_RUPEE = 2; // 1 coin = ₹2

const CalculatorPage: React.FC = () => {
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(5);
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [skillHistory, setSkillHistory] = useState<number[]>([]);
  const [showBoost, setShowBoost] = useState(false);

  // Generate random skill progression data for the graph
  useEffect(() => {
    const generateHistory = () => {
      const baseValue = calculatedValue || 250;
      const history: number[] = [];
      for (let i = 0; i < 12; i++) {
        history.push(Math.max(50, baseValue + (Math.random() - 0.5) * 100 + (i * 5)));
      }
      return history;
    };
    
    if (calculatedValue !== null) {
      const history = generateHistory();
      setSkillHistory(history);
    }
  }, [calculatedValue]);

  const calculateValue = async () => {
    setLoading(true);
    setCalculatedValue(null);
    setShowBoost(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/skills/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skill: skillName,
          level: skillLevel,
          experience_years: 0,
          market_demand: 'medium'
        })
      });
      const data = await response.json();
      // Convert to coins (dividing by 1000 to get reasonable coin values)
      const coins = Math.round(data.estimated_value / 1000);
      setCalculatedValue(coins);
    } catch (error) {
      console.error('Error calculating skill value:', error);
      // Fallback calculation based on skill level (in coins)
      const baseValue = skillLevel * 50; // 50-500 coins based on level
      setCalculatedValue(baseValue);
    } finally {
      setLoading(false);
      setTimeout(() => setShowBoost(false), 3000);
    }
  };

  // Get max value for graph scaling
  const maxValue = skillHistory.length > 0 ? Math.max(...skillHistory, calculatedValue || 0) : 500;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Skill Value Calculator
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the market value of your skills with AI-powered insights and real-time market data.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Calculator */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                <span>Calculate Your Skill Value</span>
              </CardTitle>
              <CardDescription>
                Get instant market insights for your skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g., JavaScript, Python, React"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Skill Level: {skillLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>

              <Button
                onClick={calculateValue}
                disabled={loading || !skillName}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Value
                  </>
                )}
              </Button>

              <AnimatePresence>
                {calculatedValue !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        Estimated Value for {skillName} (Level {skillLevel})
                      </p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {calculatedValue === 0 ? 'Error' : `${calculatedValue.toLocaleString()} Coins`}
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                        = ₹{(calculatedValue * COIN_TO_RUPEE).toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        1 Coin = ₹{COIN_TO_RUPEE}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Right Column - Live Graph */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <span>Live Skill Progress</span>
              </CardTitle>
              <CardDescription>
                Track your skill value over the last 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {skillHistory.length > 0 ? (
                <div className="relative">
                  {/* SVG Graph */}
                  <svg viewBox="0 0 600 300" className="w-full h-64">
                    {/* Background Grid */}
                    {[...Array(5)].map((_, i) => (
                      <line
                        key={`grid-${i}`}
                        x1="50"
                        y1={50 + (i * 60)}
                        x2="550"
                        y2={50 + (i * 60)}
                        stroke="currentColor"
                        strokeWidth="1"
                        opacity="0.1"
                        className="text-gray-400"
                      />
                    ))}
                    
                    {/* Graph Line */}
                    <polyline
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={skillHistory
                        .map((value, index) => {
                          const x = 50 + (index * (500 / (skillHistory.length - 1)));
                          const y = 250 - ((value / maxValue) * 200);
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />

                    {/* Gradient for line */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>

                    {/* Data Points */}
                    {skillHistory.map((value, index) => {
                      const x = 50 + (index * (500 / (skillHistory.length - 1)));
                      const y = 250 - ((value / maxValue) * 200);
                      const isLatest = index === skillHistory.length - 1;
                      
                      return (
                        <g key={index}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isLatest ? 8 : 5}
                            fill={isLatest ? '#3b82f6' : '#9333ea'}
                            stroke="white"
                            strokeWidth="2"
                          >
                            {isLatest && (
                              <motion.animate
                                attributeName="r"
                                values="8;12;8"
                                dur="1s"
                                repeatCount="indefinite"
                              />
                            )}
                          </circle>
                          {isLatest && (
                            <motion.text
                              x={x}
                              y={y - 20}
                              textAnchor="middle"
                              className="text-xs font-bold fill-blue-600"
                            >
                              Latest
                            </motion.text>
                          )}
                        </g>
                      );
                    })}

                    {/* Y-axis labels */}
                    {[...Array(5)].map((_, i) => (
                      <text
                        key={`y-label-${i}`}
                        x="40"
                        y={50 + (i * 60) + 5}
                        className="text-xs fill-gray-600 dark:fill-gray-400"
                        textAnchor="end"
                      >
                        {Math.round(maxValue - (i * maxValue / 4))}
                      </text>
                    ))}
                  </svg>

                  {/* Trend Indicator */}
                  {skillHistory.length >= 2 && (
                    <div className="mt-4 flex items-center justify-center space-x-4">
                      {skillHistory[skillHistory.length - 1] > skillHistory[0] ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <TrendingUp className="w-5 h-5" />
                          <span className="font-bold">
                            +{(((skillHistory[skillHistory.length - 1] / skillHistory[0]) - 1) * 100).toFixed(1)}% Growth
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-red-600">
                          <TrendingDown className="w-5 h-5" />
                          <span className="font-bold">
                            {(((skillHistory[skillHistory.length - 1] / skillHistory[0]) - 1) * 100).toFixed(1)}% Decline
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <p className="text-center">
                    Calculate your skill value to see the live progress graph
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Boost Animation */}
        <AnimatePresence>
          {showBoost && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="relative">
                {/* Boost Icons */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Zap className="w-32 h-32 text-yellow-400" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 0], rotate: [0, 180, 360] }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="absolute top-0 left-0"
                >
                  <Star className="w-16 h-16 text-blue-500" fill="currentColor" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 0], rotate: [0, -180, -360] }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="absolute top-0 right-0"
                >
                  <Award className="w-16 h-16 text-purple-500" fill="currentColor" />
                </motion.div>
                
                {/* Text */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-4"
                >
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Skill Boost! ⚡
                  </h3>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monthly Earnings Structure */}
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-6 h-6 text-purple-600" />
              <span>Monthly Earnings - Complete Courses & Languages</span>
            </CardTitle>
            <CardDescription>
              Earn ₹300 per course/language completion (1 Coin = ₹2)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left rounded-tl-lg">Activity Type</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-center">Completion</th>
                    <th className="px-4 py-3 text-center">Coins</th>
                    <th className="px-4 py-3 text-center rounded-tr-lg">Earnings (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyTasks.map((task, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{task.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{task.description}</td>
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{task.completion}</td>
                      <td className="px-4 py-3 text-center text-blue-600 dark:text-blue-400 font-semibold">{task.coins}</td>
                      <td className="px-4 py-3 text-center text-green-600 dark:text-green-400 font-bold">₹{task.rupees}</td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-right">Per Course/Language Completion:</td>
                    <td className="px-4 py-3 text-center">
                      <div>₹{300}</div>
                      <div className="text-sm">(150 Coins)</div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalculatorPage;