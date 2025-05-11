"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { 
  BarChart, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  CreditCard, 
  LifeBuoy, 
  LogOut,
  Home
} from "lucide-react"
import { cn } from "@/lib/action/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/stores/auth"

interface SidebarItemProps {
  icon: React.ElementType
  title: string
  href: string
  isActive?: boolean
  onClick?: () => void
}

const SidebarItem = ({ icon: Icon, title, href, isActive, onClick }: SidebarItemProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          isActive ? "bg-muted" : "hover:bg-transparent hover:underline"
        )}
        onClick={onClick}
      >
        <Icon className="h-4 w-4" />
        {title}
      </Button>
    </Link>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('selectedTab') || 'overview'
  const { logout } = useAuth()

  // Improved active state detection
  const isActive = (href: string) => {
    const basePath = href.split('?')[0]
    const tabParam = new URLSearchParams(href.split('?')[1] || '').get('selectedTab')
    
    return (
      pathname === basePath && 
      (tabParam ? tabParam === currentTab : currentTab === 'overview')
    )
  }

  const mainNavItems = [
    { icon: Home, title: "Home", href: "/" },
    { icon: BarChart, title: "Overview", href: "/admin" },
    { icon: Package, title: "Products", href: "/admin?selectedTab=products" },
    { icon: ShoppingBag, title: "Orders", href: "/admin?selectedTab=orders" },
    { icon: Users, title: "Customers", href: "/admin?selectedTab=customers" },
    { icon: CreditCard, title: "Billing", href: "/admin?selectedTab=billing" },
  ]

  const secondaryNavItems = [
    { icon: Settings, title: "Settings", href: "/admin/settings" },
    { icon: LifeBuoy, title: "Support", href: "/admin/support" },
  ]

  const handleLogout = async () => {
    await logout()
    window.location.href = "/login"
  }

  return (
    <div className="hidden md:flex flex-col w-64 border-r h-full">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1 py-2">
          {mainNavItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              title={item.title}
              href={item.href}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
        <div className="mt-auto pt-2 border-t">
          {secondaryNavItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              title={item.title}
              href={item.href}
              isActive={isActive(item.href)}
            />
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}