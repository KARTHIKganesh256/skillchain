import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, BookOpen, Crown, Star, Zap, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.tsx';

const AIAssistantPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [isProUser, setIsProUser] = useState(false);
  const [hasAISubscription, setHasAISubscription] = useState(false);

  const handleUpgradeToBasic = async () => {
    try {
      // Simulate payment processing
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: 'basic',
          price: 299,
          features: ['Advanced AI Analysis', 'Custom Learning Paths', 'Priority Support', 'Unlimited AI Queries']
        })
      });
      
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        alert('Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleUpgradeToPremium = async () => {
    try {
      // Simulate payment processing
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: 'premium',
          price: 499,
          features: ['Everything in Basic Pro', '1-on-1 Expert Mentoring', 'Advanced Analytics Dashboard', 'Exclusive Skill Challenges', 'Certificate Generation']
        })
      });
      
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        alert('Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleStartFreeTrial = () => {
    // Redirect to trial signup or show trial modal
    alert('Starting your 7-day free trial! You will be redirected to the signup page.');
    // window.location.href = '/trial-signup';
  };

  const handleLearnMore = () => {
    // Show detailed feature comparison or redirect to features page
    alert('Learn more about SkillPro features! Redirecting to features page.');
    // window.location.href = '/features/skillpro';
  };

  const handleSubscribeToAI = async () => {
    try {
      // Simulate payment processing for monthly subscription
      const response = await fetch('/api/payment/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: 'ai-assistant',
          price: 99,
          billing: 'monthly',
          features: ['AI Assistant Access', 'Unlimited AI Queries', 'Basic Learning Recommendations']
        })
      });
      
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        alert('Subscription processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription processing failed. Please try again.');
    }
  };

  const askAI = async () => {
    setLoading(true);
    setAnswer(null);
    try {
      const response = await fetch('http://localhost:8000/api/learning/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error asking AI:', error);
      setAnswer('Sorry, I could not process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/recommendations/1');
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([
        { skill: 'TypeScript', reason: 'Builds on your JavaScript knowledge' },
        { skill: 'Next.js', reason: 'Popular React framework' },
        { skill: 'GraphQL', reason: 'Modern API technology' }
      ]);
    }
  };

  const generateLearningPath = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/learning/path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: 'JavaScript', current_level: 3, goal_level: 7 })
      });
      const data = await response.json();
      setLearningPath(data.steps || []);
    } catch (error) {
      console.error('Error generating learning path:', error);
      setLearningPath([
        { level: 3, title: 'JavaScript Level 3', description: 'Master JavaScript concepts at level 3', resources: ['Online course for JavaScript level 3', 'Practice exercises for JavaScript'] },
        { level: 4, title: 'JavaScript Level 4', description: 'Master JavaScript concepts at level 4', resources: ['Online course for JavaScript level 4', 'Practice exercises for JavaScript'] },
        { level: 5, title: 'JavaScript Level 5', description: 'Master JavaScript concepts at level 5', resources: ['Online course for JavaScript level 5', 'Practice exercises for JavaScript'] }
      ]);
    }
  };

  const generateQuiz = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/learning/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: 'JavaScript', level: 'beginner' })
      });
      const data = await response.json();
      setQuiz(data.questions || []);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setQuiz([
        {
          question: 'What is the difference between let and var?',
          options: [
            'let has block scope, var has function scope',
            'var has block scope, let has function scope',
            'They are identical',
            'let is deprecated'
          ],
          correct: 0,
          explanation: 'let has block scope while var has function scope'
        },
        {
          question: 'What does \'this\' refer to in JavaScript?',
          options: [
            'The current function',
            'The current object',
            'The global object',
            'It depends on how the function is called'
          ],
          correct: 3,
          explanation: 'The value of \'this\' depends on how the function is called'
        }
      ]);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    generateLearningPath();
    generateQuiz();
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
            AI Learning Assistant
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get personalized learning guidance from our AI-powered assistant.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* AI Chat Interface */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <span>Ask AI Assistant</span>
              </CardTitle>
              <CardDescription>
                Get instant answers to your learning questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about skills, learning, or career development..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />
              {!hasAISubscription ? (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">AI Assistant Subscription Required</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Subscribe to access AI Assistant features</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSubscribeToAI}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2"
                  >
                    Subscribe for $99/month
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={askAI}
                  disabled={loading || !question}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Ask AI
                    </>
                  )}
                </Button>
              )}

              {answer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <p className="text-gray-700 dark:text-gray-300">{answer}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* SkillPro Block */}
          {(!isProUser || !hasAISubscription) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-orange-900/20 backdrop-blur-sm overflow-hidden">
                {/* Premium Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  PRO
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-2xl">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      SkillPro Features
                    </span>
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Unlock advanced AI capabilities and premium learning tools
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                      <Zap className="w-6 h-6 text-yellow-500 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Advanced AI Analysis</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Deep skill assessment and personalized recommendations</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Priority Support</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">24/7 expert assistance and faster response times</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                      <Target className="w-6 h-6 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Custom Learning Paths</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">AI-generated personalized curriculum and milestones</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-500 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Unlimited AI Queries</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">No limits on AI assistant interactions and analysis</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Tiers */}
                  <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
                    <h3 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
                      Choose Your Plan
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* AI Assistant Monthly Subscription */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800"
                      >
                        <div className="text-center">
                          <h4 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">AI Assistant</h4>
                          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">$99<span className="text-lg text-gray-500">/month</span></div>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">Access AI Assistant features</p>
                          
                          <ul className="space-y-3 text-left mb-6">
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">AI Assistant Access</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Unlimited AI Queries</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Basic Learning Recommendations</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Monthly Billing</span>
                            </li>
                          </ul>
                          
                          <Button 
                            onClick={handleSubscribeToAI}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3"
                          >
                            Subscribe Monthly
                          </Button>
                        </div>
                      </motion.div>

                      {/* Basic Pro Plan */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800"
                      >
                        <div className="text-center">
                          <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">SkillPro Basic</h4>
                          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">$299</div>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for individual learners</p>
                          
                          <ul className="space-y-3 text-left mb-6">
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Advanced AI Analysis</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Custom Learning Paths</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Priority Support</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Unlimited AI Queries</span>
                            </li>
                          </ul>
                          
                          <Button 
                            onClick={handleUpgradeToBasic}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3"
                          >
                            Upgrade to Basic Pro
                          </Button>
                        </div>
                      </motion.div>

                      {/* Premium Pro Plan */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-400 dark:border-yellow-600"
                      >
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                            MOST POPULAR
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h4 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">SkillPro Premium</h4>
                          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">$499</div>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">For serious skill developers</p>
                          
                          <ul className="space-y-3 text-left mb-6">
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Everything in Basic Pro</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">1-on-1 Expert Mentoring</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Advanced Analytics Dashboard</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Exclusive Skill Challenges</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm">Certificate Generation</span>
                            </li>
                          </ul>
                          
                          <Button 
                            onClick={handleUpgradeToPremium}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3"
                          >
                            Upgrade to Premium Pro
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Ready to Accelerate Your Learning?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Join thousands of professionals who have upgraded their skills with AI Assistant and SkillPro
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={handleStartFreeTrial}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-8 py-3"
                      >
                        Start Free Trial
                      </Button>
                      <Button 
                        onClick={handleLearnMore}
                        variant="outline" 
                        className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-3"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recommendations */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>Personalized Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(recommendations || []).map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{rec.skill}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rec.reason}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Path */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-blue-600" />
                <span>Learning Path (JavaScript)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(learningPath || []).map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Level {step.level}: {step.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{step.description}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {(step.resources || []).map((res: string, i: number) => (
                        <li key={i}>{res}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quiz */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-orange-600" />
                <span>Quiz (JavaScript Beginner)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(quiz || []).map((q, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Q{index + 1}: {q.question}
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mb-3 space-y-1">
                      {(q.options || []).map((option: string, i: number) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <p>Correct Answer Index: {q.correct}</p>
                      <p>Explanation: {q.explanation}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;