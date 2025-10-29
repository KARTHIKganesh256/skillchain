import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  Users, 
  Star, 
  TrendingUp,
  Code,
  Award,
  Calendar,
  Play,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  BarChart3,
  Crown,
  Flame,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface Contest {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: 'long' | 'short' | 'lunchtime' | 'cookoff' | 'starters';
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  maxParticipants?: number;
  isLive: boolean;
  isUpcoming: boolean;
  isFinished: boolean;
  prizes: string[];
  problems: number;
  color: string;
}

interface Problem {
  id: string;
  name: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  solvedBy: number;
  accuracy: number;
  points: number;
  isSolved: boolean;
  isAttempted: boolean;
}

interface User {
  id: string;
  username: string;
  name: string;
  rating: number;
  rank: number;
  country: string;
  avatar: string;
  solvedProblems: number;
  contestsParticipated: number;
  currentStreak: number;
  maxRating: number;
  division: 'div1' | 'div2' | 'div3' | 'div4';
}

const SkillChainHomepage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [recentProblems, setRecentProblems] = useState<Problem[]>([]);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'contests' | 'problems' | 'rankings'>('contests');
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');

  // Sample data
  useEffect(() => {
    const sampleContests: Contest[] = [
      {
        id: 'contest-1',
        name: 'SkillChain Starters 120',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        duration: 180,
        type: 'starters',
        difficulty: 'easy',
        participants: 15420,
        maxParticipants: 20000,
        isLive: true,
        isUpcoming: false,
        isFinished: false,
        prizes: ['T-Shirts for top 100', 'Laddus for all participants'],
        problems: 8,
        color: 'from-green-500 to-emerald-600'
      },
      {
        id: 'contest-2',
        name: 'SkillChain Lunchtime 2024',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        duration: 180,
        type: 'lunchtime',
        difficulty: 'medium',
        participants: 0,
        maxParticipants: 50000,
        isLive: false,
        isUpcoming: true,
        isFinished: false,
        prizes: ['Cash prizes', 'T-Shirts', 'Certificates'],
        problems: 6,
        color: 'from-blue-500 to-cyan-600'
      },
      {
        id: 'contest-3',
        name: 'SkillChain Cook-Off 2024',
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(),
        duration: 150,
        type: 'cookoff',
        difficulty: 'hard',
        participants: 12500,
        isLive: false,
        isUpcoming: false,
        isFinished: true,
        prizes: ['Cash prizes', 'T-Shirts'],
        problems: 5,
        color: 'from-purple-500 to-pink-600'
      }
    ];

    const sampleProblems: Problem[] = [
      {
        id: 'prob-1',
        name: 'Sum of Two Numbers',
        code: 'SUM2',
        difficulty: 'easy',
        tags: ['math', 'implementation'],
        solvedBy: 15420,
        accuracy: 85.5,
        points: 100,
        isSolved: true,
        isAttempted: false
      },
      {
        id: 'prob-2',
        name: 'Binary Search Tree',
        code: 'BST',
        difficulty: 'medium',
        tags: ['data-structures', 'trees'],
        solvedBy: 8540,
        accuracy: 62.3,
        points: 200,
        isSolved: false,
        isAttempted: true
      },
      {
        id: 'prob-3',
        name: 'Dynamic Programming Challenge',
        code: 'DPCHALL',
        difficulty: 'hard',
        tags: ['dp', 'optimization'],
        solvedBy: 2340,
        accuracy: 35.7,
        points: 500,
        isSolved: false,
        isAttempted: false
      }
    ];

    const sampleUsers: User[] = [
      {
        id: 'user-1',
        username: 'tourist',
        name: 'Gennady Korotkevich',
        rating: 3850,
        rank: 1,
        country: 'Belarus',
        avatar: '👑',
        solvedProblems: 2450,
        contestsParticipated: 156,
        currentStreak: 45,
        maxRating: 3850,
        division: 'div1'
      },
      {
        id: 'user-2',
        username: 'petr',
        name: 'Petr Mitrichev',
        rating: 3720,
        rank: 2,
        country: 'Russia',
        avatar: '🥇',
        solvedProblems: 2380,
        contestsParticipated: 142,
        currentStreak: 32,
        maxRating: 3720,
        division: 'div1'
      },
      {
        id: 'user-3',
        username: 'ecnerwala',
        name: 'Benjamin Qi',
        rating: 3650,
        rank: 3,
        country: 'USA',
        avatar: '🥈',
        solvedProblems: 2290,
        contestsParticipated: 138,
        currentStreak: 28,
        maxRating: 3650,
        division: 'div1'
      }
    ];

    setContests(sampleContests);
    setRecentProblems(sampleProblems);
    setTopUsers(sampleUsers);
  }, []);

  const filteredContests = contests.filter(contest => {
    switch (filter) {
      case 'live':
        return contest.isLive;
      case 'upcoming':
        return contest.isUpcoming;
      case 'finished':
        return contest.isFinished;
      default:
        return true;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getDivisionColor = (division: string) => {
    const colors = {
      div1: 'text-red-500',
      div2: 'text-orange-500',
      div3: 'text-yellow-500',
      div4: 'text-green-500'
    };
    return colors[division as keyof typeof colors] || colors.div4;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 3000) return 'text-red-500';
    if (rating >= 2400) return 'text-orange-500';
    if (rating >= 1800) return 'text-yellow-500';
    if (rating >= 1200) return 'text-green-500';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Practice. Compete. 
            <span className="text-orange-600">Excel.</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join millions of programmers in solving algorithmic challenges, 
            participating in contests, and climbing the leaderboards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Play className="w-5 h-5 mr-2" />
              Start Practicing
            </Button>
            <Button size="lg" variant="outline">
              <Trophy className="w-5 h-5 mr-2" />
              View Contests
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">2M+</div>
              <div className="text-gray-600 dark:text-gray-300">Programmers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Problems</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Contests</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Countries</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-8">
          {[
            { id: 'contests', label: 'Contests', icon: Trophy },
            { id: 'problems', label: 'Recent Problems', icon: Code },
            { id: 'rankings', label: 'Top Users', icon: Crown }
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

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'contests' && (
            <motion.div
              key="contests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Contest Filters */}
              <div className="flex space-x-2 mb-6">
                {[
                  { id: 'all', label: 'All Contests' },
                  { id: 'live', label: 'Live' },
                  { id: 'upcoming', label: 'Upcoming' },
                  { id: 'finished', label: 'Finished' }
                ].map((filterOption) => (
                  <Button
                    key={filterOption.id}
                    variant={filter === filterOption.id ? "default" : "outline"}
                    onClick={() => setFilter(filterOption.id as any)}
                    size="sm"
                  >
                    {filterOption.label}
                  </Button>
                ))}
              </div>

              {/* Contests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContests.map((contest, index) => (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                              {contest.name}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getDifficultyColor(contest.difficulty)}>
                                {contest.difficulty}
                              </Badge>
                              <Badge variant="outline">
                                {contest.type}
                              </Badge>
                              {contest.isLive && (
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse">
                                  🔴 LIVE
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Duration</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {contest.duration} minutes
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Problems</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {contest.problems}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Participants</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {contest.participants.toLocaleString()}
                              {contest.maxParticipants && ` / ${contest.maxParticipants.toLocaleString()}`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Start Time</span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {new Date(contest.startTime).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Prizes */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Prizes
                          </h4>
                          <div className="space-y-1">
                            {contest.prizes.map((prize, index) => (
                              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                                {prize}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          className={`w-full ${
                            contest.isLive 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : contest.isUpcoming
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-600 hover:bg-gray-700'
                          }`}
                          disabled={contest.isFinished}
                        >
                          {contest.isLive ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Join Contest
                            </>
                          ) : contest.isUpcoming ? (
                            <>
                              <Clock className="w-4 h-4 mr-2" />
                              Register
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              View Results
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'problems' && (
            <motion.div
              key="problems"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-4">
                {recentProblems.map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {problem.name}
                              </h3>
                              <Badge variant="outline" className="font-mono">
                                {problem.code}
                              </Badge>
                              <Badge className={getDifficultyColor(problem.difficulty)}>
                                {problem.difficulty}
                              </Badge>
                              {problem.isSolved && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                              {problem.isAttempted && !problem.isSolved && (
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>{problem.solvedBy.toLocaleString()} solved</span>
                              <span>{problem.accuracy}% accuracy</span>
                              <span>{problem.points} points</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              {problem.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                              Solve
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'rankings' && (
            <motion.div
              key="rankings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl font-bold text-gray-400 w-8">
                              #{user.rank}
                            </div>
                            <div className="text-3xl">
                              {user.avatar}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                @{user.username} • {user.country}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${getRatingColor(user.rating)}`}>
                                {user.rating}
                              </div>
                              <div className="text-xs text-gray-500">Rating</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.solvedProblems}
                              </div>
                              <div className="text-xs text-gray-500">Solved</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.contestsParticipated}
                              </div>
                              <div className="text-xs text-gray-500">Contests</div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg font-semibold ${getDivisionColor(user.division)}`}>
                                {user.division.toUpperCase()}
                              </div>
                              <div className="text-xs text-gray-500">Division</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillChainHomepage;
