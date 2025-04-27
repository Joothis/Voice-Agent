import React, { useEffect, useState, useRef } from 'react';
import { Mic } from 'lucide-react';

interface VoiceRecorderProps {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onTranscriptReceived: (transcript: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isListening,
  onStartListening,
  onStopListening,
  onTranscriptReceived
}) => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    // Request microphone permission first
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        // Initialize speech recognition after permission granted
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setTranscript(finalTranscript || interimTranscript);
          setError(null);
        };
        
        recognition.onend = () => {
          if (isListening) {
            recognition.start();
          } else if (transcript) {
            onTranscriptReceived(transcript);
            setTranscript('');
          }
        };
        
        recognition.onerror = (event) => {
          switch (event.error) {
            case 'no-speech':
              setError("I couldn't hear anything. Please speak closer to the microphone.");
              break;
            case 'audio-capture':
              setError("I couldn't access your microphone. Please check your settings.");
              break;
            case 'not-allowed':
              setError("I need permission to use your microphone.");
              break;
            default:
              setError("An error occurred with speech recognition.");
          }
          onStopListening();
        };
      })
      .catch(() => {
        setError("Please allow microphone access to use voice features.");
      });
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      try {
        recognitionRef.current.start();
        setError(null);
      } catch (error) {
        console.log('Recognition already started');
      }
    } else {
      recognitionRef.current.stop();
    }
  }, [isListening]);
  
  return (
    <div className="flex items-center space-x-2">
      {transcript && (
        <div className="text-sm text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis max-w-sm animate-fade-in">
          {transcript}
        </div>
      )}
      {error && (
        <div className="text-sm text-error-500 animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;