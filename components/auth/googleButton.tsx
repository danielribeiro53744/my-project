"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import emailjs from '@emailjs/browser';
import { useTheme } from "next-themes"; // optional if you're using next-themes
import { RedirectBasedOnRole } from '@/lib/redirect';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleButtonProps {
  action: "login" | "register";
}

const GoogleButton = ({ action }: GoogleButtonProps) => {
  const { user, register, login, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const googleButtonRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme(); // optional, based on your setup
  if(user){
    // Redirect based on role after login
      const redirectPath = user.role === "admin" ? "/admin" : "/shop";
      setTimeout(() => {
        router.push(redirectPath);
      }, 1500);
  }
  useEffect(() => {
    const initializeGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: '634344683916-1i9eoe73so2uqacv0bt9go2mj63evmil.apps.googleusercontent.com',
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: theme === "dark" ? "filled_black" : "outline", // adjust based on theme
        size: "large",
        width: 250,
      });
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleButton;
    document.body.appendChild(script);
  }, [theme]);

  const decodeJwtPayload = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload);
  };

 const handleGoogleResponse = async (response: any) => {
  const token = response.credential;
  const payload = decodeJwtPayload(token);
  
  try {
    if (action === 'login') {
      // For login, we still use email/password
      await login(payload.email, 'GoogleOAuthUser123!');
      toast({
        title: "Login successful",
        description: "Redirecting you to your dashboard...",
      })
    } else {
      // For registration, we'll create FormData
      const formData = new FormData();
      formData.append('name', payload.name || "");
      formData.append('email', payload.email || "");
      formData.append('password', 'GoogleOAuthUser123!');
      // If Google provides a picture, we can fetch it and add to FormData
      if (payload.picture) {
        try {
          formData.append('image', payload.picture);
        } catch (error) {
          console.error('Failed to fetch Google profile image:', error);
          // Continue without image if there's an error
        }
      }
      const user = await register(formData);
      toast({
        title: "Register successful",
        description: "Redirecting you to your dashboard...",
      })
      // Redirect based on role after login
      const redirectPath = user.role === "admin" ? "/admin" : "/shop";
      setTimeout(() => {
        router.push(redirectPath);
      }, 1500);
      // RedirectBasedOnRole(user);
    }
    // RedirectBasedOnRole(user);

    
  } catch (error) {
    toast({
      title: action === 'login' ? "Login failed" : "Registration failed",
      description: error instanceof Error ? error.message : "Please try again",
      variant: "destructive"
    });
  }
};

  return (
    <div className="w-full flex justify-center">
      <div
        ref={googleButtonRef}
        className="flex justify-center items-center"
      ></div>
    </div>
  );
};

export default GoogleButton;
