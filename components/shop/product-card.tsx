"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Product } from "@/lib/interfaces/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/action/utils"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/stores/cart"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"

interface ProductCardProps {
  product: Product
  onSelectCompare?: (product: Product) => void
  isSelected?: boolean
}

export function ProductCard({ product, onSelectCompare, isSelected = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()
  const { addItem } = useCart()
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, product.sizes[0])
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

 const handleCompareToggle = (checked: boolean | string) => {
  onSelectCompare?.(product)
}
 
  return (
    // <Link href={`/product/${product.id}`} className="group relative">
    <Link href='' className="group relative">
      {/* Compare Checkbox */}
      {onSelectCompare && (
        <div className="absolute top-2 right-2 z-10">
          <Checkbox checked={isSelected} onCheckedChange={() => onSelectCompare?.(product)}  />
        </div>
      )}
      
      {/* Product image container */}
      <div 
        className="aspect-[3/4] w-full bg-secondary/20 relative overflow-hidden rounded-lg mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-opacity duration-500",
            isHovered && product.images[1] ? "opacity-0" : "opacity-100"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500"
            style={{ opacity: isHovered ? 1 : 0 }}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
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
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
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
              <span className="font-semibold">{product.discountPrice.toFixed(2)}€</span>
              <span className="text-muted-foreground text-sm line-through">{product.price.toFixed(2)}€</span>
            </>
          ) : (
            <span className="font-semibold">{product.price.toFixed(2)}€</span>
          )}
        </div>
      </div>
    </Link>
  )
}