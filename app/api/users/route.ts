import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";


export async function GET() {
    const client = await db.connect();
  
    try {
      const { rows } = await client.sql`
        SELECT * FROM users
        ORDER BY created_at DESC
        LIMIT 1
      `;
      return NextResponse.json(rows[0]?.data || []);
    } catch (error) {
      console.error('Postgres error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  }