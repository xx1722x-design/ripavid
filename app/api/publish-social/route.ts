import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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
  results?: Record<string, { success: boolean; status?: string; error?: string }>;
  message: string;
  error?: string;
}

// Webhook URL for local automation bot (n8n, Python server, etc.)
const WEBHOOK_URL = process.env.WEBHOOK_URL || '';
const WEBHOOK_TIMEOUT = 30000; // 30 seconds

// In-memory storage for publishing jobs
const publishingJobs = new Map<string, {
  status: 'processing' | 'success' | 'partial' | 'error';
  results?: Record<string, { success: boolean; status?: string; error?: string }>;
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

/**
 * Send Webhook to local automation bot (Playwright scripts or n8n)
 *
 * SETUP GUIDE:
 * ============
 *
 * Option A: n8n Webhook
 * 1. In n8n, create a new workflow with "Webhook" trigger
 * 2. Configure the Webhook: Set URL path like "/ripavid/publish"
 * 3. Full URL: https://your-n8n.com/webhook/ripavid/publish
 * 4. In your automation, receive the webhook and trigger your Python scripts:
 *    - YouTube: exec("python open_youtube.py {videoUrl} '{title}'")
 *    - TikTok: exec("python open_tiktok.py {videoUrl} '{title}'")
 *    - Instagram: exec("python open_instagram.py {videoUrl} '{title}'")
 *
 * Option B: Local Python Server
 * 1. Create a Flask/FastAPI server:
 *    ```python
 *    from fastapi import FastAPI
 *    import subprocess
 *
 *    app = FastAPI()
 *
 *    @app.post("/webhook/publish")
 *    async def handle_publish(data: dict):
 *        video_url = data.get("videoUrl")
 *        title = data.get("title")
 *        platforms = data.get("platforms", [])
 *
 *        for platform in platforms:
 *            script = f"open_{platform}.py"
 *            subprocess.run(["python", script, video_url, title])
 *
 *        return {"success": True}
 *    ```
 * 2. Run: uvicorn app:app --port 8000
 * 3. Set WEBHOOK_URL=http://localhost:8000/webhook/publish
 *
 * Option C: ngrok Tunnel (for local testing)
 * 1. Run ngrok: ngrok http 8000
 * 2. Copy HTTPS URL: https://xxxxx.ngrok.io
 * 3. Set WEBHOOK_URL=https://xxxxx.ngrok.io/webhook/publish
 */
async function sendWebhook(
  videoUrl: string,
  title: string,
  platforms: string[],
  description?: string
): Promise<{ success: boolean; status?: string; error?: string }> {
  try {
    if (!WEBHOOK_URL) {
      console.warn('[Webhook] WEBHOOK_URL not configured. Skipping webhook send.');
      return {
        success: false,
        status: 'webhook_not_configured',
        error: 'Webhook URL not configured in environment',
      };
    }

    console.log(`[Webhook] Sending to ${WEBHOOK_URL}...`);

    // Send webhook payload to local bot
    const response = await axios.post(
      WEBHOOK_URL,
      {
        videoUrl,
        title,
        description: description || '',
        platforms,
        timestamp: new Date().toISOString(),
        source: 'ripavid',
      },
      {
        timeout: WEBHOOK_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'X-RipAVid-Signature': 'v1',
        },
      }
    );

    console.log('[Webhook] Success:', response.data);

    return {
      success: true,
      status: 'webhook_sent',
    };
  } catch (error) {
    console.error('[Webhook] Error:', error);

    if (error instanceof axios.AxiosError) {
      return {
        success: false,
        status: 'webhook_failed',
        error: `Webhook failed: ${error.message} (${error.response?.status})`,
      };
    }

    return {
      success: false,
      status: 'webhook_error',
      error: `Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Main publishing orchestrator - sends single webhook to local bot
async function publishToAllPlatforms(
  videoUrl: string,
  title: string,
  platforms: ('youtube' | 'instagram' | 'tiktok' | 'xiaohongshu')[],
  description?: string,
  tags?: string[]
): Promise<Record<string, { success: boolean; status?: string; error?: string }>> {
  const results: Record<string, { success: boolean; status?: string; error?: string }> = {};

  // Send single webhook to local bot with all platform info
  const webhookResult = await sendWebhook(videoUrl, title, platforms, description);

  // If webhook succeeded, mark all selected platforms as "sent_to_bot"
  if (webhookResult.success) {
    for (const platform of platforms) {
      results[platform] = {
        success: true,
        status: 'sent_to_local_bot',
      };
      console.log(`[Publishing] ${platform}: Sent to local bot`);
    }
  } else {
    // If webhook failed, mark all platforms as failed
    for (const platform of platforms) {
      results[platform] = {
        success: false,
        status: webhookResult.status,
        error: webhookResult.error,
      };
      console.error(`[Publishing] ${platform}: ${webhookResult.error}`);
    }
  }

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
