// Next.js API route to proxy admin requests to backend
import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_API_BASE_UR = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const backendUrl = `${NEXT_PUBLIC_API_BASE_UR}/api/admin/products${searchParams ? `?${searchParams}` : ''}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const backendUrl = `${NEXT_PUBLIC_API_BASE_UR}/api/admin/products`;

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin products DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
