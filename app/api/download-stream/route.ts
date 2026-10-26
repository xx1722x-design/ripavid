import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'URL parameter required' },
        { status: 400 }
      );
    }

    console.log(`📥 다운로드 리다이렉트: ${videoUrl.substring(0, 100)}`);

    // 유저를 실제 영상 URL로 직접 302 리다이렉트
    // Vercel의 10초 타임아웃을 우회하고 트래픽 제한을 피함
    return NextResponse.redirect(videoUrl, { status: 302 });
  } catch (error) {
    console.error(`❌ 리다이렉트 오류:`, error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Redirect failed' },
      { status: 500 }
    );
  }
}
