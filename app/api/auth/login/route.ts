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
    
    return NextResponse.json({
      user: userWithoutPassword,
      token
    });
    
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