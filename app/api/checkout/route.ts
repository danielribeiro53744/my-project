import { NextResponse } from 'next/server';
// import Stripe from 'stripe';
import { CartItem } from '@/lib/cart';
import { useOrderStore } from '@/lib/orders';
import { useAuth } from '@/lib/auth';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
  try {
    const { items, userId, shippingAddress } = await req.json();
    
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: item.product.images,
        },
        unit_amount: Math.round((item.product.discountPrice || item.product.price) * 100),
      },
      quantity: item.quantity,
    }));

    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: lineItems,
    //   mode: 'payment',
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    //   metadata: {
    //     userId,
    //     items: JSON.stringify(items),
    //     shippingAddress: JSON.stringify(shippingAddress),
    //   },
    // });

     try {
        const orderData = {
            userId,
            items,
            total: items.reduce((sum: number, item: CartItem) => 
              sum + (item.product.discountPrice || item.product.price) * item.quantity, 0),
            status: 'pending',
            shippingAddress,
          //   paymentIntentId: session.payment_intent as string,
          }
              
              const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                //   'Authorization': `Bearer ${useAuth.getState().token}`
                },
                body: JSON.stringify(orderData)
              });
    
              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create order');
              }
    
              const newOrder = await response.json();
            //   set((state) => ({ orders: [...state.orders, newOrder], isLoading: false }));
            return NextResponse.json({ sessionId: 'session', newOrder }); // session.id

            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            //   set({ error: errorMessage, isLoading: false });
              throw new Error(errorMessage);
            }

    // Create pending order
    const { createOrder } = useOrderStore();
    await createOrder({
      userId,
      items,
      total: items.reduce((sum: number, item: CartItem) => 
        sum + (item.product.discountPrice || item.product.price) * item.quantity, 0),
      status: 'pending',
      shippingAddress,
    //   paymentIntentId: session.payment_intent as string,
    });

    return NextResponse.json({ sessionId: 'session' }); // session.id
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}