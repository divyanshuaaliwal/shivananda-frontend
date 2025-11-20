import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const response = await axios.get(`${base}/api/projects`, { timeout: 30000 });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: error?.response?.status || 500 }
    );
  }
}


