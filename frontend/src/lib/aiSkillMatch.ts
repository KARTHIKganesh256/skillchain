/**
 * AI SkillMatch Engine - Job recommendations and smart resume builder
 * Matches user skills with job opportunities and generates personalized recommendations
 */

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  remote: boolean;
  postedDate: string;
  applicationDeadline?: string;
  matchScore: number;
  skillMatches: string[];
  missingSkills: string[];
  applicationUrl: string;
  companyLogo?: string;
  isVerified: boolean;
}

export interface ResumeSection {
  id: string;
  type: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  title: string;
  content: string;
  order: number;
}

export interface SmartResume {
  id: string;
  userId: string;
  title: string;
  sections: ResumeSection[];
  skills: string[];
  experience: number; // in years
  level: string;
  lastUpdated: string;
  isPublic: boolean;
  downloadUrl?: string;
}

export interface SkillAnalysis {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  importance: number; // 0-1 scale
  learningPath: string[];
  estimatedTime: number; // in hours
  resources: Array<{
    title: string;
    type: 'course' | 'tutorial' | 'book' | 'project' | 'practice';
    url: string;
    duration: number;
  }>;
}

/**
 * Calculate job match score based on user skills and job requirements
 */
export function calculateJobMatchScore(
  userSkills: Record<string, number>,
  jobSkills: string[],
  userLevel: number,
  jobLevel: number
): { score: number; matches: string[]; missing: string[] } {
  const skillMatches: string[] = [];
  const missingSkills: string[] = [];
  
  let totalScore = 0;
  let skillScore = 0;
  
  // Check skill matches
  jobSkills.forEach(skill => {
    const userSkillLevel = userSkills[skill.toLowerCase()] || 0;
    if (userSkillLevel > 0) {
      skillMatches.push(skill);
      skillScore += Math.min(userSkillLevel / 10, 1); // Normalize to 0-1
    } else {
      missingSkills.push(skill);
    }
  });
  
  // Calculate skill match percentage
  const skillMatchPercentage = skillMatches.length / jobSkills.length;
  
  // Level compatibility (closer levels = higher score)
  const levelDiff = Math.abs(userLevel - jobLevel);
  const levelScore = Math.max(0, 1 - (levelDiff / 10)); // Normalize to 0-1
  
  // Overall score (70% skills, 30% level)
  totalScore = (skillMatchPercentage * 0.7) + (levelScore * 0.3);
  
  return {
    score: Math.round(totalScore * 100),
    matches: skillMatches,
    missing: missingSkills
  };
}

/**
 * Generate personalized job recommendations
 */
export function generateJobRecommendations(
  userProgress: any,
  allJobs: JobOpportunity[],
  userSkills: Record<string, number>
): JobOpportunity[] {
  const userLevel = userProgress.currentLevel;
  const userExperience = userProgress.totalXP / 1000; // Convert XP to years
  
  return allJobs
    .map(job => {
      const match = calculateJobMatchScore(userSkills, job.skills, userLevel, getJobLevelNumber(job.level));
      return {
        ...job,
        matchScore: match.score,
        skillMatches: match.matches,
        missingSkills: match.missing
      };
    })
    .filter(job => job.matchScore >= 30) // Only show jobs with 30%+ match
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 20); // Top 20 recommendations
}

/**
 * Convert job level to number for comparison
 */
function getJobLevelNumber(level: string): number {
  const levels = { entry: 1, mid: 3, senior: 6, lead: 8, executive: 10 };
  return levels[level as keyof typeof levels] || 1;
}

/**
 * Generate skill analysis for career development
 */
export function generateSkillAnalysis(
  userSkills: Record<string, number>,
  targetJob: JobOpportunity
): SkillAnalysis[] {
  return targetJob.skills.map(skill => {
    const currentLevel = userSkills[skill.toLowerCase()] || 0;
    const targetLevel = 8; // Assume target level is 8/10
    const gap = Math.max(0, targetLevel - currentLevel);
    
    // Calculate importance based on how often the skill appears in similar jobs
    const importance = Math.random() * 0.5 + 0.5; // 0.5-1.0 for demo
    
    return {
      skill,
      currentLevel,
      targetLevel,
      gap,
      importance,
      learningPath: generateLearningPath(skill, gap),
      estimatedTime: gap * 10, // 10 hours per level
      resources: generateSkillResources(skill, gap)
    };
  }).sort((a, b) => b.importance - a.importance);
}

/**
 * Generate learning path for a skill
 */
function generateLearningPath(skill: string, gap: number): string[] {
  const paths = {
    'React': ['Learn JSX basics', 'Understand components', 'State management', 'Hooks', 'Advanced patterns'],
    'Python': ['Syntax basics', 'Data structures', 'Functions', 'OOP', 'Libraries'],
    'Machine Learning': ['Math foundations', 'Python basics', 'Data preprocessing', 'Model training', 'Deployment'],
    'AWS': ['Cloud concepts', 'EC2 basics', 'S3 storage', 'Database services', 'Advanced services']
  };
  
  return paths[skill as keyof typeof paths] || [
    'Learn fundamentals',
    'Practice basics',
    'Build projects',
    'Advanced concepts',
    'Expert level'
  ].slice(0, Math.ceil(gap / 2));
}

/**
 * Generate resources for skill development
 */
function generateSkillResources(skill: string, gap: number): Array<{
  title: string;
  type: 'course' | 'tutorial' | 'book' | 'project' | 'practice';
  url: string;
  duration: number;
}> {
  const resources = {
    'React': [
      { title: 'React Official Tutorial', type: 'tutorial' as const, url: 'https://react.dev', duration: 8 },
      { title: 'React Course on Udemy', type: 'course' as const, url: 'https://udemy.com', duration: 20 },
      { title: 'Build a Todo App', type: 'project' as const, url: '#', duration: 4 }
    ],
    'Python': [
      { title: 'Python Crash Course', type: 'book' as const, url: '#', duration: 15 },
      { title: 'Python for Data Science', type: 'course' as const, url: '#', duration: 25 },
      { title: 'Build a Web Scraper', type: 'project' as const, url: '#', duration: 6 }
    ],
    'Machine Learning': [
      { title: 'ML Course by Andrew Ng', type: 'course' as const, url: '#', duration: 40 },
      { title: 'Hands-on ML Book', type: 'book' as const, url: '#', duration: 30 },
      { title: 'Kaggle Competition', type: 'practice' as const, url: '#', duration: 20 }
    ]
  };
  
  return resources[skill as keyof typeof resources] || [
    { title: `${skill} Fundamentals`, type: 'course' as const, url: '#', duration: 10 },
    { title: `${skill} Practice Project`, type: 'project' as const, url: '#', duration: 5 }
  ];
}

/**
 * Generate smart resume sections based on user profile
 */
export function generateSmartResume(
  userProgress: any,
  userSkills: Record<string, number>,
  completedTasks: string[]
): SmartResume {
  const experience = Math.floor(userProgress.totalXP / 1000);
  const level = getLevelTitle(userProgress.currentLevel);
  
  const sections: ResumeSection[] = [
    {
      id: 'summary',
      type: 'summary',
      title: 'Professional Summary',
      content: `Experienced ${level} developer with ${experience} years of experience in software development. Proven track record of completing ${completedTasks.length} projects and maintaining a ${userProgress.currentStreak}-day learning streak. Strong problem-solving skills and passion for continuous learning.`,
      order: 1
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Technical Skills',
      content: Object.entries(userSkills)
        .filter(([_, level]) => level >= 5)
        .sort(([_, a], [__, b]) => b - a)
        .map(([skill, level]) => `${skill} (${level}/10)`)
        .join(', '),
      order: 2
    },
    {
      id: 'projects',
      type: 'projects',
      title: 'Key Projects',
      content: `• Completed ${completedTasks.length} skill-based projects demonstrating expertise in modern technologies\n• Built responsive web applications using React and TypeScript\n• Implemented backend services with Node.js and databases\n• Maintained active learning streak of ${userProgress.currentStreak} days`,
      order: 3
    },
    {
      id: 'achievements',
      type: 'certifications',
      title: 'Achievements & Certifications',
      content: `• SkillChain Level ${userProgress.currentLevel} Developer\n• ${userProgress.coins} SkillCoins earned through project completion\n• ${userProgress.currentStreak}-day learning streak\n• Completed advanced skill challenges in multiple technologies`,
      order: 4
    }
  ];
  
  return {
    id: `resume-${userProgress.userId}`,
    userId: userProgress.userId,
    title: `${userProgress.name || 'Developer'} - ${level} Developer`,
    sections,
    skills: Object.keys(userSkills).filter(skill => userSkills[skill] >= 5),
    experience,
    level,
    lastUpdated: new Date().toISOString(),
    isPublic: false
  };
}

/**
 * Get level title based on level number
 */
function getLevelTitle(level: number): string {
  if (level >= 10) return 'Senior';
  if (level >= 7) return 'Mid-level';
  if (level >= 4) return 'Junior';
  return 'Entry-level';
}

/**
 * Sample job opportunities
 */
export const SAMPLE_JOBS: JobOpportunity[] = [
  {
    id: 'job-1',
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    level: 'senior',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    description: 'We are looking for a senior React developer to join our frontend team...',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership'],
    skills: ['React', 'TypeScript', 'JavaScript', 'Redux', 'CSS', 'HTML'],
    benefits: ['Health insurance', '401k', 'Remote work', 'Learning budget'],
    remote: true,
    postedDate: new Date().toISOString(),
    applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 0,
    skillMatches: [],
    missingSkills: [],
    applicationUrl: 'https://techcorp.com/careers',
    companyLogo: '/images/companies/techcorp.png',
    isVerified: true
  },
  {
    id: 'job-2',
    title: 'Python Developer Intern',
    company: 'DataFlow Solutions',
    location: 'New York, NY',
    type: 'internship',
    level: 'entry',
    salary: { min: 25000, max: 35000, currency: 'USD' },
    description: 'Join our data science team as a Python developer intern...',
    requirements: ['Python basics', 'Data analysis interest', 'Learning attitude'],
    skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Git'],
    benefits: ['Mentorship', 'Learning resources', 'Potential full-time offer'],
    remote: false,
    postedDate: new Date().toISOString(),
    matchScore: 0,
    skillMatches: [],
    missingSkills: [],
    applicationUrl: 'https://dataflow.com/internships',
    isVerified: true
  },
  {
    id: 'job-3',
    title: 'Full-Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    type: 'full-time',
    level: 'mid',
    salary: { min: 80000, max: 110000, currency: 'USD' },
    description: 'We need a versatile full-stack developer for our growing startup...',
    requirements: ['3+ years experience', 'Full-stack knowledge', 'Startup experience preferred'],
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'JavaScript'],
    benefits: ['Equity', 'Flexible hours', 'Growth opportunities'],
    remote: true,
    postedDate: new Date().toISOString(),
    matchScore: 0,
    skillMatches: [],
    missingSkills: [],
    applicationUrl: 'https://startupxyz.com/jobs',
    isVerified: false
  }
];

