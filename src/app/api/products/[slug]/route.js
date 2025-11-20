// Next.js API route to find product by slug
import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_API_BASE_UR = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const backendUrl = `${NEXT_PUBLIC_API_BASE_UR}/api/products/${slug}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to find product' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Find product by slug API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
