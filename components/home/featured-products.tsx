import Link from "next/link"
import { ProductCard } from "@/components/shop/product-card"
import { getFeaturedProducts } from "@/lib/products"

const FeaturedProducts = () => {
  const products = getFeaturedProducts()

  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl">
              Our selection of premium clothing chosen for quality and style
            </p>
          </div>
          <Link 
            href="/shop" 
            className="mt-4 md:mt-0 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            View all products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts