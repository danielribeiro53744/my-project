"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import emailjs from '@emailjs/browser';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  confirmPassword: z.string(),
  role: z.enum(["user", "admin"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

declare global {
  interface Window {
    google: any;
  }
}

export default function RegisterForm({ className, ...props }: RegisterFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { register, isLoading } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  })
  const sendEmail = () => {
    emailjs.send('service_bscwi4s', 'template_s34rwdj', 
      {
        subject: 'John Doe',
        to: 'john@example.com',
        text: 'Welcome to our app!'
      }
      , 'whWmKQtWdSto4tUqi')
        .then((result) => {
          console.log(result)
        }, (error) => {
            console.log(error.text);
        });
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await register(values.name, values.email, values.password, values.role)
      toast({
        title: "Account created",
        description: "You have successfully registered an account.",
      })
      
        // sendEmail()
      // Redirect based on role
      if (values.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/shop")
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    }
  }
  //////////////////////GOOGLE//////////////////////
    const googleButtonRef = React.useRef<HTMLDivElement>(null);
  
    React.useEffect(() => {
      const initializeGoogleButton = () => {
        if (!window.google || !googleButtonRef.current) return;
  
        window.google.accounts.id.initialize({
          client_id: "634344683916-1i9eoe73so2uqacv0bt9go2mj63evmil.apps.googleusercontent.com",
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
        password: "GoogleOAuthUser123!",         // Placeholder password (you can auto-generate or skip password logic)
        confirmPassword: "GoogleOAuthUser123!",  // Match password
      };

      console.log("Auto-filled user data:", userData);

      try {
        const result = await register(userData.name, userData.email, userData.password, 'user')
        toast({
          title: "Account created",
          description: "You have successfully registered an account.",
        })
        
          // sendEmail()
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

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="example@example.com" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                    disabled={isLoading}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="user" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Customer</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="admin" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Admin</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
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