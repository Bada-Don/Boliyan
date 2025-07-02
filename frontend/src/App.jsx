// App.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import ChatContainer from './components/ChatContainer';
import InputSection from './components/InputSection';
import BackgroundParticles from './components/BackgroundParticles';
import './App.css';

const TransliterationApp = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ english: '', corrected: '' });
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

  useEffect(() => {
    window.onFeedbackFormClose = () => setExpandedFeedback(null);
    return () => { window.onFeedbackFormClose = null; };
  }, []);

  const handleTransliterate = async () => {
    if (!text.trim()) return;

    const userMessage = { type: 'user', content: text, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setText('');

    try {
      const response = await axios.post('https://boliyan.onrender.com/transliterate', {
        text: text.trim(),
        language: selectedLanguage
      });

      setTimeout(() => {
        const botMessage = {
          type: 'bot',
          content: Object.values(response.data)[0],
          english: text.trim(),
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
      return;
    }
    setExpandedFeedback(expandedFeedback === messageId ? null : messageId);
  };

  const submitCorrection = async (messageId) => {
    try {
      await axios.post('https://boliyan.onrender.com/contribute', {
        key: feedbackForm.english,
        value: feedbackForm.corrected
      });
      setExpandedFeedback(null);
      setFeedbackForm({ english: '', corrected: '' });
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
      <BackgroundParticles isDarkMode={isDarkMode} />

      <div className="relative z-10 flex flex-col h-screen">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8">
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languages={languages}
            isDarkMode={isDarkMode}
          />

          <ChatContainer
            messages={messages}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
            chatContainerRef={chatContainerRef}
            onFeedback={handleFeedback}
            expandedFeedback={expandedFeedback}
            feedbackForm={feedbackForm}
            setFeedbackForm={setFeedbackForm}
            submitCorrection={submitCorrection}
          />

          <InputSection
            text={text}
            setText={setText}
            onTransliterate={handleTransliterate}
            onKeyPress={handleKeyPress}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
            textareaRef={textareaRef}
          />
        </div>
      </div>
    </div>
  );
};

export default TransliterationApp;