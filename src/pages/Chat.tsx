import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../hooks/useChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

export default function Chat() {
  const { messages, loading, error, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div>
      <h1>Asistente Financiero IA</h1>
      <p>Pregúntame cualquier cosa sobre tus finanzas personales.</p>
      
      <Card style={{ height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((message, index) => (
            <ChatMessageItem key={index} message={message} user={user} />
          ))}
          {loading && messages[messages.length - 1]?.role === 'assistant' && (
            <div className="flex items-end gap-3">
              <Bot size={32} style={{ color: '#3b82f6' }} />
              <div style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                maxWidth: '70%' 
              }}>
                <div style={{ 
                  width: '1rem', 
                  height: '1rem', 
                  backgroundColor: '#d1d5db', 
                  borderRadius: '50%', 
                  animation: 'pulse 1.5s infinite' 
                }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
          {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center' }}>{error}</p>}
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre tus finanzas..."
              className="form-input"
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.75rem' }}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}

const ChatMessageItem = ({ message, user }: { message: ChatMessage; user: any }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser ? (
        <Bot size={32} style={{ color: '#3b82f6' }} />
      ) : (
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#e5e7eb',
          color: '#6b7280',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          {user?.email?.[0]?.toUpperCase() || <User size={20} />}
        </div>
      )}
      <div
        style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          maxWidth: '70%',
          backgroundColor: isUser ? '#3b82f6' : '#f3f4f6',
          color: isUser ? 'white' : '#1f2937'
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({node, ...props}) => <p style={{ margin: 0, lineHeight: 1.5 }} {...props} />
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};