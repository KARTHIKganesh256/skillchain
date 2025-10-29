import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Target,
  Award,
  BarChart3,
  Filter,
  Search,
  Globe,
  Flag,
  Calendar,
  Zap,
  Flame,
  ChevronUp,
  ChevronDown,
  Eye,
  User,
  BookOpen,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface User {
  id: string;
  username: string;
  name: string;
  rating: number;
  rank: number;
  previousRank: number;
  country: string;
  countryCode: string;
  avatar: string;
  solvedProblems: number;
  contestsParticipated: number;
  currentStreak: number;
  maxStreak: number;
  maxRating: number;
  division: 'div1' | 'div2' | 'div3' | 'div4';
  isOnline: boolean;
  lastActive: string;
  achievements: string[];
  contestHistory: {
    contest: string;
    rank: number;
    ratingChange: number;
    date: string;
  }[];
  problemStats: {
    easy: number;
    medium: number;
    hard: number;
  };
  joinDate: string;
  bio: string;
}

interface LeaderboardStats {
  totalUsers: number;
  activeUsers: number;
  averageRating: number;
  topCountry: string;
  totalProblems: number;
  totalContests: number;
}

const LeaderboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    averageRating: 0,
    topCountry: '',
    totalProblems: 0,
    totalContests: 0
  });
  const [filter, setFilter] = useState<'global' | 'country' | 'division'>('global');
  const [division, setDivision] = useState<'all' | 'div1' | 'div2' | 'div3' | 'div4'>('all');
  const [country, setCountry] = useState<string>('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'problems' | 'contests' | 'streak'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [usersPerPage] = useState(50);

  // Sample users data
  useEffect(() => {
    const sampleUsers: User[] = [
      {
        id: 'user-1',
        username: 'tourist',
        name: 'Gennady Korotkevich',
        rating: 3850,
        rank: 1,
        previousRank: 1,
        country: 'Belarus',
        countryCode: 'BY',
        avatar: '👑',
        solvedProblems: 2450,
        contestsParticipated: 156,
        currentStreak: 45,
        maxStreak: 67,
        maxRating: 3850,
        division: 'div1',
        isOnline: true,
        lastActive: new Date().toISOString(),
        achievements: ['Grandmaster', 'IOI Gold', 'ACM World Champion'],
        contestHistory: [
          { contest: 'SkillChain Cook-Off 120', rank: 1, ratingChange: 25, date: '2024-01-15' },
          { contest: 'SkillChain Lunchtime 119', rank: 2, ratingChange: 15, date: '2024-01-10' }
        ],
        problemStats: { easy: 500, medium: 1200, hard: 750 },
        joinDate: '2015-03-15',
        bio: 'Competitive programming enthusiast and multiple-time world champion.'
      },
      {
        id: 'user-2',
        username: 'petr',
        name: 'Petr Mitrichev',
        rating: 3720,
        rank: 2,
        previousRank: 3,
        country: 'Russia',
        countryCode: 'RU',
        avatar: '🥇',
        solvedProblems: 2380,
        contestsParticipated: 142,
        currentStreak: 32,
        maxStreak: 45,
        maxRating: 3720,
        division: 'div1',
        isOnline: false,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        achievements: ['Grandmaster', 'Google Code Jam Winner'],
        contestHistory: [
          { contest: 'SkillChain Cook-Off 120', rank: 3, ratingChange: 20, date: '2024-01-15' },
          { contest: 'SkillChain Lunchtime 119', rank: 1, ratingChange: 30, date: '2024-01-10' }
        ],
        problemStats: { easy: 480, medium: 1150, hard: 750 },
        joinDate: '2014-08-20',
        bio: 'Software engineer and competitive programming coach.'
      },
      {
        id: 'user-3',
        username: 'ecnerwala',
        name: 'Benjamin Qi',
        rating: 3650,
        rank: 3,
        previousRank: 2,
        country: 'USA',
        countryCode: 'US',
        avatar: '🥈',
        solvedProblems: 2290,
        contestsParticipated: 138,
        currentStreak: 28,
        maxStreak: 42,
        maxRating: 3650,
        division: 'div1',
        isOnline: true,
        lastActive: new Date().toISOString(),
        achievements: ['Grandmaster', 'USACO Gold'],
        contestHistory: [
          { contest: 'SkillChain Cook-Off 120', rank: 2, ratingChange: 22, date: '2024-01-15' },
          { contest: 'SkillChain Lunchtime 119', rank: 4, ratingChange: 10, date: '2024-01-10' }
        ],
        problemStats: { easy: 450, medium: 1100, hard: 740 },
        joinDate: '2016-01-10',
        bio: 'High school student passionate about algorithms and data structures.'
      },
      {
        id: 'user-4',
        username: 'neal',
        name: 'Neal Wu',
        rating: 3580,
        rank: 4,
        previousRank: 5,
        country: 'USA',
        countryCode: 'US',
        avatar: '🥉',
        solvedProblems: 2150,
        contestsParticipated: 125,
        currentStreak: 15,
        maxStreak: 38,
        maxRating: 3580,
        division: 'div1',
        isOnline: false,
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        achievements: ['Grandmaster', 'IOI Silver'],
        contestHistory: [
          { contest: 'SkillChain Cook-Off 120', rank: 4, ratingChange: 18, date: '2024-01-15' },
          { contest: 'SkillChain Lunchtime 119', rank: 3, ratingChange: 20, date: '2024-01-10' }
        ],
        problemStats: { easy: 420, medium: 1050, hard: 680 },
        joinDate: '2017-05-20',
        bio: 'Software engineer at Google, competitive programming enthusiast.'
      },
      {
        id: 'user-5',
        username: 'kefaa',
        name: 'Kefaa',
        rating: 3420,
        rank: 5,
        previousRank: 4,
        country: 'Ukraine',
        countryCode: 'UA',
        avatar: '🏆',
        solvedProblems: 1980,
        contestsParticipated: 110,
        currentStreak: 8,
        maxStreak: 25,
        maxRating: 3420,
        division: 'div1',
        isOnline: true,
        lastActive: new Date().toISOString(),
        achievements: ['Master', 'IOI Bronze'],
        contestHistory: [
          { contest: 'SkillChain Cook-Off 120', rank: 5, ratingChange: 15, date: '2024-01-15' },
          { contest: 'SkillChain Lunchtime 119', rank: 6, ratingChange: 12, date: '2024-01-10' }
        ],
        problemStats: { easy: 400, medium: 980, hard: 600 },
        joinDate: '2018-09-15',
        bio: 'Computer science student and competitive programming coach.'
      }
    ];

    setUsers(sampleUsers);
    setFilteredUsers(sampleUsers);

    // Calculate stats
    const leaderboardStats: LeaderboardStats = {
      totalUsers: sampleUsers.length,
      activeUsers: sampleUsers.filter(u => u.isOnline).length,
      averageRating: Math.round(sampleUsers.reduce((sum, u) => sum + u.rating, 0) / sampleUsers.length),
      topCountry: 'USA',
      totalProblems: 10000,
      totalContests: 500
    };
    setStats(leaderboardStats);
  }, []);

  // Filter and sort users
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.country.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Division filter
    if (division !== 'all') {
      filtered = filtered.filter(user => user.division === division);
    }

    // Country filter
    if (country) {
      filtered = filtered.filter(user => user.country === country);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'problems':
          aValue = a.solvedProblems;
          bValue = b.solvedProblems;
          break;
        case 'contests':
          aValue = a.contestsParticipated;
          bValue = b.contestsParticipated;
          break;
        case 'streak':
          aValue = a.currentStreak;
          bValue = b.currentStreak;
          break;
        default:
          aValue = a.rating;
          bValue = b.rating;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredUsers(filtered);
    setPage(1);
  }, [users, search, division, country, sortBy, sortOrder]);

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

  const getRankChangeIcon = (currentRank: number, previousRank: number) => {
    if (currentRank < previousRank) {
      return <ChevronUp className="w-4 h-4 text-green-500" />;
    } else if (currentRank > previousRank) {
      return <ChevronDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankChangeText = (currentRank: number, previousRank: number) => {
    if (currentRank < previousRank) {
      return `+${previousRank - currentRank}`;
    } else if (currentRank > previousRank) {
      return `-${currentRank - previousRank}`;
    } else {
      return '0';
    }
  };

  const getRankChangeColor = (currentRank: number, previousRank: number) => {
    if (currentRank < previousRank) return 'text-green-500';
    if (currentRank > previousRank) return 'text-red-500';
    return 'text-gray-400';
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const paginatedUsers = filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Users</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.activeUsers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Online Now</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.averageRating}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">{stats.topCountry}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Top Country</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.totalProblems.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Problems</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.totalContests}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Contests</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users by name, username, or country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Division Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Division:
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="all">All Divisions</option>
                  <option value="div1">Division 1</option>
                  <option value="div2">Division 2</option>
                  <option value="div3">Division 3</option>
                  <option value="div4">Division 4</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="rating">Rating</option>
                  <option value="problems">Problems Solved</option>
                  <option value="contests">Contests</option>
                  <option value="streak">Current Streak</option>
                </select>
              </div>

              {/* Sort Order */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Global Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Problems
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Contests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Streak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            #{user.rank}
                          </div>
                          {getMedalIcon(user.rank)}
                          <div className="flex items-center space-x-1">
                            {getRankChangeIcon(user.rank, user.previousRank)}
                            <span className={`text-sm ${getRankChangeColor(user.rank, user.previousRank)}`}>
                              {getRankChangeText(user.rank, user.previousRank)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{user.avatar}</div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          <span className={getRatingColor(user.rating)}>
                            {user.rating}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Max: {user.maxRating}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.solvedProblems.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          E:{user.problemStats.easy} M:{user.problemStats.medium} H:{user.problemStats.hard}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.contestsParticipated}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.currentStreak}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Max: {user.maxStreak}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCountryFlag(user.countryCode)}</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {user.country}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {user.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((page - 1) * usersPerPage) + 1} to {Math.min(page * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-lg mb-4">
              No users found matching your criteria.
            </div>
            <Button 
              onClick={() => {
                setSearch('');
                setDivision('all');
                setCountry('');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Helper function to get country flag emoji
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

export default LeaderboardPage;
