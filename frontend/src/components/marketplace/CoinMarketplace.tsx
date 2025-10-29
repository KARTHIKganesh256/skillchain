import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Zap, 
  TrendingUp, 
  Gift, 
  BookOpen, 
  CreditCard,
  Star,
  Clock,
  Tag,
  Filter,
  Search,
  Award,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';
import { 
  MarketplaceItem, 
  Sponsor, 
  CoinValue,
  SAMPLE_MARKETPLACE_ITEMS,
  SAMPLE_SPONSORS,
  SAMPLE_COIN_VALUE,
  calculateCoinValue,
  getPersonalizedRecommendations,
  calculateRedemptionValue
} from '../../lib/coinMarketplace.ts';

interface CoinMarketplaceProps {
  userProgress: any;
  onCoinsUpdate: (newCoins: number) => void;
}

const CoinMarketplace: React.FC<CoinMarketplaceProps> = ({
  userProgress,
  onCoinsUpdate
}) => {
  const [items, setItems] = useState<MarketplaceItem[]>(SAMPLE_MARKETPLACE_ITEMS);
  const [sponsors, setSponsors] = useState<Sponsor[]>(SAMPLE_SPONSORS);
  const [coinValue, setCoinValue] = useState<CoinValue>(SAMPLE_COIN_VALUE);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSponsor, setSelectedSponsor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [showRedeemed, setShowRedeemed] = useState<boolean>(false);
  const [redeemedItems, setRedeemedItems] = useState<Set<string>>(new Set());

  // Calculate current coin value for user
  const currentCoinValue = calculateCoinValue(
    userProgress,
    coinValue,
    10000, // total users
    50000  // total activity
  );

  // Get personalized recommendations
  const recommendations = getPersonalizedRecommendations(
    userProgress,
    items,
    Object.keys(userProgress.skillLevels || {})
  );

  // Filter and sort items
  useEffect(() => {
    let filtered = items.filter(item => item.isActive);
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedSponsor !== 'all') {
      filtered = filtered.filter(item => item.sponsorId === selectedSponsor);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (showRedeemed) {
      filtered = filtered.filter(item => redeemedItems.has(item.id));
    } else {
      filtered = filtered.filter(item => !redeemedItems.has(item.id));
    }
    
    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.coinCost - b.coinCost;
        case 'price-high':
          return b.coinCost - a.coinCost;
        case 'discount':
          return b.discount - a.discount;
        case 'value':
          return b.originalValue - a.originalValue;
        case 'recommended':
        default:
          const aIndex = recommendations.findIndex(r => r.id === a.id);
          const bIndex = recommendations.findIndex(r => r.id === b.id);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
      }
    });
    
    setFilteredItems(filtered);
  }, [items, selectedCategory, selectedSponsor, searchQuery, sortBy, showRedeemed, redeemedItems, recommendations]);

  const handleRedeem = (item: MarketplaceItem) => {
    if (userProgress.coins < item.coinCost) {
      alert('Insufficient coins! Keep learning to earn more.');
      return;
    }
    
    if (item.isLimited && item.quantityLeft && item.quantityLeft <= 0) {
      alert('This item is out of stock!');
      return;
    }
    
    const confirmed = window.confirm(
      `Redeem ${item.name} for ${item.coinCost} coins?`
    );
    
    if (confirmed) {
      // Update user coins
      const newCoins = userProgress.coins - item.coinCost;
      onCoinsUpdate(newCoins);
      
      // Mark as redeemed
      setRedeemedItems(prev => new Set([...prev, item.id]));
      
      // Update item quantity if limited
      if (item.isLimited && item.quantityLeft) {
        setItems(prev => prev.map(i => 
          i.id === item.id 
            ? { ...i, quantityLeft: i.quantityLeft! - 1 }
            : i
        ));
      }
      
      alert(`Successfully redeemed ${item.name}! Check your email for details.`);
    }
  };

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category)))];
  const sponsorIds = ['all', ...sponsors.map(s => s.id)];

  const categoryIcons = {
    course: BookOpen,
    gift: Gift,
    subscription: CreditCard,
    discount: Tag,
    physical: Award
  };

  const categoryColors = {
    course: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    gift: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    subscription: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    discount: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    physical: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Coin Marketplace
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Redeem your hard-earned coins for amazing rewards!
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userProgress.coins.toLocaleString()} Coins
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ≈ ${(userProgress.coins * currentCoinValue).toFixed(2)} USD
              </div>
            </div>
          </div>

          {/* Coin Value Info */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Current Coin Value
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${currentCoinValue.toFixed(4)} per coin
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {coinValue.currentMultiplier}x
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Multiplier
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      +{((coinValue.currentMultiplier - 1) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      This Month
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search marketplace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sponsor Filter */}
              <select
                value={selectedSponsor}
                onChange={(e) => setSelectedSponsor(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sponsors</option>
                {sponsorIds.slice(1).map(sponsorId => {
                  const sponsor = sponsors.find(s => s.id === sponsorId);
                  return (
                    <option key={sponsorId} value={sponsorId}>
                      {sponsor?.name || sponsorId}
                    </option>
                  );
                })}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Best Discount</option>
                <option value="value">Highest Value</option>
              </select>

              {/* Show Redeemed Toggle */}
              <Button
                variant={showRedeemed ? "default" : "outline"}
                onClick={() => setShowRedeemed(!showRedeemed)}
                className="whitespace-nowrap"
              >
                {showRedeemed ? "Hide Redeemed" : "Show Redeemed"}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Items Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  No items found matching your criteria.
                </div>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedSponsor('all');
                    setShowRedeemed(false);
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const redemptionValue = calculateRedemptionValue(item, currentCoinValue);
                const isRedeemed = redeemedItems.has(item.id);
                const canAfford = userProgress.coins >= item.coinCost;
                const isOutOfStock = item.isLimited && item.quantityLeft === 0;
                const CategoryIcon = categoryIcons[item.category as keyof typeof categoryIcons];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`h-full transition-all duration-300 ${
                      isRedeemed 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'hover:shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CategoryIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
                                {item.category}
                              </Badge>
                              {item.isLimited && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Limited
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                              {item.name}
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {item.description}
                            </p>
                          </div>
                          {isRedeemed && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Redeemed</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Sponsor Info */}
                        {item.sponsorName && (
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {item.sponsorName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              by {item.sponsorName}
                            </span>
                          </div>
                        )}

                        {/* Value Information */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Zap className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {item.coinCost.toLocaleString()} Coins
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                ${item.originalValue}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Original Value
                              </div>
                            </div>
                          </div>
                          
                          {redemptionValue.savings > 0 && (
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-green-600 font-medium">
                                Save ${redemptionValue.savings.toFixed(2)}
                              </div>
                              <div className="text-sm text-green-600 font-medium">
                                {redemptionValue.savingsPercentage.toFixed(0)}% off
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Stock Info */}
                        {item.isLimited && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-400">Stock</span>
                              <span className="text-gray-900 dark:text-gray-100 font-medium">
                                {item.quantityLeft || 0} left
                              </span>
                            </div>
                            <Progress 
                              value={((item.quantityLeft || 0) / 100) * 100} 
                              className="h-2" 
                            />
                          </div>
                        )}

                        {/* Expiry Info */}
                        {item.expiryDate && (
                          <div className="flex items-center space-x-1 text-sm text-orange-600 mb-4">
                            <Clock className="w-4 h-4" />
                            <span>
                              Expires {new Date(item.expiryDate).toLocaleDateString()}
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
                            <Button className="w-full bg-gray-400" disabled>
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Out of Stock
                            </Button>
                          ) : !canAfford ? (
                            <Button className="w-full bg-gray-400" disabled>
                              <Zap className="w-4 h-4 mr-2" />
                              Need {item.coinCost - userProgress.coins} more coins
                            </Button>
                          ) : (
                            <Button 
                              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                              onClick={() => handleRedeem(item)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Redeem Now
                            </Button>
                          )}
                        </div>

                        {/* External Link */}
                        {item.category === 'course' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
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
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CoinMarketplace;
