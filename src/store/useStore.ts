import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import type { Debt, Budget, SavingsGoal, Achievement, FinancialHealthScore } from '../types';
import { debtsApi, savingsGoalsApi, gamificationApi } from '../services/api';
import { produce } from 'immer';

interface DebtState {
  debts: Debt[];
  loading: boolean;
  error: string | null;
  actions: {
    fetchDebts: () => Promise<void>;
    addDebt: (debt: Omit<Debt, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
    updateDebt: (id: string, updates: Partial<Debt>) => Promise<void>;
    deleteDebt: (id: string) => Promise<void>;
    addFunds: (id: string, amount: number) => Promise<void>;
  }
}

interface SavingsGoalState {
  goals: SavingsGoal[];
  loading: boolean;
  error: string | null;
  actions: {
    fetchGoals: () => Promise<void>;
    addGoal: (goal: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'current_amount'>) => Promise<void>;
    updateGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    addFunds: (id: string, amount: number) => Promise<void>;
  }
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
    actions: {
      fetchDebts: async () => {
        set(produce((state: AppState) => { state.debtState.loading = true; state.debtState.error = null; }));
        const { data, error } = await debtsApi.getDebts();
        set(produce((state: AppState) => {
          state.debtState.debts = data || [];
          state.debtState.loading = false;
          state.debtState.error = error;
        }));
      },
      addDebt: async (newDebt) => {
        set(produce((state: AppState) => { state.debtState.loading = true; }));
        const { data, error } = await debtsApi.createDebt(newDebt);
        set(produce((state: AppState) => {
          if (data) {
            state.debtState.debts.push(data);
          }
          state.debtState.error = error;
          state.debtState.loading = false;
        }));
      },
      updateDebt: async (id, updates) => {
        set(produce((state: AppState) => { state.debtState.loading = true; }));
        const { data, error } = await debtsApi.updateDebt(id, updates);
        set(produce((state: AppState) => {
          if (data) {
            const index = state.debtState.debts.findIndex((d: Debt) => d.id === id);
            if (index !== -1) state.debtState.debts[index] = data;
          }
          state.debtState.error = error;
          state.debtState.loading = false;
        }));
      },
      deleteDebt: async (id: string) => {
        set(produce((state: AppState) => { state.debtState.loading = true; }));
        const { error } = await debtsApi.deleteDebt(id);
        set(produce((state: AppState) => {
          if (!error) {
            state.debtState.debts = state.debtState.debts.filter((d: Debt) => d.id !== id);
          }
          state.debtState.error = error;
          state.debtState.loading = false;
        }));
      },
      addFunds: async (id, amount) => {
        const goal = get().savingsGoalState.goals.find(g => g.id === id);
        if (!goal) return;
        
        const newCurrentAmount = (goal.current_amount || 0) + amount;
        await get().savingsGoalState.actions.updateGoal(id, { current_amount: newCurrentAmount });
      },
    }
  },

  // Savings Goals state & actions
  savingsGoalState: {
    goals: [],
    loading: false,
    error: null,
    actions: {
      fetchGoals: async () => {
        set(produce((state: AppState) => { state.savingsGoalState.loading = true; state.savingsGoalState.error = null; }));
        const { data, error } = await savingsGoalsApi.getSavingsGoals();
        set(produce((state: AppState) => {
          state.savingsGoalState.goals = data || [];
          state.savingsGoalState.loading = false;
          state.savingsGoalState.error = error;
        }));
      },
      addGoal: async (newGoal) => {
        set(produce((state: AppState) => { state.savingsGoalState.loading = true; }));
        const { data, error } = await savingsGoalsApi.createSavingsGoal(newGoal);
        set(produce((state: AppState) => {
          if (data) {
            state.savingsGoalState.goals.push(data);
          }
          state.savingsGoalState.error = error;
          state.savingsGoalState.loading = false;
        }));
      },
      updateGoal: async (id, updates) => {
        set(produce((state: AppState) => { state.savingsGoalState.loading = true; }));
        const { data, error } = await savingsGoalsApi.updateSavingsGoal(id, updates);
        set(produce((state: AppState) => {
          if (data) {
            const index = state.savingsGoalState.goals.findIndex((g: SavingsGoal) => g.id === id);
            if (index !== -1) state.savingsGoalState.goals[index] = data;
          }
          state.savingsGoalState.error = error;
          state.savingsGoalState.loading = false;
        }));
      },
      deleteGoal: async (id) => {
        set(produce((state: AppState) => { state.savingsGoalState.loading = true; }));
        const { error } = await savingsGoalsApi.deleteSavingsGoal(id);
        set(produce((state: AppState) => {
          if (!error) {
            state.savingsGoalState.goals = state.savingsGoalState.goals.filter((g: SavingsGoal) => g.id !== id);
          }
          state.savingsGoalState.error = error;
          state.savingsGoalState.loading = false;
        }));
      },
      addFunds: async (id, amount) => {
        const goal = get().savingsGoalState.goals.find(g => g.id === id);
        if (!goal) return;
        
        const newCurrentAmount = (goal.current_amount || 0) + amount;
        await get().savingsGoalState.actions.updateGoal(id, { current_amount: newCurrentAmount });
      },
    }
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
