// App.js
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, PaperAirplaneIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { HeartIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import './App.css';

const TransliterationApp = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ original: '', corrected: '' });
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const languages = [
    { value: '', label: 'Auto-detect Language' },
    { value: 'en-pa', label: 'English to Punjabi' },
    { value: 'en-hi', label: 'English to Hindi' },
    { value: 'en-ar', label: 'English to Arabic' },
    { value: 'en-es', label: 'English to Spanish' },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTransliterate = async () => {
    if (!text.trim()) return;

    const userMessage = { type: 'user', content: text, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setText('');

    try {
      const response = await axios.post('http://localhost:5000/transliterate', {
        text: text.trim(),
        language: selectedLanguage
      });

      setTimeout(() => {
        const botMessage = {
          type: 'bot',
          content: Object.values(response.data)[0],
          original: text.trim(),
          id: Date.now() + 1
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Transliteration error:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, something went wrong. Please try again.',
        isError: true,
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId, isCorrect) => {
    if (isCorrect) {
      // Handle thumbs up - maybe just animate it
      return;
    }
    setExpandedFeedback(expandedFeedback === messageId ? null : messageId);
  };

  const submitCorrection = async (messageId) => {
    try {
      await axios.post('http://localhost:5000/contribute', {
        key: feedbackForm.original,
        value: feedbackForm.corrected
      });
      setExpandedFeedback(null);
      setFeedbackForm({ original: '', corrected: '' });
      // Show success animation or toast
    } catch (error) {
      console.error('Correction submission error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTransliterate();
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDarkMode ? 'bg-white/10' : 'bg-purple-300/20'
            }`}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
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
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className={`p-2 rounded-xl ${
                isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/10'
              }`}>
                <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.51-6.81L12.17 4h-.05C11.81 4 11.45 4 11.09 4c-4.09 0-7.41 3.05-7.41 6.81 0 2.04.87 3.89 2.26 5.26L7.54 14.5c.78-.78 2.05-.78 2.83 0l.71.71c.78.78.78 2.05 0 2.83l-1.54 1.54c1.37 1.39 3.22 2.26 5.26 2.26 3.76 0 6.81-3.32 6.81-7.41 0-.36 0-.72-.04-1.08l-1.31 1.31c-2.16-1.5-4.87-1.23-6.81.51z"/>
                </svg>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Transliterate
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Transform your text beautifully
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-colors ${
                  isDarkMode 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-purple-500/20 text-purple-600 hover:bg-purple-500/30'
                }`}
              >
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
          {/* Language Selector */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className={`w-full px-4 py-3 pl-12 pr-10 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
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
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.51-6.81L12.17 4h-.05C11.81 4 11.45 4 11.09 4c-4.09 0-7.41 3.05-7.41 6.81 0 2.04.87 3.89 2.26 5.26L7.54 14.5c.78-.78 2.05-.78 2.83 0l.71.71c.78.78.78 2.05 0 2.83l-1.54 1.54c1.37 1.39 3.22 2.26 5.26 2.26 3.76 0 6.81-3.32 6.81-7.41 0-.36 0-.72-.04-1.08l-1.31 1.31c-2.16-1.5-4.87-1.23-6.81.51z"/>
                </svg>
              </div>
              <ChevronDownIcon className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </div>
          </motion.div>

          {/* Chat Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            ref={chatContainerRef}
            className={`flex-1 overflow-y-auto rounded-3xl border-2 p-6 mb-6 backdrop-blur-lg ${
              isDarkMode
                ? 'bg-gray-900/30 border-gray-700/50'
                : 'bg-white/40 border-gray-200/50'
            }`}
            style={{ minHeight: '400px', maxHeight: '500px' }}
          >
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                  <div className={`text-6xl mb-4 ${
                    isDarkMode ? 'text-purple-400' : 'text-purple-500'
                  }`}>
                    ✨
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Start a conversation
                  </h3>
                  <p className={`${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Type something to see the magic happen!
                  </p>
                </motion.div>
              )}

              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isDarkMode={isDarkMode}
                  onFeedback={handleFeedback}
                  expandedFeedback={expandedFeedback}
                  feedbackForm={feedbackForm}
                  setFeedbackForm={setFeedbackForm}
                  submitCorrection={submitCorrection}
                />
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex justify-start mb-6"
                >
                  <div className={`flex items-center gap-3 px-6 py-4 rounded-3xl max-w-xs ${
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
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Transliterating...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Input Section */}
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`flex items-end gap-4 p-4 rounded-3xl border-2 backdrop-blur-lg ${
              isDarkMode
                ? 'bg-gray-900/30 border-gray-700/50'
                : 'bg-white/40 border-gray-200/50'
            }`}
          >
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className={`w-full px-4 py-3 rounded-2xl border-0 resize-none focus:outline-none transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800/50 text-white placeholder-gray-400'
                    : 'bg-white/80 text-gray-900 placeholder-gray-500'
                } backdrop-blur-lg`}
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTransliterate}
              disabled={!text.trim() || isLoading}
              className={`p-4 rounded-2xl transition-all duration-300 ${
                !text.trim() || isLoading
                  ? 'bg-gray-400/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
              }`}
            >
              <PaperAirplaneIcon className="w-6 h-6 text-white" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ 
  message, 
  isDarkMode, 
  onFeedback, 
  expandedFeedback, 
  feedbackForm, 
  setFeedbackForm, 
  submitCorrection 
}) => {
  const isUser = message.type === 'user';
  const isExpanded = expandedFeedback === message.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }}
      className={`flex mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`px-6 py-4 rounded-3xl shadow-lg backdrop-blur-lg border ${
            isUser
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400/30'
              : message.isError
              ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/30'
              : isDarkMode
              ? 'bg-gray-800/60 text-white border-gray-600/30'
              : 'bg-white/80 text-gray-900 border-gray-200/30'
          }`}
        >
          <p className="text-base leading-relaxed">{message.content}</p>
        </motion.div>

        {!isUser && !message.isError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 flex items-center gap-3"
          >
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Was this correct?
            </span>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onFeedback(message.id, true)}
              className="p-2 rounded-full hover:bg-green-500/20 text-green-500 transition-colors"
            >
              <HandThumbUpIcon className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onFeedback(message.id, false)}
              className="p-2 rounded-full hover:bg-red-500/20 text-red-500 transition-colors"
            >
              <HandThumbDownIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 p-4 rounded-2xl border ${
                isDarkMode
                  ? 'bg-gray-800/40 border-gray-600/30'
                  : 'bg-white/60 border-gray-200/40'
              } backdrop-blur-lg`}
            >
              <h4 className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Submit Correction
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Original text"
                  value={feedbackForm.original}
                  onChange={(e) => setFeedbackForm(prev => ({...prev, original: e.target.value}))}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
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
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    isDarkMode
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => submitCorrection(message.id)}
                  className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Submit
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TransliterationApp;