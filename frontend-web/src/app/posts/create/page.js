'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { postAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const categories = [
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

export default function CreatePostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'offer',
    category: 'Programming',
    skillCoins: 50,
    location: '',
    duration: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await postAPI.createPost(formData);
      toast.success('Post created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-black mb-8">CREATE SKILL POST</h1>

        <form onSubmit={handleSubmit} className="card">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase">Post Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'offer' })}
                  className={formData.type === 'offer' ? 'btn-primary' : 'btn-outline'}
                >
                  I OFFER A SKILL
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'request' })}
                  className={formData.type === 'request' ? 'btn-primary' : 'btn-outline'}
                >
                  I NEED A SKILL
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Expert React Developer Available"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows={5}
                placeholder="Describe your skill or what you need..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 uppercase">SkillCoins *</label>
                <input
                  type="number"
                  name="skillCoins"
                  value={formData.skillCoins}
                  onChange={handleChange}
                  className="input-field"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">Location (Optional)</label>
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
                <label className="block text-sm font-bold mb-2 uppercase">Duration (Optional)</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 2 hours, 1 week"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'CREATING...' : 'CREATE POST'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-outline"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


