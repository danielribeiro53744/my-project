//import { SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/objects/session'

const secretKey = process.env.SESSION_SECRET
//const encodedKey = new TextEncoder().encode(secretKey)

export interface User {
    name: string;
    passwordHash: string;
    email: string;
    isAdmin?: boolean;
  }
   
  
  // You should use a different name than the interface (avoid naming conflict)
  export function createUser(): User {
    return {
      name: 'teste',
      passwordHash: 'teste',
      email: 'teste@example.com',
      isAdmin: false,
    };
  }
  export function createAdmin(): User {
    return {
      name: 'teste',
      passwordHash: 'teste',
      email: 'teste@example.com',
      isAdmin: false,
    };
  }

  // export async function User(name: string, password: string, email: string): Promise<User> {
  //   // const passwordHash = await encrypt({userId: password})
  //   return {
  //     name,
  //     passwordHash : password,
  //     email,
  //     isAdmin: name === 'teste',
  //   };
  // }
    export async function User(name: string, password: string, email: string, role: string): Promise<User> {
      // const passwordHash = await encrypt({userId: password})
      if(role === "admin"){
        return {
          name,
          passwordHash : password,
          email,
          isAdmin: true,
        };
      }else {
        return {
          name,
          passwordHash : password,
          email,
          isAdmin: false,
        };
      }
    
  }
  
  function greet(person: User) {
    return "Hello " + person.name;
  }



   
  // export async function encrypt(payload: SessionPayload) {
  //   return new SignJWT(payload)
  //     .setProtectedHeader({ alg: 'HS256' })
  //     .setIssuedAt()
  //     .setExpirationTime('7d')
  //     .sign(encodedKey)
  // }
   
  // export async function decrypt(session: string | undefined = '') {
  //   try {
  //     const { payload } = await jwtVerify(session, encodedKey, {
  //       algorithms: ['HS256'],
  //     })
  //     return payload
  //   } catch (error) {
  //     console.log('Failed to verify session')
  //   }
  // }
  
