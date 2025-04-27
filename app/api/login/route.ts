// app/api/login/route.ts (or pages/api/login.ts for pages router)
import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { createSession } from '@/lib/session'
import { User } from '@/objects/user'
import { SignupFormSchema } from '@/lib/definitions'
import { z } from 'zod'

export async function POST(req: NextRequest) { 
  const { name, password, email, role } = await req.json()
  const error = validateUserInput(name, password, email, role); //backend validation
  if (error) {
    return new NextResponse(
      JSON.stringify({ error }),
      { status: 401 }
    );
  }
  let user = await User(name, password, email, role);
  console.log('User:', user)
  return createSession(user, req);
}



function validateUserInput(name: string, password: string, email: string, role: string): string | null { //2nd validation | same
  try {
    // Validate the input using the zod schema
    SignupFormSchema.parse({ name, password, email, role });
    return null; // Input is valid
  } catch (error) {
    // If validation fails, return the first error message
    if (error instanceof z.ZodError) {
      return error.errors[0].message; // Get the first validation error
    }
    return "Unexpected error"; // In case something unexpected happens
  }
}

