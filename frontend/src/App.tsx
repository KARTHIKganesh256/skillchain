import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Calculator, 
  Users, 
  MapPin, 
  Mic, 
  Award, 
  TrendingUp,
  ChevronRight,
  Play,
  CheckCircle,
  DollarSign,
  BookOpen,
  BarChart3,
  Network,
  Video,
  UserCheck,
  Gavel,
  Sparkles,
  Search,
  User,
  MessageSquare,
  Send,
  ThumbsUp,
  Clock
} from 'lucide-react';

// Import UI Components
import { Button } from './components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.tsx';
import { Badge } from './components/ui/badge.tsx';
import { Progress } from './components/ui/progress.tsx';

// Import Pages
import CalculatorPage from './pages/Calculator.tsx';
import AIAssistantPage from './pages/AIAssistant.tsx';
import SkillGraphPage from './pages/SkillGraph.tsx';
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import ProfileSetup from './pages/auth/ProfileSetup.tsx';
import Profile from './pages/Profile.tsx';
import Dashboard from './pages/Dashboard.tsx';
import DreamSeed from './pages/DreamSeed.tsx';
import VerifiedProfessionals from './pages/VerifiedProfessionals.tsx';

// Mock Data
const mockSkills = [
  { id: 1, name: 'JavaScript', category: 'Programming', value: 100, level: 8, trending: true },
  { id: 2, name: 'Python', category: 'Programming', value: 95, level: 7, trending: true },
  { id: 3, name: 'React', category: 'Frontend', value: 90, level: 6, trending: false },
  { id: 4, name: 'Node.js', category: 'Backend', value: 85, level: 5, trending: true },
  { id: 5, name: 'TypeScript', category: 'Programming', value: 88, level: 6, trending: true },
  { id: 6, name: 'Vue.js', category: 'Frontend', value: 75, level: 4, trending: false },
  { id: 7, name: 'Docker', category: 'DevOps', value: 80, level: 5, trending: true },
  { id: 8, name: 'AWS', category: 'Cloud', value: 92, level: 7, trending: true }
];

const mockUsers = [
  { id: 1, name: 'John Doe', skills: ['JavaScript', 'React'], skillcoins: 150, avatar: '👨‍💻', verified: true },
  { id: 2, name: 'Jane Smith', skills: ['Python', 'Node.js'], skillcoins: 200, avatar: '👩‍💻', verified: true },
  { id: 3, name: 'Mike Johnson', skills: ['TypeScript', 'Vue.js'], skillcoins: 180, avatar: '👨‍🎓', verified: false },
  { id: 4, name: 'Sarah Wilson', skills: ['Docker', 'AWS'], skillcoins: 220, avatar: '👩‍🔬', verified: true }
];

// Enhanced Navigation Component
const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in by checking localStorage for token
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    setIsLoggedIn(!!token || !!userName);
  }, []);

  const navItems = [
    { name: 'Skills', href: '/skills', icon: BookOpen },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Verified Pros', href: '/verified-professionals', icon: UserCheck },
    { name: 'Dream Seed', href: '/dreamseed', icon: Sparkles },
    { name: 'Calculator', href: '/calculator', icon: Calculator },
    { name: 'AI Assistant', href: '/ai-assistant', icon: Brain },
    { name: 'SkillGraph', href: '/skillgraph', icon: Network },
    { name: 'Reels', href: '/reels', icon: Video },
    { name: 'Portfolios', href: '/portfolios', icon: UserCheck },
    { name: 'Recommendations', href: '/recommendations', icon: TrendingUp },
    { name: 'TimeToken', href: '/timetoken', icon: DollarSign },
    { name: 'Gamification', href: '/gamification', icon: Award },
    { name: 'SkillMap', href: '/skillmap', icon: MapPin },
    { name: 'Voice Bot', href: '/voice-bot', icon: Mic },
    { name: 'Disputes', href: '/disputes', icon: Gavel }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillChain
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.slice(0, 6).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
            {isLoggedIn ? (
              <Link to="/profile">
                <Button 
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Button>
              </Link>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => window.location.href = '/login'}
                >
                  Login
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => window.location.href = '/register'}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Enhanced Hero Section
const HeroSection: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Animated Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
    </div>

    <div className="relative z-10 container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Skill Ecosystem</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            SkillChain
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          The future of skill development is here. Learn, teach, and exchange skills with AI-powered insights, 
          blockchain-secured transactions, and a global community of learners.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
            onClick={() => window.location.href = '/register'}
          >
            Start Learning
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => window.location.href = '/skills'}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Brain, title: "AI Learning", description: "Smart recommendations & voice Q&A" },
            { icon: DollarSign, title: "SkillCoins", description: "Earn & exchange skills" },
            { icon: BarChart3, title: "SkillGraph", description: "Visualize your progress" }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);


