// components/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Header = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`backdrop-blur-lg border-b ${
        isDarkMode 
          ? 'bg-gray-900/50 border-white/10' 
          : 'bg-white/50 border-gray-200/50'
      } sticky top-0 z-20`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2 sm:gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className={`p-1.5 sm:p-2 rounded-xl ${
            isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'
          }`}>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.51-6.81L12.17 4h-.05C11.81 4 11.45 4 11.09 4c-4.09 0-7.41 3.05-7.41 6.81 0 2.04.87 3.89 2.26 5.26L7.54 14.5c.78-.78 2.05-.78 2.83 0l.71.71c.78.78.78 2.05 0 2.83l-1.54 1.54c1.37 1.39 3.22 2.26 5.26 2.26 3.76 0 6.81-3.32 6.81-7.41 0-.36 0-.72-.04-1.08l-1.31 1.31c-2.16-1.5-4.87-1.23-6.81.51z"/>
            </svg>
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Boliyan
            </h1>
            <p className={`text-xs sm:text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Transliteration made easy!
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 sm:p-3 rounded-xl transition-colors ${
              isDarkMode 
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                : 'bg-purple-500/20 text-purple-600 hover:bg-purple-500/30'
            }`}
          >
            {isDarkMode ? <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;