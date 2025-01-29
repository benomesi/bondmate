import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Search } from 'lucide-react';
import { Footer } from '../components/Footer';

const faqs = [
  {
    category: "Getting Started",
    items: [{
    question: "What is BondMate and how does it work?",
    answer: "BondMate is an AI-powered relationship coaching platform that provides personalized advice and guidance for all types of relationships. Our AI coach analyzes your unique situation and offers tailored recommendations to help you build stronger connections."
    },
    {
    question: "Is my personal information secure?",
    answer: "Yes, we take your privacy seriously. All conversations and personal information are protected with enterprise-grade encryption. We never share your data with third parties, and you have complete control over your information."
    },
    {
    question: "What types of relationships can BondMate help with?",
    answer: "BondMate can help with various relationships, including romantic partnerships, family relationships, friendships, and professional connections. Our AI coach adapts its guidance based on the specific type of relationship you're focusing on."
    }]
  },
  {
    category: "AI Coach",
    items: [{
    question: "How accurate is the AI relationship coach?",
    answer: "Our AI coach is trained on extensive relationship psychology research and real-world scenarios. While it provides valuable insights and guidance, it's designed to complement, not replace, professional counseling when needed."
    },
    {
    question: "Can I trust the AI's advice?",
    answer: "Our AI is trained on verified psychological principles and relationship research. However, it's designed to be a supportive tool rather than a replacement for professional help when needed."
    },
    {
    question: "What kind of advice does the AI provide?",
    answer: "The AI provides personalized guidance on communication, conflict resolution, emotional understanding, and relationship building strategies based on your specific situation and goals."
    }]
  },
  {
    category: "Subscription & Pricing",
    items: [{
    question: "What's included in the free trial?",
    answer: "The free trial includes access to our AI coach with a limited number of messages, basic relationship tracking, and essential features. Premium features like unlimited messages and advanced analytics require a subscription."
    },
    {
    question: "Can I use BondMate for multiple relationships?",
    answer: "Yes! Premium users can manage and receive guidance for multiple relationships simultaneously. Each relationship gets its own dedicated space with personalized advice and tracking."
    },
    {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from your account settings. After cancellation, you'll continue to have access to premium features until the end of your billing period."
    }]
  },
  {
    category: "Privacy & Security",
    items: [{
    question: "Is BondMate available worldwide?",
    answer: "Yes, BondMate is available globally. Our AI coach can provide culturally sensitive advice and supports users from diverse backgrounds and relationship contexts."
    },
    {
    question: "How is my data protected?",
    answer: "We use enterprise-grade encryption for all data storage and transmission. Your conversations and personal information are never shared with third parties."
    },
    {
    question: "Who can see my relationship data?",
    answer: "Only you have access to your relationship data. Our system is designed with privacy-first principles, ensuring your information remains confidential."
    }]
  }
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery && !selectedCategory) return faqs;

    return faqs.map(category => ({
      ...category,
      items: category.items.filter(faq => {
        const matchesSearch = searchQuery.toLowerCase().trim() === '' ||
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
      })
    })).filter(category => category.items.length > 0);
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Hero Section */}
        <section className="pt-20 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold text-gray-900 mb-6"
              >
                Frequently Asked
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-transparent bg-clip-text animate-gradient">
                  Questions
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Find answers to common questions about BondMate and how we can help strengthen your relationships.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full p-4 pl-12 bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              {faqs.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setSelectedCategory(category.category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.category
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {(selectedCategory
                ? filteredFaqs.filter(c => c.category === selectedCategory)
                : filteredFaqs
              ).map((category) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm"
                      >
                        <button
                          onClick={() => setOpenIndex(openIndex === index ? null : index)}
                          className="w-full flex items-center justify-between p-6 text-left"
                        >
                          <span className="text-lg font-semibold text-gray-900">
                            {faq.question}
                          </span>
                          {openIndex === index ? (
                            <Minus className="w-5 h-5 text-gray-500" />
                          ) : (
                            <Plus className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        {openIndex === index && (
                          <div className="px-6 pb-6">
                            <p className="text-gray-600">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}