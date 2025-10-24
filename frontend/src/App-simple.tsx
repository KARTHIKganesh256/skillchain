import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            🚀 SkillChain
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            The AI-Powered Skill Ecosystem
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Welcome to SkillChain!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your AI-powered platform for teaching, learning, and exchanging skills using SkillCoins.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold">AI Learning</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Smart recommendations</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold">SkillCoins</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Earn while learning</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold">SkillGraph</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Visualize progress</p>
              </div>
            </div>
            <div className="text-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-3">Smart Value Calculator</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  AI-powered tool to calculate the market value of your skills and suggest optimal pricing.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-3">SkillGraph Visualization</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Interactive network visualization showing skill relationships and learning paths.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-3">AI Learning Mode</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Voice-enabled Q&A system with real-time learning assistance and feedback.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-3">Reels-Based Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Short-form video content for quick skill acquisition and micro-learning.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-3">SkillCoin Economy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Earn and spend SkillCoins for premium features and skill exchanges.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-3">Community Matching</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect with learners and teachers based on skill compatibility and goals.
                </p>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="text-center mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 SkillChain - The AI-Powered Skill Ecosystem
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
