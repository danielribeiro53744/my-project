import { getAllProducts } from "@/objects/products"
import { ProductCard } from "@/components/shop/product-card"

export default function SalePage() {
  const products = getAllProducts().filter(product => product.discountPrice)
  const discountRange = products.reduce(
    (acc, product) => {
      const discount = Math.round((1 - product.discountPrice! / product.price) * 100)
      return {
        min: Math.min(acc.min, discount),
        max: Math.max(acc.max, discount)
      }
    },
    { min: 100, max: 0 }
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-24 pb-12 sm:pt-32 sm:pb-16">
      {/* Hero Section */}
      <div className="relative mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
          Sale
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6">
          Save up to {discountRange.max}% off on selected items
        </p>
        <div 
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(circle at center, hsl(var(--destructive)/0.1) 0%, transparent 70%)"
          }}
        />
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <h3 className="text-lg sm:text-xl font-medium mb-2">No sale items available</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Check back soon for new discounts and promotions
          </p>
        </div>
      ) : (
        <>
          {/* Product Count and Discount Range */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 sm:mb-8">
            <p className="text-muted-foreground text-sm sm:text-base">
              Showing {products.length} sale items
            </p>
            <p className="text-xs sm:text-sm bg-destructive/10 text-destructive px-3 py-1 rounded-full">
              Discounts {discountRange.min}% - {discountRange.max}% off
            </p>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}