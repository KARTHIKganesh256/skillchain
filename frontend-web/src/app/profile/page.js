'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { FaEdit, FaCoins, FaStar, FaTasks, FaUserCircle } from 'react-icons/fa';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, userData, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    phone: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || '',
        bio: userData.bio || '',
        location: userData.location || '',
        phone: userData.phone || ''
      });
    }
  }, [userData]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await userAPI.getUserStats(user.uid);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', {
        message: error?.message || 'Unknown error',
        status: error?.response?.status,
        data: error?.response?.data
      });
      // Set default stats if API fails
      setStats({
        postsCount: 0,
        completedTasksCount: 0,
        skillCoinBalance: userData?.skillCoinBalance || 0,
        rating: userData?.rating || 0,
        reviewCount: userData?.reviewCount || 0
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {userData?.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName}
                  className="w-32 h-32 border-4 border-black"
                />
              ) : (
                <div className="w-32 h-32 border-4 border-black bg-gray-100 flex items-center justify-center">
                  <FaUserCircle className="text-6xl text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-grow">
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 uppercase">Name</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 uppercase">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="input-field"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 uppercase">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 uppercase">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="submit" className="btn-primary">
                      SAVE CHANGES
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn-outline"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-black mb-2">{userData?.displayName}</h1>
                      {userData?.isPremium && (
                        <span className="badge badge-premium">PREMIUM</span>
                      )}
                    </div>
                    <button onClick={() => setEditing(true)} className="btn-outline">
                      <FaEdit className="inline mr-2" />
                      EDIT
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4">{userData?.bio || 'No bio yet.'}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold uppercase">Location:</span>
                      <p>{userData?.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-bold uppercase">Member Since:</span>
                      <p>{new Date(userData?.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <FaCoins className="text-4xl mx-auto mb-2" />
            <div className="text-3xl font-black">{userData?.skillCoinBalance || 0}</div>
            <div className="text-sm font-medium uppercase text-gray-600">SkillCoins</div>
          </div>

          <div className="card text-center">
            <FaTasks className="text-4xl mx-auto mb-2" />
            <div className="text-3xl font-black">{stats?.postsCount || 0}</div>
            <div className="text-sm font-medium uppercase text-gray-600">Posts</div>
          </div>

          <div className="card text-center">
            <FaStar className="text-4xl mx-auto mb-2" />
            <div className="text-3xl font-black">{userData?.rating?.toFixed(1) || '0.0'}</div>
            <div className="text-sm font-medium uppercase text-gray-600">Rating</div>
          </div>

          <div className="card text-center">
            <FaTasks className="text-4xl mx-auto mb-2" />
            <div className="text-3xl font-black">{stats?.completedTasksCount || 0}</div>
            <div className="text-sm font-medium uppercase text-gray-600">Completed</div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold uppercase mb-4">Skills I Offer</h2>
            {userData?.skillsOffered && userData.skillsOffered.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userData.skillsOffered.map((skill, index) => (
                  <span key={index} className="badge">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills added yet.</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold uppercase mb-4">Skills I Need</h2>
            {userData?.skillsNeeded && userData.skillsNeeded.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userData.skillsNeeded.map((skill, index) => (
                  <span key={index} className="badge">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


