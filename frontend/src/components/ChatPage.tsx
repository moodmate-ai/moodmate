import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Send, Smile, Paperclip, Bot } from 'lucide-react';
import './ChatPage.css';

// Add blank export for components without explicit ChatPage import
export const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="coming-soon-container">
      <h1>{title}</h1>
      <p>This feature is coming soon. Stay tuned!</p>
    </div>
  );
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatPageProps {
  userName?: string;
  profileImage?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ userName = '홍길동', profileImage = 'https://via.placeholder.com/150' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Suggested prompts for the welcome screen
  const suggestedPrompts = [
    "오늘 기분이 좋지 않아요",
    "스트레스 관리 방법 추천해줘",
    "수면의 질을 높이는 방법",
    "감정 조절이 어려울 때 어떻게 해야 할까요?",
    "긍정적인 마인드를 유지하는 방법"
  ];

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize the textarea input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI response (after a short delay)
    setTimeout(() => {
      generateResponse(input);
    }, 1500);
  };

  const generateResponse = (userInput: string) => {
    // Simple response patterns - in a real app this would be an API call
    let response = '';
    const lowercaseInput = userInput.toLowerCase();

    if (lowercaseInput.includes('안녕') || lowercaseInput.includes('hi') || lowercaseInput.includes('hello')) {
      response = `안녕하세요, ${userName}님! 오늘 기분이 어떠신가요?`;
    } else if (lowercaseInput.includes('기분') && (lowercaseInput.includes('나쁘') || lowercaseInput.includes('안좋'))) {
      response = '기분이 좋지 않으시군요. 혹시 무슨 일이 있으셨나요? 이야기를 나누면 도움이 될 수 있어요.';
    } else if (lowercaseInput.includes('스트레스')) {
      response = '스트레스 관리는 정말 중요해요. 깊은 호흡, 가벼운 운동, 충분한 수면이 도움이 될 수 있어요. 또한 좋아하는 취미 활동을 하는 것도 좋은 방법이에요.';
    } else if (lowercaseInput.includes('수면') || lowercaseInput.includes('잠')) {
      response = '양질의 수면을 위해서는 일정한 취침 시간을 유지하고, 자기 전 블루라이트를 피하며, 침실을 시원하고 조용하게 유지하는 것이 좋습니다. 또한, 카페인과 알코올을 자기 전에 피하는 것도 도움이 됩니다.';
    } else if (lowercaseInput.includes('행복') || lowercaseInput.includes('긍정')) {
      response = '긍정적인 마인드를 유지하기 위해 감사 일기를 쓰거나, 작은 성취에도 자신을 칭찬하는 것이 도움이 됩니다. 또한 마음챙김과 명상도 효과적인 방법이에요.';
    } else {
      response = '말씀해주셔서 감사합니다. 더 자세하게 이야기해주시면 도움이 될 수 있을 것 같아요. 감정이나 상황에 대해 더 알려주실 수 있을까요?';
    }

    const assistantMessage: Message = {
      id: Date.now().toString(),
      content: response,
      sender: 'assistant',
      timestamp: new Date(),
    };

    setIsThinking(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 className="chat-title">MoodMate 챗봇</h2>
        <button className="chat-options-button">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="icon">🤖</div>
            <h2>MoodMate 챗봇에 오신 것을 환영합니다!</h2>
            <p>
              안녕하세요, {userName}님! 저는 여러분의 감정적 웰빙을 돕기 위해 여기 있어요.
              기분이 어떠신지 알려주시거나, 감정에 대해 이야기하거나, 마음 관리에 대한 조언을 구해보세요.
            </p>
            <div className="suggested-prompts">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="suggested-prompt"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className={`message-avatar ${message.sender}`}>
                {message.sender === 'user' ? (
                  <img src={profileImage} alt="User" />
                ) : (
                  <Bot size={24} />
                )}
              </div>
              <div>
                <div className="message-content">
                  {message.content}
                  <span className="timestamp">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {isThinking && (
          <div className="message assistant">
            <div className="message-avatar assistant">
              <Bot size={24} />
            </div>
            <div className="message-content">
              <div className="message-thinking">
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          rows={1}
        />
        <div className="chat-action-buttons">
          <button className="action-button">
            <Smile size={20} />
          </button>
          <button className="action-button">
            <Paperclip size={20} />
          </button>
        </div>
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!input.trim() || isThinking}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;