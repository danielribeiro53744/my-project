import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../interfaces/user';
import { useCart } from './cart';  // Importa seu store do carrinho

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (formData: FormData) => Promise<User>;
  logout: () => Promise<void>;
  isAuth: () => Promise<{ isAuthenticated: boolean; user: User | null }>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
      
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
          }
      
          const data = await response.json();
      
          localStorage.setItem('userId', data.user.id);
      
          set({ user: data.user, token: data.token, isLoading: false });
      
          // Limpa o carrinho atual e popula com o carrinho do usuário vindo do backend
          const cartStore = useCart.getState();
          cartStore.clearCart();
          data.user.cart.forEach((item: any) => {
            cartStore.addItem(item.product, item.size, item.quantity);
          });
      
          // Atualiza localStorage com o carrinho do usuário
          localStorage.setItem('cart', JSON.stringify(data.user.cart));
      
          return data.user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (formData) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
          }

          const user = await response.json();

          set({ user, isLoading: false });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { user } = get();
        const { items, clearCart } = useCart.getState();
      
        if (user && items.length > 0) {
          try {
            await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                localCart: items,
              }),
            });
          } catch (error) {
            console.error('Failed to sync cart on logout:', error);
          }
        }
      
        clearCart();              // Limpa carrinho no Zustand
        localStorage.removeItem('cart');  // Limpa carrinho do localStorage
      
        set({ user: null, token: null });
      },

      isAuth: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, {
            credentials: 'include',
            cache: 'no-store',
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
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
export async function uploadImageToStorage(
  formData: FormData,
  maxFileSize: number = 4 * 1024 * 1024 // 4MB
): Promise<string | null> {
  try {
    const imageFile = formData.get('image') as File | null;

    if (!imageFile || imageFile.size === 0) {
      throw new Error('No image file provided or file is empty');
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error(`Invalid file type (${imageFile.type}). Allowed types: ${validTypes.join(', ')}`);
    }

    if (imageFile.size > maxFileSize) {
      throw new Error(`File too large (${(imageFile.size / 1024 / 1024).toFixed(2)}MB). Max size: ${(maxFileSize / 1024 / 1024)}MB`);
    }

    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${uploadResponse.status}`);
    }

    const { url } = await uploadResponse.json();
    return url;

  } catch (error) {
    console.error('Image upload error:', error instanceof Error ? error.message : error);
    return null;
  }
}