import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, User, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">SkillChain</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/skills" className="text-gray-600 hover:text-gray-900">
              Skills
            </Link>
            <Link to="/learning" className="text-gray-600 hover:text-gray-900">
              Learning
            </Link>
            <Link to="/reels" className="text-gray-600 hover:text-gray-900">
              Reels
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">2,500 SC</span>
              </div>
              <button className="p-2 bg-gray-100 rounded-full">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

