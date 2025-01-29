import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SubscriptionButton } from '../../../../components/SubscriptionButton';
import type { PricingPlan } from './index';

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
}

export function PricingCard({ plan, index }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-8 rounded-2xl ${
        plan.popular
          ? 'border-2 border-red-200 bg-gradient-to-br from-red-50 to-white shadow-xl'
          : 'border border-gray-200 bg-white shadow-lg'
      }`}
    >
      {plan.popular && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 rounded-full text-sm font-medium text-white">
          Most Popular
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
      <p className="text-gray-600 mb-6">
        {plan.description}
      </p>

      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
        <span className="text-gray-500">/month</span>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center">
            <Check className={`w-5 h-5 mr-3 ${
              plan.popular ? 'text-red-500' : 'text-gray-400'
            }`} />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <SubscriptionButton
        priceId={plan.priceId}
        planName={plan.name}
        className={`w-full py-3 text-center rounded-lg transition-colors ${
          plan.popular
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90'
            : 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50'
        }`}
      >
        {plan.cta.text}
      </SubscriptionButton>
      
      <p className="text-center mt-2 text-sm text-gray-500">
        {plan.cta.subtext}
      </p>
    </motion.div>
  );
}