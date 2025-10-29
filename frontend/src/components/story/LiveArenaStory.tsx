import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Users, 
  MessageCircle, 
  Heart,
  Send,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share2,
  Star,
  Award,
  Clock,
  TrendingUp,
  Zap,
  Crown,
  Sparkles,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  speaker: {
    name: string;
    title: string;
    avatar: string;
    verified: boolean;
    aura: string;
  };
  category: string;
  startTime: string;
  duration: number;
  maxAttendees: number;
  currentAttendees: number;
  isLive: boolean;
  thumbnail: string;
  inspirationPoints: number;
  tags: string[];
  energyLevel: number;
  storyTheme: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  isSpeaker: boolean;
  reactions: string[];
  aura: string;
}

interface Reaction {
  id: string;
  emoji: string;
  count: number;
  users: string[];
  energy: number;
}

const LiveArenaStory: React.FC = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [attendanceTime, setAttendanceTime] = useState(0);
  const [inspirationPoints, setInspirationPoints] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('live');
  const [energyWaves, setEnergyWaves] = useState<Array<{id: number, x: number, y: number, intensity: number}>>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const attendanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const energyWaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sample live sessions with story themes
  useEffect(() => {
    const sampleSessions: LiveSession[] = [
      {
        id: 'session-1',
        title: 'The Awakening: Mastering React Hooks',
        description: 'Join the journey of a Novice Coder as they discover the ancient art of React Hooks in the Web Valley',
        speaker: {
          name: 'Sarah Chen',
          title: 'Senior React Guardian at Meta',
          avatar: '👩‍💻',
          verified: true,
          aura: 'cyan'
        },
        category: 'Web Valley',
        startTime: new Date().toISOString(),
        duration: 60,
        maxAttendees: 500,
        currentAttendees: 342,
        isLive: true,
        thumbnail: '/images/sessions/react-hooks.jpg',
        inspirationPoints: 50,
        tags: ['React', 'JavaScript', 'Hooks', 'Web Valley'],
        energyLevel: 85,
        storyTheme: 'The ancient scrolls of React reveal their secrets to those who seek mastery in the Web Valley...'
      },
      {
        id: 'session-2',
        title: 'Data Abyss: The Python Oracle Speaks',
        description: 'Dive deep into the Data Abyss with the Python Oracle, learning the mystical arts of data manipulation',
        speaker: {
          name: 'Dr. Michael Rodriguez',
          title: 'Data Sage at Google',
          avatar: '👨‍🔬',
          verified: true,
          aura: 'green'
        },
        category: 'Data Abyss',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        maxAttendees: 1000,
        currentAttendees: 0,
        isLive: false,
        thumbnail: '/images/sessions/python-oracle.jpg',
        inspirationPoints: 75,
        tags: ['Python', 'Data Science', 'Oracle', 'Data Abyss'],
        energyLevel: 0,
        storyTheme: 'In the depths of the Data Abyss, the Python Oracle awaits to share the ancient knowledge of data manipulation...'
      },
      {
        id: 'session-3',
        title: 'AI Mountain: The Neural Network Summit',
        description: 'Climb the treacherous AI Mountain and unlock the secrets of neural networks with the AI Sage',
        speaker: {
          name: 'Alex Thompson',
          title: 'AI Sage at OpenAI',
          avatar: '👨‍🎓',
          verified: true,
          aura: 'purple'
        },
        category: 'AI Mountain',
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        duration: 75,
        maxAttendees: 300,
        currentAttendees: 0,
        isLive: false,
        thumbnail: '/images/sessions/ai-summit.jpg',
        inspirationPoints: 60,
        tags: ['AI', 'Neural Networks', 'Machine Learning', 'AI Mountain'],
        energyLevel: 0,
        storyTheme: 'At the peak of AI Mountain, the Neural Network Summit awaits those brave enough to master the art of artificial intelligence...'
      }
    ];
    setSessions(sampleSessions);
  }, []);

  // Sample chat messages with story elements
  useEffect(() => {
    const sampleMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        userId: 'user-1',
        username: 'CodeWarrior_42',
        message: 'The ancient scrolls are revealing their secrets! This is incredible! 🔥',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isSpeaker: false,
        reactions: ['👍', '❤️', '🔥'],
        aura: 'cyan'
      },
      {
        id: 'msg-2',
        userId: 'speaker',
        username: 'Sarah Chen',
        message: 'Welcome, fellow guardians! The Web Valley welcomes all who seek to master its mysteries. Feel free to ask questions as we forge new links in your SkillChain!',
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        isSpeaker: true,
        reactions: ['👏', '🎉', '⚡'],
        aura: 'cyan'
      },
      {
        id: 'msg-3',
        userId: 'user-2',
        username: 'DataSeeker_99',
        message: 'Can you show us the mystical useState hook again? I want to understand its power!',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        isSpeaker: false,
        reactions: ['🤔'],
        aura: 'green'
      }
    ];
    setChatMessages(sampleMessages);
  }, []);

  // Sample reactions with energy
  useEffect(() => {
    const sampleReactions: Reaction[] = [
      { id: 'r1', emoji: '👍', count: 45, users: [], energy: 0.8 },
      { id: 'r2', emoji: '❤️', count: 32, users: [], energy: 0.9 },
      { id: 'r3', emoji: '👏', count: 28, users: [], energy: 0.7 },
      { id: 'r4', emoji: '🎉', count: 15, users: [], energy: 0.6 },
      { id: 'r5', emoji: '🔥', count: 12, users: [], energy: 1.0 },
      { id: 'r6', emoji: '⚡', count: 8, users: [], energy: 0.9 }
    ];
    setReactions(sampleReactions);
  }, []);

  // Generate energy waves
  useEffect(() => {
    const generateEnergyWaves = () => {
      const newWaves = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        intensity: Math.random() * 0.8 + 0.2
      }));
      setEnergyWaves(prev => [...newWaves, ...prev.slice(0, 10)]);
    };

    if (isWatching && currentSession) {
      energyWaveIntervalRef.current = setInterval(generateEnergyWaves, 2000);
    } else {
      if (energyWaveIntervalRef.current) {
        clearInterval(energyWaveIntervalRef.current);
      }
    }

    return () => {
      if (energyWaveIntervalRef.current) {
        clearInterval(energyWaveIntervalRef.current);
      }
    };
  }, [isWatching, currentSession]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Track attendance time
  useEffect(() => {
    if (isWatching && currentSession) {
      attendanceIntervalRef.current = setInterval(() => {
        setAttendanceTime(prev => prev + 1);
        
        // Award inspiration points every 5 minutes
        if ((attendanceTime + 1) % 300 === 0) {
          const points = Math.floor((attendanceTime + 1) / 300) * 10;
          setInspirationPoints(prev => prev + points);
        }
      }, 1000);
    } else {
      if (attendanceIntervalRef.current) {
        clearInterval(attendanceIntervalRef.current);
      }
    }

    return () => {
      if (attendanceIntervalRef.current) {
        clearInterval(attendanceIntervalRef.current);
      }
    };
  }, [isWatching, currentSession, attendanceTime]);

  const handleJoinSession = (session: LiveSession) => {
    setCurrentSession(session);
    setIsWatching(true);
    setIsConnected(true);
    setAttendanceTime(0);
    setInspirationPoints(0);
  };

  const handleLeaveSession = () => {
    setIsWatching(false);
    setIsConnected(false);
    setCurrentSession(null);
    setAttendanceTime(0);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentSession) {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        userId: 'current-user',
        username: 'SkillGuardian',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isSpeaker: false,
        reactions: [],
        aura: 'purple'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleReaction = (reactionId: string) => {
    setReactions(prev => prev.map(r => 
      r.id === reactionId 
        ? { ...r, count: r.count + 1, users: [...r.users, 'current-user'], energy: Math.min(r.energy + 0.1, 1.0) }
        : r
    ));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredSessions = sessions.filter(session => {
    switch (filter) {
      case 'live':
        return session.isLive;
      case 'upcoming':
        return !session.isLive && new Date(session.startTime) > new Date();
      default:
        return true;
    }
  });

  if (isWatching && currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-cyan-900 text-white relative overflow-hidden">
        {/* Energy Waves Background */}
        <div className="absolute inset-0">
          {energyWaves.map(wave => (
            <motion.div
              key={wave.id}
              className="absolute w-32 h-32 rounded-full opacity-20"
              style={{
                left: `${wave.x}%`,
                top: `${wave.y}%`,
                background: `radial-gradient(circle, rgba(0, 255, 255, ${wave.intensity}) 0%, transparent 70%)`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="flex h-screen relative z-10">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col">
            {/* Video Header */}
            <div className="bg-black/50 backdrop-blur-md p-4 flex items-center justify-between border-b border-cyan-500/30">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLeaveSession}
                  className="text-white hover:bg-cyan-500/20"
                >
                  ← Back to Arena
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-cyan-300">{currentSession.title}</h1>
                  <p className="text-gray-400 text-sm">
                    by {currentSession.speaker.name} • {currentSession.currentAttendees} guardians watching
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-600 text-white animate-pulse">
                  🔴 LIVE
                </Badge>
                <span className="text-sm text-gray-400">
                  {formatTime(attendanceTime)}
                </span>
              </div>
            </div>

            {/* Story Theme Display */}
            <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-4 border-b border-purple-500/30">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-cyan-300 font-medium italic">
                  "{currentSession.storyTheme}"
                </p>
              </motion.div>
            </div>

            {/* Video Player */}
            <div className="flex-1 bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div 
                    className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(0, 255, 255, 0.5)",
                        "0 0 40px rgba(139, 92, 246, 0.8)",
                        "0 0 20px rgba(0, 255, 255, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="w-16 h-16 text-white" />
                  </motion.div>
                  <p className="text-gray-400">The ancient knowledge streams forth...</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-cyan-500/20"
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    className="text-white hover:bg-cyan-500/20"
                  >
                    {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-cyan-500/20"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Energy Reactions Bar */}
            <div className="bg-black/50 backdrop-blur-md p-4 border-t border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-cyan-400 font-medium">Channel Your Energy:</span>
                  {reactions.map(reaction => (
                    <motion.div
                      key={reaction.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(reaction.id)}
                        className="text-white hover:bg-cyan-500/20 relative"
                        style={{
                          filter: `brightness(${0.5 + reaction.energy * 0.5})`
                        }}
                      >
                        <span className="mr-1">{reaction.emoji}</span>
                        <span className="text-xs">{reaction.count}</span>
                        {reaction.energy > 0.8 && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {inspirationPoints} Inspiration Points
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="w-80 bg-black/50 backdrop-blur-md flex flex-col border-l border-cyan-500/30">
            <div className="p-4 border-b border-cyan-500/30">
              <h3 className="font-semibold text-cyan-300">Guardian Chat</h3>
              <p className="text-sm text-gray-400">
                {currentSession.currentAttendees} guardians connected
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(message => (
                <motion.div 
                  key={message.id} 
                  className="flex space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    message.aura === 'cyan' ? 'bg-cyan-500' :
                    message.aura === 'green' ? 'bg-green-500' :
                    message.aura === 'purple' ? 'bg-purple-500' : 'bg-gray-600'
                  }`}>
                    {message.username.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">
                        {message.username}
                      </span>
                      {message.isSpeaker && (
                        <Badge className="bg-cyan-600 text-white text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          Guardian
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{message.message}</p>
                    {message.reactions.length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {message.reactions.map((reaction, index) => (
                          <span key={index} className="text-xs">{reaction}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-cyan-500/30">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Share your thoughts with fellow guardians..."
                  className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-cyan-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                The Motivational Arena
              </h1>
              <p className="text-gray-300 mt-2">
                Join live sessions with the greatest guardians and channel your energy into inspiration!
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                {inspirationPoints} Points
              </div>
              <div className="text-sm text-gray-400">
                Inspiration Energy
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Live Sessions</p>
                    <p className="text-2xl font-bold text-white">
                      {sessions.filter(s => s.isLive).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Upcoming</p>
                    <p className="text-2xl font-bold text-white">
                      {sessions.filter(s => !s.isLive && new Date(s.startTime) > new Date()).length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Total Guardians</p>
                    <p className="text-2xl font-bold text-white">
                      {sessions.reduce((sum, s) => sum + s.currentAttendees, 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4 bg-black/30 backdrop-blur-md border-cyan-500/30">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                {[
                  { id: 'all', label: 'All Sessions' },
                  { id: 'live', label: 'Live Now' },
                  { id: 'upcoming', label: 'Upcoming' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      filter === tab.id
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sessions Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-black/30 backdrop-blur-md group cursor-pointer border-cyan-500/20 hover:border-cyan-400/50"
                    onClick={() => handleJoinSession(session)}>
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    {/* Energy Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                    
                    <div className="text-center relative z-10">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mb-2 mx-auto"
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(0, 255, 255, 0.3)",
                            "0 0 40px rgba(139, 92, 246, 0.6)",
                            "0 0 20px rgba(0, 255, 255, 0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Play className="w-8 h-8 text-white" />
                      </motion.div>
                      <p className="text-sm text-cyan-300">The knowledge streams forth...</p>
                    </div>
                  </div>
                  
                  {session.isLive && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-600 text-white animate-pulse">
                        🔴 LIVE
                      </Badge>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-black/50 text-white border-white/50">
                      {session.currentAttendees}/{session.maxAttendees}
                    </Badge>
                  </div>

                  {/* Energy Level Indicator */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <div className="flex-1 bg-gray-700 rounded-full h-1">
                        <div 
                          className="h-1 rounded-full bg-gradient-to-r from-orange-400 to-red-500"
                          style={{ width: `${session.energyLevel}%` }}
                        />
                      </div>
                      <span className="text-xs text-white">{session.energyLevel}%</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1 text-lg">
                        {session.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                        {session.description}
                      </p>
                    </div>
                  </div>

                  {/* Speaker Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      session.speaker.aura === 'cyan' ? 'bg-cyan-500' :
                      session.speaker.aura === 'green' ? 'bg-green-500' :
                      session.speaker.aura === 'purple' ? 'bg-purple-500' : 'bg-gray-600'
                    }`}>
                      {session.speaker.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">
                          {session.speaker.name}
                        </span>
                        {session.speaker.verified && (
                          <Badge className="bg-cyan-600 text-white text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Guardian
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {session.speaker.title}
                      </p>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">
                        {session.duration} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Inspiration Points</span>
                      <span className="text-yellow-400 font-medium">
                        +{session.inspirationPoints}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Realm</span>
                      <span className="text-cyan-400 font-medium">
                        {session.category}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {session.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Join Button */}
                  <Button
                    onClick={() => handleJoinSession(session)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                    disabled={!session.isLive && new Date(session.startTime) > new Date()}
                  >
                    {session.isLive ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Join Live Session
                      </>
                    ) : new Date(session.startTime) > new Date() ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Starting Soon
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4 mr-2" />
                        View Recording
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LiveArenaStory;

