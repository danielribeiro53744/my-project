// app/api/client-id/route.ts
export async function GET() {
    // const client = process.env.GOOGLE_CLIENT_ID
    return Response.json({ 
      clientId: process.env.GOOGLE_CLIENT_ID || ''
    });
  }