"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  CreditCard, 
  LifeBuoy, 
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarItemProps {
  icon: React.ElementType
  title: string
  href: string
  isActive?: boolean
}

const SidebarItem = ({ icon: Icon, title, href, isActive }: SidebarItemProps) => {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          isActive ? "bg-muted" : "hover:bg-transparent hover:underline"
        )}
      >
        <Icon className="h-4 w-4" />
        {title}
      </Button>
    </Link>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()

  const mainNavItems = [
    { icon: BarChart, title: "Overview", href: "/admin" },
    { icon: Package, title: "Products", href: "/admin/products" },
    { icon: ShoppingBag, title: "Orders", href: "/admin/orders" },
    { icon: Users, title: "Customers", href: "/admin/customers" },
    { icon: CreditCard, title: "Billing", href: "/admin/billing" },
  ]

  const secondaryNavItems = [
    { icon: Settings, title: "Settings", href: "/admin/settings" },
    { icon: LifeBuoy, title: "Support", href: "/admin/support" },
  ]

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
              isActive={pathname === item.href}
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
              isActive={pathname === item.href}
            />
          ))}
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}