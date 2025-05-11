import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@vercel/postgres';
import { formDataUserSchema } from '@/lib/schemas/userDataForm';


// Schema for FormData requests (image is File instead of URL)

export async function POST(req: Request) {
  try {
    const client = await db.connect();
    // const contentType = req.headers.get('content-type');

    let validatedData;
    let imageUrl: string | null = null;

    // Handle FormData (for file uploads)
    // if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      // const formDataObj = Object.fromEntries(formData.entries());
      // Convert FormData to structured object
      const formDataValues = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        image: formData.get('image') as string | null
      };
      validatedData = formDataUserSchema.parse(formDataValues);
      // Handle image upload if provided
      if (validatedData.image) {
        imageUrl = validatedData.image;
      }
    // } 
    // // Handle JSON data
    // else {
    //   const body = await req.json();
    //   validatedData = jsonUserSchema.parse(body);
    //   imageUrl = validatedData.image || null;
    // }

    // Check if user already exists
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
    
    // Check for admin email
    const role = validatedData.email === 'teste@gmail.com' ? 'admin' : 'user';
    
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role,
      image: imageUrl,
      createdAt: new Date().toISOString()
    };
    
    // Save to database
    try {
      await client.sql`
        INSERT INTO users (data)
        VALUES (${JSON.stringify(newUser)})
      `;
    } catch (error) {
      console.error('Postgres error:', error);
      return NextResponse.json(
        { error: 'Failed to save user' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
    
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
    
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               image:
 *                 type: string
 *                 format: uri
 *                 description: URL or base64 string for profile image (optional)
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
