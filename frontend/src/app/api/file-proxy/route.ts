import { NextRequest } from 'next/server';
import { API_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');
  if (!urlParam) {
    return new Response('Missing url parameter', { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return new Response('Invalid url parameter', { status: 400 });
  }

  // Only allow proxying files from our backend /files/*
  try {
    const api = new URL(API_URL);
    const sameOrigin = target.origin === api.origin;
    const isFilesPath = target.pathname.startsWith('/files/');
    if (!sameOrigin || !isFilesPath) {
      return new Response('Forbidden target', { status: 400 });
    }
  } catch {
    // If API_URL is malformed, reject
    return new Response('Server misconfiguration', { status: 500 });
  }

  const backendRes = await fetch(target.toString(), { cache: 'no-store' });
  if (!backendRes.ok) {
    const text = await backendRes.text().catch(() => '');
    return new Response(text || 'Upstream error', { status: backendRes.status });
  }

  let contentType = backendRes.headers.get('content-type') || 'application/octet-stream';
  // Force application/pdf for .pdf files if backend doesn't provide a specific type
  if (contentType === 'application/octet-stream' && target.pathname.toLowerCase().endsWith('.pdf')) {
    contentType = 'application/pdf';
  }
  const contentDisposition = backendRes.headers.get('content-disposition') || 'inline';

  const body = await backendRes.arrayBuffer();
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition,
      // Avoid caching PDFs aggressively during development
      'Cache-Control': 'no-store'
    }
  });
}
