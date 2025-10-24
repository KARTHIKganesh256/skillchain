import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  difficultyLevel: number;
  estimatedHours: number;
  prerequisites: string[];
  tags: string[];
  isVerified: boolean;
  marketValue?: number;
  demandScore?: number;
  userProficiency?: number;
  userExperienceHours?: number;
  isTeaching?: boolean;
  hourlyRate?: number;
}

interface SkillContextType {
  skills: Skill[];
  userSkills: Skill[];
  loading: boolean;
  fetchSkills: () => Promise<void>;
  fetchUserSkills: () => Promise<void>;
  addUserSkill: (skillId: string, proficiencyLevel: number) => Promise<void>;
  updateUserSkill: (skillId: string, updates: Partial<Skill>) => Promise<void>;
  removeUserSkill: (skillId: string) => Promise<void>;
  searchSkills: (query: string) => Skill[];
  getSkillsByCategory: (category: string) => Skill[];
  getRecommendedSkills: () => Skill[];
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const useSkills = () => {
  const context = useContext(SkillContext);
  if (context === undefined) {
    throw new Error('useSkills must be used within a SkillProvider');
  }
  return context;
};

interface SkillProviderProps {
  children: ReactNode;
}

export const SkillProvider: React.FC<SkillProviderProps> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/skills', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSkills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/users/skills', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserSkills(data.skills);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const addUserSkill = async (skillId: string, proficiencyLevel: number) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/users/skills', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skillId, proficiencyLevel })
      });

      if (response.ok) {
        await fetchUserSkills();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add skill');
      }
    } catch (error) {
      console.error('Error adding user skill:', error);
      throw error;
    }
  };

  const updateUserSkill = async (skillId: string, updates: Partial<Skill>) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/skills/${skillId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await fetchUserSkills();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update skill');
      }
    } catch (error) {
      console.error('Error updating user skill:', error);
      throw error;
    }
  };

  const removeUserSkill = async (skillId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/skills/${skillId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchUserSkills();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove skill');
      }
    } catch (error) {
      console.error('Error removing user skill:', error);
      throw error;
    }
  };

  const searchSkills = (query: string): Skill[] => {
    if (!query.trim()) return skills;
    
    const lowercaseQuery = query.toLowerCase();
    return skills.filter(skill => 
      skill.name.toLowerCase().includes(lowercaseQuery) ||
      skill.description.toLowerCase().includes(lowercaseQuery) ||
      skill.category.toLowerCase().includes(lowercaseQuery) ||
      skill.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getSkillsByCategory = (category: string): Skill[] => {
    return skills.filter(skill => skill.category === category);
  };

  const getRecommendedSkills = (): Skill[] => {
    // Mock recommendation logic - in production, use AI recommendations
    return skills
      .filter(skill => !userSkills.some(userSkill => userSkill.id === skill.id))
      .sort((a, b) => (b.demandScore || 0) - (a.demandScore || 0))
      .slice(0, 10);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const value: SkillContextType = {
    skills,
    userSkills,
    loading,
    fetchSkills,
    fetchUserSkills,
    addUserSkill,
    updateUserSkill,
    removeUserSkill,
    searchSkills,
    getSkillsByCategory,
    getRecommendedSkills
  };

  return (
    <SkillContext.Provider value={value}>
      {children}
    </SkillContext.Provider>
  );
};

