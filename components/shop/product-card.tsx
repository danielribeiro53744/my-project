"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Product } from "@/objects/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { toast } = useToast()
  const { addItem } = useCart()
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add first available size by default
    addItem(product, product.sizes[0])
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }
  
  const handleImageHover = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex(currentImageIndex === 0 ? 1 : 0)
    }
  }

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="relative rounded-lg overflow-hidden mb-4">
        {/* Product image */}
        <div 
          className="aspect-[3/4] w-full bg-secondary/20"
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageHover}
        >
          <div 
            className="h-full w-full transition-transform duration-700 ease-in-out bg-cover bg-center"
            style={{ backgroundImage: `url(${product.images[currentImageIndex]})` }}
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <Badge className="bg-primary text-primary-foreground">New</Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-amber-500 text-white">Best Seller</Badge>
          )}
          {product.discountPrice && (
            <Badge className="bg-red-500 text-white">Sale</Badge>
          )}
        </div>
        
        {/* Add to cart button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            onClick={handleAddToCart} 
            size="sm" 
            className="w-full gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product details */}
      <div>
        <h3 className="font-medium truncate">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-1">{product.category}</p>
        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="font-semibold">${product.discountPrice.toFixed(2)}</span>
              <span className="text-muted-foreground text-sm line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-semibold">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}