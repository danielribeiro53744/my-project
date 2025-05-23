"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/action/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/stores/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import GoogleButton from "./googleButton"
import { formSchema } from "@/lib/schemas/loginForm"
import { useCart } from "@/lib/stores/cart"

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { login, isLoading } = useAuth()
  const { items, addItem } = useCart()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const localCart = items

      const loggedInUser = await login(values.email, values.password)

      const res = await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInUser.id,
          localCart,
        }),
      })

      const data = await res.json()

      if (data.cart) {
        data.cart.forEach((item: any) => {
          addItem(item.product, item.size, item.quantity)
        })
        localStorage.setItem("cart", JSON.stringify(data.cart))
      }

      toast({
        title: "Login successful",
        description: "Redirecting you to your dashboard...",
      })

      const redirectPath = loggedInUser.role === "admin" ? "/admin" : "/shop"
      setTimeout(() => {
        router.push(redirectPath)
      }, 1500)
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/reset-password"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
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

      <GoogleButton action="login" />
    </div>
  )
}