"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import React, { useEffect, useState } from "react";
import emailjs from '@emailjs/browser';
import { useTheme } from "next-themes"; // optional if you're using next-themes

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleButtonProps {
  action: "login" | "register";
}

const GoogleButton = ({ action }: GoogleButtonProps) => {
  const { register, login, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const googleButtonRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme(); // optional, based on your setup

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
    const userData = {
      name: payload.name || "",
      email: payload.email || "",
      password: 'GoogleOAuthUser123!',
      confirmPassword: 'GoogleOAuthUser123!',
    };

    try {
      if (action === 'login') {
        await login(userData.email, userData.password)
      } else {
        await register(userData.name, userData.email, userData.password, 'user')
      }
      router.push("/shop")
    } catch (error) {
      toast({
        title: "Registration failed",
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
