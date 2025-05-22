// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositorys/user';
import { formDataUserSchema } from '@/lib/schemas/userDataForm';
import { z } from 'zod';
import { User } from 'lucide-react';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const formDataValues = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      image: formData.get('image') as string | null
    };

    const validatedData = formDataUserSchema.parse(formDataValues);

    // Verifica se o usuário já existe
    const existingUser = await UserRepository.findByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const createdUser = await UserRepository.createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      role:"user",
      cart: []
    });

    return NextResponse.json(createdUser);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
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
