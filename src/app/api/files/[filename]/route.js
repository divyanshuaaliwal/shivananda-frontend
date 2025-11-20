export async function GET(request, { params }) {
  try {
    const { filename } = await params;

    if (!filename) {
      return Response.json(
        { success: false, message: 'Filename is required' },
        { status: 400 }
      );
    }

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

    // Fetch file from backend GridFS
    const response = await fetch(`${backendUrl}/api/files/${filename}`, {
      method: 'GET',
    });

    if (!response.ok) {
      return Response.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }

    // Get the file blob
    const blob = await response.blob();
    
    // Get content type from backend response
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('content-disposition');

    // Create response with proper headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    if (contentDisposition) {
      headers.set('Content-Disposition', contentDisposition);
    }

    return new Response(blob, {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error('File retrieval error:', error);
    return Response.json(
      {
        success: false,
        message: 'Error retrieving file',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
