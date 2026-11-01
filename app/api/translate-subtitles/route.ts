import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface TranslateRequest {
  srtContent: string;
  sourceLanguage?: string;
  targetLanguages?: string[];
}

interface TranslatedSubtitle {
  language: string;
  languageName: string;
  srtContent: string;
}

interface TranslateResponse {
  status: 'processing' | 'success' | 'error';
  message: string;
  translatedSubtitles?: TranslatedSubtitle[];
  processingId?: string;
}

// Language mapping
const LANGUAGE_MAP: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'ja': '日本語 (Japanese)',
  'zh-CN': '简体中文 (Simplified Chinese)',
  'zh-TW': '繁體中文 (Traditional Chinese)',
  'fr': 'French',
  'de': 'German',
  'pt': 'Portuguese',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'id': 'Indonesian',
  'ms': 'Malay',
  'tl': 'Filipino',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'ru': 'Russian',
  'tr': 'Turkish',
  'nl': 'Dutch',
  'pl': 'Polish',
  'it': 'Italian',
  'ko': 'Korean',
};

const DEFAULT_LANGUAGES = Object.keys(LANGUAGE_MAP);

// Parse SRT and return structured data
function parseSRT(srtContent: string): Array<{ index: number; startTime: string; endTime: string; text: string }> {
  const subtitles: Array<{ index: number; startTime: string; endTime: string; text: string }> = [];
  const blocks = srtContent.split('\n\n').filter(block => block.trim());

  blocks.forEach(block => {
    const lines = block.trim().split('\n');
    if (lines.length >= 3) {
      const index = parseInt(lines[0]);
      const timecode = lines[1]; // HH:MM:SS,mmm --> HH:MM:SS,mmm
      const [startTime, endTime] = timecode.split(' --> ').map(t => t.trim());
      const text = lines.slice(2).join('\n');

      subtitles.push({
        index,
        startTime: startTime || '00:00:00,000',
        endTime: endTime || '00:00:01,000',
        text: text.trim(),
      });
    }
  });

  return subtitles;
}

// Convert structured subtitles back to SRT format
function subtitlesToSRT(subtitles: Array<{ index: number; startTime: string; endTime: string; text: string }>): string {
  return subtitles
    .map((sub, idx) => `${idx + 1}\n${sub.startTime} --> ${sub.endTime}\n${sub.text}`)
    .join('\n\n');
}

// Translate subtitle text using Gemini
async function translateSubtitleText(
  subtitleText: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const targetLangName = LANGUAGE_MAP[targetLanguage] || targetLanguage;
    const sourceLangName = LANGUAGE_MAP[sourceLanguage] || sourceLanguage;

    const prompt = `You are a professional subtitle translator. Translate the following subtitle text from ${sourceLangName} to ${targetLangName}.

Requirements:
1. Preserve original meaning and tone
2. Keep translations concise (suitable for subtitles)
3. Maintain natural pacing for speaking
4. Do NOT add any explanations or comments
5. Return ONLY the translated text

Original text:
${subtitleText}

Translated text in ${targetLangName}:`;

    const result = await model.generateContent(prompt);
    const translatedText = result.response.text().trim();

    return translatedText;
  } catch (error) {
    console.error(`[Translation Error] Source: ${sourceLanguage}, Target: ${targetLanguage}`, error);
    throw new Error(`Failed to translate to ${targetLanguage}`);
  }
}

// Main translation pipeline
async function translateSubtitles(
  srtContent: string,
  sourceLanguage: string = 'en',
  targetLanguages: string[] = DEFAULT_LANGUAGES
): Promise<TranslatedSubtitle[]> {
  try {
    console.log(`[Translation] Starting pipeline for ${targetLanguages.length} languages`);

    // Parse SRT
    const subtitles = parseSRT(srtContent);
    if (subtitles.length === 0) {
      throw new Error('No valid subtitles found in SRT content');
    }
    console.log(`[Translation] Parsed ${subtitles.length} subtitles`);

    const results: TranslatedSubtitle[] = [];

    // Translate to each target language
    for (const targetLang of targetLanguages) {
      if (targetLang === sourceLanguage) {
        // Skip source language
        results.push({
          language: targetLang,
          languageName: LANGUAGE_MAP[targetLang] || targetLang,
          srtContent,
        });
        continue;
      }

      try {
        console.log(`[Translation] Translating to ${targetLang}...`);

        // Translate all subtitles for this language
        const translatedSubtitles = await Promise.all(
          subtitles.map(async (sub) => {
            const translatedText = await translateSubtitleText(
              sub.text,
              sourceLanguage,
              targetLang
            );
            return {
              ...sub,
              text: translatedText,
            };
          })
        );

        // Convert back to SRT format
        const translatedSRT = subtitlesToSRT(translatedSubtitles);

        results.push({
          language: targetLang,
          languageName: LANGUAGE_MAP[targetLang] || targetLang,
          srtContent: translatedSRT,
        });

        console.log(`[Translation] Successfully translated to ${targetLang}`);
      } catch (error) {
        console.error(`[Translation] Failed for ${targetLang}:`, error);
        // Continue with other languages even if one fails
        results.push({
          language: targetLang,
          languageName: LANGUAGE_MAP[targetLang] || targetLang,
          srtContent: `Error translating to ${LANGUAGE_MAP[targetLang] || targetLang}`,
        });
      }
    }

    console.log(`[Translation] Completed translation to ${results.length} languages`);
    return results;
  } catch (error) {
    console.error('[Translation Pipeline Error]', error);
    throw error;
  }
}

// In-memory storage for translation jobs
const translationJobs = new Map<string, {
  status: 'processing' | 'success' | 'error';
  translatedSubtitles?: TranslatedSubtitle[];
  error?: string;
  createdAt: number;
}>();

// Clean up old jobs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of translationJobs.entries()) {
    if (now - job.createdAt > 5 * 60 * 1000) {
      translationJobs.delete(id);
    }
  }
}, 5 * 60 * 1000);

export async function POST(request: NextRequest): Promise<NextResponse<TranslateResponse>> {
  try {
    const body: TranslateRequest = await request.json();
    const { srtContent, sourceLanguage = 'en', targetLanguages = DEFAULT_LANGUAGES } = body;

    // Validate input
    if (!srtContent || typeof srtContent !== 'string') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid SRT content provided.',
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(targetLanguages) || targetLanguages.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid target languages provided.',
        },
        { status: 400 }
      );
    }

    // Generate unique processing ID
    const processingId = `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize processing job
    translationJobs.set(processingId, {
      status: 'processing',
      createdAt: Date.now(),
    });

    // Start async translation
    translateSubtitles(srtContent, sourceLanguage, targetLanguages)
      .then(translatedSubtitles => {
        translationJobs.set(processingId, {
          status: 'success',
          translatedSubtitles,
          createdAt: Date.now(),
        });
        console.log(`[Translation Success] Processing ID: ${processingId}, Languages: ${translatedSubtitles.length}`);
      })
      .catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        translationJobs.set(processingId, {
          status: 'error',
          error: errorMessage,
          createdAt: Date.now(),
        });
        console.error(`[Translation Failed] Processing ID: ${processingId}`, error);
      });

    // Return immediate response with processing ID
    return NextResponse.json(
      {
        status: 'processing',
        message: `Starting translation to ${targetLanguages.length} languages...`,
        processingId,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('[Translation Route Error]', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during translation.';

    return NextResponse.json(
      {
        status: 'error',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check translation status
export async function GET(request: NextRequest): Promise<NextResponse<TranslateResponse>> {
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
    const job = translationJobs.get(processingId);

    if (!job) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Translation job not found. It may have expired.',
        },
        { status: 404 }
      );
    }

    if (job.status === 'processing') {
      return NextResponse.json(
        {
          status: 'processing',
          message: 'Still translating subtitles. Please check again in a few seconds.',
          processingId,
        },
        { status: 202 }
      );
    }

    if (job.status === 'success') {
      return NextResponse.json(
        {
          status: 'success',
          message: 'Subtitles translated successfully!',
          translatedSubtitles: job.translatedSubtitles,
        },
        { status: 200 }
      );
    }

    if (job.status === 'error') {
      return NextResponse.json(
        {
          status: 'error',
          message: job.error || 'Translation failed.',
        },
        { status: 422 }
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
    console.error('[Translation Status Check Error]', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to check translation status.',
      },
      { status: 500 }
    );
  }
}
