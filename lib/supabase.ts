import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client (only if URL and key are configured)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Fallback to null if not configured

// Job history types
export interface JobHistory {
  id?: string;
  user_id: string;
  job_type: 'extract_subtitles' | 'translate_subtitles' | 'curate_highlights' | 'render_short';
  video_url: string;
  video_title: string;
  status: 'completed' | 'failed' | 'pending';
  data: {
    startTime?: string;
    endTime?: string;
    languages?: string[];
    highlights?: Array<{ startTime: string; endTime: string; viralScore: number; hookTitle: string }>;
    subtitles?: string;
    translatedLanguages?: string[];
    renderingId?: string;
    clipUrl?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Save job history to Supabase
export async function saveJobHistory(history: JobHistory): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Supabase] Client not configured. Skipping history save.');
      return { success: true }; // Don't fail if not configured
    }

    const { error } = await supabase.from('job_history').insert([
      {
        user_id: history.user_id,
        job_type: history.job_type,
        video_url: history.video_url,
        video_title: history.video_title,
        status: history.status,
        data: history.data,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('[Supabase] Error saving history:', error);
      return { success: false, error: error.message };
    }

    console.log('[Supabase] Job history saved successfully');
    return { success: true };
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get user's job history from Supabase
export async function getUserHistory(userId: string): Promise<{ data: JobHistory[]; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Supabase] Client not configured.');
      return { data: [] };
    }

    const { data, error } = await supabase
      .from('job_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[Supabase] Error fetching history:', error);
      return { data: [], error: error.message };
    }

    return { data: data || [] };
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Delete job history entry
export async function deleteHistoryEntry(entryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[Supabase] Client not configured.');
      return { success: true };
    }

    const { error } = await supabase.from('job_history').delete().eq('id', entryId);

    if (error) {
      console.error('[Supabase] Error deleting history:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get guest download count for today
export async function getGuestDownloadCount(ipAddress: string): Promise<{ count: number; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      console.warn('[Supabase] Client not configured. Skipping guest download check.');
      return { count: 0 }; // Allow if not configured
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await supabase
      .from('guest_downloads')
      .select('count')
      .eq('ip_address', ipAddress)
      .eq('download_date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('[Supabase] Error fetching guest download count:', error);
      return { count: 0, error: error.message };
    }

    return { count: data?.count || 0 };
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { count: 0, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Increment guest download count
export async function incrementGuestDownloadCount(ipAddress: string): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      console.warn('[Supabase] Client not configured. Skipping download increment.');
      return { success: true, count: 0 }; // Don't fail if not configured
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // First, try to get existing record
    const { data: existingData, error: selectError } = await supabase
      .from('guest_downloads')
      .select('count')
      .eq('ip_address', ipAddress)
      .eq('download_date', today)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('[Supabase] Error fetching download count:', selectError);
      return { success: false, error: selectError.message };
    }

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('guest_downloads')
        .update({ count: existingData.count + 1 })
        .eq('ip_address', ipAddress)
        .eq('download_date', today)
        .select('count')
        .single();

      if (error) {
        console.error('[Supabase] Error updating download count:', error);
        return { success: false, error: error.message };
      }

      return { success: true, count: data?.count || 0 };
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('guest_downloads')
        .insert([{ ip_address: ipAddress, download_date: today, count: 1 }])
        .select('count')
        .single();

      if (error) {
        console.error('[Supabase] Error inserting download count:', error);
        return { success: false, error: error.message };
      }

      return { success: true, count: data?.count || 1 };
    }
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Supabase table schema (for reference, create manually in Supabase)
export const SCHEMA_SQL = `
-- Users table (if not using Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  tier VARCHAR DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Job history table
CREATE TABLE IF NOT EXISTS job_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_type VARCHAR NOT NULL,
  video_url TEXT,
  video_title TEXT,
  status VARCHAR DEFAULT 'completed',
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Guest downloads tracking table (for daily 3-download limit)
CREATE TABLE IF NOT EXISTS guest_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address VARCHAR NOT NULL,
  download_date DATE NOT NULL,
  count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(ip_address, download_date)
);

-- Create indexes for faster queries
CREATE INDEX idx_job_history_user_id ON job_history(user_id);
CREATE INDEX idx_job_history_created_at ON job_history(created_at);
CREATE INDEX idx_guest_downloads_ip ON guest_downloads(ip_address);
CREATE INDEX idx_guest_downloads_date ON guest_downloads(download_date);
`;
