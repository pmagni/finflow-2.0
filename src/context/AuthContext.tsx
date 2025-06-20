import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { UserPreferences } from '../types';
import { authApi } from '../services/api/auth';
import { usersApi } from '../services/api/users';

type AppRole = 'admin' | 'moderator' | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: AppRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  userPreferences: UserPreferences | null;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  userRole: null,
  signIn: async () => ({ error: 'Context not initialized' }),
  signUp: async () => ({ error: 'Context not initialized' }),
  signOut: async () => {},
  resetPassword: async () => ({ error: 'Context not initialized' }),
  userPreferences: null,
  updatePreferences: async () => ({ error: 'Context not initialized' }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [userRole, setUserRole] = useState<AppRole>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setUserPreferences(null);
      setUserRole(null);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const { data, error } = await supabase.rpc('get_user_data');

    if (error) {
      console.error('Error loading user data:', error);
      return;
    }

    if (data && data.length > 0) {
      const userData = data[0];
      setUserRole(userData.user_role);
      
      if (userData.preferences) {
        setUserPreferences(userData.preferences);
      } else {
        // Create default preferences if none exist
        const defaultPreferences: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'> = {
          user_id: user.id,
          currency: 'USD',
          language: 'es',
          notifications_enabled: true,
          email_notifications: true,
          push_notifications: true,
          theme: 'auto',
        };

        const { data: newPrefs, error: createError } = await supabase
          .from('user_preferences')
          .insert(defaultPreferences)
          .select()
          .single();

        if (!createError && newPrefs) {
          setUserPreferences(newPrefs);
        }
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await authApi.login(email, password);
    return { error: error || undefined };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await authApi.register(name, email, password);
    return { error: error || undefined };
  };

  const signOut = async () => {
    await authApi.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error?.message };
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return { error: 'No user logged in' };

    const { data, error } = await usersApi.updateMyProfile(preferences);

    if (!error && data) {
      setUserPreferences(data);
    }

    return { error: error || undefined };
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
    userPreferences,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 