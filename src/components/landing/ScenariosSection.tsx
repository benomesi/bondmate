import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, UserPlus, Briefcase, Sparkles } from 'lucide-react';

const SCENARIOS = [
  {
    icon: Heart,
    title: 'Modern Dating',
    description: 'Navigate the complexities of modern dating, from apps to real connections.',
    insights: [
      { stat: '45%', text: 'of relationships now start online' },
      { stat: '3 in 4', text: 'daters want more authenticity' }
    ],
    challenges: [
      'Making meaningful connections online',
      'Moving from chat to real-life meetings',
      'Standing out authentically',
      'Building trust digitally'
    ],
    solutions: [
      'AI-powered conversation starters and profile tips',
      'Safe meeting planning and boundary setting',
      'Authentic self-presentation strategies',
      'Trust-building communication techniques'
    ]
  },
  {
    icon: Heart,
    title: 'Relationships',
    description: 'Strengthen your romantic relationships with proven strategies and insights.',
    insights: [
      { stat: '88%', text: 'improved with better communication' },
      { stat: '2x', text: 'stronger with shared goals' }
    ],
    challenges: [
      'Deepening emotional intimacy',
      'Navigating life changes together',
      'Maintaining spark long-term',
      'Growing as individuals and partners'
    ],
    solutions: [
      'Emotional intelligence exercises and prompts',
      'Change management strategies for couples',
      'Romance and connection building activities',
      'Individual and couple growth planning'
    ]
  },
  {
    icon: Users,
    title: 'Family Dynamics',
    description: 'Create more harmonious relationships with family members.',
    insights: [
      { stat: '67%', text: 'want better family bonds' },
      { stat: '3x', text: 'happier with open communication' }
    ],
    challenges: [
      'Bridging generational gaps',
      'Setting healthy boundaries',
      'Resolving long-standing issues',
      'Building lasting harmony'
    ],
    solutions: [
      'Cross-generational communication techniques',
      'Boundary setting and maintenance strategies',
      'Conflict resolution and healing methods',
      'Family bonding activity suggestions'
    ]
  },
  {
    icon: UserPlus,
    title: 'Friendships',
    description: 'Build and maintain meaningful friendships that last.',
    insights: [
      { stat: '5-7', text: 'close friends for fulfillment' },
      { stat: '40%', text: 'struggle with making new friends' }
    ],
    challenges: [
      'Making friends as an adult',
      'Maintaining long-distance bonds',
      'Deepening casual friendships',
      'Navigating group dynamics'
    ],
    solutions: [
      'Friend-making strategies for adults',
      'Long-distance connection maintenance tips',
      'Friendship deepening conversation guides',
      'Group interaction best practices'
    ]
  }
];

export function ScenariosSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Real Solutions for Real Relationships
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            See how BondMate helps in different relationship scenarios
          </motion.p>
        </div>

        <div className="space-y-16">
          {SCENARIOS.map(({ icon: Icon, title, description, insights, challenges, solutions }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Header Section */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{description}</p>
                    
                    {/* Key Insights */}
                    <div className="flex gap-6 mb-6">
                      {insights.map(({ stat, text }, i) => (
                        <div key={i} className="flex-1">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{stat}</div>
                          <div className="text-sm text-gray-500">{text}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges & Solutions Section */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {/* Challenges */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-red-600" />
                          </div>
                          Common Challenges
                        </h4>
                        <ul className="space-y-3">
                          {challenges.map((challenge, i) => (
                            <motion.li
                              key={i}
                              whileHover={{ x: 5 }}
                              className="flex items-center gap-3 p-3 bg-red-50/50 rounded-lg text-gray-700"
                            >
                              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                              {challenge}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Solutions */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-green-600" />
                          </div>
                          BondMate Solutions
                        </h4>
                        <ul className="space-y-3">
                          {solutions.map((solution, i) => (
                            <motion.li
                              key={i}
                              whileHover={{ x: 5 }}
                              className="flex items-center gap-3 p-3 bg-green-50/50 rounded-lg text-gray-700"
                            >
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                              {solution}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}