// Enhanced Skills Page
const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState(mockSkills);
  const [filteredSkills, setFilteredSkills] = useState(mockSkills);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(1);

  const addSkill = async () => {
    if (newSkillName && newSkillCategory) {
      try {
        const response = await fetch('http://localhost:5000/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newSkillName, category: newSkillCategory, level: newSkillLevel })
        });
        const data = await response.json();
        setSkills([...skills, data]);
        setNewSkillName('');
        setNewSkillCategory('');
        setNewSkillLevel(1);
      } catch (error) {
        console.error('Error adding skill:', error);
      }
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/skills');
        const data = await response.json();
        setSkills(data.skills || mockSkills);
        setFilteredSkills(data.skills || mockSkills);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchSkills();
  }, []);

  // Filter skills based on search query and category
  useEffect(() => {
    let filtered = skills;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSkills(filtered);
  }, [searchQuery, selectedCategory, skills]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skills Ecosystem
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover, learn, and master skills in our comprehensive ecosystem powered by AI insights.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <Card className="mb-12 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Categories</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Content Writing">Content Writing</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Photography">Photography</option>
                  <option value="Music Production">Music Production</option>
                </select>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search All Skills
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredSkills.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No skills found matching your search.</p>
              </div>
            ) : (
              filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50 dark:group-hover:from-gray-800 dark:group-hover:to-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{skill.name}</h3>
                      {skill.trending && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Category: {skill.category}</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Level {skill.level}</span>
                          <span>{skill.level * 10}%</span>
                        </div>
                        <Progress value={skill.level * 10} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {skill.value} SC
                        </span>
                        <Badge variant="outline">SkillCoins</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Enhanced Users Page with Q&A
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [doubts, setDoubts] = useState([
    {
      id: 1,
      title: 'How to optimize React performance?',
      description: 'I\'m working on a large React application and it\'s getting slow. What are the best practices for optimization?',
      author: 'John Doe',
      authorAvatar: '👨‍💻',
      category: 'React',
      answers: 3,
      likes: 12,
      time: '2 hours ago',
      verifiedAnswer: {
        author: 'Prof. Michael Chen',
        authorAvatar: '👨‍💻',
        text: 'Great question! Here are the key optimization techniques: 1) Use React.memo for expensive components, 2) Implement code splitting with React.lazy, 3) Optimize images and use CDN, 4) Use useMemo and useCallback wisely...',
        time: '1 hour ago',
        verified: true
      }
    },
    {
      id: 2,
      title: 'Best way to learn Machine Learning?',
      description: 'I have a background in programming but I\'m new to ML. Where should I start?',
      author: 'Sarah Wilson',
      authorAvatar: '👩‍🔬',
      category: 'Machine Learning',
      answers: 5,
      likes: 18,
      time: '5 hours ago',
      verifiedAnswer: {
        author: 'Dr. Sarah Johnson',
        authorAvatar: '👩‍🔬',
        text: 'Start with Python basics, then dive into scikit-learn for fundamentals. Next, learn TensorFlow or PyTorch for deep learning. Practice with Kaggle competitions. I recommend starting with linear regression and moving to neural networks gradually.',
        time: '4 hours ago',
        verified: true
      }
    },
    {
      id: 3,
      title: 'Docker vs Kubernetes - when to use what?',
      description: 'I understand Docker is for containers but when do you actually need Kubernetes?',
      author: 'Mike Johnson',
      authorAvatar: '👨‍🎓',
      category: 'DevOps',
      answers: 2,
      likes: 8,
      time: '1 day ago',
      verifiedAnswer: {
        author: 'Prof. James Wilson',
        authorAvatar: '👨‍🎓',
        text: 'Docker is great for single containers and development. Kubernetes is for orchestration when you need to manage multiple containers, scaling, load balancing, and high availability in production environments.',
        time: '20 hours ago',
        verified: true
      }
    }
  ]);
  const [newDoubt, setNewDoubt] = useState({ title: '', description: '', category: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data.users || mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handlePostDoubt = () => {
    if (newDoubt.title && newDoubt.description) {
      const doubt = {
        id: doubts.length + 1,
        ...newDoubt,
        author: localStorage.getItem('userName') || 'Anonymous',
        authorAvatar: '👤',
        answers: 0,
        likes: 0,
        time: 'just now',
        verifiedAnswer: null
      };
      setDoubts([doubt, ...doubts]);
      setNewDoubt({ title: '', description: '', category: '' });
      alert('Your doubt has been posted! Professors will answer soon.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Community & Q&A
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with professionals, ask questions, and get expert answers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Community Members</h3>
            <div className="grid grid-cols-1 gap-4">
              {users.slice(0, 4).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                          {user.avatar}
                        </div>
                        {user.verified && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">{user.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.skillcoins} SC</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content - Q&A */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Your Doubt */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                  <span>Post Your Doubt</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your question title..."
                  value={newDoubt.title}
                  onChange={(e) => setNewDoubt({ ...newDoubt, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  placeholder="Describe your doubt in detail..."
                  value={newDoubt.description}
                  onChange={(e) => setNewDoubt({ ...newDoubt, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={newDoubt.category}
                  onChange={(e) => setNewDoubt({ ...newDoubt, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  <option value="React">React</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Other">Other</option>
                </select>
                <Button
                  onClick={handlePostDoubt}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Doubt
                </Button>
              </CardContent>
            </Card>

            {/* Doubts List */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recent Questions</h3>
            <div className="space-y-4">
              {doubts.map((doubt, index) => (
                <motion.div
                  key={doubt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
                            {doubt.authorAvatar}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">{doubt.author}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{doubt.time}</span>
                            </div>
                          </div>
                        </div>
                        <Badge>{doubt.category}</Badge>
                      </div>
                      
                      <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{doubt.title}</h5>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{doubt.description}</p>

                      {doubt.verifiedAnswer && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                          <div className="flex items-start space-x-3 mb-2">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm">
                              {doubt.verifiedAnswer.authorAvatar}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-purple-700 dark:text-purple-300">{doubt.verifiedAnswer.author}</span>
                                {doubt.verifiedAnswer.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{doubt.verifiedAnswer.time}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{doubt.verifiedAnswer.text}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">{doubt.answers} answers</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{doubt.likes} likes</span>
                          </button>
                        </div>
                        <Button variant="outline" size="sm">
                          View All Answers
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/verified-professionals" element={<VerifiedProfessionals />} />
          <Route path="/dreamseed" element={<DreamSeed />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/skillgraph" element={<SkillGraphPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes for other features */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;