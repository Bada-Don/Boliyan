// components/LoadingIndicator.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingIndicator = ({ isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex justify-start mb-4 sm:mb-6"
    >
      <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl max-w-xs ${
        isDarkMode 
          ? 'bg-gray-800/60' 
          : 'bg-white/80'
      } backdrop-blur-lg border border-gray-200/20`}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
        <span className={`text-xs sm:text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Transliterating...
        </span>
      </div>
    </motion.div>
  );
};

export default LoadingIndicator;