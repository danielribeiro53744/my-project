

import { getAllProducts, getProductsByGender } from "@/objects/products"
import { ProductCard } from "@/components/shop/product-card"
import { Metadata } from "next";

type ValidSlug =  'men' | 'women' | 'accessories' | 'new-arrivals' ;

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

// 3. Generate metadata
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{
//     slug: ValidSlug;
//   }>;
// }): Promise<Metadata> {
//   return {
//     title: `${(await params).slug.charAt(0).toUpperCase() + (await params).slug.slice(1)} Category`,
//   };
// }


export default async function CategoryPage({ params }: CategoryPageProps) {
  const realParams = await params;
  const { slug } = realParams;
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
    // Default case
    products = getAllProducts()
    categoryTitle = "All Products"
    categoryDescription = "Browse our complete collection"
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryTitle}</h1>
        <p className="text-muted-foreground">{categoryDescription}</p>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            This category is currently empty or being updated.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}