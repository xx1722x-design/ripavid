import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

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

    // 영상 스트림 fetch
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`❌ 스트림 fetch 실패: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch stream: ${response.status}` },
        { status: response.status }
      );
    }

    // 파일명 생성
    const cleanTitle = title
      .replace(/[<>:"/\\|?*]/g, '_')
      .substring(0, 100)
      .trim();

    const filename = `[RipAVid] ${cleanTitle} - ${resolution}.${ext}`;

    console.log(`✅ 스트림 전송 시작: ${filename}`);

    // 강제 다운로드 헤더 설정
    const contentType = response.headers.get('content-type') || 'video/mp4';
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

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
    console.error(`❌ 스트림 다운로드 오류:`, error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Stream download failed' },
      { status: 500 }
    );
  }
}
