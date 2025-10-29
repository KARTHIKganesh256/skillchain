-- SkillChain Sample Data - Real Values and Test Data
-- This file contains realistic sample data for testing and development

-- Insert sample skills with real categories
INSERT INTO skills (name, description, category, subcategory, difficulty_level, estimated_hours, prerequisites, tags, is_verified, created_at) VALUES
-- Programming & Development
('JavaScript Fundamentals', 'Learn core JavaScript concepts including variables, functions, objects, and DOM manipulation', 'Programming', 'Web Development', 3, 40, '{}', '{"javascript", "programming", "web", "beginner"}', true, NOW()),
('React.js Development', 'Build interactive user interfaces with React components, hooks, and state management', 'Programming', 'Frontend Development', 5, 60, '{"JavaScript Fundamentals"}', '{"react", "javascript", "frontend", "ui"}', true, NOW()),
('Python for Data Science', 'Data analysis, visualization, and machine learning with Python libraries', 'Programming', 'Data Science', 6, 80, '{}', '{"python", "data-science", "analytics", "ml"}', true, NOW()),
('Node.js Backend Development', 'Server-side JavaScript development with Express.js and database integration', 'Programming', 'Backend Development', 5, 70, '{"JavaScript Fundamentals"}', '{"nodejs", "backend", "api", "server"}', true, NOW()),
('Mobile App Development (React Native)', 'Cross-platform mobile app development using React Native', 'Programming', 'Mobile Development', 6, 90, '{"React.js Development"}', '{"react-native", "mobile", "ios", "android"}', true, NOW()),

-- Design & Creative
('UI/UX Design Principles', 'User interface and user experience design fundamentals and best practices', 'Design', 'UI/UX', 4, 50, '{}', '{"ui", "ux", "design", "user-experience"}', true, NOW()),
('Adobe Photoshop Mastery', 'Professional photo editing and digital art creation with Photoshop', 'Design', 'Digital Art', 5, 60, '{}', '{"photoshop", "design", "photo-editing", "digital-art"}', true, NOW()),
('Figma for Web Design', 'Modern web design and prototyping using Figma design tool', 'Design', 'Web Design', 3, 30, '{}', '{"figma", "design", "prototyping", "web"}', true, NOW()),
('Video Editing with Premiere Pro', 'Professional video editing and post-production techniques', 'Design', 'Video Production', 6, 80, '{}', '{"video-editing", "premiere-pro", "post-production", "film"}', true, NOW()),

-- Business & Marketing
('Digital Marketing Strategy', 'Comprehensive digital marketing including SEO, social media, and content marketing', 'Business', 'Marketing', 4, 50, '{}', '{"marketing", "digital", "seo", "social-media"}', true, NOW()),
('Project Management (Agile/Scrum)', 'Agile project management methodologies and Scrum framework implementation', 'Business', 'Project Management', 4, 40, '{}', '{"project-management", "agile", "scrum", "leadership"}', true, NOW()),
('Sales Funnel Optimization', 'Build and optimize sales funnels for maximum conversion rates', 'Business', 'Sales', 5, 35, '{"Digital Marketing Strategy"}', '{"sales", "conversion", "funnel", "optimization"}', true, NOW()),
('Financial Analysis & Excel', 'Advanced Excel skills for financial modeling and business analysis', 'Business', 'Finance', 5, 45, '{}', '{"excel", "finance", "analysis", "modeling"}', true, NOW()),

-- Language & Communication
('English Conversation Practice', 'Improve spoken English through structured conversation practice', 'Language', 'English', 2, 20, '{}', '{"english", "conversation", "speaking", "language"}', true, NOW()),
('Spanish for Beginners', 'Learn basic Spanish vocabulary, grammar, and conversation skills', 'Language', 'Spanish', 3, 30, '{}', '{"spanish", "language", "beginner", "conversation"}', true, NOW()),
('Public Speaking & Presentation', 'Master public speaking techniques and presentation skills', 'Language', 'Communication', 4, 25, '{}', '{"public-speaking", "presentation", "communication", "confidence"}', true, NOW()),

