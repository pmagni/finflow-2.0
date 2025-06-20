import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import type { Debt, Budget } from '../types';
import { debtsApi } from '../services/api';

interface DebtState {
  debts: Debt[];
  loading: boolean;
  error: string | null;
  fetchDebts: () => Promise<void>;
  addDebt: (debt: Omit<Debt, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateDebt: (id: string, updates: Partial<Debt>) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;

  debtState: DebtState;

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
  },

  // Budgets state
  budgets: [],
  setBudgets: (budgets) => set({ budgets }),
  addBudget: (budget) => set((state) => ({ budgets: [...state.budgets, budget] })),
}));
