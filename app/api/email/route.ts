
// app/api/client-id/route.ts
export async function GET() {
    // const client = process.env.GOOGLE_CLIENT_ID
    if(process.env.EMAIL_SEND === 'true'){
        return Response.json({ 
            isValide: true
          });
    }else{
        return Response.json({ 
            isValide: false
          });
    }
    
  }