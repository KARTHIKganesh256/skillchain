import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Rocket, 
  Target, 
  Users,
  TrendingUp,
  Award,
  Sparkles,
  Send,
  FileText,
  Tag
} from 'lucide-react';

const DreamSeed: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    impact: '',
    targetAudience: '',
    innovationType: '',
    benefits: '',
    tags: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Dream Seed submitted:', formData);
      alert('Your Dream Seed has been planted! 🌱 We\'ll review your innovation idea.');
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        impact: '',
        targetAudience: '',
        innovationType: '',
        benefits: '',
        tags: ''
      });
    } catch (error) {
      console.error('Error submitting dream seed:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Dream Seed
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Plant your innovative ideas and watch them grow into reality. Share your vision with the SkillChain community.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Innovation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Share groundbreaking ideas</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Execution</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Turn ideas into action</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Community</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Collaborate and grow</p>
          </div>
        </div>

        {/* Dream Seed Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lightbulb className="inline w-4 h-4 mr-2" />
                Idea Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Give your idea a catchy title..."
              />
            </div>

            {/* Category and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Tag className="inline w-4 h-4 mr-2" />
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Social Impact">Social Impact</option>
                  <option value="Business">Business</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="innovationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Rocket className="inline w-4 h-4 mr-2" />
                  Innovation Type
                </label>
                <select
                  id="innovationType"
                  name="innovationType"
                  required
                  value={formData.innovationType}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Type</option>
                  <option value="Product Innovation">Product Innovation</option>
                  <option value="Service Innovation">Service Innovation</option>
                  <option value="Process Improvement">Process Improvement</option>
                  <option value="Technology Breakthrough">Technology Breakthrough</option>
                  <option value="Social Innovation">Social Innovation</option>
                  <option value="Business Model">Business Model</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="inline w-4 h-4 mr-2" />
                Detailed Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your innovative idea in detail..."
              />
            </div>

            {/* Impact */}
            <div>
              <label htmlFor="impact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <TrendingUp className="inline w-4 h-4 mr-2" />
                Expected Impact
              </label>
              <textarea
                id="impact"
                name="impact"
                required
                rows={3}
                value={formData.impact}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="What positive impact will this idea have?"
              />
            </div>

            {/* Target Audience and Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="inline w-4 h-4 mr-2" />
                  Target Audience
                </label>
                <input
                  id="targetAudience"
                  name="targetAudience"
                  type="text"
                  required
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Who will benefit from this?"
                />
              </div>
              <div>
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Award className="inline w-4 h-4 mr-2" />
                  Key Benefits
                </label>
                <input
                  id="benefits"
                  name="benefits"
                  type="text"
                  required
                  value={formData.benefits}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Main benefits or advantages"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="inline w-4 h-4 mr-2" />
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="innovation, tech, sustainability, etc."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Plant Your Dream Seed 🌱</span>
              </button>
            </div>
          </form>
        </div>

        {/* Inspiration Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">💡 Tips for Great Ideas</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Be clear and specific about your vision</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Explain the problem you're solving</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Highlight the unique value proposition</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Consider scalability and sustainability</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Think about the potential for collaboration</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DreamSeed;
