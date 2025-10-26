import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Building2, 
  BookOpen, 
  Award, 
  Phone, 
  MapPin, 
  Mail,
  Edit,
  CheckCircle,
  Clock,
  TrendingUp,
  Code,
  Target,
  Trophy,
  GraduationCap
} from 'lucide-react';

interface UserProfile {
  college: string;
  department: string;
  course: string;
  year: string;
  rollNumber: string;
  phone: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [skillsToLearn, setSkillsToLearn] = useState<any[]>([]);
  const [skillsCanDo, setSkillsCanDo] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Load profile data from localStorage
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      setUser(JSON.parse(profileData));
    } else {
      // Redirect to profile setup if not completed
      navigate('/profile-setup');
    }

    // Fetch skills and tasks from backend
    fetchSkills();
    fetchTasks();
  }, [navigate]);

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills');
      const data = await response.json();
      
      // Mock data for now - in real app, this would come from backend based on user's department
      const allSkills = data.skills || [];
      
      // Filter skills based on user's department
      // For now, showing some sample skills
      setSkillsToLearn([
        { id: 1, name: 'Machine Learning', level: 'Intermediate', progress: 60 },
        { id: 2, name: 'Deep Learning', level: 'Advanced', progress: 30 },
        { id: 3, name: 'Computer Vision', level: 'Intermediate', progress: 45 }
      ]);

      setSkillsCanDo([
        { id: 1, name: 'Python', level: 8, verified: true },
        { id: 2, name: 'JavaScript', level: 7, verified: true },
        { id: 3, name: 'React', level: 6, verified: false },
        { id: 4, name: 'Node.js', level: 5, verified: true }
      ]);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      // Mock tasks - in real app, this would come from backend
      setTasks([
        {
          id: 1,
          title: 'Complete Python Data Structures Course',
          type: 'course',
          difficulty: 'Intermediate',
          progress: 75,
          dueDate: '2025-11-10',
          reward: 200
        },
        {
          id: 2,
          title: 'Build a REST API with Node.js',
          type: 'project',
          difficulty: 'Advanced',
          progress: 40,
          dueDate: '2025-11-15',
          reward: 350
        },
        {
          id: 3,
          title: 'Complete ML Model Deployment',
          type: 'certification',
          difficulty: 'Expert',
          progress: 20,
          dueDate: '2025-11-20',
          reward: 500
        }
      ]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your skills, tasks, and learning progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {localStorage.getItem('userName') || 'Student'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.rollNumber}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Building2 className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold">College</p>
                    <p className="text-sm">{user.college}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <GraduationCap className="w-5 h-5 mr-3 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold">Department</p>
                    <p className="text-sm">{user.department}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Award className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold">Course & Year</p>
                    <p className="text-sm">{user.course} - {user.year}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-red-600" />
                  <p className="text-sm">{user.phone}</p>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-yellow-600" />
                  <p className="text-sm break-all">{localStorage.getItem('userEmail') || ''}</p>
                </div>

                <div className="flex items-start text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-blue-600 mt-1" />
                  <p className="text-sm">{user.address}</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/profile-setup')}
                className="w-full mt-6 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Your Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Skills Learned</span>
                  <span className="text-xl font-bold text-blue-600">{skillsCanDo.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Skills Learning</span>
                  <span className="text-xl font-bold text-purple-600">{skillsToLearn.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
                  <span className="text-xl font-bold text-green-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Current Level</span>
                  <span className="text-xl font-bold text-orange-600">Level 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Skills and Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills I Can Do */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <Code className="w-6 h-6 mr-2 text-blue-600" />
                  Skills I Can Do
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Add Skill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillsCanDo.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {skill.name}
                      </span>
                      {skill.verified && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Level {skill.level}
                      </span>
                      <div className="flex items-center text-yellow-600">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{skill.level}/10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills I'm Learning */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                  Skills I'm Learning
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Explore More
                </button>
              </div>

              <div className="space-y-4">
                {skillsToLearn.map((skill) => (
                  <div key={skill.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {skill.name}
                      </span>
                      <span className="text-sm text-blue-600 font-medium">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {skill.progress}% Complete
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-red-600" />
                  My Tasks
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {task.type} • {task.difficulty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          +{task.reward} SC
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>{task.progress}% Complete</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Due: {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
