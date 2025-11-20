import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/content/products/listing`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: error.response?.status || 500 }
    );
  }
}
