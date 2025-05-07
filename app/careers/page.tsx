import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CareersPage() {
  const positions = [
    {
      title: "Senior Fashion Designer",
      department: "Design",
      location: "New York, NY",
      type: "Full-time"
    },
    {
      title: "E-commerce Manager",
      department: "Digital",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Retail Store Manager",
      department: "Retail",
      location: "Los Angeles, CA",
      type: "Full-time"
    },
    {
      title: "Marketing Coordinator",
      department: "Marketing",
      location: "Remote",
      type: "Full-time"
    }
  ]

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-lg text-muted-foreground">
          Help us shape the future of fashion
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Why Work With Us?</h2>
          <ul className="space-y-4 text-muted-foreground">
            <li>✨ Competitive salary and benefits</li>
            <li>🌟 Professional growth opportunities</li>
            <li>💪 Work-life balance</li>
            <li>🎯 Impact-driven environment</li>
            <li>🌍 Remote-friendly culture</li>
          </ul>
        </div>
        <div 
          className="aspect-video rounded-lg bg-muted"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>

      <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
      <div className="grid gap-6">
        {positions.map((position) => (
          <Card key={position.title}>
            <CardHeader>
              <CardTitle>{position.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="text-sm text-muted-foreground">{position.department}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{position.location}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{position.type}</span>
              </div>
              <Button>Apply Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}