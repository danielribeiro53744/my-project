export default function FAQPage() {
    const faqs = [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
      },
      {
        question: "How long does shipping take?",
        answer: "Domestic shipping typically takes 3-5 business days. International shipping can take 7-14 business days depending on the destination."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
      },
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for all unworn items in their original condition with tags attached. Shipping costs for returns are the responsibility of the customer unless the item is defective."
      },
      {
        question: "How do I track my order?",
        answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account."
      },
      {
        question: "Do you offer gift wrapping?",
        answer: "Yes, we offer gift wrapping services for an additional $5 per item. You can select this option during checkout."
      },
      {
        question: "What if my item doesn't fit?",
        answer: "You can return or exchange items that don't fit within 30 days of purchase. Please refer to our size guide before ordering."
      },
      {
        question: "How do I care for my items?",
        answer: "Care instructions are provided on the label of each item. We also include care recommendations on product pages."
      }
    ]
  
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our products and services
          </p>
        </div>
  
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-lg bg-muted px-4 py-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-1.5">
                  <h2 className="font-medium">
                    {faq.question}
                  </h2>
  
                  <svg
                    className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
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
  
                <p className="mt-4 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
  
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Still have questions? Contact our support team at{" "}
              <a href="mailto:support@attire.com" className="text-primary hover:underline">
                support@attire.com
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }