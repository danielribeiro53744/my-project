import { userSchema } from "@/lib/schemas/user";
import { db } from "@vercel/postgres";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";


export async function POST(req: Request) {
    try {
      const client = await db.connect();
      const body = await req.json();
      const validatedData = userSchema.parse(body);
      
      // Check if user exists
      const { rows } = await client.sql`
        SELECT * FROM users 
        WHERE data->>'email' = ${validatedData.email}
        LIMIT 1
      `;
      
      if (rows.length > 0) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }
      
      // Hash password
      const hashedPassword = await hash(validatedData.password, 12);
      
      // Create new user with empty cart if not provided
      const newUser = {
        id: crypto.randomUUID(),
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        cart: validatedData.cart || [], // Ensure cart exists
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to database
      await client.sql`
        INSERT INTO users (data)
        VALUES (${JSON.stringify(newUser)})
      `;
      
      client.release();
      
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return NextResponse.json(userWithoutPassword);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors },
          { status: 400 }
        );
      }
      
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to user management
 * 
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Register a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *                 example: strongpassword123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: The user's role. Default is `user`.
 *                 example: user
 *               cart:
 *                 type: array
 *                 description: List of products added to the cart.
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           description: The unique identifier for the product.
 *                         name:
 *                           type: string
 *                           description: Name of the product.
 *                         price:
 *                           type: number
 *                           format: float
 *                           description: Price of the product.
 *                         category:
 *                           type: string
 *                           description: The category of the product.
 *                         images:
 *                           type: array
 *                           items:
 *                             type: string
 *                             format: uri
 *                             description: URLs for the product images.
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product.
 *                       example: 1
 *                     size:
 *                       type: string
 *                       description: Size of the product (e.g., S, M, L, XL).
 *                       example: M
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique identifier of the created user.
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 name:
 *                   type: string
 *                   description: The user's full name.
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The user's email address.
 *                   example: johndoe@example.com
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *                   description: The user's role.
 *                   example: user
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
 *                       size:
 *                         type: string
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       409:
 *         description: User already exists
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

