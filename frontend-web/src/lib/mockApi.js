// Mock API for when Supabase is not available
// This provides default data so the app can function

export const mockUserData = {
  id: 'mock-user-id',
  email: 'user@example.com',
  display_name: 'Demo User',
  skill_coin_balance: 100,
  rating: 4.5,
  review_count: 12,
  is_premium: false,
  created_at: new Date().toISOString()
};

export const mockStats = {
  skillCoinBalance: 100,
  rating: 4.5,
  reviewCount: 12,
  postsCount: 3,
  completedTasksCount: 8,
  isPremium: false,
  memberSince: new Date().toISOString()
};

export const mockPosts = [
  {
    id: '1',
    title: 'Web Development Services',
    description: 'I can help you build modern websites using React, Next.js, and Node.js.',
    category: 'Technology',
    type: 'service',
    price: 50,
    skillCoins: 50,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Graphic Design Help',
    description: 'Need a logo design for your business? I specialize in modern, clean designs.',
    category: 'Design',
    type: 'service',
    price: 30,
    skillCoins: 30,
    created_at: new Date().toISOString()
  }
];

export const mockMatches = [
  {
    id: '1',
    title: 'Match Request',
    message: 'I need help with my website design',
    status: 'accepted',
    skillCoins: 25,
    createdAt: new Date().toISOString()
  }
];

export const userAPI = {
  async getUser(userId) {
    return { data: mockUserData };
  },

  async updateUser(userId, updates) {
    return { data: { ...mockUserData, ...updates } };
  },

  async getUserStats(userId) {
    return { data: mockStats };
  }
};

export const postAPI = {
  async getPosts(filters) {
    return { data: mockPosts };
  },

  async createPost(postData) {
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      created_at: new Date().toISOString()
    };
    return { data: newPost };
  }
};

export const matchAPI = {
  async getMatches(filters) {
    return { data: mockMatches };
  }
};

export const chatAPI = {
  async getChats() {
    return { data: [] };
  }
};
