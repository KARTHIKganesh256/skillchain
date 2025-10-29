/**
 * Coin Marketplace - Dynamic coin value system and reward redemption
 * Handles coin valuation, marketplace items, and sponsor offers
 */

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: 'discount' | 'gift' | 'course' | 'subscription' | 'physical';
  coinCost: number;
  originalValue: number; // in USD
  discount: number; // percentage
  sponsorId?: string;
  sponsorName?: string;
  imageUrl?: string;
  isActive: boolean;
  isLimited: boolean;
  quantityLeft?: number;
  expiryDate?: string;
  requirements?: string[];
  tags: string[];
  createdAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  category: string;
  totalOffers: number;
  activeOffers: number;
  userEngagement: number;
  reputation: number;
  isVerified: boolean;
}

export interface CoinValue {
  baseValue: number; // Base value in USD
  currentMultiplier: number;
  marketCap: number;
  totalCoinsInCirculation: number;
  lastUpdated: string;
  priceHistory: Array<{
    date: string;
    value: number;
    multiplier: number;
  }>;
}

export interface UserRedemption {
  id: string;
  userId: string;
  itemId: string;
  redeemedAt: string;
  coinsSpent: number;
  status: 'pending' | 'completed' | 'cancelled';
  redemptionCode?: string;
  expiryDate?: string;
}

/**
 * Calculate dynamic coin value based on user activity and market conditions
 */
export function calculateCoinValue(
  userProgress: any,
  marketData: CoinValue,
  totalUsers: number,
  totalActivity: number
): number {
  // Base value from market data
  let value = marketData.baseValue * marketData.currentMultiplier;
  
  // User-specific multiplier based on their activity
  const userActivityMultiplier = Math.min(
    1 + (userProgress.totalXP / 10000) * 0.1, // XP-based bonus
    1.5 // Max 50% bonus
  );
  
  // Streak bonus
  const streakMultiplier = Math.min(
    1 + (userProgress.currentStreak / 30) * 0.2, // Streak bonus
    1.2 // Max 20% bonus
  );
  
  // Market conditions
  const marketMultiplier = Math.min(
    1 + (totalActivity / (totalUsers * 100)) * 0.3, // Activity-based
    1.3 // Max 30% bonus
  );
  
  return value * userActivityMultiplier * streakMultiplier * marketMultiplier;
}

/**
 * Calculate coin value multiplier based on platform activity
 */
export function calculatePlatformMultiplier(
  totalUsers: number,
  dailyActiveUsers: number,
  totalCoinsEarned: number,
  totalCoinsSpent: number
): number {
  // Base multiplier
  let multiplier = 1.0;
  
  // User growth factor
  const userGrowthFactor = Math.min(dailyActiveUsers / totalUsers, 0.1);
  multiplier += userGrowthFactor;
  
  // Economic activity factor
  const economicActivity = totalCoinsSpent / Math.max(totalCoinsEarned, 1);
  multiplier += Math.min(economicActivity * 0.2, 0.3);
  
  // Platform health factor
  const platformHealth = Math.min(totalUsers / 10000, 1); // Scale with user base
  multiplier += platformHealth * 0.1;
  
  return Math.min(multiplier, 2.0); // Cap at 2x
}

/**
 * Get personalized marketplace recommendations
 */
export function getPersonalizedRecommendations(
  userProgress: any,
  allItems: MarketplaceItem[],
  userSkills: string[]
): MarketplaceItem[] {
  return allItems
    .filter(item => item.isActive)
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      // Affordability score (higher is better)
      const userCoins = userProgress.coins;
      scoreA += userCoins >= a.coinCost ? 10 : 0;
      scoreB += userCoins >= b.coinCost ? 10 : 0;
      
      // Value score (discount percentage)
      scoreA += a.discount;
      scoreB += b.discount;
      
      // Skill relevance
      if (a.tags.some(tag => userSkills.includes(tag))) scoreA += 5;
      if (b.tags.some(tag => userSkills.includes(tag))) scoreB += 5;
      
      // User level relevance
      const userLevel = userProgress.currentLevel;
      if (a.category === 'course' && userLevel >= 5) scoreA += 3;
      if (b.category === 'course' && userLevel >= 5) scoreB += 3;
      
      return scoreB - scoreA;
    })
    .slice(0, 10);
}

/**
 * Calculate redemption value and savings
 */
export function calculateRedemptionValue(
  item: MarketplaceItem,
  coinValue: number
): {
  coinValueUSD: number;
  savings: number;
  savingsPercentage: number;
  isGoodDeal: boolean;
} {
  const coinValueUSD = item.coinCost * coinValue;
  const savings = item.originalValue - coinValueUSD;
  const savingsPercentage = (savings / item.originalValue) * 100;
  const isGoodDeal = savingsPercentage > 20; // Good deal if >20% savings
  
  return {
    coinValueUSD,
    savings,
    savingsPercentage,
    isGoodDeal
  };
}

