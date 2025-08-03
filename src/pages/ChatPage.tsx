import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Paperclip } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import EmojiPicker from '../components/EmojiPicker';
import VoiceRecorder from '../components/VoiceRecorder';
import AssemblyAIService from '../services/assemblyAIService';
import ASSEMBLY_AI_CONFIG from '../config/assemblyAI';
import GeminiService from '../services/geminiService';
import GEMINI_CONFIG from '../config/gemini';
import { usePersonality } from '../context/PersonalityContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const assemblyAIService = new AssemblyAIService(ASSEMBLY_AI_CONFIG.API_KEY);
  const geminiService = new GeminiService(GEMINI_CONFIG.API_KEY);
  const { personalityTraits, aiName, selectedAvatar, uploadedAvatar } = usePersonality();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hey! I'm ${aiName && aiName.trim() ? aiName : 'your AI friend'}. How are you doing today?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsEmojiPickerOpen(false);
    setIsTyping(true);

    try {
      // Get response from Gemini AI with personality traits
      const aiResponse = await geminiService.generateResponse(inputValue, personalityTraits, aiName);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response if DeepSeek fails
      const fallbackResponses = [
        "Hey bro! How's it going? 😊",
        "Yo! What's up man? 👋",
        "Hey dude! Nice to hear from you! ✨",
        "What's good bro? How's your day? 🌟",
        "Yo! Wassup? Everything cool? 😎",
        "Hey man! How u doing rn? 💪",
        "What's the word bro? All good? 🚀",
        "Yo! How's life treating you? 😄"
      ];
      
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  // Voice recording handlers
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Convert speech to text using Assembly AI
      const transcribedText = await assemblyAIService.transcribeAudioToText(audioBlob);
      
      if (transcribedText.trim()) {
        setInputValue(transcribedText);
        // Automatically send the transcribed message
        const userMessage: Message = {
          id: Date.now().toString(),
          text: transcribedText,
          sender: 'user',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        try {
          // Get response from Gemini AI for voice with personality traits
          const aiResponse = await geminiService.generateResponse(transcribedText, personalityTraits, aiName);
          
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: aiResponse,
            sender: 'ai',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error getting AI response for voice:', error);
          
          // Fallback response for voice
          const voiceFallbackResponses = [
            `I heard you say: "${transcribedText}". That's awesome bro! 🎤✨`,
            `Yo! You said: "${transcribedText}". Cool voice message! 🎵`,
            `Hey! I caught that: "${transcribedText}". Nice one! 🎧`,
            `Dude! You just said: "${transcribedText}". Love it! 🎤🎉`
          ];
          
          const fallbackResponse = voiceFallbackResponses[Math.floor(Math.random() * voiceFallbackResponses.length)];
          
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: fallbackResponse,
            sender: 'ai',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, aiMessage]);
        } finally {
          setIsTyping(false);
        }
      }
    } catch (error) {
      console.error('Speech-to-text error:', error);
      alert('Failed to transcribe voice message. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Recording timer effect
  useEffect(() => {
    let interval: number;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= ASSEMBLY_AI_CONFIG.MAX_RECORDING_TIME) {
            handleStopRecording();
            return 0;
          }
          return prev + 100;
        });
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <motion.div
        className="glass-effect rounded-b-3xl p-6 mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          {/* AI Avatar */}
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500/30 to-accent-500/30 flex items-center justify-center relative overflow-hidden"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {uploadedAvatar ? (
              <img
                src={uploadedAvatar}
                alt="AI Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">${aiName && aiName.trim() ? aiName.charAt(0).toUpperCase() : 'D'}</span>
                      </div>
                    `;
                  }
                }}
              />
            ) : selectedAvatar && selectedAvatar !== 'custom' ? (
              <img
                src={`/avatars/avatar-${selectedAvatar}.${selectedAvatar === '1' || selectedAvatar === '2' ? 'png' : 'jpg'}`}
                alt="AI Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 flex items-center justify-center">
                        <span class="text-white font-bold text-lg">${aiName && aiName.trim() ? aiName.charAt(0).toUpperCase() : 'D'}</span>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{aiName && aiName.trim() ? aiName.charAt(0).toUpperCase() : 'D'}</span>
              </div>
            )}
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-sm animate-pulse" />
          </motion.div>
          
                     <div>
             <h1 className="text-xl font-semibold text-white">{aiName && aiName.trim() ? aiName : 'Dude'}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-neutral-300">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 px-4 overflow-y-auto space-y-4 pb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} max-w-xs lg:max-w-md`}>
                <p className="text-white leading-relaxed">{message.text}</p>
                <p className="text-xs text-neutral-400 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

                 {/* Typing Indicator */}
         {isTyping && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex justify-start"
           >
             <div className="chat-bubble-ai">
               <div className="flex space-x-1">
                 <motion.div
                   className="w-2 h-2 bg-neutral-400 rounded-full"
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                 />
                 <motion.div
                   className="w-2 h-2 bg-neutral-400 rounded-full"
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                 />
                 <motion.div
                   className="w-2 h-2 bg-neutral-400 rounded-full"
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                 />
               </div>
             </div>
           </motion.div>
         )}

         {/* Transcribing Indicator */}
         {isTranscribing && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex justify-end"
           >
             <div className="chat-bubble-user">
               <div className="flex items-center space-x-2">
                 <motion.div
                   className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full"
                   animate={{ rotate: 360 }}
                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                 />
                 <span className="text-sm text-neutral-300">Transcribing voice message...</span>
               </div>
             </div>
           </motion.div>
         )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        className="glass-effect rounded-t-3xl p-6"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={setInputValue}
              placeholder="Type your message..."
              onKeyPress={handleKeyPress}
              className="resize-none"
            />
          </div>
          
                     <div className="flex space-x-2">
             <Button
               variant="ghost"
               size="sm"
               className="!p-3 w-12 h-12 flex items-center justify-center"
             >
               <Paperclip size={20} />
             </Button>
             
             <div className="relative">
               <Button
                 variant="ghost"
                 size="sm"
                 className="!p-3 w-12 h-12 flex items-center justify-center"
                 onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
               >
                 <Smile size={20} />
               </Button>
               <EmojiPicker
                 isOpen={isEmojiPickerOpen}
                 onClose={() => setIsEmojiPickerOpen(false)}
                 onEmojiSelect={handleEmojiSelect}
               />
             </div>
             
             <VoiceRecorder
               onRecordingComplete={handleRecordingComplete}
               isRecording={isRecording}
               onStartRecording={handleStartRecording}
               onStopRecording={handleStopRecording}
               recordingTime={recordingTime}
             />
             
             <Button
               onClick={handleSendMessage}
               disabled={!inputValue.trim() || isTyping || isTranscribing}
               className="!p-3 w-12 h-12 flex items-center justify-center"
             >
               <Send size={20} />
             </Button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPage; 