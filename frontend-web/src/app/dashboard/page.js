'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Navbar from '@/components/Navbar';
import { FaPlus, FaCoins, FaStar, FaTasks, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import { userAPI, postAPI, matchAPI } from '@/lib/supabaseApi';
import { userAPI as mockUserAPI, postAPI as mockPostAPI, matchAPI as mockMatchAPI } from '@/lib/mockApi';

export default function DashboardPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Try Supabase first, fallback to mock data
      let statsData, postsData, matchesData;
      
      try {
        [statsData, postsData, matchesData] = await Promise.all([
          userAPI.getUserStats(user.id),
          postAPI.getPosts({ limit: 5, page: 1 }),
          matchAPI.getMatches({ limit: 5, page: 1, userId: user.id })
        ]);
      } catch (supabaseError) {
        console.log('Supabase not available, using mock data');
        [statsData, postsData, matchesData] = await Promise.all([
          mockUserAPI.getUserStats(user.id),
          mockPostAPI.getPosts({ limit: 5, page: 1 }),
          mockMatchAPI.getMatches({ limit: 5, page: 1, userId: user.id })
        ]);
      }

      setStats(statsData.data);
      setRecentPosts(postsData.data);
      setRecentMatches(matchesData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', {
        message: error?.message || 'Unknown error',
        stack: error?.stack
      });
      // Set default values if API calls fail
      setStats({
        skillCoinBalance: userData?.skill_coin_balance || 100,
        rating: userData?.rating || 4.5,
        reviewCount: userData?.review_count || 12,
        postsCount: 3,
        completedTasksCount: 8,
        isPremium: userData?.is_premium || false,
        memberSince: userData?.created_at || new Date()
      });
      setRecentPosts([]);
      setRecentMatches([]);
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">
            WELCOME BACK, {userData?.display_name?.toUpperCase()}
          </h1>
          <p className="text-gray-600">Here's what's happening with your skills today.</p>
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <FaCoins className="text-3xl" />
            </div>
            <div className="text-3xl font-black">{userData?.skill_coin_balance || 0}</div>
            <div className="text-sm font-medium uppercase text-gray-600">SkillCoins</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <FaTasks className="text-3xl" />
            </div>
            <div className="text-3xl font-black">{stats?.postsCount || 0}</div>
            <div className="text-sm font-medium uppercase text-gray-600">Active Posts</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-3xl" />
            </div>
            <div className="text-3xl font-black">{stats?.completedTasksCount || 0}</div>
            <div className="text-sm font-medium uppercase text-gray-600">Completed Tasks</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <FaStar className="text-3xl" />
            </div>
            <div className="text-3xl font-black">{userData?.rating?.toFixed(1) || '0.0'}</div>
            <div className="text-sm font-medium uppercase text-gray-600">Rating</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/posts/create" className="card hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-black text-white p-4">
                <FaPlus className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">POST A SKILL</h3>
                <p className="text-gray-600">Offer your skills or request help</p>
              </div>
            </div>
          </Link>

          <Link href="/explore" className="card hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-black text-white p-4">
                <FaUsers className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">EXPLORE SKILLS</h3>
                <p className="text-gray-600">Find skills you need</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold uppercase">Your Recent Posts</h2>
              <Link href="/posts" className="text-sm font-bold underline">
                VIEW ALL
              </Link>
            </div>
            <div className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{post.title}</h3>
                      <span className="badge">{post.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{post.description.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold">{post.skillCoins} SC</span>
                      <span className="text-gray-600">{post.category}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-8">
                  <p className="text-gray-600">No posts yet. Create your first post!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Matches */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold uppercase">Recent Matches</h2>
              <Link href="/matches" className="text-sm font-bold underline">
                VIEW ALL
              </Link>
            </div>
            <div className="space-y-4">
              {recentMatches.length > 0 ? (
                recentMatches.slice(0, 3).map((match) => (
                  <div key={match.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">Match Request</h3>
                      <span className={`badge ${match.status === 'accepted' ? 'badge-premium' : ''}`}>
                        {match.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{match.message || 'No message'}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold">{match.skillCoins} SC</span>
                      <span className="text-gray-600">{new Date(match.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-8">
                  <p className="text-gray-600">No matches yet. Start exploring!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


