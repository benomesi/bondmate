import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: '1',
    title: '5 Communication Techniques for Better Relationships',
    slug: 'communication-techniques',
    excerpt: 'Learn effective strategies to improve your communication and strengthen your bonds with loved ones.',
    content: 'Communication is the cornerstone of any healthy relationship...',
    image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    category: { name: 'Communication' },
    author: { name: 'Dr. Sarah Johnson' },
    published: true,
    published_at: new Date('2024-02-15').toISOString()
  },
  {
    id: '2',
    title: 'Understanding Love Languages in Modern Relationships',
    slug: 'understanding-love-languages',
    excerpt: 'Discover how understanding and speaking your partner\'s love language can transform your relationship.',
    content: 'Love languages are the different ways people give and receive love...',
    image_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800',
    category: { name: 'Relationships' },
    author: { name: 'Michael Chen' },
    published: true,
    published_at: new Date('2024-02-14').toISOString()
  },
  {
    id: '3',
    title: 'Building Trust: The Foundation of Strong Relationships',
    slug: 'building-trust',
    excerpt: 'Explore practical ways to build and maintain trust in all your relationships.',
    content: 'Trust is the bedrock of every successful relationship...',
    image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    category: { name: 'Trust' },
    author: { name: 'Emily Rodriguez' },
    published: true,
    published_at: new Date('2024-02-13').toISOString()
  }
];

export function BlogSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50" data-testid="blog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Latest Insights
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Expert advice and practical tips for healthier relationships
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.published_at).toLocaleDateString()}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author.name}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm text-purple-600">
                    <Tag className="w-4 h-4 mr-1" />
                    {post.category.name}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 font-medium group"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-colors"
          >
            View All Posts
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}