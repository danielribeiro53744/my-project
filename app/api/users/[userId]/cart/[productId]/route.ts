import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PUT(
    req: Request,
    { params }: { params: { userId: string; productId: string } }
  ) {
    try {
      const client = await db.connect();
      const { userId, productId } = params;
      const { quantity, size } = z.object({
        quantity: z.number().int().positive().optional(),
        size: z.string().optional()
      }).parse(await req.json());
      
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
      
      const itemIndex = currentCart.findIndex(
        (i: any) => i.product.id === productId
      );
      
      if (itemIndex === -1) {
        client.release();
        return NextResponse.json(
          { error: 'Item not found in cart' },
          { status: 404 }
        );
      }
      
      const updatedCart = [...currentCart];
      
      // Update quantity if provided
      if (quantity !== undefined) {
        updatedCart[itemIndex].quantity = quantity;
      }
      
      // Update size if provided
      if (size !== undefined) {
        updatedCart[itemIndex].size = size;
      }
      
      // Verify no duplicate product/size combination
      const duplicateItem = updatedCart.find(
        (item, index) => 
          item.product.id === productId && 
          item.size === updatedCart[itemIndex].size &&
          index !== itemIndex
      );
      
      if (duplicateItem) {
        client.release();
        return NextResponse.json(
          { error: 'Same product with this size already exists in cart' },
          { status: 400 }
        );
      }
      
      // Update user
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
      
      return NextResponse.json(updatedCart[itemIndex]);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors },
          { status: 400 }
        );
      }
      
      console.error('Error updating cart item:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  /**
 * @swagger
 * /api/users/{userId}/cart/{productId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update item in user's cart
 *     description: Updates the quantity and/or size of a specific product in the user's cart.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product in the cart
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: New quantity (optional)
 *                 example: 2
 *               size:
 *                 type: string
 *                 description: New size (optional)
 *                 example: "M"
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                 quantity:
 *                   type: integer
 *                 size:
 *                   type: string
 *       400:
 *         description: Validation error or duplicate size conflict
 *       404:
 *         description: User or item not found in cart
 *       500:
 *         description: Internal server error
 */
