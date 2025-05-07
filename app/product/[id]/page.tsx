import { getAllProducts, getProductById } from "@/objects/products"
import { ChevronLeft, Heart, MinusIcon, PlusIcon, Share2, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import AddToCartButton from "@/components/shop/add-to-cart-button"
import Image from "next/image"
import Link from "next/link"

export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({
    id: product.id,
  }))
}

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 sm:pt-32 text-center">
        <h1 className="text-xl sm:text-2xl font-bold">Product not found</h1>
        <p className="text-sm sm:text-base mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild size="sm" className="sm:size-default">
          <Link href="/shop">Go back to shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 sm:pt-32">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4 sm:mb-6 pl-0 text-sm sm:text-base"
        asChild
      >
        <Link href="/shop">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to shop
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
        {/* Product Images */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-auto pb-2 -mx-4 px-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.isNewArrival && (
                    <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">New</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge className="bg-amber-500 text-white text-xs sm:text-sm">Best Seller</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-yellow-400"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">(128 reviews)</span>
            </div>
            
            <div className="flex items-center flex-wrap gap-2 mb-4 sm:mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-xl sm:text-2xl font-bold">${product.discountPrice.toFixed(2)}</span>
                  <span className="text-muted-foreground line-through text-sm sm:text-base">
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge className="bg-red-500 text-white text-xs sm:text-sm">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </Badge>
                </>
              ) : (
                <span className="text-xl sm:text-2xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
          
          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <h3 className="font-medium text-sm sm:text-base mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-muted"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm sm:text-base">Size</h3>
              <Button variant="link" className="h-auto p-0 text-xs sm:text-sm">Size Guide</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  size="sm"
                  className="px-3 text-xs sm:text-sm sm:px-4"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Add to Cart */}
          <div className="mb-6 sm:mb-8">
            <AddToCartButton product={product} />
          </div>
          
          {/* Product Details Accordion */}
          <Accordion type="single" collapsible defaultValue="description" className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger className="text-sm sm:text-base">Description</AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                <p className="text-muted-foreground">
                  {product.description}
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm sm:text-base">Shipping & Returns</AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                <div className="space-y-2 text-muted-foreground">
                  <p>Free standard shipping on all orders over $100.</p>
                  <p>Express shipping available for an additional fee.</p>
                  <p>Returns accepted within 30 days of delivery.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="care">
              <AccordionTrigger className="text-sm sm:text-base">Care Instructions</AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base">
                <div className="space-y-2 text-muted-foreground">
                  <p>Machine wash cold with similar colors.</p>
                  <p>Tumble dry low.</p>
                  <p>Do not bleach.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}