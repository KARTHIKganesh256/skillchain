import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  Award, 
  GraduationCap, 
  BookOpen,
  Linkedin,
  Mail,
  MapPin,
  CheckCircle,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';

interface Professional {
  id: number;
  name: string;
  title: string;
  image: string;
  designation: string;
  organization: string;
  expertise: string[];
  verified: boolean;
  rating: number;
  students: number;
  location: string;
  email: string;
  linkedin: string;
  achievements: string[];
}

const professionals: Professional[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Senior AI Researcher',
    image: '👩‍🔬',
    designation: 'Professor of Computer Science',
    organization: 'MIT',
    expertise: ['Machine Learning', 'Deep Learning', 'AI Ethics'],
    verified: true,
    rating: 4.9,
    students: 2500,
    location: 'Cambridge, MA',
    email: 'sarah.j@mit.edu',
    linkedin: 'sarah-johnson-mit',
    achievements: ['IEEE Fellow', '2023 AI Innovation Award', '100+ Publications']
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    title: 'Full Stack Architect',
    image: '👨‍💻',
    designation: 'Lead Instructor',
    organization: 'Stanford University',
    expertise: ['React', 'Node.js', 'Cloud Computing', 'System Design'],
    verified: true,
    rating: 4.8,
    students: 3200,
    location: 'Palo Alto, CA',
    email: 'm.chen@stanford.edu',
    linkedin: 'michael-chen-tech',
    achievements: ['Ex-Google Tech Lead', 'Best Instructor 2024', '50K+ Students']
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    title: 'Data Science Expert',
    image: '👩‍💼',
    designation: 'Associate Professor',
    organization: 'Harvard University',
    expertise: ['Data Science', 'Python', 'Statistics', 'ML'],
    verified: true,
    rating: 4.9,
    students: 1800,
    location: 'Boston, MA',
    email: 'e.rodriguez@harvard.edu',
    linkedin: 'emily-rodriguez-data',
    achievements: ['PhD Statistics', 'Nobel Laureate Collaborator', 'Top 10 Data Scientists']
  },
  {
    id: 4,
    name: 'Prof. James Wilson',
    title: 'DevOps & Cloud Specialist',
    image: '👨‍🎓',
    designation: 'Senior Lecturer',
    organization: 'UC Berkeley',
    expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    verified: true,
    rating: 4.7,
    students: 2100,
    location: 'Berkeley, CA',
    email: 'j.wilson@berkeley.edu',
    linkedin: 'james-wilson-cloud',
    achievements: ['AWS Certified', 'Former Amazon SDE', 'Author of "Cloud Mastery"']
  },
  {
    id: 5,
    name: 'Dr. Lisa Anderson',
    title: 'Cybersecurity Expert',
    image: '👩‍💻',
    designation: 'Professor',
    organization: 'Carnegie Mellon',
    expertise: ['Security', 'Penetration Testing', 'Cryptography'],
    verified: true,
    rating: 5.0,
    students: 950,
    location: 'Pittsburgh, PA',
    email: 'l.anderson@cmu.edu',
    linkedin: 'lisa-anderson-cyber',
    achievements: ['BlackHat Speaker', 'Bug Bounty Top Earner', 'Security Hall of Fame']
  },
  {
    id: 6,
    name: 'Prof. David Lee',
    title: 'Mobile Development Guru',
    image: '👨‍🏫',
    designation: 'Course Director',
    organization: 'Udemy & Self-Taught',
    expertise: ['React Native', 'Flutter', 'iOS', 'Android'],
    verified: true,
    rating: 4.8,
    students: 4500,
    location: 'San Francisco, CA',
    email: 'd.lee@mobileapps.com',
    linkedin: 'david-lee-mobile',
    achievements: ['Top 1% Instructor', '5M+ App Downloads', 'App Store Featured']
  },
];

const VerifiedProfessionals: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <UserCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Verified Professionals
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Learn from industry experts, top lecturers, and renowned professors. Get verified credentials and learn from the best in the field.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 mx-auto">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">15K+</h3>
              <p className="text-gray-600 dark:text-gray-400">Total Students</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">100%</h3>
              <p className="text-gray-600 dark:text-gray-400">Verified Instructors</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">4.9</h3>
              <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {professionals.map((prof, index) => (
            <motion.div
              key={prof.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Header with Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl">{prof.image}</div>
                </div>
                {prof.verified && (
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                  </div>
                )}
                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{prof.rating}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {prof.name}
                </h3>
                <p className="text-purple-600 font-semibold mb-2">{prof.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {prof.designation} at {prof.organization}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>{prof.students.toLocaleString()}+ students</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{prof.location.split(',')[0]}</span>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {prof.expertise.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {prof.expertise.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                        +{prof.expertise.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">Notable Achievements</span>
                  </div>
                  <ul className="space-y-1">
                    {prof.achievements.slice(0, 2).map((achievement, idx) => (
                      <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Links */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={`mailto:${prof.email}`}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </a>
                  <a
                    href={`https://linkedin.com/in/${prof.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all">
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-12 text-white">
            <div className="max-w-3xl mx-auto">
              <BookOpen className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Become a Verified Professional</h2>
              <p className="text-xl mb-8 opacity-90">
                Join our elite community of instructors and share your expertise with thousands of learners worldwide.
              </p>
              <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifiedProfessionals;
