"use client"

import { useState } from "react"
import { MinusIcon, PlusIcon, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Product } from "@/objects/products"
import { useCart } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      })
      return
    }

    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize)
    }

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (${selectedSize}) added to your cart.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {product.sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            className="px-4"
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </Button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none"
            onClick={() => setQuantity(quantity + 1)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <Button className="flex-1 gap-2" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}