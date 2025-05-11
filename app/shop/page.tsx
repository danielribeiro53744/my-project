"use client"

import { useState } from "react"
import { Filter, SlidersHorizontal, X, Scale } from "lucide-react"
import { getAllProducts, Product } from "@/lib/interfaces/products"
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"
import ShopFilters from "@/components/shop/shop-filters"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ShopPage() {
  const allProducts = getAllProducts()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState(allProducts)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  const handleCompareToggle = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      if (exists) return prev.filter((p) => p.id !== product.id)
      if (prev.length < 2) return [...prev, product]
      return prev // Only allow 2 selections
    })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-24 pb-24 sm:pt-32">
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
            <Button variant="outline" className="flex items-center gap-2 sm:hidden" size="sm">
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
              <ShopFilters allProducts={allProducts} setProducts={setProducts} />
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Desktop Filter Button */}
        <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="hidden sm:flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        <aside className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 lg:w-72`}>
          <ScrollArea className="h-full pr-4">
            <ShopFilters allProducts={allProducts} setProducts={setProducts} />
          </ScrollArea>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <h3 className="text-lg sm:text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground text-sm sm:text-base mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button variant="outline" onClick={() => setProducts(allProducts)} size="sm">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectCompare={handleCompareToggle}
                  isSelected={!!selectedProducts.find(p => p.id === product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compare Drawer / Modal */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow p-4 flex items-center justify-between z-50">
          <div className="text-sm">
            {selectedProducts.length === 1
              ? `${selectedProducts[0].name} selected`
              : `${selectedProducts[0].name} vs ${selectedProducts[1].name}`}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedProducts([])}>
              Clear
            </Button>
            {selectedProducts.length === 2 && (
              <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Scale className="h-4 w-4" />
                    Compare
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Compare Products</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {selectedProducts.map((p) => (
                      <div key={p.id} className="border rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-lg">{p.name}</h3>
                        <p className="text-muted-foreground text-sm">{p.category}</p>
                        <p className="font-medium">{p.price}€</p>
                        {p.discountPrice && (
                          <p className="text-sm text-red-500">Discount: {p.discountPrice}€</p>
                        )}
                        <img src={p.images[0]} alt={p.name} className="w-full h-48 object-cover rounded" />
                        <p className="text-xs line-clamp-3">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
