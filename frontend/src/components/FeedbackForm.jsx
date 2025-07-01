// components/FeedbackForm.jsx
import React from 'react';
import { motion } from 'framer-motion';

const FeedbackForm = ({ 
  messageId, 
  isDarkMode, 
  feedbackForm, 
  setFeedbackForm, 
  submitCorrection 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${
        isDarkMode
          ? 'bg-gray-800/40 border-gray-600/30'
          : 'bg-white/60 border-gray-200/40'
      } backdrop-blur-lg`}
    >
      <h4 className={`text-xs sm:text-sm font-semibold mb-3 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Submit Correction
      </h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="English text"
          value={feedbackForm.english}
          onChange={(e) => setFeedbackForm(prev => ({...prev, english: e.target.value}))}
          className={`w-full px-3 py-2 text-sm sm:text-base rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
            isDarkMode
              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <input
          type="text"
          placeholder="Correct output"
          value={feedbackForm.corrected}
          onChange={(e) => setFeedbackForm(prev => ({...prev, corrected: e.target.value}))}
          className={`w-full px-3 py-2 text-sm sm:text-base rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
            isDarkMode
              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => submitCorrection(messageId)}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm sm:text-base"
        >
          Submit
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FeedbackForm;