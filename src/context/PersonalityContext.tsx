import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LucideIcon, Heart, Brain, Sparkles, Zap } from 'lucide-react';

interface PersonalityTrait {
  name: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

interface PersonalityContextType {
  personalityTraits: PersonalityTrait[];
  setPersonalityTraits: (traits: PersonalityTrait[]) => void;
  aiName: string;
  setAiName: (name: string) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  selectedAvatar: string;
  setSelectedAvatar: (avatar: string) => void;
  uploadedAvatar: string | null;
  setUploadedAvatar: (avatar: string | null) => void;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(undefined);

export const usePersonality = () => {
  const context = useContext(PersonalityContext);
  if (context === undefined) {
    throw new Error('usePersonality must be used within a PersonalityProvider');
  }
  return context;
};

interface PersonalityProviderProps {
  children: ReactNode;
}

export const PersonalityProvider: React.FC<PersonalityProviderProps> = ({ children }) => {
  const [personalityTraits, setPersonalityTraits] = useState<PersonalityTrait[]>([
    { name: 'Empathetic', value: 50, icon: Heart, color: 'from-red-500 to-pink-500' },
    { name: 'Analytical', value: 50, icon: Brain, color: 'from-blue-500 to-purple-500' },
    { name: 'Humorous', value: 50, icon: Sparkles, color: 'from-yellow-500 to-orange-500' },
    { name: 'Energetic', value: 50, icon: Zap, color: 'from-green-500 to-teal-500' },
  ]);
  
  const [aiName, setAiName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);

  const value = {
    personalityTraits,
    setPersonalityTraits,
    aiName,
    setAiName,
    selectedVoice,
    setSelectedVoice,
    selectedAvatar,
    setSelectedAvatar,
    uploadedAvatar,
    setUploadedAvatar,
  };

  return (
    <PersonalityContext.Provider value={value}>
      {children}
    </PersonalityContext.Provider>
  );
}; 