// types/session.ts or at the top of your jwt.ts file
export type SessionPayload = {
    userId: string
    email?: string
    role?: 'user' | 'admin'
    // add anything else you want to store in the JWT
  }