import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'transparent';
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  onClick,
  hover = false,
}) => {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300';
  
  const variantClasses = {
    default: 'glass-effect',
    elevated: 'glass-effect shadow-liquid',
    transparent: 'bg-transparent border border-white/10',
  };
  
  const hoverClasses = hover ? 'hover:scale-105 hover:shadow-liquid cursor-pointer' : '';
  
  const Component = onClick ? motion.div : motion.div;
  
  return (
    <Component
      className={clsx(baseClasses, variantClasses[variant], hoverClasses, className)}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </Component>
  );
};

export default Card; 