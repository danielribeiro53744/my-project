export default function TermsPage() {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Last updated: February 15, 2025
            </p>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using our website, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not access our website or use our services.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground">
                The content on our website, including text, graphics, logos, images, and software, 
                is the property of Attire and is protected by copyright and other intellectual property laws.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                When you create an account with us, you must provide accurate and complete information. 
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Maintaining the confidentiality of your account</li>
                <li>Restricting access to your account</li>
                <li>Accepting responsibility for all activities under your account</li>
              </ul>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Products and Pricing</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or discontinue any product without notice. Prices for 
                our products are subject to change without notice. We shall not be liable to you or 
                any third party for any modification, price change, or discontinuance of products.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Order Acceptance</h2>
              <p className="text-muted-foreground">
                We reserve the right to refuse any order you place with us. We may, in our sole 
                discretion, limit or cancel quantities purchased per person, per household, or per order.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Payment Terms</h2>
              <p className="text-muted-foreground">
                We accept various forms of payment, including credit cards and PayPal. By providing 
                payment information, you represent and warrant that you have the legal right to use 
                the payment method you provide.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Shipping and Delivery</h2>
              <p className="text-muted-foreground">
                We are not responsible for delays in delivery due to circumstances beyond our control, 
                including weather conditions, customs processing, or shipping carrier delays.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Returns and Refunds</h2>
              <p className="text-muted-foreground">
                Our return and refund policy is outlined in our Shipping & Returns page. By making 
                a purchase, you agree to be bound by the terms of that policy.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall Attire be liable for any indirect, incidental, special, consequential, 
                or punitive damages arising out of or relating to your use of our website or products.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to update or modify these Terms and Conditions at any time without 
                prior notice. Your continued use of our website following any changes indicates your 
                acceptance of such changes.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                Questions about the Terms and Conditions should be sent to us at{" "}
                <a href="mailto:legal@attire.com" className="text-primary hover:underline">
                  legal@attire.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    )
  }