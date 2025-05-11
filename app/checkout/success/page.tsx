"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/stores/cart'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const orderId = searchParams.get('order_id')
    if (!sessionId) {
      router.push('/cart')
      return
    }

    // Verify payment status
    fetch(`/api/checkout/success?session_id=${sessionId}&order_id=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          clearCart()
        } else {
          setStatus('error')
        }
      })
      .catch(() => {
        setStatus('error')
      })
  }, [searchParams, clearCart, router])

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Verifying your payment...</h1>
          <p className="text-muted-foreground">Please wait while we confirm your order.</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 text-center">
        <div className="max-w-md mx-auto">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't process your payment. Please try again or contact support if the problem persists.
          </p>
          <Button onClick={() => router.push('/cart')} className="w-full">
            Return to Cart
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16 text-center">
      <div className="max-w-md mx-auto">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-4">Thank You for Your Purchase!</h1>
        <p className="text-muted-foreground mb-8">
          Your order has been successfully processed. You will receive an email confirmation shortly.
        </p>
        <Button onClick={() => router.push('/shop')} className="w-full">
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}