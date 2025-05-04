import Link from "next/link"
import { ProductCard } from "@/components/shop/product-card"
import { getFeaturedProducts } from "@/objects/products"

const FeaturedProducts = () => {
  const products = getFeaturedProducts()

  return (
    <section className="py-8 md:py-16 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
              Our selection of premium clothing chosen for quality and style
            </p>
          </div>
          <Link 
            href="/shop" 
            className="text-sm font-medium text-primary hover:underline underline-offset-4 self-start md:self-auto"
          >
            View all products →
          </Link>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts