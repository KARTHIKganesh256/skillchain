import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  Gift, 
  Star, 
  Zap, 
  Crown,
  Sparkles,
  Award,
  Trophy,
  Gem,
  Flame,
  Shield,
  Sword,
  Eye,
  Lock,
  Unlock,
  ShoppingCart,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  category: 'discount' | 'gift' | 'course' | 'subscription' | 'physical' | 'mystery';
  coinCost: number;
  originalValue: number;
  discount: number;
  sponsorId?: string;
  sponsorName?: string;
  imageUrl?: string;
  isActive: boolean;
  isLimited: boolean;
  quantityLeft?: number;
  expiryDate?: string;
  requirements?: string[];
  tags: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  energyLevel: number;
  storyDescription: string;
}

interface MysteryBox {
  id: string;
  name: string;
  cost: number;
  description: string;
  possibleRewards: string[];
  rarity: string;
  isAvailable: boolean;
}

const RewardsChamber: React.FC = () => {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([]);
  const [userProgress, setUserProgress] = useState({
    coins: 2500,
    level: 12,
    totalXP: 8500,
    currentStreak: 7,
    completedTasks: 45,
    coinValue: 0.0125,
    coinMultiplier: 1.25
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [redeemedItems, setRedeemedItems] = useState<Set<string>>(new Set());
  const [coinAnimation, setCoinAnimation] = useState(false);
  const [mysteryBoxAnimation, setMysteryBoxAnimation] = useState(false);

  // Sample rewards with story elements
  useEffect(() => {
    const sampleRewards: RewardItem[] = [
      {
        id: 'reward-1',
        name: 'Ancient Codex of React Mastery',
        description: 'A mystical tome containing the deepest secrets of React development',
        category: 'course',
        coinCost: 800,
        originalValue: 299,
        discount: 25,
        sponsorId: 'udemy',
        sponsorName: 'Udemy',
        isActive: true,
        isLimited: false,
        tags: ['React', 'JavaScript', 'Frontend', 'Ancient Knowledge'],
        rarity: 'epic',
        energyLevel: 85,
        storyDescription: 'This ancient codex was forged by the first React Guardians. Its pages shimmer with the energy of countless components rendered and state managed.'
      },
      {
        id: 'reward-2',
        name: 'Crystal of Infinite Storage',
        description: 'A magical crystal that grants access to cloud storage beyond mortal comprehension',
        category: 'subscription',
        coinCost: 500,
        originalValue: 99,
        discount: 0,
        sponsorId: 'google',
        sponsorName: 'Google Cloud',
        isActive: true,
        isLimited: true,
        quantityLeft: 15,
        tags: ['Cloud', 'Storage', 'Magic', 'Crystal'],
        rarity: 'rare',
        energyLevel: 70,
        storyDescription: 'Carved from the heart of a dying star, this crystal pulses with the energy of infinite data streams.'
      },
      {
        id: 'reward-3',
        name: 'Guardian\'s Coffee Elixir',
        description: 'A mystical brew that enhances focus and coding prowess for 24 hours',
        category: 'discount',
        coinCost: 150,
        originalValue: 0,
        discount: 30,
        sponsorId: 'starbucks',
        sponsorName: 'Starbucks',
        isActive: true,
        isLimited: true,
        quantityLeft: 50,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['Coffee', 'Focus', 'Elixir', 'Guardian'],
        rarity: 'common',
        energyLevel: 40,
        storyDescription: 'Brewed by the Coffee Guardians of the Morning Realm, this elixir sharpens the mind and quickens the fingers.'
      },
      {
        id: 'reward-4',
        name: 'Sword of Code Execution',
        description: 'A legendary blade that cuts through bugs with the precision of a master coder',
        category: 'physical',
        coinCost: 2000,
        originalValue: 199,
        discount: 15,
        sponsorId: 'skillchain',
        sponsorName: 'SkillChain',
        isActive: true,
        isLimited: true,
        quantityLeft: 3,
        tags: ['Sword', 'Legendary', 'Physical', 'Code'],
        rarity: 'legendary',
        energyLevel: 95,
        storyDescription: 'Forged in the fires of the Debug Forge, this blade has been wielded by the greatest code warriors throughout history.'
      },
      {
        id: 'reward-5',
        name: 'Mystery Box of Digital Treasures',
        description: 'A mysterious container that may contain any number of magical coding artifacts',
        category: 'mystery',
        coinCost: 300,
        originalValue: 0,
        discount: 0,
        isActive: true,
        isLimited: true,
        quantityLeft: 20,
        tags: ['Mystery', 'Treasure', 'Random', 'Magic'],
        rarity: 'rare',
        energyLevel: 60,
        storyDescription: 'This enigmatic box pulses with unknown energies. Only the bravest guardians dare to open it.'
      }
    ];
    setRewards(sampleRewards);
  }, []);

  // Sample mystery boxes
  useEffect(() => {
    const sampleMysteryBoxes: MysteryBox[] = [
      {
        id: 'mystery-1',
        name: 'Novice\'s Treasure Chest',
        cost: 200,
        description: 'A small chest perfect for beginning guardians',
        possibleRewards: ['50-100 Coins', 'Basic Course Access', 'Guardian Badge'],
        rarity: 'common',
        isAvailable: true
      },
      {
        id: 'mystery-2',
        name: 'Guardian\'s Mystery Vault',
        cost: 500,
        description: 'A medium-sized vault with greater treasures',
        possibleRewards: ['100-300 Coins', 'Premium Course', 'Rare Badge', 'Discount Coupons'],
        rarity: 'rare',
        isAvailable: true
      },
      {
        id: 'mystery-3',
        name: 'Legendary Artifact Box',
        cost: 1000,
        description: 'A large, ornate box containing legendary treasures',
        possibleRewards: ['500-1000 Coins', 'Exclusive Courses', 'Legendary Badge', 'Physical Rewards'],
        rarity: 'legendary',
        isAvailable: userProgress.level >= 10
      }
    ];
    setMysteryBoxes(sampleMysteryBoxes);
  }, [userProgress.level]);

  const handleRedeem = (reward: RewardItem) => {
    if (userProgress.coins < reward.coinCost) {
      alert('Insufficient coins! Continue your journey to earn more.');
      return;
    }
    
    if (reward.isLimited && reward.quantityLeft && reward.quantityLeft <= 0) {
      alert('This artifact is no longer available!');
      return;
    }
    
    const confirmed = window.confirm(
      `Redeem ${reward.name} for ${reward.coinCost} coins?`
    );
    
    if (confirmed) {
      setUserProgress(prev => ({
        ...prev,
        coins: prev.coins - reward.coinCost
      }));
      
      setRedeemedItems(prev => new Set([...prev, reward.id]));
      
      if (reward.isLimited && reward.quantityLeft) {
        setRewards(prev => prev.map(r => 
          r.id === reward.id 
            ? { ...r, quantityLeft: r.quantityLeft! - 1 }
            : r
        ));
      }
      
      // Trigger coin animation
      setCoinAnimation(true);
      setTimeout(() => setCoinAnimation(false), 1000);
      
      alert(`Successfully redeemed ${reward.name}! The artifact's power is now yours.`);
    }
  };

  const handleMysteryBoxOpen = (box: MysteryBox) => {
    if (userProgress.coins < box.cost) {
      alert('Insufficient coins for this mystery box!');
      return;
    }
    
    const confirmed = window.confirm(
      `Open ${box.name} for ${box.cost} coins?`
    );
    
    if (confirmed) {
      setUserProgress(prev => ({
        ...prev,
        coins: prev.coins - box.cost
      }));
      
      setMysteryBoxAnimation(true);
      setTimeout(() => setMysteryBoxAnimation(false), 2000);
      
      // Simulate mystery box opening
      setTimeout(() => {
        const randomReward = box.possibleRewards[Math.floor(Math.random() * box.possibleRewards.length)];
        alert(`🎉 You received: ${randomReward}!`);
      }, 1500);
    }
  };

  const filteredRewards = rewards.filter(reward => {
    if (selectedCategory !== 'all' && reward.category !== selectedCategory) return false;
    if (selectedRarity !== 'all' && reward.rarity !== selectedRarity) return false;
    if (searchQuery && !reward.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !reward.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return reward.isActive && !redeemedItems.has(reward.id);
  });

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'from-gray-400 to-gray-600',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-orange-600'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityIcon = (rarity: string) => {
    const icons = {
      common: Gem,
      rare: Star,
      epic: Crown,
      legendary: Trophy
    };
    return icons[rarity as keyof typeof icons] || Gem;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-cyan-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(0, 255, 255, 0.05) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Floating Coins Animation */}
        {coinAnimation && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400 text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                initial={{ opacity: 1, scale: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 1, 
                  y: -100,
                  rotate: 360
                }}
                transition={{ duration: 1, delay: i * 0.05 }}
              >
                <Coins className="w-8 h-8" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                The Rewards Chamber
              </h1>
              <p className="text-gray-300 mt-2">
                Spend your hard-earned coins on magical artifacts and digital treasures
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                {userProgress.coins.toLocaleString()} Coins
              </div>
              <div className="text-sm text-gray-400">
                ≈ ${(userProgress.coins * userProgress.coinValue).toFixed(2)} USD
              </div>
            </div>
          </div>

          {/* Coin Value Info */}
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="p-3 bg-yellow-500/20 rounded-lg"
                    animate={coinAnimation ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Coins className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Current Coin Value
                    </h3>
                    <p className="text-sm text-gray-300">
                      ${userProgress.coinValue.toFixed(4)} per coin (×{userProgress.coinMultiplier} multiplier)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    +{((userProgress.coinMultiplier - 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    This Month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mystery Boxes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Mystery Boxes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mysteryBoxes.map((box, index) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-black/50 backdrop-blur-md border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={mysteryBoxAnimation ? { 
                        rotate: [0, 360, 0],
                        scale: [1, 1.2, 1]
                      } : {}}
                      transition={{ duration: 2 }}
                    >
                      <Gift className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-white mb-2">{box.name}</h3>
                    <p className="text-sm text-gray-300 mb-4">{box.description}</p>
                    <div className="text-yellow-400 font-bold text-xl mb-4">
                      {box.cost} Coins
                    </div>
                    <div className="text-xs text-gray-400 mb-4">
                      Possible rewards: {box.possibleRewards.join(', ')}
                    </div>
                    <Button
                      onClick={() => handleMysteryBoxOpen(box)}
                      disabled={!box.isAvailable || userProgress.coins < box.cost}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      {box.isAvailable ? 'Open Mystery Box' : 'Level Required'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-4 bg-black/30 backdrop-blur-md border-cyan-500/30">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search magical artifacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <div className="flex space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All Categories</option>
                  <option value="course">Ancient Codices</option>
                  <option value="subscription">Magical Subscriptions</option>
                  <option value="discount">Guardian Elixirs</option>
                  <option value="physical">Legendary Artifacts</option>
                  <option value="mystery">Mystery Boxes</option>
                </select>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Rewards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRewards.map((reward, index) => {
            const RarityIcon = getRarityIcon(reward.rarity);
            const canAfford = userProgress.coins >= reward.coinCost;
            const isOutOfStock = reward.isLimited && reward.quantityLeft === 0;
            const isRedeemed = redeemedItems.has(reward.id);

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`h-full transition-all duration-300 border-0 bg-black/30 backdrop-blur-md group ${
                  isRedeemed 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-cyan-500/20 hover:border-cyan-400/50'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <RarityIcon className={`w-5 h-5 text-${reward.rarity === 'common' ? 'gray' : reward.rarity === 'rare' ? 'blue' : reward.rarity === 'epic' ? 'purple' : 'yellow'}-400`} />
                          <Badge className={`bg-gradient-to-r ${getRarityColor(reward.rarity)} text-white`}>
                            {reward.rarity.toUpperCase()}
                          </Badge>
                          {reward.isLimited && (
                            <Badge variant="outline" className="text-xs border-orange-500 text-orange-400">
                              <Clock className="w-3 h-3 mr-1" />
                              Limited
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-bold text-white mb-2">
                          {reward.name}
                        </CardTitle>
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                          {reward.description}
                        </p>
                      </div>
                      {isRedeemed && (
                        <div className="flex items-center space-x-1 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Redeemed</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Story Description */}
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-cyan-300 italic">
                        "{reward.storyDescription}"
                      </p>
                    </div>

                    {/* Energy Level */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Energy Level</span>
                        <span className="text-cyan-400">{reward.energyLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                          style={{ width: `${reward.energyLevel}%` }}
                        />
                      </div>
                    </div>

                    {/* Value Information */}
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium text-white">
                            {reward.coinCost.toLocaleString()} Coins
                          </span>
                        </div>
                        {reward.originalValue > 0 && (
                          <div className="text-right">
                            <div className="text-sm font-medium text-white">
                              ${reward.originalValue}
                            </div>
                            <div className="text-xs text-gray-400">
                              Original Value
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {reward.discount > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-green-400 font-medium">
                            Save {reward.discount}%
                          </div>
                          <div className="text-sm text-green-400 font-medium">
                            ${(reward.originalValue * reward.discount / 100).toFixed(2)} off
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {reward.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-300">
                          {tag}
                        </Badge>
                      ))}
                      {reward.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-300">
                          +{reward.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Stock Info */}
                    {reward.isLimited && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Remaining</span>
                          <span className="text-white font-medium">
                            {reward.quantityLeft || 0} left
                          </span>
                        </div>
                        <Progress 
                          value={((reward.quantityLeft || 0) / 100) * 100} 
                          className="h-2" 
                        />
                      </div>
                    )}

                    {/* Expiry Info */}
                    {reward.expiryDate && (
                      <div className="flex items-center space-x-1 text-sm text-orange-400 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>
                          Expires {new Date(reward.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex space-x-2">
                      {isRedeemed ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Redeemed
                        </Button>
                      ) : isOutOfStock ? (
                        <Button className="w-full bg-gray-500" disabled>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Out of Stock
                        </Button>
                      ) : !canAfford ? (
                        <Button className="w-full bg-gray-500" disabled>
                          <Coins className="w-4 h-4 mr-2" />
                          Need {reward.coinCost - userProgress.coins} more coins
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                          onClick={() => handleRedeem(reward)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Redeem Artifact
                        </Button>
                      )}
                    </div>

                    {/* External Link */}
                    {reward.category === 'course' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
                        onClick={() => window.open('https://udemy.com', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Course
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredRewards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-lg mb-4">
              No magical artifacts found matching your criteria.
            </div>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedRarity('all');
              }}
              variant="outline"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RewardsChamber;

