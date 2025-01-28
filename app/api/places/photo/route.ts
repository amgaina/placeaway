import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

  if (!reference) {
    return new NextResponse('Missing photo reference', { status: 400 });
  }

  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${reference}&key=${API_KEY}`;

  try {
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
      },
    });
  } catch (error) {
    return new NextResponse('Failed to fetch photo', { status: 500 });
  }
}
