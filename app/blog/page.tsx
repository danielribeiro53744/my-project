import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"

const posts = [
  {
    id: "1",
    title: "Spring Fashion Trends 2025",
    excerpt: "Discover the latest trends that will dominate the fashion world this spring season.",
    image: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg",
    date: "2025-02-15",
    author: "Emma Style",
    category: "Trends"
  },
  {
    id: "2",
    title: "Sustainable Fashion: A Guide",
    excerpt: "Learn how to build a sustainable wardrobe without compromising on style.",
    image: "https://images.pexels.com/photos/2466756/pexels-photo-2466756.jpeg",
    date: "2025-02-10",
    author: "Alex Green",
    category: "Sustainability"
  },
  {
    id: "3",
    title: "The Art of Layering",
    excerpt: "Master the art of layering clothes for both style and comfort.",
    image: "https://images.pexels.com/photos/2866119/pexels-photo-2866119.jpeg",
    date: "2025-02-05",
    author: "Sarah Fashion",
    category: "Style Guide"
  }
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 pt-24 pb-12 sm:pt-32 sm:pb-16">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Fashion Blog</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Insights, trends, and stories from the world of fashion
        </p>
      </div>

      {/* Blog Posts */}
      <div className="grid gap-8 sm:gap-12">
        {posts.map((post) => (
          <article key={post.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Image */}
            <Link href={`/blog/${post.id}`} className="block aspect-[16/10] relative rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={post.id === "1"} // Only prioritize first image
              />
            </Link>
            
            {/* Content */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
                </div>
                
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  <Link href={`/blog/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                
                {/* Excerpt */}
                <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
                  {post.excerpt}
                </p>
              </div>
              
              {/* Footer */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">{post.author}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs sm:text-sm"
                  asChild
                >
                  <Link href={`/blog/${post.id}`}>Read More</Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}