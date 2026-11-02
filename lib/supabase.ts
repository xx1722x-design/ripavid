import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Credit Package Structure (Golden Ratio Pricing)
export const CREDIT_PACKAGES = [
  { id: 'starter', label: 'Starter', credits: 500, price: 4.99, pricePerCredit: 0.01 },
  { id: 'popular', label: 'Popular', credits: 1100, price: 9.99, pricePerCredit: 0.0091 },
  { id: 'best_value', label: 'Best Value', credits: 2500, price: 19.99, pricePerCredit: 0.008 }
];

// Credit Burn Rates (Credits required per feature)
export const CREDIT_BURN_RATES = {
  download_720p: 10,      // Standard quality
  download_1080p: 10,     // Full HD
  download_2k: 10,        // 2K
  download_4k: 20,        // Ultra HD (2x cost)
  subtitle_extraction: 50, // AI 자막 추출
  translation: 30,        // 다국어 번역
  total_ai_features: 80   // 자막 + 번역
};

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

// Credit system functions for hybrid monetization
export async function getUserCredits(userId: string): Promise<{ credits: number; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      console.warn('[Supabase] Client not configured. Returning default credits.');
      return { credits: 0 };
    }

    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[Supabase] Error fetching credits:', error);
      return { credits: 0, error: error.message };
    }

    return { credits: data?.credits || 0 };
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { credits: 0, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deductUserCredits(userId: string, amount: number, reason: string): Promise<{ success: boolean; remainingCredits?: number; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      console.warn('[Supabase] Client not configured. Skipping credit deduction.');
      return { success: true, remainingCredits: 999999 };
    }

    const { data: currentData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('[Supabase] Error fetching current credits:', fetchError);
      return { success: false, error: fetchError.message };
    }

    const currentCredits = currentData?.credits || 0;
    if (currentCredits < amount) {
      return { success: false, error: 'Insufficient credits', remainingCredits: currentCredits };
    }

    const newCredits = currentCredits - amount;

    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (updateError) {
      console.error('[Supabase] Error deducting credits:', updateError);
      return { success: false, error: updateError.message };
    }

    await supabase
      .from('credit_transactions')
      .insert([{
        user_id: userId,
        amount: -amount,
        reason: reason,
        created_at: new Date().toISOString()
      }]);

    return { success: true, remainingCredits: newCredits };
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function addUserCredits(userId: string, amount: number, reason: string): Promise<{ success: boolean; newCredits?: number; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      console.warn('[Supabase] Client not configured. Skipping credit addition.');
      return { success: true, newCredits: 999999 };
    }

    const { data: currentData, error: fetchError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('[Supabase] Error fetching current credits:', fetchError);
      return { success: false, error: fetchError.message };
    }

    const currentCredits = currentData?.credits || 0;
    const newCredits = currentCredits + amount;

    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (updateError) {
      console.error('[Supabase] Error adding credits:', updateError);
      return { success: false, error: updateError.message };
    }

    await supabase
      .from('credit_transactions')
      .insert([{
        user_id: userId,
        amount: amount,
        reason: reason,
        created_at: new Date().toISOString()
      }]);

    return { success: true, newCredits };
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getGuestCredits(ipAddress: string): Promise<{ credits: number; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      return { credits: 10 };
    }

    const { data, error } = await supabase
      .from('guest_credits')
      .select('credits')
      .eq('ip_address', ipAddress)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[Supabase] Error fetching guest credits:', error);
      return { credits: 10, error: error.message };
    }

    return { credits: data?.credits || 10 };
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { credits: 10 };
  }
}

export async function deductGuestCredits(ipAddress: string, amount: number): Promise<{ success: boolean; remainingCredits?: number; error?: string }> {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabase) {
      return { success: true, remainingCredits: 10 };
    }

    const { data: existingData, error: selectError } = await supabase
      .from('guest_credits')
      .select('credits')
      .eq('ip_address', ipAddress)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('[Supabase] Error fetching guest credits:', selectError);
      return { success: false, error: selectError.message };
    }

    const currentCredits = existingData?.credits || 10;
    if (currentCredits < amount) {
      return { success: false, error: 'Insufficient credits', remainingCredits: currentCredits };
    }

    const newCredits = currentCredits - amount;

    if (existingData) {
      const { error: updateError } = await supabase
        .from('guest_credits')
        .update({ credits: newCredits, last_used_at: new Date().toISOString() })
        .eq('ip_address', ipAddress);

      if (updateError) {
        console.error('[Supabase] Error deducting guest credits:', updateError);
        return { success: false, error: updateError.message };
      }
    } else {
      const { error: insertError } = await supabase
        .from('guest_credits')
        .insert([{
          ip_address: ipAddress,
          credits: newCredits,
          created_at: new Date().toISOString(),
          last_used_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('[Supabase] Error inserting guest credits:', insertError);
        return { success: false, error: insertError.message };
      }
    }

    return { success: true, remainingCredits: newCredits };
  } catch (error) {
    console.error('[Supabase] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Supabase table schema (for reference, create manually in Supabase)
export const SCHEMA_SQL = `
-- Users table with credit system
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  tier VARCHAR DEFAULT 'free',
  credits INT DEFAULT 30,
  subscription_tier VARCHAR DEFAULT 'free',
  subscription_end_date TIMESTAMP,
  credits_last_refilled TIMESTAMP,
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

-- Credit transactions table (for audit log)
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Guest credits table (for non-authenticated users)
CREATE TABLE IF NOT EXISTS guest_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address VARCHAR NOT NULL UNIQUE,
  credits INT DEFAULT 10,
  used_credits INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_job_history_user_id ON job_history(user_id);
CREATE INDEX idx_job_history_created_at ON job_history(created_at);
CREATE INDEX idx_guest_downloads_ip ON guest_downloads(ip_address);
CREATE INDEX idx_guest_downloads_date ON guest_downloads(download_date);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_guest_credits_ip ON guest_credits(ip_address);
`;
