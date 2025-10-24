"""
SkillChain AI API - FastAPI Backend
AI-powered features for skill valuation, learning assistance, and recommendations
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import asyncio
from datetime import datetime, timedelta
import json
import logging

# Import AI modules
from services.skill_calculator import SkillValueCalculator
from services.learning_assistant import LearningAssistant
from services.recommendation_engine import RecommendationEngine
from services.voice_processor import VoiceProcessor
from services.translation_service import TranslationService
from services.sentiment_analyzer import SentimentAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SkillChain AI API",
    description="AI-powered backend for skill ecosystem platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://skillchain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize AI services
skill_calculator = SkillValueCalculator()
learning_assistant = LearningAssistant()
recommendation_engine = RecommendationEngine()
voice_processor = VoiceProcessor()
translation_service = TranslationService()
sentiment_analyzer = SentimentAnalyzer()

# Pydantic Models
class SkillValueRequest(BaseModel):
    skill_name: str
    user_experience: int = Field(..., ge=0, le=10)
    market_demand: Optional[float] = None
    complexity: Optional[int] = Field(None, ge=1, le=10)
    location: Optional[str] = None
    industry: Optional[str] = None

class SkillValueResponse(BaseModel):
    skill_name: str
    estimated_value: float
    confidence_score: float
    factors: Dict[str, Any]
    recommendations: List[str]

class LearningQuestionRequest(BaseModel):
    question: str
    skill_id: str
    user_id: str
    context: Optional[Dict[str, Any]] = None
    language: str = "en"

class LearningQuestionResponse(BaseModel):
    answer: str
    confidence: float
    related_questions: List[str]
    learning_resources: List[Dict[str, str]]
    next_steps: List[str]

class RecommendationRequest(BaseModel):
    user_id: str
    recommendation_type: str = Field(..., regex="^(learn|teach|connect|challenge)$")
    limit: int = Field(10, ge=1, le=50)

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, Any]]
    confidence_scores: List[float]
    reasoning: str

class VoiceAnalysisRequest(BaseModel):
    audio_url: str
    user_id: str
    skill_context: Optional[str] = None

class VoiceAnalysisResponse(BaseModel):
    transcription: str
    language: str
    sentiment: str
    confidence: float
    insights: Dict[str, Any]
    recommendations: List[str]

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # In production, validate JWT token here
    # For now, return mock user data
    return {"user_id": "mock_user", "email": "user@example.com"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Skill Value Calculator endpoints
@app.post("/api/v1/skill-value/calculate", response_model=SkillValueResponse)
async def calculate_skill_value(
    request: SkillValueRequest,
    current_user: dict = Depends(get_current_user)
):
    """Calculate the market value of a skill using AI"""
    try:
        result = await skill_calculator.calculate_value(
            skill_name=request.skill_name,
            user_experience=request.user_experience,
            market_demand=request.market_demand,
            complexity=request.complexity,
            location=request.location,
            industry=request.industry
        )
        return SkillValueResponse(**result)
    except Exception as e:
        logger.error(f"Error calculating skill value: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to calculate skill value")

@app.get("/api/v1/skill-value/trends/{skill_name}")
async def get_skill_trends(
    skill_name: str,
    current_user: dict = Depends(get_current_user)
):
    """Get market trends for a specific skill"""
    try:
        trends = await skill_calculator.get_skill_trends(skill_name)
        return {"skill_name": skill_name, "trends": trends}
    except Exception as e:
        logger.error(f"Error getting skill trends: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get skill trends")

# Learning Assistant endpoints
@app.post("/api/v1/learning/question", response_model=LearningQuestionResponse)
async def ask_learning_question(
    request: LearningQuestionRequest,
    current_user: dict = Depends(get_current_user)
):
    """AI-powered learning Q&A with voice support"""
    try:
        response = await learning_assistant.answer_question(
            question=request.question,
            skill_id=request.skill_id,
            user_id=request.user_id,
            context=request.context,
            language=request.language
        )
        return LearningQuestionResponse(**response)
    except Exception as e:
        logger.error(f"Error processing learning question: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process question")

@app.post("/api/v1/learning/voice-analysis", response_model=VoiceAnalysisResponse)
async def analyze_voice_input(
    request: VoiceAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """Analyze voice input for learning assistance"""
    try:
        analysis = await voice_processor.analyze_voice(
            audio_url=request.audio_url,
            user_id=request.user_id,
            skill_context=request.skill_context
        )
        return VoiceAnalysisResponse(**analysis)
    except Exception as e:
        logger.error(f"Error analyzing voice input: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze voice input")

# Recommendation Engine endpoints
@app.post("/api/v1/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Get AI-powered recommendations for users"""
    try:
        recommendations = await recommendation_engine.get_recommendations(
            user_id=request.user_id,
            recommendation_type=request.recommendation_type,
            limit=request.limit
        )
        return RecommendationResponse(**recommendations)
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get recommendations")

@app.get("/api/v1/recommendations/skill-graph/{user_id}")
async def get_skill_graph(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get personalized skill graph for user"""
    try:
        skill_graph = await recommendation_engine.generate_skill_graph(user_id)
        return {"user_id": user_id, "skill_graph": skill_graph}
    except Exception as e:
        logger.error(f"Error generating skill graph: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate skill graph")

# Translation and Multilingual Support
@app.post("/api/v1/translate")
async def translate_text(
    text: str,
    target_language: str,
    current_user: dict = Depends(get_current_user)
):
    """Translate text to target language"""
    try:
        translation = await translation_service.translate(text, target_language)
        return {
            "original_text": text,
            "translated_text": translation,
            "target_language": target_language
        }
    except Exception as e:
        logger.error(f"Error translating text: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to translate text")

# Sentiment Analysis
@app.post("/api/v1/sentiment/analyze")
async def analyze_sentiment(
    text: str,
    current_user: dict = Depends(get_current_user)
):
    """Analyze sentiment of text"""
    try:
        sentiment = await sentiment_analyzer.analyze(text)
        return {"text": text, "sentiment": sentiment}
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze sentiment")

# File upload for voice processing
@app.post("/api/v1/voice/upload")
async def upload_voice_file(
    file: UploadFile = File(...),
    user_id: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Upload voice file for processing"""
    try:
        # Save uploaded file
        file_path = f"uploads/{user_id}_{datetime.now().timestamp()}.wav"
        os.makedirs("uploads", exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Process the voice file
        result = await voice_processor.process_uploaded_file(file_path, user_id)
        
        # Clean up file
        os.remove(file_path)
        
        return result
    except Exception as e:
        logger.error(f"Error processing voice file: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process voice file")

# Batch processing endpoints
@app.post("/api/v1/batch/skill-values")
async def batch_calculate_skill_values(
    skills: List[SkillValueRequest],
    current_user: dict = Depends(get_current_user)
):
    """Calculate values for multiple skills in batch"""
    try:
        results = []
        for skill in skills:
            result = await skill_calculator.calculate_value(
                skill_name=skill.skill_name,
                user_experience=skill.user_experience,
                market_demand=skill.market_demand,
                complexity=skill.complexity,
                location=skill.location,
                industry=skill.industry
            )
            results.append(result)
        return {"results": results}
    except Exception as e:
        logger.error(f"Error in batch skill value calculation: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to calculate batch skill values")

# Analytics endpoints
@app.get("/api/v1/analytics/user-insights/{user_id}")
async def get_user_insights(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get AI-generated insights for user"""
    try:
        insights = await recommendation_engine.get_user_insights(user_id)
        return {"user_id": user_id, "insights": insights}
    except Exception as e:
        logger.error(f"Error getting user insights: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get user insights")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

