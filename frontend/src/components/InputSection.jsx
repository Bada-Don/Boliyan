// components/InputSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const InputSection = ({ 
  text, 
  setText, 
  onTransliterate, 
  onKeyPress, 
  isLoading, 
  isDarkMode, 
  textareaRef 
}) => {
  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 backdrop-blur-lg ${
        isDarkMode
          ? 'bg-gray-900/30 border-gray-700/50'
          : 'bg-white/40 border-gray-200/50'
      }`}
    >
      <div className="flex-1 ">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={onKeyPress}
          onInput={handleTextareaInput}
          placeholder="Type your message here..."
          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-0 resize-none focus:outline-none transition-all duration-300 text-sm sm:text-base ${
            isDarkMode
              ? 'bg-gray-800/50 text-white placeholder-gray-400'
              : 'bg-white/80 text-gray-900 placeholder-gray-500'
          } backdrop-blur-lg`}
          rows="1"
          style={{ 
            minHeight: '40px', 
            maxHeight: '120px',
            height: 'auto'
          }}
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onTransliterate}
        disabled={!text.trim() || isLoading}
        className={`p-3 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 flex-shrink-0 ${
          !text.trim() || isLoading
            ? 'bg-gray-400/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
        }`}
      >
        <PaperAirplaneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </motion.button>
    </motion.div>
  );
};

export default InputSection;