-- Technical Skills
('AWS Cloud Architecture', 'Design and deploy scalable applications on Amazon Web Services', 'Technology', 'Cloud Computing', 7, 100, '{"Node.js Backend Development"}', '{"aws", "cloud", "devops", "architecture"}', true, NOW()),
('Docker & Containerization', 'Containerize applications and manage microservices with Docker', 'Technology', 'DevOps', 5, 40, '{}', '{"docker", "containers", "devops", "microservices"}', true, NOW()),
('Database Design & SQL', 'Design relational databases and write complex SQL queries', 'Technology', 'Database', 4, 50, '{}', '{"sql", "database", "design", "queries"}', true, NOW()),
('Cybersecurity Fundamentals', 'Essential cybersecurity concepts and best practices for developers', 'Technology', 'Security', 6, 60, '{}', '{"cybersecurity", "security", "hacking", "protection"}', true, NOW()),

-- Creative & Arts
('Photography & Composition', 'Master camera techniques and artistic composition principles', 'Arts', 'Photography', 4, 35, '{}', '{"photography", "composition", "camera", "art"}', true, NOW()),
('Music Production (Ableton Live)', 'Create and produce music using Ableton Live software', 'Arts', 'Music', 6, 70, '{}', '{"music", "production", "ableton", "audio"}', true, NOW()),
('Creative Writing', 'Develop storytelling skills and creative writing techniques', 'Arts', 'Writing', 3, 30, '{}', '{"writing", "creative", "storytelling", "literature"}', true, NOW());

-- Insert sample users (these would normally be created through registration)
INSERT INTO users (id, email, display_name, bio, location, phone, photo_url, skill_coin_balance, rating, review_count, role, is_premium, is_active, email_verified, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'karthikesh.m@skillchain.com', 'karthikesh.M', 'Full-stack developer with 5+ years experience in React and Node.js', 'Bangalore, India', '+91-98765-43210', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 250, 4.8, 23, 'user', true, true, true, NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'karthik@skillchain.com', 'karthik', 'UI/UX Designer passionate about creating beautiful and functional user experiences', 'Mumbai, India', '+91-98765-43211', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 180, 4.9, 31, 'user', true, true, true, NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'kamal.karthik@skillchain.com', 'kamal karthik', 'Digital marketing specialist with expertise in SEO and social media', 'Delhi, India', '+91-98765-43212', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 320, 4.7, 18, 'user', false, true, true, NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'md.suhana@skillchain.com', 'Md suhana', 'Bilingual educator and language learning specialist', 'Kolkata, India', '+91-98765-43213', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 150, 4.6, 12, 'user', false, true, true, NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'md.muskan@skillchain.com', 'Md muskan', 'Data scientist and Python expert specializing in machine learning', 'Chennai, India', '+91-98765-43214', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 200, 4.8, 25, 'user', true, true, true, NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'lisa.patel@skillchain.com', 'Lisa Patel', 'Photography enthusiast and creative director with 8+ years experience', 'Mumbai, India', '+91-98765-43215', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 280, 4.9, 35, 'user', true, true, true, NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'david.brown@skillchain.com', 'David Brown', 'Project manager and Agile coach helping teams deliver better software', 'Pune, India', '+91-98765-43216', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 160, 4.5, 14, 'user', false, true, true, NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'maria.garcia@skillchain.com', 'Maria Garcia', 'Bilingual educator and language learning specialist', 'Hyderabad, India', '+91-98765-43217', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', 190, 4.7, 22, 'user', false, true, true, NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'admin@skillchain.com', 'SkillChain Admin', 'Platform administrator and community manager', 'Bangalore, India', '+91-98765-43218', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 1000, 5.0, 0, 'admin', true, true, true, NOW());

-- Insert user skills (connecting users to skills they can teach/learn)
INSERT INTO user_skills (user_id, skill_id, proficiency_level, experience_hours, is_teaching, hourly_rate, availability_schedule, created_at) VALUES
-- karthikesh.M's skills (Full-stack developer)
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM skills WHERE name = 'JavaScript Fundamentals'), 9, 2000, true, 75, '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "15:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM skills WHERE name = 'React.js Development'), 8, 1500, true, 85, '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "15:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM skills WHERE name = 'Node.js Backend Development'), 7, 1200, true, 90, '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "15:00"}}', NOW()),

