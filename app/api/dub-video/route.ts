import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

const execAsync = promisify(exec);

interface DubRequest {
  videoUrl: string;
  text: string;
  targetLanguage: string;
  voiceId: string;
  videoTitle?: string;
  includeSubtitles?: boolean;
  subtitleText?: string;
}

interface DubResponse {
  success: boolean;
  processingId?: string;
  downloadUrl?: string;
  message: string;
  error?: string;
}

// Set FFmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

// ElevenLabs TTS voices (mapping language to voice options)
const ELEVENLABS_VOICES: Record<string, { id: string; name: string }[]> = {
  'en': [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Default)' },
  ],
  'es': [
    { id: '9PqLzQJE9B8i6j6P9R5G', name: 'Diego' },
  ],
  'fr': [
    { id: 'VR6AewLTigWG4xSOuZ2b', name: 'Sophia' },
  ],
  'de': [
    { id: 'MF3mGyEYCHltNXP5OPLn', name: 'Klaus' },
  ],
  'it': [
    { id: 'pFZP5JQG7iQjIQuC4Hyc', name: 'Marco' },
  ],
  'pt': [
    { id: 'Y5dL2VBD6WL0dRVx8w8W', name: 'Carlos' },
  ],
  'ja': [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Aiko' },
  ],
  'ko': [
    { id: 'b7d50908-b456-4d3b-9b5d-f1d2a5c4e7f9', name: 'Sung' },
  ],
  'zh-CN': [
    { id: 'c24dd89a-1c0d-4a60-a7c9-f8e1b3c5a9d2', name: 'Liang' },
  ],
  'zh-TW': [
    { id: 'e7f2a1c3-b8d6-4e5a-c1b2-f3a4e5c6d7e8', name: 'Wei' },
  ],
};

// In-memory storage for dubbing jobs
const dubbingJobs = new Map<string, {
  status: 'processing' | 'success' | 'error';
  filePath?: string;
  fileSize?: number;
  error?: string;
  createdAt: number;
}>();

// Clean up old jobs and files every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of dubbingJobs.entries()) {
    if (now - job.createdAt > 10 * 60 * 1000) { // 10 minutes
      if (job.filePath && fs.existsSync(/*@turbopack-ignore*/ job.filePath)) {
        try {
          fs.unlinkSync(/*@turbopack-ignore*/ job.filePath);
          console.log(`[Dubbing Cleanup] Deleted file: ${job.filePath}`);
        } catch (err) {
          console.error(`[Dubbing Cleanup] Failed to delete ${job.filePath}:`, err);
        }
      }
      dubbingJobs.delete(id);
    }
  }
}, 5 * 60 * 1000);

