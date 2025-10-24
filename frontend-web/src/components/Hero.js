'use client';

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 border-4 border-black transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-black transform translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-black"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-4 border-black"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
          WHERE SKILLS<br />
          BECOME<br />
          <span className="bg-black text-white px-4 inline-block mt-2">
            CURRENCY
          </span>
        </h1>

        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-medium">
          Connect with people worldwide. Offer your skills, learn new ones, 
          and earn SkillCoins that you can spend on services you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/register" className="btn-primary inline-flex items-center gap-3 text-lg">
            GET STARTED FREE
            <FaArrowRight />
          </Link>
          <Link href="/explore" className="btn-outline text-lg">
            EXPLORE SKILLS
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="border-2 border-black p-6">
            <div className="text-4xl font-black mb-2">10K+</div>
            <div className="text-sm font-medium uppercase">Users</div>
          </div>
          <div className="border-2 border-black p-6">
            <div className="text-4xl font-black mb-2">50K+</div>
            <div className="text-sm font-medium uppercase">Skills Shared</div>
          </div>
          <div className="border-2 border-black p-6">
            <div className="text-4xl font-black mb-2">1M+</div>
            <div className="text-sm font-medium uppercase">SkillCoins</div>
          </div>
        </div>
      </div>
    </section>
  );
}


