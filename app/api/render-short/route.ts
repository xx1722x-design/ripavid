import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

const execAsync = promisify(exec);
const unlinkAsync = promisify(fs.unlink);
const existsAsync = promisify(fs.exists);

interface RenderRequest {
  videoUrl: string;
  startTime: string;
  endTime: string;
  videoTitle?: string;
}

interface RenderResponse {
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

// Time parsing helper
function timeToSeconds(timeStr: string): number {
  const parts = timeStr.replace(',', '.').split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseFloat(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
}

// In-memory storage for rendering jobs
const renderingJobs = new Map<string, {
  status: 'processing' | 'success' | 'error';
  filePath?: string;
  fileSize?: number;
  error?: string;
  createdAt: number;
}>();

// Clean up old jobs and files every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of renderingJobs.entries()) {
    if (now - job.createdAt > 5 * 60 * 1000) {
      // Clean up file if exists
      if (job.filePath && fs.existsSync(job.filePath)) {
        try {
          fs.unlinkSync(job.filePath);
          console.log(`[Cleanup] Deleted file: ${job.filePath}`);
        } catch (err) {
          console.error(`[Cleanup] Failed to delete ${job.filePath}:`, err);
        }
      }
      renderingJobs.delete(id);
    }
  }
}, 5 * 60 * 1000);

// Download video to temporary file
async function downloadVideo(videoUrl: string): Promise<string> {
  try {
    const tmpDir = '/tmp';
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const fileName = `video_${Date.now()}.mp4`;
    const filePath = path.join(tmpDir, fileName);

    console.log(`[Render] Downloading video from: ${videoUrl}`);

    const response = await axios.get(videoUrl, {
      responseType: 'stream',
      timeout: 30000,
    });

    const writer = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);

      writer.on('finish', () => {
        console.log(`[Render] Video downloaded to: ${filePath}`);
        resolve(filePath);
      });

      writer.on('error', (err) => {
        console.error('[Render] Download error:', err);
        reject(new Error('Failed to download video'));
      });

      response.data.on('error', (err: Error) => {
        console.error('[Render] Stream error:', err);
        reject(new Error('Stream error while downloading video'));
      });
    });
  } catch (error) {
    console.error('[Render] Download error:', error);
    throw new Error('Failed to download video');
  }
}

// Render short video (9:16 vertical format)
async function renderShortVideo(
  videoPath: string,
  startTime: string,
  endTime: string,
  title?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const tmpDir = '/tmp';
      const outputFileName = `short_${Date.now()}.mp4`;
      const outputPath = path.join(tmpDir, outputFileName);

      const startSeconds = timeToSeconds(startTime);
      const endSeconds = timeToSeconds(endTime);
      const duration = endSeconds - startSeconds;

      console.log(`[Render] Starting FFmpeg processing: ${startTime} - ${endTime} (${duration}s)`);

      ffmpeg(videoPath)
        .setStartTime(startSeconds)
        .setDuration(duration)
        // Scale to 1080x1920 (9:16 aspect ratio)
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
        ])
        .outputOptions([
          '-c:v libx264',
          '-preset fast',
          '-crf 28',
          '-c:a aac',
          '-b:a 128k',
          '-movflags +faststart',
        ])
        .on('end', () => {
          console.log(`[Render] Video rendered successfully: ${outputPath}`);
          resolve(outputPath);
        })
        .on('error', (err: Error) => {
          console.error('[Render] FFmpeg error:', err);
          reject(new Error(`FFmpeg rendering failed: ${err.message}`));
        })
        .save(outputPath);
    } catch (error) {
      console.error('[Render] Processing error:', error);
      reject(new Error('Video rendering failed'));
    }
  });
}

export async function POST(request: NextRequest): Promise<NextResponse<RenderResponse>> {
  try {
    const body: RenderRequest = await request.json();
    const { videoUrl, startTime, endTime, videoTitle } = body;

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

    if (!startTime || !endTime) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid timestamps provided.',
          error: 'Both startTime and endTime are required',
        },
        { status: 400 }
      );
    }

    // Generate unique processing ID
    const processingId = `render_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize processing job
    renderingJobs.set(processingId, {
      status: 'processing',
      createdAt: Date.now(),
    });

    // Start async video rendering
    (async () => {
      try {
        console.log(`[Render] Starting job: ${processingId}`);

        // Download video
        let videoPath: string;
        try {
          videoPath = await downloadVideo(videoUrl);
        } catch (error) {
          throw new Error(`Failed to download video: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Render short video
        let outputPath: string;
        try {
          outputPath = await renderShortVideo(videoPath, startTime, endTime, videoTitle);
        } finally {
          // Clean up downloaded video
          if (fs.existsSync(/*@turbopack-ignore*/ videoPath)) {
            try {
              fs.unlinkSync(/*@turbopack-ignore*/ videoPath);
              console.log(`[Render] Cleaned up source video: ${videoPath}`);
            } catch (err) {
              console.error(`[Render] Failed to clean up source: ${videoPath}`, err);
            }
          }
        }

        // Get file size
        const stats = fs.statSync(outputPath);
        const fileSizeGB = stats.size / (1024 * 1024 * 1024);

        renderingJobs.set(processingId, {
          status: 'success',
          filePath: outputPath,
          fileSize: stats.size,
          createdAt: Date.now(),
        });

        console.log(`[Render Success] Job: ${processingId}, File: ${outputPath}, Size: ${fileSizeGB.toFixed(2)}GB`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        renderingJobs.set(processingId, {
          status: 'error',
          error: errorMessage,
          createdAt: Date.now(),
        });
        console.error(`[Render Error] Job: ${processingId}`, error);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        processingId,
        message: 'Video rendering started. Processing your short-form clip...',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('[Render Route Error]', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during rendering.';

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

// GET endpoint to check rendering status and download file
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

    const job = renderingJobs.get(processingId);

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rendering job not found. It may have expired.',
        },
        { status: 404 }
      );
    }

    if (job.status === 'processing') {
      return NextResponse.json(
        {
          success: false,
          message: 'Still rendering your video. Please check again in a few seconds.',
          processingId,
        },
        { status: 202 }
      );
    }

    if (job.status === 'error') {
      return NextResponse.json(
        {
          success: false,
          message: job.error || 'Video rendering failed.',
        },
        { status: 422 }
      );
    }

    if (job.status === 'success' && action === 'download' && job.filePath) {
      // Stream file download
      if (!fs.existsSync(job.filePath)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Rendered file not found.',
          },
          { status: 404 }
        );
      }

      const fileBuffer = fs.readFileSync(job.filePath);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Disposition': `attachment; filename="viral-short-${processingId}.mp4"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      });
    }

    // Return status only (don't download yet)
    return NextResponse.json(
      {
        success: true,
        message: 'Video rendering completed successfully!',
        processingId,
        fileSize: job.fileSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Render Status Check Error]', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check rendering status.',
      },
      { status: 500 }
    );
  }
}
