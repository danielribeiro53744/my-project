"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { uploadImageToStorage, useAuth } from "@/lib/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import GoogleButton from "./googleButton"
import { RedirectBasedOnRole } from "@/lib/redirect"

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
  image: z.instanceof(File).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function RegisterForm({ className, ...props }: RegisterFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user, login,register, isLoading } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('email', values.email)
      formData.append('password', values.password)
      
      // Handle image upload if exists
      if (values.image) {
        const imageFormData = new FormData()
        imageFormData.append('image', values.image)
        const imageUrl = await uploadImageToStorage(imageFormData)
        // formData.append('image', imageUrl)
        if (imageUrl) {
          formData.append('image', imageUrl)
        } else {
          throw new Error('Image upload failed')
        }
      }

      // Call register with form data
      const user = await register(formData)
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      })
       // Automatic login after registration
    try {
      await login(values.email, values.password);
      
      toast({
        title: "🔐 Login Successful",
        description: "Redirecting you to your dashboard...",
        duration: 2000
      });

      // Redirect based on role after login
      const redirectPath = user.role === "admin" ? "/admin" : "/shop";
      setTimeout(() => {
        router.push(redirectPath);
      }, 1500);

    } catch (loginError) {
      console.error('Auto-login failed:', loginError);
      // If auto-login fails, still redirect but show warning
      toast({
        title: "⚠️ Registration Complete",
        description: "Please log in manually",
        variant: "default",
        duration: 3000
      });
    }

    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image (Optional)</FormLabel>
                <FormControl>
                  <div className="border border-dashed rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary-dark"
                    />
                    {field.value && (
                      <div className="mt-2">
                        <img 
                          src={URL.createObjectURL(field.value)} 
                          alt="Preview" 
                          className="h-24 w-24 object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
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
      
      <GoogleButton action="register" />
    </div>
  )
}