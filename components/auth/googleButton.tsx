"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

import React, { useEffect, useState } from "react";
import emailjs from '@emailjs/browser';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleButtonProps {
    action: "login" | "register";
  }

const sendEmail = () => {
    
    emailjs.send(process.env.EMAILJS_SERVICE_ID || '', process.env.EMAILJS_TEMPLATE_ID || '', 
        {
        subject: 'John Doe',
        to: 'john@example.com',
        text: 'Welcome to our app!'
        }
        , process.env.EMAILJS_PUBLIC_KEY || '')
        .then((result) => {
            console.log(result)
        }, (error) => {
            console.log(error.text);
        });
};


const GoogleButton= ({ action }: GoogleButtonProps) =>{
    const { register, login, isLoading } = useAuth()
    const { toast } = useToast()
    const [clientId, setClientId] = useState('');
    const router = useRouter()
    // const { login, isLoading } = useAuth()
    const googleButtonRef = React.useRef<HTMLDivElement>(null);
      
        React.useEffect(() => {
          const initializeGoogleButton = async () => {
            if (!window.google || !googleButtonRef.current) return;
            // console.log(process.env.GOOGLE_CLIENT_ID)
            
            // const result = await fetch('/api/client-google-id')
            //       .then(res => res.json())
            //       .then(data => setClientId(data.clientId))
            // console.log(result)
            window.google.accounts.id.initialize({
              client_id: '634344683916-1i9eoe73so2uqacv0bt9go2mj63evmil.apps.googleusercontent.com' ,
              callback: handleGoogleResponse,
            });
      
            window.google.accounts.id.renderButton(googleButtonRef.current, {
              theme: "outline",
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
        }, []);
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
            name: payload.name || "",                // Full name from Google
            email: payload.email || "",              // Email from Google
            password: 'GoogleOAuthUser123!',         // Placeholder password (you can auto-generate or skip password logic)
            confirmPassword: 'GoogleOAuthUser123!',  // Match password
          };
    
          console.log("Auto-filled user data:", userData);
    
          try {
            if (action === 'login') {
                await login(userData.email, userData.password)
            } else {
                await register(userData.name, userData.email, userData.password, 'user')
            }
            // toast({
            //   title: "Account created",
            //   description: "You have successfully registered an account.",
            // })
            
            //   sendEmail()

            // Redirect based on role
            router.push("/shop")
    
          } catch (error) {
            toast({
              title: "Registration failed",
              description: error instanceof Error ? error.message : "Please try again",
              variant: "destructive"
            })
          }
        };
    return(
        <div>
            {/* Google Login Button Section */}
            <Button variant="outline" disabled={isLoading} className="relative flex items-center justify-center w-full h-10">
                <div
                    ref={googleButtonRef}
                    className="absolute inset-0 opacity-0"
                    > 
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.559 3.921 1.488l2.814-2.814c-1.801-1.677-4.206-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426.047z" />
                </svg>
                Google
            </Button>
        </div>
    )
}

export default GoogleButton