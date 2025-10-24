import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark,
  Mic,
  MicOff,
  Send,
  Brain,
  Zap,
  Star,
  Clock,
  User,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface Reel {
  id: string;
  title: string;
  description: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  skill: string;
  difficulty: string;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  isLiked: boolean;
  isBookmarked: boolean;
  skillcoins: number;
  tags: string[];
  createdAt: string;
}

interface AIResponse {
  answer: string;
  confidence: number;
  relatedQuestions: string[];
  learningResources: Array<{
    title: string;
    type: string;
    url: string;
  }>;
  nextSteps: string[];
}

const Reels: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockReels: Reel[] = [
      {
        id: '1',
        title: 'Python List Comprehensions Explained',
        description: 'Learn how to write elegant Python code with list comprehensions',
        creator: {
          id: '1',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          verified: true
        },
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
        duration: 120,
        skill: 'Python',
        difficulty: 'Intermediate',
        likes: 1250,
        comments: 89,
        shares: 45,
        bookmarks: 234,
        isLiked: false,
        isBookmarked: false,
        skillcoins: 50,
        tags: ['python', 'programming', 'tutorial'],
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'React Hooks Deep Dive',
        description: 'Master React hooks with practical examples',
        creator: {
          id: '2',
          name: 'Mike Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          verified: true
        },
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop',
        duration: 180,
        skill: 'React',
        difficulty: 'Advanced',
        likes: 2100,
        comments: 156,
        shares: 78,
        bookmarks: 456,
        isLiked: true,
        isBookmarked: true,
        skillcoins: 75,
        tags: ['react', 'javascript', 'frontend'],
        createdAt: '2024-01-14'
      }
    ];
    
    setReels(mockReels);
  }, []);

  const currentReel = reels[currentIndex];

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleLike = async (reelId: string) => {
    // In production, call API to like/unlike
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { 
            ...reel, 
            isLiked: !reel.isLiked,
            likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1
          }
        : reel
    ));
  };

  const handleBookmark = async (reelId: string) => {
    // In production, call API to bookmark/unbookmark
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { 
            ...reel, 
            isBookmarked: !reel.isBookmarked,
            bookmarks: reel.isBookmarked ? reel.bookmarks - 1 : reel.bookmarks + 1
          }
        : reel
    ));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Process audio with AI
        await processVoiceQuestion(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceQuestion = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // In production, send audio to AI API
      // Mock response for now
      setTimeout(() => {
        setAiResponse({
          answer: "List comprehensions in Python are a concise way to create lists. They follow the syntax [expression for item in iterable if condition]. This allows you to write more readable and efficient code compared to traditional for loops.",
          confidence: 0.92,
          relatedQuestions: [
            "What are the benefits of using list comprehensions?",
            "How do I handle exceptions in list comprehensions?",
            "Can I use list comprehensions with nested loops?"
          ],
          learningResources: [
            {
              title: "Python List Comprehensions Tutorial",
              type: "tutorial",
              url: "/tutorials/python-list-comprehensions"
            },
            {
              title: "Advanced Python Patterns",
              type: "course",
              url: "/courses/advanced-python"
            }
          ],
          nextSteps: [
            "Practice with simple list comprehensions",
            "Try nested list comprehensions",
            "Explore generator expressions"
          ]
        });
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Error processing voice question:', error);
      setIsProcessing(false);
    }
  };

  const handleTextQuestion = async () => {
    if (!question.trim()) return;
    
    setIsProcessing(true);
    try {
      // In production, send text question to AI API
      setTimeout(() => {
        setAiResponse({
          answer: "Great question! " + question + " Let me explain this concept in detail...",
          confidence: 0.88,
          relatedQuestions: [
            "How does this relate to other Python concepts?",
            "What are common mistakes to avoid?",
            "Can you show me a practical example?"
          ],
          learningResources: [
            {
              title: "Python Best Practices",
              type: "guide",
              url: "/guides/python-best-practices"
            }
          ],
          nextSteps: [
            "Practice with hands-on exercises",
            "Join a Python study group",
            "Build a project using this concept"
          ]
        });
        setIsProcessing(false);
        setQuestion('');
      }, 1500);
    } catch (error) {
      console.error('Error processing text question:', error);
      setIsProcessing(false);
    }
  };

  if (!currentReel) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading reels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Video Section */}
        <div className="flex-1 relative">
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={currentReel.thumbnailUrl}
              onEnded={handleNext}
              onClick={handlePlayPause}
            >
              <source src={currentReel.videoUrl} type="video/mp4" />
            </video>

            {/* Video Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="bg-black/50 px-3 py-1 rounded-full text-sm">
                    {currentReel.skill}
                  </span>
                  <span className="bg-black/50 px-3 py-1 rounded-full text-sm">
                    {currentReel.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-black/50 px-3 py-1 rounded-full text-sm flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    {currentReel.skillcoins} SC
                  </span>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-20">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">{currentReel.title}</h2>
                  <p className="text-gray-300 text-sm mb-2">{currentReel.description}</p>
                  
                  {/* Creator Info */}
                  <div className="flex items-center space-x-2 mb-3">
                    <img
                      src={currentReel.creator.avatar}
                      alt={currentReel.creator.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-sm">{currentReel.creator.name}</span>
                        {currentReel.creator.verified && (
                          <Star className="w-4 h-4 text-blue-500 fill-current" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{currentReel.likes} likes</span>
                        <span>{currentReel.comments} comments</span>
                        <span>{currentReel.shares} shares</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {currentReel.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white/20 px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-4"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-900 flex flex-col">
          {/* AI Q&A Section */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">AI Learning Assistant</h3>
            </div>

            {/* Voice Recording */}
            <div className="mb-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Ask with Voice</span>
                  </>
                )}
              </button>
            </div>

            {/* Text Question */}
            <div className="space-y-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about this skill..."
                className="w-full p-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 resize-none"
                rows={3}
              />
              <button
                onClick={handleTextQuestion}
                disabled={!question.trim() || isProcessing}
                className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isProcessing ? 'Processing...' : 'Ask Question'}</span>
              </button>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex-1 overflow-y-auto p-4">
            {isProcessing && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-400">AI is thinking...</p>
              </div>
            )}

            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-400">AI Answer</span>
                    <span className="text-xs text-gray-400">
                      {Math.round(aiResponse.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">{aiResponse.answer}</p>
                </div>

                {aiResponse.relatedQuestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Related Questions:</h4>
                    <div className="space-y-1">
                      {aiResponse.relatedQuestions.map((q, index) => (
                        <button
                          key={index}
                          onClick={() => setQuestion(q)}
                          className="w-full text-left text-xs text-blue-400 hover:text-blue-300 p-2 bg-gray-800 rounded hover:bg-gray-700"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {aiResponse.learningResources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Learning Resources:</h4>
                    <div className="space-y-1">
                      {aiResponse.learningResources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          className="block text-xs text-green-400 hover:text-green-300 p-2 bg-gray-800 rounded hover:bg-gray-700"
                        >
                          {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {aiResponse.nextSteps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Next Steps:</h4>
                    <div className="space-y-1">
                      {aiResponse.nextSteps.map((step, index) => (
                        <div key={index} className="text-xs text-gray-400 flex items-start space-x-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLike(currentReel.id)}
                className={`flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${
                  currentReel.isLiked
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${currentReel.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{currentReel.likes}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center justify-center space-x-2 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{currentReel.comments}</span>
              </button>

              <button className="flex items-center justify-center space-x-2 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
                <Share className="w-4 h-4" />
                <span className="text-sm">{currentReel.shares}</span>
              </button>

              <button
                onClick={() => handleBookmark(currentReel.id)}
                className={`flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${
                  currentReel.isBookmarked
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${currentReel.isBookmarked ? 'fill-current' : ''}`} />
                <span className="text-sm">{currentReel.bookmarks}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 bg-white/20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <div className="flex space-x-1">
          {reels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex === reels.length - 1}
          className="p-2 bg-white/20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Reels;

