"""
Skill Value Calculator Service
AI-powered skill valuation using market data and ML models
"""

import asyncio
import httpx
import numpy as np
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import logging
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import pandas as pd

logger = logging.getLogger(__name__)

class SkillValueCalculator:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.market_data_cache = {}
        
    async def calculate_value(
        self,
        skill_name: str,
        user_experience: int,
        market_demand: Optional[float] = None,
        complexity: Optional[int] = None,
        location: Optional[str] = None,
        industry: Optional[str] = None
    ) -> Dict[str, Any]:
        """Calculate the market value of a skill"""
        try:
            # Get market data
            market_data = await self._get_market_data(skill_name, location, industry)
            
            # Calculate base value
            base_value = await self._calculate_base_value(
                skill_name, user_experience, market_data
            )
            
            # Apply modifiers
            modifiers = await self._calculate_modifiers(
                complexity, location, industry, market_demand
            )
            
            # Final calculation
            final_value = base_value * modifiers['total_multiplier']
            confidence = await self._calculate_confidence(
                skill_name, market_data, user_experience
            )
            
            # Generate recommendations
            recommendations = await self._generate_recommendations(
                skill_name, user_experience, final_value, market_data
            )
            
            return {
                "skill_name": skill_name,
                "estimated_value": round(final_value, 2),
                "confidence_score": confidence,
                "factors": {
                    "base_value": base_value,
                    "modifiers": modifiers,
                    "market_demand": market_data.get('demand_score', 0.5),
                    "location_factor": modifiers.get('location_factor', 1.0),
                    "industry_factor": modifiers.get('industry_factor', 1.0)
                },
                "recommendations": recommendations
            }
            
        except Exception as e:
            logger.error(f"Error calculating skill value: {str(e)}")
            raise
    
    async def _get_market_data(
        self, 
        skill_name: str, 
        location: Optional[str] = None,
        industry: Optional[str] = None
    ) -> Dict[str, Any]:
        """Fetch market data for skill valuation"""
        cache_key = f"{skill_name}_{location}_{industry}"
        
        if cache_key in self.market_data_cache:
            return self.market_data_cache[cache_key]
        
        try:
            # Simulate API calls to job boards and market data sources
            market_data = {
                "demand_score": np.random.uniform(0.3, 1.0),
                "supply_score": np.random.uniform(0.2, 0.8),
                "average_salary": np.random.uniform(30000, 150000),
                "growth_rate": np.random.uniform(-0.1, 0.3),
                "job_postings": np.random.randint(100, 10000),
                "competition_level": np.random.uniform(0.2, 0.9)
            }
            
            # Apply location and industry modifiers
            if location:
                location_modifier = self._get_location_modifier(location)
                market_data["average_salary"] *= location_modifier
                market_data["demand_score"] *= location_modifier
            
            if industry:
                industry_modifier = self._get_industry_modifier(industry)
                market_data["average_salary"] *= industry_modifier
                market_data["demand_score"] *= industry_modifier
            
            self.market_data_cache[cache_key] = market_data
            return market_data
            
        except Exception as e:
            logger.error(f"Error fetching market data: {str(e)}")
            return {
                "demand_score": 0.5,
                "supply_score": 0.5,
                "average_salary": 50000,
                "growth_rate": 0.05,
                "job_postings": 1000,
                "competition_level": 0.5
            }
    
    async def _calculate_base_value(
        self, 
        skill_name: str, 
        user_experience: int, 
        market_data: Dict[str, Any]
    ) -> float:
        """Calculate base value for the skill"""
        base_salary = market_data.get("average_salary", 50000)
        demand_score = market_data.get("demand_score", 0.5)
        
        # Experience multiplier (logarithmic growth)
        experience_multiplier = 1 + (np.log(user_experience + 1) * 0.3)
        
        # Demand multiplier
        demand_multiplier = 0.5 + (demand_score * 1.5)
        
        base_value = base_salary * experience_multiplier * demand_multiplier
        
        return base_value
    
    async def _calculate_modifiers(
        self,
        complexity: Optional[int],
        location: Optional[str],
        industry: Optional[str],
        market_demand: Optional[float]
    ) -> Dict[str, float]:
        """Calculate various modifiers for skill value"""
        modifiers = {
            "complexity_factor": 1.0,
            "location_factor": 1.0,
            "industry_factor": 1.0,
            "demand_factor": 1.0,
            "total_multiplier": 1.0
        }
        
        # Complexity modifier
        if complexity:
            modifiers["complexity_factor"] = 0.7 + (complexity * 0.1)
        
        # Location modifier
        if location:
            modifiers["location_factor"] = self._get_location_modifier(location)
        
        # Industry modifier
        if industry:
            modifiers["industry_factor"] = self._get_industry_modifier(industry)
        
        # Market demand modifier
        if market_demand:
            modifiers["demand_factor"] = 0.5 + (market_demand * 1.5)
        
        # Calculate total multiplier
        modifiers["total_multiplier"] = (
            modifiers["complexity_factor"] *
            modifiers["location_factor"] *
            modifiers["industry_factor"] *
            modifiers["demand_factor"]
        )
        
        return modifiers
    
    def _get_location_modifier(self, location: str) -> float:
        """Get location-based salary modifier"""
        location_modifiers = {
            "san francisco": 1.4,
            "new york": 1.3,
            "seattle": 1.2,
            "boston": 1.15,
            "austin": 1.1,
            "london": 1.25,
            "singapore": 1.2,
            "zurich": 1.3,
            "default": 1.0
        }
        
        location_lower = location.lower()
        for key, modifier in location_modifiers.items():
            if key in location_lower:
                return modifier
        
        return location_modifiers["default"]
    
    def _get_industry_modifier(self, industry: str) -> float:
        """Get industry-based salary modifier"""
        industry_modifiers = {
            "technology": 1.3,
            "finance": 1.25,
            "healthcare": 1.1,
            "consulting": 1.2,
            "education": 0.8,
            "nonprofit": 0.7,
            "default": 1.0
        }
        
        industry_lower = industry.lower()
        for key, modifier in industry_modifiers.items():
            if key in industry_lower:
                return modifier
        
        return industry_modifiers["default"]
    
    async def _calculate_confidence(
        self,
        skill_name: str,
        market_data: Dict[str, Any],
        user_experience: int
    ) -> float:
        """Calculate confidence score for the valuation"""
        confidence_factors = []
        
        # Market data availability
        data_completeness = len([v for v in market_data.values() if v is not None]) / len(market_data)
        confidence_factors.append(data_completeness)
        
        # Experience level confidence
        exp_confidence = min(user_experience / 10, 1.0)
        confidence_factors.append(exp_confidence)
        
        # Market stability
        growth_rate = market_data.get("growth_rate", 0)
        stability = 1 - abs(growth_rate)
        confidence_factors.append(max(stability, 0.3))
        
        # Average confidence
        return sum(confidence_factors) / len(confidence_factors)
    
    async def _generate_recommendations(
        self,
        skill_name: str,
        user_experience: int,
        calculated_value: float,
        market_data: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations based on skill valuation"""
        recommendations = []
        
        # Experience-based recommendations
        if user_experience < 3:
            recommendations.append("Consider taking advanced courses to increase your skill level")
            recommendations.append("Look for mentorship opportunities in this field")
        elif user_experience < 7:
            recommendations.append("Focus on building a portfolio of projects")
            recommendations.append("Consider teaching others to solidify your knowledge")
        else:
            recommendations.append("You're ready to mentor others and earn teaching income")
            recommendations.append("Consider specializing in advanced areas of this skill")
        
        # Market-based recommendations
        demand_score = market_data.get("demand_score", 0.5)
        if demand_score > 0.7:
            recommendations.append("High market demand - great time to monetize this skill")
        elif demand_score < 0.3:
            recommendations.append("Consider diversifying into related skills with higher demand")
        
        # Value-based recommendations
        if calculated_value > 100000:
            recommendations.append("This skill has high earning potential - consider premium pricing")
        elif calculated_value < 30000:
            recommendations.append("Consider combining this skill with others for higher value")
        
        return recommendations
    
    async def get_skill_trends(self, skill_name: str) -> Dict[str, Any]:
        """Get market trends for a specific skill"""
        try:
            # Simulate trend analysis
            trends = {
                "skill_name": skill_name,
                "trend_direction": "growing",
                "growth_rate": np.random.uniform(0.05, 0.25),
                "forecast_6_months": {
                    "demand_change": np.random.uniform(-0.1, 0.3),
                    "salary_change": np.random.uniform(-0.05, 0.2)
                },
                "forecast_12_months": {
                    "demand_change": np.random.uniform(-0.15, 0.4),
                    "salary_change": np.random.uniform(-0.1, 0.3)
                },
                "key_factors": [
                    "Technology advancement driving demand",
                    "Remote work increasing accessibility",
                    "Industry certification requirements"
                ],
                "related_skills": [
                    f"{skill_name} Advanced",
                    f"{skill_name} Certification",
                    f"{skill_name} Specialization"
                ]
            }
            
            return trends
            
        except Exception as e:
            logger.error(f"Error getting skill trends: {str(e)}")
            return {
                "skill_name": skill_name,
                "trend_direction": "stable",
                "growth_rate": 0.05,
                "forecast_6_months": {"demand_change": 0.1, "salary_change": 0.05},
                "forecast_12_months": {"demand_change": 0.2, "salary_change": 0.1},
                "key_factors": [],
                "related_skills": []
            }

