import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  TrendingUp,
  Download,
  Edit,
  Eye,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Zap,
  Award,
  Users,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';
import { 
  JobOpportunity, 
  SmartResume, 
  SkillAnalysis,
  SAMPLE_JOBS,
  generateJobRecommendations,
  generateSkillAnalysis,
  generateSmartResume
} from '../../lib/aiSkillMatch.ts';

interface AISkillMatchProps {
  userProgress: any;
  onResumeUpdate: (resume: SmartResume) => void;
}

const AISkillMatch: React.FC<AISkillMatchProps> = ({
  userProgress,
  onResumeUpdate
}) => {
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<JobOpportunity[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis[]>([]);
  const [smartResume, setSmartResume] = useState<SmartResume | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'resume' | 'analysis'>('jobs');
  const [filter, setFilter] = useState<'all' | 'high-match' | 'remote' | 'internship'>('high-match');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  // Mock user skills
  const userSkills = {
    'React': 8,
    'JavaScript': 7,
    'TypeScript': 6,
    'Node.js': 5,
    'Python': 4,
    'CSS': 8,
    'HTML': 9,
    'Git': 6
  };

  // Generate job recommendations on component mount
  useEffect(() => {
    const allJobs = SAMPLE_JOBS.map(job => ({ ...job }));
    setJobs(allJobs);
    
    const recommendations = generateJobRecommendations(userProgress, allJobs, userSkills);
    setRecommendedJobs(recommendations);
  }, [userProgress]);

  // Generate smart resume
  useEffect(() => {
    const resume = generateSmartResume(userProgress, userSkills, userProgress.completedTasks || []);
    setSmartResume(resume);
    onResumeUpdate(resume);
  }, [userProgress, onResumeUpdate]);

  // Filter jobs based on search and filter
  const filteredJobs = recommendedJobs.filter(job => {
    if (filter === 'high-match') return job.matchScore >= 70;
    if (filter === 'remote') return job.remote;
    if (filter === 'internship') return job.type === 'internship';
    
    if (searchQuery) {
      return job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
             job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return true;
  });

  const handleJobSelect = (job: JobOpportunity) => {
    setSelectedJob(job);
    const analysis = generateSkillAnalysis(userSkills, job);
    setSkillAnalysis(analysis);
    setActiveTab('analysis');
  };

  const handleGenerateResume = async () => {
    setIsGeneratingResume(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const resume = generateSmartResume(userProgress, userSkills, userProgress.completedTasks || []);
    setSmartResume(resume);
    onResumeUpdate(resume);
    setIsGeneratingResume(false);
    
    alert('Resume generated successfully!');
  };

  const handleDownloadResume = () => {
    if (smartResume) {
      // In a real app, this would generate and download a PDF
      alert('Resume download started!');
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 40) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getJobTypeColor = (type: string) => {
    const colors = {
      'full-time': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'part-time': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'contract': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'internship': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'freelance': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI SkillMatch Engine
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover your perfect career opportunities powered by AI
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {recommendedJobs.length} Matches
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Found for you
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">High Match Jobs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {recommendedJobs.filter(j => j.matchScore >= 70).length}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Remote Jobs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {recommendedJobs.filter(j => j.remote).length}
                    </p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Salary</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${Math.round(recommendedJobs.reduce((sum, j) => sum + (j.salary.min + j.salary.max) / 2, 0) / recommendedJobs.length).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Skill Gaps</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {skillAnalysis.length}
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {[
                  { id: 'jobs', label: 'Job Matches', icon: Briefcase },
                  { id: 'resume', label: 'Smart Resume', icon: Edit },
                  { id: 'analysis', label: 'Skill Analysis', icon: TrendingUp }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Filters */}
              <Card className="p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    />
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  <div className="flex space-x-2">
                    {[
                      { id: 'all', label: 'All Jobs' },
                      { id: 'high-match', label: 'High Match' },
                      { id: 'remote', label: 'Remote' },
                      { id: 'internship', label: 'Internships' }
                    ].map((filterOption) => (
                      <Button
                        key={filterOption.id}
                        variant={filter === filterOption.id ? "default" : "outline"}
                        onClick={() => setFilter(filterOption.id as any)}
                        size="sm"
                      >
                        {filterOption.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Jobs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group cursor-pointer"
                          onClick={() => handleJobSelect(job)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {job.title}
                              </h3>
                              {job.isVerified && (
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {job.company} • {job.location}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge className={getJobTypeColor(job.type)}>
                                {job.type}
                              </Badge>
                              <Badge variant="outline">
                                {job.level}
                              </Badge>
                              {job.remote && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Remote
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchScore)}`}>
                              {job.matchScore}% Match
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Salary */}
                        <div className="flex items-center space-x-2 mb-4">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">{job.salary.currency}</span>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Required Skills
                            </span>
                            <span className="text-xs text-gray-500">
                              {job.skillMatches.length}/{job.skills.length} match
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.skills.slice(0, 4).map((skill, index) => (
                              <Badge 
                                key={index} 
                                variant={job.skillMatches.includes(skill) ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.skills.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Missing Skills */}
                        {job.missingSkills.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center space-x-1 mb-1">
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                              <span className="text-sm font-medium text-orange-600">
                                Missing Skills
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {job.missingSkills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs text-orange-600 border-orange-600">
                                  {skill}
                                </Badge>
                              ))}
                              {job.missingSkills.length > 3 && (
                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                                  +{job.missingSkills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJobSelect(job);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(job.applicationUrl, '_blank');
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Smart Resume
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      AI-generated resume based on your skills and experience
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleGenerateResume}
                      disabled={isGeneratingResume}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      {isGeneratingResume ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Regenerate
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDownloadResume}
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                {smartResume && (
                  <div className="space-y-6">
                    {smartResume.sections.map((section, index) => (
                      <div key={section.id} className="border-l-4 border-purple-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {section.title}
                        </h3>
                        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {activeTab === 'analysis' && selectedJob && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Skill Analysis for {selectedJob.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Identify skill gaps and create a learning plan
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab('jobs')}
                    variant="outline"
                  >
                    ← Back to Jobs
                  </Button>
                </div>

                <div className="space-y-6">
                  {skillAnalysis.map((analysis, index) => (
                    <Card key={analysis.skill} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {analysis.skill}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Current: {analysis.currentLevel}/10 • Target: {analysis.targetLevel}/10
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600">
                            {analysis.gap}
                          </div>
                          <div className="text-xs text-gray-500">Gap</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {Math.round((analysis.currentLevel / analysis.targetLevel) * 100)}%
                          </span>
                        </div>
                        <Progress value={(analysis.currentLevel / analysis.targetLevel) * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Learning Path
                          </h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {analysis.learningPath.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Recommended Resources
                          </h4>
                          <div className="space-y-2">
                            {analysis.resources.slice(0, 3).map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="flex items-center space-x-2 text-sm">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {resource.title} ({resource.duration}h)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AISkillMatch;
