"use client"

import { useState } from "react"
import { Building, Package, ShoppingBag, Users } from "lucide-react"
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
import { getAllProducts } from "@/objects/products"
import AdminSidebar from "@/components/admin/sidebar"
import ProductTable from "@/components/admin/product-table"

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const products = getAllProducts()

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

  return (
    <div className="flex h-screen overflow-hidden pt-16">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto pt-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[240px] flex items-center justify-center text-muted-foreground">
                    Sales chart visualization would go here
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    Latest transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-medium text-xs text-primary">
                            {String.fromCharCode(64 + i)}
                          </span>
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium">Customer {i}</p>
                          <p className="text-xs text-muted-foreground">
                            {i} product{i > 1 ? "s" : ""} • ${(i * 39.99).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm text-right font-medium">
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
            <ProductTable products={products} />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Manage customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-60 text-muted-foreground">
                  Orders management interface would go here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>
                  View and manage customer accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-60 text-muted-foreground">
                  Customer management interface would go here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}