export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/products/coating-navbar?t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching coating navbar products:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch coating navbar products',
      },
      { status: 500 }
    );
  }
}
