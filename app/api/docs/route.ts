// app/api/docs/route.ts
import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/action/swaggerConfig';

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
