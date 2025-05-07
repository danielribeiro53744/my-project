// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@vercel/postgres';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 200 }
      );
    }
    console.log('session route')
    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log(payload)
    // Get user from database to ensure they still exist
    const client = await db.connect();
    const { rows } = await client.sql`
      SELECT data FROM users 
      WHERE data->>'id' = ${payload.id as string}
      LIMIT 1
    `;
    console.log(rows.length)
    if (rows.length === 0) {
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 200 }
      );
    }

    const user = rows[0].data;
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      isAuthenticated: true,
      user: userWithoutPassword
    });

  } catch (error) {
    // Token verification failed or other error
    return NextResponse.json(
      { isAuthenticated: false, user: null },
      { status: 200 }
    );
  }
}

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Check user session
 *     description: Verifies if the user is authenticated by checking the JWT token.
 *     responses:
 *       200:
 *         description: Session status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                   description: Whether the user is authenticated.
 *                 user:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     role:
 *                       type: string
 *                       enum: [user, admin]
 *                   description: User details if authenticated, null otherwise.
 */