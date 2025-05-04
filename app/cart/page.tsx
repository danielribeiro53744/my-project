// app/cart/page.tsx
"use client"; // Required since we're using event handlers

import { useRouter } from 'next/navigation';

import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
// import { loadStripe } from '@stripe/stripe-js';
import Link from "next/link"
// import { useRouter } from "next/router"
// import router from "next/router";
// import { redirect } from "next/navigation"

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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
      // const stripe = await stripePromise;
      
      // if (!stripe) {
      //   throw new Error('Stripe failed to initialize');
      // }

      // const { error } = await stripe.redirectToCheckout({ sessionId });

      // if (error) {
      //   throw error;
      // }
      if(sessionId === "session"){
        router.push(`/checkout/success?session_id=session&order_id=${newOrder}`)
        // window.document.location.href='/checkout/success?session_id=session'
        // redirect('/checkout/success?session_id=session')
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
      <div className="container mx-auto px-4 pt-32 pb-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={`${item.product.id}-${item.size}`}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div 
                        className="h-20 w-20 rounded bg-secondary/20"
                        style={{
                          backgroundImage: `url(${item.product.images[0]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>
                    {(item.product.discountPrice || item.product.price).toFixed(2)}€
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
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
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
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
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}€
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id, item.size)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-lg border p-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            
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