/**
 * Sample marketplace items
 */
export const SAMPLE_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'item-1',
    name: 'Udemy Course: Complete React Developer',
    description: 'Master React development with this comprehensive course',
    category: 'course',
    coinCost: 500,
    originalValue: 199,
    discount: 25,
    sponsorId: 'udemy',
    sponsorName: 'Udemy',
    imageUrl: '/images/courses/react-course.jpg',
    isActive: true,
    isLimited: false,
    tags: ['React', 'JavaScript', 'Frontend'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'item-2',
    name: 'Amazon Gift Card - $50',
    description: 'Redeem for any items on Amazon',
    category: 'gift',
    coinCost: 800,
    originalValue: 50,
    discount: 0,
    sponsorId: 'amazon',
    sponsorName: 'Amazon',
    imageUrl: '/images/gift-cards/amazon.jpg',
    isActive: true,
    isLimited: true,
    quantityLeft: 25,
    tags: ['Shopping', 'Gift Card'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'item-3',
    name: 'GitHub Pro Subscription - 1 Month',
    description: 'Access to private repositories and advanced features',
    category: 'subscription',
    coinCost: 300,
    originalValue: 4,
    discount: 0,
    sponsorId: 'github',
    sponsorName: 'GitHub',
    imageUrl: '/images/subscriptions/github-pro.jpg',
    isActive: true,
    isLimited: false,
    tags: ['Development', 'Git', 'Code'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'item-4',
    name: 'Starbucks Coffee - 20% Off',
    description: 'Get 20% off your next coffee purchase',
    category: 'discount',
    coinCost: 100,
    originalValue: 0,
    discount: 20,
    sponsorId: 'starbucks',
    sponsorName: 'Starbucks',
    imageUrl: '/images/discounts/starbucks.jpg',
    isActive: true,
    isLimited: true,
    quantityLeft: 100,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Food', 'Coffee', 'Discount'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'item-5',
    name: 'SkillChain Premium - 1 Month',
    description: 'Unlock all premium features and AI assistance',
    category: 'subscription',
    coinCost: 1000,
    originalValue: 99,
    discount: 0,
    sponsorId: 'skillchain',
    sponsorName: 'SkillChain',
    imageUrl: '/images/subscriptions/skillchain-premium.jpg',
    isActive: true,
    isLimited: false,
    tags: ['Premium', 'AI', 'Learning'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'item-6',
    name: 'MacBook Pro Accessories Kit',
    description: 'Professional accessories for MacBook Pro users',
    category: 'physical',
    coinCost: 2000,
    originalValue: 150,
    discount: 15,
    sponsorId: 'apple',
    sponsorName: 'Apple',
    imageUrl: '/images/physical/macbook-accessories.jpg',
    isActive: true,
    isLimited: true,
    quantityLeft: 5,
    tags: ['Hardware', 'Apple', 'Accessories'],
    createdAt: new Date().toISOString()
  }
];

/**
 * Sample sponsors
 */
export const SAMPLE_SPONSORS: Sponsor[] = [
  {
    id: 'udemy',
    name: 'Udemy',
    logoUrl: '/images/sponsors/udemy-logo.png',
    description: 'Online learning platform with thousands of courses',
    category: 'Education',
    totalOffers: 15,
    activeOffers: 8,
    userEngagement: 0.75,
    reputation: 4.8,
    isVerified: true
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logoUrl: '/images/sponsors/amazon-logo.png',
    description: 'Global e-commerce and cloud computing company',
    category: 'E-commerce',
    totalOffers: 25,
    activeOffers: 12,
    userEngagement: 0.85,
    reputation: 4.9,
    isVerified: true
  },
  {
    id: 'github',
    name: 'GitHub',
    logoUrl: '/images/sponsors/github-logo.png',
    description: 'Code hosting platform for version control and collaboration',
    category: 'Development',
    totalOffers: 5,
    activeOffers: 3,
    userEngagement: 0.90,
    reputation: 4.9,
    isVerified: true
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    logoUrl: '/images/sponsors/starbucks-logo.png',
    description: 'Coffee company and coffeehouse chain',
    category: 'Food & Beverage',
    totalOffers: 8,
    activeOffers: 5,
    userEngagement: 0.65,
    reputation: 4.2,
    isVerified: true
  }
];

/**
 * Sample coin value data
 */
export const SAMPLE_COIN_VALUE: CoinValue = {
  baseValue: 0.01, // $0.01 USD per coin
  currentMultiplier: 1.25,
  marketCap: 1250000, // $1.25M
  totalCoinsInCirculation: 100000000,
  lastUpdated: new Date().toISOString(),
  priceHistory: [
    { date: '2024-01-01', value: 0.008, multiplier: 1.0 },
    { date: '2024-01-15', value: 0.009, multiplier: 1.1 },
    { date: '2024-02-01', value: 0.010, multiplier: 1.2 },
    { date: '2024-02-15', value: 0.012, multiplier: 1.25 }
  ]
};

