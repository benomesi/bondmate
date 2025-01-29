import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRICING_PLANS = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: '0',
    features: [
      'Up to 10 AI coach messages',
      'Basic relationship tracking',
      'Community support',
      'Essential relationship tips'
    ]
  },
  {
    name: 'Premium',
    description: 'For those serious about relationships',
    price: '20',
    features: [
      'Unlimited AI coach messages',
      'Advanced relationship analytics',
      'Priority support',
      'Exclusive relationship resources',
      'Multiple relationship tracking',
      'Customizable AI preferences',
      'Advanced insights and reports'
    ],
    popular: true
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Choose the plan that's right for you
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl'
                  : 'bg-white shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={plan.popular ? 'text-white/90' : 'text-gray-600'}>
                {plan.description}
              </p>

              <div className="my-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className={`${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                  /month
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className={`w-5 h-5 mr-3 ${
                      plan.popular ? 'text-white' : 'text-green-500'
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/auth/sign-up"
                className={`block w-full py-3 text-center rounded-lg transition-colors ${
                  plan.popular
                    ? 'bg-white text-gray-900 hover:bg-gray-50'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                }`}
              >
                {plan.popular ? (
                  <span className="flex items-center justify-center">
                    <Crown className="w-5 h-5 mr-2" />
                    Start 14-Day Free Trial
                  </span>
                ) : (
                  'Start Your Journey - No Credit Card Required'
                )}
              </Link>
              {plan.popular && (
                <p className="text-center mt-2 text-white/80 text-sm">
                  Try Premium free for 14 days. Cancel anytime.
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}