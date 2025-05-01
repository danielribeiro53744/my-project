import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
          }
          
          const data = await response.json();
          set({ user: data.user, token: data.token, isLoading: false });
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (name, email, password, role) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
          }
          
          const user = await response.json();
          set({ isLoading: false });
          
          // Login after successful registration
          // await useAuth.getState().login(email, password);
          
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, token: null });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);