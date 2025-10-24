'use client';

import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-black mb-4">
              SKILL<span className="bg-black text-white px-1">CHAIN</span>
            </h3>
            <p className="text-gray-700">
              Where skills become currency. Join thousands of users exchanging skills worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/explore" className="hover:underline">Explore Skills</Link></li>
              <li><Link href="/how-it-works" className="hover:underline">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
              <li><Link href="/leaderboard" className="hover:underline">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/blog" className="hover:underline">Blog</Link></li>
              <li><Link href="/careers" className="hover:underline">Careers</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:underline">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-black pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            © 2024 SkillChain. All rights reserved.
          </p>

          <div className="flex gap-6 text-2xl">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
              <FaGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
              <FaLinkedin />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
              <FaDiscord />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


