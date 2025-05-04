import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// GET /api/orders/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await db.connect();
    const orderId = params.id;

    const { rows } = await client.sql`
      SELECT * FROM orders
      WHERE data->>'id' = ${orderId}
      LIMIT 1
    `;

    client.release();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0].data, { status: 200 });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/orders/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await db.connect();
    const orderId = params.id;

    const { rows } = await client.sql`
      DELETE FROM orders
      WHERE data->>'id' = ${orderId}
      RETURNING data
    `;

    client.release();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Order deleted', order: rows[0].data },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
