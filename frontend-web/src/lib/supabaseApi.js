/**
 * Supabase API Client
 * Replaces the Firebase-based API calls with Supabase
 */

import { db } from './supabase';

// User API
export const userAPI = {
  // Get user statistics
  getUserStats: async (userId) => {
    try {
      const { data, error } = await db.users.getStats(userId);
      if (error) throw error;

      // Transform the data to match expected format
      const stats = {
        skillCoinBalance: data.skill_coin_balance || 0,
        rating: data.rating || 0,
        reviewCount: data.review_count || 0,
        postsCount: data.posts?.[0]?.count || 0,
        completedTasksCount: data.matches?.[0]?.count || 0,
        isPremium: data.is_premium || false,
        memberSince: data.created_at
      };

      return { data: stats };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Update user profile
  updateUser: async (userId, updates) => {
    try {
      const { data, error } = await db.users.update(userId, updates);
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Get user by ID
  getUser: async (userId) => {
    try {
      const { data, error } = await db.users.getById(userId);
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
};

// Posts API
export const postAPI = {
  // Get all posts with filters
  getPosts: async (params = {}) => {
    try {
      const { data, error } = await db.posts.getAll(params);
      if (error) throw error;

      // Transform the data to match expected format
      const transformedData = data.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        category: post.category,
        type: post.type,
        price: post.price,
        location: post.location,
        skillsRequired: post.skills_required || [],
        skillsOffered: post.skills_offered || [],
        isActive: post.is_active,
        isBoosted: post.is_boosted,
        boostExpiresAt: post.boost_expires_at,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        user: {
          id: post.user?.id,
          displayName: post.user?.display_name,
          photoURL: post.user?.photo_url,
          rating: post.user?.rating,
          reviewCount: post.user?.review_count
        }
      }));

      return { data: transformedData };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get post by ID
  getPost: async (postId) => {
    try {
      const { data, error } = await db.posts.getById(postId);
      if (error) throw error;

      // Transform the data
      const transformedData = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        type: data.type,
        price: data.price,
        location: data.location,
        skillsRequired: data.skills_required || [],
        skillsOffered: data.skills_offered || [],
        isActive: data.is_active,
        isBoosted: data.is_boosted,
        boostExpiresAt: data.boost_expires_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        user: {
          id: data.user?.id,
          displayName: data.user?.display_name,
          photoURL: data.user?.photo_url,
          rating: data.user?.rating,
          reviewCount: data.user?.review_count
        }
      };

      return { data: transformedData };
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      // Transform the data for Supabase
      const supabaseData = {
        user_id: postData.userId,
        title: postData.title,
        description: postData.description,
        category: postData.category,
        type: postData.type,
        price: postData.price,
        location: postData.location,
        skills_required: postData.skillsRequired || [],
        skills_offered: postData.skillsOffered || [],
        is_active: true
      };

      const { data, error } = await db.posts.create(supabaseData);
      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update post
  updatePost: async (postId, updates) => {
    try {
      const { data, error } = await db.posts.update(postId, updates);
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const { error } = await db.posts.delete(postId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};

// Matches API
export const matchAPI = {
  // Get matches
  getMatches: async (params = {}) => {
    try {
      const { data, error } = await db.matches.getAll(params);
      if (error) throw error;

      // Transform the data
      const transformedData = data.map(match => ({
        id: match.id,
        postId: match.post_id,
        userId: match.user_id,
        matchedUserId: match.matched_user_id,
        status: match.status,
        message: match.message,
        createdAt: match.created_at,
        updatedAt: match.updated_at,
        post: match.post,
        user: match.user,
        matchedUser: match.matched_user
      }));

      return { data: transformedData };
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  // Create match
  createMatch: async (matchData) => {
    try {
      const supabaseData = {
        post_id: matchData.postId,
        user_id: matchData.userId,
        matched_user_id: matchData.matchedUserId,
        status: matchData.status || 'pending',
        message: matchData.message
      };

      const { data, error } = await db.matches.create(supabaseData);
      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  },

  // Update match
  updateMatch: async (matchId, updates) => {
    try {
      const { data, error } = await db.matches.update(matchId, updates);
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error updating match:', error);
      throw error;
    }
  }
};

// Chat API
export const chatAPI = {
  // Get chats
  getChats: async (userId) => {
    try {
      const { data, error } = await db.chats.getAll(userId);
      if (error) throw error;

      // Transform the data
      const transformedData = data.map(chat => ({
        id: chat.id,
        matchId: chat.match_id,
        user1Id: chat.user1_id,
        user2Id: chat.user2_id,
        lastMessage: chat.last_message,
        lastMessageAt: chat.last_message_at,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
        user1: chat.user1,
        user2: chat.user2,
        match: chat.match
      }));

      return { data: transformedData };
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  // Get chat by ID
  getChat: async (chatId) => {
    try {
      const { data, error } = await db.chats.getById(chatId);
      if (error) throw error;

      const transformedData = {
        id: data.id,
        matchId: data.match_id,
        user1Id: data.user1_id,
        user2Id: data.user2_id,
        lastMessage: data.last_message,
        lastMessageAt: data.last_message_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        user1: data.user1,
        user2: data.user2
      };

      return { data: transformedData };
    } catch (error) {
      console.error('Error fetching chat:', error);
      throw error;
    }
  },

  // Create chat
  createChat: async (chatData) => {
    try {
      const supabaseData = {
        match_id: chatData.matchId,
        user1_id: chatData.user1Id,
        user2_id: chatData.user2Id
      };

      const { data, error } = await db.chats.create(supabaseData);
      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  // Get messages
  getMessages: async (chatId) => {
    try {
      const { data, error } = await db.messages.getByChatId(chatId);
      if (error) throw error;

      // Transform the data
      const transformedData = data.map(message => ({
        id: message.id,
        chatId: message.chat_id,
        senderId: message.sender_id,
        content: message.content,
        isRead: message.is_read,
        createdAt: message.created_at,
        sender: message.sender
      }));

      return { data: transformedData };
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    try {
      const supabaseData = {
        chat_id: messageData.chatId,
        sender_id: messageData.senderId,
        content: messageData.content
      };

      const { data, error } = await db.messages.create(supabaseData);
      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (chatId, userId) => {
    try {
      const { error } = await db.messages.markAsRead(chatId, userId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }
};

// Notifications API
export const notificationAPI = {
  // Get notifications
  getNotifications: async (userId) => {
    try {
      const { data, error } = await db.notifications.getAll(userId);
      if (error) throw error;

      // Transform the data
      const transformedData = data.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        isRead: notification.is_read,
        createdAt: notification.created_at
      }));

      return { data: transformedData };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Create notification
  createNotification: async (notificationData) => {
    try {
      const supabaseData = {
        user_id: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data
      };

      const { data, error } = await db.notifications.create(supabaseData);
      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const { data, error } = await db.notifications.markAsRead(notificationId);
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      const { error } = await db.notifications.markAllAsRead(userId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};

// Export all APIs
export default {
  userAPI,
  postAPI,
  matchAPI,
  chatAPI,
  notificationAPI
};
