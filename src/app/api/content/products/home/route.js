import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/content/products/home`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch home products' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/content/products/home`,
      body
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save home products', message: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
