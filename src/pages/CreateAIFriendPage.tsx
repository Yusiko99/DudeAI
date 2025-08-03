import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Brain, Mic, User, Upload, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { usePersonality } from '../context/PersonalityContext';



interface VoiceOption {
  id: string;
  name: string;
  description: string;
  preview: string;
}

interface AvatarOption {
  id: string;
  name: string;
  image: string;
  category: 'preset' | 'custom';
}

const CreateAIFriendPage: React.FC = () => {
  const { 
    aiName, 
    setAiName, 
    personalityTraits, 
    setPersonalityTraits,
    selectedVoice,
    setSelectedVoice,
    selectedAvatar,
    setSelectedAvatar,
    uploadedAvatar,
    setUploadedAvatar
  } = usePersonality();

  const voiceOptions: VoiceOption[] = [
    { id: '1', name: 'Warm & Friendly', description: 'Gentle and approachable', preview: 'Hello there!' },
    { id: '2', name: 'Professional', description: 'Clear and confident', preview: 'How can I assist you?' },
    { id: '3', name: 'Playful', description: 'Fun and energetic', preview: 'Hey buddy!' },
    { id: '4', name: 'Calm & Soothing', description: 'Peaceful and relaxing', preview: 'Take a deep breath...' },
  ];

  const avatarOptions: AvatarOption[] = [
    { id: '1', name: 'Alex', image: '/avatars/avatar-1.png', category: 'preset' },
    { id: '2', name: 'Sam', image: '/avatars/avatar-2.png', category: 'preset' },
    { id: '3', name: 'Jordan', image: '/avatars/avatar-3.jpg', category: 'preset' },
    { id: '4', name: 'Casey', image: '/avatars/avatar-4.jpg', category: 'preset' },
    { id: '5', name: 'Riley', image: '/avatars/avatar-5.jpg', category: 'preset' },
    { id: '6', name: 'Quinn', image: '/avatars/avatar-6.jpg', category: 'preset' },
  ];

  const handleTraitChange = (index: number, value: number) => {
    const newTraits = [...personalityTraits];
    newTraits[index].value = value;
    setPersonalityTraits(newTraits);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedAvatar(e.target?.result as string);
        setSelectedAvatar('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Create Your AI Friend</h1>
        </motion.div>

        {/* Bento Box Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Name Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Name Your Friend</h2>
              </div>
              <Input
                value={aiName}
                onChange={setAiName}
                placeholder="Enter your AI friend's name..."
                label="AI Friend Name"
                required
              />
            </Card>
          </motion.div>

          {/* Personality Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-accent-500/20 to-secondary-500/20 flex items-center justify-center">
                  <Brain size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Personality Traits</h2>
              </div>
              <div className="space-y-6">
                {personalityTraits.map((trait, index) => {
                  const Icon = trait.icon;
                  return (
                    <div key={trait.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon size={16} className="text-neutral-300" />
                          <span className="text-sm font-medium text-neutral-200">{trait.name}</span>
                        </div>
                        <span className="text-xs text-neutral-400">{trait.value}%</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={trait.value}
                          onChange={(e) => handleTraitChange(index, parseInt(e.target.value))}
                          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, ${trait.color} 0%, ${trait.color} ${trait.value}%, rgba(75, 85, 99, 0.5) ${trait.value}%, rgba(75, 85, 99, 0.5) 100%)`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Voice Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-secondary-500/20 to-primary-500/20 flex items-center justify-center">
                  <Mic size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Voice Style</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {voiceOptions.map((voice) => (
                  <motion.div
                    key={voice.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                        selectedVoice === voice.id
                          ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border-primary-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      } border`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white">{voice.name}</h3>
                          <p className="text-sm text-neutral-300">{voice.description}</p>
                          <p className="text-xs text-neutral-400 mt-1 italic">"{voice.preview}"</p>
                        </div>
                        {selectedVoice === voice.id && (
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                        )}
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Avatar Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Choose Avatar</h2>
              </div>
              
              {/* Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-3">Upload Your Own</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-xl hover:border-white/40 transition-colors duration-300 cursor-pointer"
                  >
                    <div className="text-center">
                      <Upload size={24} className="text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-400">Click to upload image</p>
                    </div>
                  </label>
                </div>
                {uploadedAvatar && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3"
                  >
                    <div className="relative inline-block">
                      <img
                        src={uploadedAvatar}
                        alt="Uploaded avatar"
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Preset Avatars */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">Or Choose from Presets</label>
                <div className="grid grid-cols-3 gap-3">
                  {avatarOptions.map((avatar) => (
                    <motion.div
                      key={avatar.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`w-full aspect-square rounded-xl relative overflow-hidden transition-all duration-300 ${
                          selectedAvatar === avatar.id
                            ? 'ring-2 ring-primary-500 scale-105'
                            : 'hover:scale-105'
                        }`}
                                             >
                         {/* Avatar image */}
                         <img
                           src={avatar.image}
                           alt={avatar.name}
                           className="absolute inset-0 w-full h-full object-cover"
                           onError={(e) => {
                             // Fallback to gradient if image fails to load
                             const target = e.target as HTMLImageElement;
                             target.style.display = 'none';
                             const parent = target.parentElement;
                             if (parent) {
                               parent.innerHTML = `
                                 <div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500"></div>
                                 <div class="absolute inset-0 flex items-center justify-center">
                                   <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                   </svg>
                                 </div>
                               `;
                             }
                           }}
                         />
                         <div className="absolute bottom-1 left-1 right-1">
                           <p className="text-white text-xs font-medium text-center truncate drop-shadow-lg">{avatar.name}</p>
                         </div>
                        {selectedAvatar === avatar.id && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Create Button */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link to="/chat">
            <Button size="lg" className="px-12">
              <Sparkles size={20} className="mr-2" />
              Create My AI Friend
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateAIFriendPage; 