import Link from "next/link"
import { Button } from "@/components/ui/button"

const Hero = () => {
  return (
    <section className="relative h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      <div 
        className="absolute inset-0 z-[-1]" 
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Elevate Your Style
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Discover the latest trends in fashion with our curated collection of premium clothing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="font-medium">
              <Link href="/shop">
                Shop Collection
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:text-black">
              <Link href="/category/new-arrivals">
                New Arrivals
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero