import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../interfaces/user';



interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: FormData) => Promise<User>;
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
      
      register: async (formData) => {
        set({ isLoading: true });
        try {
          
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: formData, // Send FormData directly (no Content-Type header)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
          }

          const user = await response.json();

          // Automatically login after registration
          set({ user, isLoading: false });
          return user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
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
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export async function uploadImageToStorage(
  formData: FormData,
  maxFileSize: number = 4 * 1024 * 1024 // Default 4MB limit
): Promise<string | null> {
  try {
    // 1. Validate the form data contains an image file
    const imageFile = formData.get('image') as File | null;
    
    if (!imageFile || imageFile.size === 0) {
      throw new Error('No image file provided or file is empty');
    }

    // 2. Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(imageFile.type)) {
      throw new Error(`Invalid file type (${imageFile.type}). Allowed types: ${validTypes.join(', ')}`);
    }

    if (imageFile.size > maxFileSize) {
      throw new Error(`File too large (${(imageFile.size / 1024 / 1024).toFixed(2)}MB). Max size: ${maxFileSize / 1024 / 1024}MB`);
    }

    // 3. Upload to Vercel Blob
    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header - browser will set it with boundary
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