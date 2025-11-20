export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video');

    if (!file) {
      return Response.json(
        { success: false, message: 'No video file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return Response.json(
        { success: false, message: 'Only video files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return Response.json(
        { success: false, message: 'Video file must be less than 100MB' },
        { status: 400 }
      );
    }

    // Forward the file to the backend
    const backendFormData = new FormData();
    backendFormData.append('video', file);

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

    const response = await fetch(`${backendUrl}/api/upload/video`, {
      method: 'POST',
      body: backendFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: result.message || 'Video upload failed',
          error: result.error
        },
        { status: response.status }
      );
    }

    return Response.json(result);

  } catch (error) {
    console.error('Video upload error:', error);
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
    message: 'Video upload endpoint is available',
    maxSize: '100MB',
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
  });
}
