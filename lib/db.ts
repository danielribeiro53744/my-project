
import { db } from '@vercel/postgres';

export async function getClient() {
  return await db.connect();
}