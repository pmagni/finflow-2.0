import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Placeholder for the AI chat message type
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!user) return;

    const newMessage: ChatMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      // This is where you would call your n8n webhook
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          message,
        }),
      });

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply, // Assuming the webhook returns a 'reply' field
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage };
}; 