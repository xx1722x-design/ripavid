import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface SubtitleRequest {
  videoUrl: string;
  language?: string;
}

interface SubtitleResponse {
  status: 'processing' | 'success' | 'error';
  message: string;
  subtitleUrl?: string;
  srtContent?: string;
  processingId?: string;
}

// Extract YouTube video ID from various URL formats
function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Format: youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }

    // Format: youtu.be/VIDEO_ID
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }

    // Format: youtube.com/embed/VIDEO_ID
    const embedMatch = urlObj.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) {
      return embedMatch[1];
    }

    return null;
  } catch {
    return null;
  }
}

// Fetch transcript from YouTube
async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcript || transcript.length === 0) {
      throw new Error('No captions available for this video');
    }

    // Combine transcript entries into readable text with timestamps
    const fullText = transcript
      .map(entry => `[${entry.offset / 1000}s] ${entry.text}`)
      .join('\n');
    return fullText;
  } catch (error) {
    console.error('[YouTube Transcript Error]', error);
    if (error instanceof Error && error.message.includes('disabled')) {
      throw new Error('Captions are disabled for this video');
    }
    throw new Error('Failed to fetch transcript from YouTube');
  }
}

// Convert transcript to SRT format using Gemini
async function convertToSRTWithGemini(transcriptText: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert subtitle creator. Convert the following transcript into a professional SRT file format (SubRip format).

Requirements:
1. Create properly formatted SRT file with sequential numbering (1, 2, 3, etc.)
2. Each subtitle should span approximately 3-5 seconds
3. Use professional, clear English language
4. Ensure proper punctuation and grammar
5. Distribute text evenly across subtitle blocks
6. Format:
   - Number
   - Timestamp (HH:MM:SS,mmm --> HH:MM:SS,mmm)
   - Text (1-2 lines max)
   - Blank line

Transcript to convert:
${transcriptText}

Generate ONLY the SRT content, nothing else. No explanations or comments.`;

    const result = await model.generateContent(prompt);
    const srtContent = result.response.text();

    return srtContent;
  } catch (error) {
    console.error('[Gemini API Error]', error);
    throw new Error('Failed to generate SRT file using Gemini API');
  }
}

// Main extraction pipeline
async function extractSubtitlesWithGemini(videoUrl: string): Promise<string> {
  try {
    console.log(`[Subtitle Extraction] Starting pipeline for: ${videoUrl}`);

    // Step 1: Extract video ID from URL
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL format');
    }
    console.log(`[Subtitle Extraction] Extracted video ID: ${videoId}`);

    // Step 2: Fetch transcript from YouTube
    console.log('[Subtitle Extraction] Fetching transcript from YouTube...');
    const transcript = await fetchYouTubeTranscript(videoId);
    console.log(`[Subtitle Extraction] Transcript fetched successfully (${transcript.length} characters)`);

    // Step 3: Convert to SRT using Gemini
    console.log('[Subtitle Extraction] Converting transcript to SRT format with Gemini...');
    const srtContent = await convertToSRTWithGemini(transcript);
    console.log('[Subtitle Extraction] SRT generation complete');

    return srtContent;
  } catch (error) {
    console.error('[Subtitle Extraction Pipeline Error]', error);
    throw error;
  }
}

// In-memory storage for processing jobs (per-instance)
const processingJobs = new Map<string, {
  status: 'processing' | 'success' | 'error';
  srtContent?: string;
  error?: string;
  createdAt: number;
}>();

// Clean up old jobs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of processingJobs.entries()) {
    if (now - job.createdAt > 5 * 60 * 1000) {
      processingJobs.delete(id);
    }
  }
}, 5 * 60 * 1000);

export async function POST(request: NextRequest): Promise<NextResponse<SubtitleResponse>> {
  try {
    // Parse request body
    const body: SubtitleRequest = await request.json();
    const { videoUrl } = body;

    // Validate input
    if (!videoUrl || typeof videoUrl !== 'string') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid video URL provided.',
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(videoUrl);
    } catch {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid URL format.',
        },
        { status: 400 }
      );
    }

    // Generate unique processing ID
    const processingId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize processing job
    processingJobs.set(processingId, {
      status: 'processing',
      createdAt: Date.now(),
    });

    // Start async processing
    extractSubtitlesWithGemini(videoUrl)
      .then(srtContent => {
        processingJobs.set(processingId, {
          status: 'success',
          srtContent,
          createdAt: Date.now(),
        });
        console.log(`[Subtitle Extraction Success] Processing ID: ${processingId}`);
      })
      .catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        processingJobs.set(processingId, {
          status: 'error',
          error: errorMessage,
          createdAt: Date.now(),
        });
        console.error(`[Subtitle Extraction Failed] Processing ID: ${processingId}`, error);
      });

    // Return immediate response with processing ID
    return NextResponse.json(
      {
        status: 'processing',
        message: 'Subtitle extraction started. Processing your video...',
        processingId,
      },
      { status: 202 } // 202 Accepted
    );
  } catch (error) {
    console.error('[Subtitle Extraction Route Error]', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during subtitle extraction.';

    return NextResponse.json(
      {
        status: 'error',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check processing status
export async function GET(request: NextRequest): Promise<NextResponse<SubtitleResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const processingId = searchParams.get('processingId');

    if (!processingId) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'processingId parameter is required.',
        },
        { status: 400 }
      );
    }

    // Get job status from in-memory storage
    const job = processingJobs.get(processingId);

    if (!job) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Processing job not found. It may have expired.',
        },
        { status: 404 }
      );
    }

    if (job.status === 'processing') {
      return NextResponse.json(
        {
          status: 'processing',
          message: 'Still processing your video. Please check again in a few seconds.',
          processingId,
        },
        { status: 202 } // 202 Accepted - still processing
      );
    }

    if (job.status === 'success') {
      return NextResponse.json(
        {
          status: 'success',
          message: 'Subtitles extracted successfully!',
          srtContent: job.srtContent,
        },
        { status: 200 }
      );
    }

    if (job.status === 'error') {
      return NextResponse.json(
        {
          status: 'error',
          message: job.error || 'Subtitle extraction failed.',
        },
        { status: 422 } // 422 Unprocessable Entity - processing failed
      );
    }

    return NextResponse.json(
      {
        status: 'error',
        message: 'Unknown processing status.',
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('[Subtitle Status Check Error]', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to check processing status.',
      },
      { status: 500 }
    );
  }
}
