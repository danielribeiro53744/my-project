import { Building, Users, Heart, Trophy } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const stats = [
    { label: "Years in Business", value: "10+", icon: Building },
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Product Quality", value: "100%", icon: Heart },
    { label: "Design Awards", value: "25+", icon: Trophy },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pt-32">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">About Attire</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Crafting premium fashion experiences since 2015
        </p>
      </div>

      {/* Story Section */}
      <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
        <div className="order-2 md:order-1 md:w-1/2">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Our Story</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4">
            Founded in 2015, Attire has grown from a small boutique to a leading fashion destination. 
            We believe in quality, sustainability, and making fashion accessible to everyone.
          </p>
          <p className="text-muted-foreground text-sm sm:text-base">
            Our commitment to excellence drives everything we do, from selecting the finest materials 
            to providing exceptional customer service.
          </p>
        </div>
        <div className="order-1 md:order-2 md:w-1/2 aspect-square relative rounded-lg overflow-hidden bg-muted">
          <Image
            src="https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg"
            alt="Our story"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-muted/50 rounded-lg">
            <stat.icon className="h-6 sm:h-8 w-6 sm:w-8 mx-auto mb-2 text-primary" />
            <div className="text-xl sm:text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Values Section */}
      <div className="bg-muted rounded-lg p-6 sm:p-8 md:p-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Our Values</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Quality</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              We source the finest materials and partner with skilled artisans to create lasting pieces.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Sustainability</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Environmental responsibility is at the heart of our production process.
            </p>
          </div>
          <div className="text-center sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Community</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              We believe in building lasting relationships with our customers and partners.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}