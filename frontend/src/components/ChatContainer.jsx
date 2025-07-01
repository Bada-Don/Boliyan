// components/ChatContainer.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndication';
import EmptyState from './EmptyState';

const ChatContainer = ({ 
  messages, 
  isLoading, 
  isDarkMode, 
  chatContainerRef, 
  onFeedback, 
  expandedFeedback, 
  feedbackForm, 
  setFeedbackForm, 
  submitCorrection 
}) => {
  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      ref={chatContainerRef}
      className={`flex-1 overflow-y-auto rounded-2xl sm:rounded-3xl border-2 p-3 sm:p-6 mb-4 sm:mb-6 backdrop-blur-lg ${
        isDarkMode
          ? 'bg-gray-900/30 border-gray-700/50'
          : 'bg-white/40 border-gray-200/50'
      }`}
      style={{ 
        minHeight: '300px', 
        maxHeight: window.innerHeight < 768 ? '60vh' : '500px' 
      }}
    >
      <AnimatePresence>
        {messages.length === 0 && (
          <EmptyState isDarkMode={isDarkMode} />
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isDarkMode={isDarkMode}
            onFeedback={onFeedback}
            expandedFeedback={expandedFeedback}
            feedbackForm={feedbackForm}
            setFeedbackForm={setFeedbackForm}
            submitCorrection={submitCorrection}
          />
        ))}

        {isLoading && (
          <LoadingIndicator isDarkMode={isDarkMode} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatContainer;