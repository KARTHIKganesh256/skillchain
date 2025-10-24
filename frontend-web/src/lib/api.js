/**
 * API Client
 */

import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ message: 'Network error' });
  }
);

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout')
};

// User API
export const userAPI = {
  getCurrentUser: () => apiClient.get('/users/me'),
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  getUserSkills: (id) => apiClient.get(`/users/${id}/skills`),
  addSkill: (id, data) => apiClient.post(`/users/${id}/skills`, data),
  getLedger: (id) => apiClient.get(`/users/${id}/ledger`),
  getUserStats: (id) => apiClient.get(`/users/${id}/stats`),
  updateFCMToken: (id, token) => apiClient.post(`/users/${id}/fcm-token`, { fcmToken: token })
};

// Post API
export const postAPI = {
  getPosts: (params) => apiClient.get('/posts', { params }),
  getFeaturedPosts: () => apiClient.get('/posts/featured'),
  getPost: (id) => apiClient.get(`/posts/${id}`),
  createPost: (data) => apiClient.post('/posts', data),
  updatePost: (id, data) => apiClient.put(`/posts/${id}`, data),
  deletePost: (id) => apiClient.delete(`/posts/${id}`),
  boostPost: (id, data) => apiClient.post(`/posts/${id}/boost`, data),
  completePost: (id) => apiClient.post(`/posts/${id}/complete`),
  reportPost: (id, data) => apiClient.post(`/posts/${id}/report`, data)
};

// Match API
export const matchAPI = {
  getMatches: (params) => apiClient.get('/matches', { params }),
  getMatchSuggestions: () => apiClient.get('/matches/suggestions'),
  createMatch: (data) => apiClient.post('/matches', data),
  acceptMatch: (id) => apiClient.post(`/matches/${id}/accept`),
  rejectMatch: (id) => apiClient.post(`/matches/${id}/reject`),
  completeMatch: (id, data) => apiClient.post(`/matches/${id}/complete`, data),
  rateMatch: (id, data) => apiClient.post(`/matches/${id}/rate`, data)
};

// Chat API
export const chatAPI = {
  getChats: () => apiClient.get('/chats'),
  getChat: (id) => apiClient.get(`/chats/${id}`),
  createChat: (data) => apiClient.post('/chats', data),
  getMessages: (id, params) => apiClient.get(`/chats/${id}/messages`, { params }),
  sendMessage: (id, data) => apiClient.post(`/chats/${id}/messages`, data),
  markAsRead: (id) => apiClient.put(`/chats/${id}/read`)
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (data) => apiClient.post('/payments/create-intent', data),
  createSubscription: (data) => apiClient.post('/payments/subscribe', data),
  cancelSubscription: () => apiClient.post('/payments/cancel-subscription'),
  requestCashout: (data) => apiClient.post('/payments/cashout', data),
  getPaymentHistory: () => apiClient.get('/payments/history'),
  getBalance: () => apiClient.get('/payments/balance')
};

// Notification API
export const notificationAPI = {
  getNotifications: () => apiClient.get('/notifications'),
  getUnreadCount: () => apiClient.get('/notifications/unread'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  updateSettings: (data) => apiClient.put('/notifications/settings', data)
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => apiClient.get('/admin/dashboard'),
  getAllUsers: (params) => apiClient.get('/admin/users', { params }),
  getUserDetails: (id) => apiClient.get(`/admin/users/${id}`),
  updateUserStatus: (id, data) => apiClient.put(`/admin/users/${id}/status`, data),
  getAllPosts: (params) => apiClient.get('/admin/posts', { params }),
  deletePost: (id) => apiClient.delete(`/admin/posts/${id}`),
  getReports: (params) => apiClient.get('/admin/reports', { params }),
  handleReport: (id, data) => apiClient.put(`/admin/reports/${id}`, data),
  getAnalytics: () => apiClient.get('/admin/analytics'),
  sendBroadcast: (data) => apiClient.post('/admin/broadcast', data)
};

export default apiClient;


