"use client"

import { useState } from "react"
import { Filter, SlidersHorizontal, X } from "lucide-react"
import { getAllProducts } from "@/objects/products"
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"
import ShopFilters from "@/components/shop/shop-filters"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ShopPage() {
  const allProducts = getAllProducts()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState(allProducts)

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pt-32">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Shop All Products</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Browse our collection of premium clothing and accessories
          </p>
        </div>
        
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 sm:hidden"
              size="sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center justify-between">
                <span>Filters</span>
                <X className="h-5 w-5" onClick={() => setIsFilterOpen(false)} />
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full pr-4">
              <ShopFilters 
                allProducts={allProducts}
                setProducts={setProducts}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Desktop Filter Button (hidden on mobile) */}
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="hidden sm:flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Filters (hidden on mobile) */}
        <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 lg:w-72`}>
          <ScrollArea className="h-full pr-4">
            <ShopFilters 
              allProducts={allProducts}
              setProducts={setProducts}
            />
          </ScrollArea>
        </aside>
        
        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <h3 className="text-lg sm:text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground text-sm sm:text-base mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => setProducts(allProducts)}
                size="sm"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}