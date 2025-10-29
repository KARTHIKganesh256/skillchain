import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  Users, 
  Star, 
  Calendar,
  Play,
  CheckCircle,
  AlertCircle,
  Award,
  Zap,
  Target,
  BarChart3,
  Crown,
  Flame,
  ChevronRight,
  Filter,
  Search,
  Timer,
  Gift,
  Medal,
  TrendingUp,
  Eye,
  Bookmark,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface Contest {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: 'long' | 'short' | 'lunchtime' | 'cookoff' | 'starters' | 'longchallenge';
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  maxParticipants?: number;
  isLive: boolean;
  isUpcoming: boolean;
  isFinished: boolean;
  isRegistered: boolean;
  prizes: string[];
  problems: number;
  color: string;
  rules: string[];
  languages: string[];
  registrationStart: string;
  registrationEnd: string;
  isRegistrationOpen: boolean;
  contestUrl: string;
  editorialUrl?: string;
  discussionUrl?: string;
}

interface ContestStats {
  totalContests: number;
  liveContests: number;
  upcomingContests: number;
  finishedContests: number;
  totalParticipants: number;
  totalPrizes: number;
}

const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [stats, setStats] = useState<ContestStats>({
    totalContests: 0,
    liveContests: 0,
    upcomingContests: 0,
    finishedContests: 0,
    totalParticipants: 0,
    totalPrizes: 0
  });
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');
  const [sortBy, setSortBy] = useState<'startTime' | 'participants' | 'name'>('startTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sample contests data
  useEffect(() => {
    const sampleContests: Contest[] = [
      {
        id: 'contest-1',
        name: 'SkillChain Starters 120',
        description: 'A 3-hour contest with 8 problems for beginners and intermediate programmers.',
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
        isRegistered: true,
        prizes: ['T-Shirts for top 100', 'Laddus for all participants', 'Certificates for top 1000'],
        problems: 8,
        color: 'from-green-500 to-emerald-600',
        rules: ['Individual participation only', 'No plagiarism', 'Standard I/O'],
        languages: ['C++', 'Java', 'Python', 'C'],
        registrationStart: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        registrationEnd: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        isRegistrationOpen: true,
        contestUrl: '/contest/starters-120',
        editorialUrl: '/editorial/starters-120',
        discussionUrl: '/discuss/starters-120'
      },
      {
        id: 'contest-2',
        name: 'SkillChain Lunchtime 2024',
        description: 'Monthly lunchtime contest with challenging problems for all skill levels.',
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
        isRegistered: false,
        prizes: ['Cash prizes worth $5000', 'T-Shirts for top 200', 'Certificates for all participants'],
        problems: 6,
        color: 'from-blue-500 to-cyan-600',
        rules: ['Individual participation', 'No external help', 'Standard contest rules'],
        languages: ['C++', 'Java', 'Python', 'C', 'JavaScript'],
        registrationStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        registrationEnd: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        isRegistrationOpen: true,
        contestUrl: '/contest/lunchtime-2024'
      },
      {
        id: 'contest-3',
        name: 'SkillChain Cook-Off 2024',
        description: 'Monthly cook-off with 5 challenging problems for advanced programmers.',
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(),
        duration: 150,
        type: 'cookoff',
        difficulty: 'hard',
        participants: 12500,
        isLive: false,
        isUpcoming: false,
        isFinished: true,
        isRegistered: false,
        prizes: ['Cash prizes worth $3000', 'T-Shirts for top 100'],
        problems: 5,
        color: 'from-purple-500 to-pink-600',
        rules: ['Individual participation', 'No external help', 'Standard contest rules'],
        languages: ['C++', 'Java', 'Python', 'C'],
        registrationStart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        registrationEnd: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        isRegistrationOpen: false,
        contestUrl: '/contest/cookoff-2024',
        editorialUrl: '/editorial/cookoff-2024',
        discussionUrl: '/discuss/cookoff-2024'
      },
      {
        id: 'contest-4',
        name: 'SkillChain Long Challenge 2024',
        description: '10-day long challenge with 8 problems of varying difficulty levels.',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 14400, // 10 days
        type: 'longchallenge',
        difficulty: 'medium',
        participants: 0,
        maxParticipants: 100000,
        isLive: false,
        isUpcoming: true,
        isFinished: false,
        isRegistered: false,
        prizes: ['Cash prizes worth $10000', 'T-Shirts for top 500', 'Certificates for top 2000'],
        problems: 8,
        color: 'from-orange-500 to-red-600',
        rules: ['Individual participation', 'No plagiarism', 'Long challenge rules'],
        languages: ['C++', 'Java', 'Python', 'C', 'JavaScript', 'Go'],
        registrationStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        registrationEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        isRegistrationOpen: true,
        contestUrl: '/contest/longchallenge-2024'
      }
    ];

    setContests(sampleContests);
    setFilteredContests(sampleContests);

    // Calculate stats
    const contestStats: ContestStats = {
      totalContests: sampleContests.length,
      liveContests: sampleContests.filter(c => c.isLive).length,
      upcomingContests: sampleContests.filter(c => c.isUpcoming).length,
      finishedContests: sampleContests.filter(c => c.isFinished).length,
      totalParticipants: sampleContests.reduce((sum, c) => sum + c.participants, 0),
      totalPrizes: sampleContests.reduce((sum, c) => sum + c.prizes.length, 0)
    };
    setStats(contestStats);
  }, []);

  // Filter and sort contests
  useEffect(() => {
    let filtered = contests;

    // Filter by status
    switch (filter) {
      case 'live':
        filtered = filtered.filter(contest => contest.isLive);
        break;
      case 'upcoming':
        filtered = filtered.filter(contest => contest.isUpcoming);
        break;
      case 'finished':
        filtered = filtered.filter(contest => contest.isFinished);
        break;
      default:
        break;
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'startTime':
          aValue = new Date(a.startTime).getTime();
          bValue = new Date(b.startTime).getTime();
          break;
        case 'participants':
          aValue = a.participants;
          bValue = b.participants;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          aValue = new Date(a.startTime).getTime();
          bValue = new Date(b.startTime).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredContests(filtered);
  }, [contests, filter, sortBy, sortOrder]);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      starters: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      lunchtime: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      cookoff: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      longchallenge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      short: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      long: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[type as keyof typeof colors] || colors.starters;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
  };

  const getTimeUntilStart = (startTime: string) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const diff = start - now;

    if (diff <= 0) return 'Started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.totalContests}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Contests</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.liveContests}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Live Now</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.upcomingContests}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Upcoming</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600 mb-1">{stats.finishedContests}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Finished</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.totalParticipants.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Participants</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">{stats.totalPrizes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Prize Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sort */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-wrap gap-2">
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

              <div className="flex items-center space-x-4 ml-auto">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort by:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="startTime">Start Time</option>
                    <option value="participants">Participants</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {contest.name}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {contest.description}
                      </p>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={getDifficultyColor(contest.difficulty)}>
                          {contest.difficulty}
                        </Badge>
                        <Badge className={getTypeColor(contest.type)}>
                          {contest.type}
                        </Badge>
                        {contest.isLive && (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse">
                            🔴 LIVE
                          </Badge>
                        )}
                        {contest.isRegistrationOpen && !contest.isLive && !contest.isFinished && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Registration Open
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatDuration(contest.duration)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Problems</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {contest.problems}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Participants</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {contest.participants.toLocaleString()}
                          {contest.maxParticipants && ` / ${contest.maxParticipants.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Start Time</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {new Date(contest.startTime).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {contest.isUpcoming && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                          <Timer className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Starts in {getTimeUntilStart(contest.startTime)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prizes */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <Gift className="w-4 h-4 mr-1" />
                      Prizes
                    </h4>
                    <div className="space-y-1">
                      {contest.prizes.slice(0, 3).map((prize, index) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <Medal className="w-3 h-3 mr-2 text-yellow-500" />
                          {prize}
                        </div>
                      ))}
                      {contest.prizes.length > 3 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          +{contest.prizes.length - 3} more prizes
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Supported Languages
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {contest.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {contest.isLive ? (
                      <Button className="flex-1 bg-red-600 hover:bg-red-700">
                        <Play className="w-4 h-4 mr-2" />
                        Join Contest
                      </Button>
                    ) : contest.isUpcoming ? (
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={!contest.isRegistrationOpen}
                      >
                        {contest.isRegistered ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Registered
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4 mr-2" />
                            Register
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button className="flex-1 bg-gray-600 hover:bg-gray-700">
                        <Eye className="w-4 h-4 mr-2" />
                        View Results
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Additional Links */}
                  {(contest.editorialUrl || contest.discussionUrl) && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-4 text-sm">
                        {contest.editorialUrl && (
                          <a 
                            href={contest.editorialUrl}
                            className="text-orange-600 hover:text-orange-700 flex items-center"
                          >
                            <Bookmark className="w-3 h-3 mr-1" />
                            Editorial
                          </a>
                        )}
                        {contest.discussionUrl && (
                          <a 
                            href={contest.discussionUrl}
                            className="text-orange-600 hover:text-orange-700 flex items-center"
                          >
                            <Users className="w-3 h-3 mr-1" />
                            Discussion
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-lg mb-4">
              No contests found matching your criteria.
            </div>
            <Button 
              onClick={() => setFilter('all')}
              variant="outline"
            >
              Show All Contests
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContestsPage;
