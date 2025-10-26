const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: ['http://localhost:3000', 'https://karthikganesh256.github.io'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'SkillChain Backend is working!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'SkillChain Backend',
    version: '1.0.0'
  });
});

// Departments and Skills Data
const departments = [
  {
    id: 1,
    name: 'Computer Science and Engineering',
    code: 'CSE',
    coreFocus: 'Software, AI, Data Science, Cloud',
    skills: [
      { name: 'JavaScript', type: 'Programming Language', category: 'Frontend/Backend' },
      { name: 'Python', type: 'Programming Language', category: 'Data Science, AI' },
      { name: 'Java', type: 'Programming Language', category: 'Enterprise, Backend' },
      { name: 'C/C++', type: 'Programming Language', category: 'Systems Programming' },
      { name: 'React', type: 'Framework', category: 'Frontend' },
      { name: 'Node.js', type: 'Runtime', category: 'Backend' },
      { name: 'Docker', type: 'DevOps Tool', category: 'Containerization' },
      { name: 'AWS', type: 'Cloud Platform', category: 'Cloud Computing' },
      { name: 'Machine Learning', type: 'Technology', category: 'AI/ML' },
      { name: 'Database Management', type: 'Technology', category: 'Data Management' }
    ]
  },
  {
    id: 2,
    name: 'Artificial Intelligence & Machine Learning',
    code: 'AIML',
    coreFocus: 'Deep Learning, Automation',
    skills: [
      { name: 'Python', type: 'Programming Language', category: 'Primary Language' },
      { name: 'TensorFlow', type: 'Framework', category: 'Deep Learning' },
      { name: 'PyTorch', type: 'Framework', category: 'Deep Learning' },
      { name: 'Keras', type: 'Framework', category: 'Neural Networks' },
      { name: 'Computer Vision', type: 'Technology', category: 'AI' },
      { name: 'NLP', type: 'Technology', category: 'Natural Language Processing' },
      { name: 'Data Science', type: 'Technology', category: 'Analytics' },
      { name: 'R Programming', type: 'Programming Language', category: 'Data Analysis' }
    ]
  },
  {
    id: 3,
    name: 'Electronics and Communication Engineering',
    code: 'ECE',
    coreFocus: 'IoT, Telecom, Embedded Systems',
    skills: [
      { name: 'C/C++', type: 'Programming Language', category: 'Embedded Systems' },
      { name: 'Python', type: 'Programming Language', category: 'IoT Applications' },
      { name: 'Arduino', type: 'Platform', category: 'Microcontrollers' },
      { name: 'Raspberry Pi', type: 'Platform', category: 'IoT Development' },
      { name: 'VLSI Design', type: 'Technology', category: 'Chip Design' },
      { name: 'Signal Processing', type: 'Technology', category: 'Digital Processing' },
      { name: 'MATLAB', type: 'Tool', category: 'Simulation' }
    ]
  },
  {
    id: 4,
    name: 'Electrical Engineering',
    code: 'EE',
    coreFocus: 'Power Systems, Renewable Energy',
    skills: [
      { name: 'MATLAB', type: 'Tool', category: 'Simulation' },
      { name: 'Python', type: 'Programming Language', category: 'Data Analysis' },
      { name: 'PLC Programming', type: 'Technology', category: 'Industrial Automation' },
      { name: 'Power System Analysis', type: 'Knowledge', category: 'Power Engineering' },
      { name: 'SCADA', type: 'System', category: 'Industrial Control' },
      { name: 'Renewable Energy Systems', type: 'Technology', category: 'Green Energy' }
    ]
  },
  {
    id: 5,
    name: 'Mechanical Engineering',
    code: 'ME',
    coreFocus: 'Manufacturing, Robotics, Design',
    skills: [
      { name: 'AutoCAD', type: 'Software', category: 'CAD Design' },
      { name: 'SolidWorks', type: 'Software', category: '3D Modeling' },
      { name: 'MATLAB', type: 'Tool', category: 'Simulation' },
      { name: 'Python', type: 'Programming Language', category: 'Automation' },
      { name: 'Robotics', type: 'Technology', category: 'Automation' },
      { name: 'CNC Programming', type: 'Technology', category: 'Manufacturing' },
      { name: 'Finite Element Analysis', type: 'Technology', category: 'Structural Analysis' }
    ]
  }
];

