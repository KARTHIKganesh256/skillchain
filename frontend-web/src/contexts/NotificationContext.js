"use client";

/**
 * Notification Context - Real-time notifications
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext({});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Listen to notifications in real-time
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationList = [];
      let unread = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        notificationList.push({
          id: doc.id,
          ...data
        });
        
        if (!data.read) {
          unread++;
        }
      });

      setNotifications(notificationList);
      setUnreadCount(unread);
      setLoading(false);

      // Show toast for new notifications
      const newNotifications = notificationList.filter(n => 
        !n.read && new Date(n.createdAt.toDate()) > new Date(Date.now() - 5000)
      );
      
      newNotifications.forEach(notification => {
        toast.success(notification.message, {
          duration: 4000,
          position: 'top-right'
        });
      });
    }, (error) => {
      console.error('Error listening to notifications:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { writeBatch, doc } = await import('firebase/firestore');
      const batch = writeBatch(db);
      
      notifications
        .filter(n => !n.read)
        .forEach(notification => {
          const notificationRef = doc(db, 'notifications', notification.id);
          batch.update(notificationRef, {
            read: true,
            readAt: new Date().toISOString()
          });
        });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications]);

  // Create notification (for admin/system use)
  const createNotification = useCallback(async (userId, message, type = 'info', data = {}) => {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      await addDoc(collection(db, 'notifications'), {
        userId,
        message,
        type, // 'info', 'success', 'warning', 'error'
        data,
        read: false,
        createdAt: serverTimestamp(),
        readAt: null
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
