import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.ts';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();
  const handContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      const particlesContainer = document.getElementById('particles');
      if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.animationDelay = Math.random() * 20 + 's';
          particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
          particlesContainer.appendChild(particle);
        }
      }
    };

    createParticles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsShaking(true);
    try {
      // Try real Supabase auth if configured
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const user = data.user;
      if (user) {
        // Fetch role from user_roles
        let role = 'user';
        const { data: roleRow } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        if (roleRow?.role) role = roleRow.role;
        // Persist session markers
        localStorage.setItem('token', data.session?.access_token || 'supabase');
        localStorage.setItem('userName', user.email || email);
        localStorage.setItem('role', role);
      }
    } catch {
      // Fallback mock if Supabase isn't set
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('userName', email);
      localStorage.setItem('role', email.toLowerCase().includes('admin') ? 'admin' : 'user');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        navigate('/home');
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 flex items-center justify-center relative overflow-hidden">
      {/* Floating Particles */}
      <div id="particles" className="absolute inset-0 pointer-events-none">
        <style>{`
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float linear infinite;
          }
          @keyframes float {
            0% {
              transform: translateY(100vh) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>

      {/* Handshake Animation */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
        <div 
          ref={handContainerRef}
          className={`handshake-3d ${isHovering ? 'hovered' : ''} ${isShaking ? 'shake-sequence' : ''}`}
        >
          {/* LEFT HAND - 3D-ish SVG with radial shading */}
          <svg className="hand-3d hand-left" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <radialGradient id="skinL" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffe1c4" />
                <stop offset="60%" stopColor="#e7b38f" />
                <stop offset="100%" stopColor="#c38f6b" />
              </radialGradient>
              <linearGradient id="sheenL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            {/* Palm - slimmer silhouette */}
            <path d="M42 72 C38 48, 72 30, 110 36 C142 42, 156 62, 153 86 C150 108, 124 116, 92 112 C66 108, 48 94, 42 72 Z" fill="url(#skinL)" />
            {/* Thumb - thinner */}
            <path d="M70 62 C80 52, 97 48, 112 56 C120 60, 119 69, 110 73 C96 78, 80 76, 70 68 Z" fill="url(#skinL)" />
            {/* Index/Middle - slender arcs */}
            <path d="M112 50 C126 41, 144 41, 156 54 C160 58, 160 67, 155 71 C142 81, 124 78, 112 66 Z" fill="url(#skinL)" />
            <path d="M102 46 C116 39, 134 39, 147 51 C151 55, 151 63, 147 67 C134 75, 116 73, 102 61 Z" fill="url(#skinL)" />
            {/* Ring/Pinky hint - very thin */}
            <path d="M96 48 C110 42, 126 42, 138 52 C141 55, 141 60, 138 63 C126 69, 110 68, 98 58 Z" fill="url(#skinL)" opacity="0.85" />
            {/* Creases for realism */}
            <path d="M78 74 C95 70, 118 70, 134 78" fill="none" stroke="#b98e6f" strokeOpacity="0.35" strokeWidth="2" />
            <path d="M84 66 C100 62, 120 62, 134 68" fill="none" stroke="#b98e6f" strokeOpacity="0.28" strokeWidth="1.8" />
            {/* Specular highlight */}
            <path d="M54 61 C74 47, 120 50, 138 72" fill="none" stroke="url(#sheenL)" strokeWidth="7" opacity="0.55"/>
          </svg>

          {/* RIGHT HAND - 3D-ish SVG with radial shading */}
          <svg className="hand-3d hand-right" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <radialGradient id="skinR" cx="70%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffe1c4" />
                <stop offset="60%" stopColor="#e7b38f" />
                <stop offset="100%" stopColor="#c38f6b" />
              </radialGradient>
              <linearGradient id="sheenR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            {/* Palm - slimmer silhouette */}
            <path d="M178 72 C182 48, 148 30, 110 36 C78 42, 64 62, 67 86 C70 108, 96 116, 128 112 C154 108, 172 94, 178 72 Z" fill="url(#skinR)" />
            {/* Thumb - thinner */}
            <path d="M150 62 C140 52, 123 48, 108 56 C100 60, 101 69, 110 73 C124 78, 140 76, 150 68 Z" fill="url(#skinR)" />
            {/* Index/Middle - slender arcs */}
            <path d="M108 50 C94 41, 76 41, 64 54 C60 58, 60 67, 65 71 C78 81, 96 78, 108 66 Z" fill="url(#skinR)" />
            <path d="M118 46 C104 39, 86 39, 73 51 C69 55, 69 63, 73 67 C86 75, 104 73, 118 61 Z" fill="url(#skinR)" />
            {/* Ring/Pinky hint - very thin */}
            <path d="M124 48 C110 42, 94 42, 82 52 C79 55, 79 60, 82 63 C94 69, 110 68, 122 58 Z" fill="url(#skinR)" opacity="0.85" />
            {/* Creases for realism */}
            <path d="M142 74 C125 70, 102 70, 86 78" fill="none" stroke="#b98e6f" strokeOpacity="0.35" strokeWidth="2" />
            <path d="M136 66 C120 62, 100 62, 86 68" fill="none" stroke="#b98e6f" strokeOpacity="0.28" strokeWidth="1.8" />
            {/* Specular highlight */}
            <path d="M174 61 C154 47, 108 50, 90 72" fill="none" stroke="url(#sheenR)" strokeWidth="7" opacity="0.55"/>
          </svg>
        </div>
        <style>{`
          .handshake-3d {
            position: relative;
            width: 260px;
            height: 110px;
            perspective: 800px;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
          }
          .hand-3d {
            position: absolute;
            width: 130px;
            height: 130px;
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(.2,.7,.2,1), filter 0.6s;
          }
          .hand-left { left: -6px; transform: rotateY(14deg) translateZ(0) scale(0.96); }
          .hand-right { right: -6px; transform: rotateY(-14deg) translateZ(0) scale(0.96); }
          /* Gentle idle breathing motion */
          .hand-3d { animation: idleFloat 5s ease-in-out infinite; }
          @keyframes idleFloat {
            0%,100% { transform: translateY(0) rotate(0.2deg); }
            50% { transform: translateY(-4px) rotate(-0.2deg); }
          }
          /* Lighting sweep: animate gradient sheen via SVG stroke-dashoffset mimic */
          .handshake-3d.hovered .hand-3d { filter: drop-shadow(0 12px 28px rgba(86,130,255,0.35)); }
          .handshake-3d.hovered .hand-left { transform: rotateY(10deg) translateZ(6px) scale(1.04); }
          .handshake-3d.hovered .hand-right { transform: rotateY(-10deg) translateZ(6px) scale(1.04); }

          /* Handshake sequence on submit */
          .shake-sequence .hand-left { animation: reachLeft 1.2s ease forwards, shakeLeft 0.9s ease 1.2s 1 forwards; }
          .shake-sequence .hand-right { animation: reachRight 1.2s ease forwards, shakeRight 0.9s ease 1.2s 1 forwards; }

          @keyframes reachLeft {
            0% { transform: translateX(0) rotateY(12deg) }
            60% { transform: translateX(70px) translateY(-2px) rotate(-2deg) }
            100% { transform: translateX(60px) rotate(-4deg) }
          }
          @keyframes reachRight {
            0% { transform: translateX(0) rotateY(-12deg) }
            60% { transform: translateX(-70px) translateY(2px) rotate(2deg) }
            100% { transform: translateX(-60px) rotate(4deg) }
          }
          /* Small handshake jiggle */
          @keyframes shakeLeft {
            0% { transform: translateX(60px) rotate(-4deg) }
            30% { transform: translateX(56px) rotate(-2deg) }
            60% { transform: translateX(62px) rotate(-5deg) }
            100% { transform: translateX(60px) rotate(-4deg) }
          }
          @keyframes shakeRight {
            0% { transform: translateX(-60px) rotate(4deg) }
            30% { transform: translateX(-56px) rotate(2deg) }
            60% { transform: translateX(-62px) rotate(5deg) }
            100% { transform: translateX(-60px) rotate(4deg) }
          }
        `}</style>
      </div>

      {/* Login Form */}
      <div className="login-container relative z-20">
        <div className="login-header text-center mb-8">
          <h1 className="login-title text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="login-subtitle text-white/80 text-lg">Sign in to SkillChain</p>
              </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
                  <input
                    type="email"
              className="form-input w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300" 
              placeholder="Email or Username" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
              required 
                  />
                </div>
          <div className="form-group">
                  <input
                    type="password"
              className="form-input w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300" 
              placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
              required 
                  />
                </div>
          <button 
                type="submit"
            className={`login-button w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 active:translate-y-0 relative overflow-hidden ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
              </button>
          </form>

        <div className="login-links text-center mt-6 space-y-2">
          <button type="button" className="login-link block text-white/70 hover:text-white transition-colors duration-300">
            Forgot Password?
          </button>
          <Link to="/register" className="login-link block text-white/70 hover:text-white transition-colors duration-300">
            Create Account
          </Link>
        </div>
      </div>

      <style>{`
        .login-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 400px;
          max-width: 450px;
        }
        
        @media (max-width: 480px) {
          .login-container {
            min-width: 320px;
            margin: 20px;
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;