export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/products/navbar`
    );

    if (response.data.status === 'success') {
      return NextResponse.json(response.data);
    }

    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch navbar products' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error fetching products for navbar:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch navbar products' },
      { status: 500 }
    );
  }
}
