import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validate the request body
const statusSchema = z.object({
  status: z.enum(['pending', 'completed', 'cancelled']),
});

// PUT /api/orders/[orderId]/status
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const client = await db.connect();
    const body = await req.json();

    const { status } = statusSchema.parse(body);

    // Fetch the existing order
    const { rows } = await client.sql`
      SELECT * FROM orders WHERE id = ${id} LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = rows[0].data;

    // Update the order's status
    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    };

    await client.sql`
      UPDATE orders
      SET data = ${JSON.stringify(updatedOrder)}
      WHERE id = ${id}
    `;

    client.release();

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
