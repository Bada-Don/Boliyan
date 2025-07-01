// components/LanguageSelector.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage, languages, isDarkMode }) => {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-4 sm:mb-6"
    >
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className={`w-full px-3 sm:px-4 py-3 pl-10 sm:pl-12 pr-8 sm:pr-10 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 text-sm sm:text-base ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20'
              : 'bg-white/80 border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20'
          } backdrop-blur-lg appearance-none cursor-pointer`}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-purple-500">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.51-6.81L12.17 4h-.05C11.81 4 11.45 4 11.09 4c-4.09 0-7.41 3.05-7.41 6.81 0 2.04.87 3.89 2.26 5.26L7.54 14.5c.78-.78 2.05-.78 2.83 0l.71.71c.78.78.78 2.05 0 2.83l-1.54 1.54c1.37 1.39 3.22 2.26 5.26 2.26 3.76 0 6.81-3.32 6.81-7.41 0-.36 0-.72-.04-1.08l-1.31 1.31c-2.16-1.5-4.87-1.23-6.81.51z"/>
          </svg>
        </div>
        <ChevronDownIcon className={`absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`} />
      </div>
    </motion.div>
  );
};

export default LanguageSelector;