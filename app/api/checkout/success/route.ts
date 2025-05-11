import { NextResponse } from 'next/server';
// import Stripe from 'stripe';
import { useOrderStore } from '@/lib/stores/order';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session to get payment status
    // const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { updateOrderStatus } = useOrderStore.getState();
    const session = { payment_status: 'paid', payment_intent: sessionId };

    if (session.payment_status === 'paid') {
      // Update order status to completed
      await updateOrderStatus(orderId, 'completed');
      return NextResponse.json({ success: true, status: 'completed' });
    } else {
      // Payment failed or is pending
      await updateOrderStatus(session.payment_intent as string, 'cancelled');
      return NextResponse.json({ success: false, status: 'cancelled' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}