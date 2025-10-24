"""
Recommendation Engine Service
AI-powered recommendations for skills, connections, and learning paths
"""

import asyncio
import numpy as np
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime, timedelta
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self):
        self.user_profiles = {}
        self.skill_embeddings = {}
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.is_trained = False
        
    async def get_recommendations(
        self,
        user_id: str,
        recommendation_type: str,
        limit: int = 10
    ) -> Dict[str, Any]:
        """Get AI-powered recommendations for users"""
        try:
            # Get user profile
            user_profile = await self._get_user_profile(user_id)
            
            if recommendation_type == "learn":
                recommendations = await self._get_learning_recommendations(user_profile, limit)
            elif recommendation_type == "teach":
                recommendations = await self._get_teaching_recommendations(user_profile, limit)
            elif recommendation_type == "connect":
                recommendations = await self._get_connection_recommendations(user_profile, limit)
            elif recommendation_type == "challenge":
                recommendations = await self._get_challenge_recommendations(user_profile, limit)
            else:
                raise ValueError(f"Invalid recommendation type: {recommendation_type}")
            
            # Calculate confidence scores
            confidence_scores = await self._calculate_confidence_scores(recommendations, user_profile)
            
            # Generate reasoning
            reasoning = await self._generate_reasoning(recommendation_type, user_profile, recommendations)
            
            return {
                "recommendations": recommendations,
                "confidence_scores": confidence_scores,
                "reasoning": reasoning
            }
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            raise
    
    async def _get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive user profile for recommendations"""
        try:
            # In production, fetch from database
            # For now, return mock profile
            return {
                "user_id": user_id,
                "skills": [
                    {"name": "Python", "level": 8, "experience_hours": 2000},
                    {"name": "JavaScript", "level": 7, "experience_hours": 1500},
                    {"name": "React", "level": 6, "experience_hours": 800}
                ],
                "learning_goals": ["Machine Learning", "Data Science", "Cloud Architecture"],
                "teaching_interests": ["Python", "Web Development"],
                "learning_style": "hands_on",
                "time_availability": "evenings",
                "preferred_difficulty": "intermediate",
                "interests": ["Technology", "AI", "Startups"],
                "location": "San Francisco",
                "experience_level": "mid_level"
            }
        except Exception as e:
            logger.error(f"Error getting user profile: {str(e)}")
            return {}
    
    async def _get_learning_recommendations(
        self, 
        user_profile: Dict[str, Any], 
        limit: int
    ) -> List[Dict[str, Any]]:
        """Get skill learning recommendations"""
        try:
            current_skills = [skill["name"] for skill in user_profile.get("skills", [])]
            learning_goals = user_profile.get("learning_goals", [])
            
            # Generate skill recommendations based on current skills and goals
            recommendations = []
            
            # Skills related to current skills
            for skill in user_profile.get("skills", []):
                related_skills = await self._get_related_skills(skill["name"])
                for related_skill in related_skills:
                    if related_skill not in current_skills:
                        recommendations.append({
                            "type": "skill",
                            "id": related_skill.lower().replace(" ", "_"),
                            "name": related_skill,
                            "reason": f"Related to your {skill['name']} expertise",
                            "difficulty": "intermediate",
                            "estimated_hours": np.random.randint(20, 100),
                            "market_demand": np.random.uniform(0.6, 1.0)
                        })
            
            # Skills from learning goals
            for goal in learning_goals:
                if goal not in current_skills:
                    recommendations.append({
                        "type": "skill",
                        "id": goal.lower().replace(" ", "_"),
                        "name": goal,
                        "reason": "Matches your learning goals",
                        "difficulty": "advanced",
                        "estimated_hours": np.random.randint(50, 200),
                        "market_demand": np.random.uniform(0.7, 1.0)
                    })
            
            # Remove duplicates and sort by relevance
            unique_recommendations = self._remove_duplicates(recommendations)
            sorted_recommendations = sorted(
                unique_recommendations, 
                key=lambda x: x["market_demand"], 
                reverse=True
            )
            
            return sorted_recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error getting learning recommendations: {str(e)}")
            return []
    
    async def _get_teaching_recommendations(
        self, 
        user_profile: Dict[str, Any], 
        limit: int
    ) -> List[Dict[str, Any]]:
        """Get teaching opportunity recommendations"""
        try:
            teaching_skills = user_profile.get("teaching_interests", [])
            current_skills = user_profile.get("skills", [])
            
            recommendations = []
            
            # Find skills user can teach
            for skill in current_skills:
                if skill["level"] >= 6:  # Only recommend teaching for advanced skills
                    recommendations.append({
                        "type": "teaching_opportunity",
                        "skill_id": skill["name"].lower().replace(" ", "_"),
                        "skill_name": skill["name"],
                        "reason": f"You have {skill['level']}/10 proficiency in {skill['name']}",
                        "potential_earnings": skill["level"] * 1000,
                        "market_demand": np.random.uniform(0.5, 1.0),
                        "teaching_format": ["1-on-1", "group", "workshop"]
                    })
            
            # Sort by potential earnings
            sorted_recommendations = sorted(
                recommendations, 
                key=lambda x: x["potential_earnings"], 
                reverse=True
            )
            
            return sorted_recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error getting teaching recommendations: {str(e)}")
            return []
    
    async def _get_connection_recommendations(
        self, 
        user_profile: Dict[str, Any], 
        limit: int
    ) -> List[Dict[str, Any]]:
        """Get user connection recommendations"""
        try:
            # In production, use collaborative filtering
            # For now, return mock connections
            recommendations = []
            
            # Mock connection data
            potential_connections = [
                {
                    "user_id": "user_123",
                    "name": "Sarah Chen",
                    "skills": ["Machine Learning", "Python", "Data Science"],
                    "location": "San Francisco",
                    "experience_level": "senior",
                    "teaching_offers": ["Python", "Machine Learning"],
                    "learning_interests": ["Cloud Architecture"]
                },
                {
                    "user_id": "user_456",
                    "name": "Mike Rodriguez",
                    "skills": ["React", "Node.js", "JavaScript"],
                    "location": "San Francisco",
                    "experience_level": "mid_level",
                    "teaching_offers": ["React", "JavaScript"],
                    "learning_interests": ["Python", "Data Science"]
                }
            ]
            
            for connection in potential_connections:
                # Calculate compatibility score
                compatibility = await self._calculate_compatibility(user_profile, connection)
                
                if compatibility > 0.3:  # Only recommend if compatibility > 30%
                    recommendations.append({
                        "type": "connection",
                        "user_id": connection["user_id"],
                        "name": connection["name"],
                        "compatibility_score": compatibility,
                        "reason": self._generate_connection_reason(user_profile, connection),
                        "mutual_skills": self._find_mutual_skills(user_profile, connection),
                        "learning_opportunities": self._find_learning_opportunities(user_profile, connection)
                    })
            
            # Sort by compatibility
            sorted_recommendations = sorted(
                recommendations, 
                key=lambda x: x["compatibility_score"], 
                reverse=True
            )
            
            return sorted_recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error getting connection recommendations: {str(e)}")
            return []
    
    async def _get_challenge_recommendations(
        self, 
        user_profile: Dict[str, Any], 
        limit: int
    ) -> List[Dict[str, Any]]:
        """Get challenge recommendations"""
        try:
            current_skills = user_profile.get("skills", [])
            experience_level = user_profile.get("experience_level", "beginner")
            
            recommendations = []
            
            # Generate challenges based on user skills
            for skill in current_skills:
                if skill["level"] >= 4:  # Only recommend challenges for intermediate+ skills
                    recommendations.append({
                        "type": "challenge",
                        "id": f"challenge_{skill['name'].lower()}_{skill['level']}",
                        "title": f"Master {skill['name']} - Level {skill['level']}",
                        "description": f"Complete advanced projects in {skill['name']}",
                        "skill": skill["name"],
                        "difficulty": skill["level"],
                        "estimated_hours": skill["level"] * 10,
                        "reward_skillcoins": skill["level"] * 100,
                        "xp_reward": skill["level"] * 50,
                        "deadline_days": 30
                    })
            
            # Add general skill-building challenges
            general_challenges = [
                {
                    "type": "challenge",
                    "id": "challenge_portfolio_builder",
                    "title": "Portfolio Builder",
                    "description": "Create 3 portfolio projects showcasing your skills",
                    "skill": "Portfolio Development",
                    "difficulty": 5,
                    "estimated_hours": 40,
                    "reward_skillcoins": 500,
                    "xp_reward": 200,
                    "deadline_days": 45
                }
            ]
            
            recommendations.extend(general_challenges)
            
            # Sort by difficulty and reward
            sorted_recommendations = sorted(
                recommendations, 
                key=lambda x: (x["difficulty"], x["reward_skillcoins"]), 
                reverse=True
            )
            
            return sorted_recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error getting challenge recommendations: {str(e)}")
            return []
    
    async def _get_related_skills(self, skill_name: str) -> List[str]:
        """Get skills related to the given skill"""
        # In production, use skill relationship data
        skill_relationships = {
            "Python": ["Django", "Flask", "Data Science", "Machine Learning", "Automation"],
            "JavaScript": ["React", "Node.js", "Vue.js", "TypeScript", "Web Development"],
            "React": ["Redux", "Next.js", "React Native", "JavaScript", "Frontend Development"],
            "Machine Learning": ["Python", "TensorFlow", "PyTorch", "Data Science", "Statistics"],
            "Data Science": ["Python", "R", "SQL", "Statistics", "Machine Learning"]
        }
        
        return skill_relationships.get(skill_name, [])
    
    async def _calculate_compatibility(
        self, 
        user_profile: Dict[str, Any], 
        connection: Dict[str, Any]
    ) -> float:
        """Calculate compatibility score between users"""
        try:
            compatibility_factors = []
            
            # Skill overlap
            user_skills = [skill["name"] for skill in user_profile.get("skills", [])]
            connection_skills = connection.get("skills", [])
            skill_overlap = len(set(user_skills).intersection(set(connection_skills)))
            skill_factor = min(skill_overlap / max(len(user_skills), 1), 1.0)
            compatibility_factors.append(skill_factor)
            
            # Location compatibility
            user_location = user_profile.get("location", "")
            connection_location = connection.get("location", "")
            location_factor = 1.0 if user_location == connection_location else 0.5
            compatibility_factors.append(location_factor)
            
            # Experience level compatibility
            user_level = user_profile.get("experience_level", "beginner")
            connection_level = connection.get("experience_level", "beginner")
            level_compatibility = {
                ("beginner", "mid_level"): 0.8,
                ("mid_level", "senior"): 0.7,
                ("beginner", "senior"): 0.5,
                ("mid_level", "mid_level"): 0.9,
                ("senior", "senior"): 0.8
            }
            level_factor = level_compatibility.get((user_level, connection_level), 0.6)
            compatibility_factors.append(level_factor)
            
            # Average compatibility
            return sum(compatibility_factors) / len(compatibility_factors)
            
        except Exception as e:
            logger.error(f"Error calculating compatibility: {str(e)}")
            return 0.5
    
    def _generate_connection_reason(
        self, 
        user_profile: Dict[str, Any], 
        connection: Dict[str, Any]
    ) -> str:
        """Generate reason for connection recommendation"""
        mutual_skills = self._find_mutual_skills(user_profile, connection)
        learning_opportunities = self._find_learning_opportunities(user_profile, connection)
        
        if mutual_skills:
            return f"Share expertise in {', '.join(mutual_skills[:2])}"
        elif learning_opportunities:
            return f"Can learn {', '.join(learning_opportunities[:2])} from them"
        else:
            return "Potential collaboration opportunity"
    
    def _find_mutual_skills(
        self, 
        user_profile: Dict[str, Any], 
        connection: Dict[str, Any]
    ) -> List[str]:
        """Find mutual skills between users"""
        user_skills = [skill["name"] for skill in user_profile.get("skills", [])]
        connection_skills = connection.get("skills", [])
        return list(set(user_skills).intersection(set(connection_skills)))
    
    def _find_learning_opportunities(
        self, 
        user_profile: Dict[str, Any], 
        connection: Dict[str, Any]
    ) -> List[str]:
        """Find learning opportunities from connection"""
        user_skills = [skill["name"] for skill in user_profile.get("skills", [])]
        connection_teaching = connection.get("teaching_offers", [])
        return [skill for skill in connection_teaching if skill not in user_skills]
    
    def _remove_duplicates(self, recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate recommendations"""
        seen = set()
        unique_recommendations = []
        
        for rec in recommendations:
            rec_id = rec.get("id", rec.get("name", ""))
            if rec_id not in seen:
                seen.add(rec_id)
                unique_recommendations.append(rec)
        
        return unique_recommendations
    
    async def _calculate_confidence_scores(
        self, 
        recommendations: List[Dict[str, Any]], 
        user_profile: Dict[str, Any]
    ) -> List[float]:
        """Calculate confidence scores for recommendations"""
        try:
            confidence_scores = []
            
            for rec in recommendations:
                # Base confidence on recommendation type and user profile match
                base_confidence = 0.5
                
                if rec["type"] == "skill":
                    # Higher confidence for skills related to current skills
                    current_skills = [skill["name"] for skill in user_profile.get("skills", [])]
                    if rec["name"] in current_skills:
                        base_confidence = 0.9
                    else:
                        base_confidence = 0.7
                
                elif rec["type"] == "connection":
                    base_confidence = rec.get("compatibility_score", 0.5)
                
                elif rec["type"] == "challenge":
                    # Higher confidence for challenges matching user level
                    user_level = user_profile.get("experience_level", "beginner")
                    challenge_difficulty = rec.get("difficulty", 5)
                    
                    if user_level == "beginner" and challenge_difficulty <= 3:
                        base_confidence = 0.8
                    elif user_level == "mid_level" and 3 <= challenge_difficulty <= 7:
                        base_confidence = 0.8
                    elif user_level == "senior" and challenge_difficulty >= 7:
                        base_confidence = 0.8
                    else:
                        base_confidence = 0.6
                
                confidence_scores.append(min(base_confidence, 1.0))
            
            return confidence_scores
            
        except Exception as e:
            logger.error(f"Error calculating confidence scores: {str(e)}")
            return [0.5] * len(recommendations)
    
    async def _generate_reasoning(
        self, 
        recommendation_type: str, 
        user_profile: Dict[str, Any], 
        recommendations: List[Dict[str, Any]]
    ) -> str:
        """Generate reasoning for recommendations"""
        try:
            if recommendation_type == "learn":
                current_skills = [skill["name"] for skill in user_profile.get("skills", [])]
                return f"Based on your current skills ({', '.join(current_skills[:3])}) and learning goals, these skills will help you advance your career."
            
            elif recommendation_type == "teach":
                teaching_skills = user_profile.get("teaching_interests", [])
                return f"Your expertise in {', '.join(teaching_skills[:2])} makes you an excellent candidate to teach others and earn SkillCoins."
            
            elif recommendation_type == "connect":
                return "These users share similar interests and skills, creating opportunities for mutual learning and collaboration."
            
            elif recommendation_type == "challenge":
                return "These challenges are tailored to your skill level and will help you grow while earning rewards."
            
            return "Personalized recommendations based on your profile and learning patterns."
            
        except Exception as e:
            logger.error(f"Error generating reasoning: {str(e)}")
            return "AI-generated recommendations based on your profile."
    
    async def generate_skill_graph(self, user_id: str) -> Dict[str, Any]:
        """Generate personalized skill graph for user"""
        try:
            user_profile = await self._get_user_profile(user_id)
            current_skills = user_profile.get("skills", [])
            
            # Create skill nodes
            nodes = []
            for skill in current_skills:
                nodes.append({
                    "id": skill["name"].lower().replace(" ", "_"),
                    "name": skill["name"],
                    "level": skill["level"],
                    "category": "current"
                })
            
            # Add recommended skills as nodes
            learning_recs = await self._get_learning_recommendations(user_profile, 5)
            for rec in learning_recs:
                nodes.append({
                    "id": rec["id"],
                    "name": rec["name"],
                    "level": 0,
                    "category": "recommended"
                })
            
            # Create connections between skills
            connections = []
            for i, skill1 in enumerate(current_skills):
                for j, skill2 in enumerate(current_skills[i+1:], i+1):
                    # Calculate connection strength based on skill relationship
                    strength = await self._calculate_skill_connection_strength(skill1["name"], skill2["name"])
                    if strength > 0.3:
                        connections.append({
                            "from": skill1["name"].lower().replace(" ", "_"),
                            "to": skill2["name"].lower().replace(" ", "_"),
                            "strength": strength,
                            "type": "related"
                        })
            
            return {
                "nodes": nodes,
                "connections": connections,
                "user_id": user_id,
                "generated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating skill graph: {str(e)}")
            return {"nodes": [], "connections": [], "user_id": user_id}
    
    async def _calculate_skill_connection_strength(self, skill1: str, skill2: str) -> float:
        """Calculate connection strength between two skills"""
        # In production, use skill relationship data
        skill_relationships = {
            ("Python", "Django"): 0.9,
            ("Python", "Flask"): 0.8,
            ("JavaScript", "React"): 0.9,
            ("JavaScript", "Node.js"): 0.8,
            ("React", "Redux"): 0.7,
            ("Python", "Machine Learning"): 0.8,
            ("Machine Learning", "Data Science"): 0.9
        }
        
        # Check both directions
        return skill_relationships.get((skill1, skill2), 0.0) or skill_relationships.get((skill2, skill1), 0.0)
    
    async def get_user_insights(self, user_id: str) -> Dict[str, Any]:
        """Get AI-generated insights for user"""
        try:
            user_profile = await self._get_user_profile(user_id)
            
            insights = {
                "learning_velocity": await self._calculate_learning_velocity(user_profile),
                "skill_gaps": await self._identify_skill_gaps(user_profile),
                "market_opportunities": await self._identify_market_opportunities(user_profile),
                "learning_recommendations": await self._generate_learning_recommendations(user_profile),
                "career_path_suggestions": await self._suggest_career_paths(user_profile)
            }
            
            return insights
            
        except Exception as e:
            logger.error(f"Error getting user insights: {str(e)}")
            return {}
    
    async def _calculate_learning_velocity(self, user_profile: Dict[str, Any]) -> float:
        """Calculate user's learning velocity"""
        # Mock calculation based on user profile
        skills = user_profile.get("skills", [])
        if not skills:
            return 0.0
        
        # Calculate average skill level
        avg_level = sum(skill["level"] for skill in skills) / len(skills)
        return min(avg_level / 10, 1.0)
    
    async def _identify_skill_gaps(self, user_profile: Dict[str, Any]) -> List[str]:
        """Identify skill gaps for user"""
        current_skills = [skill["name"] for skill in user_profile.get("skills", [])]
        learning_goals = user_profile.get("learning_goals", [])
        
        # Find skills in learning goals not in current skills
        gaps = [goal for goal in learning_goals if goal not in current_skills]
        
        return gaps
    
    async def _identify_market_opportunities(self, user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify market opportunities for user"""
        opportunities = []
        
        # Mock market opportunities
        for skill in user_profile.get("skills", []):
            if skill["level"] >= 6:
                opportunities.append({
                    "skill": skill["name"],
                    "opportunity_type": "teaching",
                    "market_demand": np.random.uniform(0.6, 1.0),
                    "potential_earnings": skill["level"] * 1000,
                    "description": f"High demand for {skill['name']} instructors"
                })
        
        return opportunities
    
    async def _generate_learning_recommendations(self, user_profile: Dict[str, Any]) -> List[str]:
        """Generate learning recommendations"""
        recommendations = []
        
        # Based on skill gaps
        gaps = await self._identify_skill_gaps(user_profile)
        for gap in gaps:
            recommendations.append(f"Focus on learning {gap} to achieve your goals")
        
        # Based on current skills
        for skill in user_profile.get("skills", []):
            if skill["level"] < 8:
                recommendations.append(f"Advance your {skill['name']} skills to expert level")
        
        return recommendations
    
    async def _suggest_career_paths(self, user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Suggest career paths based on user profile"""
        current_skills = [skill["name"] for skill in user_profile.get("skills", [])]
        
        career_paths = []
        
        # Software Engineer path
        if any(skill in current_skills for skill in ["Python", "JavaScript", "React"]):
            career_paths.append({
                "title": "Senior Software Engineer",
                "required_skills": ["Python", "JavaScript", "System Design"],
                "missing_skills": [skill for skill in ["Python", "JavaScript", "System Design"] if skill not in current_skills],
                "time_to_achieve": "6-12 months",
                "salary_range": "$120k - $180k"
            })
        
        # Data Scientist path
        if any(skill in current_skills for skill in ["Python", "Machine Learning", "Data Science"]):
            career_paths.append({
                "title": "Senior Data Scientist",
                "required_skills": ["Python", "Machine Learning", "Statistics"],
                "missing_skills": [skill for skill in ["Python", "Machine Learning", "Statistics"] if skill not in current_skills],
                "time_to_achieve": "8-15 months",
                "salary_range": "$130k - $200k"
            })
        
        return career_paths

