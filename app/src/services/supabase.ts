import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Expo passes extra config via app.json → Constants.expoConfig.extra
const supabaseUrl =
  (Constants.expoConfig?.extra?.supabaseUrl as string) ??
  process.env.SUPABASE_URL ??
  '';
const supabaseAnonKey =
  (Constants.expoConfig?.extra?.supabaseAnonKey as string) ??
  process.env.SUPABASE_ANON_KEY ??
  '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
