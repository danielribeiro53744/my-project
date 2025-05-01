import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { db } from '@vercel/postgres';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin'])
});

// const DB_PATH = path.join(process.cwd(), 'data/users.json');

// async function ensureDBExists() {
//   try {
//     await fs.access(path.dirname(DB_PATH));
//   } catch {
//     await fs.mkdir(path.dirname(DB_PATH));
//   }
  
//   try {
//     await fs.access(DB_PATH);
//   } catch {
//     await fs.writeFile(DB_PATH, JSON.stringify([]));
//   }
// }

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
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    // console.log(rows)
    const user = rows[0].data;  //Because LIMIT 1, and can only exist 1 user.email

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
      // return NextResponse.json({ success: true });
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