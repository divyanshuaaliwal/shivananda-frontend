import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

// Get all blogs for listing
export async function GET(request: NextRequest) {
  try {
    // Fetch blog data from backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const response = await fetchWithRetry(`${backendUrl}/api/blogs?page=1&limit=100`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
      retries: 3,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch blogs' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const blogs = data.data.blogs || [];

    // Transform blogs data for the frontend component
    const transformedBlogs = blogs.map((blog: any) => ({
      BlogLink: `/Blog/${blog.slug}`,
      BlogImg: blog.image || blog.bgImage || '/images/default-blog.jpg',
      BlogTitle: blog.name,
      BlogDate: blog.publishDate || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      BlogDesc: blog.description || blog.overview?.substring(0, 150) + '...',
      BlogBtn: 'Read More',
    }));

    return NextResponse.json({
      content: {
        items: transformedBlogs
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
