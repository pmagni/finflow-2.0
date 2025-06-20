import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import type { Debt, Budget, SavingsGoal, Achievement, FinancialHealthScore } from '../types';
import { debtsApi, savingsGoalsApi, gamificationApi } from '../services/api';

interface DebtState {
  debts: Debt[];
  loading: boolean;
  error: string | null;
  fetchDebts: () => Promise<void>;
  addDebt: (debt: Omit<Debt, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateDebt: (id: string, updates: Partial<Debt>) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  addFunds: (id: string, amount: number) => Promise<void>;
}

interface SavingsGoalState {
  goals: SavingsGoal[];
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'current_amount'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addFunds: (id: string, amount: number) => Promise<void>;
}

interface GamificationState {
  achievements: Achievement[];
  score: FinancialHealthScore | null;
  loading: boolean;
  error: string | null;
  fetchGamificationData: () => Promise<void>;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;

  debtState: DebtState;
  savingsGoalState: SavingsGoalState;
  gamificationState: GamificationState;

  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),

  // Debts state & actions
  debtState: {
    debts: [],
    loading: false,
    error: null,
    fetchDebts: async () => {
      set(state => ({ debtState: { ...state.debtState, loading: true, error: null } }));
      const { data, error } = await debtsApi.getDebts();
      set(state => ({
        debtState: {
          ...state.debtState,
          debts: data || [],
          loading: false,
          error: error,
        },
      }));
    },
    addDebt: async (newDebt) => {
      set(state => ({ debtState: { ...state.debtState, loading: true } }));
      const { data, error } = await debtsApi.createDebt(newDebt);
      if (data) {
        set(state => ({
          debtState: {
            ...state.debtState,
            debts: [...state.debtState.debts, data],
            loading: false,
          },
        }));
      } else {
        set(state => ({ debtState: { ...state.debtState, error: error, loading: false } }));
      }
    },
    updateDebt: async (id, updates) => {
        set(state => ({ debtState: { ...state.debtState, loading: true } }));
        const { data, error } = await debtsApi.updateDebt(id, updates);
        if (data) {
            set(state => ({
                debtState: {
                    ...state.debtState,
                    debts: state.debtState.debts.map(d => d.id === id ? data : d),
                    loading: false,
                },
            }));
        } else {
            set(state => ({ debtState: { ...state.debtState, error: error, loading: false } }));
        }
    },
    deleteDebt: async (id: string) => {
      set(state => ({ debtState: { ...state.debtState, loading: true } }));
      const { error } = await debtsApi.deleteDebt(id);
      if (!error) {
        set(state => ({
          debtState: {
            ...state.debtState,
            debts: state.debtState.debts.filter(d => d.id !== id),
            loading: false,
          },
        }));
      } else {
        set(state => ({ debtState: { ...state.debtState, error: error, loading: false } }));
      }
    },
    addFunds: async (id, amount) => {
      const goal = get().savingsGoalState.goals.find(g => g.id === id);
      if (!goal) return;
      
      const newCurrentAmount = (goal.current_amount || 0) + amount;
      await get().savingsGoalState.updateGoal(id, { current_amount: newCurrentAmount });
    },
  },

  // Savings Goals state & actions
  savingsGoalState: {
    goals: [],
    loading: false,
    error: null,
    fetchGoals: async () => {
      set(state => ({ savingsGoalState: { ...state.savingsGoalState, loading: true, error: null } }));
      const { data, error } = await savingsGoalsApi.getSavingsGoals();
      set(state => ({
        savingsGoalState: {
          ...state.savingsGoalState,
          goals: data || [],
          loading: false,
          error: error,
        },
      }));
    },
    addGoal: async (newGoal) => {
      set(state => ({ savingsGoalState: { ...state.savingsGoalState, loading: true } }));
      const { data, error } = await savingsGoalsApi.createSavingsGoal(newGoal);
      if (data) {
        set(state => ({
          savingsGoalState: {
            ...state.savingsGoalState,
            goals: [...state.savingsGoalState.goals, data],
            loading: false,
          },
        }));
      } else {
        set(state => ({ savingsGoalState: { ...state.savingsGoalState, error: error, loading: false } }));
      }
    },
    updateGoal: async (id, updates) => {
      set(state => ({ savingsGoalState: { ...state.savingsGoalState, loading: true } }));
      const { data, error } = await savingsGoalsApi.updateSavingsGoal(id, updates);
      if (data) {
        set(state => ({
          savingsGoalState: {
            ...state.savingsGoalState,
            goals: state.savingsGoalState.goals.map(g => g.id === id ? data : g),
            loading: false,
          },
        }));
      } else {
        set(state => ({ savingsGoalState: { ...state.savingsGoalState, error: error, loading: false } }));
      }
    },
    deleteGoal: async (id) => {
      set(state => ({ savingsGoalState: { ...state.savingsGoalState, loading: true } }));
      const { error } = await savingsGoalsApi.deleteSavingsGoal(id);
      if (!error) {
        set(state => ({
          savingsGoalState: {
            ...state.savingsGoalState,
            goals: state.savingsGoalState.goals.filter(g => g.id !== id),
            loading: false,
          },
        }));
      } else {
        set(state => ({ savingsGoalState: { ...state.savingsGoalState, error: error, loading: false } }));
      }
    },
    addFunds: async (id, amount) => {
      const goal = get().savingsGoalState.goals.find(g => g.id === id);
      if (!goal) return;
      
      const newCurrentAmount = (goal.current_amount || 0) + amount;
      await get().savingsGoalState.updateGoal(id, { current_amount: newCurrentAmount });
    },
  },

  // Gamification state & actions
  gamificationState: {
    achievements: [],
    score: null,
    loading: false,
    error: null,
    fetchGamificationData: async () => {
      set(state => ({ gamificationState: { ...state.gamificationState, loading: true, error: null } }));
      try {
        const [achievementsRes, scoreRes] = await Promise.all([
          gamificationApi.getAchievements(),
          gamificationApi.getFinancialHealthScore(),
        ]);

        if (achievementsRes.error || scoreRes.error) {
          throw new Error(achievementsRes.error || scoreRes.error || 'Failed to fetch gamification data');
        }

        set(state => ({
          gamificationState: {
            ...state.gamificationState,
            achievements: achievementsRes.data || [],
            score: scoreRes.data || null,
            loading: false,
          },
        }));
      } catch (e: any) {
        set(state => ({ gamificationState: { ...state.gamificationState, error: e.message, loading: false } }));
      }
    },
  },

  // Budgets state
  budgets: [],
  setBudgets: (budgets) => set({ budgets }),
  addBudget: (budget) => set((state) => ({ budgets: [...state.budgets, budget] })),
}));
