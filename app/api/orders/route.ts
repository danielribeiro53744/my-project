import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const shippingAddressSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string()
});

const productSchema = z.object({
  id: z.string(),//.uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  category: z.string(),
  gender: z.enum(['men', 'women', 'unisex']),
  sizes: z.array(z.string()),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/) // hex color format validation
  })),
  images: z.array(z.string().url()),
  featured: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean()
});

const cartItemSchema = z.object({
  product: productSchema,
  quantity: z.number().int().positive(),
  size: z.string() // Could also use z.enum(['S', 'M', 'L', 'XL']) for specific sizes
});

const orderSchema = z.object({
  userId: z.string(),//.uuid(),
  items: z.array(cartItemSchema),
  total: z.number().positive(),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  shippingAddress: shippingAddressSchema,
  paymentIntentId: z.string().optional()
});

// POST /api/orders
export async function POST(req: Request) {
  try {
   
    const client = await db.connect();
    const body = await req.json();
    const validatedOrder = orderSchema.parse(body);

    const orderDTO = {
      userId: validatedOrder.userId,
      items: validatedOrder.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.size
      })),
      total: validatedOrder.total,
      status: validatedOrder.status,
      shippingAddress: validatedOrder.shippingAddress,
      paymentIntentId: validatedOrder.paymentIntentId ?? null,
    };

    const newOrder = {
      // id: crypto.randomUUID(),
      ...orderDTO,
      // createdAt: new Date().toISOString()
    };

  //   await client.sql`
  //   CREATE TABLE IF NOT EXISTS orders (
  //     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  //     data JSONB
  //   )
  // `;

      // Insert the order
      const resp = await client.sql`
      INSERT INTO orders (data)
      VALUES (${JSON.stringify(newOrder)})
      RETURNING id
      `;
    client.release();
    const newOrderId = resp.rows[0].id;
    return NextResponse.json(newOrderId, { status: 201 });

  } catch (error) {
    // if (error instanceof z.ZodError) {
    //   return NextResponse.json({ error: error.errors }, { status: 400 });
    // }
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
