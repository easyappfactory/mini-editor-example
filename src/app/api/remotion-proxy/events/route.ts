import { NextRequest } from 'next/server';

const REMOTION_DEV_SERVER = process.env.REMOTION_DEV_SERVER_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  const targetUrl = `${REMOTION_DEV_SERVER}/events`;
  
  const response = await fetch(targetUrl, {
    method: 'GET',
    headers: {
      'Accept': request.headers.get('accept') || 'text/event-stream',
    },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
