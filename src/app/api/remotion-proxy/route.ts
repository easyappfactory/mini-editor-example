import { NextRequest, NextResponse } from 'next/server';

const REMOTION_DEV_SERVER = process.env.REMOTION_DEV_SERVER_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${REMOTION_DEV_SERVER}${searchParams ? `?${searchParams}` : ''}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': request.headers.get('accept') || '*/*',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('text/html')) {
      let html = await response.text();
      
      const origin = request.nextUrl.origin;
      const baseUrl = `${origin}/api/remotion-proxy/`;
      
      if (!html.includes('<base')) {
        html = html.replace(
          '<head>',
          `<head><base href="${baseUrl}">`
        );
      }
      
      html = html.replace(/src="\/([^"]+)"/g, 'src="$1"');
      html = html.replace(/href="\/([^"]+)"/g, 'href="$1"');
      
      return new NextResponse(html, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Remotion proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Remotion dev server' },
      { status: 500 }
    );
  }
}