-- karthik's skills (UI/UX Designer)
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM skills WHERE name = 'UI/UX Design Principles'), 9, 1800, true, 80, '{"monday": {"start": "10:00", "end": "18:00"}, "tuesday": {"start": "10:00", "end": "18:00"}, "wednesday": {"start": "10:00", "end": "18:00"}, "thursday": {"start": "10:00", "end": "18:00"}, "friday": {"start": "10:00", "end": "16:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM skills WHERE name = 'Figma for Web Design'), 8, 1000, true, 70, '{"monday": {"start": "10:00", "end": "18:00"}, "tuesday": {"start": "10:00", "end": "18:00"}, "wednesday": {"start": "10:00", "end": "18:00"}, "thursday": {"start": "10:00", "end": "18:00"}, "friday": {"start": "10:00", "end": "16:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM skills WHERE name = 'Adobe Photoshop Mastery'), 7, 800, true, 65, '{"monday": {"start": "10:00", "end": "18:00"}, "tuesday": {"start": "10:00", "end": "18:00"}, "wednesday": {"start": "10:00", "end": "18:00"}, "thursday": {"start": "10:00", "end": "18:00"}, "friday": {"start": "10:00", "end": "16:00"}}', NOW()),

-- kamal karthik's skills (Digital Marketer)
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM skills WHERE name = 'Digital Marketing Strategy'), 8, 1600, true, 70, '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "15:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM skills WHERE name = 'Sales Funnel Optimization'), 7, 1200, true, 80, '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "15:00"}}', NOW()),

