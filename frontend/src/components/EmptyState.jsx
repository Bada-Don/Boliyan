// components/EmptyState.jsx
import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ isDarkMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-8 sm:py-12"
    >
      <div className={`text-4xl sm:text-6xl mb-3 sm:mb-4 ${
        isDarkMode ? 'text-purple-400' : 'text-purple-500'
      }`}>
        ✨
      </div>
      <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Start a conversation
      </h3>
      <p className={`text-sm sm:text-base ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Type something to see the magic happen!
      </p>
    </motion.div>
  );
};

export default EmptyState;