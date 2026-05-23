import 'dotenv/config';

export default {
  // Added scheme for expo linking

  expo: {
    extra: {
      EXPO_ROUTER_IMPORT_MODE_ANDROID: 'lazy',
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },

    name: 'Habit Tracker',
    slug: 'habit-tracker',
    version: '0.1.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: ['**/*'],

    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.example.habittracker',
    },

    android: {
      package: 'com.example.habittracker',
    },

    web: {
      favicon: './app/src/assets/favicon.png',
    },
  },
};