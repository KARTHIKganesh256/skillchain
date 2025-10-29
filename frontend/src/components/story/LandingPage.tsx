import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Crown, 
  Star,
  Play,
  ArrowRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '../ui/button.tsx';
import { Card, CardContent } from '../ui/card.tsx';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const LandingPage: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const storyTexts = [
    "In a world once powered by knowledge...",
    "The SkillVerse has shattered into seven realms...",
    "Only through learning and earning can new heroes...",
    "Restore the Core of Innovation...",
    "Your journey begins now, Novice Coder..."
  ];

  // Create particle system
  useEffect(() => {
    const createParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          color: ['#00ffff', '#8b5cf6', '#ffffff'][Math.floor(Math.random() * 3)]
        });
      }
      setParticles(newParticles);
    };

    createParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        opacity: 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + particle.id)
      })));
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateParticles);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Story progression
  useEffect(() => {
    if (showStory && currentStoryIndex < storyTexts.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStoryIndex(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showStory, currentStoryIndex]);

  const handleStartJourney = () => {
    setIsPlaying(true);
    setShowStory(true);
  };

  const handleJoinChain = () => {
    window.location.href = '/register';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-cyan-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Energy Web */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.line
              key={i}
              x1={Math.random() * window.innerWidth}
              y1={Math.random() * window.innerHeight}
              x2={Math.random() * window.innerWidth}
              y2={Math.random() * window.innerHeight}
              stroke="url(#gradient)"
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, delay: i * 0.1 }}
            />
          ))}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Particles */}
        <div className="absolute inset-0">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.opacity
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: particle.id * 0.01
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 0.5 
          }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  "0 0 20px #00ffff",
                  "0 0 40px #8b5cf6",
                  "0 0 20px #00ffff"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-16 h-16 text-white" />
            </motion.div>
            
            {/* Glowing Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SkillChain
            </span>
          </h1>
          <motion.h2
            className="text-2xl md:text-4xl font-semibold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            Forge Your Skills. Rebuild the SkillVerse.
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            Complete challenges. Earn coins. Unlock your destiny.
          </motion.p>
        </motion.div>

        {/* Story Narration */}
        <AnimatePresence>
          {showStory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 max-w-4xl mx-auto"
            >
              <Card className="bg-black/50 backdrop-blur-md border-cyan-500/30">
                <CardContent className="p-6">
                  <motion.div
                    key={currentStoryIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="text-center"
                  >
                    <p className="text-xl text-cyan-300 font-medium">
                      {storyTexts[currentStoryIndex]}
                    </p>
                    <div className="flex justify-center mt-4">
                      <div className="flex space-x-1">
                        {storyTexts.map((_, index) => (
                          <motion.div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index <= currentStoryIndex ? 'bg-cyan-400' : 'bg-gray-600'
                            }`}
                            animate={{
                              scale: index === currentStoryIndex ? 1.2 : 1
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Button
            onClick={handleStartJourney}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-lg px-8 py-4 rounded-full shadow-2xl"
          >
            <Play className="w-6 h-6 mr-2" />
            Start Journey
          </Button>
          <Button
            onClick={handleJoinChain}
            variant="outline"
            size="lg"
            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-lg px-8 py-4 rounded-full shadow-2xl"
          >
            <Shield className="w-6 h-6 mr-2" />
            Join the Chain
          </Button>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            {
              icon: Zap,
              title: "7 Skill Realms",
              description: "Master each realm to unlock new powers"
            },
            {
              icon: Crown,
              title: "Become a Guardian",
              description: "Rise through ranks and guide others"
            },
            {
              icon: Star,
              title: "Real Rewards",
              description: "Earn coins, gifts, and exclusive access"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2 + index * 0.1, duration: 0.8 }}
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <Card className="bg-black/30 backdrop-blur-md border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Audio Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
          className="fixed bottom-4 right-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black/50 backdrop-blur-md border-cyan-500/30 hover:bg-cyan-500/20"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-cyan-400"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ArrowRight className="w-6 h-6 rotate-90" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;

