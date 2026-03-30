import { supabase } from '../supabase';
import type { AIChatHistory } from '../../types';

export type ChatMessageRow = { role: 'user' | 'assistant'; content: string };

export const aiChatHistoryApi = {
  async getLatest(): Promise<{ data: AIChatHistory | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error: error?.message || null };
  },

  async saveMessages(messages: ChatMessageRow[]): Promise<{ error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'User not authenticated' };

    const clean = messages.filter(
      (m) => m.content.trim().length > 0 || m.role === 'user',
    );

    const { data: existing } = await supabase
      .from('ai_chat_history')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from('ai_chat_history')
        .update({ messages: clean })
        .eq('id', existing.id);
      return { error: error?.message || null };
    }

    const { error } = await supabase
      .from('ai_chat_history')
      .insert({ user_id: user.id, messages: clean });

    return { error: error?.message || null };
  },
};
