import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './definitions';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  cart?: CartItem[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  isAuth: (isAuthenticated: boolean, user: User) => Promise<void>;
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
      },
      isAuth:  async () => {
        try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, {
          credentials: 'include', // Ensures cookies are sent
          cache: 'no-store', // Prevents caching of auth state
        });
  
        if (!response.ok) {
          throw new Error('Failed to check authentication');
        }
    
        return response.json();
      } catch (error) {
        console.error('Authentication check failed:', error);
        return {
          isAuthenticated: false,
          user: null,
        };
      }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);