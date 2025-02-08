import { motion } from 'framer-motion';
import { Check, Crown, MessageSquare, Brain, Target, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { Footer } from '../components/Footer';
import { trackPricingInteraction } from '../lib/analytics';
import { useAppSelector } from '../hooks/useAppSelector';
import { useState } from 'react';
import { SnackbarProvider, enqueueSnackbar as notify } from 'notistack';
import { createSubscription } from '../lib/stripe';

const PRICING_PLANS = [
  {
    name: 'Free Trial',
    description: 'Perfect for getting started',
    price: '0',
    features: [
      'Up to 10 AI coach messages',
      'Basic profile review',
      'Essential dating tips',
      'Community support'
    ]
  },
  {
    name: 'Premium',
    description: 'Unlock your full potential',
    price: '20',
    features: [
      'Unlimited AI coach messages',
      'Advanced profile optimization',
      'Message review and feedback',
      'Date planning assistance',
      'Priority support',
      'Conversation strategy guides',
      'Success tracking analytics'
    ],
    popular: true
  }
];

const VALUE_PROPS = [
  {
    icon: MessageSquare,
    title: '24/7 AI Support',
    description: 'Get instant advice whenever you need it'
  },
  {
    icon: Brain,
    title: 'Data-Driven Insights',
    description: 'Leverage proven strategies that work'
  },
  {
    icon: Target,
    title: 'Measurable Results',
    description: 'Track your progress and success'
  },
  {
    icon: Lock,
    title: 'Privacy & Security',
    description: 'Your data is protected with enterprise-grade security'
  }
];

const COMPARISON_FEATURES = [
  {
    name: 'AI Coach Messages',
    free: '10 messages',
    premium: 'Unlimited'
  },
  {
    name: 'Response Time',
    free: 'Standard',
    premium: 'Priority'
  },
  {
    name: 'Profile Optimization',
    free: 'Basic review',
    premium: 'Advanced analysis & suggestions'
  },
  {
    name: 'Message Review',
    free: 'Basic tips',
    premium: 'Detailed feedback & improvements'
  },
  {
    name: 'Date Planning',
    free: 'Basic suggestions',
    premium: 'Personalized strategies'
  },
  {
    name: 'Analytics',
    free: 'Basic stats',
    premium: 'Detailed insights & tracking'
  },
  {
    name: 'Support',
    free: 'Community',
    premium: 'Priority support'
  }
];


export function PricingPage() {
    const navigate = useNavigate();
    const profile = useAppSelector((state) => state.app.profile);
    const [isUpgrading, setIsUpgrading] = useState(false);

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        try {
          await createSubscription(import.meta.env.VITE_PRICE_ID);
        } catch (error) {
          console.error('Upgrade error:', error);
         notify('Failed to start upgrade process', { variant: 'error' });
        } finally {
          setIsUpgrading(false);
        }
    };

    const handlePlanClick = (plan: Plan) => {
        trackPricingInteraction(
            'click',
            plan.popular ? 'PREMIUM' : 'FREE',
            { plan_name: plan.name }
          )
          if (!profile){
            return navigate('/sign-up');
          }

          if(!plan.popular){
              return navigate('/dashboard');
          }
          return handleUpgrade();
    }


    
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <SnackbarProvider
             anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
        />
        {/* Hero Section */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Choose Your Path to
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-transparent bg-clip-text animate-gradient">
                Better Relationships
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Get the support and guidance you need with our flexible pricing plans
            </motion.p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      ? 'border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-xl'
                      : 'border border-gray-200 bg-white shadow-lg'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 rounded-full text-sm font-medium text-white">
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
                          plan.popular ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={isUpgrading || Boolean(profile && profile.is_premium && plan.popular)}
                    onClick={() => handlePlanClick(plan)}
                    className={`block w-full py-3 text-center rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90'
                        : 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    {plan.popular ? (
                      <span className="flex items-center justify-center">
                        <Crown className="w-5 h-5 mr-2" />
                        
                        {
                            isUpgrading ? 'Starting Upgrade...' : 'Start 14-Day Free Trial'
                        }
                      </span>
                    ) : (
                      'Get Started Free'
                    )}
                  </button>


                  {plan.popular && (
                    <p className="text-center mt-2 text-gray-500 text-sm">
                      Try Premium free for 14 days. Cancel anytime.
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Compare Plans
              </h2>
              <p className="text-xl text-gray-600">
                See what's included in each plan
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-4 px-6 text-left text-gray-500 font-medium">Feature</th>
                      <th className="py-4 px-6 text-center text-gray-500 font-medium">Free</th>
                      <th className="py-4 px-6 text-center text-gray-500 font-medium">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_FEATURES.map((feature, index) => (
                      <tr
                        key={feature.name}
                        className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      >
                        <td className="py-4 px-6 text-gray-900 font-medium">{feature.name}</td>
                        <td className="py-4 px-6 text-center text-gray-600">{feature.free}</td>
                        <td className="py-4 px-6 text-center text-blue-600 font-medium">{feature.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {VALUE_PROPS.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What's included in the free trial?
                  </h3>
                  <p className="text-gray-600">
                    The free trial includes 10 messages with our AI coach, basic profile review, and essential relationship tips. It's a great way to experience how BondMate can help improve your relationships.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I cancel my premium subscription anytime?
                  </h3>
                  <p className="text-gray-600">
                    Yes! You can cancel your premium subscription at any time. You'll continue to have access to premium features until the end of your billing period.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Is my data secure?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely. We use enterprise-grade encryption to protect your data and conversations. Your privacy and security are our top priorities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}