import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Users, Award } from 'lucide-react';

const Learning: React.FC = () => {
  const sessions = [
    {
      id: '1',
      title: 'Python Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      duration: '2 hours',
      participants: 45,
      skill: 'Python',
      status: 'scheduled',
      scheduledAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      instructor: 'Mike Chen',
      duration: '3 hours',
      participants: 32,
      skill: 'React',
      status: 'live',
      scheduledAt: '2024-01-20T14:00:00Z'
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Sessions</h1>
          <p className="text-gray-600">Join live sessions and learn from experts</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{session.title}</h3>
                  <p className="text-gray-600">by {session.instructor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  session.status === 'live' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {session.status === 'live' ? 'Live Now' : 'Scheduled'}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{session.participants} participants</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Skill:</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    {session.skill}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>{session.status === 'live' ? 'Join Now' : 'Join Session'}</span>
                </button>
                <button className="btn-outline">Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learning;