// Generate TTS audio using ElevenLabs
async function generateTTSAudio(text: string, voiceId: string): Promise<string> {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY environment variable is not set');
    }

    const tmpDir = '/tmp';
    const audioFileName = `audio_${Date.now()}.mp3`;
    const audioPath = path.join(tmpDir, audioFileName);

    console.log(`[Dubbing] Generating TTS audio for voice: ${voiceId}`);

    // Call ElevenLabs API to generate speech
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 60000,
      }
    );

    // Save audio file
    fs.writeFileSync(audioPath, response.data);
    console.log(`[Dubbing] TTS audio generated: ${audioPath}`);

    return audioPath;
  } catch (error) {
    console.error('[Dubbing] TTS error:', error);
    throw new Error(`Failed to generate TTS audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Download video to temporary file
async function downloadVideo(videoUrl: string): Promise<string> {
  try {
    const tmpDir = '/tmp';
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const fileName = `video_${Date.now()}.mp4`;
    const filePath = path.join(tmpDir, fileName);

    console.log(`[Dubbing] Downloading video from: ${videoUrl}`);

    const response = await axios.get(videoUrl, {
      responseType: 'stream',
      timeout: 30000,
    });

    const writer = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);

      writer.on('finish', () => {
        console.log(`[Dubbing] Video downloaded to: ${filePath}`);
        resolve(filePath);
      });

      writer.on('error', (err) => {
        console.error('[Dubbing] Download error:', err);
        reject(new Error('Failed to download video'));
      });
    });
  } catch (error) {
    console.error('[Dubbing] Download error:', error);
    throw new Error('Failed to download video');
  }
}

// Dub video with AI voice and optional subtitles
async function dubVideo(
  videoPath: string,
  audioPath: string,
  title?: string,
  subtitleText?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const tmpDir = '/tmp';
      const outputFileName = `dubbed_${Date.now()}.mp4`;
      const outputPath = path.join(tmpDir, outputFileName);

      console.log(`[Dubbing] Starting dubbing process: ${videoPath} + ${audioPath}`);

      // FFmpeg chain: scale to 1080x1920, replace audio, add subtitle text
      let command = ffmpeg(videoPath)
        .input(audioPath)
        .videoFilter([
          {
            filter: 'scale',
            options: {
              w: 1080,
              h: 1920,
              force_original_aspect_ratio: 'decrease',
            },
          },
          {
            filter: 'pad',
            options: {
              w: 1080,
              h: 1920,
              x: '(ow-iw)/2',
              y: '(oh-ih)/2',
              color: 'black',
            },
          },
          // Optional subtitle burnin (drawtext filter)
          ...(subtitleText ? [{
            filter: 'drawtext',
            options: {
              textfile: '/tmp/subtitle_text.txt',
              fontfile: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
              fontsize: 24,
              fontcolor: 'white',
              x: '(w-text_w)/2',
              y: 'h-50',
              bordercolor: 'black',
              borderw: 2,
            },
          }] : []),
        ])
        .audioCodec('aac')
        .audioChannels(2)
        .audioBitrate('192k')
        .audioFrequency(48000)
        .videoCodec('libx264')
        .videoBitrate('5000k')
        .size('1080x1920')
        .outputOptions([
          '-preset fast',
          '-crf 28',
          '-c:a aac',
          '-b:a 192k',
          '-movflags +faststart',
        ])
        .on('end', () => {
          console.log(`[Dubbing] Video dubbed successfully: ${outputPath}`);
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('[Dubbing] FFmpeg error:', err);
          reject(new Error(`FFmpeg dubbing failed: ${err.message}`));
        })
        .save(outputPath);
    } catch (error) {
      console.error('[Dubbing] Processing error:', error);
      reject(new Error('Video dubbing failed'));
    }
  });
}

export async function POST(request: NextRequest): Promise<NextResponse<DubResponse>> {
  try {
    const body: DubRequest = await request.json();
    const { videoUrl, text, targetLanguage, voiceId, videoTitle, includeSubtitles, subtitleText } = body;

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

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid text provided.',
          error: 'Text or subtitle content is required',
        },
        { status: 400 }
      );
    }

    if (!voiceId || typeof voiceId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid voice ID provided.',
          error: 'Voice ID is required',
        },
        { status: 400 }
      );
    }

    // Generate unique processing ID
    const processingId = `dub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize processing job
    dubbingJobs.set(processingId, {
      status: 'processing',
      createdAt: Date.now(),
    });

    // Start async dubbing process
    (async () => {
      try {
        console.log(`[Dubbing] Starting job: ${processingId}`);

        // Step 1: Download video
        let videoPath: string;
        try {
          videoPath = await downloadVideo(videoUrl);
        } catch (error) {
          throw new Error(`Failed to download video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Step 2: Generate TTS audio
        let audioPath: string;
        try {
          audioPath = await generateTTSAudio(text, voiceId);
        } catch (error) {
          throw new Error(`Failed to generate TTS: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Step 3: Dub video with audio
        let outputPath: string;
        try {
          outputPath = await dubVideo(videoPath, audioPath, videoTitle, includeSubtitles ? subtitleText : undefined);
        } finally {
          // Clean up temporary files
          if (fs.existsSync(/*@turbopack-ignore*/ videoPath)) {
            try {
              fs.unlinkSync(/*@turbopack-ignore*/ videoPath);
            } catch (err) {
              console.error('[Dubbing] Cleanup error:', err);
            }
          }
          if (fs.existsSync(/*@turbopack-ignore*/ audioPath)) {
            try {
              fs.unlinkSync(/*@turbopack-ignore*/ audioPath);
            } catch (err) {
              console.error('[Dubbing] Cleanup error:', err);
            }
          }
        }

        // Get file size
        const stats = fs.statSync(/*@turbopack-ignore*/ outputPath);
        const fileSizeGB = stats.size / (1024 * 1024 * 1024);

        dubbingJobs.set(processingId, {
          status: 'success',
          filePath: outputPath,
          fileSize: stats.size,
          createdAt: Date.now(),
        });

        console.log(`[Dubbing Success] Job: ${processingId}, File: ${outputPath}, Size: ${fileSizeGB.toFixed(2)}GB`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        dubbingJobs.set(processingId, {
          status: 'error',
          error: errorMessage,
          createdAt: Date.now(),
        });
        console.error(`[Dubbing Error] Job: ${processingId}`, error);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        processingId,
        message: 'AI dubbing process started. Generating voiceover and combining with video...',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('[Dubbing Route Error]', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during dubbing.';

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

// GET endpoint to check dubbing status and download file
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const processingId = searchParams.get('processingId');
    const action = searchParams.get('action');

    if (!processingId) {
      return NextResponse.json(
        {
          success: false,
          message: 'processingId parameter is required.',
        },
        { status: 400 }
      );
    }

    const job = dubbingJobs.get(processingId);

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dubbing job not found. It may have expired.',
        },
        { status: 404 }
      );
    }

    if (job.status === 'processing') {
      return NextResponse.json(
        {
          success: false,
          message: 'Still processing your dubbed video. Please check again in a few seconds.',
          processingId,
        },
        { status: 202 }
      );
    }

    if (job.status === 'error') {
      return NextResponse.json(
        {
          success: false,
          message: job.error || 'Video dubbing failed.',
        },
        { status: 422 }
      );
    }

    if (job.status === 'success' && action === 'download' && job.filePath) {
      // Stream file download
      if (!fs.existsSync(/*@turbopack-ignore*/ job.filePath)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Dubbed file not found.',
          },
          { status: 404 }
        );
      }

      const fileBuffer = fs.readFileSync(/*@turbopack-ignore*/ job.filePath);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Disposition': `attachment; filename="dubbed-video-${processingId}.mp4"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      });
    }

    // Return status only
    return NextResponse.json(
      {
        success: true,
        message: 'Video dubbing completed successfully!',
        processingId,
        fileSize: job.fileSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Dubbing Status Check Error]', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check dubbing status.',
      },
      { status: 500 }
    );
  }
}

// Export voice mapping for frontend
export const VOICE_OPTIONS = ELEVENLABS_VOICES;
