import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import CreateAIFriendPage from './pages/CreateAIFriendPage';
import Navigation from './components/Navigation';
import { PersonalityProvider } from './context/PersonalityContext';

const App: React.FC = () => {
  return (
    <PersonalityProvider>
      <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 liquid-bg" />
      
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-r from-secondary-500/20 to-primary-500/20 blur-xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-40 left-1/4 w-20 h-20 rounded-full bg-gradient-to-r from-accent-500/20 to-secondary-500/20 blur-xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/create" element={<CreateAIFriendPage />} />
        </Routes>
        
        {/* Navigation */}
        <Navigation />
      </div>
      </div>
    </PersonalityProvider>
  );
};

export default App; 