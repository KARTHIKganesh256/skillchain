# SkillChain API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://api.skillchain.com`

## Authentication

All API endpoints (except public ones) require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "fullName": "Full Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "fullName": "Full Name",
      "isVerified": false,
      "stats": {
        "skillcoins": 100,
        "level": 1,
        "xp": 0
      }
    },
    "token": "jwt_token"
  },
  "message": "User registered successfully"
}
```

#### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token"
  },
  "message": "Login successful"
}
```

#### POST /api/auth/logout
Logout user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET /api/auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "fullName": "Full Name",
      "avatarUrl": "https://...",
      "bio": "User bio",
      "location": "City, Country",
      "timezone": "UTC",
      "language": "en",
      "isVerified": false,
      "isPremium": false,
      "preferences": {
        "notifications": true,
        "privacy": "public",
        "theme": "light"
      },
      "stats": {
        "skillcoins": 100,
        "level": 1,
        "xp": 0,
        "skillsLearned": 0,
        "skillsTaught": 0,
        "hoursLearned": 0,
        "hoursTaught": 0
      },
      "lastActive": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Users

#### GET /api/users
Get all users (with pagination and filters).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term
- `location` (optional): Filter by location
- `skills` (optional): Filter by skills (comma-separated)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "username": "username",
        "fullName": "Full Name",
        "avatarUrl": "https://...",
        "location": "City, Country",
        "skills": [
          {
            "name": "Python",
            "level": 8,
            "isTeaching": true
          }
        ],
        "stats": {
          "level": 12,
          "skillsLearned": 5,
          "skillsTaught": 3
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

#### GET /api/users/:id
Get user by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "username",
      "fullName": "Full Name",
      "avatarUrl": "https://...",
      "bio": "User bio",
      "location": "City, Country",
      "skills": [...],
      "stats": {...},
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### PUT /api/users/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "New Full Name",
  "bio": "Updated bio",
  "location": "New City, Country",
  "timezone": "UTC",
  "language": "en",
  "preferences": {
    "notifications": true,
    "privacy": "public",
    "theme": "dark"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... }
  },
  "message": "Profile updated successfully"
}
```

### Skills

#### GET /api/skills
Get all skills (with pagination and filters).

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by category
- `search` (optional): Search term
- `difficulty` (optional): Filter by difficulty level

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "id": "skill_id",
        "name": "Python",
        "description": "Python programming language",
        "category": "programming",
        "subcategory": "backend",
        "difficultyLevel": 5,
        "estimatedHours": 200,
        "prerequisites": ["Basic Programming"],
        "tags": ["python", "programming", "backend"],
        "isVerified": true,
        "marketValue": 75000,
        "demandScore": 0.85,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "pages": 25
    }
  }
}
```

#### GET /api/skills/:id
Get skill by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "skill": {
      "id": "skill_id",
      "name": "Python",
      "description": "Python programming language",
      "category": "programming",
      "difficultyLevel": 5,
      "estimatedHours": 200,
      "prerequisites": ["Basic Programming"],
      "tags": ["python", "programming"],
      "isVerified": true,
      "marketValue": 75000,
      "demandScore": 0.85,
      "relatedSkills": [
        {
          "id": "related_skill_id",
          "name": "Django",
          "connectionStrength": 0.8
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /api/skills
Create new skill.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Skill",
  "description": "Skill description",
  "category": "programming",
  "subcategory": "backend",
  "difficultyLevel": 5,
  "estimatedHours": 100,
  "prerequisites": ["Basic Programming"],
  "tags": ["new", "skill"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "skill": { ... }
  },
  "message": "Skill created successfully"
}
```

### User Skills

#### GET /api/users/skills
Get current user's skills.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "id": "user_skill_id",
        "skill": {
          "id": "skill_id",
          "name": "Python",
          "category": "programming"
        },
        "proficiencyLevel": 8,
        "experienceHours": 2000,
        "isTeaching": true,
        "hourlyRate": 75,
        "availabilitySchedule": {
          "monday": ["09:00-17:00"],
          "tuesday": ["09:00-17:00"]
        },
        "certifications": ["Python Institute PCAP"],
        "portfolio": ["project1.com", "project2.com"],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /api/users/skills
Add skill to user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "skillId": "skill_id",
  "proficiencyLevel": 6,
  "experienceHours": 500,
  "isTeaching": false,
  "hourlyRate": 50
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userSkill": { ... }
  },
  "message": "Skill added successfully"
}
```

#### PUT /api/users/skills/:id
Update user skill.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "proficiencyLevel": 7,
  "experienceHours": 600,
  "isTeaching": true,
  "hourlyRate": 60
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userSkill": { ... }
  },
  "message": "Skill updated successfully"
}
```

#### DELETE /api/users/skills/:id
Remove skill from user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Skill removed successfully"
}
```

