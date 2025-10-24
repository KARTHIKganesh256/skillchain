import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Users, 
  Zap, 
  Target, 
  TrendingUp, 
  Globe,
  Play,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths with AI assistance and voice interaction',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Skill Exchange',
      description: 'Connect with experts and learners worldwide to exchange knowledge',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'SkillCoins Economy',
      description: 'Earn and spend SkillCoins for learning and teaching opportunities',
      color: 'text-yellow-600'
    },
    {
      icon: Target,
      title: 'Smart Value Calculator',
      description: 'AI calculates the market value of your skills in real-time',
      color: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'SkillGraph Network',
      description: 'Visualize your skill network and discover learning connections',
      color: 'text-indigo-600'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Join a worldwide community of learners and teachers',
      color: 'text-pink-600'
    }
  ];

  const stats = [
    { label: 'Active Learners', value: '50K+', icon: Users },
    { label: 'Skills Available', value: '500+', icon: Brain },
    { label: 'SkillCoins Earned', value: '1M+', icon: Zap },
    { label: 'Countries', value: '120+', icon: Globe }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Data Scientist',
      content: 'SkillChain helped me transition from marketing to data science. The AI recommendations were spot-on!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Software Engineer',
      content: 'I earned 10,000 SkillCoins teaching Python. The platform makes it easy to monetize your expertise.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emily Johnson',
      role: 'UX Designer',
      content: 'The SkillGraph visualization helped me understand my learning path and connect with the right mentors.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              The AI-Powered{' '}
              <span className="gradient-text">Skill Ecosystem</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Learn, teach, and exchange skills using SkillCoins. Get AI-powered recommendations, 
              connect with experts, and build your skill network.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                to="/login"
                className="btn-outline text-lg px-8 py-3 rounded-full hover:bg-primary-50 transition-all duration-300"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Skill Development
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to learn, teach, and monetize your skills in one platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:shadow-medium transition-all duration-300 group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-primary-100 transition-colors duration-300">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How SkillChain Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and begin your skill development journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Set up your profile, add your skills, and define your learning goals.',
                icon: Users
              },
              {
                step: '02',
                title: 'Discover & Learn',
                description: 'Get AI-powered recommendations and connect with expert teachers.',
                icon: Brain
              },
              {
                step: '03',
                title: 'Earn & Teach',
                description: 'Monetize your expertise by teaching others and earning SkillCoins.',
                icon: Zap
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of learners who are already building their skills with SkillChain.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Skill Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join SkillChain today and unlock your potential with AI-powered learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-accent text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/skills"
                className="btn-outline text-lg px-8 py-3 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                Explore Skills
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

