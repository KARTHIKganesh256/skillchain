"""
Learning Assistant Service
AI-powered learning assistance with voice and text support
"""

import asyncio
import openai
import json
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime
import httpx

logger = logging.getLogger(__name__)

class LearningAssistant:
    def __init__(self):
        self.openai_client = openai.AsyncOpenAI()
        self.conversation_memory = {}
        
    async def answer_question(
        self,
        question: str,
        skill_id: str,
        user_id: str,
        context: Optional[Dict[str, Any]] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        """Answer learning questions with AI assistance"""
        try:
            # Get user's learning context
            user_context = await self._get_user_context(user_id, skill_id)
            
            # Build context for AI
            full_context = {
                "user_context": user_context,
                "additional_context": context or {},
                "skill_id": skill_id,
                "language": language
            }
            
            # Generate AI response
            response = await self._generate_ai_response(question, full_context)
            
            # Extract related questions
            related_questions = await self._generate_related_questions(question, skill_id)
            
            # Find learning resources
            learning_resources = await self._find_learning_resources(question, skill_id)
            
            # Generate next steps
            next_steps = await self._generate_next_steps(user_context, question, skill_id)
            
            # Store conversation in memory
            await self._store_conversation(user_id, skill_id, question, response)
            
            return {
                "answer": response["content"],
                "confidence": response["confidence"],
                "related_questions": related_questions,
                "learning_resources": learning_resources,
                "next_steps": next_steps
            }
            
        except Exception as e:
            logger.error(f"Error answering learning question: {str(e)}")
            raise
    
    async def _get_user_context(self, user_id: str, skill_id: str) -> Dict[str, Any]:
        """Get user's learning context and progress"""
        try:
            # In production, fetch from database
            # For now, return mock data
            return {
                "current_level": 5,
                "learning_goals": ["Master advanced concepts", "Build portfolio projects"],
                "completed_lessons": 12,
                "weak_areas": ["Advanced algorithms", "System design"],
                "learning_style": "visual",
                "preferred_difficulty": "intermediate"
            }
        except Exception as e:
            logger.error(f"Error getting user context: {str(e)}")
            return {}
    
    async def _generate_ai_response(
        self, 
        question: str, 
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate AI response using OpenAI"""
        try:
            # Build system prompt
            system_prompt = self._build_system_prompt(context)
            
            # Build user message
            user_message = f"""
            Question: {question}
            
            Please provide a comprehensive, educational answer that:
            1. Directly addresses the question
            2. Provides examples and practical applications
            3. Suggests related concepts to explore
            4. Adapts to the user's current skill level
            """
            
            # Call OpenAI API
            response = await self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            
            # Calculate confidence based on response quality
            confidence = await self._calculate_response_confidence(content, question)
            
            return {
                "content": content,
                "confidence": confidence
            }
            
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            return {
                "content": "I apologize, but I'm having trouble processing your question right now. Please try again.",
                "confidence": 0.3
            }
    
    def _build_system_prompt(self, context: Dict[str, Any]) -> str:
        """Build system prompt for AI"""
        user_context = context.get("user_context", {})
        skill_id = context.get("skill_id", "")
        language = context.get("language", "en")
        
        return f"""
        You are an expert learning assistant for the SkillChain platform. 
        
        User Context:
        - Current skill level: {user_context.get('current_level', 'Unknown')}
        - Learning goals: {', '.join(user_context.get('learning_goals', []))}
        - Completed lessons: {user_context.get('completed_lessons', 0)}
        - Weak areas: {', '.join(user_context.get('weak_areas', []))}
        - Learning style: {user_context.get('learning_style', 'Unknown')}
        
        Guidelines:
        1. Provide clear, actionable explanations
        2. Use examples relevant to the user's level
        3. Suggest practical applications
        4. Encourage further learning
        5. Be encouraging and supportive
        6. Respond in {language} language
        
        Always aim to help the user understand concepts deeply and apply them practically.
        """
    
    async def _calculate_response_confidence(
        self, 
        content: str, 
        question: str
    ) -> float:
        """Calculate confidence score for AI response"""
        try:
            # Simple heuristics for confidence calculation
            confidence_factors = []
            
            # Length factor (longer responses often more comprehensive)
            length_factor = min(len(content) / 500, 1.0)
            confidence_factors.append(length_factor)
            
            # Keyword presence (technical terms indicate expertise)
            technical_keywords = ["example", "application", "practice", "implementation", "concept"]
            keyword_count = sum(1 for keyword in technical_keywords if keyword in content.lower())
            keyword_factor = min(keyword_count / len(technical_keywords), 1.0)
            confidence_factors.append(keyword_factor)
            
            # Question-answer alignment (simple check)
            question_words = set(question.lower().split())
            answer_words = set(content.lower().split())
            overlap = len(question_words.intersection(answer_words))
            alignment_factor = min(overlap / max(len(question_words), 1), 1.0)
            confidence_factors.append(alignment_factor)
            
            # Average confidence
            return sum(confidence_factors) / len(confidence_factors)
            
        except Exception as e:
            logger.error(f"Error calculating confidence: {str(e)}")
            return 0.5
    
    async def _generate_related_questions(
        self, 
        question: str, 
        skill_id: str
    ) -> List[str]:
        """Generate related questions for deeper learning"""
        try:
            # In production, use AI to generate related questions
            # For now, return template questions
            base_questions = [
                f"How can I practice {question.lower()}?",
                f"What are common mistakes when learning {question.lower()}?",
                f"How does {question.lower()} relate to other concepts?",
                f"What are advanced applications of {question.lower()}?",
                f"How can I measure my progress with {question.lower()}?"
            ]
            
            return base_questions[:3]  # Return top 3
            
        except Exception as e:
            logger.error(f"Error generating related questions: {str(e)}")
            return []
    
    async def _find_learning_resources(
        self, 
        question: str, 
        skill_id: str
    ) -> List[Dict[str, str]]:
        """Find relevant learning resources"""
        try:
            # In production, query database for resources
            # For now, return mock resources
            resources = [
                {
                    "title": "Interactive Tutorial",
                    "type": "tutorial",
                    "url": f"/tutorials/{skill_id}/interactive",
                    "difficulty": "beginner"
                },
                {
                    "title": "Video Explanation",
                    "type": "video",
                    "url": f"/videos/{skill_id}/explanation",
                    "difficulty": "intermediate"
                },
                {
                    "title": "Practice Exercises",
                    "type": "exercise",
                    "url": f"/exercises/{skill_id}/practice",
                    "difficulty": "advanced"
                }
            ]
            
            return resources
            
        except Exception as e:
            logger.error(f"Error finding learning resources: {str(e)}")
            return []
    
    async def _generate_next_steps(
        self, 
        user_context: Dict[str, Any], 
        question: str, 
        skill_id: str
    ) -> List[str]:
        """Generate next learning steps"""
        try:
            current_level = user_context.get("current_level", 1)
            weak_areas = user_context.get("weak_areas", [])
            
            next_steps = []
            
            if current_level < 3:
                next_steps.extend([
                    "Complete basic fundamentals",
                    "Practice with simple examples",
                    "Join a beginner study group"
                ])
            elif current_level < 7:
                next_steps.extend([
                    "Work on intermediate projects",
                    "Find a mentor or study partner",
                    "Contribute to open source projects"
                ])
            else:
                next_steps.extend([
                    "Teach others what you've learned",
                    "Work on advanced projects",
                    "Consider specialization areas"
                ])
            
            # Add specific steps based on weak areas
            if weak_areas:
                next_steps.append(f"Focus on improving: {', '.join(weak_areas[:2])}")
            
            return next_steps[:4]  # Return top 4 steps
            
        except Exception as e:
            logger.error(f"Error generating next steps: {str(e)}")
            return ["Continue practicing and learning"]
    
    async def _store_conversation(
        self, 
        user_id: str, 
        skill_id: str, 
        question: str, 
        response: Dict[str, Any]
    ):
        """Store conversation in memory for context"""
        try:
            conversation_key = f"{user_id}_{skill_id}"
            
            if conversation_key not in self.conversation_memory:
                self.conversation_memory[conversation_key] = []
            
            self.conversation_memory[conversation_key].append({
                "timestamp": datetime.utcnow().isoformat(),
                "question": question,
                "answer": response["content"],
                "confidence": response["confidence"]
            })
            
            # Keep only last 10 conversations
            if len(self.conversation_memory[conversation_key]) > 10:
                self.conversation_memory[conversation_key] = self.conversation_memory[conversation_key][-10:]
                
        except Exception as e:
            logger.error(f"Error storing conversation: {str(e)}")
    
    async def get_learning_insights(self, user_id: str, skill_id: str) -> Dict[str, Any]:
        """Get AI-generated learning insights for user"""
        try:
            conversation_key = f"{user_id}_{skill_id}"
            conversations = self.conversation_memory.get(conversation_key, [])
            
            if not conversations:
                return {
                    "total_questions": 0,
                    "average_confidence": 0,
                    "learning_progress": "beginner",
                    "suggestions": ["Start asking questions to begin your learning journey"]
                }
            
            # Analyze conversations
            total_questions = len(conversations)
            avg_confidence = sum(conv["confidence"] for conv in conversations) / total_questions
            
            # Determine learning progress
            if avg_confidence > 0.8 and total_questions > 10:
                progress = "advanced"
            elif avg_confidence > 0.6 and total_questions > 5:
                progress = "intermediate"
            else:
                progress = "beginner"
            
            # Generate suggestions
            suggestions = []
            if progress == "beginner":
                suggestions.extend([
                    "Focus on fundamental concepts",
                    "Ask more specific questions",
                    "Practice with simple examples"
                ])
            elif progress == "intermediate":
                suggestions.extend([
                    "Work on practical projects",
                    "Explore advanced topics",
                    "Help others learn"
                ])
            else:
                suggestions.extend([
                    "Consider teaching others",
                    "Explore specialization areas",
                    "Contribute to the community"
                ])
            
            return {
                "total_questions": total_questions,
                "average_confidence": round(avg_confidence, 2),
                "learning_progress": progress,
                "suggestions": suggestions
            }
            
        except Exception as e:
            logger.error(f"Error getting learning insights: {str(e)}")
            return {
                "total_questions": 0,
                "average_confidence": 0,
                "learning_progress": "beginner",
                "suggestions": ["Start your learning journey"]
            }

