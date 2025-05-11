// lib/redirect.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from './interfaces/user';

export const RedirectBasedOnRole = (user: User | null) => {
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const redirectPath = user.role === "admin" ? "/admin" : "/shop";
      router.push(redirectPath);
    }
  }, [user, router]);

  return null; // This component doesn’t need to render anything
};
