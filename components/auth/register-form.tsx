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
import GoogleButton from "./googleButton"
import { sendEmail } from "@/lib/mail"

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
  image: z.any().refine(file => file?.length === 1, {
    message: "Please upload an image",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

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
      image: undefined,
    },    
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await register(values.name, values.email, values.password, 'user')
      toast({
        title: "Account created",
        description: "You have successfully registered an account.",
      })
      

      const response = await fetch('/api/email',);
      const { isValide } = await response.json();
      if(isValide){
        sendEmail('Teste','danniribeiro01@gmail.com','Este é o texto')
      }
        
      // Redirect based on role
      // if (values.role === "admin") {
      //   router.push("/admin")
      // } else {
      //   router.push("/shop")
      // }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    }
  }

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   try {
  //     const imageFile = values.image[0]; // First file
  //     const formData = new FormData();
  //     formData.append("image", imageFile);
  //     formData.append("name", values.name);
  //     formData.append("email", values.email);
  //     formData.append("password", values.password);
  
  //     // Call your register function with image if applicable
  //     await register(values.name, values.email, values.password, "user"); // use "user" or modify as needed
  
  //     toast({
  //       title: "Account created",
  //       description: "You have successfully registered an account.",
  //     });
  
  //     const response = await fetch('/api/email');
  //     const { isValide } = await response.json();
  //     if (isValide) {
  //       sendEmail('Teste', 'danniribeiro01@gmail.com', 'Este é o texto');
  //     }
  
  //     router.push("/shop");
  //   } catch (error) {
  //     toast({
  //       title: "Registration failed",
  //       description: error instanceof Error ? error.message : "Please try again",
  //       variant: "destructive",
  //     });
  //   }
  // }
  

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-1 block text-sm font-medium ">Full Name</FormLabel>
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
                <FormLabel className="mb-1 block text-sm font-medium ">Email</FormLabel>
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
                <FormLabel className="mb-1 block text-sm font-medium ">Password</FormLabel>
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
                <FormLabel className="mb-1 block text-sm font-medium ">Confirm Password</FormLabel>
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
            name="image"
            render={({ field }) => {
              const file = field.value?.[0];

              return (
                <FormItem>
                  <FormLabel className="mb-1 block text-sm font-medium">
                    Profile Image
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "relative group flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-4 transition-colors hover:border-gray-500",
                        isLoading && "opacity-60 pointer-events-none"
                      )}
                    >
                      {file ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="h-24 w-24 object-cover rounded-full shadow-md"
                          />
                          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-sm">Change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <svg
                            className="w-8 h-8 mb-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 16l-4-4m0 0l4-4m-4 4h18"
                            />
                          </svg>
                          <span className="text-sm">Drag and drop or click to upload</span>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files)}
                        disabled={isLoading}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />



          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleButton action="register"/>
    </div>
  )
}