import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

export const maxDuration = 120;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');
    const title = searchParams.get('title') || 'video';
    const resolution = searchParams.get('resolution') || '720p';
    const ext = searchParams.get('ext') || 'mp4';

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'URL parameter required' },
        { status: 400 }
      );
    }

    console.log(`📥 스트림 다운로드 시작: [${title}] ${resolution}.${ext}`);

    // YouTube 스트림 fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`❌ 스트림 fetch 실패: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch stream: ${response.status}` },
        { status: response.status }
      );
    }

    // 파일명 생성: [제목] 해상도.확장자
    const cleanTitle = title
      .replace(/[<>:"/\\|?*]/g, '_') // 불가능한 파일명 문자 제거
      .substring(0, 100) // 길이 제한
      .trim();

    const filename = `[RipAVid] ${cleanTitle} - ${resolution}.${ext}`;

    console.log(`✅ 스트림 전송 시작: ${filename}`);

    // Content-Length 및 Content-Type 유지
    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');

    // 강제 다운로드 헤더 설정
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    // Web ReadableStream → Node.js Readable로 변환해서 메모리 없이 다이렉트 스트리밍
    if (!response.body) {
      return NextResponse.json(
        { error: 'Empty response body' },
        { status: 500 }
      );
    }

    // response.body (Web ReadableStream)를 Node.js Readable로 변환
    // 이렇게 하면 메모리에 파일을 올리지 않고 실시간 스트리밍 가능
    const nodeStream = Readable.from(response.body as any);

    return new NextResponse(nodeStream as any, {
      status: 200,
      headers: headers
    });
  } catch (error) {
    console.error(`❌ 스트림 다운로드 오류:`, error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Stream download failed' },
      { status: 500 }
    );
  }
}
