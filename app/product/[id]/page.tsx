import { getAllProducts, getProductById } from "@/objects/products"
import { ChevronLeft, Heart, Link, MinusIcon, PlusIcon, Share2, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import AddToCartButton from "@/components/shop/add-to-cart-button"

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
      <div className="container mx-auto px-4 pt-32 pb-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/shop">
        <Button asChild>
          <a>Go back to shop</a>
        </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <Button
        variant="ghost"
        className="mb-6 pl-0"
        // ="/shop"
        asChild
      >
        <a>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to shop
        </a>
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div 
            className="w-full aspect-square bg-muted rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${product.images[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
          
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.isNewArrival && (
                    <Badge className="bg-primary text-primary-foreground">New</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge className="bg-amber-500 text-white">Best Seller</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-current text-yellow-400"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(128 reviews)</span>
            </div>
            
            <div className="flex items-center mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl font-bold">${product.discountPrice.toFixed(2)}</span>
                  <span className="text-muted-foreground line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge className="ml-2 bg-red-500 text-white">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </Badge>
                </>
              ) : (
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
          
          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className="w-9 h-9 rounded-full"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Size</h3>
              <Button variant="link" className="h-auto p-0 text-sm">Size Guide</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  className="px-4"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Add to Cart */}
          <div className="mb-8">
            <AddToCartButton product={product} />
          </div>
          
          {/* Product Details Accordion */}
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  {product.description}
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-muted-foreground">
                  <p>Free standard shipping on all orders over $100.</p>
                  <p>Express shipping available for an additional fee.</p>
                  <p>Returns accepted within 30 days of delivery.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="care">
              <AccordionTrigger>Care Instructions</AccordionTrigger>
              <AccordionContent>
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