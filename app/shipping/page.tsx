import { Truck, RotateCcw, Clock, Globe } from "lucide-react"

export default function ShippingPage() {
  const shippingMethods = [
    {
      name: "Standard Shipping",
      time: "3-5 business days",
      cost: "Free over $50",
      description: "For all domestic orders within the United States"
    },
    {
      name: "Express Shipping",
      time: "1-2 business days",
      cost: "$15",
      description: "Guaranteed delivery by end of next business day"
    },
    {
      name: "International Shipping",
      time: "7-14 business days",
      cost: "Varies by location",
      description: "Available for most countries worldwide"
    }
  ]

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Shipping & Returns</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about our shipping and return policies
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
          <div className="space-y-6">
            {shippingMethods.map((method) => (
              <div key={method.name} className="flex gap-4">
                <Truck className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {method.time} • {method.cost}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Returns & Exchanges</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Clock className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-medium">30-Day Return Window</h3>
                <p className="text-sm text-muted-foreground">
                  Return or exchange unworn items within 30 days of delivery
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <RotateCcw className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-medium">Easy Returns Process</h3>
                <p className="text-sm text-muted-foreground">
                  Print a return label from your account or contact customer service
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Globe className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-medium">International Returns</h3>
                <p className="text-sm text-muted-foreground">
                  International customers are responsible for return shipping costs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Return Policy Details</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Items must be returned in their original condition with tags attached. 
            Worn, damaged, or altered items will not be accepted for return.
          </p>
          <p>
            Once we receive your return, we'll process it within 3-5 business days. 
            Refunds will be issued to the original payment method.
          </p>
          <p>
            For exchanges, please indicate the desired size or color in the return form. 
            We'll process your exchange as soon as we receive the original item.
          </p>
          <p>
            Sale items are final sale and cannot be returned unless defective. 
            Please check measurements carefully before purchasing sale items.
          </p>
        </div>
      </div>
    </div>
  )
}