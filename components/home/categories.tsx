import Link from "next/link"
import { cn } from "@/lib/action/utils"

const categories = [
  {
    name: "Men",
    image: "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/category/men"
  },
  {
    name: "Women",
    image: "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/category/women"
  },
  {
    name: "Accessories",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    href: "/category/accessories"
  }
]

const CategoryCard = ({ category, className }: { category: typeof categories[0], className?: string }) => {
  return (
    <Link href={category.href} className={cn("group relative block overflow-hidden rounded-lg", className)}>
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
      <div 
        className="absolute inset-0 z-[-1] transition-transform duration-500 group-hover:scale-110"
        style={{
          backgroundImage: `url('${category.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="relative flex h-full items-end p-6 sm:p-8">
        <div>
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
          <p className="mt-1.5 text-sm text-white/90 underline underline-offset-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Shop now
          </p>
        </div>
      </div>
    </Link>
  )
}

const Categories = () => {
  return (
    <section className="py-16 md:py-24 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our curated collection of premium clothing for every occasion
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </section>
  )
}

export default Categories