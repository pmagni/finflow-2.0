import { useState } from 'react';
import { useStore } from '../store/useStore';
import { aiApi } from '../services/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current financial data from our Zustand store
  const { debts } = useStore(state => state.debtState);
  // In a real app, you would get budget and goals here as well
  // const { budget } = useStore(state => state.budgetState); 

  const sendMessage = async (message: string) => {
    setError(null);
    const newMessage: ChatMessage = { role: 'user', content: message };
    // Add user message and a placeholder for the assistant's response
    setMessages((prev) => [...prev, newMessage, { role: 'assistant', content: '' }]);
    setLoading(true);

    try {
      const userContext = {
        question: message,
        financials: {
          debts: debts.map(d => ({ name: d.name, balance: d.balance, interest_rate: d.interest_rate })),
          // budget,
        },
      };
      
      const response = await aiApi.getAdvise(userContext);
      
      if (!response.data || !response.data.body) {
        throw new Error('No response body from AI');
      }

      const reader = response.data.body.getReader();
      const decoder = new TextDecoder();
      
      reader.read().then(function processText({ done, value }: { done: boolean, value: Uint8Array }): any {
        if (done) {
          setLoading(false);
          return;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          const updatedLastMessage = { ...lastMessage, content: lastMessage.content + chunk };
          return [...prev.slice(0, -1), updatedLastMessage];
        });

        return reader.read().then(processText);
      });

    } catch (err: any) {
      const errorMessage = 'Sorry, I am having trouble connecting. Please try again later.';
      setError(errorMessage);
       setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          const updatedLastMessage = { ...lastMessage, content: errorMessage };
          return [...prev.slice(0, -1), updatedLastMessage];
        });
      setLoading(false);
    }
  };

  return { messages, loading, error, sendMessage };
}; 