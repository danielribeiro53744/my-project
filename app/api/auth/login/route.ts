import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import { z } from 'zod';
import { db } from '@vercel/postgres';
import { Rows } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const DB_PATH = path.join(process.cwd(), 'data/users.json');
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await db.connect();
    const validatedData = loginSchema.parse(body);

    const { rows } = await client.sql`
    SELECT * FROM users 
    WHERE data->>'email' = ${validatedData.email}
    LIMIT 1
    `;
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    // console.log(rows)
    const user = rows.length === 0 ? null : rows[0].data;  //Because LIMIT 1, and can only exist 1 user.email
    
    const isPasswordValid = await compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT
    const token = await new SignJWT({ 
      id: user.id,
      email: user.email,
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    const { password, ...userWithoutPassword } = user;
    
    // In your login endpoint (after successful auth)
    const response = NextResponse.json({
      user: userWithoutPassword,
      token // Still return token for clients that need it
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, //error
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to user authentication and management
 * 
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticates a user with email and password and returns a JWT token if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User authenticated successfully and JWT token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: Unique identifier of the user.
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The user's email address.
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                       description: The user's role in the system.
 *                 token:
 *                   type: string
 *                   description: The generated JWT token for the user.
 *       400:
 *         description: Invalid input data (e.g., incorrect email or password format).
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
 *       401:
 *         description: Invalid credentials (incorrect email or password).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
