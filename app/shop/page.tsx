"use client"

import { useState } from "react"
import { Filter, SlidersHorizontal } from "lucide-react"
import { getAllProducts } from "@/objects/products"
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"
import ShopFilters from "@/components/shop/shop-filters"

export default function ShopPage() {
  const allProducts = getAllProducts()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState(allProducts)

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
          <p className="text-muted-foreground">
            Browse our collection of premium clothing and accessories
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Section */}
        <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <ShopFilters 
            allProducts={allProducts}
            setProducts={setProducts}
          />
        </aside>
        
        {/* Products Grid */}
        <div className="md:col-span-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setProducts(allProducts)
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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