import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { Blog } from '@/app/types/blog';

// Get blog data by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // console.log('API Route called with slug:', slug);

  try {

    // Fetch blog data from backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/blogs/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!data.data || !data.data.blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const blog = data.data.blog;

    // Fetch all blogs for related posts
    const allBlogsResponse = await fetch(`${backendUrl}/api/blogs?page=1&limit=100`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let relatedPosts: Blog[] = [];
    if (allBlogsResponse.ok) {
      const allBlogsData = await allBlogsResponse.json();
      const otherBlogs = allBlogsData.data.blogs.filter((b: Blog) => b.slug !== slug);
      const shuffled = [...otherBlogs].sort(() => 0.5 - Math.random());
      relatedPosts = shuffled.slice(0, 3);
    }

    // Calculate read time
    const wordCount = blog.overview?.split(/\s+/).length || 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Use the publishDate from the blog data
    const publishDate = blog.publishDate || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return NextResponse.json({
      blog,
      relatedPosts,
      readTime,
      publishDate
    });
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog data' },
      { status: 500 }
    );
  }
}
