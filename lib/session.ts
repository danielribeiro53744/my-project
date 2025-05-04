'use server';
import { serialize, parse }  from 'cookie'
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { User } from '@/lib/user'
import { Cookie } from '@/objects/cookie'

import { cookies } from 'next/headers';

export async function createSession(user: User,req: NextRequest, maxAge = 604800 ) { //validate if is admin
  // Validate user object exists and has required properties
  if (!user || typeof user.name !== 'string' || typeof user.role !== 'boolean') {
    throw new Error('Invalid user object');
}
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    // 1. Create a session in the database
    //   const data = await db
    //   .insert(sessions)
    //   .values({
    //     userId: id,
    //     expiresAt,
    //   })
    //   // Return the session ID
    //   .returning({ id: sessions.id })

    // const sessionId = data[0].id

    // 2. Encrypt the session IDy
    
    // const passwordHash = await encrypt({userId: user.password})


    // Validate cookie insertion
    let cookie = await readCookie('session_token', req);
    console.log('Cookie', cookie)
    if (cookie){ //if exists
      if(cookie.name !== user?.name) { // if its different
        try {
            let newCookie = await Cookie(user.name,user.role)
            return updateCookies('session_token', JSON.stringify(newCookie), expiresAt, 'Logged in');
        } catch (error) {
            console.error('Failed to update session cookie:', error);
            return new NextResponse(
              JSON.stringify({ message: 'Failed to update session cookie' }),
              {
                status: 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
        }
      }
      return new NextResponse(
        JSON.stringify({ message: 'Already exists cookie' , user: cookie}),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
    // if doesn't exists cookie
    try {
      let newCookie = await Cookie(user.name,user.role)
      return updateCookies('session_token', JSON.stringify(newCookie), expiresAt, 'Logged in');
    } catch (error) {
        console.error('Failed to update session cookie:', error);
        return new NextResponse(
          JSON.stringify({ message: 'Failed to update session cookie' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
    }
  }

  
  export async function updateSession(newSessionToken: string) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000); // 1 week expiration
    return updateCookies('session_token', newSessionToken, expiresAt, 'Session updated') //try | catch
  }
  
  export async function deleteSession() {
    return updateCookies('session_token', '', new Date(Date.now()), 'Session deleted') //try | catch
  }
  
  export async function updateCookies(name: string, value: string, expires: Date, successMessage: string){
    // (await cookies()).set('session_token',value, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   expires,
    //   path: '/',
    // });
    const cookie = serialize(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expires,
    })
    // Send cookie in header
    return new NextResponse(
      JSON.stringify({ message: successMessage, user: cookie }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  
  export async function readCookie(name: string, req: NextRequest) {
    const rawCookie = parse(req.headers.get('cookie') || '')[name];
  
    if (!rawCookie) return null;
  
    try {
      return JSON.parse(rawCookie) as Cookie;
    } catch (err) {
      console.error('Failed to parse cookie', err);
      return null;
    }
  }
  
