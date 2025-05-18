"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { Building, Package, ShoppingBag, Users, Menu } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AdminSidebar from "@/components/admin/sidebar"
import ProductTable from "@/components/admin/product-table"
import { Button } from "@/components/ui/button"
import { useProductStore } from "@/lib/stores/product"
import AdminOrdersPage from "./orders/page"
import CustomerPage from "./customer/page"
import { RedirectBasedOnRole } from "@/lib/redirect"
import { useAuth } from "@/lib/stores/auth"
import AdminBillingPage from "./billing/page"
import { useSearchParams } from "next/navigation"


export default function AdminDashboard() {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("overview")
  const searchParams = useSearchParams()
  const urlSelectedTab = searchParams.get('selectedTab') || 'overview'
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { products, fetchAllProducts } = useProductStore()
  const { user, isLoading } = useAuth();

  // ✅ Fetch products on mount
  useEffect(() => {
    fetchAllProducts()
  }, [fetchAllProducts])

  // Sync tab state with URL changes
  useEffect(() => {
    if (urlSelectedTab !== selectedTab) {
      setSelectedTab(urlSelectedTab)
    }
  }, [urlSelectedTab])

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    // Update URL without page reload
    window.history.pushState({}, '', `/admin?selectedTab=${value}`)
  }

  const stats = [
    {
      title: "Total Revenue",
      value: "$15,231.89",
      icon: Building,
      description: "10% more than last month",
    },
    {
      title: "Products",
      value: products.length.toString(),
      icon: Package,
      description: "5 new products added this week",
    },
    {
      title: "Orders",
      value: "126",
      icon: ShoppingBag,
      description: "14 orders placed today",
    },
    {
      title: "Customers",
      value: "593",
      icon: Users,
      description: "23 new customers this week",
    },
  ]
   useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/login'); // More seamless and doesn't push to history
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null; // Prevent flicker
  return (
    <div className="flex h-screen overflow-hidden pt-16">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] px-0">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      <div className="flex-1 overflow-y-auto pt-4 px-4 sm:pt-6 sm:px-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        </div>

         <Tabs 
          value={selectedTab} // Controlled value
          onValueChange={handleTabChange}
          className="space-y-4 sm:space-y-6"
        >
          <TabsList className="bg-muted w-full overflow-x-auto">
            <div className="flex space-x-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm px-3 py-1">Overview</TabsTrigger>
              <TabsTrigger value="products" className="text-xs sm:text-sm px-3 py-1">Products</TabsTrigger>
              <TabsTrigger value="orders" className="text-xs sm:text-sm px-3 py-1">Orders</TabsTrigger>
              <TabsTrigger value="customers" className="text-xs sm:text-sm px-3 py-1">Customers</TabsTrigger>
              <TabsTrigger value="billing" className="text-xs sm:text-sm px-3 py-1">Billing</TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title} className="min-w-[180px]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[180px] sm:h-[240px] flex items-center justify-center text-muted-foreground text-sm">
                    Sales chart visualization would go here
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Recent Sales</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Latest transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-primary/10 flex items-center justify-center mr-2 sm:mr-3">
                          <span className="font-medium text-xs text-primary">
                            {String.fromCharCode(64 + i)}
                          </span>
                        </div>
                        <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">Customer {i}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {i} product{i > 1 ? "s" : ""} • ${(i * 39.99).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-xs sm:text-sm text-right font-medium">
                          ${(i * 39.99).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <ProductTable />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrdersPage />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerPage />
          </TabsContent>
          <TabsContent value="billing">
            <AdminBillingPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}