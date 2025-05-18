import { OrderRepository } from '@/lib/repositorys/order';
import { orderSchema } from '@/lib/schemas/order';
import { db } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
// POST /api/orders
export async function POST(req: Request) {
  try {
    const order = await req.json();
    // const validatedOrder = orderSchema.parse(order);

    // const orderDTO = {
    //   userId: order.userId,
    //   items: order.items.map((item: { product: { id: any; }; quantity: any; size: any; }) => ({
    //     productId: item.product.id,
    //     quantity: item.quantity,
    //     size: item.size
    //   })),
    //   total: order.total,
    //   status: order.status,
    //   shippingAddress: order.shippingAddress,
    //   paymentIntentId: order.paymentIntentId ?? null,
    // };

    const newOrderId = await OrderRepository.createOrder(order);
    
    return NextResponse.json(newOrderId, { status: 201 });
  } catch (error) {
    // if (error instanceof z.ZodError) {
    //   return NextResponse.json({ error: error.errors }, { status: 400 });
    // }
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
// GET /api/admin/orders
export async function GET(req: Request) {
  try {
    const orders = await OrderRepository.getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ADMIN_ORDERS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
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
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   userId:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/CartItem'
 *                   total:
 *                     type: number
 *                   status:
 *                     type: string
 *                   shippingAddress:
 *                     $ref: '#/components/schemas/ShippingAddress'
 *                   paymentIntentId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: Unauthorized access
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
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               format: uuid
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
 * components:
 *   schemas:
 *     ShippingAddress:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - city
 *         - country
 *         - postalCode
 *       properties:
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *         postalCode:
 *           type: string
 *
 *     ProductColor:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         hex:
 *           type: string
 *           pattern: '^#([0-9A-Fa-f]{3}){1,2}$'
 *
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - price
 *         - category
 *         - gender
 *         - sizes
 *         - colors
 *         - images
 *         - featured
 *         - isBestSeller
 *         - isNewArrival
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           minimum: 0
 *         discountPrice:
 *           type: number
 *           minimum: 0
 *         category:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [men, women, unisex]
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *         colors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductColor'
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *         featured:
 *           type: boolean
 *         isBestSeller:
 *           type: boolean
 *         isNewArrival:
 *           type: boolean
 *
 *     CartItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - size
 *       properties:
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         quantity:
 *           type: integer
 *           minimum: 1
 *         size:
 *           type: string
 *
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - items
 *         - total
 *         - shippingAddress
 *       properties:
 *         userId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         total:
 *           type: number
 *           minimum: 0
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           default: pending
 *         shippingAddress:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         paymentIntentId:
 *           type: string
 */
