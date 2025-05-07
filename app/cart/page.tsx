"use client";

import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const handleQuantityChange = (
    productId: string,
    size: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change
    if (newQuantity < 1) return
    updateQuantity(productId, size, newQuantity)
  }

  const handleCheckout = async () => {
    try {
      const shippingAddress = {
        name: "Jane Doe",
        address: "456 Fashion Ave",
        city: "Los Angeles",
        country: "USA",
        postalCode: "90001"
      };
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, userId: 'teste', shippingAddress }),
      });

      const { sessionId, newOrder } = await response.json();
      
      if(sessionId === "session"){
        router.push(`/checkout/success?session_id=session&order_id=${newOrder}`)
      }
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
      console.log(error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 sm:pt-32 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Button asChild size="sm" className="sm:size-default">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 sm:pt-32">
      {/* Mobile Back Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4 sm:hidden flex items-center gap-2" 
        asChild
      >
        <Link href="/shop">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </Button>

      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products List */}
        <div className="lg:w-8/12">
          {/* Mobile View - Simplified List */}
          <div className="sm:hidden space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 rounded bg-secondary/20 overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeItem(item.product.id, item.size)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.product.category} • Size: {item.size}
                    </p>
                    <p className="font-medium mb-3">
                      {(item.product.discountPrice || item.product.price).toFixed(2)}€
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.size,
                              item.quantity,
                              -1
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.size,
                              item.quantity,
                              1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-medium">
                        {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden sm:block border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Size</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={`${item.product.id}-${item.size}`} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded bg-secondary/20 overflow-hidden">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{item.size}</td>
                    <td className="p-4">
                      {(item.product.discountPrice || item.product.price).toFixed(2)}€
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.size,
                              item.quantity,
                              -1
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.size,
                              item.quantity,
                              1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-4 font-medium">
                      {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}€
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product.id, item.size)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-4/12">
          <div className="border rounded-lg p-4 sm:p-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{getTotal().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{getTotal().toFixed(2)}€</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={handleCheckout}
            >
              Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full mt-2"
              asChild
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}