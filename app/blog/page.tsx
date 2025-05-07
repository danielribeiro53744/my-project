import Link from "next/link"
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
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Fashion Blog</h1>
        <p className="text-lg text-muted-foreground">
          Insights, trends, and stories from the world of fashion
        </p>
      </div>

      <div className="grid gap-12">
        {posts.map((post) => (
          <article key={post.id} className="grid md:grid-cols-2 gap-8">
            <Link href={`/blog/${post.id}`}>
              <div 
                className="aspect-[16/10] rounded-lg bg-muted hover:opacity-90 transition-opacity"
                style={{
                  backgroundImage: `url(${post.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
            </Link>
            <div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{post.category}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.date), { addSuffix: true })}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">
                <Link href={`/blog/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">{post.author}</p>
                </div>
                <Button variant="outline" asChild>
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