-- Md suhana's skills (Language Teacher)
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM skills WHERE name = 'English Conversation Practice'), 9, 2500, true, 40, '{"monday": {"start": "18:00", "end": "21:00"}, "tuesday": {"start": "18:00", "end": "21:00"}, "wednesday": {"start": "18:00", "end": "21:00"}, "thursday": {"start": "18:00", "end": "21:00"}, "friday": {"start": "18:00", "end": "21:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM skills WHERE name = 'Spanish for Beginners'), 8, 1500, true, 35, '{"monday": {"start": "18:00", "end": "21:00"}, "tuesday": {"start": "18:00", "end": "21:00"}, "wednesday": {"start": "18:00", "end": "21:00"}, "thursday": {"start": "18:00", "end": "21:00"}, "friday": {"start": "18:00", "end": "21:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM skills WHERE name = 'Public Speaking & Presentation'), 7, 1000, true, 50, '{"monday": {"start": "18:00", "end": "21:00"}, "tuesday": {"start": "18:00", "end": "21:00"}, "wednesday": {"start": "18:00", "end": "21:00"}, "thursday": {"start": "18:00", "end": "21:00"}, "friday": {"start": "18:00", "end": "21:00"}}', NOW()),

-- Md muskan's skills (Data Scientist)
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM skills WHERE name = 'Python for Data Science'), 9, 2200, true, 95, '{"monday": {"start": "08:00", "end": "16:00"}, "tuesday": {"start": "08:00", "end": "16:00"}, "wednesday": {"start": "08:00", "end": "16:00"}, "thursday": {"start": "08:00", "end": "16:00"}, "friday": {"start": "08:00", "end": "14:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM skills WHERE name = 'Database Design & SQL'), 8, 1500, true, 85, '{"monday": {"start": "08:00", "end": "16:00"}, "tuesday": {"start": "08:00", "end": "16:00"}, "wednesday": {"start": "08:00", "end": "16:00"}, "thursday": {"start": "08:00", "end": "16:00"}, "friday": {"start": "08:00", "end": "14:00"}}', NOW()),

-- Lisa Patel's skills (Photographer)
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM skills WHERE name = 'Photography & Composition'), 9, 2000, true, 60, '{"saturday": {"start": "09:00", "end": "17:00"}, "sunday": {"start": "09:00", "end": "17:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM skills WHERE name = 'Adobe Photoshop Mastery'), 8, 1500, true, 65, '{"monday": {"start": "19:00", "end": "21:00"}, "wednesday": {"start": "19:00", "end": "21:00"}, "friday": {"start": "19:00", "end": "21:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM skills WHERE name = 'Video Editing with Premiere Pro'), 7, 1200, true, 70, '{"saturday": {"start": "09:00", "end": "17:00"}, "sunday": {"start": "09:00", "end": "17:00"}}', NOW()),

-- David Brown's skills (Project Manager)
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM skills WHERE name = 'Project Management (Agile/Scrum)'), 8, 1800, true, 85, '{"monday": {"start": "08:00", "end": "16:00"}, "tuesday": {"start": "08:00", "end": "16:00"}, "wednesday": {"start": "08:00", "end": "16:00"}, "thursday": {"start": "08:00", "end": "16:00"}, "friday": {"start": "08:00", "end": "14:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM skills WHERE name = 'Financial Analysis & Excel'), 7, 1400, true, 75, '{"monday": {"start": "08:00", "end": "16:00"}, "tuesday": {"start": "08:00", "end": "16:00"}, "wednesday": {"start": "08:00", "end": "16:00"}, "thursday": {"start": "08:00", "end": "16:00"}, "friday": {"start": "08:00", "end": "14:00"}}', NOW()),

-- Maria Garcia's skills (Language Teacher)
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM skills WHERE name = 'English Conversation Practice'), 9, 2500, true, 40, '{"monday": {"start": "18:00", "end": "21:00"}, "tuesday": {"start": "18:00", "end": "21:00"}, "wednesday": {"start": "18:00", "end": "21:00"}, "thursday": {"start": "18:00", "end": "21:00"}, "friday": {"start": "18:00", "end": "21:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM skills WHERE name = 'Spanish for Beginners'), 8, 1500, true, 35, '{"monday": {"start": "18:00", "end": "21:00"}, "tuesday": {"start": "18:00", "end": "21:00"}, "wednesday": {"start": "18:00", "end": "21:00"}, "thursday": {"start": "18:00", "end": "21:00"}, "friday": {"start": "18:00", "end": "21:00"}}', NOW()),
('550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM skills WHERE name = 'Public Speaking & Presentation'), 7, 1000, true, 50, '{"monday": {"start": "18:00", "end": "21:00"}, "tuesday": {"start": "18:00", "end": "21:00"}, "wednesday": {"start": "18:00", "end": "21:00"}, "thursday": {"start": "18:00", "end": "21:00"}, "friday": {"start": "18:00", "end": "21:00"}}', NOW());

-- Insert sample posts (skill offers and requests)
INSERT INTO posts (user_id, title, description, category, type, price, location, skills_required, skills_offered, is_active, is_boosted, boost_expires_at, created_at) VALUES
-- Skill Offers
('550e8400-e29b-41d4-a716-446655440001', 'Learn React.js from Scratch - Complete Course', 'Master React.js development with hands-on projects. Perfect for beginners who want to build modern web applications. We''ll cover components, hooks, state management, and deployment.', 'Programming', 'offer', 150, 'Bangalore, India', '{"JavaScript Fundamentals"}', '{"React.js Development", "JavaScript", "Web Development"}', true, true, NOW() + INTERVAL '7 days', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'UI/UX Design Workshop - Create Beautiful Interfaces', 'Learn the fundamentals of user interface and user experience design. We''ll work on real projects and create a portfolio-worthy design system.', 'Design', 'offer', 120, 'Mumbai, India', '{}', '{"UI/UX Design Principles", "Figma", "Design Thinking"}', true, false, NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Digital Marketing Masterclass - Grow Your Business', 'Learn proven digital marketing strategies including SEO, social media marketing, email campaigns, and conversion optimization.', 'Business', 'offer', 100, 'Delhi, India', '{}', '{"Digital Marketing Strategy", "SEO", "Social Media Marketing"}', true, false, NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'English Conversation Practice - Speak with Confidence', 'Improve your English speaking skills through structured conversation practice. Perfect for non-native speakers looking to build confidence.', 'Language', 'offer', 25, 'Kolkata, India', '{}', '{"English Conversation", "Speaking Practice", "Language Learning"}', true, false, NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Data Science with Python - From Zero to Hero', 'Comprehensive data science course covering pandas, numpy, matplotlib, and machine learning. Perfect for career changers and aspiring data scientists.', 'Programming', 'offer', 200, 'Chennai, India', '{}', '{"Python for Data Science", "Machine Learning", "Data Analysis"}', true, true, NOW() + INTERVAL '14 days', NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Photography Fundamentals - Capture Amazing Photos', 'Learn composition, lighting, and camera techniques to take professional-quality photographs. Includes hands-on outdoor shooting sessions.', 'Arts', 'offer', 80, 'Mumbai, India', '{}', '{"Photography", "Composition", "Camera Techniques"}', true, false, NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Agile Project Management Certification Prep', 'Prepare for PMI-ACP or CSM certification with real-world project management scenarios and best practices.', 'Business', 'offer', 160, 'Pune, India', '{}', '{"Project Management", "Agile", "Scrum", "Leadership"}', true, false, NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Spanish for Beginners - Learn from Native Speaker', 'Master Spanish language fundamentals with a native speaker. Perfect for beginners who want to learn conversational Spanish.', 'Language', 'offer', 30, 'Hyderabad, India', '{}', '{"Spanish for Beginners", "Conversation Practice", "Language Learning"}', true, false, NULL, NOW()),

-- Skill Requests
('550e8400-e29b-41d4-a716-446655440001', 'Looking for Advanced AWS Cloud Architecture Training', 'I need help with complex AWS solutions including microservices, serverless architecture, and cost optimization strategies.', 'Technology', 'request', 200, 'Bangalore, India', '{"AWS Cloud Architecture", "Microservices", "Serverless"}', '{"JavaScript", "Node.js", "React"}', true, false, NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Need Help with Video Editing and Post-Production', 'Looking for someone to teach me professional video editing techniques using Premiere Pro and After Effects.', 'Design', 'request', 120, 'Mumbai, India', '{"Video Editing", "Premiere Pro", "After Effects"}', '{"UI/UX Design", "Figma", "Photoshop"}', true, false, NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Want to Learn Advanced SEO and Content Marketing', 'Looking to enhance my digital marketing skills with advanced SEO techniques and content marketing strategies.', 'Business', 'request', 150, 'Delhi, India', '{"Advanced SEO", "Content Marketing", "Analytics"}', '{"Digital Marketing", "SEO", "Social Media"}', true, false, NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Seeking Music Production and Audio Engineering Help', 'I''m a beginner looking to learn music production using Ableton Live and basic audio engineering principles.', 'Arts', 'request', 100, 'Kolkata, India', '{"Music Production", "Ableton Live", "Audio Engineering"}', '{"English Teaching", "Language Learning", "Communication"}', true, false, NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Need Advanced Machine Learning and AI Training', 'Looking for expert guidance in advanced machine learning algorithms, deep learning, and AI model deployment.', 'Technology', 'request', 250, 'Chennai, India', '{"Advanced ML", "Deep Learning", "AI Deployment"}', '{"Python", "Data Science", "Machine Learning"}', true, false, NULL, NOW());

-- Insert sample matches
INSERT INTO matches (post_id, user_id, matched_user_id, status, message, created_at) VALUES
((SELECT id FROM posts WHERE title = 'Learn React.js from Scratch - Complete Course'), '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'accepted', 'Hi karthikesh! I''m really interested in learning React.js. I have some JavaScript experience and would love to work with you on this course.', NOW()),
((SELECT id FROM posts WHERE title = 'UI/UX Design Workshop - Create Beautiful Interfaces'), '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'pending', 'karthik, your design work looks amazing! I''d love to learn UI/UX design from you. When would be a good time to start?', NOW()),
((SELECT id FROM posts WHERE title = 'Data Science with Python - From Zero to Hero'), '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'accepted', 'Md muskan, I''m excited about your data science course! I''m looking to transition into this field and your expertise would be invaluable.', NOW()),
((SELECT id FROM posts WHERE title = 'Looking for Advanced AWS Cloud Architecture Training'), '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'accepted', 'karthikesh, I can definitely help you with AWS architecture. I''ve been working with AWS for 3+ years and have experience with microservices and serverless.', NOW()),
((SELECT id FROM posts WHERE title = 'Need Help with Video Editing and Post-Production'), '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'pending', 'karthik, I''d be happy to teach you video editing! I have extensive experience with Premiere Pro and After Effects.', NOW());

-- Insert sample chats
INSERT INTO chats (match_id, user1_id, user2_id, last_message, last_message_at, created_at) VALUES
((SELECT id FROM matches WHERE message LIKE '%React.js%'), '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Great! Let''s schedule our first session for next Tuesday at 2 PM. Does that work for you?', NOW(), NOW()),
((SELECT id FROM matches WHERE message LIKE '%data science%'), '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'Perfect! I''ll send you the course materials and we can start with the basics of pandas and numpy.', NOW(), NOW()),
((SELECT id FROM matches WHERE message LIKE '%AWS%'), '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'I''ll prepare a comprehensive AWS architecture overview for our first session. We''ll cover VPC, EC2, Lambda, and more.', NOW(), NOW());

-- Insert sample messages
INSERT INTO messages (chat_id, sender_id, content, is_read, created_at) VALUES
-- Chat 1: karthikesh.M & karthik (React.js course)
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440001' AND user2_id = '550e8400-e29b-41d4-a716-446655440002'), '550e8400-e29b-41d4-a716-446655440002', 'Hi karthikesh! I''m really excited about learning React.js with you. I have some JavaScript experience and have been working with HTML/CSS for a while.', true, NOW() - INTERVAL '2 hours'),
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440001' AND user2_id = '550e8400-e29b-41d4-a716-446655440002'), '550e8400-e29b-41d4-a716-446655440001', 'That''s perfect, karthik! Your background in HTML/CSS and JavaScript will make the React learning curve much smoother. What specific aspects of React are you most interested in?', true, NOW() - INTERVAL '1 hour'),
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440001' AND user2_id = '550e8400-e29b-41d4-a716-446655440002'), '550e8400-e29b-41d4-a716-446655440002', 'I''m particularly interested in component architecture and state management. I''ve heard about hooks and Redux - are those covered in your course?', true, NOW() - INTERVAL '30 minutes'),
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440001' AND user2_id = '550e8400-e29b-41d4-a716-446655440002'), '550e8400-e29b-41d4-a716-446655440001', 'Absolutely! We''ll cover both hooks and Redux in detail. The course is structured to start with basic components and gradually move to more advanced concepts like state management and routing.', true, NOW() - INTERVAL '15 minutes'),

-- Chat 2: Md suhana & Md muskan (Data Science)
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440004' AND user2_id = '550e8400-e29b-41d4-a716-446655440005'), '550e8400-e29b-41d4-a716-446655440004', 'Hi Md muskan! I''m really excited about your data science course. I''m looking to transition from teaching into data analysis. What should I expect?', true, NOW() - INTERVAL '3 hours'),
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440004' AND user2_id = '550e8400-e29b-41d4-a716-446655440005'), '550e8400-e29b-41d4-a716-446655440005', 'That''s a great transition, Md suhana! Your teaching background will actually be very valuable in data science. We''ll start with Python basics and then move into data analysis with pandas, visualization with matplotlib, and eventually machine learning.', true, NOW() - INTERVAL '2 hours'),
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440004' AND user2_id = '550e8400-e29b-41d4-a716-446655440005'), '550e8400-e29b-41d4-a716-446655440004', 'Perfect! I''ve already started learning Python basics. Should I brush up on statistics before we begin?', true, NOW() - INTERVAL '1 hour'),
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440004' AND user2_id = '550e8400-e29b-41d4-a716-446655440005'), '550e8400-e29b-41d4-a716-446655440005', 'Basic statistics knowledge would be helpful, but I''ll cover the essential concepts as we go. The course is designed to be accessible to beginners while still being comprehensive.', true, NOW() - INTERVAL '30 minutes'),

-- Chat 3: karthikesh.M & Md muskan (AWS)
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440001' AND user2_id = '550e8400-e29b-41d4-a716-446655440005'), '550e8400-e29b-41d4-a716-446655440001', 'Hi Md muskan! I''m looking for advanced AWS training, particularly around microservices and serverless architecture. Can you help?', true, NOW() - INTERVAL '4 hours'),
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440001' AND user2_id = '550e8400-e29b-41d4-a716-446655440005'), '550e8400-e29b-41d4-a716-446655440005', 'Absolutely, karthikesh! I''ve been working with AWS for 3+ years and have extensive experience with microservices using ECS, Lambda, API Gateway, and more. What''s your current AWS experience level?', true, NOW() - INTERVAL '3 hours'),
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440001' AND user2_id = '550e8400-e29b-41d4-a716-446655440005'), '550e8400-e29b-41d4-a716-446655440001', 'I have intermediate experience with EC2, S3, and RDS, but I need to learn more about containerization and serverless patterns for a new project at work.', true, NOW() - INTERVAL '2 hours'),
((SELECT id FROM chats WHERE user1_id = '550e8400-e29b-41d4-a716-446655440001' AND user2_id = '550e8400-e29b-41d4-a716-446655440005'), '550e8400-e29b-41d4-a716-446655440005', 'Perfect! We can build on your existing knowledge. I''ll create a custom curriculum covering Docker, ECS, Lambda, API Gateway, and best practices for microservices architecture.', true, NOW() - INTERVAL '1 hour');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, data, is_read, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'match_accepted', 'New Match!', 'karthik accepted your React.js course offer', '{"post_id": "post_1", "matched_user": "karthik"}', false, NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440002', 'new_message', 'New Message', 'You have a new message from karthikesh.M', '{"chat_id": "chat_1", "sender": "karthikesh.M"}', false, NOW() - INTERVAL '15 minutes'),
('550e8400-e29b-41d4-a716-446655440003', 'course_reminder', 'Course Reminder', 'Your Data Science course with Md muskan starts in 1 hour', '{"course_id": "course_1", "start_time": "2024-01-15T14:00:00Z"}', false, NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440004', 'skillcoin_earned', 'SkillCoins Earned!', 'You earned 25 SkillCoins for completing a lesson', '{"amount": 25, "reason": "lesson_completion"}', true, NOW() - INTERVAL '3 hours'),
('550e8400-e29b-41d4-a716-446655440005', 'new_match_request', 'New Match Request', 'karthikesh.M wants to learn AWS from you', '{"post_id": "post_5", "requester": "karthikesh.M"}', false, NOW() - INTERVAL '4 hours'),
('550e8400-e29b-41d4-a716-446655440006', 'review_received', 'New Review', 'You received a 5-star review from a student', '{"rating": 5, "reviewer": "Anonymous", "skill": "Photography"}', false, NOW() - INTERVAL '6 hours'),
('550e8400-e29b-41d4-a716-446655440007', 'premium_expiring', 'Premium Expiring', 'Your SkillPro Premium subscription expires in 3 days', '{"subscription_type": "premium", "expiry_date": "2024-01-18"}', false, NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440008', 'achievement_unlocked', 'Achievement Unlocked!', 'Congratulations! You unlocked the "Language Master" badge', '{"badge": "Language Master", "description": "Taught 10+ language lessons"}', true, NOW() - INTERVAL '2 days');

-- Insert sample skillcoin transactions
INSERT INTO skillcoin_ledger (from_user_id, to_user_id, amount, transaction_type, skill_id, description, status, created_at, completed_at) VALUES
-- Welcome bonuses
(NULL, '550e8400-e29b-41d4-a716-446655440001', 100, 'reward', NULL, 'Welcome bonus', 'completed', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
(NULL, '550e8400-e29b-41d4-a716-446655440002', 100, 'reward', NULL, 'Welcome bonus', 'completed', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
(NULL, '550e8400-e29b-41d4-a716-446655440003', 100, 'reward', NULL, 'Welcome bonus', 'completed', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
(NULL, '550e8400-e29b-41d4-a716-446655440004', 100, 'reward', NULL, 'Welcome bonus', 'completed', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(NULL, '550e8400-e29b-41d4-a716-446655440005', 100, 'reward', NULL, 'Welcome bonus', 'completed', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(NULL, '550e8400-e29b-41d4-a716-446655440006', 100, 'reward', NULL, 'Welcome bonus', 'completed', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(NULL, '550e8400-e29b-41d4-a716-446655440007', 100, 'reward', NULL, 'Welcome bonus', 'completed', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(NULL, '550e8400-e29b-41d4-a716-446655440008', 100, 'reward', NULL, 'Welcome bonus', 'completed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Course payments
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 150, 'spending', (SELECT id FROM skills WHERE name = 'React.js Development'), 'React.js course payment', 'completed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 200, 'spending', (SELECT id FROM skills WHERE name = 'Python for Data Science'), 'Data Science course payment', 'completed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 200, 'spending', (SELECT id FROM skills WHERE name = 'AWS Cloud Architecture'), 'AWS training payment', 'completed', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),

-- Earnings
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 150, 'earning', (SELECT id FROM skills WHERE name = 'React.js Development'), 'React.js course teaching', 'completed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 200, 'earning', (SELECT id FROM skills WHERE name = 'Python for Data Science'), 'Data Science course teaching', 'completed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 200, 'earning', (SELECT id FROM skills WHERE name = 'AWS Cloud Architecture'), 'AWS training teaching', 'completed', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),

-- Lesson completions
(NULL, '550e8400-e29b-41d4-a716-446655440002', 25, 'reward', (SELECT id FROM skills WHERE name = 'React.js Development'), 'Lesson completion bonus', 'completed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(NULL, '550e8400-e29b-41d4-a716-446655440004', 30, 'reward', (SELECT id FROM skills WHERE name = 'Python for Data Science'), 'Lesson completion bonus', 'completed', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
(NULL, '550e8400-e29b-41d4-a716-446655440006', 20, 'reward', (SELECT id FROM skills WHERE name = 'Photography & Composition'), 'Lesson completion bonus', 'completed', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours');

-- Insert sample learning sessions
INSERT INTO learning_sessions (student_id, teacher_id, skill_id, session_type, title, description, duration_minutes, skillcoins_cost, status, scheduled_at, started_at, completed_at, meeting_url, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM skills WHERE name = 'React.js Development'), 'live', 'React.js Fundamentals - Session 1', 'Introduction to React components and JSX syntax', 60, 75, 'completed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'https://meet.google.com/abc-defg-hij', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM skills WHERE name = 'Python for Data Science'), 'live', 'Python Data Analysis - Session 1', 'Introduction to pandas and data manipulation', 90, 100, 'completed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'https://meet.google.com/xyz-1234-567', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM skills WHERE name = 'AWS Cloud Architecture'), 'live', 'AWS Microservices Architecture', 'Designing scalable microservices with AWS services', 120, 100, 'scheduled', NOW() + INTERVAL '2 days', NULL, NULL, 'https://meet.google.com/aws-4567-890', NOW() - INTERVAL '4 hours'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM skills WHERE name = 'UI/UX Design Principles'), 'live', 'Design Thinking Workshop', 'Learn design thinking methodology and user research', 75, 60, 'scheduled', NOW() + INTERVAL '1 day', NULL, NULL, 'https://meet.google.com/design-7890-123', NOW() - INTERVAL '1 day');

-- Insert sample reviews
INSERT INTO reviews (reviewer_id, reviewee_id, session_id, skill_id, rating, title, content, is_verified, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM learning_sessions WHERE title = 'React.js Fundamentals - Session 1'), (SELECT id FROM skills WHERE name = 'React.js Development'), 5, 'Excellent React.js Course!', 'karthikesh.M is an amazing teacher! He explained complex React concepts in a way that was easy to understand. The hands-on approach really helped me grasp the fundamentals. Highly recommended!', true, NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM learning_sessions WHERE title = 'Python Data Analysis - Session 1'), (SELECT id FROM skills WHERE name = 'Python for Data Science'), 5, 'Great Data Science Introduction', 'Md muskan''s course is fantastic! She has a great way of breaking down complex data science concepts. The practical examples really helped me understand how to apply what I learned.', true, NOW() - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM learning_sessions WHERE title = 'Design Thinking Workshop'), (SELECT id FROM skills WHERE name = 'UI/UX Design Principles'), 4, 'Very Helpful Design Workshop', 'karthik''s design workshop was very informative. He has a great eye for design and explained the principles clearly. I learned a lot about user-centered design thinking.', false, NOW() - INTERVAL '6 hours');

-- Update user statistics based on sample data
UPDATE users SET 
  skill_coin_balance = (
    SELECT COALESCE(SUM(CASE WHEN to_user_id = users.id THEN amount ELSE -amount END), 100)
    FROM skillcoin_ledger 
    WHERE (from_user_id = users.id OR to_user_id = users.id) 
    AND status = 'completed'
  ),
  rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews 
    WHERE reviewee_id = users.id
  ),
  review_count = (
    SELECT COUNT(*)
    FROM reviews 
    WHERE reviewee_id = users.id
  )
WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440009'
);

-- Success message
SELECT 'SkillChain sample data inserted successfully!' as message,
       (SELECT COUNT(*) FROM skills) as total_skills,
       (SELECT COUNT(*) FROM users) as total_users,
       (SELECT COUNT(*) FROM posts) as total_posts,
       (SELECT COUNT(*) FROM matches) as total_matches,
       (SELECT COUNT(*) FROM learning_sessions) as total_sessions;
