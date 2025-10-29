import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Flag, 
  Bookmark, 
  Share2, 
  MoreHorizontal,
  Clock, 
  User, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Trophy, 
  Target, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Award,
  Crown,
  Medal,
  Flame,
  Zap,
  Activity,
  Calendar,
  Globe,
  Flag as FlagIcon,
  Edit,
  Trash2,
  Pin,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
    name: string;
    avatar: string;
    rating: number;
    division: string;
    country: string;
    countryCode: string;
  };
  category: 'general' | 'problem' | 'contest' | 'announcement' | 'tutorial' | 'bug_report' | 'feature_request';
  tags: string[];
  problemCode?: string;
  contestName?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  dislikes: number;
  replies: number;
  isPinned: boolean;
  isLocked: boolean;
  isResolved: boolean;
  lastReply?: {
    author: string;
    createdAt: string;
  };
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

interface Reply {
  id: string;
  content: string;
  author: {
    username: string;
    name: string;
    avatar: string;
    rating: number;
    division: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  isAccepted: boolean;
  parentId?: string;
  replies: Reply[];
}

interface FilterState {
  category: string;
  tags: string[];
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  timeRange: string;
}

const DiscussionsPage: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    tags: [],
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    timeRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [likedDiscussionIds, setLikedDiscussionIds] = useState<Set<string>>(new Set());
  const [likedReplyIds, setLikedReplyIds] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState<{ title: string; content: string; category: Discussion['category']; tags: string; problemCode?: string; contestName?: string }>({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    problemCode: '',
    contestName: ''
  });
  const userName = (typeof window !== 'undefined' && localStorage.getItem('userName')) || 'Guest';
  const userRole = (typeof window !== 'undefined' && localStorage.getItem('role')) || 'user';
  const isAdmin = userRole === 'admin' || userName?.toLowerCase() === 'admin';

  // Sample discussions data
  useEffect(() => {
    const sampleDiscussions: Discussion[] = [
      {
        id: 'disc-1',
        title: 'How to solve SUM2 problem efficiently?',
        content: 'I\'m having trouble with the SUM2 problem. Can someone explain the optimal approach? I tried brute force but got TLE.',
        author: {
          username: 'newbie_coder',
          name: 'John Doe',
          avatar: '👨‍💻',
          rating: 1200,
          division: 'div4',
          country: 'USA',
          countryCode: 'US'
        },
        category: 'problem',
        tags: ['sum2', 'help', 'tle', 'optimization'],
        problemCode: 'SUM2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 45,
        likes: 8,
        dislikes: 1,
        replies: 12,
        isPinned: false,
        isLocked: false,
        isResolved: false,
        lastReply: {
          author: 'expert_solver',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'disc-2',
        title: 'SkillChain Starters 120 - Discussion Thread',
        content: 'Welcome to the discussion thread for SkillChain Starters 120! Share your solutions, ask questions, and discuss the problems here.',
        author: {
          username: 'admin',
          name: 'SkillChain Admin',
          avatar: '👑',
          rating: 4000,
          division: 'div1',
          country: 'India',
          countryCode: 'IN'
        },
        category: 'contest',
        tags: ['starters-120', 'contest', 'discussion'],
        contestName: 'SkillChain Starters 120',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        views: 234,
        likes: 45,
        dislikes: 2,
        replies: 67,
        isPinned: true,
        isLocked: false,
        isResolved: false,
        lastReply: {
          author: 'contestant_123',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'disc-3',
        title: 'Tutorial: Dynamic Programming Basics',
        content: 'A comprehensive tutorial on dynamic programming concepts with examples and practice problems. Perfect for beginners!',
        author: {
          username: 'dp_master',
          name: 'Alice Smith',
          avatar: '👩‍🏫',
          rating: 2800,
          division: 'div2',
          country: 'Canada',
          countryCode: 'CA'
        },
        category: 'tutorial',
        tags: ['tutorial', 'dp', 'dynamic-programming', 'beginner'],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        views: 567,
        likes: 89,
        dislikes: 3,
        replies: 23,
        isPinned: false,
        isLocked: false,
        isResolved: false,
        lastReply: {
          author: 'learning_student',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'disc-4',
        title: 'Bug Report: Code Editor not working properly',
        content: 'The code editor is not highlighting syntax correctly for Python. This is affecting my coding experience.',
        author: {
          username: 'bug_reporter',
          name: 'Bob Wilson',
          avatar: '🐛',
          rating: 1500,
          division: 'div3',
          country: 'UK',
          countryCode: 'GB'
        },
        category: 'bug_report',
        tags: ['bug', 'editor', 'python', 'syntax-highlighting'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        views: 89,
        likes: 12,
        dislikes: 0,
        replies: 8,
        isPinned: false,
        isLocked: false,
        isResolved: true,
        lastReply: {
          author: 'support_team',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'disc-5',
        title: 'Feature Request: Dark mode for mobile app',
        content: 'It would be great to have a dark mode option for the mobile app. Many users prefer dark themes for coding.',
        author: {
          username: 'feature_requester',
          name: 'Carol Davis',
          avatar: '💡',
          rating: 1800,
          division: 'div3',
          country: 'Australia',
          countryCode: 'AU'
        },
        category: 'feature_request',
        tags: ['feature', 'mobile', 'dark-mode', 'ui'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        views: 123,
        likes: 34,
        dislikes: 2,
        replies: 15,
        isPinned: false,
        isLocked: false,
        isResolved: false,
        lastReply: {
          author: 'ui_designer',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];

    setDiscussions(sampleDiscussions);
    setFilteredDiscussions(sampleDiscussions);

    // Extract unique tags
    const tags = Array.from(new Set(sampleDiscussions.flatMap(d => d.tags)));
    setAvailableTags(tags);
  }, []);

  // Sample replies data
  useEffect(() => {
    if (selectedDiscussion) {
      const sampleReplies: Reply[] = [
        {
          id: 'reply-1',
          content: 'For the SUM2 problem, you can use a simple loop to sum all elements. The time complexity is O(n) which should be efficient enough.',
          author: {
            username: 'expert_solver',
            name: 'Expert Solver',
            avatar: '🧠',
            rating: 3200,
            division: 'div1'
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 15,
          dislikes: 0,
          isAccepted: true,
          replies: []
        },
        {
          id: 'reply-2',
          content: 'Here\'s the code:\n\n```cpp\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int sum = 0;\n    for (int i = 0; i < n; i++) {\n        int x;\n        cin >> x;\n        sum += x;\n    }\n    cout << sum << endl;\n    return 0;\n}\n```',
          author: {
            username: 'code_helper',
            name: 'Code Helper',
            avatar: '💻',
            rating: 2500,
            division: 'div2'
          },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          likes: 23,
          dislikes: 1,
          isAccepted: false,
          replies: []
        },
        {
          id: 'reply-3',
          content: 'Make sure to handle edge cases like n=0 or very large numbers. Also, consider using long long if the sum might overflow.',
          author: {
            username: 'edge_case_master',
            name: 'Edge Case Master',
            avatar: '⚠️',
            rating: 2800,
            division: 'div2'
          },
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          likes: 8,
          dislikes: 0,
          isAccepted: false,
          replies: []
        }
      ];
      setReplies(sampleReplies);
    }
  }, [selectedDiscussion]);

  // Filter discussions
  useEffect(() => {
    let filtered = discussions;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(discussion =>
        discussion.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        discussion.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        discussion.author.username.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(discussion => discussion.category === filters.category);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(discussion =>
        filters.tags.some(tag => discussion.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        case 'likes':
          aValue = a.likes;
          bValue = b.likes;
          break;
        case 'replies':
          aValue = a.replies;
          bValue = b.replies;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredDiscussions(filtered);
  }, [discussions, filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    handleFilterChange('tags', selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      problem: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      contest: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      announcement: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      tutorial: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      bug_report: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      feature_request: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
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

  const getCountryFlag = (countryCode: string): string => {
    const flags: { [key: string]: string } = {
      'US': '🇺🇸',
      'IN': '🇮🇳',
      'CA': '🇨🇦',
      'GB': '🇬🇧',
      'AU': '🇦🇺',
      'BY': '🇧🇾',
      'RU': '🇷🇺',
      'UA': '🇺🇦',
      'CN': '🇨🇳',
      'JP': '🇯🇵',
      'KR': '🇰🇷',
      'BR': '🇧🇷',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'IT': '🇮🇹',
      'ES': '🇪🇸'
    };
    return flags[countryCode] || '🌍';
  };

  // Like/Share handlers
  const likeDiscussion = (id: string) => {
    if (likedDiscussionIds.has(id)) return; // prevent double-like in this session
    setLikedDiscussionIds(prev => new Set(prev).add(id));
    setDiscussions(prev => prev.map(d => d.id === id ? { ...d, likes: d.likes + 1 } : d));
    setFilteredDiscussions(prev => prev.map(d => d.id === id ? { ...d, likes: d.likes + 1 } : d));
  };

  const shareDiscussion = async (discussion: Discussion) => {
    const url = `${window.location.origin}/discussions#${discussion.id}`;
    const title = discussion.title;
    const text = 'Join this discussion on SkillChain:';
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('Link copied to clipboard');
      }
    } catch {}
  };

  const likeReply = (id: string) => {
    if (likedReplyIds.has(id)) return;
    setLikedReplyIds(prev => new Set(prev).add(id));
    setReplies(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  // Create new discussion
  const createDiscussion = () => {
    if (!draft.title.trim() || !draft.content.trim()) return;
    const newDisc: Discussion = {
      id: `disc-${Date.now()}`,
      title: draft.title.trim(),
      content: draft.content.trim(),
      author: {
        username: userName || 'anonymous',
        name: userName || 'Anonymous',
        avatar: '🗣️',
        rating: 1200,
        division: 'div4',
        country: 'USA',
        countryCode: 'US'
      },
      category: draft.category,
      tags: draft.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      problemCode: draft.problemCode?.trim() || undefined,
      contestName: draft.contestName?.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      dislikes: 0,
      replies: 0,
      isPinned: false,
      isLocked: false,
      isResolved: false
    };
    const next = [newDisc, ...discussions];
    setDiscussions(next);
    setFilteredDiscussions(next);
    setShowNewDiscussion(false);
    setDraft({ title: '', content: '', category: 'general', tags: '', problemCode: '', contestName: '' });
  };

  // Admin controls
  const togglePin = (id: string) => {
    setDiscussions(prev => prev.map(d => d.id === id ? { ...d, isPinned: !d.isPinned } : d));
  };
  const toggleLock = (id: string) => {
    setDiscussions(prev => prev.map(d => d.id === id ? { ...d, isLocked: !d.isLocked } : d));
  };
  const deleteDiscussion = (id: string) => {
    if (!window.confirm('Delete this discussion?')) return;
    const next = discussions.filter(d => d.id !== id);
    setDiscussions(next);
    setFilteredDiscussions(next);
    if (selectedDiscussion?.id === id) setSelectedDiscussion(null);
  };
  const startEdit = (d: Discussion) => {
    setSelectedDiscussion(d);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60 * 1000) return 'Just now';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="general">General</option>
                        <option value="problem">Problem</option>
                        <option value="contest">Contest</option>
                        <option value="announcement">Announcement</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="bug_report">Bug Report</option>
                        <option value="feature_request">Feature Request</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="createdAt">Created Date</option>
                        <option value="updatedAt">Last Updated</option>
                        <option value="views">Views</option>
                        <option value="likes">Likes</option>
                        <option value="replies">Replies</option>
                      </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order
                      </label>
                      <select
                        value={filters.sortOrder}
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>

                    {/* Time Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Time Range
                      </label>
                      <select
                        value={filters.timeRange}
                        onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <Button
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleTagToggle(tag)}
                          className="text-xs"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Actions Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Signed in as <span className="font-semibold">{userName || 'Guest'}</span>{isAdmin && <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 text-xs">Admin</span>}
          </div>
          <Button onClick={() => setShowNewDiscussion(true)} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" /> New Discussion
          </Button>
        </div>

        {/* New Discussion Modal */}
        <AnimatePresence>
          {showNewDiscussion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewDiscussion(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Create Discussion</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowNewDiscussion(false)}>
                    Close
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder="Title"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value as Discussion['category'] })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  >
                    <option value="general">General</option>
                    <option value="problem">Problem</option>
                    <option value="contest">Contest</option>
                    <option value="announcement">Announcement</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="bug_report">Bug Report</option>
                    <option value="feature_request">Feature Request</option>
                  </select>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={draft.problemCode}
                      onChange={(e) => setDraft({ ...draft, problemCode: e.target.value })}
                      placeholder="Problem Code (optional)"
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    />
                    <input
                      value={draft.contestName}
                      onChange={(e) => setDraft({ ...draft, contestName: e.target.value })}
                      placeholder="Contest Name (optional)"
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <textarea
                    value={draft.content}
                    onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                    placeholder="What do you want to discuss?"
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                  <input
                    value={draft.tags}
                    onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
                    placeholder="Tags (comma separated)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewDiscussion(false)}>Cancel</Button>
                  <Button className="bg-orange-600 hover:bg-orange-700" disabled={!draft.title.trim() || !draft.content.trim()} onClick={createDiscussion}>Create</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discussions List */}
        <div className="space-y-4">
          {filteredDiscussions.map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Author Avatar */}
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                      {discussion.author.avatar}
                    </div>

                    <div className="flex-1">
                      {/* Discussion Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {discussion.title}
                            </h3>
                            {discussion.isPinned && <Pin className="w-4 h-4 text-orange-500" />}
                            {discussion.isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                            {discussion.isResolved && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getCategoryColor(discussion.category)}>
                              {discussion.category.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {discussion.problemCode && (
                              <Badge variant="outline" className="font-mono">
                                {discussion.problemCode}
                              </Badge>
                            )}
                            {discussion.contestName && (
                              <Badge variant="outline">
                                {discussion.contestName}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {/* Admin controls */}
                        {isAdmin && (
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="outline" size="sm" onClick={() => togglePin(discussion.id)} title={discussion.isPinned ? 'Unpin' : 'Pin'}>
                              <Pin className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toggleLock(discussion.id)} title={discussion.isLocked ? 'Unlock' : 'Lock'}>
                              {discussion.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDiscussion(discussion)} title="Open">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => deleteDiscussion(discussion.id)} title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Discussion Content */}
                      <button className="text-left w-full" onClick={() => setSelectedDiscussion(discussion)}>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {discussion.content}
                        </p>
                      </button>

                      {/* Tags */}
                      <div className="flex items-center space-x-2 mb-4">
                        {discussion.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Discussion Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{discussion.author.name}</span>
                            <span className={getDivisionColor(discussion.author.division)}>
                              ({discussion.author.rating})
                            </span>
                            <span className="text-lg">{getCountryFlag(discussion.author.countryCode)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(discussion.createdAt)}</span>
                          </div>
                          {discussion.lastReply && (
                            <div className="flex items-center space-x-1">
                              <span>Last reply by {discussion.lastReply.author}</span>
                              <span>{formatTime(discussion.lastReply.createdAt)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{discussion.views}</span>
                          </div>
                          <button
                            className="flex items-center space-x-1 hover:text-orange-600"
                            onClick={() => likeDiscussion(discussion.id)}
                            title={likedDiscussionIds.has(discussion.id) ? 'Liked' : 'Like'}
                          >
                            <ThumbsUp className={`w-4 h-4 ${likedDiscussionIds.has(discussion.id) ? 'text-orange-600' : ''}`} />
                            <span>{discussion.likes}</span>
                          </button>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{discussion.replies}</span>
                          </div>
                          <button
                            className="flex items-center space-x-1 hover:text-orange-600"
                            onClick={() => shareDiscussion(discussion)}
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDiscussions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-lg mb-4">
              No discussions found matching your criteria.
            </div>
            <Button 
              onClick={() => {
                setFilters({
                  category: 'all',
                  tags: [],
                  search: '',
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
                  timeRange: 'all'
                });
                setSelectedTags([]);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Discussion Detail Modal */}
      <AnimatePresence>
        {selectedDiscussion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDiscussion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedDiscussion.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(selectedDiscussion.category)}>
                        {selectedDiscussion.category.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {selectedDiscussion.problemCode && (
                        <Badge variant="outline" className="font-mono">
                          {selectedDiscussion.problemCode}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDiscussion(null)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-96">
                {/* Original Post */}
                <div className="mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl">
                      {selectedDiscussion.author.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedDiscussion.author.name}
                        </span>
                        <span className={getDivisionColor(selectedDiscussion.author.division)}>
                          ({selectedDiscussion.author.rating})
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(selectedDiscussion.createdAt)}
                        </span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedDiscussion.content}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Replies ({replies.length})
                  </h4>
                  {replies.map((reply) => (
                    <div key={reply.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm">
                          {reply.author.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {reply.author.name}
                            </span>
                            <span className={getDivisionColor(reply.author.division)}>
                              ({reply.author.rating})
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTime(reply.createdAt)}
                            </span>
                            {reply.isAccepted && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Accepted
                              </Badge>
                            )}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {reply.content}
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <button
                              className="flex items-center space-x-1 hover:text-orange-600"
                              onClick={() => likeReply(reply.id)}
                              title={likedReplyIds.has(reply.id) ? 'Liked' : 'Like'}
                            >
                              <ThumbsUp className={`w-4 h-4 ${likedReplyIds.has(reply.id) ? 'text-orange-600' : ''}`} />
                              <span>{reply.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-orange-600">
                              <ThumbsDown className="w-4 h-4" />
                              <span>{reply.dislikes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-orange-600">
                              <Reply className="w-4 h-4" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add a Reply
                  </h4>
                  <div className="space-y-4">
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Write your reply here..."
                      className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                    />
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" onClick={() => setNewReply('')}>
                        Cancel
                      </Button>
                      <Button 
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={!newReply.trim()}
                      >
                        Post Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscussionsPage;
