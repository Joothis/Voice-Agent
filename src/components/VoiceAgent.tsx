import React, { useState, useEffect, useRef } from 'react';
import VoiceRecorder from './VoiceRecorder';
import ConversationDisplay from './ConversationDisplay';
import AppointmentCalendar from './AppointmentCalendar';
import { processVoiceInput } from '../services/voiceProcessingService';
import { Message, AppointmentDetails } from '../types';
import { Mic, MicOff, Calendar, Volume2, VolumeX } from 'lucide-react';

const VoiceAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message with voice
  useEffect(() => {
    const welcomeMessage = "Hello! I'm your AI assistant. How can I help you today? You can ask me to book, reschedule, or cancel appointments.";
    setMessages([{ 
      id: '1', 
      text: welcomeMessage, 
      sender: 'ai',
      timestamp: new Date()
    }]);
    speakText(welcomeMessage);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartListening = () => {
    window.speechSynthesis.cancel(); // Stop current speech if user starts speaking
    setIsListening(true);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: transcript,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      const response = await processVoiceInput(transcript);
      
      if (response.appointmentDetails) {
        setAppointmentDetails(response.appointmentDetails);
        setShowCalendar(true);
      }
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);
        
        if (isVoiceEnabled) {
          speakText(response.message);
        }
      }, 1000);
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorMessage = "I'm sorry, I couldn't process that request. Could you please try again?";
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          text: errorMessage, 
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
      if (isVoiceEnabled) {
        speakText(errorMessage);
      }
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && isVoiceEnabled) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for more natural sound
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    window.speechSynthesis.cancel(); // Cancel any ongoing speech when toggling
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-primary-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-medium">Conversation</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                isVoiceEnabled ? 'bg-accent-500' : 'bg-gray-500'
              }`}
            >
              {isVoiceEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </button>
            {isProcessing && (
              <span className="text-xs bg-white/20 py-1 px-2 rounded-full flex items-center animate-pulse">
                Processing...
              </span>
            )}
          </div>
        </div>
        
        <ConversationDisplay 
          messages={messages} 
          isProcessing={isProcessing} 
          messagesEndRef={messagesEndRef}
        />
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <VoiceRecorder
              isListening={isListening}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
              onTranscriptReceived={handleVoiceInput}
            />
            
            <div className="mx-4 flex-1">
              <p className="text-sm text-gray-500">
                {isListening 
                  ? "I'm listening. Speak now..." 
                  : "Click the microphone to start speaking"}
              </p>
            </div>
            
            <button 
              className={`p-2.5 rounded-full transform transition-all hover:scale-110 ${
                isListening 
                  ? 'bg-error-500 text-white animate-pulse' 
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
              onClick={isListening ? handleStopListening : handleStartListening}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {showCalendar && (
        <div className="lg:w-1/3 bg-white rounded-lg shadow-md overflow-hidden animate-slide-in">
          <div className="p-4 bg-secondary-600 text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-medium">Appointment Details</h2>
          </div>
          
          <AppointmentCalendar 
            appointmentDetails={appointmentDetails} 
            onConfirm={handleConfirmAppointment}
            onCancel={handleCancelCalendar}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;