// 1. Get all departments with their skills
app.get('/api/departments', (req, res) => {
  res.json({
    success: true,
    departments: departments
  });
});

// 2. Get skills for a specific department
app.get('/api/departments/:deptId/skills', (req, res) => {
  const deptId = parseInt(req.params.deptId);
  const department = departments.find(d => d.id === deptId);
  
  if (!department) {
    return res.status(404).json({
      success: false,
      message: 'Department not found'
    });
  }
  
  res.json({
    success: true,
    department: {
      id: department.id,
      name: department.name,
      code: department.code,
      coreFocus: department.coreFocus
    },
    skills: department.skills
  });
});

// 3. Get all skills (flattened across departments)
app.get('/api/skills', (req, res) => {
  const allSkills = [];
  departments.forEach(dept => {
    dept.skills.forEach(skill => {
      allSkills.push({
        id: allSkills.length + 1,
        name: skill.name,
        department: dept.name,
        departmentCode: dept.code,
        type: skill.type,
        category: skill.category,
        value: Math.floor(Math.random() * 40) + 60, // Random value 60-100
        level: Math.floor(Math.random() * 5) + 4, // Random level 4-8
        market_demand: ['low', 'medium', 'high', 'very_high'][Math.floor(Math.random() * 4)]
      });
    });
  });
  
  res.json({
    success: true,
    skills: allSkills,
    totalSkills: allSkills.length,
    departments: departments.length
  });
});

// 2. SkillGraph Network Visualization Data
app.get('/api/skillgraph/data', (req, res) => {
  res.json({
    nodes: [
      { id: 'JavaScript', group: 1, level: 8, value: 100, category: 'Programming' },
      { id: 'React', group: 1, level: 6, value: 90, category: 'Frontend' },
      { id: 'Node.js', group: 1, level: 5, value: 85, category: 'Backend' },
      { id: 'TypeScript', group: 1, level: 6, value: 88, category: 'Programming' },
      { id: 'Python', group: 2, level: 7, value: 95, category: 'Programming' },
      { id: 'Django', group: 2, level: 4, value: 75, category: 'Backend' },
      { id: 'AWS', group: 3, level: 7, value: 92, category: 'Cloud' },
      { id: 'Docker', group: 3, level: 5, value: 80, category: 'DevOps' }
    ],
    links: [
      { source: 'JavaScript', target: 'React', value: 5, type: 'prerequisite' },
      { source: 'JavaScript', target: 'Node.js', value: 3, type: 'related' },
      { source: 'JavaScript', target: 'TypeScript', value: 4, type: 'enhancement' },
      { source: 'Python', target: 'Django', value: 4, type: 'framework' },
      { source: 'Node.js', target: 'AWS', value: 2, type: 'deployment' },
      { source: 'Node.js', target: 'Docker', value: 3, type: 'containerization' }
    ],
    metadata: {
      total_skills: 8,
      connections: 6,
      categories: ['Programming', 'Frontend', 'Backend', 'Cloud', 'DevOps']
    }
  });
});

// 3. Reels & AI Learning Q&A
app.get('/api/reels', (req, res) => {
  res.json({
    reels: [
      { 
        id: 1, 
        title: 'JavaScript Basics in 60s', 
        skill: 'JavaScript', 
        duration: '1:00', 
        views: 1250,
        creator: 'TechGuru',
        difficulty: 'beginner',
        tags: ['javascript', 'basics', 'tutorial']
      },
      { 
        id: 2, 
        title: 'React Hooks Explained', 
        skill: 'React', 
        duration: '1:30', 
        views: 980,
        creator: 'ReactMaster',
        difficulty: 'intermediate',
        tags: ['react', 'hooks', 'state']
      },
      { 
        id: 3, 
        title: 'Python Data Structures', 
        skill: 'Python', 
        duration: '2:00', 
        views: 2100,
        creator: 'PythonPro',
        difficulty: 'intermediate',
        tags: ['python', 'data-structures', 'algorithms']
      }
    ]
  });
});

