// utils/auth.ts
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  }
  
  export async function checkAuth(): Promise<{
    isAuthenticated: boolean;
    user: User | null;
  }> {
    try {
        console.log('useSession')
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, {
        credentials: 'include', // Ensures cookies are sent
        cache: 'no-store', // Prevents caching of auth state
      });

      if (!response.ok) {
        throw new Error('Failed to check authentication');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Authentication check failed:', error);
      return {
        isAuthenticated: false,
        user: null,
      };
    }
  }