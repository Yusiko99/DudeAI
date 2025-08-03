import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, Heart, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Intelligent Conversations',
      description: 'Engage in meaningful, context-aware conversations with your AI companion.',
      color: 'from-primary-500/20 to-primary-600/20',
    },
    {
      icon: Sparkles,
      title: 'Personalized Experience',
      description: 'Your AI friend adapts to your personality and preferences over time.',
      color: 'from-accent-500/20 to-accent-600/20',
    },
    {
      icon: Heart,
      title: 'Emotional Support',
      description: 'Find comfort and understanding in your AI companion during challenging times.',
      color: 'from-secondary-500/20 to-secondary-600/20',
    },
    {
      icon: Zap,
      title: 'Instant Response',
      description: 'Get immediate, thoughtful responses that feel natural and engaging.',
      color: 'from-primary-500/20 to-accent-500/20',
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles size={40} className="text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Dude</span>
            <br />
            <span className="text-white">Your AI Best Friend</span>
          </h1>
          
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Experience the future of AI companionship with our cutting-edge liquid glass interface. 
            Create your perfect AI friend and embark on meaningful conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your AI Friend
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Start Chatting
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full hover">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card variant="elevated" className="bg-gradient-to-r from-primary-500/10 to-accent-500/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">10K+</div>
                <div className="text-neutral-300">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">1M+</div>
                <div className="text-neutral-300">Conversations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient mb-2">99.9%</div>
                <div className="text-neutral-300">Uptime</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage; 