"""
Translation Service
Multilingual support for global skill learning
"""

import asyncio
import httpx
from typing import Dict, Any, List, Optional
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        self.supported_languages = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'zh': 'Chinese',
            'ja': 'Japanese',
            'ko': 'Korean',
            'ar': 'Arabic',
            'hi': 'Hindi',
            'ru': 'Russian'
        }
        
        # Language detection patterns
        self.language_patterns = {
            'en': ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'],
            'es': ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le'],
            'fr': ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans'],
            'de': ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für'],
            'it': ['di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'il', 'lo', 'la', 'i', 'gli', 'le'],
            'pt': ['de', 'a', 'o', 'e', 'do', 'da', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'no', 'se'],
            'zh': ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也'],
            'ja': ['の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し', 'れ', 'さ', 'ある', 'いる', 'も'],
            'ko': ['이', '가', '을', '를', '에', '에서', '와', '과', '의', '로', '으로', '도', '는', '은', '하다'],
            'ar': ['في', 'من', 'إلى', 'على', 'هذا', 'هذه', 'التي', 'الذي', 'كان', 'يكون', 'له', 'لها', 'عند', 'مع'],
            'hi': ['का', 'की', 'के', 'में', 'से', 'को', 'पर', 'है', 'हैं', 'था', 'थे', 'था', 'हो', 'हैं', 'था'],
            'ru': ['в', 'на', 'с', 'по', 'для', 'от', 'до', 'за', 'при', 'без', 'через', 'между', 'среди', 'около']
        }
    
    async def translate(
        self, 
        text: str, 
        target_language: str,
        source_language: Optional[str] = None
    ) -> str:
        """Translate text to target language"""
        try:
            # Detect source language if not provided
            if not source_language:
                source_language = await self._detect_language(text)
            
            # If source and target are the same, return original text
            if source_language == target_language:
                return text
            
            # Use translation API (mock implementation)
            translation = await self._translate_text(text, source_language, target_language)
            
            return translation
            
        except Exception as e:
            logger.error(f"Error translating text: {str(e)}")
            return text  # Return original text if translation fails
    
    async def _detect_language(self, text: str) -> str:
        """Detect language of input text"""
        try:
            if not text or len(text.strip()) < 3:
                return 'en'  # Default to English
            
            text_lower = text.lower()
            word_count = len(text_lower.split())
            
            # Score each language based on pattern matches
            language_scores = {}
            
            for lang_code, patterns in self.language_patterns.items():
                score = 0
                for pattern in patterns:
                    if pattern in text_lower:
                        score += 1
                
                # Normalize score by text length
                language_scores[lang_code] = score / max(word_count, 1)
            
            # Return language with highest score
            detected_language = max(language_scores, key=language_scores.get)
            
            # If no clear winner, default to English
            if language_scores[detected_language] < 0.1:
                return 'en'
            
            return detected_language
            
        except Exception as e:
            logger.error(f"Error detecting language: {str(e)}")
            return 'en'
    
    async def _translate_text(
        self, 
        text: str, 
        source_language: str, 
        target_language: str
    ) -> str:
        """Translate text using translation service"""
        try:
            # Mock translation - in production, use Google Translate API or similar
            if source_language == 'en' and target_language == 'es':
                return f"[ES] {text}"
            elif source_language == 'en' and target_language == 'fr':
                return f"[FR] {text}"
            elif source_language == 'en' and target_language == 'de':
                return f"[DE] {text}"
            elif source_language == 'en' and target_language == 'zh':
                return f"[ZH] {text}"
            elif source_language == 'en' and target_language == 'ja':
                return f"[JA] {text}"
            else:
                return f"[{target_language.upper()}] {text}"
                
        except Exception as e:
            logger.error(f"Error in translation service: {str(e)}")
            return text
    
    async def translate_skill_content(
        self, 
        skill_data: Dict[str, Any], 
        target_language: str
    ) -> Dict[str, Any]:
        """Translate skill-related content"""
        try:
            translated_skill = skill_data.copy()
            
            # Translate text fields
            text_fields = ['name', 'description', 'category', 'subcategory']
            
            for field in text_fields:
                if field in translated_skill and translated_skill[field]:
                    translated_skill[field] = await self.translate(
                        translated_skill[field], 
                        target_language
                    )
            
            # Translate tags if they exist
            if 'tags' in translated_skill and translated_skill['tags']:
                translated_tags = []
                for tag in translated_skill['tags']:
                    translated_tag = await self.translate(tag, target_language)
                    translated_tags.append(translated_tag)
                translated_skill['tags'] = translated_tags
            
            return translated_skill
            
        except Exception as e:
            logger.error(f"Error translating skill content: {str(e)}")
            return skill_data
    
    async def translate_learning_content(
        self, 
        content: Dict[str, Any], 
        target_language: str
    ) -> Dict[str, Any]:
        """Translate learning content (questions, answers, resources)"""
        try:
            translated_content = content.copy()
            
            # Translate question and answer
            if 'question' in translated_content:
                translated_content['question'] = await self.translate(
                    translated_content['question'], 
                    target_language
                )
            
            if 'answer' in translated_content:
                translated_content['answer'] = await self.translate(
                    translated_content['answer'], 
                    target_language
                )
            
            # Translate learning resources
            if 'learning_resources' in translated_content:
                for resource in translated_content['learning_resources']:
                    if 'title' in resource:
                        resource['title'] = await self.translate(
                            resource['title'], 
                            target_language
                        )
                    if 'description' in resource:
                        resource['description'] = await self.translate(
                            resource['description'], 
                            target_language
                        )
            
            # Translate next steps
            if 'next_steps' in translated_content:
                translated_steps = []
                for step in translated_content['next_steps']:
                    translated_step = await self.translate(step, target_language)
                    translated_steps.append(translated_step)
                translated_content['next_steps'] = translated_steps
            
            return translated_content
            
        except Exception as e:
            logger.error(f"Error translating learning content: {str(e)}")
            return content
    
    async def get_supported_languages(self) -> Dict[str, str]:
        """Get list of supported languages"""
        return self.supported_languages
    
    async def detect_text_language(self, text: str) -> Dict[str, Any]:
        """Detect language and return confidence score"""
        try:
            detected_language = await self._detect_language(text)
            
            # Calculate confidence score
            text_lower = text.lower()
            word_count = len(text_lower.split())
            
            if detected_language in self.language_patterns:
                patterns = self.language_patterns[detected_language]
                matches = sum(1 for pattern in patterns if pattern in text_lower)
                confidence = matches / max(word_count, 1)
            else:
                confidence = 0.5
            
            return {
                "language": detected_language,
                "language_name": self.supported_languages.get(detected_language, "Unknown"),
                "confidence": min(confidence, 1.0)
            }
            
        except Exception as e:
            logger.error(f"Error detecting text language: {str(e)}")
            return {
                "language": "en",
                "language_name": "English",
                "confidence": 0.5
            }
    
    async def batch_translate(
        self, 
        texts: List[str], 
        target_language: str,
        source_language: Optional[str] = None
    ) -> List[str]:
        """Translate multiple texts in batch"""
        try:
            translations = []
            
            for text in texts:
                translation = await self.translate(text, target_language, source_language)
                translations.append(translation)
            
            return translations
            
        except Exception as e:
            logger.error(f"Error in batch translation: {str(e)}")
            return texts  # Return original texts if translation fails
    
    async def translate_skill_graph(
        self, 
        skill_graph: Dict[str, Any], 
        target_language: str
    ) -> Dict[str, Any]:
        """Translate skill graph content"""
        try:
            translated_graph = skill_graph.copy()
            
            # Translate node names
            if 'nodes' in translated_graph:
                for node in translated_graph['nodes']:
                    if 'name' in node:
                        node['name'] = await self.translate(
                            node['name'], 
                            target_language
                        )
            
            return translated_graph
            
        except Exception as e:
            logger.error(f"Error translating skill graph: {str(e)}")
            return skill_graph
    
    async def create_multilingual_content(
        self, 
        content: str, 
        target_languages: List[str]
    ) -> Dict[str, str]:
        """Create multilingual versions of content"""
        try:
            multilingual_content = {}
            
            for language in target_languages:
                if language in self.supported_languages:
                    translation = await self.translate(content, language)
                    multilingual_content[language] = translation
            
            return multilingual_content
            
        except Exception as e:
            logger.error(f"Error creating multilingual content: {str(e)}")
            return {lang: content for lang in target_languages}

