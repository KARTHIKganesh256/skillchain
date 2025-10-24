'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { FaGoogle } from 'react-icons/fa';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.displayName);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-black tracking-tighter mb-4">
              SKILL<span className="bg-black text-white px-2">CHAIN</span>
            </h1>
          </Link>
          <h2 className="text-3xl font-bold">GET STARTED</h2>
          <p className="mt-2 text-gray-600">Create your free account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase">
                Full Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="mt-1 mr-2" required />
              <span className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-black"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white font-bold uppercase">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="mt-6 w-full btn-outline flex items-center justify-center gap-3"
            >
              <FaGoogle />
              GOOGLE
            </button>
          </div>

          <p className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-bold underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


