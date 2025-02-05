import { motion } from 'framer-motion';
import { MessageSquare, UserPlus, Target } from 'lucide-react';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Tell us about yourself and your relationships in just a few minutes.',
  },
  {
    icon: Target,
    title: 'Set Your Goals',
    description: 'Define what you want to achieve in your relationships.',
  },
  {
    icon: MessageSquare,
    title: 'Get Personalized Guidance',
    description: 'Start chatting with your AI coach and receive tailored advice.',
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            How BondMate Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Get started in three simple steps
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              {
                index !== 2 &&
                <div className="absolute top-8 left-full w-full max-w-[100px] h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 hidden md:block" 
                style={{ transform: 'translateX(-50%)' }}
              />}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-600">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}