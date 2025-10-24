'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b-4 border-black bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-3xl font-black tracking-tighter">
              SKILL<span className="bg-black text-white px-2">CHAIN</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link href="/dashboard" className="font-medium hover:underline">
                  Dashboard
                </Link>
                <Link href="/explore" className="font-medium hover:underline">
                  Explore
                </Link>
                <Link href="/messages" className="font-medium hover:underline">
                  Messages
                </Link>
                <div className="flex items-center space-x-4">
                  <NotificationBell />
                  <div className="border-2 border-black px-4 py-2 bg-black text-white font-bold">
                    {userData?.skill_coin_balance || 0} SC
                  </div>
                  <Link href="/profile" className="font-medium hover:underline">
                    Profile
                  </Link>
                  <button onClick={logout} className="btn-outline">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/explore" className="font-medium hover:underline">
                  Explore
                </Link>
                <Link href="/how-it-works" className="font-medium hover:underline">
                  How It Works
                </Link>
                <Link href="/login" className="btn-outline">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white">
          <div className="px-4 py-6 space-y-4">
            {user ? (
              <>
                <div className="border-2 border-black px-4 py-2 bg-black text-white font-bold text-center">
                  {userData?.skill_coin_balance || 0} SkillCoins
                </div>
                <Link
                  href="/dashboard"
                  className="block py-2 font-medium hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/explore"
                  className="block py-2 font-medium hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  href="/messages"
                  className="block py-2 font-medium hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  className="block py-2 font-medium hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-outline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/explore"
                  className="block py-2 font-medium hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  href="/how-it-works"
                  className="block py-2 font-medium hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/login"
                  className="block w-full btn-outline text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}


