import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Star, TrendingUp, Users } from 'lucide-react';

const Skills: React.FC = () => {
  const skills = [
    {
      id: '1',
      name: 'Python',
      description: 'Python programming language',
      category: 'Programming',
      difficulty: 5,
      marketValue: 75000,
      demandScore: 0.85
    },
    {
      id: '2',
      name: 'JavaScript',
      description: 'JavaScript programming language',
      category: 'Programming',
      difficulty: 4,
      marketValue: 65000,
      demandScore: 0.90
    },
    {
      id: '3',
      name: 'React',
      description: 'React JavaScript library',
      category: 'Frontend',
      difficulty: 6,
      marketValue: 70000,
      demandScore: 0.88
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills</h1>
          <p className="text-gray-600">Discover and learn new skills with AI-powered recommendations</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Brain className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                    <p className="text-sm text-gray-500">{skill.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < skill.difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{skill.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Market Value</span>
                  <span className="text-sm font-medium text-green-600">
                    ${skill.marketValue.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Demand Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${skill.demandScore * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(skill.demandScore * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Difficulty</span>
                  <span className="text-sm font-medium">{skill.difficulty}/10</span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="btn-primary flex-1">Learn</button>
                <button className="btn-outline">View Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;

