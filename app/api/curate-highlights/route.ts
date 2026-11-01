import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface HighlightRequest {
  srtContent: string;
  videoTitle: string;
}

interface Highlight {
  startTime: string;
  endTime: string;
  viralScore: number;
  hookTitle: string;
  summary: string;
  durationSeconds: number;
}

interface CurateResponse {
  success: boolean;
  highlights?: Highlight[];
  error?: string;
}

// Parse SRT content to extract text and timestamps
function parseSRTContent(srtContent: string): Array<{
  startTime: string;
  endTime: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
}> {
  const subtitles: Array<{
    startTime: string;
    endTime: string;
    text: string;
    startSeconds: number;
    endSeconds: number;
  }> = [];

  const blocks = srtContent.split('\n\n').filter(block => block.trim());

  blocks.forEach(block => {
    const lines = block.trim().split('\n');
    if (lines.length >= 3) {
      const timecode = lines[1]; // HH:MM:SS,mmm --> HH:MM:SS,mmm
      const [startTimeStr, endTimeStr] = timecode.split(' --> ').map(t => t.trim());
      const text = lines.slice(2).join('\n').trim();

      // Convert time format to seconds for easier manipulation
      const startSeconds = timeToSeconds(startTimeStr);
      const endSeconds = timeToSeconds(endTimeStr);

      subtitles.push({
        startTime: startTimeStr,
        endTime: endTimeStr,
        text,
        startSeconds,
        endSeconds,
      });
    }
  });

  return subtitles;
}

// Convert HH:MM:SS,mmm to seconds
function timeToSeconds(timeStr: string): number {
  const parts = timeStr.replace(',', '.').split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseFloat(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
}

// Convert seconds back to HH:MM:SS format
function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

// Extract transcript from parsed subtitles
function extractTranscriptWithContext(
  subtitles: Array<{
    startTime: string;
    endTime: string;
    text: string;
    startSeconds: number;
    endSeconds: number;
  }>
): string {
  return subtitles.map(sub => `[${sub.startTime}] ${sub.text}`).join('\n');
}

// Use Gemini to curate viral highlights
async function curateHighlightsWithGemini(
  transcript: string,
  videoTitle: string
): Promise<Highlight[]> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert content creator and viral video curator. Analyze the following video transcript with timestamps and identify 3-5 short-form highlight clips (like TikTok, Instagram Reels, YouTube Shorts) that would go viral.

Video Title: ${videoTitle}

Transcript with timestamps:
${transcript}

Requirements:
1. Identify segments that are 15-90 seconds long (ideal for viral shorts)
2. Look for: emotional hooks, surprising revelations, entertainment value, educational insights, plot twists, humor
3. Each highlight must have a strong opening that hooks viewers in the first 2 seconds
4. Assign a viral score (0-10) based on engagement potential
5. Create a catchy hook title for each clip
6. Provide a brief summary of the clip

Return ONLY a JSON array with NO markdown formatting, NO code blocks, NO extra text. Format:
[
  {
    "startTime": "HH:MM:SS,mmm",
    "endTime": "HH:MM:SS,mmm",
    "viralScore": 8.5,
    "hookTitle": "Short engaging title for social media",
    "summary": "Brief description of what makes this viral-worthy"
  }
]

IMPORTANT: Return ONLY the JSON array, nothing else.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse the JSON response
    let highlights: Array<{
      startTime: string;
      endTime: string;
      viralScore: number;
      hookTitle: string;
      summary: string;
    }> = [];

    try {
      // Try direct JSON parsing first
      highlights = JSON.parse(responseText);
    } catch (e) {
      // If that fails, try to extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        highlights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse Gemini response as JSON');
      }
    }

    // Validate and enrich highlights
    const validatedHighlights: Highlight[] = highlights
      .filter(h => h.startTime && h.endTime && h.viralScore !== undefined && h.hookTitle && h.summary)
      .map(h => ({
        startTime: h.startTime,
        endTime: h.endTime,
        viralScore: Math.min(10, Math.max(0, h.viralScore)), // Clamp score 0-10
        hookTitle: h.hookTitle.substring(0, 100), // Limit title length
        summary: h.summary.substring(0, 300), // Limit summary length
        durationSeconds: Math.round(timeToSeconds(h.endTime) - timeToSeconds(h.startTime)),
      }))
      .sort((a, b) => b.viralScore - a.viralScore); // Sort by viral score desc

    return validatedHighlights;
  } catch (error) {
    console.error('[Gemini Curation Error]', error);
    throw new Error(`Failed to curate highlights using Gemini API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<CurateResponse>> {
  try {
    const body: HighlightRequest = await request.json();
    const { srtContent, videoTitle } = body;

    // Validate input
    if (!srtContent || typeof srtContent !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid SRT content provided.',
        },
        { status: 400 }
      );
    }

    if (!videoTitle || typeof videoTitle !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid video title provided.',
        },
        { status: 400 }
      );
    }

    if (srtContent.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'SRT content is empty.',
        },
        { status: 400 }
      );
    }

    // Parse SRT content
    console.log('[Highlight Curation] Parsing SRT content...');
    const subtitles = parseSRTContent(srtContent);

    if (subtitles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid subtitles found in SRT content.',
        },
        { status: 400 }
      );
    }

    console.log(`[Highlight Curation] Parsed ${subtitles.length} subtitle blocks`);

    // Extract transcript with timestamps
    const transcript = extractTranscriptWithContext(subtitles);

    // Curate highlights using Gemini
    console.log('[Highlight Curation] Sending transcript to Gemini for curation...');
    const highlights = await curateHighlightsWithGemini(transcript, videoTitle);

    console.log(`[Highlight Curation] Successfully curated ${highlights.length} highlights`);

    return NextResponse.json(
      {
        success: true,
        highlights,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Highlight Curation Route Error]', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during highlight curation.';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
