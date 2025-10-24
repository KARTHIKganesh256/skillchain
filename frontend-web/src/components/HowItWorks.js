'use client';

import { FaUserPlus, FaClipboardList, FaHandshake, FaCoins } from 'react-icons/fa';

const steps = [
  {
    icon: <FaUserPlus className="text-6xl" />,
    number: '01',
    title: 'Create Your Profile',
    description: 'Sign up and list the skills you offer and the skills you need.'
  },
  {
    icon: <FaClipboardList className="text-6xl" />,
    number: '02',
    title: 'Post or Browse Skills',
    description: 'Create skill posts or explore what others are offering in your area.'
  },
  {
    icon: <FaHandshake className="text-6xl" />,
    number: '03',
    title: 'Match & Connect',
    description: 'Get matched with relevant users and start chatting to arrange exchanges.'
  },
  {
    icon: <FaCoins className="text-6xl" />,
    number: '04',
    title: 'Earn & Spend SkillCoins',
    description: 'Complete tasks to earn SkillCoins and use them to get skills you need.'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            HOW IT WORKS
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-gray-300">
            Get started in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="border-2 border-white p-8 bg-black hover:bg-white hover:text-black transition-all duration-300">
                <div className="text-6xl font-black mb-4 opacity-20">{step.number}</div>
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="opacity-80">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-white opacity-30">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


