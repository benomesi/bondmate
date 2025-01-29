import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const STATS = [
  {
    title: 'Communication Challenges',
    stat: '#1',
    description: 'Studies show that communication is the most common source of conflict among couples',
    source: 'Psychology Today',
    link: 'https://www.psychologytoday.com/us/blog/the-psychology-of-relationships/202106/the-10-most-common-sources-of-conflict-in-relationships'
  },
  {
    title: 'Dating Difficulties',
    stat: '50%',
    description: 'Nearly 50% of U.S. adults believe dating has become harder in the past decade',
    source: 'Pew Research',
    link: 'https://www.pewresearch.org/social-trends/2020/08/20/nearly-half-of-u-s-adults-say-dating-has-gotten-harder'
  },
  {
    title: 'Online Dating Trends',
    stat: '15%',
    description: 'As of 2020, 15% of U.S. adults reported using dating apps, illustrating the growing complexity of modern relationships',
    source: 'Pew Research',
    link: 'https://www.pewresearch.org/internet/2020/05/08/dating-and-relationships-in-the-digital-age'
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            The State of Modern Relationships
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Understanding the challenges we face in building and maintaining relationships
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STATS.map(({ title, stat, description, source, link }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-7xl font-bold mb-6 text-white/90">
                {stat}
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {title}
              </h3>
              <p className="text-white/80 mb-6 text-lg">
                {description}
              </p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors"
              >
                Source: {source}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}