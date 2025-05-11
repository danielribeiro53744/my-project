import { cartItemSchema1 } from "@/lib/schemas/cartItem";
import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(
    req: Request,
    { params }: { params: { userId: string } }
  ) {
    try {
      const client = await db.connect();
      const { userId } = params;
      const item = cartItemSchema1.parse(await req.json());
      
      // Verify product exists (optional but recommended)
      const productExists = await client.sql`
        SELECT * FROM products 
        WHERE id = ${item.id}
      `;
      
      if (productExists.rows.length === 0) {
        client.release();
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      // Get existing user
      const userResult = await client.sql`
        SELECT data FROM users
        WHERE data->>'id' = ${userId}
        LIMIT 1
      `;
      
      if (userResult.rows.length === 0) {
        client.release();
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      const user = userResult.rows[0].data;
      const currentCart = user.cart || [];
      
      // Check if same product with same size already exists in cart
      const existingItemIndex = currentCart.findIndex(
        (i: any) => i.product.id === item.id && i.size === item
      );
      
      let updatedCart;
      if (existingItemIndex >= 0) {
        // Update quantity if same product/size exists
        updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        updatedCart = [...currentCart, item];
      }
      
      // Update user with new cart
      const updatedUser = {
        ...user,
        cart: updatedCart,
        updatedAt: new Date().toISOString()
      };
      
      await client.sql`
        UPDATE users
        SET data = ${JSON.stringify(updatedUser)}
        WHERE data->>'id' = ${userId}
      `;
      
      client.release();
      
      return NextResponse.json(updatedCart);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors },
          { status: 400 }
        );
      }
      
      console.error('Error adding to cart:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  export async function DELETE(
    req: Request,
    { params }: { params: { userId: string } }
  ) {
    try {
      const client = await db.connect();
      const { userId } = params;
      
      // Get existing user
      const { rows } = await client.sql`
        SELECT data FROM users
        WHERE data->>'id' = ${userId}
        LIMIT 1
      `;
      
      if (rows.length === 0) {
        client.release();
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      const user = rows[0].data;
      
      // Update user with empty cart
      const updatedUser = {
        ...user,
        cart: [],
        updatedAt: new Date().toISOString()
      };
      
      await client.sql`
        UPDATE users
        SET data = ${JSON.stringify(updatedUser)}
        WHERE data->>'id' = ${userId}
      `;
      
      client.release();
      
      return NextResponse.json({ success: true });
      
    } catch (error) {
      console.error('Error clearing cart:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
 * @swagger
 * /api/users/{userId}/cart:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add item to user's cart
 *     description: Adds a product to the user's cart. If the product with the same size already exists, the quantity will be updated.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: object
 *                 required:
 *                   - id
 *                   - name
 *                   - description
 *                   - price
 *                   - category
 *                   - gender
 *                   - sizes
 *                   - colors
 *                   - images
 *                   - featured
 *                   - isBestSeller
 *                   - isNewArrival
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   discountPrice:
 *                     type: number
 *                     nullable: true
 *                   category:
 *                     type: string
 *                   gender:
 *                     type: string
 *                     enum: [men, women, unisex]
 *                   sizes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   colors:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         hex:
 *                           type: string
 *                           pattern: ^#([0-9A-Fa-f]{3}){1,2}$
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *                   featured:
 *                     type: boolean
 *                   isBestSeller:
 *                     type: boolean
 *                   isNewArrival:
 *                     type: boolean
 *               quantity:
 *                 type: integer
 *               size:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                   quantity:
 *                     type: integer
 *                   size:
 *                     type: string
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User or product not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/users/{userId}/cart:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Clear user's cart
 *     description: Removes all items from the user's cart.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