// 4. Verified Skill Demos & Peer Portfolios
app.get('/api/portfolios', (req, res) => {
  res.json({
    portfolios: [
      {
        id: 1,
        user_id: 1,
        name: 'John Doe',
        verified_skills: [
          {
            skill: 'JavaScript',
            level: 8,
            verification_date: '2024-01-15',
            certificates: ['JavaScript Advanced', 'React Certification'],
            projects: ['E-commerce Platform', 'Task Management App'],
            peer_reviews: 4.8,
            verification_status: 'verified'
          },
          {
            skill: 'React',
            level: 6,
            verification_date: '2024-01-10',
            certificates: ['React Fundamentals'],
            projects: ['Weather Dashboard', 'Portfolio Website'],
            peer_reviews: 4.6,
            verification_status: 'verified'
          }
        ],
        total_verified_skills: 2,
        portfolio_score: 4.7,
        completion_rate: 0.85
      },
      {
        id: 2,
        user_id: 2,
        name: 'Jane Smith',
        verified_skills: [
          {
            skill: 'Python',
            level: 7,
            verification_date: '2024-01-12',
            certificates: ['Python Advanced', 'Django Certification'],
            projects: ['Data Analysis Tool', 'Web Scraper'],
            peer_reviews: 4.9,
            verification_status: 'verified'
          }
        ],
        total_verified_skills: 1,
        portfolio_score: 4.9,
        completion_rate: 0.92
      }
    ]
  });
});

// 5. AI Recommendations Dashboard
app.get('/api/recommendations', (req, res) => {
  res.json({
    recommendations: [
      {
        skill: 'TypeScript',
        reason: 'Builds on your JavaScript knowledge',
        priority: 'high',
        market_demand: 95,
        salary_boost: '+15%',
        learning_time: '4-6 weeks',
        related_skills: ['JavaScript', 'React', 'Node.js'],
        confidence: 0.92
      },
      {
        skill: 'Next.js',
        reason: 'Popular React framework for production apps',
        priority: 'medium',
        market_demand: 88,
        salary_boost: '+12%',
        learning_time: '3-4 weeks',
        related_skills: ['React', 'JavaScript', 'Web Development'],
        confidence: 0.87
      },
      {
        skill: 'GraphQL',
        reason: 'Modern API technology with high demand',
        priority: 'low',
        market_demand: 75,
        salary_boost: '+18%',
        learning_time: '2-3 weeks',
        related_skills: ['JavaScript', 'Node.js', 'API Development'],
        confidence: 0.78
      }
    ],
    market_insights: {
      trending_skills: ['AI/ML', 'Cloud Computing', 'Cybersecurity'],
      salary_trends: 'Skills in AI/ML showing 25% salary increase',
      demand_forecast: 'Cloud and DevOps skills will be in high demand'
    }
  });
});

// 6. TimeToken Exchange (Secure escrow system)
app.get('/api/timetoken/transactions', (req, res) => {
  res.json({
    transactions: [
      {
        id: 1,
        transaction_id: 'TT_12345',
        from_user: 'Alice',
        to_user: 'Bob',
        amount: 50,
        skill: 'JavaScript Tutorial',
        status: 'completed',
        escrow_status: 'released',
        smart_contract: '0x1234567890abcdef',
        created_at: '2024-01-15T10:30:00Z',
        completed_at: '2024-01-16T14:20:00Z'
      },
      {
        id: 2,
        transaction_id: 'TT_12346',
        from_user: 'Charlie',
        to_user: 'Alice',
        amount: 75,
        skill: 'Python Course',
        status: 'pending',
        escrow_status: 'locked',
        smart_contract: '0xabcdef1234567890',
        created_at: '2024-01-17T09:15:00Z',
        estimated_completion: '2024-01-24T09:15:00Z'
      },
      {
        id: 3,
        transaction_id: 'TT_12347',
        from_user: 'Bob',
        to_user: 'Charlie',
        amount: 30,
        skill: 'React Workshop',
        status: 'escrow',
        escrow_status: 'disputed',
        smart_contract: '0x9876543210fedcba',
        created_at: '2024-01-18T16:45:00Z',
        dispute_reason: 'Quality not as expected'
      }
    ],
    total_value_locked: 2450,
    active_transactions: 127,
    success_rate: 98.5
  });
});

