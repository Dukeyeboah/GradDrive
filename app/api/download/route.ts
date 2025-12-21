import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileUrl = searchParams.get('url');
  const filename = searchParams.get('filename');

  if (!fileUrl) {
    return NextResponse.json({ error: 'Missing file URL' }, { status: 400 });
  }

  try {
    // Fetch the file from Firebase Storage (server-side, no CORS issues)
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'GradDrive-Downloader/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Get the file as a blob
    const blob = await response.blob();

    // Return the file with proper download headers
    return new NextResponse(blob, {
      headers: {
        'Content-Type': blob.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${
          filename || 'download'
        }"`,
        'Content-Length': blob.size.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}
