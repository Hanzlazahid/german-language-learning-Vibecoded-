// components/GermanChat.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const GermanChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hallo! 👋 I\'m your German language learning assistant. Ask me anything about German vocabulary, grammar, pronunciation, or culture!',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { isDark } = useTheme();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Detect mobile device and handle keyboard
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      return mobile;
    };
    const isMobileDevice = checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Handle visual viewport changes (keyboard open/close)
    let viewportHandler = null;
    if (window.visualViewport && isMobileDevice) {
      viewportHandler = () => {
        if (inputRef.current && document.activeElement === inputRef.current) {
          setTimeout(() => {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      };
      window.visualViewport.addEventListener('resize', viewportHandler);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (window.visualViewport && viewportHandler) {
        window.visualViewport.removeEventListener('resize', viewportHandler);
      }
    };
  }, []);

  // Focus input when chat opens and scroll input into view on mobile
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        // On mobile, scroll input into view when keyboard opens
        if (isMobile) {
          setTimeout(() => {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      }, 100);
    }
  }, [isOpen, isMobile]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  // Handle input focus on mobile - scroll into view
  const handleInputFocus = () => {
    if (isMobile && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    // Refocus input after sending
    setTimeout(() => inputRef.current?.focus(), 100);

    try {
      // Build conversation history (last 10 messages for context)
      const conversationHistory = messages
        .slice(-10)
        .map(msg => ({ role: msg.role, content: msg.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message || 'Sorry, I couldn\'t generate a response. Please try again.',
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please check your internet connection and try again.',
      }]);
    } finally {
      setIsLoading(false);
      // Refocus input after response
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    // If Enter is pressed without Shift, send the message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
    // Shift+Enter will allow new line (default behavior)
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open German chat assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className={`fixed ${isMobile ? 'inset-0 w-full h-full rounded-none' : 'bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] rounded-lg'} bg-white dark:bg-gray-800 shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-yellow-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">German Learning Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-yellow-700 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900" style={{ WebkitOverflowScrolling: 'touch' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex space-x-2">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                placeholder="Ask about German language... (Shift+Enter for new line)"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none min-h-[40px] max-h-[120px]"
                disabled={isLoading}
                rows={1}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center self-end"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default GermanChat;

