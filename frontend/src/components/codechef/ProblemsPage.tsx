import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Code, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Star,
  Tag,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Play,
  Eye,
  Bookmark,
  TrendingUp,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface Problem {
  id: string;
  name: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  solvedBy: number;
  accuracy: number;
  points: number;
  timeLimit: number; // in seconds
  memoryLimit: number; // in MB
  isSolved: boolean;
  isAttempted: boolean;
  isBookmarked: boolean;
  contest: string;
  author: string;
  addedDate: string;
  submissions: number;
  editorial: boolean;
  discussion: number;
}

interface FilterState {
  difficulty: string;
  tags: string[];
  solved: string;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    difficulty: 'all',
    tags: [],
    solved: 'all',
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Sample problems data
  useEffect(() => {
    const sampleProblems: Problem[] = [
      {
        id: 'prob-1',
        name: 'Sum of Two Numbers',
        code: 'SUM2',
        difficulty: 'easy',
        tags: ['math', 'implementation', 'beginner'],
        solvedBy: 15420,
        accuracy: 85.5,
        points: 100,
        timeLimit: 1,
        memoryLimit: 256,
        isSolved: true,
        isAttempted: false,
        isBookmarked: false,
        contest: 'Practice',
        author: 'admin',
        addedDate: '2024-01-15',
        submissions: 18000,
        editorial: true,
        discussion: 45
      },
      {
        id: 'prob-2',
        name: 'Binary Search Tree Operations',
        code: 'BSTOPS',
        difficulty: 'medium',
        tags: ['data-structures', 'trees', 'binary-search'],
        solvedBy: 8540,
        accuracy: 62.3,
        points: 200,
        timeLimit: 2,
        memoryLimit: 512,
        isSolved: false,
        isAttempted: true,
        isBookmarked: true,
        contest: 'Practice',
        author: 'expert',
        addedDate: '2024-01-20',
        submissions: 12000,
        editorial: true,
        discussion: 23
      },
      {
        id: 'prob-3',
        name: 'Dynamic Programming Challenge',
        code: 'DPCHALL',
        difficulty: 'hard',
        tags: ['dp', 'optimization', 'advanced'],
        solvedBy: 2340,
        accuracy: 35.7,
        points: 500,
        timeLimit: 3,
        memoryLimit: 1024,
        isSolved: false,
        isAttempted: false,
        isBookmarked: false,
        contest: 'Practice',
        author: 'master',
        addedDate: '2024-01-25',
        submissions: 6500,
        editorial: false,
        discussion: 12
      },
      {
        id: 'prob-4',
        name: 'Graph Shortest Path',
        code: 'GRAPHPATH',
        difficulty: 'medium',
        tags: ['graphs', 'shortest-path', 'algorithms'],
        solvedBy: 6780,
        accuracy: 58.2,
        points: 300,
        timeLimit: 2,
        memoryLimit: 512,
        isSolved: false,
        isAttempted: false,
        isBookmarked: true,
        contest: 'Practice',
        author: 'algo_expert',
        addedDate: '2024-02-01',
        submissions: 11500,
        editorial: true,
        discussion: 34
      },
      {
        id: 'prob-5',
        name: 'String Manipulation',
        code: 'STRMANIP',
        difficulty: 'easy',
        tags: ['strings', 'implementation', 'beginner'],
        solvedBy: 12300,
        accuracy: 78.9,
        points: 150,
        timeLimit: 1,
        memoryLimit: 256,
        isSolved: true,
        isAttempted: false,
        isBookmarked: false,
        contest: 'Practice',
        author: 'string_master',
        addedDate: '2024-02-05',
        submissions: 15600,
        editorial: true,
        discussion: 28
      }
    ];

    setProblems(sampleProblems);
    setFilteredProblems(sampleProblems);
    
    // Extract unique tags
    const tags = Array.from(new Set(sampleProblems.flatMap(p => p.tags)));
    setAvailableTags(tags);
  }, []);

  // Filter problems based on current filters
  useEffect(() => {
    let filtered = problems;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(problem =>
        problem.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        problem.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        problem.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === filters.difficulty);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(problem =>
        filters.tags.some(tag => problem.tags.includes(tag))
      );
    }

    // Solved filter
    if (filters.solved === 'solved') {
      filtered = filtered.filter(problem => problem.isSolved);
    } else if (filters.solved === 'attempted') {
      filtered = filtered.filter(problem => problem.isAttempted && !problem.isSolved);
    } else if (filters.solved === 'unsolved') {
      filtered = filtered.filter(problem => !problem.isSolved && !problem.isAttempted);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          aValue = difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
          bValue = difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
          break;
        case 'solved':
          aValue = a.solvedBy;
          bValue = b.solvedBy;
          break;
        case 'accuracy':
          aValue = a.accuracy;
          bValue = b.accuracy;
          break;
        case 'points':
          aValue = a.points;
          bValue = b.points;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredProblems(filtered);
  }, [problems, filters]);

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

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getStatusIcon = (problem: Problem) => {
    if (problem.isSolved) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (problem.isAttempted) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search problems by name, code, or tags..."
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
                    {/* Difficulty Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={filters.difficulty}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    {/* Solved Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={filters.solved}
                        onChange={(e) => handleFilterChange('solved', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Problems</option>
                        <option value="solved">Solved</option>
                        <option value="attempted">Attempted</option>
                        <option value="unsolved">Unsolved</option>
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
                        <option value="name">Name</option>
                        <option value="difficulty">Difficulty</option>
                        <option value="solved">Solved By</option>
                        <option value="accuracy">Accuracy</option>
                        <option value="points">Points</option>
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
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
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
                          <Tag className="w-3 h-3 mr-1" />
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

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(problem)}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {problem.name}
                          </h3>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {problem.code}
                        </Badge>
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        {problem.isBookmarked && (
                          <Bookmark className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{problem.solvedBy.toLocaleString()} solved</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{problem.accuracy}% accuracy</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{problem.points} points</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{problem.timeLimit}s / {problem.memoryLimit}MB</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {problem.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Play className="w-4 h-4 mr-1" />
                        Solve
                      </Button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>Author: {problem.author}</span>
                        <span>Added: {new Date(problem.addedDate).toLocaleDateString()}</span>
                        <span>Submissions: {problem.submissions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {problem.editorial && (
                          <Badge variant="outline" className="text-xs">
                            Editorial Available
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {problem.discussion} discussions
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-lg mb-4">
              No problems found matching your criteria.
            </div>
            <Button 
              onClick={() => {
                setFilters({
                  difficulty: 'all',
                  tags: [],
                  solved: 'all',
                  search: '',
                  sortBy: 'name',
                  sortOrder: 'asc'
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
    </div>
  );
};

export default ProblemsPage;
