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
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface LiveArenaProps {
  userProgress: any;
  onInspirationPointsUpdate: (points: number) => void;
}

interface LiveSession {
  id: string;
  title: string;
  description: string;
  speaker: {
    name: string;
    title: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
  startTime: string;
  duration: number; // in minutes
  maxAttendees: number;
  currentAttendees: number;
  isLive: boolean;
  thumbnail: string;
  inspirationPoints: number;
  tags: string[];
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  isSpeaker: boolean;
  reactions: string[];
}

interface Reaction {
  id: string;
  emoji: string;
  count: number;
  users: string[];
}

const LiveArena: React.FC<LiveArenaProps> = ({
  userProgress,
  onInspirationPointsUpdate
}) => {
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
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const attendanceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sample live sessions data
  useEffect(() => {
    const sampleSessions: LiveSession[] = [
      {
        id: 'session-1',
        title: 'Mastering React Hooks in 2024',
        description: 'Learn advanced React patterns and best practices for modern development',
        speaker: {
          name: 'Sarah Chen',
          title: 'Senior React Developer at Meta',
          avatar: '👩‍💻',
          verified: true
        },
        category: 'Frontend Development',
        startTime: new Date().toISOString(),
        duration: 60,
        maxAttendees: 500,
        currentAttendees: 342,
        isLive: true,
        thumbnail: '/images/sessions/react-hooks.jpg',
        inspirationPoints: 50,
        tags: ['React', 'JavaScript', 'Hooks']
      },
      {
        id: 'session-2',
        title: 'AI and Machine Learning Career Path',
        description: 'Discover how to build a successful career in AI and ML',
        speaker: {
          name: 'Dr. Michael Rodriguez',
          title: 'AI Research Director at Google',
          avatar: '👨‍🔬',
          verified: true
        },
        category: 'Artificial Intelligence',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        maxAttendees: 1000,
        currentAttendees: 0,
        isLive: false,
        thumbnail: '/images/sessions/ai-career.jpg',
        inspirationPoints: 75,
        tags: ['AI', 'Machine Learning', 'Career']
      },
      {
        id: 'session-3',
        title: 'Building Scalable Backend Systems',
        description: 'Architecture patterns for high-performance backend systems',
        speaker: {
          name: 'Alex Thompson',
          title: 'Principal Engineer at Netflix',
          avatar: '👨‍💼',
          verified: true
        },
        category: 'Backend Development',
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        duration: 75,
        maxAttendees: 300,
        currentAttendees: 0,
        isLive: false,
        thumbnail: '/images/sessions/backend-systems.jpg',
        inspirationPoints: 60,
        tags: ['Backend', 'Architecture', 'Scalability']
      }
    ];
    setSessions(sampleSessions);
  }, []);

  // Sample chat messages
  useEffect(() => {
    const sampleMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        userId: 'user-1',
        username: 'John Doe',
        message: 'Great explanation! This is really helpful',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isSpeaker: false,
        reactions: ['👍', '❤️']
      },
      {
        id: 'msg-2',
        userId: 'speaker',
        username: 'Sarah Chen',
        message: 'Thanks! Feel free to ask questions anytime',
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        isSpeaker: true,
        reactions: ['👏', '🎉']
      },
      {
        id: 'msg-3',
        userId: 'user-2',
        username: 'Jane Smith',
        message: 'Can you show us the custom hook example again?',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        isSpeaker: false,
        reactions: []
      }
    ];
    setChatMessages(sampleMessages);
  }, []);

  // Sample reactions
  useEffect(() => {
    const sampleReactions: Reaction[] = [
      { id: 'r1', emoji: '👍', count: 45, users: [] },
      { id: 'r2', emoji: '❤️', count: 32, users: [] },
      { id: 'r3', emoji: '👏', count: 28, users: [] },
      { id: 'r4', emoji: '🎉', count: 15, users: [] },
      { id: 'r5', emoji: '🔥', count: 12, users: [] }
    ];
    setReactions(sampleReactions);
  }, []);

  // Auto-scroll chat to bottom
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
          onInspirationPointsUpdate(points);
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
  }, [isWatching, currentSession, attendanceTime, onInspirationPointsUpdate]);

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
        username: userProgress.name || 'Anonymous',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isSpeaker: false,
        reactions: []
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleReaction = (reactionId: string) => {
    setReactions(prev => prev.map(r => 
      r.id === reactionId 
        ? { ...r, count: r.count + 1, users: [...r.users, 'current-user'] }
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
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex h-screen">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col">
            {/* Video Header */}
            <div className="bg-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLeaveSession}
                  className="text-white hover:bg-gray-700"
                >
                  ← Back
                </Button>
                <div>
                  <h1 className="text-xl font-bold">{currentSession.title}</h1>
                  <p className="text-gray-400 text-sm">
                    by {currentSession.speaker.name} • {currentSession.currentAttendees} watching
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-600 text-white">
                  🔴 LIVE
                </Badge>
                <span className="text-sm text-gray-400">
                  {formatTime(attendanceTime)}
                </span>
              </div>
            </div>

            {/* Video Player */}
            <div className="flex-1 bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-gray-400">Live stream will start shortly...</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-gray-700"
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    className="text-white hover:bg-gray-700"
                  >
                    {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-gray-700"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Reactions Bar */}
            <div className="bg-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">Quick Reactions:</span>
                  {reactions.map(reaction => (
                    <Button
                      key={reaction.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(reaction.id)}
                      className="text-white hover:bg-gray-700"
                    >
                      <span className="mr-1">{reaction.emoji}</span>
                      <span className="text-xs">{reaction.count}</span>
                    </Button>
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
          <div className="w-80 bg-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Live Chat</h3>
              <p className="text-sm text-gray-400">
                {currentSession.currentAttendees} participants
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(message => (
                <div key={message.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                    {message.username.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">
                        {message.username}
                      </span>
                      {message.isSpeaker && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          Speaker
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
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Live Arena
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Join live sessions with industry experts and earn inspiration points!
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userProgress.inspirationPoints || 0} Points
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Inspiration Points
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Live Now</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {sessions.filter(s => s.isLive).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {sessions.filter(s => !s.isLive && new Date(s.startTime) > new Date()).length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Attendees</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {sessions.reduce((sum, s) => sum + s.currentAttendees, 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-yellow-600" />
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
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
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
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
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
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <Play className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Live Stream</p>
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
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {session.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {session.description}
                      </p>
                    </div>
                  </div>

                  {/* Speaker Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-lg">
                      {session.speaker.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {session.speaker.name}
                        </span>
                        {session.speaker.verified && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {session.speaker.title}
                      </p>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Duration</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {session.duration} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Inspiration Points</span>
                      <span className="text-yellow-600 font-medium">
                        +{session.inspirationPoints}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Start Time</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {new Date(session.startTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {session.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Join Button */}
                  <Button
                    onClick={() => handleJoinSession(session)}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    disabled={!session.isLive && new Date(session.startTime) > new Date()}
                  >
                    {session.isLive ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Join Live
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

export default LiveArena;
