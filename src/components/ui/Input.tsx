import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  label,
  error,
  disabled = false,
  className,
  required = false,
  onKeyPress,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-200">
          {label}
          {required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}
      <motion.div
        className="relative"
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={clsx(
            'liquid-input',
            error && 'border-red-500/50 ring-red-500/50',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-0 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Input; 