### Learning Sessions

#### GET /api/learning/sessions
Get learning sessions.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `type` (optional): `student` or `teacher`
- `status` (optional): `scheduled`, `in_progress`, `completed`
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session_id",
        "student": {
          "id": "student_id",
          "name": "Student Name",
          "avatar": "https://..."
        },
        "teacher": {
          "id": "teacher_id",
          "name": "Teacher Name",
          "avatar": "https://..."
        },
        "skill": {
          "id": "skill_id",
          "name": "Python"
        },
        "sessionType": "live",
        "title": "Python Basics",
        "description": "Learn Python fundamentals",
        "durationMinutes": 60,
        "skillcoinsCost": 100,
        "status": "scheduled",
        "scheduledAt": "2024-01-20T10:00:00Z",
        "meetingUrl": "https://meet.example.com/room",
        "createdAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

#### POST /api/learning/sessions
Create new learning session.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teacherId": "teacher_id",
  "skillId": "skill_id",
  "sessionType": "live",
  "title": "Python Basics",
  "description": "Learn Python fundamentals",
  "durationMinutes": 60,
  "skillcoinsCost": 100,
  "scheduledAt": "2024-01-20T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": { ... }
  },
  "message": "Session created successfully"
}
```

#### PUT /api/learning/sessions/:id
Update learning session.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "scheduledAt": "2024-01-21T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": { ... }
  },
  "message": "Session updated successfully"
}
```

#### POST /api/learning/sessions/:id/start
Start learning session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "session": { ... },
    "meetingUrl": "https://meet.example.com/room"
  },
  "message": "Session started successfully"
}
```

#### POST /api/learning/sessions/:id/complete
Complete learning session.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "notes": "Session notes",
  "rating": 5,
  "feedback": "Great session!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": { ... }
  },
  "message": "Session completed successfully"
}
```

### Challenges

#### GET /api/challenges
Get all challenges.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `difficulty` (optional): Filter by difficulty
- `skill` (optional): Filter by skill ID
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": "challenge_id",
        "title": "Build a Full-Stack App",
        "description": "Create a complete web application",
        "skill": {
          "id": "skill_id",
          "name": "Full-Stack Development"
        },
        "difficultyLevel": 7,
        "skillcoinsReward": 1000,
        "xpReward": 500,
        "requirements": {
          "technologies": ["React", "Node.js", "MongoDB"],
          "features": ["Authentication", "CRUD operations", "Deployment"]
        },
        "deadline": "2024-02-01T23:59:59Z",
        "maxParticipants": 100,
        "status": "active",
        "participants": 45,
        "createdBy": {
          "id": "creator_id",
          "name": "Creator Name"
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "pages": 2
    }
  }
}
```

#### POST /api/challenges
Create new challenge.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "New Challenge",
  "description": "Challenge description",
  "skillId": "skill_id",
  "difficultyLevel": 5,
  "skillcoinsReward": 500,
  "xpReward": 250,
  "requirements": {
    "technologies": ["React", "Node.js"],
    "features": ["Authentication"]
  },
  "deadline": "2024-02-01T23:59:59Z",
  "maxParticipants": 50
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "challenge": { ... }
  },
  "message": "Challenge created successfully"
}
```

#### POST /api/challenges/:id/join
Join challenge.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "participation": { ... }
  },
  "message": "Successfully joined challenge"
}
```

#### POST /api/challenges/:id/submit
Submit challenge solution.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "submissionUrl": "https://github.com/user/project",
  "submissionText": "Project description and features"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission": { ... }
  },
  "message": "Submission submitted successfully"
}
```

### SkillCoins

