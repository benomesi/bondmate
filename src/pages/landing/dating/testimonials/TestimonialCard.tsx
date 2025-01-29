import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Trophy } from 'lucide-react';
import type { Testimonial } from './index';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100/20"
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }}>
        <div className="absolute inset-0 bg-white rounded-2xl" />
      </div>

      <div className="relative">
        <div className="flex items-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 rounded-xl ring-2 ring-red-500/20 group-hover:ring-red-500/40 transition-all duration-300" />
          </div>
          <div className="ml-4">
            <h3 className="font-bold text-gray-900">
              {testimonial.name}, {testimonial.age}
            </h3>
            <p className="text-red-600">{testimonial.location}</p>
            <p className="text-sm text-gray-500">{testimonial.occupation}</p>
          </div>
        </div>

        <div className="flex mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 text-yellow-400 fill-current"
            />
          ))}
        </div>

        <blockquote className="relative">
          <div className="absolute -top-2 -left-2 text-red-500/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
            </svg>
          </div>
          <p className="text-gray-600 mb-6 pl-4">{testimonial.content}</p>
        </blockquote>

        <div className="space-y-3">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span className="font-medium">Result: {testimonial.result}</span>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <ArrowRight className="w-4 h-4 mr-1" />
            {testimonial.highlight}
          </div>
        </div>
      </div>
    </motion.div>
  );
}