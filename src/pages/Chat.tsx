import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../hooks/useChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { messages, loading, error, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth(); // To display user avatar/initials

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
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <ChatMessageItem key={index} message={message} user={user} />
        ))}
        {loading && messages[messages.length - 1]?.role === 'assistant' && (
          <div className="flex justify-start items-end gap-3">
            <Bot className="w-8 h-8 text-indigo-500" />
            <div className="bg-gray-100 p-4 rounded-lg max-w-2xl animate-pulse">
              <span className="w-4 h-4 bg-gray-300 rounded-full inline-block"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your financial question..."
            className="flex-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-indigo-600 text-white rounded-lg shadow disabled:bg-indigo-300 hover:bg-indigo-700 transition"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}

const ChatMessageItem = ({ message, user }: { message: ChatMessage; user: any }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <Bot className="w-8 h-8 text-indigo-500 flex-shrink-0" />}
      <div
        className={`p-4 rounded-lg max-w-2xl ${
          isUser
            ? 'bg-indigo-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({node, ...props}) => <p className="prose prose-sm max-w-none" {...props} />
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
          {user?.email?.[0]?.toUpperCase() || <User size={20} />}
        </div>
      )}
    </div>
  );
};
