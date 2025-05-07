import { Mail, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Customer Support</h1>
        <p className="text-lg text-muted-foreground">
          We're here to help. Choose how you'd like to get in touch.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Chat with our support team in real-time.
            </p>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Phone Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Call us at +1 (555) 123-4567
            </p>
            <Button className="w-full">Call Now</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Send us an email anytime.
            </p>
            <Button className="w-full">Email Us</Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Common Questions</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-muted px-4 py-4 hover:bg-muted/80">
                <h3 className="font-medium">
                  How can I track my order?
                </h3>
                <svg
                  className="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 px-4 text-muted-foreground">
                You can track your order by logging into your account and visiting the order history section. 
                There you'll find tracking information for all your recent orders.
              </p>
            </details>

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-muted px-4 py-4 hover:bg-muted/80">
                <h3 className="font-medium">
                  What is your return policy?
                </h3>
                <svg
                  className="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 px-4 text-muted-foreground">
                We offer a 30-day return policy for all unworn items in their original condition with tags attached. 
                Shipping costs for returns are the responsibility of the customer unless the item is defective.
              </p>
            </details>

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-muted px-4 py-4 hover:bg-muted/80">
                <h3 className="font-medium">
                  How do I find my size?
                </h3>
                <svg
                  className="ml-1.5 h-5 w-5 flex-shrink-0 transition duration-300 group-open:-rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <p className="mt-4 px-4 text-muted-foreground">
                You can find detailed size guides on each product page. We recommend measuring yourself 
                and comparing your measurements to our size charts for the best fit.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}