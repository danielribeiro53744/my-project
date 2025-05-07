import { getAllProducts, getProductsByGender } from "@/objects/products"
import { ProductCard } from "@/components/shop/product-card"
import { Metadata } from "next";

type ValidSlug = 'men' | 'women' | 'accessories' | 'new-arrivals';

type CategoryPageProps = {
  params: Promise<{
    slug: ValidSlug;
  }>;
}

export async function generateStaticParams() {
  const slugs = ['men', 'women', 'accessories', 'new-arrivals'];
  
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: ValidSlug;
  }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = `${slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')} Collection`;
  
  return {
    title: title,
    description: `Browse our ${slug} collection of premium fashion items`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let products = []
  let categoryTitle = ""
  let categoryDescription = ""
  
  // Handle different category types
  if (slug === "men") {
    products = getProductsByGender("men")
    categoryTitle = "Men's Collection"
    categoryDescription = "Discover our premium selection of men's clothing"
  } else if (slug === "women") {
    products = getProductsByGender("women")
    categoryTitle = "Women's Collection"
    categoryDescription = "Explore our curated collection of women's fashion"
  } else if (slug === "accessories") {
    products = getAllProducts().filter(p => p.category === "accessories")
    categoryTitle = "Accessories"
    categoryDescription = "Complete your look with our stylish accessories"
  } else if (slug === "new-arrivals") {
    products = getAllProducts().filter(p => p.isNewArrival)
    categoryTitle = "New Arrivals"
    categoryDescription = "Discover our latest products and collections"
  } else {
    products = getAllProducts()
    categoryTitle = "All Products"
    categoryDescription = "Browse our complete collection"
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pt-32">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{categoryTitle}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">{categoryDescription}</p>
      </div>
      
      {/* Products Grid */}
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