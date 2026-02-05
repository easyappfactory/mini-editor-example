import { NextRequest } from 'next/server';

const REMOTION_DEV_SERVER = process.env.REMOTION_DEV_SERVER_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  const targetUrl = `${REMOTION_DEV_SERVER}/api/update-available`;
  const body = await request.text();
  
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    },
    body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'application/json',
    },
  });
}
