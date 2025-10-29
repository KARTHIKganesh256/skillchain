import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Trophy, 
  Target, 
  BarChart3, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Code,
  BookOpen,
  Zap,
  Activity,
  Globe,
  Flag,
  Mail,
  MapPin,
  Link,
  Edit,
  Settings,
  Share2,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Crown,
  Medal,
  Flame,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  lastActive: string;
  isOnline: boolean;
  avatar: string;
  coverImage: string;
  rating: number;
  maxRating: number;
  rank: number;
  previousRank: number;
  division: 'div1' | 'div2' | 'div3' | 'div4';
  country: string;
  countryCode: string;
  solvedProblems: number;
  totalProblems: number;
  contestsParticipated: number;
  contestsWon: number;
  currentStreak: number;
  maxStreak: number;
  achievements: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }[];
  problemStats: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
  contestHistory: {
    contest: string;
    rank: number;
    ratingChange: number;
    date: string;
    problemsSolved: number;
    totalProblems: number;
  }[];
  recentSubmissions: {
    id: string;
    problem: string;
    status: string;
    language: string;
    submittedAt: string;
  }[];
  socialStats: {
    followers: number;
    following: number;
    posts: number;
  };
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
    publicProfile: boolean;
  };
}

interface UserProfileProps {
  userId?: string;
  username?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, username }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'contests' | 'submissions' | 'achievements'>('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const navigate = useNavigate();

  // Sample user profile data
  useEffect(() => {
    const sampleProfile: UserProfile = {
      id: 'user-1',
      username: 'tourist',
      name: 'Gennady Korotkevich',
      email: 'tourist@example.com',
      bio: 'Competitive programming enthusiast and multiple-time world champion. Passionate about algorithms and data structures.',
      location: 'Minsk, Belarus',
      website: 'https://tourist.com',
      joinDate: '2015-03-15',
      lastActive: new Date().toISOString(),
      isOnline: true,
      avatar: '👑',
      coverImage: '',
      rating: 3850,
      maxRating: 3850,
      rank: 1,
      previousRank: 1,
      division: 'div1',
      country: 'Belarus',
      countryCode: 'BY',
      solvedProblems: 2450,
      totalProblems: 10000,
      contestsParticipated: 156,
      contestsWon: 45,
      currentStreak: 45,
      maxStreak: 67,
      achievements: [
        {
          id: 'ach-1',
          name: 'Grandmaster',
          description: 'Achieved Grandmaster rating',
          icon: '👑',
          earnedAt: '2020-01-15',
          rarity: 'legendary'
        },
        {
          id: 'ach-2',
          name: 'IOI Gold Medalist',
          description: 'Won gold medal at International Olympiad in Informatics',
          icon: '🥇',
          earnedAt: '2019-08-15',
          rarity: 'legendary'
        },
        {
          id: 'ach-3',
          name: 'ACM World Champion',
          description: 'Won ACM ICPC World Finals',
          icon: '🏆',
          earnedAt: '2018-05-20',
          rarity: 'legendary'
        },
        {
          id: 'ach-4',
          name: 'Problem Solver',
          description: 'Solved 1000+ problems',
          icon: '🎯',
          earnedAt: '2021-03-10',
          rarity: 'epic'
        },
        {
          id: 'ach-5',
          name: 'Contest Master',
          description: 'Won 50+ contests',
          icon: '🏅',
          earnedAt: '2022-06-15',
          rarity: 'epic'
        }
      ],
      problemStats: {
        easy: 500,
        medium: 1200,
        hard: 750,
        total: 2450
      },
      contestHistory: [
        {
          contest: 'SkillChain Cook-Off 120',
          rank: 1,
          ratingChange: 25,
          date: '2024-01-15',
          problemsSolved: 5,
          totalProblems: 5
        },
        {
          contest: 'SkillChain Lunchtime 119',
          rank: 2,
          ratingChange: 15,
          date: '2024-01-10',
          problemsSolved: 4,
          totalProblems: 6
        },
        {
          contest: 'SkillChain Starters 118',
          rank: 1,
          ratingChange: 30,
          date: '2024-01-05',
          problemsSolved: 8,
          totalProblems: 8
        }
      ],
      recentSubmissions: [
        {
          id: 'sub-1',
          problem: 'SUM2',
          status: 'accepted',
          language: 'cpp',
          submittedAt: new Date().toISOString()
        },
        {
          id: 'sub-2',
          problem: 'BSTOPS',
          status: 'accepted',
          language: 'java',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'sub-3',
          problem: 'DPCHALL',
          status: 'wrong_answer',
          language: 'python',
          submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ],
      socialStats: {
        followers: 12500,
        following: 150,
        posts: 89
      },
      preferences: {
        theme: 'dark',
        language: 'cpp',
        notifications: true,
        publicProfile: true
      }
    };

    setProfile(sampleProfile);
    setIsOwnProfile(true); // For demo purposes
  }, [userId, username]);

  const getRatingColor = (rating: number) => {
    if (rating >= 3000) return 'text-red-500';
    if (rating >= 2400) return 'text-orange-500';
    if (rating >= 1800) return 'text-yellow-500';
    if (rating >= 1200) return 'text-green-500';
    return 'text-gray-500';
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

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      rare: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      epic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      legendary: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      accepted: 'text-green-500',
      wrong_answer: 'text-red-500',
      time_limit_exceeded: 'text-yellow-500',
      runtime_error: 'text-red-500',
      compilation_error: 'text-red-500'
    };
    return colors[status as keyof typeof colors] || 'text-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'wrong_answer':
      case 'runtime_error':
      case 'compilation_error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'time_limit_exceeded':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCountryFlag = (countryCode: string): string => {
    const flags: { [key: string]: string } = {
      'BY': '🇧🇾',
      'RU': '🇷🇺',
      'US': '🇺🇸',
      'UA': '🇺🇦',
      'IN': '🇮🇳',
      'CN': '🇨🇳',
      'JP': '🇯🇵',
      'KR': '🇰🇷',
      'BR': '🇧🇷',
      'CA': '🇨🇦',
      'GB': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'IT': '🇮🇹',
      'ES': '🇪🇸',
      'AU': '🇦🇺'
    };
    return flags[countryCode] || '🌍';
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-300">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-0">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-orange-500 to-red-600 rounded-t-lg"></div>
            
            {/* Profile Info */}
            <div className="p-6 -mt-16 relative">
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-6xl shadow-lg">
                  {profile.avatar}
                </div>
                
                {/* Profile Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {profile.name}
                      </h2>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                        @{profile.username}
                      </p>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCountryFlag(profile.countryCode)}</span>
                          <span className="text-gray-600 dark:text-gray-300">{profile.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {profile.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
                        {profile.bio}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Last active {new Date(profile.lastActive).toLocaleDateString()}</span>
                        {profile.website && (
                          <>
                            <span>•</span>
                            <a href={profile.website} className="text-orange-600 hover:text-orange-700">
                              {profile.website}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Rating and Rank */}
                    <div className="text-right">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        <span className={getRatingColor(profile.rating)}>
                          {profile.rating}
                        </span>
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                        Rank #{profile.rank}
                      </div>
                      <div className={`text-sm font-medium ${getDivisionColor(profile.division)}`}>
                        {profile.division.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Max: {profile.maxRating}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-6">
                    {isOwnProfile ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowSettings(!showSettings)}
                          className="flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:border-red-300"
                          onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('userName');
                            navigate('/');
                          }}
                        >
                          <span>Logout</span>
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant={isFollowing ? "outline" : "default"}
                        size="sm"
                        onClick={() => setIsFollowing(!isFollowing)}
                        className="flex items-center space-x-2"
                      >
                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{profile.solvedProblems}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Problems Solved</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {((profile.solvedProblems / profile.totalProblems) * 100).toFixed(1)}% of total
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{profile.contestsParticipated}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Contests</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {profile.contestsWon} won
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{profile.currentStreak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Current Streak</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Max: {profile.maxStreak}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{profile.achievements.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Achievements</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {profile.achievements.filter(a => a.rarity === 'legendary').length} legendary
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'problems', label: 'Problems', icon: Target },
            { id: 'contests', label: 'Contests', icon: Trophy },
            { id: 'submissions', label: 'Submissions', icon: Code },
            { id: 'achievements', label: 'Achievements', icon: Award }
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

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Problem Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Problem Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">{profile.problemStats.easy}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Easy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">{profile.problemStats.medium}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 mb-2">{profile.problemStats.hard}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Hard</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={(profile.solvedProblems / profile.totalProblems) * 100} className="h-2" />
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                      {profile.solvedProblems} of {profile.totalProblems} problems solved
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.recentSubmissions.map((submission, index) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(submission.status)}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {submission.problem}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {submission.language.toUpperCase()} • {new Date(submission.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.achievements.map((achievement, index) => (
                  <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{achievement.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {achievement.description}
                      </p>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contests' && (
            <motion.div
              key="contests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-4">
                {profile.contestHistory.map((contest, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {contest.contest}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Rank: #{contest.rank}</span>
                            <span>•</span>
                            <span>Problems: {contest.problemsSolved}/{contest.totalProblems}</span>
                            <span>•</span>
                            <span>Date: {new Date(contest.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${contest.ratingChange > 0 ? 'text-green-500' : contest.ratingChange < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            {contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Rating Change</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;
