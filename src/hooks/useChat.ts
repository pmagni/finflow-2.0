import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { aiApi, budgetsApi, aiChatHistoryApi } from '../services/api';
import type { ChatMessageRow } from '../services/api/aiChatHistory';
import { getCurrentMonthKey } from '../utils/monthKey';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await aiChatHistoryApi.getLatest();
      if (cancelled || !data?.messages) {
        setHistoryLoaded(true);
        return;
      }
      const raw = data.messages;
      if (Array.isArray(raw)) {
        const restored = raw
          .filter(
            (m: unknown): m is ChatMessage =>
              typeof m === 'object' &&
              m !== null &&
              'role' in m &&
              'content' in m &&
              ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant') &&
              typeof (m as ChatMessage).content === 'string',
          )
          .map((m) => ({ role: m.role, content: m.content }));
        if (restored.length > 0) setMessages(restored);
      }
      setHistoryLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistMessages = useCallback((next: ChatMessage[]) => {
    const rows: ChatMessageRow[] = next.filter(
      (m) => m.role === 'user' || (m.role === 'assistant' && m.content.trim().length > 0),
    );
    void aiChatHistoryApi.saveMessages(rows);
  }, []);

  const sendMessage = async (message: string) => {
    setError(null);
    const newMessage: ChatMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, newMessage, { role: 'assistant', content: '' }]);
    setLoading(true);

    try {
      const store = useStore.getState();
      const debts = store.debtState.debts;
      const goals = store.savingsGoalState.goals;
      const month = getCurrentMonthKey();
      const { data: budget } = await budgetsApi.getBudget(month);

      const userContext = {
        question: message,
        financials: {
          debts: debts.map((d) => ({
            name: d.name,
            balance: d.balance,
            interest_rate: d.interest_rate,
            minimum_payment: d.minimum_payment,
            institution: d.institution,
          })),
          savings_goals: goals.map((g) => ({
            name: g.name,
            target_amount: g.target_amount,
            current_amount: g.current_amount,
          })),
          budget_month: month,
          budget: budget
            ? {
                income: budget.income,
                fixed_expenses: budget.fixed_expenses,
                variable_expenses: budget.variable_expenses,
                savings_goal: budget.savings_goal,
                debt_payment_allocation: budget.debt_payment_allocation,
                leisure_allocation: budget.leisure_allocation,
                discretionary_spend: budget.discretionary_spend,
              }
            : null,
        },
      };

      const response = await aiApi.getAdvise(userContext);

      if (!response.data || !response.data.body) {
        throw new Error('No response body from AI');
      }

      const reader = response.data.body.getReader();
      const decoder = new TextDecoder();

      const processText = ({
        done,
        value,
      }: {
        done: boolean;
        value?: Uint8Array;
      }): Promise<void> => {
        if (done) {
          setLoading(false);
          setMessages((prev) => {
            persistMessages(prev);
            return prev;
          });
          return Promise.resolve();
        }

        const chunk = decoder.decode(value!, { stream: true });
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          const updatedLastMessage = {
            ...lastMessage,
            content: lastMessage.content + chunk,
          };
          return [...prev.slice(0, -1), updatedLastMessage];
        });

        return reader.read().then(processText);
      };

      await reader.read().then(processText);
    } catch {
      const errorMessage =
        'No pudimos conectar con el asistente. Intenta de nuevo en un momento.';
      setError(errorMessage);
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        const updatedLastMessage = { ...lastMessage, content: errorMessage };
        return [...prev.slice(0, -1), updatedLastMessage];
      });
      setLoading(false);
    }
  };

  return { messages, loading, error, sendMessage, historyLoaded };
};
