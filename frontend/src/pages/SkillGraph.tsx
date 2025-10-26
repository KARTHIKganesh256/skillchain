import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, TrendingUp, Users, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Badge } from '../components/ui/badge.tsx';

const SkillGraphPage: React.FC = () => {
  const [skillGraph, setSkillGraph] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetchSkillGraph();
  }, []);

  const fetchSkillGraph = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/skillgraph/data');
      const data = await response.json();
      setSkillGraph(data);
    } catch (error) {
      console.error('Error fetching skill graph:', error);
      // Mock data for demonstration
      setSkillGraph({
        nodes: [
          { id: 'javascript', name: 'JavaScript', level: 8, category: 'Programming' },
          { id: 'react', name: 'React', level: 7, category: 'Frontend' },
          { id: 'nodejs', name: 'Node.js', level: 6, category: 'Backend' },
          { id: 'python', name: 'Python', level: 5, category: 'Programming' },
          { id: 'sql', name: 'SQL', level: 6, category: 'Database' },
          { id: 'aws', name: 'AWS', level: 4, category: 'Cloud' }
        ],
        connections: [
          { from: 'javascript', to: 'react', strength: 0.9 },
          { from: 'javascript', to: 'nodejs', strength: 0.8 },
          { from: 'nodejs', to: 'sql', strength: 0.7 },
          { from: 'python', to: 'sql', strength: 0.6 },
          { from: 'nodejs', to: 'aws', strength: 0.5 }
        ],
        insights: {
          strongest_skill: 'JavaScript',
          growth_potential: ['React', 'AWS'],
          skill_gaps: ['Machine Learning', 'DevOps']
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getSkillColor = (level: number) => {
    if (level >= 8) return 'text-green-600 bg-green-100';
    if (level >= 6) return 'text-blue-600 bg-blue-100';
    if (level >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Programming': 'bg-purple-100 text-purple-800',
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Database': 'bg-orange-100 text-orange-800',
      'Cloud': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your skill network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Skill Network
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Visualize your skills and their connections to discover growth opportunities.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Skill Network Visualization */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="w-6 h-6 text-indigo-600" />
                <span>Skill Network Graph</span>
              </CardTitle>
              <CardDescription>
                Interactive visualization of your skill ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skillGraph?.nodes?.map((skill: any, index: number) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{skill.name}</h4>
                      <Badge className={getSkillColor(skill.level)}>
                        Level {skill.level}
                      </Badge>
                    </div>
                    <Badge className={`text-xs ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </Badge>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${(skill.level / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Connections */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>Skill Connections</span>
              </CardTitle>
              <CardDescription>
                How your skills relate to each other
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGraph?.connections?.map((connection: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {connection.from} → {connection.to}
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          {Math.round(connection.strength * 100)}% related
                        </Badge>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${connection.strength * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <span>Strongest Skill</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {skillGraph?.insights?.strongest_skill}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your most developed skill
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <span>Growth Potential</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(skillGraph?.insights?.growth_potential || []).map((skill: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 mr-2 mb-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span>Skill Gaps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(skillGraph?.insights?.skill_gaps || []).map((skill: string, index: number) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800 mr-2 mb-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGraphPage;