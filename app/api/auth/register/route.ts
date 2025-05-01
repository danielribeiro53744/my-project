import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@vercel/postgres';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin'])
});


export async function POST(req: Request) {
  try {
    const client = await db.connect();
    const body = await req.json();
    const validatedData = userSchema.parse(body);
    
    // Check if user already exists
    const { rows } = await client.sql`
      SELECT * FROM users 
      WHERE data->>'email' = ${validatedData.email}
      LIMIT 1
    `;
    if (rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 404 }
      );
    }
    // Hash password
    const hashedPassword = await hash(validatedData.password, 12);
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role,
      createdAt: new Date().toISOString()
    };
    
    // Save to BD
    try {
      await client.sql`
        INSERT INTO users (data)
        VALUES (${JSON.stringify(newUser)})
      `;
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Postgres error:', error);
      return NextResponse.json(
        { error: 'Failed to save users' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
    // Return success without password
    const { password, ...userWithoutPassword } = newUser;
    console.log('UserWithoutPassword:', userWithoutPassword)
    return NextResponse.json(userWithoutPassword);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#User'
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */

