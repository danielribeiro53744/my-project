"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { signup } from '@/app/actions/auth'
import { redirect } from "next/navigation"
import { SignupFormSchema } from "@/lib/definitions"
import { useState, useTransition } from 'react';

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

function useCustomActionState(action: any, initialState: any) {
  const [state, setState] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const formAction = async (formData: any) => {
    startTransition(async () => {
      try {
        const result = await action(formData);
        setState(result);
      } catch (error: any) {
        setState({
          ...initialState,
          message: error.message,
          errors: { form: error.message }
        });
      }
    });
  };

  return [state, formAction, isPending];
}

export default function RegisterForm({ className, ...props }: RegisterFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  // localStorage.setItem('cart', JSON.stringify({products: [], total: 0}));

  // const [state, action, pending] = useActionState(signup, undefined)
  // const [state, formAction, isPending] = React.useActionState(signup, {
  //   errors: {},
  //   message: ''
  // });
  const [state, formAction, isPending] = useCustomActionState(signup, {
    errors: {},
    message: ''
  });
  console.log('Pending', isPending)
  console.log('State:',state)
  if(state?.message === 'Logged in' || state?.message === 'Already exists cookie'){
    localStorage.setItem('cart', JSON.stringify({products: [], total: 0}));
    localStorage.setItem('user', JSON.stringify({username: state.user.name, isAdmin: state.user.isAdmin}));
    redirect('/dashboard')
  }

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Account created",
        description: "You have successfully registered an account.",
      })
      
      // if (values.role === "admin") {
      //   router.push("/admin")
      // } else {
      //   router.push("/shop")
      // }
    }, 1000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
      {/* onSubmit={form.handleSubmit(onSubmit)} */}
        <form  action={formAction} className="space-y-4"> 
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
    </div>
  )
}