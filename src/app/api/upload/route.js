export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return Response.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json(
        { success: false, message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { success: false, message: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Forward the file to the backend
    const backendFormData = new FormData();
    backendFormData.append('image', file);

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

    const response = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      body: backendFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: result.message || 'Upload failed',
          error: result.error
        },
        { status: response.status }
      );
    }

    return Response.json(result);

  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    success: true,
    message: 'File upload endpoint is available',
    maxSize: '5MB',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  });
}
