import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Code, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Copy,
  Download,
  RefreshCw,
  Calendar,
  User,
  Trophy,
  Target,
  BarChart3,
  Zap,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Terminal,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface Submission {
  id: string;
  problemCode: string;
  problemName: string;
  language: string;
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error' | 'memory_limit_exceeded';
  verdict: string;
  executionTime: number;
  memoryUsed: number;
  submittedAt: string;
  contest: string;
  score: number;
  maxScore: number;
  testCases: {
    passed: number;
    total: number;
    details: {
      input: string;
      expectedOutput: string;
      actualOutput: string;
      status: 'passed' | 'failed' | 'error';
      executionTime: number;
      memoryUsed: number;
    }[];
  };
  code: string;
  isPublic: boolean;
  author: string;
  authorRating: number;
  authorDivision: string;
}

interface FilterState {
  status: string;
  language: string;
  problem: string;
  contest: string;
  dateRange: string;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const SubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    language: 'all',
    problem: '',
    contest: 'all',
    dateRange: 'all',
    search: '',
    sortBy: 'submittedAt',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    wrongAnswer: 0,
    timeLimitExceeded: 0,
    runtimeError: 0,
    compilationError: 0
  });

  // Sample submissions data
  useEffect(() => {
    const sampleSubmissions: Submission[] = [
      {
        id: 'sub-1',
        problemCode: 'SUM2',
        problemName: 'Sum of Two Numbers',
        language: 'cpp',
        status: 'accepted',
        verdict: 'Accepted',
        executionTime: 125,
        memoryUsed: 1024,
        submittedAt: new Date().toISOString(),
        contest: 'Practice',
        score: 100,
        maxScore: 100,
        testCases: {
          passed: 5,
          total: 5,
          details: [
            {
              input: '5\n1 2 3 4 5',
              expectedOutput: '15',
              actualOutput: '15',
              status: 'passed',
              executionTime: 25,
              memoryUsed: 200
            },
            {
              input: '3\n10 20 30',
              expectedOutput: '60',
              actualOutput: '60',
              status: 'passed',
              executionTime: 30,
              memoryUsed: 250
            }
          ]
        },
        code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    int sum = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        sum += x;
    }
    cout << sum << endl;
    return 0;
}`,
        isPublic: true,
        author: 'tourist',
        authorRating: 3850,
        authorDivision: 'div1'
      },
      {
        id: 'sub-2',
        problemCode: 'BSTOPS',
        problemName: 'Binary Search Tree Operations',
        language: 'java',
        status: 'wrong_answer',
        verdict: 'Wrong Answer',
        executionTime: 250,
        memoryUsed: 2048,
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        contest: 'Practice',
        score: 0,
        maxScore: 200,
        testCases: {
          passed: 2,
          total: 5,
          details: [
            {
              input: '5\n1 2 3 4 5',
              expectedOutput: '15',
              actualOutput: '14',
              status: 'failed',
              executionTime: 50,
              memoryUsed: 400
            }
          ]
        },
        code: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        System.out.println(sum - 1); // Bug: subtracting 1
        sc.close();
    }
}`,
        isPublic: true,
        author: 'petr',
        authorRating: 3720,
        authorDivision: 'div1'
      },
      {
        id: 'sub-3',
        problemCode: 'DPCHALL',
        problemName: 'Dynamic Programming Challenge',
        language: 'python',
        status: 'time_limit_exceeded',
        verdict: 'Time Limit Exceeded',
        executionTime: 3000,
        memoryUsed: 5120,
        submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        contest: 'Practice',
        score: 0,
        maxScore: 500,
        testCases: {
          passed: 0,
          total: 5,
          details: []
        },
        code: `n = int(input())
arr = list(map(int, input().split()))

# Inefficient O(n^3) solution
result = 0
for i in range(n):
    for j in range(i, n):
        for k in range(i, j+1):
            result += arr[k]

print(result)`,
        isPublic: true,
        author: 'ecnerwala',
        authorRating: 3650,
        authorDivision: 'div1'
      },
      {
        id: 'sub-4',
        problemCode: 'GRAPHPATH',
        problemName: 'Graph Shortest Path',
        language: 'cpp',
        status: 'runtime_error',
        verdict: 'Runtime Error',
        executionTime: 0,
        memoryUsed: 0,
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        contest: 'Practice',
        score: 0,
        maxScore: 300,
        testCases: {
          passed: 0,
          total: 5,
          details: []
        },
        code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<int> adj[n+1]; // Wrong: should be vector<vector<int>>
    
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
    }
    
    // Rest of the code...
    return 0;
}`,
        isPublic: true,
        author: 'neal',
        authorRating: 3580,
        authorDivision: 'div1'
      },
      {
        id: 'sub-5',
        problemCode: 'STRMANIP',
        problemName: 'String Manipulation',
        language: 'javascript',
        status: 'compilation_error',
        verdict: 'Compilation Error',
        executionTime: 0,
        memoryUsed: 0,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        contest: 'Practice',
        score: 0,
        maxScore: 150,
        testCases: {
          passed: 0,
          total: 5,
          details: []
        },
        code: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    // Missing closing brace
    console.log(line.length);
});`,
        isPublic: true,
        author: 'kefaa',
        authorRating: 3420,
        authorDivision: 'div1'
      }
    ];

    setSubmissions(sampleSubmissions);
    setFilteredSubmissions(sampleSubmissions);

    // Calculate stats
    const submissionStats = {
      total: sampleSubmissions.length,
      accepted: sampleSubmissions.filter(s => s.status === 'accepted').length,
      wrongAnswer: sampleSubmissions.filter(s => s.status === 'wrong_answer').length,
      timeLimitExceeded: sampleSubmissions.filter(s => s.status === 'time_limit_exceeded').length,
      runtimeError: sampleSubmissions.filter(s => s.status === 'runtime_error').length,
      compilationError: sampleSubmissions.filter(s => s.status === 'compilation_error').length
    };
    setStats(submissionStats);
  }, []);

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(submission =>
        submission.problemName.toLowerCase().includes(filters.search.toLowerCase()) ||
        submission.problemCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        submission.author.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(submission => submission.status === filters.status);
    }

    // Language filter
    if (filters.language !== 'all') {
      filtered = filtered.filter(submission => submission.language === filters.language);
    }

    // Contest filter
    if (filters.contest !== 'all') {
      filtered = filtered.filter(submission => submission.contest === filters.contest);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'submittedAt':
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
          break;
        case 'executionTime':
          aValue = a.executionTime;
          bValue = b.executionTime;
          break;
        case 'memoryUsed':
          aValue = a.memoryUsed;
          bValue = b.memoryUsed;
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        default:
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredSubmissions(filtered);
  }, [submissions, filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      wrong_answer: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      time_limit_exceeded: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      runtime_error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      compilation_error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      memory_limit_exceeded: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      running: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
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
      case 'memory_limit_exceeded':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLanguageColor = (language: string) => {
    const colors = {
      cpp: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      java: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      python: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      c: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      go: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      rust: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[language as keyof typeof colors] || colors.cpp;
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.accepted}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Accepted</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.wrongAnswer}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Wrong Answer</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.timeLimitExceeded}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">TLE</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.runtimeError}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Runtime Error</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.compilationError}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Compilation Error</div>
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
                  placeholder="Search submissions by problem, author, or code..."
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
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Status</option>
                        <option value="accepted">Accepted</option>
                        <option value="wrong_answer">Wrong Answer</option>
                        <option value="time_limit_exceeded">Time Limit Exceeded</option>
                        <option value="runtime_error">Runtime Error</option>
                        <option value="compilation_error">Compilation Error</option>
                        <option value="memory_limit_exceeded">Memory Limit Exceeded</option>
                      </select>
                    </div>

                    {/* Language Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={filters.language}
                        onChange={(e) => handleFilterChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Languages</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="c">C</option>
                        <option value="javascript">JavaScript</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                      </select>
                    </div>

                    {/* Contest Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contest
                      </label>
                      <select
                        value={filters.contest}
                        onChange={(e) => handleFilterChange('contest', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All Contests</option>
                        <option value="Practice">Practice</option>
                        <option value="Starters">Starters</option>
                        <option value="Lunchtime">Lunchtime</option>
                        <option value="Cook-Off">Cook-Off</option>
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
                        <option value="submittedAt">Submission Time</option>
                        <option value="executionTime">Execution Time</option>
                        <option value="memoryUsed">Memory Used</option>
                        <option value="score">Score</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
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
                          {getStatusIcon(submission.status)}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {submission.problemName}
                          </h3>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {submission.problemCode}
                        </Badge>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.verdict}
                        </Badge>
                        <Badge className={getLanguageColor(submission.language)}>
                          {submission.language.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(submission.submittedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4" />
                          <span>{submission.executionTime}ms</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="w-4 h-4" />
                          <span>{submission.memoryUsed}KB</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{submission.score}/{submission.maxScore}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Author: {submission.author} ({submission.authorRating})</span>
                        <span>Contest: {submission.contest}</span>
                        <span>Test Cases: {submission.testCases.passed}/{submission.testCases.total}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowCode(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Code
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {/* Test Cases Progress */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Test Cases
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {submission.testCases.passed}/{submission.testCases.total} passed
                      </span>
                    </div>
                    <Progress 
                      value={(submission.testCases.passed / submission.testCases.total) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSubmissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-lg mb-4">
              No submissions found matching your criteria.
            </div>
            <Button 
              onClick={() => {
                setFilters({
                  status: 'all',
                  language: 'all',
                  problem: '',
                  contest: 'all',
                  dateRange: 'all',
                  search: '',
                  sortBy: 'submittedAt',
                  sortOrder: 'desc'
                });
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Code Modal */}
      <AnimatePresence>
        {showCode && selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCode(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedSubmission.problemName} - {selectedSubmission.problemCode}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCode(false)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Language: {selectedSubmission.language.toUpperCase()}</span>
                  <span>Status: {selectedSubmission.verdict}</span>
                  <span>Time: {selectedSubmission.executionTime}ms</span>
                  <span>Memory: {selectedSubmission.memoryUsed}KB</span>
                </div>
              </div>
              <div className="p-6 overflow-auto max-h-96">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                  {selectedSubmission.code}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubmissionsPage;
