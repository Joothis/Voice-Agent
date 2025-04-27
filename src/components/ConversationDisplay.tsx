import React, { RefObject } from 'react';
import { Message } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ConversationDisplayProps {
  messages: Message[];
  isProcessing: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  isProcessing,
  messagesEndRef
}) => {
  return (
    <div className="p-4 h-[60vh] overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm transform transition-all duration-300 hover:scale-[1.02] ${
                message.sender === 'user'
                  ? 'bg-primary-100 text-primary-900 animate-bounce-in'
                  : 'bg-white border border-gray-200 animate-slide-in'
              }`}
            >
              <div className="flex items-center mb-1">
                <span className={`text-xs ${message.sender === 'user' ? 'text-primary-600' : 'text-secondary-600'} font-medium`}>
                  {message.sender === 'user' ? 'You' : 'AI Assistant'}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm overflow-hidden whitespace-pre-wrap break-words animate-typing">
                {message.text}
              </p>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm max-w-[80%]">
              <div className="flex items-center mb-1">
                <span className="text-xs text-secondary-600 font-medium">AI Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="bg-gray-200 w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="bg-gray-200 w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConversationDisplay;