import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../objects/cart';
import { useAuth } from '@/lib/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  cart?: CartItem;
}

interface UserState {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addToCart: (userId: string, item: CartItem) => Promise<void>;
  removeFromCart: (userId: string, productId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  fetchAllUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      users: [],
      isLoading: false,
      error: null,
      
      fetchUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          
          const response = await fetch(`/api/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch user');
          }
          
          const user = await response.json();
          set({ currentUser: user, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      updateUser: async (userId, updates) => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuth.getState().token;
          if (!token) throw new Error('Not authenticated');
          
          const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${useAuth.getState().token}`
            },
            body: JSON.stringify(updates)
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
          }
          
          const updatedUser = await response.json();
          set((state) => ({
            currentUser: state.currentUser?.id === userId ? updatedUser : state.currentUser,
            users: state.users.map(user => user.id === userId ? updatedUser : user),
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      deleteUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuth.getState().token;
          if (!token) throw new Error('Not authenticated');
          
          const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete user');
          }
          
          set((state) => ({
            currentUser: state.currentUser?.id === userId ? null : state.currentUser,
            users: state.users.filter(user => user.id !== userId),
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      addToCart: async (userId, item) => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuth.getState().token;
          if (!token) throw new Error('Not authenticated');
          
          const response = await fetch(`/api/users/${userId}/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${useAuth.getState().token}`
            },
            body: JSON.stringify(item)
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add to cart');
          }
          
          const updatedUser = await response.json();
          set((state) => ({
            currentUser: state.currentUser?.id === userId ? updatedUser : state.currentUser,
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      removeFromCart: async (userId, productId) => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuth.getState().token;
          if (!token) throw new Error('Not authenticated');
          
          const response = await fetch(`/api/users/${userId}/cart/${productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to remove from cart');
          }
          
          const updatedUser = await response.json();
          set((state) => ({
            currentUser: state.currentUser?.id === userId ? updatedUser : state.currentUser,
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      clearCart: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuth.getState().token;
          if (!token) throw new Error('Not authenticated');
          
          const response = await fetch(`/api/users/${userId}/cart`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to clear cart');
          }
          
          const updatedUser = await response.json();
          set((state) => ({
            currentUser: state.currentUser?.id === userId ? updatedUser : state.currentUser,
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
      
      fetchAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/users', {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch users');
          }
          
          const users = await response.json();
          set({ users, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      }
    }),
    {
      name: 'user-storage'
    }
  )
);