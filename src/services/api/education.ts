import { supabase } from '../supabase';
import type { EducationModule, UserEducationProgress } from '../../types';

export const educationApi = {
  async listModules(): Promise<{ data: EducationModule[] | null; error: string | null }> {
    const { data, error } = await supabase
      .from('education_modules')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('title', { ascending: true });

    return { data, error: error?.message || null };
  },

  async getModule(id: string): Promise<{ data: EducationModule | null; error: string | null }> {
    const { data, error } = await supabase
      .from('education_modules')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    return { data, error: error?.message || null };
  },

  async getMyProgress(): Promise<{ data: UserEducationProgress[] | null; error: string | null }> {
    const { data, error } = await supabase.from('user_education_progress').select('*');

    return { data, error: error?.message || null };
  },

  async upsertProgress(
    moduleId: string,
    patch: { completed?: boolean; progress_percentage?: number; completed_at?: string | null },
  ): Promise<{ data: UserEducationProgress | null; error: string | null }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data: existing } = await supabase
      .from('user_education_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('user_education_progress')
        .update({
          ...patch,
          completed_at: patch.completed
            ? new Date().toISOString()
            : existing.completed_at,
        })
        .eq('id', existing.id)
        .select()
        .single();
      return { data, error: error?.message || null };
    }

    const { data, error } = await supabase
      .from('user_education_progress')
      .insert({
        user_id: user.id,
        module_id: moduleId,
        completed: patch.completed ?? false,
        progress_percentage: patch.progress_percentage ?? 0,
        completed_at: patch.completed ? new Date().toISOString() : null,
      })
      .select()
      .single();

    return { data, error: error?.message || null };
  },
};