#### GET /api/skillcoins/balance
Get user's SkillCoin balance.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 2500,
    "transactions": [
      {
        "id": "transaction_id",
        "type": "earning",
        "amount": 100,
        "description": "Completed Python session",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### GET /api/skillcoins/transactions
Get SkillCoin transaction history.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Transaction type

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "transaction_id",
        "type": "earning",
        "amount": 100,
        "description": "Completed Python session",
        "timestamp": "2024-01-15T10:30:00Z",
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

#### POST /api/skillcoins/transfer
Transfer SkillCoins to another user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "toUserId": "recipient_id",
  "amount": 100,
  "description": "Payment for session"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": { ... }
  },
  "message": "Transfer initiated successfully"
}
```

### AI Services

#### POST /ai-api/skill-value/calculate
Calculate skill market value.

**Request Body:**
```json
{
  "skill_name": "Python",
  "user_experience": 8,
  "market_demand": 0.85,
  "complexity": 6,
  "location": "San Francisco",
  "industry": "Technology"
}
```

**Response:**
```json
{
  "skill_name": "Python",
  "estimated_value": 85000,
  "confidence_score": 0.92,
  "factors": {
    "base_value": 75000,
    "modifiers": {
      "complexity_factor": 1.2,
      "location_factor": 1.3,
      "industry_factor": 1.1,
      "total_multiplier": 1.716
    },
    "market_demand": 0.85,
    "location_factor": 1.3,
    "industry_factor": 1.1
  },
  "recommendations": [
    "High market demand - great time to monetize this skill",
    "Consider specializing in advanced areas of this skill"
  ]
}
```

#### POST /ai-api/learning/question
Ask AI learning question.

**Request Body:**
```json
{
  "question": "How do I implement authentication in React?",
  "skill_id": "react_skill_id",
  "user_id": "user_id",
  "context": {
    "current_level": 5,
    "learning_goals": ["Master React", "Build portfolio"]
  },
  "language": "en"
}
```

**Response:**
```json
{
  "answer": "Authentication in React can be implemented using several approaches...",
  "confidence": 0.88,
  "related_questions": [
    "How do I handle JWT tokens in React?",
    "What are the best practices for React authentication?"
  ],
  "learning_resources": [
    {
      "title": "React Authentication Tutorial",
      "type": "tutorial",
      "url": "/tutorials/react-auth"
    }
  ],
  "next_steps": [
    "Practice with a simple login form",
    "Learn about JWT token management",
    "Explore OAuth integration"
  ]
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_REQUIRED` | Authentication token required |
| `INVALID_TOKEN` | Invalid or expired token |
| `USER_NOT_FOUND` | User not found |
| `SKILL_NOT_FOUND` | Skill not found |
| `INSUFFICIENT_SKILLCOINS` | Not enough SkillCoins for transaction |
| `SESSION_NOT_FOUND` | Learning session not found |
| `CHALLENGE_NOT_FOUND` | Challenge not found |
| `DUPLICATE_ERROR` | Duplicate resource exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

- **General API**: 100 requests per minute
- **Authentication**: 10 requests per minute
- **AI Services**: 50 requests per minute
- **File Upload**: 10 requests per minute

## WebSocket Events

### Connection
```javascript
const socket = io('ws://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### `session:update`
Real-time session updates.

```javascript
socket.on('session:update', (data) => {
  console.log('Session updated:', data);
});
```

#### `notification:new`
New notification received.

```javascript
socket.on('notification:new', (notification) => {
  console.log('New notification:', notification);
});
```

#### `skill:progress`
Skill progress updated.

```javascript
socket.on('skill:progress', (progress) => {
  console.log('Skill progress:', progress);
});
```

#### `chat:message`
Real-time chat messages.

```javascript
socket.on('chat:message', (message) => {
  console.log('New message:', message);
});

// Send message
socket.emit('chat:message', {
  sessionId: 'session_id',
  message: 'Hello!',
  type: 'text'
});
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import { SkillChainAPI } from '@skillchain/api-client';

const api = new SkillChainAPI({
  baseURL: 'https://api.skillchain.com',
  token: 'your-jwt-token'
});

// Get user profile
const user = await api.users.getProfile();

// Get skills
const skills = await api.skills.getAll({
  category: 'programming',
  page: 1,
  limit: 20
});

// Create learning session
const session = await api.learning.createSession({
  teacherId: 'teacher_id',
  skillId: 'skill_id',
  title: 'Python Basics',
  durationMinutes: 60,
  skillcoinsCost: 100
});
```

### Python

```python
from skillchain import SkillChainAPI

api = SkillChainAPI(
    base_url='https://api.skillchain.com',
    token='your-jwt-token'
)

# Get user profile
user = api.users.get_profile()

# Get skills
skills = api.skills.get_all(
    category='programming',
    page=1,
    limit=20
)

# Create learning session
session = api.learning.create_session(
    teacher_id='teacher_id',
    skill_id='skill_id',
    title='Python Basics',
    duration_minutes=60,
    skillcoins_cost=100
)
```

This API documentation provides comprehensive information about all available endpoints, request/response formats, error handling, and integration examples. Use this as a reference when building applications that interact with the SkillChain platform.

