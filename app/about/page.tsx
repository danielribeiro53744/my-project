import { Building, Users, Heart, Trophy } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { label: "Years in Business", value: "10+", icon: Building },
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Product Quality", value: "100%", icon: Heart },
    { label: "Design Awards", value: "25+", icon: Trophy },
  ]

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Attire</h1>
        <p className="text-lg text-muted-foreground">
          Crafting premium fashion experiences since 2015
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            Founded in 2015, Attire has grown from a small boutique to a leading fashion destination. 
            We believe in quality, sustainability, and making fashion accessible to everyone.
          </p>
          <p className="text-muted-foreground">
            Our commitment to excellence drives everything we do, from selecting the finest materials 
            to providing exceptional customer service.
          </p>
        </div>
        <div 
          className="aspect-square rounded-lg bg-muted"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-muted rounded-lg p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Quality</h3>
            <p className="text-muted-foreground">
              We source the finest materials and partner with skilled artisans to create lasting pieces.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Sustainability</h3>
            <p className="text-muted-foreground">
              Environmental responsibility is at the heart of our production process.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-muted-foreground">
              We believe in building lasting relationships with our customers and partners.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}