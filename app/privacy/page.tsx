export default function PrivacyPolicyPage() {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Last updated: February 15, 2025
            </p>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                At Attire, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our website or make a purchase.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Name and contact information</li>
                <li>Billing and shipping address</li>
                <li>Payment information</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Purchase history</li>
              </ul>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Process your orders and payments</li>
                <li>Communicate with you about your orders</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
              </ul>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell or rent your personal information to third parties. We may share your 
                information with service providers who assist us in operating our website, conducting 
                our business, or serving our users.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to maintain the safety 
                of your personal information. However, no Internet-based site can be 100% secure, and 
                we cannot guarantee the absolute security of your information.
              </p>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to our use of your information</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>
            </section>
  
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@attire.com" className="text-primary hover:underline">
                  privacy@attire.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    )
  }