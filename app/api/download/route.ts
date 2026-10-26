import { NextRequest, NextResponse } from 'next/server';

// ⏱️ Vercel 타임아웃 연장 (기본 60초 → 120초)
export const maxDuration = 120;

interface DownloadRequest {
  url: string;
  platform?: string;
}

interface FormatData {
  resolution?: string;
  url?: string;
  ext: string;
  isPremium?: boolean;
}

async function fetchFromSnagaclip(url: string): Promise<any> {
  try {
    console.log('🔄 snagaclip.com 백엔드 요청 시작...');
    console.log('📤 요청 URL:', url);

    const requestBody = { url };
    console.log('📦 요청 Body:', JSON.stringify(requestBody));

    const response = await fetch('http://snagaclip.com:3002/api/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📊 응답 상태:', response.status, response.statusText);

    const responseText = await response.text();
    console.log('📥 응답 Body (Raw):', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ JSON 파싱 성공:', JSON.stringify(data).substring(0, 500));
    } catch (parseError) {
      console.error('❌ JSON 파싱 실패:', parseError);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
    }

    if (!response.ok || !data.success) {
      const errorDetail = data.detail ?? data.error ?? `HTTP ${response.status}`;
      console.error('❌ snagaclip.com 에러 응답:', {
        status: response.status,
        error: errorDetail,
        data: data,
      });
      throw new Error(`snagaclip error: ${errorDetail}`);
    }

    console.log('✅ snagaclip.com 요청 성공!');
    return data;
  } catch (error) {
    console.error('❌ snagaclip.com 요청 실패:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🎬 /api/download 요청 수신');
  console.log('═══════════════════════════════════════════════════════');

  try {
    const body: DownloadRequest = await request.json();
    const { url } = body;

    console.log('📥 요청 바디:', { url });

    if (!url || typeof url !== 'string') {
      console.error('❌ URL 검증 실패: 유효하지 않은 URL');
      return NextResponse.json(
        { success: false, error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
      console.log('✅ URL 형식 검증 통과');
    } catch {
      console.error('❌ URL 형식 검증 실패:', url);
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    let extractedData: any = null;

    try {
      console.log('🚀 snagaclip.com 백엔드 호출 시작...');
      extractedData = await fetchFromSnagaclip(url);
      console.log('✅ snagaclip.com 호출 성공, 데이터 수신됨');
    } catch (error) {
      console.error('❌ snagaclip.com 호출 실패:', error instanceof Error ? error.message : error);
      return NextResponse.json(
        {
          success: false,
          error: `Backend Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
        { status: 400 }
      );
    }

    if (!extractedData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to extract video data. Please try again.',
        },
        { status: 400 }
      );
    }

    // ✅ snagaclip.com 응답 기반 데이터 매핑 (acodec 기반 오디오 필터링)
    console.log('🎯 데이터 매핑 시작 (acodec 기반 오디오 필터링)...');

    let title = extractedData.title || 'Video';
    let thumbnail = extractedData.thumbnail || '';
    let duration = extractedData.duration || 0;

    const freeFormats: FormatData[] = [];
    const premiumFormats: FormatData[] = [];

    // ⭐ snagaclip.com 응답의 formats 배열 처리
    if (extractedData.formats && Array.isArray(extractedData.formats)) {
      console.log(`📦 formats 배열 발견: ${extractedData.formats.length}개 포맷`);

      extractedData.formats.forEach((format: any, idx: number) => {
        // 🔍 acodec 기반 오디오 검사 (yt-dlp의 표준 필드)
        // acodec !== 'none' = 오디오 포함
        // acodec === 'none' = 비디오 전용 (소리 없음)

        const quality = format.quality || `${format.height || 720}p`;
        const hasAudio = format.acodec && format.acodec !== 'none';
        const audioLabel = hasAudio ? '' : ' 🔇 (No Audio)';

        console.log(`[${idx}] acodec 검사:`, {
          quality: quality,
          acodec: format.acodec,
          vcodec: format.vcodec,
          hasAudio: hasAudio,
          url: format.url?.substring(0, 80) + '...',
        });

        if (format.url && typeof format.url === 'string') {
          const formatObj: FormatData = {
            resolution: quality + audioLabel,
            url: format.url,
            ext: format.ext || 'mp4',
            isPremium: !hasAudio, // 오디오 없음 = 비디오 전용 섹션
          };

          if (hasAudio) {
            console.log(`✅ 오디오 포함됨:`, quality);
            freeFormats.push(formatObj);
          } else {
            console.log(`⚠️ 비디오 전용 (오디오 없음):`, quality);
            premiumFormats.push(formatObj);
          }
        }
      });
    }

    // 검증
    console.log(`\n✅ 최종 결과: ${freeFormats.length}개의 다운로드 링크 추출됨`);

    if (freeFormats.length === 0 && premiumFormats.length === 0) {
      console.error('❌ 다운로드 가능한 미디어를 찾지 못했습니다.');
      return NextResponse.json(
        {
          success: false,
          error: 'No downloadable media formats found.',
        },
        { status: 400 }
      );
    }

    const responseData = {
      success: true,
      title,
      thumbnail,
      duration,
      formats: {
        free: freeFormats,
        premium: premiumFormats,
      },
    };

    console.log(`✅ 비디오 추출 완료:`, {
      title,
      freeFormatCount: freeFormats.length,
      premiumFormatCount: premiumFormats.length,
      hasThumbnail: !!thumbnail,
      sampleFreeUrl: freeFormats[0]?.url ? freeFormats[0].url.substring(0, 100) : '없음',
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('❌ Download API fatal error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to extract video information. Please try again.',
      },
      { status: 500 }
    );
  }
}
