"use client"

import { useState } from "react"
import { CreditCard, DollarSign, FileText, RefreshCw, TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillingTable } from "@/components/admin/billing-table"
// import { InvoiceList } from "@/components/admin/invoice-list"

export default function AdminBillingPage() {
  const [activeTab, setActiveTab] = useState("subscriptions")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const billingStats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      icon: DollarSign,
      description: "+20.1% from last month",
    },
    {
      title: "Active Subscriptions",
      value: "126",
      icon: CreditCard,
      description: "+12 from last month",
    },
    {
      title: "Pending Invoices",
      value: "8",
      icon: FileText,
      description: "Require attention",
    },
    {
      title: "Revenue Growth",
      value: "+12.5%",
      icon: TrendingUp,
      description: "Quarter over quarter",
    },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="flex-1 overflow-y-auto pt-4 px-4 sm:pt-6 sm:px-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Billing Management</h1>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {billingStats.map((stat) => (
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>
                Manage all active customer subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BillingTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                View and manage all issued invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <InvoiceList /> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage accepted payment methods and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-60">
              <div className="text-center text-muted-foreground">
                <CreditCard className="mx-auto h-8 w-8 mb-2" />
                <p>Payment methods configuration</p>
                <p className="text-sm">Coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}