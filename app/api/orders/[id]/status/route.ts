import { statusSchema } from '@/lib/schemas/status';
import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

/**
 * @swagger
 *  tags:
 *   - name: Orders
 *     description: Operations related to orders management
 * 
 * /api/orders/{id}/status:
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update the status of an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
