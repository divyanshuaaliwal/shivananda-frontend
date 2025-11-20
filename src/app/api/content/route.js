import { NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const api = axios.create({ 
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  maxContentLength: 100 * 1024 * 1024, // 100MB
  maxBodyLength: 100 * 1024 * 1024, // 100MB
});

function handleError(error, action) {
    const status = error.response?.status || 500;
    const message =
        error.response?.data?.error ||
        `Failed to ${action}`;
    console.error(`${action} error:`, error.message);
    return NextResponse.json({ error: message }, { status });
}

export async function GET() {
    try {
        const { data } = await api.get('/api/content/public');
        return NextResponse.json(data);
    } catch (error) {
        return handleError(error, 'fetch content');
    }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/content`,
      body,
      {
        headers: authHeader ? { Authorization: authHeader } : {},
        timeout: 30000,
      }
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error saving content:', error);
    
    // Enhanced error messages
    let errorMessage = 'Failed to save content';
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to server. Please check if backend is running.';
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}