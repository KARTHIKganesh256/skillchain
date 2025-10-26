from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
import json

app = FastAPI(title="SkillChain AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://karthikganesh256.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SkillCalculationRequest(BaseModel):
    skill: str
    level: int
    experience_years: Optional[int] = 0
    market_demand: Optional[str] = "medium"

class LearningRequest(BaseModel):
    question: str
    language: Optional[str] = "en"
    context: Optional[str] = ""

class SkillMatchRequest(BaseModel):
    user_skills: List[str]
    target_skills: List[str]
    user_level: Optional[int] = 5

class VoiceRequest(BaseModel):
    audio_text: str
    language: str = "en"
    target_language: Optional[str] = None

class DisputeRequest(BaseModel):
    dispute_id: str
    description: str
    evidence: List[str]
    parties: List[str]

@app.get("/")
async def root():
    return {"message": "SkillChain AI API is running!", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "AI API is working"}

# 1. AI Smart Skill Value Calculator
@app.post("/api/skills/calculate")
async def calculate_skill_value(request: SkillCalculationRequest):
    """Calculate skill value using AI with market analysis"""
    
    # Market demand multipliers
    demand_multipliers = {
        "very_high": 1.5,
        "high": 1.3,
        "medium": 1.0,
        "low": 0.7
    }
    
    # Base value calculation
    base_value = 50000
    level_multiplier = request.level * 0.2
    experience_bonus = request.experience_years * 1000
    demand_bonus = demand_multipliers.get(request.market_demand, 1.0)
    
    # AI-enhanced calculation
    value = int((base_value + experience_bonus) * (1 + level_multiplier) * demand_bonus)
    
    # Market analysis
    market_analysis = {
        "current_demand": f"{request.market_demand} demand",
        "salary_range": f"${value//1000}k - ${value//800}k annually",
        "growth_potential": "High" if request.level > 6 else "Medium",
        "competition_level": "Low" if request.level > 7 else "Medium"
    }
    
    return {
        "skill": request.skill,
        "level": request.level,
        "estimated_value": value,
        "confidence": 0.92,
        "market_analysis": market_analysis,
        "recommendations": [
            f"Focus on {request.skill} advanced concepts",
            "Build portfolio projects",
            "Get industry certifications"
        ]
    }

# 2. SkillGraph Network Visualization Data
@app.get("/api/skillgraph/data")
async def get_skill_graph_data():
    """Generate skill network data for D3.js visualization"""
    
    nodes = [
        {"id": "JavaScript", "group": 1, "level": 8, "value": 100, "category": "Programming"},
        {"id": "React", "group": 1, "level": 6, "value": 90, "category": "Frontend"},
        {"id": "Node.js", "group": 1, "level": 5, "value": 85, "category": "Backend"},
        {"id": "TypeScript", "group": 1, "level": 6, "value": 88, "category": "Programming"},
        {"id": "Python", "group": 2, "level": 7, "value": 95, "category": "Programming"},
        {"id": "Django", "group": 2, "level": 4, "value": 75, "category": "Backend"},
        {"id": "AWS", "group": 3, "level": 7, "value": 92, "category": "Cloud"},
        {"id": "Docker", "group": 3, "level": 5, "value": 80, "category": "DevOps"}
    ]
    
    links = [
        {"source": "JavaScript", "target": "React", "value": 5, "type": "prerequisite"},
        {"source": "JavaScript", "target": "Node.js", "value": 3, "type": "related"},
        {"source": "JavaScript", "target": "TypeScript", "value": 4, "type": "enhancement"},
        {"source": "Python", "target": "Django", "value": 4, "type": "framework"},
        {"source": "Node.js", "target": "AWS", "value": 2, "type": "deployment"},
        {"source": "Node.js", "target": "Docker", "value": 3, "type": "containerization"}
    ]
    
    return {
        "nodes": nodes,
        "links": links,
        "metadata": {
            "total_skills": len(nodes),
            "connections": len(links),
            "categories": list(set(node["category"] for node in nodes))
        }
    }

# 3. Reels & AI Learning Q&A with Speech Recognition
@app.post("/api/learning/assist")
async def learning_assistance(request: LearningRequest):
    """AI Learning Assistant with multilingual support"""
    
    # Enhanced AI responses based on context
    responses = {
        "javascript": {
            "en": "JavaScript is a versatile programming language. Start with variables, functions, and DOM manipulation. Practice with projects like todo apps and interactive websites.",
            "es": "JavaScript es un lenguaje de programación versátil. Comienza con variables, funciones y manipulación del DOM.",
            "fr": "JavaScript est un langage de programmation polyvalent. Commencez par les variables, fonctions et manipulation du DOM."
        },
        "python": {
            "en": "Python is great for beginners! Focus on syntax, data structures, and libraries like pandas and numpy. Try building data analysis projects.",
            "es": "¡Python es excelente para principiantes! Enfócate en sintaxis, estructuras de datos y bibliotecas como pandas y numpy.",
            "fr": "Python est excellent pour les débutants! Concentrez-vous sur la syntaxe, les structures de données et les bibliothèques comme pandas et numpy."
        },
        "react": {
            "en": "React is a powerful library for building UIs. Learn components, state management, and hooks. Build projects like a weather app or portfolio site.",
            "es": "React es una biblioteca poderosa para construir interfaces de usuario. Aprende componentes, gestión de estado y hooks.",
            "fr": "React est une bibliothèque puissante pour construire des interfaces utilisateur. Apprenez les composants, la gestion d'état et les hooks."
        }
    }
    
    # Find matching response
    answer = f"Great question about '{request.question}'! Here's a comprehensive response: This is an important topic in skill development. I recommend starting with the fundamentals, practicing regularly, and building real projects to solidify your understanding."
    
    for keyword, lang_responses in responses.items():
        if keyword in request.question.lower():
            answer = lang_responses.get(request.language, lang_responses["en"])
            break
    
    return {
        "question": request.question,
        "answer": answer,
        "language": request.language,
        "confidence": 0.9,
        "suggestions": [
            "Practice with hands-on projects",
            "Join online communities",
            "Find a mentor or study group",
            "Build a portfolio of work"
        ],
        "related_skills": ["TypeScript", "Node.js", "Web Development"],
        "difficulty_level": "Beginner to Intermediate"
    }

# 4. Verified Skill Demos & Peer Portfolios
@app.get("/api/portfolios/{user_id}")
async def get_user_portfolio(user_id: int):
    """Get verified skill portfolio for a user"""
    
    portfolios = {
        1: {
            "user_id": 1,
            "name": "John Doe",
            "verified_skills": [
                {
                    "skill": "JavaScript",
                    "level": 8,
                    "verification_date": "2024-01-15",
                    "certificates": ["JavaScript Advanced", "React Certification"],
                    "projects": ["E-commerce Platform", "Task Management App"],
                    "peer_reviews": 4.8
                },
                {
                    "skill": "React",
                    "level": 6,
                    "verification_date": "2024-01-10",
                    "certificates": ["React Fundamentals"],
                    "projects": ["Weather Dashboard", "Portfolio Website"],
                    "peer_reviews": 4.6
                }
            ],
            "total_verified_skills": 2,
            "portfolio_score": 4.7
        }
    }
    
    return portfolios.get(user_id, {
        "user_id": user_id,
        "name": "Unknown User",
        "verified_skills": [],
        "total_verified_skills": 0,
        "portfolio_score": 0.0
    })

# 5. AI Recommendations Dashboard
@app.get("/api/recommendations/{user_id}")
async def get_recommendations(user_id: int):
    """Get personalized skill recommendations with AI analysis"""
    
    # Enhanced recommendations with market data
    recommendations = {
        1: [
            {
                "skill": "TypeScript",
                "reason": "Builds on your JavaScript knowledge",
                "priority": "high",
                "market_demand": 95,
                "salary_boost": "+15%",
                "learning_time": "4-6 weeks",
                "related_skills": ["JavaScript", "React", "Node.js"]
            },
            {
                "skill": "Next.js",
                "reason": "Popular React framework for production apps",
                "priority": "medium",
                "market_demand": 88,
                "salary_boost": "+12%",
                "learning_time": "3-4 weeks",
                "related_skills": ["React", "JavaScript", "Web Development"]
            },
            {
                "skill": "GraphQL",
                "reason": "Modern API technology with high demand",
                "priority": "low",
                "market_demand": 75,
                "salary_boost": "+18%",
                "learning_time": "2-3 weeks",
                "related_skills": ["JavaScript", "Node.js", "API Development"]
            }
        ]
    }
    
    return {
        "user_id": user_id,
        "recommendations": recommendations.get(user_id, [
            {
                "skill": "JavaScript",
                "reason": "Fundamental web development skill",
                "priority": "high",
                "market_demand": 90,
                "salary_boost": "+10%",
                "learning_time": "6-8 weeks",
                "related_skills": ["HTML", "CSS", "Web Development"]
            }
        ]),
        "market_insights": {
            "trending_skills": ["AI/ML", "Cloud Computing", "Cybersecurity"],
            "salary_trends": "Skills in AI/ML showing 25% salary increase",
            "demand_forecast": "Cloud and DevOps skills will be in high demand"
        }
    }

# 6. TimeToken Exchange (Secure escrow system)
@app.post("/api/timetoken/transaction")
async def create_timetoken_transaction(transaction_data: dict):
    """Create a secure TimeToken transaction with escrow"""
    
    transaction = {
        "transaction_id": f"TT_{transaction_data.get('id', '12345')}",
        "from_user": transaction_data.get('from_user'),
        "to_user": transaction_data.get('to_user'),
        "amount": transaction_data.get('amount', 0),
        "skill": transaction_data.get('skill'),
        "escrow_status": "locked",
        "smart_contract": "0x1234567890abcdef",
        "verification_required": True,
        "completion_criteria": [
            "Skill demonstration completed",
            "Peer review passed",
            "Quality assessment > 4.0"
        ],
        "dispute_window": "7 days",
        "auto_release": "14 days"
    }
    
    return {
        "status": "success",
        "transaction": transaction,
        "blockchain_hash": "0xabcdef1234567890",
        "gas_fee": "0.001 ETH"
    }

# 7. Gamification: Challenges, Badges, Leaderboards
@app.get("/api/gamification/challenges")
async def get_gamification_challenges():
    """Get challenges, badges, and leaderboard data"""
    
    challenges = [
        {
            "id": 1,
            "title": "JavaScript Master",
            "description": "Complete 10 JavaScript projects",
            "reward": 100,
            "difficulty": "medium",
            "time_limit": "30 days",
            "prerequisites": ["JavaScript Basics"],
            "progress_tracking": "project_based"
        },
        {
            "id": 2,
            "title": "React Ninja",
            "description": "Build 5 React applications",
            "reward": 150,
            "difficulty": "hard",
            "time_limit": "45 days",
            "prerequisites": ["React Fundamentals"],
            "progress_tracking": "app_based"
        }
    ]
    
    badges = [
        {
            "name": "First Steps",
            "description": "Complete your first skill",
            "icon": "🌱",
            "rarity": "common",
            "points": 10
        },
        {
            "name": "Quick Learner",
            "description": "Learn 3 skills in a week",
            "icon": "⚡",
            "rarity": "rare",
            "points": 50
        },
        {
            "name": "Mentor",
            "description": "Help 5 learners",
            "icon": "👨‍🏫",
            "rarity": "epic",
            "points": 100
        }
    ]
    
    leaderboard = [
        {"rank": 1, "name": "Alice Johnson", "points": 2450, "skills": 12},
        {"rank": 2, "name": "Bob Smith", "points": 2200, "skills": 10},
        {"rank": 3, "name": "Charlie Brown", "points": 1950, "skills": 9}
    ]
    
    return {
        "challenges": challenges,
        "badges": badges,
        "leaderboard": leaderboard,
        "user_stats": {
            "current_streak": 7,
            "total_points": 1250,
            "badges_earned": 5,
            "challenges_completed": 3
        }
    }

# 8. Real-world Skill Map (Google Maps API integration)
@app.get("/api/skillmap/locations")
async def get_skill_map_locations():
    """Get locations for skill meetups, workshops, and learning centers"""
    
    locations = [
        {
            "id": 1,
            "name": "JavaScript Meetup",
            "type": "meetup",
            "location": {"lat": 37.7749, "lng": -122.4194},
            "address": "San Francisco, CA",
            "date": "2024-02-15",
            "time": "18:00",
            "attendees": 45,
            "skill": "JavaScript",
            "level": "intermediate"
        },
        {
            "id": 2,
            "name": "React Workshop",
            "type": "workshop",
            "location": {"lat": 40.7128, "lng": -74.0060},
            "address": "New York, NY",
            "date": "2024-02-20",
            "time": "10:00",
            "attendees": 30,
            "skill": "React",
            "level": "beginner"
        },
        {
            "id": 3,
            "name": "Tech Learning Center",
            "type": "learning_center",
            "location": {"lat": 34.0522, "lng": -118.2437},
            "address": "Los Angeles, CA",
            "date": "ongoing",
            "time": "9:00-17:00",
            "attendees": 200,
            "skill": "Multiple",
            "level": "all"
        }
    ]
    
    return {
        "locations": locations,
        "total_events": len(locations),
        "nearby_radius": "50km",
        "filter_options": {
            "skills": ["JavaScript", "React", "Python", "Node.js"],
            "event_types": ["meetup", "workshop", "learning_center"],
            "levels": ["beginner", "intermediate", "advanced"]
        }
    }

# 9. Multilingual AI Voice Bot
@app.post("/api/voice/process")
async def process_voice_input(request: VoiceRequest):
    """Process voice input with speech-to-text and translation"""
    
    # Mock speech-to-text processing
    processed_text = request.audio_text
    
    # Translation if target language is different
    if request.target_language and request.target_language != request.language:
        translations = {
            "es": "JavaScript es un lenguaje de programación versátil. Comienza con variables, funciones y manipulación del DOM.",
            "fr": "JavaScript est un langage de programmation polyvalent. Commencez par les variables, fonctions et manipulation du DOM.",
            "de": "JavaScript ist eine vielseitige Programmiersprache. Beginnen Sie mit Variablen, Funktionen und DOM-Manipulation."
        }
        processed_text = translations.get(request.target_language, processed_text)
    
    # AI response generation
    ai_response = f"Based on your question about '{processed_text}', here's my response: This is an important skill development topic. I recommend starting with fundamentals and building practical projects."
    
    return {
        "original_text": request.audio_text,
        "processed_text": processed_text,
        "language": request.language,
        "target_language": request.target_language,
        "ai_response": ai_response,
        "confidence": 0.95,
        "translation_accuracy": 0.92,
        "suggestions": [
            "Practice speaking the language",
            "Join language-specific communities",
            "Use voice commands for learning"
        ]
    }

# 10. Dispute Resolution & Review System
@app.post("/api/disputes/create")
async def create_dispute(request: DisputeRequest):
    """Create a new dispute with AI-assisted analysis"""
    
    dispute = {
        "dispute_id": request.dispute_id,
        "description": request.description,
        "parties": request.parties,
        "evidence": request.evidence,
        "status": "under_review",
        "ai_analysis": {
            "sentiment_score": 0.3,  # Negative sentiment
            "complexity_level": "medium",
            "recommended_mediator": "AI Mediator Bot",
            "estimated_resolution_time": "3-5 days"
        },
        "resolution_steps": [
            "Evidence review",
            "AI analysis",
            "Mediator assignment",
            "Resolution proposal",
            "Final decision"
        ],
        "created_at": "2024-01-15T10:30:00Z"
    }
    
    return {
        "status": "success",
        "dispute": dispute,
        "next_steps": [
            "Evidence will be reviewed within 24 hours",
            "AI analysis will be completed within 48 hours",
            "Mediator will be assigned automatically"
        ]
    }

@app.get("/api/disputes/{dispute_id}/resolution")
async def get_dispute_resolution(dispute_id: str):
    """Get AI-assisted dispute resolution"""
    
    return {
        "dispute_id": dispute_id,
        "ai_analysis": {
            "evidence_strength": 0.8,
            "party_credibility": {"party_a": 0.9, "party_b": 0.7},
            "recommended_outcome": "Partial refund with skill re-verification",
            "confidence": 0.85
        },
        "resolution_proposal": {
            "action": "Refund 60% of payment",
            "reasoning": "Skill demonstration was incomplete but showed effort",
            "conditions": [
                "Re-attempt skill demonstration",
                "Peer review required",
                "Quality assessment > 3.5"
            ]
        },
        "mediator_notes": "AI analysis suggests both parties have valid points. Recommended compromise solution."
    }

# Additional utility endpoints
@app.get("/api/trending/skills")
async def get_trending_skills():
    """Get trending skills in the market"""
    return {
        "trending_skills": [
            {"name": "AI/ML", "growth": 45, "demand": "very_high", "salary_range": "$80k-$150k"},
            {"name": "Cloud Computing", "growth": 35, "demand": "high", "salary_range": "$70k-$130k"},
            {"name": "Cybersecurity", "growth": 40, "demand": "high", "salary_range": "$75k-$140k"},
            {"name": "Data Science", "growth": 30, "demand": "high", "salary_range": "$65k-$120k"},
            {"name": "DevOps", "growth": 25, "demand": "medium", "salary_range": "$60k-$110k"}
        ],
        "emerging_skills": [
            "Quantum Computing",
            "Blockchain Development",
            "IoT Development",
            "AR/VR Development"
        ],
        "market_insights": {
            "hot_skills": ["AI/ML", "Cybersecurity", "Cloud Computing"],
            "declining_skills": ["Flash", "jQuery", "Internet Explorer"],
            "future_skills": ["Quantum Computing", "Brain-Computer Interfaces"]
        }
    }

@app.post("/api/learning/quiz")
async def generate_quiz(request: dict):
    """Generate a skill assessment quiz"""
    skill = request.get("skill", "JavaScript")
    level = request.get("level", "beginner")
    
    # Enhanced quiz questions
    questions = {
        "JavaScript": [
            {
                "question": "What is the difference between let and var?",
                "options": [
                    "let has block scope, var has function scope",
                    "var has block scope, let has function scope",
                    "They are identical",
                    "let is deprecated"
                ],
                "correct": 0,
                "explanation": "let has block scope while var has function scope",
                "difficulty": "medium"
            },
            {
                "question": "What does 'this' refer to in JavaScript?",
                "options": [
                    "The current function",
                    "The current object",
                    "The global object",
                    "It depends on how the function is called"
                ],
                "correct": 3,
                "explanation": "The value of 'this' depends on how the function is called",
                "difficulty": "hard"
            }
        ],
        "Python": [
            {
                "question": "What is a list comprehension?",
                "options": [
                    "A way to create lists using a single line",
                    "A method to sort lists",
                    "A way to delete list items",
                    "A function to print lists"
                ],
                "correct": 0,
                "explanation": "List comprehensions provide a concise way to create lists",
                "difficulty": "easy"
            }
        ]
    }
    
    return {
        "skill": skill,
        "level": level,
        "questions": questions.get(skill, questions["JavaScript"]),
        "time_limit": 30,
        "passing_score": 70,
        "certificate_eligible": True
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)