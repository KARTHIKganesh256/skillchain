'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { chatAPI } from '@/lib/api';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', {
        message: error?.message || 'Unknown error',
        status: error?.response?.status,
        data: error?.response?.data
      });
      // Set empty chats array on error
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  };

  const selectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const response = await chatAPI.getMessages(chat.id);
      setMessages(response.data);
      
      // Mark as read
      await chatAPI.markAsRead(chat.id);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await chatAPI.sendMessage(selectedChat.id, {
        message: newMessage
      });
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading || loadingChats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-black mb-8">MESSAGES</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Chats List */}
          <div className="card overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 uppercase">Conversations</h2>
            {chats.length > 0 ? (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={`p-4 border-2 border-black cursor-pointer transition-colors ${
                      selectedChat?.id === chat.id ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {chat.otherUser?.photoURL ? (
                        <img
                          src={chat.otherUser.photoURL}
                          alt={chat.otherUser.displayName}
                          className="w-10 h-10 border-2 border-current"
                        />
                      ) : (
                        <FaUserCircle className="text-3xl" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{chat.otherUser?.displayName}</p>
                        <p className="text-sm truncate opacity-70">
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="bg-current text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No conversations yet</p>
            )}
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 card flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="border-b-2 border-black pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    {selectedChat.otherUser?.photoURL ? (
                      <img
                        src={selectedChat.otherUser.photoURL}
                        alt={selectedChat.otherUser.displayName}
                        className="w-12 h-12 border-2 border-black"
                      />
                    ) : (
                      <FaUserCircle className="text-4xl" />
                    )}
                    <div>
                      <p className="font-bold text-xl">{selectedChat.otherUser?.displayName}</p>
                      <p className="text-sm text-gray-600">Active now</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 border-2 border-black ${
                          msg.senderId === user.uid
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Type a message..."
                  />
                  <button type="submit" className="btn-primary">
                    <FaPaperPlane />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <p className="text-xl font-bold">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


