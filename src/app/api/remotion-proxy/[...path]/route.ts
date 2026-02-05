import { NextRequest, NextResponse } from 'next/server';

const REMOTION_DEV_SERVER = process.env.REMOTION_DEV_SERVER_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const path = resolvedParams.path?.join('/') || '';
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${REMOTION_DEV_SERVER}/${path}${searchParams ? `?${searchParams}` : ''}`;

    console.log(`[Proxy] GET ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': request.headers.get('accept') || '*/*',
        'User-Agent': request.headers.get('user-agent') || 'Next.js Proxy',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const data = await response.arrayBuffer();

    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };

    if (contentType.includes('javascript') || contentType.includes('css')) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    }

    const etag = response.headers.get('etag');
    if (etag) headers['ETag'] = etag;

    const lastModified = response.headers.get('last-modified');
    if (lastModified) headers['Last-Modified'] = lastModified;

    return new NextResponse(data, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Remotion proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Remotion dev server' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const path = resolvedParams.path?.join('/') || '';
    const body = await request.text();
    const targetUrl = `${REMOTION_DEV_SERVER}/${path}`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
      body,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
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
