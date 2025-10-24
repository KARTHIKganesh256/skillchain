"""
Voice Processor Service
Speech-to-text, voice analysis, and multilingual support
"""

import asyncio
import speech_recognition as sr
import librosa
import soundfile as sf
import numpy as np
from typing import Dict, Any, Optional
import logging
import httpx
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class VoiceProcessor:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.supported_languages = {
            'en': 'English',
            'es': 'Spanish', 
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'zh': 'Chinese',
            'ja': 'Japanese',
            'ko': 'Korean'
        }
        
    async def analyze_voice(
        self,
        audio_url: str,
        user_id: str,
        skill_context: Optional[str] = None
    ) -> Dict[str, Any]:
        """Analyze voice input for learning assistance"""
        try:
            # Download and process audio
            audio_data = await self._download_audio(audio_url)
            
            # Extract features
            features = await self._extract_audio_features(audio_data)
            
            # Speech recognition
            transcription = await self._transcribe_audio(audio_data)
            
            # Language detection
            language = await self._detect_language(audio_data)
            
            # Sentiment analysis
            sentiment = await self._analyze_sentiment(transcription)
            
            # Generate insights
            insights = await self._generate_voice_insights(features, transcription, skill_context)
            
            # Generate recommendations
            recommendations = await self._generate_voice_recommendations(
                transcription, sentiment, skill_context
            )
            
            return {
                "transcription": transcription,
                "language": language,
                "sentiment": sentiment,
                "confidence": features.get("confidence", 0.5),
                "insights": insights,
                "recommendations": recommendations
            }
            
        except Exception as e:
            logger.error(f"Error analyzing voice input: {str(e)}")
            raise
    
    async def process_uploaded_file(
        self,
        file_path: str,
        user_id: str
    ) -> Dict[str, Any]:
        """Process uploaded voice file"""
        try:
            # Load audio file
            audio_data, sample_rate = librosa.load(file_path, sr=16000)
            
            # Extract features
            features = await self._extract_audio_features_from_array(audio_data, sample_rate)
            
            # Transcribe
            transcription = await self._transcribe_audio_from_array(audio_data, sample_rate)
            
            # Analyze
            language = await self._detect_language_from_array(audio_data)
            sentiment = await self._analyze_sentiment(transcription)
            
            return {
                "transcription": transcription,
                "language": language,
                "sentiment": sentiment,
                "duration": len(audio_data) / sample_rate,
                "features": features
            }
            
        except Exception as e:
            logger.error(f"Error processing uploaded file: {str(e)}")
            raise
    
    async def _download_audio(self, audio_url: str) -> bytes:
        """Download audio file from URL"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(audio_url)
                response.raise_for_status()
                return response.content
        except Exception as e:
            logger.error(f"Error downloading audio: {str(e)}")
            raise
    
    async def _extract_audio_features(self, audio_data: bytes) -> Dict[str, Any]:
        """Extract audio features for analysis"""
        try:
            # Convert bytes to numpy array
            audio_array, sample_rate = librosa.load(audio_data, sr=16000)
            
            return await self._extract_audio_features_from_array(audio_array, sample_rate)
            
        except Exception as e:
            logger.error(f"Error extracting audio features: {str(e)}")
            return {"confidence": 0.5, "clarity": 0.5}
    
    async def _extract_audio_features_from_array(
        self, 
        audio_array: np.ndarray, 
        sample_rate: int
    ) -> Dict[str, Any]:
        """Extract features from audio array"""
        try:
            # Basic audio features
            duration = len(audio_array) / sample_rate
            rms_energy = np.sqrt(np.mean(audio_array**2))
            
            # Spectral features
            spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=audio_array, sr=sample_rate))
            spectral_rolloff = np.mean(librosa.feature.spectral_rolloff(y=audio_array, sr=sample_rate))
            zero_crossing_rate = np.mean(librosa.feature.zero_crossing_rate(audio_array))
            
            # MFCC features
            mfccs = librosa.feature.mfcc(y=audio_array, sr=sample_rate, n_mfcc=13)
            mfcc_mean = np.mean(mfccs, axis=1)
            
            # Voice quality indicators
            clarity = min(spectral_centroid / 2000, 1.0)  # Higher centroid = clearer voice
            confidence = min(rms_energy * 10, 1.0)  # Higher energy = more confident
            
            return {
                "duration": duration,
                "rms_energy": float(rms_energy),
                "spectral_centroid": float(spectral_centroid),
                "spectral_rolloff": float(spectral_rolloff),
                "zero_crossing_rate": float(zero_crossing_rate),
                "mfcc_mean": mfcc_mean.tolist(),
                "clarity": float(clarity),
                "confidence": float(confidence)
            }
            
        except Exception as e:
            logger.error(f"Error extracting audio features: {str(e)}")
            return {"confidence": 0.5, "clarity": 0.5}
    
    async def _transcribe_audio(self, audio_data: bytes) -> str:
        """Transcribe audio to text"""
        try:
            # Use speech recognition
            with sr.AudioFile(audio_data) as source:
                audio = self.recognizer.record(source)
            
            # Try multiple recognition services
            transcription = None
            
            # Google Speech Recognition
            try:
                transcription = self.recognizer.recognize_google(audio)
            except sr.UnknownValueError:
                pass
            except sr.RequestError:
                pass
            
            # If Google fails, try other services
            if not transcription:
                try:
                    transcription = self.recognizer.recognize_sphinx(audio)
                except:
                    transcription = "Unable to transcribe audio"
            
            return transcription
            
        except Exception as e:
            logger.error(f"Error transcribing audio: {str(e)}")
            return "Error in transcription"
    
    async def _transcribe_audio_from_array(
        self, 
        audio_array: np.ndarray, 
        sample_rate: int
    ) -> str:
        """Transcribe audio array to text"""
        try:
            # Convert numpy array to audio file format
            audio_data = (audio_array * 32767).astype(np.int16)
            
            # Create temporary audio file
            import tempfile
            import soundfile as sf
            
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
                sf.write(tmp_file.name, audio_data, sample_rate)
                
                with sr.AudioFile(tmp_file.name) as source:
                    audio = self.recognizer.record(source)
                
                transcription = self.recognizer.recognize_google(audio)
                
                # Clean up
                import os
                os.unlink(tmp_file.name)
                
                return transcription
                
        except Exception as e:
            logger.error(f"Error transcribing audio array: {str(e)}")
            return "Error in transcription"
    
    async def _detect_language(self, audio_data: bytes) -> str:
        """Detect language of audio"""
        try:
            # Simple language detection based on audio characteristics
            # In production, use more sophisticated language detection
            
            # For now, return English as default
            return "en"
            
        except Exception as e:
            logger.error(f"Error detecting language: {str(e)}")
            return "en"
    
    async def _detect_language_from_array(self, audio_array: np.ndarray) -> str:
        """Detect language from audio array"""
        try:
            # Analyze audio characteristics for language detection
            # This is a simplified version - in production, use proper language detection
            
            # Analyze spectral characteristics
            spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=audio_array))
            
            # Simple heuristic based on spectral characteristics
            if spectral_centroid > 1500:
                return "en"  # English
            elif spectral_centroid > 1200:
                return "es"  # Spanish
            else:
                return "fr"  # French
                
        except Exception as e:
            logger.error(f"Error detecting language from array: {str(e)}")
            return "en"
    
    async def _analyze_sentiment(self, text: str) -> str:
        """Analyze sentiment of transcribed text"""
        try:
            if not text or text == "Error in transcription":
                return "neutral"
            
            # Simple sentiment analysis based on keywords
            positive_words = ["good", "great", "excellent", "amazing", "wonderful", "fantastic", "love", "like"]
            negative_words = ["bad", "terrible", "awful", "hate", "dislike", "horrible", "worst", "difficult"]
            
            text_lower = text.lower()
            
            positive_count = sum(1 for word in positive_words if word in text_lower)
            negative_count = sum(1 for word in negative_words if word in text_lower)
            
            if positive_count > negative_count:
                return "positive"
            elif negative_count > positive_count:
                return "negative"
            else:
                return "neutral"
                
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return "neutral"
    
    async def _generate_voice_insights(
        self, 
        features: Dict[str, Any], 
        transcription: str, 
        skill_context: Optional[str]
    ) -> Dict[str, Any]:
        """Generate insights from voice analysis"""
        try:
            insights = {
                "speech_quality": "good" if features.get("clarity", 0.5) > 0.6 else "needs_improvement",
                "confidence_level": "high" if features.get("confidence", 0.5) > 0.7 else "medium",
                "speaking_pace": "normal" if 0.3 < features.get("zero_crossing_rate", 0.5) < 0.7 else "fast",
                "audio_quality": "clear" if features.get("rms_energy", 0.5) > 0.3 else "quiet"
            }
            
            # Add skill-specific insights
            if skill_context:
                insights["skill_relevance"] = await self._assess_skill_relevance(transcription, skill_context)
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating voice insights: {str(e)}")
            return {"speech_quality": "unknown"}
    
    async def _assess_skill_relevance(self, transcription: str, skill_context: str) -> str:
        """Assess relevance of voice input to skill context"""
        try:
            # Simple keyword matching for skill relevance
            skill_keywords = skill_context.lower().split()
            transcription_lower = transcription.lower()
            
            matches = sum(1 for keyword in skill_keywords if keyword in transcription_lower)
            relevance_score = matches / len(skill_keywords) if skill_keywords else 0
            
            if relevance_score > 0.5:
                return "highly_relevant"
            elif relevance_score > 0.2:
                return "somewhat_relevant"
            else:
                return "not_relevant"
                
        except Exception as e:
            logger.error(f"Error assessing skill relevance: {str(e)}")
            return "unknown"
    
    async def _generate_voice_recommendations(
        self, 
        transcription: str, 
        sentiment: str, 
        skill_context: Optional[str]
    ) -> List[str]:
        """Generate recommendations based on voice analysis"""
        try:
            recommendations = []
            
            # Speech quality recommendations
            if sentiment == "negative":
                recommendations.append("Consider practicing pronunciation to improve clarity")
                recommendations.append("Try speaking more slowly and clearly")
            
            # Learning recommendations
            if skill_context:
                recommendations.append(f"Focus on {skill_context} concepts in your questions")
                recommendations.append("Ask more specific questions about the topic")
            
            # General recommendations
            recommendations.extend([
                "Practice speaking about technical concepts regularly",
                "Record yourself to improve speaking confidence",
                "Join voice-based learning groups for practice"
            ])
            
            return recommendations[:3]  # Return top 3 recommendations
            
        except Exception as e:
            logger.error(f"Error generating voice recommendations: {str(e)}")
            return ["Continue practicing your speaking skills"]

