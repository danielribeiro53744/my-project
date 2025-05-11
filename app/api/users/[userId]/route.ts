import { userSchema } from "@/lib/schemas/user";
import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

  
export async function GET(
    req: Request,
    { params }: { params: { userId: string } }
  ) {
    try {
      const client = await db.connect();
      const { userId } = params;
      
      const { rows } = await client.sql`
        SELECT data FROM users
        WHERE data->>'id' = ${userId}
        LIMIT 1
      `;
      
      client.release();
      
      if (rows.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      const user = rows[0].data;
      
      // Ensure cart exists and has complete product data
      const cartWithProducts = await Promise.all(
        (user.cart || []).map(async (item: any) => {
          // In case you need to fetch fresh product data
          const productRes = await client.sql`
            SELECT * FROM products WHERE id = ${item.product.id}
          `;
          return {
            ...item,
            product: productRes.rows[0] || item.product // Fallback to stored data
          };
        })
      );
      
      const userWithCart = {
        ...user,
        cart: cartWithProducts
      };
      
      // Remove sensitive data
      const { password, ...safeUser } = userWithCart;
      return NextResponse.json(safeUser);
      
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
  export async function PUT(
    req: Request,
    { params }: { params: { userId: string } }
  ) {
    try {
      const client = await db.connect();
      const { userId } = params;
      const body = await req.json();
      
      // Validate input (excluding password)
      const updateSchema = userSchema.omit({ password: true }).partial();
      const validatedData = updateSchema.parse(body);
      
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
      
      const existingUser = rows[0].data;
      
      // Merge updates (preserve existing cart if not provided)
      const updatedUser = {
        ...existingUser,
        ...validatedData,
        cart: validatedData.cart ?? existingUser.cart ?? [], // Keep existing cart if not provided
        updatedAt: new Date().toISOString()
      };
      
      // Update in database
      await client.sql`
        UPDATE users
        SET data = ${JSON.stringify(updatedUser)}
        WHERE data->>'id' = ${userId}
      `;
      
      client.release();
      
      // Return updated user without password
      const { password, ...safeUser } = updatedUser;
      return NextResponse.json(safeUser);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors },
          { status: 400 }
        );
      }
      
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
  /**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Fetch user details by userId
 *     tags: 
 *       - Users
 *     description: Retrieve user information along with their cart details by userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique ID of the user.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                             format: float
 *                           category:
 *                             type: string
 *                           images:
 *                             type: array
 *                             items:
 *                               type: string
 *                               format: uri
 *                       quantity:
 *                         type: integer
 *                         description: Quantity of the product in the cart
 *                       size:
 *                         type: string
 *                         description: Size of the product
 *       404:
 *         description: User not found
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
 *   put:
 *     summary: Update user details by userId
 *     tags: 
 *       - Users
 *     description: Update the user details. You can update name, email, role, and cart, but not the password.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique ID of the user.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                         price:
 *                           type: number
 *                           format: float
 *                         category:
 *                           type: string
 *                         images:
 *                           type: array
 *                           items:
 *                             type: string
 *                             format: uri
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product in the cart
 *                     size:
 *                       type: string
 *                       description: Size of the product
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                             format: float
 *                           category:
 *                             type: string
 *                           images:
 *                             type: array
 *                             items:
 *                               type: string
 *                               format: uri
 *                       quantity:
 *                         type: integer
 *                         description: Quantity of the product in the cart
 *                       size:
 *                         type: string
 *                         description: Size of the product
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                       path:
 *                         type: string
 *       404:
 *         description: User not found
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