// 7. Gamification: Challenges, Badges, Leaderboards
app.get('/api/gamification/challenges', (req, res) => {
  res.json({
    challenges: [
      {
        id: 1,
        title: 'JavaScript Master',
        description: 'Complete 10 JavaScript projects',
        reward: 100,
        difficulty: 'medium',
        time_limit: '30 days',
        prerequisites: ['JavaScript Basics'],
        progress_tracking: 'project_based',
        current_participants: 45,
        completion_rate: 0.78
      },
      {
        id: 2,
        title: 'React Ninja',
        description: 'Build 5 React applications',
        reward: 150,
        difficulty: 'hard',
        time_limit: '45 days',
        prerequisites: ['React Fundamentals'],
        progress_tracking: 'app_based',
        current_participants: 32,
        completion_rate: 0.65
      },
      {
        id: 3,
        title: 'Python Pro',
        description: 'Solve 20 Python coding challenges',
        reward: 200,
        difficulty: 'hard',
        time_limit: '60 days',
        prerequisites: ['Python Basics'],
        progress_tracking: 'challenge_based',
        current_participants: 67,
        completion_rate: 0.82
      }
    ],
    badges: [
      {
        name: 'First Steps',
        description: 'Complete your first skill',
        icon: '🌱',
        rarity: 'common',
        points: 10,
        earned_by: 1250
      },
      {
        name: 'Quick Learner',
        description: 'Learn 3 skills in a week',
        icon: '⚡',
        rarity: 'rare',
        points: 50,
        earned_by: 234
      },
      {
        name: 'Mentor',
        description: 'Help 5 learners',
        icon: '👨‍🏫',
        rarity: 'epic',
        points: 100,
        earned_by: 89
      }
    ],
    leaderboard: [
      { rank: 1, name: 'Alice Johnson', points: 2450, skills: 12, badges: 8 },
      { rank: 2, name: 'Bob Smith', points: 2200, skills: 10, badges: 7 },
      { rank: 3, name: 'Charlie Brown', points: 1950, skills: 9, badges: 6 },
      { rank: 4, name: 'Diana Prince', points: 1800, skills: 8, badges: 5 },
      { rank: 5, name: 'Eve Wilson', points: 1650, skills: 7, badges: 4 }
    ]
  });
});

// 8. Real-world Skill Map (Google Maps API integration)
app.get('/api/skillmap/locations', (req, res) => {
  res.json({
    locations: [
      {
        id: 1,
        name: 'JavaScript Meetup',
        type: 'meetup',
        location: { lat: 37.7749, lng: -122.4194 },
        address: 'San Francisco, CA',
        date: '2024-02-15',
        time: '18:00',
        attendees: 45,
        skill: 'JavaScript',
        level: 'intermediate',
        organizer: 'SF Tech Community',
        description: 'Monthly JavaScript meetup with networking and presentations'
      },
      {
        id: 2,
        name: 'React Workshop',
        type: 'workshop',
        location: { lat: 40.7128, lng: -74.0060 },
        address: 'New York, NY',
        date: '2024-02-20',
        time: '10:00',
        attendees: 30,
        skill: 'React',
        level: 'beginner',
        organizer: 'NYC React Group',
        description: 'Hands-on React workshop for beginners'
      },
      {
        id: 3,
        name: 'Tech Learning Center',
        type: 'learning_center',
        location: { lat: 34.0522, lng: -118.2437 },
        address: 'Los Angeles, CA',
        date: 'ongoing',
        time: '9:00-17:00',
        attendees: 200,
        skill: 'Multiple',
        level: 'all',
        organizer: 'LA Tech Academy',
        description: 'Full-service learning center with courses in multiple technologies'
      }
    ],
    total_events: 3,
    nearby_radius: '50km',
    filter_options: {
      skills: ['JavaScript', 'React', 'Python', 'Node.js'],
      event_types: ['meetup', 'workshop', 'learning_center'],
      levels: ['beginner', 'intermediate', 'advanced']
    }
  });
});

// 9. Multilingual AI Voice Bot
app.post('/api/voice/process', (req, res) => {
  const { audio_text, language, target_language } = req.body;
  
  // Mock voice processing
  const processed_text = audio_text;
  const ai_response = `Based on your question about '${processed_text}', here's my response: This is an important skill development topic. I recommend starting with fundamentals and building practical projects.`;
  
  res.json({
    original_text: audio_text,
    processed_text: processed_text,
    language: language,
    target_language: target_language,
    ai_response: ai_response,
    confidence: 0.95,
    translation_accuracy: 0.92,
    suggestions: [
      'Practice speaking the language',
      'Join language-specific communities',
      'Use voice commands for learning'
    ]
  });
});

