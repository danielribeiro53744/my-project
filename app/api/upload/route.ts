import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Allowed image types and max size (4.5MB for Vercel Blob free tier)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB

export async function POST(request: Request) {
  try {

    // 2. Get file from form data
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const userId = formData.get('name') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' }, 
        { status: 400 }
      );
    }

    // 3. File validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // 4. Generate unique filename
    const filename = `${userId}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // 5. Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true // Prevents filename collisions
    });
    // 6. Return success response
    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname
    });

  } catch (error) {
    console.error('Blob upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}