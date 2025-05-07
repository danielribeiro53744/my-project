"use client"

import router from "next/router"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Moon, Sun, ShoppingCart, User, Menu, X, LogOut, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart"
import { useAuth } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { checkAuth } from '@/lib/useSession';


const Header = () => {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { items } = useCart()
  const { isAuth } = useAuth()
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: null | { name: string; email: string, image?: string };
    isLoading: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });
  // const { data: session, status } = session()
  // const { isAuthenticated, user } =  checkAuth();
  // const { isAuthenticated, user, isLoading } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  // console.log(isAuthenticated)
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)




  useEffect(() => {
    setIsMounted(true)    
  }, [])
  // console.log(authState.isAuthenticated)
  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated, user } = await checkAuth();
      console.log('is:::',isAuthenticated)
      setAuthState({
        isAuthenticated,
        user,
        isLoading: false,
      });
    };

    verifyAuth();

  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Men", href: "/category/men" },
    { name: "Women", href: "/category/women" },
    { name: "Sale", href: "/sale" }
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  // const handleLogout = async () => {
  //   // await signOut({ callbackUrl: "/" })
  //   setIsDropdownOpen(false)
  // }
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh the page to clear client-side state
        router.reload();
        // Optionally redirect to home/login page
        // router.push('/login');
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className={cn(
      "fixed w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-sm border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl">
          ATTIRE
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {isMounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Account Dropdown */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                {authState.isAuthenticated && authState.user?.image ? (
                  <Image
                    src={authState.user.image}
                    alt="User Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <UserIcon className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {authState.isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full" onClick={() => setIsDropdownOpen(false)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login" className="w-full" onClick={() => setIsDropdownOpen(false)}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b transition-all duration-300 ease-in-out animate-slideDown">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
     

              <div className="pt-2 border-t">
                {authState.isAuthenticated ? (
                  <>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full mb-2">
                        My Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="default" className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header