// 10. Dispute Resolution & Review System
app.get('/api/disputes', (req, res) => {
  res.json({
    disputes: [
      {
        id: 1,
        title: 'Payment for JavaScript Course',
        parties: ['Alice', 'Bob'],
        status: 'under_review',
        created: '2 days ago',
        description: 'Dispute over course quality and completion',
        evidence: ['Course materials', 'Completion certificate', 'Peer reviews'],
        ai_analysis: {
          sentiment_score: 0.3,
          complexity_level: 'medium',
          recommended_mediator: 'AI Mediator Bot',
          estimated_resolution_time: '3-5 days'
        }
      },
      {
        id: 2,
        title: 'Quality of React Tutorial',
        parties: ['Charlie', 'David'],
        status: 'resolved',
        created: '1 week ago',
        description: 'Dispute over tutorial quality and delivery',
        evidence: ['Tutorial videos', 'Student feedback', 'Quality metrics'],
        resolution: 'Partial refund with re-delivery',
        resolution_date: '2024-01-10T15:30:00Z'
      },
      {
        id: 3,
        title: 'Skill Verification Dispute',
        parties: ['Eve', 'Frank'],
        status: 'escalated',
        created: '3 days ago',
        description: 'Dispute over skill verification process',
        evidence: ['Skill demonstrations', 'Peer reviews', 'Assessment scores'],
        escalation_reason: 'Complex technical dispute requiring human mediator'
      }
    ],
    statistics: {
      total_disputes: 45,
      resolved_disputes: 42,
      resolution_rate: 93.3,
      average_resolution_time: '2.3 days',
      user_satisfaction: 4.8
    }
  });
});

// Additional API endpoints
app.get('/api/skills/:id', (req, res) => {
  const skillId = parseInt(req.params.id);
  const skills = [
    { id: 1, name: 'JavaScript', category: 'Programming', value: 100, level: 8, description: 'A versatile programming language for web development' },
    { id: 2, name: 'Python', category: 'Programming', value: 95, level: 7, description: 'A high-level programming language known for its simplicity' },
    { id: 3, name: 'React', category: 'Frontend', value: 90, level: 6, description: 'A JavaScript library for building user interfaces' },
    { id: 4, name: 'Node.js', category: 'Backend', value: 85, level: 5, description: 'A JavaScript runtime for server-side development' }
  ];
  
  const skill = skills.find(s => s.id === skillId);
  if (skill) {
    res.json(skill);
  } else {
    res.status(404).json({ error: 'Skill not found' });
  }
});

app.post('/api/skills', (req, res) => {
  const { name, category, level } = req.body;
  const newSkill = {
    id: Date.now(),
    name,
    category,
    level: level || 1,
    value: level * 20
  };
  res.status(201).json(newSkill);
});

app.get('/api/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'John Doe', skills: ['JavaScript', 'React'], skillcoins: 150 },
      { id: 2, name: 'Jane Smith', skills: ['Python', 'Node.js'], skillcoins: 200 },
      { id: 3, name: 'Mike Johnson', skills: ['TypeScript', 'Vue.js'], skillcoins: 180 },
      { id: 4, name: 'Sarah Wilson', skills: ['Docker', 'AWS'], skillcoins: 220 }
    ]
  });
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = [
    { id: 1, name: 'John Doe', skills: ['JavaScript', 'React'], skillcoins: 150, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', skills: ['Python', 'Node.js'], skillcoins: 200, email: 'jane@example.com' }
  ];
  
  const user = users.find(u => u.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users', (req, res) => {
  const { name, email, skills } = req.body;
  const newUser = {
    id: Date.now(),
    name,
    email,
    skills: skills || [],
    skillcoins: 100
  };
  res.status(201).json(newUser);
});

// SkillCoin transactions
app.post('/api/transactions', (req, res) => {
  const { fromUserId, toUserId, amount, description } = req.body;
  const transaction = {
    id: Date.now(),
    fromUserId,
    toUserId,
    amount,
    description,
    timestamp: new Date().toISOString(),
    status: 'completed'
  };
  res.status(201).json(transaction);
});

app.get('/api/transactions/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const transactions = [
    {
      id: 1,
      fromUserId: 2,
      toUserId: userId,
      amount: 50,
      description: 'Payment for JavaScript tutorial',
      timestamp: new Date().toISOString(),
      status: 'completed'
    },
    {
      id: 2,
      fromUserId: userId,
      toUserId: 3,
      amount: 30,
      description: 'Payment for React lesson',
      timestamp: new Date().toISOString(),
      status: 'completed'
    }
  ];
  res.json({ transactions });
});

