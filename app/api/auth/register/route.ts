import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin'])
});

const DB_PATH = path.join(process.cwd(), 'data/users.json');

async function ensureDBExists() {
  try {
    await fs.access(path.dirname(DB_PATH));
  } catch {
    await fs.mkdir(path.dirname(DB_PATH));
  }
  
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([]));
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = userSchema.parse(body);
    
    await ensureDBExists();
    
    const users = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
    
    // Check if user already exists
    if (users.some((user: any) => user.email === validatedData.email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
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
    
    // Save to file
    users.push(newUser);
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
    // Return success without password
    const { password, ...userWithoutPassword } = newUser;
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