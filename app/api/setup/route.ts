import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await db.connect();
  
  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    return NextResponse.json({ message: 'Table created' });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    client.release();
  }
}