'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { postAPI } from '@/lib/api';
import { FaSearch, FaFilter, FaCoins, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';

const categories = [
  'All',
  'Programming',
  'Design',
  'Writing',
  'Marketing',
  'Teaching',
  'Cooking',
  'Photography',
  'Music',
  'Fitness',
  'Languages',
  'Other'
];

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'all'
  });

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 20,
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.search && { search: filters.search })
      };

      const response = await postAPI.getPosts(params);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', {
        message: error?.message || 'Unknown error',
        status: error?.response?.status,
        data: error?.response?.data
      });
      // Set empty posts array on error
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">EXPLORE SKILLS</h1>
          <p className="text-gray-600">Discover talented people and amazing skills</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="offer">Offers Only</option>
                <option value="request">Requests Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="card hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`badge ${post.type === 'offer' ? 'badge-premium' : ''}`}>
                    {post.type}
                  </span>
                  {post.isBoosted && <span className="badge badge-premium">BOOSTED</span>}
                </div>

                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4 line-clamp-2">{post.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Category:</span>
                    <span className="badge">{post.category}</span>
                  </div>

                  {post.location && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      <span>{post.location}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t-2 border-black">
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <FaCoins />
                      {post.skillCoins} SC
                    </div>
                    <span className="text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-gray-400">No skills found</p>
            <p className="text-gray-600 mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}


