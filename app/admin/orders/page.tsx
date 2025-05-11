"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useOrderStore } from "@/lib/stores/order"
import { Order } from "@/lib/interfaces/order"

export default function OrderPage() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  const { orders, fetchOrders } = useOrderStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((order) => order.id))
    }
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleDelete = (order: Order) => {
    setCurrentOrder(order)
    setIsDeleteDialogOpen(true)
  }

  const handleEdit = (order: Order) => {
    setCurrentOrder(order)
    setIsEditDialogOpen(true)
  }

  const confirmDelete = () => {
    toast({
      title: "Order deleted",
      description: `${currentOrder?.id} has been removed.`,
    })
    setIsDeleteDialogOpen(false)
  }

  const confirmEdit = () => {
    toast({
      title: "Order updated",
      description: `${currentOrder?.id} has been updated.`,
    })
    setIsEditDialogOpen(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Order
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => handleSelectOrder(order.id)}
                    aria-label={`Select ${order.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {order.status === 'pending' && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                        Pending
                      </Badge>
                    )}
                    {order.status === 'completed' && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                        Completed
                      </Badge>
                    )}
                    {order.status === 'cancelled' && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                        Cancelled
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(order)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(order)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete order <span className="font-medium">{currentOrder?.id}</span>.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Make changes to the order information here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="customer" className="text-sm font-medium">
                Customer ID
              </label>
              <Input
                id="customer"
                defaultValue={currentOrder?.userId}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="total" className="text-sm font-medium">
                Total
              </label>
              <Input
                id="total"
                defaultValue={currentOrder?.total}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Input
                id="status"
                defaultValue={currentOrder?.status}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="shippingAddress" className="text-sm font-medium">
                Shipping Address
              </label>
              <div>
                <div>Name: {currentOrder?.shippingAddress.name}</div>
                <div>Address: {currentOrder?.shippingAddress.address}</div>
                <div>City: {currentOrder?.shippingAddress.city}</div>
                <div>Country: {currentOrder?.shippingAddress.country}</div>
                <div>Postal Code: {currentOrder?.shippingAddress.postalCode}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={confirmEdit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
