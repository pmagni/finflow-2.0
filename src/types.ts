// Based on supabase/schema.sql

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Organization = {
  id: string;
  name: string;
  created_at: string;
};

export type OrganizationMembership = {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'admin' | 'member';
  created_at: string;
};

export type Debt = {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  interest_rate?: number;
  minimum_payment?: number;
  created_at: string;
};

export type DebtPlan = {
  id: string;
  user_id: string;
  name: string;
  monthly_income: number;
  budget_percentage: number;
  payment_strategy: 'avalanche' | 'snowball';
  is_active: boolean;
  created_at: string;
};

export type SavingsGoal = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  created_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  month: string;
  income: number;
  fixed_expenses: number;
  variable_expenses: number;
  savings_goal: number;
  discretionary_spend: number;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  description?: string;
  transaction_date: string;
  type: 'income' | 'expense';
  created_at: string;
};

export type BudgetSnapshot = {
  id: string;
  user_id: string;
  month_year: string;
  snapshot_data: any;
  total_income: number;
  total_expenses: number;
  total_savings: number;
  created_at: string;
};

export type EducationModule = {
  id: string;
  title: string;
  description?: string;
  content: any;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimated_duration_minutes: number;
  is_active: boolean;
  created_at: string;
};

export type UserEducationProgress = {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  completed_at?: string;
  progress_percentage: number;
  created_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  achieved_at: string;
};

export type GamificationEvent = {
  id: string;
  user_id: string;
  event_type: string;
  points_earned: number;
  metadata?: any;
  created_at: string;
};

export type FinancialHealthScore = {
  id: string;
  user_id: string;
  score: number;
  calculated_at: string;
};

export type UserPreferences = {
  id: string;
  user_id: string;
  currency: string;
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  created_at: string;
  updated_at: string;
};

export type AIChatHistory = {
  id: string;
  user_id: string;
  messages: any;
  created_at: string;
};

// API Response types
export type ApiResponse<T> = {
  data: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}; 