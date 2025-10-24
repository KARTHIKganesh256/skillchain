"""
Sentiment Analyzer Service
AI-powered sentiment analysis for learning feedback and user interactions
"""

import asyncio
import numpy as np
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime
import re

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    def __init__(self):
        # Sentiment keywords and their weights
        self.positive_keywords = {
            'excellent': 3, 'amazing': 3, 'fantastic': 3, 'wonderful': 3, 'brilliant': 3,
            'great': 2, 'good': 2, 'awesome': 2, 'perfect': 2, 'outstanding': 2,
            'love': 2, 'like': 1, 'enjoy': 1, 'appreciate': 1, 'helpful': 1,
            'clear': 1, 'easy': 1, 'simple': 1, 'useful': 1, 'valuable': 1
        }
        
        self.negative_keywords = {
            'terrible': -3, 'awful': -3, 'horrible': -3, 'worst': -3, 'disgusting': -3,
            'bad': -2, 'poor': -2, 'disappointing': -2, 'frustrating': -2, 'annoying': -2,
            'hate': -2, 'dislike': -1, 'confusing': -1, 'difficult': -1, 'hard': -1,
            'unclear': -1, 'useless': -1, 'waste': -1, 'boring': -1, 'stupid': -1
        }
        
        # Intensifiers that modify sentiment
        self.intensifiers = {
            'very': 1.5, 'extremely': 2.0, 'incredibly': 2.0, 'absolutely': 1.8,
            'totally': 1.5, 'completely': 1.5, 'really': 1.3, 'quite': 1.2,
            'somewhat': 0.8, 'slightly': 0.7, 'barely': 0.5, 'hardly': 0.5
        }
        
        # Negation words that flip sentiment
        self.negations = {
            'not', 'no', 'never', 'none', 'nothing', 'nowhere', 'nobody',
            'neither', 'nor', 'cannot', 'can\'t', 'won\'t', 'don\'t', 'doesn\'t'
        }
    
    async def analyze(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of text and return detailed results"""
        try:
            if not text or not text.strip():
                return {
                    "sentiment": "neutral",
                    "confidence": 0.5,
                    "score": 0.0,
                    "emotions": [],
                    "aspects": {}
                }
            
            # Clean and preprocess text
            cleaned_text = self._clean_text(text)
            
            # Calculate sentiment score
            sentiment_score = await self._calculate_sentiment_score(cleaned_text)
            
            # Determine sentiment category
            sentiment = self._categorize_sentiment(sentiment_score)
            
            # Calculate confidence
            confidence = await self._calculate_confidence(cleaned_text, sentiment_score)
            
            # Extract emotions
            emotions = await self._extract_emotions(cleaned_text)
            
            # Analyze aspects
            aspects = await self._analyze_aspects(cleaned_text)
            
            return {
                "sentiment": sentiment,
                "confidence": confidence,
                "score": sentiment_score,
                "emotions": emotions,
                "aspects": aspects
            }
            
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return {
                "sentiment": "neutral",
                "confidence": 0.5,
                "score": 0.0,
                "emotions": [],
                "aspects": {}
            }
    
    def _clean_text(self, text: str) -> str:
        """Clean and preprocess text for analysis"""
        try:
            # Convert to lowercase
            text = text.lower()
            
            # Remove extra whitespace
            text = re.sub(r'\s+', ' ', text)
            
            # Remove special characters but keep basic punctuation
            text = re.sub(r'[^\w\s.,!?]', '', text)
            
            # Remove extra punctuation
            text = re.sub(r'[.,!?]+', ' ', text)
            
            return text.strip()
            
        except Exception as e:
            logger.error(f"Error cleaning text: {str(e)}")
            return text
    
    async def _calculate_sentiment_score(self, text: str) -> float:
        """Calculate numerical sentiment score"""
        try:
            words = text.split()
            total_score = 0.0
            word_count = len(words)
            
            if word_count == 0:
                return 0.0
            
            i = 0
            while i < word_count:
                word = words[i]
                score = 0.0
                intensity = 1.0
                
                # Check for intensifiers
                if i > 0 and words[i-1] in self.intensifiers:
                    intensity = self.intensifiers[words[i-1]]
                
                # Check for negations
                negation_count = 0
                j = i - 1
                while j >= 0 and j >= i - 3:  # Look back up to 3 words
                    if words[j] in self.negations:
                        negation_count += 1
                    j -= 1
                
                # Apply negation (odd number of negations flips sentiment)
                if negation_count % 2 == 1:
                    intensity *= -1
                
                # Check positive keywords
                if word in self.positive_keywords:
                    score = self.positive_keywords[word] * intensity
                # Check negative keywords
                elif word in self.negative_keywords:
                    score = self.negative_keywords[word] * intensity
                
                total_score += score
                i += 1
            
            # Normalize score
            normalized_score = total_score / word_count
            
            # Clamp between -1 and 1
            return max(-1.0, min(1.0, normalized_score))
            
        except Exception as e:
            logger.error(f"Error calculating sentiment score: {str(e)}")
            return 0.0
    
    def _categorize_sentiment(self, score: float) -> str:
        """Categorize sentiment score into text categories"""
        if score > 0.3:
            return "positive"
        elif score < -0.3:
            return "negative"
        else:
            return "neutral"
    
    async def _calculate_confidence(self, text: str, score: float) -> float:
        """Calculate confidence in sentiment analysis"""
        try:
            words = text.split()
            word_count = len(words)
            
            if word_count == 0:
                return 0.5
            
            # Count sentiment-bearing words
            sentiment_words = 0
            for word in words:
                if word in self.positive_keywords or word in self.negative_keywords:
                    sentiment_words += 1
            
            # Base confidence on ratio of sentiment words
            sentiment_ratio = sentiment_words / word_count
            
            # Adjust confidence based on score magnitude
            score_magnitude = abs(score)
            
            # Combine factors
            confidence = (sentiment_ratio * 0.7) + (score_magnitude * 0.3)
            
            # Ensure confidence is between 0 and 1
            return max(0.1, min(1.0, confidence))
            
        except Exception as e:
            logger.error(f"Error calculating confidence: {str(e)}")
            return 0.5
    
    async def _extract_emotions(self, text: str) -> List[str]:
        """Extract emotions from text"""
        try:
            emotions = []
            
            # Emotion keywords
            emotion_keywords = {
                'joy': ['happy', 'excited', 'thrilled', 'delighted', 'cheerful', 'joyful'],
                'anger': ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated'],
                'sadness': ['sad', 'depressed', 'disappointed', 'upset', 'hurt', 'grief'],
                'fear': ['afraid', 'scared', 'worried', 'anxious', 'nervous', 'terrified'],
                'surprise': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned'],
                'disgust': ['disgusted', 'revolted', 'sickened', 'repulsed', 'appalled'],
                'trust': ['confident', 'trusting', 'secure', 'reliable', 'faithful'],
                'anticipation': ['eager', 'hopeful', 'optimistic', 'enthusiastic', 'excited']
            }
            
            text_lower = text.lower()
            
            for emotion, keywords in emotion_keywords.items():
                for keyword in keywords:
                    if keyword in text_lower:
                        emotions.append(emotion)
                        break  # Only add emotion once
            
            return emotions
            
        except Exception as e:
            logger.error(f"Error extracting emotions: {str(e)}")
            return []
    
    async def _analyze_aspects(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment for different aspects"""
        try:
            aspects = {}
            
            # Common learning-related aspects
            learning_aspects = {
                'content': ['content', 'material', 'information', 'knowledge', 'lesson'],
                'instructor': ['teacher', 'instructor', 'tutor', 'mentor', 'guide'],
                'difficulty': ['difficult', 'easy', 'hard', 'challenging', 'simple'],
                'pace': ['fast', 'slow', 'pace', 'speed', 'timing'],
                'clarity': ['clear', 'confusing', 'unclear', 'understandable', 'obscure']
            }
            
            text_lower = text.lower()
            
            for aspect, keywords in learning_aspects.items():
                aspect_score = 0.0
                keyword_count = 0
                
                for keyword in keywords:
                    if keyword in text_lower:
                        # Find sentiment words near this keyword
                        words = text_lower.split()
                        keyword_index = words.index(keyword) if keyword in words else -1
                        
                        if keyword_index >= 0:
                            # Look for sentiment words in nearby context
                            start = max(0, keyword_index - 3)
                            end = min(len(words), keyword_index + 4)
                            context = words[start:end]
                            
                            for word in context:
                                if word in self.positive_keywords:
                                    aspect_score += self.positive_keywords[word]
                                    keyword_count += 1
                                elif word in self.negative_keywords:
                                    aspect_score += self.negative_keywords[word]
                                    keyword_count += 1
                
                if keyword_count > 0:
                    aspects[aspect] = {
                        'score': aspect_score / keyword_count,
                        'sentiment': 'positive' if aspect_score > 0 else 'negative' if aspect_score < 0 else 'neutral'
                    }
            
            return aspects
            
        except Exception as e:
            logger.error(f"Error analyzing aspects: {str(e)}")
            return {}
    
    async def analyze_learning_feedback(
        self, 
        feedback_text: str
    ) -> Dict[str, Any]:
        """Analyze learning feedback specifically"""
        try:
            # Get general sentiment
            sentiment_result = await self.analyze(feedback_text)
            
            # Extract learning-specific insights
            learning_insights = await self._extract_learning_insights(feedback_text)
            
            # Determine feedback type
            feedback_type = await self._classify_feedback_type(feedback_text)
            
            return {
                **sentiment_result,
                "learning_insights": learning_insights,
                "feedback_type": feedback_type
            }
            
        except Exception as e:
            logger.error(f"Error analyzing learning feedback: {str(e)}")
            return {
                "sentiment": "neutral",
                "confidence": 0.5,
                "score": 0.0,
                "emotions": [],
                "aspects": {},
                "learning_insights": {},
                "feedback_type": "general"
            }
    
    async def _extract_learning_insights(self, text: str) -> Dict[str, Any]:
        """Extract learning-specific insights from feedback"""
        try:
            insights = {
                "learning_effectiveness": "unknown",
                "engagement_level": "unknown",
                "difficulty_assessment": "unknown",
                "recommendations": []
            }
            
            text_lower = text.lower()
            
            # Learning effectiveness indicators
            effectiveness_positive = ['helpful', 'useful', 'valuable', 'effective', 'beneficial']
            effectiveness_negative = ['useless', 'waste', 'ineffective', 'unhelpful', 'pointless']
            
            pos_count = sum(1 for word in effectiveness_positive if word in text_lower)
            neg_count = sum(1 for word in effectiveness_negative if word in text_lower)
            
            if pos_count > neg_count:
                insights["learning_effectiveness"] = "high"
            elif neg_count > pos_count:
                insights["learning_effectiveness"] = "low"
            else:
                insights["learning_effectiveness"] = "medium"
            
            # Engagement level indicators
            engagement_positive = ['engaging', 'interesting', 'exciting', 'fun', 'enjoyable']
            engagement_negative = ['boring', 'dull', 'tedious', 'monotonous', 'uninteresting']
            
            pos_count = sum(1 for word in engagement_positive if word in text_lower)
            neg_count = sum(1 for word in engagement_negative if word in text_lower)
            
            if pos_count > neg_count:
                insights["engagement_level"] = "high"
            elif neg_count > pos_count:
                insights["engagement_level"] = "low"
            else:
                insights["engagement_level"] = "medium"
            
            # Difficulty assessment
            difficulty_high = ['difficult', 'hard', 'challenging', 'complex', 'advanced']
            difficulty_low = ['easy', 'simple', 'basic', 'elementary', 'beginner']
            
            high_count = sum(1 for word in difficulty_high if word in text_lower)
            low_count = sum(1 for word in difficulty_low if word in text_lower)
            
            if high_count > low_count:
                insights["difficulty_assessment"] = "high"
            elif low_count > high_count:
                insights["difficulty_assessment"] = "low"
            else:
                insights["difficulty_assessment"] = "medium"
            
            # Generate recommendations based on insights
            recommendations = []
            if insights["learning_effectiveness"] == "low":
                recommendations.append("Consider adjusting the teaching approach or materials")
            if insights["engagement_level"] == "low":
                recommendations.append("Add more interactive elements or examples")
            if insights["difficulty_assessment"] == "high":
                recommendations.append("Provide more foundational content or prerequisites")
            
            insights["recommendations"] = recommendations
            
            return insights
            
        except Exception as e:
            logger.error(f"Error extracting learning insights: {str(e)}")
            return {
                "learning_effectiveness": "unknown",
                "engagement_level": "unknown",
                "difficulty_assessment": "unknown",
                "recommendations": []
            }
    
    async def _classify_feedback_type(self, text: str) -> str:
        """Classify the type of feedback"""
        try:
            text_lower = text.lower()
            
            # Feedback type keywords
            type_keywords = {
                'praise': ['excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'love', 'perfect'],
                'criticism': ['bad', 'terrible', 'awful', 'hate', 'worst', 'disappointing', 'poor'],
                'suggestion': ['suggest', 'recommend', 'could', 'should', 'might', 'consider', 'improve'],
                'question': ['how', 'what', 'why', 'when', 'where', 'can', 'would', 'could'],
                'complaint': ['problem', 'issue', 'wrong', 'broken', 'not working', 'error', 'bug']
            }
            
            type_scores = {}
            for feedback_type, keywords in type_keywords.items():
                score = sum(1 for keyword in keywords if keyword in text_lower)
                type_scores[feedback_type] = score
            
            # Return the type with highest score
            if type_scores:
                return max(type_scores, key=type_scores.get)
            else:
                return "general"
                
        except Exception as e:
            logger.error(f"Error classifying feedback type: {str(e)}")
            return "general"
    
    async def batch_analyze(self, texts: List[str]) -> List[Dict[str, Any]]:
        """Analyze sentiment for multiple texts"""
        try:
            results = []
            for text in texts:
                result = await self.analyze(text)
                results.append(result)
            return results
        except Exception as e:
            logger.error(f"Error in batch sentiment analysis: {str(e)}")
            return [{"sentiment": "neutral", "confidence": 0.5, "score": 0.0, "emotions": [], "aspects": {}}] * len(texts)

