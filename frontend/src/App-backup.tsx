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
  Target,
  BookOpen,
  BarChart3,
  Network,
  Video,
  UserCheck,
  Gavel,
  Sparkles
} from 'lucide-react';

// Import UI Components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';

// Import Pages
import CalculatorPage from './pages/Calculator';
import AIAssistantPage from './pages/AIAssistant';
import SkillGraphPage from './pages/SkillGraph';

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

  const navItems = [
    { name: 'Skills', href: '/skills', icon: BookOpen },
    { name: 'Users', href: '/users', icon: Users },
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
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Get Started
            </Button>
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
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4">
            Start Learning
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4">
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
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchSkills();
  }, []);

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

        {/* Add Skill Form */}
        <Card className="mb-12 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span>Add New Skill</span>
            </CardTitle>
            <CardDescription>
              Contribute to the skill ecosystem by adding your expertise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Skill Name"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder="Category"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="number"
                placeholder="Level (1-10)"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                min="1"
                max="10"
                className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Button
                onClick={addSkill}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {skills.map((skill, index) => (
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
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Enhanced Users Page
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Community Members
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with skilled professionals and learners from around the world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                        {user.avatar}
                      </div>
                      {user.verified && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{user.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Skills: {(user.skills || []).join(', ')}
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">{user.skillcoins} SC</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};



// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/skillgraph" element={<SkillGraphPage />} />
          {/* Add more routes for other features */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;