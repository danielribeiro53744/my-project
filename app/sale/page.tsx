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
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="relative mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Sale
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
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
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No sale items available</h3>
          <p className="text-muted-foreground">
            Check back soon for new discounts and promotions
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing {products.length} sale items
            </p>
            <p className="text-sm">
              Discounts from {discountRange.min}% to {discountRange.max}% off
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}