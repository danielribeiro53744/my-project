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
      WHERE id = ${orderId}
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
      WHERE id = ${orderId}
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

/**
 * @swagger
 *  tags:
 *   - name: Orders
 *     description: Operations related to orders management
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get a specific order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
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
 *
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Delete an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
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
