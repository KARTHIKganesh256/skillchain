import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.tsx';

const AIAssistantPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any[]>([]);

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