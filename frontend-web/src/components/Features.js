'use client';

import { FaCoins, FaUsers, FaComments, FaRocket, FaShieldAlt, FaTrophy } from 'react-icons/fa';

const features = [
  {
    icon: <FaCoins className="text-5xl" />,
    title: 'SkillCoin System',
    description: 'Earn SkillCoins by offering your skills and spend them on services you need.'
  },
  {
    icon: <FaUsers className="text-5xl" />,
    title: 'Global Network',
    description: 'Connect with skilled individuals from around the world in your area of interest.'
  },
  {
    icon: <FaComments className="text-5xl" />,
    title: 'Real-time Chat',
    description: 'Communicate instantly with matched users through our built-in messaging system.'
  },
  {
    icon: <FaRocket className="text-5xl" />,
    title: 'Boost Your Posts',
    description: 'Increase visibility of your skill offerings with our premium boost feature.'
  },
  {
    icon: <FaShieldAlt className="text-5xl" />,
    title: 'Secure Platform',
    description: 'Your data and transactions are protected with enterprise-level security.'
  },
  {
    icon: <FaTrophy className="text-5xl" />,
    title: 'Leaderboards',
    description: 'Compete and showcase your expertise as a top contributor in your field.'
  }
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            POWERFUL FEATURES
          </h2>
          <p className="text-xl max-w-2xl mx-auto">
            Everything you need to exchange skills and grow your network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


