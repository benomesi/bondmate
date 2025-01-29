import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
}

export function Card({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  onClick,
  hover = true,
  gradient = false,
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-indigo-500'
}: CardProps) {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-200';
  const hoverStyles = hover ? 'hover:shadow-xl transform hover:-translate-y-1' : '';
  const gradientStyles = gradient ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white` : 'bg-white';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`
        ${baseStyles}
        ${hoverStyles}
        ${gradientStyles}
        ${className}
      `}
      onClick={onClick}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/20">
          <Icon className="w-6 h-6 text-current" />
        </div>
      )}
      {title && (
        <h3 className="text-xl font-bold mb-2">{title}</h3>
      )}
      {description && (
        <p className={`${gradient ? 'text-white/90' : 'text-gray-600'} mb-4`}>
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}