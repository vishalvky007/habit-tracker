import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Expo passes extra config via app.json → Constants.expoConfig.extra
const supabaseUrl =
  (Constants.expoConfig?.extra?.supabaseUrl as string) ??
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  '';
const supabaseAnonKey =
  (Constants.expoConfig?.extra?.supabaseAnonKey as string) ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  '';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase anon key length:', supabaseAnonKey?.length);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
