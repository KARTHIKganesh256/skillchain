import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.tsx';

const CalculatorPage: React.FC = () => {
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(5);
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateValue = async () => {
    setLoading(true);
    setCalculatedValue(null);
    try {
      const response = await fetch(`http://localhost:8000/api/skills/calculate?skill=${skillName}&level=${skillLevel}`);
      const data = await response.json();
      setCalculatedValue(data.estimated_value);
    } catch (error) {
      console.error('Error calculating skill value:', error);
      setCalculatedValue(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Skill Value Calculator
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the market value of your skills with AI-powered insights and real-time market data.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                <span>Calculate Your Skill Value</span>
              </CardTitle>
              <CardDescription>
                Get instant market insights for your skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g., JavaScript, Python, React"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Skill Level: {skillLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>

              <Button
                onClick={calculateValue}
                disabled={loading || !skillName}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Value
                  </>
                )}
              </Button>

              {calculatedValue !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Estimated Value for {skillName} (Level {skillLevel})
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {calculatedValue === 0 ? 'Error' : `${calculatedValue.toLocaleString()} SC`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      SkillCoins (SC) - Our blockchain-based currency
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;