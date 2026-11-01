import { NextRequest, NextResponse } from 'next/server';

interface PublishRequest {
  videoUrl: string;
  title: string;
  description?: string;
  tags?: string[];
  platforms: ('youtube' | 'instagram' | 'tiktok' | 'xiaohongshu')[];
}

interface PublishResponse {
  success: boolean;
  processingId?: string;
  results?: Record<string, { success: boolean; url?: string; error?: string }>;
  message: string;
  error?: string;
}

// Platform API token storage (in production, use secure vault)
const PLATFORM_TOKENS = {
  youtube: process.env.YOUTUBE_API_KEY || 'mock_token',
  instagram: process.env.INSTAGRAM_ACCESS_TOKEN || 'mock_token',
  tiktok: process.env.TIKTOK_API_KEY || 'mock_token',
  xiaohongshu: process.env.XIAOHONGSHU_API_KEY || 'mock_token',
};

// In-memory storage for publishing jobs
const publishingJobs = new Map<string, {
  status: 'processing' | 'success' | 'partial' | 'error';
  results?: Record<string, { success: boolean; url?: string; error?: string }>;
  error?: string;
  createdAt: number;
}>();

// Clean up old jobs every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of publishingJobs.entries()) {
    if (now - job.createdAt > 10 * 60 * 1000) {
      publishingJobs.delete(id);
    }
  }
}, 10 * 60 * 1000);

// YouTube Shorts upload (mock implementation)
async function publishToYouTube(videoUrl: string, title: string, description?: string, tags?: string[]): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    console.log('[YouTube] Publishing to YouTube Shorts...');

    // TODO: Replace with actual YouTube Data API v3 implementation
    // Current: Mock response for testing

    if (!PLATFORM_TOKENS.youtube || PLATFORM_TOKENS.youtube === 'mock_token') {
      console.warn('[YouTube] API token not configured. Using mock response.');
      return {
        success: true,
        url: `https://youtube.com/shorts/MOCK_${Date.now()}`,
      };
    }

    // Actual implementation would use:
    // const youtube = google.youtube({
    //   version: 'v3',
    //   auth: PLATFORM_TOKENS.youtube,
    // });
    // const response = await youtube.videos.insert({ ... });

    return {
      success: true,
      url: `https://youtube.com/shorts/PUBLISHED_${Date.now()}`,
    };
  } catch (error) {
    console.error('[YouTube] Publishing error:', error);
    return {
      success: false,
      error: `YouTube publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Instagram Reels upload (mock implementation)
async function publishToInstagram(videoUrl: string, title: string, description?: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    console.log('[Instagram] Publishing to Instagram Reels...');

    // TODO: Replace with actual Instagram Graph API implementation
    // Current: Mock response for testing

    if (!PLATFORM_TOKENS.instagram || PLATFORM_TOKENS.instagram === 'mock_token') {
      console.warn('[Instagram] API token not configured. Using mock response.');
      return {
        success: true,
        url: `https://instagram.com/reel/MOCK_${Date.now()}`,
      };
    }

    // Actual implementation would use:
    // const response = await fetch('https://graph.instagram.com/v18.0/{user-id}/media', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` },
    //   body: JSON.stringify({ ... })
    // });

    return {
      success: true,
      url: `https://instagram.com/reel/PUBLISHED_${Date.now()}`,
    };
  } catch (error) {
    console.error('[Instagram] Publishing error:', error);
    return {
      success: false,
      error: `Instagram publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// TikTok upload (mock implementation)
async function publishToTikTok(videoUrl: string, title: string, tags?: string[]): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    console.log('[TikTok] Publishing to TikTok...');

    // TODO: Replace with actual TikTok Open Platform API implementation
    // Current: Mock response for testing

    if (!PLATFORM_TOKENS.tiktok || PLATFORM_TOKENS.tiktok === 'mock_token') {
      console.warn('[TikTok] API token not configured. Using mock response.');
      return {
        success: true,
        url: `https://tiktok.com/@ripavid/video/MOCK_${Date.now()}`,
      };
    }

    // Actual implementation would use:
    // const response = await fetch('https://open.tiktokapis.com/v1/post/publish/video/init/', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` },
    //   body: JSON.stringify({ ... })
    // });

    return {
      success: true,
      url: `https://tiktok.com/@ripavid/video/PUBLISHED_${Date.now()}`,
    };
  } catch (error) {
    console.error('[TikTok] Publishing error:', error);
    return {
      success: false,
      error: `TikTok publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Xiaohongshu (Little Red Book) upload (mock implementation)
async function publishToXiaohongshu(videoUrl: string, title: string, description?: string, tags?: string[]): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    console.log('[Xiaohongshu] Publishing to Xiaohongshu...');

    // TODO: Replace with actual Xiaohongshu Creator API implementation
    // Current: Mock response for testing
    // Reference: https://creator.xiaohongshu.com/openapi/docs

    if (!PLATFORM_TOKENS.xiaohongshu || PLATFORM_TOKENS.xiaohongshu === 'mock_token') {
      console.warn('[Xiaohongshu] API token not configured. Using mock response.');
      return {
        success: true,
        url: `https://xiaohongshu.com/discovery/item/MOCK_${Date.now()}`,
      };
    }

    // Actual implementation would use:
    // const response = await fetch('https://openapi.xiaohongshu.com/openapi/sns_v10/feed', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${token}` },
    //   body: JSON.stringify({
    //     feed: { title, desc: description, hashtags: tags }
    //   })
    // });

    return {
      success: true,
      url: `https://xiaohongshu.com/discovery/item/PUBLISHED_${Date.now()}`,
    };
  } catch (error) {
    console.error('[Xiaohongshu] Publishing error:', error);
    return {
      success: false,
      error: `Xiaohongshu publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Main publishing orchestrator
async function publishToAllPlatforms(
  videoUrl: string,
  title: string,
  platforms: ('youtube' | 'instagram' | 'tiktok' | 'xiaohongshu')[],
  description?: string,
  tags?: string[]
): Promise<Record<string, { success: boolean; url?: string; error?: string }>> {
  const results: Record<string, { success: boolean; url?: string; error?: string }> = {};

  // Publish to each selected platform in parallel
  const platformPromises = platforms.map(async (platform) => {
    try {
      let result;

      switch (platform) {
        case 'youtube':
          result = await publishToYouTube(videoUrl, title, description, tags);
          break;
        case 'instagram':
          result = await publishToInstagram(videoUrl, title, description);
          break;
        case 'tiktok':
          result = await publishToTikTok(videoUrl, title, tags);
          break;
        case 'xiaohongshu':
          result = await publishToXiaohongshu(videoUrl, title, description, tags);
          break;
        default:
          result = { success: false, error: `Unknown platform: ${platform}` };
      }

      results[platform] = result;
      console.log(`[Publishing] ${platform}:`, result.success ? 'SUCCESS' : `FAILED - ${result.error}`);
    } catch (error) {
      results[platform] = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      console.error(`[Publishing] ${platform} error:`, error);
    }
  });

  await Promise.all(platformPromises);
  return results;
}

export async function POST(request: NextRequest): Promise<NextResponse<PublishResponse>> {
  try {
    const body: PublishRequest = await request.json();
    const { videoUrl, title, description, tags, platforms } = body;

    // Validate input
    if (!videoUrl || typeof videoUrl !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid video URL provided.',
          error: 'Video URL is required',
        },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid title provided.',
          error: 'Title is required',
        },
        { status: 400 }
      );
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No platforms selected.',
          error: 'At least one platform must be selected',
        },
        { status: 400 }
      );
    }

    // Validate platform names
    const validPlatforms = ['youtube', 'instagram', 'tiktok', 'xiaohongshu'];
    const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid platforms: ${invalidPlatforms.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generate unique processing ID
    const processingId = `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize processing job
    publishingJobs.set(processingId, {
      status: 'processing',
      createdAt: Date.now(),
    });

    // Start async publishing process
    (async () => {
      try {
        console.log(`[Publishing] Starting job: ${processingId}, Platforms: ${platforms.join(', ')}`);

        // Publish to all platforms in parallel
        const results = await publishToAllPlatforms(
          videoUrl,
          title,
          platforms as ('youtube' | 'instagram' | 'tiktok' | 'xiaohongshu')[],
          description,
          tags
        );

        // Check if all succeeded
        const allSucceeded = Object.values(results).every(r => r.success);
        const anySucceeded = Object.values(results).some(r => r.success);

        publishingJobs.set(processingId, {
          status: allSucceeded ? 'success' : anySucceeded ? 'partial' : 'error',
          results,
          createdAt: Date.now(),
        });

        console.log(`[Publishing Success] Job: ${processingId}, Status: ${allSucceeded ? 'SUCCESS' : 'PARTIAL'}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        publishingJobs.set(processingId, {
          status: 'error',
          error: errorMessage,
          createdAt: Date.now(),
        });
        console.error(`[Publishing Error] Job: ${processingId}`, error);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        processingId,
        message: `Publishing to ${platforms.length} platform(s)...`,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('[Publishing Route Error]', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during publishing.';

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check publishing status
export async function GET(request: NextRequest): Promise<NextResponse<PublishResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const processingId = searchParams.get('processingId');

    if (!processingId) {
      return NextResponse.json(
        {
          success: false,
          message: 'processingId parameter is required.',
        },
        { status: 400 }
      );
    }

    const job = publishingJobs.get(processingId);

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          message: 'Publishing job not found. It may have expired.',
        },
        { status: 404 }
      );
    }

    if (job.status === 'processing') {
      return NextResponse.json(
        {
          success: false,
          message: 'Still publishing to social media. Please check again in a few seconds.',
          processingId,
        },
        { status: 202 }
      );
    }

    if (job.status === 'error') {
      return NextResponse.json(
        {
          success: false,
          message: job.error || 'Publishing failed.',
        },
        { status: 422 }
      );
    }

    // Success or partial success
    return NextResponse.json(
      {
        success: job.status === 'success',
        message: job.status === 'success' ? 'Published to all platforms successfully!' : 'Published to some platforms (see details)',
        processingId,
        results: job.results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Publishing Status Check Error]', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check publishing status.',
      },
      { status: 500 }
    );
  }
}
