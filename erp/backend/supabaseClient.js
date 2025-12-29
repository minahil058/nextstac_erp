import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Warn if keys are missing (critical for Vercel)
if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
