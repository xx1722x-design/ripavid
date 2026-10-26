import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'video.mp4';

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'URL parameter required' },
        { status: 400 }
      );
    }

    console.log(`📥 프록시 다운로드 시작: ${filename}`);

    // 백엔드에서 실제 비디오 파일 fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`❌ 파일 fetch 실패: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch video: ${response.status}` },
        { status: response.status }
      );
    }

    // Content-Type과 Content-Length 유지
    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');

    console.log(`✅ 파일 다운로드 완료: ${filename}`);

    // 강제 다운로드 헤더 설정
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    });

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    // Edge Runtime에서는 response.body (Web ReadableStream)를 직접 전달
    // Edge 환경에서 0KB 에러 없이 안정적으로 스트리밍됨
    if (!response.body) {
      return NextResponse.json(
        { error: 'Empty response body' },
        { status: 500 }
      );
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: headers
    });
  } catch (error) {
    console.error(`❌ 프록시 다운로드 오류:`, error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Download proxy failed' },
      { status: 500 }
    );
  }
}
