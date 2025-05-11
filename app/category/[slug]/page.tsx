"use client"

import { useEffect } from "react"
import { useProductStore } from "@/lib/stores/product"
import { ProductCard } from "@/components/shop/product-card"

type ValidSlug = 'men' | 'women' | 'accessories' | 'new-arrivals'

type CategoryPageProps = {
  params: {
    slug: ValidSlug
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const {
    products,
    fetchProductsByGender,
    fetchAllProducts,
    searchProducts,
  } = useProductStore()

  let categoryTitle = ""
  let categoryDescription = ""

  useEffect(() => {
    if (slug === "men" || slug === "women") {
      fetchProductsByGender(slug)
    } else if (slug === "accessories") {
      searchProducts("SELECT * FROM products WHERE category = 'accessories'")
    } else if (slug === "new-arrivals") {
      searchProducts("SELECT * FROM products WHERE isNewArrival = TRUE")
    } else {
      fetchAllProducts()
    }
  }, [slug, fetchProductsByGender, searchProducts, fetchAllProducts])

  switch (slug) {
    case "men":
      categoryTitle = "Men's Collection"
      categoryDescription = "Discover our premium selection of men's clothing"
      break
    case "women":
      categoryTitle = "Women's Collection"
      categoryDescription = "Explore our curated collection of women's fashion"
      break
    case "accessories":
      categoryTitle = "Accessories"
      categoryDescription = "Complete your look with our stylish accessories"
      break
    case "new-arrivals":
      categoryTitle = "New Arrivals"
      categoryDescription = "Discover our latest products and collections"
      break
    default:
      categoryTitle = "All Products"
      categoryDescription = "Browse our complete collection"
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pt-32">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{categoryTitle}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">{categoryDescription}</p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <h3 className="text-lg sm:text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-4">
            This category is currently empty or being updated.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
