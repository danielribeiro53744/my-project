import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';
import { z } from 'zod';
import { db } from '@vercel/postgres';
import { formSchema } from '@/lib/schemas/loginForm';


// === JWT Secret ===
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

// === JWT Sign Function ===
async function generateJWT(user: { id: string, email: string, role: string }) {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

// === POST /api/auth/login ===
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = formSchema.parse(body);

    const client = await db.connect();

    const { rows } = await client.sql`
      SELECT * FROM users 
      WHERE data->>'email' = ${validatedData.email}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = rows[0].data;

    const isPasswordValid = await compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await generateJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      user: {
        id: userWithoutPassword.id,
        name: userWithoutPassword.name,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        image: userWithoutPassword.image || null, // Include image URL
      },
      token, // JWT token for API clients (optional)
    });

    // Set Secure Cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Login error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                     image:
 *                       type: string
 *                       format: uri
 *                       description: URL or base64 string for profile image (optional)
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid input data (e.g., email format or password too short).
 *       401:
 *         description: Invalid credentials (incorrect email or password).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