// Learning sessions
app.get('/api/sessions', (req, res) => {
  res.json({
    sessions: [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        teacher: 'John Doe',
        student: 'Jane Smith',
        skill: 'JavaScript',
        duration: 60,
        status: 'completed',
        skillcoins: 50
      },
      {
        id: 2,
        title: 'React Components',
        teacher: 'Mike Johnson',
        student: 'Sarah Wilson',
        skill: 'React',
        duration: 45,
        status: 'in-progress',
        skillcoins: 40
      }
    ]
  });
});

app.post('/api/sessions', (req, res) => {
  const { title, teacherId, studentId, skill, duration } = req.body;
  const newSession = {
    id: Date.now(),
    title,
    teacherId,
    studentId,
    skill,
    duration,
    status: 'scheduled',
    skillcoins: duration * 0.5
  };
  res.status(201).json(newSession);
});

// Challenges
app.get('/api/challenges', (req, res) => {
  res.json({
    challenges: [
      {
        id: 1,
        title: 'Build a Todo App',
        description: 'Create a full-stack todo application using React and Node.js',
        skill: 'JavaScript',
        difficulty: 'intermediate',
        reward: 100,
        deadline: '2024-02-15',
        status: 'active'
      },
      {
        id: 2,
        title: 'Data Visualization',
        description: 'Create interactive charts using D3.js',
        skill: 'Data Visualization',
        difficulty: 'advanced',
        reward: 150,
        deadline: '2024-02-20',
        status: 'active'
      }
    ]
  });
});

app.post('/api/challenges', (req, res) => {
  const { title, description, skill, difficulty, reward, deadline } = req.body;
  const newChallenge = {
    id: Date.now(),
    title,
    description,
    skill,
    difficulty,
    reward,
    deadline,
    status: 'active',
    createdBy: 1
  };
  res.status(201).json(newChallenge);
});

// Analytics
app.get('/api/analytics/skills', (req, res) => {
  res.json({
    topSkills: [
      { name: 'JavaScript', count: 150, growth: 15 },
      { name: 'Python', count: 120, growth: 20 },
      { name: 'React', count: 100, growth: 25 },
      { name: 'Node.js', count: 80, growth: 18 }
    ],
    skillDistribution: {
      'Programming': 45,
      'Frontend': 25,
      'Backend': 20,
      'DevOps': 10
    }
  });
});

app.get('/api/analytics/users', (req, res) => {
  res.json({
    totalUsers: 1250,
    activeUsers: 890,
    newUsers: 45,
    skillcoinCirculation: 125000
  });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password } = req.body;
  
  // Validate input
  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide fullName, email, and password'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // In a real app, you would:
  // 1. Check if user already exists
  // 2. Hash the password
  // 3. Save to database
  // For now, we'll just return success
  
  console.log('New user registration:', { fullName, email });
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: Date.now(),
      fullName,
      email,
      createdAt: new Date().toISOString()
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // In a real app, you would:
  // 1. Find user by email
  // 2. Verify password
  // 3. Generate JWT token
  // For now, we'll just return success
  
  console.log('User login attempt:', { email });
  
  res.json({
    success: true,
    message: 'Login successful',
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 1,
      email,
      fullName: 'Test User'
    }
  });
});

// Profile Setup Endpoint
app.post('/api/profile/setup', (req, res) => {
  const { 
    college, 
    department, 
    course, 
    year, 
    rollNumber, 
    phone, 
    address, 
    emergencyContact, 
    emergencyPhone 
  } = req.body;

  // Validate required fields
  if (!college || !department || !course || !year || !rollNumber) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  // In a real app, you would:
  // 1. Get user ID from JWT token
  // 2. Save profile data to database
  // For now, we'll just return success
  
  console.log('Profile setup for user:', { 
    college, 
    department, 
    course, 
    year, 
    rollNumber 
  });
  
  res.json({
    success: true,
    message: 'Profile setup completed successfully',
    profile: {
      college,
      department,
      course,
      year,
      rollNumber,
      phone,
      address,
      emergencyContact,
      emergencyPhone,
      completedAt: new Date().toISOString()
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SkillChain Backend running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;