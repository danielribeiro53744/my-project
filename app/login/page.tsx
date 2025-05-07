import Link from "next/link"
import { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Attire",
  description: "Login to your Attire account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 sm:p-6">
      {/* Mobile-only header */}
      <div className="lg:hidden w-full max-w-md mb-8">
        <Link href="/" className="text-2xl font-bold text-primary">
          {/* Attire */}
        </Link>
      </div>

      <div className="container relative flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:gap-8">
        {/* Left side - Branding/Image */}
        <div className="relative hidden h-full flex-col bg-muted p-8 text-white lg:flex dark:border-r rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-primary/80" />
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/70 z-0"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "multiply"
            }}
          />
          
          <div className="relative z-10 flex flex-col h-full">
            <Link href="/" className="text-2xl font-bold mb-12">
              Attire
            </Link>
            
            <div className="mt-auto">
            <blockquote className="space-y-4">
                <svg 
                  className="h-8 w-8 text-black" 
                  fill="currentColor" 
                  viewBox="0 0 32 32"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-lg font-medium text-black">
                  "Attire has completely transformed my shopping experience. The quality and style of their products are unmatched."
                </p>
                <footer className="text-sm font-light text-black">Sarah Johnson</footer>
              </blockquote>

            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="mx-auto w-full max-w-md sm:w-[400px] lg:p-8 p-6 bg-card rounded-lg shadow-sm border">
          <div className="flex flex-col space-y-4 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="mt-6">
            <LoginForm />
          </div>

          <div className="mt-6">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Don't have an account?
                </span>
              </div>
            </div>
            
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
            >
              Create an account
            </Link>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>By continuing, you agree to our</p>
            <div className="flex justify-center space-x-4 mt-1">
              <Link href="/terms" className="hover:underline">Terms</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}